---
id: US-004
feature: FS-081
title: "Tests (P1)"
status: completed
priority: P1
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-004: Tests (P1)

**Feature**: [FS-081](./FEATURE.md)

**As a** developer
**I want** 完整测试覆盖
**So that** 重构不破坏现有行为

---

## Acceptance Criteria

- [x] **AC-US4-01**: `errors.test.ts` 存在
- [x] **AC-US4-02**: errorCodes 测试
- [x] **AC-US4-03**: AppError 测试
- [x] **AC-US4-04**: all 455 tests pass (3 pre-existing flaky)

---

## Implementation

**Increment**: [0081-error-handler](../../../../../increments/0081-error-handler/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-005**: Write error tests (RED then GREEN)
- [x] **T-010**: Run all tests
