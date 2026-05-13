// API route for AI generation - with structuredOutput + streaming
export const prerender = false;

import { agents } from '@/mastra/agents';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { aiGenerateSchema } from '@/lib/api-validation';

const AI_TIMEOUT = 60000;

interface GenerationRequest {
  type: 'listing' | 'sku' | 'blog' | 'landing';
  data: Record<string, unknown>;
  stream?: boolean;
}

interface StreamResult {
  fullStream: AsyncGenerator<{ type: string; content?: string }>;
  object?: Record<string, unknown>;
}

// Build user message from request data
function buildUserMessage(type: string, data: Record<string, any>): string {
  switch (type) {
    case 'listing':
      return `Create a listing for "${data.title}" (${data.entityType || 'business'}).
${data.contactName ? `Contact: ${data.contactName}` : ''}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.email ? `Email: ${data.email}` : ''}
${data.address ? `Address: ${data.address}` : ''}
${data.about ? `About: ${data.about}` : ''}
${data.tags ? `Tags: ${Array.isArray(data.tags) ? data.tags.join(', ') : data.tags}` : ''}
${data.categoryId ? `Category ID: ${data.categoryId}` : ''}
${data.yearOfEstablishment ? `Year established: ${data.yearOfEstablishment}` : ''}
${data.registrationUrl ? `Registration URL: ${data.registrationUrl}` : ''}`.trim();

    case 'sku':
      return `Create a ${data.serviceType || 'product'} called "${data.title}".
${data.description ? `Description: ${data.description}` : ''}
${data.priceFields?.length ? `Price fields: ${data.priceFields.map((p: { label: string; value: string; unit: string }) => `${p.label}: $${p.value}${p.unit || ''}`).join(', ')}` : ''}`.trim();

    case 'blog':
      return `Write a ${data.type || 'general'} article about "${data.topic}".
Length: ${data.length || 'medium'}
${data.prompt ? `Additional requirements: ${data.prompt}` : ''}`.trim();

    case 'landing':
      return `Create a ${data.type || 'promotion'} landing page for "${data.title}".
${data.description ? `Description: ${data.description}` : ''}
${data.prompt ? `Requirements: ${data.prompt}` : ''}`.trim();

    default:
      return 'Generate content based on the provided data.';
  }
}

export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const parsed = await request.json();
    const parseResult = aiGenerateSchema.safeParse(parsed);

    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: parseResult.error.issues[0]?.message || 'Invalid prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { prompt } = parseResult.data;
    const type = 'listing'; // Default type for aiGenerateSchema
    const data = { prompt };
    const stream = body.stream;

    const agentMap = {
      listing: agents.listingCreator,
      sku: agents.skuCreator,
      blog: agents.blogCreator,
      landing: agents.landingPageCreator,
    };

    const agent = agentMap[type as keyof typeof agentMap];
    if (!agent) {
      return new Response(JSON.stringify({ error: 'Invalid type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userMessage = buildUserMessage(type, data);
    const messages = [{ role: 'user' as const, content: userMessage }];

    // Handle streaming mode
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const result = await Promise.race([
              agent.stream(messages),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), AI_TIMEOUT))
            ]) as StreamResult;

            for await (const chunk of result.fullStream) {
              if (chunk.type === 'content' && chunk.content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: chunk.content })}\n\n`));
              }
            }

            // Send final result
            if (result.object) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, result: result.object })}\n\n`));
            }

            controller.close();
          } catch (error) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Stream failed' })}\n\n`));
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      });
    }

    // Non-streaming mode with structured output
    const result = await Promise.race([
      agent.generate(messages, { output: 'object' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), AI_TIMEOUT))
    ]) as StreamResult;

    // result.object contains the structured output from Zod schema
    const output = result.object;

    return new Response(JSON.stringify({
      success: true,
      object: output, // Structured output
      raw: result, // Full response for debugging
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