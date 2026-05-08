---
increment: 0034-server-actions
title: "Astro Server Actions Migration"
type: feature
priority: P1
status: active
created: 2026-05-07
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Astro Server Actions Migration

## Overview

Migrate admin forms from fetch API to Astro 6 Server Actions for type-safe, progressive enhancement.

## User Stories

### US-001: Plans Server Actions
**Project**: timorlist

**As a** admin
**I want** to use server actions for plan management
**So that** forms work without JavaScript and are type-safe

**Acceptance Criteria**:
- [ ] **AC-US1-01**: `src/actions/admin/plans.ts` with getPlans, updatePlan actions
- [ ] **AC-US1-02**: `/admin/plans` uses actions.submit() instead of fetch

### US-002: Listings Server Actions
**Project**: timorlist

**As a** admin
**I want** to use server actions for listing management
**So that** forms are more reliable

**Acceptance Criteria**:
- [ ] **AC-US2-01**: `src/actions/admin/listings.ts` with create, update, delete actions

### US-003: Categories Server Actions
**Project**: timorlist

**As a** admin
**I want** to use server actions for category management
**So that** forms work without JavaScript

**Acceptance Criteria**:
- [ ] **AC-US3-01**: `src/actions/admin/categories.ts` with CRUD actions

## Astro Server Actions Pattern

```typescript
// src/actions/admin/plans.ts
import { defineAction, z } from 'astro:actions';
import { getDb } from '@/lib/db';
import { plans } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const plans = {
  getAll: defineAction({
    handler: async () => {
      const db = await getDb();
      return db.select().from(plans).all();
    }
  }),
  update: defineAction({
    input: z.object({ id: z.string(), name: z.string()... }),
    handler: async ({ id, name, ... }) => {
      const db = await getDb();
      // update logic
      return { success: true };
    }
  }),
};
```

## Files to Create

| File | Actions |
|------|---------|
| src/actions/admin/plans.ts | getPlans, updatePlan |
| src/actions/admin/listings.ts | createListing, updateListing, deleteListing |
| src/actions/admin/categories.ts | getCategories, createCategory, updateCategory |

## Files to Update

| File | Changes |
|------|---------|
| src/pages/admin/plans.astro | Use actions.submit() |
| src/pages/admin/listings.astro | Use actions.submit() |
| src/pages/admin/categories.astro | Use actions.submit() |

## Out of Scope

- Deleting API routes (keep for backward compatibility)
- Migrating public API routes
- View Transitions integration

## Dependencies

- Astro 6.2.1 (server actions built-in)
- Drizzle 0.45.x
- Zod 4.4.1
