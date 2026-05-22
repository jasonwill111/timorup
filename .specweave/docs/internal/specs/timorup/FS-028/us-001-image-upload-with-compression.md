---
id: US-001
feature: FS-028
title: "Image Upload with Compression"
status: completed
priority: P1
created: 2026-05-07T00:00:00.000Z
tldr: "**As a** business owner."
project: TimorLink
---

# US-001: Image Upload with Compression

**Feature**: [FS-028](./FEATURE.md)

**As a** business owner
**I want** to upload images that are automatically compressed to WebP
**So that** upload is fast and storage is optimized

---

## Acceptance Criteria

- [x] **AC-US1-01**: Client compresses images using Canvas API before upload
- [x] **AC-US1-02**: Output format is WebP with 85% quality
- [x] **AC-US1-03**: Images larger than 2MB are rejected with clear error
- [x] **AC-US1-04**: Compression happens in <500ms for 2MB images

---

## Implementation

**Increment**: [0028-media-optimization](../../../../../increments/0028-media-optimization/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
