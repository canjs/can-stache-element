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

/**
 * Used to determine if can-stache-element is static or not
 */
function isInertPrerendered(element) {
	// Flag exists when all can-stache-elements are expected to be static
	if (globalThis.canStacheElementInertPrerendered) {
		return true;
	}

	// Flag exists when newly created can-stache-elements might be expected to be static
	// When false, all newly created can-stache-elements are assumed to not be static
	// Return false at this point for performance
	if (!globalThis.canMooStache) {
		return false;
	}

	// Find static render container if it exists
	const ssgContainer = document.querySelector('canjs-app[data-canjs-static-render]')
	
	// No static render container found, assume it is not static
	if (!ssgContainer) {
		return false;
	}
	
	// Since globalThis.canMooStache is true, any newly created can-stache-elements may
	// be expected to be static, check by checking if its contained by an element with
	// `data-canjs-static-render` attribute
	return ssgContainer.contains(element);
}

module.exports = function mixinLifecycleMethods(BaseElement = HTMLElement) {
	return class LifecycleElement extends BaseElement {
		constructor() {
			super();
			if (arguments.length) {
				throw new Error("can-stache-element: Do not pass arguments to the constructor. Initial property values should be passed to the `initialize` hook.");
			}

			Object.defineProperty(this, "INERT_PRERENDERED", {
				writable: false,
				value: isInertPrerendered(this)
			});
			if (this.INERT_PRERENDERED) {
				return;
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
			if (this.INERT_PRERENDERED) {
				return;
			}
			this.initialize(props);
			this.render();
			this.connect();
			return this;
		}

		disconnectedCallback() {
			this.disconnect();
			return this;
		}

		// custom lifecycle methods
		initialize(props) {
			if (this.INERT_PRERENDERED) {
				return;
			}

			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.initialized) {
				return this;
			}

			// Overwrite ... this means that this initialize
			// can't be inherited (super.initialize).
			this[inSetupSymbol] = true;

			if (super.initialize) {
				super.initialize(props);
			}

			this[inSetupSymbol] = false;

			lifecycleStatus.initialized = true;

			return this;
		}

		render(props) {
			if (this.INERT_PRERENDERED) {
				return;
			}
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.rendered) {
				return this;
			}

			if (!lifecycleStatus.initialized) {
				this.initialize(props);
			}

			if (super.render) {
				super.render(props);
			}

			lifecycleStatus.rendered = true;

			return this;
		}

		connect(props) {
			if (this.INERT_PRERENDERED) {
				return;
			}
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.connected) {
				return this;
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
			lifecycleStatus.disconnected = false;

			return this;
		}

		disconnect() {
			if (this.INERT_PRERENDERED) {
				return;
			}
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (lifecycleStatus.disconnected) {
				return this;
			}

			if (super.disconnect) {
				super.disconnect();
			}

			if (this.stopListening) {
				this.stopListening();
			}

			for (let handler of this[teardownHandlersSymbol]) {
				handler.call(this);
			}

			if (this.disconnected) {
				this.disconnected();
			}

			this[lifecycleStatusSymbol] = {
				initialized: false,
				rendered: false,
				connected: false,
				disconnected: true
			};

			return this;
		}
	};
};
