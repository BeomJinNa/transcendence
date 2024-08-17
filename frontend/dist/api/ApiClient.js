var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { API_BASE_URL } from "../constants.js";
class ApiClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }
    request(method, url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                "Content-Type": "application/json",
            };
            const token = localStorage.getItem("authToken");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            const options = {
                method,
                headers,
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            const response = yield fetch(`${this.baseUrl}${url}`, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
    }
    get(url, params) {
        return this.request("GET", url, params);
    }
    post(url, data) {
        return this.request("POST", url, data);
    }
    put(url, data) {
        return this.request("PUT", url, data);
    }
    delete(url) {
        return this.request("DELETE", url);
    }
}
export default new ApiClient();
