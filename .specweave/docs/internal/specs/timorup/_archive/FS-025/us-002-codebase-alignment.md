---
id: US-002
feature: FS-025
title: "Codebase Alignment"
status: completed
priority: high
created: 2026-05-04
tldr: "**As a** developer."
project: TimorLink
---

# US-002: Codebase Alignment

**Feature**: [FS-025](./FEATURE.md)

**As a** developer
**I want** TimorLink and timorbuy to use the same R2 access pattern
**So that** maintenance and knowledge transfer are easier

---

## Acceptance Criteria

- [x] **AC-US2-01**: Media operations use `env.MEDIA_BUCKET.put()` pattern
- [x] **AC-US2-02**: No AWS SDK imports for R2 operations
- [x] **AC-US2-03**: Astro config uses Cloudflare adapter consistently

---

## Implementation

**Increment**: [0025-r2-workers-binding](../../../../../increments/0025-r2-workers-binding/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

