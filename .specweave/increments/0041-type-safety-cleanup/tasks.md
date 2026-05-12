# Tasks: TypeScript Type Safety & Console Cleanup

## US-001: Replace Category Data `any[]` with Typed Interfaces

### T-001: Add Category interface and fix categories.astro variables
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03
**Status**: [x] Completed
**Model**: haiku
**Test**: Given admin categories page loads → When categories and parentCategories are assigned → Then they use Category[] type

```typescript
// Add inline interface in categories.astro script
interface Category {
  id: string;
  name: string;
  slug: string;
  entityType: string;
  parentId: string | null;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  description: string | null;
  isActive: boolean;
}
```

### T-002: Fix callback parameter types in categories.astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given categories array → When filter callbacks are applied → Then callbacks use (c: Category) parameter type

- Replace `(c: any)` with `(c: Category)` in filter functions
- Replace `any` in categoryData object with typed interface

---

## US-002: Replace AI Generator Response `any` with Typed Interfaces

### T-003: Create AI generator typed interfaces
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03
**Status**: [x] Completed
**Model**: haiku
**Test**: Given AI generate response → When response is assigned to variable → Then typed interface is used

```typescript
// Add to src/pages/admin/ai-tools.astro script
interface GeneratedListing {
  title: string;
  entityType: string;
  categoryId: string | null;
  contactName: string | null;
  contactNumber: string | null;
  countryCode: string;
  email: string | null;
  address: string | null;
  aboutUs: string | null;
  tags: string[];
}

interface GeneratedSku {
  title: string;
  serviceType: string;
  skuDescription: string;
  priceFields: PriceField[];
}

interface PriceField {
  label: string;
  value: string;
  unit: string;
}

interface GeneratedBlog {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  slug: string;
  status: string;
}

interface GeneratedLanding {
  hero: { title: string; subtitle: string };
  landingDescription: string;
  features: { title: string; description: string }[];
  cta: { title: string; description: string; buttonText: string };
}
```

### T-004: Fix generatedListing, generatedSku, generatedBlog, generatedLanding types
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01
**Status**: [x] Completed
**Model**: haiku
**Test**: Given listing generator form submit → When response is received → Then generatedListing uses GeneratedListing type

- Replace `let generatedListing: any = null` with typed variable
- Replace `let generatedSku: any = null` with typed variable
- Replace `let generatedBlog: any = null` with typed variable
- Replace `let generatedLanding: any = null` with typed variable

### T-005: Fix error catch blocks and price field maps
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02, AC-US2-03
**Status**: [x] Completed
**Model**: haiku
**Test**: Given error in generation → When caught → Then error uses Error type not any

- Replace `catch (err: any)` with `catch (err: Error)`
- Replace `(p: any)` with `(p: PriceField)` in map callbacks

---

## US-003: Replace Admin Dashboard Chart Data `any`

### T-006: Fix chart data type declarations in admin index.astro
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given monthly data loaded → When passed to render functions → Then typed interfaces used

```typescript
// Add interfaces in admin/index.astro script
interface MonthlyData {
  month: string;
  revenue: number;
  subscriptions: number;
}
```

- Replace `.map((m: any) => m.subscriptions)` with `.map((m: MonthlyData) => m.subscriptions)`
- Replace `.map((m: any) => m.month)` with `.map((m: MonthlyData) => m.month)`
- Replace `(sub: any)` with `(sub: Subscription)` in subscription map (define Subscription interface based on API response)

---

## US-004: Replace Slug Check Dynamic Table References

### T-007: Fix slug-check.ts table and field types
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given slug-check API called → When selecting table → Then table uses proper Drizzle table type

- Replace `let table: any` with proper type: `typeof businessPages | typeof blogPosts | typeof landingPages`
- Replace `let slugField: any` with proper type using schema field types

---

## US-005: Remove Debug Console Logs from Auth Module

### T-008: Remove console.log from lib/auth.ts
**User Story**: US-005 | **Satisfies ACs**: AC-US5-01, AC-US5-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given auth initialization → When initAuth is called → Then no console.log output (debug logs removed)

Remove these lines from `createAuth`:
- `console.log('[Auth] Creating auth instance');`
- `console.log('[Auth] DB type:', ...)`
- `console.log('[Auth] Schema tables:', ...);`

Remove these from `initAuth`:
- `console.log('[initAuth] Got DB:', ...)`
- All other console.log between lines 169-175

Keep:
- `console.warn('[Auth] Invalid APP_URL...')` - warning for invalid config (line 132)
- `console.error('[Auth] FATAL: ...')` - fatal error (line 149)

---

## US-006: Remove Debug Console Logs from DB Module

### T-009: Remove console.log from lib/db.ts
**User Story**: US-006 | **Satisfies ACs**: AC-US6-01, AC-US6-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given DB initialization → When getDb() is called → Then no console.log output (debug logs removed)

Remove:
- `console.log('[getDb] Drizzle/D1 initialized');` (line 21)
- Keep `console.error('[getDb] Failed...')` for actual errors (line 24)
- Keep initialization in `initDb` function: `console.log('[getDb] Drizzle/D1 initialized with provided binding');` - this is useful for middleware setup

---

## US-007: Remove Debug Console Logs from Scheduled Jobs

### T-010: Clean up _cleanup.ts console logs
**User Story**: US-007 | **Satisfies ACs**: AC-US7-01
**Status**: [x] Completed
**Model**: haiku
**Test**: Given cleanup job runs → When processing → Then only summary and errors logged

Remove verbose progress logs, keep:
- `console.log('[Cleanup] Starting expired business cleanup...')` - job start (line 48)
- `console.log('[Cleanup] Cutoff date: ...')` - context (line 49)
- `console.log('[Cleanup] Found X expired businesses to delete')` - summary (line 66)
- `console.error('[Cleanup] Error deleting...')` - errors (line 99)
- `console.log('[Cleanup] Completed. Deleted X businesses')` - final summary (line 103)
- `console.error('[Cleanup] Fatal error:')` - fatal (line 110)

Remove per-business logs (lines 72, 77, 87, 91, 95) or convert to only log errors

### T-011: Clean up _mark-expired.ts console logs
**User Story**: US-007 | **Satisfies ACs**: AC-US7-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given mark-expired job runs → When processing → Then only summary and errors logged

Keep essential logs only. Removed per-item verbose logging.

### T-012: Clean up _cleanup-orphan-media.ts console logs
**User Story**: US-007 | **Satisfies ACs**: AC-US7-03
**Status**: [x] Completed
**Model**: haiku
**Test**: Given orphan cleanup job runs → When processing → Then only summary and errors logged

Removed per-item console.log for R2 deletions. Keep start/summary/error logs.

### T-013: Clean up _cleanup-expired.ts console logs (check if it exists)
**User Story**: US-007 | **Satisfies ACs**: AC-US7-04
**Status**: [x] Completed
**Model**: haiku
**Test**: Given cleanup-expired job runs → When processing → Then only summary and errors logged

Verified file has appropriate logging.

---

## US-008: Remove Debug Console Logs from Auth APIs

### T-014: Clean up sign-in.ts console logs
**User Story**: US-008 | **Satisfies ACs**: AC-US8-01, AC-US8-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given user signs in → When processing → Then no user data logged

Remove line 60 (leaks user info):
- `console.log('[SignIn] existingUser:', ...)`

Remove lines 76, 94, 109 (debug logs):
- `console.log('[SignIn] better-auth created duplicate...')`
- `console.log('[SignIn] Session updated...')`
- `console.log('[SignIn] Sign in successful, userId: ...')`

Keep:
- `console.error('[SignIn] Error:')` - actual errors (line 140)

---

## US-009: Remove Debug Console Logs from Other Pages

### T-015: Clean up subscribe.astro console logs
**User Story**: US-009 | **Satisfies ACs**: AC-US9-01
**Status**: [x] Completed
**Model**: haiku
**Test**: Given subscribe page loads → When auth check runs → Then debug log removed

Remove line 77:
- `console.log('[Subscribe] Auth check result:', ...)`

Keep error logging (line 73)

### T-016: Clean up business slug edit page
**User Story**: US-009 | **Satisfies ACs**: AC-US9-02
**Status**: [x] Completed
**Model**: opus
**Test**: Given file upload with unsupported type → When processing → Then proper error handling (not console.log)

Search for and remove/convert console.log statements that log file type errors

---

## US-010: Add TypeScript Interfaces for Shared Types

### T-017: Create or verify types file
**User Story**: US-010 | **Satisfies ACs**: AC-US10-01, AC-US10-02
**Status**: [x] Completed
**Model**: haiku
**Test**: Given application runs → When types are needed → Then interfaces are importable

Check if `src/types/index.ts` exists. If not, create it with needed interfaces. Otherwise, verify interfaces are used where needed in files.

---

## Verification

### T-018: Build verification
**Status**: [x] Completed
**Model**: haiku
**Test**: Given code changes complete → When pnpm build runs → Then build passes without type errors

```bash
pnpm build
```

### T-019: Type check verification
**Status**: [x] Completed
**Model**: haiku
**Test**: Given build passes → When TypeScript check runs → Then no 'any' type errors in affected files

```bash
npx tsc --noEmit
```