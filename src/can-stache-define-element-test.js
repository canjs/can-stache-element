const QUnit = require("steal-qunit");
const Scope = require("can-view-scope");
const viewCallbacks = require("can-view-callbacks");
const StacheDefineElement = require("./can-stache-define-element");
const browserSupports = require("../test/browser-supports");

QUnit.module("can-stache-define-element");

if (browserSupports.customElements) {
	QUnit.test("basics", function(assert) {
		const fixture = document.querySelector("#qunit-fixture");

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
					<in-put inputValue:bind="this.first" handler:from="this.setFirst"></in-put>
					<in-put inputValue:bind="this.last" handler:from="this.setLast"></in-put>
					<p>{{this.fullName}}</p>
				`;
			}

			static get define() {
				return {
					first: { Type: String, default: "Kevin" },
					last: { Type: String, default: "McCallister" }
				};
			}

			get fullName() {
				return `${this.first} ${this.last}`;
			}

			setFirst(val) {
				this.first = val;
			}

			setLast(val) {
				this.last = val;
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

	QUnit.test("can be rendered by canViewCallbacks.tagHandler", function(assert) {
		class App extends StacheDefineElement {
			static get view() {
				return "Hello {{greeting}}";
			}
		}
		customElements.define("stache-viewcallbacks-app", App);
		const el = document.createElement("stache-viewcallbacks-app");
		el.setAttribute("greeting:bind", "greeting");

		const scope = new Scope({ greeting: "World" });

		viewCallbacks.tagHandler(el, "stache-viewcallbacks-app", {
			scope: scope
		});

		assert.equal(el.innerHTML, "Hello World");
	});

	QUnit.test("Can initialize with el.initialize()", function(assert) {
		class El extends StacheDefineElement {
			static get define() {
				return {
					prop: "default"
				};
			}
		}
		customElements.define("stache-element-initialized", El);
		const el = new El();
		el.initialize({ prop: "value" });
		assert.equal(el.prop, "value", "initialized with values provided to initialize");
	});

	QUnit.test("programatically instantiated elements get disconnected when removed", function(assert) {
		let done = assert.async();

		class Person extends StacheDefineElement {
			static get view() {
				return `
					<p>person</p>
				`;
			}
			disconnected() {
				assert.ok(true, "connected");
				done();
			}
		}
		customElements.define("per-son", Person);

		class App extends StacheDefineElement {
			static get view() {
				return `
					<p>
						{{#if(person)}}
							{{{person}}}
						{{/if}}
					</p>
				`;
			}
			static get define() {
				return {
					showPerson: true,
					person: {
						get() {
							if (this.showPerson) {
								let person = new Person();
								person.connect();
								return person;
							}
						}
					}
				};
			}
		}
		customElements.define("person-app", App);

		let app = new App();
		app.connect();

		const nameDiv = app.querySelector("per-son p");

		assert.equal(nameDiv.innerHTML, "person");

		app.showPerson = false;
	});
}
