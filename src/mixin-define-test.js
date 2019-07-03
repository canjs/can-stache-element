const QUnit = require("steal-qunit");
const mixinDefine = require("./mixin-define");
const type = require("can-type");

QUnit.module("can-stache-define-element - mixin-define");

QUnit.test("basics", function(assert) {
	class DefineElement extends mixinDefine(Object) {
		static get define() {
			return {
				age: { type: type.convert(Number), default: 32 }
			};
		}
	}
	const el = new DefineElement();
	el.initialize();

	assert.equal(el.age, 32, "default age");

	el.age = "33";
	assert.equal(el.age, 33, "updated age");
});
