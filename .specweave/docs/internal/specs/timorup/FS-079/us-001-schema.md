---
id: US-001
feature: FS-079
title: "创建共享 schema 模块"
status: completed
priority: P2
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-001: 创建共享 schema 模块

**Feature**: [FS-079](./FEATURE.md)

**As a** developer
**I want** 通用验证 schemas 集中管理
**So that** 修改时只需改一处

---

## Acceptance Criteria

- [x] **AC-US1-01**: `src/lib/schemas/common.ts` 包含通用 schemas
- [x] **AC-US1-02**: `emailSchema` 支持 `z.email()` 带统一错误消息
- [x] **AC-US1-03**: `requiredString(msg?)` 返回必填字符串验证
- [x] **AC-US1-04**: `optionalString()` 返回可选字符串验证
- [x] **AC-US1-05**: `phoneSchema` 支持国际电话号码格式

---

## Implementation

**Increment**: [0079-shared-schemas](../../../../../increments/0079-shared-schemas/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Create src/lib/schemas/common.ts
