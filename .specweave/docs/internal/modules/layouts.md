# layouts

**Path**: `src/layouts`

## Purpose

Astro page layouts with theme, header, and footer.

## Layout Files

| File | Purpose |
|------|---------|
| `Layout.astro` | Main layout (theme, header, footer) |
| `AdminLayout.astro` | Admin dashboard layout |

## Layout Structure

```
src/layouts/
├── Layout.astro         # Main site layout
│   ├── Theme script (localStorage)
│   ├── CSS animations
│   ├── Header component
│   └── Footer component
└── AdminLayout.astro    # Admin dashboard
    ├── Sidebar navigation
    └── Content area
```

## Theme System

```astro
---
// Layout.astro
const theme = Astro.cookies.get('theme')?.value || 'light';
---
<html data-theme={theme}>
```

### CSS Variables

```css
:root {
  --color-background: #FDFBF7;
  --color-foreground: #141413;
  --color-primary: #FFD150;
  --color-card: #ffffff;
}
[data-theme="dark"] {
  --color-background: #0F1A2E;
  --color-foreground: #E8E6DC;
  --color-card: #152236;
}
```

## Header

- Logo + navigation
- Theme toggle (light/dark)
- Search bar
- Mobile menu

## Footer

- Site links
- Social media
- Copyright

## Analysis Summary

- **Files Analyzed**: 2
- **Source Files**: 2
- **Test Files**: 0

---
*Updated 2026-05-31*
