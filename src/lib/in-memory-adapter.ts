/**
 * In-Memory SQLite Adapter for Testing
 * Implements DatabaseAdapter for unit tests without D1 dependency
 */
import type { DatabaseAdapter } from './adapters';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(): any {
    return new InMemorySelectBuilder(this.tables);
  }

  insert<T extends { tableName: string }>(table: T): InMemoryInsertBuilder<T> {
    return new InMemoryInsertBuilder(this.tables, table.tableName, () => this.nextId++);
  }

  update<T extends { tableName: string }>(table: T): InMemoryUpdateBuilder<T> {
    return new InMemoryUpdateBuilder(this.tables, table.tableName);
  }

  delete<T extends { tableName: string }>(table: T): InMemoryDeleteBuilder<T> {
    return new InMemoryDeleteBuilder(this.tables, table.tableName);
  }

  async run(sql: string): Promise<void> {
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
class InMemorySelectBuilder {
  private tables: TableData;
  private tableName: string = '';
  private conditions: Array<{ column: string; value: unknown; op: string }> = [];
  private orderBy: Array<{ column: string; dir: 'asc' | 'desc' }> = [];
  private limitValue?: number;
  private offsetValue?: number;

  constructor(tables: TableData) {
    this.tables = tables;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from<T extends { tableName: string }>(table: T): any {
    this.tableName = table.tableName;
    return this;
  }

  where(condition: { column: string; value: unknown; op: string }): this {
    this.conditions.push(condition as { column: string; value: unknown; op: string });
    return this;
  }

  orderBy(column: string, dir: 'asc' | 'desc' = 'asc'): this {
    this.orderBy.push({ column, dir });
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  async all(): Promise<unknown[]> {
    let rows = this.tables.get(this.tableName) || [];

    // Apply filters
    rows = rows.filter(row => {
      return this.conditions.every(cond => {
        const val = row[cond.column];
        switch (cond.op) {
          case 'eq': return val === cond.value;
          case 'ne': return val !== cond.value;
          default: return true;
        }
      });
    });

    // Apply ordering
    if (this.orderBy.length > 0) {
      rows.sort((a, b) => {
        for (const { column, dir } of this.orderBy) {
          const aVal = a[column];
          const bVal = b[column];
          if (aVal < bVal) return dir === 'asc' ? -1 : 1;
          if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply limit
    if (this.limitValue !== undefined) {
      rows = rows.slice(0, this.limitValue);
    }

    return rows;
  }

  async get(): Promise<unknown | undefined> {
    const results = await this.all();
    return results[0];
  }

  returning() {
    return this;
  }
}

// Insert builder
class InMemoryInsertBuilder<T> {
  private tables: TableData;
  private tableName: string;
  private getNextId: () => number;

  constructor(tables: TableData, tableName: string, getNextId: () => number) {
    this.tables = tables;
    this.tableName = tableName;
    this.getNextId = getNextId;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values(values: any): any {
    return {
      async run(): Promise<void> {
        const rows = this.tables.get(this.tableName) || [];
        rows.push({ id: this.getNextId(), ...values });
        this.tables.set(this.tableName, rows);
      }
    };
  }
}

// Update builder
class InMemoryUpdateBuilder<T> {
  private tables: TableData;
  private tableName: string;
  private setValues: Record<string, unknown> = {};
  private conditions: Array<{ column: string; value: unknown }> = [];

  constructor(tables: TableData, tableName: string) {
    this.tables = tables;
    this.tableName = tableName;
  }

  set(values: Record<string, unknown>): InMemoryUpdateSetBuilder<T> {
    this.setValues = values;
    return new InMemoryUpdateSetBuilder(this.tables, this.tableName, this.setValues);
  }
}

class InMemoryUpdateSetBuilder<T> {
  private tables: TableData;
  private tableName: string;
  private setValues: Record<string, unknown>;
  private conditions: Array<{ column: string; value: unknown }> = [];

  constructor(tables: TableData, tableName: string, setValues: Record<string, unknown>) {
    this.tables = tables;
    this.tableName = tableName;
    this.setValues = setValues;
  }

  where(condition: { column: string; value: unknown }): InMemoryUpdateWhereBuilder<T> {
    this.conditions.push(condition);
    return new InMemoryUpdateWhereBuilder(this.tables, this.tableName, this.setValues, this.conditions);
  }
}

class InMemoryUpdateWhereBuilder<T> {
  private tables: TableData;
  private tableName: string;
  private setValues: Record<string, unknown>;
  private conditions: Array<{ column: string; value: unknown }>;

  constructor(
    tables: TableData,
    tableName: string,
    setValues: Record<string, unknown>,
    conditions: Array<{ column: string; value: unknown }>
  ) {
    this.tables = tables;
    this.tableName = tableName;
    this.setValues = setValues;
    this.conditions = conditions;
  }

  returning() {
    return {
      async get(): Promise<unknown | undefined> {
        const rows = this.tables.get(this.tableName) || [];
        const idx = rows.findIndex(row =>
          this.conditions.every(c => row[c.column] === c.value)
        );
        if (idx === -1) return undefined;
        Object.assign(rows[idx], this.setValues);
        return rows[idx];
      }
    };
  }

  async run(): Promise<void> {
    const rows = this.tables.get(this.tableName) || [];
    rows.forEach((row, idx) => {
      if (this.conditions.every(c => row[c.column] === c.value)) {
        Object.assign(rows[idx], this.setValues);
      }
    });
    this.tables.set(this.tableName, rows);
  }
}

// Delete builder
class InMemoryDeleteBuilder<T> {
  private tables: TableData;
  private tableName: string;
  private conditions: Array<{ column: string; value: unknown }> = [];

  constructor(tables: TableData, tableName: string) {
    this.tables = tables;
    this.tableName = tableName;
  }

  where(condition: { column: string; value: unknown }): InMemoryDeleteWhereBuilder<T> {
    this.conditions.push(condition);
    return new InMemoryDeleteWhereBuilder(this.tables, this.tableName, this.conditions);
  }
}

class InMemoryDeleteWhereBuilder<T> {
  private tables: TableData;
  private tableName: string;
  private conditions: Array<{ column: string; value: unknown }>;

  constructor(
    tables: TableData,
    tableName: string,
    conditions: Array<{ column: string; value: unknown }>
  ) {
    this.tables = tables;
    this.tableName = tableName;
    this.conditions = conditions;
  }

  async run(): Promise<void> {
    const rows = this.tables.get(this.tableName) || [];
    const filtered = rows.filter(row =>
      !this.conditions.every(c => row[c.column] === c.value)
    );
    this.tables.set(this.tableName, filtered);
  }
}