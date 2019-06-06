@function can-stache-define-element/lifecycle-hooks.connected connected
@parent can-stache-define-element/lifecycle-hooks

@description A lifecycle hook called after a `StacheDefineElement` is inserted into the document.

@signature `connected()`

```js
import { StacheDefineElement } from "can";

class MyElement extends StacheDefineElement {
	static view = `
		<p>{{time}}</p>
	`;
	static define = {
		time: { type: Number, default: 0 }
	};
	connected() {
		let intervalId = setInterval(() => {
			this.time++;
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}
}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
document.body.appendChild(myEl);

myEl.firstElementChild; // -> <p>0</p>

// ...some time passes
myEl.firstElementChild; // -> <p>42</p>
```

  @return {Function|undefined} A teardown function to be called during [can-stache-define-element/lifecycle-methods.disconnect disconnect]. This function can be used to tear down anything that was set up during `connected`, using any local variables in its closure.
