var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import StateManager from "../userState/StateManager.js";
class LocalAuthProvider {
    // 로컬 환경에서의 간단한 로그인 처리
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 성공적으로 로그인한 것처럼 처리
                const token = "dummy-token";
                const user = { email, nickname: "LocalUser" };
                // 토큰과 사용자 정보를 저장
                localStorage.setItem("authToken", token);
                StateManager.setState("isAuthenticated", true);
                StateManager.setState("token", token);
                StateManager.setState("user", user);
                return true;
            }
            catch (error) {
                console.error("Login error:", error);
                return false;
            }
        });
    }
    // 로그아웃 처리
    logout() {
        localStorage.removeItem("authToken");
        StateManager.setState("isAuthenticated", false);
        StateManager.setState("token", null);
        StateManager.setState("user", null);
    }
    // 인증 상태를 반환
    isAuthenticated() {
        return StateManager.getState("isAuthenticated");
    }
    // 토큰을 반환
    getToken() {
        return StateManager.getState("token");
    }
    // 사용자 정보를 반환
    getUser() {
        return StateManager.getState("user");
    }
}
export default LocalAuthProvider;
//개발 과정에서의 임시 모듈이므로 이후에 OAuthProvider로 대체될 예정
//OAuthProvider로 대체되면 LocalAuthProvider는 삭제될 예정
