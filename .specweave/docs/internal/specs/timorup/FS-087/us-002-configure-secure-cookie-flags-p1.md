---
id: US-002
feature: FS-087
title: "Configure Secure Cookie Flags (P1)"
status: completed
priority: P1
created: 2026-05-29
tldr: "**As a** security administrator."
project: timorup
---

# US-002: Configure Secure Cookie Flags (P1)

**Feature**: [FS-087](./FEATURE.md)

**As a** security administrator
**I want** session cookies configured with security flags
**So that** session hijacking and CSRF attacks are mitigated

---

## Acceptance Criteria

- [x] **AC-US2-01**: Cookie has `secure: true` flag
- [x] **AC-US2-02**: Cookie has `sameSite: 'strict'` flag
- [x] **AC-US2-03**: Cookie has `httpOnly: true` flag
- [x] **AC-US2-04**: Sign-out clears cookie with secure flags

---

## Implementation

**Increment**: [0087-auth-security-hardening](../../../../../increments/0087-auth-security-hardening/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
