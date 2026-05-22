---
id: FS-070
title: "Feature: Migrate REST APIs to Server Actions"
type: feature
status: completed
priority: P1
created: 2026-05-20
lastUpdated: 2026-05-20
tldr: "Migrate all mutable REST API endpoints (auth, admin CRUD) to Server Actions, keep public reads as REST for SSR caching."
complexity: high
stakeholder_relevant: true
---

# Feature: Migrate REST APIs to Server Actions

## TL;DR

**What**: Migrate all mutable REST API endpoints (auth, admin CRUD) to Server Actions, keep public reads as REST for SSR caching.
**Status**: completed | **Priority**: P1
**User Stories**: 4

![Feature: Migrate REST APIs to Server Actions illustration](assets\feature-fs-070.jpg)

## Overview

Migrate all mutable REST API endpoints (auth, admin CRUD) to Server Actions, keep public reads as REST for SSR caching.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0070-migrate-to-server-actions](../../../../../increments/0070-migrate-to-server-actions/spec.md) | ✅ completed | 2026-05-20 |

## User Stories

- [US-001: Auth Endpoints Migration (P1)](./us-001-auth-endpoints-migration-p1.md)
- [US-002: Admin CRUD Pages Migration (P1)](./us-002-admin-crud-pages-migration-p1.md)
- [US-003: Business Owner Pages Migration (P2)](./us-003-business-owner-pages-migration-p2.md)
- [US-004: REST API Cleanup (P2)](./us-004-rest-api-cleanup-p2.md)
