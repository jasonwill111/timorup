---
id: US-003
feature: FS-058
title: "替换 as any 类型断言"
status: completed
priority: P0
created: 2026-05-15T00:00:00.000Z
tldr: "**As a** TypeScript 严格模式."
project: TimorLink
---

# US-003: 替换 as any 类型断言

**Feature**: [FS-058](./FEATURE.md)

**As a** TypeScript 严格模式
**I want** 所�?Workers env 访问使用类型安全的方�?**So that** 配置错误在构建时被检测而非运行�?

---

## Acceptance Criteria

- [x] **AC-US3-01**: 创建 `src/lib/env.ts` �?type-safe env wrapper
- [x] **AC-US3-02**: `src/mastra/agents/index.ts` �?移除 `as any`�? �?minimaxModel as any�?- [x] **AC-US3-03**: `src/actions/admin/aiGenerate.ts` �?移除 `as any`�? �?globalThis.env as any�?

---

## Implementation

**Increment**: [0058-code-quality-cleanup-p0](../../../../../increments/0058-code-quality-cleanup-p0/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
