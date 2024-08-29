import AuthService from "../auth/AuthService";
import { API_BASE_URL } from "../constants";

class ApiClient {
  private baseUrl: string;
  private maxRetries: number = 3;
  private authService: AuthService | null = null;
  private retryCount: number = 0;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public setAuthService(authService: AuthService) {
    this.authService = authService;
  }

  private async request(
    method: string,
    url: string,
    data?: object
  ): Promise<any> {
    if (this.retryCount >= this.maxRetries) {
      throw new Error(
        "No refresh token available or maximum retry attempts reached."
      );
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = this.authService?.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${url}`, options);

    // 401 Unauthorized 처리
    if (response.status === 401) {
      this.retryCount++;
      if (this.authService === null) {
        throw new Error("AuthService is not set.");
      }
      const result = await this.authService.refresh();
      if (!result) {
        throw new Error("Token refresh failed after multiple attempts.");
      }
      // Authorization 헤더를 새 토큰으로 갱신
      headers["Authorization"] = `Bearer ${this.authService.getAccessToken()}`;

      // 원래 요청 다시 시도
      return await this.request(method, url, data);
    }
    this.retryCount = 0;

    return response;
  }

  public get(url: string, params?: object) {
    return this.request("GET", url, params);
  }

  public post(url: string, data: object) {
    return this.request("POST", url, data);
  }

  public put(url: string, data: object) {
    return this.request("PUT", url, data);
  }

  public delete(url: string) {
    return this.request("DELETE", url);
  }
}
export const apiClient = new ApiClient("https://localhost/api");
export default ApiClient;
