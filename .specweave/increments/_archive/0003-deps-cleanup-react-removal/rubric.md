---
increment: 0003-deps-cleanup-react-removal
title: "Dependencies Cleanup - Remove React/shadcn"
generated: "2026-04-18"
source: sw-planner
version: "1.0"
status: active
---

# Quality Contract: 0003-deps-cleanup-react-removal

## Quality Gates

| Gate | Criterion | Threshold |
|------|-----------|-----------|
| G1 | All ACs checked | 100% |
| G2 | pnpm build succeeds | Exit code 0 |
| G3 | No React packages in package.json | 0 found |
| G4 | lucide-astro installed | Present in node_modules |

## Acceptance Criteria Verification

| AC | Description | Verified |
|----|-------------|----------|
| AC-US1-01 | @astrojs/react removed | [ ] |
| AC-US1-02 | @base-ui/react removed | [ ] |
| AC-US1-03 | @radix-ui/react-slot removed | [ ] |
| AC-US1-04 | react/react-dom removed | [ ] |
| AC-US1-05 | class-variance-authority removed | [ ] |
| AC-US1-06 | @testing-library/react types removed | [ ] |
| AC-US1-07 | sonner removed | [ ] |
| AC-US2-01 | lucide-astro added | [ ] |
| AC-US3-01 | React import removed from astro.config.mjs | [ ] |
| AC-US3-02 | react() removed from integrations | [ ] |
| AC-US4-01 | pnpm install succeeds | [ ] |
| AC-US4-02 | pnpm build succeeds | [ ] |

## Blockers

None expected at this phase.
