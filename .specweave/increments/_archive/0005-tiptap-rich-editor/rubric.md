# Quality Contract: 0005-tiptap-rich-editor

## Quality Gates

| Gate | Threshold | Verification |
|------|-----------|--------------|
| Unit tests | 95% coverage | `npx vitest run` |
| E2E tests | 100% AC coverage | `npx playwright test` |
| Build | Must pass | `pnpm build` |
| Console errors | 0 errors | Browser verification |

## Acceptance Criteria Checklist

- [ ] AC-US1-01: Bold formatting works in blog editor
- [ ] AC-US1-02: Italic formatting works in blog editor
- [ ] AC-US1-03: H2/H3 headings work in blog editor
- [ ] AC-US1-04: Lists work in blog editor
- [ ] AC-US1-05: Links work in blog editor
- [ ] AC-US1-06: Placeholder visible when blog editor empty
- [ ] AC-US1-07: Hidden textarea syncs blog content
- [ ] AC-US2-01: Bold works in about-us editor
- [ ] AC-US2-02: Italic works in about-us editor
- [ ] AC-US2-03: Lists work in about-us editor
- [ ] AC-US2-04: Placeholder visible when about-us empty
- [ ] AC-US2-05: Hidden textarea syncs about-us content
- [ ] AC-US3-01: Single init function exists
- [ ] AC-US3-02: Custom placeholder option works
- [ ] AC-US3-03: Multiple editors on same page work
