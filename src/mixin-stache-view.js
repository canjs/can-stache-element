"use strict";

const stache = require("can-stache");
const nodeLists = require("can-view-nodelist");
const childNodes = require("can-child-nodes");

// make sure bindings work
require("can-stache-bindings");

const rendererSymbol = Symbol.for("can.stacheRenderer");
const metaSymbol = Symbol.for("can.meta");


function ensureMeta(obj) {
	var meta = obj[metaSymbol];

	if (meta === undefined) {
		meta = {};
		Object.defineProperty(obj, metaSymbol,{
			value: meta,
			enumerable: true
		});
	}

	return meta;
}

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

			const nodeList = ensureMeta(this)._nodeList = nodeLists.register([], function(){}, parentNodeList || true, false);

			const frag = renderer(this, renderOptions, nodeList);

			nodeLists.update(nodeList, childNodes(frag));

			const viewRoot = this.viewRoot || this;

			viewRoot.appendChild( frag );
		}
		disconnect(){
			nodeLists.unregister(this[metaSymbol]._nodeList);
			this[metaSymbol]._nodeList = null;
			if(super.disconnect) {
				super.disconnect();
			}
		}
	};
};
