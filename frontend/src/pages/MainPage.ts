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
			en: "English", // 영어
			ko: "한국어", // 한국어
			ja: "日本語", // 일본어
			zh: "中文", // 중국어
			es: "Español", // 스페인어
			de: "Deutsch", // 독일어
			fr: "Français", // 프랑스어
			ru: "Русский", // 러시아어
			it: "Italiano", // 이탈리아어
			pt: "Português", // 포르투갈어
			nl: "Nederlands", // 네덜란드어
			hi: "हिन्दी", // 힌디어
			ar: "العربية", // 아랍어
			tr: "Türkçe", // 터키어
			pl: "Polski", // 폴란드어
			vi: "Tiếng Việt", // 베트남어
			th: "ไทย", // 태국어
			sv: "Svenska", // 스웨덴어
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
