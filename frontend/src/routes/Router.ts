import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import GamePage from "../pages/GamePage";
import AuthService from "../auth/AuthService";
import I18n from "../localization/I18n";

type PageComponentType = { new (): any; cleanup?: () => void };
type RouteHandlerType = () => { component: HTMLElement; pageInstance: any };

type RoutesType = Record<
	string,
	{
		handler: RouteHandlerType;
		restricted?: boolean;
		restrictedIfAuthenticated?: boolean;
	}
>;

class Router {
	private routes: RoutesType;
	private app: HTMLElement;
	private currentPageInstance: any = null;
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
				restrictedIfAuthenticated: true, // 로그인 상태에서 접근 제한
			},
			"/game": {
				handler: this.loadPage(GamePage),
				restricted: true, // 로그인이 필요한 페이지
			},
		};

		history.replaceState(null, "", document.location.href);
		this.render(window.location.pathname);

		window.addEventListener("popstate", () => {
			this.render(window.location.pathname);
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

	public setCurrentPageInstance(pageInstance: any) {
		this.currentPageInstance = pageInstance;
	}

	public getCurrentPageInstance() {
		return this.currentPageInstance;
	}

	private render(path: string) {
		const route = this.routes[path] || this.routes["/"];

		if (route.restricted && !this.authService.isAuthenticated()) {
			alert(I18n.t("youMustBeLoggedIn"));
			this.navigateTo(this.pathToRedirect);
			return;
		}

		if (route.restrictedIfAuthenticated && this.authService.isAuthenticated()) {
			this.navigateTo("/");
			return;
		}

		if (this.currentPageInstance && this.currentPageInstance.cleanup) {
			this.currentPageInstance.cleanup();
		}

		const { component, pageInstance } = route.handler();

		this.currentPageInstance = pageInstance;

		this.app.innerHTML = "";
		this.app.appendChild(component);
	}

	private loadPage(PageComponent: PageComponentType): RouteHandlerType {
		return () => {
			const pageInstance = new PageComponent();
			return { component: pageInstance.render(), pageInstance };
		};
	}
}

export default Router;
