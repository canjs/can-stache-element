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

			const teardown = () => {
				console.log('teardown?')
				//debugger;
				//this.disconnect();
			};
			console.log("HAS PARENT", parentNodeList);

			const nodeList = ensureMeta(this)._nodeList = nodeLists.register([],
				teardown, parentNodeList || true, false);
			nodeList.expression = "<" + this.localName + ">";
			const frag = renderer(this, renderOptions, nodeList);

			const viewRoot = this.viewRoot || this;
			domMutateNode.appendChild.call(viewRoot, frag);
			nodeLists.update(nodeList, childNodes(viewRoot));
		}
		disconnect(){
			const meta = this[metaSymbol];
			if(meta._nodeList) {
				nodeLists.unregister(meta._nodeList);
				meta._nodeList = null;
			}

			if(super.disconnect) {
				super.disconnect();
			}
		}

		[viewInsertSymbol](viewData) {
			let nodeList = ensureMeta(this)._nodeList;
			console.log('viewInsert');
			viewData.nodeList.newDeepChildren.push(nodeList);
			return this;
		}
	};
};
