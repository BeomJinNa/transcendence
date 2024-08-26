type State = {
	access_token: string | null;
	refresh_token: string | null;
	user: { email: string; nickname: string } | null;
	currentPage: string;
	gameState: string | null;
	players: Array<{ id: string; nickname: string }>;
	language: string;
	theme: string;
};

class StateManager {
	private static instance: StateManager;
	private state: State;
	private observers: { [key in keyof State]?: Function[] };

	private constructor() {
		this.state = {
			access_token: localStorage.getItem("access_token") || null,
			refresh_token: localStorage.getItem("refresh_token") || null,
			user: null,
			currentPage: "/",
			gameState: null,
			players: [],
			language: "en",
			theme: "light",
		};
		this.observers = {};
	}

	public static getInstance(): StateManager {
		if (!StateManager.instance) {
			StateManager.instance = new StateManager();
		}
		return StateManager.instance;
	}

	public getState<T extends keyof State>(key: T): State[T] {
		return this.state[key];
	}

	public setState<T extends keyof State>(key: T, value: State[T]): void {
		this.state[key] = value;
		this.notifyObservers(key);
	}

	public subscribe<T extends keyof State>(
		key: T,
		callback: (value: State[T]) => void
	): void {
		if (!this.observers[key]) {
			this.observers[key] = [];
		}
		this.observers[key]!.push(callback);
	}

	private notifyObservers<T extends keyof State>(key: T): void {
		if (this.observers[key]) {
			this.observers[key]!.forEach((callback) => callback(this.state[key]));
		}
	}

	public initAuthState() {
		const access_token = localStorage.getItem("access_token");
		if (access_token) {
			this.setState("access_token", access_token);
			// 추가로 사용자 정보를 가져와서 state에 설정할 수 있습니다.
		}
	}

	public logout() {
		localStorage.removeItem("access_token");
		this.setState("access_token", null);
		this.setState("user", null);
	}
}

export default StateManager.getInstance();
