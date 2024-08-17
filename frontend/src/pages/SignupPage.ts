import I18n from "../localization/I18n.js";
import AuthService from "../auth/AuthService.js";
import { createLabel, createInput, createButton } from "./formUtils.js";

export default class SignupPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/SignupPage.css";
		document.head.appendChild(link);

		const heading = document.createElement("h1");
		heading.textContent = I18n.t("signupPageTitle");
		container.appendChild(heading);

		const form = this.createSignupForm();
		container.appendChild(form);

		return container;
	}

	private createSignupForm(): HTMLElement {
		const form = document.createElement("form");

		const emailLabel = createLabel(I18n.t("emailLabel"));
		const emailInput = createInput("email");
		const passwordLabel = createLabel(I18n.t("passwordLabel"));
		const passwordInput = createInput("password");
		const nicknameLabel = createLabel(I18n.t("nicknameLabel"));
		const nicknameInput = createInput("text");
		const submitButton = createButton(I18n.t("signupButton"), async () => {
			const email = (
				form.querySelector('input[type="email"]') as HTMLInputElement
			).value;
			const password = (
				form.querySelector('input[type="password"]') as HTMLInputElement
			).value;
			const nickname = (
				form.querySelector('input[type="text"]') as HTMLInputElement
			).value;

			const success = await AuthService.getInstance().signup(email, password, nickname);

			if (success) {
				alert(I18n.t("signupSuccess"));
				window.location.href = "/login";
			} else {
				alert(I18n.t("signupFailed"));
			}
		});

		form.appendChild(emailLabel);
		form.appendChild(emailInput);
		form.appendChild(passwordLabel);
		form.appendChild(passwordInput);
		form.appendChild(nicknameLabel);
		form.appendChild(nicknameInput);
		form.appendChild(submitButton);

		return form;
	}
}
