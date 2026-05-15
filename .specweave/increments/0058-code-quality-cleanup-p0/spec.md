---
increment: 0058-code-quality-cleanup-p0
title: Code Quality Cleanup P0
type: refactor
priority: P0
status: completed
created: 2026-05-15T00:00:00.000Z
structure: user-stories
test_mode: TDD
---

# Code Quality Cleanup P0

## Overview

修复 4 类技术债：
1. **P0 安全风险** - API key 在 console.log 中泄露
2. **P0 静默错误** - 52 处空 catch 块，用户无反馈
3. **P1 类型安全** - 10 处 `as any` 掩盖 Worker binding 配置错误
4. **P1 攻击面** - 11 个冗余 REST API 端点（已被 Server Actions 替代）

## User Stories

### US-001: 修复空 catch 块导致的静默错误
**Project**: timorlist

**As a** developer
**I want** 所有 catch 块记录错误日志
**So that** 生产问题能被追踪和调试

**Acceptance Criteria**:
- [x] **AC-US1-01**: `src/actions/business/create.ts` — 3 处空 catch 块添加 console.error
- [x] **AC-US1-02**: `src/actions/products/create.ts` — 空 catch 块添加 console.error
- [x] **AC-US1-03**: `src/actions/products/update.ts` — 空 catch 块添加 console.error
- [x] **AC-US1-04**: `src/lib/auth-kv-store.ts` — 2 处空 catch 块添加 console.warn
- [x] **AC-US1-05**: `src/lib/subscription.ts` — 空 catch 块添加 console.warn

### US-002: 移除生产环境 console.log 泄露
**Project**: timorlist

**As a** security team
**I want** 生产代码中不包含调试 console.log
**So that** API key 和业务逻辑细节不被记录到 Worker 日志

**Acceptance Criteria**:
- [x] **AC-US2-01**: `src/actions/admin/aiGenerate.ts` — 移除 5 处 console.log（含 API key 长度泄露）
- [x] **AC-US2-02**: `src/pages/api/scheduled/_mark-expired.ts` — 移除 console.log
- [x] **AC-US2-03**: `src/pages/api/scheduled/_cleanup.ts` — 移除 4 处 console.log
- [x] **AC-US2-04**: `src/pages/api/scheduled/_cleanup-orphan-media.ts` — 移除 3 处 console.log
- [x] **AC-US2-05**: `src/pages/admin/ai-tools.astro` — 移除 4 处客户端 console.log

### US-003: 替换 as any 类型断言
**Project**: timorlist

**As a** TypeScript 严格模式
**I want** 所有 Workers env 访问使用类型安全的方式
**So that** 配置错误在构建时被检测而非运行时

**Acceptance Criteria**:
- [x] **AC-US3-01**: 创建 `src/lib/env.ts` — type-safe env wrapper
- [x] **AC-US3-02**: `src/mastra/agents/index.ts` — 移除 `as any`（4 处 minimaxModel as any）
- [x] **AC-US3-03**: `src/actions/admin/aiGenerate.ts` — 移除 `as any`（6 处 globalThis.env as any）

### US-004: 删除冗余 REST API 端点
**Project**: timorlist

**As a** security team
**I want** 减少攻击面（删除已被 Server Actions 替代的端点）
**So that** 维护复杂度降低

**Acceptance Criteria**:
- [x] **AC-US4-01**: 删除 `src/pages/api/banners/[id].ts` 和 `index.ts`
- [x] **AC-US4-02**: 删除 `src/pages/api/businesses/[slug].ts`（PUT 部分）
- [x] **AC-US4-03**: 删除 `src/pages/api/media/[id].ts` 和 `index.ts`
- [x] **AC-US4-04**: 删除 `src/pages/api/products/[id].ts` 和 `index.ts`
- [x] **AC-US4-05**: 删除 `src/pages/api/reviews/[id]/reply.ts` 和 `index.ts`

## Verification

```bash
# 检查无空 catch 块（action layer）
grep -rn "} catch {" src/actions/ src/lib/ | grep -v "console.error\|console.warn\|getErrorMessage"

# 检查无 as any
grep -rn "as any" src/ --include="*.ts" | grep -v "// legacy"

# 检查无生产 console.log
grep -rn "console\.log" src/actions/ src/pages/admin/ src/pages/api/

# 构建验证
pnpm build

# 类型检查
npx astro check
```

## Out of Scope

- `src/db/seed.ts` — 开发脚本，console.log 保留
- 只读 REST API（public listing, get single entity）
- 测试文件中的 console.log
