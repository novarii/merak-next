// app/api/chatkit/route.ts
import { NextRequest } from 'next/server';

const upstream = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body?.type !== 'threads.create' && body?.type !== 'threads.add_user_message') {
    return Response.json({ error: 'Unsupported action' }, { status: 400 });
  }

  const resp = await fetch(`${upstream}/chatkit`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      // copy any auth headers you rely on
    },
    body: JSON.stringify(body),
  });

  return new Response(resp.body, { status: resp.status, headers: resp.headers });
}
