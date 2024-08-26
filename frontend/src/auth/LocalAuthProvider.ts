import AuthProvider from "./AuthProvider";
import StateManager from "../userState/StateManager";

class LocalAuthProvider implements AuthProvider {
	private isLogined: boolean = false;

	constructor() {
	}

	login(login_token: string): Promise<boolean>
	{
		this.isLogined = true;
		return Promise.resolve(true);
	}
	logout(): void
	{
		this.isLogined = false;
	}
	isAuthenticated(): boolean
	{
		return this.isLogined;
	}
	getAccessToken(): string | null
	{
		return this.isLogined ? "accesstoken" : null;
	}
	refresh(): Promise<boolean>
	{
		return Promise.resolve(true);
	}
	getUser(): { email: string; nickname: string } | null
	{
		return this.isLogined ? { email: "email", nickname: "nickname" } : null;
	}
	signup(email: string, password: string, nickname: string): Promise<boolean>
	{
		return Promise.resolve(true);
	}
}

export default LocalAuthProvider;
