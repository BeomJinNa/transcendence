import GameSettings from "./GamePage/GameSettings";
import GameModule from "./GamePage/GameModule";
import I18n from "../localization/I18n";
import { createButton } from "./formUtils";
import Router from "../routes/Router";

export default class GamePage {
	private gameModules: GameModule[] = [];

	public render(): HTMLElement {
		console.log("GamePage: render called");

		const container = document.createElement("div");

		// Check if game settings have been selected
		const playerCount = sessionStorage.getItem("playerCount");
		console.log("GamePage: playerCount from sessionStorage =", playerCount);

		if (!playerCount) {
			// Show settings if no settings are stored
			console.log("GamePage: No player count, showing settings");
			const settings = new GameSettings();
			container.appendChild(settings.render());
		} else {
			// Show game if settings are stored
			console.log("GamePage: Player count found, starting game");
			this.startGame(parseInt(playerCount, 10));
			const gameArea = this.createGameArea();
			container.appendChild(gameArea);

			container.appendChild(this.createBackButton());
		}

		return container;
	}

	private initializeState(): void {
		console.log("GamePage: Initializing state");
		this.gameModules = [];
		sessionStorage.removeItem("playerCount");
	}

	private createGameArea(): HTMLElement {
		const gameArea = document.createElement("div");
		gameArea.id = "gameArea";

		// Add game modules based on player count
		this.gameModules.forEach((module) => {
			console.log("GamePage: Adding game module to gameArea");
			gameArea.appendChild(module.getElement());
		});

		return gameArea;
	}

	private startGame(playerCount: number): void {
		console.log("GamePage: Starting game with playerCount =", playerCount);
		for (let i = 1; i <= playerCount; i++) {
			const controlKeys = this.getControlKeysForPlayer(i);
			const gameModule = new GameModule(i, controlKeys);
			this.gameModules.push(gameModule);
			console.log("GamePage: Added game module for player", i);
		}
	}

	private getControlKeysForPlayer(playerId: number): {
		[action: string]: string;
	} {
		const controls: {
			[key: number]: { moveLeft: string; moveRight: string; jump: string };
		} = {
			1: { moveLeft: "ArrowLeft", moveRight: "ArrowRight", jump: "ArrowUp" },
			2: { moveLeft: "a", moveRight: "d", jump: "w" },
			3: { moveLeft: "j", moveRight: "l", jump: "i" },
			4: { moveLeft: "4", moveRight: "6", jump: "8" },
		};
		return controls[playerId] || controls[1];
	}

	private createBackButton(): HTMLElement {
		return createButton(I18n.t("backToMainButton"), () => {
			console.log("GamePage: Back button clicked");
			this.endGame();
			Router.getInstance().navigateTo("/"); // 메인 페이지로 리디렉션
		});
	}

	private endGame(): void {
		console.log("GamePage: Ending game and clearing state");
		this.initializeState(); // 상태 초기화
	}
}
