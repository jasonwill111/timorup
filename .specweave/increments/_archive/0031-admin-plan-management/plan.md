# Implementation Plan: Admin Plan Management

## Overview

Centralized plan management replacing hardcoded constants with DB-backed plans table.

## Architecture

### Components
- `plans` table: DB-backed plan definitions
- `/api/plans`: Public API for frontend
- `/api/admin/plans`: Admin CRUD endpoints
- `/admin/plans`: Admin UI page

### Data Model

```typescript
// plans table
export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(), // 'basic-monthly', 'pro-yearly'
  name: text('name').notNull(), // 'Basic', 'Pro', 'Max'
  period: text('period').notNull(), // 'monthly' | 'yearly'
  amount: integer('amount').notNull(), // cents USD
  skuLimit: integer('sku_limit').notNull().default(10),
  maxImages: integer('max_images').notNull().default(5),
  maxVideos: integer('max_videos').notNull().default(1),
  features: text('features'), // JSON array
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at'),
  updatedAt: integer('updated_at'),
});
```

### API Contracts

```
GET  /api/plans              → { plans: [...] }
GET  /api/admin/plans        → { plans: [...] } (all including inactive)
PUT  /api/admin/plans/[id]   → { plan: {...} }
```

## Design

### Key Decisions

1. **Plan ID as composite key**: `{tier}-{period}` (e.g., 'basic-monthly')
2. **Existing subs unchanged**: `orders.planType` stores plan ID, limits queried at runtime
3. **New subs use latest**: Always query current plan from DB

## Rationale

- DB-backed plans eliminate code drift
- Soft delete preserves audit trail
- Single source of truth for pricing/limits
