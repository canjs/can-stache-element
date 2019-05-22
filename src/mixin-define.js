const { mixinElement } = require("can-define-mixin");

module.exports = function mixinDefine(Base = HTMLElement) {
	return class DefinedClass extends mixinElement(Base) {
		intialize(props) {
			super.intialize(props);
		}
	};
};
