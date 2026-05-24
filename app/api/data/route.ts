import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db';
import { readSession } from '@/lib/session';

export const runtime = 'nodejs';

// Hard cap on the payload size we'll accept (256 KB JSON should be plenty for a year of habits).
const MAX_BYTES = 256 * 1024;

type Store = {
  todos: unknown[];
  habits: unknown[];
  goals: unknown[];
  trackers: unknown[];
};

function emptyStore(): Store {
  return { todos: [], habits: [], goals: [], trackers: [] };
}

function sanitizeStore(input: unknown): Store {
  if (!input || typeof input !== 'object') return emptyStore();
  const s = input as Record<string, unknown>;
  return {
    todos: Array.isArray(s.todos) ? s.todos.slice(0, 5000) : [],
    habits: Array.isArray(s.habits) ? s.habits.slice(0, 200) : [],
    goals: Array.isArray(s.goals) ? s.goals.slice(0, 200) : [],
    trackers: Array.isArray(s.trackers) ? s.trackers.slice(0, 200) : [],
  };
}

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  try {
    const users = await getUsersCollection();
    const user = await users.findOne(
      { _id: new ObjectId(session.sub) },
      { projection: { data: 1 } },
    );
    if (!user) return NextResponse.json({ error: 'Session invalid.' }, { status: 401 });

    return NextResponse.json({ data: user.data ?? emptyStore() });
  } catch (err) {
    console.error('[data GET] failed:', err);
    return NextResponse.json({ error: 'Could not load your data.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  // Reject oversized payloads early
  const contentLength = Number(req.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const data = sanitizeStore((body as { data?: unknown })?.data ?? body);

  try {
    const users = await getUsersCollection();
    const result = await users.updateOne(
      { _id: new ObjectId(session.sub) },
      { $set: { data, updatedAt: new Date() } },
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Session invalid.' }, { status: 401 });
    }
    return NextResponse.json({ ok: true, updatedAt: Date.now() });
  } catch (err) {
    console.error('[data PUT] failed:', err);
    return NextResponse.json({ error: 'Could not save.' }, { status: 500 });
  }
}
