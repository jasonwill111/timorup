---
increment: 0014-category-icons-sync
title: Category Icons Sync
type: feature
priority: P1
status: completed
created: 2026-04-22T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Category Icons Sync

## Overview

为分类页面添加图标系统，支持 emoji 和 Lucide icons，管理后台可编辑。统一图标数据源，移除硬编码。

## User Stories

### US-001: Admin Sets Category Icons (P1)
**Project**: timorlist

**As a** admin
**I want** to set icons (emoji or Lucide) for each category in the admin panel
**So that** categories are visually distinctive and engaging

**Acceptance Criteria**:
- [x] **AC-US1-01**: Admin can select emoji from a predefined set in category edit form
- [x] **AC-US1-02**: Admin can select Lucide icon name from a dropdown
- [x] **AC-US1-03**: Icon choice persists in database `categories.icon` field
- [x] **AC-US1-04**: Icon is displayed in category list view after save

---

### US-002: Display Icons on Homepage (P1)
**Project**: timorlist

**As a** visitor
**I want** to see icons next to category names on the homepage
**So that** I can quickly identify category types visually

**Acceptance Criteria**:
- [x] **AC-US2-01**: Homepage categories section displays icons from database
- [x] **AC-US2-02**: Emoji icons render as emoji characters
- [x] **AC-US2-03**: Lucide icons render as SVG icons
- [x] **AC-US2-04**: Fallback icon displays if no icon is set

---

### US-003: Display Icons on Category Listing Page (P1)
**Project**: timorlist

**As a** visitor
**I want** to see icons on the category browsing page
**So that** categories are visually scannable

**Acceptance Criteria**:
- [x] **AC-US3-01**: Category listing page displays icons for all active categories
- [x] **AC-US3-02**: Icons align consistently with category names
- [x] **AC-US3-03**: Icons scale appropriately on mobile devices

---

### US-004: Migrate Existing Hardcoded Icons (P2)
**Project**: timorlist

**As a** system
**I want** to migrate existing hardcoded emoji icons to the database
**So that** all icons are managed through the unified system

**Acceptance Criteria**:
- [x] **AC-US4-01**: Seed script populates icon field for all existing categories
- [x] **AC-US4-02**: No duplicate icons after migration
- [x] **AC-US4-03**: Migration is idempotent (re-running doesn't change data)

## Functional Requirements

### FR-001: Icon Storage
- `categories.icon` field stores icon identifier (emoji char or Lucide icon name)
- Format: `emoji:<char>` or `lucide:<icon-name>`
- Default: empty string (no icon)

### FR-002: Icon Display Logic
- If icon starts with `emoji:`, render as text emoji
- If icon starts with `lucide:`, render Lucide SVG component
- If empty, render default placeholder icon

### FR-003: Admin Form
- Radio/select toggle between emoji and Lucide mode
- Emoji picker with common category-relevant emojis
- Lucide icon dropdown with search

### FR-004: Predefined Emoji Set
```
🍽️ Restaurants, 🏨 Hotels, 🛍️ Shopping, 💆 Health & Beauty,
🚗 Automotive, 💼 Professional Services, 📚 Education, 🎭 Entertainment,
🏢 Default/Other
```

### FR-005: Lucide Icon Options
```
utensils, bed, shopping-bag, heart, car, briefcase,
graduation-cap, music, building (default)
```

## Success Criteria

| Metric | Target |
|--------|--------|
| Homepage LCP | < 2.5s (icon SVG inlined) |
| Admin save latency | < 500ms |
| Icon coverage | 100% of categories have icons |
| Migration idempotency | Zero data corruption on re-run |

## Out of Scope

- Icon upload (file-based icons)
- Icon animation
- Custom icon colors per category
- Icon validation against category type

## Dependencies

- `0013-category-icons-sync` schema changes (already migrated)
- Admin category CRUD (existing)
- Homepage categories section (existing)
