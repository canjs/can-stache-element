const QUnit = require("steal-qunit");
const StacheElement = require("./can-stache-element");
const type = require("can-type");
const { fromAttribute } = require("can-observable-bindings");

const testHelpers = require("../test/helpers");
const browserSupports = testHelpers.browserSupports;

let fixture;
QUnit.module("can-stache-element - mixin-binding-prop", {
	beforeEach() {
		fixture = document.querySelector("#qunit-fixture");
	}
});

if (browserSupports.customElements) {
	QUnit.test("can set attribute from property", function(assert) {
		const done = assert.async();
		class BasicBindingsElement extends StacheElement {
			static get view() {
				return `<h1>{{person}}</h1>`;
			}

			static get props() {
				return {
					person: {
						type: type.maybeConvert(String),
						bind: fromAttribute
					}
				};
			}
		}
		customElements.define("set-attribute", BasicBindingsElement);

		fixture.innerHTML = "<set-attribute></set-attribute>";
		const el = document.querySelector('set-attribute');
		
		assert.equal(el.getAttribute('person'), undefined, 'We have not initialized the attribute');
		assert.equal(el.person, undefined, 'We have not initialized the property');

		el.setAttribute('person', 'Justin');

		testHelpers.afterMutation(() => {
			assert.equal(el.person, 'Justin', 'We have set the property from the attribute');
			done();
		});
	});
}
