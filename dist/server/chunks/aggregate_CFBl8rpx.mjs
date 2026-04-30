globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as sql, c as is, C as Column } from "./utils_CzyLOgOI.mjs";
function count(expression) {
  return sql`count(${expression || sql.raw("*")})`.mapWith(Number);
}
function countDistinct(expression) {
  return sql`count(distinct ${expression})`.mapWith(Number);
}
function avg(expression) {
  return sql`avg(${expression})`.mapWith(String);
}
function avgDistinct(expression) {
  return sql`avg(distinct ${expression})`.mapWith(String);
}
function sum(expression) {
  return sql`sum(${expression})`.mapWith(String);
}
function sumDistinct(expression) {
  return sql`sum(distinct ${expression})`.mapWith(String);
}
function max(expression) {
  return sql`max(${expression})`.mapWith(is(expression, Column) ? expression : String);
}
function min(expression) {
  return sql`min(${expression})`.mapWith(is(expression, Column) ? expression : String);
}
export {
  avg as a,
  avgDistinct as b,
  count as c,
  countDistinct as d,
  min as e,
  sumDistinct as f,
  max as m,
  sum as s
};
