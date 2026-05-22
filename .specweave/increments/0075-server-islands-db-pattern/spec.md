---
name: server-islands-db-pattern
description: "Unify Server Islands DB pattern across projects: use getDb() instead of initDb() pattern, document best practices"
increment: "0075"
status: "in_progress"
created: "2026-05-22"
updated: "2026-05-22"
---

# 0075: Server Islands DB Pattern Unification

**Date**: 2026-05-22
**Status**: Open
**Priority**: Medium
**Type**: Technical Debt / Best Practice

## Problem Statement

Two projects (timorbuy and timorup) have different implementations for Server Islands DB access:

| Project | Pattern | Works? |
|---------|---------|--------|
| timorup | `const db = await getDb()` | ✅ |
| timorbuy | `initDb(env.DB)` then `getDbInstance()` | ❌ (isolated context) |

**Root Cause**: Server Islands run in **isolated V8 contexts**. Global variables (`let _db = null`) are not shared between main request and Island rendering.

## Lessons Learned

### Wrong Pattern (timorbuy had this)
```astro
// ❌ Server Island with initDb - DOESN'T WORK reliably
const { env } = await import('cloudflare:workers');
const { initDb } = await import('../db/index');

if (env.DB) {
  initDb(env.DB);  // Sets global _db, but not visible in isolated context
}

const db = getDbInstance();  // May return null!
```

### Correct Pattern (timorup uses this)
```astro
// ✅ Server Island with getDb - WORKS
const { env } = await import('cloudflare:workers');
const { getDb } = await import('../lib/db');

const db = await getDb();  // Directly accesses env.DB, no global cache dependency
```

### Why getDb() Works

1. `getDb()` always checks `cloudflare:workers env.DB` first
2. Only falls back to cached `_db` if env.DB unavailable
3. Doesn't rely on middleware setting global state
4. Each Island request gets fresh DB connection

## Tasks

- [ ] **T-001**: Review all Server Islands in timorup for consistency
- [ ] **T-002**: Create shared documentation for Server Islands pattern
- [ ] **T-003**: Add lint/validate script to catch wrong patterns

## User Stories

### US-001: Developer uses correct Server Island pattern
**As a** developer working on timorup
**I want** clear documentation on Server Islands DB access
**So that** I don't repeat the timorbuy mistake

### US-002: Code is validated for correct pattern
**As a** maintainer
**I want** automated checks for Server Island patterns
**So that** wrong patterns are caught early

## Acceptance Criteria

- [ ] **AC-001**: All Server Islands use `await getDb()` pattern
- [ ] **AC-002**: No Server Island calls `initDb()` directly
- [ ] **AC-003**: Documentation added to CLAUDE.md or project docs

## Related

- timorbuy PR: cb01d87 (fix: use getDb() instead of initDb())
- ADR-0052: Hybrid Rendering Strategy (timorbuy)
- Astro Server Islands docs