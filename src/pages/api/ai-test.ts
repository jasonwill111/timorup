import type { APIRoute } from 'astro'
import { agents } from '@/mastra/agents'
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth'
import { aiGenerateSchema } from '@/lib/api-validation'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const user = await getAdminUser(request)
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()
    const result = aiGenerateSchema.safeParse(body)

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.issues[0]?.message || 'Invalid prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { prompt } = result.data
    const agent = agents.listingCreator
    const response = await agent.generate(prompt)

    return new Response(JSON.stringify({
      success: true,
      text: response.text
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[AI Test] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
