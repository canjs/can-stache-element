@module {function} can-stache-define-element
@parent can-views
@collection can-ecosystem
@group can-stache-define-element/static 0 static
@group can-stache-define-element/lifecycle-methods 1 lifecycle methods
@group can-stache-define-element/lifecycle-hooks 2 lifecycle hooks
@alias can.StacheDefineElement
@outline 2

@description Create a custom element with [can-define well-defined] properties and [can-stache stache views].

@signature `StacheDefineElement`

  `can-stache-define-element` exports a `StacheDefineElement` class used to define custom elements.

  Extend `StacheDefineElement` with a:

  - `static view` - A [can-stache stache] view.
  - `static define` - Definitions for [can-define-object well-defined] properties.
  - getters, setters, and methods.
  - lifecycle hooks - [can-stache-define-element/lifecycle-hooks.connected] and [can-stache-define-element/lifecycle-hooks.disconnected].

  The following defines a  `<my-counter>` element:

  ```js
  class MyCounter extends StacheDefineElement {
	  static view = `
		  Count: <span>{{this.count}}</span>
		  <button on:click="this.increment()">+1</button>
	  `;
	  static define = {
		  count: 0
	  };
	  increment() {
		  this.count++;
	  }
  }
  customElements.define("my-counter", MyCounter);
  ```

  To create a component instance, either:

  - Write the element tag and [can-stache-bindings bindings] in a [can-stache] template like:
    ```html
    <my-counter count:from="5"/>
    ```
  - Write the component tag in an HTML page:
    ```html
    <my-counter></my-counter>
    ```
  - Create an instance of the class programmatically like:
    ```js
    var myCounter = new MyCounter();
	myCounter.render({ count: 6 });
    myCounter.innerHTML   //-> Count: <span>6</span>...
    myCounter.count //-> 6
    ```

@body

## Basic Use

The following sections cover everything you need to create a custom element with `StacheDefineElement`.

### Defining a custom element with a StacheDefineElement constructor

In order to create a basic custom element with `StacheDefineElement`, create a class that extends `StacheDefineElement` and call [customElements.define](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) with the tag for the element and the constructor:

```js
class Counter extends StacheDefineElement {
}
customElements.define("my-counter", Counter);
```

This custom element can be used by putting a `<my-counter></my-counter>` tag in an HTML page.

### Defining an element's view

To create a [can-stache] view for the element, add a [can-stache-define-element/static.view static view] property to the class:

```js
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
}
customElements.define("my-counter", Counter);
```
@highlight 2-5

### Defining an element's properties

Properties can be defined using a [can-stache-define-element/static.define static define] object:

```js
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
	static define = {
		count: 6
	};
}
customElements.define("my-counter", Counter);
```
@highlight 6-8

### Defining Methods, Getters, and Setters

Methods (as well as getters and setters) can be added to the class body as well:

```js
class Counter extends StacheDefineElement {
	static view = `
		Count: <span>{{this.count}}</span>
		<button on:click="this.increment()">+1</button>
	`;
	static define = {
		count: 6
	};
	increment() {
		this.count++;
	}
}
customElements.define("my-counter", Counter);
```
@highlight 9-11

### Lifecycle hooks

If needed, [can-stache-define-element/lifecycle-hooks.connected] and [can-stache-define-element/lifecycle-hooks.disconnected] lifecycle hooks can be added to the class body. These will be called when the element is added and removed from the page, respectively.

## Testing

There are lifecycle methods available to simulate parts of an element's lifecycle that would normally be triggered through the [custom element lifecycle](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks).

### Testing an element's properties

To test an element's properties, call the [can-stache-define-element/lifecycle-methods.initialize] method with any initial property values:


```js
const counter = new Counter();
counter.initialize({ count: 20 });

counter.count === 20; // -> true

counter.increment();
counter.count === 21; // -> true
```
@highlight 2

### Testing an element's view

To test an element's view, call the [can-stache-define-element/lifecycle-methods.render] method with any initial property values:

```js
const counter = new Counter();
counter.render({ count: 20 });

counter.firstElementChild.innerHTML === 20; // -> true

counter.increment();
counter.firstElementChild.innerHTML === 21; // -> true
```
@highlight 2

### Testing an element's lifecycle hooks

To test the functionality of the `connected` or `disconnected` hooks, you can call the [can-stache-define-element/lifecycle-methods.connect] or [can-stache-define-element/lifecycle-methods.disconnect] method.
