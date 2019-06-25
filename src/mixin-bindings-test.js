const QUnit = require("steal-qunit");
const StacheDefineElement = require("./can-stache-define-element");
const value = require("can-value");

const browserSupports = require("../test/browser-supports");
const canReflect = require("can-reflect");

let fixture;
QUnit.module("can-stache-define-element - mixin-bindings", {
	beforeEach() {
		fixture = document.querySelector("#qunit-fixture");
	}
});

if (browserSupports.customElements) {
	QUnit.test("basics work", function(assert) {
		class BasicBindingsElement extends StacheDefineElement {
			static get view() {
				return `<h1>{{message}}</h1>`;
			}

			static get define() {
				return {
					message: { type: String, default: "Hi" }
				};
			}
		}
		customElements.define("basic-bindings", BasicBindingsElement);

		var basicBindingsElement = new BasicBindingsElement();

		var messageObservable = value.with("Hello");

		basicBindingsElement.bindings({
			message: messageObservable
		});

		assert.equal(basicBindingsElement.message, "Hi", "properties initialized later");
		//-> The binding should really only happen once inserted ...
		// -> Folks could call `var el = new Element().bindings({}).initialize()`

		// INSERT ELEMENT
		fixture.appendChild(basicBindingsElement);

		assert.equal(basicBindingsElement.message, "Hello", "properties initialized");
		assert.equal(basicBindingsElement.innerHTML, "<h1>Hello</h1>", "template rendered" );

		// UPDATE observable
		messageObservable.value = "HOWDY";

		assert.equal(basicBindingsElement.message, "HOWDY", "element property value changed");
		assert.equal(basicBindingsElement.innerHTML, "<h1>HOWDY</h1>", "html updated" );

		// UPDATE element
		basicBindingsElement.message = "Hola!";

		assert.equal(messageObservable.value, "Hola!", "observable updated via two-way binding");

		// REMOVE ELEMENT
		fixture.removeChild(basicBindingsElement);

		//basicBindingsElement[state].isInitialized //-> false

		/* Question 2: Should we blow away the innerHTML?
		 *  + It won't be live anymore
		 *  - It will be unnecessarily expensive to do this
		 * */

		assert.equal( canReflect.isBound(messageObservable), false, "the observable is not bound" );
		assert.equal( canReflect.isBound(basicBindingsElement), false, "the element is not bound" );

		// INSERT ELEMENT AGAIN
		messageObservable.value = "GOODBYE";

		fixture.appendChild(basicBindingsElement);
		assert.equal(basicBindingsElement.message, "GOODBYE", "properties initialized after re-insertion");
		assert.equal(basicBindingsElement.innerHTML, "<h1>GOODBYE</h1>", "template rendered" );

	});

	QUnit.test("Everything is properly torn down", function(assert) {
		let done = assert.async();
		let oneId = 0, twoId = 0;

		class One extends StacheDefineElement {
			static get view() {
				return `
					{{this.setId(id)}}
					<p id="oneid">{{id}}</p>
				`;
			}

			static get define() {
				return {
					id: Number
				};
			}

			setId(val) {
				oneId = val;
			}
		}
		customElements.define("o-ne", One);

		class Two extends StacheDefineElement {
			static get view() {
				return `
					{{this.setId(id)}}
					<p id="twoid">{{id}}</p>
				`;
			}

			static get define() {
				return {
					id: Number
				};
			}

			setId(val) {
				twoId = val;
			}
		}
		customElements.define("t-wo", Two);

		class App extends StacheDefineElement {
			static get view() {
				return `
					<p>
						{{#if(elementPromise.isResolved)}}
							{{{element}}}
						{{/if}}
					</p>

					<button on:click="increment()">+1</button>
				`;
			}

			static get define() {
				return {
					id: 1,

					elementPromise: {
						get() {
							return new Promise((resolve) => {
								let child = this.id === 1 ? new One() : new Two();
								child.bindings({ id: value.from(this, "id") });
								child.connect();

								resolve(child);
							});
						}
					},
					element: {
						async(resolve) {
							this.elementPromise.then(resolve);
						}
					}
				};
			}

			increment() {
				this.id++;
			}
		}
		customElements.define("a-pp", App);

		let app = new App();
		app.connect();

		app.on('element', function onFirst() {
			app.off('element', onFirst);

			app.on('element', function onSecond() {
				app.off('element', onSecond);

				assert.equal(oneId, 1, "Has its original id");
				assert.equal(twoId, 2, "Has its own id");
				done();
			});

			let oneEl = app.querySelector('o-ne');

			app.increment();

			assert.equal(oneEl.querySelector('#oneid').textContent, "1", "Has not changed");
		});
	});

	QUnit.test("All bindings are torn down", function(assert) {
		class BindingsTeardownElement extends StacheDefineElement {
			static get view() {
				return `<h1>{{greeting}} {{object}}</h1>`;
			}
			static get define() {
				return {
					greeting: { type: String, default: "Hi" },
					object: { type: String, default: "person" }
				};
			}
		}
		customElements.define("bindings-teardown-element", BindingsTeardownElement);

		var teardownElement = new BindingsTeardownElement();

		var greetingObservable = value.with("Hello");
		var objectObservable = value.with("world");

		teardownElement.bindings({
			greeting: greetingObservable,
			object: objectObservable
		});
		teardownElement.connect();

		const h1 = teardownElement.firstElementChild;
		assert.equal(teardownElement.greeting, "Hello", "greetingObservable set up correctly");
		assert.equal(teardownElement.object, "world", "objectObservable set up correctly");
		assert.equal(h1.innerHTML, "Hello world", "view rendered");

		teardownElement.disconnect();

		greetingObservable.value = "Howdy";
		objectObservable.value = "Mars";

		assert.equal(teardownElement.greeting, "Hello", "greetingObservable torn down correctly");
		assert.equal(teardownElement.object, "world", "objectObservable torn down correctly");
		assert.equal(h1.innerHTML, "Hello world", "view not updated");
	});
}
