@property {String|can-stache.view}  can-stache-define-element/static.view view
@parent can-stache-define-element/static 0

@description A static property used to create a [can-stache] view for each `StacheDefineElement` instance.

@signature `static view = " ... ";`

The view can be defined using a `static` class field like shown below.

```js
class TodoItem extends StacheDefineElement {
	static view = `
		<p>{{name}}</p>
		<input type="checkbox" checked:bind="complete">
	`;
}
customElements.define("todo-item", TodoItem);

const todo = new TodoItem({ name: "go grocery shopping" });
todo.render(); // `render` must be called for view to be rendered into element

todo.innerHTML; // -> <p>go grocery shopping><input type="checkbox">
```

> Note: to see all the options supported by `view`, see [can-stache].

@signature `static get define() { return { ... } }`

For browsers that do not support class fields (and applications not using a transpiler), properties can be defined using a `static` getter like shown below.

```js
class TodoItem extends StacheDefineElement {
	static get view() {
		return `
			<p>{{name}}</p>
			<input type="checkbox" checked:bind="complete">
		`;
	}
}
customElements.define("todo-item", TodoItem);

const todo = new TodoItem({ name: "go grocery shopping" });
todo.render(); // `render` must be called for view to be rendered into element

todo.innerHTML; // -> <p>go grocery shopping><input type="checkbox">
```

> Note: to see all the options supported by `view`, see [can-stache].
