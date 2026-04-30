globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as desc } from "./errors_DA1dbFwq.mjs";
import { C, a, D, b, c, M, N, O, Q, R, e, f, T, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v } from "./errors_DA1dbFwq.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
import { B, C as C2, e as e2, f as f2, E, g as g2, F, I, N as N2, O as O2, P, d, S, h as h2, a as a2, j as j2, T as T2, V, k as k2, W, l as l2, m as m2, n as n2, o as o2, p as p2, q as q2, r as r2, t as t2, u as u2, v as v2, w, x, c as c2, y, i as i2, b as b2, z, A, D as D2, G, H, J, K, L, M as M2, Q as Q2, R as R2, U } from "./utils_CzyLOgOI.mjs";
import { e as eq, a as and } from "./conditions_GHdPwyYE.mjs";
import { b as b3, c as c3, d as d2, f as f3, g as g3, h as h3, i as i3, j as j3, k as k3, l as l3, m as m3, n as n3, o as o3, p as p3, q as q3, r as r3, s as s2, t as t3, u as u3, v as v3, w as w2, x as x2, y as y2 } from "./conditions_GHdPwyYE.mjs";
import { a as a3, b as b4, c as c4, d as d3, m as m4, e as e3, s as s3, f as f4 } from "./aggregate_CFBl8rpx.mjs";
function toSql(value) {
  return JSON.stringify(value);
}
function l2Distance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <-> ${toSql(value)}`;
  }
  return sql`${column} <-> ${value}`;
}
function l1Distance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <+> ${toSql(value)}`;
  }
  return sql`${column} <+> ${value}`;
}
function innerProduct(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <#> ${toSql(value)}`;
  }
  return sql`${column} <#> ${value}`;
}
function cosineDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <=> ${toSql(value)}`;
  }
  return sql`${column} <=> ${value}`;
}
function hammingDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <~> ${toSql(value)}`;
  }
  return sql`${column} <~> ${value}`;
}
function jaccardDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <%> ${toSql(value)}`;
  }
  return sql`${column} <%> ${value}`;
}
export {
  B as BaseName,
  C2 as Column,
  C as ColumnAliasProxyHandler,
  e2 as ColumnBuilder,
  f2 as Columns,
  a as ConsoleLogWriter,
  D as DefaultLogger,
  b as DrizzleError,
  c as DrizzleQueryError,
  E as ExtraConfigBuilder,
  g2 as ExtraConfigColumns,
  F as FakePrimitiveParam,
  I as IsAlias,
  M as Many,
  N2 as Name,
  N as NoopLogger,
  O as One,
  O2 as OriginalName,
  P as Param,
  d as Placeholder,
  Q as QueryPromise,
  R as Relation,
  e as RelationTableAliasProxyHandler,
  f as Relations,
  S as SQL,
  h2 as Schema,
  a2 as StringChunk,
  j2 as Subquery,
  T2 as Table,
  T as TableAliasProxyHandler,
  g as TransactionRollbackError,
  V as View,
  k2 as ViewBaseConfig,
  W as WithSubquery,
  h as aliasedRelation,
  i as aliasedTable,
  j as aliasedTableColumn,
  and,
  l2 as applyMixins,
  b3 as arrayContained,
  c3 as arrayContains,
  d2 as arrayOverlaps,
  k as asc,
  a3 as avg,
  b4 as avgDistinct,
  f3 as between,
  g3 as bindIfParam,
  cosineDistance,
  c4 as count,
  d3 as countDistinct,
  l as createMany,
  m as createOne,
  n as createTableRelationsHelpers,
  desc,
  m2 as entityKind,
  eq,
  h3 as exists,
  o as extractTablesRelationalConfig,
  n2 as fillPlaceholders,
  o2 as getColumnNameAndConfig,
  p as getOperators,
  q as getOrderByOperators,
  p2 as getTableColumns,
  q2 as getTableLikeName,
  r2 as getTableName,
  t2 as getTableUniqueName,
  u2 as getViewName,
  v2 as getViewSelectedFields,
  i3 as gt,
  j3 as gte,
  hammingDistance,
  w as hasOwnEntityKind,
  x as haveSameKeys,
  k3 as ilike,
  l3 as inArray,
  innerProduct,
  c2 as is,
  y as isConfig,
  i2 as isDriverValueEncoder,
  m3 as isNotNull,
  n3 as isNull,
  b2 as isSQLWrapper,
  z as isTable,
  A as isView,
  jaccardDistance,
  l1Distance,
  l2Distance,
  o3 as like,
  p3 as lt,
  q3 as lte,
  r as mapColumnsInAliasedSQLToAlias,
  s as mapColumnsInSQLToAlias,
  t as mapRelationalRow,
  D2 as mapResultRow,
  G as mapUpdateSet,
  m4 as max,
  e3 as min,
  H as name,
  r3 as ne,
  J as noopDecoder,
  K as noopEncoder,
  L as noopMapper,
  u as normalizeRelation,
  s2 as not,
  t3 as notBetween,
  u3 as notExists,
  v3 as notIlike,
  w2 as notInArray,
  x2 as notLike,
  y2 as or,
  M2 as orderSelectedFields,
  Q2 as param,
  R2 as placeholder,
  v as relations,
  sql,
  s3 as sum,
  f4 as sumDistinct,
  U as textDecoder
};
