# Devlog: 프로젝트 초기 세팅 및 API 클라이언트 구성

**작성일:** 2026-01-24
**Issue:** #1
**작업자:** Claude Code

---

## 📌 작업 개요

KIS 주식 매매 백엔드(`http://127.0.0.1:8000`)와 통신 가능한 React 프론트엔드 프로젝트의 기초 환경을 구축합니다.

---

## 🎨 UI Design Analysis

### 초기 화면 구성
이번 작업은 프로젝트 세팅에 집중하며, 실제 UI는 최소한으로 구성합니다:
- **Landing Page:** 백엔드 연결 상태를 확인할 수 있는 간단한 테스트 페이지
- **Layout:** 향후 확장을 위한 기본 레이아웃 컴포넌트 구조 마련

### Design System
- **CSS Framework:** Tailwind CSS 사용
- **Component Library:** shadcn/ui 설정 (추후 컴포넌트 추가 용이)
- **Typography & Color:** Tailwind 기본 테마 사용

---

## 🏗 Component Structure

### 디렉토리 구조 (Feature-Sliced Design 기반)
```
kis-stock-web-ai/
├── src/
│   ├── api/                    # API 클라이언트 설정
│   │   └── axios.ts            # Axios 인스턴스
│   ├── features/               # 기능별 도메인 구분
│   │   ├── auth/               # (추후) 인증 관련
│   │   ├── dashboard/          # (추후) 대시보드
│   │   ├── balance/            # (추후) 잔고 조회
│   │   └── trade/              # (추후) 주식 거래
│   ├── components/             # 공통 UI 컴포넌트
│   │   └── ui/                 # shadcn/ui 컴포넌트
│   ├── App.tsx                 # 라우팅 및 전역 설정
│   ├── main.tsx                # 엔트리 포인트
│   └── index.css               # Tailwind 설정
├── docs/
│   └── devlog/                 # 개발 로그
├── vite.config.ts              # Vite 설정 (Proxy 포함)
├── .env                        # 환경변수
└── CLAUDE.md                   # Claude Code 가이드
```

### 주요 컴포넌트
1. **App.tsx**
   - React Router 설정
   - TanStack Query Provider 래핑
   - 전역 Layout 구성

2. **TestPage** (임시)
   - 백엔드 연결 테스트용 페이지
   - `/api/health` 또는 `/api/docs` 등 간단한 엔드포인트 호출
   - 응답 상태 표시 (성공/실패)

---

## 🔄 State Management Strategy

### Server State
- **라이브러리:** `@tanstack/react-query` (v5)
- **용도:** 백엔드 API 데이터 페칭, 캐싱, 동기화
- **설정:**
  - QueryClient 생성 (전역 설정: staleTime, cacheTime)
  - Devtools 활성화 (개발 환경)

### Client State
- **현재 단계:** 불필요 (추후 Zustand 도입 검토)
- **향후 사용 예시:** 사용자 설정, 테마, 임시 UI 상태

### Form State
- **라이브러리:** React Hook Form (추후 도입)
- **현재:** 간단한 테스트 페이지에는 불필요

---

## 🔌 API Integration Plan

### 1. Vite Proxy 설정
**목적:** 개발 환경에서 CORS 문제 해결

**`vite.config.ts` 설정:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

**동작 방식:**
- 프론트엔드: `GET /api/balance` 요청
- Vite Proxy: `http://127.0.0.1:8000/balance`로 포워딩

---

### 2. Axios 인스턴스 구성

**`src/api/axios.ts`:**
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (추후 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: 인증 토큰 삽입
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 전역 에러 처리 (추후 Toast 알림 등)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 3. 백엔드 연결 테스트

**테스트 API 호출:**
- Endpoint: `GET http://127.0.0.1:8000/docs` (Swagger UI 확인)
- 또는 간단한 헬스체크 엔드포인트 생성 요청

**TanStack Query 예시:**
```typescript
// src/features/test/hooks/useHealthCheck.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiClient.get('/health');
      return response.data;
    },
  });
};
```

---

## 📦 라이브러리 설치 목록

### Core Dependencies
```bash
npm install react-router-dom @tanstack/react-query axios
```

### Dev Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer
```

### shadcn/ui 초기화
```bash
npx shadcn@latest init
```

---

## ✅ 작업 체크리스트

### 1. 프로젝트 스캐폴딩
- [ ] `npm create vite@latest . -- --template react-ts` 실행
- [ ] 디렉토리 구조 생성 (`src/features`, `src/api`, `docs/devlog`)

### 2. 라이브러리 설치 및 설정
- [ ] `react-router-dom`, `@tanstack/react-query`, `axios` 설치
- [ ] Tailwind CSS 설정 (`npx tailwindcss init -p`)
- [ ] shadcn/ui 초기화 (`npx shadcn@latest init`)
- [ ] `.env` 파일 생성 (`VITE_API_URL=http://127.0.0.1:8000`)
- [ ] `.gitignore`에 `.env` 추가

### 3. API 클라이언트 구성
- [ ] `vite.config.ts`에 Proxy 설정 추가
- [ ] `src/api/axios.ts` 생성 및 인터셉터 구성

### 4. 기본 라우팅 및 Provider 설정
- [ ] `App.tsx`에 React Router 설정
- [ ] TanStack Query `QueryClientProvider` 래핑
- [ ] 테스트 페이지 생성 (백엔드 연결 확인용)

### 5. 완료 조건 검증
- [ ] `npm run dev` 실행 시 에러 없이 브라우저 렌더링
- [ ] 프론트엔드에서 백엔드 API 호출 시 200 OK 응답 확인
- [ ] `CLAUDE.md` 파일 포함 여부 확인

---

## 🚨 예상 이슈 및 대응

### 1. CORS 에러
- **원인:** Vite Proxy 미설정 또는 백엔드 CORS 설정 누락
- **해결:** `vite.config.ts` Proxy 설정 확인 및 백엔드 CORS 미들웨어 확인

### 2. 환경변수 인식 안됨
- **원인:** Vite는 `VITE_` 접두사 필요
- **해결:** `.env` 파일 변수명 확인

### 3. shadcn/ui 설치 오류
- **원인:** Tailwind CSS 미설정 상태에서 초기화 시도
- **해결:** Tailwind 먼저 설정 후 shadcn 초기화

---

## 📝 다음 단계 (Next Steps)

1. **Issue #2:** 인증 시스템 구현 (로그인/로그아웃)
2. **Issue #3:** 잔고 조회 화면 개발
3. **Issue #4:** 주식 검색 및 주문 화면 개발

---

## 📎 참고 자료

- [Vite 공식 문서 - Proxy 설정](https://vitejs.dev/config/server-options.html#server-proxy)
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
- [shadcn/ui 공식 사이트](https://ui.shadcn.com/)
- [Backend Swagger UI](http://127.0.0.1:8000/docs)

---

**작성 완료:** ✅
**다음 단계:** 사용자 승인 대기 → Branch 생성 → 구현 시작
