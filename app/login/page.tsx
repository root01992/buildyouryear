import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description:
    'Sign in to BuildYourYear and pick up where you left off. Your habits, goals, savings trackers and streaks — synced to your private encrypted account.',
  alternates: { canonical: '/login' },
  openGraph: {
    title: 'Sign in to BuildYourYear',
    description: 'Welcome back — your year is mid-flight. A streak is waiting.',
    type: 'website',
    url: '/login',
  },
  robots: { index: false, follow: true }, // login pages don't need to be indexed
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          Don&rsquo;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-emerald-700 hover:text-emerald-900">
            Create one →
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
