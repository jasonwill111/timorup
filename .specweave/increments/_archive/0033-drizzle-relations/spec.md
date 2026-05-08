---
increment: 0033-drizzle-relations
title: "Drizzle Relations Complete"
type: feature
priority: P1
status: active
created: 2026-05-07
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Drizzle Relations Complete

## Overview

Define complete Drizzle relations for all tables to replace manual joins with type-safe relations.

## User Stories

### US-001: Business Page Relations
**Project**: timorlist

**As a** developer
**I want** to query business with related data via relations
**So that** code is cleaner and type-safe

**Acceptance Criteria**:
- [x] **AC-US1-01**: businessPagesRelations with owner, category, products
- [x] **AC-US1-02**: Can use db.query.businessPages.findFirst() pattern

### US-002: Product Relations
**Project**: timorlist

**As a** developer
**I want** products linked to business via relations
**So that** I can easily query product business info

**Acceptance Criteria**:
- [x] **AC-US2-01**: productsRelations with businessPage
- [x] **AC-US2-02**: productImagesRelations with product and media

### US-003: Order Relations
**Project**: timorlist

**As a** developer
**I want** orders linked to user and business via relations
**So that** I can easily get order details

**Acceptance Criteria**:
- [x] **AC-US3-01**: ordersRelations with user and businessPage

### US-004: Media Relations
**Project**: timorlist

**As a** developer
**I want** media linked to business and user via relations
**So that** I can easily get media metadata

**Acceptance Criteria**:
- [x] **AC-US4-01**: mediaRelations with business and uploader

## Relations to Add

| Table | Relations |
|-------|-----------|
| businessPages | owner (users), category (categories), products, reviews, orders, businessUpdates, media |
| products | businessPage, images |
| reviews | businessPage, user |
| orders | businessPage, user |
| productImages | product, media |
| categories | parent, children |
| media | business, uploader |
| savedItems | user |

## Out of Scope

- Changing query patterns in API routes (relations are additive)
- Adding new tables
- Migration changes

## Dependencies

- Drizzle 0.45.x (already installed)
- Existing schema definitions in src/db/schema/
