import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsersCollection } from '@/lib/db';
import { setSessionCookie } from '@/lib/session';
import { rateLimit, resetRateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Tunables. In production, scale these or move to env vars.
const WINDOW_MS = 15 * 60 * 1000; // 15-minute sliding window
const MAX_PER_IP = 10;            // 10 attempts per IP per window
const MAX_PER_EMAIL = 5;          // 5 attempts per email per window (tighter — defeats single-account brute force)

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? '';
  const password = body.password ?? '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  // Pre-check both rate-limit buckets BEFORE touching the DB.
  const ip = getClientIp(req);
  const ipCheck = rateLimit(`login:ip:${ip}`, { maxAttempts: MAX_PER_IP, windowMs: WINDOW_MS });
  const emailCheck = rateLimit(`login:email:${email}`, { maxAttempts: MAX_PER_EMAIL, windowMs: WINDOW_MS });

  if (!ipCheck.allowed || !emailCheck.allowed) {
    const retryAfter = Math.max(ipCheck.retryAfterSec ?? 0, emailCheck.retryAfterSec ?? 0);
    return NextResponse.json(
      {
        error: `Too many login attempts. Try again in ${formatRetry(retryAfter)}.`,
        retryAfterSec: retryAfter,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      },
    );
  }

  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ email });

    // Constant-ish-time compare: always run bcrypt even if user is missing,
    // so an attacker can't enumerate emails by response timing.
    const hashToCompare = user?.passwordHash ?? '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid';
    const ok = await bcrypt.compare(password, hashToCompare);

    if (!user || !ok) {
      return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
    }

    // Success: clear both rate-limit buckets so subsequent typos don't lock them out.
    resetRateLimit(`login:ip:${ip}`);
    resetRateLimit(`login:email:${email}`);

    const userId = user._id!.toString();
    await setSessionCookie(userId);

    return NextResponse.json({
      user: {
        id: userId,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt.getTime(),
      },
    });
  } catch (err) {
    console.error('[login] failed:', err);
    if (err instanceof Error) {
      const m = err.message.toLowerCase();
      if (err.message.startsWith('MONGODB_URI') || err.message.startsWith('AUTH_SECRET')) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
      if (m.includes('bad auth') || m.includes('authentication failed')) {
        return NextResponse.json(
          { error: 'Database authentication failed. Check MONGODB_URI in .env.local — Atlas is rejecting the credentials.' },
          { status: 500 },
        );
      }
      if (m.includes('server selection timed out') || m.includes('econnrefused') || m.includes('etimedout')) {
        return NextResponse.json(
          { error: 'Could not reach the database. Check your Atlas Network Access IP allowlist.' },
          { status: 500 },
        );
      }
    }
    return NextResponse.json({ error: 'Could not sign in. Please try again.' }, { status: 500 });
  }
}

function formatRetry(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.ceil(sec / 60);
  return `${m} minute${m === 1 ? '' : 's'}`;
}
