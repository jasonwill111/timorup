# Content Refresh: About, Pricing, FAQ, Contact

**Project**: timorup

## Overview

Refresh static page content to reflect TimorUp's unified positioning as Timor-Leste's 4-in-1 local info platform: Business Directory + Online Shop + Classified Ads + Public Services.

## User Stories

### US-001: Unified Platform Positioning
**Project**: timorup

**As a** visitor
**I want** to understand what TimorUp is and what it offers
**So that** I know if it's relevant to my needs

**Acceptance Criteria**:
- [x] **AC-US1-01**: About page clearly explains 4-in-1 value proposition
- [x] **AC-US1-02**: Landing hero communicates platform scope in 1 sentence
- [x] **AC-US1-03**: All static pages use consistent brand voice

### US-002: Clear Pricing Communication
**Project**: timorup

**As a** business owner
**I want** to understand pricing at a glance
**So that** I can choose the right plan quickly

**Acceptance Criteria**:
- [x] **AC-US2-01**: Pricing page has clear 4-section layout matching platform features
- [x] **AC-US2-02**: Each section explains who it's for and key benefits
- [x] **AC-US2-03**: Free tier clearly defined with limitations

### US-003: Helpful FAQ
**Project**: timorup

**As a** new user
**I want** quick answers to common questions
**So that** I can use the platform without friction

**Acceptance Criteria**:
- [x] **AC-US3-01**: FAQ covers all 4 platform modes (directory/shop/classifieds/public)
- [x] **AC-US3-02**: Questions are concise (under 2 sentences)
- [x] **AC-US3-03**: FAQ includes "What is TimorUp?" as first question

### US-004: Professional Contact Page
**Project**: timorup

**As a** potential partner
**I want** clear contact options
**So that** I can reach the right team quickly

**Acceptance Criteria**:
- [x] **AC-US4-01**: Contact page shows multiple contact purposes
- [x] **AC-US4-02**: Social links are functional placeholders
- [x] **AC-US4-03**: Response time expectations are clear

## Content Style Guide

- **Voice**: Confident, welcoming, local-focused
- **Tone**: Clear and direct, avoid jargon
- **Length**: Concise - every sentence earns its place
- **CTAs**: Action-oriented, specific

## Files to Update

| Page | File | Priority |
|------|------|----------|
| About | `src/pages/about.astro` | P1 |
| Pricing | `src/pages/pricing.astro` | P1 |
| FAQ | `src/pages/faq.astro` | P1 |
| Contact | `src/pages/contact.astro` | P2 |

## Out of Scope

- Visual/UI changes (handled in 0078-ui-ux-optimization)
- Pricing logic changes
- New pages or routes
- Backend functionality