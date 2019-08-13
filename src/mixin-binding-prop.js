"use strict";

const metaSymbol = Symbol.for("can.meta");

// `attributeChangedCallback` cannot be overwritten so we need to create a named
// function to check if we have had a `attributeChangedCallback` set.
function baseAttributeChangedCallback () {
	/* jshint validthis: true */
	if (this.attributeChangedCallback !== baseAttributeChangedCallback) {
		// `this.attributeChangedCallback` is being set up within `can-observable-bindings`
		this.attributeChangedCallback.apply(this, arguments);
	}
}

module.exports = function mixinBindingProps(Base = HTMLElement) {
	class BindingPropsClass extends Base {
		initialize(props) {
			if(this[metaSymbol] === undefined) {
				this[metaSymbol] = {};
			}
			if (this[metaSymbol]._bindings === undefined) {
				this[metaSymbol]._bindings = [];
			}
			// `_uninitializedBindings` are being set within `observedAttributes` which creates the bindings
			Object.keys(this.constructor[metaSymbol]._uninitializedBindings).forEach(propName => {
				const binding = this.constructor[metaSymbol]._uninitializedBindings[propName](this);

				// Add bindings to the instance `metaSymbol` to be set up during `mixin-initialize-bindings`
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

			if (super.initialize) {
				super.initialize(props);
			}
		}
	}

	// To prevent inifinite loop, use a named function so we can differentiate
	// make it writable so it can be set elsewhere  
	Object.defineProperty(BindingPropsClass.prototype, 'attributeChangedCallback', {
		value: baseAttributeChangedCallback,
		writable: true
	});

	return BindingPropsClass;
};
