import GameSettings from "./GamePage/GameSettings";
import GameModule from "./GamePage/GameModule";
import GameResult from "./GamePage/GameResult";
import I18n from "../localization/I18n";
import { createButton } from "./formUtils";
import Router from "../routes/Router";
import TournamentState from "./GamePage/TournamentState";

export default class GamePage {
	private gameModule: GameModule | null = null;
	private scoreDisplay: HTMLElement | null = null;
	private currentStage: "settings" | "game" | "result" = "settings";

	constructor() {
		this.loadCurrentStage();
	}

	private loadCurrentStage(): void {
		const savedStage = sessionStorage.getItem("currentStage");
		if (savedStage) {
			this.currentStage = savedStage as "settings" | "game" | "result";
		} else {
			this.currentStage = "settings";
			sessionStorage.setItem("currentStage", this.currentStage);
		}
	}

	public render(): HTMLElement {
		this.loadCurrentStage();

		const appContainer = document.getElementById("app");
		if (appContainer) {
			appContainer.innerHTML = "";
		}

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

		switch (this.currentStage) {
			case "settings":
				const settings = new GameSettings();
				container.appendChild(settings.render());
				break;
			case "game":
				this.startGame();
				const gameArea = this.createGameArea();
				container.appendChild(gameArea);
				this.createGameUI(gameArea);
				break;
			case "result":
				const resultPage = new GameResult();
				container.appendChild(resultPage.render());
				break;
		}

		container.appendChild(this.createBackButton());
		return container;
	}

	public renderPage(): void {
		const container = this.render();
		const appContainer = document.getElementById("app");
		if (appContainer) {
			appContainer.innerHTML = "";
			appContainer.appendChild(container);
		}
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

	private startGame(): void {
		const tournamentState = TournamentState.getInstance();

		const matchTeams = tournamentState.getCurrentMatchTeams();

		if (!matchTeams) {
			console.error("No teams available for the match.");
			return;
		}

		this.gameModule = new GameModule(
			tournamentState.playerCount,
			[matchTeams.teamA, matchTeams.teamB],
			tournamentState.scoreLimit,
			(winner) => {
				this.gameModule?.stopAnimation();
				this.gameModule?.removeEventListeners();
				this.gameModule = null;

				tournamentState.completeMatch(winner);

				sessionStorage.setItem("currentStage", "result");
				this.renderPage();
			}
		);

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
			this.gameModule.dispose();
			this.gameModule = null;
		}

		TournamentState.getInstance().reset();
		sessionStorage.removeItem("currentStage");
	}

	public cleanup(): void {
		this.endGame();
	}
}
