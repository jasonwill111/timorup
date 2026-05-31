---
id: US-002
feature: FS-002
title: "Nominatim Address Auto-Parse"
status: completed
priority: P1
created: 2026-03-23T00:00:00.000Z
tldr: "**As a** business owner creating or editing my business page."
project: TimorLink
---

# US-002: Nominatim Address Auto-Parse

**Feature**: [FS-002](./FEATURE.md)

**As a** business owner creating or editing my business page
**I want** the system to automatically find my latitude and longitude from my typed address
**So that** I do not have to look up GPS coordinates manually and can see a map preview

---

## Acceptance Criteria

- [x] **AC-US2-01**: On the business create page (`/business/create`) and edit page (`/business/[slug]/edit`), when the user types an address and triggers geocoding, the `src/lib/geo.ts` `geocodeAddress()` function calls the OpenStreetMap Nominatim API
- [x] **AC-US2-02**: The `geocodeAddress()` function implements client-side debouncing (minimum 1100ms between requests) to respect Nominatim's 1 req/sec rate limit. If called more frequently, it queues or ignores excess calls
- [x] **AC-US2-03**: When Nominatim returns a result, the latitude and longitude fields are automatically populated and the Leaflet map shows a marker at the resolved location
- [x] **AC-US2-04**: When Nominatim returns no results, a user-friendly message is displayed ("Address not found. Please try a more specific address or enter coordinates manually")
- [x] **AC-US2-05**: The "Get coordinates from address" button is disabled during the API call and re-enabled on completion or error
- [x] **AC-US2-06**: All geocoding logic is centralized in `src/lib/geo.ts` �?no inline Nominatim fetch calls in Astro page scripts

---

## Implementation

**Increment**: [0002-p0-compliance-fix](../../../../../increments/0002-p0-compliance-fix/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
