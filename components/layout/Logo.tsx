import Link from 'next/link';

export default function Logo({ href = '/', size = 'md' }: { href?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { box: 'h-7 w-7 text-base', text: 'text-[14px]' },
    md: { box: 'h-9 w-9 text-lg', text: 'text-[17px]' },
    lg: { box: 'h-11 w-11 text-xl', text: 'text-[20px]' },
  } as const;
  const s = sizes[size];
  return (
    <Link
      href={href}
      aria-label="BuildYourYear — home"
      className="group inline-flex items-center gap-2 outline-none"
    >
      <span
        className={`grid place-items-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white shadow-md ring-1 ring-white/60 transition-transform group-hover:scale-[1.03] ${s.box}`}
      >
        ✓
      </span>
      <span className={`font-bold tracking-tight text-zinc-900 ${s.text}`}>
        Build<span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">Your</span>Year
      </span>
    </Link>
  );
}
