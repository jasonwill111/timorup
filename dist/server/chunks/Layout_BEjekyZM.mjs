globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_BzwIkOFc.mjs";
import { m as maybeRenderHead, a as addAttribute, b as renderTemplate, F as Fragment, B as unescapeHTML, n as renderHead, r as renderSlot } from "./sequence_RDixOVvO.mjs";
import { s as spreadAttributes, r as renderComponent } from "./worker-entry_D6lIot5H.mjs";
import { r as renderScript } from "./globals_CioQ1ijG.mjs";
const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$ThemeToggle;
  const { class: className = "", "data-slot": slot = "theme-toggle", ...props } = Astro.props;
  return renderTemplate`${maybeRenderHead()}<button type="button"${addAttribute(["inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className], "class:list")} id="theme-toggle" aria-label="Toggle theme"${addAttribute(slot, "data-slot")}${spreadAttributes(props)}> <svg class="h-5 w-5 sun-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <circle cx="12" cy="12" r="5"></circle> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path> </svg> <svg class="h-5 w-5 moon-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path> </svg> </button> <script>
  (function() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const sunIcon = toggle.querySelector('.sun-icon');
    const moonIcon = toggle.querySelector('.moon-icon');

    function updateIcons(isDark) {
      if (isDark) {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
      } else {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
      }
    }

    // Initialize icons based on current theme
    const isDark = document.documentElement.classList.contains('dark');
    updateIcons(isDark);

    toggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateIcons(isDark);
    });
  })();
<\/script>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/ui/ThemeToggle.astro", void 0);
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro = $$result.createAstro($$props, $$slots);
  Astro.self = $$Header;
  const { currentPath = "/" } = Astro.props;
  const isLoggedIn = typeof window !== "undefined" && (sessionStorage.getItem("userId") || localStorage.getItem("userId"));
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> <div class="container max-w-6xl"> <div class="flex h-16 items-center justify-between"> <!-- Logo --> <a href="/" class="flex items-center gap-2"> <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center"> <span class="text-white font-bold text-lg">T</span> </div> <span class="font-bold text-xl hidden sm:inline-block">TIMORLIST</span> </a> <!-- Desktop Navigation --> <nav class="hidden md:flex items-center gap-6"> <a href="/listing"${addAttribute(["text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-2 py-1", currentPath.startsWith("/listing") ? "text-primary" : "text-muted-foreground"], "class:list")}>
Directory
</a> <a href="/products-services"${addAttribute(["text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-2 py-1", currentPath.startsWith("/products-services") ? "text-primary" : "text-muted-foreground"], "class:list")}>
Products & Services
</a> <a href="/pricing"${addAttribute(["text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-2 py-1", currentPath === "/pricing" ? "text-primary" : "text-muted-foreground"], "class:list")}>
Pricing
</a> <a href="/faq"${addAttribute(["text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-2 py-1", currentPath === "/faq" ? "text-primary" : "text-muted-foreground"], "class:list")}>
FAQ
</a> <a href="/listing/create" class="text-sm font-medium bg-primary text-black px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
+ Create
</a> </nav> <!-- Right Side --> <div class="flex items-center gap-2"> <!-- Theme Toggle (using shadcn theme component) --> ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, {})} <!-- Desktop Auth Buttons --> <div class="hidden md:flex items-center gap-2"> ${isLoggedIn ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a href="/account" class="text-sm font-medium text-muted-foreground hover:text-primary">
My Account
</a> <a href="/admin" class="text-sm font-medium text-muted-foreground hover:text-primary">
Admin
</a> ` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a href="/login" class="text-sm font-medium text-muted-foreground hover:text-primary">
Log in
</a> <a href="/register" class="text-sm font-medium bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
Sign Up
</a> ` })}`} </div> <!-- Mobile Menu Button --> <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Open menu"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="hidden md:hidden border-t"> <nav class="container max-w-6xl py-4 space-y-2"> <a href="/businesses"${addAttribute(["block px-3 py-2 rounded-lg text-sm font-medium", currentPath.startsWith("/businesses") ? "bg-muted text-primary" : "text-muted-foreground"], "class:list")}>
Businesses
</a> <a href="/categories"${addAttribute(["block px-3 py-2 rounded-lg text-sm font-medium", currentPath.startsWith("/categories") ? "bg-muted text-primary" : "text-muted-foreground"], "class:list")}>
Categories
</a> <a href="/pricing"${addAttribute(["block px-3 py-2 rounded-lg text-sm font-medium", currentPath === "/pricing" ? "bg-muted text-primary" : "text-muted-foreground"], "class:list")}>
Pricing
</a> <a href="/faq"${addAttribute(["block px-3 py-2 rounded-lg text-sm font-medium", currentPath === "/faq" ? "bg-muted text-primary" : "text-muted-foreground"], "class:list")}>
FAQ
</a> <div class="border-t pt-2 mt-2"> ${isLoggedIn ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a href="/account"${addAttribute(["block px-3 py-2 rounded-lg text-sm font-medium", currentPath === "/account" ? "bg-muted text-primary" : "text-muted-foreground"], "class:list")}>
My Account
</a> <a href="/admin"${addAttribute(["block px-3 py-2 rounded-lg text-sm font-medium", currentPath.startsWith("/admin") ? "bg-muted text-primary" : "text-muted-foreground"], "class:list")}>
Admin
</a> <button id="mobile-logout" class="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500">
Log Out
</button> ` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a href="/login" class="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground">
Log in
</a> <a href="/register" class="block px-3 py-2 rounded-lg text-sm font-medium bg-brand-500 text-white text-center">
Sign Up
</a> ` })}`} </div> </nav> </div> </header> ${renderScript($$result, "/home/jasonwill/dev-projects/timorlist/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/Header.astro", void 0);
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="border-t bg-muted/30 mb-0"> <div class="container max-w-6xl py-6"> <div class="grid grid-cols-1 md:grid-cols-4 gap-6"> <!-- Brand --> <div class="md:col-span-2"> <a href="/" class="flex items-center gap-2 mb-4"> <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center"> <span class="text-white font-bold text-lg">T</span> </div> <span class="font-bold text-xl">TIMORLIST</span> </a> <p class="text-muted-foreground text-sm mb-4 max-w-md">
Your trusted business directory in Timor-Leste. Discover local businesses, connect with customers, and grow your business.
</p> <div class="flex gap-4"> <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg> </a> <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path> </svg> </a> <a href="https://wa.me/670" class="text-muted-foreground hover:text-primary transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg> </a> </div> </div> <!-- Quick Links --> <div> <h3 class="font-semibold mb-4">Quick Links</h3> <ul class="space-y-2"> <li> <a href="/businesses" class="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
Browse Businesses
</a> </li> <li> <a href="/categories" class="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
Categories
</a> </li> <li> <a href="/pricing" class="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
Pricing
</a> </li> <li> <a href="/subscribe" class="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
Subscribe
</a> </li> <li> <a href="/faq" class="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
FAQ
</a> </li> </ul> </div> <!-- Contact --> <div> <h3 class="font-semibold mb-4">Contact</h3> <ul class="space-y-2 text-sm text-muted-foreground"> <li>Dili, Timor-Leste</li> <li> <a href="mailto:contact@timorlist.com" class="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
contact@timorlist.com
</a> </li> <li> <a href="tel:+670" class="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
+670
</a> </li> </ul> </div> </div> <div class="border-t mt-2 pt-2 flex flex-col md:flex-row justify-between items-center gap-4"> <p class="text-sm text-muted-foreground my-0 py-0">
&copy; ${currentYear} TIMORLIST. All rights reserved.
</p> <div class="flex gap-4"> <a href="/privacy" class="text-sm text-muted-foreground hover:text-primary transition-colors">
Privacy Policy
</a> <a href="/terms" class="text-sm text-muted-foreground hover:text-primary transition-colors">
Terms of Service
</a> </div> </div> </div> </footer>`;
}, "/home/jasonwill/dev-projects/timorlist/src/components/Footer.astro", void 0);
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Discover local businesses in Timor-Leste. Find restaurants, hotels, shops, and more on TIMORLIST - the premier business directory for Timor-Leste.", image = "/images/og-default.jpg", type = "website", publishedTime, author, structuredData, noIndex = false, noFollow = false } = Astro2.props;
  const siteUrl = "https://timorlist.com";
  const currentPath = Astro2.url.pathname;
  const canonicalUrl = `${siteUrl}${currentPath}`;
  const fullTitle = title.includes("TIMORLIST") ? title : `${title} | TIMORLIST`;
  const robotsContent = [noIndex ? "noindex" : "index", noFollow ? "nofollow" : "follow"].join(", ");
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TIMORLIST",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "description": "Business directory for Timor-Leste",
    "sameAs": [
      "https://facebook.com/tmbiz",
      "https://instagram.com/tmbiz",
      "https://twitter.com/tmbiz"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TL",
      "addressLocality": "Dili"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Timor-Leste"
    }
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TIMORLIST",
    "url": siteUrl,
    "description": "Discover local businesses in Timor-Leste",
    "publisher": {
      "@type": "Organization",
      "name": "TIMORLIST"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
  return renderTemplate`<html lang="en" suppressHydrationWarning> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- Inline theme script - prevents flash of wrong theme --><script>
      const getThemePreference = () => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
          return localStorage.getItem('theme');
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      };
      const isDark = getThemePreference() === 'dark';
      document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
      
      if (typeof localStorage !== 'undefined') {
        const observer = new MutationObserver(() => {
          const isDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      }
    <\/script><meta name="robots"${addAttribute(robotsContent, "content")}><!-- Primary Meta Tags --><title>${fullTitle}</title><meta name="title"${addAttribute(fullTitle, "content")}><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}><!-- Geo Tags for Local SEO --><meta name="geo.region" content="TL"><meta name="geo.placename" content="Timor-Leste"><meta name="geo.position" content="-8.5569;125.5603"><meta name="ICBM" content="-8.5569, 125.5603"><!-- Open Graph / Facebook --><meta property="og:type"${addAttribute(type, "content")}><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:title"${addAttribute(fullTitle, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(`${siteUrl}${image}`, "content")}><meta property="og:site_name" content="TIMORLIST"><meta property="og:locale" content="en_US">${publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>`}${author && renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`}<!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url"${addAttribute(canonicalUrl, "content")}><meta name="twitter:title"${addAttribute(fullTitle, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(`${siteUrl}${image}`, "content")}><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- Theme Color --><meta name="theme-color" content="#FFD150"><!-- Language Variants for SEO --><link rel="alternate" hreflang="en"${addAttribute(canonicalUrl, "href")}><link rel="alternate" hreflang="pt"${addAttribute(`${canonicalUrl.replace(siteUrl, "https://pt.timbiz.com")}`, "href")}><link rel="alternate" hreflang="tl"${addAttribute(`${canonicalUrl.replace(siteUrl, "https://tl.timbiz.com")}`, "href")}><link rel="alternate" hreflang="x-default"${addAttribute(canonicalUrl, "href")}><!-- Preconnect to external domains --><link rel="preconnect" href="https://timorlist-media.r2.cloudflarestorage.com"><!-- Structured Data (JSON-LD) --><script type="application/ld+json">${unescapeHTML(JSON.stringify(organizationSchema))}<\/script><script type="application/ld+json">${unescapeHTML(JSON.stringify(websiteSchema))}<\/script>${structuredData && renderTemplate`<script type="application/ld+json">${unescapeHTML(JSON.stringify(structuredData))}<\/script>`}${renderHead()}</head> <body class="min-h-screen bg-background font-inter antialiased flex flex-col"> ${renderComponent($$result, "Header", $$Header, { "currentPath": currentPath })} <main class="flex-1"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body> </html>`;
}, "/home/jasonwill/dev-projects/timorlist/src/layouts/Layout.astro", void 0);
export {
  $$Layout as $
};
