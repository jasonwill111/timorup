---
id: US-002
feature: FS-081
title: "Error Codes Standardization (P1)"
status: completed
priority: P1
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-002: Error Codes Standardization (P1)

**Feature**: [FS-081](./FEATURE.md)

**As a** developer
**I want** 标准化的错误码
**So that** 前端可识别和处理

---

## Acceptance Criteria

- [x] **AC-US2-01**: `AUTH_*` — 认证相关错误码
- [x] **AC-US2-02**: `BUSINESS_*` — 业务相关错误码
- [x] **AC-US2-03**: `PRODUCT_*` — 产品相关错误码
- [x] **AC-US2-04**: `VALIDATION_*` — 验证相关错误码
- [x] **AC-US2-05**: `SERVER_*` — 服务器相关错误码

---

## Implementation

**Increment**: [0081-error-handler](../../../../../increments/0081-error-handler/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Create errorCodes.ts
