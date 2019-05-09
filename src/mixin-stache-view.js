"use strict";

var stache = require("can-stache");

// make bindings work
require("can-stache-bindings");

module.exports = function mixinStacheView(Base = HTMLElement) {
  return class StacheClass extends Base {
    render() {
      // stache render
      var staticView = this.constructor.view;
      var renderer = stache(staticView);
      var frag = renderer(this);
      var viewRoot = this.viewRoot || this;
      viewRoot.appendChild( frag );
    }
  };
};
