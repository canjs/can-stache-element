const QUnit = require("steal-qunit");
const Scope = require("can-view-scope");
const viewCallbacks = require("can-view-callbacks");
const stache = require("can-stache");
const SimpleObservable = require("can-simple-observable");
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
					first: { type: String, default: "Kevin" },
					last: { type: String, default: "McCallister" }
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

	QUnit.test("element can be used directly in a stache view", function(assert) {
		const fixture = document.querySelector("#qunit-fixture");

		assert.expect(2);
		const done = assert.async();

		const show = new SimpleObservable(false);

		class El extends StacheDefineElement {
			connected() {
				assert.ok(true, "connected");
			}
			disconnected() {
				assert.ok(true, "disconnected");
				done();
			}
		}
		customElements.define("stache-el-in-stache", El);

		const el = new El();

		const frag = stache(`
			<div>
			{{#if(show)}}
				{{el}}
			{{/if}}
			</div>
		`)({
			el,
			show
		});

		// viewInsert
		show.value = true;

		// connect
		fixture.appendChild(frag);

		// teardown
		show.value = false;
	});

	QUnit.test("addEventListener and removeEventListener work for DOM events", function(assert) {
		const done = assert.async();

		class El extends StacheDefineElement {}
		customElements.define("add-event-listener-el", El);

		const el = new El();

		el.addEventListener("an-event", function handler() {
			el.removeEventListener("an-event", handler);
			el.dispatchEvent( new Event("an-event") );

			assert.ok(true, "addEventListener works");
			done();
		});

		el.dispatchEvent( new Event("an-event") );
	});

	QUnit.only("value() is only called once", function(assert) {
		let valueCalls = 0, lastSetCalls = 0;
		class ValueEl extends StacheDefineElement {
			static get view() {
				return `{{one}}`;
			}

			static get define() {
				return {
					one: {
						value({ lastSet, listenTo, resolve }) {
							valueCalls++;
							listenTo(lastSet, (val) => {
								lastSetCalls++;
								resolve(val);
							});
							resolve(lastSet.get());
						}
					}
				};
			}
		}

		customElements.define("value-only-once", ValueEl);
		let el = new ValueEl();
		el.connect({ one: 1 });
		el.one = 2;

		assert.equal(el.firstChild.data, "2", "renders the value");
		assert.equal(valueCalls, 1, "value() only called once");
		assert.equal(lastSetCalls, 1, "lastSet changed");
	});
}
