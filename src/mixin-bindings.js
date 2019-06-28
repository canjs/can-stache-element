"use strict";

const stacheBindings = require("can-stache-bindings");
const keyObservable = require("can-simple-observable/key/key");
const canReflect = require("can-reflect");
const Bind = require("can-bind");

// make sure bindings work
require("can-stache-bindings");

const getValueSymbol = Symbol.for("can.getValue");
const setValueSymbol = Symbol.for("can.setValue");
const lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
const metaSymbol = Symbol.for("can.meta");

module.exports = function mixinBindings(Base = HTMLElement) {
	return class BindingsClass extends Base {
		bindings(bindings) {
			if(this[metaSymbol] === undefined) {
				this[metaSymbol] = {};
			}
			this[metaSymbol]._connectedBindings = bindings;
			return this;
		}
		initialize(props) {
			var savedBindings = this[metaSymbol] && this[metaSymbol]._connectedBindings;
			if (savedBindings) {
				props = props || {};
				const bindingContext = {
					element: this
				};
				const bindings = [];

				canReflect.eachKey(savedBindings, (parent, propName) => {

					var canGetParentValue = parent != null && !!parent[getValueSymbol];
					var canSetParentValue = parent != null && !!parent[setValueSymbol];

					// If we can get or set the value, then we’ll create a binding
					if (canGetParentValue === true || canSetParentValue) {

						// Create an observable for reading/writing the viewModel
						// even though it doesn't exist yet.
						var child = keyObservable(this, propName);

						// Create the binding similar to what’s in can-stache-bindings
						var canBinding = new Bind({
							child: child,
							parent: parent,
							queue: "domUI",

							//!steal-remove-start
							// For debugging: the names that will be assigned to the updateChild
							// and updateParent functions within can-bind
							updateChildName: "update <" + this.nodeName.toLowerCase() + ">."+propName,
							updateParentName: "update " + canReflect.getName(parent) + " from <" + this.nodeName.toLowerCase() + ">."+propName
							//!steal-remove-end
						});

						bindings.push({
							binding: canBinding,
							siblingBindingData: {
								parent: {
									source: "scope",
									exports: canGetParentValue
								},
								child: {
									source: "viewModel",
									exports: canSetParentValue,
									name: propName
								},
								bindingAttributeName: propName
							}
						});

					} else {
						// Can’t get or set the value, so assume it’s not an observable
						props[propName] = parent;
					}
				});

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

				this[metaSymbol].other = true;
			} else {
				if (super.initialize) {
					super.initialize(props);
				}
			}
		}
		render(props, renderOptions, parentNodeList) {
			const viewRoot = this.viewRoot || this;
			viewRoot.innerHTML = "";

			if(super.render) {
				super.render(props, renderOptions, parentNodeList);
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
