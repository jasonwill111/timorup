globalThis.process ??= {};
globalThis.process.env ??= {};
import { getDb } from "./db_DBymDTwI.mjs";
import { d as categories } from "./index_CI1oSuTR.mjs";
import { y as or, e as eq, n as isNull } from "./conditions_GHdPwyYE.mjs";
import { d as desc } from "./errors_DA1dbFwq.mjs";
import { s as sql } from "./utils_CzyLOgOI.mjs";
const prerender = false;
async function GET({ request }) {
  const db = await getDb();
  try {
    const url = new URL(request.url);
    const entityType = url.searchParams.get("entityType");
    let categoriesResult;
    if (entityType) {
      categoriesResult = await db.select().from(categories).where(or(
        eq(categories.entityType, entityType),
        isNull(categories.entityType)
      )).orderBy(desc(categories.createdAt)).all();
    } else {
      categoriesResult = await db.select().from(categories).orderBy(desc(categories.createdAt)).all();
    }
    return new Response(JSON.stringify({
      success: true,
      data: categoriesResult
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Admin categories error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to fetch categories" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function POST({ request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { name, slug, description, icon, entityType, parentId } = body;
    const id = `cat-${Date.now()}`;
    await db.insert(categories).values({
      id,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description: description || "",
      icon: icon || "",
      entityType: entityType || "business",
      // Default to business
      parentId: parentId || null
    }).run();
    return new Response(JSON.stringify({
      success: true,
      data: { id, name, slug, entityType }
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Create category error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to create category" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function PUT({ request }) {
  const db = await getDb();
  try {
    const body = await request.json();
    const { id, name, slug, description, icon, entityType, parentId } = body;
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Category ID is required" }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const updatedCategory = await db.update(categories).set({
      ...name !== void 0 && { name },
      ...slug !== void 0 && { slug },
      ...description !== void 0 && { description },
      ...icon !== void 0 && { icon },
      ...entityType !== void 0 && { entityType },
      ...parentId !== void 0 && { parentId },
      updatedAt: sql`(strftime('%s', 'now'))`
    }).where(eq(categories.id, id)).returning().get();
    if (!updatedCategory) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: "Category not found" }
      }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({
      success: true,
      data: updatedCategory
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Update category error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: "Failed to update category" }
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
