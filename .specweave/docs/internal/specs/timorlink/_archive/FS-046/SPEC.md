# SPEC.md — Zod Input Validation Audit

## Overview
> Audit and add Zod validation to API routes lacking input validation

## Scope
- Audit all `/src/pages/api/**` routes
- Add Zod schemas where manual validation exists

## Approach
- Create shared schema file (`src/lib/api-validation.ts`)
- Replace manual checks with Zod `safeParse()`
- Keep read-only endpoints unchanged

## Files Changed
1. `src/lib/api-validation.ts` — New
2. `src/pages/api/auth/sign-in.ts` — Updated
3. `src/pages/api/auth/forgot-password.ts` — Updated
4. `src/pages/api/auth/reset-password.ts` — Updated
5. `src/pages/api/admin/slug-check.ts` — Updated
6. `src/pages/api/admin/ai-generate.ts` — Updated
7. `src/pages/api/ai-test.ts` — Updated

## Verification
- Build passes
- TypeScript compiles
- Homepage loads
- Login page loads