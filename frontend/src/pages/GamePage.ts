import GameSettings from "./GamePage/GameSettings";
import GameModule from "./GamePage/GameModule";
import I18n from "../localization/I18n";
import { createButton } from "./formUtils";
import Router from "../routes/Router";

export default class GamePage {
	private gameModule: GameModule | null = null; // 하나의 GameModule만 관리

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
			container.appendChild(this.createBackButton()); // 설정 화면에서 메인 페이지로 돌아가는 버튼 추가
		} else {
			// Show game if settings are stored
			console.log("GamePage: Player count found, starting game");
			this.startGame(parseInt(playerCount, 10));
			const gameArea = this.createGameArea();
			container.appendChild(gameArea);

			container.appendChild(this.createBackButton()); // 게임 중에도 메인 페이지로 돌아가는 버튼
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

	private startGame(playerCount: number): void {
		console.log("GamePage: Starting game with playerCount =", playerCount);

		// GameModule은 하나만 생성하고, 설정을 인원수에 맞게 조정
		const controlKeys = this.getControlKeysForPlayer(playerCount);
		this.gameModule = new GameModule(playerCount, controlKeys);

		console.log(
			"GamePage: Game module created with settings for",
			playerCount,
			"players"
		);
	}

	private getControlKeysForPlayer(playerCount: number): {
		[action: string]: string;
	} {
		// 플레이어 수에 따른 조작 키 설정
		const controls: {
			[action: string]: string;
		} = {
			moveLeft: playerCount === 2 ? "ArrowLeft" : "a",
			moveRight: playerCount === 2 ? "ArrowRight" : "d",
			jump: playerCount === 2 ? "ArrowUp" : "w",
		};

		return controls;
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
		this.gameModule = null;
		sessionStorage.removeItem("playerCount");
	}
}
