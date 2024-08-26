interface AuthProvider {
	login(login_token: string): Promise<boolean>;
	logout(): void;
	isAuthenticated(): boolean;
	getAccessToken(): string | null;
	refresh(): Promise<boolean>;
	getUser(): { email: string; nickname: string } | null;
	signup(email: string, password: string, nickname: string): Promise<boolean>;
}

export default AuthProvider;
