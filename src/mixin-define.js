const { mixinElement } = require("can-define-mixin");
const canReflect = require("can-reflect");
const canLogDev = require("can-log/dev/dev");
const eventTargetInstalledSymbol = Symbol.for("can.eventTargetInstalled");

module.exports = function mixinDefine(Base = HTMLElement) {
	const realAddEventListener = Base.prototype.addEventListener;
	const realRemoveEventListener = Base.prototype.removeEventListener;

	function installEventTarget(Type) {
		if(Type[eventTargetInstalledSymbol]) {
			return;
		}
		const eventQueueAddEventListener = Type.prototype.addEventListener;
		const eventQueueRemoveEventListener = Type.prototype.removeEventListener;
		Type.prototype.addEventListener = function() {
			eventQueueAddEventListener.apply(this, arguments);
			return realAddEventListener.apply(this, arguments);
		};
		Type.prototype.removeEventListener = function() {
			eventQueueRemoveEventListener.apply(this, arguments);
			return realRemoveEventListener.apply(this, arguments);
		};
		Type[eventTargetInstalledSymbol] = true;

		// Warn on special properties
		//!steal-remove-start
		if(process.env.NODE_ENV !== 'production') {
			let defines = typeof Type.define === "object" ? Type.define : {};
			canReflect.eachKey(defines, function(value, key) {
				if("on" + key in Type.prototype) {
					canLogDev.warn(`${canReflect.getName(Type)}: The defined property [${key}] matches the name of a DOM event. This property could update unexpectedly. Consider renaming.`);
				}
			});
		}
		//!steal-remove-end
	}

	class DefinedClass extends mixinElement(Base) {
		constructor() {
			super();
			installEventTarget(this.constructor);
		}

		intialize(props) {
			super.intialize(props);
		}
	}

	return DefinedClass;
};
