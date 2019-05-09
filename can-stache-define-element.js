"use strict";

var extendWithLifecycleMethods = require("./src/extend-with-lifecycle-methods");
var extendWithDefineProperty = require("can-define-class/extend-with-define-property");
var mixinStacheView = require("./src/mixin-stache-view");
var mixinViewModelSymbol = require("./src/mixin-viewmodel-symbol");

function DeriveElement(BaseElement = HTMLElement) {
  // add lifecycle hooks to BaseElement
  // add create getters/setters from `static define` property
  class StacheDefineElement extends
  extendWithDefineProperty( extendWithLifecycleMethods(BaseElement) ) {}

  // mix in stache renderer from `static view` property
  mixinStacheView(StacheDefineElement);

  // mix in viewModel symbol used by can-stache-bindings
  mixinViewModelSymbol(StacheDefineElement);

  return StacheDefineElement;
}

module.exports = DeriveElement();
