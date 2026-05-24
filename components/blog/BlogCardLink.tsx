'use client';

import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';
import { ev } from '@/lib/analytics';

/**
 * Wrapper around <Link> that fires a blog_post_open analytics event before navigation.
 * Use in any client-or-server component where you link into a blog post.
 */
export default function BlogCardLink({
  slug,
  from,
  children,
  className,
  ...linkProps
}: { slug: string; from?: string; children: ReactNode; className?: string } & Omit<LinkProps, 'href'>) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={className}
      onClick={() => ev.blogPostOpen({ slug, from })}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
