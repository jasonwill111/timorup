---
id: US-006
feature: FS-007
title: "Subscriptions - New Table"
status: completed
priority: P1
created: 2026-04-18T00:00:00.000Z
tldr: "**As a** system."
project: TimorLink
---

# US-006: Subscriptions - New Table

**Feature**: [FS-007](./FEATURE.md)

**As a** system
**I want** subscriptions to track business payment status
**So that** expired businesses have limited visibility

---

## Acceptance Criteria

- [x] **AC-US6-01**: billingCycle 枚举�?`monthly | yearly`
- [x] **AC-US6-02**: status 枚举�?`unpaid | paid | expired`
- [x] **AC-US6-03**: expired/unpaid 时除 banner �?title 外内容不可见
- [x] **AC-US6-04**: 自动计算过期时间 (Implemented in API - endDate calculated from billingCycle)

---

## Implementation

**Increment**: [0007-db-schema-v2](../../../../../increments/0007-db-schema-v2/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
