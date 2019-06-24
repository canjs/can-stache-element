@function can-stache-define-element/lifecycle-hooks.connected connected
@parent can-stache-define-element/lifecycle-hooks

@description A lifecycle hook called after a `StacheDefineElement` is inserted into the document.

@signature `connected()`

```js
import { StacheDefineElement } from "can/everything";

class Timer extends StacheDefineElement {
	static view = `
		<p>{{this.time}}</p>
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
customElements.define("time-er", Timer);

const timer = new Timer();
document.body.appendChild(timer);

timer.firstElementChild; // -> <p>0</p>

// ...some time passes
timer.firstElementChild; // -> <p>42</p>
```

  @return {Function|undefined} A teardown function to be called during [can-stache-define-element/lifecycle-methods.disconnect disconnect]. This function can be used to tear down anything that was set up during `connected`, using any local variables in its closure.
