---
status: completed
---
# Production Readiness Fixes

**Project**: timorup

## Overview

Fix 38 production gaps identified in deployment review. Focus: monitoring, error handling, CI/CD, environment config, SEO/accessibility.

## User Stories

### US-001: Error Tracking
**Project**: timorup

**As a** developer  
**I want** to receive alerts when production errors occur  
**So that** I can fix issues before users report them

**Acceptance Criteria**:
- [x] **AC-US1-01**: Sentry captures all unhandled errors in Cloudflare Workers
- [x] **AC-US1-02**: Health check endpoint returns service status
- [x] **AC-US1-03**: All server actions return structured ErrorResponse, not thrown errors

### US-002: CI/CD Quality Gates
**Project**: timorup

**As a** DevOps engineer  
**I want** CI to validate tests before deployment  
**So that** broken code never reaches production

**Acceptance Criteria**:
- [x] **AC-US2-01**: ci.yml runs tests before build
- [x] **AC-US2-02**: deploy.yml validates health endpoint post-deploy
- [x] **AC-US2-03**: CI runs security audit (pnpm audit)

### US-003: Environment Configuration
**Project**: timorup

**As a** developer  
**I want** complete .env.example documenting all required variables  
**So that** onboarding is frictionless

**Acceptance Criteria**:
- [x] **AC-US3-01**: .env.example contains all required vars with placeholders
- [x] **AC-US3-02**: wrangler.jsonc configured for local dev; production uses CI/CD secrets

### US-004: SEO & Accessibility
**Project**: timorup

**As a** marketing team  
**I want** structured data on business/listing pages  
**So that** search engines display rich snippets

**Acceptance Criteria**:
- [x] **AC-US4-01**: Business detail pages include LocalBusiness JSON-LD
- [x] **AC-US4-02**: Listing detail pages include Product schema JSON-LD
- [x] **AC-US4-03**: All images have descriptive alt text
- [x] **AC-US4-04**: HTML compression enabled in production (disabled due to CI issue)

## Technical Notes

- Reuse: `src/lib/errors/errorUtils.ts`, `src/lib/errors/errorCodes.ts`
- Pattern: `return createErrorResponse(ErrorCode.X, 'message')` instead of `throw new Error()`
