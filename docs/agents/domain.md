# Domain Docs

**Layout**: Single-context at repo root.

## Location

Domain documentation lives in:

```
.specweave/docs/internal/
```

This includes:
- Architectural decisions (`specs/`)
- Module documentation (`modules/`)
- Project organization

## Consumer Rules

Skills that read domain docs:

| Skill | Reads |
|-------|-------|
| `diagnose` | `specs/`, `modules/` |
| `tdd` | `specs/` |
| `improve-codebase-architecture` | Full `internal/` tree |

## SpecWeave Integration

This project uses SpecWeave for feature management. See `.specweave/docs/internal/specs/` for architectural decisions made via SpecWeave increments.

## No Separate CONTEXT.md

Project context is derived from the living docs in `.specweave/docs/internal/`. No separate `CONTEXT.md` file exists.
