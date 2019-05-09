import QUnit from "steal-qunit";
import StacheDefineElement from "./can-stache-define-element";

QUnit.module("can-stache-define-element");

QUnit.test("basics", function(assert) {
  class App extends StacheDefineElement {}
  customElements.define("a-pp", App);
  var el = document.createElement("a-pp");
  assert.ok(el instanceof App);
});
