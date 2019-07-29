const QUnit = require("steal-qunit");
const StacheElement = require("./can-stache-element");
const value = require("can-value");
const Bind = require("can-bind");
const type = require("can-type");

const testHelpers = require("../test/helpers");
const browserSupports = testHelpers.browserSupports;

let fixture;
QUnit.module("can-stache-element - mixin-binding-prop", {
	beforeEach() {
		fixture = document.querySelector("#qunit-fixture");
	}
});

if (browserSupports.customElements) {
	QUnit.test("basics work", function(assert) {
		class BasicBindingsElement extends StacheElement {
			static get view() {
				return `<h1>{{name}}</h1>`;
			}

			static get props() {
				return {
					name: {
						type: type.maybeConvert(String),
						bind: function (propertyName) {
							return function (instance) {
								return new Bind({
									parent: value.from(instance.getAttribute(propertyName)),
									child: value.to(instance, propertyName),
									queue: "domUI"
								});
							};
						}
					}
				};
			}
		}
		customElements.define("binding-attribute", BasicBindingsElement);

		fixture.innerHTML = "<binding-attribute name='Matt'></binding-attribute>";
		const el = document.querySelector('binding-attribute');

		assert.equal(el.name, 'Matt', 'We have set the property from the attribute');
	});
}
