import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsersCollection } from '@/lib/db';
import { setSessionCookie } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: { email?: string; displayName?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? '';
  const displayName = body.displayName?.trim() ?? '';
  const password = body.password ?? '';

  if (!email || !displayName) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }
  if (displayName.length > 80 || email.length > 254) {
    return NextResponse.json({ error: 'Input too long.' }, { status: 400 });
  }

  try {
    const users = await getUsersCollection();
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();
    const result = await users.insertOne({
      email,
      displayName,
      passwordHash,
      data: { todos: [], habits: [], goals: [], trackers: [] },
      createdAt: now,
      updatedAt: now,
    });

    const userId = result.insertedId.toString();
    await setSessionCookie(userId);

    return NextResponse.json(
      {
        user: {
          id: userId,
          email,
          displayName,
          createdAt: now.getTime(),
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('[signup] failed:', err);
    const message = mapDbError(err) ?? 'Could not create account. Please try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Translate common Mongo/network failures into actionable user messages. */
function mapDbError(err: unknown): string | null {
  if (!(err instanceof Error)) return null;
  if (err.message.startsWith('MONGODB_URI') || err.message.startsWith('AUTH_SECRET')) return err.message;
  const m = err.message.toLowerCase();
  if (m.includes('bad auth') || m.includes('authentication failed')) {
    return 'Database authentication failed. Check MONGODB_URI user/password in .env.local — the credentials are rejected by Atlas.';
  }
  if (m.includes('econnrefused') || m.includes('etimedout') || m.includes('eai_again') || m.includes('server selection timed out')) {
    return 'Could not reach the database. Check your network and Atlas IP allowlist (Network Access in Atlas).';
  }
  if (m.includes('not allowed') && m.includes('ip')) {
    return 'Your IP is not allowed by Atlas Network Access. Add it or use 0.0.0.0/0 for dev.';
  }
  return null;
}
