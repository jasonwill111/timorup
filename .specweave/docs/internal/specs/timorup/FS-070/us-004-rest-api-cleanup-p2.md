---
id: US-004
feature: FS-070
title: "REST API Cleanup (P2)"
status: completed
priority: P1
created: 2026-05-20
tldr: "**As a** developer."
project: timorup
---

# US-004: REST API Cleanup (P2)

**Feature**: [FS-070](./FEATURE.md)

**As a** developer
**I want** migrated REST files to be removed
**So that** codebase is clean and no dead code

---

## Acceptance Criteria

- [x] **AC-US4-01**: Auth REST files deleted (sign-in, sign-up, sign-out) — **PASSES E2E** (`/api/auth/sign-in` returns 404)
- [x] **AC-US4-02**: Admin REST files deleted after migration — **PASSES E2E** (no old endpoints found)
- [x] **AC-US4-03**: No remaining `fetch('/api/...')` for mutations in migrated pages — **PASSES E2E**

---

## Implementation

**Increment**: [0070-migrate-to-server-actions](../../../../../increments/0070-migrate-to-server-actions/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
