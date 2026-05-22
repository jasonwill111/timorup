/**
 * Accounts table (OAuth bindings + local auth)
 * TimorUp
 *
 * providerId: 'google' | 'facebook' | 'apple' | 'email' | 'phone'
 * 每个用户每个 provider 只能绑定一次
 */
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"

export const accounts = sqliteTable("accounts", {
  id: text().primaryKey().notNull(),
  userId: text("user_id").notNull(),
  accountId: text("account_id").notNull(),    // OAuth 账户 ID 或 email/phone
  providerId: text("provider_id").notNull(),  // 'google' | 'facebook' | 'apple' | 'email' | 'phone'
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at"),
  refreshTokenExpiresAt: integer("refresh_token_expires_at"),
  scope: text(),
  password: text(),                             // 本地密码哈希
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("accounts_user_idx").on(table.userId),
  uniqueIndex("accounts_user_provider_idx").on(table.userId, table.providerId),
  uniqueIndex("accounts_account_provider_idx").on(table.accountId, table.providerId),  // 同 OAuth 账号只能绑定一次
]);

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

// Provider enum type
export type ProviderId = "google" | "facebook" | "apple" | "email" | "phone";