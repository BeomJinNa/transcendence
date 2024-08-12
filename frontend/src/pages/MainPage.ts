import I18n from "../localization/I18n.js";

export default class MainPage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/MainPage.css";
		document.head.appendChild(link);

		//HEAD
		const heading = document.createElement("h1");
		heading.textContent = "Main Page";
		container.appendChild(heading);

		//BODY
		const loginLink = this.createLink("/login", I18n.t("login"));
		const signupLink = this.createLink("/signup", I18n.t("signup"));
		const gameLink = this.createLink("/game", I18n.t("game"));

		container.appendChild(loginLink);
		container.appendChild(signupLink);
		container.appendChild(gameLink);

		return container;
	}

	private createLink(href: string, text: string): HTMLElement {
		const link = document.createElement("a");
		link.href = href;
		link.textContent = text;
		link.style.display = "block"; // 스타일 추가 (필요 시)
		return link;
	}
}
