'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOut as apiSignOut,
  fetchMe,
  type UserRecord,
} from '@/lib/auth';

type AuthContextValue = {
  user: UserRecord | null;
  hydrated: boolean;
  signIn: (args: { email: string; password: string }) => Promise<UserRecord>;
  signUp: (args: { email: string; displayName: string; password: string }) => Promise<UserRecord>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Wipe legacy localStorage accounts from the old client-only build.
  // Server-backed accounts now live in MongoDB; old keys are dead weight.
  useEffect(() => {
    try {
      const legacy = ['dt_users', 'dt_session', 'daily_tracker_v1'];
      legacy.forEach((k) => localStorage.removeItem(k));
      Object.keys(localStorage)
        .filter((k) => k.startsWith('dt_data_'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await fetchMe();
        if (alive) setUser(me);
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback(async (args: { email: string; password: string }) => {
    const u = await apiSignIn(args);
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(
    async (args: { email: string; displayName: string; password: string }) => {
      const u = await apiSignUp(args);
      setUser(u);
      return u;
    },
    [],
  );

  const signOut = useCallback(async () => {
    await apiSignOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, hydrated, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
