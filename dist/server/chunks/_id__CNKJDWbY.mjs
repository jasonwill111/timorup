globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq } from "./conditions_GHdPwyYE.mjs";
import { p as ZodError, o as object, q as _enum, t as number, u as array, s as string, v as url, w as literal, x as email } from "./sequence_RDixOVvO.mjs";
const updateSchema = object({
  title: string().min(1).optional(),
  categoryId: string().optional(),
  industry: string().optional().nullable(),
  contactName: string().optional().nullable(),
  countryCode: string().optional(),
  contactNumber: string().optional().nullable(),
  email: email().optional().nullable().or(literal("")),
  registrationUrl: url().optional().nullable().or(literal("")),
  address: string().optional().nullable(),
  aboutUs: string().optional().nullable(),
  tags: array(string()).optional().nullable(),
  yearOfEstablishment: number().optional().nullable(),
  status: _enum(["draft", "live", "suspended"]).optional()
});
const GET = async ({ params }) => {
  const listing = await db.select().from(businessPages).where(eq(businessPages.id, params.id ?? "")).get();
  if (!listing) {
    return new Response(JSON.stringify({ error: "Listing not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify(listing), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const PUT = async ({ params, request }) => {
  try {
    const body = await request.json();
    const data = updateSchema.parse(body);
    const existing = await db.select().from(businessPages).where(eq(businessPages.id, params.id ?? "")).get();
    if (!existing) {
      return new Response(JSON.stringify({ error: "Listing not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const updateData = {};
    if (data.title !== void 0) updateData.title = data.title;
    if (data.categoryId !== void 0) updateData.categoryId = data.categoryId;
    if (data.industry !== void 0) updateData.industry = data.industry;
    if (data.contactName !== void 0) updateData.contactName = data.contactName;
    if (data.countryCode !== void 0) updateData.countryCode = data.countryCode;
    if (data.contactNumber !== void 0) updateData.contactNumber = data.contactNumber;
    if (data.email !== void 0) updateData.email = data.email || null;
    if (data.registrationUrl !== void 0) updateData.registrationUrl = data.registrationUrl || null;
    if (data.address !== void 0) updateData.address = data.address;
    if (data.aboutUs !== void 0) updateData.aboutUs = data.aboutUs;
    if (data.tags !== void 0) updateData.tags = data.tags ? JSON.stringify(data.tags) : null;
    if (data.yearOfEstablishment !== void 0) updateData.yearOfEstablishment = data.yearOfEstablishment;
    if (data.status !== void 0) updateData.status = data.status;
    await db.update(businessPages).set(updateData).where(eq(businessPages.id, params.id ?? ""));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: "Validation failed", details: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.error("Error updating listing:", error);
    return new Response(JSON.stringify({ error: "Failed to update listing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params }) => {
  await db.delete(businessPages).where(eq(businessPages.id, params.id ?? ""));
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
