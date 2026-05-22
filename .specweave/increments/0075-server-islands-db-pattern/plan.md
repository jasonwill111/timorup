# Plan: 0075 - Server Islands DB Pattern

## Context
timorbuy 和 timorup 两个项目在 Server Islands 中使用不同的 DB 访问模式。timorbuy 的 `initDb()` + `getDbInstance()` 模式在 Islands 隔离上下文中失败。

## Implementation

### Step 1: Audit timorup Islands
检查所有使用 `server:defer` 的组件，确认都使用 `getDb()` 模式。

### Step 2: Document Best Practices
在 CLAUDE.md 中添加 Server Islands 规则（已完成）。

### Step 3: Create Validation
考虑添加 ESLint/TypeScript 规则检测错误模式。

## Tasks

| ID | Task | Status |
|----|------|--------|
| T-001 | 审计 timorup 所有 Server Islands | open |
| T-002 | 确认 CLAUDE.md 文档已添加 | open |
| T-003 | 考虑添加自动化检测 | open |

## Test Plan

```bash
# 构建测试
pnpm build

# 本地测试 Islands
pnpm dev
# 访问首页检查 Islands 内容
```