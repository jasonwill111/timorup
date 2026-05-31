---
increment: 0080-expiry-enforcer
title: "ExpiryEnforcer Module"
type: refactor
priority: P1
status: in-progress
created: 2026-05-27
structure: user-stories
test_mode: TDD
coverage_target: 90
---

# Feature: ExpiryEnforcer Module

## Overview

提取订阅过期逻辑到 `ExpiryEnforcer` 模块，消除 inline 逻辑，使过期判断可测试、可复用。核心价值： derrière 统一接口，多处调用统一行为。

## Context

当前 `subscription.ts` 中过期逻辑分散：
- `isInGracePeriod()` — 判断是否在宽限期
- `isPastGracePeriod()` — 判断是否超过宽限期
- `canCreateSku()` — SKU 创建权限检查
- `canEditBusiness()` — 业务编辑权限检查

问题：逻辑与 DB 查询耦合，难以单元测试；跨 actions 调用时行为不一致风险。

## User Stories

### US-001: ExpiryEnforcer 接口 (P1)
**Project**: TimorUp

**As a** developer
**I want** 统一的过期判断接口
**So that** 所有过期检查使用一致逻辑

**Acceptance Criteria**:
- [x] **AC-US1-01**: `ExpiryEnforcer` class 存在，封装过期状态计算
- [x] **AC-US1-02**: `isInGracePeriod(subscription): boolean` 方法
- [x] **AC-US1-03**: `isPastGracePeriod(subscription): boolean` 方法
- [x] **AC-US1-04**: `GRACE_PERIOD_DAYS = 60` 常量导出

---

### US-002: 权限判断 (P1)
**Project**: TimorUp

**As a** developer
**I want** 权限判断方法
**So that** 业务规则集中管理

**Acceptance Criteria**:
- [x] **AC-US2-01**: `canCreateSku(subscription, skuCount, skuLimit): PermissionResult` 方法
- [x] **AC-US2-02**: `canEditBusiness(subscription): PermissionResult` 方法
- [x] **AC-US2-03**: 返回 `{ can: boolean; reason?: string }` 格式

---

### US-003: 与现有代码集成 (P1)
**Project**: TimorUp

**As a** developer
**I want** 现有 actions 使用新模块
**So that** 减少代码重复

**Acceptance Criteria**:
- [x] **AC-US3-01**: `business/create.ts` 使用 ExpiryEnforcer
- [x] **AC-US3-02**: `products/create.ts` 使用 ExpiryEnforcer
- [x] **AC-US3-03**: `subscription.ts` 保留向后兼容（调用 ExpiryEnforcer）

---

### US-004: 测试覆盖 (P1)
**Project**: TimorUp

**As a** developer
**I want** 完整测试覆盖
**So that** 重构不破坏现有行为

**Acceptance Criteria**:
- [x] **AC-US4-01**: `expiry-enforcer.test.ts` 存在
- [x] **AC-US4-02**: 60天宽限期边界测试
- [x] **AC-US4-03**: expired/cancelled/none 状态测试
- [x] **AC-US4-04**: all 434 tests pass

## Architecture

### 新文件结构

```
src/lib/expiry/
├── ExpiryEnforcer.ts      # 核心类
├── ExpiryEnforcer.test.ts # 单元测试
├── types.ts              # 类型定义
└── index.ts              # 导出
```

### ExpiryEnforcer 接口

```typescript
export interface SubscriptionData {
  status: SubscriptionStatus;
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
}

export interface PermissionResult {
  can: boolean;
  reason?: string;
}

export class ExpiryEnforcer {
  private readonly GRACE_PERIOD_DAYS = 60;

  isInGracePeriod(subscription: SubscriptionData): boolean;
  isPastGracePeriod(subscription: SubscriptionData): boolean;
  canCreateSku(subscription: SubscriptionData | null, skuCount: number, skuLimit: number): PermissionResult;
  canEditBusiness(subscription: SubscriptionData | null): PermissionResult;
  getDaysRemainingInGrace(subscription: SubscriptionData): number;
}
```

### 向后兼容

`subscribe.ts` 导出函数调用 ExpiryEnforcer 实例，保持 API 不变：

```typescript
import { ExpiryEnforcer } from './expiry/ExpiryEnforcer';

const enforcer = new ExpiryEnforcer();

export function isInGracePeriod(businessId: string): Promise<boolean> {
  const dashboard = await getSubscriptionDashboard(businessId);
  return enforcer.isInGracePeriod(dashboard);
}
```

## Dependencies

- `src/lib/subscription.ts` — 重构目标
- `src/lib/db/queries/businesses.ts` — DB 查询
- `src/actions/products/create.ts` — 需要更新
- `src/actions/business/create.ts` — 已使用 subscription.ts

## Success Criteria

| Metric | Target |
|--------|--------|
| Shared expiry logic | Single ExpiryEnforcer class |
| Code duplication | Removed from inline locations |
| Tests | 420+ passing |
| Build | Success |
| Coverage | 90%+ on expiry logic |