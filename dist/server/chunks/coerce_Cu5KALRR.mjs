globalThis.process ??= {};
globalThis.process.env ??= {};
import { _ as _coercedBigint, c as _coercedBoolean, d as _coercedDate, e as _coercedNumber, f as _coercedString, Z as ZodString, g as ZodNumber, h as ZodBoolean, i as ZodBigInt, j as ZodDate } from "./sequence_RDixOVvO.mjs";
function string(params) {
  return _coercedString(ZodString, params);
}
function number(params) {
  return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
  return _coercedBoolean(ZodBoolean, params);
}
function bigint(params) {
  return _coercedBigint(ZodBigInt, params);
}
function date(params) {
  return _coercedDate(ZodDate, params);
}
const coerce = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bigint,
  boolean,
  date,
  number,
  string
}, Symbol.toStringTag, { value: "Module" }));
export {
  boolean as b,
  coerce as c,
  date as d,
  number as n,
  string as s
};
