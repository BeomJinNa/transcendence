import I18n from "../localization/I18n.js";
export default class SignupPage {
    render() {
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
    createSignupForm() {
        const form = document.createElement("form");
        const emailLabel = this.createLabel(I18n.t("emailLabel"));
        const emailInput = this.createInput("email");
        const passwordLabel = this.createLabel(I18n.t("passwordLabel"));
        const passwordInput = this.createInput("password");
        const submitButton = this.createButton(I18n.t("signupButton"));
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
