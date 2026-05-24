'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { Field } from './LoginForm';
import { useAuth } from './AuthProvider';

export default function DeleteAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setPassword('');
    setConfirm('');
    setError(null);
    setBusy(false);
  };

  const close = () => {
    if (busy) return;
    reset();
    onClose();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Enter your password to confirm.');
      return;
    }
    if (confirm !== 'DELETE') {
      setError('Type DELETE in all caps to confirm.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password, confirm }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Could not delete account.');
      }
      // Server already cleared the cookie; sync the client state and redirect.
      toast.success('Account deleted');
      try {
        await signOut();
      } catch {
        /* server cookie is already gone */
      }
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete account.');
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Delete your account"
      subtitle="This permanently erases your habits, goals, savings trackers and login. It cannot be undone."
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12.5px] text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div>
            <strong className="font-semibold">You're deleting {user?.email}.</strong> Export your
            data first (toolbar → Export) if you might want it back. We can't recover deleted accounts.
          </div>
        </div>

        <Field
          label="Confirm with your password"
          icon={<Lock className="h-4 w-4" />}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="Your account password"
        />

        <div>
          <label className="block">
            <span className="text-[12px] font-semibold text-zinc-700">
              Type <code className="rounded bg-zinc-100 px-1 py-0.5 text-[11px] font-bold text-rose-700">DELETE</code> to confirm
            </span>
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="DELETE"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[14px] font-mono tabular-nums shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </label>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
          <button
            type="button"
            onClick={close}
            disabled={busy}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || confirm !== 'DELETE'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {busy ? 'Deleting…' : 'Delete account permanently'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
