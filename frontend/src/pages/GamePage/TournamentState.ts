export type Team = {
	id: string;
	name: string;
	color1: number;
	color2: number;
};

export default class TournamentState {
	public rounds: Team[][]; // 각 라운드의 팀 배열
	public playerCount: number; // 플레이어 수
	public scoreLimit: number; // 점수 제한
	private currentRoundIndex: number; // 현재 라운드의 인덱스
	private currentMatchIndex: number; // 현재 라운드에서 진행 중인 경기의 인덱스
	private winner: Team | null; // 현재 토너먼트의 승자

	private static instance: TournamentState | null = null;

	private constructor() {
		this.rounds = [];
		this.currentRoundIndex = 0;
		this.currentMatchIndex = 0;
		this.playerCount = 2;
		this.scoreLimit = 10;
		this.winner = null;
	}

	public static getInstance(): TournamentState {
		if (!TournamentState.instance) {
			TournamentState.instance = new TournamentState();
		}
		return TournamentState.instance;
	}

	public initialize(
		tournamentMode: 2 | 4 | 8,
		teamNames: string[],
		playerCount: number,
		scoreLimit: number
	) {
		this.rounds = new Array(Math.log2(tournamentMode)).fill(null).map(() => []);
		this.rounds[0] = teamNames.map((name, index) => ({
			id: `team-${index + 1}`,
			name,
			...this.assignTeamColors(index),
		}));
		this.currentRoundIndex = 0;
		this.currentMatchIndex = 0;
		this.playerCount = playerCount;
		this.scoreLimit = scoreLimit;
		this.winner = null;
	}

	public getCurrentMatchTeams(): { teamA: Team; teamB: Team } | null {
		const currentRound = this.rounds[this.currentRoundIndex];
		if (this.currentMatchIndex < currentRound.length - 1) {
			return {
				teamA: currentRound[this.currentMatchIndex],
				teamB: currentRound[this.currentMatchIndex + 1],
			};
		}
		return null;
	}

	public completeMatch(winner: Team) {
		const nextRoundIndex = this.currentRoundIndex + 1;
		if (!this.rounds[nextRoundIndex]) {
			this.rounds[nextRoundIndex] = [];
		}
		this.rounds[nextRoundIndex].push(winner);

		this.currentMatchIndex += 2;

		if (this.currentMatchIndex >= this.rounds[this.currentRoundIndex].length) {
			this.currentRoundIndex++;
			this.currentMatchIndex = 0;
		}
		this.winner = winner;
	}

	public isTournamentComplete(): boolean {
		return (
			this.currentRoundIndex >= this.rounds.length - 1 &&
			this.rounds[this.currentRoundIndex].length === 1
		);
	}

	public saveState() {
		sessionStorage.setItem("tournamentState", JSON.stringify(this));
	}

	public loadState() {
		const storedState = sessionStorage.getItem("tournamentState");
		if (storedState) {
			Object.assign(this, JSON.parse(storedState));
		}
	}

	public getWinner(): Team | null {
		return this.winner;
	}

	public reset() {
		this.rounds = [];
		this.currentRoundIndex = 0;
		this.currentMatchIndex = 0;
		this.winner = null;
		sessionStorage.removeItem("tournamentState");
	}

	public getTeamColors(
		teamId: string
	): { color1: number; color2: number } | null {
		for (const round of this.rounds) {
			const team = round.find((team) => team.id === teamId);
			if (team) {
				return { color1: team.color1, color2: team.color2 };
			}
		}
		return null;
	}

	private assignTeamColors(index: number): { color1: number; color2: number } {
		const colorPairs = [
			{ color1: 0x0000ff, color2: 0x6666ff }, // 파란색 계열
			{ color1: 0xff0000, color2: 0xff6666 }, // 빨간색 계열
			{ color1: 0x00ff00, color2: 0x66ff66 }, // 녹색 계열
			{ color1: 0xffff00, color2: 0xffff66 }, // 노란색 계열
			{ color1: 0xff00ff, color2: 0xff66ff }, // 자홍색 계열
			{ color1: 0x00ffff, color2: 0x66ffff }, // 청록색 계열
			{ color1: 0xffa500, color2: 0xffc266 }, // 주황색 계열
			{ color1: 0x800080, color2: 0xa266a2 }, // 보라색 계열
		];

		return colorPairs[index % colorPairs.length];
	}
}
