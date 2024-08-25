import GameSettings from "./GamePage/GameSettings";
import GameModule from "./GamePage/GameModule";
import I18n from "../localization/I18n";
import { createButton } from "./formUtils";
import Router from "../routes/Router";

export default class GamePage {
	private gameModule: GameModule | null = null;
	private scoreDisplay: HTMLElement | null = null;

	public render(): HTMLElement {
		console.log("GamePage: render called");

		const container = document.createElement("div");

		const playerCount = sessionStorage.getItem("playerCount");
		console.log("GamePage: playerCount from sessionStorage =", playerCount);

		if (!playerCount) {
			console.log("GamePage: No player count, showing settings");
			const settings = new GameSettings();
			container.appendChild(settings.render());
			container.appendChild(this.createBackButton());
		} else {
			console.log("GamePage: Player count found, starting game");
			this.startGame(parseInt(playerCount, 10));
			const gameArea = this.createGameArea();
			container.appendChild(gameArea);

			this.createGameUI(container);

			container.appendChild(this.createBackButton());
		}

		return container;
	}

	private createGameArea(): HTMLElement {
		const gameArea = document.createElement("div");
		gameArea.id = "gameArea";

		if (this.gameModule) {
			console.log("GamePage: Adding game module to gameArea");
			gameArea.appendChild(this.gameModule.getElement());
		}

		return gameArea;
	}

	private createGameUI(container: HTMLElement): void {
		const gameUI = document.createElement("div");
		gameUI.style.position = "absolute";
		gameUI.style.top = "2vh";
		gameUI.style.width = "100%";
		gameUI.style.textAlign = "center";
		gameUI.style.color = "#ffffff";

		if (this.gameModule) {
			const instructions = document.createElement("div");
			instructions.style.fontSize = "2vh";
			instructions.innerHTML = this.gameModule.getControlInstructions();
			gameUI.appendChild(instructions);

			this.scoreDisplay = document.createElement("div");
			this.scoreDisplay.style.marginTop = "2vh";
			this.scoreDisplay.style.fontSize = "3vh";
			this.scoreDisplay.innerHTML = `0 : 0`;
			gameUI.appendChild(this.scoreDisplay);
		}

		container.appendChild(gameUI);
	}

	private startGame(playerCount: number): void {
		console.log("GamePage: Starting game with playerCount =", playerCount);

		this.gameModule = new GameModule(playerCount);

		this.gameModule.setScoreCallback((scoreA: number, scoreB: number) => {
			if (this.scoreDisplay) {
				this.scoreDisplay.innerHTML = `${scoreA} : ${scoreB}`;
			}
		});

		console.log(
			"GamePage: Game module created with settings for",
			playerCount,
			"players"
		);
	}

	private createBackButton(): HTMLElement {
		return createButton(I18n.t("backToMainButton"), () => {
			console.log("GamePage: Back button clicked");
			this.endGame();
			Router.getInstance().navigateTo("/");
		});
	}

	private endGame(): void {
		console.log("GamePage: Ending game and clearing state");

		if (this.gameModule) {
			this.gameModule.stopAnimation();
			this.gameModule.removeEventListeners();
			this.gameModule = null;
		}

		sessionStorage.removeItem("playerCount");
	}
}
