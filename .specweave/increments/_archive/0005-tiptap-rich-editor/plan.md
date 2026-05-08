# Plan: TipTap Rich Text Editor Integration

## Design

### Architecture

```
src/
├── lib/
│   └── editor.ts              # Shared TipTap initialization utility
└── pages/
    ├── admin/
    │   └── blogs.astro        # Blog post editor
    └── business/
        ├── create.astro      # Business about-us editor
        └── [slug]/edit/
            └── index.astro   # Business edit about-us editor
```

### Key Decisions

1. **Vanilla JS Integration**: TipTap is framework-agnostic. Use vanilla JS `new Editor()` in `<script>` blocks, not React/Vue adapters.

2. **SSR-Safe Import**: TipTap uses browser APIs. Import in `<script>` blocks only, never in frontmatter.

3. **Content Sync Pattern**: Hidden textarea receives editor HTML on every update. Form submission uses textarea value.

4. **Single Init Function**: `initTipTapEditor(selector, options)` handles all editor instances.

### Editor Options

```typescript
interface TipTapOptions {
  placeholder?: string;
  onUpdate?: (html: string) => void;
}
```

### Extensions Used

- `@tiptap/starter-kit` — Bold, Italic, Headings, Lists
- `@tiptap/extension-link` — Link handling
- `@tiptap/extension-placeholder` — Placeholder text

## Rationale

- TipTap v3 is framework-agnostic, perfect for pure Astro
- Single init function ensures consistency across pages
- Hidden textarea pattern maintains compatibility with existing form submission
- No React/Vue islands = zero client-side bundle overhead for non-editor pages
