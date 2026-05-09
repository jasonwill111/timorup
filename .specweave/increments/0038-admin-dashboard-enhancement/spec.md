---
increment: 0038-admin-dashboard-enhancement
title: "Admin Dashboard Enhancement"
type: feature
priority: P1
status: completed
created: 2026-05-09
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Admin Dashboard Enhancement

**Project**: timorlist

## Overview

Enhanced admin dashboard with comprehensive stats cards, MTD metrics, interactive charts, and plans page improvements. Includes mobile-responsive design and role-based access control.

## User Stories

### US-001: Dashboard Stats Overview (P1)
**As an** admin user
**I want to** see a comprehensive overview of platform metrics
**So that** I can quickly assess the health of the platform

**Acceptance Criteria**:
- [x] **AC-US1-01**: Total counts displayed: Users, Businesses, Non-Profits, Products, Categories
- [x] **AC-US1-02**: MTD metrics shown: Revenue, New Subscriptions, New Users
- [x] **AC-US1-03**: Expiring Soon alert card (subscriptions expiring within 7 days)
- [x] **AC-US1-04**: All stat cards are clickable, linking to respective admin pages
- [x] **AC-US1-05**: Dashboard is fully responsive for mobile devices

---

### US-002: Analytics Charts (P1)
**As an** admin user
**I want to** visualize trends over time
**So that** I can understand growth patterns

**Acceptance Criteria**:
- [x] **AC-US2-01**: Revenue bar chart showing last 6 months
- [x] **AC-US2-02**: New Subscriptions line chart (6 months)
- [x] **AC-US2-03**: New Users line chart (6 months)
- [x] **AC-US2-04**: Charts have hover tooltips with exact values

---

### US-003: Plans Page Protection (P1)
**As an** admin user
**I want to** see clear warnings about plan changes
**So that** I understand the impact of modifications

**Acceptance Criteria**:
- [x] **AC-US3-01**: Prominent warning banner above plans table
- [x] **AC-US3-02**: Only super_admin can edit plans
- [x] **AC-US3-03**: Other roles see "View only" for plan actions

---

### US-004: Recent Activity (P2)
**As an** admin user
**I want to** see recent subscriptions at a glance
**So that** I can monitor new signups

**Acceptance Criteria**:
- [x] **AC-US4-01**: Recent subscriptions list displayed on dashboard
- [x] **AC-US4-02**: Quick Actions panel with shortcuts to common tasks

---

## Implementation Details

### Dashboard Stats API
- Endpoint: `/api/admin/stats`
- Returns: totalUsers, totalBusinesses, totalNonProfits, liveBusinesses, totalSubscriptions, totalRevenue, totalProducts, totalCategories, expiringSoon, mtd metrics, monthly data
- Uses Unix timestamps for date comparisons (orders table stores dates as integers)

### Responsive Breakpoints
- Mobile: `grid-cols-2`, smaller icons/text, `h-24` for charts
- Desktop: `grid-cols-3` to `grid-cols-5`, standard icons/text, `h-32` for charts

### Role-Based Access
- super_admin: Full edit access to plans
- admin/editor: View only for plans
- All authenticated users: Can view dashboard

## Files Modified
- `src/pages/admin/index.astro` - Dashboard page with stats and charts
- `src/pages/admin/plans.astro` - Plans page with warning banner and RBAC
- `src/pages/api/admin/stats.ts` - Stats API with MTD and monthly data
- `src/pages/api/admin/subscriptions.ts` - Subscriptions API for recent activity
