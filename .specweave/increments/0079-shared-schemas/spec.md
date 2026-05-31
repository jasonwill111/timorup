---
increment: 0079-shared-schemas
title: "Shared Zod Schemas"
type: refactor
priority: P2
status: completed
completed_at: 2026-05-27T09:00:00Z
created: 2026-05-27
structure: user-stories
---

# SPEC.md - 0079-shared-schemas

## Project
**timorup** — 东帝汶商业目录平台

## Overview
提取通用 Zod schemas 到共享模块，消除 action 间的重复定义，便于维护和修改。

## User Stories

### US-001: 创建共享 schema 模块
**As a** developer
**I want** 通用验证 schemas 集中管理
**So that** 修改时只需改一处

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/lib/schemas/common.ts` 包含通用 schemas
- [x] **AC-US1-02**: `emailSchema` 支持 `z.email()` 带统一错误消息
- [x] **AC-US1-03**: `requiredString(msg?)` 返回必填字符串验证
- [x] **AC-US1-04**: `optionalString()` 返回可选字符串验证
- [x] **AC-US1-05**: `phoneSchema` 支持国际电话号码格式

---

### US-002: 更新 actions 使用共享 schemas
**As a** developer
**I want** actions 引用共享 schemas
**So that** 减少代码重复

**Acceptance Criteria**:
- [x] **AC-US2-01**: `signIn.ts` 使用 `emailSchema` 和 `requiredString()`
- [x] **AC-US2-02**: `signUp.ts` 使用 `emailSchema` 和 `requiredString()`
- [x] **AC-US2-03**: `business/create.ts` 使用共享 schemas

---

### US-003: 验证测试
**As a** developer
**I want** 共享 schemas 有测试覆盖
**So that** 确保验证逻辑正确

**Acceptance Criteria**:
- [x] **AC-US3-01**: `schemas/common.test.ts` 存在
- [x] **AC-US3-02**: email validation 测试
- [x] **AC-US3-03**: phone validation 测试
- [x] **AC-US3-04**: all 413 tests pass

## Dependencies

- `src/lib/schemas/` — 新目录
- `src/actions/auth/` — 需要更新
- `src/actions/business/` — 需要更新

## Success Criteria

| Metric | Target |
|--------|--------|
| Shared schemas | 5+ reusable definitions |
| Code duplication | Reduced in actions |
| Tests | 399+ passing |
| Build | Success |