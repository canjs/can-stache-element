"use strict";

var lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
var inSetupSymbol = Symbol.for("can.initializing");

module.exports = function mixinLifecycleMethods(BaseElement = HTMLElement) {
	return class LifecycleElement extends BaseElement {
		constructor() {
			super();
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
		connectedCallback() {
			var lifecycleStatus = this[lifecycleStatusSymbol];

			if (!lifecycleStatus.initialized) {
				this.initialize();
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

		render() {
			var lifecycleStatus = this[lifecycleStatusSymbol];

			if (!lifecycleStatus.initialized) {
				this.initialize();
			}

			lifecycleStatus.rendered = true;
		}

		connect() {
			this[lifecycleStatusSymbol].connected = true;
		}

		disconnect() {
			this[lifecycleStatusSymbol].connected = false;
		}
	};
};
