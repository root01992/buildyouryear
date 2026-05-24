'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Logo from './Logo';
import { ArrowRight } from 'lucide-react';
import { ev } from '@/lib/analytics';

export default function SiteHeader() {
  const { user, hydrated } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 sm:flex">
          <a href="#features" onClick={() => ev.navClick({ location: 'site_header', label: 'features', destination: '#features' })} className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            Features
          </a>
          <a href="#how-it-works" onClick={() => ev.navClick({ location: 'site_header', label: 'how_it_works', destination: '#how-it-works' })} className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            How it works
          </a>
          <a href="#testimonials" onClick={() => ev.navClick({ location: 'site_header', label: 'testimonials', destination: '#testimonials' })} className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            Love
          </a>
          <a href="#faq" onClick={() => ev.navClick({ location: 'site_header', label: 'faq', destination: '#faq' })} className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            FAQ
          </a>
          <Link href="/blog" onClick={() => ev.navClick({ location: 'site_header', label: 'blog', destination: '/blog' })} className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 hover:text-zinc-900">
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {hydrated && user ? (
            <Link
              href="/app"
              onClick={() => ev.ctaClick({ location: 'site_header', label: 'open_app', destination: '/app' })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Open app
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => ev.ctaClick({ location: 'site_header', label: 'sign_in', destination: '/login' })}
                className="hidden rounded-lg px-3 py-2 text-[13px] font-semibold text-zinc-700 hover:text-zinc-900 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => ev.ctaClick({ location: 'site_header', label: 'get_started', destination: '/signup' })}
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
