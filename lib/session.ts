// JWT session cookie helpers. Uses `jose` (Edge + Node compatible).
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'dt_session';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET is not set. See .env.example.');
  if (s.length < 24) {
    throw new Error('AUTH_SECRET must be at least 24 characters. Regenerate with: openssl rand -base64 48');
  }
  return new TextEncoder().encode(s);
}

export type SessionPayload = { sub: string; iat: number; exp: number };

export async function signSession(userId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_MAX_AGE_SEC)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
    if (typeof payload.sub !== 'string') return null;
    return {
      sub: payload.sub,
      iat: payload.iat ?? 0,
      exp: payload.exp ?? 0,
    };
  } catch {
    return null;
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

/** Read the current session from request cookies, or null. */
export async function readSession(): Promise<SessionPayload | null> {
  const c = cookies().get(COOKIE_NAME);
  if (!c?.value) return null;
  return verifySession(c.value);
}

/** Set the session cookie on the next response. */
export async function setSessionCookie(userId: string) {
  const token = await signSession(userId);
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
