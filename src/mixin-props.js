const { mixinElement } = require("can-observable-mixin");
const canReflect = require("can-reflect");
const canLogDev = require("can-log/dev/dev");
const eventTargetInstalledSymbol = Symbol.for("can.eventTargetInstalled");
const serializeSymbol = Symbol.for("can.serialize");

module.exports = function mixinDefine(Base = HTMLElement) {
	const realAddEventListener = Base.prototype.addEventListener;
	const realRemoveEventListener = Base.prototype.removeEventListener;

	function installEventTarget(Type, props) {
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
			Object.keys(props).forEach(function(key) {
				if("on" + key in Type.prototype) {
					canLogDev.warn(`${canReflect.getName(Type)}: The defined property [${key}] matches the name of a DOM event. This property could update unexpectedly. Consider renaming.`);
				}
			});
		}
		//!steal-remove-end
	}

	function installSerialize(Type, props) {
		Type.prototype[serializeSymbol] = function() {
			return Object.keys(props).reduce((acc, prop) => {
				acc[prop] = canReflect.serialize(this[prop]);
				return acc;
			}, {});
		};
	}

	class DefinedClass extends mixinElement(Base) {
		constructor() {
			super();

			// look for `static props`and fall back to `static define` if `props` doesn't exist
			const Type = this.constructor;
			const props = typeof Type.props === "object" ?
				Type.props :
				typeof Type.define === "object" ?
					Type.define :
					{};

			installEventTarget(Type, props);
			installSerialize(Type, props);
		}

		intialize(props) {
			super.intialize(props);
		}
	}

	return DefinedClass;
};
