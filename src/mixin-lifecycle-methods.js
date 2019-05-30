"use strict";

const lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
const inSetupSymbol = Symbol.for("can.initializing");
const teardownHandlersSymbol = Symbol.for("can.teardownHandlers");
const methodWrappedSymbol = Symbol.for("can.methodWrapped");

function defineConfigurableNonEnumerable(obj, prop, value) {
	Object.defineProperty(obj, prop, {
		configurable: true,
		enumerable: false,
		writable: true,
		value: value
	});
}

function wrapPrototypeMethod(proto, methodName, after, before) {
	if (proto.hasOwnProperty(methodName)) {
		const origMethod = proto[methodName];

		if (origMethod[methodWrappedSymbol]) {
			// method is already wrapped, don't do it again
			return;
		}

		const wrappedMethod = function(...args) {
			if (before) {
				before.apply(this, ...args);
			}

			let origResult = origMethod.apply(this, ...args);

			if (after) {
				after.apply(this, ...args);
			}

			return origResult;
		};

		// make sure this method is only wrapped the first time
		// an instance is created
		wrappedMethod[methodWrappedSymbol] = true;
		proto[methodName] = wrappedMethod;
	}
}

module.exports = function mixinLifecycleMethods(BaseElement = HTMLElement) {
	return class LifecycleElement extends BaseElement {
		constructor() {
			super();
			if (arguments.length) {
				throw new Error("can-stache-define-element: Do not pass arguments to the constructor. Initial property values should be passed to the `initialize` hook.");
			}

			// add inSetup symbol to prevent events being dispatched
			defineConfigurableNonEnumerable(this, inSetupSymbol, true);

			// add lifecycle status symbol
			defineConfigurableNonEnumerable(this, lifecycleStatusSymbol, {
				initialized: false,
				rendered: false,
				connected: false,
				disconnected: false
			});

			// add a place to store additional teardownHandlers
			defineConfigurableNonEnumerable(this, teardownHandlersSymbol, []);

			// wrap `connect` and `disconnect` so user can implement them without having to call
			// `super.connect(...args)` in their implementation
			wrapPrototypeMethod(this.constructor.prototype, "connect", this._afterConnect, this._beforeConnect);
			wrapPrototypeMethod(this.constructor.prototype, "disconnect", this._afterDisconnect);
		}

		// custom element lifecycle methods
		connectedCallback(props) {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (!lifecycleStatus.initialized) {
				this.initialize(props);
			}

			if (!lifecycleStatus.rendered) {
				this.render();
			}

			if (!lifecycleStatus.connected) {
				let connectTeardown = this.connect();
				if (connectTeardown) {
					this[teardownHandlersSymbol].push(connectTeardown);
				}
			}
		}

		disconnectedCallback() {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (!lifecycleStatus.disconnected) {
				for (let handler of this[teardownHandlersSymbol]) {
					handler.call(this);
				}

				if (this.stopListening) {
					this.stopListening();
				}

				this.disconnect();
			}
		}

		// custom lifecycle methods
		initialize() {
			this[lifecycleStatusSymbol].initialized = true;
			this[inSetupSymbol] = false;
		}

		render(props) {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (!lifecycleStatus.initialized) {
				this.initialize(props);
			}

			lifecycleStatus.rendered = true;
		}

		connect(props) {
			this._beforeConnect(props);
			this._afterConnect();
		}

		_beforeConnect(props) {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (!lifecycleStatus.initialized) {
				this.initialize(props);
			}

			if (!lifecycleStatus.rendered) {
				this.render(props);
			}
		}

		_afterConnect() {
			const lifecycleStatus = this[lifecycleStatusSymbol];
			lifecycleStatus.connected = true;
		}

		disconnect() {
			this._afterDisconnect();
		}

		_afterDisconnect() {
			this[lifecycleStatusSymbol].disconnected = true;
		}
	};
};
