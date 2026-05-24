'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Logo from './Logo';
import { ArrowRight } from 'lucide-react';

export default function SiteHeader() {
  const { user, hydrated } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 sm:flex">
          <a href="#features" className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            Features
          </a>
          <a href="#how-it-works" className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            How it works
          </a>
          <a href="#testimonials" className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            Love
          </a>
          <a href="#faq" className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {hydrated && user ? (
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Open app
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-[13px] font-semibold text-zinc-700 hover:text-zinc-900 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
