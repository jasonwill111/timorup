/**
 * SEO Utilities
 * BreadcrumbList JSON-LD schema builder
 */

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

/**
 * Create BreadcrumbList JSON-LD schema
 * @param items - Array of breadcrumb items (name, url)
 * @returns schema.org BreadcrumbList object
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(index < items.length - 1 ? { "item": item?.url } : {})
    }))
  };
}