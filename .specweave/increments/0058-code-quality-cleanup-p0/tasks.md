# Tasks: Code Quality Cleanup P0

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## US-001: 修复空 catch 块导致的静默错误

### T-001: Fix empty catch blocks in action layer
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03
**Status**: [x] completed

**Files to modify**:
- `src/actions/business/create.ts` (lines 91, 98, 105)
- `src/actions/products/create.ts` (line 68)
- `src/actions/products/update.ts` (line 37)

**Pattern**:
```typescript
catch (error) {
  console.error('[Action:create] Error:', getErrorMessage(error));
  return { success: false, error: { message: getErrorMessage(error) } };
}
```

**Test Plan**:
- **File**: `src/actions/business/create.test.ts` (verify error logging)
- **Tests**:
  - **TC-001**: Given DB insert fails → Then console.error called with error message
  - **TC-002**: Given validation fails → Then error returned with structured format

---

### T-002: Fix empty catch blocks in lib layer
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04, AC-US1-05
**Status**: [x] completed

**Files to modify**:
- `src/lib/auth-kv-store.ts` (lines 17, 49)
- `src/lib/subscription.ts` (line 44)

**Pattern**:
```typescript
// Internal graceful degradation
catch (e) {
  console.warn('[KVStore] Operation failed:', e instanceof Error ? e.message : String(e));
  return defaultValue;
}
```

**Test Plan**:
- **File**: `src/lib/auth-kv-store.test.ts`
- **Tests**:
  - **TC-001**: Given KV get throws → Then returns null + warning logged
  - **TC-002**: Given KV list throws → Then returns empty keys + warning logged

---

## US-002: 移除生产环境 console.log 泄露

### T-003: Remove console.log from aiGenerate action
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01
**Status**: [x] completed

**File**: `src/actions/admin/aiGenerate.ts`

**Remove lines**:
- Line 29: `console.log('[AI Action] Called with type:', ...)`
- Line 42: `console.log('[AI] API Key status:', ...)` ← API key length leak
- Line 135: `console.log('[AI] Calling MiniMax API directly...')`
- Line 160: `console.log('[AI] API Response received, ...)`
- Line 184: `console.log('[AI] Parsed JSON keys:', ...)`

**Test Plan**:
- **File**: `src/actions/admin/aiGenerate.test.ts`
- **Tests**:
  - **TC-001**: Given AI generate called → Then no console.log in production output

---

### T-004: Remove console.log from scheduled jobs
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02, AC-US2-03, AC-US2-04
**Status**: [x] completed

**Files**:
- `src/pages/api/scheduled/_mark-expired.ts` (line 65)
- `src/pages/api/scheduled/_cleanup.ts` (lines 21, 48, 67, 97)
- `src/pages/api/scheduled/_cleanup-orphan-media.ts` (lines 20, 34, 78)

**Pattern** (for scheduled jobs, keep or wrap in DEV check):
```typescript
// Option A: Remove entirely (production safe)
console.log('Job summary: ...') → delete

// Option B: Keep for dev only
if (import.meta.env.DEV) {
  console.log(`[Cleanup] Summary: deleted ${count} items`);
}
```

---

### T-005: Remove console.log from admin ai-tools page
**User Story**: US-002 | **Satisfies ACs**: AC-US2-05
**Status**: [x] completed

**File**: `src/pages/admin/ai-tools.astro` (lines 711, 715, 716, 725)

**Remove**: Client-side debug console.log calls

---

## US-003: 替换 as any 类型断言

### T-006: Create type-safe env wrapper
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01
**Status**: [x] completed

**New file**: `src/lib/env.ts`

```typescript
// Cloudflare Workers Environment Access - no more 'as any'

interface Env {
  MINIMAX_API_KEY?: string;
  // ...add as needed
}

export function getEnv(): Env {
  if (typeof globalThis !== 'undefined' && 'env' in globalThis) {
    return globalThis.env as Env;
  }
  return {};
}

export function getMinimaxApiKey(): string {
  return getEnv().MINIMAX_API_KEY || '';
}
```

**Test Plan**:
- **File**: `src/lib/env.test.ts` (create new)
- **Tests**:
  - **TC-001**: Given Workers runtime → Then env.MIMIMAX_API_KEY accessible
  - **TC-002**: Given browser runtime → Then returns empty object safely
  - **TC-003**: Given missing env var → Then returns empty string from getMinimaxApiKey()

---

### T-007: Update mastra agents to use env wrapper
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02
**Status**: [x] completed

**File**: `src/mastra/agents/index.ts`

**Changes**:
- Remove `(globalThis as any).env` → use `getEnv()`
- Remove 4 instances of `minimaxModel as any` → typed model directly

**Pattern**:
```typescript
import { getEnv } from '@/lib/env';

const env = getEnv();
const minimaxApiKey = env.MINIMAX_API_KEY || '';

const minimaxModel = {
  providerId: "minimax-cn-coding-plan",
  modelId: "MiniMax-M2.7",
  apiKey: minimaxApiKey || undefined,
} as Parameters<typeof Agent>[0]['model'];  // if type assertion needed, keep minimal
```

---

### T-008: Update aiGenerate to use env wrapper
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03
**Status**: [x] completed

**File**: `src/actions/admin/aiGenerate.ts`

**Changes**:
- Remove `getApiKey()` function
- Import and use `getMinimaxApiKey()` from `@/lib/env`
- Remove 6 instances of `(globalThis as any).env`

---

## US-004: 删除冗余 REST API 端点

### T-009: Delete redundant API files
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02, AC-US4-03, AC-US4-04, AC-US4-05
**Status**: [x] completed

**Files to delete**:
```
src/pages/api/banners/[id].ts          # DELETE, PUT
src/pages/api/banners/index.ts         # POST
src/pages/api/businesses/[slug].ts     # PUT only (keep GET)
src/pages/api/media/[id].ts           # GET, DELETE
src/pages/api/media/index.ts          # POST, PUT, DELETE
src/pages/api/products/[id].ts        # GET, PUT, DELETE
src/pages/api/products/index.ts       # POST, PUT, DELETE
src/pages/api/reviews/[id]/reply.ts   # POST, PUT, DELETE
src/pages/api/reviews/index.ts        # POST portion
```

**Pre-delete verification**:
```bash
# Verify no external consumers
grep -rn "fetch.*api/products" src/ --include="*.ts" --include="*.astro" | grep -v "actions/"
grep -rn "fetch.*api/banners" src/ --include="*.ts" | grep -v "actions/"
```

**Keep (read-only)**:
- `src/pages/api/businesses/index.ts` — public listing
- `src/pages/api/businesses/[slug].ts` — GET only
- `src/pages/api/banners/index.ts` — GET only

**Test Plan**:
- **File**: `tests/e2e/api-cleanup.test.ts`
- **Tests**:
  - **TC-001**: Given deleted endpoints accessed → Then 404 or redirect to actions
  - **TC-002**: Given Server Actions still work → Then CRUD operations succeed

---

## Verification Phase

### T-010: Build and type check
**Status**: [x] completed

**Commands**:
```bash
pnpm build
npx astro check
```

**Criteria**:
- Build succeeds
- Type check passes with no errors
- No `as any` in src/ (except `// legacy` comments)

### T-011: Final verification
**Status**: [x] completed

**Commands**:
```bash
# No empty catch blocks in action layer
grep -rn "} catch {" src/actions/ src/lib/ | grep -v "console.error\|console.warn\|getErrorMessage"

# No console.log in production paths
grep -rn "console\.log" src/actions/ src/pages/admin/ src/pages/api/ | grep -v "seed\|test"

# Count remaining as any
grep -rn "as any" src/ --include="*.ts" | grep -v "// legacy"
```

**Expected**:
- 0 empty catch blocks in action/lib
- 0 console.log in actions/admin, pages/admin, pages/api/scheduled
- Count as any: 0 (or minimal with legacy comments)