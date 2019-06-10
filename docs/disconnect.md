@function can-stache-define-element/lifecycle-methods.disconnect disconnect
@parent can-stache-define-element/lifecycle-methods 5

@description Disconnect a `StacheDefineElement` instance from the DOM.

@signature `disconnect()`

```js
import { StacheDefineElement } from "can";

const logs = [];

class MyElement extends StacheDefineElement {
	static view = `
		<p>{{name}} has been running for {{time}} seconds</p>
	`;

	static define = {
		name: { type: String, default: "App" },
		time: { type: Number, default: 0 }
	};

	connected() {
		this.listenTo("name", (ev, newName) => {
			logs.push(`name change to ${newName}`);
		});

		let intervalId = setInterval(() => {
			this.time++;
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}

	disconnected() {
		logs.push("disconnected");
	}
}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
myEl.connect();

myEl.innerHTML; // -> <p>App has been running for 0 seconds</p>

myEl.name = "Counter";
logs; // -> [ "name changed to Counter" ]
myEl.innerHTML; // -> <p>Counter has been running for 0 seconds</p>

// ...some time passes
myEl.innerHTML; // -> <p>Counter has been running for 3 seconds</p>

myEl.disconnect();
myEl.innerHTML; // -> <p>Counter has been running for 3 seconds</p>

myEl.name = "Stopped Counter";
logs; // -> [ "name changed to Counter", "disconnected" ]

// ...some time passes
myEl.innerHTML; // -> <p>Stopped Counter has been running for 3 seconds</p>
```

@body

## Purpose

For testing purposes or integration with other libraries, `disconnect` can be called to simulate an element being disconnected from the DOM.

The first time `disconnect` is called, it will:

- call [can-event-queue/map/map.stopListening stopListening].
- call a teardown handler returned by the [can-stache-define-element/lifecycle-hooks.connected connected hook].
- call the [can-stache-define-element/lifecycle-hooks.disconnected disconnected hook].

Subsequent calls to `disconnect` will not have any effect.
