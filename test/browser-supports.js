module.exports = {
	customElements: "customElements" in window,
	shadowDom: typeof document.body.attachShadow === "function"
};
