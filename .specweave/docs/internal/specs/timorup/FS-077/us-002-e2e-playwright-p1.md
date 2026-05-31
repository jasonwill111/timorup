---
id: US-002
feature: FS-077
title: "修复 E2E Playwright 端口配置 (P1)"
status: completed
priority: P1
created: 2026-05-25
tldr: "**As a** developer."
project: timorup
---

# US-002: 修复 E2E Playwright 端口配置 (P1)

**Feature**: [FS-077](./FEATURE.md)

**As a** developer
**I want** E2E 测试连接到正确的 dev server 端口
**So that** 我可以运行端到端测试验证功能

---

## Acceptance Criteria

- [x] **AC-US2-01**: playwright.config.ts baseURL 使用 `http://localhost:8787` ✅
- [x] **AC-US2-02**: `.env.e2e` 创建，包含 BASE_URL 配置 ✅
- [x] **AC-US2-03**: E2E auth-flow.spec.ts 可成功访问 login 页面 ✅ (Chrome DevTools verified)

---

## Implementation

**Increment**: [0077-test-config-fixes](../../../../../increments/0077-test-config-fixes/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-004**: 更新 Playwright baseURL
- [ ] **T-005**: 创建 .env.e2e 配置
- [ ] **T-006**: 验证 E2E 可运行
