# Implementation Plan: 0004-ui-components-astro-migration

## Overview

Migrate all React/shadcn UI components to pure Astro `.astro` files using TailwindCSS. This is Phase 2 of the React→Astro migration.

## Architecture Decisions

### Decision 1: Native HTML Elements Over React
**Rationale**: Astro supports native HTML elements with server-side rendering. No need for React for simple UI components.
**Alternatives considered**: Preact (too similar to React), vanilla JS (less ergonomic for complex components)

### Decision 2: TailwindCSS for Styling
**Rationale**: Already using TailwindCSS v4. No need for CSS-in-JS or component libraries.
**Alternatives considered**: CSS modules (more verbose), styled-components (requires JS runtime)

### Decision 3: Vanilla JS for Interactivity
**Rationale**: Astro supports `<script>` tags with client-side JS. No need for React for event handling.
**Alternatives considered**: nanostores for state (overkill for simple tabs), Alpine.js (adds dependency)

### Decision 4: Native `<details>/<summary>` for Accordion
**Rationale**: Native HTML accordion with built-in accessibility. No JS required for basic functionality.
**Alternatives considered**: Custom JS implementation (unnecessary complexity)

## Component Architecture

### Button Component Pattern
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

const variants = {
  default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};
---
<button
  type={type}
  disabled={disabled}
  class:list={[
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  ]}
  {...props}
>
  <slot />
</button>
```

### Tabs Component Pattern (with Vanilla JS)
```astro
---
interface Props {
  defaultValue?: string;
  class?: string;
}

const { defaultValue = '', class: className = '' } = Astro.props;
---
<div class:list={['tabs', className]} data-tabs="">
  <div data-tab-list="">
    <slot name="list" />
  </div>
  <div data-tab-panels="">
    <slot />
  </div>
</div>

<script>
  // Tab switching logic
</script>
```

### Accordion Component Pattern (Native HTML)
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
  {items.map((item) => (
    <details>
      <summary>{item.title}</summary>
      <div class="py-4" set:html={item.content} />
    </details>
  ))}
</div>

<style>
  details[open] summary svg {
    transform: rotate(180deg);
  }
</style>
```

## Implementation Phases

### Phase 1: Basic Input Components
- Button, Input, Label, Textarea, Select
- Pure TailwindCSS, no JS needed

### Phase 2: Display Components
- Card (with subcomponents), Badge, Avatar, Skeleton
- Pure TailwindCSS, no JS needed

### Phase 3: Interactive Components
- Tabs (vanilla JS script)
- Accordion (native HTML)
- Pagination (vanilla JS script)
- ThemeToggle (vanilla JS + lucide icons)

### Phase 4: Cleanup
- Delete old .tsx files
- Update imports in pages
- Run build verification

## Technical Challenges

### Challenge 1: Controlled vs Uncontrolled Components
**Problem**: React components often use controlled inputs with state.
**Solution**: Astro components use native HTML forms. Use `formaction`, `formenctype`, etc. for form handling.
**Risk**: Low - this is the standard Astro pattern

### Challenge 2: Tabs State Management
**Problem**: Need to track active tab without React state.
**Solution**: Use `data-active` attributes and vanilla JS to toggle visibility.
**Risk**: Medium - need to ensure accessibility (ARIA attributes)

### Challenge 3: Theme Persistence
**Problem**: Theme needs to persist across page navigations.
**Solution**: Use localStorage and a class on `<html>` element. Inline script in Layout.astro handles initial theme.
**Risk**: Low - this is a well-established pattern

## Testing Strategy

1. **Visual Testing**: Use `pnpm dev` to verify component rendering
2. **Build Testing**: `pnpm build` to ensure no TypeScript/import errors
3. **Interaction Testing**: Manual testing of Tabs, Accordion, ThemeToggle
