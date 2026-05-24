import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db';
import { readSession, clearSessionCookie } from '@/lib/session';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_USER = 3;

export async function DELETE(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  let body: { password?: string; confirm?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const password = body.password ?? '';
  const confirm = body.confirm ?? '';

  if (!password) {
    return NextResponse.json({ error: 'Password is required to delete your account.' }, { status: 400 });
  }
  if (confirm !== 'DELETE') {
    return NextResponse.json(
      { error: 'Confirmation phrase must be exactly "DELETE".' },
      { status: 400 },
    );
  }

  const ip = getClientIp(req);
  const check = rateLimit(`delete:${session.sub}:${ip}`, { maxAttempts: MAX_PER_USER, windowMs: WINDOW_MS });
  if (!check.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${check.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(check.retryAfterSec ?? 60) } },
    );
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(session.sub) });
    if (!user) return NextResponse.json({ error: 'Session invalid.' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Password is incorrect.' }, { status: 401 });
    }

    await users.deleteOne({ _id: user._id });
    clearSessionCookie();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[delete account] failed:', err);
    return NextResponse.json({ error: 'Could not delete account.' }, { status: 500 });
  }
}
