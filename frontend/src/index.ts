import Router from "./routes/Router";
import I18n from "./localization/I18n";
import AuthService from "./auth/AuthService";

document.addEventListener("DOMContentLoaded", () => {
	init();
});

async function init() {
	await I18n.loadTranslations(); // 언어 파일 로드

	const app = document.getElementById("app");
	if (app) {
		Router.getInstance();
		if (AuthService.getInstance().isAuthenticated()) {
			// 사용자가 인증된 상태라면, 추가 로직을 실행할 수 있습니다.
		}
	}
}
