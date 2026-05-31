---
id: US-004
feature: FS-087
title: "Standardize Auth Error Handling (P2)"
status: completed
priority: P1
created: 2026-05-29
tldr: "**As a** developer."
project: timorup
---

# US-004: Standardize Auth Error Handling (P2)

**Feature**: [FS-087](./FEATURE.md)

**As a** developer
**I want** consistent error handling across auth actions
**So that** error responses are predictable and typed

---

## Acceptance Criteria

- [x] **AC-US4-01**: All auth actions use ErrorCode enum (not inline strings)
- [x] **AC-US4-02**: ErrorCode.AUTH_INVALID_CREDENTIALS added for sign-in failures
- [x] **AC-US4-03**: ErrorCode.AUTH_RATE_LIMITED used for rate limit errors

---

## Implementation

**Increment**: [0087-auth-security-hardening](../../../../../increments/0087-auth-security-hardening/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
