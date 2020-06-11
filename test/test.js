let supportsClassFields;

try {
	eval(`class Foo {
		field = "value"
	}`);
	supportsClassFields = true;
} catch(e) {
	supportsClassFields = false;
}

import "../src/can-stache-element-test";
import "../src/mixin-props-test";
import "../src/mixin-lifecycle-methods-test";
import "../src/mixin-stache-view-test";
import "../src/mixin-viewmodel-symbol-test";
import "../src/import-export-steal-test";
import "../src/mixin-bindings-test";
import "../src/mixin-initialize-bindings-test";
import "../src/mixin-bind-behaviour-test";
// Conditional loading with full module path is required to run tests in canjs suite
// Safari doesn't handle class fields
import "../src/mixin-props-class-fields-test#?can-stache-element/test/class-fields-supported"; 
