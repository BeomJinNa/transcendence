import I18n from "../localization/I18n.js";
import AuthService from "../auth/AuthService.js";
import { createLabel, createInput, createButton } from "./formUtils.js";

export default class LoginPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/LoginPage.css";
		document.head.appendChild(link);

		const heading = document.createElement("h1");
		heading.textContent = I18n.t("loginPageTitle");
		container.appendChild(heading);

		const form = this.createLoginForm();
		container.appendChild(form);

		return container;
	}

	private createLoginForm(): HTMLElement {
		const form = document.createElement("form");

		const emailLabel = createLabel(I18n.t("emailLabel"));
		const emailInput = createInput("email");
		const passwordLabel = createLabel(I18n.t("passwordLabel"));
		const passwordInput = createInput("password");
		const submitButton = createButton(I18n.t("loginButton"), async () => {
			const email = (
				form.querySelector('input[type="email"]') as HTMLInputElement
			).value;
			const password = (
				form.querySelector('input[type="password"]') as HTMLInputElement
			).value;

			const success = await AuthService.getInstance().login(email, password);

			if (success) {
				alert(I18n.t("loginSuccess"));
				window.location.href = "/";
			} else {
				alert(I18n.t("loginFailed"));
			}
		});

		form.appendChild(emailLabel);
		form.appendChild(emailInput);
		form.appendChild(passwordLabel);
		form.appendChild(passwordInput);
		form.appendChild(submitButton);

		return form;
	}
}
