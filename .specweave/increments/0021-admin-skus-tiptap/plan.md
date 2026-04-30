# Implementation Plan: Admin SKUs TipTap Editor

## Overview

Replace plain textarea with TipTap rich text editor for SKU descriptions in admin panel.

## Architecture

### Components
- **TipTapEditor**: Vanilla JS editor component (no React)
- **EditorToolbar**: Formatting buttons (Bold, Italic, Lists, etc.)
- **HiddenInput**: Sync editor content for form submission

### Data Flow
```
User types → TipTap updates → Hidden input value updated → Form submit → API saves HTML
Edit SKU → Load description → TipTap setContent() → User edits → Save
```

## Technology Stack

- **Core**: @tiptap/core, @tiptap/pm, @tiptap/starter-kit
- **Extensions**: @tiptap/extension-underline, @tiptap/extension-link, @tiptap/extension-placeholder
- **Integration**: Vanilla JS (Astro script blocks)
- **Icons**: Inline SVG (no extra dependency)

## Implementation Phases

### Phase 1: Package Installation
- Install TipTap core packages
- Verify build works

### Phase 2: Editor Component
- Create TipTap editor instance in skus.astro
- Implement toolbar with essential formatting
- Add CSS for ProseMirror styling

### Phase 3: Form Integration
- Sync editor content to hidden input
- Load existing content on edit
- Handle create/reset scenarios

## Testing Strategy

- Manual testing via browser
- Verify formatting commands work
- Verify save/load cycle works

## Technical Challenges

### Challenge 1: SSR Compatibility
**Solution**: Initialize editor in client-side script only, use `immediatelyRender: false` for vanilla
**Risk**: Low

### Challenge 2: Form Submission
**Solution**: Use hidden input synced with editor onChange
**Risk**: Low