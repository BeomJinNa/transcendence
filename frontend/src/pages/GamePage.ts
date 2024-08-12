import I18n from "../localization/I18n.js";

export default class GamePage {
    public render(): HTMLElement {
        const container = document.createElement("div");

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/css/GamePage.css";
        document.head.appendChild(link);

				//HEAD
        const heading = document.createElement("h1");
        heading.textContent = I18n.t("gamePageTitle");
        container.appendChild(heading);

				//BODY
        const gameArea = this.createGameArea();
        container.appendChild(gameArea);

        return container;
    }

    private createGameArea(): HTMLElement {
        const gameArea = document.createElement("div");
        gameArea.id = "gameArea";
        gameArea.textContent = I18n.t("gameAreaText");
        // 게임 구현 코드가 여기 추가됩니다.
        return gameArea;
    }
}
