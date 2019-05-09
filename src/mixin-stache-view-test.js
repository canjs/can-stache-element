var QUnit = require("steal-qunit");
var mixinStacheView = require("./mixin-stache-view");

QUnit.module("can-stache-define-element - mixin-stache-view");

QUnit.test("basics", function(assert) {
  class StacheElement extends mixinStacheView(HTMLElement) {}

  class App extends StacheElement {
    constructor() {
      super();
      this.greeting = "World";
    }
  }
  App.view = "Hello {{greeting}}";
  customElements.define("stache-app", App);

  var app = new App();

  assert.equal(typeof app.render, "function", "mixin adds a render method on class instances");
  app.render();

  assert.equal(app.innerHTML, "Hello World", "render method renders the static `view` property as stache");
});

QUnit.test("can render into shadowDOM", function(assert) {
  class StacheElement extends mixinStacheView(HTMLElement) {}

  class App extends StacheElement {
    constructor() {
      super();
      this.viewRoot = this.attachShadow({ mode: "open" });
      this.greeting = "World";
    }
  }
  App.view = "Hello {{greeting}}";
  customElements.define("stache-shadow-dom-app", App);

  var app = new App();

  assert.equal(typeof app.render, "function", "mixin adds a render method on class instances");
  app.render();

  assert.equal(app.shadowRoot.innerHTML, "Hello World", "render method renders the static `view` property as stache");
});
