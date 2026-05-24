'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !user) router.replace('/login');
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-50">
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[13px]">Checking your session…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
