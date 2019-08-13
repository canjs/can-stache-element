"use strict";

const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
const mixinProps = require("./mixin-props");
const mixinStacheView = require("./mixin-stache-view");
const mixinViewModelSymbol = require("./mixin-viewmodel-symbol");
const mixinBindings = require("./mixin-bindings");
const mixinInitializeBindings = require("./mixin-initialize-bindings");
const mixinBindingProp = require("./mixin-binding-prop");

const canStacheBindings = require("can-stache-bindings");
const { mixins } = require("can-observable-mixin");

const initializeSymbol = Symbol.for("can.initialize");
const teardownHandlersSymbol = Symbol.for("can.teardownHandlers");
const metaSymbol = Symbol.for("can.meta");

function DeriveElement(BaseElement = HTMLElement) {
	class StacheElement extends
	// add lifecycle methods
	// this needs to happen after other mixins that implement these methods
	// so that this.<lifecycleMethod> is the actual lifecycle method which
	// controls whether the methods farther "down" the chain are called
	mixinLifecycleMethods(
		// mixin .bindings() method and behavior
		mixinBindings(
			// Find all prop definitions and extract `{ bind: () => {} }` for binding initialization
			mixinBindingProp(
				// Initialize the bindings
				mixinInitializeBindings(
					// mix in viewModel symbol used by can-stache-bindings
					mixinViewModelSymbol(
						// mix in stache renderer from `static view` property
						mixinStacheView(
							// add getters/setters from `static props` property
							mixinProps(BaseElement)
						)
					)
				)
			)
		)
	) {
		[initializeSymbol](el, tagData) {


			const teardownBindings = canStacheBindings.behaviors.viewModel(
				el,
				tagData,
				function makeViewModel(initialViewmodelData) {
					el.render(initialViewmodelData);
					return el;
				}
			);

			if (el[teardownHandlersSymbol]) {
				el[teardownHandlersSymbol].push(teardownBindings);
			}
		}
	}

	function StacheElementConstructorFunction() {
		const self = Reflect.construct(StacheElement, arguments, this.constructor);
		return self;
	}

	StacheElementConstructorFunction.prototype = Object.create(StacheElement.prototype);
	StacheElementConstructorFunction.prototype.constructor = StacheElementConstructorFunction;

	// We can't set `observedAttributes` on the `StacheElement.prototype` as static properties are
	// not copied over with `Object.create`
	Object.defineProperty(StacheElementConstructorFunction, 'observedAttributes', {
		get () {
			// We only want to return `observedAttributes` if we have a `bind` on the
			// property definition
			let hasBindDefinition = false;
			// Run finalizeClass to set up the property definitions
			mixins.finalizeClass(this);
			
			if(this[metaSymbol] === undefined) {
				this[metaSymbol] = {};
			}
			if(this[metaSymbol]._uninitializedBindings === undefined) {
				this[metaSymbol]._uninitializedBindings = {};
			}

			// Check that we have property definitions
			const definitions = this.prototype._define && this.prototype._define.definitions;
			if (definitions) {
				// Run through all defitions so we can check if they have a `bind` function
				Object.keys(definitions).forEach(propName => {
					const definition = definitions[propName];
					if (typeof definition.bind === 'function') {
						const createBindFn = definition.bind(propName);
						const bindFn = createBindFn(this);
						// Set up the bindings so that they can be called during initialize
						// to setup binding starts
						this[metaSymbol]._uninitializedBindings[propName] = bindFn;
						hasBindDefinition = true;
					}
				});
			}
			// Only return `this.observedAttributes` if we have binds otherwise
			// we create an inifinite loop
			return hasBindDefinition ? this.observedAttributes : [];
		}
	});

	return StacheElementConstructorFunction;
}

module.exports = DeriveElement();
