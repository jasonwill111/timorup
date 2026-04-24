# Graph Report - /home/jasonwill/dev-projects/timorlist  (2026-04-24)

## Corpus Check
- Large corpus: 742 files · ~573,621 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 283 nodes · 320 edges · 25 communities detected
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_login.ts, sign-in.ts, sign-out.ts|login.ts, sign-in.ts, sign-out.ts]]
- [[_COMMUNITY_index.ts, index.ts, index.ts|index.ts, index.ts, index.ts]]
- [[_COMMUNITY_sorter.js, sorter.js, addSearchBox()|sorter.js, sorter.js, addSearchBox()]]
- [[_COMMUNITY_calculateAverageRating(), calculatePagin|calculateAverageRating(), calculatePagin]]
- [[_COMMUNITY_media.ts, createS3Client(), deleteFromR2|media.ts, createS3Client(), deleteFromR2]]
- [[_COMMUNITY_prettify.js, prettify.js, a()|prettify.js, prettify.js, a()]]
- [[_COMMUNITY_getEmailProvider(), NullEmailProvider, .|getEmailProvider(), NullEmailProvider, .]]
- [[_COMMUNITY_goToNext(), goToPrevious(), makeCurrent(|goToNext(), goToPrevious(), makeCurrent(]]
- [[_COMMUNITY_icons.ts, buildIcon(), getDisplayIcon()|icons.ts, buildIcon(), getDisplayIcon()]]
- [[_COMMUNITY_hasUserBusiness(), POST(), business-logi|hasUserBusiness(), POST(), business-logi]]
- [[_COMMUNITY_factories.ts, cleanupTestData(), loginAs|factories.ts, cleanupTestData(), loginAs]]
- [[_COMMUNITY_index.test.ts, buildMockChain(), buildMo|index.test.ts, buildMockChain(), buildMo]]
- [[_COMMUNITY_slug.ts, GET(), PUT()|[slug].ts, GET(), PUT()]]
- [[_COMMUNITY_geocodeAddress(), __resetGeoState(), geo|geocodeAddress(), __resetGeoState(), geo]]
- [[_COMMUNITY_createAdminUser(), admin-api.spec.ts, ad|createAdminUser(), admin-api.spec.ts, ad]]
- [[_COMMUNITY_generateUniqueEmail(), auth-flow.spec.ts|generateUniqueEmail(), auth-flow.spec.ts]]
- [[_COMMUNITY_utils.ts, utils.ts, cn()|utils.ts, utils.ts, cn()]]
- [[_COMMUNITY_createDb(), db.ts, db.ts|createDb(), db.ts, db.ts]]
- [[_COMMUNITY_GET(), active.ts, active.ts|GET(), active.ts, active.ts]]
- [[_COMMUNITY_session.ts, GET(), session.ts|session.ts, GET(), session.ts]]
- [[_COMMUNITY_verify-email.ts, verify-email.ts, POST()|verify-email.ts, verify-email.ts, POST()]]
- [[_COMMUNITY_GET(), featured.ts, featured.ts|GET(), featured.ts, featured.ts]]
- [[_COMMUNITY_stats.ts, stats.ts, GET()|stats.ts, stats.ts, GET()]]
- [[_COMMUNITY_save.ts, POST(), save.ts|save.ts, POST(), save.ts]]
- [[_COMMUNITY_seed.ts, seed(), seed.ts|seed.ts, seed(), seed.ts]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 27 edges
2. `POST()` - 21 edges
3. `GET()` - 16 edges
4. `PUT()` - 8 edges
5. `POST()` - 7 edges
6. `g()` - 6 edges
7. `getNthColumn()` - 6 edges
8. `enableUI()` - 6 edges
9. `deleteFromR2()` - 6 edges
10. `DELETE()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `uploadToR2()`  [INFERRED]
  /home/jasonwill/dev-projects/timorlist/src/pages/api/products/index.ts → /home/jasonwill/dev-projects/timorlist/src/lib/media.ts
- `POST()` --calls--> `uploadToR2()`  [INFERRED]
  /home/jasonwill/dev-projects/timorlist/src/pages/api/media/upload.ts → /home/jasonwill/dev-projects/timorlist/src/lib/media.ts
- `DELETE()` --calls--> `deleteFromR2()`  [INFERRED]
  /home/jasonwill/dev-projects/timorlist/src/pages/api/media/index.ts → /home/jasonwill/dev-projects/timorlist/src/lib/media.ts
- `DELETE()` --calls--> `deleteFromR2()`  [INFERRED]
  /home/jasonwill/dev-projects/timorlist/src/pages/api/media/[id].ts → /home/jasonwill/dev-projects/timorlist/src/lib/media.ts
- `POST()` --calls--> `GET()`  [INFERRED]
  /home/jasonwill/dev-projects/timorlist/src/pages/api/businesses/create.ts → /home/jasonwill/dev-projects/timorlist/src/pages/api/products/[id].ts

## Communities

### Community 0 - "login.ts, sign-in.ts, sign-out.ts"
Cohesion: 0.1
Nodes (15): DELETE(), GET(), getCurrentUser(), PUT(), POST(), POST(), checkRateLimit(), POST() (+7 more)

### Community 1 - "index.ts, index.ts, index.ts"
Cohesion: 0.13
Nodes (7): countBusinessMedia(), DELETE(), GET(), getBusinessPlanLimits(), getCurrentUser(), POST(), PUT()

### Community 2 - "sorter.js, sorter.js, addSearchBox()"
Cohesion: 0.36
Nodes (13): addSearchBox(), addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns() (+5 more)

### Community 3 - "calculateAverageRating(), calculatePagin"
Cohesion: 0.26
Nodes (12): calculateAverageRating(), calculatePagination(), calculatePopularityScore(), canUpgradePlan(), canUserAccessFeature(), getBusinessStatus(), isValidEmail(), isValidSlug() (+4 more)

### Community 4 - "media.ts, createS3Client(), deleteFromR2"
Cohesion: 0.3
Nodes (12): createS3Client(), deleteFromR2(), generateFileKey(), getOptimizedImageUrl(), getPublicMediaUrl(), getS3Client(), getSignedUrl(), isCloudflareEnvironment() (+4 more)

### Community 5 - "prettify.js, prettify.js, a()"
Cohesion: 0.44
Nodes (10): a(), B(), c(), D(), g(), i(), k(), o() (+2 more)

### Community 6 - "getEmailProvider(), NullEmailProvider, ."
Cohesion: 0.26
Nodes (5): getEmailProvider(), NullEmailProvider, sendEmail(), SendGridProvider, SMTPProvider

### Community 7 - "goToNext(), goToPrevious(), makeCurrent("
Cohesion: 0.73
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

### Community 8 - "icons.ts, buildIcon(), getDisplayIcon()"
Cohesion: 0.6
Nodes (4): buildIcon(), getDisplayIcon(), isValidIcon(), parseIcon()

### Community 9 - "hasUserBusiness(), POST(), business-logi"
Cohesion: 0.33
Nodes (2): hasUserBusiness(), POST()

### Community 10 - "factories.ts, cleanupTestData(), loginAs"
Cohesion: 0.6
Nodes (3): cleanupTestData(), loginAsAdmin(), loginAsUser()

### Community 11 - "index.test.ts, buildMockChain(), buildMo"
Cohesion: 0.67
Nodes (2): buildMockChain(), buildMockError()

### Community 12 - "[slug].ts, GET(), PUT()"
Cohesion: 0.83
Nodes (2): GET(), PUT()

### Community 13 - "geocodeAddress(), __resetGeoState(), geo"
Cohesion: 0.67
Nodes (2): geocodeAddress(), __resetGeoState()

### Community 14 - "createAdminUser(), admin-api.spec.ts, ad"
Cohesion: 0.67
Nodes (1): createAdminUser()

### Community 15 - "generateUniqueEmail(), auth-flow.spec.ts"
Cohesion: 0.67
Nodes (1): generateUniqueEmail()

### Community 16 - "utils.ts, utils.ts, cn()"
Cohesion: 0.67
Nodes (1): cn()

### Community 17 - "createDb(), db.ts, db.ts"
Cohesion: 0.67
Nodes (1): createDb()

### Community 18 - "GET(), active.ts, active.ts"
Cohesion: 0.67
Nodes (1): GET()

### Community 19 - "session.ts, GET(), session.ts"
Cohesion: 0.67
Nodes (1): GET()

### Community 20 - "verify-email.ts, verify-email.ts, POST()"
Cohesion: 0.67
Nodes (1): POST()

### Community 21 - "GET(), featured.ts, featured.ts"
Cohesion: 0.67
Nodes (1): GET()

### Community 22 - "stats.ts, stats.ts, GET()"
Cohesion: 0.67
Nodes (1): GET()

### Community 23 - "save.ts, POST(), save.ts"
Cohesion: 0.67
Nodes (1): POST()

### Community 24 - "seed.ts, seed(), seed.ts"
Cohesion: 0.67
Nodes (1): seed()

## Knowledge Gaps
- **Thin community `hasUserBusiness(), POST(), business-logi`** (6 nodes): `hasUserBusiness()`, `POST()`, `business-logic.ts`, `create.ts`, `business-logic.ts`, `create.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index.test.ts, buildMockChain(), buildMo`** (4 nodes): `index.test.ts`, `buildMockChain()`, `buildMockError()`, `index.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `[slug].ts, GET(), PUT()`** (4 nodes): `[slug].ts`, `GET()`, `PUT()`, `[slug].ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `geocodeAddress(), __resetGeoState(), geo`** (4 nodes): `geocodeAddress()`, `__resetGeoState()`, `geo.ts`, `geo.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `createAdminUser(), admin-api.spec.ts, ad`** (3 nodes): `createAdminUser()`, `admin-api.spec.ts`, `admin-api.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `generateUniqueEmail(), auth-flow.spec.ts`** (3 nodes): `generateUniqueEmail()`, `auth-flow.spec.ts`, `auth-flow.spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `utils.ts, utils.ts, cn()`** (3 nodes): `utils.ts`, `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `createDb(), db.ts, db.ts`** (3 nodes): `createDb()`, `db.ts`, `db.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GET(), active.ts, active.ts`** (3 nodes): `GET()`, `active.ts`, `active.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `session.ts, GET(), session.ts`** (3 nodes): `session.ts`, `GET()`, `session.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `verify-email.ts, verify-email.ts, POST()`** (3 nodes): `verify-email.ts`, `verify-email.ts`, `POST()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GET(), featured.ts, featured.ts`** (3 nodes): `GET()`, `featured.ts`, `featured.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `stats.ts, stats.ts, GET()`** (3 nodes): `stats.ts`, `stats.ts`, `GET()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `save.ts, POST(), save.ts`** (3 nodes): `save.ts`, `POST()`, `save.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `seed.ts, seed(), seed.ts`** (3 nodes): `seed.ts`, `seed()`, `seed.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `login.ts, sign-in.ts, sign-out.ts` to `hasUserBusiness(), POST(), business-logi`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `uploadToR2()` connect `media.ts, createS3Client(), deleteFromR2` to `login.ts, sign-in.ts, sign-out.ts`, `index.ts, index.ts, index.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `POST()` connect `index.ts, index.ts, index.ts` to `media.ts, createS3Client(), deleteFromR2`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `GET()` (e.g. with `PUT()` and `checkRateLimit()`) actually correct?**
  _`GET()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `POST()` (e.g. with `GET()` and `uploadToR2()`) actually correct?**
  _`POST()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `login.ts, sign-in.ts, sign-out.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.ts, index.ts, index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._