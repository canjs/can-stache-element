"use strict";

const lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
const inSetupSymbol = Symbol.for("can.initializing");
const teardownHandlersSymbol = Symbol.for("can.teardownHandlers");

function defineConfigurableNonEnumerable(obj, prop, value) {
	Object.defineProperty(obj, prop, {
		configurable: true,
		enumerable: false,
		writable: true,
		value: value
	});
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
		}

		// custom element lifecycle methods
		connectedCallback(props) {
			this.initialize(props);
			this.render();
			this.connect();
		}

		disconnectedCallback() {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.disconnected) {
				return;
			}

			for (let handler of this[teardownHandlersSymbol]) {
				handler.call(this);
			}

			if (this.stopListening) {
				this.stopListening();
			}

			this.disconnect();
		}

		// custom lifecycle methods
		initialize(props) {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.initialized) {
				return;
			}

			if (super.initialize) {
				super.initialize(props);
			}

			this[inSetupSymbol] = false;

			lifecycleStatus.initialized = true;
		}

		render(props) {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.rendered) {
				return;
			}

			if (!lifecycleStatus.initialized) {
				this.initialize(props);
			}

			if (super.render) {
				super.render(props);
			}

			lifecycleStatus.rendered = true;
		}

		connect(props) {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.connected) {
				return;
			}

			if (!lifecycleStatus.initialized) {
				this.initialize(props);
			}

			if (!lifecycleStatus.rendered) {
				this.render(props);
			}

			if (super.connect) {
				super.connect(props);
			}

			if (this.connected) {
				let connectedTeardown = this.connected();
				if (typeof connectedTeardown === "function") {
					this[teardownHandlersSymbol].push(connectedTeardown);
				}
			}

			lifecycleStatus.connected = true;
		}

		disconnect() {
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.disconnected) {
				return;
			}

			if (super.disconnect) {
				super.disconnect();
			}

			if (this.disconnected) {
				this.disconnected();
			}

			lifecycleStatus.disconnected = true;
		}
	};
};
