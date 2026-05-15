---
increment: 0057-astro-server-islands-optimization
title: "Astro Server Islands 性能优化"
type: feature
priority: P1
status: planned
created: 2026-05-15
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Astro Server Islands 性能优化

## Overview

修复首页 Server Islands 未启用、Middleware 重复问题，优化 TTFB 和 CDN 缓存

---

## Summary

修复 Astro 6.3 项目中的 Server Islands 未启用问题，实现真正的静态 HTML + 动态 island 架构，提升 TTFB 和 CDN 缓存命中率。

## Problem Statement

当前问题：
1. HomepageContent 是普通 SSR 组件，每次请求都执行数据库查询
2. 未使用 `server:defer` 指令，首页无法被 CDN 缓存
3. 存在重复的 middleware 文件 (index.ts 和 middleware.ts)

## Impact

- 当前：全页 SSR → 不可缓存 → 每次请求都命中数据库
- 应该有：HTML 静态 → island 异步 → CDN 缓存主页面
- 预期性能提升：TTFB 减少 60%+，CDN 缓存命中

---

## User Stories

### US-001: Server Islands 启用
**Project**: timorlist

**As a** developer
**I want** 首页使用 Server Islands 架构
**So that** 主页面可以被 CDN 缓存，只有关键动态内容需要服务端渲染

**Acceptance Criteria**:
- [x] **AC-US1-01**: HomepageContent 组件使用 `server:defer` 指令 ✅
- [x] **AC-US1-02**: 首页 HTML 在构建时预渲染，静态部分可被 CDN 缓存 ✅
- [x] **AC-US1-03**: island 加载时显示 skeleton/fallback UI ✅
- [ ] **AC-US1-04**: 性能测试：TTFB < 200ms（在 5Mbps 网络下）⏳ (requires deploy)

### US-002: Middleware 合并
**Project**: timorlist

**As a** developer
**I want** 删除重复的 middleware 文件
**So that** 代码库更清晰，避免路由冲突

**Acceptance Criteria**:
- [x] **AC-US2-01**: 识别并确认 `src/middleware/index.ts` 和 `src/middleware.ts` 的职责 ✅
- [x] **AC-US2-02**: 合并或删除重复的 middleware，保持认证逻辑完整 ✅
- [x] **AC-US2-03**: 测试所有 `/admin/*` 路由的认证仍然正常工作 ✅

### US-003: 回退机制
**Project**: timorlist

**As a** operations team
**I want** 在 Server Islands 失败时有 graceful degradation
**So that** 用户不会看到错误页面

**Acceptance Criteria**:
- [x] **AC-US3-01**: 当 island 数据获取失败时，显示友好的 fallback UI ✅
- [ ] **AC-US3-02**: 日志记录 island 渲染失败，便于调试 ⏳ (existing try-catch)
- [ ] **AC-US3-03**: 验证 Lighthouse 评分 ≥ 90 ⏳ (requires deploy)

### US-004: Public Blog Pages
**Project**: timorlist

**As a** visitor
**I want** 查看公开的 blog 文章
**So that** 获取 Timor-Leste 旅游和本地信息

**Acceptance Criteria**:
- [x] **AC-US4-01**: `/blog` 列表页展示所有已发布文章 ✅
- [x] **AC-US4-02**: `/blog/[slug]` 详情页展示完整内容 ✅
- [ ] **AC-US4-03**: Blog 详情页包含分享按钮 (Twitter/Facebook/WhatsApp) ⏳ (deployed)
- [x] **AC-US4-04**: SEO meta tags 正确设置 ✅

---

## Success Metrics

| 指标 | 当前 | 目标 |
|------|------|------|
| TTFB | ~800ms | <200ms |
| CDN 缓存命中率 | 0% | >80% |
| Lighthouse Performance | ~70 | ≥90 |
| 首页 HTML 传输大小 | ~50KB | <30KB（静态部分） |

---

## Out of Scope

- 不修改 business detail 页面（已有 server islands）
- 不修改 listings 页面
- 不修改认证逻辑本身

---

## Dependencies

- Astro 6.3+ (已安装)
- @astrojs/cloudflare (已配置)
- Drizzle ORM (已配置)
