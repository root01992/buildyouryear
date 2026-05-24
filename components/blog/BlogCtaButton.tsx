'use client';

import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import { ev } from '@/lib/analytics';

/**
 * Internal-link button rendered inside a blog post. Fires a blog_cta_click event
 * before navigation so we can attribute conversions to specific posts + buttons.
 */
export default function BlogCtaButton({
  slug,
  label,
  href,
  className,
  children,
}: { slug: string; label: string; href: string; className?: string; children: ReactNode } & Omit<LinkProps, 'href'>) {
  return (
    <Link
      href={href}
      onClick={() => ev.blogCtaClick({ slug, label, destination: href })}
      className={className}
    >
      {children}
    </Link>
  );
}
