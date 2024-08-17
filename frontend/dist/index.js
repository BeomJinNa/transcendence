var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Router from "./routes/Router.js";
import I18n from "./localization/I18n.js";
import AuthService from "./auth/AuthService.js";
import LocalAuthProvider from "./auth/LocalAuthProvider.js";
document.addEventListener("DOMContentLoaded", () => {
    init();
});
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield I18n.loadTranslations(); // 언어 파일 로드
        const authService = new AuthService(new LocalAuthProvider());
        const app = document.getElementById("app");
        if (app) {
            if (authService.isAuthenticated()) {
                // 사용자가 인증된 상태라면, 추가 로직을 실행할 수 있습니다.
            }
            Router.init(app); // Router 초기화 및 애플리케이션 시작
        }
    });
}
