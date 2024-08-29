import I18n from "../localization/I18n";
import AuthService from "../auth/AuthService";
import { createButton } from "./formUtils";
import Router from "../routes/Router";
import { apiClient } from "../api/ApiClient";
import { OAUTH_42_CLIENT_ID } from "../constants";

async function requestLogin(code: string) {
  let result;
  try {
    result = await apiClient.post("/oauth/", {
      code: code,
      baseurl: window.location.origin,
    });
  } catch (e) {
    alert(I18n.t("loginFailed"));
  }
  if (!result.ok) {
    alert(I18n.t("loginFailed"));
    return;
  }
  if (result.status === 200) {
    alert(I18n.t("checkEmail"));
  }
}

async function handleAccessCodeMessageFromChild(event: MessageEvent) {
  const code = event.data.code;
  await requestLogin(code);
}

export default class LoginPage {
  public render(): HTMLElement {
    console.log("login page - render()");
    const container = document.createElement("div");
    container.classList.add(
      "container",
      "mt-5",
      "d-flex",
      "flex-column",
      "justify-content-center",
      "min-vh-100",
      "text-center",
      "align-items-center"
    );
    // if (AuthService.getInstance().isAuthenticated()) {
    //   Router.getInstance().navigateTo("/");
    //   return container;
    // }
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
    }
    const code = urlParams.get("code");
    if (code) {
      if (window.opener !== null) {
        // 메인 페이지로 코드 전달
        window.opener.postMessage({ code }, "*");
        // 팝업 창 닫기
        window.close();
      } else {
        requestLogin(code);
      }
    }

    const heading = document.createElement("h1");
    heading.textContent = I18n.t("loginPageTitle");
    heading.classList.add("text-center", "mb-4");
    container.appendChild(heading);

    const socialLoginButton = document.createElement("div");
    socialLoginButton.textContent = "42 " + I18n.t("login");
    socialLoginButton.addEventListener("click", () => {
      this.openOauth2Popup();
    });
    socialLoginButton.classList.add("btn", "btn-primary", "w-50", "mt-4");
    container.appendChild(socialLoginButton);

    return container;
  }

  private openOauth2Popup() {
    window.addEventListener("message", handleAccessCodeMessageFromChild, false);
    const clientId = OAUTH_42_CLIENT_ID;
    const redirectURI = `${window.location.origin}/login`;
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code`;
    const popup = window.open(
      authUrl,
      "socialLoginPopup",
      "width=600,height=700"
    );

    if (!popup) {
      window.location.href = authUrl;
      return;
    }
  }

  public cleanup(): void {
    window.removeEventListener(
      "message",
      handleAccessCodeMessageFromChild,
      false
    );
  }
}
