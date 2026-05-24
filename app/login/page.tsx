import type { Metadata } from 'next';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import AuthModeLink from '@/components/auth/AuthModeLink';

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
          <AuthModeLink href="/signup" to="signup">Create one →</AuthModeLink>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
