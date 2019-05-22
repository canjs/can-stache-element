"use strict";

const mixinLifecycleMethods = require("./src/mixin-lifecycle-methods");
const mixinDefine = require("./src/mixin-define");
const mixinStacheView = require("./src/mixin-stache-view");
const mixinViewModelSymbol = require("./src/mixin-viewmodel-symbol");

function DeriveElement(BaseElement = HTMLElement) {
	return class StacheDefineElement extends
	// mix in viewModel symbol used by can-stache-bindings
	mixinViewModelSymbol(
		// mix in stache renderer from `static view` property
		mixinStacheView(
			// add getters/setters from `static define` property
			mixinDefine(
				// add lifecycle hooks to BaseElement
				// this needs to happen before other mixins that use these hooks
				mixinLifecycleMethods(BaseElement)
			)
		)
	) {};
}

module.exports = DeriveElement();
