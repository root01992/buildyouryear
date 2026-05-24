const steps = [
  {
    n: '01',
    title: 'Create your account',
    desc: 'No email confirmations, no payment. Pick a name and a password — that\'s it.',
  },
  {
    n: '02',
    title: 'Add your day',
    desc: 'Drop in today\'s tasks, the habits you want to build, and 1–3 goals that matter this quarter.',
  },
  {
    n: '03',
    title: 'Show up. Watch progress compound.',
    desc: 'The dashboard surfaces streaks, weekly trends, and the goals at risk — so you always know what to do next.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-zinc-200/70 bg-gradient-to-b from-white via-zinc-50/50 to-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">How it works</div>
          <h2 className="mt-2 text-[1.75rem] font-bold tracking-[-0.025em] text-zinc-900 sm:text-[2.25rem]">
            Three steps. Then 365 days.
          </h2>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="absolute right-4 top-3 select-none text-[3.5rem] font-black leading-none tracking-tighter text-emerald-100">
                {s.n}
              </div>
              <h3 className="relative text-[16px] font-bold text-zinc-900">{s.title}</h3>
              <p className="relative mt-2 text-[13.5px] leading-relaxed text-zinc-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
