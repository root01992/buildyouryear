import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
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
