---
id: US-009
feature: FS-041
title: "Remove Debug Console Logs from Other Pages"
status: completed
priority: P1
created: 2026-05-10T00:00:00.000Z
tldr: "**As a** developer."
project: timorlist
---

# US-009: Remove Debug Console Logs from Other Pages

**Feature**: [FS-041](./FEATURE.md)

**As a** developer
**I want** various pages to not log debug information
**So that** production logs remain clean

---

## Acceptance Criteria

- [x] **AC-US9-01**: `pages/subscribe.astro` removes debug auth check log
- [x] **AC-US9-02**: `pages/business/[slug]/edit/index.astro` removes "Unsupported file type" log (or convert to proper error handling)

---

## Implementation

**Increment**: [0041-type-safety-cleanup](../../../../../increments/0041-type-safety-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
