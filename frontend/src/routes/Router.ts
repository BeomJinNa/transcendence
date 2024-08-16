import MainPage from "../pages/MainPage.js";
import LoginPage from "../pages/LoginPage.js";
import SignupPage from "../pages/SignupPage.js";
import GamePage from "../pages/GamePage.js";
import AuthService from "../auth/AuthService.js";
import LocalAuthProvider from "../auth/LocalAuthProvider.js";
import I18n from "../localization/I18n.js";

type PageComponentType = { new (): any };
type RouteHandlerType = (app: HTMLElement) => void;
type RoutesType = { [key: string]: RouteHandlerType };

class Router {
	private routes: RoutesType;
	private restrictedRoutes: RoutesType;

	constructor() {
		this.routes = {
			"/": this.loadPage(MainPage),
			"/login": this.loadPage(LoginPage),
			"/signup": this.loadPage(SignupPage),
			"/game": this.loadPage(GamePage), // TEST
		};

		this.restrictedRoutes = {
			//"/game": this.restrictedRoute(GamePage),
		};
	}

	public init(app: HTMLElement) {
		window.onpopstate = () => this.handleRoute(app);
		this.handleRoute(app);
	}

	private handleRoute(app: HTMLElement) {
		const path = window.location.pathname;
		console.log("Current path:", path); // 현재 경로를 로그로 출력

		if (this.restrictedRoutes[path]) {
			console.log("Restricted route detected:", path);
			this.restrictedRoutes[path](app);
		} else {
			const route = this.routes[path] || this.loadPage(MainPage);
			console.log("Loading route for path:", path);
			this.loadAndPushState(route, app);
		}
	}

	private loadAndPushState(route: RouteHandlerType, app: HTMLElement) {
		route(app);
//		window.history.pushState({}, "", window.location.pathname);
	}

	private loadPage(PageComponent: PageComponentType): RouteHandlerType {
		return (app: HTMLElement) => {
			const page = new PageComponent();
			app.innerHTML = "";
			app.appendChild(page.render());
		};
	}

	private restrictedRoute(PageComponent: PageComponentType): RouteHandlerType {
		return (app: HTMLElement) => {
			if (AuthService.isAuthenticated()) {
				this.loadAndPushState(this.loadPage(PageComponent), app);
			} else {
				alert(I18n.t("youMustBeLoggedIn"));
				this.loadAndPushState(this.loadPage(LoginPage), app);
			}
		};
	}
}

export default new Router();
