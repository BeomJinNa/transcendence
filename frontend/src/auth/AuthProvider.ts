interface AuthProvider {
	login(email: string, password: string): Promise<boolean>;
	logout(): void;
	isAuthenticated(): boolean;
	getToken(): string | null;
	getUser(): { email: string; nickname: string } | null;
	signup(email: string, password: string, nickname: string): Promise<boolean>;
}

export default AuthProvider;
