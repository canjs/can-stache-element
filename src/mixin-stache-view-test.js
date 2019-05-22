const QUnit = require("steal-qunit");
const mixinStacheView = require("./mixin-stache-view");
const browserSupports = require("../test/browser-supports");

QUnit.module("can-stache-define-element - mixin-stache-view");

if (browserSupports.customElements) {
	QUnit.test("basics", function(assert) {
		class StacheElement extends mixinStacheView(HTMLElement) {}

		class App extends StacheElement {
			static get view() {
				return "Hello {{greeting}}";
			}

			constructor() {
				super();
				this.greeting = "World";
			}
		}
		customElements.define("stache-app", App);

		const app = new App();

		assert.equal(typeof app.render, "function", "mixin adds a render method on class instances");
		app.render();

		assert.equal(app.innerHTML, "Hello World", "render method renders the static `view` property as stache");
	});

	if (browserSupports.shadowDOM) {
		QUnit.test("can render into shadowDOM", function(assert) {
			class StacheElement extends mixinStacheView(HTMLElement) {}

			class App extends StacheElement {
				static get view() {
					return "Hello {{greeting}}";
				}

				constructor() {
					super();
					this.viewRoot = this.attachShadow({ mode: "open" });
					this.greeting = "World";
				}
			}
			customElements.define("stache-shadow-dom-app", App);

			const app = new App();

			assert.equal(typeof app.render, "function", "mixin adds a render method on class instances");
			app.render();

			assert.equal(app.shadowRoot.innerHTML, "Hello World", "render method renders the static `view` property as stache");
		});
	}
}
