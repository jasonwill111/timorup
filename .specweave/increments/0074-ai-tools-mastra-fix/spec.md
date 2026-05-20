---
increment: 0074-ai-tools-mastra-fix
title: "AI Tools Mastra Fix"
type: feature
priority: P1
status: completed
created: 2026-05-20
structure: user-stories
test_mode: TDD
coverage_target: 100
---

# Feature: AI Tools Mastra Fix

## Overview

Fix AI tools to use Mastra agents with correct JSON output for all 4 generators.

## Changes Made

### 1. wrangler.jsonc
- Added `nodejs_compat_populate_process_env` to compatibility_flags for MiniMax API key access

### 2. src/lib/env.ts
- Fixed `getMinimaxApiKey()` to check both `import.meta.env` and `process.env`

### 3. src/mastra/agents/index.ts
- Added structured output schemas to all 4 agents:
  - `listingCreator` → `ListingDataSchema`
  - `skuCreator` → `SkuDataSchema`
  - `blogCreator` → `BlogDataSchema`
  - `landingPageCreator` → `LandingDataSchema`

### 4. src/lib/ai/validation.ts
- Updated `BLOG_INSTRUCTIONS` to avoid quotes in content field (causes JSON parse errors)

### 5. src/actions/admin/aiGenerate.ts
- Refactored to use Mastra agents instead of direct MiniMax API calls
- Added JSON fallback parsing for text responses

### 6. Deleted
- `src/pages/api/admin/ai-generate.ts` (dead code with bugs)

## User Stories

### US-001: Listing Generator (P1)
**As a** admin
**I want** to generate listings with correct schema
**So that** they can be saved to the database

**Acceptance Criteria**:
- [x] **AC-US1-01**: Listing generator returns valid `ListingDataSchema`
- [x] **AC-US1-02**: Output contains `action: "create_listing"`, `title`, `aboutUs` (HTML), `tags[]`, `status`

### US-002: SKU Generator (P1)
**As a** admin
**I want** to generate products/SKUs with correct schema
**So that** they can be saved to the database

**Acceptance Criteria**:
- [x] **AC-US2-01**: SKU generator returns valid `SkuDataSchema`
- [x] **AC-US2-02**: Output contains `action: "create_sku"`, `title`, `description` (HTML), `priceFields[]`

### US-003: Blog Generator (P1)
**As a** admin
**I want** to generate blog articles with correct schema
**So that** they can be saved to the database

**Acceptance Criteria**:
- [x] **AC-US3-01**: Blog generator returns valid `BlogDataSchema`
- [x] **AC-US3-02**: Output contains `action: "create_blog"`, `title`, `content` (HTML), `tags[]`

### US-004: Landing Page Generator (P1)
**As a** admin
**I want** to generate landing pages with correct schema
**So that** they can be displayed

**Acceptance Criteria**:
- [x] **AC-US4-01**: Landing generator returns valid `LandingDataSchema`
- [x] **AC-US4-02**: Output contains `action: "create_landing_page"`, `hero`, `features[]`, `cta`

## Test Results

All 4 AI tools tested and verified:
- ✅ Listing Generator - Schema valid
- ✅ SKU Generator - Schema valid
- ✅ Blog Generator - Schema valid
- ✅ Landing Generator - Schema valid

## Files Modified

- `wrangler.jsonc`
- `src/lib/env.ts`
- `src/mastra/agents/index.ts`
- `src/lib/ai/validation.ts`
- `src/actions/admin/aiGenerate.ts`

## Files Deleted

- `src/pages/api/admin/ai-generate.ts`
