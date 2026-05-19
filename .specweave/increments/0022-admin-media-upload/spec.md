---
increment: 0022-admin-media-upload
title: Admin Media Upload UI
type: feature
priority: P1
status: completed
created: 2026-05-01T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin Media Upload UI

## Overview

Add image upload UI to Admin Categories and Heroes pages.

---

## User Stories

### US-001: Add Image Upload to Admin Categories
**Project**: TimorLink

**As a** admin user
**I want** to upload images for categories
**So that** I don't need to manually enter image URLs

**Acceptance Criteria**:
- [x] **AC-US1-01**: Upload button appears in category form (replaces text input)
- [x] **AC-US1-02**: Image preview displays after upload
- [x] **AC-US1-03**: Remove button clears uploaded image
- [x] **AC-US1-04**: Existing category images load correctly in edit mode

---

### US-002: Add Image Upload to Admin Heroes
**Project**: TimorLink

**As a** admin user
**I want** to upload images for hero banners
**So that** I don't need to manually enter image URLs

**Acceptance Criteria**:
- [x] **AC-US2-01**: Upload button appears in hero form (replaces text input)
- [x] **AC-US2-02**: Image preview displays after upload
- [x] **AC-US2-03**: Remove button clears uploaded image
- [x] **AC-US2-04**: Existing hero images load correctly in edit mode

---

## Technical Notes

- Use existing `/api/media/upload` endpoint
- Follow pattern from `admin/skus.astro` and `admin/blogs.astro`
- Upload folder: `category` for categories, `hero` for heroes
- Single image only (not multiple/gallery)

