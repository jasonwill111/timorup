---
id: US-002
feature: FS-083
title: "Event Types (P1)"
status: completed
priority: P2
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-002: Event Types (P1)

**Feature**: [FS-083](./FEATURE.md)

**As a** developer
**I want** 标准的事件类型
**So that** 数据一致性

---

## Acceptance Criteria

- [x] **AC-US2-01**: `EventType` 枚举定义
- [x] **AC-US2-02**: `PAGE_VIEW` — 页面浏览
- [x] **AC-US2-03**: `BUSINESS_VIEW` — 商家浏览
- [x] **AC-US2-04**: `SEARCH_QUERY` — 搜索查询
- [x] **AC-US2-05**: `USER_SIGNUP` — 用户注册
- [x] **AC-US2-06**: `LISTING_CREATED` — 列表创建

---

## Implementation

**Increment**: [0083-analytics-tracking](../../../../../increments/0083-analytics-tracking/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Create src/lib/analytics/types.ts
