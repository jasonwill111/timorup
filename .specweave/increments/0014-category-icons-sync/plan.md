# Implementation Plan: Category Icons Sync

## Overview

为分类页面添加图标系统，支持 emoji 和 Lucide icons，管理后台可编辑。

## Architecture

### Components

| Component | Purpose |
|-----------|---------|
| `IconRenderer.astro` | Renders emoji or Lucide SVG based on icon prefix |
| `CategoryCard.astro` | Displays category with icon (homepage/categories page) |
| `IconPicker.astro` | Admin component for selecting icons |
| `src/lib/icons.ts` | Icon utilities, icon sets, render logic |

### Data Model

Schema already has `icon TEXT` field in `categories` table.

**Icon Format**:
- `emoji:🍽️` - emoji mode
- `lucide:utensils` - Lucide icon mode
- `''` - no icon (fallback)

### API Contracts

No new APIs needed. Use existing category CRUD:
- `GET /api/admin/categories` - list with icons
- `PUT /api/admin/categories/:id` - update icon

## Technology Stack

- **Framework**: Astro
- **Icons**: @lucide/astro (already installed)
- **Database**: Drizzle ORM + D1

**Architecture Decisions**:

| Decision | Rationale |
|----------|-----------|
| Prefix string storage | Single TEXT field, no migration, easy queries |
| Lucide via @lucide/astro | Already in dependencies, consistent |
| Emoji native rendering | No library needed, cross-platform |
| Inline SVG | Better LCP than external icon fonts |

## Implementation Phases

### Phase 1: Icon Utilities
- Create `src/lib/icons.ts` with icon sets
- Add IconRenderer component
- Add render logic

### Phase 2: Admin Integration
- Add IconPicker to admin category form
- Wire up icon save/update

### Phase 3: Display Updates
- Update CategoryCard to show icons
- Update homepage categories section
- Update categories page

### Phase 4: Migration
- Update seed.sql with icons for all categories
- Ensure idempotency

## Testing Strategy

- Unit tests for icon parsing/rendering
- E2E tests for admin icon save
- Visual verification of homepage/categories pages

## Technical Challenges

### Challenge 1: Lucide SSR
**Solution**: Use @lucide/astro `<Icon>` component
**Risk**: Low - component handles SSR
