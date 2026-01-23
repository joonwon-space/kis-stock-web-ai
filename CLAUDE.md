# CLAUDE.md (Frontend)

This file provides guidance to **Claude Code** (Anthropic's CLI Agent) when working with the Frontend codebase.

## 🚨 0. PRIMARY WORKFLOW (MANDATORY)

**Claude Code must follow this "Devlog + Git Flow" hybrid workflow for EVERY non-trivial task.**
Same workflow as the Backend to maintain consistency.

### Phase 1: Analyze & Plan (Devlog)
1.  **Fetch Issue:** Use `gh issue view {issue_number}`.
2.  **Check/Create Devlog:**
    - Directory: `docs/devlog/`
    - Filename: `YYYY-MM-DD-NN-task-name.md`
    - Content: UI Design Analysis, Component Structure, State Management Strategy, API Integration Plan.
3.  **User Approval:** **WAIT** for the user to approve the plan in the devlog.

### Phase 2: Branch & Execute (Git Flow)
1.  **Create Branch:** `git checkout -b feature/issue-{number}-{description}`.
2.  **Implement:** Write code according to the Devlog plan.
3.  **Verify:** Run tests (`npm test`) and check linting (`npm run lint`).

### Phase 3: Commit & PR
1.  **Commit:** Use Conventional Commits (Korean).
2.  **Push:** `git push -u origin feature/...`
3.  **Create PR:** Use `gh pr create` with the template.

---

## 📘 Claude Code Development Guide

## 🏗 Project Context

### Project Overview
- **Goal:** Build a Web Dashboard for **Korea Investment & Securities (KIS) Stock Trading**.
- **Role:** Frontend for `kis_api_backend`.
- **Tech Stack:** React (Vite), TypeScript, Tailwind CSS, TanStack Query.

### Architecture (Feature-Sliced Design)
- **src/api/** – Axios setup & interceptors.
- **src/features/** – Business logic grouped by domain (matches Backend `endpoints`).
  - Example: `features/balance/` contains:
    - `api/`: API call functions.
    - `components/`: Feature-specific UI.
    - `hooks/`: React Query hooks (e.g., `useBalance`).
    - `types/`: TS Interfaces matching Backend Pydantic models.
- **src/components/** – Shared/Atomic UI components (shadcn/ui).

### Key Constraints
1.  **API Integration:** All API calls must go through `src/api/axios.ts` to handle CORS and Auth headers automatically.
2.  **Type Safety:** **Strictly** match TypeScript interfaces with Backend Pydantic models.
3.  **State Management:**
    - **Server State:** Use `TanStack Query` (queries/mutations).
    - **Client State:** Use `Zustand` (only if necessary).
4.  **Responsiveness:** Mobile-first approach using Tailwind classes.

---

## 🛠 Git & GitHub Workflow

### 1. Issue & Branching
```bash
# Check issues
gh issue list

# Create Feature Branch
git checkout main
git pull origin main
git checkout -b feature/issue-{number}-{description}
2. Commit Style (Korean)
Commits must be in Korean and follow Conventional Commits.

Bash
git commit -m "feat: 잔고 조회 UI 구현

- TanStack Query를 이용한 잔고 데이터 페칭(useBalance)
- 잔고 테이블 컴포넌트 구현 (DataTable)
- 로딩 스켈레톤 및 에러 처리 UI 추가

Relates to #3"
Prefixes: feat, fix, docs, style (UI changes), refactor, test, chore.

3. Pull Request (PR)
Same template as Backend.

Bash
gh pr create --title "feat: {Title} (#{IssueNumber})" --body "$(cat <<'EOF'
## Summary
{간략한 요약}

## Changes
- {변경사항 1}
- {변경사항 2}

## UI/UX
- [ ] {스크린샷 또는 동작 설명}

## Test plan
- [ ] {테스트 항목 1}

## Related Issues
Closes #{IssueNumber}

🤖 Generated with Claude Code
EOF
)"
⚡ Claude Code Specific Guidelines
Tool Usage
Package Manager: Use npm.

Linting: Run npm run lint before committing.

Dev Server: npm run dev.

Coding Standards
Components: Functional components with typed props.

Hooks: Encapsulate logic in custom hooks (e.g., useStockSearch).

Styling: Use Tailwind utility classes. Avoid inline styles.

Error Handling: Use Error Boundaries or Toast notifications for API errors.

Communication
Language: Korean for all Devlogs, Commits, and PR descriptions.

🧪 Testing Guidelines
Test Structure
kis-stock-web/
├── src/
│   ├── features/
│   │   └── balance/
│   │       └── __tests__/      # Feature specific tests
│   │           └── BalanceTable.test.tsx
Test Commands
Bash
# Run all tests
npm test

# Run specific test file
npm test src/features/balance/__tests__/BalanceTable.test.tsx
Test Writing Rules
Library: Vitest + React Testing Library.

Mocking: Mock API calls using MSW (Mock Service Worker) or simple Vitest mocks.

Focus: Test user interactions (clicks, inputs) and state rendering, not implementation details.

📝 API Integration Guide
Backend Connection
Base URL: VITE_API_URL in .env (default: http://localhost:8000).

Proxy: Configured in vite.config.ts to avoid CORS during dev.

Hook Example (React Query)
TypeScript
// src/features/balance/hooks/useBalance.ts
import { useQuery } from '@tanstack/react-query';
import { fetchBalance } from '../api/balanceApi';
import { BalanceResponse } from '../types';

export const useBalance = () => {
  return useQuery<BalanceResponse>({
    queryKey: ['balance'],
    queryFn: fetchBalance,
    staleTime: 1000 * 60, // 1 minute
  });
};
🚨 Error Handling
UI Feedback
Global: Use Toaster (e.g., sonner or react-hot-toast) for API errors.

Local: Use Loading Spinners/Skeletons for async states.

TypeScript
if (isError) {
  toast.error("잔고를 불러오는데 실패했습니다.");
}
if (isLoading) {
  return <Skeleton className="w-full h-20" />;
}
🔐 Security Checklist
[ ] .env is in .gitignore.

[ ] No hardcoded API keys in Frontend code.

[ ] Auth tokens stored securely (HttpOnly cookies preferred, or memory/sessionStorage).

[ ] console.log removed in production build.

Last Updated: 2026-01-23 Maintained By: Claude Code & Human Developer