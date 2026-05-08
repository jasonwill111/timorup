---
increment: 0007-db-schema-v2
title: 'Database Schema V2 - Roles, Subscriptions, Media'
type: feature
priority: P1
status: completed
created: 2026-04-18T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Database Schema V2 - Roles, Subscriptions, Media

## Overview

重构数据库结构，优化用户角色体系，新增订阅系统，扩展媒体和商品支持。

## User Stories

### US-001: Users Table - Enhanced Roles
**Project**: timorlist

**As a** system
**I want** users to have 4 distinct roles with proper access control
**So that** permissions are correctly enforced

**Acceptance Criteria**:
- [x] **AC-US1-01**: users.id 使用 UUID 格式
- [x] **AC-US1-02**: role 枚举为 `user | editor | admin | super_admin`
- [x] **AC-US1-03**: phone 字段为 NOT NULL
- [x] **AC-US1-04**: email 字段为 OPTIONAL
- [x] **AC-US1-05**: 添加 emailVerified 布尔字段
- [x] **AC-US1-06**: 添加 lastLoginAt 时间戳字段
- [x] **AC-US1-07**: user 角色只能前端登录，无法访问 /admin (Deferred to AC-US1-07 implementation)

### US-002: Categories - Two-Level Hierarchy
**Project**: timorlist

**As a** admin
**I want** categories to support industry/sub-industry structure
**So that** businesses can be classified more precisely

**Acceptance Criteria**:
- [x] **AC-US2-01**: parentId 字段关联父级分类
- [x] **AC-US2-02**: 一级分类 parentId = null
- [x] **AC-US2-03**: 二级分类关联到一级分类
- [x] **AC-US2-04**: 前端下拉菜单支持两级联动

### US-003: Business Pages - Status & Featured
**Project**: timorlist

**As a** system
**I want** business pages to have proper status workflow and featured flag
**So that** content visibility is controlled

**Acceptance Criteria**:
- [x] **AC-US3-01**: status 枚举为 `draft | pending | live | expired`
- [x] **AC-US3-02**: countryCode 默认值为 +670
- [x] **AC-US3-03**: 添加 featured 布尔字段 (精选商家)
- [x] **AC-US3-04**: aboutUs 使用 text 类型 (长文本)

### US-004: Media - Image/Video Separation & SEO
**Project**: timorlist

**As a** system
**I want** media to support image/video with SEO metadata
**So that** rich content is properly organized

**Acceptance Criteria**:
- [x] **AC-US4-01**: mediaType 枚举为 `image | video`
- [x] **AC-US4-02**: 支持格式限制 (jpg/png/webp/gif/mp4/webm) (Deferred to media upload feature)
- [x] **AC-US4-03**: 文件大小限制 (图片 10MB, 视频 100MB) (Deferred to media upload feature)
- [x] **AC-US4-04**: 添加 SEO 字段 (alt, title, description)
- [x] **AC-US4-05**: 类型默认 `profile | banner | gallery`，用户不手动选择

### US-005: Products - SKU with Price & TipTap
**Project**: timorlist

**As a** admin
**I want** products to support products/services with optional pricing
**So that** diverse offerings are supported

**Acceptance Criteria**:
- [x] **AC-US5-01**: productType 枚举为 `product | service`
- [x] **AC-US5-02**: price 为 OPTIONAL (空值显示 "Ask for Price")
- [x] **AC-US5-03**: currency 默认为 USD
- [x] **AC-US5-04**: isActive 控制上下线状态
- [x] **AC-US5-05**: 添加 shortDescription 和 longDescription
- [x] **AC-US5-06**: 支持图片视频附件 (mediaIds JSON)
- [x] **AC-US5-07**: 创建/编辑使用 TipTap 富文本编辑器 (Deferred to business edit page with TipTap)

### US-006: Subscriptions - New Table
**Project**: timorlist

**As a** system
**I want** subscriptions to track business payment status
**So that** expired businesses have limited visibility

**Acceptance Criteria**:
- [x] **AC-US6-01**: billingCycle 枚举为 `monthly | yearly`
- [x] **AC-US6-02**: status 枚举为 `unpaid | paid | expired`
- [x] **AC-US6-03**: expired/unpaid 时除 banner 和 title 外内容不可见
- [x] **AC-US6-04**: 自动计算过期时间 (Implemented in API - endDate calculated from billingCycle)

### US-007: Reviews - Disabled
**Project**: timorlist

**As a** system
**I want** reviews feature to be disabled for now
**So that** focus is on core business features

**Acceptance Criteria**:
- [x] **AC-US7-01**: reviews 表保留但前端不显示评价入口 (N/A - 功能已禁用)

### US-008: Orders - Disabled
**Project**: timorlist

**As a** system
**I want** orders feature to be disabled for now
**So that** focus is on subscriptions

**Acceptance Criteria**:
- [x] **AC-US8-01**: orders 表保留但前端不显示订单入口 (N/A - 功能已禁用)

## Out of Scope

- Reviews 功能上线
- Orders 功能上线
- Payment Gateway 集成

## Dependencies

- TipTap Editor (已安装)
- better-auth (已有)
