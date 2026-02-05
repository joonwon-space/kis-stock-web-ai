# OpenAPI 명세 기반 프론트엔드 코드 동기화

## [11:30] 작업 계획

### 요청 사항
- 이슈 #9: 백엔드 OpenAPI 명세(`openapi.json`)와 프론트엔드 코드(`src/types`, `src/api`) 비교
- 불일치하는 부분 찾아서 수정

### 구현 계획
- [x] OpenAPI 명세 분석 완료 ✅
- [x] 프론트엔드 코드 분석 완료 ✅
- [x] `User` 인터페이스에 `created_at` 필드 추가
- [x] ESLint 설정 수정 (`.vite` 디렉토리 ignore 추가)
- [x] 빌드 및 린트 검증 (`npm run build`, `npm run lint`)

### 예상 변경 파일
- `src/features/auth/types/auth.types.ts` — `User` 인터페이스에 `created_at: string` 필드 추가

### 발견된 불일치 사항

#### 1. User 인터페이스에 created_at 필드 누락

**OpenAPI 명세 (UserResponse):**
```typescript
{
  email: string
  full_name: string | null
  id: integer
  is_active: boolean
  created_at: datetime  // ⬅️ 이 필드가 누락됨
  auth_provider: string
}
```

**현재 프론트엔드 코드 (User):**
```typescript
export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  auth_provider: string;
  // created_at 필드 없음 ❌
}
```

#### 2. 나머지 확인 결과

✅ **API 엔드포인트 경로** - 모두 올바름:
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/signup`
- GET `/api/v1/auth/me`

✅ **LoginRequest (UserLogin)** - 일치:
- email: string
- password: string

✅ **LoginResponse (Token)** - 일치:
- access_token: string
- token_type: string

✅ **SignupRequest (UserCreate)** - 일치:
- email: string
- password: string
- full_name?: string (optional)

### 의사결정
- `created_at` 필드 타입: OpenAPI 명세에서는 `datetime`이지만, 프론트엔드에서는 JSON으로 전달되므로 `string` 타입 사용
- 향후 필요 시 Date 객체로 변환하는 유틸리티 함수 추가 가능

### 리스크/주의사항
- 기존 코드에서 `User` 인터페이스를 사용하는 곳에서 `created_at` 필드를 참조하지 않으므로, 추가해도 Breaking Change 없음
- TypeScript 컴파일 에러 발생 가능성: 없음 (선택적 필드가 아닌 필수 필드로 추가하지만, 기존 사용처에서 접근하지 않음)

---

## [11:35] 작업 완료

### 결과
✅ OpenAPI 명세와 프론트엔드 코드 동기화 완료

### 실제 변경 파일
1. **`src/features/auth/types/auth.types.ts`** — `User` 인터페이스에 `created_at: string` 필드 추가
2. **`eslint.config.js`** — `.vite`, `node_modules` 디렉토리를 ignores에 추가하여 ESLint 에러 해결

### 계획 대비 변경점
- **추가 작업:** ESLint 설정 수정
  - 기존에 `.vite` 디렉토리가 ignore되지 않아 ESLint 에러 발생
  - `eslint.config.js`의 `ignores` 배열에 `.vite`, `node_modules` 추가

### 검증 결과
```bash
✅ npm run lint — 성공 (0 errors, 0 warnings)
✅ npm run build — 성공 (dist 폴더 생성 완료)
✅ npx tsc --noEmit — 성공 (타입 에러 없음)
```

### 다음 할 일
- 이슈 #9 완료 처리
- 실제 백엔드 API 연동 테스트 (로그인/회원가입 시 `created_at` 필드 정상 수신 확인)

### 이슈/블로커
없음
