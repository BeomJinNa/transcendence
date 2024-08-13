interface AuthProvider {
	login(email: string, password: string): Promise<boolean>;
	logout(): void;
	isAuthenticated(): boolean;
	getToken(): string | null;
	getUser(): { email: string; nickname: string } | null;
}

export default AuthProvider;
