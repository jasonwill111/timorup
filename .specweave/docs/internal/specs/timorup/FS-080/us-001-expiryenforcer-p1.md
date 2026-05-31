---
id: US-001
feature: FS-080
title: "ExpiryEnforcer 接口 (P1)"
status: completed
priority: P1
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-001: ExpiryEnforcer 接口 (P1)

**Feature**: [FS-080](./FEATURE.md)

**As a** developer
**I want** 统一的过期判断接口
**So that** 所有过期检查使用一致逻辑

---

## Acceptance Criteria

- [x] **AC-US1-01**: `ExpiryEnforcer` class 存在，封装过期状态计算
- [x] **AC-US1-02**: `isInGracePeriod(subscription): boolean` 方法
- [x] **AC-US1-03**: `isPastGracePeriod(subscription): boolean` 方法
- [x] **AC-US1-04**: `GRACE_PERIOD_DAYS = 60` 常量导出

---

## Implementation

**Increment**: [0080-expiry-enforcer](../../../../../increments/0080-expiry-enforcer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Create src/lib/expiry/types.ts
- [x] **T-002**: Create src/lib/expiry/ExpiryEnforcer.ts
- [x] **T-005**: Implement ExpiryEnforcer (GREEN)
