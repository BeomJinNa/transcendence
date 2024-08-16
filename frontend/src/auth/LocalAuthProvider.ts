import AuthProvider from "./AuthProvider.js";
import StateManager from "../userState/StateManager.js";

class LocalAuthProvider implements AuthProvider {
	// 로컬 환경에서의 간단한 로그인 처리
	async login(email: string, password: string): Promise<boolean> {
		try {
			// 성공적으로 로그인한 것처럼 처리
			const token = "dummy-token";
			const user = { email, nickname: "LocalUser" };

			// 토큰과 사용자 정보를 저장
			localStorage.setItem("authToken", token);
			StateManager.setState("isAuthenticated", true);
			StateManager.setState("token", token);
			StateManager.setState("user", user);

			console.log(
				"Login successful, state updated:",
				StateManager.getState("isAuthenticated")
			);

			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	}

	// 로그아웃 처리
	logout(): void {
		console.log("Logging out");
		localStorage.removeItem("authToken");
		StateManager.setState("isAuthenticated", false);
		StateManager.setState("token", null);
		StateManager.setState("user", null);
	}

	// 인증 상태를 반환
	isAuthenticated(): boolean {
		console.log("Checking authentication state");
		return StateManager.getState("isAuthenticated");
	}

	// 토큰을 반환
	getToken(): string | null {
		console.log("Getting token");
		return StateManager.getState("token");
	}

	// 사용자 정보를 반환
	getUser(): { email: string; nickname: string } | null {
		console.log("Getting user info");
		return StateManager.getState("user");
	}

	async signup(
		email: string,
		password: string,
		nickname: string
	): Promise<boolean> {
		console.log(`Signing up with ${email}, ${nickname}`);
		return true;
	}
}

export default LocalAuthProvider;

//개발 과정에서의 임시 모듈이므로 이후에 OAuthProvider로 대체될 예정
//OAuthProvider로 대체되면 LocalAuthProvider는 삭제될 예정
