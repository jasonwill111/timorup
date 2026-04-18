---
increment: 0002-p0-compliance-fix
title: P0 合规修复：动态支付二维码 + Nominatim 地址解析
type: feature
priority: P1
status: completed
created: 2026-03-23T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
plan_optional: true
---

# Feature: P0 合规修复：动态支付二维码 + Nominatim 地址解析

## Overview

修复 G-02 和 G-03 两个 P0 合规问题。两者都是面向用户的前端增强加后端 API 改动。

| Gap | 问题 | 修复范围 |
|-----|------|---------|
| **G-02** | `/subscribe` 硬编码支付二维码，Admin 无法动态更新 | `subscribe.astro` + 新建 `/api/settings/public` 端点 |
| **G-03** | 商家创建/编辑页面 Nominatim 调用无防抖，逻辑分散 | 新建 `src/lib/geo.ts` + 完善 `create.astro` + 新建 `edit.astro` |

> **Note**: `plan.md` is optional for this increment per the 2-feature scope. The Architect skill can create it on demand.

## User Stories

### US-001: Dynamic Payment QR Code
**Project**: timorbiz

**As a** business owner visiting the subscribe page
**I want** to see the current payment QR code configured by the admin
**So that** I can make the correct payment for my subscription

**Acceptance Criteria**:
- [x] **AC-US1-01**: The `/subscribe` page fetches the payment QR image URL from the `/api/settings/public` endpoint on page load
- [x] **AC-US1-02**: If the QR code URL is not yet configured (null, empty, or key missing), the QR section shows a placeholder message ("Payment QR code not yet configured") instead of a broken image
- [x] **AC-US1-03**: The `/api/settings/public` endpoint returns a JSON object with at least `{ payment_qr: string | null }` — accessible to unauthenticated users, no session required
- [x] **AC-US1-04**: The existing `/api/admin/settings` (authenticated) continues to work for Admin to save the `payment_qr` URL via the site settings form

---

### US-002: Nominatim Address Auto-Parse
**Project**: timorbiz

**As a** business owner creating or editing my business page
**I want** the system to automatically find my latitude and longitude from my typed address
**So that** I do not have to look up GPS coordinates manually and can see a map preview

**Acceptance Criteria**:
- [x] **AC-US2-01**: On the business create page (`/business/create`) and edit page (`/business/[slug]/edit`), when the user types an address and triggers geocoding, the `src/lib/geo.ts` `geocodeAddress()` function calls the OpenStreetMap Nominatim API
- [x] **AC-US2-02**: The `geocodeAddress()` function implements client-side debouncing (minimum 1100ms between requests) to respect Nominatim's 1 req/sec rate limit. If called more frequently, it queues or ignores excess calls
- [x] **AC-US2-03**: When Nominatim returns a result, the latitude and longitude fields are automatically populated and the Leaflet map shows a marker at the resolved location
- [x] **AC-US2-04**: When Nominatim returns no results, a user-friendly message is displayed ("Address not found. Please try a more specific address or enter coordinates manually")
- [x] **AC-US2-05**: The "Get coordinates from address" button is disabled during the API call and re-enabled on completion or error
- [x] **AC-US2-06**: All geocoding logic is centralized in `src/lib/geo.ts` — no inline Nominatim fetch calls in Astro page scripts

## Functional Requirements

### FR-001: Public Settings API
- **Endpoint**: `GET /api/settings/public`
- **Response**: `{ success: true, data: { payment_qr: string | null } }`
- **Auth**: None (public endpoint)
- **Implementation**: Reuse existing `siteSettings` DB table, query by key `payment_qr`

### FR-002: Geo Utility Module
- **File**: `src/lib/geo.ts`
- **Exports**: `geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null>`
- **Debounce**: Internal 1100ms cooldown between calls using a timestamp tracker
- **Nominatim URL**: `https://nominatim.openstreetmap.org/search?format=json&q={address}`
- **Error handling**: Network errors and zero-result responses both return `null`

## Out of Scope

- Admin UI for uploading R2 images and saving `payment_qr` URL (handled in existing admin settings form — no new UI needed)
- Nominatim reverse geocoding (lat/lng to address)
- Changing the map tile provider (continues to use OpenStreetMap)
- Editing the business create form's existing "one business per user" logic

## Dependencies

| Dependency | Description |
|------------|-------------|
| `src/pages/api/admin/settings/index.ts` | Existing settings API (read) |
| `src/db/schema/index.ts` | Existing `siteSettings` table schema |
| `src/pages/business/create.astro` | Existing form with Leaflet map integration |
| Leaflet (CDN) | Already loaded in create.astro |
| OpenStreetMap Nominatim | External free API, no API key required |

## Non-Functional Requirements

| NFR | Requirement |
|-----|-------------|
| **NFR-GEO-01** | Nominatim requests must include `User-Agent` header identifying the app (`TMBIZ/1.0`) |
| **NFR-GEO-02** | Nominatim requests must append `, Timor-Leste` to the query for better local results |
| **NFR-QR-01** | The QR image should load with `loading="lazy"` attribute |
| **NFR-QR-02** | The subscribe page should show a skeleton/loading state while fetching settings |
