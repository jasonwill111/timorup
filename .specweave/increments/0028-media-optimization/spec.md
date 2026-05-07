---
increment: 0028-media-optimization
title: Media Upload Optimization
type: feature
priority: P1
status: completed
created: 2026-05-07T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Media Upload Optimization

## Overview

Refactor media upload system to use client-side Canvas compression, SHA256 deduplication, and a structured R2 folder hierarchy for better organization and cost optimization.

## Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Compression | Canvas API (client-side) | Fast (<0.5s), no WASM bundle |
| Output format | WebP | 60-80% smaller than PNG/JPEG |
| Deduplication | SHA256 content hash | 100% accurate, 32 bytes/file |
| Image limit | 2MB | Compressed WebP fits easily |
| Video limit | 5MB | No transcoding in V1 |
| Folder structure | Hierarchical by entity | Easy cleanup on delete |

## R2 Storage Structure

```
MEDIA_BUCKET/
├── general/                         # logos, favicons, banners
├── listings/
│   ├── business/{biz_id}/
│   │   ├── profile.jpg              # Profile image
│   │   ├── banner.jpg              # Banner image
│   │   ├── gallery/                # Gallery images
│   │   ├── sku-{sku_id}/          # SKU images (isolated)
│   │   └── updates/               # Update images
│   └── nonprofit/{org_id}/
│       ├── profile.jpg
│       ├── banner.jpg
│       ├── gallery/
│       └── updates/
├── blogs/{blog_id}/
│   └── {uuid}.jpg                  # Blog media
└── pages/{slug}/
    └── {uuid}.jpg                  # Landing page media
```

## File Size Limits

| Type | Limit | Format |
|------|-------|--------|
| Image | 2 MB | WebP output |
| Video | 5 MB | Original format |

## Compression Settings

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Max dimension | 1920 px | Web-ready size |
| Quality | 85% | Good balance |
| Output | WebP | Best compression |

## User Stories

### US-001: Image Upload with Compression
**Project**: timorlist

**As a** business owner
**I want** to upload images that are automatically compressed to WebP
**So that** upload is fast and storage is optimized

**Acceptance Criteria**:
- [x] **AC-US1-01**: Client compresses images using Canvas API before upload
- [x] **AC-US1-02**: Output format is WebP with 85% quality
- [x] **AC-US1-03**: Images larger than 2MB are rejected with clear error
- [x] **AC-US1-04**: Compression happens in <500ms for 2MB images

### US-002: SHA256 Deduplication
**Project**: timorlist

**As a** system
**I want** to detect duplicate files by content hash
**So that** same image uploaded twice only stores once

**Acceptance Criteria**:
- [x] **AC-US2-01**: Calculate SHA256 hash client-side before upload
- [x] **AC-US2-02**: Check hash against existing files in DB
- [x] **AC-US2-03**: If duplicate, return existing media ID instead of uploading
- [x] **AC-US2-04**: Hash field added to media table schema

### US-003: Structured R2 Folders
**Project**: timorlist

**As a** system
**I want** to organize media in hierarchical folders by entity
**So that** deleting a business also cleans up all its media

**Acceptance Criteria**:
- [x] **AC-US3-01**: Business media stored in `listings/business/{id}/`
- [x] **AC-US3-02**: SKU images stored in `listings/business/{id}/sku-{sku_id}/`
- [x] **AC-US3-03**: Nonprofit media stored in `listings/nonprofit/{id}/`
- [x] **AC-US3-04**: Blog media stored in `blogs/{id}/`
- [x] **AC-US3-05**: General files stored in `general/`

### US-004: Admin Media Management
**Project**: timorlist

**As an** admin
**I want** to view and manage all media files
**So that** I can clean up unused files and monitor storage

**Acceptance Criteria**:
- [x] **AC-US4-01**: Admin page at `/admin/media` shows all media
- [x] **AC-US4-02**: Filter by entity type (business, nonprofit, blog, page)
- [x] **AC-US4-03**: Filter by entity (specific business, etc.)
- [x] **AC-US4-04**: Delete individual media files
- [x] **AC-US4-05**: Bulk delete by entity (deferred to V2)

### US-005: Video Upload
**Project**: timorlist

**As a** business owner
**I want** to upload video files up to 5MB
**So that** I can showcase products and services

**Acceptance Criteria**:
- [x] **AC-US5-01**: Videos up to 5MB can be uploaded
- [x] **AC-US5-02**: Videos larger than 5MB are rejected
- [x] **AC-US5-03**: Video files stored in same structure as images
- [x] **AC-US5-04**: Videos displayed with native HTML5 video player

## Dependencies

- Existing R2 bucket (MEDIA_BUCKET binding)
- Existing D1 database (timorlist-db)
- Existing auth system (better-auth)

## Out of Scope

- Server-side video transcoding
- Automatic thumbnail generation
- Cloudflare Images migration
- Media CDN optimization (variants)
