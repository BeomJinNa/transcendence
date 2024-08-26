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

    const heading = document.createElement("h1");
    heading.textContent = I18n.t("signupPageTitle");
    container.appendChild(heading);

    const form = this.createSignupForm();
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

    form.appendChild(usernameGroup);
    form.appendChild(emailGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitButton);

    return form;
  }
}
