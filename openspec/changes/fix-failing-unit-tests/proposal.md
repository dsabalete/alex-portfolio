# Proposal: Fix Failing Unit Tests

## Intent
Set up a unit testing framework (Vitest + React Testing Library) and implement test suites for existing application components/modules to ensure all tests execute and pass cleanly.

## Scope
- Configure Vitest and `@testing-library/react` for the Vite + React 19 + TypeScript codebase.
- Add test scripts to `package.json` (`npm test`).
- Write initial unit test suites for core application elements (`src/App.tsx` and main components).
- Ensure `npm test` passes in local and CI environments.

## Non-Goals
- End-to-end (E2E) browser automation testing (e.g. Cypress or Playwright).
- Refactoring core application business logic beyond what is required for testability.

## Impact
- Prevents regressions as new features or portfolio sections are added.
- Establishes unit testing infrastructure and standards for future changes.
