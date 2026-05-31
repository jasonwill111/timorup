---
id: US-002
feature: FS-001
title: "Verify better-auth Session Cookie Config (MEDIUM)"
status: completed
priority: P1
created: 2026-05-27
tldr: "**As a** security engineer."
project: timorlink
---

# US-002: Verify better-auth Session Cookie Config (MEDIUM)

**Feature**: [FS-001](./FEATURE.md)

**As a** security engineer
**I want** session cookies to have proper security flags
**So that** the app is protected against XSS and CSRF attacks

---

## Acceptance Criteria

- [x] **AC-US2-01**: `src/lib/auth.ts` �?Add explicit `session.cookie` config with `httpOnly: true`, `secure: true`, `sameSite: 'lax'`
- [x] **AC-US2-02**: Session cookie maxAge set to 7 days (604800 seconds)
- [x] **AC-US2-03**: AUTH_SECRET validation at startup (minimum 32 characters)

---

## Implementation

**Increment**: [0001-typescript-safety](../../../../../increments/0001-typescript-safety/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
