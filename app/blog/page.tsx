import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { SITE_NAME } from '@/lib/site';
import BlogCardLink from '@/components/blog/BlogCardLink';

export const metadata: Metadata = {
  title: 'Blog — building better days, one year at a time',
  description:
    'Practical, research-backed essays on habits, goal setting, consistency, and the compound effect. Read the playbooks that turn 365 days into one transformed year.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `Blog · ${SITE_NAME}`,
    description: 'Essays on habits, goals, and the compound effect.',
    type: 'website',
    url: '/blog',
  },
};

const accentBar: Record<string, string> = {
  emerald: 'from-emerald-500 via-teal-400 to-sky-400',
  sky: 'from-sky-500 via-cyan-400 to-emerald-400',
  amber: 'from-amber-500 via-orange-400 to-rose-400',
  rose: 'from-rose-500 via-pink-400 to-fuchsia-400',
  violet: 'from-violet-500 via-fuchsia-400 to-rose-400',
  teal: 'from-teal-500 via-emerald-400 to-cyan-400',
};

export default function BlogIndexPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      {/* Header */}
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          The BuildYourYear blog
        </span>
        <h1 className="mt-4 text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] text-zinc-900 sm:text-[2.6rem]">
          Build a better year, <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">one day at a time</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[14.5px] leading-relaxed text-zinc-600 sm:text-[16px]">
          Practical, research-backed essays on habits, goal-setting frameworks, consistency, and the compound effect.
          Every post comes with charts, templates, and a step-by-step playbook.
        </p>
      </header>

      {/* Featured */}
      <BlogCardLink
        slug={featured.slug}
        from="blog_listing_featured"
        className="group mt-10 block overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-emerald-50/30 to-sky-50/30 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className={`h-1 w-full bg-gradient-to-r ${accentBar[featured.accent]}`} aria-hidden />
        <div className="grid items-center gap-6 p-5 sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              <span className="text-[14px]">{featured.emoji}</span>
              Featured · {featured.readTimeMinutes} min read
            </div>
            <h2 className="mt-2 text-[1.4rem] font-bold leading-tight tracking-tight text-zinc-900 group-hover:text-emerald-700 sm:text-[1.85rem]">
              {featured.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-zinc-600 sm:text-[15px]">
              {featured.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700">
              Read the post
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
          <div className="grid h-32 w-32 shrink-0 place-items-center self-center rounded-2xl bg-white text-[64px] shadow-md sm:h-40 sm:w-40 sm:text-[80px]">
            {featured.emoji}
          </div>
        </div>
      </BlogCardLink>

      {/* Grid of remaining posts */}
      <section className="mt-10">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          More from the blog
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <BlogCardLink
              key={p.slug}
              slug={p.slug}
              from="blog_listing_grid"
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
            >
              <div className={`h-1 w-full bg-gradient-to-r ${accentBar[p.accent]}`} aria-hidden />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[28px] leading-none">{p.emoji}</span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {p.readTimeMinutes} min
                  </span>
                </div>
                <h3 className="mt-3 text-[15.5px] font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-emerald-700">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-zinc-600">
                  {p.tagline}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-[11.5px] text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={p.publishedAt}>
                      {new Date(p.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </span>
                  <span className="font-semibold text-emerald-700 group-hover:underline">Read →</span>
                </div>
              </div>
            </BlogCardLink>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-6 text-center shadow-sm sm:p-8">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          Ready to build your year?
        </div>
        <h2 className="mt-2 text-[1.5rem] font-bold tracking-tight text-zinc-900 sm:text-[1.85rem]">
          Day 1 of your year starts now.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-zinc-600">
          A free, encrypted dashboard that tracks habits, ships goals, and shows real progress.
        </p>
        <div className="mt-5">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[14px] font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-emerald-600/40"
          >
            Start day 1 of your year
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
