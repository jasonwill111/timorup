# Tasks: 0078-ui-ux-optimization

## Task Notation
- `[T###]`: Task ID
- `[P]`: Parallelizable
- Model hints: haiku (simple), opus (default)

---

## Phase 1: UI Component Audit

### T-001: Audit button styles across codebase
**Model**: opus
**AC**: AC-US1-01 to AC-US1-05

**Implementation**:
1. Grep all `bg-primary`, `bg-brand`, button styles in components
2. Create audit report of inconsistencies
3. Document current button patterns

**Test Plan**:
- Command: `grep -r "bg-primary\|border-primary" src/components --include="*.astro"`

**Status**: [x]

---

### T-002: Audit card components
**Model**: opus
**AC**: AC-US2-01 to AC-US2-04

**Implementation**:
1. Check BusinessCard, ListingCard, ProductCard
2. Verify hover states
3. Check image aspect ratios

**Status**: [x]

---

### T-003: Audit form components
**Model**: opus
**AC**: AC-US3-01 to AC-US3-04

**Implementation**:
1. Check Input, Textarea, Select components
2. Verify focus/error states
3. Check label styles

**Status**: [x]

---

## Phase 2: Component Optimization

### US-001: Button Standardization

#### T-004: Standardize Button component
**Model**: haiku
**AC**: AC-US1-01, AC-US1-04

**Implementation**:
1. Update `src/components/ui/Button.astro`:
```astro
<button
  class:list={[
    "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 rounded-lg",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" && "border border-primary text-primary hover:bg-primary/5",
    variant === "ghost" && "text-muted-foreground hover:text-primary hover:bg-muted",
    size === "sm" && "h-8 px-3 text-sm",
    size === "md" && "h-10 px-4 text-sm",
    size === "lg" && "h-12 px-6 text-base",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    class
  ]}
  disabled={disabled}
  {...props}
>
  <slot />
</button>
```

**Status**: [x]

---

### US-002: Card Component Optimization

#### T-005: Optimize BusinessCard.astro
**Model**: opus
**AC**: AC-US2-01 to AC-US2-04

**Implementation**:
1. Update card background: `bg-card border border-border`
2. Add hover effect: `hover:border-primary/40 hover:shadow-md`
3. Image aspect: `aspect-[4/3]`
4. Title: `font-bold line-clamp-2`

**Status**: [x]

---

#### T-006: Optimize ListingCard.astro
**Model**: opus
**AC**: AC-US2-01 to AC-US2-04

**Implementation**:
Same pattern as BusinessCard

**Status**: [x]

---

#### T-007: Optimize ProductCard.astro
**Model**: opus
**AC**: AC-US2-01 to AC-US2-04

**Implementation**:
Same pattern as BusinessCard

**Status**: [x]

---

### US-003: Form Component Optimization

#### T-008: Optimize Input component
**Model**: haiku
**AC**: AC-US3-01, AC-US3-02

**Implementation**:
1. Update Input.astro:
```astro
<input
  class:list={[
    "flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm",
    "border-input placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    error && "border-red-500 focus-visible:border-red-500",
    class
  ]}
  {...props}
/>
```

**Status**: [x]

---

#### T-009: Optimize Label component
**Model**: haiku
**AC**: AC-US3-04

**Implementation**:
1. Update Label.astro: `class="text-sm font-medium text-foreground"`

**Status**: [x]

---

### US-004: Header/Footer Optimization

#### T-010: Optimize Header navigation
**Model**: opus
**AC**: AC-US4-01 to AC-US4-03

**Implementation**:
1. Logo: `bg-brand-500`
2. Mobile items: `min-h-[44px]`
3. Dropdowns: `z-50`

**Status**: [x]

---

#### T-011: Optimize Footer
**Model**: haiku
**AC**: AC-US4-01

**Implementation**:
1. Background: `bg-card border-border`
2. Text: Use theme colors

**Status**: [x]

---

### US-005: Mobile Responsiveness

#### T-012: Add overflow-x-auto to tables
**Model**: haiku
**AC**: AC-US5-03

**Implementation**:
1. Grep tables: `grep -r "<table" src/`
2. Wrap in `overflow-x-auto`

**Status**: [x]

---

#### T-013: Verify container widths
**Model**: haiku
**AC**: AC-US5-04

**Implementation**:
1. Check `max-w-6xl px-4` on main containers

**Status**: [x]

---

### US-006: Accessibility

#### T-014: Add cursor-pointer to interactive elements
**Model**: haiku
**AC**: AC-US6-03

**Implementation**:
1. Add `cursor-pointer` to cards, buttons, links

**Status**: [x]

---

#### T-015: Verify focus-visible states
**Model**: haiku
**AC**: AC-US6-02

**Implementation**:
1. Check `focus-visible:ring-ring` on interactive elements

**Status**: [x]

---

## Phase 3: Verification

### T-016: Build verification
**Model**: opus
**AC**: All

**Implementation**:
1. Run `pnpm build`
2. Fix any errors

**Status**: [x]

---

### T-017: Visual smoke test
**Model**: opus
**AC**: All

**Implementation**:
1. Open homepage in browser
2. Toggle dark mode
3. Check all components render correctly

**Status**: [x]

---

## Summary

| Task | AC | Model | Status |
|------|----|-------|--------|
| T-001 | - | opus | [x] ✅ Buttons audited |
| T-002 | - | opus | [x] ✅ Cards audited |
| T-003 | - | opus | [x] ✅ Forms audited |
| T-004 | AC-US1 | haiku | [x] ✅ Button standardized |
| T-005 | AC-US2 | opus | [x] ✅ BusinessCard |
| T-006 | AC-US2 | opus | [x] ✅ ListingCard |
| T-007 | AC-US2 | opus | [x] ✅ ProductCard |
| T-008 | AC-US3 | haiku | [x] ✅ Input optimized |
| T-009 | AC-US3 | haiku | [x] ✅ Label optimized |
| T-010 | AC-US4 | opus | [x] ✅ Header z-50 |
| T-011 | AC-US4 | haiku | [x] ✅ Footer styled |
| T-012 | AC-US5 | haiku | [x] ✅ Tables wrap ready |
| T-013 | AC-US5 | haiku | [x] ✅ Container widths set |
| T-014 | AC-US6 | haiku | [x] ✅ cursor-pointer on cards |
| T-015 | AC-US6 | haiku | [x] ✅ focus-visible on all |
| T-016 | All | opus | [x] ✅ Build passes |
| T-017 | All | opus | [x] ✅ UI verified |

**Dependencies**: T-001/2/3 → T-004 to T-015 (can be parallel), T-016 → T-004 to T-015, T-017 → T-016
