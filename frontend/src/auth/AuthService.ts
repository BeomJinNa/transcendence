import AuthProvider from "./AuthProvider";
import LocalAuthProvider from "./LocalAuthProvider";

export default class AuthService {
	private static instance: AuthService | null = null;
	private provider: AuthProvider;

	private constructor(authProvider: AuthProvider) {
		this.provider = authProvider;
	}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService(new LocalAuthProvider());
		}
		return AuthService.instance;
	}

	async login(email: string, password: string): Promise<boolean> {
		return await this.provider.login(email, password);
	}

	logout(): void {
		this.provider.logout();
	}

	isAuthenticated(): boolean {
		return this.provider.isAuthenticated();
	}

	getToken(): string | null {
		return this.provider.getToken();
	}

	getUser(): { email: string; nickname: string } | null {
		return this.provider.getUser();
	}

	async signup(
		email: string,
		password: string,
		nickname: string
	): Promise<boolean> {
		return await this.provider.signup(email, password, nickname);
	}
}

//이후 const authService = new AuthService(new AuthProvider()); 형태로 필요한 AuthProvider를 결합해서 호출이 가능
//AuthProvider를 변경하더라도 AuthService는 변경하지 않아도 됨
