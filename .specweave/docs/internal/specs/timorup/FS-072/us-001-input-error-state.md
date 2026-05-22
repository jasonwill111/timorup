---
id: US-001
feature: FS-072
title: "Input Error State"
status: completed
priority: P1
created: 2026-05-22
tldr: "**As a** user **I want** to see clear error feedback on invalid form inputs **So that** I can quickly identify and correct mistakes."
project: timorup
---

# US-001: Input Error State

**Feature**: [FS-072](./FEATURE.md)

**As a** user **I want** to see clear error feedback on invalid form inputs **So that** I can quickly identify and correct mistakes

---

## Acceptance Criteria

- [x] **AC-US1-01**: Input component accepts `error?: boolean` prop
- [x] **AC-US1-01**: When `error={true}`, input shows red border (`border-red-500`)
- [x] **AC-US1-01**: When `error={true}`, input displays `aria-invalid="true"` for accessibility
- [x] **AC-US1-02**: Select component accepts `error?: boolean` prop
- [x] **AC-US1-02**: When `error={true}`, select shows red border (`border-red-500`)

---

## Implementation

**Increment**: [0072-form-validation-state](../../../../../increments/0072-form-validation-state/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
