@function can-stache-define-element/lifecycle-methods.connect connect
@parent can-stache-define-element/lifecycle-methods 3

@description Connect a `StacheDefineElement` instance to the DOM.

@signature `connect(props)`

```js
import { StacheDefineElement } from "can";

class MyElement extends StacheDefineElement {
	static view = `
		<p>{{greeting}}</p>
	`;
	static define = {
		age: { type: String, default: Hello }
	};
	connected() {
		const p = document.createElement("p");
		p.innerHTML = "World";
		this.appendChild(p);
	}
}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
myEl.connect({ greeting: "Hi" });

myEl.greeting // -> Hi
myEl.firstElementChild // -> <p>Hi</p><p>World</p>
```

	@param {Object} props The initial property values.

@body

## Purpose

For testing purposes or integration with other libraries, `connect` can be called to simulate an element being connected with the DOM.

The first time `connect` is called, it will:

- [can-stache-define-element/lifecycle-methods.initialize] the element with the property values passed to `connect`.
- [can-stache-define-element/lifecycle-methods.render] the stache view into the element.
- call the [can-stache-define-element/lifecycle-hooks.connected] lifecycle hook.

Subsequent calls to `connect` will not have any effect.
