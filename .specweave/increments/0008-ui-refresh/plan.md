# Plan: UI Color & Layout Refresh

## Design

### Color System Updates

**Primary Color Change**: `#FFD150` → `#FFD700`
- More vibrant gold for better visibility
- Consistent across light and dark modes

**Dark Theme Palette**:
| Token | Old | New |
|-------|-----|-----|
| Background | `#0A0F1A` | `#1E1E2E` |
| Card | `#1e293b` | `#2A2A3E` |
| Muted | `#1e293b` | `#33334D` |
| Border | `#334155` | `#3A3A4E` |

### Component Architecture

```
src/
├── styles/
│   └── globals.css          # Color tokens (primary change)
├── layouts/
│   └── AdminLayout.astro   # Dark sidebar
├── components/
│   ├── Header.astro        # Search redesign
│   └── ui/
│       └── Card.astro      # Enhanced hover
└── pages/
    └── (business pages)    # Card grid improvements
```

## Implementation Phases

### Phase 1: CSS Variables (globals.css)
- Update primary to `#FFD700`
- Update dark theme colors
- Add card hover utilities

### Phase 2: Header & Search
- Floating search bar design
- Category pill filters

### Phase 3: Cards
- Rounded-xl corners
- Hover lift effect
- Shadow transitions

### Phase 4: Admin Sidebar
- Dark background `#1E1E2E`
- Icon navigation
- Active state styling

## Technology Stack

- **Styling**: TailwindCSS v4
- **Fonts**: Inter (body), Oswald (headings) - existing
- **Icons**: Lucide - existing

## Rationale

### Why `#FFD700` instead of `#FFD150`?
- Higher saturation for better visibility on dark backgrounds
- More "golden" appearance matching the logo
- Better contrast ratios for accessibility

### Why `#1E1E2E` for dark background?
- Softer than pure black
- Reduces eye strain
- Better perceived depth with cards
