var stealTools = require("steal-tools");

var esBuilds = stealTools.export({
	steal: {
		config: __dirname + "/package.json!npm",
		main: "can-stache-element"
	},
	options: {
		useNormalizedDependencies: false,
		verbose: true
	},
	outputs: {
		"+bundled-es": {
			modules: ["can-stache-element"],
			addProcessShim: true,
			dest: __dirname + "/core.mjs",
			removeDevelopmentCode: false
		},
		"+bundled-es minified": {
			modules: ["can-stache-element"],
			addProcessShim: true,
			minify: true,
			dest: __dirname + "/core.min.mjs"
		}
	}
});

Promise.all([esBuilds]).catch(function(e){

	setTimeout(function(){
		throw e;
	},1);

});
