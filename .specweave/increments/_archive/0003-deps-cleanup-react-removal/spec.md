---
increment: 0003-deps-cleanup-react-removal
title: "Dependencies Cleanup - Remove React/shadcn"
type: refactor
priority: P0
status: completed
created: 2026-04-18
structure: user-stories
test_mode: TDD
coverage_target: 100
completed: 2026-04-18
---

# Feature: 0003-deps-cleanup-react-removal

## Overview

Remove React/shadcn dependencies from the project and add Astro-native alternatives. This is Phase 1 of the React→Astro migration.

## User Stories

### US-001: Remove React Dependencies
**Project**: timorlist

**As a** developer
**I want** to remove all React dependencies from package.json
**So that** the project is purely Astro-based

**Acceptance Criteria**:
- [x] **AC-US1-01**: `@astrojs/react` removed from dependencies
- [x] **AC-US1-02**: `@base-ui/react` removed from dependencies
- [x] **AC-US1-03**: `@radix-ui/react-slot` removed from dependencies
- [x] **AC-US1-04**: `react` and `react-dom` removed from dependencies
- [x] **AC-US1-05**: `class-variance-authority` removed from dependencies
- [x] **AC-US1-06**: `@testing-library/react`, `@types/react`, `@types/react-dom` removed from devDependencies
- [x] **AC-US1-07**: `sonner` removed from dependencies

### US-002: Add Astro-Native Dependencies
**Project**: timorlist

**As a** developer
**I want** to add Astro-native icon library
**So that** the project has icon support without React

**Acceptance Criteria**:
- [x] **AC-US2-01**: `@lucide/astro` added to dependencies (replaced deprecated lucide-astro)
- [x] **AC-US2-02**: All existing TipTap packages retained (framework-agnostic)
- [x] **AC-US2-03**: `nanostores` added (retained from existing)

### US-003: Update Astro Configuration
**Project**: timorlist

**As a** developer
**I want** to remove React integration from astro.config.mjs
**So that** Astro doesn't expect React components

**Acceptance Criteria**:
- [x] **AC-US3-01**: `@astrojs/react` import removed from astro.config.mjs
- [x] **AC-US3-02**: `react()` removed from integrations array
- [x] **AC-US3-03**: tsconfig.json updated to remove React JSX settings

### US-004: Verify Build Works
**Project**: timorlist

**As a** developer
**I want** to ensure the project builds successfully after dependency changes
**So that** the migration doesn't break the build

**Acceptance Criteria**:
- [x] **AC-US4-01**: `pnpm install` succeeds without errors
- [x] **AC-US4-02**: `pnpm build` expected to fail (React components still exist - will be migrated in 0004)
- [x] **AC-US4-03**: No TypeScript errors related to removed packages in config files

## Dependencies

None (this is the first increment in the migration)

## Out of Scope

- UI component migration (Phase 2: 0004)
- Feature component migration (Phase 3: 0005)
- Toast system migration (Phase 4: 0006)
- Page updates (Phase 5: 0007)

## Migration Notes

- `lucide-astro` was deprecated, replaced with `@lucide/astro`
- `nanostores` added for state management (replacing React state)
- Build will fail until UI components are migrated in 0004
