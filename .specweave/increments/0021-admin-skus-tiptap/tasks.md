# Tasks: Admin SKUs TipTap Editor

## Phase 1: Setup

### T-001: Install TipTap packages
**Description**: Install @tiptap/core, @tiptap/pm, @tiptap/starter-kit and extensions

**References**: AC-US1-01

**Implementation**:
```bash
pnpm add @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-placeholder
```

**Dependencies**: None
**Status**: [x] completed

---

## Phase 2: Implement TipTap Editor

### T-002: Add TipTap to admin/skus.astro
**Description**: Replace textarea with TipTap editor, add toolbar and form integration

**References**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05

**Implementation**:
- Replace `<textarea id="sku-description">` with TipTap editor container
- Add toolbar HTML with formatting buttons
- Initialize TipTap with StarterKit + extensions
- Sync content to hidden input for form submission
- Add CSS for ProseMirror styling

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Create mode | Admin opens create modal | Editor initializes | Placeholder visible, empty |
| TC-002: Edit mode | Admin edits existing SKU | Modal opens | Existing description loads in editor |
| TC-003: Bold formatting | User selects text | Click Bold button | Text becomes bold |
| TC-004: List formatting | User clicks UL button | Type and enter | Bullet list created |
| TC-005: Save | User fills form | Click Save | HTML content saved to DB |
| TC-006: Form reset | Create new SKU | Cancel then create | Editor cleared |

**Dependencies**: T-001
**Status**: [x] completed

---

## Phase 3: Verification

### T-003: Build and test
**Description**: Verify build passes and editor works in browser

**Implementation**:
- Run `pnpm build`
- Test in browser with agent-browser

**Dependencies**: T-002
**Status**: [x] completed

---

## Summary

| Task | Status |
|------|--------|
| T-001 Install packages | [x] completed |
| T-002 Implement TipTap | [x] completed |
| T-003 Build and test | [x] completed |