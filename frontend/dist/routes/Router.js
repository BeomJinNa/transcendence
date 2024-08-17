import MainPage from "../pages/MainPage.js";
import LoginPage from "../pages/LoginPage.js";
import SignupPage from "../pages/SignupPage.js";
import GamePage from "../pages/GamePage.js";
import AuthService from "../auth/AuthService.js";
import LocalAuthProvider from "../auth/LocalAuthProvider.js";
import I18n from "../localization/I18n.js";
const authService = new AuthService(new LocalAuthProvider());
class Router {
    constructor() {
        this.routes = {
            "/": this.loadPage(MainPage),
            "/login": this.loadPage(LoginPage),
            "/signup": this.loadPage(SignupPage),
        };
        this.restrictedRoutes = {
            "/game": this.restrictedRoute(GamePage),
        };
    }
    init(app) {
        window.onpopstate = () => this.handleRoute(app);
        this.handleRoute(app);
    }
    handleRoute(app) {
        const path = window.location.pathname;
        if (this.restrictedRoutes[path]) {
            this.restrictedRoutes[path](app);
        }
        else {
            const route = this.routes[path] || this.loadPage(MainPage);
            this.loadAndPushState(route, app);
        }
    }
    loadAndPushState(route, app) {
        route(app);
        window.history.pushState({}, "", window.location.pathname);
    }
    loadPage(PageComponent) {
        return (app) => {
            const page = new PageComponent();
            app.innerHTML = "";
            app.appendChild(page.render());
        };
    }
    restrictedRoute(PageComponent) {
        return (app) => {
            if (authService.isAuthenticated()) {
                this.loadAndPushState(this.loadPage(PageComponent), app);
            }
            else {
                alert(I18n.t("youMustBeLoggedIn"));
                this.loadAndPushState(this.loadPage(LoginPage), app);
            }
        };
    }
}
export default new Router();
