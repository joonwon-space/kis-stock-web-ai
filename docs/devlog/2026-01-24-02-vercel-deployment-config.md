# Devlog: 프론트엔드 Vercel 배포를 위한 설정 파일 구성

**작성일:** 2026-01-24
**Issue:** #3
**작업자:** Claude Code

---

## 📌 작업 개요

프론트엔드를 Vercel에 배포하기 위해 필요한 코드 레벨의 설정 파일을 구성합니다.

**배경:**
- Backend: Google Cloud Run에 배포됨 (별도 작업 불필요)
- Frontend: Vercel을 통해 배포 예정
- R&R:
  - Claude: 배포에 필요한 설정 파일 생성 및 빌드 검증
  - User: Vercel 대시보드에서 프로젝트 연결 및 환경변수 주입

---

## 🎨 UI Design Analysis

이번 작업은 배포 설정에 집중하며, UI 변경사항은 없습니다.

---

## 🏗 Component Structure

### 추가될 파일

```
kis-stock-web-ai/
├── vercel.json          # Vercel 배포 설정
└── (기존 파일들)
```

### vercel.json 구조

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**설정 설명:**
1. **rewrites**: SPA 라우팅 지원
   - 모든 경로를 `/index.html`로 리다이렉트
   - React Router가 클라이언트에서 라우팅 처리
   - 새로고침 시 404 에러 방지

2. **headers**: 보안 헤더 추가 (선택사항)
   - `X-Content-Type-Options`: MIME 타입 스니핑 방지
   - `X-Frame-Options`: 클릭재킹 공격 방지
   - `X-XSS-Protection`: XSS 공격 방지

---

## 🔄 State Management Strategy

배포 설정 작업이므로 State Management 변경사항 없음.

---

## 🔌 API Integration Plan

### 환경 변수 처리 확인

**현재 상태:**
```typescript
// src/api/axios.ts
const apiClient = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : import.meta.env.VITE_API_URL,
  // ...
});
```

**동작 방식:**
- **개발 환경 (`MODE === 'development'`)**: `/api` 사용 (Vite Proxy)
- **프로덕션 환경**: `VITE_API_URL` 환경변수 사용

**Vercel 환경변수 설정 (User 작업):**
```
VITE_API_URL=https://your-backend-api.run.app
```

### 환경 변수 검증 필요성

현재 `VITE_API_URL`이 undefined일 경우 대비 로직이 없으므로, 안전한 처리를 위해 확인 로직 추가를 고려합니다.

**개선 방안:**
```typescript
const apiClient = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? '/api'
    : (import.meta.env.VITE_API_URL || 'http://localhost:8000'),
  // ...
});
```

하지만 프로덕션에서는 환경변수가 필수이므로, 명시적인 에러 처리도 고려 가능:
```typescript
const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return '/api';
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.error('VITE_API_URL is not defined in production environment');
    return '/api'; // fallback
  }

  return apiUrl;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  // ...
});
```

**결론:** 현재 코드는 이미 적절히 환경변수를 참조하고 있으므로, 추가 수정은 선택사항입니다. Vercel에서 환경변수만 제대로 설정하면 동작합니다.

---

## 📦 빌드 환경 점검

### 1. package.json 빌드 스크립트 확인

**현재 설정:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

**검증:**
- ✅ `build` 스크립트: TypeScript 컴파일 후 Vite 빌드 수행
- ✅ Vercel은 자동으로 `npm run build` 실행
- ✅ 빌드 결과물은 `dist/` 디렉토리에 생성

### 2. vite.config.ts 확인

**현재 설정:**
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

**검증:**
- ✅ Proxy 설정은 개발 환경에서만 사용됨 (프로덕션 빌드에 영향 없음)
- ✅ Path alias 설정은 빌드 시 정상 작동
- ✅ 추가 수정 불필요

### 3. TypeScript 설정 확인

**tsconfig.json:**
- ✅ `strict: true` - 타입 안정성 확보
- ✅ `noEmit: true` - Vite가 빌드 담당
- ✅ Path alias 매핑 정상

---

## ✅ 작업 체크리스트

### 1. Vercel 설정 파일 생성
- [ ] `vercel.json` 파일 생성
- [ ] SPA Rewrite 규칙 작성
- [ ] 보안 헤더 추가 (선택)

### 2. 빌드 환경 검증
- [ ] `npm run build` 실행하여 정상 빌드 확인
- [ ] 빌드 결과물(`dist/`) 확인
- [ ] TypeScript 컴파일 에러 없음 확인

### 3. 환경 변수 처리 확인
- [ ] `src/api/axios.ts`에서 `VITE_API_URL` 참조 확인
- [ ] Hard-coding된 API URL 없음 확인
- [ ] (선택) 환경변수 미설정 시 에러 처리 추가

### 4. 문서화
- [ ] README에 Vercel 배포 관련 섹션 추가
- [ ] 환경변수 설정 가이드 작성

---

## 🚨 예상 이슈 및 대응

### 1. SPA 라우팅 404 에러
- **원인:** `vercel.json`의 rewrite 규칙 누락
- **해결:** `vercel.json` 파일 생성 및 올바른 규칙 작성

### 2. 환경변수 미설정
- **원인:** Vercel 대시보드에서 `VITE_API_URL` 미설정
- **해결:** User가 Vercel 대시보드에서 환경변수 추가
- **참고:** 환경변수는 `VITE_` 접두사 필수 (Vite 요구사항)

### 3. 빌드 실패
- **원인:** TypeScript 타입 에러 또는 의존성 문제
- **해결:** `npm run build` 로컬 테스트로 사전 검증

### 4. CORS 에러 (프로덕션)
- **원인:** 백엔드 CORS 설정에 Vercel 도메인 미등록
- **해결:** 백엔드에서 Vercel 배포 URL을 CORS 허용 목록에 추가
- **참고:** User가 백엔드 팀과 협의 필요

---

## 📝 Vercel 배포 가이드 (User 작업)

### 1. Vercel 프로젝트 연결
1. Vercel 대시보드 접속
2. "New Project" 클릭
3. GitHub 저장소 연결 (`joonwon-space/kis-stock-web-ai`)
4. Framework Preset: **Vite** 자동 감지
5. Root Directory: `./` (프로젝트 루트)
6. Build Command: `npm run build` (자동 설정)
7. Output Directory: `dist` (자동 설정)

### 2. 환경변수 설정
**Settings > Environment Variables**에서 추가:
```
VITE_API_URL=https://your-backend-api.run.app
```

### 3. 배포
- `main` 브랜치에 Push 시 자동 배포
- PR 생성 시 Preview 배포 자동 생성

---

## 📎 참고 자료

- [Vercel 공식 문서 - SPA Fallback](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)
- [Vite 공식 문서 - Building for Production](https://vitejs.dev/guide/build.html)
- [Vite 공식 문서 - Env Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**작성 완료:** ✅
**다음 단계:** 사용자 승인 대기 → Branch 생성 → 구현 시작
