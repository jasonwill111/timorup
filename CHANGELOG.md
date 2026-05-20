# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed
- **0058-code-quality-cleanup-p0**: P0 code quality fixes:
  - Type-safe env wrapper (`src/lib/env.ts`) - replaces `as any` pattern
  - Empty catch blocks fixed (10 locations) with proper error logging
  - Production console.log removed (17 locations)
  - Redundant REST APIs deleted (9 files)

### Changed
- `src/mastra/agents/index.ts` - uses env wrapper, removes `as any`
- `src/actions/admin/aiGenerate.ts` - uses env wrapper, removes debug logs
- `src/lib/auth-kv-store.ts` - proper error logging in catch blocks
- `src/lib/subscription.ts` - proper error logging in catch blocks

## [1.0.0] - 2026-05-07

### Added
- Tech stack modernization (0032-0036):
  - Zod 4 validation with z.email(), z.url(), z.coerce.*
  - Drizzle relations (one/many) configured
  - Mastra AI with unified provider config + Workers AI fallback
  - Server Actions with defineAction + Zod validation
  - Type refactor: 84 any usages �?proper types
- TypeScript strict mode: strict, noUncheckedIndexedAccess, noImplicitReturns
- Motion animations integrated in Layout.astro
- XSS prevention with escapeHtml() (10 usages)

### Fixed
- dev script --local flag for proper D1 dev
- wrangler.toml compatibility_date 2025-04-01

### Changed
- All 30 increments completed and archived
- Feature catalog with 36 features (6 active, 30 archived)

[1.0.0]: https://github.com/jasonwill111/timorup/compare/v0.0.0...v1.0.0

