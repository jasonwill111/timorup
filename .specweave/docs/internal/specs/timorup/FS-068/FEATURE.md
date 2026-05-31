---
id: FS-068
title: "Admin UI Fix"
type: feature
status: completed
priority: P1
created: 2026-05-19T00:00:00.000Z
lastUpdated: 2026-05-27
tldr: "Fix Admin UI issues discovered during schema audit:."
complexity: high
stakeholder_relevant: true
---

# Admin UI Fix

## TL;DR

**What**: Fix Admin UI issues discovered during schema audit:.
**Status**: completed | **Priority**: P1
**User Stories**: 4

![Admin UI Fix illustration](assets\feature-fs-068.jpg)

## Overview

Fix Admin UI issues discovered during schema audit:
1. Add formFields support to categories.astro for listing_categories and product_categories
2. Clean up deprecated fields in products.astro (businessPageId, serviceType)
3. Deploy renamed routes (orders, products, ad-banners)

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0068-admin-ui-fix](../../../../../increments/0068-admin-ui-fix/spec.md) | ✅ completed | 2026-05-19T00:00:00.000Z |

## User Stories

- [US-001: Add formFields to Categories Management (P1)](./us-001-add-formfields-to-categories-management-p1.md)
- [US-002: Clean Up Deprecated Fields in Products (P2)](./us-002-clean-up-deprecated-fields-in-products-p2.md)
- [US-003: Deploy and Test Renamed Routes (P1)](./us-003-deploy-and-test-renamed-routes-p1.md)
- [US-004: Update All References to Old Routes (P2)](./us-004-update-all-references-to-old-routes-p2.md)
