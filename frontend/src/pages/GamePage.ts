export default class GamePage {
	public render(): HTMLElement {
		const container = document.createElement("div");

		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "/css/GamePage.css";
		document.head.appendChild(link);

		//HEAD
		const heading = document.createElement("h1");
		heading.textContent = "Game Page";
		container.appendChild(heading);

		//BODY
		const gameArea = this.createGameArea();
		container.appendChild(gameArea);

		return container;
	}

	private createGameArea(): HTMLElement {
		const gameArea = document.createElement("div");
		gameArea.id = "gameArea";
		gameArea.textContent = "Game will be here!";
		// 게임 구현 코드가 여기 추가됩니다.
		return gameArea;
	}
}
