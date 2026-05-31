---
id: US-004
feature: FS-077
title: "添加 CSP 安全头 (P2)"
status: completed
priority: P1
created: 2026-05-25
tldr: "**As a** security engineer."
project: timorup
---

# US-004: 添加 CSP 安全头 (P2)

**Feature**: [FS-077](./FEATURE.md)

**As a** security engineer
**I want** 所有响应包含 Content-Security-Policy 头
**So that** 防止 XSS 攻击

---

## Acceptance Criteria

- [x] **AC-US4-01**: middleware.ts 添加 `Content-Security-Policy` 头 ✅
- [x] **AC-US4-02**: CSP 配置: `default-src 'self'; script-src 'self' 'unsafe-inline'` ✅
- [x] **AC-US4-03**: 允许 Cloudflare fonts 和 CDN 资源 ✅

---

## Implementation

**Increment**: [0077-test-config-fixes](../../../../../increments/0077-test-config-fixes/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-009**: 添加 CSP headers
- [ ] **T-010**: 验证 CSP 功能
