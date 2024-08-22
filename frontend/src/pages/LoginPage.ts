import I18n from "../localization/I18n";
import AuthService from "../auth/AuthService";
import { createFormGroup, createButton } from "./formUtils";
import Router from "../routes/Router";

export default class LoginPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/LoginPage.css";
		document.head.appendChild(link);

		//HEAD
		const heading = document.createElement("h1");
		heading.textContent = I18n.t("loginPageTitle");
		container.appendChild(heading);

		//BODY
		const form = this.createLoginForm();
		container.appendChild(form);

		return container;
	}

	private createLoginForm(): HTMLElement {
		const form = document.createElement("form");

		const emailGroup = createFormGroup(I18n.t("emailLabel"), "email");
		const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");

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
				Router.getInstance().navigateTo("/");
			} else {
				alert(I18n.t("loginFailed"));
			}
		});

		form.appendChild(emailGroup);
		form.appendChild(passwordGroup);
		form.appendChild(submitButton);

		return form;
	}
}
