# timorlist - Specifications

Feature specifications for **timorlist**.

## Core Architecture

- [Entity Tables Migration](entity-tables-migration.md) — 4 separate entity tables, independent APIs, UI/UX updates (2026-05-11)

## Features

Features are organized by ID: `FS-XXX/`

Each feature folder contains:
- `FEATURE.md` - Feature overview and implementation history
- `us-XXX-*.md` - User story files

## Creating Features

Features are automatically created when you sync increments:

```bash
sw:sync-docs
```

Or sync a specific increment:

```bash
sw:sync-docs 0001
```

## Active Features

- [FS-042: Listing Schema & Plans](FS-042/FEATURE.md)
- [FS-043: Listing Frontend Routes](FS-043/FEATURE.md)
- [FS-044: Listing Admin Pages](FS-044/FEATURE.md)
- [FS-045: Header and Pricing Updates](FS-045/FEATURE.md)
- [FS-046: Account Page Updates](FS-046/FEATURE.md)
- [FS-047: Entity Detail Pages](FS-047/FEATURE.md)
- [FS-049: Admin Auth Cookie + Middleware](FS-049/FEATURE.md)
- [FS-050: Rate Limiter KV Storage](FS-050/FEATURE.md)
- [FS-051: Better Auth KV Session Cache](FS-051/FEATURE.md)
- [FS-052: REST API Cleanup](FS-052/FEATURE.md)
- [FS-053: Motion Animations Enhancement](FS-053/FEATURE.md)
- [FS-054: Mobile-First Responsive Design](FS-054/FEATURE.md)
- [FS-055: Price Fields Format Unification](FS-055/FEATURE.md)
- [FS-056: Homepage Redesign Tabs](FS-056/FEATURE.md)
- [FS-057: Astro Server Islands Optimization](FS-057/FEATURE.md)

---

Last updated: 2026-05-15
