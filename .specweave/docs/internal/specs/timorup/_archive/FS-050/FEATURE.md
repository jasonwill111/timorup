---
id: FS-050
title: "Rate Limiter KV Storage"
type: feature
status: completed
priority: P1
created: 2026-05-13T00:00:00.000Z
lastUpdated: 2026-05-13
tldr: "Move rate limiter from in-memory Map to Cloudflare KV for distributed rate limiting across Workers instances."
complexity: medium
stakeholder_relevant: true
---

# Rate Limiter KV Storage

## TL;DR

**What**: Move rate limiter from in-memory Map to Cloudflare KV for distributed rate limiting across Workers instances.
**Status**: completed | **Priority**: P1
**User Stories**: 2

![Rate Limiter KV Storage illustration](assets/feature-fs-050.jpg)

## Overview

Move rate limiter from in-memory Map to Cloudflare KV for distributed rate limiting across Workers instances.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0050-0041-rate-limiter-kv](../../../../../increments/0050-0041-rate-limiter-kv/spec.md) | ✅ completed | 2026-05-13T00:00:00.000Z |

## User Stories

- [US-001: Distributed Rate Limiting (P1)](./us-001-distributed-rate-limiting-p1.md)
- [US-002: Backward Compatible API (P1)](./us-002-backward-compatible-api-p1.md)
