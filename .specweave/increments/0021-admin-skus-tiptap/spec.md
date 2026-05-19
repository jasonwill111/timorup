---
increment: 0021-admin-skus-tiptap
title: Admin SKUs TipTap Editor
type: feature
priority: P2
status: completed
completed: 2026-04-30T00:00:00.000Z
created: 2026-04-30T00:00:00.000Z
structure: user-stories
test_mode: none
coverage_target: 0
---

# Feature: Admin SKUs TipTap Editor

## Overview

Admin SKUs description字段使用TipTap富文本编辑器替换plain textarea，支持加粗、斜体、列表等格式�?
## User Stories

### US-001: TipTap Editor in Admin SKUs
**Project**: TimorLink

**As an** admin **I want** to use a rich text editor for SKU descriptions **So that** I can create better formatted product descriptions

**Acceptance Criteria**:
- [x] **AC-US1-01**: TipTap editor replaces plain textarea for description field in `/admin/skus`
- [x] **AC-US1-02**: Editor toolbar includes: Bold, Italic, Underline, Heading (H1, H2), List (bullet/ordered), Blockquote, Link
- [x] **AC-US1-03**: Editor preserves HTML content when saving/loading
- [x] **AC-US1-04**: Placeholder text shows when editor is empty
- [x] **AC-US1-05**: Editor works in both Create and Edit modes

## Functional Requirements

### FR-001: TipTap Integration
- Install @tiptap/core, @tiptap/pm, @tiptap/starter-kit
- Use vanilla JS integration (no React dependency)
- Toolbar with essential formatting options
- SSR-compatible editor initialization

### FR-002: Form Integration
- Editor content synced to hidden input field for form submission
- Load existing description content when editing SKU
- Clear content on form reset

## Success Criteria

- [ ] pnpm build passes
- [ ] Editor renders correctly in browser
- [ ] Formatting commands work (bold, italic, lists, etc.)
- [ ] Content saves and loads correctly

## Out of Scope

- Image upload in editor
- AI content generation
- Advanced extensions (table, code block)
- Real-time collaboration

## Dependencies

- TipTap packages must be installed first

