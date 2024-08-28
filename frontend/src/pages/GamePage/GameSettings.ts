import I18n from "../../localization/I18n";
import { createLabel, createSelect, createButton } from "../formUtils";
import Router from "../../routes/Router";
import GamePage from "../GamePage";

export default class GameSettings {
	public render(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add("container", "mt-5", "text-center");

		const heading = document.createElement("h2");
		heading.textContent = I18n.t("selectGameMode");
		heading.classList.add("mb-4");

		const form = document.createElement("form");
		form.classList.add("w-50", "mx-auto");

		const numberOfPlayersLabel = createLabel(I18n.t("numberOfPlayers"));
		numberOfPlayersLabel.classList.add("h5", "mb-3");
		form.appendChild(numberOfPlayersLabel);

		const numberOfPlayersSelectorWrapper = document.createElement("div");
		numberOfPlayersSelectorWrapper.classList.add(
			"d-flex",
			"justify-content-center",
			"mb-3"
		);

		const playerCountSelect = createSelect([
			{ value: "2", text: "2 Players" },
			{ value: "3", text: "3 Players" },
			{ value: "4", text: "4 Players" },
		]);
		playerCountSelect.classList.add("form-select", "mb-3", "w-50");
		form.appendChild(playerCountSelect);
		numberOfPlayersSelectorWrapper.appendChild(playerCountSelect);
		form.appendChild(numberOfPlayersSelectorWrapper);

		const startGameButton = createButton(I18n.t("startGame"), (event) => {
			event.preventDefault();
			const playerCount = parseInt(playerCountSelect.value, 10);
			this.startGame(playerCount);
		});
		startGameButton.classList.add("btn", "btn-primary", "w-50", "mt-3");

		form.appendChild(startGameButton);

		container.appendChild(heading);
		container.appendChild(form);

		return container;
	}

	private startGame(playerCount: number): void {
		sessionStorage.setItem("playerCount", playerCount.toString());
		const gamePage = new GamePage();
		const gameContainer = document.getElementById("app");
		if (gameContainer) {
			gameContainer.innerHTML = "";
			Router.getInstance().setCurrentPageInstance(gamePage);
			gameContainer.appendChild(gamePage.render());
		}
	}
}
