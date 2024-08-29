import I18n from "../../localization/I18n";
import Router from "../../routes/Router";
import GamePage from "../GamePage";
import TournamentState, { Team } from "./TournamentState";

export default class GameResult {
	private winner: Team;
	private tournamentState: TournamentState;

	constructor() {
		this.tournamentState = TournamentState.getInstance();
		this.winner = this.tournamentState.getWinner()!;
	}

	public render(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add("container", "mt-5", "text-center");

		const heading = document.createElement("h2");
		heading.textContent = I18n.t("matchResult");
		heading.classList.add(
			"mb-4",
			"text-uppercase",
			"text-primary",
			"font-weight-bold"
		);
		container.appendChild(heading);

		const resultMessage = document.createElement("div");
		resultMessage.classList.add("display-4", "mb-4");

		const winnerColor = `#${this.winner.color1.toString(16).padStart(6, "0")}`;
		resultMessage.innerHTML = `<span style="color:${winnerColor}; background-color: #dddddd; padding: 0.2rem 0.4rem; border-radius: 0.3rem;">${this.winner.name}</span> ${I18n.t("wonTheMatch")}`;
		container.appendChild(resultMessage);

		if (!this.tournamentState.isTournamentComplete()) {
			this.showNextMatchTeams(container);

			const nextButton = this.createNextButton();
			nextButton.textContent = I18n.t("startNextMatch");
			nextButton.onclick = () => this.nextMatch();
			container.appendChild(nextButton);
		} else {
			this.showTournamentWinner(container);
		}

		this.drawTournamentBracket(container);

		return container;
	}

	private createNextButton(): HTMLElement {
		const nextButton = document.createElement("button");
		nextButton.classList.add("btn", "btn-primary", "mt-4", "px-5", "py-2");
		nextButton.style.fontSize = "1.25rem";
		return nextButton;
	}

	private showTournamentWinner(container: HTMLElement): void {
		const winnerMessage = document.createElement("div");
		winnerMessage.classList.add("display-4", "text-info", "mt-5");
		winnerMessage.textContent = `${this.winner.name} ${I18n.t("isTheTournamentChampion")}`;
		container.appendChild(winnerMessage);
	}

	private showNextMatchTeams(container: HTMLElement): void {
		const nextMatchTeams = this.tournamentState.getCurrentMatchTeams();
		if (nextMatchTeams) {
			const matchInfo = document.createElement("div");
			matchInfo.classList.add("h5", "mt-4", "text-secondary", "py-2");
			matchInfo.style.backgroundColor = "#dddddd";

			const teamAColor = `#${nextMatchTeams.teamA.color1.toString(16).padStart(6, "0")}`;
			const teamBColor = `#${nextMatchTeams.teamB.color1.toString(16).padStart(6, "0")}`;
			matchInfo.innerHTML = `
				${I18n.t("nextMatch")}: 
				<span style="color:${teamAColor}">${nextMatchTeams.teamA.name}</span> 
				${I18n.t("vs")} 
				<span style="color:${teamBColor}">${nextMatchTeams.teamB.name}</span>
			`;
			container.appendChild(matchInfo);
		}
	}

	private drawTournamentBracket(container: HTMLElement): void {
		const bracketContainer = document.createElement("div");
		bracketContainer.classList.add("tournament-bracket", "mt-5", "text-center");

		// 라운드를 역순으로 출력
		for (
			let roundIndex = this.tournamentState.rounds.length - 1;
			roundIndex >= 0;
			roundIndex--
		) {
			const round = this.tournamentState.rounds[roundIndex];
			const roundContainer = document.createElement("div");
			roundContainer.classList.add(
				"tournament-round",
				"mb-4",
				"d-flex",
				"justify-content-center"
			);

			round.forEach((team) => {
				const teamElement = document.createElement("div");
				teamElement.classList.add(
					"tournament-team",
					"p-2",
					"mx-2",
					"text-center"
				);
				teamElement.style.backgroundColor = "#dddddd";
				teamElement.style.border = "1px solid #ccc";
				teamElement.style.minWidth = "150px";

				const teamColor = `#${team.color1.toString(16).padStart(6, "0")}`;
				teamElement.innerHTML = `<span style="color:${teamColor}; font-weight: bold;">${team.name}</span>`;

				roundContainer.appendChild(teamElement);
			});

			bracketContainer.appendChild(roundContainer);
		}

		container.appendChild(bracketContainer);
	}

	private nextMatch(): void {
		sessionStorage.setItem("currentStage", "game");
		const gamePage = Router.getInstance().getCurrentPageInstance() as GamePage;
		if (gamePage) {
			gamePage.renderPage();
		}
	}
}
