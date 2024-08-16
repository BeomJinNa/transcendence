import Router from "./routes/Router.js";
import I18n from "./localization/I18n.js";
import AuthService from "./auth/AuthService.js";

document.addEventListener("DOMContentLoaded", () => {
	init();
});

async function init() {
	await I18n.loadTranslations(); // 언어 파일 로드

	const app = document.getElementById("app");

	if (app) {
		if (AuthService.isAuthenticated()) {
			// 사용자가 인증된 상태라면, 추가 로직을 실행할 수 있습니다.
		}
		Router.init(app); // Router 초기화 및 애플리케이션 시작
	}
}
