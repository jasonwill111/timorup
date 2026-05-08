# Tasks: 0004-ui-components-astro-migration

## Task Notation
- `[T###]`: Task ID
- `[P]`: Parallelizable
- Model hints: haiku (simple), sonnet (medium)

## Phase 1: Basic Input Components

### T-001: Create Button.astro
**User Story**: US-001
**References**: AC-US4-01
**Model**: sonnet

**Implementation Details**:
1. Create `src/components/ui/Button.astro`
2. Implement variants: default, destructive, outline, secondary, ghost, link
3. Implement sizes: default, sm, lg, icon
4. Use TailwindCSS classes from original button.tsx
5. Support disabled state and all button attributes

**Test Plan**:
- **File**: `src/components/ui/Button.astro`
- **Tests**:
  - **TC-001**: Button renders correctly
    - Given Button.astro
    - When imported and used in page
    - Then button renders with correct variant styles

**Dependencies**: None
**Status**: [x] Done

### T-002: Create Input.astro
**User Story**: US-001
**References**: AC-US4-02
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Input.astro`
2. Use native `<input>` with TailwindCSS styling
3. Support all HTML input attributes

**Dependencies**: None
**Status**: [x] Done

### T-003: Create Label.astro
**User Story**: US-001
**References**: AC-US4-03
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Label.astro`
2. Use native `<label>` with TailwindCSS styling

**Dependencies**: None
**Status**: [x] Done

### T-004: Create Textarea.astro
**User Story**: US-001
**References**: AC-US4-04
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Textarea.astro`
2. Use native `<textarea>` with TailwindCSS styling

**Dependencies**: None
**Status**: [x] Done

### T-005: Create Select.astro
**User Story**: US-001
**References**: AC-US4-05, AC-US4-06
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Select.astro`
2. Use native `<select>` with TailwindCSS styling
3. Support size variants

**Dependencies**: None
**Status**: [x] Done

## Phase 2: Display Components

### T-006: Create Card.astro
**User Story**: US-002
**References**: AC-US4-07
**Model**: sonnet

**Implementation Details**:
1. Create `src/components/ui/Card.astro`
2. Create CardHeader, CardContent, CardFooter, CardTitle, CardDescription subcomponents
3. Use TailwindCSS styling from original card.tsx

**Dependencies**: T-001
**Status**: [x] Done

### T-007: Create Badge.astro
**User Story**: US-002
**References**: AC-US4-08
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Badge.astro`
2. Support variants: default, secondary, destructive, outline

**Dependencies**: None
**Status**: [x] Done

### T-008: Create Avatar.astro
**User Story**: US-002
**References**: AC-US4-09
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Avatar.astro`
2. Support image src and fallback with initials
3. Support size variants

**Dependencies**: None
**Status**: [x] Done

### T-009: Create Skeleton.astro
**User Story**: US-002
**References**: AC-US4-10
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Skeleton.astro`
2. Use div with `animate-pulse` class

**Dependencies**: None
**Status**: [x] Done

## Phase 3: Interactive Components

### T-010: Create Tabs.astro
**User Story**: US-003
**References**: AC-US4-11
**Model**: sonnet

**Implementation Details**:
1. Create `src/components/ui/Tabs.astro`
2. Create TabsList, TabsTrigger, TabsContent
3. Use native HTML with CSS data attributes
4. Add inline `<script>` for tab switching behavior

**Dependencies**: T-001
**Status**: [x] Done

### T-011: Create Accordion.astro
**User Story**: US-003
**References**: AC-US4-12
**Model**: haiku

**Implementation Details**:
1. Create `src/components/ui/Accordion.astro`
2. Use native `<details>/<summary>` elements
3. Support items prop with id, title, content

**Dependencies**: None
**Status**: [x] Done

### T-012: Create Pagination.astro
**User Story**: US-003
**References**: AC-US4-13
**Model**: sonnet

**Implementation Details**:
1. Create `src/components/ui/Pagination.astro`
2. Support currentPage, totalPages props
3. Add inline `<script>` for page navigation
4. Support first, prev, next, last buttons

**Dependencies**: T-001
**Status**: [x] Done

### T-013: Create ThemeToggle.astro
**User Story**: US-003
**References**: AC-US4-14
**Model**: sonnet

**Implementation Details**:
1. Create `src/components/ui/ThemeToggle.astro`
2. Use vanilla JS `<script>` instead of React state
3. Use @lucide/astro for Sun/Moon icons
4. Read theme from localStorage and toggle class on `<html>`

**Dependencies**: None
**Status**: [x] Done

## Phase 4: Cleanup

### T-014: Delete Old React Components
**User Story**: US-004
**References**: AC-US4-15, AC-US4-16
**Model**: haiku

**Implementation Details**:
1. Delete all .tsx files in src/components/ui/
2. Keep src/lib/utils.ts (contains cn() function)
3. Verify no remaining React imports in component files

**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010, T-011, T-012, T-013
**Status**: [x] Done

### T-015: Update Imports in Pages
**User Story**: US-004
**References**: All ACs
**Model**: sonnet

**Implementation Details**:
1. Find all files importing from components/ui/*.tsx
2. Update imports to use new .astro file paths
3. Remove client:* directives if any exist

**Dependencies**: T-014
**Status**: [x] Done

### T-016: Run Build Verification
**User Story**: All
**References**: Build success
**Model**: sonnet

**Implementation Details**:
1. Run `pnpm build`
2. Fix any errors related to missing imports or syntax
3. Verify build completes successfully

**Dependencies**: T-015
**Status**: [x] Done

## Summary

| Task | Status | Dependencies |
|------|--------|--------------|
| T-001 | [x] | None |
| T-002 | [x] | None |
| T-003 | [x] | None |
| T-004 | [x] | None |
| T-005 | [x] | None |
| T-006 | [x] | T-001 |
| T-007 | [x] | None |
| T-008 | [x] | None |
| T-009 | [x] | None |
| T-010 | [x] | T-001 |
| T-011 | [x] | None |
| T-012 | [x] | T-001 |
| T-013 | [x] | None |
| T-014 | [x] | T-001..T-013 |
| T-015 | [x] | T-014 |
| T-016 | [x] | T-015 |

**Total**: 16 tasks | **Completed**: 16/16 | **100%**
