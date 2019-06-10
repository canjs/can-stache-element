@function can-stache-define-element/lifecycle-methods.disconnectedCallback disconnectedCallback
@parent can-stache-define-element/lifecycle-methods 4

@description Implementation of the `disconnectedCallback` lifecycle method of custom elements.

@signature `disconnectedCallback(props)`

```js
import { StacheDefineElement } from "can";

class MyElement extends StacheDefineElement {}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
myEl.disconnectedCallback();
```

@body

## Purpose

`StacheDefineElement` implements the custom element `disconnectedCallback` hook to:

- [can-stache-define-element/lifecycle-methods.disconnect] the element from the DOM.
