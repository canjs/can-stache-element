var QUnit = require("steal-qunit");
var StacheDefineElement = require("./can-stache-define-element");
var observe = require("can-observe");

QUnit.module("can-stache-define-element");

QUnit.test("basics", function(assert) {
  var fixture = document.querySelector("#qunit-fixture");

  class Person extends observe.Object {
    get full() {
      return `${this.first} ${this.last}`;
    }
  }

  class Input extends StacheDefineElement {
    handleChange(val) {
      // call the handler passed in through bindings
      this.handler(val);
    }
  }
  Input.view = `<p><input value:bind="this.inputValue" on:change="this.handleChange(scope.element.value)"></p>`;
  customElements.define("in-put", Input);

  class Basic extends StacheDefineElement {
    initialize() {
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
  Basic.view = `
    <in-put inputValue:bind="this.name.first" handler:from="this.setFirst"></in-put>
    <in-put inputValue:bind="this.name.last" handler:from="this.setLast"></in-put>
    <p>{{this.name.full}}</p>
  `;
  customElements.define("basic-app", Basic);
  var el = document.createElement("basic-app");
  fixture.appendChild(el);

  var inputs = document.querySelectorAll("input");
  var firstNameInput = inputs[0];
  var lastNameInput = inputs[1];
  var fullNameP = document.querySelectorAll("p")[2];

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
