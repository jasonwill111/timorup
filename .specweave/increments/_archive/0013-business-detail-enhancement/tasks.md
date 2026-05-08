# Tasks - 0013: Business Detail Page Enhancement

## T-001: Schema Updates
**Status**: [x] completed
**Satisfies**: AC-001, AC-002, AC-003, AC-004, AC-005
**Test**: Given new fields → When database migrated → Then all fields persist correctly

```sql
-- Added to src/db/schema/index.ts
yearOfEstablishment: integer('year_of_establishment')
socialLinks: text('social_links')
photoGallery: text('photo_gallery')
latestUpdate: text('latest_update')
latestUpdateImages: text('latest_update_images')
latestUpdateDate: integer('latest_update_date', { mode: 'timestamp' })
```

## T-002: Detail Page Display
**Status**: [x] completed
**Satisfies**: AC-001, AC-002, AC-003, AC-004, AC-006
**Test**: Given business with data → When page loads → Then all sections render correctly

- Stats display (views/likes/saves with counts)
- Year of establishment ("Est. YYYY")
- Social links (FB/IG/TikTok colored icons)
- Photo gallery (3x2 grid)
- Latest update card (above Products)
- Gallery lightbox modal

## T-003: Edit Form
**Status**: [x] completed
**Satisfies**: AC-002, AC-003, AC-005
**Test**: Given business owner → When editing → Then all fields save correctly

- yearOfEstablishment input
- socialLinks inputs (FB/IG/TikTok)
- latestUpdate textarea (500 char limit)
- latestUpdate image upload (max 3)

## T-004: Seed Data
**Status**: [x] completed
**Test**: Given fresh database → When seeded → Then 6 businesses have sample data

Sample data includes: yearOfEstablishment, socialLinks, latestUpdate, photoGallery

## T-005: Documentation
**Status**: [x] completed
**Test**: Given feature implementation → When docs updated → Then docs reflect current state

- docs/index.md v12.0
- docs/ARCHITECTURE.md v8.0 (section 12)
- docs/PRD.md v3.2 (schema section)

## Verification

- [x] pnpm build: exit 0
- [x] curl localhost:4321/business/nova-cafe: HTTP 200
- [x] Lightbox modal functional
- [x] All new fields present in schema
