# Devlog: JWT 인증 로직 및 Axios 인터셉터 구현

**작성일:** 2026-01-31
**Issue:** #5
**작업자:** Claude Code

---

## 📌 작업 개요

백엔드(#10)에서 구현된 JWT 인증 시스템을 프론트엔드 Axios 클라이언트와 상태 관리 라이브러리에 연동합니다.
UI를 만들기 전에 인증의 **핵심 로직**을 먼저 구현하여, 이후 로그인/회원가입 화면에서 바로 활용할 수 있도록 합니다.

**Backend Auth Endpoints:**
- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인 (Access Token 반환)
- `GET /api/v1/auth/me` - 내 정보 조회 (Bearer Token 필요)

---

## 🎨 UI Design Analysis

### 현재 단계: UI 구현 없음
이번 작업은 **인증 로직과 인프라 구성**에 집중하며, 실제 로그인/회원가입 UI는 다음 이슈에서 구현합니다.

### 향후 UI 연동 시나리오
1. **로그인 페이지** (`/login`)
   - 사용자가 이메일/비밀번호 입력
   - `useAuthStore`의 `login()` 액션 호출
   - 성공 시 토큰 저장 및 자동 리다이렉트

2. **보호된 페이지** (Protected Routes)
   - `isAuthenticated` 상태 확인
   - 미인증 시 로그인 페이지로 리다이렉트

3. **헤더/네비게이션**
   - 로그인 상태에 따라 "로그인" vs "로그아웃" 버튼 표시
   - 유저 정보 표시 (full_name, email)

---

## 🏗 Component Structure

### 디렉토리 구조 (신규 추가)
```
kis-stock-web-ai/
├── src/
│   ├── features/
│   │   └── auth/                        # 🆕 인증 기능
│   │       ├── api/                     # API 호출 함수
│   │       │   └── authApi.ts          # login, signup, getMe
│   │       ├── hooks/                   # React Query 훅
│   │       │   └── useAuth.ts          # useLogin, useSignup, useMe
│   │       ├── stores/                  # Zustand 스토어
│   │       │   └── authStore.ts        # useAuthStore
│   │       └── types/                   # TypeScript 타입
│   │           └── auth.types.ts       # User, LoginResponse
│   ├── api/
│   │   └── axios.ts                     # 🔄 인터셉터 수정
```

### 주요 파일 설명

#### 1. `auth.types.ts`
백엔드 Pydantic 스키마와 1:1 매칭되는 TypeScript 인터페이스 정의.

```typescript
export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  auth_provider: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
}
```

#### 2. `authApi.ts`
Axios를 이용한 백엔드 API 호출 함수.

```typescript
import apiClient from '@/api/axios';
import { LoginRequest, LoginResponse, SignupRequest, User } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<User> => {
    const response = await apiClient.post('/api/v1/auth/signup', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },
};
```

#### 3. `authStore.ts`
Zustand를 이용한 전역 인증 상태 관리.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      setUser: (user: User) => {
        set({ user });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
    }
  )
);
```

#### 4. `useAuth.ts`
React Query 훅으로 API 호출 및 스토어 연동.

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { LoginRequest, SignupRequest } from '../types/auth.types';

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      login(response.access_token);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
  });
};

export const useMe = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated, // 로그인 상태일 때만 실행
    onSuccess: (user) => {
      setUser(user);
    },
  });
};
```

---

## 🔄 State Management Strategy

### 1. Server State (TanStack Query)
- **용도:** API 호출 및 서버 데이터 캐싱
- **Queries:**
  - `useMe`: 현재 로그인한 유저 정보 조회
- **Mutations:**
  - `useLogin`: 로그인 API 호출
  - `useSignup`: 회원가입 API 호출

### 2. Client State (Zustand)
- **용도:** 인증 상태 관리 (토큰, 유저 정보, 로그인 여부)
- **Persistence:** `persist` 미들웨어로 localStorage 연동
  - 페이지 새로고침 시에도 로그인 상태 유지
  - 브라우저 종료 후 재접속 시에도 유지

### 3. 상태 흐름도
```
[로그인 API 호출]
  → [useLogin Mutation 성공]
  → [authStore.login(token)]
  → [localStorage 저장]
  → [useMe Query 자동 실행]
  → [authStore.setUser(user)]
```

---

## 🔌 API Integration Plan

### 1. Axios 인터셉터 수정 (`src/api/axios.ts`)

#### Request Interceptor: 자동 토큰 주입
```typescript
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

#### Response Interceptor: 401 에러 시 자동 로그아웃
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // 옵션: 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. 백엔드 엔드포인트 확인

**Swagger 문서 참조:**
- URL: `http://localhost:8000/docs`
- 엔드포인트 경로 및 요청/응답 스키마 확인

**예상 Request/Response:**
```json
// POST /api/v1/auth/login
{
  "email": "test@example.com",
  "password": "securepassword"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### 3. CORS 및 Proxy 설정 확인

`vite.config.ts`에 이미 설정된 Proxy를 통해 `/api` 경로로 요청하면 백엔드로 자동 포워딩됩니다.

---

## 📦 라이브러리 설치 목록

### Zustand 설치
```bash
npm install zustand
```

### 이미 설치된 라이브러리 확인
- `@tanstack/react-query` ✅
- `axios` ✅
- `react-router-dom` ✅ (향후 Protected Route 구현 시 사용)

---

## ✅ 작업 체크리스트

### 1. 타입 정의
- [ ] `src/features/auth/types/auth.types.ts` 생성
- [ ] User, LoginRequest, LoginResponse, SignupRequest 인터페이스 정의

### 2. API 호출 함수
- [ ] `src/features/auth/api/authApi.ts` 생성
- [ ] `login`, `signup`, `getMe` 함수 구현

### 3. Zustand Store
- [ ] Zustand 라이브러리 설치 (`npm install zustand`)
- [ ] `src/features/auth/stores/authStore.ts` 생성
- [ ] `persist` 미들웨어로 localStorage 연동
- [ ] `login`, `logout`, `setUser` 액션 구현

### 4. React Query Hooks
- [ ] `src/features/auth/hooks/useAuth.ts` 생성
- [ ] `useLogin`, `useSignup`, `useMe` 훅 구현

### 5. Axios 인터셉터 수정
- [ ] `src/api/axios.ts` Request Interceptor 수정 (토큰 자동 주입)
- [ ] `src/api/axios.ts` Response Interceptor 수정 (401 에러 시 로그아웃)

### 6. 테스트 (수동)
- [ ] 백엔드 서버 실행 (`http://localhost:8000`)
- [ ] 프론트엔드 개발 서버 실행 (`npm run dev`)
- [ ] 브라우저 콘솔에서 테스트 코드 실행:
  ```javascript
  // 로그인 테스트
  const { useLogin } = await import('./src/features/auth/hooks/useAuth');
  const { mutate } = useLogin();
  mutate({ email: 'test@example.com', password: 'password' });

  // localStorage 확인
  console.log(localStorage.getItem('auth-storage'));
  ```

### 7. 완료 조건 검증
- [ ] 로그인 API 호출 성공 시 토큰이 localStorage에 저장됨
- [ ] 저장된 토큰이 모든 API 요청 헤더에 자동으로 포함됨
- [ ] 401 에러 발생 시 스토어의 유저 정보가 초기화됨
- [ ] 페이지 새로고침 후에도 로그인 상태 유지됨

---

## 🚨 예상 이슈 및 대응

### 1. Zustand Store를 Axios 인터셉터에서 접근 시 순환 참조 오류
- **원인:** ES6 모듈 로딩 순서 문제
- **해결:** `useAuthStore.getState()`를 인터셉터 내부에서 호출하여 동적으로 가져오기

### 2. localStorage에 저장된 토큰이 만료된 경우
- **원인:** 백엔드에서 토큰 유효기간 만료
- **해결:** 401 에러 인터셉터에서 자동 로그아웃 처리 (이미 구현)
- **향후 개선:** Refresh Token 구현 (백엔드 협의 필요)

### 3. 개발 환경에서 CORS 에러
- **원인:** Vite Proxy 미동작 또는 백엔드 CORS 설정 누락
- **해결:** `vite.config.ts` Proxy 설정 확인 및 백엔드 CORS 미들웨어 확인

### 4. TypeScript 타입 불일치
- **원인:** 백엔드 Pydantic 모델과 프론트엔드 인터페이스 불일치
- **해결:** 백엔드 Swagger 문서 확인 후 타입 수정

---

## 📝 다음 단계 (Next Steps)

1. **Issue #6 (예정):** 로그인/회원가입 UI 구현
   - 로그인 페이지 (`/login`)
   - 회원가입 페이지 (`/signup`)
   - React Hook Form + Zod 유효성 검사
   - Toast 알림으로 에러 메시지 표시

2. **Issue #7 (예정):** Protected Route 구현
   - 미인증 시 로그인 페이지로 리다이렉트
   - 레이아웃에 유저 정보 표시

3. **Issue #8 (예정):** 잔고 조회 화면 개발 (인증 필요)

---

## 📎 참고 자료

- [Zustand 공식 문서](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [TanStack Query - Authentication](https://tanstack.com/query/latest/docs/framework/react/guides/authentication)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [Backend Swagger UI](http://localhost:8000/docs)

---

## 🔐 보안 고려사항

### 1. 토큰 저장 위치
- **현재:** localStorage (Zustand persist)
- **위험:** XSS 공격 시 토큰 탈취 가능
- **향후 개선안:**
  - HttpOnly Cookie 사용 (백엔드 변경 필요)
  - 또는 sessionStorage 사용 (탭 닫으면 로그아웃)

### 2. HTTPS 사용
- **개발 환경:** HTTP (localhost)
- **프로덕션:** 반드시 HTTPS 사용 (Vercel 자동 적용)

### 3. 토큰 만료 시간
- **백엔드 설정 확인 필요**
- 적절한 만료 시간 설정 (예: 1시간)
- Refresh Token 도입 검토

---

**작성 완료:** ✅
**다음 단계:** 사용자 승인 대기 → Branch 생성 → 구현 시작
