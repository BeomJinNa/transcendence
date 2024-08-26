import I18n from "../localization/I18n";
import AuthService from "../auth/AuthService";
import { createFormGroup, createButton } from "./formUtils";
import Router from "../routes/Router";
import { apiClient } from "../api/ApiClient";

export default class LoginPage {
  public render(): HTMLElement {
    const container = document.createElement("div");
    // get token from params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("t");
    console.log(token);
    if (token) {
      (async () => {
        const success = await AuthService.getInstance().login(token);
        console.log(success);
        if (success) {
          alert(I18n.t("loginSuccess"));
          Router.getInstance().navigateTo("/");
        } else {
          alert(I18n.t("loginFailed"));
        }
      })();
      // 로딩중 표시
      const loading = document.createElement("div");
      loading.textContent = I18n.t("loading");
      container.appendChild(loading);
      return container;
    }

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

    const emailGroup = createFormGroup(I18n.t("emailLabel"), "username");
    const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");

    const submitButton = createButton(I18n.t("loginButton"), async () => {
      const username = (
        form.querySelector('input[type="username"]') as HTMLInputElement
      ).value;
      const password = (
        form.querySelector('input[type="password"]') as HTMLInputElement
      ).value;

      // const success = await AuthService.getInstance().login(username);
      const result = await apiClient.post("/login/", {
        username: username,
        password,
      });

      if (result.status === 200) {
        alert(I18n.t("check email"));
        // Router.getInstance().navigateTo("/");
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
