var QUnit = require("steal-qunit");
var extendWithLifecycleMethods = require("./extend-with-lifecycle-methods");

var canSymbol = require("can-symbol");
var lifecycleStatusSymbol = canSymbol.for("can.lifecycleStatus");

function assertStatuses(assert, obj, expected) {
  var lifecycleStatus = obj[lifecycleStatusSymbol];

  [
    "constructed",
    "initialized",
    "rendered",
    "connected"
  ].forEach(function(status) {
    assert.equal(lifecycleStatus[status], expected[status], status + " should be " + expected[status]);
  });
}

QUnit.module("can-stache-define-element - extend-with-lifecycle-methods");

QUnit.test("constructor calls hooks - construct", function(assert) {
  assert.expect(8);

  class Obj extends HTMLElement {
    construct() {
      assertStatuses(assert, this, {
        constructed: false,
        initialized: false,
        rendered: false,
        connected: false
      });
    }
  }
  var ExtendedObj = extendWithLifecycleMethods(Obj);
  customElements.define("construct-hook-el", ExtendedObj);

  var obj = new ExtendedObj();
  assertStatuses(assert, obj, {
    constructed: true,
    initialized: false,
    rendered: false,
    connected: false
  });
});

QUnit.test("connectedCallback calls hooks - initialize, render, connect", function(assert) {
  assert.expect(16);

  class Obj extends HTMLElement {
    connectedCallback() {
      assertStatuses(assert, this, {
        constructed: true,
        initialized: true,
        rendered: true,
        connected: true
      });
    }

    initialize() {
      assertStatuses(assert, this, {
        constructed: true,
        initialized: false,
        rendered: false,
        connected: false
      });
    }

    render() {
      assertStatuses(assert, this, {
        constructed: true,
        initialized: true,
        rendered: false,
        connected: false
      });
    }

    connect() {
      assertStatuses(assert, this, {
        constructed: true,
        initialized: true,
        rendered: true,
        connected: false
      });
    }
  }
  var ExtendedObj = extendWithLifecycleMethods(Obj);
  customElements.define("connencted-callback-hook-el", ExtendedObj);

  var obj = new ExtendedObj();
  obj.connectedCallback();
});

QUnit.skip("initialize can be called", function(assert) {
  assert.ok(true);
});

QUnit.skip("initialize can be called multiple times and will no re-initialize", function(assert) {
  assert.ok(true);
});

QUnit.skip("render can be called", function(assert) {
  assert.ok(true);
});

QUnit.skip("render calls initialize if it was not called", function(assert) {
  assert.ok(true);
});

QUnit.skip("render can be called multiple times and will not re-render", function(assert) {
  assert.ok(true);
});

QUnit.test("disconnectedCallback calls hooks - disconnect", function(assert) {
  assert.expect(12);

  class Obj extends HTMLElement {
    disconnectedCallback() {
      assertStatuses(assert, this, {
        constructed: true,
        initialized: true,
        rendered: true,
        connected: false
      });
    }

    disconnect() {
      assertStatuses(assert, this, {
        constructed: true,
        initialized: true,
        rendered: true,
        connected: true
      });
    }
  }
  var ExtendedObj = extendWithLifecycleMethods(Obj);
  customElements.define("disconnencted-callback-hook-el", ExtendedObj);

  var obj = new ExtendedObj();
  obj.connectedCallback();
  assertStatuses(assert, obj, {
    constructed: true,
    initialized: true,
    rendered: true,
    connected: true
  });

  obj.disconnectedCallback();
});

QUnit.test("lifecycle works with document.createElement", function(assert) {
  var fixture = document.querySelector("#qunit-fixture");

  class Obj extends HTMLElement {}
  var ExtendedObj = extendWithLifecycleMethods(Obj);
  customElements.define("created-el", ExtendedObj);

  var el = document.createElement("created-el");
  assertStatuses(assert, el, {
    constructed: true,
    initialized: false,
    rendered: false,
    connected: false
  });

  fixture.appendChild(el);
  assertStatuses(assert, el, {
    constructed: true,
    initialized: true,
    rendered: true,
    connected: true
  });

  fixture.removeChild(el);
  assertStatuses(assert, el, {
    constructed: true,
    initialized: true,
    rendered: true,
    connected: false
  });
});
