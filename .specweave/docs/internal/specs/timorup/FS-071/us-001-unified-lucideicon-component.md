---
id: US-001
feature: FS-071
title: "Unified LucideIcon Component"
status: completed
priority: P1
created: 2026-05-20T00:00:00.000Z
tldr: "**As a** frontend developer."
project: timorup
---

# US-001: Unified LucideIcon Component

**Feature**: [FS-071](./FEATURE.md)

**As a** frontend developer
**I want** a unified LucideIcon component
**So that** I can replace all inline SVGs with consistent Lucide icons across the codebase

---

## Acceptance Criteria

- [x] **AC-US1-01**: `LucideIcon.astro` component created in `src/components/ui/` with props: `name`, `size` (default 24), `class`, `strokeWidth`
- [x] **AC-US1-02**: ThemeToggle refactored to use Lucide icons (Sun, Moon from lucide-astro)
- [x] **AC-US1-03**: ToastContainer refactored to use Lucide icons instead of inline SVGs
- [x] **AC-US1-04**: Header refactored to use Lucide ChevronDown for dropdown indicators
- [x] **AC-US1-05**: Footer refactored to use Lucide icons for social media (Facebook, Instagram, MessageCircle for WhatsApp)
- [x] **AC-US1-06**: Homepage entity cards (Businesses, Listings, Non-Profits, Public Sectors) refactored to use Lucide icons (Building2, Tag, Heart, Building)

---

## Implementation

**Increment**: [0071-lucide-icons-animation-integration](../../../../../increments/0071-lucide-icons-animation-integration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
