# Implementation Plan: Subscription Workflow

## Overview

Implement complete subscription lifecycle: one listing per user, non-profit free/immediate activation, business requires plan payment + admin confirmation, SKU limits enforced by plan, grace period handling, 60-day auto-delete.

## Architecture

### Components
| Component | File | Purpose |
|-----------|------|---------|
| Subscription helper | `src/lib/subscription.ts` | Check subscription status, SKU limits, grace period |
| Grace period modal | `src/components/islands/GracePeriodModal.astro` | Show renewal prompt |
| Cleanup job | `src/pages/api/scheduled/_cleanup-expired.ts` | Delete expired listings |

### Data Model Changes

**business_pages table** - add fields:
```typescript
subscriptionStatus: 'none' | 'active' | 'expired' | 'cancelled'
gracePeriodEndDate: timestamp | null  // expiry + 60 days
```

**Existing orders table** - already has:
- `planType`, `expiryDate`, `status`
- Need to ensure `expiryDate` is set correctly on payment

### API Contracts

```
GET  /api/business/:slug/subscription     → { status, skuLimit, skuCount, gracePeriodEnd, isInGracePeriod }
POST /api/business/:slug/subscription     → Create order (payment pending)
POST /api/admin/subscriptions/:id/confirm  → Admin confirms payment → activates listing
POST /api/admin/subscriptions/:id/reject   → Admin rejects payment → listing stays pending
GET  /api/skus?businessId=X              → List SKUs (checks subscription)
POST /api/skus                           → Create SKU (checks subscription status + limit)
```

## Design

### Subscription Status Flow
```
User creates listing
    ↓
non-profit → status: published (immediate)
business → status: pending_payment
    ↓
User selects plan → creates order
    ↓
Payment processed externally
    ↓
Admin confirms → status: published
    ↓
Subscription active
    ↓
expiry_date passes
    ↓
status: expired, gracePeriodEndDate: expiry + 60 days
    ↓
Grace period (60 days)
    ↓
Renewal? → status: active, gracePeriodEndDate: null
    ↓
No renewal → DELETE listing + SKUs
```

### SKU Limit Enforcement
| Plan | Limit |
|------|-------|
| Basic | 10 |
| Pro | 30 |
| Max | 60 |

Query: `SELECT COUNT(*) FROM skus WHERE businessId = ?` → compare to plan limit

### Grace Period Modal Content
```
请及时为Business Page续费,否则60天之后会删除。谢谢配合!

[Days remaining: X]
[Renew Now Button] → /subscribe
```

## Rationale

- **Grace period stored on listing**: Avoids recalculating from orders table
- **Soft delete via status**: Deletion only happens after grace period expires
- **Admin confirmation required**: Prevents abuse of free trials
- **SKU limit check on write**: Prevents quota exceeded errors on read

## Implementation Phases

### Phase 1: Schema & Helpers
- Add subscription fields to business_pages
- Create `subscription.ts` helper functions
- Add SKU limit constants

### Phase 2: Business Listing Flow
- Update listing creation to check existing listing
- Set correct initial status (pending_payment for business)
- Block edit during grace period

### Phase 3: SKU Enforcement
- Add subscription check to SKU create/update API
- Enforce SKU count limit per plan
- Hide/disable SKU interface during grace

### Phase 4: Admin Confirmation
- Update admin subscriptions page with confirm/reject actions
- Update listing status on confirmation

### Phase 5: Grace Period & Cleanup
- Add grace period modal component
- Create scheduled cleanup job
- Handle renewal restoration

## Testing Strategy

- Unit tests for subscription helper
- Integration tests for status transitions
- E2E: Create business → payment → confirm → create SKUs → expiry → grace → delete

