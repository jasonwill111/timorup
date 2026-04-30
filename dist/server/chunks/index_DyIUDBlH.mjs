globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { b as businessPages } from "./index_CI1oSuTR.mjs";
import { e as eq, o as like, a as and } from "./conditions_GHdPwyYE.mjs";
import { p as ZodError, o as object, q as _enum, t as number, u as array, s as string, v as url, w as literal, x as email } from "./sequence_RDixOVvO.mjs";
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
const createSchema = object({
  entityType: _enum(["business", "government", "nonprofit"]),
  title: string().min(1),
  categoryId: string().optional(),
  industry: string().optional(),
  contactName: string().optional(),
  countryCode: string().default("+670"),
  contactNumber: string().optional(),
  email: email().optional().or(literal("")),
  registrationUrl: url().optional().or(literal("")),
  address: string().optional(),
  aboutUs: string().optional(),
  tags: array(string()).optional(),
  yearOfEstablishment: number().optional(),
  status: _enum(["draft", "live", "suspended"]).default("draft")
});
function generateSlug(title) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base}-${nanoid(6)}`;
}
const GET = async ({ url: url2 }) => {
  const db = await getDb();
  const entityType = url2.searchParams.get("entityType");
  const status = url2.searchParams.get("status");
  const search = url2.searchParams.get("search");
  let query = db.select().from(businessPages);
  const conditions = [];
  if (entityType) {
    conditions.push(eq(businessPages.entityType, entityType));
  }
  if (status) {
    conditions.push(eq(businessPages.status, status));
  }
  if (search) {
    conditions.push(like(businessPages.title, `%${search}%`));
  }
  const listings = conditions.length > 0 ? await query.where(and(...conditions)).all() : await query.all();
  return new Response(JSON.stringify({ success: true, data: listings }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  const db = await getDb();
  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const slug = generateSlug(data.title);
    const newListing = {
      id: nanoid(),
      title: data.title,
      slug,
      ownerId: "admin",
      // TODO: Get from session
      entityType: data.entityType,
      categoryId: data.categoryId || null,
      industry: data.industry || null,
      contactName: data.contactName || null,
      countryCode: data.countryCode,
      contactNumber: data.contactNumber || null,
      email: data.email || null,
      registrationUrl: data.registrationUrl || null,
      address: data.address || null,
      aboutUs: data.aboutUs || null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      yearOfEstablishment: data.yearOfEstablishment || null,
      status: data.status
    };
    await db.insert(businessPages).values(newListing);
    return new Response(JSON.stringify({ id: newListing.id, slug }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: "Validation failed", details: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.error("Error creating listing:", error);
    return new Response(JSON.stringify({ error: "Failed to create listing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
