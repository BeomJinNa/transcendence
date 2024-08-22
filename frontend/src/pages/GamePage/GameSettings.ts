import I18n from "../../localization/I18n";
import { createLabel, createSelect, createButton } from "../formUtils";
import Router from "../../routes/Router";

export default class GameSettings {
	public render(): HTMLElement {
		const container = document.createElement("div");
		const heading = document.createElement("h2");
		heading.textContent = I18n.t("selectGameMode");

		const form = document.createElement("form");

		// Select player count
		form.appendChild(createLabel(I18n.t("numberOfPlayers")));

		const playerCountSelect = createSelect([
			{ value: "2", text: "2 Players" },
			{ value: "3", text: "3 Players" },
			{ value: "4", text: "4 Players" },
		]);

		form.appendChild(playerCountSelect);

		form.appendChild(
			createButton(I18n.t("startGame"), (event) => {
				event.preventDefault();
				const playerCount = parseInt(playerCountSelect.value, 10);
				this.startGame(playerCount);
			})
		);

		container.appendChild(heading);
		container.appendChild(form);

		return container;
	}

	private startGame(playerCount: number): void {
		// Store the player count in the session storage
		sessionStorage.setItem("playerCount", playerCount.toString());

		// Log the stored playerCount value
		console.log(
			"GameSettings: playerCount stored in sessionStorage =",
			playerCount
		);

		// Navigate to the game page
		Router.getInstance().navigateTo("/game");
	}
}
