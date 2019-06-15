"use strict";

const stache = require("can-stache");
const nodeLists = require("can-view-nodelist");
const childNodes = require("can-child-nodes");

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
			this._nodeList = nodeLists.register([], function(){}, parentNodeList || true, false);
			const frag = renderer(this, renderOptions, this._nodeList);
			nodeLists.update(this._nodeList, childNodes(frag));
			const viewRoot = this.viewRoot || this;
			
			viewRoot.appendChild( frag );
		}
		disconnect(){
			nodeLists.unregister(this._nodeList);
			this._nodeList = null;
			if(super.disconnect) {
				super.disconnect();
			}
		}
	};
};
