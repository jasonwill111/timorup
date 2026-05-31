---
increment: 0078-ui-ux-optimization
title: UI/UX Optimization
type: feature
priority: P1
status: completed
completed_at: 2026-05-27T01:00:00.000Z
created: 2026-05-25T00:00:00.000Z
structure: user-stories
---

# SPEC.md - 0078-ui-ux-optimization

## Project
**timorup** — 东帝汶商业目录平台

## Overview
统一优化 light/dark 模式 UI/UX，提升移动端体验和可读性。确保所有页面在两种模式下都简洁易读。

## Design System (from .impeccable.md)

### Brand Colors
| Token | Light | Dark |
|-------|-------|------|
| Primary | #FFD166 | #FFD166 |
| Background | #F5F4ED | #0F1A2E |
| Foreground | #141413 | #E8E6DC |
| Card | #FAF9F5 | #152236 |
| Border | #D8D6CD | #2A3D5C |
| Muted | #E8E6DC | #1E2E47 |

### Typography
- Body: Nunito Sans
- Headings: Plus Jakarta Sans
- Mobile minimum: 16px body text

### Spacing
- Touch targets: 44px minimum
- Container: max-w-6xl
- Card radius: rounded-xl

## User Stories

### US-001: 统一按钮组件 (P1)
**Project**: timorup

**As a** user
**I want** 所有按钮样式一致
**So that** 界面更专业、更易用

**Acceptance Criteria**:
- [x] **AC-US1-01**: Primary 按钮使用 `bg-primary text-primary-foreground`
- [x] **AC-US1-02**: Secondary 按钮使用 `border border-primary text-primary`
- [x] **AC-US1-03**: Ghost 按钮使用 `text-muted-foreground hover:text-primary`
- [x] **AC-US1-04**: 所有按钮有 `transition-colors duration-200`
- [x] **AC-US1-05**: 禁用状态使用 `opacity-50 cursor-not-allowed`

---

### US-002: 优化卡片组件 (P1)
**Project**: timorup

**As a** user
**I want** 卡片在 light/dark 模式都清晰可读
**So that** 我能轻松浏览商业列表

**Acceptance Criteria**:
- [x] **AC-US2-01**: 卡片使用 `bg-card border border-border`
- [x] **AC-US2-02**: 悬停效果: `hover:border-primary/40 hover:shadow-md`
- [x] **AC-US2-03**: 图片使用 `aspect-[4/3] object-cover`
- [x] **AC-US2-04**: 标题使用 `font-bold line-clamp-2`

---

### US-003: 优化表单组件 (P1)
**Project**: timorup

**As a** user
**I want** 表单在两种模式下都清晰易填
**So that** 我能顺利完成注册/登录

**Acceptance Criteria**:
- [x] **AC-US3-01**: 输入框使用 `bg-background border border-input`
- [x] **AC-US3-02**: Focus 状态: `focus:border-primary focus:ring-ring`
- [x] **AC-US3-03**: 错误状态: `border-red-500 text-red-500`
- [x] **AC-US3-04**: 标签使用 `text-sm font-medium text-foreground`

---

### US-004: Header/Footer 优化 (P2)
**Project**: timorup

**As a** user
**I want** 导航在移动端清晰易用
**So that** 我能快速找到需要的内容

**Acceptance Criteria**:
- [x] **AC-US4-01**: Logo 区域使用 `bg-brand-500`
- [x] **AC-US4-02**: 移动端菜单项 `min-h-[44px]`
- [x] **AC-US4-03**: 下拉菜单使用 `z-50` 确保在最上层

---

### US-005: 移动端响应式审查 (P2)
**Project**: timorup

**As a** user
**I want** 所有页面在手机上正常工作
**So that** 我能在任何设备上使用网站

**Acceptance Criteria**:
- [x] **AC-US5-01**: 无水平滚动
- [x] **AC-US5-02**: 图片 `max-w-full h-auto`
- [x] **AC-US5-03**: 表格使用 `overflow-x-auto`
- [x] **AC-US5-04**: 容器 `max-w-6xl px-4`

---

### US-006: 可访问性优化 (P2)
**Project**: timorup

**As a** user
**I want** 网站符合 WCAG 标准
**So that** 所有人都能使用

**Acceptance Criteria**:
- [x] **AC-US6-01**: 文本对比度 ≥ 4.5:1
- [x] **AC-US6-02**: Focus 状态 `focus-visible:ring-ring`
- [x] **AC-US6-03**: 交互元素 `cursor-pointer`

## Out of Scope

- 重构页面结构
- 添加新功能
- 动画效果增强

## Dependencies

- `src/styles/globals.css` — 主题颜色
- `src/components/ui/` — UI 组件库
- `src/components/Header.astro` — 导航
- `src/components/Footer.astro` — 页脚

## Success Criteria

| Metric | Target |
|--------|--------|
| Light mode contrast | 4.5:1 minimum |
| Dark mode contrast | 4.5:1 minimum |
| Touch targets | 44px minimum |
| Mobile viewport | No horizontal scroll |
