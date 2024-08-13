import AuthProvider from "./AuthProvider.js";
import StateManager from "../userState/StateManager.js";
import ApiClient from "../api/ApiClient.js";
import { AUTH_LOGIN_URL, AUTH_USER_URL } from "../constants.js";

class OAuthProvider implements AuthProvider {
	// OAuth 로그인을 처리하는 메소드
	async login(oauthCode: string): Promise<boolean> {
		try {
			// TODO: OAuth 서버와의 통신을 통해 받은 코드를 사용하여 토큰을 발급받습니다.
			const response = await ApiClient.post(AUTH_LOGIN_URL, {
				code: oauthCode,
			});

			if (!response.ok) {
				throw new Error("OAuth login failed");
			}

			const data = await response.json();
			const { token, user } = data;

			// JWT 토큰을 localStorage에 저장
			localStorage.setItem("authToken", token);

			// 상태 관리 모듈에 사용자 상태를 저장
			StateManager.setState("isAuthenticated", true);
			StateManager.setState("token", token);
			StateManager.setState("user", user);

			return true;
		} catch (error) {
			console.error("OAuth login error:", error);
			return false;
		}
	}

	// 로그아웃 처리 메소드
	logout(): void {
		// 로그아웃 시 토큰 삭제
		localStorage.removeItem("authToken");
		StateManager.setState("isAuthenticated", false);
		StateManager.setState("token", null);
		StateManager.setState("user", null);

		// TODO: 서버에서의 로그아웃이 필요한 경우, 해당 API 호출 추가
	}

	// 사용자가 인증되었는지 여부를 반환하는 메소드
	isAuthenticated(): boolean {
		return StateManager.getState("isAuthenticated");
	}

	// 저장된 JWT 토큰을 반환하는 메소드
	getToken(): string | null {
		return StateManager.getState("token");
	}

	// 사용자 정보를 반환하는 메소드
	getUser(): { email: string; nickname: string } | null {
		return StateManager.getState("user");
	}

	// TODO: 2FA(이중 인증) 로직을 추가할 부분
	// 2FA가 필요한 경우, 여기에 관련 API 호출과 로직을 추가합니다.
}

export default OAuthProvider;

//현재는 임시로 LocalAuthProvider를 사용하고 있으며, 이후 OAuthProvider 구현이 끝나는대로 교체할 예정
