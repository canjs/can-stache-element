const { mixinElement } = require("can-define-mixin");

function restoreBaseMethods(instance, Base, methods) {
	for (let method of methods) {
		if (method in Base.prototype) {
			instance[method] = Base.prototype[method].bind(instance);
		}
	}
}

module.exports = function mixinDefine(Base = HTMLElement) {
	return class DefinedClass extends mixinElement(Base) {
		constructor() {
			super();

			// These methods are created on the instance by finalizeClass
			// so they have to be restored on each instance, instead of once on the prototype
			restoreBaseMethods(this, Base, ["addEventListener", "removeEventListener"]);
		}

		intialize(props) {
			super.intialize(props);
		}
	};
};
