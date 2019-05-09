"use strict";

var mixinLifecycleMethods = require("./src/mixin-lifecycle-methods");
var mixinDefineProperty = require("can-define-class/extend-with-define-property");
var mixinStacheView = require("./src/mixin-stache-view");
var mixinViewModelSymbol = require("./src/mixin-viewmodel-symbol");

function DeriveElement(BaseElement = HTMLElement) {
  return class StacheDefineElement extends
    // mix in viewModel symbol used by can-stache-bindings
    mixinViewModelSymbol(
      // mix in stache renderer from `static view` property
      mixinStacheView(
        // add create getters/setters from `static define` property
        mixinDefineProperty(
          // add lifecycle hooks to BaseElement
          mixinLifecycleMethods(BaseElement)
        )
      )
    ) {};
}

module.exports = DeriveElement();
