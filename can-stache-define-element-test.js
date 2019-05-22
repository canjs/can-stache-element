const QUnit = require("steal-qunit");
const StacheDefineElement = require("./can-stache-define-element");
const observe = require("can-observe");

QUnit.module("can-stache-define-element");

QUnit.test("basics", function(assert) {
	const fixture = document.querySelector("#qunit-fixture");

	class Person extends observe.Object {
		get full() {
			return `${this.first} ${this.last}`;
		}
	}

	class Input extends StacheDefineElement {
		static get view() {
			return `<p><input value:bind="this.inputValue" on:change="this.handleChange(scope.element.value)"></p>`;
		}

		handleChange(val) {
			// call the handler passed in through bindings
			this.handler(val);
		}
	}
	customElements.define("in-put", Input);

	class Basic extends StacheDefineElement {
		static get view() {
			return `
				<in-put inputValue:bind="this.name.first" handler:from="this.setFirst"></in-put>
				<in-put inputValue:bind="this.name.last" handler:from="this.setLast"></in-put>
				<p>{{this.name.full}}</p>
			`;
		}

		initialize() {
			super.initialize();
			this.name = new Person({
				first: "Kevin",
				last: "McCallister"
			});
		}

		setFirst(val) {
			this.name.first = val;
		}

		setLast(val) {
			this.name.last = val;
		}
	}
	customElements.define("basic-app", Basic);
	const el = document.createElement("basic-app");
	fixture.appendChild(el);

	const inputs = el.querySelectorAll("input");
	const firstNameInput = inputs[0];
	const lastNameInput = inputs[1];
	const fullNameP = el.querySelectorAll("p")[2];

	assert.equal(firstNameInput.value, "Kevin", "firstName input has correct default value");
	assert.equal(lastNameInput.value, "McCallister", "lastName input has correct default value");
	assert.equal(fullNameP.innerHTML, "Kevin McCallister", "fullName paragraph has correct default value");

	firstNameInput.value = "Marty";
	firstNameInput.dispatchEvent(new Event("change"));
	assert.equal(fullNameP.innerHTML, "Marty McCallister", "fullName paragraph changes when firstName input changes");

	lastNameInput.value = "McFly";
	lastNameInput.dispatchEvent(new Event("change"));
	assert.equal(fullNameP.innerHTML, "Marty McFly", "fullName paragraph changes when lastName input changes");
});
