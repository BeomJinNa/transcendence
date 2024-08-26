# Transcendence Project

---

## 프로젝트 개요

**Transcendence**는 **TypeScript**를 사용하여 **SPA (Single Page Application)** 구조로 구현된 웹 애플리케이션입니다. 이 프로젝트는 현대적인 웹 개발의 모범 사례를 따르며, 사용자 인증, 라우팅, 다국어 지원 등의 기능을 포함하고 있습니다. 

## 실행 방법

### 1. SSL 인증서 생성
프로젝트를 실행하기 전에 SSL 인증서를 생성해야 합니다.

```bash
make certs
```

위 명령어를 통해 SSL 인증서를 생성합니다. 인증서는 `frontend/certs` 디렉토리에 생성됩니다.

### 2. 프로덕션 환경에서 애플리케이션 실행

```bash
make prod
```

위 명령어로 Docker 컨테이너를 빌드하고 실행합니다.

### 3. 애플리케이션 접속
`.env` 파일에 설정된 `DOMAIN_NAME`을 브라우저 주소창에 입력하여 애플리케이션에 접속할 수 있습니다.

---

## 프로젝트 구조

```zsh
frontend/
├── certs/                     # SSL 인증서 위치
├── dist/                      # TypeScript 컴파일 결과물
├── public/                    # 정적 파일 (CSS, 이미지, HTML)
├── src/                       # TypeScript 소스 파일들
│   ├── api/                   # API 클라이언트 모듈 (백엔드에서 작업 중)
│   ├── auth/                  # 인증 관련 모듈
│   ├── localization/          # 다국어 지원 모듈
│   ├── pages/                 # 각 페이지 컴포넌트
│   ├── routes/                # SPA 라우팅 관리
│   ├── constants.ts           # 프로젝트 내 상수들
│   ├── index.ts               # 진입점
└── tsconfig.json              # TypeScript 설정 파일
```

### 디렉토리 설명

- **certs/**: SSL 인증서가 저장되는 디렉토리입니다.
- **dist/**: TypeScript 컴파일 후 생성된 JavaScript 파일들이 위치한 디렉토리입니다.
- **public/**: 정적 자원들(CSS, 이미지, HTML 파일)들이 위치한 디렉토리입니다.
- **src/**: 애플리케이션의 핵심 소스 코드가 위치한 디렉토리입니다.
  - **api/**: 백엔드와의 통신을 위한 API 클라이언트 모듈입니다.
  - **auth/**: 사용자 인증과 관련된 모듈들이 위치합니다.
  - **localization/**: 다국어 지원을 관리하는 모듈이 위치합니다.
  - **pages/**: 각 페이지의 컴포넌트가 위치한 디렉토리입니다.
  - **routes/**: SPA 구조에서 라우팅을 관리하는 모듈이 위치합니다.
  - **constants.ts**: 프로젝트 내에서 사용되는 상수들이 정의된 파일입니다.
  - **index.ts**: 애플리케이션의 진입점으로, 초기 설정과 기본 로직이 포함된 파일입니다.

---

## SPA 구조 및 모듈화

이 프로젝트는 SPA 구조로 설계되어 있으며, 페이지 전환과 상태 관리를 효율적으로 처리합니다. 아래는 주요 모듈과 그 역할입니다.

### 1. **라우팅**: `Router.ts`
SPA 구조에서 각 URL 경로에 따라 적절한 페이지를 렌더링합니다. 페이지 전환 시 상태를 유지하며, 인증 여부에 따라 접근을 제어합니다.

### 2. **페이지 컴포넌트**: `pages/`
각 페이지는 독립적인 모듈로 관리되며, 필요한 경우 CSS 파일을 연결하여 스타일을 적용합니다. 예를 들어, `GamePage.ts`는 게임 페이지를 담당하며, `LoginPage.ts`는 로그인 페이지를 담당합니다.

### 3. **인증 모듈**: `auth/`
사용자 인증을 담당합니다. `AuthService`는 인증 상태를 관리하며, 필요 시 API와 통신하여 인증 작업을 수행합니다. 현재는 `LocalAuthProvider`가 임시로 사용되며, 이후 백엔드와 연동될 예정입니다.

### 4. **다국어 지원**: `I18n.ts`
다국어 지원을 담당하며, JSON 파일을 통해 번역 데이터를 관리합니다. 사용자의 언어 설정에 따라 자동으로 번역을 적용합니다.

---

## 앞으로의 작업 (선택 사항)
- **OAuth 연동**: 백엔드와의 OAuth2.0 연동을 통해 소셜 로그인 기능을 추가할 예정입니다.
- **API 통합**: 백엔드에서 제공하는 API와의 통합 작업이 예정되어 있습니다.
- **추가 기능**: 게임 로직 개선, 더 나은 UX를 위한 추가 작업 등이 예정되어 있습니다.


## 프론트엔드 모듈 상세 설명

### **I18n.ts**

---

### **1. 역할**

`I18n.ts` 파일은 다국어 지원을 위한 모듈을 제공하며, 애플리케이션 내에서 다양한 언어로 번역된 텍스트를 관리합니다. 이 모듈을 통해 사용자는 애플리케이션의 언어를 선택하고, 선택된 언어에 따라 화면에 표시되는 텍스트가 동적으로 변경됩니다.

### **2. 주요 클래스 및 메소드**

#### **2.1 I18n 클래스**
- **역할**: 애플리케이션의 다국어 설정을 관리하는 클래스입니다. 현재 선택된 언어에 따라 번역된 텍스트를 제공하고, 언어를 변경할 수 있는 기능을 제공합니다.
- **주요 메소드**:
  - **constructor(defaultLocale: string)**: 기본 언어를 설정하고, 사용자가 이전에 선택한 언어를 `localStorage`에서 불러옵니다.
  - **loadTranslations()**: 현재 설정된 언어에 대한 번역 파일을 서버에서 비동기적으로 로드하여 저장합니다.
  - **t(key: string): string**: 주어진 키에 해당하는 번역된 문자열을 반환합니다. 만약 해당 키가 존재하지 않으면 키 자체를 반환합니다.
  - **setLocale(locale: string): Promise<void>**: 언어를 변경하고, 해당 언어에 대한 번역 파일을 로드하여 저장합니다.
  - **getLocale(): string**: 현재 설정된 언어를 반환합니다.

### **3. 동작 원리**

`I18n` 클래스는 사용자가 설정한 언어를 기준으로, 해당 언어의 번역 파일을 서버에서 가져와 메모리에 저장합니다. 애플리케이션에서 텍스트가 필요할 때마다 `t(key: string)` 메소드를 호출하여, 현재 언어에 맞는 번역된 문자열을 가져옵니다. 언어가 변경되면, `setLocale(locale: string)` 메소드를 통해 새로운 언어로 번역 파일을 다시 로드하고, `localStorage`에 새로운 언어 설정을 저장합니다.

### **4. 추가 정보**

- **참고 자료**: 
  - 다국어 지원을 구현할 때 일반적으로 사용하는 i18n 라이브러리와 비슷한 방식으로 설계되었습니다. 
  - JSON 파일 형식으로 번역 데이터를 관리하며, 각 언어에 대한 번역은 `/locales/` 디렉토리에 저장된 파일에서 불러옵니다.
  
- **관련된 다른 파일**:
  - `/locales/` 디렉토리 내의 JSON 파일들 (예: `en.json`, `ko.json`)과 밀접한 관련이 있습니다. 이 파일들이 실제로 번역 데이터를 제공합니다.

### **5. 집중 해설**

#### **언어 변경과 번역 파일 로드 (`setLocale` 메소드)**

이 메소드는 사용자가 언어를 변경했을 때 새로운 언어에 맞는 번역 파일을 로드하고, `localStorage`에 변경된 언어를 저장합니다. 이 과정에서 이미 로드된 번역 파일이 있다면 다시 로드하지 않고, 새로운 언어가 설정되었을 때만 번역 파일을 로드합니다.

```typescript
public async setLocale(locale: string): Promise<void> {
	if (this.locale !== locale) {
		this.locale = locale;
		localStorage.setItem("locale", locale);
		await this.loadTranslations();
	}
}
```

1. **언어 비교 (`this.locale !== locale`)**: 현재 설정된 언어와 사용자가 선택한 새로운 언어가 다른 경우에만 언어를 변경하고 번역 파일을 로드합니다. 이로 인해 불필요한 번역 파일 로드를 방지합니다.
   
2. **언어 설정 및 저장 (`this.locale = locale; localStorage.setItem("locale", locale);`)**: 새로운 언어를 `locale`로 설정하고, 이를 `localStorage`에 저장하여 사용자가 다음에 접속할 때도 동일한 언어를 사용할 수 있도록 합니다.

3. **번역 파일 로드 (`await this.loadTranslations();`)**: 설정된 언어에 대한 번역 파일을 서버에서 비동기적으로 로드합니다. 이 파일은 이후에 `t()` 메소드를 통해 번역된 텍스트를 제공하는 데 사용됩니다.

#### **번역 키 조회 (`t` 메소드)**

이 메소드는 텍스트 키를 받아서 현재 언어에 맞는 번역된 문자열을 반환합니다.

```typescript
public t(key: string): string {
	return this.translations[this.locale][key] || key;
}
```

1. **번역된 문자열 조회 (`this.translations[this.locale][key]`)**: 현재 설정된 언어(`this.locale`)에 대한 번역 객체에서 주어진 키(`key`)에 해당하는 문자열을 찾아 반환합니다.
   
2. **기본값으로 키 반환 (`|| key`)**: 만약 주어진 키에 해당하는 번역이 존재하지 않으면, 키 자체를 반환합니다. 이를 통해 번역이 누락되었거나 잘못된 키를 사용했을 때도 시스템이 오류를 발생시키지 않고 정상적으로 작동합니다.

### **Router.ts**

---

### **1. 역할**

`Router.ts` 파일은 SPA(단일 페이지 애플리케이션)에서 클라이언트 측 라우팅을 담당합니다. URL 경로에 따라 적절한 페이지 컴포넌트를 렌더링하고, 페이지 전환을 관리합니다. 또한, 사용자의 인증 상태에 따라 특정 페이지에 대한 접근을 제한하는 기능도 제공합니다.

### **2. 주요 클래스 및 메소드**

#### **2.1 Router 클래스**
- **역할**: 애플리케이션의 라우팅을 관리하며, URL에 따라 각 페이지를 적절히 로드하고 렌더링합니다.
- **주요 속성**:
  - **routes**: 각 URL 경로와 해당 경로에 대응하는 페이지 컴포넌트를 정의하는 객체입니다.
  - **app**: 애플리케이션의 루트 DOM 요소로, 여기에 페이지 컴포넌트가 렌더링됩니다.
  - **pathToRedirect**: 인증이 필요한 페이지에 접근할 때 인증되지 않은 사용자를 리디렉션할 경로를 설정합니다.
  - **authService**: 사용자 인증 상태를 관리하는 서비스로, 로그인 여부를 확인하는 데 사용됩니다.
  - **instance**: 싱글톤 패턴을 적용하여 `Router` 클래스의 인스턴스를 하나만 유지합니다.

- **주요 메소드**:
  - **constructor()**: 라우터를 초기화하고, 현재 URL에 맞는 페이지를 렌더링합니다.
  - **navigateTo(path: string)**: 주어진 경로로 네비게이트하고, 해당 경로에 맞는 페이지를 렌더링합니다.
  - **render(path: string)**: 현재 경로에 맞는 페이지를 렌더링하며, 접근 제한이 필요한 경우 이를 처리합니다.
  - **loadPage(PageComponent: PageComponentType)**: 페이지 컴포넌트를 로드하고 렌더링하는 핸들러를 반환합니다.

### **3. 동작 원리**

`Router` 클래스는 URL 경로를 기반으로 해당 경로에 대응하는 페이지를 렌더링합니다. 라우터는 처음 초기화될 때, `routes` 객체에 정의된 경로와 페이지 핸들러를 설정하고, 현재 URL 경로에 맞는 페이지를 렌더링합니다. 이후, `navigateTo()` 메소드를 통해 다른 경로로 이동할 수 있으며, 브라우저의 `popstate` 이벤트를 통해 뒤로 가기, 앞으로 가기 등의 네비게이션이 처리됩니다.

### **4. 추가 정보**

- **참고 자료**:
  - 이 라우터는 클라이언트 측에서 작동하며, 서버에 요청하지 않고도 URL 경로를 변경하고 페이지를 전환할 수 있습니다.
  - 인증이 필요한 페이지에 대한 접근 제한 기능도 포함하고 있어, 사용자가 로그인 상태인지 확인하고 적절히 처리합니다.
  
- **관련된 다른 파일**:
  - `pages` 디렉토리 내의 페이지 컴포넌트들 (`MainPage.ts`, `LoginPage.ts`, `SignupPage.ts`, `GamePage.ts`)과 밀접한 관련이 있습니다. 각 경로에 대응하는 페이지 컴포넌트들이 `routes` 객체에 정의되어 있습니다.

### **5. 집중 해설**

#### **5.1 경로와 페이지 컴포넌트의 매핑 (`routes` 객체)**

`routes` 객체는 각 URL 경로에 대응하는 페이지 컴포넌트를 매핑하고, 필요에 따라 접근 제한 옵션을 설정합니다.

```typescript
this.routes = {
	"/": {
		handler: this.loadPage(MainPage),
	},
	"/login": {
		handler: this.loadPage(LoginPage),
		restrictedIfAuthenticated: true, // 로그인 상태에서 접근 제한
	},
	"/signup": {
		handler: this.loadPage(SignupPage),
		restrictedIfAuthenticated: true, // 로그인 상태에서 접근 제한
	},
	"/game": {
		handler: this.loadPage(GamePage),
		restricted: true, // 로그인이 필요한 페이지
	},
};
```

1. **핸들러 정의 (`handler`)**: 각 경로에 대해 `loadPage()` 메소드로 생성된 핸들러를 정의합니다. 이 핸들러는 해당 경로에 맞는 페이지 컴포넌트를 생성하고 렌더링합니다.
   
2. **접근 제한 옵션 (`restricted`, `restrictedIfAuthenticated`)**:
   - `restricted`: 인증된 사용자만 접근할 수 있는 페이지를 설정합니다. 예를 들어, 게임 페이지(`"/game"`)는 로그인하지 않은 사용자가 접근할 수 없도록 제한합니다.
   - `restrictedIfAuthenticated`: 로그인한 사용자가 접근할 수 없는 페이지를 설정합니다. 예를 들어, 로그인 페이지(`"/login"`)와 회원가입 페이지(`"/signup"`)는 이미 로그인된 사용자가 접근할 수 없도록 합니다.

#### **5.2 페이지 렌더링과 접근 제어 (`render` 메소드)**

`render()` 메소드는 주어진 경로에 맞는 페이지를 렌더링하며, 필요에 따라 접근 제한을 처리합니다.

```typescript
private render(path: string) {
	const route = this.routes[path] || this.routes["/"];

	// 로그인이 필요한 페이지 접근 시
	if (route.restricted && !this.authService.isAuthenticated()) {
		alert(I18n.t("youMustBeLoggedIn"));
		this.navigateTo(this.pathToRedirect);
		return;
	}

	// 로그인이 되어 있으면 접근할 수 없는 페이지 접근 시
	if (route.restrictedIfAuthenticated && this.authService.isAuthenticated()) {
		this.navigateTo("/");
		return;
	}

	const component = route.handler();

	this.app.innerHTML = "";
	this.app.appendChild(component);
}
```

1. **경로 매핑 (`const route = this.routes[path] || this.routes["/"];`)**: 요청된 경로에 해당하는 라우트를 찾습니다. 만약 경로가 없으면 기본 경로(`"/"`)를 사용합니다.

2. **인증 확인 및 접근 제한**:
   - `route.restricted && !this.authService.isAuthenticated()`: 로그인이 필요한 페이지에 인증되지 않은 사용자가 접근하려 할 경우, 경고 메시지를 표시하고 로그인 페이지로 리디렉션합니다.
   - `route.restrictedIfAuthenticated && this.authService.isAuthenticated()`: 로그인된 사용자가 로그인 페이지나 회원가입 페이지에 접근하려 할 경우, 메인 페이지로 리디렉션합니다.

3. **페이지 컴포넌트 렌더링 (`this.app.innerHTML = ""; this.app.appendChild(component);`)**: 이전의 페이지 컴포넌트를 제거하고, 새로운 컴포넌트를 렌더링합니다. 이 과정에서 `app.innerHTML = "";`로 기존 DOM 요소를 제거하여 메모리 누수를 방지합니다.

#### **5.3 페이지 컴포넌트 로드 (`loadPage` 메소드)**

`loadPage()` 메소드는 페이지 컴포넌트를 로드하고, 이를 렌더링할 핸들러를 반환합니다.

```typescript
private loadPage(PageComponent: PageComponentType): RouteHandlerType {
	return () => {
		const page = new PageComponent();
		return page.render();
	};
}
```

1. **페이지 컴포넌트 인스턴스 생성 (`const page = new PageComponent();`)**: `PageComponentType`에 해당하는 페이지 컴포넌트를 인스턴스화합니다. 각 페이지 컴포넌트는 별도의 클래스이며, `new` 키워드를 통해 인스턴스를 생성합니다.
   
2. **페이지 렌더링 (`return page.render();`)**: 생성된 페이지 컴포넌트를 렌더링합니다. 각 페이지 컴포넌트는 `render()` 메소드를 통해 자신을 렌더링하는 DOM 요소를 반환합니다.

#### **5.4 페이지 네비게이션 (`navigateTo` 메소드)**

`navigateTo()` 메소드는 주어진 경로로 브라우저를 네비게이션하고, 해당 경로에 맞는 페이지를 렌더링합니다.

```typescript
public navigateTo(path: string) {
	history.pushState(null, "", path);
	this.render(path);
}
```

1. **`history.pushState()`**: 브라우저의 히스토리 스택에 새 항목을 추가합니다. 이 과정에서 페이지 전체를 리로드하지 않고도 URL이 변경됩니다.
   
2. **`this.render(path)`**: 지정된 경로에 맞는 페이지를 렌더링합니다. `navigateTo()` 메소드를 통해 페이지 전환이 이루어지며, 이때 `render()` 메소드가 호출되어 해당 경로의 페이지 컴포넌트가 로드되고, 기존 컴포넌트는 제거됩니다.

#### **5.5 이벤트 리스너 초기화 (constructor 내)**

`Router` 클래스의 생성자에서는 브라우저의 `popstate` 이벤트와 페이지 내 링크 클릭 이벤트를 처리하기 위한 리스너를 설정합니다.

```typescript
window.addEventListener("popstate", () => {
	this.render(window.location.pathname);
});
document.addEventListener("click", (event) => {
	if (event.target instanceof HTMLAnchorElement) {
		event.preventDefault();
		const path = new URL(event.target.href).pathname;
		this.navigateTo(path);
	}
});
```

1. **`popstate` 이벤트 리스너

**: 브라우저의 뒤로 가기/앞으로 가기 버튼을 누를 때 발생하는 `popstate` 이벤트에 반응하여, 현재 URL에 맞는 페이지를 렌더링합니다.
   
2. **링크 클릭 이벤트 리스너**: 페이지 내의 모든 링크(`<a>` 태그)를 대상으로 클릭 이벤트를 감지하여, 링크 클릭 시 기본 동작을 취소하고 SPA 방식으로 페이지를 전환합니다. 이로써 전체 페이지 리로드 없이 네비게이션이 가능해집니다.

### **Auth 모듈**

---

### **1. 역할**

`auth` 모듈은 애플리케이션의 사용자 인증 기능을 담당합니다. 이 모듈은 다양한 인증 방식을 지원하기 위해 확장 가능한 구조로 설계되었으며, 각 인증 방식은 `AuthProvider` 인터페이스를 통해 구현됩니다. `AuthService` 클래스는 이 인터페이스를 통해 다양한 인증 제공자를 사용할 수 있으며, 클라이언트 측에서 인증 작업을 수행하는데 사용됩니다.

### **2. 주요 클래스 및 인터페이스**

#### **2.1 AuthProvider 인터페이스**
- **역할**: 인증 관련 작업을 수행하는 데 필요한 메소드를 정의하는 인터페이스입니다. 다양한 인증 방식을 지원하기 위해 각 인증 제공자는 이 인터페이스를 구현해야 합니다.
- **주요 메소드**:
  - `login(email: string, password: string): Promise<boolean>`: 사용자를 인증하고 로그인하는 메소드입니다.
  - `logout()`: 사용자를 로그아웃시키는 메소드입니다.
  - `isAuthenticated(): boolean`: 사용자의 인증 상태를 확인하는 메소드입니다.
  - `getToken(): string | null`: 현재 인증된 사용자의 토큰을 반환하는 메소드입니다.
  - `getUser(): { email: string; nickname: string } | null`: 현재 인증된 사용자의 정보를 반환하는 메소드입니다.
  - `signup(email: string, password: string, nickname: string): Promise<boolean>`: 새로운 사용자를 등록하는 메소드입니다.

#### **2.2 AuthService 클래스**
- **역할**: `AuthProvider` 인터페이스를 사용하여 실제 인증 작업을 수행하는 서비스 클래스입니다. 이 클래스는 싱글톤 패턴으로 구현되어 애플리케이션 전체에서 하나의 인스턴스만 사용됩니다.
- **주요 속성**:
  - `provider`: `AuthProvider` 인터페이스를 구현한 실제 인증 제공자 객체를 참조합니다.
- **주요 메소드**:
  - `login(email: string, password: string): Promise<boolean>`: 인증 제공자를 통해 사용자 로그인 작업을 수행합니다.
  - `logout()`: 인증 제공자를 통해 사용자 로그아웃 작업을 수행합니다.
  - `isAuthenticated(): boolean`: 현재 사용자의 인증 상태를 확인합니다.
  - `getToken(): string | null`: 현재 사용자의 토큰을 반환합니다.
  - `getUser(): { email: string; nickname: string } | null`: 현재 사용자의 정보를 반환합니다.
  - `signup(email: string, password: string, nickname: string): Promise<boolean>`: 인증 제공자를 통해 사용자 등록 작업을 수행합니다.

### **3. 동작 원리**

`AuthService`는 다양한 인증 방식을 지원하기 위해 `AuthProvider` 인터페이스를 사용합니다. 실제 인증 작업은 `AuthProvider`를 구현한 구체적인 클래스에서 수행되며, `AuthService`는 이 구현체를 통해 작업을 위임받아 처리합니다. 이를 통해 `AuthService`는 인증 방식에 종속되지 않으며, `AuthProvider`의 구현체만 교체하면 다른 인증 방식을 쉽게 적용할 수 있습니다.

### **4. 추가 정보**

- **참고 자료**:
  - `AuthService`는 싱글톤 패턴을 사용하여 애플리케이션 전역에서 하나의 인스턴스만 존재하도록 보장합니다.
  - `AuthProvider` 인터페이스는 확장성을 고려한 설계로, 다양한 인증 방법을 쉽게 통합할 수 있습니다.

- **관련된 다른 파일**:
  - `LocalAuthProvider.ts`: `AuthProvider` 인터페이스를 구현한 예시로, 로컬 스토리지 기반의 간단한 인증 방식을 제공합니다.
  - `OAuthProvider.ts`: (미구현) OAuth2.0을 지원하는 인증 제공자. 이후 확장 가능성의 예로 사용될 수 있습니다.

### **5. 집중 해설**

#### **5.1 AuthProvider 인터페이스**

`AuthProvider` 인터페이스는 인증 작업을 수행하는 메소드들을 정의하며, 다양한 인증 제공자가 이를 구현하여 사용할 수 있도록 설계되었습니다. 이 인터페이스를 통해 인증 로직을 표준화하고, `AuthService`는 이 인터페이스를 통해 제공되는 기능들을 활용하여 인증 작업을 수행합니다.

```typescript
interface AuthProvider {
	login(email: string, password: string): Promise<boolean>;
	logout(): void;
	isAuthenticated(): boolean;
	getToken(): string | null;
	getUser(): { email: string; nickname: string } | null;
	signup(email: string, password: string, nickname: string): Promise<boolean>;
}

export default AuthProvider;
```

1. **login(email: string, password: string): Promise<boolean>**: 사용자의 이메일과 비밀번호를 입력받아 인증을 수행합니다. 성공하면 `true`를 반환하고, 실패하면 `false`를 반환합니다.
   
2. **logout(): void**: 현재 인증된 사용자를 로그아웃합니다. 주로 세션 또는 토큰을 삭제하는 작업을 수행합니다.
   
3. **isAuthenticated(): boolean**: 사용자의 현재 인증 상태를 확인합니다. 사용자가 인증된 상태라면 `true`를 반환하고, 그렇지 않다면 `false`를 반환합니다.
   
4. **getToken(): string | null**: 현재 인증된 사용자의 인증 토큰을 반환합니다. 인증되지 않은 경우 `null`을 반환합니다.
   
5. **getUser(): { email: string; nickname: string } | null**: 현재 인증된 사용자의 이메일과 닉네임 정보를 반환합니다. 인증되지 않은 경우 `null`을 반환합니다.
   
6. **signup(email: string, password: string, nickname: string): Promise<boolean>**: 새로운 사용자를 등록합니다. 성공하면 `true`를 반환하고, 실패하면 `false`를 반환합니다.

#### **5.2 AuthService 클래스**

`AuthService` 클래스는 실제 인증 로직을 수행하는 인터페이스로, `AuthProvider`를 통해 다양한 인증 제공자와 연동됩니다. 이 클래스는 `AuthProvider`를 주입받아 인증 관련 메소드를 호출하는 역할을 합니다.

```typescript
export default class AuthService {
	private static instance: AuthService | null = null;
	private provider: AuthProvider;

	private constructor(authProvider: AuthProvider) {
		this.provider = authProvider;
	}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService(new LocalAuthProvider());
		}
		return AuthService.instance;
	}

	async login(email: string, password: string): Promise<boolean> {
		return await this.provider.login(email, password);
	}

	logout(): void {
		this.provider.logout();
	}

	isAuthenticated(): boolean {
		return this.provider.isAuthenticated();
	}

	getToken(): string | null {
		return this.provider.getToken();
	}

	getUser(): { email: string; nickname: string } | null {
		return this.provider.getUser();
	}

	async signup(
		email: string,
		password: string,
		nickname: string
	): Promise<boolean> {
		return await this.provider.signup(email, password, nickname);
	}
}
```

1. **싱글톤 패턴 적용**:
   - `AuthService` 클래스는 싱글톤 패턴을 사용하여 하나의 인스턴스만 생성됩니다. `getInstance()` 메소드를 통해 전역적으로 접근할 수 있으며, 이 메소드를 호출할 때마다 동일한 인스턴스가 반환됩니다.

2. **provider 속성**:
   - `provider` 속성은 `AuthProvider` 인터페이스를 구현한 구체적인 인증 제공자를 참조합니다. 기본적으로 `LocalAuthProvider`를 사용하도록 설정되어 있으나, 다른 인증 제공자를 주입하여 사용할 수도 있습니다.

3. **login(email: string, password: string): Promise<boolean>**:
   - 주어진 이메일과 비밀번호를 사용하여 `provider.login()` 메소드를 호출합니다. 실제 인증 로직은 `AuthProvider`를 구현한 클래스에서 수행됩니다.

4. **logout()**:
   - `provider.logout()` 메소드를 호출하여 사용자를 로그아웃합니다.

5. **isAuthenticated(): boolean**:
   - `provider.isAuthenticated()` 메소드를 호출하여 현재 사용자의 인증 상태를 확인합니다.

6. **getToken(): string | null**:
   - `provider.getToken()` 메소드를 호출하여 현재 인증된 사용자의 인증 토큰을 반환합니다.

7. **getUser(): { email: string; nickname: string } | null**:
   - `provider.getUser()` 메소드를 호출하여 현재 인증된 사용자의 정보를 반환합니다.

8. **signup(email: string, password: string, nickname: string): Promise<boolean>**:
   - 주어진 이메일, 비밀번호, 닉네임을 사용하여 `provider.signup()` 메소드를 호출합니다. 새로운 사용자를 등록하는 작업이 수행됩니다.

#### **5.3 LocalAuthProvider (개념적 설명)**

`LocalAuthProvider`는 `AuthProvider` 인터페이스의 구현체로, 로컬 스토리지(Local Storage)를 이용한 간단한 인증 방식을 제공합니다. 이는 테스트 및 로컬 환경에서만 사용되며, 실제 애플리케이션에서는 보안성이 낮기 때문에 적합하지 않습니다. 

- **역할**: 사용자의 이메일과 비밀번호를 로컬 스토리지에 저장하여 간단한 로그인/로그아웃 기능을 구현합니다. 주로 테스트 목적으로 사용되며, 실제

 인증 시스템이 도입되기 전에 기본적인 동작을 확인하는 데 유용합니다.
- **주요 메소드**:
  - `syncStateWithLocalStorage()`: 로컬 스토리지의 상태와 `StateManager`를 동기화하여 인증 상태를 유지합니다.
  - `login(email: string, password: string)`: 로컬 스토리지에 토큰과 사용자 정보를 저장합니다.
  - `logout()`: 로컬 스토리지에서 토큰과 사용자 정보를 제거합니다.
  - `isAuthenticated()`: 로컬 스토리지의 정보를 기반으로 현재 사용자가 인증된 상태인지 확인합니다.
  - `getToken()`, `getUser()`: 각각 로컬 스토리지에서 토큰과 사용자 정보를 반환합니다.

이처럼 `auth` 모듈은 인증을 추상화하여 다양한 인증 방식을 손쉽게 도입할 수 있도록 설계되었습니다. `AuthService`는 `AuthProvider` 인터페이스를 통해 외부에 인증 기능을 제공하며, `AuthProvider`의 구현체를 교체함으로써 다양한 인증 전략을 지원할 수 있습니다.

### **index.ts**

---

### **1. 역할**

`index.ts` 파일은 애플리케이션의 초기 진입점으로, 페이지가 로드된 후 초기화 작업을 수행하고 라우팅을 시작하는 역할을 합니다. 이 파일은 DOMContentLoaded 이벤트를 활용하여 모든 초기화 작업을 수행한 후에 애플리케이션을 시작합니다.

### **2. 주요 클래스 및 메소드**

- **`Router`**: 애플리케이션의 라우팅을 담당하며, URL 경로에 따라 적절한 페이지를 렌더링합니다.
- **`I18n`**: 다국어 지원을 위한 모듈로, 애플리케이션이 시작되기 전에 사용자 언어 설정에 따라 번역 파일을 로드합니다.
- **`AuthService`**: 사용자 인증 상태를 관리하는 서비스로, 사용자의 로그인 상태를 확인하고 인증된 사용자에 대해서만 특정 로직을 수행할 수 있도록 지원합니다.

### **3. 동작 원리**

1. **DOMContentLoaded 이벤트 리스너 등록**:
   - `document.addEventListener("DOMContentLoaded", () => { init(); });`
   - DOMContentLoaded 이벤트가 발생하면 `init()` 함수가 호출됩니다. 이는 모든 DOM이 완전히 로드된 후에 초기화 작업을 수행하도록 보장합니다.

2. **init 함수**:
   - **언어 파일 로드**: `await I18n.loadTranslations();`
     - 사용자의 언어 설정에 따라 해당 언어의 번역 파일을 비동기로 로드합니다.
   - **Router 초기화**: `Router.getInstance();`
     - 싱글톤 패턴으로 구현된 라우터의 인스턴스를 생성하여 애플리케이션의 라우팅을 초기화합니다.
   - **사용자 인증 상태 확인**: `if (AuthService.getInstance().isAuthenticated())`
     - 사용자가 인증된 상태인지 확인하고, 필요시 인증된 사용자에 대해 추가 로직을 실행할 수 있습니다.

### **4. 추가 정보**

- **로드 시점**: 이 파일은 브라우저에서 DOM이 완전히 로드된 후 실행되며, 이 시점에서 애플리케이션의 초기화 작업이 수행됩니다.
- **확장성**: `init` 함수 내에서 사용자 인증 상태에 따라 다양한 로직을 추가할 수 있습니다. 예를 들어, 인증된 사용자에게 추가적인 데이터 로드나 리다이렉션 등을 수행할 수 있습니다.

### **5. 집중 해설**

#### **5.1 DOMContentLoaded 이벤트와 init 함수**

`DOMContentLoaded` 이벤트는 HTML이 완전히 로드되고 DOM 트리가 완성되었을 때 발생합니다. 이 이벤트가 발생하면, 브라우저는 DOM이 완전히 구성되었음을 보장하며, 이 시점에서 스크립트는 안전하게 DOM 요소에 접근하고 조작할 수 있습니다.

```typescript
document.addEventListener("DOMContentLoaded", () => {
	init();
});
```

- **역할**: 이 코드는 애플리케이션이 HTML 문서의 모든 요소를 완전히 로드한 후에 초기화 작업을 수행하도록 보장합니다.

#### **5.2 init 함수**

`init` 함수는 애플리케이션의 초기화를 담당하며, 애플리케이션이 실행될 준비를 마칩니다.

```typescript
async function init() {
	await I18n.loadTranslations(); // 언어 파일 로드

	const app = document.getElementById("app");
	if (app) {
		Router.getInstance();
		if (AuthService.getInstance().isAuthenticated()) {
			// 사용자가 인증된 상태라면, 추가 로직을 실행할 수 있습니다.
		}
	}
}
```

1. **언어 파일 로드**:
   - `await I18n.loadTranslations();`
   - 이 줄은 사용자의 현재 언어 설정에 맞는 번역 파일을 로드합니다. 비동기로 실행되며, 번역 파일이 성공적으로 로드된 후에 다음 작업이 진행됩니다.

2. **애플리케이션 루트 요소 확인**:
   - `const app = document.getElementById("app");`
   - 애플리케이션의 루트 요소인 `<div id="app"></div>`가 존재하는지 확인합니다.

3. **라우터 초기화**:
   - `Router.getInstance();`
   - 싱글톤 패턴을 사용하여 라우터의 인스턴스를 생성하고 초기화합니다. 이 시점에서 애플리케이션의 라우팅이 설정되며, URL에 따라 적절한 페이지가 렌더링됩니다.

4. **사용자 인증 상태 확인**:
   - `if (AuthService.getInstance().isAuthenticated())`
   - 사용자가 인증된 상태라면 추가적인 로직을 실행할 수 있도록 준비합니다. 예를 들어, 사용자 프로필 데이터를 로드하거나, 특정 페이지로 리다이렉션할 수 있습니다.

이 `index.ts` 파일은 애플리케이션의 진입점으로서 초기화 작업을 수행하고, 이후에 필요한 기능들을 동작시킬 준비를 합니다. 이를 통해 애플리케이션은 사용자가 요청한 페이지를 적절하게 로드하고, 사용자 경험을 향상시키는 다양한 기능을 제공할 수 있습니다.

### **formUtils.ts**

---

### **1. 역할**

`formUtils.ts` 파일은 다양한 HTML 폼 요소를 동적으로 생성하는 유틸리티 함수들을 제공하는 모듈입니다. 이 모듈은 반복적으로 사용되는 폼 요소 생성 로직을 단순화하고 재사용할 수 있도록 돕습니다. 

### **2. 주요 함수**

1. **`createLabel`**:
   - **역할**: 주어진 텍스트와 `for` 속성을 가진 `<label>` 요소를 생성합니다.
   - **파라미터**:
     - `text`: 라벨에 표시할 텍스트.
     - `htmlFor` (선택): 라벨이 연결될 입력 요소의 ID.
   - **리턴 값**: 생성된 `<label>` 요소.

2. **`createInput`**:
   - **역할**: 주어진 타입과 ID를 가진 `<input>` 요소를 생성합니다.
   - **파라미터**:
     - `type`: 입력 요소의 타입 (예: `"text"`, `"email"`, `"password"` 등).
     - `id` (선택): 입력 요소의 ID.
   - **리턴 값**: 생성된 `<input>` 요소.

3. **`createButton`**:
   - **역할**: 주어진 텍스트와 클릭 이벤트 핸들러를 가진 `<button>` 요소를 생성합니다.
   - **파라미터**:
     - `text`: 버튼에 표시할 텍스트.
     - `onClick`: 클릭 시 실행될 함수.
   - **리턴 값**: 생성된 `<button>` 요소.

4. **`createLink`**:
   - **역할**: 주어진 링크와 텍스트를 가진 `<a>` 요소를 생성하고, SPA 라우팅을 처리하도록 이벤트를 연결합니다.
   - **파라미터**:
     - `href`: 링크의 목적지 URL.
     - `text`: 링크에 표시할 텍스트.
   - **리턴 값**: 생성된 `<a>` 요소.

5. **`createSelect`**:
   - **역할**: 주어진 옵션들로 구성된 `<select>` 요소를 생성합니다.
   - **파라미터**:
     - `options`: 선택 가능한 옵션들의 배열, 각 옵션은 `value`와 `text` 속성을 가집니다.
   - **리턴 값**: 생성된 `<select>` 요소.

6. **`createFormGroup`**:
   - **역할**: 라벨과 입력 요소를 포함하는 그룹을 생성하여 폼의 구성 요소로 사용합니다.
   - **파라미터**:
     - `labelText`: 라벨에 표시할 텍스트.
     - `inputType`: 입력 요소의 타입.
     - `inputId` (선택): 입력 요소의 ID.
   - **리턴 값**: 라벨과 입력 요소를 포함하는 `<div>` 요소.

### **3. 동작 원리**

이 모듈은 HTML 요소들을 동적으로 생성하여 다양한 폼 구성 요소들을 손쉽게 만들 수 있게 합니다. 주로 로그인, 회원가입 페이지 등에서 폼을 생성할 때 사용됩니다. 각 함수는 새로운 HTML 요소를 생성하고 필요한 속성을 설정하여 반환합니다. 특히, `createLink` 함수는 SPA 라우팅을 위해 링크 클릭 시 기본 동작을 막고, `Router` 모듈을 사용해 페이지를 변경하도록 합니다.

### **4. 추가 정보**

- **재사용성**: 이 모듈은 반복적으로 사용되는 폼 생성 작업을 단순화하고 코드 중복을 줄이는 데 큰 도움이 됩니다.
- **SPA 라우팅**: `createLink` 함수는 링크 클릭 시 페이지를 새로고침하지 않고도 URL을 변경할 수 있게 하여 SPA의 부드러운 사용자 경험을 지원합니다.

### **5. 집중 해설**

#### **5.1 SPA 라우팅을 위한 `createLink`**

SPA(Single Page Application)에서는 페이지 전환 시 전체 페이지를 다시 로드하는 것이 아니라, JavaScript를 통해 특정 부분만을 변경하는 방식으로 동작합니다. 이를 위해 `createLink` 함수는 `<a>` 요소의 기본 동작을 막고, 자바스크립트 기반의 라우팅을 처리합니다.

```typescript
export function createLink(href: string, text: string): HTMLElement {
	const link = document.createElement("a");
	link.href = href;
	link.textContent = text;
	link.style.display = "block";
	link.addEventListener("click", (event) => {
		event.preventDefault(); // 기본 링크 클릭 동작(페이지 이동) 막음
		Router.getInstance().navigateTo(href); // Router를 통해 SPA 라우팅 처리
	});
	return link;
}
```

- **`event.preventDefault()`**: 이 메서드는 링크 클릭 시 페이지 전체가 새로고침되는 기본 동작을 막습니다.
- **`Router.getInstance().navigateTo(href)`**: 이 호출을 통해 애플리케이션이 새로운 페이지로 이동하는 것처럼 보이지만, 실제로는 특정 요소만 업데이트되며, 전체 페이지가 다시 로드되지 않습니다.

#### **5.2 폼 그룹 생성**

`createFormGroup` 함수는 라벨과 입력 필드를 포함하는 `div` 요소를 생성하여, 폼 요소들을 깔끔하게 그룹화할 수 있도록 합니다.

```typescript
export function createFormGroup(
	labelText: string,
	inputType: string,
	inputId?: string
): HTMLElement {
	const group = document.createElement("div"); // 그룹화된 div 요소 생성
	const label = createLabel(labelText, inputId); // 라벨 생성
	const input = createInput(inputType, inputId); // 입력 필드 생성
	group.appendChild(label); // 그룹에 라벨 추가
	group.appendChild(input); // 그룹에 입력 필드 추가
	return group; // 완성된 폼 그룹 반환
}
```

- **역할**: 이 함수는 HTML 폼의 라벨과 입력 필드를 하나의 그룹으로 묶어, 사용자 입력을 쉽게 관리하고 스타일링할 수 있도록 합니다.

이 모듈은 다양한 폼 요소를 동적으로 생성하여, 코드 재사용성을 높이고, 폼 요소 생성 작업을 간소화합니다. 각 함수는 특정 역할을 수행하며, 이를 통해 개발자는 쉽게 폼을 구성하고, 사용자 인터페이스를 구축할 수 있습니다.

### **MainPage.ts**

---

### **1. 역할**

`MainPage.ts`는 애플리케이션의 메인 페이지를 구성하는 클래스입니다. 이 페이지는 사용자 인증 상태에 따라 로그인, 회원가입, 게임 페이지로 이동할 수 있는 링크를 동적으로 생성하고, 언어 선택 기능을 제공합니다. 

### **2. 주요 클래스 및 메소드**

#### **클래스: `MainPage`**

- **역할**: 메인 페이지의 UI를 생성하고, 사용자 인증 상태에 따라 적절한 링크와 버튼을 표시합니다.

#### **메소드: `render()`**

- **역할**: 메인 페이지의 전체 구조를 동적으로 생성하여 반환합니다.
- **동작**:
  - `container`라는 `<div>` 요소를 생성하고, 스타일링을 위해 CSS 파일을 포함합니다.
  - 페이지 제목과 언어 선택기를 추가합니다.
  - 사용자 인증 상태에 따라 로그인/회원가입 링크 또는 게임/로그아웃 링크를 표시합니다.

#### **메소드: `createLogoutButton()`**

- **역할**: 로그아웃 버튼을 생성합니다.
- **동작**:
  - `createButton` 유틸리티를 사용해 로그아웃 버튼을 생성합니다.
  - 클릭 시, `AuthService`를 통해 로그아웃 처리 후, 로그인 페이지로 이동합니다.

#### **메소드: `createLanguageSelector()`**

- **역할**: 언어 선택 드롭다운을 생성합니다.
- **동작**:
  - 지원되는 언어 목록을 `select` 요소로 생성하고, 현재 선택된 언어를 반영합니다.
  - 언어가 변경되면, 해당 언어로 번역 파일을 로드하고, 메인 페이지를 다시 렌더링합니다.

### **3. 동작 원리**

- `MainPage` 클래스는 `render` 메소드를 통해 페이지의 모든 요소를 동적으로 생성합니다. 이 메소드는 SPA의 메인 페이지로서, 사용자가 애플리케이션에 접속했을 때 처음으로 보게 되는 화면을 구성합니다. 
- **언어 선택**: `createLanguageSelector` 메소드는 사용자가 언어를 선택할 수 있는 드롭다운 메뉴를 제공합니다. 언어가 변경되면, 선택한 언어에 맞는 번역 파일이 로드되고, 페이지가 새로고침 없이 해당 언어로 다시 표시됩니다.
- **인증 상태**: 사용자가 인증된 상태인지 여부를 `AuthService`를 통해 확인하고, 그에 따라 게임 페이지로의 링크 또는 로그인/회원가입 링크를 동적으로 보여줍니다.

### **4. 추가 정보**

- **SPA 내에서의 역할**: `MainPage`는 SPA 구조에서 중요한 역할을 합니다. 사용자가 앱에 처음 접속했을 때 보여지는 페이지로, 사용자 경험을 좌우하는 중요한 요소들을 포함합니다.
- **유연한 디자인**: 이 페이지는 사용자의 인증 상태와 언어 설정에 따라 다르게 동작하므로, 다양한 사용자 요구사항을 충족할 수 있습니다.

### **5. 집중 해설**

#### **5.1 `createLanguageSelector`와 다국어 지원**

언어 선택 기능은 애플리케이션에서 중요한 부분을 차지하며, 사용자에게 다양한 언어 옵션을 제공하여 접근성을 높입니다. 

```typescript
private createLanguageSelector(): HTMLElement {
	const languages: { [key: string]: string } = {
		en: "English",
		ko: "한국어",
		es: "Español",
		zh: "中文",
		fr: "Français",
		de: "Deutsch",
	};

	const select = createSelect(
		Object.keys(languages).map((lang) => ({
			value: lang,
			text: languages[lang],
		}))
	);

	select.value = I18n.getLocale(); // 현재 설정된 언어를 기본값으로 설정
	select.addEventListener("change", async (event) => {
		const selectedLanguage = (event.target as HTMLSelectElement).value;
		await I18n.setLocale(selectedLanguage); // 언어 설정 변경
		Router.getInstance().navigateTo("/"); // 메인 페이지를 다시 로드
	});

	return select;
}
```

- **언어 드롭다운**: `createSelect` 함수를 사용하여 `<select>` 요소를 생성하고, 사용자가 선택할 수 있는 언어 옵션을 제공합니다.
- **동적 로딩**: 언어가 변경되면, 해당 언어의 번역 파일을 동적으로 로드하고, 페이지가 새로고침 없이 해당 언어로 표시됩니다.

#### **5.2 사용자 인증 상태에 따른 UI 제어**

페이지는 사용자 인증 상태에 따라 다른 링크와 버튼을 표시합니다. 인증되지 않은 사용자는 로그인 및 회원가입 링크를 보게 되고, 인증된 사용자는 게임과 로그아웃 링크를 보게 됩니다.

```typescript
const isAuthenticated = AuthService.getInstance().isAuthenticated();

if (!isAuthenticated) {
	container.appendChild(createLink("/login", I18n.t("login")));
	container.appendChild(createLink("/signup", I18n.t("signup")));
} else {
	container.appendChild(createLink("/game", I18n.t("game")));
	container.appendChild(this.createLogoutButton());
}
```

- **역할**: 이 부분은 애플리케이션의 보안과 사용자 경험을 관리합니다. 인증된 사용자는 게임 페이지로 쉽게 이동할 수 있으며, 인증되지 않은 사용자는 로그인이나 회원가입을 유도받습니다.
- **동작 방식**: `AuthService`를 사용하여 현재 사용자의 인증 상태를 확인한 후, 적절한 UI 요소를 동적으로 추가합니다.

### **요약**

`MainPage.ts`는 애플리케이션의 메인 페이지를 구성하고, 사용자에게 초기 인터페이스를 제공합니다. 언어 선택기와 인증 상태에 따른 동적 UI 생성을 통해 사용자 경험을 개인화하고, 효율적으로 관리할 수 있습니다. 이 페이지는 SPA 구조에서 중요한 역할을 하며, 초기 접근 시 사용자의 경험을 결정짓는 중요한 요소들을 포함하고 있습니다.

### **SignupPage.ts**

---

### **1. 역할**

`SignupPage.ts`는 사용자에게 회원가입 양식을 제공하고, 사용자가 입력한 정보로 새로운 계정을 생성하는 페이지입니다. 사용자가 이메일, 비밀번호, 닉네임을 입력하여 회원가입을 할 수 있으며, 성공 시 로그인 페이지로 리다이렉트됩니다.

### **2. 주요 클래스 및 메소드**

#### **클래스: `SignupPage`**

- **역할**: 회원가입 페이지의 UI를 구성하고, 사용자가 입력한 정보를 처리하여 새로운 계정을 생성합니다.

#### **메소드: `render()`**

- **역할**: 회원가입 페이지의 구조를 동적으로 생성하여 반환합니다.
- **동작**:
  - `<div>` 요소를 생성하고, 페이지 스타일링을 위해 CSS 파일을 포함합니다.
  - 페이지의 제목을 설정하고, 회원가입 양식을 생성하여 페이지에 추가합니다.

#### **메소드: `createSignupForm()`**

- **역할**: 회원가입 양식을 생성합니다.
- **동작**:
  - 이메일, 비밀번호, 닉네임 입력 필드와 제출 버튼을 포함하는 양식을 생성합니다.
  - 사용자가 제출 버튼을 클릭하면, 입력한 정보로 회원가입을 시도합니다.
  - 회원가입 성공 시 로그인 페이지로 리다이렉트하고, 실패 시 알림을 표시합니다.

### **3. 동작 원리**

- `SignupPage` 클래스는 `render` 메소드를 통해 페이지의 모든 요소를 동적으로 생성합니다. 이 메소드는 SPA의 회원가입 페이지로서, 사용자가 새로운 계정을 생성할 수 있는 인터페이스를 제공합니다.
- **회원가입 처리**: `createSignupForm` 메소드는 사용자가 입력한 이메일, 비밀번호, 닉네임을 사용하여 `AuthService`를 통해 회원가입 요청을 보냅니다. 회원가입이 성공하면 로그인 페이지로 리다이렉트되며, 실패하면 사용자에게 알림을 표시합니다.

### **4. 추가 정보**

- **SPA 내에서의 역할**: `SignupPage`는 새로운 사용자가 계정을 생성할 수 있는 중요한 페이지로, 애플리케이션의 사용자 기반을 확장하는 역할을 합니다.
- **입력 검증**: 이 페이지는 기본적인 입력 검증을 포함하고 있으며, 추가적인 클라이언트 측 유효성 검사나 서버 측 유효성 검사를 통해 보안을 강화할 수 있습니다.

### **5. 집중 해설**

#### **5.1 회원가입 양식 생성**

회원가입 양식은 `createSignupForm` 메소드에서 생성되며, 사용자가 입력한 정보를 기반으로 회원가입 요청을 처리합니다.

```typescript
private createSignupForm(): HTMLElement {
	const form = document.createElement("form");

	const emailGroup = createFormGroup(I18n.t("emailLabel"), "email");
	const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");
	const nicknameGroup = createFormGroup(I18n.t("nicknameLabel"), "text");

	const submitButton = createButton(I18n.t("signupButton"), async () => {
		const email = (
			form.querySelector('input[type="email"]') as HTMLInputElement
		).value;
		const password = (
			form.querySelector('input[type="password"]') as HTMLInputElement
		).value;
		const nickname = (
			form.querySelector('input[type="text"]') as HTMLInputElement
		).value;

		const success = await AuthService.getInstance().signup(
			email,
			password,
			nickname
		);

		if (success) {
			alert(I18n.t("signupSuccess"));
			Router.getInstance().navigateTo("/login");
		} else {
			alert(I18n.t("signupFailed"));
		}
	});

	form.appendChild(emailGroup);
	form.appendChild(passwordGroup);
	form.appendChild(nicknameGroup);
	form.appendChild(submitButton);

	return form;
}
```

- **양식 구성 요소**: `createFormGroup`을 사용하여 이메일, 비밀번호, 닉네임 입력 필드를 생성하고, 각 필드에 적절한 레이블을 설정합니다.
- **회원가입 로직**: 사용자가 제출 버튼을 클릭하면 `AuthService`를 통해 회원가입 요청이 이루어집니다. 성공 여부에 따라 페이지가 로그인 페이지로 리다이렉트되거나 실패 알림이 표시됩니다.
  
#### **5.2 다국어 지원**

각 필드의 레이블과 버튼 텍스트는 `I18n` 모듈을 통해 다국어로 지원됩니다. 사용자가 선택한 언어에 따라 회원가입 페이지의 모든 텍스트가 해당 언어로 표시됩니다.

```typescript
const emailGroup = createFormGroup(I18n.t("emailLabel"), "email");
const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");
const nicknameGroup = createFormGroup(I18n.t("nicknameLabel"), "text");
```

- **다국어 텍스트**: `I18n.t` 메소드를 사용하여 현재 언어에 맞는 텍스트를 가져옵니다. 이를 통해 글로벌 사용자들에게 적합한 인터페이스를 제공합니다.

### **요약**

`SignupPage.ts`는 새로운 사용자가 계정을 생성할 수 있는 회원가입 페이지를 구성합니다. 이메일, 비밀번호, 닉네임을 입력받아 `AuthService`를 통해 회원가입을 처리하며, 성공 여부에 따라 적절한 피드백을 제공합니다. 이 페이지는 애플리케이션의 사용자 기반을 확장하는 중요한 역할을 하며, 다국어 지원을 통해 글로벌 사용자 경험을 향상시킵니다.

### **LoginPage.ts**

---

### **1. 역할**

`LoginPage.ts`는 사용자가 애플리케이션에 로그인할 수 있는 페이지를 제공합니다. 사용자는 이메일과 비밀번호를 입력하여 로그인할 수 있으며, 성공 시 메인 페이지로 리다이렉트됩니다. 이 페이지는 사용자 인증의 중요한 인터페이스 역할을 합니다.

### **2. 주요 클래스 및 메소드**

#### **클래스: `LoginPage`**

- **역할**: 로그인 페이지의 UI를 구성하고, 사용자가 입력한 로그인 정보를 처리하여 인증을 시도합니다.

#### **메소드: `render()`**

- **역할**: 로그인 페이지의 구조를 동적으로 생성하여 반환합니다.
- **동작**:
  - `<div>` 요소를 생성하고, 페이지 스타일링을 위해 CSS 파일을 포함합니다.
  - 페이지의 제목을 설정하고, 로그인 양식을 생성하여 페이지에 추가합니다.

#### **메소드: `createLoginForm()`**

- **역할**: 로그인 양식을 생성합니다.
- **동작**:
  - 이메일과 비밀번호 입력 필드와 제출 버튼을 포함하는 양식을 생성합니다.
  - 사용자가 제출 버튼을 클릭하면, 입력한 정보로 로그인 시도를 합니다.
  - 로그인 성공 시 메인 페이지로 리다이렉트하고, 실패 시 알림을 표시합니다.

### **3. 동작 원리**

- `LoginPage` 클래스는 `render` 메소드를 통해 페이지의 모든 요소를 동적으로 생성합니다. 이 메소드는 SPA의 로그인 페이지로서, 사용자가 애플리케이션에 접근할 수 있는 인증 인터페이스를 제공합니다.
- **로그인 처리**: `createLoginForm` 메소드는 사용자가 입력한 이메일과 비밀번호를 사용하여 `AuthService`를 통해 로그인 요청을 보냅니다. 로그인에 성공하면 메인 페이지로 리다이렉트되며, 실패하면 사용자에게 알림을 표시합니다.

### **4. 추가 정보**

- **SPA 내에서의 역할**: `LoginPage`는 사용자의 인증을 처리하는 핵심 페이지로, 로그인 과정을 통해 사용자에게 접근 권한을 부여합니다.
- **입력 검증**: 이 페이지는 기본적인 입력 검증을 포함하고 있으며, 추가적인 클라이언트 측 유효성 검사나 서버 측 유효성 검사를 통해 보안을 강화할 수 있습니다.

### **5. 집중 해설**

#### **5.1 로그인 양식 생성**

로그인 양식은 `createLoginForm` 메소드에서 생성되며, 사용자가 입력한 정보를 기반으로 로그인 요청을 처리합니다.

```typescript
private createLoginForm(): HTMLElement {
	const form = document.createElement("form");

	const emailGroup = createFormGroup(I18n.t("emailLabel"), "email");
	const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");

	const submitButton = createButton(I18n.t("loginButton"), async () => {
		const email = (
			form.querySelector('input[type="email"]') as HTMLInputElement
		).value;
		const password = (
			form.querySelector('input[type="password"]') as HTMLInputElement
		).value;

		const success = await AuthService.getInstance().login(email, password);

		if (success) {
			alert(I18n.t("loginSuccess"));
			Router.getInstance().navigateTo("/");
		} else {
			alert(I18n.t("loginFailed"));
		}
	});

	form.appendChild(emailGroup);
	form.appendChild(passwordGroup);
	form.appendChild(submitButton);

	return form;
}
```

- **양식 구성 요소**: `createFormGroup`을 사용하여 이메일과 비밀번호 입력 필드를 생성하고, 각 필드에 적절한 레이블을 설정합니다.
- **로그인 로직**: 사용자가 제출 버튼을 클릭하면 `AuthService`를 통해 로그인 요청이 이루어집니다. 성공 여부에 따라 페이지가 메인 페이지로 리다이렉트되거나 실패 알림이 표시됩니다.

#### **5.2 다국어 지원**

각 필드의 레이블과 버튼 텍스트는 `I18n` 모듈을 통해 다국어로 지원됩니다. 사용자가 선택한 언어에 따라 로그인 페이지의 모든 텍스트가 해당 언어로 표시됩니다.

```typescript
const emailGroup = createFormGroup(I18n.t("emailLabel"), "email");
const passwordGroup = createFormGroup(I18n.t("passwordLabel"), "password");
```

- **다국어 텍스트**: `I18n.t` 메소드를 사용하여 현재 언어에 맞는 텍스트를 가져옵니다. 이를 통해 글로벌 사용자들에게 적합한 인터페이스를 제공합니다.

### **요약**

`LoginPage.ts`는 사용자가 애플리케이션에 로그인할 수 있는 인터페이스를 제공합니다. 이메일과 비밀번호를 입력받아 `AuthService`를 통해 인증을 처리하며, 성공 여부에 따라 적절한 피드백을 제공합니다. 이 페이지는 애플리케이션의 사용자 인증을 관리하는 중요한 역할을 하며, 다국어 지원을 통해 글로벌 사용자 경험을 향상시킵니다.

### **GamePage.ts**

---

### **1. 역할**

`GamePage.ts`는 게임 페이지의 UI 및 로직을 관리하는 주요 클래스입니다. 이 클래스는 사용자가 게임을 시작할 수 있도록 게임 설정을 표시하고, 게임이 시작되면 게임 화면과 관련 UI(점수 표시, 조작 키 안내)를 생성하며, 게임 모듈을 초기화하고 관리합니다.

### **2. 주요 클래스 및 메소드**

#### **클래스: `GamePage`**

- **역할**: 게임 페이지의 모든 UI 요소를 관리하고, 게임 시작 및 종료 시 필요한 초기화 작업을 수행합니다.

#### **메소드: `render()`**

- **역할**: 게임 페이지의 전체 UI를 생성하고 반환합니다.
- **동작**:
  - 사용자 세션에서 플레이어 수를 확인하여 게임을 시작할지 설정 화면을 표시할지 결정합니다.
  - 설정이 완료된 경우, 게임을 시작하고 관련 UI(게임 영역, 점수 표시, 조작 키 안내)를 화면에 표시합니다.

#### **메소드: `startGame(playerCount: number)`**

- **역할**: 지정된 플레이어 수에 따라 게임을 시작하고, 게임 모듈을 초기화합니다.
- **동작**:
  - 새로운 `GameModule` 인스턴스를 생성하여 게임을 시작합니다.
  - 게임 중 점수가 업데이트될 때 이를 UI에 반영하기 위해 콜백을 설정합니다.

#### **메소드: `endGame()`**

- **역할**: 게임을 종료하고, 게임 모듈에서 사용된 자원과 상태를 정리합니다.
- **동작**:
  - 게임 모듈에서 애니메이션 루프를 중단하고, 이벤트 리스너를 제거한 후, 모듈을 메모리에서 해제합니다.
  - 게임 설정 데이터를 세션에서 제거합니다.

#### **메소드: `createGameArea()`**

- **역할**: 게임 화면을 표시할 영역을 생성합니다.
- **동작**:
  - 게임 화면이 표시될 `div` 요소를 생성하고, 게임 모듈에서 제공하는 DOM 요소를 이 영역에 추가합니다.

#### **메소드: `createGameUI(container: HTMLElement)`**

- **역할**: 게임 화면 상단에 표시될 UI 요소들(조작 키 안내, 점수)을 생성하고 설정합니다.
- **동작**:
  - 조작 키 안내와 점수 표시 영역을 생성하여 게임 화면에 추가합니다.

#### **메소드: `createBackButton()`**

- **역할**: 메인 페이지로 돌아가는 버튼을 생성합니다.
- **동작**:
  - 버튼을 클릭하면 게임을 종료하고 메인 페이지로 리디렉션합니다.

### **3. 동작 원리**

- `GamePage`는 SPA 구조 내에서 게임을 관리하는 중심 클래스입니다. 사용자가 게임 페이지로 이동할 때, 이 클래스는 `render()` 메소드를 통해 페이지의 UI를 동적으로 생성하고, 게임 설정 및 시작을 관리합니다.
- **게임 시작 및 종료**: 게임 시작 시 `startGame` 메소드가 호출되어 `GameModule`을 초기화하고, 게임 종료 시 `endGame` 메소드가 호출되어 모든 게임 관련 자원과 상태를 정리합니다.

### **4. 추가 정보**

- **SPA 내에서의 역할**: `GamePage`는 단일 페이지 애플리케이션의 일부로, 사용자가 게임을 플레이할 수 있는 페이지를 제공합니다. 페이지 내에서 게임 설정과 게임 플레이 화면을 동적으로 생성하여, 게임이 원활하게 진행되도록 관리합니다.
- **자원 관리**: 게임이 종료될 때 `endGame` 메소드를 통해 모든 자원이 적절히 해제되도록 관리합니다. 이는 메모리 누수를 방지하고, 다음 게임 시작 시 올바르게 초기화할 수 있도록 합니다.

### **5. 집중 해설**

#### **5.1 게임 UI 생성**

`createGameUI` 메소드는 게임 화면 상단에 조작 키 안내와 점수를 표시하는 UI 요소들을 생성합니다.

```typescript
private createGameUI(container: HTMLElement): void {
	const gameUI = document.createElement("div");
	gameUI.style.position = "absolute";
	gameUI.style.top = "2vh";
	gameUI.style.width = "100%";
	gameUI.style.textAlign = "center";
	gameUI.style.color = "#ffffff";

	if (this.gameModule) {
		const instructions = document.createElement("div");
		instructions.style.fontSize = "2vh";
		instructions.innerHTML = this.gameModule.getControlInstructions();
		gameUI.appendChild(instructions);

		this.scoreDisplay = document.createElement("div");
		this.scoreDisplay.style.marginTop = "2vh";
		this.scoreDisplay.style.fontSize = "3vh";
		this.scoreDisplay.innerHTML = `0 : 0`; // 초기 스코어
		gameUI.appendChild(this.scoreDisplay);
	}

	container.appendChild(gameUI);
}
```

- **조작 키 안내**: 사용자가 게임 중에 사용할 조작 키를 화면 상단에 표시합니다.
- **점수 표시**: 게임이 진행됨에 따라 실시간으로 점수를 표시할 수 있는 영역을 생성합니다.

#### **5.2 게임 시작 및 종료**

게임을 시작하고 종료하는 과정은 `startGame`과 `endGame` 메소드에서 처리됩니다.

- **게임 시작**: `startGame` 메소드에서 `GameModule`이 초기화되며, 플레이어 수에 맞게 게임이 시작됩니다. 게임 중 점수 업데이트를 위한 콜백도 이 과정에서 설정됩니다.

```typescript
private startGame(playerCount: number): void {
	console.log("GamePage: Starting game with playerCount =", playerCount);

	this.gameModule = new GameModule(playerCount);

	this.gameModule.setScoreCallback((scoreA: number, scoreB: number) => {
		if (this.scoreDisplay) {
			this.scoreDisplay.innerHTML = `${scoreA} : ${scoreB}`;
		}
	});

	console.log(
		"GamePage: Game module created with settings for",
		playerCount,
		"players"
	);
}
```

- **게임 종료**: `endGame` 메소드는 게임이 종료될 때 호출되어, 게임 모듈에서 사용하는 자원들을 해제하고, 게임 설정 데이터를 세션에서 제거합니다.

```typescript
private endGame(): void {
	console.log("GamePage: Ending game and clearing state");

	if (this.gameModule) {
		this.gameModule.stopAnimation();
		this.gameModule.removeEventListeners();
		this.gameModule = null;
	}

	sessionStorage.removeItem("playerCount");
}
```

### **요약**

`GamePage.ts`는 게임 페이지의 UI와 게임 모듈을 관리하는 중심 클래스입니다. 사용자가 게임을 시작하고, 게임을 진행하며, 게임이 종료될 때까지의 모든 흐름을 관리하며, 페이지 내에서 발생하는 모든 UI 변경 사항을 처리합니다. 이 클래스는 사용자가 게임을 원활히 진행할 수 있도록 필요한 모든 초기화 작업과 자원 관리를 수행하며, 게임을 위한 주요 인터페이스 역할을 합니다.

### **GameSettings.ts**

---

### **1. 역할**

`GameSettings.ts`는 게임 시작 전에 플레이어 수를 선택하는 설정 화면을 관리하는 클래스입니다. 이 클래스는 사용자가 플레이어 수를 선택할 수 있는 UI를 제공하고, 선택한 설정을 기반으로 게임을 시작할 수 있도록 합니다.

### **2. 주요 클래스 및 메소드**

#### **클래스: `GameSettings`**

- **역할**: 게임 모드 및 플레이어 수를 선택할 수 있는 설정 화면을 렌더링하고, 사용자가 선택한 설정을 세션에 저장한 후, 게임 페이지로 이동합니다.

#### **메소드: `render()`**

- **역할**: 게임 설정 화면의 UI를 생성하고 반환합니다.
- **동작**:
  - 사용자가 선택할 수 있는 플레이어 수 옵션을 제공하는 드롭다운 메뉴를 생성합니다.
  - "게임 시작" 버튼을 생성하여, 클릭 시 선택된 플레이어 수를 세션 스토리지에 저장하고 게임 페이지로 이동합니다.

#### **메소드: `startGame(playerCount: number)`**

- **역할**: 선택된 플레이어 수를 세션 스토리지에 저장하고, 게임 페이지로 이동합니다.
- **동작**:
  - `sessionStorage`에 선택된 플레이어 수를 저장합니다.
  - `Router`를 통해 게임 페이지로 이동합니다.

### **3. 동작 원리**

`GameSettings` 클래스는 게임을 시작하기 전에 설정할 수 있는 옵션(플레이어 수)을 제공하는 역할을 합니다. 사용자가 옵션을 선택하고 "게임 시작" 버튼을 누르면, 선택한 설정이 세션 스토리지에 저장되고, 게임 페이지로 리디렉션됩니다.

### **4. 추가 정보**

- **설정 저장**: `startGame` 메소드를 통해 선택된 플레이어 수가 `sessionStorage`에 저장됩니다. 이는 게임 페이지가 로드될 때, 해당 설정을 기반으로 게임을 초기화하기 위해 사용됩니다.
- **라우팅**: 게임 설정이 완료되면 `Router`를 사용해 게임 페이지로 이동합니다.

### **5. 집중 해설**

#### **5.1 게임 설정 UI 생성**

`render` 메소드는 게임 설정 UI를 생성하여 반환합니다.

```typescript
public render(): HTMLElement {
	const container = document.createElement("div");
	const heading = document.createElement("h2");
	heading.textContent = I18n.t("selectGameMode");

	const form = document.createElement("form");

	// Select player count
	form.appendChild(createLabel(I18n.t("numberOfPlayers")));

	const playerCountSelect = createSelect([
		{ value: "2", text: "2 Players" },
		{ value: "3", text: "3 Players" },
		{ value: "4", text: "4 Players" },
	]);

	form.appendChild(playerCountSelect);

	form.appendChild(
		createButton(I18n.t("startGame"), (event) => {
			event.preventDefault();
			const playerCount = parseInt(playerCountSelect.value, 10);
			this.startGame(playerCount);
		})
	);

	container.appendChild(heading);
	container.appendChild(form);

	return container;
}
```

- **플레이어 수 선택**: `createSelect` 메소드를 사용하여 사용자가 선택할 수 있는 플레이어 수 옵션을 제공합니다.
- **게임 시작 버튼**: "게임 시작" 버튼을 생성하여, 클릭 시 `startGame` 메소드를 호출하고, 선택된 플레이어 수에 따라 게임이 시작되도록 합니다.

#### **5.2 게임 시작 및 페이지 이동**

`startGame` 메소드는 게임을 시작하기 위한 설정을 저장하고, 게임 페이지로 이동합니다.

```typescript
private startGame(playerCount: number): void {
	// Store the player count in the session storage
	sessionStorage.setItem("playerCount", playerCount.toString());

	// Navigate to the game page
	Router.getInstance().navigateTo("/game");
}
```

- **플레이어 수 저장**: `sessionStorage`에 선택된 플레이어 수를 저장합니다. 이는 게임 페이지에서 사용될 설정 값입니다.
- **게임 페이지로 이동**: `Router`를 통해 게임 페이지로 이동하여, 사용자가 설정한 플레이어 수에 따라 게임이 시작됩니다.

### **요약**

`GameSettings.ts`는 게임 시작 전에 필요한 설정을 사용자에게 입력받는 역할을 합니다. 사용자가 설정한 값을 세션 스토리지에 저장하고, 해당 설정을 기반으로 게임 페이지로 이동하여 게임이 시작될 수 있도록 합니다. 이 클래스는 게임의 초기 설정 단계에서 중요한 역할을 하며, 사용자 경험을 향상시키기 위해 간단하고 직관적인 UI를 제공합니다.

### **Player.ts**

---

### **1. 역할**

`Player.ts`는 게임 내 플레이어 객체를 정의하고, 플레이어가 조작할 수 있는 패들(paddle)을 관리하는 클래스입니다. 이 클래스는 플레이어의 입력을 받아 패들의 위치를 업데이트하며, 각 플레이어의 조작 키와 패들의 이동 제어를 담당합니다.

### **2. 주요 클래스 및 메소드**

#### **클래스: `Player`**

- **역할**: 플레이어의 패들(paddle)을 관리하고, 플레이어의 입력에 따라 패들의 위치를 업데이트합니다.

#### **생성자: `constructor(paddle: THREE.Mesh, controlKeys: { moveLeft: string; moveRight: string })`**

- **역할**: 플레이어 객체를 초기화하고, 패들과 조작 키를 설정합니다.
- **매개변수**:
  - `paddle`: 플레이어가 조작할 패들을 나타내는 `THREE.Mesh` 객체.
  - `controlKeys`: 패들의 이동을 제어할 키 정보를 포함하는 객체로, 좌우 이동 키를 정의합니다.

#### **정적 메소드: `static getDefaultControlKeys()`**

- **역할**: 각 플레이어에 할당된 기본 조작 키를 반환합니다.
- **반환값**: 각 플레이어에 대한 좌우 이동 키를 정의한 객체.

#### **메소드: `movePaddle(directionMultiplier: number, moveDistance: number, playAreaDepth: number, keyState: { [key: string]: boolean })`**

- **역할**: 플레이어의 입력 상태에 따라 패들의 위치를 업데이트합니다.
- **매개변수**:
  - `directionMultiplier`: 패들의 이동 방향을 제어하는 값으로, 팀에 따라 이동 방향이 달라집니다.
  - `moveDistance`: 한 번의 이동에서 패들이 움직일 거리.
  - `playAreaDepth`: 플레이어가 이동할 수 있는 영역의 깊이.
  - `keyState`: 현재 눌려진 키 상태를 나타내는 객체.

### **3. 동작 원리**

`Player` 클래스는 플레이어가 조작할 패들과 조작 키를 관리합니다. 사용자의 입력에 따라 패들의 위치를 실시간으로 업데이트하며, 각 플레이어에게 고유한 키 설정을 할당합니다. 이 클래스는 주로 게임 루프 내에서 사용되어, 플레이어의 조작에 따라 패들의 위치를 지속적으로 조정합니다.

### **4. 추가 정보**

- **THREE.js와의 통합**: `THREE.Mesh` 객체를 사용하여 패들을 3D 공간에서 표현합니다. 이를 통해 게임 내에서 플레이어의 움직임이 실시간으로 시각화됩니다.
- **조작 키의 유연성**: `getDefaultControlKeys` 메소드를 통해 각 플레이어의 기본 조작 키를 정의하며, 필요에 따라 사용자 정의 키로 쉽게 수정할 수 있습니다.

### **5. 집중 해설**

#### **5.1 기본 조작 키 반환 메소드**

`getDefaultControlKeys` 메소드는 각 플레이어의 기본 조작 키를 반환합니다. 이 메소드를 통해 게임 내 각 플레이어에게 고유한 키를 할당할 수 있습니다.

```typescript
static getDefaultControlKeys(): {
	[playerId: number]: { moveLeft: string; moveRight: string };
} {
	return {
		1: { moveLeft: "ArrowLeft", moveRight: "ArrowRight" },
		2: { moveLeft: "a", moveRight: "d" },
		3: { moveLeft: "j", moveRight: "l" },
		4: { moveLeft: "f", moveRight: "h" },
	};
}
```

- **구조**: 반환되는 객체는 플레이어 ID를 키로 하여, 각 플레이어의 좌우 이동 키를 정의합니다.
- **유연성**: 이 메소드는 추후 조작 키를 커스터마이징하거나 변경할 때 쉽게 수정할 수 있도록 설계되었습니다.

#### **5.2 패들 이동 메소드**

`movePaddle` 메소드는 플레이어의 입력에 따라 패들의 위치를 업데이트합니다.

```typescript
movePaddle(
	directionMultiplier: number,
	moveDistance: number,
	playAreaDepth: number,
	keyState: { [key: string]: boolean }
): void {
	if (keyState[this.controlKeys.moveLeft]) {
		this.paddle.position.z = Math.max(
			this.paddle.position.z - moveDistance * directionMultiplier,
			-playAreaDepth / 2
		);
	}
	if (keyState[this.controlKeys.moveRight]) {
		this.paddle.position.z = Math.min(
			this.paddle.position.z + moveDistance * directionMultiplier,
			playAreaDepth / 2
		);
	}
}
```

- **이동 로직**: 입력된 키가 눌린 상태(`keyState`)를 확인하여, 패들의 위치를 좌우로 이동시킵니다.
- **위치 제한**: 패들의 위치는 `playAreaDepth` 값에 따라 제한됩니다. 이를 통해 패들이 게임 영역을 벗어나지 않도록 관리합니다.

### **요약**

`Player.ts`는 게임 내 플레이어 객체를 정의하고 관리하는 모듈로, 각 플레이어의 패들 위치를 조작 키 입력에 따라 실시간으로 업데이트하는 역할을 합니다. `THREE.js`를 사용하여 패들을 3D 공간에서 시각화하며, `getDefaultControlKeys` 메소드를 통해 플레이어마다 고유한 조작 키를 설정할 수 있습니다. 이 클래스는 주로 게임 루프 내에서 사용되며, 플레이어의 실시간 입력을 처리하고 그에 따라 패들의 위치를 조정합니다.

### **GameModule.ts**

---

### **역할**
`GameModule` 클래스는 3D 탁구 게임의 핵심 로직을 담당합니다. `THREE.js`를 활용해 3D 환경을 렌더링하며, 패들, 공, 테이블 등의 게임 오브젝트를 생성하고 관리합니다. 또한, 사용자 입력을 처리하고 게임 상태를 관리하며 화면을 렌더링하는 역할을 수행합니다.

### **상수 정의 영역**

클래스의 시작 부분에서 여러 상수가 정의되어 있습니다. 이 상수들은 게임 설정에 필요한 중요한 값들을 포함하며, 코드의 다른 부분에서 일관된 값을 사용하도록 돕습니다.

- **카메라 관련 상수:**
  - `CAMERA_FOV`: 카메라의 시야각을 정의합니다. 기본값은 70도입니다.
  - `CAMERA_NEAR` 및 `CAMERA_FAR`: 카메라가 렌더링하는 근접 및 원거리 클리핑 평면을 설정합니다.
  - `CAMERA_A_POSITION`, `CAMERA_B_POSITION`: 각각 A팀과 B팀의 시점을 나타내는 카메라 위치입니다.
  - `CAMERA_LOOK_AT`: 카메라의 시선이 향하는 위치를 정의합니다.

- **테이블 관련 상수:**
  - `TABLE_COLOR`: 테이블의 색상을 나타냅니다.
  - `TABLE_DIMENSIONS`: 테이블의 너비, 높이, 깊이를 나타내는 객체입니다.
  - `TABLE_POSITION`: 테이블의 위치를 나타내는 벡터입니다.

- **패들 관련 상수:**
  - `PADDLE_DIMENSIONS`: 패들의 크기를 나타내는 객체입니다.
  - `PADDLE_OPACITY`: 패들의 투명도를 나타냅니다.
  - `PADDLE_X_OFFSET`, `PADDLE_Y_POSITION`, `PADDLE_Z_OFFSET`: 패들의 위치를 결정하는 변수들입니다.
  - `PADDLE_MOVE_DISTANCE`: 패들이 한 번 움직일 때 이동하는 거리를 나타냅니다.
  - `PADDLE_COLORS`: 팀별 패들의 색상을 정의한 배열입니다.

- **공 관련 상수:**
  - `BALL_COLOR`: 공의 색상을 나타냅니다.
  - `BALL_RADIUS`: 공의 반지름을 나타냅니다.
  - `BALL_SEGMENTS`: 공의 세그먼트 수를 정의합니다.
  - `BALL_INITIAL_VELOCITY`: 공의 초기 속도를 나타내는 벡터입니다.

- **조명 관련 상수:**
  - `LIGHT_INTENSITY`: 조명의 강도를 나타냅니다.
  - `LIGHT_DISTANCE`: 조명의 최대 거리를 나타냅니다.
  - `LIGHT_POSITION`: 조명의 위치를 나타냅니다.
  - `AMBIENT_LIGHT_INTENSITY`: 주변 조명의 강도를 나타냅니다.

- **플레이 구역 관련 상수:**
  - `FLOOR_Y_POSITION`: 바닥의 Y좌표를 나타냅니다.
  - `PLAY_AREA`: 플레이 가능한 영역의 너비와 깊이를 나타냅니다.

---

### **주요 메소드**

#### **1. `constructor(playerCount: number)`**
이 메소드는 게임 모듈의 초기화 작업을 담당합니다. 게임에 필요한 기본적인 설정을 수행하며, `THREE.js`를 사용해 장면, 카메라, 렌더러를 설정합니다.

- **`playerCount`**: 게임에 참가하는 플레이어 수를 나타내는 인수입니다.
- 메소드 내부에서 수행되는 작업:
  - **카메라 초기화**: 팀 A와 B의 시점을 위한 두 개의 카메라가 설정됩니다.
  - **렌더러 설정**: `THREE.WebGLRenderer`를 초기화하고 그림자 맵핑을 활성화합니다.
  - **게임 요소 초기화**: `initGame()` 메소드를 호출하여 게임 요소를 설정합니다.
  - **애니메이션 시작**: `animate()` 메소드를 호출하여 애니메이션 루프를 시작합니다.

#### **2. `initGame()`**
이 메소드는 게임의 주요 구성 요소를 초기화합니다. 조명, 환경, 테이블, 플레이어, 공 등을 설정하며, 게임이 시작될 준비를 갖추게 합니다.

- 호출된 메소드:
  - **`setupLighting()`**: 조명을 설정합니다.
  - **`setupEnvironment()`**: 게임 환경(바닥, 벽)을 설정합니다.
  - **`setupTable()`**: 테이블을 설정하고 배치합니다.
  - **`setupPlayers()`**: 플레이어의 패들을 생성하고 배치합니다.
  - **`setupBall()`**: 공을 생성하고 배치합니다.
  - **`addEventListeners()`**: 사용자 입력을 처리하기 위한 이벤트 리스너를 추가합니다.

#### **3. `animate()`**
이 메소드는 게임의 애니메이션 루프를 시작합니다. `requestAnimationFrame`을 사용해 매 프레임마다 `playGame()` 메소드를 호출하며, 게임 상태를 지속적으로 갱신합니다.

#### **4. `playGame()`**
이 메소드는 게임 진행 중 매 프레임마다 호출됩니다. 패들 이동, 공 이동, 충돌 감지 등을 처리하며, 게임의 상태를 업데이트합니다.

- 호출된 메소드:
  - **`movePaddles()`**: 각 플레이어의 패들을 이동합니다.
  - **`moveBall()`**: 공을 이동시킵니다.
  - **`checkCollisions()`**: 공과 패들, 벽의 충돌을 감지하고 처리합니다.
  - **`isGoalScored()`**: 득점이 발생했는지 확인하고, 발생 시 라운드를 리셋합니다.
  - **`render()`**: 현재 게임 상태를 화면에 렌더링합니다.

#### **5. `stopAnimation()`**
현재 애니메이션 루프를 중지하는 메소드입니다. 게임이 중단되거나 객체가 소멸될 때 호출됩니다.

#### **6. `removeEventListeners()`**
객체가 소멸될 때 모든 이벤트 리스너를 제거하는 메소드입니다. 이를 통해 메모리 누수를 방지하고, 더 이상 필요 없는 이벤트 처리를 중단합니다.

#### **7. `getControlInstructions()`**
각 플레이어의 조작 키를 설명하는 문자열을 반환하는 메소드입니다. 게임 시작 시 사용자에게 조작 키를 안내하는 데 사용됩니다.

---

### **워크플로우**

#### **1. 객체 초기화 워크플로우**

- **1.1 생성자 호출**
  - `GameModule`의 인스턴스가 생성될 때 `constructor` 메소드가 호출됩니다.
  - 카메라, 렌더러, 게임 환경 등이 초기화됩니다.
  - 호출된 메소드:
    - `this.initGame()`: 게임의 기본 구성 요소를 초기화합니다.
    - `this.animate()`: 게임의 애니메이션 루프를 시작합니다.

- **1.2 게임 초기화**
  - `initGame` 메소드는 조명, 환경, 테이블, 플레이어, 공 등을 설정하여 게임이 시작될 준비를 완료합니다.
  - 호출된 메소드:
    - `this.setupLighting()`: 게임의 조명을 설정합니다.
    - `this.setupEnvironment()`: 게임의 바닥과 벽을 설정합니다.
    - `this.setupTable()`: 게임 테이블을 생성하고 위치를 설정합니다.
    - `this.setupPlayers()`: 플레이어의 패들을 생성하고 위치를 설정합니다.
    - `this.setupBall()`: 공을 생성하고 위치를 설정합니다.
    - `this.addEventListeners()`: 사용자 입력을 처리하기 위한 이벤트 리스너를 추가합니다.

- **1.3 애니메이션 루프 시작**
  - `animate` 메소드는 게임의 애니메이션 루프를 시작합니다. 게임의 상태를 지속적으로 갱신하며 화면을 렌더링합니다.

#### **2. 프레임 갱신 워크플로우**

- **2.1 게임 진행**
  - 매 프레임마다 `playGame` 메소드가 호출되어 게임 상태를 업데이트하고 렌더링합니다.
  - 호출된 메소드:
    - `this.movePaddles()`: 플레이어의 패들을 이동시킵니다.
    - `this.moveBall()`: 공을 이동시킵니다.
    - `this.checkCollisions()`: 공과 패들, 벽의 충돌을 감지하고 처리합니다.
    - `this.isGoalScored()`: 득점 여부를 확인하고, 발생 시 라운드를 리셋합니다.
    - `this.render()`: 현재 게임 상태를 화면에 렌더링합니다.

#### **3. 객체 소멸 워크플로우**

- **3.1 애니메이션 루프 중지**
  - `stopAnimation` 메소드는 애니메이션 루프를 중지합니다. 게임이 중단되거나 객체가 소멸될 때 호출됩니다.

- **3.2 이벤트 리스너 제거**
  - `removeEventListeners` 메소드는 모든 이벤트 리스너를 제거하여 메모리 누수를 방지합니다.

---

### **집중 해설**

### **1. 공의 움직임 및 충돌 처리**

#### **1.1 `moveBall()` 메소드**

```typescript
private moveBall(): void {
    if (this.ball) {
        // 공의 현재 위치에 속도를 더하여 위치 갱신
        this.ball.position.add(this.ballVelocity);

        // 공의 이동 진행도를 X축 기준으로 계산
        let progressX = this.ball.position.x;

        // 공의 X 위치에 따라 Y 위치를 맵핑하여 갱신
        this.ball.position.y = this.mapXToY(progressX);

        // 공이 벽이나 테이블 경계를 벗어났는지 확인하고 처리
        this.handleWallCollisions();
    }
}
```

- **공의 위치 갱신**: `this.ball.position.add(this.ballVelocity)`를 통해 공의 현재 위치에 속도를 더하여 새로운 위치를 계산합니다. 이 과정에서 공이 실제로 게임 테이블 위에서 움직이는 모습을 구현합니다.
- **진행도 계산**: 공의 X축 위치(`progressX`)를 기반으로, 현재 공이 게임 테이블 위에서 얼마나 이동했는지를 계산합니다.
- **Y축 위치 갱신**: `this.mapXToY(progressX)`를 사용하여 공의 X축 위치에 따라 Y축 위치를 업데이트합니다. 이로써 공이 포물선을 그리며 이동하게 됩니다.
- **벽 충돌 처리**: `this.handleWallCollisions()`를 호출하여 공이 벽이나 테이블 경계를 벗어났는지 확인하고, 필요한 경우 충돌 처리 및 득점 처리를 합니다.

#### **1.2 `checkCollisions()` 메소드**

```typescript
private checkCollisions(): void {
    if (this.ball) {
        const ballX = this.ball.position.x;
        const ballZ = this.ball.position.z;

        this.players.forEach((player) => {
            const paddle = player.paddle;
            const paddleX = paddle.position.x;
            const paddleZ = paddle.position.z;

            // 패들의 범위 내에서 공의 X축 충돌 여부를 확인
            const paddleMinX = paddleX - this.PADDLE_DIMENSIONS.width / 2;
            const paddleMaxX = paddleX + this.PADDLE_DIMENSIONS.width / 2;

            if (ballX >= paddleMinX && ballX <= paddleMaxX) {
                // X축 충돌이 발생한 경우, Z축 충돌 여부 확인
                const paddleMinZ = paddleZ - this.PADDLE_DIMENSIONS.depth / 2;
                const paddleMaxZ = paddleZ + this.PADDLE_DIMENSIONS.depth / 2;

                if (ballZ >= paddleMinZ && ballZ <= paddleMaxZ) {
                    // 충돌이 발생한 경우 충돌 처리
                    this.handlePaddleCollision(paddle);
                }
            }
        });

        // 득점 여부 확인 및 처리
        this.handleGoalScoring();
    }
}
```

- **충돌 감지**: 공과 플레이어의 패들 간의 충돌을 감지합니다. 공의 X축 및 Z축 위치가 패들의 범위 내에 있는지 확인합니다.
- **충돌 처리**: 충돌이 발생하면 `this.handlePaddleCollision(paddle)` 메소드가 호출되어 공의 속도 및 방향이 변경됩니다.
- **득점 처리**: 충돌 감지 후, 득점이 발생했는지 확인하고 필요 시 점수를 업데이트합니다.

#### **1.3 `handlePaddleCollision()` 메소드**

```typescript
private handlePaddleCollision(paddle: THREE.Mesh): void {
    if (this.ball) {
        const targetX = -paddle.position.x; // 반대편으로 이동
        const targetZ = Math.random() * this.PLAY_AREA.depth - this.PLAY_AREA.depth / 2;

        // 목표 지점의 Y좌표를 맵핑 함수로 계산
        const targetY = this.mapXToY(targetX);

        // 목표 지점으로 향하는 방향 벡터 계산
        const direction = new THREE.Vector3(targetX, targetY, targetZ)
            .sub(this.ball.position)
            .normalize();

        this.ballVelocity = direction.multiplyScalar(this.BALL_INITIAL_VELOCITY.length());
    }
}
```

- **목표 위치 계산**: 공이 패들과 충돌한 후 반대편으로 이동할 목표 위치를 계산합니다. 이 위치는 패들 위치의 반대편으로 설정됩니다.
- **방향 벡터 계산**: 공이 이동할 방향 벡터를 계산하고, 속도를 갱신하여 새로운 방향으로 공이 이동하게 합니다.

#### **1.4 `handleWallCollisions()` 메소드**

```typescript
private handleWallCollisions(): void {
    if (this.ball) {
        if (
            Math.abs(this.ball.position.z) > this.PLAY_AREA.depth / 2 || // 측면 벽에 도달
            Math.abs(this.ball.position.x) > this.PLAY_AREA.width / 2 // 테이블 끝에 도달
        ) {
            // 득점 처리 및 라운드 리셋
            if (this.ball.position.x > this.PLAY_AREA.width / 2) {
                this.updateScore("A"); // B팀의 골대에 공이 들어감, A팀 득점
            } else if (this.ball.position.x < -this.PLAY_AREA.width / 2) {
                this.updateScore("B"); // A팀의 골대에 공이 들어감, B팀 득점
            }
        }
    }
}
```

- **벽 충돌 감지 및 처리**: 공이 게임 테이블의 측면 또는 끝에 도달했는지 확인하고, 충돌이 발생했을 경우 적절한 득점 처리를 합니다.

---

### **2. 득점 및 라운드 리셋**

#### **2.1 `updateScore()` 메소드**

```typescript
private updateScore(team: "A" | "B"): void {
    if (team === "A") {
        this.scoreA++;
    } else {
        this.scoreB++;
    }

    if (this.scoreCallback) {
        this.scoreCallback(this.scoreA, this.scoreB);
    }
}
```

- **점수 업데이트**: 공이 어느 팀의 골대에 들어갔는지 확인하고, 해당 팀의 점수를 증가시킵니다. 
- **점수 콜백**: 점수가 갱신되면 콜백을 호출하여 점수 업데이트를 UI 등에 반영합니다.

#### **2.2 `resetRound()` 메소드**

```typescript
private resetRound(): void {
    // 공 위치 초기화
    if (this.ball) {
        this.ball.position.set(0, this.mapXToY(0), 0);

        // x축 속도의 방향을 랜덤하게 결정
        const randomDirection = Math.random() < 0.5 ? -1 : 1;

        this.ballVelocity.set(0.1 * randomDirection, 0, 0);
    }

    // 패들 위치 초기화
    this.players.forEach((player, index: number) => {
        const teamIndex = index < this.playerCount / 2 ? 0 : 1;
        const xPos = teamIndex === 0 ? -this.PADDLE_X_POSITION : this.PADDLE_X_POSITION;
        player.paddle.position.set(
            xPos,
            this.PADDLE_Y_POSITION,
            (index % 2) * this.PADDLE_Z_OFFSET - 1
        );
    });
}
```

- **공 및 패들 위치 초기화**: 득점 후 라운드를 리셋하고, 공과 패들의 위치를 초기 상태로 재설정합니다.

---

### **3. 패들 움직임 처리**

#### **`movePaddles()` 메소드**

```typescript
private movePaddles(): void {
    this.players.forEach((player, index) => {
        const teamIndex = index < this.playerCount / 2 ? 0 : 1;
        const directionMultiplier = teamIndex === 0 ? 1 : -1;

        player.movePaddle(
            directionMultiplier,
            this.PADDLE_MOVE_DISTANCE * 0.1,
            this.PLAY_AREA.depth,
            this.keyState
        );
    });
}
```

- **패들 이동 처리**: 각 플레이어의 패들이 입력된 키 상태에 따라 이동하도록 설정합니다. 팀에 따라 이동 방향을 결정하고, 각 플레이어의 패들을 이동시킵니다.

---

### **4. 맵핑 함수**

#### **`mapXToY()` 메소드**

```typescript
private mapXToY(x: number): number {
    // 높이 계산
    const H =
        this.PADDLE_Y_POSITION -
        (this.TABLE_POSITION.y + this.TABLE_DIMENSIONS.height + this.BALL_RADIUS);

    // 길이 계산
    const L =
        (this.PADDLE_X_POSITION -
            this.PADDLE_DIMENSIONS.width / 2 -
            this.BALL_RADIUS) /
        1.5;

    // 패들 Y좌표 기준으로 보정
    const paddleY = this.PADDLE_Y_POSITION;

    // X값 대칭 변환


    const adjustedX = 2 * L - Math.abs(2 * L - x);

    // 포물선 식 적용
    const y = -(H / (2 * L * L)) * adjustedX * (adjustedX - L);

    // 실제 Y 좌표로 보정
    return paddleY + y;
}
```

- **포물선 형태의 Y 좌표 계산**: 공의 X축 위치에 따라 Y축 위치를 포물선 형태로 계산하여 반환합니다. 이를 통해 공이 자연스럽게 곡선을 그리며 이동하도록 구현합니다.

---

### **5. 화면 렌더링**

#### **`render()` 메소드**

```typescript
private render(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setScissor(0, 0, width / 2, height);
    this.renderer.setViewport(0, 0, width / 2, height);
    this.renderer.render(this.scene, this.cameraA);

    this.renderer.setScissor(width / 2, 0, width / 2, height);
    this.renderer.setViewport(width / 2, 0, width / 2, height);
    this.renderer.render(this.scene, this.cameraB);
}
```

- **화면 분할 렌더링**: 두 개의 카메라 시점을 화면에 분할하여 렌더링합니다. A팀과 B팀 각각의 시점이 화면의 절반씩 차지하도록 설정됩니다.

---

### **6. 이벤트 리스너 관리**

#### **`addEventListeners()` 메소드**

```typescript
private addEventListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
}
```

- **이벤트 리스너 추가**: 키보드 입력을 처리하기 위해 `keydown` 및 `keyup` 이벤트 리스너를 추가합니다. 사용자의 키 입력 상태를 추적하기 위함입니다.

#### **`removeEventListeners()` 메소드**

```typescript
public removeEventListeners(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("resize", this.onWindowResize);
}
```

- **이벤트 리스너 제거**: 객체가 소멸되거나 게임이 종료될 때 모든 이벤트 리스너를 제거하여 메모리 누수를 방지합니다.

#### **`handleKeyDown()` 및 `handleKeyUp()` 메소드**

```typescript
private handleKeyDown = (event: KeyboardEvent) => {
    this.keyState[event.key] = true;
};

private handleKeyUp = (event: KeyboardEvent) => {
    this.keyState[event.key] = false;
};
```

- **키 상태 관리**: `keydown` 및 `keyup` 이벤트에 따라 키 상태를 업데이트하여 현재 어떤 키가 눌려있는지를 추적합니다. 이를 통해 패들의 이동을 제어합니다.
