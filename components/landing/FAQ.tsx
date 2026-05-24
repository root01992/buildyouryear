'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ev } from '@/lib/analytics';

const faqs = [
  {
    q: 'Where is my data stored?',
    a: 'In your private MongoDB-backed account. Every habit, goal, and savings tracker is saved server-side to your user record. You can also export to JSON whenever you want a local backup.',
  },
  {
    q: 'How is my password protected?',
    a: 'Passwords are hashed with bcrypt (cost 12) on the server before they touch the database — we never store the plaintext, and the hash is one-way. Your password is sent only over HTTPS during sign-in/sign-up.',
  },
  {
    q: 'How does sign-in work technically?',
    a: 'A signed JWT is stored in an HTTP-only, Secure, SameSite=Lax cookie. JavaScript on the page cannot read it, which protects you against XSS-based session theft. The session lasts 30 days and can be revoked by signing out.',
  },
  {
    q: 'Can I use it on multiple devices?',
    a: 'Yes — sign in on any device and your habits, goals, savings trackers, and daily check-ins are all there. Changes auto-sync within seconds of every edit.',
  },
  {
    q: 'Does it sync in real time?',
    a: 'Edits debounce for 600ms then PUT to the server. The toolbar shows a "Saving…" / "Saved" indicator so you always know the state. If your tab closes mid-save, navigator.sendBeacon makes a best-effort final flush.',
  },
  {
    q: 'What happens if the server is down?',
    a: 'Your last loaded state stays usable in memory, but changes won\'t persist until connectivity returns. The sync badge turns red ("Save failed") so you know. Exported JSON is your offline backup.',
  },
  {
    q: 'How much does it cost?',
    a: 'Free during the beta. The app is intentionally simple — no team plans, no premium tier today.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 border-t border-zinc-200/70 bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <div className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">FAQ</div>
          <h2 className="mt-2 text-[1.75rem] font-bold tracking-[-0.025em] text-zinc-900 sm:text-[2.25rem]">
            Common questions.
          </h2>
        </div>
        <ul className="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => {
                    const nextOpen = !isOpen;
                    setOpen(nextOpen ? i : null);
                    ev.faqToggle({ question: f.q, opened: nextOpen });
                  }}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14.5px] font-semibold text-zinc-900">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-[13.5px] leading-relaxed text-zinc-600">{f.a}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
