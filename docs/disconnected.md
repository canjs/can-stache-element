@function can-stache-define-element/lifecycle-hooks.disconnected disconnected
@parent can-stache-define-element/lifecycle-hooks

@description A lifecycle hook called after a `StacheDefineElement` is removed from the document. This is useful for teardown code that does not have any setup code. For code that has both setup and teardown, code can be simplified using [can-stache-define-element/lifecycle-hooks.connected] since the teardown function has a closure over variables created in `connected`.

@signature `disconnected()`

```js
import { StacheDefineElement } from "can";

class MyElement extends StacheDefineElement {
	disconnected() {
		fetch("/api/log", {
			method: "POST",
			body: JSON.stringify({
				msg: "my-el was removed from the page"
			})
		});
	}
}
customElements.define("my-el", MyElement);

const myEl = new MyElement();
document.body.appendChild(myEl);
document.body.removeChild(myEl); // -> POSTs to /api/log
```
