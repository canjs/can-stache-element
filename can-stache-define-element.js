"use strict";

function DeriveElement(BaseElement = HTMLElement) {
  var StacheDefineElement = function() {
    return Reflect.construct(BaseElement, arguments, this.constructor);
  };

  return StacheDefineElement;
}

module.exports = DeriveElement();
