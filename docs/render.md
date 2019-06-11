@function can-stache-define-element/lifecycle-methods.render render
@parent can-stache-define-element/lifecycle-methods 2

@description Render a `StacheDefineElement` instance.

@signature `render(props)`

```js
import { StacheDefineElement } from "can";

class MyElement extends StacheDefineElement {
	static view = `
		<p>{{age}}</p>
	`;
	static define = {
		age: { type: Number, default: 30 }
	};
}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
myEl.render({ age: 32 });

myEl.age               // -> 32
myEl.firstElementChild // -> <p>32</p>
```

	@param {Object} props The initial property values.

@body

## Purpose

For testing purposes or integration with other libraries, `render` can be called to render an element with its view.

The first time `render` is called, it will:

- [can-stache-define-element/lifecycle-methods.initialize] the element with the property values passed to `render`.
- render the stache view into the element.

Subsequent calls to `render` will not have any effect.
