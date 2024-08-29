import { apiClient } from "../api/ApiClient";
import AuthProvider from "./AuthProvider";

export default class TwoFactorAuthProvider implements AuthProvider {
  async login(login_token: string): Promise<boolean> {
    let result;
    try {
      result = await apiClient.post("/verify/", { token: login_token });
    } catch (e) {
      this.logout();
      return false;
    }
    if (!result.ok) {
      this.logout();
      return false;
    }
    const responseBody = await result.json();
    localStorage.setItem("access_token", responseBody.access);
    localStorage.setItem("refresh_token", responseBody.refresh);
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
    let result;
    try {
      result = await apiClient.post("/refresh/", {
        refresh_token: localStorage.getItem("refresh_token"),
      });
    } catch (e) {
      this.logout();
      return false;
    }
    if (!result.ok) {
      this.logout();
      return false;
    }
    const responseBody = await result.json();
    localStorage.setItem("access_token", responseBody.access);
    localStorage.setItem("refresh_token", responseBody.refresh);
    return true;
  }
  async getUser(): Promise<{ email: string; nickname: string } | null> {
    let result;
    try {
      result = await apiClient.get("/me/");
    } catch (e) {
      this.logout();
      return null;
    }
    if (!result.ok) {
      this.logout();
      return null;
    }
    const responseBody = await result.json();
    return {
      email: responseBody.email,
      nickname: responseBody.username,
    };
  }
}
