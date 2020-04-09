let supportsClassFields;

try {
	eval(`class Foo {
		field = "value"
	}`);
	supportsClassFields = true;
	console.log('works');
} catch(e) {
	supportsClassFields = false;
}

require("../src/can-stache-element-test");
require("../src/mixin-props-test");
require("../src/mixin-lifecycle-methods-test");
require("../src/mixin-stache-view-test");
require("../src/mixin-viewmodel-symbol-test");
require("../src/import-export-steal-test");
require("../src/mixin-bindings-test");
require("../src/mixin-initialize-bindings-test");
require("../src/mixin-bind-behaviour-test");

if (supportsClassFields) {
	require('../src/mixin-props-class-fields-test');
}
