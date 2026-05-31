---
id: FS-002
title: "P0 合规修复：动态支付二维码 + Nominatim 地址解析"
type: feature
status: completed
priority: P1
created: 2026-03-23T00:00:00.000Z
lastUpdated: 2026-05-27
tldr: "修复 G-02 �?G-03 两个 P0 合规问题。两者都是面向用户的前端增强加后�?API 改动�?."
complexity: medium
stakeholder_relevant: true
---

# P0 合规修复：动态支付二维码 + Nominatim 地址解析

## TL;DR

**What**: 修复 G-02 �?G-03 两个 P0 合规问题。两者都是面向用户的前端增强加后�?API 改动�?.
**Status**: completed | **Priority**: P1
**User Stories**: 2

![P0 合规修复：动态支付二维码 + Nominatim 地址解析 illustration](assets\feature-fs-002.jpg)

## Overview

修复 G-02 �?G-03 两个 P0 合规问题。两者都是面向用户的前端增强加后�?API 改动�?
| Gap | 问题 | 修复范围 |
|-----|------|---------|
| **G-02** | `/subscribe` 硬编码支付二维码，Admin 无法动态更�?| `subscribe.astro` + 新建 `/api/settings/public` 端点 |
| **G-03** | 商家创建/编辑页面 Nominatim 调用无防抖，逻辑分散 | 新建 `src/lib/geo.ts` + 完善 `create.astro` + 新建 `edit.astro` |

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0002-p0-compliance-fix](../../../../../increments/0002-p0-compliance-fix/spec.md) | ✅ completed | 2026-03-23T00:00:00.000Z |

## User Stories

- [US-001: Dynamic Payment QR Code](./us-001-dynamic-payment-qr-code.md)
- [US-002: Nominatim Address Auto-Parse](./us-002-nominatim-address-auto-parse.md)
