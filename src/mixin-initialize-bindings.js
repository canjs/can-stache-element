"use strict";

const stacheBindings = require("can-stache-bindings");

const lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
const metaSymbol = Symbol.for("can.meta");

module.exports = function mixinBindings(Base = HTMLElement) {
	return class InitializeBindingsClass extends Base {
		initialize(props) {
			var bindings = this[metaSymbol] && this[metaSymbol]._bindings;

			if (bindings) {
				const bindingContext = {
					element: this
				};
				// Initialize the viewModel.  Make sure you
				// save it so the observables can access it.
				var initializeData = stacheBindings.behaviors.initializeViewModel(bindings, props, (properties) => {
					super.initialize(properties);
					return this;
				}, bindingContext);
	
				this[metaSymbol]._connectedBindingsTeardown = function() {
					for (var attrName in initializeData.onTeardowns) {
						initializeData.onTeardowns[attrName]();
					}
				};
			} else {
				if (super.initialize) {
					super.initialize(props);
				}
			}
		}
		disconnect() {
			if(this[metaSymbol] && this[metaSymbol]._connectedBindingsTeardown) {
				this[metaSymbol]._connectedBindingsTeardown();
				this[metaSymbol]._connectedBindingsTeardown = null;
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
