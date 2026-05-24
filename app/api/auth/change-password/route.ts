import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db';
import { readSession, setSessionCookie } from '@/lib/session';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_USER = 5;

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const currentPassword = body.currentPassword ?? '';
  const newPassword = body.newPassword ?? '';

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Current and new passwords are required.' }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: 'New password must differ from the current one.' }, { status: 400 });
  }

  // Rate-limit per user (cheap defense against credential-stuffing the current password)
  const ip = getClientIp(req);
  const check = rateLimit(`changepw:${session.sub}:${ip}`, { maxAttempts: MAX_PER_USER, windowMs: WINDOW_MS });
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

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await users.updateOne(
      { _id: user._id },
      { $set: { passwordHash: newHash, updatedAt: new Date() } },
    );

    // Rotate the session so the cookie can't be replayed with the old creds
    await setSessionCookie(session.sub);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[change-password] failed:', err);
    return NextResponse.json({ error: 'Could not change password.' }, { status: 500 });
  }
}
