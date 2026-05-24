'use client';

import Link from 'next/link';
import { ev } from '@/lib/analytics';
import type { ReactNode } from 'react';

/** Small wrapper used in the login/signup auth-shell footers to track mode switches. */
export default function AuthModeLink({
  href,
  to,
  children,
}: {
  href: string;
  to: 'login' | 'signup';
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() => ev.authModeSwitch({ to })}
      className="font-semibold text-emerald-700 hover:text-emerald-900"
    >
      {children}
    </Link>
  );
}
