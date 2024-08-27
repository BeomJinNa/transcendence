import I18n from "../localization/I18n";
import AuthService from "../auth/AuthService";
import { createFormGroup, createButton } from "./formUtils";
import Router from "../routes/Router";
import { apiClient } from "../api/ApiClient";

function requestLogin(code: string) {
  console.log('TODO : implement requestLogin in LoginPage.ts');
  console.log('How to : send code to server');
  // apiClient.post('/login', { code: code });
  console.log(code);
}

window.addEventListener(
  "message",
  (event) => {
    const code = event.data.code;
    requestLogin(code);
  },
  false,
);

function openPopup() {
  const authUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-20882ed4d4fc21b4e8d887c98605a3938b6f22bb038688bdd74c25a676519018&redirect_uri=http%3A%2F%2Flocalhost%2Flogin&response_type=code';
  const popup = window.open(
      authUrl,
      'socialLoginPopup',
      'width=600,height=700'
  );

  if (!popup) {
      window.location.href = authUrl;
      return;
  }
}

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
    const code = urlParams.get("code");
    if (code) {
      if (window.opener !== null) {
        // 메인 페이지로 코드 전달
        window.opener.postMessage({ code }, '*');
        // 팝업 창 닫기
        window.close();
      }
      else {
        requestLogin(code);
      }
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

    const socialLoginButton = document.createElement('div');
    socialLoginButton.textContent = I18n.t("42");
    socialLoginButton.addEventListener('click', function() {
        openPopup();
        const waitdiv = document.createElement('div');
        waitdiv.textContent = 'waiting...';
        container.appendChild(waitdiv);
    });
    container.appendChild(socialLoginButton);

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
