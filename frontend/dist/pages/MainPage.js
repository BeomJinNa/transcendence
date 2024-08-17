import I18n from "../localization/I18n.js";
import StateManager from "../userState/StateManager.js";
export default class MainPage {
    render() {
        const container = document.createElement("div");
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/css/MainPage.css";
        document.head.appendChild(link);
        //HEAD
        const heading = document.createElement("h1");
        heading.textContent = I18n.t("mainPageTitle");
        container.appendChild(heading);
        //BODY
        const isAuthenticated = StateManager.getState("isAuthenticated");
        if (!isAuthenticated) {
            const loginLink = this.createLink("/login", I18n.t("login"));
            const signupLink = this.createLink("/signup", I18n.t("signup"));
            container.appendChild(loginLink);
            container.appendChild(signupLink);
        }
        else {
            const gameLink = this.createLink("/game", I18n.t("game"));
            container.appendChild(gameLink);
        }
        return container;
    }
    createLink(href, text) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = text;
        link.style.display = "block";
        return link;
    }
}
