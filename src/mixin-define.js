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
			restoreBaseMethods(this, Base, ["addEventListener", "removeEventListener"]);
		}

		intialize(props) {
			super.intialize(props);
		}
	};
};
