---
increment: 0004-ui-components-astro-migration
title: UI Components Migration - Pure Astro
type: refactor
priority: P1
status: completed
created: 2026-04-18T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 100
---

# Feature: 0004-ui-components-astro-migration

## Overview

Migrate all React/shadcn UI components to pure Astro `.astro` files. This is Phase 2 of the Reactâ†’Astro migration.

## Components to Migrate

| Component | File | Migration Strategy |
|-----------|------|-------------------|
| Button | `button.tsx` â†?`button.astro` | Native `<button>` with TailwindCSS |
| Input | `input.tsx` â†?`input.astro` | Native `<input>` with TailwindCSS |
| Card | `card.tsx` â†?`card.astro` | Styled `<div>` with TailwindCSS |
| Label | `label.tsx` â†?`label.astro` | Native `<label>` with TailwindCSS |
| Textarea | `textarea.tsx` â†?`textarea.astro` | Native `<textarea>` with TailwindCSS |
| Select | `select.tsx` â†?`select.astro` | Native `<select>` with TailwindCSS |
| Badge | `badge.tsx` â†?`badge.astro` | Styled `<span>` with TailwindCSS |
| Avatar | `avatar.tsx` â†?`avatar.astro` | HTML/CSS implementation |
| Skeleton | `skeleton.tsx` â†?`skeleton.astro` | Simple div with `animate-pulse` |
| Tabs | `tabs.tsx` â†?`tabs.astro` | Native HTML + CSS + vanilla JS |
| Accordion | `accordion.tsx` â†?`accordion.astro` | Native `<details>/<summary>` |
| Pagination | `pagination.tsx` â†?`pagination.astro` | Astro component with inline script |
| ThemeToggle | `theme-toggle.tsx` â†?`theme-toggle.astro` | Vanilla JS with nanostores |

## User Stories

### US-001: Migrate Basic Input Components
**Project**: TimorLink

**As a** developer
**I want** to migrate basic input components (Button, Input, Label, Textarea, Select)
**So that** forms work without React dependencies

**Acceptance Criteria**:
- [x] **AC-US4-01**: Button.astro created with all variants (default, destructive, outline, secondary, ghost, link)
- [x] **AC-US4-02**: Input.astro created with proper styling
- [x] **AC-US4-03**: Label.astro created with proper styling
- [x] **AC-US4-04**: Textarea.astro created with proper styling
- [x] **AC-US4-05**: Select.astro created with proper styling
- [x] **AC-US4-06**: All components support size variants (default, sm, lg, icon)

### US-002: Migrate Display Components
**Project**: TimorLink

**As a** developer
**I want** to migrate display components (Card, Badge, Avatar, Skeleton)
**So that** content display works without React dependencies

**Acceptance Criteria**:
- [x] **AC-US4-07**: Card.astro created with CardHeader, CardContent, CardFooter, CardTitle, CardDescription
- [x] **AC-US4-08**: Badge.astro created with all variants
- [x] **AC-US4-09**: Avatar.astro created with image and fallback support
- [x] **AC-US4-10**: Skeleton.astro created with animate-pulse

### US-003: Migrate Interactive Components
**Project**: TimorLink

**As a** developer
**I want** to migrate interactive components (Tabs, Accordion, Pagination, ThemeToggle)
**So that** user interactions work without React dependencies

**Acceptance Criteria**:
- [x] **AC-US4-11**: Tabs.astro created with Tabs, TabsList, TabsTrigger, TabsContent
- [x] **AC-US4-12**: Accordion.astro created with SimpleAccordion pattern
- [x] **AC-US4-13**: Pagination.astro created with page navigation
- [x] **AC-US4-14**: ThemeToggle.astro created with vanilla JS

### US-004: Delete Old React Components
**Project**: TimorLink

**As a** developer
**I want** to delete all old React component files
**So that** no React code remains in the components directory

**Acceptance Criteria**:
- [x] **AC-US4-15**: All .tsx files in src/components/ui/ deleted
- [x] **AC-US4-16**: cn() utility retained for class merging

## Dependencies

- 0003-deps-cleanup-react-removal (must be completed first)

## Out of Scope

- Feature components migration (Phase 3: 0005)
- RichTextEditor migration (Phase 3: 0005)
- Toast system migration (Phase 4: 0006)
- Page updates (Phase 5: 0007)

## Migration Strategy

### Button Component
```astro
---
interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const { variant = 'default', size = 'default', class: className = '', type = 'button', disabled = false, ...props } = Astro.props;
---
<button type={type} disabled={disabled} class:list={[/* tailwind classes */]} {...props}>
  <slot />
</button>
```

### Tabs Component (Native HTML + Vanilla JS)
```astro
---
// Tabs.astro - server-side props
interface Props {
  defaultValue?: string;
  class?: string;
}
const { defaultValue = '', class: className = '' } = Astro.props;
---
<div class:list={['tabs', className]} data-default-value={defaultValue}>
  <slot />
</div>

<script>
  // Client-side tab switching
</script>
```

### Accordion Component (Native HTML)
```astro
---
interface AccordionItem {
  id: string;
  title: string;
  content: string;
}
interface Props {
  items: AccordionItem[];
  class?: string;
}
const { items, class: className = '' } = Astro.props;
---
<div class:list={['accordion', className]}>
  {items.map(item => (
    <details>
      <summary>{item.title}</summary>
      <div set:html={item.content} />
    </details>
  ))}
</div>
```

