import AuthProvider from "./AuthProvider";
import StateManager from "../userState/StateManager";

class LocalAuthProvider implements AuthProvider {
	private readonly TOKEN_KEY = "authToken";
	private readonly USER_KEY = "user";

	constructor() {
		// 앱이 시작될 때 localStorage를 StateManager와 동기화
		this.syncStateWithLocalStorage();
	}

	private syncStateWithLocalStorage(): void {
		const token = localStorage.getItem(this.TOKEN_KEY);
		const user = localStorage.getItem(this.USER_KEY);
		if (token && user) {
			StateManager.setState("isAuthenticated", true);
			StateManager.setState("token", token);
			StateManager.setState("user", JSON.parse(user));
		} else {
			StateManager.setState("isAuthenticated", false);
			StateManager.setState("token", null);
			StateManager.setState("user", null);
		}
	}

	async login(email: string, password: string): Promise<boolean> {
		try {
			const token = "dummy-token";
			const user = { email, nickname: "LocalUser" };

			localStorage.setItem(this.TOKEN_KEY, token);
			localStorage.setItem(this.USER_KEY, JSON.stringify(user));
			this.syncStateWithLocalStorage(); // 로그인 후 상태를 동기화

			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	}

	logout(): void {
		localStorage.removeItem(this.TOKEN_KEY);
		localStorage.removeItem(this.USER_KEY);
		this.syncStateWithLocalStorage(); // 로그아웃 후 상태를 동기화
	}

	isAuthenticated(): boolean {
		// 상태를 동기화하고 나서 인증 상태를 확인
		this.syncStateWithLocalStorage();
		return StateManager.getState("isAuthenticated");
	}

	getToken(): string | null {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	getUser(): { email: string; nickname: string } | null {
		const user = localStorage.getItem(this.USER_KEY);
		return user ? JSON.parse(user) : null;
	}

	async signup(
		email: string,
		password: string,
		nickname: string
	): Promise<boolean> {
		// 실제 구현에서는 서버와 통신하여 사용자를 등록합니다.
		return true;
	}
}

export default LocalAuthProvider;
