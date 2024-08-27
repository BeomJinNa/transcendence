import I18n from "../localization/I18n";
import AuthService from "../auth/AuthService";
import { createFormGroup, createButton } from "./formUtils";
import Router from "../routes/Router";

export default class SignupPage {
	public render(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add(
			"container",
			"mt-5",
			"d-flex",
			"flex-column",
			"justify-content-center",
			"min-vh-100",
			"text-center"
		);
		const heading = document.createElement("h1");
		heading.textContent = I18n.t("signupPageTitle");
		heading.classList.add("text-center", "mb-4");
		container.appendChild(heading);

		const form = this.createSignupForm();
		form.classList.add("w-50", "mx-auto");
		form.appendChild(this.createBackButton());
		container.appendChild(form);

		return container;
	}

	private createSignupForm(): HTMLElement {
		const form = document.createElement("form");

		const usernameGroup = createFormGroup(I18n.t("nicknameLabel"), "username");
		const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");
		const emailGroup = createFormGroup(I18n.t("emailLabel"), "email");

		const submitButton = createButton(I18n.t("signupButton"), async () => {
			const username = (
				form.querySelector('input[type="username"]') as HTMLInputElement
			).value;
			const password = (
				form.querySelector('input[type="password"]') as HTMLInputElement
			).value;
			const email = (
				form.querySelector('input[type="email"]') as HTMLInputElement
			).value;

			const success = await AuthService.getInstance().signup(
				email,
				password,
				username
			);

			if (success) {
				alert(I18n.t("signupSuccess"));
				Router.getInstance().navigateTo("/login");
			} else {
				alert(I18n.t("signupFailed"));
			}
		});

		usernameGroup.classList.add("mb-3");
		passwordGroup.classList.add("mb-3");
		emailGroup.classList.add("mb-3");
		submitButton.classList.add("btn", "btn-primary", "w-50");

		form.appendChild(usernameGroup);
		form.appendChild(emailGroup);
		form.appendChild(passwordGroup);
		form.appendChild(submitButton);

		return form;
	}

	private createBackButton(): HTMLElement {
		const backButtonWrapper = document.createElement("div");
		const backButton = createButton(I18n.t("backToMainButton"), () => {
			Router.getInstance().navigateTo("/");
		});
		backButton.classList.add("btn", "btn-secondary", "mt-4", "w-50");

		backButtonWrapper.appendChild(backButton);
		return backButtonWrapper;
	}
}
