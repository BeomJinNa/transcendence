var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AuthService {
    constructor(provider) {
        this.provider = provider;
    }
    static getInstance(provider) {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService(provider);
        }
        return AuthService.instance;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.provider.login(email, password);
        });
    }
    logout() {
        this.provider.logout();
    }
    isAuthenticated() {
        return this.provider.isAuthenticated();
    }
    getToken() {
        return this.provider.getToken();
    }
    getUser() {
        return this.provider.getUser();
    }
}
export default AuthService;
//이후 const authService = new AuthService(new AuthProvider()); 형태로 필요한 AuthProvider를 결합해서 호출이 가능
//AuthProvider를 변경하더라도 AuthService는 변경하지 않아도 됨
