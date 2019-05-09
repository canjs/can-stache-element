"use strict";

var canSymbol = require("can-symbol");
var defineLazyValue = require("can-define-lazy-value");

var lifecycleStatusSymbol = canSymbol.for("can.lifecycleStatus");

function callLifecycleMethod(instance, methodName, statusName, status = true) {
  if (typeof instance[methodName] === "function") {
    instance[methodName]();
  }
  instance[lifecycleStatusSymbol][statusName] = status;
}

module.exports = function extendWithLifecycleMethods(BaseElement = HTMLElement) {
  var baseConnectedCallback = BaseElement.prototype.connectedCallback;
  var baseDisconnectedCallback = BaseElement.prototype.disconnectedCallback;

  class LifeCycleElement extends BaseElement {
    constructor() {
      super();
      callLifecycleMethod(this, "construct", "constructed");
    }

    connectedCallback() {
      callLifecycleMethod(this, "initialize", "initialized");
      callLifecycleMethod(this, "render", "rendered");
      callLifecycleMethod(this, "connect", "connected");

      if (typeof baseConnectedCallback === "function") {
        baseConnectedCallback.apply(this, arguments);
      }
    }

    disconnectedCallback() {
      callLifecycleMethod(this, "disconnect", "connected", false);

      if (typeof baseDisconnectedCallback === "function") {
        baseDisconnectedCallback.apply(this, arguments);
      }
    }
  }

  defineLazyValue(LifeCycleElement.prototype, lifecycleStatusSymbol, function() {
    return {
      constructed: false,
      initialized: false,
      rendered: false,
      connected: false
    };
  });

  return LifeCycleElement;
};
