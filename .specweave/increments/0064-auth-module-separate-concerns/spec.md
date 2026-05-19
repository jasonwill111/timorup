---
increment: 0064-auth-module-separate-concerns
title: "Auth Module Separate Concerns"
type: refactor
priority: P1
status: active
created: 2026-05-18
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Auth Module Separate Concerns

## Overview

Refactor auth module to separate concerns: replace proxy wrapping with explicit adapter, replace async singleton with factory pattern.

## User Stories

### US-001: Explicit Auth Factory
**Project**: TimorLink

**As a** developer
**I want** to create auth instances via factory
**So that** I can test without global state

**Acceptance Criteria**:
- [x] **AC-US1-01**: `createAuthFactory()` returns factory function
- [x] **AC-US1-02**: Factory accepts db and env, returns auth instance
- [x] **AC-US1-03**: No global singleton for auth instance

---

### US-002: Expose Drizzle Adapter
**Project**: TimorLink

**As a** developer
**I want** the Drizzle adapter to be accessible
**So that** I can create auth without internal knowledge

**Acceptance Criteria**:
- [x] **AC-US2-01**: Export `createDrizzleAuthAdapter()` function
- [x] **AC-US2-02**: Adapter accepts Drizzle database instance
- [x] **AC-US2-03**: Type-safe schema mapping

## Functional Requirements

### FR-001: Auth Factory Pattern
```typescript
export interface AuthConfig {
  db: DrizzleDbWrapper;
  env?: { SESSION?: KVNamespace };
  options?: Partial<AuthOptions>;
}

export interface AuthFactory {
  createAuth(config: AuthConfig): BetterAuthInstance;
}

// Factory function
export function createAuthFactory(): AuthFactory
```

### FR-002: Exported Adapter
```typescript
export function createDrizzleAuthAdapter(
  db: DrizzleDbWrapper,
  options?: { provider?: 'sqlite' | 'postgres' }
): DrizzleAdapter
```

## Success Criteria

1. No global auth singleton
2. Factory pattern allows multiple instances (for testing)
3. All auth functionality preserved (OAuth, email/password, sessions)
4. 100% backward compatible API

## Out of Scope

- Changing auth configuration defaults
- Adding new auth providers
- Modifying session storage strategy
