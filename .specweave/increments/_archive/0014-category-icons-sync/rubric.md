---
increment: 0014-category-icons-sync
title: "Category Icons Sync"
generated: "2026-04-22"
source: spec-driven
version: "1.0"
status: active
---

# Quality Contract: Category Icons Sync

## Quality Gates

| Gate | Threshold | Measurement |
|------|-----------|-------------|
| Unit tests | 100% | Icon parsing/rendering functions |
| E2E tests | 100% | Admin save, homepage display |
| LCP | < 2.5s | Homepage with icons |
| Coverage | 80%+ | Critical paths |

## Acceptance Criteria Checklist

- [ ] AC-US1-01: Emoji picker functional
- [ ] AC-US1-02: Lucide picker functional
- [ ] AC-US1-03: Icon persists in database
- [ ] AC-US1-04: Icon displays in admin list
- [ ] AC-US2-01: Homepage icons from database
- [ ] AC-US2-02: Emoji renders correctly
- [ ] AC-US2-03: Lucide renders correctly
- [ ] AC-US2-04: Fallback works
- [ ] AC-US3-01: Categories page icons
- [ ] AC-US3-02: Consistent alignment
- [ ] AC-US3-03: Mobile responsive
- [ ] AC-US4-01: Seed populates icons
- [ ] AC-US4-02: No duplicates
- [ ] AC-US4-03: Idempotent migration

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Homepage LCP | < 2.5s |
| Admin save | < 500ms |
| Bundle size increase | < 5KB |
| Accessibility | WCAG AA |
