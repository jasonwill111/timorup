---
id: US-001
feature: FS-082
title: "Media Error Codes (P1)"
status: completed
priority: P1
created: 2026-05-27
tldr: "**As a** developer."
project: TimorUp
---

# US-001: Media Error Codes (P1)

**Feature**: [FS-082](./FEATURE.md)

**As a** developer
**I want** 媒体相关的标准错误码
**So that** 错误处理一致

---

## Acceptance Criteria

- [x] **AC-US1-01**: `MEDIA_NO_FILE` — 未提供文件
- [x] **AC-US1-02**: `MEDIA_TYPE_NOT_ALLOWED` — 文件类型不允许
- [x] **AC-US1-03**: `MEDIA_SIZE_TOO_LARGE` — 文件过大
- [x] **AC-US1-04**: `MEDIA_LIMIT_REACHED` — 达到媒体数量限制
- [x] **AC-US1-05**: `MEDIA_UPLOAD_ERROR` — 上传失败

---

## Implementation

**Increment**: [0082-media-upload-pipeline](../../../../../increments/0082-media-upload-pipeline/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Add MEDIA_* error codes
