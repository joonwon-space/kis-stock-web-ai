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

## License

Private Project

