---
increment: 0082-media-upload-pipeline
title: "Media Upload Pipeline"
type: refactor
priority: P1
status: in-progress
created: 2026-05-27
structure: user-stories
test_mode: TDD
coverage_target: 90
---

# Feature: Media Upload Pipeline

## Overview

媒体上传管道重构，统一错误处理，提取验证逻辑到可复用模块。

## Context

当前问题：
- `upload.ts` 仍使用 inline `getErrorMessage`
- 错误码不一致：`UNAUTHORIZED`, `NO_FILE`, `INVALID_TYPE`, `FILE_TOO_LARGE`, `LIMIT_REACHED` 等
- 验证逻辑与上传逻辑耦合，难以复用
- 没有独立的媒体上传测试

目标：
- 添加 `MEDIA_*` 错误码到 `ErrorCode` 枚举
- 提取 `validateMediaFile()` 函数到 `src/lib/media/`
- `upload.ts` 使用统一错误处理

## User Stories

### US-001: Media Error Codes (P1)
**Project**: TimorUp

**As a** developer
**I want** 媒体相关的标准错误码
**So that** 错误处理一致

**Acceptance Criteria**:
- [x] **AC-US1-01**: `MEDIA_NO_FILE` — 未提供文件
- [x] **AC-US1-02**: `MEDIA_TYPE_NOT_ALLOWED` — 文件类型不允许
- [x] **AC-US1-03**: `MEDIA_SIZE_TOO_LARGE` — 文件过大
- [x] **AC-US1-04**: `MEDIA_LIMIT_REACHED` — 达到媒体数量限制
- [x] **AC-US1-05**: `MEDIA_UPLOAD_ERROR` — 上传失败

---

### US-002: Media Validation Module (P1)
**Project**: TimorUp

**As a** developer
**I want** 可复用的媒体验证函数
**So that** 验证逻辑统一

**Acceptance Criteria**:
- [x] **AC-US2-01**: `validateMediaFile(file, limits)` — 验证文件类型和大小
- [x] **AC-US2-02**: `checkMediaCount(entityType, entityId)` — 检查媒体数量
- [x] **AC-US2-03**: `buildR2Key()` — R2 key 构建逻辑

---

### US-003: Upload Action Integration (P1)
**Project**: TimorUp

**As a** developer
**I want** upload.ts 使用统一错误处理
**So that** 代码重复减少

**Acceptance Criteria**:
- [x] **AC-US3-01**: `upload.ts` 使用 `@/lib/errors`
- [x] **AC-US3-02**: 移除 inline `getErrorMessage`
- [x] **AC-US3-03**: 使用新的 `validateMediaFile()`

---

### US-004: Tests (P1)
**Project**: TimorUp

**As a** developer
**I want** 媒体上传有测试覆盖
**So that** 重构不破坏现有行为

**Acceptance Criteria**:
- [x] **AC-US4-01**: `media-validator.test.ts` 存在
- [x] **AC-US4-02**: `validateMediaFile` 测试
- [x] **AC-US4-03**: all 468 tests pass

## Architecture

### 新文件

```
src/lib/media/
├── validator.ts       # validateMediaFile, checkMediaCount
├── validator.test.ts  # 单元测试
└── index.ts          # 导出
```

### MediaValidator 接口

```typescript
export interface MediaValidationResult {
  valid: boolean;
  isImage: boolean;
  isVideo: boolean;
  error?: {
    code: ErrorCode;
    message: string;
  };
}

export function validateMediaFile(
  file: File,
  limits: MediaLimits
): MediaValidationResult;

export function checkMediaCount(
  db: Database,
  entityType: string,
  entityId: string
): Promise<{ images: number; videos: number }>;
```

### 更新现有文件

- `src/lib/errors/errorCodes.ts` — 添加 MEDIA_* 错误码
- `src/actions/media/upload.ts` — 使用统一错误处理

## Dependencies

- `src/lib/errors/` — ErrorCode, createErrorResponse
- `src/lib/media-limits.ts` — MediaLimits
- `src/actions/media/upload.ts` — 需要更新

## Success Criteria

| Metric | Target |
|--------|--------|
| Duplicate getErrorMessage | 0 in media actions |
| Media error codes | 5+ MEDIA_* codes |
| Validation function | Reusable validateMediaFile |
| Tests | 460+ passing |
| Build | Success |
| Coverage | 90%+ on media validation |