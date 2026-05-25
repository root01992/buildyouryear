import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, Home } from 'lucide-react';
import type { ReactNode } from 'react';
import { getSiteUrl, SITE_NAME } from '@/lib/site';
import type { BlogPostMeta } from '@/lib/blog-posts';
import BlogCardLink from '@/components/blog/BlogCardLink';
import BlogCtaButton from '@/components/blog/BlogCtaButton';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';

/**
 * Shared layout for every blog post.
 * Includes:
 *  - branded header w/ back-to-blog
 *  - hero (gradient accent, title, tagline, byline)
 *  - prose container with sensible typography rhythm
 *  - JSON-LD Article schema (datePublished, author, image)
 *  - bottom CTA + related-posts strip
 */

const accentClasses: Record<BlogPostMeta['accent'], { from: string; via: string; to: string; pill: string }> = {
  emerald: { from: 'from-emerald-500', via: 'via-teal-400', to: 'to-sky-400', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  sky:     { from: 'from-sky-500',     via: 'via-cyan-400', to: 'to-emerald-400', pill: 'bg-sky-50 text-sky-700 border-sky-200' },
  amber:   { from: 'from-amber-500',   via: 'via-orange-400', to: 'to-rose-400',   pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  rose:    { from: 'from-rose-500',    via: 'via-pink-400',   to: 'to-fuchsia-400', pill: 'bg-rose-50 text-rose-700 border-rose-200' },
  violet:  { from: 'from-violet-500',  via: 'via-fuchsia-400', to: 'to-rose-400',   pill: 'bg-violet-50 text-violet-700 border-violet-200' },
  teal:    { from: 'from-teal-500',    via: 'via-emerald-400', to: 'to-cyan-400',   pill: 'bg-teal-50 text-teal-700 border-teal-200' },
};

export default function BlogLayout({
  post,
  related,
  children,
}: {
  post: BlogPostMeta;
  related?: BlogPostMeta[];
  children: ReactNode;
}) {
  const a = accentClasses[post.accent];
  const base = getSiteUrl();
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: `${base}/opengraph-image`,
    author: { '@type': 'Organization', name: SITE_NAME, url: base },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: base, logo: { '@type': 'ImageObject', url: `${base}/icon.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${base}/blog/${post.slug}` },
    keywords: post.keywords.join(', '),
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] font-semibold text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-emerald-700">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <span aria-hidden className="text-zinc-300">/</span>
        <Link href="/blog" className="transition-colors hover:text-emerald-700">
          Blog
        </Link>
        <span aria-hidden className="text-zinc-300">/</span>
        <span className="line-clamp-1 text-zinc-400">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mt-4">
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.16em] ${a.pill}`}>
          <span className="text-[12px] leading-none">{post.emoji}</span>
          BuildYourYear · Blog
        </div>
        <h1 className="mt-3 text-[1.85rem] font-bold leading-[1.1] tracking-[-0.025em] text-zinc-900 sm:text-[2.4rem]">
          {post.title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 sm:text-[16.5px]">
          {post.tagline}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </span>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTimeMinutes} min read
          </span>
        </div>
        <div className={`mt-6 h-1 w-24 rounded-full bg-gradient-to-r ${a.from} ${a.via} ${a.to}`} aria-hidden />
      </header>

      {/* Body — uses prose rhythm via Tailwind utilities applied to children */}
      <div className="prose-blog mt-8 space-y-5 text-[15.5px] leading-[1.75] text-zinc-700">
        {children}
      </div>

      {/* End-of-post CTA */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 p-5 shadow-sm sm:p-7">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          Stop reading. Start building.
        </div>
        <div className="mt-2 text-[18px] font-bold leading-snug tracking-tight text-zinc-900 sm:text-[20px]">
          Track habits, ship goals, save for what you want — in one beautiful dashboard.
        </div>
        <div className="mt-1.5 text-[13px] text-zinc-600">
          Free forever. No credit card. Syncs across devices.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <BlogCtaButton
            slug={post.slug}
            label="start_day_1"
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-[13.5px] font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
          >
            Start day 1 of your year
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </BlogCtaButton>
          <BlogCtaButton
            slug={post.slug}
            label="how_it_works"
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[13.5px] font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            <Home className="h-4 w-4" />
            How it works
          </BlogCtaButton>
        </div>
      </div>

      {/* Related posts */}
      {related && related.length > 0 && (
        <section className="mt-12">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Keep reading
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((p) => (
              <BlogCardLink
                key={p.slug}
                slug={p.slug}
                from={`blog_post_${post.slug}_related`}
                className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">{p.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    {p.readTimeMinutes} min
                  </span>
                </div>
                <div className="mt-1.5 text-[14.5px] font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-emerald-700">
                  {p.title}
                </div>
                <div className="mt-1 text-[12.5px] leading-snug text-zinc-500">{p.tagline}</div>
              </BlogCardLink>
            ))}
          </div>
        </section>
      )}

      {/* Final navigation strip — clear back-to-home + back-to-blog buttons */}
      <nav
        aria-label="Post navigation"
        className="mt-12 flex flex-col items-stretch gap-2 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700 hover:shadow-md"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/40 hover:text-sky-700 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          All blog posts
        </Link>
      </nav>
    </article>
  );
}

/* ──────────────── Reusable building blocks for post content ──────────────── */

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mt-10 text-[1.35rem] font-bold tracking-tight text-zinc-900 sm:text-[1.55rem]">
        {title}
      </h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-6 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/40 px-5 py-4 text-[17px] font-semibold leading-snug tracking-tight text-zinc-800">
      {children}
    </blockquote>
  );
}

export function Callout({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="my-5 flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
      <span className="text-[20px] leading-none">{icon}</span>
      <div>
        <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</div>
        <div className="mt-1 text-[13.5px] leading-relaxed text-zinc-700">{children}</div>
      </div>
    </div>
  );
}

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full border-collapse text-[13.5px]">
        <thead className="bg-zinc-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-bold uppercase tracking-wider text-zinc-600 text-[11px]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 ? 'bg-white' : 'bg-zinc-50/40'}>
              {row.map((cell, j) => (
                <td key={j} className="border-t border-zinc-200 px-3 py-2.5 align-top text-zinc-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
