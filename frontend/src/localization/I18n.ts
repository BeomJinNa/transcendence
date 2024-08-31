type Translation = { [key: string]: string };

class I18n {
	private locale: string;
	private translations: { [key: string]: Translation } = {};
	private supportedLocales: string[] = [
		"en", "ko", "ja", "zh", "es", "de", "fr", 
		"ru", "it", "pt", "nl", "hi", "ar", 
		"tr", "pl", "vi", "th", "sv"
	];

	constructor() {
		const savedLocale = localStorage.getItem("locale");
		this.locale = this.getBrowserLocale() || savedLocale || "en";
	}

	private getBrowserLocale(): string | null {
		const browserLocale = navigator.language || navigator.languages[0];
		const languageCode = browserLocale.split('-')[0];

		if (this.supportedLocales.includes(languageCode)) {
			return languageCode;
		}

		return null;
	}

	public async loadTranslations() {
		const response = await fetch(`/locales/${this.locale}.json`);
		this.translations[this.locale] = await response.json();
	}

	public t(key: string): string {
		return this.translations[this.locale][key] || key;
	}

	public async setLocale(locale: string): Promise<void> {
		if (this.locale !== locale) {
			this.locale = locale;
			localStorage.setItem("locale", locale);
			await this.loadTranslations();
		}
	}

	public getLocale(): string {
		return this.locale;
	}
}

export default new I18n();
