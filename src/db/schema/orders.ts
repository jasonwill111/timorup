/**
 * Orders table (Service Package Purchases)
 * TimorUp
 *
 * Stores SNAPSHOT of selected variant at purchase time
 * variantSnapshot JSON: { name, price, currency, durationValue, durationUnit, skuLimit, features }
 */
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

export const orders = sqliteTable("orders", {
  id: text().primaryKey().notNull(),

  // Association
  servicePackageId: text("service_package_id"),

  // Variant snapshot (values at purchase time)
  variantSnapshot: text("variant_snapshot").notNull(),  // JSON

  // Order info
  type: text().notNull(),                       // business_page | listing_renewal
  typeId: text("type_id"),                      // business_id | listing_id
  userId: text("user_id").notNull(),

  // Payment
  amount: integer().notNull(),                  // 元
  status: text().default("pending"),            // pending | paid | cancelled | refunded
  paymentMethod: text("payment_method"),
  paidDate: integer("paid_date"),

  // Validity period
  expiresAt: integer("expires_at"),

  // Admin
  adminNotes: text("admin_notes"),
  createdAt: integer("created_at"),
  updatedAt: integer("updated_at"),
},
(table) => [
  index("orders_service_package_idx").on(table.servicePackageId),
  index("orders_type_idx").on(table.type),
  index("orders_type_id_idx").on(table.typeId),
  index("orders_user_idx").on(table.userId),
  index("orders_status_idx").on(table.status),
  index("orders_type_typeid_status_idx").on(table.type, table.typeId, table.status),  // 快速查询某实体有效订单
]);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;