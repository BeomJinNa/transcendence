import ApiClient, { apiClient } from "../api/ApiClient";
import AuthProvider from "./AuthProvider";

export default class TwoFactorAuthProvider implements AuthProvider {
  async login(login_token: string): Promise<boolean> {
    let result;
    try {
      result = await apiClient.post("/verify/", { token: login_token });
    } catch (e) {
      return false;
    }
    const responseBody = await result.json();
    localStorage.setItem("access_token", responseBody.access_token);
    localStorage.setItem("refresh_token", responseBody.refresh_token);
    return true;
  }
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
  isAuthenticated(): boolean {
    return localStorage.getItem("access_token") !== null;
  }
  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }
  async refresh(): Promise<boolean> {
    let requestBody;
    try {
      requestBody = await apiClient.post("/refresh/", {
        refresh_token: localStorage.getItem("refresh_token"),
      });
    } catch (e) {
      console.error(e);
      return false;
    }
    localStorage.setItem("access_token", requestBody.access_token);
    localStorage.setItem("refresh_token", requestBody.refresh_token);
    return true;
  }
  getUser(): { email: string; nickname: string } | null {
    throw new Error("Method not implemented.");
  }
  async signup(
    email: string,
    nickname: string,
    password: string
  ): Promise<boolean> {
    try {
      await apiClient.post("/signup/", { email, nickname, password });
    } catch (e) {
      return false;
    }
    return true;
  }
}
