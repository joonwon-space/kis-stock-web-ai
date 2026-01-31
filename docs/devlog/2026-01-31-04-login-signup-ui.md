# Devlog: 로그인/회원가입 UI 및 라우트 가드 구현

**작성일:** 2026-01-31
**Issue:** #6
**작업자:** Claude Code

---

## 📌 작업 개요

이전 이슈(#5)에서 구현한 JWT 인증 로직을 활용하여 사용자가 실제로 이용할 수 있는 로그인/회원가입 화면과 보호된 라우트(Protected Routes)를 구현합니다.

**핵심 목표:**
1. 사용자 친화적인 로그인/회원가입 폼 UI 제공
2. 유효성 검사를 통한 안전한 사용자 입력 처리
3. 인증되지 않은 사용자의 접근 차단 (라우트 가드)
4. 로그인 성공 시 사용자 정보 표시 (헤더)

---

## 🎨 UI Design Analysis

### 1. 로그인 페이지 (`/login`)

**레이아웃:**
```
┌─────────────────────────────────────┐
│                                     │
│        KIS Stock Trading            │
│                                     │
│     ┌─────────────────────┐         │
│     │   로그인            │         │
│     ├─────────────────────┤         │
│     │ Email:              │         │
│     │ [____________]      │         │
│     │                     │         │
│     │ Password:           │         │
│     │ [____________]      │         │
│     │                     │         │
│     │  [로그인 버튼]      │         │
│     │                     │         │
│     │  계정이 없으신가요? │         │
│     │  [회원가입]         │         │
│     └─────────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

**디자인 특징:**
- 중앙 정렬 Card 레이아웃 (shadcn/ui Card 사용)
- 깔끔한 입력 필드 (shadcn/ui Input)
- 명확한 CTA 버튼 (shadcn/ui Button)
- 에러 메시지 인라인 표시 (빨간색 텍스트)
- 로딩 상태 표시 (버튼 disabled + 스피너)

### 2. 회원가입 페이지 (`/signup`)

**레이아웃:**
```
┌─────────────────────────────────────┐
│                                     │
│        KIS Stock Trading            │
│                                     │
│     ┌─────────────────────┐         │
│     │   회원가입          │         │
│     ├─────────────────────┤         │
│     │ 이름:               │         │
│     │ [____________]      │         │
│     │                     │         │
│     │ Email:              │         │
│     │ [____________]      │         │
│     │                     │         │
│     │ Password:           │         │
│     │ [____________]      │         │
│     │ (최소 8자 이상)     │         │
│     │                     │         │
│     │  [회원가입 버튼]    │         │
│     │                     │         │
│     │  이미 계정이 있나요? │         │
│     │  [로그인]           │         │
│     └─────────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

**디자인 특징:**
- 로그인 페이지와 동일한 레이아웃 일관성
- 이름 필드 추가 (선택사항)
- 비밀번호 요구사항 힌트 표시
- 유효성 검사 에러 실시간 표시

### 3. 대시보드 레이아웃 (보호된 페이지)

**Header 컴포넌트 추가:**
```
┌───────────────────────────────────────────┐
│ KIS Stock Trading    [홍길동님] [로그아웃] │
└───────────────────────────────────────────┘
│                                           │
│         (페이지 콘텐츠)                   │
│                                           │
```

**구성 요소:**
- 좌측: 로고/제목
- 우측: 사용자 이름 (full_name) + 로그아웃 버튼
- 로그인 상태에 따라 조건부 렌더링

---

## 🏗 Component Structure

### 디렉토리 구조 (신규 추가)
```
kis-stock-web-ai/
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── components/           # 🆕 인증 UI 컴포넌트
│   │       │   ├── LoginForm.tsx    # 로그인 폼
│   │       │   ├── SignupForm.tsx   # 회원가입 폼
│   │       │   └── ProtectedRoute.tsx # 라우트 가드
│   ├── components/
│   │   ├── ui/                       # 🔄 shadcn/ui 컴포넌트 추가
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── form.tsx
│   │   └── layout/                   # 🆕 레이아웃 컴포넌트
│   │       ├── Header.tsx           # 헤더 (유저 정보 + 로그아웃)
│   │       └── MainLayout.tsx       # 메인 레이아웃
│   ├── pages/
│   │   ├── LoginPage.tsx            # 🆕 로그인 페이지
│   │   ├── SignupPage.tsx           # 🆕 회원가입 페이지
│   │   └── DashboardPage.tsx        # 🆕 대시보드 (보호됨)
│   └── lib/
│       └── utils.ts                  # 🆕 shadcn/ui 유틸 (cn 함수)
```

### 주요 컴포넌트 설명

#### 1. `LoginForm.tsx`
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

export const LoginForm = () => {
  const { mutate, isPending, isError, error } = useLogin();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        // 대시보드로 리다이렉트
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Input 필드들 */}
      </form>
    </Form>
  );
};
```

#### 2. `SignupForm.tsx`
로그인 폼과 유사하지만 이름 필드 추가 및 비밀번호 최소 8자 검증.

#### 3. `ProtectedRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

#### 4. `Header.tsx`
```typescript
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    // 로그인 페이지로 리다이렉트
  };

  return (
    <header>
      <h1>KIS Stock Trading</h1>
      {user && (
        <div>
          <span>{user.full_name || user.email}님</span>
          <Button onClick={handleLogout}>로그아웃</Button>
        </div>
      )}
    </header>
  );
};
```

#### 5. `MainLayout.tsx`
```typescript
import { Header } from './Header';

export const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};
```

---

## 🔄 State Management Strategy

### 로그인 플로우
```
[LoginForm 제출]
  → [useLogin mutation 실행]
  → [authStore.login(token) 호출]
  → [useMe query 자동 실행]
  → [authStore.setUser(user) 호출]
  → [useNavigate('/dashboard')]
```

### 라우트 가드 플로우
```
[/dashboard 접근 시도]
  → [ProtectedRoute 컴포넌트]
  → [isAuthenticated 확인]
  → YES: children 렌더링
  → NO: <Navigate to="/login" />
```

### 로그아웃 플로우
```
[로그아웃 버튼 클릭]
  → [useLogout() 실행]
  → [authStore.logout() 호출]
  → [localStorage 초기화]
  → [useNavigate('/login')]
```

---

## 🔌 API Integration Plan

### 1. 로그인 API 연동
- **Endpoint:** `POST /api/v1/auth/login`
- **Hook:** `useLogin` (이미 구현됨 - Issue #5)
- **성공 시:**
  - 토큰 저장
  - `/api/v1/auth/me` 자동 호출 (useMe)
  - 대시보드로 리다이렉트

### 2. 회원가입 API 연동
- **Endpoint:** `POST /api/v1/auth/signup`
- **Hook:** `useSignup` (이미 구현됨 - Issue #5)
- **성공 시:**
  - 로그인 페이지로 리다이렉트
  - Toast 알림: "회원가입이 완료되었습니다. 로그인해주세요."

### 3. 사용자 정보 조회
- **Endpoint:** `GET /api/v1/auth/me`
- **Hook:** `useMe` (이미 구현됨 - Issue #5)
- **자동 실행 조건:** `isAuthenticated === true`

---

## 📦 라이브러리 설치 목록

### Form Handling
```bash
npm install react-hook-form @hookform/resolvers zod
```

### shadcn/ui Components
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add form
```

### Toast Notifications (선택사항)
```bash
npx shadcn@latest add toast
```

---

## ✅ 작업 체크리스트

### 1. 라이브러리 설치
- [ ] `react-hook-form`, `@hookform/resolvers`, `zod` 설치
- [ ] shadcn/ui 컴포넌트 추가 (button, card, input, label, form)
- [ ] Toast 컴포넌트 추가 (선택사항)

### 2. shadcn/ui 설정 확인
- [ ] `src/lib/utils.ts` 파일 확인 (cn 함수)
- [ ] `tailwind.config.js` 설정 확인
- [ ] `components.json` 설정 확인

### 3. 레이아웃 컴포넌트 구현
- [ ] `src/components/layout/Header.tsx` 생성
- [ ] `src/components/layout/MainLayout.tsx` 생성

### 4. 인증 UI 컴포넌트 구현
- [ ] `src/features/auth/components/LoginForm.tsx` 생성
- [ ] `src/features/auth/components/SignupForm.tsx` 생성
- [ ] `src/features/auth/components/ProtectedRoute.tsx` 생성

### 5. 페이지 컴포넌트 구현
- [ ] `src/pages/LoginPage.tsx` 생성
- [ ] `src/pages/SignupPage.tsx` 생성
- [ ] `src/pages/DashboardPage.tsx` 생성 (기존 TestPage 대체)

### 6. 라우팅 설정
- [ ] `src/App.tsx` 수정
  - [ ] `/login`, `/signup` 라우트 추가 (공개)
  - [ ] `/dashboard`, `/` 라우트 추가 (ProtectedRoute로 보호)
  - [ ] MainLayout 적용

### 7. useAuth 훅 개선
- [ ] `useLogin` 성공 시 `useMe` 자동 호출 확인
- [ ] 로그인 성공 후 리다이렉트 로직 추가
- [ ] 회원가입 성공 후 리다이렉트 로직 추가

### 8. 테스트 (수동)
- [ ] 비로그인 상태에서 `/dashboard` 접근 시 `/login`으로 리다이렉트 확인
- [ ] 회원가입 성공 후 로그인 페이지로 이동 확인
- [ ] 로그인 성공 후 대시보드 이동 및 헤더에 사용자 이름 표시 확인
- [ ] 로그아웃 버튼 클릭 시 로그인 페이지로 이동 확인
- [ ] 페이지 새로고침 시 로그인 상태 유지 확인

### 9. 완료 조건 검증
- [ ] ESLint 검사 통과
- [ ] TypeScript 타입 체크 통과
- [ ] 프로덕션 빌드 성공
- [ ] 모든 유효성 검사 에러 메시지 표시 확인
- [ ] 로딩 상태 UI 정상 동작 확인

---

## 🚨 예상 이슈 및 대응

### 1. useMe가 로그인 직후 실행되지 않음
- **원인:** `isAuthenticated` 상태 업데이트 타이밍 문제
- **해결:** `useLogin` 성공 콜백에서 수동으로 `queryClient.invalidateQueries(['me'])` 호출

### 2. 리다이렉트 후 이전 페이지 상태 유지
- **원인:** React Router 상태 관리 문제
- **해결:** `replace` 옵션 사용 (`navigate('/dashboard', { replace: true })`)

### 3. 폼 유효성 검사 에러 메시지가 표시되지 않음
- **원인:** shadcn/ui Form 컴포넌트 사용법 오류
- **해결:** `FormField`, `FormItem`, `FormMessage` 컴포넌트 올바르게 사용

### 4. Toast 알림이 표시되지 않음
- **원인:** Toaster 컴포넌트 미설치 또는 App.tsx에 추가 안됨
- **해결:** `App.tsx`에 `<Toaster />` 컴포넌트 추가

### 5. 로그인 후 Header에 사용자 정보가 표시되지 않음
- **원인:** `useMe` query가 실행되지 않거나 스토어 업데이트 안됨
- **해결:** `useMe` 훅의 `enabled` 조건 확인 및 `setUser` 호출 확인

---

## 📝 다음 단계 (Next Steps)

1. **Issue #7 (예정):** 대시보드 레이아웃 개선
   - 사이드바 네비게이션
   - 페이지별 라우팅 (잔고, 거래, 설정 등)

2. **Issue #8 (예정):** 잔고 조회 화면 구현
   - 인증이 필요한 첫 번째 실제 기능
   - 백엔드 잔고 API 연동

3. **Issue #9 (예정):** 주식 검색 및 주문 화면 개발

---

## 📎 참고 자료

- [React Hook Form 공식 문서](https://react-hook-form.com/get-started)
- [Zod 공식 문서](https://zod.dev/)
- [shadcn/ui Form 가이드](https://ui.shadcn.com/docs/components/form)
- [React Router Protected Routes](https://reactrouter.com/en/main/start/tutorial#protected-routes)
- [Backend Swagger UI](http://localhost:8000/docs)

---

## 🔐 보안 고려사항

### 1. 비밀번호 입력 필드
- `type="password"` 속성 사용 (자동 완성 방지)
- 브라우저 비밀번호 저장 기능 활용 (autocomplete="current-password")

### 2. CSRF 보호
- 현재 JWT 기반이므로 CSRF 위험 낮음
- 향후 Cookie 기반 인증 전환 시 CSRF 토큰 필요

### 3. XSS 방지
- 사용자 입력 자동 이스케이핑 (React 기본 동작)
- `dangerouslySetInnerHTML` 사용 금지

### 4. 민감한 정보 노출 방지
- 에러 메시지에 스택 트레이스 포함 금지
- 프로덕션 환경에서 console.log 제거

---

**작성 완료:** ✅
**다음 단계:** 사용자 승인 대기 → Branch 생성 → 구현 시작
