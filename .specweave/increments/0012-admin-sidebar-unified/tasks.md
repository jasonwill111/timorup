# Tasks: Admin Sidebar Unified Theme

## Phase 1: Theme Initialization & Sync

### T-001: Add inline theme script to AdminLayout
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [x] completed

**Test**: Given admin page loads → When no localStorage theme → Then theme matches system preference without flash

**Implementation**:
```typescript
// AdminLayout.astro - add in <head> before CSS
<script is:inline>
  const theme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

**Dependencies**: None

---

### T-002: Update theme toggle to use unified state
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03 | **Status**: [x] completed

**Test**: Given theme toggle clicked → When on desktop sidebar or mobile header → Then entire page theme changes

**Implementation**: Both toggles call same function that:
1. Reads current theme from `document.documentElement.classList.contains('dark')`
2. Toggles the class
3. Saves to localStorage

**Dependencies**: T-001

---

## Phase 2: Consistent Styling

### T-003: Update sidebar background to use bg-card
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02 | **Status**: [x] completed

**Test**: Given desktop sidebar → When theme is light/dark → Then background matches content area

**Dependencies**: T-001

---

### T-004: Verify mobile header uses bg-card
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed

**Test**: Given mobile header → When theme toggles → Then header background syncs with sidebar

**Dependencies**: T-002

---

### T-005: Update active nav indicator
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed

**Test**: Given current page → When nav renders → Then active item has bg-primary indicator

**Dependencies**: T-003

---

### T-006: Audit admin pages for inconsistent backgrounds
**User Story**: US-002 | **Satisfies ACs**: AC-US2-04 | **Status**: [x] completed

**Test**: Given admin pages → When inspected → Then all use bg-card for content containers

**Files to check**: admin/index.astro, admin/users.astro, admin/businesses.astro, admin/heroes.astro, etc.

**Dependencies**: T-003

---

## Phase 3: Mobile Sidebar UX

### T-007: Add sidebar overlay animation
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Test**: Given hamburger tapped → When sidebar opens → Then slides in 200ms ease-out

```css
.sidebar-overlay {
  transform: translateX(-100%);
  transition: transform 200ms ease-out;
}
.sidebar-overlay.open {
  transform: translateX(0);
}
```

**Dependencies**: T-001

---

### T-008: Implement backdrop dismiss
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Test**: Given sidebar open → When backdrop tapped → Then sidebar closes

**Dependencies**: T-007

---

### T-009: Ensure touch targets meet 44px minimum
**User Story**: US-003 | **Satisfies ACs**: AC-US3-04 | **Status**: [x] completed

**Test**: Given mobile nav links → When measured → Then all >= 44x44px

**Implementation**: Update padding/margin on nav items

**Dependencies**: T-007

---

### T-010: Add keyboard navigation for mobile sidebar
**User Story**: US-003 | **Satisfies ACs**: AC-US3-05 | **Status**: [x] completed

**Test**: Given sidebar open → When Escape pressed → Then sidebar closes

**Dependencies**: T-008

---

## Summary

| Task | Phase | Status |
|------|-------|--------|
| T-001 Inline theme script | 1 | ✓ completed |
| T-002 Unified theme toggle | 1 | ✓ completed |
| T-003 Sidebar bg-card | 2 | ✓ completed |
| T-004 Header bg-card | 2 | ✓ completed |
| T-005 Active nav indicator | 2 | ✓ completed |
| T-006 Admin pages audit | 2 | ✓ completed |
| T-007 Sidebar animation | 3 | ✓ completed |
| T-008 Backdrop dismiss | 3 | ✓ completed |
| T-009 Touch targets | 3 | ✓ completed |
| T-010 Keyboard nav | 3 | ✓ completed |
