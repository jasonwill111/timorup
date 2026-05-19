---
id: US-001
feature: FS-057
title: "Server Islands 启用"
status: in_progress
priority: P1
created: 2026-05-15
tldr: "**As a** developer."
project: TimorLink
---

# US-001: Server Islands 启用

**Feature**: [FS-057](./FEATURE.md)

**As a** developer
**I want** 首页使用 Server Islands 架构
**So that** 主页面可以被 CDN 缓存，只有关键动态内容需要服务端渲染

---

## Acceptance Criteria

- [x] **AC-US1-01**: HomepageContent 组件使用 `server:defer` 指令 �?- [x] **AC-US1-02**: 首页 HTML 在构建时预渲染，静态部分可�?CDN 缓存 �?- [x] **AC-US1-03**: island 加载时显�?skeleton/fallback UI �?- [ ] **AC-US1-04**: 性能测试：TTFB < 200ms（在 5Mbps 网络下）�?(requires deploy)

---

## Implementation

**Increment**: [0057-astro-server-islands-optimization](../../../../../increments/0057-astro-server-islands-optimization/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-002**: Add Fallback UI to HomepageContent
- [x] **T-006**: Performance Testing

