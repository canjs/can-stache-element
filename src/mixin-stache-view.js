"use strict";

const stache = require("can-stache");

// make sure bindings work
require("can-stache-bindings");

module.exports = function mixinStacheView(Base = HTMLElement) {
	return class StacheClass extends Base {
		render(props, renderOptions, parentNodeList) {
			if(super.render) {
				super.render(props);
			}

			// should cache this
			const staticView = this.constructor.view;
			const renderer = stache(staticView);

			const frag = renderer(this, renderOptions, parentNodeList);
			const viewRoot = this.viewRoot || this;
			viewRoot.appendChild( frag );
		}
	};
};
