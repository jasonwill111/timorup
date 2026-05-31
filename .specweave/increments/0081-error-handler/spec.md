---
increment: 0081-error-handler
title: "Error Handling Centralization"
type: refactor
priority: P1
status: in-progress
created: 2026-05-27
structure: user-stories
test_mode: TDD
coverage_target: 90
---

# Feature: Error Handling Centralization

## Overview

统一错误处理，创建 ErrorHandler 模块和错误码系统，消除重复的 `getErrorMessage` 函数和不一致的错误码。

## Context

当前问题：
- 每个 action 文件重复定义 `getErrorMessage` 函数（约 10+ 处）
- 错误码不一致：`ERROR`、`CREATE_ERROR`、`UPDATE_ERROR` 等
- 没有统一的错误分类系统
- 前端无法可靠地识别错误类型

目标：
- 提供统一的 `AppError` 类和错误码枚举
- 集中 `getErrorMessage` 到 `src/lib/errors/`
- Actions 使用统一的错误响应格式

## User Stories

### US-001: Error Handler Module (P1)
**Project**: TimorUp

**As a** developer
**I want** 统一的错误处理模块
**So that** 错误处理一致性

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/lib/errors/AppError.ts` — AppError 类实现
- [x] **AC-US1-02**: `src/lib/errors/errorCodes.ts` — 错误码枚举
- [x] **AC-US1-03**: `getErrorMessage(error)` — 统一的错误消息提取
- [x] **AC-US1-04**: `createErrorResponse(code, message)` — 统一的错误响应创建

---

### US-002: Error Codes Standardization (P1)
**Project**: TimorUp

**As a** developer
**I want** 标准化的错误码
**So that** 前端可识别和处理

**Acceptance Criteria**:
- [x] **AC-US2-01**: `AUTH_*` — 认证相关错误码
- [x] **AC-US2-02**: `BUSINESS_*` — 业务相关错误码
- [x] **AC-US2-03**: `PRODUCT_*` — 产品相关错误码
- [x] **AC-US2-04**: `VALIDATION_*` — 验证相关错误码
- [x] **AC-US2-05**: `SERVER_*` — 服务器相关错误码

---

### US-003: Actions Integration (P1)
**Project**: TimorUp

**As a** developer
**I want** actions 使用统一错误处理
**So that** 代码重复减少

**Acceptance Criteria**:
- [x] **AC-US3-01**: `signIn.ts` 使用统一错误处理
- [x] **AC-US3-02**: `signUp.ts` 使用统一错误处理
- [x] **AC-US3-03**: `business/create.ts` 使用统一错误处理
- [x] **AC-US3-04**: `products/create.ts` 使用统一错误处理

---

### US-004: Tests (P1)
**Project**: TimorUp

**As a** developer
**I want** 完整测试覆盖
**So that** 重构不破坏现有行为

**Acceptance Criteria**:
- [x] **AC-US4-01**: `errors.test.ts` 存在
- [x] **AC-US4-02**: errorCodes 测试
- [x] **AC-US4-03**: AppError 测试
- [x] **AC-US4-04**: all 455 tests pass (3 pre-existing flaky)

## Architecture

### 文件结构

```
src/lib/errors/
├── AppError.ts           # AppError 类
├── errorCodes.ts         # 错误码枚举
├── errorUtils.ts        # getErrorMessage, createErrorResponse
└── index.ts             # 统一导出
```

### ErrorCodes 枚举

```typescript
export enum ErrorCode {
  // Auth
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_RATE_LIMITED = 'AUTH_RATE_LIMITED',
  AUTH_USER_EXISTS = 'AUTH_USER_EXISTS',

  // Business
  BUSINESS_NOT_FOUND = 'BUSINESS_NOT_FOUND',
  BUSINESS_LIMIT_REACHED = 'BUSINESS_LIMIT_REACHED',
  BUSINESS_FORBIDDEN = 'BUSINESS_FORBIDDEN',

  // Product
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_SKU_NOT_ALLOWED = 'PRODUCT_SKU_NOT_ALLOWED',

  // Validation
  VALIDATION_INVALID_INPUT = 'VALIDATION_INVALID_INPUT',
  VALIDATION_JSON_ERROR = 'VALIDATION_JSON_ERROR',

  // Server
  SERVER_ERROR = 'SERVER_ERROR',
  SERVER_DB_ERROR = 'SERVER_DB_ERROR',
}
```

### AppError 类

```typescript
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### Error Response 格式

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

function createErrorResponse(code: ErrorCode, message: string): ErrorResponse {
  return {
    success: false,
    error: { code, message }
  };
}
```

## Dependencies

- `src/lib/utils.ts` — 现有 getErrorMessage
- `src/actions/auth/` — 需要更新
- `src/actions/business/` — 需要更新
- `src/actions/products/` — 需要更新

## Success Criteria

| Metric | Target |
|--------|--------|
| Duplicate getErrorMessage | 0 |
| Error codes | 20+ standardized codes |
| Code duplication | Reduced in actions |
| Tests | 440+ passing |
| Build | Success |
| Coverage | 90%+ on error handling |