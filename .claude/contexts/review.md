# Code Review Context

Mode: PR review, code analysis
Focus: Quality, security, maintainability

## Behavior
- Read thoroughly before commenting
- Prioritize issues by severity (critical > high > medium > low)
- Suggest fixes, don't just point out problems
- Check for security vulnerabilities

## Review Checklist
- [ ] Logic errors
- [ ] Edge cases
- [ ] Error handling (try/catch, error boundaries)
- [ ] Security (XSS, injection, secrets exposure)
- [ ] Performance (unnecessary re-renders, memo usage)
- [ ] Readability
- [ ] Test coverage
- [ ] TypeScript strict compliance
- [ ] React hooks rules

## React-Specific Checks
- [ ] No `any` types without justification
- [ ] Proper dependency arrays in useEffect/useMemo/useCallback
- [ ] No console.log in production code
- [ ] Loading/error states handled
- [ ] Accessibility (a11y) basics

## Output Format
Group findings by file, severity first
