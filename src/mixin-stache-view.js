"use strict";

var stache = require("can-stache");

// make bindings work
require("can-stache-bindings");

module.exports = function mixinStacheView(Class) {
  var origRender = Class.prototype.render;

  Class.prototype.render = function() {
    if (typeof origRender === "function") {
      origRender.apply(this, arguments);
    }

    // stache render
    var staticView = this.constructor.view;
    var renderer = stache(staticView);
    var frag = renderer(this);
    var viewRoot = this.viewRoot || this;
    viewRoot.appendChild( frag );
  };
};
