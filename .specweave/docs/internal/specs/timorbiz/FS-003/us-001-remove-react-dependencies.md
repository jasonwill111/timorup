---
id: US-001
feature: FS-003
title: "Remove React Dependencies"
status: completed
priority: P0
created: 2026-04-18
tldr: "**As a** developer."
project: timorbiz
---

# US-001: Remove React Dependencies

**Feature**: [FS-003](./FEATURE.md)

**As a** developer
**I want** to remove all React dependencies from package.json
**So that** the project is purely Astro-based

---

## Acceptance Criteria

- [x] **AC-US1-01**: `@astrojs/react` removed from dependencies
- [x] **AC-US1-02**: `@base-ui/react` removed from dependencies
- [x] **AC-US1-03**: `@radix-ui/react-slot` removed from dependencies
- [x] **AC-US1-04**: `react` and `react-dom` removed from dependencies
- [x] **AC-US1-05**: `class-variance-authority` removed from dependencies
- [x] **AC-US1-06**: `@testing-library/react`, `@types/react`, `@types/react-dom` removed from devDependencies
- [x] **AC-US1-07**: `sonner` removed from dependencies

---

## Implementation

**Increment**: [0003-deps-cleanup-react-removal](../../../../../increments/0003-deps-cleanup-react-removal/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Remove React Dependencies
