---
id: FS-039
title: "REST API to Server Actions Migration"
type: feature
status: completed
priority: P1
created: 2026-05-09T00:00:00.000Z
lastUpdated: 2026-05-13
tldr: "Refactor REST API endpoints to Astro 6 Server Actions."
complexity: high
stakeholder_relevant: true
---

# REST API to Server Actions Migration

## TL;DR

**What**: Refactor REST API endpoints to Astro 6 Server Actions.
**Status**: completed | **Priority**: P1
**User Stories**: 5

![REST API to Server Actions Migration illustration](assets/feature-fs-039.jpg)

## Overview

Refactor REST API endpoints to Astro 6 Server Actions. Create `src/actions/` directory structure. Migration scope: write endpoints (POST/PUT/PATCH/DELETE). Keep read-only endpoints as REST for caching. Current state: 70 action files created, 43 REST APIs still active.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0039-server-actions-migration](../../../../../increments/0039-server-actions-migration/spec.md) | ✅ completed | 2026-05-09T00:00:00.000Z |

## User Stories

- [US-001: Auth Actions Migration (P1)](./us-001-auth-actions-migration-p1.md)
- [US-002: Business Actions Migration (P1)](./us-002-business-actions-migration-p1.md)
- [US-003: Admin Actions Migration (P1)](./us-003-admin-actions-migration-p1.md)
- [US-004: Media/Products/Reviews/Banners Actions Migration (P2)](./us-004-media-products-reviews-banners-actions-migration-p2.md)
- [US-005: REST API Cleanup (P2)](./us-005-rest-api-cleanup-p2.md)
