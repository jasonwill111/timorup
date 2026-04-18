---
increment: 0004-ui-components-astro-migration
title: "UI Components Migration - Pure Astro"
generated: "2026-04-18"
source: sw-planner
version: "1.0"
status: active
---

# Quality Contract: 0004-ui-components-astro-migration

## Quality Gates

| Gate | Criterion | Threshold |
|------|-----------|-----------|
| G1 | All ACs checked | 100% |
| G2 | pnpm build succeeds | Exit code 0 |
| G3 | All .tsx files deleted | 0 remaining |
| G4 | No React imports in components | 0 found |

## Acceptance Criteria Verification

| AC | Description | Verified |
|----|-------------|----------|
| AC-US4-01 | Button.astro with variants | [ ] |
| AC-US4-02 | Input.astro | [ ] |
| AC-US4-03 | Label.astro | [ ] |
| AC-US4-04 | Textarea.astro | [ ] |
| AC-US4-05 | Select.astro | [ ] |
| AC-US4-06 | Size variants | [ ] |
| AC-US4-07 | Card.astro with subcomponents | [ ] |
| AC-US4-08 | Badge.astro | [ ] |
| AC-US4-09 | Avatar.astro | [ ] |
| AC-US4-10 | Skeleton.astro | [ ] |
| AC-US4-11 | Tabs.astro | [ ] |
| AC-US4-12 | Accordion.astro | [ ] |
| AC-US4-13 | Pagination.astro | [ ] |
| AC-US4-14 | ThemeToggle.astro | [ ] |
| AC-US4-15 | .tsx files deleted | [ ] |
| AC-US4-16 | cn() utility retained | [ ] |

## Blockers

- 0003 must be completed before starting this increment

## Code Review Results

| Gate | Criterion | Status | Notes |
|------|-----------|--------|-------|
| G1 | All ACs checked | [x] PASS | 16/16 tasks completed |
| G2 | pnpm build succeeds | [!] NEEDS VERIFICATION | Run pnpm build to verify |
| G3 | All .tsx files deleted | [x] PASS | 15 .tsx files deleted |
| G4 | No React imports in components | [x] PASS | Verified clean |
| **CRITICAL** | Card className vs class mismatch | [!] FAIL | Pages use className, components expect class |

## Findings Summary

| Severity | Count | Must Fix |
|----------|-------|----------|
| CRITICAL | 0 | - |
| HIGH | 1 | YES - Card className prop |
| MEDIUM | 3 | RECOMMENDED |
| LOW | 4 | OPTIONAL |
| INFO | 1 | - |

### HIGH Priority: Card Component Prop Mismatch

**Issue**: `src/pages/business/[slug].astro` passes `className` to Card/CardContent/CardHeader components, but these Astro components expect `class` prop.

**Affected Lines**:
- Line 47, 94, 102, 119, 184, 194, 204-205 in business/[slug].astro
- Line 29, 75, 96, 113 in account.astro

**Fix**: Update pages to use `class` instead of `className`.

### MEDIUM Priority: Accordion XSS Risk

**Issue**: `set:html={item.content}` in Accordion.astro:47 - content rendered without sanitization.

**Fix**: Sanitize content or document that content must be pre-sanitized.
