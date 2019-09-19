"use strict";

const stacheBindings = require("can-stache-bindings");

const lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
const metaSymbol = Symbol.for("can.meta");

module.exports = function mixinBindings(Base = HTMLElement) {
	return class InitializeBindingsClass extends Base {
		connect(props) {
			const meta = this[metaSymbol];
			const bindings = meta && meta._bindings;

			if (bindings) {
				const bindingContext = {
					element: this
				};
				// Initialize the viewModel.  Make sure you
				// save it so the observables can access it.
				const initializeData = stacheBindings.behaviors.initializeViewModel(bindings, props, (properties) => {
					super.connect(properties);
					return this;
				}, bindingContext);
	
				meta._connectedBindingsTeardown = function() {
					for (let attrName in initializeData.onTeardowns) {
						initializeData.onTeardowns[attrName]();
					}
				};
			} else {
				if (super.connect) {
					super.connect(props);
				}
			}
		}
		disconnect() {
			const meta = this[metaSymbol];
			if(meta && meta._connectedBindingsTeardown) {
				meta._connectedBindingsTeardown();
				meta._connectedBindingsTeardown = null;
				this[lifecycleStatusSymbol] = {
					initialized: false,
					rendered: false,
					connected: false,
					disconnected: true
				};
			}
			if (super.disconnect) {
				super.disconnect();
			}
		}
	};
};
