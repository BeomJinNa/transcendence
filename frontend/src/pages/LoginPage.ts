import I18n from "../localization/I18n";
import AuthService from "../auth/AuthService";
import { createFormGroup, createButton } from "./formUtils";
import Router from "../routes/Router";
import { apiClient } from "../api/ApiClient";

export default class LoginPage {
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
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("t");
		if (token) {
			(async () => {
				const success = await AuthService.getInstance().login(token);
				if (success) {
					alert(I18n.t("loginSuccess"));
					Router.getInstance().navigateTo("/");
				} else {
					alert(I18n.t("loginFailed"));
				}
			})();
			const loading = document.createElement("div");
			loading.textContent = I18n.t("loading");
			loading.classList.add("text-center", "mt-5");
			container.appendChild(loading);
			return container;
		}

		const heading = document.createElement("h1");
		heading.textContent = I18n.t("loginPageTitle");
		heading.classList.add("text-center", "mb-4");
		container.appendChild(heading);

		const form = this.createLoginForm();
		form.classList.add("w-50", "mx-auto");

		form.appendChild(this.createBackButton());
		container.appendChild(form);

		return container;
	}

	private createLoginForm(): HTMLElement {
		const form = document.createElement("form");

		const usernameGroup = createFormGroup(I18n.t("nicknameLabel"), "username");
		const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");

		const submitButton = createButton(I18n.t("loginButton"), async () => {
			const username = (
				form.querySelector('input[type="username"]') as HTMLInputElement
			).value;
			const password = (
				form.querySelector('input[type="password"]') as HTMLInputElement
			).value;

			try {
				const result = await apiClient.post("/login/", {
					username: username,
					password,
					baseurl: window.location.origin,
				});
				if (result.status === 200) {
					alert(I18n.t("loginSuccess"));
					Router.getInstance().navigateTo("/");
				} else {
					alert(I18n.t("loginFailed"));
				}
			} catch (e) {
				alert(I18n.t("loginFailed"));
			}
		});

		usernameGroup.classList.add("mb-3");
		passwordGroup.classList.add("mb-3");
		submitButton.classList.add("btn", "btn-primary", "w-50");

		form.appendChild(usernameGroup);
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
