"use strict";

const lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
const inSetupSymbol = Symbol.for("can.initializing");

module.exports = function mixinLifecycleMethods(BaseElement = HTMLElement) {
	return class LifecycleElement extends BaseElement {
		constructor() {
			super();
			if (arguments.length) {
				throw new Error("can-stache-define-element: Do not pass arguments to the constructor. Initial property values should be passed to the `initialize` hook.");
			}

			// add inSetup symbol to prevent events being dispatched
			Object.defineProperty(this, inSetupSymbol, {
				configurable: true,
				enumerable: false,
				value: true,
				writable: true
			});

			// add lifecycle status symbol
			Object.defineProperty(this, lifecycleStatusSymbol, {
				value: {
					constructed: false,
					initialized: false,
					rendered: false,
					connected: false
				},
				enumerable: false
			});
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
				this.connect();
			}
		}

		disconnectedCallback() {
			this.disconnect();
		}

		// custom lifecycle methods
		construct() {
			this[lifecycleStatusSymbol].constructed = true;
		}

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
			const lifecycleStatus = this[lifecycleStatusSymbol];

			if (!lifecycleStatus.initialized) {
				this.initialize(props);
			}

			if (!lifecycleStatus.rendered) {
				this.render(props);
			}

			lifecycleStatus.connected = true;
		}

		disconnect() {
			this[lifecycleStatusSymbol].connected = false;
		}
	};
};
