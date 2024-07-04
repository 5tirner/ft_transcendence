class MyCustomElement extends HTMLElement {
	constructor() {
		super();
		this._data = null; // Private property to hold the data object
		this.wrapper = document.createElement("li");
		this.wrapper.className =
			"list-group-item d-flex align-items-center justify-content-between px-1";
		this.title = document.createElement("h1");
		this.content = document.createElement("p");
		this.wrapper.appendChild(this.title);
		this.wrapper.appendChild(this.content);
		this.appendChild(this.wrapper);
	}

	set data(value) {
		this._data = value;
		this.updateDOM();
	}

	get data() {
		return this._data;
	}

	updateDOM() {
		if (this._data) {
			this.title.textContent = this._data.title || "Default Title";
			this.content.textContent = this._data.content || "Default Content";
		}
	}

	connectedCallback() {
		console.log("Custom element added to the page.");
	}

	disconnectedCallback() {
		console.log("Custom element removed from the page.");
	}
}

customElements.define("cp-conv", MyCustomElement);
