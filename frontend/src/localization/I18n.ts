type Translation = { [key: string]: string };
class I18n {
	private locale: string;
	private translations: { [key: string]: Translation } = {};

	constructor(defaultLocale: string) {
		this.locale = defaultLocale;
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
			await this.loadTranslations();
		}
	}

	public getLocale(): string {
		return this.locale;
	}
}

export default new I18n("en"); // 기본 언어는 영어로 설정
