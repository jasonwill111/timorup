---
id: FS-062
title: "Category API Typed Mapping"
type: feature
status: completed
priority: P1
created: 2026-05-18
lastUpdated: 2026-05-27
tldr: "Fix stringly-typed TABLE_MAP in admin categories API with inconsistent entity type naming."
complexity: medium
stakeholder_relevant: true
---

# Category API Typed Mapping

## TL;DR

**What**: Fix stringly-typed TABLE_MAP in admin categories API with inconsistent entity type naming.
**Status**: completed | **Priority**: P1
**User Stories**: 2

![Category API Typed Mapping illustration](assets\feature-fs-062.jpg)

## Overview

Fix stringly-typed TABLE_MAP in admin categories API with inconsistent entity type naming. The TABLE_MAP uses `non_profit` (with underscore) while other parts of the codebase use `nonprofit` (no underscore). This inconsistency causes potential bugs and reduces type safety.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0062-category-api-typed-mapping](../../../../../increments/0062-category-api-typed-mapping/spec.md) | ✅ completed | 2026-05-18 |

## User Stories

- [US-001: Type-Safe Category Table Registry](./us-001-type-safe-category-table-registry.md)
- [US-002: Consistent Entity Type Validation](./us-002-consistent-entity-type-validation.md)
