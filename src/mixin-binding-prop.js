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

			mixins.finalizeClass(this.constructor);
			
			if (this._define && this._define.definitions) {
				Object.keys(this._define.definitions).forEach(propName => {
					const definition = this._define.definitions[propName];
					if (typeof definition.bind === 'function') {
						const bindFn = definition.bind(propName);
						bindingMap.set(propName, bindFn);
					}
				});
			}
		}
		initialize(props) {
			if (bindingMap) {
				if (this[metaSymbol]._bindings === undefined) {
					this[metaSymbol]._bindings = [];
				}
				bindingMap.forEach((createBind, propName) => {
					const binding = createBind(this);

					this[metaSymbol]._bindings.push({
						binding,
						siblingBindingData: {
							parent: {
								source: "scope",
								exports: true
							},
							child: {
								source: "viewModel",
								exports: false,
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
