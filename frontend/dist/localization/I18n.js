var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class I18n {
    constructor(defaultLocale) {
        this.translations = {};
        this.locale = defaultLocale;
    }
    loadTranslations() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/locales/${this.locale}.json`);
            this.translations[this.locale] = yield response.json();
        });
    }
    t(key) {
        return this.translations[this.locale][key] || key;
    }
    setLocale(locale) {
        this.locale = locale;
        this.loadTranslations();
    }
}
export default new I18n("en"); // 기본 언어는 영어로 설정
