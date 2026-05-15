# Domain Docs

## Layout: Single-context

| File | Location | Purpose |
|------|----------|---------|
| CONTEXT.md | Repo root | Project domain language, business rules |
| ADRs | `.specweave/docs/internal/architecture/adr/` | Architectural decisions |

## Consumer Rules

- `improve-codebase-architecture` skill → reads CONTEXT.md + ADRs
- `diagnose` skill → reads CONTEXT.md
- `tdd` skill → reads CONTEXT.md

## Creating ADRs

```bash
# ADR format
# .specweave/docs/internal/architecture/adr/adr-XXXX-title.md
```