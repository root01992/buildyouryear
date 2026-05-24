'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronDown, User as UserIcon, Mail, Key, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import DeleteAccountModal from '@/components/auth/DeleteAccountModal';
import toast from 'react-hot-toast';
import { ev } from '@/lib/analytics';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?';
}

function avatarColor(seed: string): string {
  const palettes = [
    'from-emerald-500 to-teal-500',
    'from-sky-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-indigo-500 to-blue-500',
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => {
            if (!o) ev.userMenuOpen();
            return !o;
          });
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-1 pl-1 pr-2.5 text-[12.5px] font-semibold text-zinc-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-zinc-900"
      >
        <span
          className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${avatarColor(user.id)} text-[11.5px] font-bold text-white shadow`}
        >
          {initials(user.displayName)}
        </span>
        <span className="hidden sm:inline">{user.displayName}</span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5"
        >
          <div className="border-b border-zinc-100 bg-gradient-to-br from-emerald-50/60 to-white px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${avatarColor(user.id)} text-sm font-bold text-white shadow`}
              >
                {initials(user.displayName)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold text-zinc-900">{user.displayName}</div>
                <div className="flex items-center gap-1 truncate text-[11.5px] text-zinc-500">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>
          <div className="p-1">
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                router.push('/app');
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50"
            >
              <UserIcon className="h-4 w-4 text-zinc-500" />
              Your dashboard
            </button>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                ev.passwordChange();
                setPwOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50"
            >
              <Key className="h-4 w-4 text-zinc-500" />
              Change password
            </button>
            <div className="my-1 h-px bg-zinc-100" />
            <button
              role="menuitem"
              type="button"
              onClick={async () => {
                setOpen(false);
                ev.logout();
                try {
                  await signOut();
                  toast.success('Signed out');
                } catch {
                  toast.error('Could not sign out');
                } finally {
                  router.push('/');
                }
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50"
            >
              <LogOut className="h-4 w-4 text-zinc-500" />
              Sign out
            </button>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                ev.accountDelete();
                setDelOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete account
            </button>
          </div>
        </div>
      )}

      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
      <DeleteAccountModal open={delOpen} onClose={() => setDelOpen(false)} />
    </div>
  );
}
