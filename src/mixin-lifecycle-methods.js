"use strict";

var canSymbol = require("can-symbol");

var lifecycleStatusSymbol = canSymbol.for("can.lifecycleStatus");

function addLifecycleStatusSymbol(instance) {
	Object.defineProperty(instance, lifecycleStatusSymbol, {
		value: {
			constructed: false,
			initialized: false,
			rendered: false,
			connected: false
		},
		enumerable: false
	});
}

function callLifecycleMethod(instance, methodName, statusName, status = true) {
	if (typeof instance[methodName] === "function") {
		instance[methodName]();
	}
	instance[lifecycleStatusSymbol][statusName] = status;
}

module.exports = function mixinLifecycleMethods(BaseElement = HTMLElement) {
	return class LifeCycleElement extends BaseElement {
		constructor() {
			super();
			addLifecycleStatusSymbol(this);
			callLifecycleMethod(this, "construct", "constructed");
		}

		connectedCallback() {
			callLifecycleMethod(this, "initialize", "initialized");
			callLifecycleMethod(this, "render", "rendered");
			callLifecycleMethod(this, "connect", "connected");
		}

		disconnectedCallback() {
			callLifecycleMethod(this, "disconnect", "connected", false);
		}
	};
};
