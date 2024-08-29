import AuthProvider from "./AuthProvider";
import TwoFactorAuthProvider from "./TwoFactorAuthProvider";

export default class AuthService {
	private static instance: AuthService | null = null;
	private provider: AuthProvider;

	private constructor(authProvider: AuthProvider) {
		this.provider = authProvider;
	}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService(new TwoFactorAuthProvider());
		}
		return AuthService.instance;
	}

	async login(login_token: string): Promise<boolean> {
		return await this.provider.login(login_token);
		// throw new Error("Method not implemented.");
	}

	logout(): void {
		this.provider.logout();
	}

	isAuthenticated(): boolean {
		return this.provider.isAuthenticated();
	}

	getAccessToken(): string | null {
		return this.provider.getAccessToken();
	}

	refresh(): Promise<boolean> {
		return this.provider.refresh();
	}

	getUser(): Promise<{ email: string; nickname: string } | null> {
		return this.provider.getUser();
	}
}

//이후 const authService = new AuthService(new AuthProvider()); 형태로 필요한 AuthProvider를 결합해서 호출이 가능
//AuthProvider를 변경하더라도 AuthService는 변경하지 않아도 됨
