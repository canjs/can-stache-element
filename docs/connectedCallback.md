@function can-stache-define-element/lifecycle-methods.connectedCallback connectedCallback
@parent can-stache-define-element/lifecycle-methods 0

@description Implementation of the `connectedCallback` lifecycle method of custom elements.

@signature `connectedCallback(props)`

```js
import { StacheDefineElement } from "can";

class MyElement extends StacheDefineElement {
	static view = `
		<p>{{this.greeting}}</p>
	`;
	static define = {
		age: { type: String, default: "Hello" }
	};
	connected() {
		const p = document.createElement("p");
		p.innerHTML = "World";
		this.appendChild(p);
	}
}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
myEl.connectedCallback({ greeting: "Hi" });

myEl.greeting          // -> Hi
myEl.firstElementChild // -> <p>Hi</p>
                       //    <p>World</p>
```

	@param {Object} props The initial property values.

@body

## Purpose

`StacheDefineElement` implements the custom element `connectedCallback` hook to:

1. [can-stache-define-element/lifecycle-methods.initialize] the element with property values.
2. [can-stache-define-element/lifecycle-methods.render] the stache view into the element.
3. [can-stache-define-element/lifecycle-methods.connect] the element to the DOM.
