---
increment: 0065-astro-pages-repository-extraction
title: "Astro Pages Repository Extraction"
type: refactor
priority: P2
status: active
created: 2026-05-18
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Astro Pages Repository Extraction

## Overview

Replace `any[]` arrays in 6 listing pages with typed interfaces and repository functions.

## User Stories

### US-001: Typed Listing Interfaces
**Project**: timorlist

**As a** developer
**I want** typed interfaces for all entity listings
**So that** I can catch bugs at compile time

**Acceptance Criteria**:
- [x] **AC-US1-01**: Define `BusinessListing`, `NonProfitListing`, `PublicSectorListing`, `ListingItem` interfaces
- [x] **AC-US1-02**: Remove all `any[]` from 6 affected pages
- [x] **AC-US1-03**: TypeScript compiles with no `any` type errors in affected files

---

### US-002: Consistent Data Fetching
**Project**: timorlist

**As a** developer
**I want** consistent data fetching patterns
**So that** pages are easier to maintain

**Acceptance Criteria**:
- [x] **AC-US2-01**: Extract query logic into reusable functions
- [x] **AC-US2-02**: Shared pagination interface across entities

## Files to Fix

| File | any[] count |
|------|-------------|
| `businesses/index.astro` | 2 |
| `non-profits/index.astro` | 2 |
| `public-sectors/index.astro` | 2 |
| `listings/index.astro` | 2 |
| `products-services/index.astro` | 2 |
| `business/[slug].astro` | 2 |

## Success Criteria

1. All `any[]` replaced with proper types
2. TypeScript compiles with strict mode
3. No runtime changes (data fetching works same)

## Out of Scope

- Creating full repository classes (overkill for this scope)
- Refactoring API endpoints
- Adding new features