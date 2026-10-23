# Spec: Testing Infrastructure

## Purpose
Establish a robust unit testing environment that validates the functionality and rendering of the portfolio's React components.

## Requirements
- **REC-01**: Must use Vitest as the test runner for native Vite integration.
- **REC-02**: Must use React Testing Library for component-level testing.
- **REC-03**: Must support TypeScript (.tsx/.ts) files for all tests.
- **REC-04**: Test environment must simulate a DOM (e.g. `jsdom`).
- **REC-05**: All existing UI components (App and children) must have basic smoke tests (rendering without error).
- **REC-06**: `npm test` must run tests once, and `npm run test:watch` should support interactive development.

## Scenarios
- **SCN-01**: Run all tests - all tests should pass successfully.
- **SCN-02**: Fail a test manually - test runner should correctly report failure.
- **SCN-03**: Component rendering - RTL should verify that expected text (e.g., "Alex") appears in the rendered output.
