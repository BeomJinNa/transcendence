import Router from "../routes/Router";

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
	onClick: (event: MouseEvent) => void
): HTMLDivElement {
	const button = document.createElement("div");
	button.textContent = text;
	button.onclick = onClick;
	return button;
}

export function createLink(href: string, text: string): HTMLElement {
	const link = document.createElement("a");
	link.href = href;
	link.textContent = text;
	link.style.display = "block";
	link.addEventListener("click", (event) => {
		event.preventDefault();
		Router.getInstance().navigateTo(href);
	});
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

export function createFormGroup(
	labelText: string,
	inputType: string,
	inputId?: string
): HTMLElement {
	const group = document.createElement("div");
	const label = createLabel(labelText, inputId);
	const input = createInput(inputType, inputId);
	group.appendChild(label);
	group.appendChild(input);
	return group;
}
