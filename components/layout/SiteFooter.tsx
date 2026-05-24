import Link from 'next/link';
import Logo from './Logo';

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <Logo size="sm" />
          <p className="mt-2 max-w-md text-[12.5px] text-zinc-500">
            365 small days. One transformed year. Plan your day, build daily habits, save for what you want,
            and ship goals — synced to your private encrypted account. Free forever.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-zinc-500">
          <Link href="/login" className="hover:text-zinc-900">Sign in</Link>
          <Link href="/signup" className="hover:text-zinc-900">Sign up</Link>
          <a href="#features" className="hover:text-zinc-900">Features</a>
          <a href="#faq" className="hover:text-zinc-900">FAQ</a>
          <span className="text-zinc-300">·</span>
          <span>© {new Date().getFullYear()} BuildYourYear</span>
        </div>
      </div>
    </footer>
  );
}
