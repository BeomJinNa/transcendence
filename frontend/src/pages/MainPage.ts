import I18n from "../localization/I18n";
import { createLink, createButton, createSelect } from "./formUtils";
import AuthService from "../auth/AuthService";
import Router from "../routes/Router";

export default class MainPage {
	public render(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add(
			"container",
			"mt-5",
			"d-flex",
			"flex-column",
			"justify-content-center",
			"min-vh-100",
			"text-center"
		);
		const heading = document.createElement("h1");
		heading.textContent = I18n.t("mainPageTitle");
		heading.classList.add("text-center", "mb-4");

		container.appendChild(heading);

		const languageSelectorWrapper = document.createElement("div");
		languageSelectorWrapper.classList.add(
			"d-flex",
			"justify-content-center",
			"mb-3"
		);

		const languageSelector = this.createLanguageSelector();
		languageSelector.classList.add("form-select", "w-25");

		languageSelectorWrapper.appendChild(languageSelector);
		container.appendChild(languageSelectorWrapper);

		const isAuthenticated = AuthService.getInstance().isAuthenticated();

		const buttonGroup = document.createElement("div");
		buttonGroup.classList.add("d-flex", "justify-content-center", "gap-2");

		if (!isAuthenticated) {
			const loginLink = createLink("/login", I18n.t("login"));
			loginLink.classList.add("btn", "btn-primary");
			buttonGroup.appendChild(loginLink);
		} else {
			const userInfo = document.createElement("div");
			userInfo.textContent = I18n.t("welcome");
			(async () => {
				// 사용자 정보를 가져와서 화면에 표시
				const user = await AuthService.getInstance().getUser();
				if (user === null) {
					Router.getInstance().navigateTo("/login");
					return;
				}
				userInfo.textContent = I18n.t("welcome") + " " + user.nickname;
			})();
			container.appendChild(userInfo);
			const gameLink = createLink("/game", I18n.t("game"));
			gameLink.classList.add("btn", "btn-success");
			buttonGroup.appendChild(gameLink);

			const logoutButton = this.createLogoutButton();
			logoutButton.classList.add("btn", "btn-danger");
			buttonGroup.appendChild(logoutButton);
		}

		container.appendChild(buttonGroup);

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
