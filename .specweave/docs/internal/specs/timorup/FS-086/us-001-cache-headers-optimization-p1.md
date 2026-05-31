---
id: US-001
feature: FS-086
title: "Cache Headers Optimization (P1)"
status: completed
priority: P1
created: 2026-05-29
tldr: "**As a** visitor."
project: timorup
---

# US-001: Cache Headers Optimization (P1)

**Feature**: [FS-086](./FEATURE.md)

**As a** visitor
**I want** fast page loads
**So that** I don't abandon slow pages

---

## Acceptance Criteria

- [x] **AC-US1-01**: 首页设置 `Cache-Control: public, max-age=60, s-maxage=120, stale-while-revalidate=300` ✅
- [x] **AC-US1-02**: 详情页设置 `Cache-Control: public, max-age=120, s-maxage=600, stale-while-revalidate=600` ✅
- [x] **AC-US1-03**: 分类列表设置 `Cache-Control: public, max-age=30, s-maxage=60, stale-while-revalidate=120` ✅
- [x] **AC-US1-04**: 静态资源(hashed)设置 `Cache-Control: public, max-age=31536000, immutable` ✅ (Astro 默认)

---

## Implementation

**Increment**: [0086-free-plan-scaling](../../../../../increments/0086-free-plan-scaling/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
