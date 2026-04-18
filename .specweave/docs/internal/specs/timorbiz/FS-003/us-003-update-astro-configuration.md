---
id: US-003
feature: FS-003
title: "Update Astro Configuration"
status: not_started
priority: P0
created: 2026-04-18
tldr: "**As a** developer."
project: timorbiz
---

# US-003: Update Astro Configuration

**Feature**: [FS-003](./FEATURE.md)

**As a** developer
**I want** to remove React integration from astro.config.mjs
**So that** Astro doesn't expect React components

---

## Acceptance Criteria

- [ ] **AC-US3-01**: `@astrojs/react` import removed from astro.config.mjs
- [ ] **AC-US3-02**: `react()` removed from integrations array
- [ ] **AC-US3-03**: tsconfig.json updated to remove React JSX settings

---

## Implementation

**Increment**: [0003-deps-cleanup-react-removal](../../../../../increments/0003-deps-cleanup-react-removal/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [ ] **T-004**: Update astro.config.mjs
- [ ] **T-005**: Verify tsconfig.json
