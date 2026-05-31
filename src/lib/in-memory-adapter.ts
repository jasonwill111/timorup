/**
 * In-Memory SQLite Adapter for Testing
 * Implements DatabaseAdapter for unit tests without D1 dependency
 */
import type { DatabaseAdapter, DatabaseSelectBuilder } from './adapters';
import type { AnyDrizzleTable } from 'drizzle-orm/sqlite-core';

// Simple in-memory storage
type TableData = Map<string, Record<string, unknown>[]>;

export class InMemoryAdapter implements DatabaseAdapter {
  private tables: TableData = new Map();
  private nextId = 1;

  constructor(initialData?: Record<string, Record<string, unknown>[]>) {
    if (initialData) {
      for (const [tableName, rows] of Object.entries(initialData)) {
        this.tables.set(tableName, [...rows]);
      }
    }
  }

  select(): DatabaseSelectBuilder {
    return new InMemorySelectBuilder(this.tables);
  }

  insert<T extends AnyDrizzleTable>(table: T) {
    return new InMemoryInsertBuilder(this.tables, table.tableName, () => this.nextId++);
  }

  update<T extends AnyDrizzleTable>(table: T) {
    return new InMemoryUpdateBuilder(this.tables, table.tableName);
  }

  delete<T extends AnyDrizzleTable>(table: T) {
    return new InMemoryDeleteBuilder(this.tables, table.tableName);
  }

  async run(_sql: string): Promise<void> {
    // No-op for compatibility
  }

  // Helper to seed data
  seed(tableName: string, rows: Record<string, unknown>[]): void {
    this.tables.set(tableName, [...rows]);
  }

  // Helper to get table data
  getTable(tableName: string): Record<string, unknown>[] {
    return this.tables.get(tableName) || [];
  }
}

// Select builder
class InMemorySelectBuilder implements DatabaseSelectBuilder {
  private tables: TableData;
  private tableName: string = '';
  private conditions: Array<{ column: string; value: unknown; op: string }> = [];
  private orderByCols: Array<{ column: string; dir: 'asc' | 'desc' }> = [];
  private limitValue?: number;
  private offsetValue?: number;

  constructor(tables: TableData) {
    this.tables = tables;
  }

  from<T extends AnyDrizzleTable>(table: T): this {
    this.tableName = table.tableName;
    return this;
  }

  where(condition: unknown): this {
    const cond = condition as { column: string; value: unknown; op: string };
    this.conditions.push(cond);
    return this;
  }

  orderBy(_columns: unknown): this {
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  async all(): Promise<unknown[]> {
    let rows = this.tables.get(this.tableName) || [];

    rows = rows.filter(row => {
      return this.conditions.every(cond => {
        const val = row[cond.column];
        switch (cond.op) {
          case 'eq': return val === cond.value;
          case 'ne': return val !== cond.value;
          case 'gt': return val > cond.value;
          case 'gte': return val >= cond.value;
          case 'lt': return val < cond.value;
          case 'lte': return val <= cond.value;
          default: return true;
        }
      });
    });

    if (this.orderByCols.length > 0) {
      rows.sort((a, b) => {
        for (const { column, dir } of this.orderByCols) {
          const valA = a[column];
          const valB = b[column];
          if (valA < valB) return dir === 'asc' ? -1 : 1;
          if (valA > valB) return dir === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    if (this.offsetValue) {
      rows = rows.slice(this.offsetValue);
    }
    if (this.limitValue) {
      rows = rows.slice(0, this.limitValue);
    }

    return rows;
  }

  async get(): Promise<unknown | undefined> {
    const results = await this.all();
    return results[0];
  }
}

// Insert builder
class InMemoryInsertBuilder {
  private tables: TableData;
  private tableName: string;
  private getNextId: () => number;

  constructor(tables: TableData, tableName: string, getNextId: () => number) {
    this.tables = tables;
    this.tableName = tableName;
    this.getNextId = getNextId;
  }

  values(values: unknown) {
    const self = this;
    return {
      run: async () => {
        const rows = self.tables.get(self.tableName) || [];
        const record = values as Record<string, unknown>;
        if (!record.id) {
          (record as Record<string, unknown>).id = String(self.getNextId());
        }
        rows.push(record);
        self.tables.set(self.tableName, rows);
      }
    };
  }
}

// Update builder
class InMemoryUpdateBuilder {
  private tables: TableData;
  private tableName: string;

  constructor(tables: TableData, tableName: string) {
    this.tables = tables;
    this.tableName = tableName;
  }

  set(values: unknown) {
    const updateValues = values as Record<string, unknown>;
    const self = this;

    return {
      where(condition: unknown) {
        const cond = condition as { column: string; value: unknown; op: string };
        let updatedRow: Record<string, unknown> | undefined;

        return {
          returning() {
            return {
              get: async () => updatedRow
            };
          },
          run: async () => {
            const rows = self.tables.get(self.tableName) || [];
            const index = rows.findIndex(row => row[cond.column] === cond.value);
            if (index !== -1) {
              rows[index] = { ...rows[index], ...updateValues };
              updatedRow = rows[index];
              self.tables.set(self.tableName, rows);
            }
          }
        };
      },
      run: async () => {
        const rows = self.tables.get(self.tableName) || [];
        for (const row of rows) {
          if (row[cond.column as string] === cond.value) {
            Object.assign(row, updateValues);
          }
        }
        self.tables.set(self.tableName, rows);
      }
    };
  }
}

// Delete builder
class InMemoryDeleteBuilder {
  private tables: TableData;
  private tableName: string;

  constructor(tables: TableData, tableName: string) {
    this.tables = tables;
    this.tableName = tableName;
  }

  where(condition: unknown) {
    const cond = condition as { column: string; value: unknown; op: string };
    const self = this;
    return {
      run: async () => {
        const rows = self.tables.get(self.tableName) || [];
        const filtered = rows.filter(row => row[cond.column] !== cond.value);
        self.tables.set(self.tableName, filtered);
      }
    };
  }
}
