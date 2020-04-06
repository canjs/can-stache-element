const QUnit = require("steal-qunit");
const mixinDefine = require("./mixin-props");
const type = require("can-type");

QUnit.module("can-stache-element - mixin-props");

QUnit.test("basics", function(assert) {
	class DefineElement extends mixinDefine(Object) {
		static get props() {
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

QUnit.test('Class fields should be observable', (assert) => {
	class DefineElement extends mixinDefine(Object) {
		greetings = 'Hello'; // jshint ignore:line
		static get props() {
			return {};
		}
	}
	const el = new DefineElement();
	el.initialize();

	el.on('greetings', () => {
		assert.ok('The class field is observable');
	});

	el.greetings = 'Hola';
	
});

QUnit.test('Class fields should not overwrite static props', (assert) => {
	class DefineElement extends mixinDefine(Object) {
		greetings = 'Hello'; // jshint ignore:line
		static get props() {
			return {
				greetings: {type: String, default: 'Bonjour'}
			};
		}
	}
	const el = new DefineElement();
	el.initialize();

	el.on('greetings', () => {
		assert.ok('The class field is observable');
	});

	el.greetings = 'Hola';
	
});
