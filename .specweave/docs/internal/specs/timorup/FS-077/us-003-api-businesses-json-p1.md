---
id: US-003
feature: FS-077
title: "修复 /api/businesses JSON 解析错误 (P1)"
status: not_started
priority: P1
created: 2026-05-25
tldr: "**As a** user."
project: timorup
---

# US-003: 修复 /api/businesses JSON 解析错误 (P1)

**Feature**: [FS-077](./FEATURE.md)

**As a** user
**I want** 分类过滤正常工作
**So that** 我可以按分类浏览 businesses

---

## Acceptance Criteria

- [ ] **AC-US3-01**: `GET /api/businesses` 返回 `{"success":true,...}`
- [ ] **AC-US3-02**: 分类参数 `?category=restaurants` 正确解析
- [ ] **AC-US3-03**: 无 JSON 解析错误 `"Unexpected token 'r'"`

---

## Implementation

**Increment**: [0077-test-config-fixes](../../../../../increments/0077-test-config-fixes/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-007**: 调查 API JSON 解析错误
- [ ] **T-008**: 验证 API 正常
