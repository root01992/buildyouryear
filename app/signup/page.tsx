import type { Metadata } from 'next';
import AuthShell from '@/components/auth/AuthShell';
import SignupForm from '@/components/auth/SignupForm';
import AuthModeLink from '@/components/auth/AuthModeLink';

export const metadata: Metadata = {
  title: 'Create your free account',
  description:
    'Start building your year in 30 seconds. Free habit tracker, daily to-do list, goal manager, and savings tracker. No email confirmation, encrypted account, syncs across devices.',
  alternates: { canonical: '/signup' },
  openGraph: {
    title: 'Create your free BuildYourYear account — start building your year',
    description:
      '365 small days. One transformed year. Sign up free in 30 seconds — no email confirmation, no spam, syncs across devices.',
    type: 'website',
    url: '/signup',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create your free BuildYourYear account',
    description: 'Start building your year in 30 seconds. Free forever.',
  },
};

export default function SignupPage() {
  return (
    <AuthShell
      variant="signup"
      title="Create your account"
      subtitle="No email confirmations, no spam. Start building your year in 30 seconds."
      footer={
        <>
          Already have an account?{' '}
          <AuthModeLink href="/login" to="login">Sign in →</AuthModeLink>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
