# Content Refresh - Tasks

## Phase 1: About Page (T-001)

### T-001: Refresh About page content
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-03 | **Status**: [x] completed
**Test**: Given visitor lands on /about → When reading → Then understands 4-in-1 platform

## Phase 2: Pricing Page (T-002)

### T-002: Add pricing page context
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03 | **Status**: [x] completed
**Test**: Given visitor lands on /pricing → When reading → Then understands pricing options

**Implementation Notes**:
- Fixed schema sync: `service_type` + `service_relation_to`
- Business Plans: Basic ($39/mo), Pro ($69/mo), Max ($99/mo)
- Listing Renewals: 7 days ($8), 30 days ($15), 365 days ($120)
- Ad Banners: Homepage, Businesses, Listings, Products pages
- Admin and frontend pricing page now sync from same D1 table

## Phase 3: FAQ Page (T-003)

### T-003: Restructure FAQ content
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed
**Test**: Given new user visits /faq → When reading → Then finds all answers relevant

**Implementation Notes**:
- Fixed subscription plan pricing: Basic $39, Pro $69, Max $99
- Updated question: "What subscription plans are available for a business page"

## Phase 4: Contact Page (T-004)

### T-004: Polish Contact page content
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02, AC-US4-03 | **Status**: [x] completed
**Test**: Given partner views /contact → When reading → Then knows how to reach us

## Additional Work

### T-005: Schema Synchronization
**Status**: [x] completed
- Updated `src/db/schema/index.ts`: `type` → `serviceType`, `category` → `serviceRelationTo`
- Updated `src/actions/admin/servicePackagesAdmin.ts`: matches remote D1 schema
- Updated `src/pages/admin/service-packages.astro`: admin UI matches schema
- Updated `src/db/seeds/service-packages.ts`: seed data matches schema
- Synced to remote D1 via `migrations/seed-service-packages.sql`

### T-006: Homepage Carousel Banners
**Status**: [x] completed
- Created `src/components/ui/CarouselBanner.astro`
- Added to Homepage (`/`), Businesses (`/businesses`), Listings (`/listings`), Products-Services (`/products-services`)
- Replaced Hero section with Carousel Banner
- Auto-play, navigation arrows, indicators, touch support
