"use strict";

const stache = require("can-stache");

// make bindings work
require("can-stache-bindings");

module.exports = function mixinStacheView(Base = HTMLElement) {
	return class StacheClass extends Base {
		render() {
			if(super.render) {
				super.render();
			}
			const staticView = this.constructor.view;
			const renderer = stache(staticView/* NODELIST */);
			const frag = renderer(this);
			const viewRoot = this.viewRoot || this;
			viewRoot.appendChild( frag );
		}
	};
};
