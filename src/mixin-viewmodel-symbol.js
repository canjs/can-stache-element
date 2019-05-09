"use strict";

var defineLazyValue = require("can-define-lazy-value");
var canSymbol = require("can-symbol");
var viewModelSymbol = canSymbol.for("can.viewModel");

module.exports = function mixinViewModelSymbol(Class) {
  // can-stache-bindings uses viewModel symbol
  defineLazyValue(Class.prototype, viewModelSymbol, function() {
    return this;
  });
};
