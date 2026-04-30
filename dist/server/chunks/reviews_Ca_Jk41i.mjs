globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
const prerender = false;
const $$Reviews = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Reviews" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6"> <h1 class="text-xl md:text-2xl font-bold">Reviews</h1> <p class="text-sm text-muted-foreground mt-1">Manage customer reviews for all businesses</p> </div> <!-- Search and Filters --> <div class="bg-card border rounded-lg p-3 md:p-4 mb-4"> <div class="flex flex-col md:flex-row gap-3"> <div class="flex-1"> <input type="text" id="search-input" placeholder="Search by business name, user, or comment..." class="w-full px-3 py-2 border rounded-lg text-sm"> </div> <div class="flex gap-2"> <select id="rating-filter" class="px-3 py-2 border rounded-lg text-sm"> <option value="">All Ratings</option> <option value="5">5 Stars</option> <option value="4">4 Stars</option> <option value="3">3 Stars</option> <option value="2">2 Stars</option> <option value="1">1 Star</option> </select> <input type="date" id="from-date" class="px-3 py-2 border rounded-lg text-sm" placeholder="From date"> <input type="date" id="to-date" class="px-3 py-2 border rounded-lg text-sm" placeholder="To date"> <button id="search-btn" class="px-4 py-2 bg-primary text-black rounded-lg text-sm font-medium hover:bg-primary/90">
Search
</button> </div> </div> </div> <!-- Reviews List --> <div class="bg-card border rounded-lg p-3 md:p-4"> <div class="flex items-center justify-between mb-4"> <h3 class="font-semibold text-sm md:text-base">All Reviews</h3> <span id="reviews-count" class="text-xs text-muted-foreground">Loading...</span> </div> <div id="reviews-list" class="space-y-2"> <p class="text-center text-muted-foreground py-4 text-sm">Loading...</p> </div> <!-- Pagination --> <div id="pagination" class="flex items-center justify-between mt-4 pt-4 border-t"> <span id="page-info" class="text-sm text-muted-foreground"></span> <div class="flex gap-2"> <button id="prev-btn" class="px-3 py-1 border rounded text-sm disabled:opacity-50" disabled>Previous</button> <button id="next-btn" class="px-3 py-1 border rounded text-sm disabled:opacity-50" disabled>Next</button> </div> </div> </div> </div>

  
  <div id="delete-modal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50"> <div class="bg-background rounded-lg p-6 max-w-sm w-full mx-4"> <h3 class="text-lg font-semibold mb-2">Delete Review</h3> <p class="text-muted-foreground mb-4">Are you sure you want to delete this review? This action cannot be undone.</p> <input type="hidden" id="delete-review-id" value=""> <div class="flex gap-2 justify-end"> <button id="delete-cancel" class="px-4 py-2 border rounded-lg text-sm">Cancel</button> <button id="delete-confirm" class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Delete</button> </div> </div> </div>
` })} ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/reviews.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/reviews.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/reviews.astro";
const $$url = "/admin/reviews";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Reviews,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
