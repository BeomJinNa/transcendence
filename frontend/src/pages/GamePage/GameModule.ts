export default class GameModule {
	private controlKeys: { [action: string]: string };
	private playerId: number;
	private gameElement: HTMLElement;

	constructor(playerId: number, controlKeys: { [action: string]: string }) {
		this.playerId = playerId;
		this.controlKeys = controlKeys;
		this.gameElement = this.createGameElement();
		this.setupControls();
	}

	private createGameElement(): HTMLElement {
		const gameElement = document.createElement("div");
		gameElement.className = "gameModule";
		gameElement.textContent = `Player ${this.playerId} is playing...`; // Placeholder text
		return gameElement;
	}

	private setupControls(): void {
		document.addEventListener("keydown", (event) => {
			const action = Object.keys(this.controlKeys).find(
				(key) => this.controlKeys[key] === event.key
			);
			if (action) {
				this.handleAction(action);
			}
		});
	}

	private handleAction(action: string): void {
		console.log(`Player ${this.playerId} performed action: ${action}`);
		// Implement game-specific action logic here
	}

	public getElement(): HTMLElement {
		return this.gameElement;
	}
}
