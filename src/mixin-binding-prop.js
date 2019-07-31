"use strict";

const metaSymbol = Symbol.for("can.meta");
const { mixins } = require("can-observable-mixin");

const bindingMap = new Map();

module.exports = function mixinBindingProps(Base = HTMLElement) {
	return class BindingPropsClass extends Base {
		constructor() {
			super();

			if(this[metaSymbol] === undefined) {
				this[metaSymbol] = {};
			}
			if(this[metaSymbol]._uninitializedBindings === undefined) {
				this[metaSymbol]._uninitializedBindings = {};
			}

			mixins.finalizeClass(this.constructor);
			
			if (this._define && this._define.definitions) {
				Object.keys(this._define.definitions).forEach(propName => {
					const definition = this._define.definitions[propName];
					if (typeof definition.bind === 'function') {
						const bindFn = definition.bind(propName);
						this[metaSymbol]._uninitializedBindings[propName] = bindFn;
					}
				});
			}
		}
		initialize(props) {
			if (bindingMap) {
				if (this[metaSymbol]._bindings === undefined) {
					this[metaSymbol]._bindings = [];
				}
				Object.keys(this[metaSymbol]._uninitializedBindings).forEach(propName => {
					const binding = this[metaSymbol]._uninitializedBindings[propName](this);

					this[metaSymbol]._bindings.push({
						binding,
						siblingBindingData: {
							parent: {
								source: "scope",
								exports: true
							},
							child: {
								source: "viewModel",
								exports: true,
								name: propName
							},
							bindingAttributeName: propName
						}
					});
				});
			}

			if (super.initialize) {
				super.initialize(props);
			}
		}
	};
};
