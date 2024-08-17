import I18n from "../localization/I18n";
import StateManager from "../userState/StateManager";
import { createLink, createButton, createSelect } from "./formUtils";
import AuthService from "../auth/AuthService";

export default class MainPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/MainPage.css";
		document.head.appendChild(link);

		// HEAD
		const heading = document.createElement("h1");
		heading.textContent = I18n.t("mainPageTitle");
		container.appendChild(heading);

		// BODY
		container.appendChild(this.createLanguageSelector());

		const isAuthenticated = StateManager.getState("isAuthenticated");

		if (!isAuthenticated) {
			container.appendChild(createLink("/login", I18n.t("login")));
			container.appendChild(createLink("/signup", I18n.t("signup")));
			container.appendChild(createLink("/game", I18n.t("game"))); //TEST
		} else {
			container.appendChild(createLink("/game", I18n.t("game")));
			container.appendChild(this.createLogoutButton());
		}

		return container;
	}

	private createLogoutButton(): HTMLElement {
		return createButton(I18n.t("logoutButton"), () => {
			AuthService.getInstance().logout(); // 로그아웃 처리
			window.location.href = "/login"; // 로그아웃 후 로그인 페이지로 리디렉션
		});
	}

	private createLanguageSelector(): HTMLElement {
		const languages: { [key: string]: string } = {
			en: "English",
			ko: "한국어",
			// 추가 언어를 여기에 추가할 수 있습니다.
		};

		const select = createSelect(
			Object.keys(languages).map((lang) => ({
				value: lang,
				text: languages[lang],
			}))
		);

		select.value = I18n.getLocale();
		select.addEventListener("change", (event) => {
			const selectedLanguage = (event.target as HTMLSelectElement).value;
			I18n.setLocale(selectedLanguage);
			window.location.reload(); // 언어 변경 후 페이지를 새로고침하여 언어를 반영
		});

		return select;
	}
}
