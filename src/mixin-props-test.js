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

try {
	eval(`
		QUnit.test('Class fields should be observable', (assert) => {
			class DefineElement extends mixinDefine(Object) {
				greetings = 'Hello'; // jshint ignore:line
				static get props() {
					return {};
				}
			}
			const el = new DefineElement();

			if (el.hasOwnProperty('greetings')) {
				el.initialize();
			
				el.on('greetings', () => {
					assert.ok('The class field is observable');
				});
			
				el.greetings = 'Hola';
			} else {
				assert.ok('skipped');
			}
	});`);
} catch (e) {
	//console.log("doesn't work");
}

try {
	eval(`QUnit.test('Class fields should not overwrite static props', (assert) => {
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
		if (el.hasOwnProperty('greetings')) {
			el.on('greetings', () => {
				assert.ok('The class field is observable');
			});
	
			el.greetings = 'Hola';
		} else {
			assert.ok('skipped');
		}
	
	});`);
  
} catch(e) {
  //console.log("doesn't work");
}


