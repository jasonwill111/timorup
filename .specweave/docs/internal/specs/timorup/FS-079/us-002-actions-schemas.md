---
id: US-002
feature: FS-079
title: "更新 actions 使用共享 schemas"
status: completed
priority: P2
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-002: 更新 actions 使用共享 schemas

**Feature**: [FS-079](./FEATURE.md)

**As a** developer
**I want** actions 引用共享 schemas
**So that** 减少代码重复

---

## Acceptance Criteria

- [x] **AC-US2-01**: `signIn.ts` 使用 `emailSchema` 和 `requiredString()`
- [x] **AC-US2-02**: `signUp.ts` 使用 `emailSchema` 和 `requiredString()`
- [x] **AC-US2-03**: `business/create.ts` 使用共享 schemas

---

## Implementation

**Increment**: [0079-shared-schemas](../../../../../increments/0079-shared-schemas/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-003**: Update signIn.ts
- [x] **T-004**: Update signUp.ts
- [x] **T-005**: Update business/create.ts
