# Tasks: 0003-deps-cleanup-react-removal

## Task Notation
- `[T###]`: Task ID
- `[P]`: Parallelizable
- Model hints: haiku (simple), sonnet (medium), opus (complex)

## Phase 1: Update package.json

### T-001: Remove React Dependencies
**User Story**: US-001
**References**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05, AC-US1-06, AC-US1-07
**Model**: haiku

**Implementation Details**:
1. Read current `package.json`
2. Remove from `dependencies`:
   - `@astrojs/react`
   - `@base-ui/react`
   - `@radix-ui/react-slot`
   - `react`
   - `react-dom`
   - `class-variance-authority`
   - `sonner`
3. Remove from `devDependencies`:
   - `@testing-library/react`
   - `@types/react`
   - `@types/react-dom`

**Test Plan**:
- **File**: `package.json`
- **Tests**:
  - **TC-001**: Verify React packages removed
    - Given package.json
    - When grep for "react" in dependencies
    - Then no React packages found
  - **TC-002**: Verify lucide-astro present
    - Given package.json
    - When checking for lucide-astro
    - Then lucide-astro exists in dependencies

**Dependencies**: None
**Status**: [x] Completed

### T-002: Add lucide-astro Dependency
**User Story**: US-002
**References**: AC-US2-01
**Model**: haiku

**Implementation Details**:
1. Add `"lucide-astro": "^0.500.0"` to dependencies

**Test Plan**:
- **File**: `package.json`
- **Tests**:
  - **TC-003**: Verify lucide-astro added
    - Given package.json
    - When checking dependencies
    - Then lucide-astro with version ^0.500.0 exists

**Dependencies**: T-001
**Status**: [x] Completed

### T-003: Install Dependencies
**User Story**: US-004
**References**: AC-US4-01
**Model**: haiku

**Implementation Details**:
1. Run `pnpm install`
2. Verify no peer dependency warnings for removed packages

**Test Plan**:
- **File**: Terminal output
- **Tests**:
  - **TC-004**: pnpm install succeeds
    - Given clean node_modules
    - When running pnpm install
    - Then exit code 0

**Dependencies**: T-001, T-002
**Status**: [x] Completed

## Phase 2: Update Configuration

### T-004: Update astro.config.mjs
**User Story**: US-003
**References**: AC-US3-01, AC-US3-02
**Model**: haiku

**Implementation Details**:
1. Read current `astro.config.mjs`
2. Remove `import react from '@astrojs/react'`
3. Remove `react()` from integrations array

**Test Plan**:
- **File**: `astro.config.mjs`
- **Tests**:
  - **TC-005**: React integration removed
    - Given astro.config.mjs
    - When grep for "@astrojs/react"
    - Then not found
  - **TC-006**: react() call removed
    - Given astro.config.mjs
    - When grep for "react()"
    - Then not found

**Dependencies**: T-003
**Status**: [x] Completed

### T-005: Verify tsconfig.json
**User Story**: US-003
**References**: AC-US3-03
**Model**: haiku

**Implementation Details**:
1. Read current `tsconfig.json`
2. Verify no React JSX settings that would cause issues
3. Astro's default settings should work without React

**Test Plan**:
- **File**: `tsconfig.json`
- **Tests**:
  - **TC-007**: No React JSX settings
    - Given tsconfig.json
    - When checking compilerOptions
    - Then no "jsx": "react-jsx" or "jsxImportSource": "react"

**Dependencies**: T-003
**Status**: [x] Completed

## Phase 3: Verification

### T-006: Run Build Verification
**User Story**: US-004
**References**: AC-US4-02, AC-US4-03
**Model**: sonnet

**Implementation Details**:
1. Run `pnpm build`
2. Capture any errors related to removed packages
3. Note: Some errors about missing React components are EXPECTED at this stage
4. Only critical errors (e.g., missing core dependencies) should block

**Test Plan**:
- **File**: Build output
- **Tests**:
  - **TC-008**: Build completes (allowing React import errors for later fixes)
    - Given dependencies installed
    - When running pnpm build
    - Then build runs (errors about .tsx files are expected in later phases)

**Dependencies**: T-004, T-005
**Status**: [x] Completed (build expected to fail - React components exist but dependencies removed)

### T-007: Update Documentation
**User Story**: All
**References**: Project documentation
**Model**: haiku

**Implementation Details**:
1. Update CLAUDE.md tech stack section
2. Remove React from the tech stack list
3. Add lucide-astro to the tech stack list
4. Update any other documentation referencing React

**Test Plan**:
- **File**: CLAUDE.md
- **Tests**:
  - **TC-009**: Documentation updated
    - Given CLAUDE.md
    - When checking tech stack
    - Then React not listed, lucide-astro listed

**Dependencies**: T-006
**Status**: [x] Completed

## Summary

| Task | Status | Dependencies |
|------|--------|--------------|
| T-001 | [ ] | None |
| T-002 | [ ] | T-001 |
| T-003 | [ ] | T-001, T-002 |
| T-004 | [ ] | T-003 |
| T-005 | [ ] | T-003 |
| T-006 | [ ] | T-004, T-005 |
| T-007 | [ ] | T-006 |

**Total**: 7 tasks
