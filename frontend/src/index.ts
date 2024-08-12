import Router from "./routes/Router.js";
import I18n from "./localization/I18n.js";

document.addEventListener("DOMContentLoaded", () => {
	init();
});

async function init() {
	await I18n.loadTranslations(); // 언어 파일 로드
	const app = document.getElementById("app");
	if (app) {
		Router.init(app); // Router 초기화 및 애플리케이션 시작
	}
}
