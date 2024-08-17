var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import I18n from "../localization/I18n.js";
import AuthService from "../auth/AuthService.js";
import LocalAuthProvider from "../auth/LocalAuthProvider.js";
export default class LoginPage {
    render() {
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
        // Add event listener for form submission
        form.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault(); // Prevent default form submission
            const email = form.querySelector('input[type="email"]').value;
            const password = form.querySelector('input[type="password"]').value;
            const success = yield AuthService.getInstance(new LocalAuthProvider()).login(email, password);
            if (success) {
                alert(I18n.t("loginSuccess"));
                // Redirect to the main page or any other page
                window.location.href = "/"; // 예시로 메인 페이지로 리디렉션
            }
            else {
                alert(I18n.t("loginFailed"));
            }
        }));
        return container;
    }
    createLoginForm() {
        const form = document.createElement("form");
        const emailLabel = this.createLabel(I18n.t("emailLabel"));
        const emailInput = this.createInput("email");
        const passwordLabel = this.createLabel(I18n.t("passwordLabel"));
        const passwordInput = this.createInput("password");
        const submitButton = this.createButton(I18n.t("loginButton"));
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        form.appendChild(passwordLabel);
        form.appendChild(passwordInput);
        form.appendChild(submitButton);
        return form;
    }
    createLabel(text) {
        const label = document.createElement("label");
        label.textContent = text;
        return label;
    }
    createInput(type) {
        const input = document.createElement("input");
        input.type = type;
        return input;
    }
    createButton(text) {
        const button = document.createElement("button");
        button.type = "submit";
        button.textContent = text;
        return button;
    }
}
