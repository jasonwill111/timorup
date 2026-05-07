---
id: US-002
feature: FS-028
title: "SHA256 Deduplication"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** system."
project: timorlist
---

# US-002: SHA256 Deduplication

**Feature**: [FS-028](./FEATURE.md)

**As a** system
**I want** to detect duplicate files by content hash
**So that** same image uploaded twice only stores once

---

## Acceptance Criteria

- [x] **AC-US2-01**: Calculate SHA256 hash client-side before upload
- [x] **AC-US2-02**: Check hash against existing files in DB
- [x] **AC-US2-03**: If duplicate, return existing media ID instead of uploading
- [x] **AC-US2-04**: Hash field added to media table schema

---

## Implementation

**Increment**: [0028-media-optimization](../../../../../increments/0028-media-optimization/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
