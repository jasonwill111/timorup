---
id: US-001
feature: FS-025
title: "Local Development R2 Access"
status: completed
priority: high
created: 2026-05-04
tldr: "**As a** developer."
project: timorlist
---

# US-001: Local Development R2 Access

**Feature**: [FS-025](./FEATURE.md)

**As a** developer
**I want** to access R2 storage during local development without configuring credentials
**So that** I can test file uploads and media operations seamlessly

---

## Acceptance Criteria

- [x] **AC-US1-01**: R2 bucket accessible via `env.MEDIA_BUCKET` Workers binding
- [x] **AC-US1-02**: `bucket.put(key, data)` works for file uploads
- [x] **AC-US1-03**: `bucket.delete(key)` works for file deletion
- [x] **AC-US1-04**: `bucket.list()` works for listing objects

---

## Implementation

**Increment**: [0025-r2-workers-binding](../../../../../increments/0025-r2-workers-binding/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
