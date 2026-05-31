---
id: US-002
feature: FS-084
title: "CI/CD Quality Gates"
status: completed
priority: P1
created: 2026-05-29
tldr: "**As a** DevOps engineer."
project: timorup
---

# US-002: CI/CD Quality Gates

**Feature**: [FS-084](./FEATURE.md)

**As a** DevOps engineer
**I want** CI to validate tests before deployment
**So that** broken code never reaches production

---

## Acceptance Criteria

- [x] **AC-US2-01**: ci.yml runs tests before build
- [x] **AC-US2-02**: deploy.yml validates health endpoint post-deploy
- [x] **AC-US2-03**: CI runs security audit (pnpm audit)

---

## Implementation

**Increment**: [0084-production-readiness](../../../../../increments/0084-production-readiness/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
