---
increment: 0005-tiptap-rich-editor
title: TipTap Rich Text Editor Integration
type: feature
priority: P1
status: completed
created: 2026-04-18T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
completed: 2026-04-18T00:00:00.000Z
---

# Feature: TipTap Rich Text Editor Integration

## Overview

Integrate TipTap framework-agnostic rich text editor for blog posts and business about-us content. Replaces static textareas with a WYSIWYG editor supporting headings, lists, bold, italic, and links.

---

## User Stories

### US-001: Blog Content Editing (P1)
**Project**: timorlist

**As a** admin user
**I want** to write blog posts with rich formatting
**So that** I can create engaging content with proper structure

**Acceptance Criteria**:
- [x] **AC-US1-01**: Blog post editor supports bold text formatting (Ctrl+B)
- [x] **AC-US1-02**: Blog post editor supports italic text formatting (Ctrl+I)
- [x] **AC-US1-03**: Blog post editor supports H2 and H3 headings
- [x] **AC-US1-04**: Blog post editor supports bullet and numbered lists
- [x] **AC-US1-05**: Blog post editor supports adding links to text
- [x] **AC-US1-06**: Blog post editor has a placeholder text when empty
- [x] **AC-US1-07**: Editor content is synced to the underlying textarea for form submission

### US-002: Business About-Us Editing (P1)
**Project**: timorlist

**As a** business owner
**I want** to write my business description with rich formatting
**So that** I can create an engaging about-us page

**Acceptance Criteria**:
- [x] **AC-US2-01**: Business about-us editor supports bold text formatting
- [x] **AC-US2-02**: Business about-us editor supports italic text formatting
- [x] **AC-US2-03**: Business about-us editor supports bullet lists
- [x] **AC-US2-04**: Business about-us editor has a placeholder text when empty
- [x] **AC-US2-05**: Editor content is synced to the underlying textarea for form submission

### US-003: Editor Integration (P1)
**Project**: timorlist

**As a** developer
**I want** TipTap integrated using SSR-safe CDN imports
**So that** I can add editors without build errors

**Acceptance Criteria**:
- [x] **AC-US3-01**: TipTap loaded via esm.sh CDN (SSR-safe)
- [x] **AC-US3-02**: Function accepts custom placeholder text per instance
- [x] **AC-US3-03**: Editors work on blog and business pages

---

## Implementation Summary

### Files Changed
- `src/pages/admin/blogs.astro` - Added TipTap editor for blog content
- `src/pages/business/create.astro` - Added TipTap editor for about-us
- `src/pages/business/[slug]/edit/index.astro` - Added TipTap editor for about-us

### Technical Approach
- Used esm.sh CDN for TipTap imports (SSR-safe dynamic imports)
- Inline `initTipTapEditor()` function in each Astro script
- Hidden textarea syncs editor content for form submission
- TipTap CSS loaded via CDN link tag
- Global styles for ProseMirror editor in `<style is:global>`

### Extensions Used
- StarterKit (bold, italic, headings, lists)
- Link extension (add links)
- Placeholder extension (placeholder text)

---

## Success Criteria

- [x] All blog posts can be created with rich formatting
- [x] All business about-us sections support rich formatting
- [x] Build passes without errors
- [x] All 117 unit tests pass

---

## Out of Scope

- Image upload in editor (handled separately via media library)
- Code blocks or blockquotes
- Mobile-optimized toolbar

---

## Dependencies

- TipTap v3.x installed (already in package.json)
- Blog admin page exists (`src/pages/admin/blogs.astro`)
- Business create/edit pages exist
