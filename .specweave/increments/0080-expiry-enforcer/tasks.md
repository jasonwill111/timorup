# Tasks: 0080-expiry-enforcer

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- Model hints: haiku (simple), opus (complex)

---

## Phase 1: Create Expiry Module

### T-001: Create src/lib/expiry/types.ts
**Model**: haiku
**AC**: AC-US1-04 (GRACE_PERIOD_DAYS)
**Test Mode**: TDD

**Implementation**:
1. Create `src/lib/expiry/` directory
2. Create types.ts:
```typescript
export type SubscriptionStatus = 'none' | 'active' | 'expired' | 'cancelled';

export interface SubscriptionData {
  status: SubscriptionStatus;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
}

export interface PermissionResult {
  can: boolean;
  reason?: string;
}

export const GRACE_PERIOD_DAYS = 60;
```

**Test Plan**: N/A (types only)

**Status**: [x]

---

### T-002: Create src/lib/expiry/ExpiryEnforcer.ts
**Model**: opus
**AC**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US2-01, AC-US2-02, AC-US2-03
**Test Mode**: TDD

**Implementation**:
1. Create ExpiryEnforcer class with methods
2. `isInGracePeriod()`: 计算是否在宽限期内
3. `isPastGracePeriod()`: 计算是否超过宽限期
4. `canCreateSku()`: SKU 创建权限
5. `canEditBusiness()`: 业务编辑权限
6. `getDaysRemainingInGrace()`: 宽限期剩余天数

**Test Plan**:
- File: `src/lib/expiry/ExpiryEnforcer.test.ts`
- TC-001: `isInGracePeriod` returns true for expired within grace
  - Given subscription with status='expired', expiresAt=30 days ago
  - When calling `isInGracePeriod()`
  - Then returns true
- TC-002: `isInGracePeriod` returns false for expired past grace
  - Given subscription with status='expired', expiresAt=70 days ago
  - When calling `isInGracePeriod()`
  - Then returns false
- TC-003: `canCreateSku` rejects when status='none'
  - Given null subscription
  - When calling `canCreateSku()`
  - Then returns `{ can: false, reason: 'Business not found' }`
- TC-004: `canEditBusiness` rejects when in grace period
  - Given subscription in grace period
  - When calling `canEditBusiness()`
  - Then returns `{ can: false, reason: /grace period/ }`

**Status**: [x]

---

### T-003: Create src/lib/expiry/index.ts
**Model**: haiku
**AC**: All
**Test Mode**: TDD

**Implementation**:
```typescript
export { ExpiryEnforcer } from './ExpiryEnforcer';
export { GRACE_PERIOD_DAYS } from './types';
export type { SubscriptionData, SubscriptionStatus, PermissionResult } from './types';
```

**Status**: [x]

---

## Phase 2: Write RED Tests

### T-004: Write expiry unit tests (RED)
**Model**: opus
**AC**: AC-US4-01, AC-US4-02, AC-US4-03
**Test Mode**: TDD

**Implementation**:
1. Create ExpiryEnforcer.test.ts with RED tests
2. Test 60-day boundary conditions
3. Test all status values

**Test Plan**:
- File: `src/lib/expiry/ExpiryEnforcer.test.ts`
- TC-001: Exact 60 days ago NOT past grace
  - Given subscription expired exactly 60 days ago
  - When calling `isPastGracePeriod()`
  - Then returns false
- TC-002: 61 days ago IS past grace
  - Given subscription expired 61 days ago
  - When calling `isPastGracePeriod()`
  - Then returns true
- TC-003: status='active' allows SKU creation
  - Given subscription with status='active', skuCount=0, skuLimit=10
  - When calling `canCreateSku()`
  - Then returns `{ can: true }`
- TC-004: status='expired' blocks SKU creation regardless of grace
  - Given subscription with status='expired', in grace period
  - When calling `canCreateSku()`
  - Then returns `{ can: false, reason: 'Subscription expired' }`
- TC-005: status='cancelled' blocks SKU creation
  - Given subscription with status='cancelled'
  - When calling `canCreateSku()`
  - Then returns `{ can: false, reason: 'Subscription cancelled' }`
- TC-006: SKU limit check
  - Given subscription with status='active', skuCount=10, skuLimit=10
  - When calling `canCreateSku()`
  - Then returns `{ can: false, reason: /SKU limit/ }`

**Status**: [x]

---

## Phase 3: Implement GREEN

### T-005: Implement ExpiryEnforcer (GREEN)
**Model**: opus
**AC**: AC-US1-01, AC-US1-02, AC-US2-01, AC-US2-02, AC-US2-03
**Test Mode**: TDD

**Implementation**:
1. Implement all ExpiryEnforcer methods
2. Pass all tests from T-004

**Test Plan**:
- Command: `pnpm vitest run src/lib/expiry/ExpiryEnforcer.test.ts`
- TC-001: All tests pass

**Status**: [x]

---

## Phase 4: Integration

### T-006: Update subscription.ts
**Model**: haiku
**AC**: AC-US3-03
**Test Mode**: TDD

**Implementation**:
1. Import ExpiryEnforcer
2. Create wrapper functions using ExpiryEnforcer
3. Keep backward-compatible API

**Test Plan**:
- File: `src/lib/subscription.ts`
- TC-001: Existing functions still work (import ExpiryEnforcer internally)

**Status**: [x]

---

### T-007: Update products/create.ts
**Model**: haiku
**AC**: AC-US3-02
**Test Mode**: TDD

**Implementation**:
1. Import ExpiryEnforcer or use subscription.ts
2. Replace inline permission checks

**Test Plan**:
- File: `src/actions/products/create.ts`
- TC-001: Product creation checks subscription status

**Status**: [x]

---

### T-008: Update business/create.ts
**Model**: haiku
**AC**: AC-US3-01
**Test Mode**: TDD

**Implementation**:
1. Import ExpiryEnforcer or use subscription.ts
2. Replace inline permission checks

**Test Plan**:
- File: `src/actions/business/create.ts`
- TC-001: Business creation checks subscription status

**Status**: [x]

---

## Phase 5: Verification

### T-009: Run all tests
**Model**: opus
**AC**: AC-US4-04
**Test Mode**: TDD

**Implementation**:
1. Run `pnpm test`
2. Verify 420+ tests pass
3. Fix any failures

**Test Plan**:
- Command: `pnpm test`
- TC-001: All tests pass

**Status**: [x]

---

### T-010: Build verification
**Model**: opus
**AC**: All
**Test Mode**: TDD

**Implementation**:
1. Run `pnpm build`
2. Verify no errors

**Test Plan**:
- Command: `pnpm build`
- TC-001: Build succeeds

**Status**: [x]

---

## Summary

| Task | AC | Model | Status |
|------|----|-------|--------|
| T-001 | AC-US1 | haiku | [ ] |
| T-002 | AC-US1, AC-US2 | opus | [ ] |
| T-003 | All | haiku | [ ] |
| T-004 | AC-US4 | opus | [ ] |
| T-005 | AC-US1, AC-US2 | opus | [ ] |
| T-006 | AC-US3 | haiku | [ ] |
| T-007 | AC-US3 | haiku | [ ] |
| T-008 | AC-US3 | haiku | [ ] |
| T-009 | AC-US4 | opus | [ ] |
| T-010 | All | opus | [ ] |

**Dependencies**: T-001 → T-002 → T-003 → T-004 (RED) → T-005 (GREEN) → T-006/7/8 → T-009/10

**Total**: 10 tasks