export default class LoginPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/LoginPage.css";
		document.head.appendChild(link);

		//HEAD
		const heading = document.createElement("h1");
		heading.textContent = "Login Page";
		container.appendChild(heading);

		//BODY
		const form = this.createLoginForm();
		container.appendChild(form);

		return container;
	}

	private createLoginForm(): HTMLElement {
		const form = document.createElement("form");

		const emailLabel = this.createLabel("Email:");
		const emailInput = this.createInput("email");
		const passwordLabel = this.createLabel("Password:");
		const passwordInput = this.createInput("password");
		const submitButton = this.createButton("Login");

		form.appendChild(emailLabel);
		form.appendChild(emailInput);
		form.appendChild(passwordLabel);
		form.appendChild(passwordInput);
		form.appendChild(submitButton);

		return form;
	}

	private createLabel(text: string): HTMLElement {
		const label = document.createElement("label");
		label.textContent = text;
		return label;
	}

	private createInput(type: string): HTMLInputElement {
		const input = document.createElement("input");
		input.type = type;
		return input;
	}

	private createButton(text: string): HTMLButtonElement {
		const button = document.createElement("button");
		button.type = "submit";
		button.textContent = text;
		return button;
	}
}
