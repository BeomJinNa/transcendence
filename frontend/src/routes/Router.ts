import MainPage from "../pages/MainPage.js";
import LoginPage from "../pages/LoginPage.js";
import SignupPage from "../pages/SignupPage.js";
import GamePage from "../pages/GamePage.js";
import AuthService from "../auth/AuthService.js";
import I18n from "../localization/I18n.js";

type PageComponentType = { new (): any };
type RouteHandlerType = () => HTMLElement;

type RoutesType = Record<
	string,
	{
		handler: RouteHandlerType;
		restricted?: boolean;
	}
>;

class Router {
	private routes: RoutesType;
	private app: HTMLElement;
	private pathToRedirect: string = "/login";
	private authService: AuthService;
  private static instance: Router | null = null;

	constructor() {
    const app = document.getElementById("app");
    if (!app) {
      throw new Error("Element with id 'app' not found");
    }
		this.app = app;
		this.authService = AuthService.getInstance();
		this.routes = {
			"/": {
				handler: this.loadPage(MainPage),
			},
			"/login": {
				handler: this.loadPage(LoginPage),
			},
			"/signup": {
				handler: this.loadPage(SignupPage),
			},
			"/game": {
				handler: this.loadPage(GamePage),
				restricted: true,
			},
		};

		history.replaceState(null, "", document.location.href);
		this.render(window.location.pathname);

		window.addEventListener("popstate", (event) => {
			this.render(window.location.pathname);
		});
		document.addEventListener("click", (event) => {
			if (event.target instanceof HTMLAnchorElement) {
				event.preventDefault();
				const path = new URL(event.target.href).pathname;
				this.navigateTo(path);
			}
		});
	}

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

	public navigateTo(path: string) {
		history.pushState(null, "", path);
		this.render(path);
	}

	private render(path: string) {
		const route = this.routes[path] || this.routes["/"];
		let component: HTMLElement;
		if (route.restricted) {
			if (!this.authService.isAuthenticated()) {
				alert(I18n.t("youMustBeLoggedIn"));
				this.navigateTo(this.pathToRedirect);
				return;
			} else {
				component = route.handler();
			}
		} else {
			component = route.handler();
		}
		this.app.innerHTML = "";
		this.app.appendChild(component);
	}

	private loadPage(PageComponent: PageComponentType): RouteHandlerType {
		return () => {
			const page = new PageComponent();
			return page.render();
		};
	}
}

export default Router;
