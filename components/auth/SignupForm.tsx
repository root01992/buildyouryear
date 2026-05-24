'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Field } from './LoginForm';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { passwordStrength } from '@/lib/auth';
import toast from 'react-hot-toast';
import { ev } from '@/lib/analytics';

export default function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(password);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please accept the terms to continue.');
      return;
    }
    ev.signupSubmit();
    setBusy(true);
    try {
      const user = await signUp({ email, displayName, password });
      ev.signup();
      toast.success(`Welcome aboard, ${user.displayName.split(/\s+/)[0]}!`);
      router.push('/app');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create account.';
      ev.authError({ action: 'signup', message });
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field
        label="Display name"
        icon={<User className="h-4 w-4" />}
        type="text"
        autoComplete="name"
        value={displayName}
        onChange={setDisplayName}
        placeholder="Alex Rivera"
      />
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
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          rightElement={
            <button
              type="button"
              onClick={() =>
                setShowPw((v) => {
                  ev.passwordVisibilityToggle({ visible: !v });
                  return !v;
                })
              }
              className="p-1 text-zinc-400 hover:text-zinc-600"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        {password && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < strength.score ? strength.color : 'bg-zinc-100'
                  }`}
                />
              ))}
            </div>
            <span className={`text-[11px] font-semibold ${strength.score >= 3 ? 'text-emerald-700' : strength.score >= 2 ? 'text-amber-700' : 'text-rose-700'}`}>
              {strength.label}
            </span>
          </div>
        )}
      </div>
      <Field
        label="Confirm password"
        icon={<Lock className="h-4 w-4" />}
        type={showPw ? 'text' : 'password'}
        autoComplete="new-password"
        value={confirm}
        onChange={setConfirm}
        placeholder="Type it again"
      />

      <label className="flex items-start gap-2 text-[12.5px] text-zinc-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-400"
        />
        <span>
          I understand my password is bcrypt-hashed and stored only as a hash on the server, and my
          tracker data is synced to my account.
        </span>
      </label>

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
        {busy ? 'Creating your account…' : 'Create account'}
      </button>
    </form>
  );
}
