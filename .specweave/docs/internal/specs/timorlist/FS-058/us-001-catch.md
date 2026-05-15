---
id: US-001
feature: FS-058
title: "修复空 catch 块导致的静默错误"
status: completed
priority: P0
created: 2026-05-15T00:00:00.000Z
tldr: "**As a** developer."
project: timorlist
---

# US-001: 修复空 catch 块导致的静默错误

**Feature**: [FS-058](./FEATURE.md)

**As a** developer
**I want** 所有 catch 块记录错误日志
**So that** 生产问题能被追踪和调试

---

## Acceptance Criteria

- [x] **AC-US1-01**: `src/actions/business/create.ts` — 3 处空 catch 块添加 console.error
- [x] **AC-US1-02**: `src/actions/products/create.ts` — 空 catch 块添加 console.error
- [x] **AC-US1-03**: `src/actions/products/update.ts` — 空 catch 块添加 console.error
- [x] **AC-US1-04**: `src/lib/auth-kv-store.ts` — 2 处空 catch 块添加 console.warn
- [x] **AC-US1-05**: `src/lib/subscription.ts` — 空 catch 块添加 console.warn

---

## Implementation

**Increment**: [0058-code-quality-cleanup-p0](../../../../../increments/0058-code-quality-cleanup-p0/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
