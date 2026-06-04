---
name: pr-validation
description: >
  Use when validating a branch before opening a pull request or merging into
  development or main. Runs the Angular build and test suite, then reports
  pass/fail with a merge-readiness summary.
---

# PR Validation Skill

## Purpose

Confirm that the current branch is ready to be submitted as a Pull Request. Runs both the production build and the full unit test suite, then produces a structured readiness report.

## Steps

### 1. Check current branch

```bash
git branch --show-current
git status
```

Confirm there are no uncommitted changes that should be included in the PR.

### 2. Run Production Build

```bash
ng build --configuration=production
```

Expected: exits with code 0, zero errors.

Report:
- ✅ Build passed — or —
- ❌ Build failed: list each error with file and line number

### 3. Run Unit Tests

```bash
ng test --watch=false --browsers=ChromeHeadless
```

Expected: all tests pass, zero failures.

Report:
- ✅ Tests passed: N/N — or —
- ❌ Tests failed: list each failing test with its error message

### 4. Run Lint

```bash
ng lint
```

Report any errors (warnings are noted but do not block merge).

### 5. Produce Readiness Report

Output the following table:

| Check | Result |
|---|---|
| Production build | ✅ / ❌ |
| Unit tests | ✅ N/N passing / ❌ N failing |
| Lint | ✅ / ⚠️ warnings / ❌ errors |
| Uncommitted changes | ✅ clean / ⚠️ N files uncommitted |
| **Merge ready** | ✅ YES / ❌ NO — fix issues above |

If any check is ❌, do **not** open the PR. Fix the issues first, then re-run this skill.

## After Validation

If all checks pass, proceed with:

```bash
gh pr create \
  --base development \
  --title "<type>(scope): <description>" \
  --body "<PR description per pr-author agent template>"
```

For a `development` → `main` release PR, use `--base main`.
