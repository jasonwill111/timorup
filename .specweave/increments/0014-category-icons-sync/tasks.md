# Tasks: Category Icons Sync

## Phase 1: Icon Utilities

### T-001: Create icons.ts with icon sets and utilities
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03 | **Status**: [x] completed

**Test**: Given icon string → When parseIcon() called → Then returns {type, value}

**Implementation**:
```typescript
// src/lib/icons.ts
export const EMOJI_ICONS = ['🍽️', '🏨', '🛍️', '💆', '🚗', '💼', '📚', '🎭', '🏢'] as const;
export const LUCIDE_ICONS = ['utensils', 'bed', 'shopping-bag', 'heart', 'car', 'briefcase', 'graduation-cap', 'music', 'building'] as const;

export function parseIcon(icon: string): { type: 'emoji' | 'lucide'; value: string } | null {
  if (!icon) return null;
  if (icon.startsWith('emoji:')) return { type: 'emoji', value: icon.slice(6) };
  if (icon.startsWith('lucide:')) return { type: 'lucide', value: icon.slice(8) };
  return null;
}

export function buildIcon(type: 'emoji' | 'lucide', value: string): string {
  return `${type}:${value}`;
}
```

**Dependencies**: None

---

### T-002: Create IconRenderer component
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02, AC-US2-03, AC-US2-04 | **Status**: [x] completed

**Test**: Given icon value → When rendered → Then correct icon type displays

```typescript
// tests/unit/icon-renderer.test.ts
describe('IconRenderer', () => {
  it('renders emoji when icon starts with emoji:', () => {
    // Given icon = 'emoji:🍽️'
    // When IconRenderer renders
    // Then displays 🍽️
  });

  it('renders Lucide when icon starts with lucide:', () => {
    // Given icon = 'lucide:utensils'
    // When IconRenderer renders
    // Then displays Lucide utensils icon
  });

  it('renders fallback when icon is empty', () => {
    // Given icon = ''
    // When IconRenderer renders
    // Then displays building icon
  });
});
```

**Dependencies**: T-001

---

## Phase 2: Admin Integration

### T-003: Create IconPicker component
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02 | **Status**: [x] completed

**Test**: Given admin selects icon → When form submitted → Then icon saved to database

```typescript
// e2e/admin-icons.spec.ts
describe('Admin Icon Management', () => {
  it('admin can select emoji for category', async () => {
    // Given admin on category edit page
    // When admin selects '🍽️' from emoji picker
    // And clicks save
    // Then category shows 🍽️ icon
  });

  it('admin can select Lucide icon for category', async () => {
    // Given admin on category edit page
    // When admin selects 'utensils' from Lucide dropdown
    // And clicks save
    // Then category shows utensils icon
  });
});
```

**Dependencies**: T-001, T-002

---

### T-004: Update admin category API to accept icon
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03, AC-US1-04 | **Status**: [x] completed

**Test**: Given valid icon value → When PUT /api/admin/categories/:id → Then icon updated

**Dependencies**: T-003

---

## Phase 3: Display Updates

### T-005: Update CategoryCard to display icons
**User Story**: US-002, US-003 | **Satisfies ACs**: AC-US2-01, AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Test**: Given category with icon → When CategoryCard renders → Then icon visible

**Dependencies**: T-002, T-004

---

### T-006: Update homepage categories section
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-04 | **Status**: [x] completed

**Test**: Given homepage loads → When categories exist → Then icons displayed

**Dependencies**: T-005

---

### T-007: Update categories page
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Test**: Given categories page loads → When categories exist → Then icons displayed with names

**Dependencies**: T-005

---

### T-008: Update seed.sql with icons for all categories
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02 | **Status**: [x] completed

**Test**: Given seed.sql runs → When categories inserted → Then all have icons

**Dependencies**: T-001

---

### T-009: Verify migration idempotency
**User Story**: US-004 | **Satisfies ACs**: AC-US4-03 | **Status**: [x] completed

**Test**: Given seed run twice → When checked → Then no duplicate icons

**Dependencies**: T-008

---

## Summary

| Task | Phase | Status |
|------|-------|--------|
| T-001 icons.ts | 1 | ✓ completed |
| T-002 IconRenderer | 1 | ✓ completed |
| T-003 IconPicker | 2 | ✓ completed |
| T-004 Admin API | 2 | ✓ completed |
| T-005 CategoryCard | 3 | ✓ completed |
| T-006 Homepage | 3 | ✓ completed |
| T-007 Categories page | 3 | ✓ completed |
| T-008 Seed data | 4 | ✓ completed |
| T-009 Idempotency | 4 | ✓ completed |
