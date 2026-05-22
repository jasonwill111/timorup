---
id: FS-068
title: "Admin UI Fix"
type: feature
status: ready_for_review
priority: P1
created: 2026-05-19
lastUpdated: 2026-05-20
tldr: "Fix Admin UI issues discovered during schema audit:."
complexity: high
stakeholder_relevant: true
---

# Admin UI Fix

## TL;DR

**What**: Fix Admin UI issues discovered during schema audit:.
**Status**: ready_for_review | **Priority**: P1
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
| [0068-admin-ui-fix](../../../../../increments/0068-admin-ui-fix/spec.md) | ⏳ ready_for_review | 2026-05-19 |

## User Stories

- [US-001: Add formFields to Categories Management (P1)](./us-001-add-formfields-to-categories-management-p1.md)
- [US-002: Clean Up Deprecated Fields in Products (P2)](./us-002-clean-up-deprecated-fields-in-products-p2.md)
- [US-003: Deploy and Test Renamed Routes (P1)](./us-003-deploy-and-test-renamed-routes-p1.md)
- [US-004: Update All References to Old Routes (P2)](./us-004-update-all-references-to-old-routes-p2.md)
