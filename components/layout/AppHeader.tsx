'use client';

import Logo from './Logo';
import UserMenu from './UserMenu';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[min(100%,96rem)] items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <Logo href="/app" size="sm" />
        <UserMenu />
      </div>
    </header>
  );
}
