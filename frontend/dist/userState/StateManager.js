class StateManager {
    constructor() {
        this.state = {
            isAuthenticated: false,
            token: null,
            user: null,
            currentPage: "/",
            gameState: null,
            players: [],
            language: "en",
            theme: "light",
        };
        this.observers = {};
    }
    static getInstance() {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }
    getState(key) {
        return this.state[key];
    }
    setState(key, value) {
        this.state[key] = value;
        this.notifyObservers(key);
    }
    subscribe(key, callback) {
        if (!this.observers[key]) {
            this.observers[key] = [];
        }
        this.observers[key].push(callback);
    }
    notifyObservers(key) {
        if (this.observers[key]) {
            this.observers[key].forEach((callback) => callback(this.state[key]));
        }
    }
    initAuthState() {
        const token = localStorage.getItem("authToken");
        if (token) {
            this.setState("isAuthenticated", true);
            this.setState("token", token);
            // 추가로 사용자 정보를 가져와서 state에 설정할 수 있습니다.
        }
    }
    logout() {
        localStorage.removeItem("authToken");
        this.setState("isAuthenticated", false);
        this.setState("token", null);
        this.setState("user", null);
    }
}
export default StateManager.getInstance();
