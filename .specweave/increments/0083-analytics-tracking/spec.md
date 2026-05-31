---
increment: 0083-analytics-tracking
title: "Analytics Tracking"
type: refactor
priority: P2
status: in-progress
created: 2026-05-27
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Analytics Tracking

## Overview

分析追踪集中化，创建统一的 `Analytics` 模块来收集和报告用户行为事件。

## Context

当前问题：
- 没有集中的事件追踪系统
- 页面访问、用户行为等数据难以收集
- 无法衡量功能使用情况

目标：
- 创建 `Analytics` 模块统一事件收集
- 定义标准的事件类型
- 提供简单的事件追踪 API

## User Stories

### US-001: Analytics Module (P1)
**Project**: TimorUp

**As a** developer
**I want** 统一的分析追踪模块
**So that** 收集用户行为数据

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/lib/analytics/Analytics.ts` — Analytics 类
- [x] **AC-US1-02**: `trackEvent(event, properties)` — 事件追踪方法
- [x] **AC-US1-03**: `trackPageView(page, properties)` — 页面浏览追踪
- [x] **AC-US1-04**: `trackUserAction(action, userId)` — 用户行为追踪

---

### US-002: Event Types (P1)
**Project**: TimorUp

**As a** developer
**I want** 标准的事件类型
**So that** 数据一致性

**Acceptance Criteria**:
- [x] **AC-US2-01**: `EventType` 枚举定义
- [x] **AC-US2-02**: `PAGE_VIEW` — 页面浏览
- [x] **AC-US2-03**: `BUSINESS_VIEW` — 商家浏览
- [x] **AC-US2-04**: `SEARCH_QUERY` — 搜索查询
- [x] **AC-US2-05**: `USER_SIGNUP` — 用户注册
- [x] **AC-US2-06**: `LISTING_CREATED` — 列表创建

---

### US-003: Tests (P1)
**Project**: TimorUp

**As a** developer
**I want** 完整测试覆盖
**So that** 重构不破坏现有行为

**Acceptance Criteria**:
- [x] **AC-US3-01**: `analytics.test.ts` 存在
- [x] **AC-US3-02**: 事件追踪测试
- [x] **AC-US3-03**: all 491 tests pass

## Architecture

### 新文件

```
src/lib/analytics/
├── Analytics.ts           # Analytics 类
├── types.ts             # 事件类型定义
├── analytics.test.ts     # 单元测试
└── index.ts            # 导出
```

### Analytics 类

```typescript
export enum EventType {
  PAGE_VIEW = 'page_view',
  BUSINESS_VIEW = 'business_view',
  SEARCH_QUERY = 'search_query',
  USER_SIGNUP = 'user_signup',
  USER_SIGNIN = 'user_signin',
  LISTING_CREATED = 'listing_created',
  PRODUCT_CREATED = 'product_created',
  REVIEW_ADDED = 'review_added',
}

export interface EventProperties {
  [key: string]: string | number | boolean;
}

export class Analytics {
  trackEvent(event: EventType, properties?: EventProperties): void;
  trackPageView(page: string, properties?: EventProperties): void;
  trackBusinessView(businessId: string, businessName?: string): void;
  trackSearchQuery(query: string, resultsCount: number): void;
  trackUserAction(action: EventType, userId: string, properties?: EventProperties): void;
}
```

### 存储策略

当前实现：控制台日志记录（便于调试）
未来扩展：发送到分析服务（Plausible, Umami, 自建）

## Dependencies

- `src/lib/` — 新目录
- 现有 actions — 可选集成

## Success Criteria

| Metric | Target |
|--------|--------|
| Analytics module | Single Analytics class |
| Event types | 8+ event types |
| Tests | 470+ passing |
| Build | Success |