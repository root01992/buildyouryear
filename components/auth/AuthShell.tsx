import type { ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import AuthVisualLogin from './AuthVisualLogin';
import AuthVisualSignup from './AuthVisualSignup';

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
  variant = 'login',
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  variant?: 'login' | 'signup';
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col bg-white">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <Link href="/" className="text-[12.5px] font-medium text-zinc-500 hover:text-zinc-900">
            ← Back to home
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-sm">
            <h1 className="text-[1.75rem] font-bold tracking-[-0.025em] text-zinc-900">{title}</h1>
            <p className="mt-1.5 text-[13.5px] text-zinc-500">{subtitle}</p>
            <div className="mt-6">{children}</div>
            <div className="mt-6 border-t border-zinc-100 pt-5 text-center text-[13px] text-zinc-500">
              {footer}
            </div>
          </div>
        </main>
        <footer className="px-5 py-4 text-center text-[11.5px] text-zinc-400 sm:px-8">
          Your account is encrypted end-to-end. Sessions live in secure cookies — never in JavaScript.
        </footer>
      </div>

      {/* Animated right panel — different vibe per page */}
      {variant === 'signup' ? <AuthVisualSignup /> : <AuthVisualLogin />}
    </div>
  );
}
