interface AuthProvider {
	login(login_token: string): Promise<boolean>;
	logout(): void;
	isAuthenticated(): boolean;
	getAccessToken(): string | null;
	refresh(): Promise<boolean>;
	getUser(): Promise<{ email: string; nickname: string } | null>;
}

export default AuthProvider;
