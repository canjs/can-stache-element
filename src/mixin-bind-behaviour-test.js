const QUnit = require("steal-qunit");
const StacheElement = require("./can-stache-element");
const type = require("can-type");
const { fromAttribute } = require("can-observable-bindings");

const testHelpers = require("../test/helpers");
const browserSupports = testHelpers.browserSupports;

let fixture;
QUnit.module("can-stache-element - mixin-bind-behaviour", {
	beforeEach() {
		fixture = document.querySelector("#qunit-fixture");
	}
});

if (browserSupports.customElements) {
	QUnit.test("can set attribute from properties", function(assert) {
		class BasicBindingsElement extends StacheElement {
			static get view() {
				return `<h1>{{fname}} {{lname}}</h1>`;
			}

			static get props() {
				return {
					fname: {
						type: type.maybeConvert(String),
						bind: fromAttribute
					},
					lname: {
						type: type.maybeConvert(String),
						bind: fromAttribute
					}
				};
			}
		}
		customElements.define("set-attribute", BasicBindingsElement);

		const el = document.createElement('set-attribute');
		fixture.appendChild(el);
		
		assert.equal(el.getAttribute('fname'), undefined, 'We have not initialized the attribute');
		assert.equal(el.fname, undefined, 'We have not initialized the property');

		el.setAttribute('fname', 'Justin');
		assert.equal(el.fname, 'Justin', 'We have set the property from the attribute');
		
		el.setAttribute('lname', 'Meyer');
		assert.equal(el.lname, 'Meyer', 'We have set the property from the attribute');
	});
}
