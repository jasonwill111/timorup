# Plan: Review Reply & Admin Delete

## Context

Business owners need ability to reply to reviews. Admins need ability to delete reviews. Currently reviews are read-only.

## Architecture

### Components
- **Review Reply API**: `POST /api/reviews/:id/reply`
- **Admin Reviews API**: `GET /api/admin/reviews`, `DELETE /api/admin/reviews/:id`
- **Account Page**: Reviews section with reply button
- **Admin Reviews Page**: All reviews with delete button

### Data Model

```typescript
// reviews table - add columns
reply: text('reply')              // Owner's reply text
repliedAt: text('replied_at')      // ISO timestamp
repliedBy: text('replied_by')     // User ID who replied
```

### API Contracts

| Endpoint | Request | Response |
|----------|---------|----------|
| `POST /api/reviews/:id/reply` | `{ comment: string }` | `{ success: true, data: review }` |
| `GET /api/admin/reviews` | Query params | `{ data: reviews[], total }` |
| `DELETE /api/admin/reviews/:id` | Path param | `{ success: true }` |

## Technology Stack

- **Framework**: Astro 6 (SSR)
- **Database**: Drizzle ORM + D1 (SQLite)
- **Auth**: better-auth session

## Design

### Reply Flow
1. User visits `/account` → sees reviews for their business
2. User clicks "Reply" → modal or inline form opens
3. Submit → `POST /api/reviews/:id/reply`
4. Reply saved with timestamp
5. Business page shows review + reply

### Admin Delete Flow
1. Admin visits `/admin/reviews`
2. Sees all reviews with business name, user info
3. Click "Delete" → `DELETE /api/admin/reviews/:id`
4. Review deleted, business rating recalculated

## Rationale

1. **Reply in same table** - Reviews:replies = 1:1, same-table simpler
2. **Admin endpoint separate** - `/api/admin/reviews` for filtering/all data
3. **Rating update on delete** - Keep business rating stats consistent

## Implementation Phases

### Phase 1: Schema
- Add reply columns to `reviews` table
- Generate migration

### Phase 2: API
- Reply endpoint
- Admin reviews endpoints

### Phase 3: Frontend
- Account reviews section
- Admin reviews page

## Testing Strategy

Unit tests for API endpoints, integration tests for full flows.
