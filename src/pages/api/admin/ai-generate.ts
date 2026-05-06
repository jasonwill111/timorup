// API route for AI generation
export const prerender = false;

import { agents } from '@/mastra/agents';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

const AI_TIMEOUT = 60000;

export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return new Response(JSON.stringify({ error: 'Type and data required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let agent;
    let prompt = '';

    switch (type) {
      case 'listing':
        agent = agents.listingCreator;
        prompt = `Create a listing for ${data.title} (${data.entityType}). Contact: ${data.contactName}, Phone: ${data.contactNumber}, Email: ${data.email}, Address: ${data.address}. About: ${data.aboutUs}. Tags: ${data.tags?.join(', ') || ''}.`;
        break;
      case 'sku':
        agent = agents.skuCreator;
        prompt = `Create a ${data.serviceType} called ${data.title}. Description: ${data.description}. Price: ${data.priceFields?.map((p: { label: string; value: string; unit: string }) => `${p.label}: $${p.value}${p.unit}`).join(', ') || 'TBD'}.`;
        break;
      case 'blog':
        agent = agents.blogCreator;
        prompt = `Write a ${data.type || 'general'} article about "${data.topic}". Length: ${data.length || 'medium'}. Additional requirements: ${data.prompt || ''}`;
        break;
      case 'landing':
        agent = agents.landingPageCreator;
        prompt = `Create a ${data.type || 'promotion'} landing page for "${data.title}". Description: ${data.description}. Requirements: ${data.prompt || ''}`;
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    const response = await Promise.race([
      agent.generate(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), AI_TIMEOUT))
    ]) as { text: string };

    return new Response(JSON.stringify({
      success: true,
      text: response.text
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[AI Generate] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
