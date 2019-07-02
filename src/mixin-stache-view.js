"use strict";

const stache = require("can-stache");
const nodeLists = require("can-view-nodelist");
const childNodes = require("can-child-nodes");
const domMutateNode = require("can-dom-mutate/node");

// make sure bindings work
require("can-stache-bindings");

const rendererSymbol = Symbol.for("can.stacheRenderer");
const metaSymbol = Symbol.for("can.meta");
const viewInsertSymbol = Symbol.for("can.viewInsert");

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

			const meta = ensureMeta(this);
			const nodeList = meta._nodeList = nodeLists.register([], () => {
				// if disconnect called unregister, don't call disconnect again
				if (meta.skipDisconnect) {
					return;
				}
				meta.skipNodeListUnregister = true;
				this.disconnect();
				meta.skipNodeListUnregister = false;
			}, parentNodeList || true, false);
			nodeList.expression = "<" + this.localName + ">";
			const frag = renderer(this, renderOptions, nodeList);

			const viewRoot = this.viewRoot || this;
			domMutateNode.appendChild.call(viewRoot, frag);
			nodeLists.update(nodeList, childNodes(viewRoot));

			// if element has already been inserted into the view,
			// add its nodelist to the parent nodelist after rendering
			if (meta._viewDataNodeList) {
				meta._viewDataNodeList.newDeepChildren.push(nodeList);
			}
		}
		disconnect(){
			const meta = this[metaSymbol];
			// if unregister called disconnect, don't call unregister again
			if(meta._nodeList && !meta.skipNodeListUnregister) {
				meta.skipDisconnect = true;
				nodeLists.unregister(meta._nodeList);
				meta.skipDisconnect = false;

				meta._nodeList = null;
			}

			if(super.disconnect) {
				super.disconnect();
			}
		}

		[viewInsertSymbol](viewData) {
			const meta = ensureMeta(this);
			const nodeList = meta._nodeList;

			// if element has already been rendered, add its nodeList
			// to the new parentNodeList.
			// Otherwise, store the parent nodelist so the element's
			// nodelist can be added to it in render.
			if (nodeList) {
				viewData.nodeList.newDeepChildren.push(nodeList);
			} else {
				meta._viewDataNodeList = viewData.nodeList;
			}
			return this;
		}
	};
};
