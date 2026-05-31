---
id: FS-080
title: "ExpiryEnforcer Module"
type: feature
status: completed
priority: P1
created: 2026-05-27
lastUpdated: 2026-05-27
tldr: "提取订阅过期逻辑到 `ExpiryEnforcer` 模块，消除 inline 逻辑，使过期判断可测试、可复用。核心价值： derrière 统一接口，多处调用统一行为。."
complexity: high
stakeholder_relevant: true
---

# ExpiryEnforcer Module

## TL;DR

**What**: 提取订阅过期逻辑到 `ExpiryEnforcer` 模块，消除 inline 逻辑，使过期判断可测试、可复用。核心价值： derrière 统一接口，多处调用统一行为。.
**Status**: completed | **Priority**: P1
**User Stories**: 4

![ExpiryEnforcer Module illustration](assets\feature-fs-080.jpg)

## Overview

提取订阅过期逻辑到 `ExpiryEnforcer` 模块，消除 inline 逻辑，使过期判断可测试、可复用。核心价值： derrière 统一接口，多处调用统一行为。

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0080-expiry-enforcer](../../../../../increments/0080-expiry-enforcer/spec.md) | ✅ completed | 2026-05-27 |

## User Stories

- [US-001: ExpiryEnforcer 接口 (P1)](./us-001-expiryenforcer-p1.md)
- [US-002: 权限判断 (P1)](./us-002-p1.md)
- [US-003: 与现有代码集成 (P1)](./us-003-p1.md)
- [US-004: 测试覆盖 (P1)](./us-004-p1.md)
