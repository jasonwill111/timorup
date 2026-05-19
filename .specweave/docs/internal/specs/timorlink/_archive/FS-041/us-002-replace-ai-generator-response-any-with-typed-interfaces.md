---
id: US-002
feature: FS-041
title: "Replace AI Generator Response `any` with Typed Interfaces"
status: completed
priority: P1
created: 2026-05-10T00:00:00.000Z
tldr: "**As a** developer."
project: TimorLink
---

# US-002: Replace AI Generator Response `any` with Typed Interfaces

**Feature**: [FS-041](./FEATURE.md)

**As a** developer
**I want** the AI tools page to use properly typed interfaces for generated content
**So that** I can safely access nested AI response properties with type checking

---

## Acceptance Criteria

- [x] **AC-US2-01**: `generatedListing`, `generatedSku`, `generatedBlog`, `generatedLanding` use typed interfaces
- [x] **AC-US2-02**: Error catch blocks use `Error` type instead of `err: any`
- [x] **AC-US2-03**: Price field maps use typed interfaces `(p: PriceField) => ...`

---

## Implementation

**Increment**: [0041-type-safety-cleanup](../../../../../increments/0041-type-safety-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_

