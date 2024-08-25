import I18n from "../localization/I18n";
import { createLink, createButton, createSelect } from "./formUtils";
import AuthService from "../auth/AuthService";
import Router from "../routes/Router";

export default class MainPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/MainPage.css";
		document.head.appendChild(link);

		const heading = document.createElement("h1");
		heading.textContent = I18n.t("mainPageTitle");
		container.appendChild(heading);

		container.appendChild(this.createLanguageSelector());

		const isAuthenticated = AuthService.getInstance().isAuthenticated();

		if (!isAuthenticated) {
			container.appendChild(createLink("/login", I18n.t("login")));
			container.appendChild(createLink("/signup", I18n.t("signup")));
		} else {
			container.appendChild(createLink("/game", I18n.t("game")));
			container.appendChild(this.createLogoutButton());
		}

		return container;
	}

	private createLogoutButton(): HTMLElement {
		return createButton(I18n.t("logoutButton"), () => {
			AuthService.getInstance().logout();
			Router.getInstance().navigateTo("/login");
		});
	}

	private createLanguageSelector(): HTMLElement {
		const languages: { [key: string]: string } = {
			en: "English",
			ko: "한국어",
			es: "Español",
			zh: "中文",
			fr: "Français",
			de: "Deutsch",
		};

		const select = createSelect(
			Object.keys(languages).map((lang) => ({
				value: lang,
				text: languages[lang],
			}))
		);

		select.value = I18n.getLocale();
		select.addEventListener("change", async (event) => {
			const selectedLanguage = (event.target as HTMLSelectElement).value;
			await I18n.setLocale(selectedLanguage);
			Router.getInstance().navigateTo("/");
		});

		return select;
	}
}
