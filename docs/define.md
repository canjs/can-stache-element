@function can-stache-define-element/static.define define
@parent can-stache-define-element/static 1

@description A static property used to create well-defined properties on each `StacheDefineElement` instance using [can-define-object].

@signature `static define = { ... };`

Properties can be defined using a `static` class field like shown below.

```js
class TodoItem extends StacheDefineElement {
	static define = {
		name: String,
		completed: false
	};
}
customElements.define("todo-item", TodoItem);

const todo = new TodoItem({ name: "go grocery shopping" });
todo.initialize(); // `initialize` must be called for properties to be defined correctly

todo.name; // -> "go grocery shopping"
todo.completed; // -> false
```

> Note: to see all the options supported by `define`, see [can-define-object].

@signature `static get define() { return { ... } }`

For browsers that do not support class fields (and applications not using a transpiler), properties can be defined using a `static` getter like shown below.

```js
class TodoItem extends StacheDefineElement {
	static get define() {
		return {
			name: String,
			completed: false
		};
	}
}
customElements.define("todo-item", TodoItem);

const todo = new TodoItem({ name: "go grocery shopping" });
todo.initialize(); // `initialize` must be called for properties to be defined correctly

todo.name; // -> "go grocery shopping"
todo.completed; // -> false
```

> Note: to see all the options supported by `define`, see [can-define-object].
