globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { b as renderTemplate, m as maybeRenderHead } from "./sequence_RDixOVvO.mjs";
import { r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_s6mBH5Qw.mjs";
import { $ as $$Button } from "./Button_DZTa0hZG.mjs";
const prerender = false;
const $$Blogs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Blog Posts" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead()}<div class="container py-4 px-2 md:py-6"> <!-- Page Header --> <div class="mb-4 md:mb-6 flex items-center justify-between"> <div> <h1 class="text-xl md:text-2xl font-bold">Blog Posts</h1> <p class="text-sm text-muted-foreground mt-1">Create and manage blog posts</p> </div> ${renderComponent($$result2, "Button", $$Button, {
    "id": "new-post-btn",
    "class": "text-xs py-1 h-7 md:text-sm md:h-9"
  }, { "default": ($$result3) => renderTemplate`+ New Post` })} </div> <!-- Filters --> <div class="flex flex-wrap gap-2 mb-4"> <input type="text" id="search-input" placeholder="Search posts..." class="px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-48"> <select id="status-filter" class="px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"> <option value="">All statuses</option> <option value="draft">Draft</option> <option value="published">Published</option> <option value="archived">Archived</option> </select> </div> <!-- Posts List --> <div class="bg-card border rounded-lg divide-y"> <div id="posts-list" class="divide-y divide-border"> <p class="text-center text-muted-foreground py-8 text-sm">Loading...</p> </div> </div> </div>

  
  <div id="post-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4" aria-modal="true"> <div class="bg-card border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"> <div class="p-4 border-b flex items-center justify-between"> <h2 class="text-lg font-bold" id="modal-title">New Blog Post</h2> <button id="close-modal" class="p-1 hover:bg-muted rounded"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="post-form" class="p-4 space-y-4"> <input type="hidden" id="post-id"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div class="md:col-span-2"> <label class="block text-sm font-medium mb-1">Title *</label> <input type="text" id="post-title" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Post title"> </div> <div class="md:col-span-2"> <label class="block text-sm font-medium mb-1">Slug *</label> <div class="flex gap-2"> <input type="text" id="post-slug" required class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="post-url-slug"> <button type="button" id="generate-slug-btn" class="px-3 py-2 text-sm border rounded-md hover:bg-muted whitespace-nowrap">
Auto
</button> </div> </div> <div class="md:col-span-2"> <label class="block text-sm font-medium mb-1">Excerpt</label> <textarea id="post-excerpt" rows="2" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Short summary (optional)"></textarea> </div> <div class="md:col-span-2"> <label class="block text-sm font-medium mb-1">Content</label> <div id="editor-container"></div> </div> <div> <label class="block text-sm font-medium mb-1">Status</label> <select id="post-status" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"> <option value="draft">Draft</option> <option value="published">Published</option> <option value="archived">Archived</option> </select> </div> <div> <label class="block text-sm font-medium mb-1">Tags (comma-separated)</label> <input type="text" id="post-tags" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="news, update, tips"> </div> </div> <div class="flex gap-2 pt-2"> <button type="submit" class="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity">
Save Post
</button> <button type="button" id="cancel-btn" class="px-4 py-2 border rounded-md hover:bg-muted transition-colors">
Cancel
</button> </div> </form> </div> </div>

  
  <div id="delete-modal" class="fixed inset-0 bg-black/50 z-50 hidden items-center justify-center p-4"> <div class="bg-card border rounded-lg w-full max-w-sm p-6 text-center"> <h3 class="text-lg font-bold mb-2">Delete Post?</h3> <p class="text-sm text-muted-foreground mb-4">This action cannot be undone.</p> <div class="flex gap-2"> <button id="confirm-delete-btn" class="flex-1 bg-red-500 text-white py-2 rounded-md hover:opacity-90 transition-opacity">
Delete
</button> <button id="cancel-delete-btn" class="flex-1 border py-2 rounded-md hover:bg-muted transition-colors">
Cancel
</button> </div> </div> </div>
` })} <!-- TipTap CSS --> <link rel="stylesheet" href="https://unpkg.com/@tiptap/core@3.22.3/dist/tiptap.min.css"> ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/blogs.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/pages/admin/blogs.astro", void 0);
const $$file = "/home/jasonwill/dev-projects/timorlist/src/pages/admin/blogs.astro";
const $$url = "/admin/blogs";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Blogs,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
