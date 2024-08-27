import GameSettings from "./GamePage/GameSettings";
import GameModule from "./GamePage/GameModule";
import I18n from "../localization/I18n";
import { createButton } from "./formUtils";
import Router from "../routes/Router";

export default class GamePage {
	private gameModule: GameModule | null = null;
	private scoreDisplay: HTMLElement | null = null;

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

		const playerCount = sessionStorage.getItem("playerCount");

		if (!playerCount) {
			const settings = new GameSettings();
			container.appendChild(settings.render());
			container.appendChild(this.createBackButton());
		} else {
			this.startGame(parseInt(playerCount, 10));
			const gameArea = this.createGameArea();
			container.appendChild(gameArea);

			this.createGameUI(gameArea);

			container.appendChild(this.createBackButton());
		}

		return container;
	}

	private createGameArea(): HTMLElement {
		const gameArea = document.createElement("div");
		gameArea.id = "gameArea";
		gameArea.classList.add(
			"mt-4",
			"position-relative",
			"d-flex",
			"justify-content-center",
			"align-items-center"
		);

		if (this.gameModule) {
			gameArea.appendChild(this.gameModule.getElement());
		}

		return gameArea;
	}

	private createGameUI(container: HTMLElement): void {
		const gameUI = document.createElement("div");
		gameUI.classList.add(
			"position-absolute",
			"top-0",
			"start-50",
			"translate-middle-x",
			"text-white"
		);

		if (this.gameModule) {
			const instructions = document.createElement("div");
			instructions.classList.add("h6", "mt-3");
			instructions.innerHTML = this.gameModule.getControlInstructions();
			gameUI.appendChild(instructions);

			this.scoreDisplay = document.createElement("div");
			this.scoreDisplay.classList.add("h4", "mt-2");
			this.scoreDisplay.innerHTML = `0 : 0`;
			gameUI.appendChild(this.scoreDisplay);
		}

		container.appendChild(gameUI);
	}

	private startGame(playerCount: number): void {
		this.gameModule = new GameModule(playerCount);

		this.gameModule.setScoreCallback((scoreA: number, scoreB: number) => {
			if (this.scoreDisplay) {
				this.scoreDisplay.innerHTML = `${scoreA} : ${scoreB}`;
			}
		});
	}

	private createBackButton(): HTMLElement {
		const backButtonWrapper = document.createElement("div");
		const backButton = createButton(I18n.t("backToMainButton"), () => {
			this.endGame();
			Router.getInstance().navigateTo("/");
		});
		backButton.classList.add("btn", "btn-secondary", "mt-4", "w-25");

		backButtonWrapper.appendChild(backButton);
		return backButtonWrapper;
	}

	private endGame(): void {
		if (this.gameModule) {
			this.gameModule.stopAnimation();
			this.gameModule.removeEventListeners();
			this.gameModule = null;
		}

		sessionStorage.removeItem("playerCount");
	}
}
