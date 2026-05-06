# Enterprise Documentation Health Report

*Generated: 5/6/2026, 10:13:51 AM*

## Documentation Health Score

| Metric | Score | Grade |
|--------|-------|-------|
| **Overall** | 70% | **C** |
| Freshness | 100% | - |
| Coverage | 59% | - |
| Accuracy | 65% | - |

## Documentation Categories

| Category | Documents | Last Updated |
|----------|-----------|--------------|
| Feature Specs | 109 | 5/6/2026 |
| Architecture | 8 | 5/6/2026 |
| ADRs | 3 | 5/4/2026 |
| Modules | 9 | 5/6/2026 |
| Increment Specs | 26 | 5/4/2026 |

**Total Documents**: 155

## Spec-Code Mismatches

| AC ID | Type | Confidence | File |
|-------|------|------------|------|
| AC-US3-01 | 👻 ghost_completion | 70% | us-003-server-side-sort-options.md |
| AC-US3-03 | 👻 ghost_completion | 70% | us-003-server-side-sort-options.md |
| AC-US2-02 | 👻 ghost_completion | 70% | us-002-server-side-category-filter.md |
| AC-US1-02 | 👻 ghost_completion | 70% | us-001-business-directory-with-server-side-pagination.md |
| AC-US3-01 | 👻 ghost_completion | 70% | us-003-cdn-cache-optimization.md |
| AC-US2-02 | 👻 ghost_completion | 70% | us-002-faq-json-ld-schema.md |
| AC-US2-03 | 👻 ghost_completion | 70% | us-002-add-image-upload-to-admin-heroes.md |
| AC-US1-03 | 👻 ghost_completion | 70% | us-001-add-image-upload-to-admin-categories.md |
| AC-US1-01 | 👻 ghost_completion | 70% | us-001-tiptap-editor-in-admin-skus.md |
| AC-US1-02 | 👻 ghost_completion | 70% | us-001-tiptap-editor-in-admin-skus.md |
| AC-US1-03 | 👻 ghost_completion | 70% | us-001-tiptap-editor-in-admin-skus.md |
| AC-US1-04 | 👻 ghost_completion | 70% | us-001-tiptap-editor-in-admin-skus.md |
| AC-US3-01 | 👻 ghost_completion | 70% | us-003-document-edge-cases-in-0001.md |
| AC-US3-02 | 👻 ghost_completion | 70% | us-003-document-edge-cases-in-0001.md |
| AC-US2-01 | 👻 ghost_completion | 70% | us-002-document-edge-cases-in-0015.md |
| AC-US1-01 | 👻 ghost_completion | 70% | us-001-add-bdd-test-scenarios-to-0015.md |
| AC-US1-02 | 👻 ghost_completion | 70% | us-001-add-bdd-test-scenarios-to-0015.md |
| AC-US1-03 | 👻 ghost_completion | 70% | us-001-add-bdd-test-scenarios-to-0015.md |
| AC-US5-05 | 👻 ghost_completion | 70% | us-005-migrate-remaining-api-routes.md |
| AC-US2-03 | 👻 ghost_completion | 70% | us-002-migrate-auth-api-routes.md |
| ... | ... | ... | *163 more* |

## Naming Convention Violations

| File | Type | Severity | Expected Pattern |
|------|------|----------|------------------|
| .specweave/docs/internal/architecture/adr/ADR-0012-r2-workers-binding.md | 🟡 mixed_case | warning | lowercase-kebab-case.md |
| .specweave/docs/internal/architecture/adr/ADR-0011-industry-specifications.md | 🟡 mixed_case | warning | lowercase-kebab-case.md |
| .specweave/docs/internal/architecture/adr/ADR-0012-r2-workers-binding.md | 🟡 mixed_case | warning | XXXX-title-in-kebab-case.md |
| .specweave/docs/internal/architecture/adr/ADR-0011-industry-specifications.md | 🟡 mixed_case | warning | XXXX-title-in-kebab-case.md |

## Duplicate Documents

| Files | Similarity | Type |
|-------|------------|------|
| .specweave/docs/internal/specs/timorlist/FS-018/us-003-document-edge-cases-in-0001.md, .specweave/docs/internal/specs/timorlist/FS-018/us-002-document-edge-cases-in-0015.md | 80% | same_title |

## Documentation Discrepancies

| File | Type | Description |
|------|------|-------------|
| .specweave/docs/internal/specs/timorlist/FS-007/FEATURE.md | 🔗 broken_link | Broken link to: ../modules/testing.md |
| .specweave/docs/internal/specs/timorlist/FS-007/FEATURE.md | 🔗 broken_link | Broken link to: ../modules/pages.md |
| .specweave/docs/internal/specs/timorlist/FS-007/FEATURE.md | 🔗 broken_link | Broken link to: ../modules/db.md |

## Recommendations

- Documentation coverage is limited. Add acceptance criteria to more documents.
- 183 acceptance criteria are marked complete but lack code evidence. Review: AC-US3-01, AC-US3-03, AC-US2-02...
- No governance documentation found. Consider adding coding standards to .specweave/docs/internal/governance/
- 📁 "Feature Specs" has 109 files. Run sw:organize-docs to generate themed navigation indexes for easier browsing.
