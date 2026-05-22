/**
 * Users table
 * TimorUp
 *
 * role enum: 'user' | 'editor' | 'admin' | 'super_admin'
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text().primaryKey().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer("email_verified").default(0),
  countryCode: text("country_code").default("+670"),  // 下拉选择，如 +670
  phoneNumber: text("phone_number"),                    // 实际号码
  name: text().notNull(),                               // max 100 chars
  image: text(),
  role: text().default("user"),                         // 'user' | 'editor' | 'admin' | 'super_admin'
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("users_role_idx").on(table.role),
  uniqueIndex("users_email_unique").on(table.email),
  uniqueIndex("users_phone_unique").on(table.phoneNumber),  // 同号码只能注册一次
]);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Role enum type
export type UserRole = "user" | "editor" | "admin" | "super_admin";