---
id: US-004
feature: FS-007
title: "Media - Image/Video Separation & SEO"
status: completed
priority: P1
created: 2026-04-18T00:00:00.000Z
tldr: "**As a** system."
project: TimorLink
---

# US-004: Media - Image/Video Separation & SEO

**Feature**: [FS-007](./FEATURE.md)

**As a** system
**I want** media to support image/video with SEO metadata
**So that** rich content is properly organized

---

## Acceptance Criteria

- [x] **AC-US4-01**: mediaType 枚举�?`image | video`
- [x] **AC-US4-02**: 支持格式限制 (jpg/png/webp/gif/mp4/webm) (Deferred to media upload feature)
- [x] **AC-US4-03**: 文件大小限制 (图片 10MB, 视频 100MB) (Deferred to media upload feature)
- [x] **AC-US4-04**: 添加 SEO 字段 (alt, title, description)
- [x] **AC-US4-05**: 类型默认 `profile | banner | gallery`，用户不手动选择

---

## Implementation

**Increment**: [0007-db-schema-v2](../../../../../increments/0007-db-schema-v2/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

