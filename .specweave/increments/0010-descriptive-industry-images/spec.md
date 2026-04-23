---
increment: 0010-descriptive-industry-images
title: Descriptive Industry Images
type: feature
priority: P1
status: completed
created: 2026-04-19T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Descriptive Industry Images

## Overview

Replace emoji icons with descriptive images for industry categories. Images should be small/compact (thumbnail size) and displayed inline with the industry name on a single line.

---

## User Stories

### US-001: Industry Image Display (P1)
**Project**: timorlist

**As a** a visitor browsing categories
**I want** to see small descriptive images for each industry
**So that** I can quickly identify categories at a glance

**Acceptance Criteria**:
- [x] **AC-US1-01**: Industry cards show image thumbnail (max 32x32px or similar small size)
- [x] **AC-US1-02**: Image and name are on the same horizontal line (flex row)
- [x] **AC-US1-03**: Fallback icon shown if no image exists
- [x] **AC-US1-04**: Images are visually descriptive (clear, recognizable icons/logos)

### US-002: Admin Image Upload (P1)
**Project**: timorlist

**As an** admin managing categories
**I want** to upload descriptive images for industries
**So that** the public facing page shows appropriate visuals

**Acceptance Criteria**:
- [x] **AC-US2-01**: Admin form has image upload field for categories (icon field exists)
- [x] **AC-US2-02**: Preview of uploaded image shown before save
- [x] **AC-US2-03**: Image URL stored in database

---

## Technical Approach

### Frontend Changes
1. **categories.astro**: Update card layout to show image + name inline
   - Use flex row with items-center
   - Small image size (w-10 h-10 rounded-full)
   - Name next to image

2. **Admin categories form**: Add image upload
   - Add file input for image
   - Show image preview
   - Save image URL to category record

### Files to Modify
- `src/pages/categories.astro` - Display layout
- `src/pages/admin/categories.astro` - Image upload form

---

## Out of Scope
- Image optimization/resizing (use as-is)
- Category image CDN/storage changes

---

## Dependencies
- None (uses existing media infrastructure)
