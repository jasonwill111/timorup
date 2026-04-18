# Tasks: 0005-tiptap-rich-editor

**Increment**: 0005-tiptap-rich-editor
**Generated**: 2026-04-18
**Test Mode**: TDD (Red -> Green -> Refactor)
**Coverage Target**: Unit 95%, Integration 90%, E2E 100% of AC scenarios

---

## Phase 1: Blog Editor Integration

### T-001: Integrate TipTap in blog editor
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05, AC-US1-06, AC-US1-07
**Status**: [x] Completed

**Description**:
Integrated TipTap rich text editor directly in `blogs.astro` using CDN-based dynamic imports to avoid SSR build issues.

**Implementation Notes**:
- Used esm.sh CDN for TipTap imports (SSR-safe)
- Inline `initTipTapEditor()` function in Astro script
- TipTap CSS loaded via CDN link tag
- Editor syncs to hidden textarea for form submission
- Added global styles for ProseMirror editor

---

## Phase 2: Business About-Us Editor

### T-002: Integrate TipTap in business create page
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05
**Status**: [x] Completed

**Description**:
Replace the `<textarea id="aboutUs">` on business create page with a TipTap editor.

**Implementation Notes**:
- File: `src/pages/business/create.astro`
- Add TipTap CSS link and reuse `initTipTapEditor()` function from blogs.astro pattern
- Initialize editor with placeholder "Tell customers about your business..."
- Ensure form submission uses the synced textarea value

**Dependencies**: T-001

---

### T-003: Integrate TipTap in business edit page
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05
**Status**: [x] Completed

**Description**:
Replace the `<textarea id="aboutUs">` on business edit page with a TipTap editor.

**Implementation Notes**:
- File: `src/pages/business/[slug]/edit/index.astro`
- Add TipTap CSS link and reuse same pattern
- Pre-populate editor with existing content if available
- Ensure form submission uses the synced textarea value

**Dependencies**: T-002

---

## AC Coverage Summary

| AC-ID | Description | Covered By |
|-------|-------------|-----------|
| AC-US1-01 | Bold text formatting | T-001 |
| AC-US1-02 | Italic text formatting | T-001 |
| AC-US1-03 | H2 and H3 headings | T-001 |
| AC-US1-04 | Bullet and numbered lists | T-001 |
| AC-US1-05 | Adding links | T-001 |
| AC-US1-06 | Placeholder text | T-001 |
| AC-US1-07 | Content sync to textarea | T-001 |
| AC-US2-01 | Bold in about-us | T-002, T-003 |
| AC-US2-02 | Italic in about-us | T-002, T-003 |
| AC-US2-03 | Bullet lists in about-us | T-002, T-003 |
| AC-US2-04 | Placeholder in about-us | T-002, T-003 |
| AC-US2-05 | Content sync in about-us | T-002, T-003 |

---

## Phase Order & Dependency Graph

```
Phase 1: Blog Editor
  T-001: TipTap in blogs.astro        [completed]

Phase 2: Business Editor
  T-002: TipTap in create.astro      [blocked by T-001]
  T-003: TipTap in edit.astro         [blocked by T-002]
```
