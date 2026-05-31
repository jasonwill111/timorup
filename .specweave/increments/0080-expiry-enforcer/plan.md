# Plan: ExpiryEnforcer Module

## Context

当前 `subscription.ts` 中过期逻辑分散且与 DB 查询耦合。目标是提取到可测试的 `ExpiryEnforcer` 模块。

## Architecture

### ExpiryEnforcer Class

```typescript
// src/lib/expiry/ExpiryEnforcer.ts
export class ExpiryEnforcer {
  readonly GRACE_PERIOD_DAYS = 60;

  isInGracePeriod(subscription: SubscriptionData): boolean;
  isPastGracePeriod(subscription: SubscriptionData): boolean;
  canCreateSku(subscription: SubscriptionData | null, skuCount: number, skuLimit: number): PermissionResult;
  canEditBusiness(subscription: SubscriptionData | null): PermissionResult;
  getDaysRemainingInGrace(subscription: SubscriptionData): number;
}
```

### SubscriptionData 接口

```typescript
export interface SubscriptionData {
  status: 'none' | 'active' | 'expired' | 'cancelled';
  expiresAt: Date | null;
  gracePeriodEndDate: Date | null;
}
```

### PermissionResult 类型

```typescript
export interface PermissionResult {
  can: boolean;
  reason?: string;
}
```

### 为什么用 Class 而非纯函数？

1. **单一实例**：GRACE_PERIOD_DAYS 常量集中管理，便于调整
2. **方法组合**：`isInGracePeriod` 和 `getDaysRemainingInGrace` 共享计算逻辑
3. **易于 mock**：测试时可注入 mock 实例

## Implementation Phases

### Phase 1: 创建 expiry 模块

1. `src/lib/expiry/types.ts` — 定义 SubscriptionData, PermissionResult
2. `src/lib/expiry/ExpiryEnforcer.ts` — 核心类实现
3. `src/lib/expiry/index.ts` — 导出

### Phase 2: 迁移测试

1. `src/lib/expiry/ExpiryEnforcer.test.ts` — 红测（边界条件）
2. 实现通过
3. 重构

### Phase 3: 集成

1. 更新 `subscription.ts` 使用 ExpiryEnforcer（向后兼容）
2. 更新 actions 使用新模块
3. 删除 inline 重复逻辑

## Key Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/expiry/types.ts` | Create |
| `src/lib/expiry/ExpiryEnforcer.ts` | Create |
| `src/lib/expiry/ExpiryEnforcer.test.ts` | Create |
| `src/lib/expiry/index.ts` | Create |
| `src/lib/subscription.ts` | Modify (use ExpiryEnforcer) |
| `src/actions/products/create.ts` | Modify |
| `src/actions/business/create.ts` | Modify (if needed) |

## Rationale

- **Seam 位置**：ExpiryEnforcer 是同步计算逻辑，与 DB 访问解耦
- **向后兼容**：`subscription.ts` 保持现有 API，调用方无需修改
- **TDD 优先**：先写测试，再实现，保证边界条件覆盖