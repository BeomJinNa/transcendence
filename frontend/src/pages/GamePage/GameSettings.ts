import I18n from "../../localization/I18n";
import {
	createLabel,
	createSelect,
	createButton,
	createInput,
} from "../formUtils";
import Router from "../../routes/Router";
import GamePage from "../GamePage";
import TournamentState from "./TournamentState";

function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

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
			{ value: "2", text: I18n.t("oneVsOne") },
			{ value: "4", text: I18n.t("twoVsTwo") },
		]);
		playerCountSelect.classList.add("form-select", "mb-3", "w-50");
		form.appendChild(playerCountSelect);
		numberOfPlayersSelectorWrapper.appendChild(playerCountSelect);
		form.appendChild(numberOfPlayersSelectorWrapper);

		const tournamentModeLabel = createLabel(I18n.t("selectTournamentMode"));
		tournamentModeLabel.classList.add("h5", "mb-3");
		form.appendChild(tournamentModeLabel);

		const tournamentModeSelectWrapper = document.createElement("div");
		tournamentModeSelectWrapper.classList.add(
			"d-flex",
			"justify-content-center",
			"mb-3"
		);

		const tournamentModeSelect = createSelect([
			{ value: "2", text: I18n.t("tournamentModeTwo") },
			{ value: "4", text: I18n.t("tournamentModeFour") },
			{ value: "8", text: I18n.t("tournamentModeEight") },
		]);
		tournamentModeSelect.classList.add("form-select", "w-50", "text-center");
		tournamentModeSelectWrapper.appendChild(tournamentModeSelect);
		form.appendChild(tournamentModeSelectWrapper);

		const teamNameInputsWrapper = document.createElement("div");
		teamNameInputsWrapper.classList.add("justify-content-center");
		form.appendChild(teamNameInputsWrapper);

		const teamNameInputs: HTMLInputElement[] = [];
		const updateTeamNameInputs = () => {
			const teamCount = parseInt(tournamentModeSelect.value, 10);
			teamNameInputs.forEach((input) => input.remove());
			teamNameInputs.length = 0;

			for (let i = 0; i < teamCount; i++) {
				const teamInput = createInput({
					type: "text",
					placeholder: `${I18n.t("teamName")} ${i + 1}`,
				});
				teamInput.classList.add("form-control", "mb-2");
				teamNameInputsWrapper.appendChild(teamInput);
				teamNameInputs.push(teamInput);
			}
		};
		tournamentModeSelect.addEventListener("change", updateTeamNameInputs);
		updateTeamNameInputs();

		const scoreLimitLabel = createLabel(I18n.t("scoreLimit"));
		scoreLimitLabel.classList.add("h5", "mb-3");
		form.appendChild(scoreLimitLabel);

		const scoreLimitInput = createInput({
			type: "number",
			placeholder: I18n.t("scoreLimit"),
			value: "10",
		});
		scoreLimitInput.classList.add("form-control", "mb-3", "w-50", "mx-auto");
		form.appendChild(scoreLimitInput);

		const startGameButton = createButton(I18n.t("startGame"), (event) => {
			event.preventDefault();
			const playerCount = parseInt(playerCountSelect.value, 10);
			const tournamentMode = parseInt(tournamentModeSelect.value, 10) as
				| 2
				| 4
				| 8;
			const scoreLimit = parseInt(scoreLimitInput.value, 10);
			const teamNames = teamNameInputs.map(
				(input) =>
					escapeHtml(input.value) || `Team ${teamNameInputs.indexOf(input) + 1}`
			);

			this.startGame(playerCount, tournamentMode, scoreLimit, teamNames);
		});
		startGameButton.classList.add("btn", "btn-primary", "w-50", "mt-3");

		form.appendChild(startGameButton);

		container.appendChild(heading);
		container.appendChild(form);

		return container;
	}

	private startGame(
		playerCount: number,
		tournamentMode: 2 | 4 | 8,
		scoreLimit: number,
		teamNames: string[]
	): void {
		const tournamentState = TournamentState.getInstance();
		tournamentState.initialize(
			tournamentMode,
			teamNames,
			playerCount,
			scoreLimit
		);

		sessionStorage.setItem("currentStage", "game");
		const gamePage = Router.getInstance().getCurrentPageInstance() as GamePage;
		if (gamePage) {
			gamePage.renderPage();
		}
	}
}
