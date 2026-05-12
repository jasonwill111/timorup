// Admin API - AI Tools
export const prerender = false;

import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';

// GET - List available AI tools
export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  // Return list of available AI tools
  const tools = [
    {
      id: 'generate-description',
      name: 'Generate Description',
      description: 'Generate a business description using AI',
      category: 'content'
    },
    {
      id: 'generate-tags',
      name: 'Generate Tags',
      description: 'Generate relevant tags for your business',
      category: 'seo'
    },
    {
      id: 'generate-social',
      name: 'Generate Social Post',
      description: 'Create social media content',
      category: 'marketing'
    },
    {
      id: 'improve-text',
      name: 'Improve Text',
      description: 'Enhance your existing content',
      category: 'content'
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    data: tools
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// POST - Use AI tool
export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { toolId, input } = body;

    // Placeholder - actual AI integration would go here
    return new Response(JSON.stringify({
      success: true,
      data: {
        toolId,
        result: 'AI response would appear here'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('AI tools error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to process AI request' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
