const QUnit = require("steal-qunit");
const mixinDefineClass = require("./mixin-define-class");

QUnit.test("basics", function(assert) {
	class DefineElement extends mixinDefineClass(HTMLElement) {}
	customElements.define("define-element", DefineElement);
	const el = new DefineElement();
	assert.ok(el instanceof DefineElement);
});
