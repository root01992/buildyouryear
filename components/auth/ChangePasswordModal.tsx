'use client';

import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { Field } from './LoginForm';
import { passwordStrength } from '@/lib/auth';

export default function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(next);

  const reset = () => {
    setCurrent('');
    setNext('');
    setConfirm('');
    setError(null);
    setBusy(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!current || !next) {
      setError('Fill in both fields.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next === current) {
      setError('New password must differ from the current one.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Could not change password.');
      }
      toast.success('Password updated');
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change password"
      subtitle="You'll stay signed in. Old password stops working immediately."
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field
          label="Current password"
          icon={<Lock className="h-4 w-4" />}
          type={showPw ? 'text' : 'password'}
          autoComplete="current-password"
          value={current}
          onChange={setCurrent}
          placeholder="Your current password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="p-1 text-zinc-400 hover:text-zinc-600"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div>
          <Field
            label="New password"
            icon={<Lock className="h-4 w-4" />}
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            value={next}
            onChange={setNext}
            placeholder="At least 8 characters"
          />
          {next && (
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
              <span
                className={`text-[11px] font-semibold ${
                  strength.score >= 3
                    ? 'text-emerald-700'
                    : strength.score >= 2
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <Field
          label="Confirm new password"
          icon={<Lock className="h-4 w-4" />}
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Type the new password again"
        />

        {error && (
          <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {busy ? 'Updating…' : 'Change password'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
