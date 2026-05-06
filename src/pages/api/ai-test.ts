import type { APIRoute } from 'astro'
import { agents } from '@/mastra/agents'
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const user = await getAdminUser(request)
  if (!user) return unauthorizedResponse()

  try {
    const { message } = await request.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const agent = agents.listingCreator
    const response = await agent.generate(message)

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
