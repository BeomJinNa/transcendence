import GameSettings from "./GamePage/GameSettings";
import GameModule from "./GamePage/GameModule";
import I18n from "../localization/I18n";
import { createButton } from "./formUtils";
import Router from "../routes/Router";

export default class GamePage {
	private gameModules: GameModule[] = [];

	public render(): HTMLElement {
		const container = document.createElement("div");

		// Check if game settings have been selected
		const playerCount = sessionStorage.getItem("playerCount");
		if (!playerCount) {
			// Show settings if no settings are stored
			const settings = new GameSettings();
			container.appendChild(settings.render());
		} else {
			// Show game if settings are stored
			this.startGame(parseInt(playerCount, 10));
			const gameArea = this.createGameArea();
			container.appendChild(gameArea);

			container.appendChild(this.createBackButton());
		}

		return container;
	}

	private createGameArea(): HTMLElement {
		const gameArea = document.createElement("div");
		gameArea.id = "gameArea";

		// Add game modules based on player count
		this.gameModules.forEach((module) => {
			gameArea.appendChild(module.getElement());
		});

		return gameArea;
	}

	private startGame(playerCount: number): void {
		for (let i = 1; i <= playerCount; i++) {
			const controlKeys = this.getControlKeysForPlayer(i);
			const gameModule = new GameModule(i, controlKeys);
			this.gameModules.push(gameModule);
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
			this.endGame(); // 게임 중단 로직
			Router.getInstance().navigateTo("/"); // 메인 페이지로 리디렉션
		});
	}

	private endGame(): void {
		// 게임을 중단하고 필요한 정리 작업 수행
		this.gameModules = [];
	}
}
