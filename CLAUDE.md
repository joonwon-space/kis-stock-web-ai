# CLAUDE.md (Frontend)

This file provides guidance to **Claude Code** when working with the Frontend codebase.

> **Note:** 상세한 규칙은 `.claude/rules/` 디렉토리를 참조하세요.
> - `devlog.md` - Devlog 작성 규칙
> - `git-workflow.md` - Git/PR 워크플로우
> - `coding-style.md` - 코딩 스타일 가이드
> - `testing.md` - 테스트 요구사항
> - `security.md` - 보안 체크리스트
> - `agents.md` - Agent 사용법
> - `performance.md` - 성능 최적화
> - `patterns.md` - 공통 패턴
> - `hooks.md` - Hooks 시스템

---

## 🏗 Project Context

### Project Overview
- **Goal:** Build a Web Dashboard for **Korea Investment & Securities (KIS) Stock Trading**
- **Role:** Frontend for `kis_api_backend`
- **Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, Zustand

### Architecture (Feature-Sliced Design)
```
src/
├── api/           # Axios setup & interceptors
├── features/      # Business logic by domain
│   └── {feature}/
│       ├── api/        # API call functions
│       ├── components/ # Feature-specific UI
│       ├── hooks/      # React Query hooks
│       └── types/      # TS interfaces
├── components/    # Shared UI (shadcn/ui)
├── pages/         # Route pages
└── stores/        # Zustand stores (if needed)
```

### Key Constraints
1. **API Integration:** All API calls through `src/api/axios.ts`
2. **Type Safety:** TypeScript interfaces must match Backend Pydantic models
3. **State Management:**
   - Server State: TanStack Query
   - Client State: Zustand (only if necessary)
4. **Styling:** Mobile-first Tailwind CSS

---

## ⚡ Quick Reference

### Commands
```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint check
npm test         # Run tests
```

### Commit Style (Korean)
```bash
git commit -m "feat: 잔고 조회 UI 구현

- TanStack Query를 이용한 잔고 데이터 페칭
- 잔고 테이블 컴포넌트 구현

Relates to #3"
```

### PR Template
```bash
gh pr create --title "feat: {Title} (#{IssueNumber})" --body "$(cat <<'EOF'
## Summary
{간략한 요약}

## Changes
- {변경사항}

## Test plan
- [ ] {테스트 항목}

Closes #{IssueNumber}
EOF
)"
```

---

## 📝 Patterns

### React Query Hook
```typescript
// src/features/balance/hooks/useBalance.ts
import { useQuery } from '@tanstack/react-query';
import { fetchBalance } from '../api/balanceApi';
import type { BalanceResponse } from '../types';

export const useBalance = () => {
  return useQuery<BalanceResponse>({
    queryKey: ['balance'],
    queryFn: fetchBalance,
    staleTime: 1000 * 60,
  });
};
```

### Error Handling
```typescript
if (isError) {
  toast.error("데이터를 불러오는데 실패했습니다.");
}
if (isLoading) {
  return <Skeleton className="w-full h-20" />;
}
```

---

## 🔐 Security Checklist
- [ ] `.env` in `.gitignore`
- [ ] No hardcoded API keys
- [ ] Auth tokens in HttpOnly cookies or memory
- [ ] No `console.log` in production

---

Last Updated: 2026-02-04
Maintained By: Claude Code & Human Developer
