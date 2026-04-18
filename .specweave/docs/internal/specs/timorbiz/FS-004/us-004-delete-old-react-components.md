---
id: US-004
feature: FS-004
title: "Delete Old React Components"
status: in_progress
priority: P1
created: 2026-04-18T00:00:00.000Z
tldr: "**As a** developer."
project: timorbiz
---

# US-004: Delete Old React Components

**Feature**: [FS-004](./FEATURE.md)

**As a** developer
**I want** to delete all old React component files
**So that** no React code remains in the components directory

---

## Acceptance Criteria

- [x] **AC-US4-01**: Button.astro created with all variants (default, destructive, outline, secondary, ghost, link)
- [x] **AC-US4-02**: Input.astro created with proper styling
- [x] **AC-US4-03**: Label.astro created with proper styling
- [x] **AC-US4-04**: Textarea.astro created with proper styling
- [x] **AC-US4-05**: Select.astro created with proper styling
- [x] **AC-US4-06**: All components support size variants (default, sm, lg, icon)
- [x] **AC-US4-07**: Card.astro created with CardHeader, CardContent, CardFooter, CardTitle, CardDescription
- [x] **AC-US4-08**: Badge.astro created with all variants
- [x] **AC-US4-09**: Avatar.astro created with image and fallback support
- [x] **AC-US4-10**: Skeleton.astro created with animate-pulse
- [x] **AC-US4-11**: Tabs.astro created with Tabs, TabsList, TabsTrigger, TabsContent
- [x] **AC-US4-12**: Accordion.astro created with SimpleAccordion pattern
- [x] **AC-US4-13**: Pagination.astro created with page navigation
- [x] **AC-US4-14**: ThemeToggle.astro created with vanilla JS
- [x] **AC-US4-15**: All .tsx files in src/components/ui/ deleted
- [x] **AC-US4-16**: cn() utility retained for class merging

---

## Implementation

**Increment**: [0004-ui-components-astro-migration](../../../../../increments/0004-ui-components-astro-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-014**: Delete Old React Components
- [x] **T-015**: Update Imports in Pages
