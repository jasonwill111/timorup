# Tasks: 0075 - Server Islands DB Pattern

## T-001: Audit timorup Server Islands
**Status**: open
**AC**: All Server Islands use `await getDb()` pattern

```bash
# Find all files with server:defer
grep -r "server:defer" src/pages/ src/components/

# Check each file for correct pattern
grep -l "await getDb()" src/components/islands/*.astro
```

**Test**: Given Islands component → When rendered → Then DB queries succeed

## T-002: Document CLAUDE.md
**Status**: open
**AC**: CLAUDE.md contains Server Islands section

**Done**: Added Server Islands section to CLAUDE.md with correct pattern examples.

## T-003: Consider automated detection
**Status**: open
**AC**: Optional - Consider TypeScript or ESLint rule

**Note**: This is a nice-to-have. The CLAUDE.md warning should be sufficient.