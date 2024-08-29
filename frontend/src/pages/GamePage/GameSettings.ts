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

export default class GameSettings {
	public render(): HTMLElement {
		const container = document.createElement("div");
		container.classList.add("container", "mt-5", "text-center");

		const heading = document.createElement("h2");
		heading.textContent = I18n.t("selectGameMode");
		heading.classList.add("mb-4");

		const form = document.createElement("form");
		form.classList.add("w-50", "mx-auto");

		// 플레이어 수 선택
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
			{ value: "2", text: "1 vs 1" },
			{ value: "4", text: "2 vs 2" },
		]);
		playerCountSelect.classList.add("form-select", "mb-3", "w-50");
		form.appendChild(playerCountSelect);
		numberOfPlayersSelectorWrapper.appendChild(playerCountSelect);
		form.appendChild(numberOfPlayersSelectorWrapper);

		// 토너먼트 모드 선택
		const tournamentModeLabel = createLabel(I18n.t("selectTournamentMode"));
		tournamentModeLabel.classList.add("h5", "mb-3");
		form.appendChild(tournamentModeLabel);

		const tournamentModeSelect = createSelect([
			{ value: "2", text: "2강" },
			{ value: "4", text: "4강" },
			{ value: "8", text: "8강" },
		]);
		tournamentModeSelect.classList.add("form-select", "mb-3", "w-50");
		form.appendChild(tournamentModeSelect);

		// 팀 이름 입력
		const teamNameInputsWrapper = document.createElement("div");
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
		updateTeamNameInputs(); // 초기화 시 팀 이름 입력란을 먼저 생성

		// 승점 설정
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

		// 게임 시작 버튼
		const startGameButton = createButton(I18n.t("startGame"), (event) => {
			event.preventDefault();
			const playerCount = parseInt(playerCountSelect.value, 10);
			const tournamentMode = parseInt(tournamentModeSelect.value, 10) as 2 | 4 | 8;
			const scoreLimit = parseInt(scoreLimitInput.value, 10);
			const teamNames = teamNameInputs.map(
				(input) => input.value || `Team ${teamNameInputs.indexOf(input) + 1}`
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
		// TournamentState 초기화
		const tournamentState = TournamentState.getInstance();
		tournamentState.initialize(tournamentMode, teamNames, playerCount, scoreLimit);

		// 세션 스토리지에 상태를 저장할 필요가 있는 경우 아래 코드 사용
		// tournamentState.saveState();

		sessionStorage.setItem("currentStage", "game");
		const gamePage = Router.getInstance().getCurrentPageInstance() as GamePage;
		if (gamePage) {
			gamePage.renderPage();
		}
	}

	// 색상 할당 로직은 TournamentState 내부에서 관리되므로 여기서는 필요하지 않음
}
