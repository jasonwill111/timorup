---
id: US-001
feature: FS-077
title: "修复 Vitest astro:actions mock (P1)"
status: completed
priority: P1
created: 2026-05-25
tldr: "**As a** developer."
project: timorup
---

# US-001: 修复 Vitest astro:actions mock (P1)

**Feature**: [FS-077](./FEATURE.md)

**As a** developer
**I want** Vitest 能正确运行 auth action 测试
**So that** 我可以验证认证逻辑而不出现 `Cannot find package 'astro:actions'` 错误

---

## Acceptance Criteria

- [x] **AC-US1-01**: vitest-setup.ts 包含 `vi.mock('astro:actions')` mock ✅
- [x] **AC-US1-02**: `defineAction` 被正确 mock，返回可调用的 handler ✅
- [x] **AC-US1-03**: `import.meta.env` 在测试中被正确 mock ✅
- [x] **AC-US1-04**: 所有 393 个 Vitest 测试通过 ✅ 395/395

---

## Implementation

**Increment**: [0077-test-config-fixes](../../../../../increments/0077-test-config-fixes/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-001**: 添加 astro:actions mock
- [ ] **T-002**: 添加 import.meta.env mock
- [ ] **T-003**: 验证 Vitest 通过
