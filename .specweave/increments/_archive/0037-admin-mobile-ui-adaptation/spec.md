---
increment: 0037-admin-mobile-ui-adaptation
title: "Admin子页面Mobile适配"
type: feature
priority: P1
status: planned
created: 2026-05-08
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin子页面Mobile适配

## Overview

系统性修复所有admin子页面的mobile端UI/UX。项目要求mobile-first，但当前admin子页面普遍缺少mobile适配。

## User Stories

### US-001: Admin子页面Mobile Audit (P1)
**Project**: timorlist

**As a** admin user
**I want** 所有子页面在mobile上可用
**So that** 我可以在手机上管理工作

**Acceptance Criteria**:
- [x] **AC-US1-01**: 列出所有需要适配的admin子页面清单(13个页面)
- [x] **AC-US1-02**: 识别每个页面的mobile问题类型

**Audit结果**:
- 3个表格页面已有`overflow-x-auto`: categories, plans, subscriptions
- 其他10个页面使用cards/lists/grids，本身mobile友好
- ✅ 所有页面已有响应式类，无需额外修改

---

### US-002: Dashboard & Settings Mobile适配 (P1)
**Project**: timorlist

**As a** admin
**I want** Dashboard和Settings在mobile上正常显示
**So that** 我可以快速查看数据

**Acceptance Criteria**:
- [x] **AC-US2-01**: `admin/index.astro` - 卡片网格`grid-cols-2 md:grid-cols-4` ✅
- [x] **AC-US2-02**: `admin/settings.astro` - 表单`grid-cols-1 md:grid-cols-2` ✅

---

### US-003: 列表页面Mobile适配 (P1)
**Project**: timorlist

**As a** admin
**I want** 所有列表页面(table)在mobile上可滚动
**So that** 我可以浏览数据

**Acceptance Criteria**:
- [x] **AC-US3-01**: `admin/businesses.astro` - list布局mobile友好 ✅
- [x] **AC-US3-02**: `admin/users.astro` - list布局mobile友好 ✅
- [x] **AC-US3-03**: `admin/subscriptions.astro` - 已有overflow-x-auto ✅
- [x] **AC-US3-04**: `admin/skus.astro` - card布局mobile友好 ✅
- [x] **AC-US3-05**: `admin/blogs.astro` - card布局mobile友好 ✅
- [x] **AC-US3-06**: `admin/categories.astro` - 已有overflow-x-auto ✅
- [x] **AC-US3-07**: `admin/heroes.astro` - card布局mobile友好 ✅
- [x] **AC-US3-08**: `admin/reviews.astro` - card布局mobile友好 ✅
- [x] **AC-US3-09**: `admin/plans.astro` - 已有overflow-x-auto ✅

---

### US-004: 功能页面Mobile适配 (P1)
**Project**: timorlist

**As a** admin
**I want** AI Tools和Media页面在mobile上可用
**So that** 我可以管理内容

**Acceptance Criteria**:
- [x] **AC-US4-01**: `admin/ai-tools.astro` - grid `grid-cols-1 lg:grid-cols-2` ✅
- [x] **AC-US4-02**: `admin/media.astro` - grid `grid-cols-2 md:grid-cols-4` ✅

## 需要适配的页面清单

| 页面 | 文件 | 主要问题 | 适配类型 |
|------|------|----------|----------|
| Dashboard | `admin/index.astro` | 卡片布局 | 网格响应式 |
| Settings | `admin/settings.astro` | 表单布局 | 表单响应式 |
| Businesses | `admin/businesses.astro` | 表格滚动 | 表格横向滚动 |
| Users | `admin/users.astro` | 表格滚动 | 表格横向滚动 |
| Subscriptions | `admin/subscriptions.astro` | 表格滚动 | 表格横向滚动 |
| SKUs | `admin/skus.astro` | 表格滚动 | 表格横向滚动 |
| Blogs | `admin/blogs.astro` | 表格滚动 | 表格横向滚动 |
| Categories | `admin/categories.astro` | 表格滚动 | 表格横向滚动 |
| Heroes | `admin/heroes.astro` | 表格滚动 | 表格横向滚动 |
| Reviews | `admin/reviews.astro` | 表格滚动 | 表格横向滚动 |
| Plans | `admin/plans.astro` | 表格滚动 | 表格横向滚动 |
| AI Tools | `admin/ai-tools.astro` | 表单布局 | 表单响应式 |
| Media | `admin/media.astro` | 网格布局 | 网格响应式 |

## Mobile适配原则

1. **表格**: `overflow-x-auto` 横向滚动，固定列宽
2. **卡片**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` mobile单列
3. **表单**: 全宽输入框，按钮堆叠
4. **分页**: 移动到底部，更大点击区域
5. **操作**: 下拉菜单/Sheet替代横向操作按钮

## Out of Scope

- admin/login.astro (独立登录页)
- API修改
- 功能逻辑变更

## Dependencies

- `AdminLayout.astro` - 已完成的基础布局
