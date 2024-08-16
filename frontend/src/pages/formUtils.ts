export function createLabel(text: string, htmlFor?: string): HTMLElement {
	const label = document.createElement("label");
	label.textContent = text;
	if (htmlFor) {
		label.htmlFor = htmlFor;
	}
	return label;
}

export function createInput(type: string, id?: string): HTMLInputElement {
	const input = document.createElement("input");
	input.type = type;
	if (id) {
		input.id = id;
	}
	return input;
}

export function createButton(
	text: string,
	onClick: () => void
): HTMLButtonElement {
	const button = document.createElement("button");
	button.textContent = text;
	button.onclick = onClick;
	return button;
}

export function createLink(href: string, text: string): HTMLElement {
	const link = document.createElement("a");
	link.href = href;
	link.textContent = text;
	link.style.display = "block";
	return link;
}

export function createSelect(
	options: { value: string; text: string }[]
): HTMLSelectElement {
	const select = document.createElement("select");
	options.forEach((optionData) => {
		const option = document.createElement("option");
		option.value = optionData.value;
		option.textContent = optionData.text;
		select.appendChild(option);
	});
	return select;
}
