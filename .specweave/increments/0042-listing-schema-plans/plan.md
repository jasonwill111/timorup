# Plan: Listing Schema and Plans

## Context

TimorLink needs to expand from business/nonprofit listings to include personal listings with a subscription system.

**Current State** (`src/db/schema/index.ts`):
- `business_pages.entityType`: `'business' | 'nonprofit'` â€?needs `'personal'`
- `business_pages.planType`: exists but not enforced
- `business_pages.subscriptionStatus`: `'none' | 'active' | 'expired' | 'cancelled'` â€?needs `'trial'`
- `plans` table: exists with `period` â€?needs new periods: `trial_3d`, `weekly`

---

## Design

### 1. Schema Changes

**File**: `src/db/schema/index.ts`

```typescript
// Current
entityType: text('entity_type').default('business') // 'business' | 'nonprofit'

// Updated
entityType: text('entity_type').default('business') // 'business' | 'nonprofit' | 'personal'
```

**Add to `business_pages`**:
```typescript
subscriptionExpiresAt: integer('subscription_expires_at'), // timestamp
trialStartedAt: integer('trial_started_at'), // timestamp
```

### 2. Plans Table Changes

**File**: `src/db/schema/plans.ts`

```typescript
// Current
period: text('period').default('monthly'), // 'monthly' | 'yearly'

// Add new periods
period: text('period').default('monthly'), // 'monthly' | 'yearly' | 'trial_3d' | 'weekly'
```

### 3. Drizzle Migration

**File**: `migrations/0042_listing_subscription.sql`

```sql
-- Add 'personal' to entityType enum
ALTER TABLE business_pages ADD COLUMN entity_type TEXT DEFAULT 'business' CHECK(entity_type IN ('business', 'nonprofit', 'personal'));

-- Add new columns
ALTER TABLE business_pages ADD COLUMN subscription_expires_at INTEGER;
ALTER TABLE business_pages ADD COLUMN trial_started_at INTEGER;
```

### 4. Subscription Utilities

**File**: `src/lib/subscription.ts`

```typescript
export function isTrialExpired(page: BusinessPage): boolean
export function getDaysRemaining(page: BusinessPage): number
export function canCreateSku(page: BusinessPage): boolean
```

### 5. Admin API Updates

**File**: `src/pages/api/admin/listings/index.ts`

```typescript
// Add filter by entityType, planType, subscriptionStatus
const { entityType, planType, status } = searchParams;
if (entityType) query = query.where(eq(businessPages.entityType, entityType));
if (status) query = query.where(eq(businessPages.subscriptionStatus, status));
```

### 6. Public Plans API

**File**: `src/pages/api/plans/active.ts` (new)

```typescript
// GET /api/plans/active â€?for pricing page
// Returns only active plans with public fields
```

---

## Rationale

1. **Extend enum, don't replace**: Adding `'personal'` to entityType keeps business/nonprofit working unchanged
2. **Trial period via subscriptionExpiresAt**: When trial starts, set expires_at = now + 3 days
3. **Index on subscriptionStatus**: Critical for search performance
4. **Scheduled job for expiry**: Already exists at `/api/scheduled/_mark-expired` â€?extend it

---

## File Changes

| File | Change |
|------|--------|
| `src/db/schema/index.ts` | Add `subscriptionExpiresAt`, `trialStartedAt` columns |
| `src/db/schema/plans.ts` | Update `period` enum to include `trial_3d`, `weekly` |
| `migrations/0042_*.sql` | Drizzle migration |
| `src/lib/subscription.ts` | Utility functions |
| `src/pages/api/admin/listings/index.ts` | Filter support |
| `src/pages/api/plans/active.ts` | New public endpoint |
| `src/pages/api/scheduled/_mark-expired.ts` | Extend for trial expiry |

