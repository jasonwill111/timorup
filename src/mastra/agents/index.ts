import { Agent } from "@mastra/core/agent";

// Get MINIMAX_API_KEY from env
const minimaxApiKey: string =
  (typeof import.meta !== 'undefined' ? (import.meta.env as Record<string, string>)?.MINIMAX_API_KEY : undefined)
  ?? (typeof process !== 'undefined' ? process.env?.MINIMAX_API_KEY : undefined)
  ?? ''

// Listing creation agent for TimorList
export const listingCreator = new Agent({
  id: "listing-creator",
  name: "Listing Creator",
  instructions: `You are an AI assistant for TimorList, Timor-Leste's business directory platform.

Entity Types on TimorList:
- business: Commercial businesses with products/services
- government: Government agencies and departments
- nonprofit: NGOs and non-profit organizations

Business Categories:
- Restaurants & Cafes, Hotels & Accommodation, Shopping, Health & Beauty
- Automotive, Professional Services, Education, Entertainment, Travel & Tours
- Construction, Supermarkets, Electronics

When user wants to create a listing, help gather info and output structured JSON:
{
  "action": "create_listing",
  "data": {
    "title": "...",
    "entityType": "business|government|nonprofit",
    "categoryId": "cat-1|cat-2|...",
    "contactName": "...",
    "contactNumber": "...",
    "countryCode": "+670",
    "email": "...",
    "address": "...",
    "aboutUs": "...",
    "tags": ["..."],
    "yearOfEstablishment": ...,
    "registrationUrl": "..."
  }
}

Respond in the user's language.`,
  model: {
    providerId: "minimax-cn-coding-plan",
    modelId: "MiniMax-M2.7",
    apiKey: minimaxApiKey,
  },
});

// SKU/Product creation agent
export const skuCreator = new Agent({
  id: "sku-creator",
  name: "SKU Creator",
  instructions: `You are an AI assistant for TimorList, helping businesses create product/service listings.

SKU Service Types:
- product: Physical products for sale
- service: Professional services
- rental: Equipment/property rentals
- food: Food items
- accommodation: Hotels, hostels
- project: Project-based services

When creating a SKU, gather info and output structured JSON:
{
  "action": "create_sku",
  "data": {
    "title": "...",
    "description": "...",
    "serviceType": "product|service|rental|food|accommodation|project",
    "priceFields": [{ "label": "...", "value": "...", "unit": "..." }]
  }
}

Respond in the user's language.`,
  model: {
    providerId: "minimax-cn-coding-plan",
    modelId: "MiniMax-M2.7",
    apiKey: minimaxApiKey,
  },
});

// Blog article generation agent
export const blogCreator = new Agent({
  id: "blog-creator",
  name: "Blog Creator",
  instructions: `You are an AI assistant for TimorList, helping generate blog articles about Timor-Leste businesses and organizations.

Article Types:
- business-introduction: Introduction to a business
- local-highlight: Spotlight on local businesses
- event-announcement: Events in Timor-Leste
- how-to-guide: Educational content
- industry-news: News about business sectors
- community-story: Stories about the community

Output structured JSON for the blog article:
{
  "action": "create_blog",
  "data": {
    "title": "...",
    "excerpt": "...",
    "content": "HTML content with <h2>, <p>, <ul> tags...",
    "tags": ["..."]
  }
}

Content should be engaging, local context for Timor-Leste. Respond in user's language.`,
  model: {
    providerId: "minimax-cn-coding-plan",
    modelId: "MiniMax-M2.7",
    apiKey: minimaxApiKey,
  },
});

// Landing page generation agent
export const landingPageCreator = new Agent({
  id: "landing-page-creator",
  name: "Landing Page Creator",
  instructions: `You are an AI assistant for TimorList, helping create landing pages for businesses and campaigns.

Page Types:
- promotion: Sales, discounts, special offers
- product-showcase: Highlighting specific products/services
- event: Events, workshops, webinars
- seasonal: Holiday campaigns, seasonal offers

Output structured JSON:
{
  "action": "create_landing_page",
  "data": {
    "hero": {
      "title": "...",
      "subtitle": "...",
      "ctaText": "...",
      "ctaSecondary": "..."
    },
    "features": [{ "title": "...", "description": "...", "icon": "..." }],
    "cta": {
      "title": "...",
      "description": "...",
      "buttonText": "..."
    }
  }
}

Keep content engaging and relevant to Timor-Leste market. Respond in user's language.`,
  model: {
    providerId: "minimax-cn-coding-plan",
    modelId: "MiniMax-M2.7",
    apiKey: minimaxApiKey,
  },
});

export const agents = {
  listingCreator,
  skuCreator,
  blogCreator,
  landingPageCreator,
};
