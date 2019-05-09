var QUnit = require("steal-qunit");
var mixinViewModelSymbol = require("./mixin-viewmodel-symbol");
var canSymbol = require("can-symbol");
var viewModelSymbol = canSymbol.for("can.viewModel");

QUnit.module("can-stache-define-element - mixin-viewmodel-symbol");

QUnit.test("basics", function(assert) {
	class App extends mixinViewModelSymbol(class A {}) {}

	var app = new App();
	assert.equal(app[viewModelSymbol], app, "instances get assigned viewModel Symbol");
});
