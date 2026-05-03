---
id: US-001
feature: FS-012
title: "Theme Toggle Sync"
status: completed
priority: P1
created: "2026-04-19T00:00:00.000Z"
tldr: "**As an** admin user **I want** the theme to remain consistent between sidebar and content area **So that** I have a cohesive experience regardless of which toggle I use."
project: timorlist
---

# US-001: Theme Toggle Sync

**Feature**: [FS-012](./FEATURE.md)

**As an** admin user **I want** the theme to remain consistent between sidebar and content area **So that** I have a cohesive experience regardless of which toggle I use

---

## Acceptance Criteria

- [x] **AC-US1-01**: Clicking theme toggle in desktop sidebar changes the entire page theme (sidebar + content) instantly
- [x] **AC-US1-02**: Clicking theme toggle in mobile header changes the entire page theme (header + sidebar overlay + content) instantly
- [x] **AC-US1-03**: Theme preference persists in localStorage and is restored on page reload without flash of wrong theme
- [x] **AC-US1-04**: System preference (`prefers-color-scheme`) is respected for new users without localStorage

---

## Implementation

**Increment**: [0012-admin-sidebar-unified](../../../../../increments/0012-admin-sidebar-unified/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
