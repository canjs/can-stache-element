"use strict";

const mixinLifecycleMethods = require("./mixin-lifecycle-methods");
const mixinProps = require("./mixin-props");
const mixinStacheView = require("./mixin-stache-view");
const mixinViewModelSymbol = require("./mixin-viewmodel-symbol");
const mixinBindings = require("./mixin-bindings");
const mixinInitializeBindings = require("./mixin-initialize-bindings");
const mixinBindingProp = require("./mixin-binding-prop");

const canStacheBindings = require("can-stache-bindings");

const initializeSymbol = Symbol.for("can.initialize");
const teardownHandlersSymbol = Symbol.for("can.teardownHandlers");

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

	return StacheElementConstructorFunction;
}

module.exports = DeriveElement();
