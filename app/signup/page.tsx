import type { Metadata } from 'next';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create account',
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
          <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-900">
            Sign in →
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
