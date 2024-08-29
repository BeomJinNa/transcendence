import I18n from "../../localization/I18n";
import Router from "../../routes/Router";
import GamePage from "../GamePage";
import TournamentState from "./TournamentState";

export default class GameResult {
	private winner: any;
	private tournamentState: TournamentState;

	constructor() {
		// TournamentState 인스턴스를 가져옵니다.
		this.tournamentState = TournamentState.getInstance();

		// 방금 종료된 경기의 승리 팀 정보를 가져옵니다.
		this.winner = this.tournamentState.getWinner();
	}

	public render(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add("container", "mt-5", "text-center");

		const heading = document.createElement("h2");
		heading.textContent = I18n.t("matchResult");
		heading.classList.add("mb-4");
		container.appendChild(heading);

		const resultMessage = document.createElement("div");
		resultMessage.classList.add("h4", "mb-4");
		resultMessage.textContent = `${this.winner.name} ${I18n.t("wonTheMatch")}`;
		container.appendChild(resultMessage);

		// 다음 버튼 생성
		const nextButton = this.createNextButton();
		container.appendChild(nextButton);

		// 토너먼트가 끝났는지 여부를 확인
		if (this.tournamentState.isTournamentComplete()) {
			this.showTournamentWinner(container);
			nextButton.textContent = I18n.t("endTournament");
			nextButton.onclick = () => this.endTournament();
		} else {
			nextButton.textContent = I18n.t("startNextMatch");
			nextButton.onclick = () => this.nextMatch();
		}

		return container;
	}

	private createNextButton(): HTMLElement {
		const nextButton = document.createElement("button");
		nextButton.classList.add("btn", "btn-primary", "mt-3");
		return nextButton;
	}

	private showTournamentWinner(container: HTMLElement): void {
		const winnerMessage = document.createElement("div");
		winnerMessage.classList.add("h4", "mt-4");
		winnerMessage.textContent = `${this.winner.name} ${I18n.t("isTheTournamentChampion")}`;
		container.appendChild(winnerMessage);
	}

	private nextMatch(): void {
		// 다음 경기를 진행하기 위해 GamePage로 이동
		sessionStorage.setItem("currentStage", "game");
		const gamePage = Router.getInstance().getCurrentPageInstance() as GamePage;
		if (gamePage) {
			gamePage.renderPage();
		}
	}

	private endTournament(): void {
		// 토너먼트 종료 후 모든 상태 초기화
		this.tournamentState.reset();
		sessionStorage.clear();
		Router.getInstance().navigateTo("/");
	}
}
