/**
 * Zod Schema Generator
 * Generates Zod schemas from Drizzle table definitions
 */
import * as z from 'zod';
import type { SQLiteColumn, SQLiteTable } from 'drizzle-orm/sqlite-core';

/**
 * Map Drizzle column types to Zod types
 */
function drizzleTypeToZod(column: SQLiteColumn): z.ZodTypeAny {
  const dataType = column.dataType;

  switch (dataType) {
    case 'string':
      return column.notNull ? z.string() : z.string().nullable();
    case 'number':
      if (column.columnType === 'SQLiteInteger') {
        return column.notNull ? z.number() : z.number().nullable();
      }
      return column.notNull ? z.number() : z.number().nullable();
    case 'boolean':
      return column.notNull ? z.boolean() : z.boolean().nullable();
    case 'date':
    case 'timestamp':
      return column.notNull ? z.date() : z.date().nullable();
    case 'json':
      return z.record(z.string(), z.unknown());
    default:
      return z.unknown();
  }
}

/**
 * Get column name from Drizzle column
 */
function getColumnName(column: SQLiteColumn): string {
  return column.name;
}

/**
 * Generate Zod schema from a Drizzle table
 */
export function generateZodSchema<T extends SQLiteTable>(
  table: T,
  options?: {
    pick?: string[];
    omit?: string[];
    partial?: boolean;
  }
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const columns = Object.values(tableColumns(table));

  // Filter columns
  let filteredColumns = columns;

  if (options?.pick) {
    filteredColumns = filteredColumns.filter(col => options.pick!.includes(getColumnName(col)));
  }

  if (options?.omit) {
    filteredColumns = filteredColumns.filter(col => !options.omit!.includes(getColumnName(col)));
  }

  // Build shape
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const column of filteredColumns) {
    const name = getColumnName(column);
    const zodType = drizzleTypeToZod(column);

    if (options?.partial && column.notNull && !column.default && !column.generated) {
      // Make non-nullable fields optional in partial mode
      shape[name] = zodType.optional();
    } else {
      shape[name] = zodType;
    }
  }

  return z.object(shape);
}

/**
 * Extract columns from a Drizzle table
 */
function tableColumns(table: SQLiteTable): Record<string, SQLiteColumn> {
  // Use Drizzle's internal column tracking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columnsMap = (table as any)[Symbol.for('drizzle:columns')] || {};
  return columnsMap;
}

/**
 * Create a Zod enum from a Drizzle enum column
 */
export function zodEnumFromColumn<T extends readonly string[]>(
  column: SQLiteColumn,
  values: T
): z.ZodEnum<T> {
  return z.enum(values);
}

// Re-export common Zod types
export { z };

/**
 * Pre-built schema helpers
 */
export const schemas = {
  /**
   * UUID string (matches nanoid format)
   */
  uuid: z.string().regex(/^[a-zA-Z0-9_-]{10,}$/),

  /**
   * Slug string (lowercase, hyphens, numbers)
   */
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  /**
   * Email string
   */
  email: z.string().email(),

  /**
   * Optional email
   */
  optionalEmail: z.string().email().optional().or(z.literal('')),

  /**
   * ISO date string
   */
  isoDate: z.string().datetime(),

  /**
   * Pagination params
   */
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
  }),
};

/**
 * Type utilities for generated schemas
 */
export type FromSchema<T extends z.ZodObject<Record<string, z.ZodTypeAny>>> =
  z.infer<T>;