---
id: US-002
feature: FS-082
title: "Media Validation Module (P1)"
status: completed
priority: P1
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-002: Media Validation Module (P1)

**Feature**: [FS-082](./FEATURE.md)

**As a** developer
**I want** 可复用的媒体验证函数
**So that** 验证逻辑统一

---

## Acceptance Criteria

- [x] **AC-US2-01**: `validateMediaFile(file, limits)` — 验证文件类型和大小
- [x] **AC-US2-02**: `checkMediaCount(entityType, entityId)` — 检查媒体数量
- [x] **AC-US2-03**: `buildR2Key()` — R2 key 构建逻辑

---

## Implementation

**Increment**: [0082-media-upload-pipeline](../../../../../increments/0082-media-upload-pipeline/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-002**: Create src/lib/media/validator.ts
