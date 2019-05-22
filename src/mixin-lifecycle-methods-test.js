const QUnit = require("steal-qunit");
const mixinLifecycleMethods = require("./mixin-lifecycle-methods");

const lifecycleStatusSymbol = Symbol.for("can.lifecycleStatus");
const inSetupSymbol = Symbol.for("can.initializing");

function assertStatuses(assert, obj, expected) {
	const lifecycleStatus = obj[lifecycleStatusSymbol];

	[
		"initialized",
		"rendered",
		"connected",
		"disconnected"
	].forEach(function(status) {
		assert.equal(lifecycleStatus[status], expected[status], status + " should be " + expected[status]);
	});
}

QUnit.module("can-stache-define-element - mixin-lifecycle-methods");

QUnit.test("connectedCallback calls hooks - initialize, render, connect", function(assert) {
	assert.expect(16);

	class Obj extends mixinLifecycleMethods(HTMLElement) {
		connectedCallback() {
			super.connectedCallback();
			assertStatuses(assert, this, {
				initialized: true,
				rendered: true,
				connected: true,
				disconnected: false
			});
		}

		initialize() {
			assertStatuses(assert, this, {
				initialized: false,
				rendered: false,
				connected: false,
				disconnected: false
			});
			super.initialize();
		}

		render() {
			assertStatuses(assert, this, {
				initialized: true,
				rendered: false,
				connected: false,
				disconnected: false
			});
			super.render();
		}

		connect() {
			assertStatuses(assert, this, {
				initialized: true,
				rendered: true,
				connected: false,
				disconnected: false
			});
			super.connect();
		}
	}
	customElements.define("connencted-callback-hook-el", Obj);

	const obj = new Obj();
	obj.connectedCallback();
});

QUnit.test("disconnectedCallback calls hooks - disconnect|teardown returned by connect", function(assert) {
	assert.expect(18);

	let obj;
	class Obj extends mixinLifecycleMethods(HTMLElement) {
		disconnectedCallback() {
			super.disconnectedCallback();
			assertStatuses(assert, this, {
				initialized: true,
				rendered: true,
				connected: true,
				disconnected: true
			});
		}

		teardown() {
			assert.equal(this, obj, "correct `this` in teardown handler");

			assertStatuses(assert, this, {
				initialized: true,
				rendered: true,
				connected: true,
				disconnected: false
			});
		}

		connect() {
			super.connect();
			return this.teardown;
		}

		disconnect() {
			this.teardown();
			super.disconnect();
		}
	}
	customElements.define("disconnencted-callback-hook-el", Obj);

	obj = new Obj();
	obj.connectedCallback();
	assertStatuses(assert, obj, {
		initialized: true,
		rendered: true,
		connected: true,
		disconnected: false
	});

	obj.disconnectedCallback();
});

QUnit.test("lifecycle works with document.createElement", function(assert) {
	const fixture = document.querySelector("#qunit-fixture");

	class Obj extends mixinLifecycleMethods(HTMLElement) {}
	customElements.define("created-el", Obj);

	const el = document.createElement("created-el");
	assertStatuses(assert, el, {
		initialized: false,
		rendered: false,
		connected: false,
		disconnected: false
	});

	fixture.appendChild(el);
	assertStatuses(assert, el, {
		initialized: true,
		rendered: true,
		connected: true,
		disconnected: false
	});

	fixture.removeChild(el);
	assertStatuses(assert, el, {
		initialized: true,
		rendered: true,
		connected: true,
		disconnected: true
	});
});

QUnit.test("events are not dispatched in initialize, are dispatched during render|connect", function(assert) {
	assert.expect(3);

	class Obj extends mixinLifecycleMethods(HTMLElement) {
		initialize() {
			assert.equal(this[inSetupSymbol], true, "inSetupSymbol is true during initialize");
			super.initialize();
		}

		render() {
			assert.equal(this[inSetupSymbol], false, "inSetupSymbol is false during render");
			super.render();
		}

		connect() {
			assert.equal(this[inSetupSymbol], false, "inSetupSymbol is false during render");
			super.connect();
		}
	}
	customElements.define("event-dispatch-el", Obj);

	const obj = new Obj();
	obj.connectedCallback();
});

QUnit.test("events are not dispatched in initialize, are dispatched during render|connect when methods are called directly", function(assert) {
	assert.expect(3);

	class Obj extends mixinLifecycleMethods(HTMLElement) {
		initialize() {
			assert.equal(this[inSetupSymbol], true, "inSetupSymbol is true during initialize");
			super.initialize();
		}

		render() {
			assert.equal(this[inSetupSymbol], false, "inSetupSymbol is false during render");
			super.render();
		}

		connect() {
			assert.equal(this[inSetupSymbol], false, "inSetupSymbol is false during render");
			super.connect();
		}
	}
	customElements.define("event-dispatch-el-manual", Obj);

	const obj = new Obj();
	obj.initialize();
	obj.render();
	obj.connect();
});

QUnit.test("initialize, render, and connect are only called the first time connectedCallback is called", function(assert) {
	assert.expect(3);

	class Obj extends mixinLifecycleMethods(HTMLElement) {
		initialize() {
			super.initialize();
			assert.ok(true, "initialize");
		}

		render() {
			super.render();
			assert.ok(true, "render");
		}

		connect() {
			super.connect();
			assert.ok(true, "connect");
		}
	}
	customElements.define("connencted-twice-el", Obj);

	const obj = new Obj();
	obj.connectedCallback();
	obj.connectedCallback();
});

QUnit.test("disconnect is only called the first time disconnectedCallback is called", function(assert) {
	assert.expect(1);

	class Obj extends mixinLifecycleMethods(HTMLElement) {
		disconnect() {
			super.disconnect();
			assert.ok(true, "connect");
		}
	}
	customElements.define("disconnencted-twice-el", Obj);

	const obj = new Obj();
	obj.disconnectedCallback();
	obj.disconnectedCallback();
});

QUnit.test("render calls initialize if it was not called", function(assert) {
	assert.expect(2);

	class Obj extends mixinLifecycleMethods(HTMLElement) {
		initialize() {
			super.initialize();
			assert.ok(true, "initialize");
		}

		render() {
			super.render();
			assert.ok(true, "render");
		}
	}
	customElements.define("render-calls-initialize-el", Obj);

	const obj = new Obj();
	obj.render();
});

QUnit.test("constructor throws if passed arguments", function(assert) {
	class Obj extends mixinLifecycleMethods(HTMLElement) {}
	customElements.define("constructor-arguments-el", Obj);

	try {
		new Obj({ foo: "bar" });
	} catch(e) {
		assert.ok(true);
	}
});

QUnit.test("initial props should always be passed to initialize", function(assert) {
	assert.expect(4);

	const props = { foo: "bar", baz: "bap" };
	class Obj extends mixinLifecycleMethods(HTMLElement) {
		initialize(initializeProps) {
			super.initialize();
			assert.equal(initializeProps, props, "Correct props passed to initialize");
		}
	}
	customElements.define("initialize-props-el", Obj);

	const initializeObj = new Obj();
	initializeObj.initialize(props);

	const renderObj = new Obj();
	renderObj.render(props);

	const connectObj = new Obj();
	connectObj.connect(props);

	const connectedCallbackObj = new Obj();
	connectedCallbackObj.connectedCallback(props);
});
