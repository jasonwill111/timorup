/**
 * Verifications table
 * TimorUp
 *
 * type: email_verification | phone_verification | password_reset
 * usedAt: null = 未使用，timestamp = 已使用
 */
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

export const verifications = sqliteTable("verifications", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),              // 'email:xxx' | 'phone:+670xxx'
  type: text().notNull(),                    // 'email_verification' | 'phone_verification' | 'password_reset'
  value: text().notNull(),                  // 验证码
  expiresAt: integer("expires_at").notNull(),
  usedAt: integer("used_at"),               // null = 未使用
  createdAt: integer("created_at"),
},
(table) => [
  index("verifications_expires_idx").on(table.expiresAt),
]);

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;

// Verification type enum
export type VerificationType = "email_verification" | "phone_verification" | "password_reset";