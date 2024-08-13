import { API_BASE_URL } from "../constants.js";

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl;
	}

	private async request(method: string, url: string, data?: object) {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		const token = localStorage.getItem("authToken");
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		const options: RequestInit = {
			method,
			headers,
		};

		if (data) {
			options.body = JSON.stringify(data);
		}

		const response = await fetch(`${this.baseUrl}${url}`, options);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
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

export default new ApiClient();
