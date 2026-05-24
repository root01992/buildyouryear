import { ListChecks, Repeat, Target, BarChart3, CalendarDays, Lock, Sparkles, Zap } from 'lucide-react';

const features = [
  {
    icon: ListChecks,
    title: 'Smart daily to-dos',
    desc: 'Capture tasks with priority, category and due date. Filter today, all or overdue with one tap.',
    accent: 'emerald',
  },
  {
    icon: Repeat,
    title: 'Habit streaks that stick',
    desc: 'Track daily habits with current + best streak counters and a clean 7-day check grid.',
    accent: 'amber',
  },
  {
    icon: Target,
    title: 'Goals with milestones',
    desc: 'Short and long-term goals with auto-calculated progress, deadlines and milestone checklists.',
    accent: 'violet',
  },
  {
    icon: BarChart3,
    title: 'Insights that actually help',
    desc: 'Productivity score, week-over-week deltas, best day of week, and smart at-risk warnings.',
    accent: 'sky',
  },
  {
    icon: CalendarDays,
    title: '12-week consistency heatmap',
    desc: 'A GitHub-style grid that lights up as you stay consistent. Spot patterns at a glance.',
    accent: 'teal',
  },
  {
    icon: Lock,
    title: 'Bcrypt-hashed, HTTPS-only',
    desc: 'Passwords are bcrypt-hashed server-side. Sessions live in an HttpOnly, Secure cookie. Export to JSON whenever you want a backup.',
    accent: 'rose',
  },
  {
    icon: Sparkles,
    title: 'Quick-add anywhere',
    desc: 'Add a task from the dashboard with a single keystroke. Stay in flow instead of fighting your tool.',
    accent: 'indigo',
  },
  {
    icon: Zap,
    title: 'Syncs across devices',
    desc: 'Sign in anywhere, your habits and goals follow. Auto-saves every edit with a visible "Saving / Saved" indicator.',
    accent: 'orange',
  },
];

const accentMap = {
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  violet: 'bg-violet-50 text-violet-700',
  sky: 'bg-sky-50 text-sky-700',
  teal: 'bg-teal-50 text-teal-700',
  rose: 'bg-rose-50 text-rose-700',
  indigo: 'bg-indigo-50 text-indigo-700',
  orange: 'bg-orange-50 text-orange-700',
} as const;

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-zinc-200/70 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">Features</div>
          <h2 className="mt-2 text-[1.75rem] font-bold tracking-[-0.025em] text-zinc-900 sm:text-[2.25rem]">
            Everything you need. Nothing you don&rsquo;t.
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-zinc-600">
            A focused toolkit that makes consistency feel inevitable.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
              >
                <div className={`grid h-9 w-9 place-items-center rounded-xl ${accentMap[f.accent as keyof typeof accentMap]}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-3 text-[15px] font-bold text-zinc-900">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
