---
increment: 0035-mastra-workers-ai
title: "Mastra + CF Workers AI Integration"
type: feature
priority: P1
status: active
created: 2026-05-07
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Mastra + CF Workers AI Integration

## Overview

Enhance Mastra with CF Workers AI fallback, unified provider config.

## User Stories

### US-001: Unified Provider Config
**Project**: timorlist

**As a** developer
**I want** provider config in one place
**So that** maintenance is easier

**Acceptance Criteria**:
- [x] **AC-US1-01**: Provider config centralized in src/lib/ai/providers.ts
- [x] **AC-US1-02**: Agents import provider from config

### US-002: CF Workers AI Fallback
**Project**: timorlist

**As a** developer
**I want** Workers AI as fallback for simple tasks
**So that** no API key needed for basic operations

**Acceptance Criteria**:
- [x] **AC-US2-01**: Lightweight tasks use @cf/ai/* models
- [x] **AC-US2-02**: Complex tasks use MiniMax via Mastra

### US-003: Agent Tools
**Project**: timorlist

**As a** developer
**I want** agents to have tools
**So that** they can perform actions

**Acceptance Criteria**:
- [x] **AC-US3-01**: Provider config ready for tools integration

## Enhancements

### Provider Config
```typescript
// src/lib/ai/providers.ts
export const aiProviders = {
  minimax: {
    providerId: "minimax-cn-coding-plan",
    modelId: "MiniMax-M2.7",
  },
  workers: {
    // CF Workers AI models
  },
};
```

### Workers AI Integration
- Use @cf/ai/* for lightweight tasks
- Fallback when MiniMax unavailable

## Out of Scope

- Full memory implementation
- Advanced tool chains
- Vector database integration

## Dependencies

- Mastra 1.29.1 (installed)
- CF Workers AI (built-in)
- MiniMax API key (existing)
