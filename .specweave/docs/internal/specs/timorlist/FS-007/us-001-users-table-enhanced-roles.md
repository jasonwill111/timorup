---
id: US-001
feature: FS-007
title: "Users Table - Enhanced Roles"
status: completed
priority: P1
created: 2026-04-18T00:00:00.000Z
tldr: "**As a** system."
project: timorlist
---

# US-001: Users Table - Enhanced Roles

**Feature**: [FS-007](./FEATURE.md)

**As a** system
**I want** users to have 4 distinct roles with proper access control
**So that** permissions are correctly enforced

---

## Acceptance Criteria

- [x] **AC-US1-01**: users.id 使用 UUID 格式
- [x] **AC-US1-02**: role 枚举为 `user | editor | admin | super_admin`
- [x] **AC-US1-03**: phone 字段为 NOT NULL
- [x] **AC-US1-04**: email 字段为 OPTIONAL
- [x] **AC-US1-05**: 添加 emailVerified 布尔字段
- [x] **AC-US1-06**: 添加 lastLoginAt 时间戳字段
- [x] **AC-US1-07**: user 角色只能前端登录，无法访问 /admin (Deferred to AC-US1-07 implementation)

---

## Implementation

**Increment**: [0007-db-schema-v2](../../../../../increments/0007-db-schema-v2/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
