// Reviews Reply API - DISABLED
// Replies are not supported in current schema (no reply/repliedAt/repliedBy columns)

export const prerender = false;

// POST - Create reply (disabled)
export async function POST() {
  return new Response(JSON.stringify({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Reply feature not available in current schema' }
  }), { status: 501, headers: { 'Content-Type': 'application/json' } });
}

// PUT - Edit reply (disabled)
export async function PUT() {
  return new Response(JSON.stringify({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Reply feature not available in current schema' }
  }), { status: 501, headers: { 'Content-Type': 'application/json' } });
}

// DELETE - Delete reply (disabled)
export async function DELETE() {
  return new Response(JSON.stringify({
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'Reply feature not available in current schema' }
  }), { status: 501, headers: { 'Content-Type': 'application/json' } });
}
