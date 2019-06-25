@property {String|can-stache.view}  can-stache-define-element/static.view view
@parent can-stache-define-element/static 0

@description A static property used to create a [can-stache] view for each `StacheDefineElement` instance.

@signature `static view = " ... ";`

  The view can be defined using a `static` class field like shown below.

  ```html
  <count-er></count-er>
  <script type="module">
  import { StacheDefineElement } from "can/everything";
  class Counter extends StacheDefineElement {
  	static view = `
  		<p>Count: <span>1</span></p>
  	`;
  }
  customElements.define("count-er", Counter);
  </script>
  ```
  @codepen

> Note: to see all the options supported by `view`, see [can-stache].

@signature `static get view() { return " ... "; }`

  For browsers that do not support class fields (and applications not using a transpiler), properties can be defined using a `static` getter like shown below.

  ```js
  import { StacheDefineElement } from "can/everything";
  class Counter extends StacheDefineElement {
  	static get view() {
  		return `
			<p>Count: <span>1</span></p>
  		`;
  	}
  }
  ```

@signature `static get view = function() {};`

  A function can be passed as the view property. This is useful for loading views in their own files and loading them with [steal-stache] or similar.

  ```js
  import { StacheDefineElement, stache } from "can/everything";

  const renderer = stache(`<p>Count: <span>1</span></p>`);

  class Counter extends StacheDefineElement {
	  static view = renderer;
  }
  ```
