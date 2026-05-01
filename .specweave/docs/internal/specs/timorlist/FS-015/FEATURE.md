---
id: FS-015
title: "Remove Hono - Pure Astro API"
type: feature
status: planned
priority: P1
created: 2026-04-23
lastUpdated: 2026-05-01
tldr: "Remove all Hono server code and migrate all API routes to Astro API endpoints."
complexity: high
stakeholder_relevant: true
---

# Remove Hono - Pure Astro API

## TL;DR

**What**: Remove all Hono server code and migrate all API routes to Astro API endpoints.
**Status**: planned | **Priority**: P1
**User Stories**: 5

![Remove Hono - Pure Astro API illustration](assets/feature-fs-015.jpg)

## Overview

Remove all Hono server code and migrate all API routes to Astro API endpoints. This simplifies the architecture by using only Astro 6's built-in API capabilities.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0015-hono-removal](../../../../../increments/0015-hono-removal/spec.md) | ⏳ planned | 2026-04-23 |

## User Stories

- [US-001: Remove Hono Server](./us-001-remove-hono-server.md)
- [US-002: Migrate Auth API Routes](./us-002-migrate-auth-api-routes.md)
- [US-003: Migrate Business API Routes](./us-003-migrate-business-api-routes.md)
- [US-004: Migrate Admin API Routes](./us-004-migrate-admin-api-routes.md)
- [US-005: Migrate Remaining API Routes](./us-005-migrate-remaining-api-routes.md)
