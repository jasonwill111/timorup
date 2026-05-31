---
increment: 0086-free-plan-scaling
title: "Free Plan Scaling Optimizations"
type: feature
priority: P1
status: planned
created: 2026-05-29
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Free Plan Scaling Optimizations

## Overview

优化缓存策略，提升 Free Plan 承载能力至 25-30万 PV/月

## Problem Statement

当前 Free Plan 预估只能支撑 ~3万 PV/月。通过实施缓存优化，可以分阶段提升至 25-30万 PV/月。

## 优化效果预估

| 优化程度 | PV/月 | 说明 |
|----------|-------|------|
| 无优化 | ~3万 | 当前状态 |
| + 缓存策略 | ~10万 | Cache-Control headers |
| + KV 缓存 | ~15万 | 热点数据缓存 |
| + 预渲染 | ~20万 | 静态页面预渲染 |
| + CDN 规则 | ~25-30万 | 边缘缓存配置 |

## User Stories

### US-001: Cache Headers Optimization (P1)
**Project**: timorup

**As a** visitor
**I want** fast page loads
**So that** I don't abandon slow pages

**Acceptance Criteria**:
- [x] **AC-US1-01**: 首页设置 `Cache-Control: public, max-age=60, s-maxage=120, stale-while-revalidate=300` ✅
- [x] **AC-US1-02**: 详情页设置 `Cache-Control: public, max-age=120, s-maxage=600, stale-while-revalidate=600` ✅
- [x] **AC-US1-03**: 分类列表设置 `Cache-Control: public, max-age=30, s-maxage=60, stale-while-revalidate=120` ✅
- [x] **AC-US1-04**: 静态资源(hashed)设置 `Cache-Control: public, max-age=31536000, immutable` ✅ (Astro 默认)

---

### US-002: Static Page Prerendering (P1)
**Project**: timorup

**As a** visitor
**I want** instant page loads for static content
**So that** about/pricing/privacy pages load instantly

**Acceptance Criteria**:
- [x] **AC-US2-01**: `/about` 页面预渲染为静态 HTML ✅
- [x] **AC-US2-02**: `/pricing` 页面预渲染为静态 HTML ⚠️ (需要 SSR)
- [x] **AC-US2-03**: `/privacy` 页面预渲染为静态 HTML ✅
- [x] **AC-US2-04**: `/terms` 页面预渲染为静态 HTML ✅
- [x] **AC-US2-05**: `/faq` 页面预渲染为静态 HTML ✅

---

### US-003: HTML Compression (P1)
**Project**: timorup

**As a** visitor
**I want** smaller HTML responses
**So that** pages load faster on slow connections

**Acceptance Criteria**:
- [x] **AC-US3-01**: `astro.config.mjs` 启用 `compressHTML: true` ✅
- [x] **AC-US3-02**: `astro.config.mjs` 启用 `cssMinify: true` ✅

---

### US-004: KV Cache Hot Data (P2)
**Project**: timorup

**As a** visitor
**I want** cached category lists and popular businesses
**So that** listing pages load faster

**Acceptance Criteria**:
- [x] **AC-US4-01**: 分类列表使用 KV 缓存，TTL 300s ✅ (cache.ts 已存在)
- [x] **AC-US4-02**: 热门 Business 使用 KV 缓存，TTL 60s ✅
- [x] **AC-US4-03**: 验证 `src/lib/cache.ts` 已集成并正常工作 ✅

---

### US-005: D1 Query Optimization (P2)
**Project**: timorup

**As a** visitor
**I want** efficient database queries
**So that** API responses are fast

**Acceptance Criteria**:
- [x] **AC-US5-01**: API 避免 N+1 查询，使用 JOIN ✅ (现有实现)
- [x] **AC-US5-02**: API 返回数据限制 (max 100 条) ✅ (LIMIT 12/100)
- [x] **AC-US5-03**: 列表 API 实现分页 (cursor 或 offset) ✅

## Success Criteria

1. Cloudflare Dashboard 显示 Cache Hit Ratio > 80%
2. Lighthouse Performance Score > 90 (首页)
3. TTFB < 200ms for cached pages
4. 构建成功，无警告

## Out of Scope

- Paid Plan 功能 (D1 Replica, Hyperdrive)
- 图片 CDN 优化 (需 R2 配置)
- 服务端渲染架构变更

## Dependencies

- `@cloudflare/vite-plugin` (已有)
- KV namespace `SESSION` (已有)

## Verification

```bash
# 本地测试
pnpm build
curl -I http://localhost:8787  # 检查 Cache-Control headers

# 生产验证
# Cloudflare Dashboard > Workers & Pages > timorup > Metrics
```