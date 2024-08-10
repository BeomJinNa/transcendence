type State = {
	isAuthenticated: boolean;
	token: string | null;
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
		// 초기 상태 설정
		this.state = {
			isAuthenticated: false,
			token: null,
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
}

export default StateManager.getInstance();
