---
id: FS-001
title: "一人一店限制 (BS-013)"
type: feature
status: completed
priority: P1
created: 2026-03-22
lastUpdated: 2026-04-23
tldr: "Enforce that each authenticated user can create at most one business page."
complexity: high
stakeholder_relevant: true
---

# 一人一店限制 (BS-013)

## TL;DR

**What**: Enforce that each authenticated user can create at most one business page.
**Status**: completed | **Priority**: P1
**User Stories**: 4

![一人一店限制 (BS-013) illustration](assets/feature-fs-001.jpg)

## Overview

Enforce that each authenticated user can create at most one business page. The backend already has a partial check in the Hono route (`src/server/routes/businesses.ts`), but the Astro API route (`src/pages/api/businesses/create.ts`) lacks it entirely, and the frontend (`src/pages/business/create.astro`) does not pre-validate or provide a friendly UX for users who already have a business.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0001-one-business-per-user](../../../../../increments/0001-one-business-per-user/spec.md) | ✅ completed | 2026-03-22 |

## User Stories

- [US-001: Prevent duplicate business creation via API](./us-001-prevent-duplicate-business-creation-via-api.md)
- [US-002: Proactive frontend guard on create page](./us-002-proactive-frontend-guard-on-create-page.md)
- [US-003: Expose a user-business status API endpoint](./us-003-expose-a-user-business-status-api-endpoint.md)
- [US-004: Unit tests for one-business-per-user logic](./us-004-unit-tests-for-one-business-per-user-logic.md)
