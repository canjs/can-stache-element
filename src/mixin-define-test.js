const QUnit = require("steal-qunit");
const mixinDefine = require("./mixin-define");

QUnit.module("can-stache-define-element - mixin-define");

QUnit.test("basics", function(assert) {
	class DefineElement extends mixinDefine(HTMLElement) {
		static get define() {
			return {
				age: { Type: Number, default: 32 }
			};
		}
	}
	customElements.define("define-element", DefineElement);
	const el = new DefineElement();
	el.initialize();

	assert.equal(el.age, 32, "default age");

	el.age = "33";
	assert.equal(el.age, 33, "updated age");
});
