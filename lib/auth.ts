// Shared types + lightweight CLIENT-SIDE fetch wrappers for the auth API.
// Password hashing now happens server-side with bcrypt. All endpoints are at /api/*.

export type UserRecord = {
  id: string;
  email: string;
  displayName: string;
  createdAt: number;
};

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {
      /* non-json */
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function signUp(args: {
  email: string;
  displayName: string;
  password: string;
}): Promise<UserRecord> {
  const data = await postJson<{ user: UserRecord }>('/api/auth/signup', args);
  return data.user;
}

export async function signIn(args: { email: string; password: string }): Promise<UserRecord> {
  const data = await postJson<{ user: UserRecord }>('/api/auth/login', args);
  return data.user;
}

export async function signOut(): Promise<void> {
  await postJson('/api/auth/logout');
}

export async function fetchMe(): Promise<UserRecord | null> {
  const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export function passwordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'] as const;
  const colors = ['bg-zinc-300', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];
  return { score, label: labels[score], color: colors[score] };
}
