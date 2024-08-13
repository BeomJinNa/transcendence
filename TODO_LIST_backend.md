현재 구현된 프론트엔드에 대해 백엔드에서 구현해줘야 할 목록

### 백엔드 TODO 리스트

1. **사용자 인증 API**
   - **POST /api/auth/login**
     - **설명**: 사용자의 이메일과 비밀번호를 받아 인증을 처리합니다.
     - **요청**: `{ "email": "user@example.com", "password": "password123" }`
     - **응답**: `{ "token": "jwt-token", "user": { "email": "user@example.com", "nickname": "UserNick" } }`
     - **처리**: 이메일과 비밀번호를 검증하고, JWT 토큰을 생성하여 응답합니다.

   - **POST /api/auth/logout**
     - **설명**: 사용자의 세션을 종료합니다.
     - **요청**: `Authorization: Bearer {token}`
     - **응답**: `204 No Content`
     - **처리**: JWT 토큰을 무효화하고 세션을 종료합니다.

   - **GET /api/auth/user**
     - **설명**: 현재 인증된 사용자의 정보를 반환합니다.
     - **요청**: `Authorization: Bearer {token}`
     - **응답**: `{ "email": "user@example.com", "nickname": "UserNick" }`
     - **처리**: JWT 토큰을 확인하고, 해당 사용자 정보를 반환합니다.

2. **사용자 등록 API**
   - **POST /api/auth/signup**
     - **설명**: 새로운 사용자를 등록합니다.
     - **요청**: `{ "email": "newuser@example.com", "password": "password123", "nickname": "NewUserNick" }`
     - **응답**: `{ "message": "User created successfully" }`
     - **처리**: 입력된 이메일과 닉네임이 중복되지 않도록 검증한 후, 새 사용자 계정을 생성합니다.

3. **JWT 토큰 처리**
   - **설명**: JWT 토큰을 발급하고, 요청 시 해당 토큰을 검증하여 사용자 인증을 처리합니다.
   - **기능**:
     - JWT 토큰 발급: 로그인 시 JWT 토큰을 생성하여 클라이언트에 반환합니다.
     - JWT 토큰 검증: API 요청 시 토큰을 검증하여 요청자의 인증 상태를 확인합니다.
     - 토큰 만료 처리: 만료된 토큰에 대해 적절한 응답을 반환합니다.

4. **HTTPS 및 보안 설정**
   - **설명**: 모든 API 통신이 HTTPS를 통해 안전하게 이루어지도록 설정합니다.
   - **기능**:
     - 모든 API 엔드포인트는 HTTPS를 사용하여 접근하도록 설정합니다.
     - 보안 헤더 설정: XSS, CSRF, HSTS 등을 위한 보안 헤더를 추가합니다.

5. **SQL Injection 및 XSS 방지**
   - **설명**: 모든 데이터베이스 쿼리에 대해 파라미터화된 쿼리를 사용하여 SQL Injection을 방지합니다.
   - **기능**:
     - 사용자 입력을 받을 때, 파라미터화된 쿼리 사용.
     - XSS 방지를 위한 사용자 입력값에 대한 이스케이프 처리.

6. **폼 데이터 검증**
   - **설명**: 모든 사용자 입력에 대해 서버 측에서 추가 검증을 수행하여, 유효하지 않은 데이터를 처리하지 않도록 합니다.
   - **기능**:
     - 이메일 형식, 비밀번호 규칙 등 기본적인 데이터 검증.
     - 필요한 경우, 추가적인 비즈니스 로직에 맞는 데이터 검증.
