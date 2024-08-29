import Router from "./routes/Router";
import I18n from "./localization/I18n";
import AuthService from "./auth/AuthService";
import { apiClient } from "./api/ApiClient";
import "bootstrap/dist/css/bootstrap.min.css";

document.addEventListener("DOMContentLoaded", () => {
	init();
});

async function init() {
	await I18n.loadTranslations();
	apiClient.setAuthService(AuthService.getInstance());
	sessionStorage.clear();

	const app = document.getElementById("app");
	if (app) {
		if (AuthService.getInstance().isAuthenticated()) {
			// 사용자가 인증된 상태라면, 추가 로직을 실행할 수 있습니다.
		}
		Router.getInstance();
	}
}
