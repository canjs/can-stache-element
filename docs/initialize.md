@typedef {function} can-stache-define-element/lifecycle-methods.initialize initialize
@parent can-stache-define-element/lifecycle-methods 1

@description Initialize a `StacheDefineElement` instance with property values.

@signature `initialize(props)`

```js
import { StacheDefineElement } from "can";

class MyElement extends StacheDefineElement {
	static view = `
		<p>{{this.age}}</p>
	`;
	static define = {
		age: { type: Number, default: 30 }
	};
}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
myEl.initialize({ age: 32 });

myEl.age // -> 32
```

	@param {Object} props The initial property values.

@body

## Purpose

For testing purposes or integration with other libraries, `initialize` can be called to initialize an element with property values.

After `initialize` has been called, subsequent calls will not have any effect.
