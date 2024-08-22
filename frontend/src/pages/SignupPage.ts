import I18n from "../localization/I18n";
import AuthService from "../auth/AuthService";
import { createFormGroup, createButton } from "./formUtils";
import Router from "../routes/Router";

export default class SignupPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/SignupPage.css";
		document.head.appendChild(link);

		//HEAD
		const heading = document.createElement("h1");
		heading.textContent = I18n.t("signupPageTitle");
		container.appendChild(heading);

		//BODY
		const form = this.createSignupForm();
		container.appendChild(form);

		return container;
	}

	private createSignupForm(): HTMLElement {
		const form = document.createElement("form");

		const emailGroup = createFormGroup(I18n.t("emailLabel"), "email");
		const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");
		const nicknameGroup = createFormGroup(I18n.t("nicknameLabel"), "text");

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

			const success = await AuthService.getInstance().signup(
				email,
				password,
				nickname
			);

			if (success) {
				alert(I18n.t("signupSuccess"));
				Router.getInstance().navigateTo("/login");
			} else {
				alert(I18n.t("signupFailed"));
			}
		});

		form.appendChild(emailGroup);
		form.appendChild(passwordGroup);
		form.appendChild(nicknameGroup);
		form.appendChild(submitButton);

		return form;
	}
}
