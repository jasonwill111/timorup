---
id: FS-039
title: "REST API to Server Actions Migration"
type: feature
status: completed
priority: P1
created: 2026-05-09
lastUpdated: 2026-05-10
tldr: "Refactor all suitable REST API endpoints to Astro 6 Server Actions."
complexity: high
stakeholder_relevant: true
---

# REST API to Server Actions Migration

## TL;DR

**What**: Refactor all suitable REST API endpoints to Astro 6 Server Actions.
**Status**: completed | **Priority**: P1
**User Stories**: 4

![REST API to Server Actions Migration illustration](assets/feature-fs-039.jpg)

## Overview

Refactor all suitable REST API endpoints to Astro 6 Server Actions. Create src/actions/ directory structure. Migration scope: 42 POST/PUT/PATCH/DELETE APIs. Keep external integrations (webhooks, third-party). Test each domain after migration.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0039-server-actions-migration](../../../../../increments/0039-server-actions-migration/spec.md) | ✅ completed | 2026-05-09 |

## User Stories

- [US-001: Auth Actions Migration (P1)](./us-001-auth-actions-migration-p1.md)
- [US-002: Business Actions Migration (P1)](./us-002-business-actions-migration-p1.md)
- [US-003: Admin Actions Migration (P1)](./us-003-admin-actions-migration-p1.md)
- [US-004: Media/Products/Reviews/Banners Actions Migration (P2)](./us-004-media-products-reviews-banners-actions-migration-p2.md)
