import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'The 12-week heatmap is the killer feature. Seeing the cells light up across a quarter is the most motivating thing I have used in a decade of trying habit apps.',
    name: 'Priya R.',
    role: 'Product designer · Bengaluru',
    avatar: 'PR',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    quote:
      "I finally know which day of the week I crush tasks. The 'Best day of week' chart changed how I plan deep work. I batch hard problems for Tuesdays now.",
    name: 'Marcus J.',
    role: 'Software engineer · Brooklyn',
    avatar: 'MJ',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    quote:
      'The savings tracker for the iPad turned a vague wish into a 10-month plan. Watching 29% become 31% felt like a tiny victory every Friday.',
    name: 'Sofia M.',
    role: 'Marketing manager · Madrid',
    avatar: 'SM',
    accent: 'from-rose-500 to-pink-500',
  },
  {
    quote:
      "I run my whole quarterly OKRs out of the Professional goals tab. Milestone checklists keep me honest. My team is moving the same way.",
    name: 'Daniel K.',
    role: 'Engineering lead · Berlin',
    avatar: 'DK',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    quote:
      "The 6-month transformation plan was exactly what I needed. Six habits, ten goals, all loaded in one click. The hard part was deciding what to track — not anymore.",
    name: 'Amelia T.',
    role: 'Yoga teacher · Lisbon',
    avatar: 'AT',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    quote:
      "Sane defaults. No email confirmation dance, no tracking SDKs. Sign-up, sign-in, sync — done. The bcrypt + HttpOnly cookie story is exactly what I'd ship.",
    name: 'Hiro S.',
    role: 'Privacy engineer · Tokyo',
    avatar: 'HS',
    accent: 'from-indigo-500 to-blue-500',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20 border-t border-zinc-200/70 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            What people are saying
          </div>
          <h2 className="mt-2 text-[1.75rem] font-bold tracking-[-0.025em] text-zinc-900 sm:text-[2.25rem]">
            Loved by people building their year
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-zinc-600">
            Honest words from people who actually showed up — day after day.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
            >
              <Quote className="h-4 w-4 text-emerald-300" aria-hidden />
              <blockquote className="mt-2 flex-1 text-[13.5px] leading-relaxed text-zinc-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-3">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${t.accent} text-[11.5px] font-bold text-white shadow`}
                >
                  {t.avatar}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-zinc-900">{t.name}</span>
                  <span className="block truncate text-[11.5px] text-zinc-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
