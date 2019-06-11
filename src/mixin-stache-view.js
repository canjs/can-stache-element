"use strict";

const stache = require("can-stache");

// make sure bindings work
require("can-stache-bindings");

const rendererSymbol = Symbol.for("can.stacheRenderer");

module.exports = function mixinStacheView(Base = HTMLElement) {
	return class StacheClass extends Base {
		render(props, renderOptions, parentNodeList) {
			if(super.render) {
				super.render(props);
			}

			let renderer = this.constructor[rendererSymbol];

			if (!renderer) {
				const view = this.constructor.view;

				renderer = typeof view === "function" ?
					view :
					stache(view || "");

				this.constructor[rendererSymbol] = renderer;
			}

			const frag = renderer(this, renderOptions, parentNodeList);
			const viewRoot = this.viewRoot || this;
			viewRoot.appendChild( frag );
		}
	};
};
