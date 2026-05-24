'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { ev } from '@/lib/analytics';

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    ev.loginSubmit();
    setBusy(true);
    try {
      const user = await signIn({ email, password });
      ev.login();
      toast.success(`Welcome back, ${user.displayName.split(/\s+/)[0]}`);
      router.push('/app');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not sign in.';
      ev.authError({ action: 'login', message });
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field
        label="Email"
        icon={<Mail className="h-4 w-4" />}
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />
      <div>
        <Field
          label="Password"
          icon={<Lock className="h-4 w-4" />}
          type={showPw ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          rightElement={
            <button
              type="button"
              onClick={() => {
                setShowPw((v) => {
                  ev.passwordVisibilityToggle({ visible: !v });
                  return !v;
                });
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export function Field({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  rightElement,
  hint,
}: {
  label: string;
  icon?: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  rightElement?: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-zinc-700">{label}</span>
      <span className="mt-1 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
        {rightElement}
      </span>
      {hint && <span className="mt-1.5 block text-[11.5px] text-zinc-500">{hint}</span>}
    </label>
  );
}
