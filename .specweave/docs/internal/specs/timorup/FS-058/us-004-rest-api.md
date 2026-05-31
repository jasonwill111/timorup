---
id: US-004
feature: FS-058
title: "删除冗余 REST API 端点"
status: completed
priority: P0
created: 2026-05-15T00:00:00.000Z
tldr: "**As a** security team."
project: TimorLink
---

# US-004: 删除冗余 REST API 端点

**Feature**: [FS-058](./FEATURE.md)

**As a** security team
**I want** 减少攻击面（删除已被 Server Actions 替代的端点）
**So that** 维护复杂度降�?

---

## Acceptance Criteria

- [x] **AC-US4-01**: 删除 `src/pages/api/banners/[id].ts` �?`index.ts`
- [x] **AC-US4-02**: 删除 `src/pages/api/businesses/[slug].ts`（PUT 部分�?- [x] **AC-US4-03**: 删除 `src/pages/api/media/[id].ts` �?`index.ts`
- [x] **AC-US4-04**: 删除 `src/pages/api/products/[id].ts` �?`index.ts`
- [x] **AC-US4-05**: 删除 `src/pages/api/reviews/[id]/reply.ts` �?`index.ts`

---

## Implementation

**Increment**: [0058-code-quality-cleanup-p0](../../../../../increments/0058-code-quality-cleanup-p0/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
