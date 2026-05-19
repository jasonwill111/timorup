// AI Validation Schemas - Zod v4 structured output schemas for Mastra agents
// MUST match the exact DB/API schema for listings, products, etc.
import * as z from 'zod';

// ============================================
// Listing Creation Schema - MUST match API schema
// ============================================
// Helper schema for opening hours - MUST match DB format: { "monday": { "open": "09:00", "close": "17:00" } }
const OpeningHoursSchema = z.record(z.string(), z.object({
  open: z.string(),
  close: z.string(),
}));

// Tags stored as JSON string in DB
const TagsSchema = z.array(z.string());

export const ListingDataSchema = z.object({
  action: z.literal('create_listing'),
  data: z.object({
    // Exact fields from src/pages/api/admin/listing/index.ts createSchema
    entityType: z.enum(['business', 'government', 'nonprofit', 'non-profit']),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().optional(),
    categoryId: z.string().optional(),
    industry: z.string().optional(),
    contactName: z.string().optional(),
    countryCode: z.string().default('+670'),
    contactNumber: z.string().optional(),
    email: z.email().optional().or(z.literal('')),
    registrationUrl: z.string().optional().or(z.literal('')),
    address: z.string().optional(),
    aboutUs: z.string().optional(),
    tags: TagsSchema.optional(),  // Stored as JSON string in DB
    yearOfEstablishment: z.number().optional(),
    openingHours: OpeningHoursSchema.optional(),  // { "monday": { "open": "07:00", "close": "22:00" } }
    locationLat: z.number().optional(),
    locationLng: z.number().optional(),
    status: z.enum(['draft', 'live', 'suspended']).default('draft'),
    verifiedBadge: z.boolean().optional(),
    socialLinks: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
    }).optional(),
    photoGallery: z.array(z.string()).optional(),
    planType: z.string().optional(),
  }),
});

// ============================================
// SKU/Product Creation Schema - MUST match products table
// ============================================
export const PriceFieldSchema = z.object({
  label: z.string().min(1),
  value: z.string(),
  unit: z.string().optional(),
});

export const SkuDataSchema = z.object({
  action: z.literal('create_sku'),
  data: z.object({
    // Exact fields from products table
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    productType: z.enum(['product', 'service', 'rental', 'food', 'accommodation', 'automotive', 'healthcare', 'education', 'beauty', 'event']).default('product'),
    priceFields: z.array(PriceFieldSchema).optional(), // [{ label, value, unit }]
    specifications: z.record(z.string(), z.unknown()).optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
  }),
});

// ============================================
// Blog Article Generation Schema
// ============================================
export const BlogDataSchema = z.object({
  action: z.literal('create_blog'),
  data: z.object({
    title: z.string().min(1, 'Title is required'),
    excerpt: z.string().optional(),
    content: z.string().min(50, 'Content too short'),
    tags: z.array(z.string()).default([]),
    slug: z.string().optional(),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

// ============================================
// Landing Page Generation Schema (not stored in DB, display only)
// ============================================
export const LandingFeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  icon: z.string().optional(),
});

export const LandingDataSchema = z.object({
  action: z.literal('create_landing_page'),
  data: z.object({
    hero: z.object({
      title: z.string().min(1),
      subtitle: z.string().optional(),
      ctaText: z.string().optional(),
      ctaSecondary: z.string().optional(),
    }),
    description: z.string().optional(), // Tiptap HTML
    features: z.array(LandingFeatureSchema).default([]),
    cta: z.object({
      title: z.string().min(1),
      description: z.string().optional(), // Tiptap HTML
      buttonText: z.string().optional(),
    }).optional(),
  }),
});

// ============================================
// Agent Instructions - MUST output exact DB schema fields
// ============================================
export const LISTING_INSTRUCTIONS = `You are an AI assistant for TimorLink, Timor-Leste's business directory platform.

IMPORTANT: You MUST output JSON that matches the database schema exactly.

Entity Types: business, government, nonprofit, non-profit
Status: draft, live, suspended

Input is Tiptap HTML content. Enhance and format appropriately.

Output EXACTLY this JSON structure:
{
  "action": "create_listing",
  "data": {
    "entityType": "business",
    "title": "Exact title here",
    "categoryId": "cat-1",
    "industry": "food.restaurants",
    "contactName": "John Santos",
    "countryCode": "+670",
    "contactNumber": "77000000",
    "email": "info@example.tl",
    "registrationUrl": "https://...",
    "address": "Avenida Principal, Dili",
    "aboutUs": "<p>HTML formatted description with <strong>, <em>, <ul>, <h2> tags</p>",
    "tags": ["tag1", "tag2"],
    "yearOfEstablishment": 2020,
    "openingHours": {
      "monday": { "open": "07:00", "close": "22:00" },
      "tuesday": { "open": "07:00", "close": "22:00" }
    },
    "locationLat": -8.5569,
    "locationLng": 125.5603,
    "status": "draft",
    "socialLinks": { "facebook": "...", "instagram": "..." }
  }
}

IMPORTANT FORMAT RULES:
- aboutUs MUST be Tiptap HTML: <p>, <h2>, <ul>, <li>, <strong>, <em>
- openingHours MUST be { "day": { "open": "HH:MM", "close": "HH:MM" } }
- tags is an array: ["tag1", "tag2"]
- socialLinks is nested object: { "facebook": "...", "instagram": "..." }

Use actual Timor-Leste context. categoryId should be like: cat-1, cat-2, etc.`;

export const SKU_INSTRUCTIONS = `You are an AI assistant for TimorLink, helping businesses create product/service listings.

IMPORTANT: Output exact database schema fields:
{
  "action": "create_sku",
  "data": {
    "title": "Product name",
    "description": "<p>HTML formatted description with <strong>, <em>, <ul> tags</p>",
    "productType": "product|service|rental|food|accommodation",
    "priceFields": [{ "label": "Price", "value": "25.00", "unit": "/hour" }],
    "specifications": { "key": "value" },
    "featured": false,
    "active": true
  }
}

IMPORTANT: description MUST be Tiptap HTML (<p>, <h2>, <ul>, <strong>, <em>)`;

export const BLOG_INSTRUCTIONS = `You are an AI assistant for TimorLink, helping generate blog articles.

IMPORTANT: Output exact schema:
{
  "action": "create_blog",
  "data": {
    "title": "Article title",
    "excerpt": "Short excerpt",
    "content": "HTML content with <h2>, <p>, <ul> tags",
    "tags": ["tag1", "tag2"],
    "slug": "url-friendly-slug",
    "status": "draft"
  }
}`;

export const LANDING_INSTRUCTIONS = `You are an AI assistant for TimorLink, helping create personalized landing pages.

IMPORTANT: Output exact schema:
{
  "action": "create_landing_page",
  "data": {
    "hero": { "title": "...", "subtitle": "...", "ctaText": "...", "ctaSecondary": "..." },
    "description": "<p>HTML description from Tiptap...</p>",
    "features": [{ "title": "...", "description": "...", "icon": "..." }],
    "cta": { "title": "...", "description": "<p>HTML from Tiptap...</p>", "buttonText": "..." }
  }
}

IMPORTANT FORMAT RULES:
- description: Tiptap HTML (<p>, <h2>, <ul>, <strong>, <em>)
- cta.description: Tiptap HTML for rich formatting
- features[].description: Plain text or simple HTML
- Use actual Timor-Leste context for content
- Create visually diverse layouts (different feature arrangements, CTA positions)`;
