# KIS Stock Trading - Frontend

한국투자증권(KIS) 주식 매매 시스템의 Web Dashboard 프론트엔드

## 기술 스택

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **State Management:** TanStack Query (서버 상태)
- **HTTP Client:** Axios

## 프로젝트 구조

```
kis-stock-web-ai/
├── src/
│   ├── api/                    # API 클라이언트 설정
│   ├── features/               # 기능별 도메인 (auth, dashboard, balance, trade)
│   ├── components/             # 공통 UI 컴포넌트
│   ├── pages/                  # 페이지 컴포넌트
│   └── App.tsx                 # 메인 앱 컴포넌트
├── docs/devlog/                # 개발 로그
└── CLAUDE.md                   # Claude Code 가이드
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm
- 백엔드 서버 실행 중 (`http://127.0.0.1:8000`)

### 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트 체크
npm run lint
```

### 환경 변수

`.env` 파일에 다음 변수를 설정하세요:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## 개발 가이드

자세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

### Vite Proxy 설정

개발 환경에서 CORS 문제를 해결하기 위해 `/api` 요청을 백엔드로 프록시합니다.

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

## 배포 (Deployment)

### Vercel 배포

이 프로젝트는 Vercel을 통해 배포됩니다.

#### 설정 파일

`vercel.json` 파일이 프로젝트 루트에 포함되어 있으며, 다음을 설정합니다:

- **SPA Routing**: 모든 경로를 `/index.html`로 리다이렉트하여 새로고침 시 404 에러 방지
- **보안 헤더**: XSS, Clickjacking 등 기본 보안 위협 방어

#### 배포 절차

1. **Vercel 프로젝트 연결**
   - Vercel 대시보드에서 "New Project" 클릭
   - GitHub 저장소 연결 (`joonwon-space/kis-stock-web-ai`)
   - Framework Preset: **Vite** (자동 감지)
   - Build Command: `npm run build` (자동 설정)
   - Output Directory: `dist` (자동 설정)

2. **환경 변수 설정**

   Vercel 대시보드 > Settings > Environment Variables에서 다음을 추가:

   ```
   VITE_API_URL=https://your-backend-api.run.app
   ```

   > ⚠️ **중요**: Vite 환경변수는 반드시 `VITE_` 접두사가 필요합니다.

3. **자동 배포**
   - `main` 브랜치에 Push 시 프로덕션 배포
   - Pull Request 생성 시 Preview 배포 자동 생성

#### 환경별 API URL

- **개발 환경**: `/api` (Vite Proxy를 통해 `http://127.0.0.1:8000`로 프록시)
- **프로덕션 환경**: `VITE_API_URL` 환경변수 사용

```typescript
// src/api/axios.ts
const apiClient = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? '/api'
    : import.meta.env.VITE_API_URL,
});
```

#### CORS 설정 (백엔드)

프로덕션 배포 시 백엔드에서 Vercel 도메인을 CORS 허용 목록에 추가해야 합니다:

```python
# 예시 (FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",
        "https://your-app-*.vercel.app",  # Preview 배포
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## License

Private Project

