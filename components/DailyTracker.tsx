'use client';

import { useEffect, useMemo, useState, useCallback, useRef, Fragment, forwardRef, type ReactNode } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard,
  ListChecks,
  Repeat,
  Target,
  Plus,
  Trash2,
  Check,
  Flame,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Download,
  Upload,
  CircleDot,
  Pencil,
  X,
  Sparkles,
  Clock,
  AlertTriangle,
  Sun,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Briefcase,
  Heart,
  Minus,
  Wallet,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import ConfirmDialog, { type ConfirmOptions } from '@/components/ConfirmDialog';
import { ev } from '@/lib/analytics';

/** Promise-based confirmation function passed down to subviews. */
type ConfirmFn = (opts: Omit<ConfirmOptions, 'onResolve'>) => Promise<boolean>;

// ── Types ─────────────────────────────────────────────────
type Priority = 'low' | 'medium' | 'high';
type Category = 'work' | 'personal' | 'learning' | 'health' | 'other';
type GoalHorizon = 'short' | 'long';
type GoalStatus = 'planning' | 'in_progress' | 'done' | 'cancelled';
type Scope = 'personal' | 'professional';

type Todo = {
  id: string;
  text: string;
  priority: Priority;
  category: Category;
  dueDate: string;
  done: boolean;
  createdAt: number;
  completedAt?: number;
  /** User chose "not today" — kept for history; counts as resolved (not open, not done). */
  skipped?: boolean;
  /** Original due date if this task was rolled over to a new day. */
  rolledOverFrom?: string;
};

type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: number;
  log: Record<string, boolean>;
  /** Soft pause — keep streak history, but don't nag for daily check-ins. */
  paused?: boolean;
};

type Milestone = { id: string; text: string; done: boolean };

type Goal = {
  id: string;
  title: string;
  description: string;
  horizon: GoalHorizon;
  category: Category;
  scope: Scope;
  status: GoalStatus;
  deadline?: string;
  milestones: Milestone[];
  createdAt: number;
};

// ── Savings / accumulation tracker ────────────────────────
// Time-bound numeric goals: "save $X by date Y", "read N books this year"
type Contribution = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  note?: string;
};

type SavingsTracker = {
  id: string;
  name: string;
  emoji: string;
  target: number;
  unit: string; // e.g. '$', '₹', 'books', 'km'
  unitPosition: 'prefix' | 'suffix';
  monthlyTarget?: number; // optional planned contribution
  deadline?: string; // YYYY-MM-DD
  scope: Scope;
  category: Category;
  contributions: Contribution[];
  createdAt: number;
  /** Soft pause — keeps history, but excluded from active count. */
  paused?: boolean;
};

type Store = {
  todos: Todo[];
  habits: Habit[];
  goals: Goal[];
  trackers: SavingsTracker[];
};

const DEFAULT_STORE: Store = { todos: [], habits: [], goals: [], trackers: [] };

function normalizeGoal(g: Partial<Goal> & { id: string }): Goal {
  return {
    id: g.id,
    title: g.title ?? 'Untitled',
    description: g.description ?? '',
    horizon: g.horizon ?? 'short',
    category: g.category ?? 'personal',
    scope: g.scope ?? (g.category === 'work' ? 'professional' : 'personal'),
    status: g.status ?? 'planning',
    deadline: g.deadline,
    milestones: g.milestones ?? [],
    createdAt: g.createdAt ?? Date.now(),
  };
}

function normalizeTracker(t: Partial<SavingsTracker> & { id: string }): SavingsTracker {
  return {
    id: t.id,
    name: t.name ?? 'Tracker',
    emoji: t.emoji ?? '🎯',
    target: typeof t.target === 'number' ? t.target : 0,
    unit: t.unit ?? '$',
    unitPosition: t.unitPosition ?? 'prefix',
    monthlyTarget: t.monthlyTarget,
    deadline: t.deadline,
    scope: t.scope ?? 'personal',
    category: t.category ?? 'personal',
    contributions: t.contributions ?? [],
    createdAt: t.createdAt ?? Date.now(),
  };
}

const todayKey = () => new Date().toISOString().slice(0, 10);
function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
const shortLabel = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short' });
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

// Server-backed load/save (MongoDB via /api/data).
async function fetchStoreFromServer(): Promise<Store> {
  try {
    const res = await fetch('/api/data', { credentials: 'same-origin' });
    if (!res.ok) return DEFAULT_STORE;
    const json = await res.json();
    const raw = (json.data ?? {}) as Partial<Store>;
    return {
      todos: Array.isArray(raw.todos) ? (raw.todos as Todo[]) : [],
      habits: Array.isArray(raw.habits) ? (raw.habits as Habit[]) : [],
      goals: Array.isArray(raw.goals)
        ? (raw.goals as Goal[]).map((g) => normalizeGoal(g))
        : [],
      trackers: Array.isArray(raw.trackers)
        ? (raw.trackers as SavingsTracker[]).map((t) => normalizeTracker(t))
        : [],
    };
  } catch {
    return DEFAULT_STORE;
  }
}

async function saveStoreToServer(store: Store): Promise<{ ok: boolean }> {
  try {
    const res = await fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ data: store }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

// ── Tracker math ──────────────────────────────────────────
function trackerCurrent(t: SavingsTracker): number {
  return t.contributions.reduce((s, c) => s + c.amount, 0);
}
function trackerProgress(t: SavingsTracker): number {
  if (t.target <= 0) return 0;
  return Math.min(100, Math.round((trackerCurrent(t) / t.target) * 100));
}
function trackerRemaining(t: SavingsTracker): number {
  return Math.max(0, t.target - trackerCurrent(t));
}
/** Average monthly contribution over the last 90 days (or fallback to all-time avg). */
function trackerMonthlyAvg(t: SavingsTracker): number {
  if (t.contributions.length === 0) return 0;
  const now = Date.now();
  const ninetyDays = 90 * 86400000;
  const recent = t.contributions.filter((c) => now - new Date(c.date + 'T00:00:00').getTime() <= ninetyDays);
  const sample = recent.length > 0 ? recent : t.contributions;
  if (sample.length === 0) return 0;
  const oldest = sample.reduce((m, c) => Math.min(m, new Date(c.date + 'T00:00:00').getTime()), now);
  const monthsSpan = Math.max(1, (now - oldest) / (30 * 86400000));
  const sum = sample.reduce((s, c) => s + c.amount, 0);
  return Math.round((sum / monthsSpan) * 100) / 100;
}
/** Projected months remaining at the planned monthly target (or recent avg). */
function trackerEtaMonths(t: SavingsTracker): number | null {
  const remaining = trackerRemaining(t);
  if (remaining <= 0) return 0;
  const rate = t.monthlyTarget && t.monthlyTarget > 0 ? t.monthlyTarget : trackerMonthlyAvg(t);
  if (rate <= 0) return null;
  return Math.ceil(remaining / rate);
}
function formatTrackerValue(value: number, t: Pick<SavingsTracker, 'unit' | 'unitPosition'>): string {
  const v = Number.isFinite(value) ? value : 0;
  // Compact thousands separator
  const formatted = v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (t.unitPosition === 'prefix') return `${t.unit}${formatted}`;
  return `${formatted} ${t.unit}`;
}

function habitStreak(habit: Habit): { current: number; best: number } {
  let current = 0;
  const today = new Date();
  for (let i = 0; i < 3650; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = dateKey(d);
    if (habit.log[k]) current++;
    else if (i === 0) continue;
    else break;
  }
  const keys = Object.keys(habit.log).filter((k) => habit.log[k]).sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of keys) {
    const d = new Date(k + 'T00:00:00');
    if (prev) {
      const diff = Math.round((d.getTime() - prev.getTime()) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = d;
  }
  return { current, best };
}

function goalProgress(goal: Goal): number {
  if (goal.status === 'done') return 100;
  if (goal.milestones.length === 0) return goal.status === 'in_progress' ? 25 : 0;
  const done = goal.milestones.filter((m) => m.done).length;
  return Math.round((done / goal.milestones.length) * 100);
}

const CATEGORY_META: Record<Category, { label: string; emoji: string; chip: string }> = {
  work: { label: 'Work', emoji: '💼', chip: 'bg-sky-50 text-sky-700 border-sky-200' },
  personal: { label: 'Personal', emoji: '🏡', chip: 'bg-violet-50 text-violet-700 border-violet-200' },
  learning: { label: 'Learning', emoji: '📚', chip: 'bg-amber-50 text-amber-800 border-amber-200' },
  health: { label: 'Health', emoji: '💪', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  other: { label: 'Other', emoji: '✨', chip: 'bg-zinc-50 text-zinc-700 border-zinc-200' },
};

const PRIORITY_META: Record<Priority, { label: string; chip: string; dot: string }> = {
  low: { label: 'Low', chip: 'bg-zinc-50 text-zinc-600 border-zinc-200', dot: 'bg-zinc-400' },
  medium: { label: 'Medium', chip: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  high: { label: 'High', chip: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

const HABIT_COLORS = ['emerald', 'sky', 'violet', 'amber', 'rose', 'teal', 'indigo', 'orange'] as const;
const HABIT_EMOJIS = ['💧', '🏃', '📖', '🧘', '💤', '🥗', '✍️', '🎯', '☕', '🌱', '🎵', '🚿'];

// ── Sample data generator (deterministic-ish, realistic shape) ─
function generateSampleStore(): Store {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const id = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const inDays = (n: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + n);
    return dateKey(d);
  };

  // 14 days of varied tasks
  const taskTitles = [
    'Ship PR review',
    'Polish hero section',
    'Workout 30 min',
    'Read chapter 4',
    'Call client',
    'Plan next sprint',
    'Cook dinner',
    'Write blog draft',
    'Refactor auth module',
    'Reply to emails',
    '1:1 with manager',
    'Buy groceries',
    'Yoga class',
    'Update resume',
  ];
  const cats: Category[] = ['work', 'personal', 'learning', 'health', 'other'];
  const pris: Priority[] = ['low', 'medium', 'high'];

  const todos: Todo[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = dateKey(d);
    const count = 1 + Math.floor(Math.random() * 4);
    for (let j = 0; j < count; j++) {
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const pri = pris[Math.floor(Math.random() * pris.length)];
      // Today: leave roughly half undone so Today's Focus has content
      const done = i === 0 ? Math.random() < 0.4 : Math.random() < 0.7;
      todos.push({
        id: id(),
        text: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        priority: pri,
        category: cat,
        dueDate: k,
        done,
        createdAt: d.getTime(),
        completedAt: done ? d.getTime() : undefined,
      });
    }
  }
  // Add a couple of clearly-overdue ones so the warning insight shows
  for (let i = 0; i < 2; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (3 + i));
    todos.push({
      id: id(),
      text: ['Submit expense report', 'Renew domain'][i],
      priority: 'high',
      category: 'work',
      dueDate: dateKey(d),
      done: false,
      createdAt: d.getTime(),
    });
  }

  const habits: Habit[] = [
    { id: id(), name: 'Drink 8 glasses of water', emoji: '💧', color: 'sky', createdAt: today.getTime(), log: {} },
    { id: id(), name: 'Read 20 minutes', emoji: '📖', color: 'amber', createdAt: today.getTime(), log: {} },
    { id: id(), name: 'Morning workout', emoji: '🏃', color: 'rose', createdAt: today.getTime(), log: {} },
    { id: id(), name: 'Meditate', emoji: '🧘', color: 'violet', createdAt: today.getTime(), log: {} },
  ];
  // 70 days of habit history with descending success rates
  const successRate = [0.88, 0.62, 0.48, 0.55];
  for (let i = 0; i < 70; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = dateKey(d);
    habits.forEach((h, idx) => {
      h.log[k] = Math.random() < successRate[idx];
    });
  }
  // Make today look strong
  const todayK = dateKey(today);
  habits.forEach((h) => (h.log[todayK] = true));

  const goals: Goal[] = [
    {
      id: id(),
      title: 'Ship BuildYourYear v1',
      description: 'Public launch with full feature set',
      horizon: 'short',
      category: 'work',
      status: 'in_progress',
      deadline: inDays(5),
      milestones: [
        { id: id(), text: 'Build dashboard', done: true },
        { id: id(), text: 'Polish UI', done: true },
        { id: id(), text: 'Write README', done: false },
        { id: id(), text: 'Launch on Twitter', done: false },
      ],
      createdAt: today.getTime() - 20 * 86400000,
    },
    {
      id: id(),
      title: 'Run a half marathon',
      description: 'Build base mileage and race in the fall',
      horizon: 'long',
      category: 'health',
      status: 'in_progress',
      deadline: inDays(120),
      milestones: [
        { id: id(), text: 'Run 5k consistently', done: true },
        { id: id(), text: 'Run 10k', done: false },
        { id: id(), text: 'Run 15k', done: false },
        { id: id(), text: 'Race day', done: false },
      ],
      createdAt: today.getTime() - 30 * 86400000,
    },
    {
      id: id(),
      title: 'Read 12 books this year',
      description: '',
      horizon: 'long',
      category: 'learning',
      status: 'planning',
      deadline: inDays(220),
      milestones: [
        { id: id(), text: 'Pick first 3 books', done: true },
        { id: id(), text: 'Finish book 1', done: false },
      ],
      createdAt: today.getTime() - 5 * 86400000,
    },
    {
      id: id(),
      title: 'Save 3 months of expenses',
      description: 'Emergency fund target',
      horizon: 'long',
      category: 'personal',
      status: 'in_progress',
      deadline: inDays(180),
      milestones: [
        { id: id(), text: 'Open high-yield savings', done: true },
        { id: id(), text: 'Automate 20% transfer', done: true },
        { id: id(), text: 'Reach 1 month', done: true },
        { id: id(), text: 'Reach 2 months', done: false },
        { id: id(), text: 'Reach 3 months', done: false },
      ],
      createdAt: today.getTime() - 60 * 86400000,
    },
  ].map((g) => normalizeGoal(g as Goal));

  // Sample trackers with some history so the demo has progress to show
  const daysAgo = (n: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - n);
    return dateKey(d);
  };
  const trackers: SavingsTracker[] = [
    {
      id: id(),
      name: 'iPad Pro M5',
      emoji: '📱',
      target: 800,
      unit: '$',
      unitPosition: 'prefix',
      monthlyTarget: 80,
      deadline: inDays(180),
      scope: 'personal',
      category: 'personal',
      createdAt: today.getTime() - 90 * 86400000,
      contributions: [
        { id: id(), date: daysAgo(85), amount: 120, note: 'Starting balance' },
        { id: id(), date: daysAgo(60), amount: 80, note: 'Month 1' },
        { id: id(), date: daysAgo(30), amount: 80, note: 'Month 2' },
        { id: id(), date: daysAgo(2), amount: 100, note: 'Freelance bonus' },
      ],
    },
    {
      id: id(),
      name: '12 books in 2026',
      emoji: '📚',
      target: 12,
      unit: 'books',
      unitPosition: 'suffix',
      monthlyTarget: 1,
      deadline: inDays(220),
      scope: 'personal',
      category: 'learning',
      createdAt: today.getTime() - 120 * 86400000,
      contributions: [
        { id: id(), date: daysAgo(115), amount: 1, note: 'Atomic Habits' },
        { id: id(), date: daysAgo(82), amount: 1, note: 'Deep Work' },
        { id: id(), date: daysAgo(48), amount: 1, note: 'The Pragmatic Programmer' },
        { id: id(), date: daysAgo(20), amount: 1, note: 'Range' },
      ],
    },
  ];

  return { todos, habits, goals, trackers };
}

// ── 6-month transformation plan ───────────────────────────
// Curated set of 6 sustainable daily habits + 10 goals (4 short-term, 6 long-term)
// designed to compound into real life change in 180 days.
function generateTransformPlan(): Store {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const id = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const inDays = (n: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + n);
    return dateKey(d);
  };

  const habits: Habit[] = [
    { id: id(), name: 'Drink 2 L of water',                                 emoji: '💧', color: 'sky',     createdAt: today.getTime(), log: {} },
    { id: id(), name: 'Move 30 min (walk · lift · yoga)',                   emoji: '🏃', color: 'emerald', createdAt: today.getTime(), log: {} },
    { id: id(), name: 'Meditate 10 min',                                    emoji: '🧘', color: 'violet',  createdAt: today.getTime(), log: {} },
    { id: id(), name: 'Read 20 min (no phone)',                             emoji: '📖', color: 'amber',   createdAt: today.getTime(), log: {} },
    { id: id(), name: 'Journal 5 lines — 1 win · 1 lesson · 1 gratitude',   emoji: '✍️', color: 'rose',    createdAt: today.getTime(), log: {} },
    { id: id(), name: 'In bed by 10:30 PM',                                 emoji: '💤', color: 'indigo',  createdAt: today.getTime(), log: {} },
  ];

  const goals: Goal[] = [
    // ─── Short-term (foundation, 3–5 weeks) ───
    {
      id: id(),
      title: 'Build the 6-habit foundation',
      description: 'Get all 6 daily habits running consistently. Everything else compounds from here.',
      horizon: 'short',
      category: 'health',
      status: 'in_progress',
      deadline: inDays(28),
      milestones: [
        { id: id(), text: 'Days 1–7: attempt every habit at least 3×',      done: false },
        { id: id(), text: 'Hit 80% on water + movement for 7 days',          done: false },
        { id: id(), text: 'Hit 80% on all 6 habits for 7 consecutive days',  done: false },
        { id: id(), text: '21-day streak on water and journaling',           done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: 'Finish your first book',
      description: 'Pick one book that excites you. 20 min / day = finished in 3–4 weeks.',
      horizon: 'short',
      category: 'learning',
      status: 'planning',
      deadline: inDays(30),
      milestones: [
        { id: id(), text: 'Choose the book',           done: false },
        { id: id(), text: 'Read 25 %',                 done: false },
        { id: id(), text: 'Read 50 %',                 done: false },
        { id: id(), text: 'Read 75 %',                 done: false },
        { id: id(), text: 'Finish + 5-line review',    done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: '10k steps for 7 consecutive days',
      description: 'Prove to yourself you can show up every single day. No exceptions.',
      horizon: 'short',
      category: 'health',
      status: 'planning',
      deadline: inDays(21),
      milestones: [
        { id: id(), text: 'Hit 7,500 steps for 3 days',         done: false },
        { id: id(), text: 'Hit 10k for 3 days (any 3)',         done: false },
        { id: id(), text: '10k for 7 consecutive days',          done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: '5-recipe rotation',
      description: 'Five healthy meals you can cook on autopilot — kills "what should I eat" decisions.',
      horizon: 'short',
      category: 'health',
      status: 'planning',
      deadline: inDays(35),
      milestones: [
        { id: id(), text: 'Recipe 1 — pick & cook', done: false },
        { id: id(), text: 'Recipe 2 — pick & cook', done: false },
        { id: id(), text: 'Recipe 3 — pick & cook', done: false },
        { id: id(), text: 'Recipe 4 — pick & cook', done: false },
        { id: id(), text: 'Recipe 5 — pick & cook', done: false },
      ],
      createdAt: today.getTime(),
    },

    // ─── Long-term (3–6 month horizon) ───
    {
      id: id(),
      title: 'Read 6 books in 6 months',
      description: 'One per month. Mix growth, fiction, and craft so it stays fresh.',
      horizon: 'long',
      category: 'learning',
      status: 'in_progress',
      deadline: inDays(180),
      milestones: [
        { id: id(), text: 'Book 1 (month 1)', done: false },
        { id: id(), text: 'Book 2 (month 2)', done: false },
        { id: id(), text: 'Book 3 (month 3)', done: false },
        { id: id(), text: 'Book 4 (month 4)', done: false },
        { id: id(), text: 'Book 5 (month 5)', done: false },
        { id: id(), text: 'Book 6 (month 6)', done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: 'Run 5 km without stopping',
      description: 'Build aerobic base from zero. 12 weeks works for almost anyone.',
      horizon: 'long',
      category: 'health',
      status: 'planning',
      deadline: inDays(90),
      milestones: [
        { id: id(), text: 'Walk 5 km comfortably',                   done: false },
        { id: id(), text: 'Walk-run 3 km (1 min run / 2 min walk)',  done: false },
        { id: id(), text: 'Run 2 km without stopping',                done: false },
        { id: id(), text: 'Run 3 km without stopping',                done: false },
        { id: id(), text: 'Run 4 km without stopping',                done: false },
        { id: id(), text: 'Run 5 km without stopping',                done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: 'Build a 3-month emergency fund',
      description: 'Monthly essentials × 3 = your target. Automate transfers weekly.',
      horizon: 'long',
      category: 'personal',
      status: 'in_progress',
      deadline: inDays(180),
      milestones: [
        { id: id(), text: 'Calculate monthly essentials',          done: false },
        { id: id(), text: 'Open a high-yield savings account',     done: false },
        { id: id(), text: 'Automate 20 % weekly transfer',         done: false },
        { id: id(), text: 'Reach 1 month of expenses',             done: false },
        { id: id(), text: 'Reach 2 months of expenses',            done: false },
        { id: id(), text: 'Reach 3 months — done',                 done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: 'Ship a public side project',
      description: 'Pick a small useful thing. Build it. Ship it. Share it.',
      horizon: 'long',
      category: 'work',
      status: 'planning',
      deadline: inDays(90),
      milestones: [
        { id: id(), text: 'Pick the idea (must solve your own problem)', done: false },
        { id: id(), text: 'Write a 1-page spec',                          done: false },
        { id: id(), text: 'Build the MVP (1 hr/day × 4 weeks)',           done: false },
        { id: id(), text: 'Get 5 friends to use it',                       done: false },
        { id: id(), text: 'Launch publicly + post on socials',             done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: 'Master one new skill — 100 hours',
      description: 'Deliberate practice 4×/week. By month 6 you can do something you couldn\'t before.',
      horizon: 'long',
      category: 'learning',
      status: 'planning',
      deadline: inDays(180),
      milestones: [
        { id: id(), text: 'Pick the skill, define what "mastery" looks like', done: false },
        { id: id(), text: '25 hours of deliberate practice',                  done: false },
        { id: id(), text: '50 hours of deliberate practice',                  done: false },
        { id: id(), text: '75 hours of deliberate practice',                  done: false },
        { id: id(), text: '100 hours — ship one piece of work using it',       done: false },
      ],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      title: 'Strengthen 3 relationships',
      description: 'Pick 3 people. Weekly check-in. One in-person hangout per month each.',
      horizon: 'long',
      category: 'personal',
      status: 'planning',
      deadline: inDays(180),
      milestones: [
        { id: id(), text: 'Name the 3 people',                          done: false },
        { id: id(), text: 'Reach out to all 3 in week 1',               done: false },
        { id: id(), text: 'Meet each in person ≥ 1× (month 1–2)',       done: false },
        { id: id(), text: 'Meet each in person ≥ 2× (month 3–4)',       done: false },
        { id: id(), text: 'Meet each in person ≥ 3× (month 5–6)',       done: false },
      ],
      createdAt: today.getTime(),
    },
  ].map((g) => normalizeGoal(g as Goal));

  // Assign sensible default scopes (work + ship side project = professional)
  const PROFESSIONAL_TITLES = new Set(['Ship a public side project', 'Master one new skill — 100 hours']);
  goals.forEach((g) => {
    g.scope = PROFESSIONAL_TITLES.has(g.title) ? 'professional' : 'personal';
  });

  // Starter trackers — the "save X to buy Y" feature
  const trackers: SavingsTracker[] = [
    {
      id: id(),
      name: 'iPad Pro M5 (treat yourself when this hits 100%)',
      emoji: '📱',
      target: 800,
      unit: '$',
      unitPosition: 'prefix',
      monthlyTarget: 80,
      deadline: inDays(180),
      scope: 'personal',
      category: 'personal',
      contributions: [],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      name: 'Emergency fund — 3 months of essentials',
      emoji: '🚨',
      target: 3000,
      unit: '$',
      unitPosition: 'prefix',
      monthlyTarget: 250,
      deadline: inDays(180),
      scope: 'personal',
      category: 'personal',
      contributions: [],
      createdAt: today.getTime(),
    },
    {
      id: id(),
      name: 'Side project — first paying customer',
      emoji: '💼',
      target: 1,
      unit: 'customer',
      unitPosition: 'suffix',
      monthlyTarget: undefined,
      deadline: inDays(120),
      scope: 'professional',
      category: 'work',
      contributions: [],
      createdAt: today.getTime(),
    },
  ];

  return { todos: [], habits, goals, trackers };
}

type Tab = 'dashboard' | 'todos' | 'habits' | 'goals' | 'trackers';

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function DailyTracker() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [tab, rawSetTab] = useState<Tab>('dashboard');
  // Wrap setTab to emit tab_switch analytics; only fires when the tab actually changes.
  const setTab = useCallback((next: Tab) => {
    rawSetTab((current) => {
      if (current !== next) ev.tabSwitch({ from: current, to: next });
      return next;
    });
  }, []);
  const [store, setStore] = useState<Store>(DEFAULT_STORE);
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const lastSavedAtRef = useRef<number>(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Confirmation dialog (Promise-based; replaces window.confirm) ──────────
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
  const confirm = useCallback(
    (opts: Omit<ConfirmOptions, 'onResolve'>): Promise<boolean> =>
      new Promise<boolean>((resolve) => {
        setConfirmOptions({
          ...opts,
          onResolve: (ok) => {
            setConfirmOptions(null);
            resolve(ok);
          },
        });
      }),
    [],
  );

  // Load once (and whenever userId changes — i.e. on sign-in)
  useEffect(() => {
    if (!userId) {
      setHydrated(false);
      return;
    }
    let alive = true;
    setHydrated(false);
    (async () => {
      const s = await fetchStoreFromServer();
      if (alive) {
        setStore(s);
        setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  // Debounced server save on every store change (skip until hydrated to avoid wiping data with the default)
  useEffect(() => {
    if (!hydrated || !userId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus('saving');
    saveTimerRef.current = setTimeout(async () => {
      const { ok } = await saveStoreToServer(store);
      if (ok) {
        lastSavedAtRef.current = Date.now();
        setSyncStatus('saved');
      } else {
        setSyncStatus('error');
      }
    }, 600);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [store, hydrated, userId]);

  // Best-effort flush on tab close
  useEffect(() => {
    const flush = () => {
      if (!hydrated || !userId) return;
      try {
        const payload = JSON.stringify({ data: store });
        // sendBeacon requires a Blob; this is best-effort, fire-and-forget.
        navigator.sendBeacon?.('/api/data', new Blob([payload], { type: 'application/json' }));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [store, hydrated, userId]);

  const addTodo = useCallback((t: Omit<Todo, 'id' | 'createdAt' | 'done'>) => {
    ev.taskAdd({ priority: t.priority, category: t.category });
    setStore((s) => ({
      ...s,
      todos: [{ ...t, id: uid(), createdAt: Date.now(), done: false }, ...s.todos],
    }));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setStore((s) => {
      const todo = s.todos.find((t) => t.id === id);
      if (todo) ev.taskCheck({ to_state: !todo.done ? 'done' : 'open' });
      return {
        ...s,
        todos: s.todos.map((t) =>
          t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : undefined } : t,
        ),
      };
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    ev.taskDelete();
    setStore((s) => ({ ...s, todos: s.todos.filter((t) => t.id !== id) }));
  }, []);

  const skipTodo = useCallback((id: string) => {
    setStore((s) => {
      const todo = s.todos.find((t) => t.id === id);
      if (todo) ev.taskSkip({ to_state: !todo.skipped ? 'skipped' : 'unskipped' });
      return {
        ...s,
        todos: s.todos.map((t) =>
          t.id === id ? { ...t, skipped: !t.skipped, done: false } : t,
        ),
      };
    });
  }, []);

  const rescheduleTodo = useCallback((id: string, newDate: string) => {
    ev.taskReschedule({});
    setStore((s) => ({
      ...s,
      todos: s.todos.map((t) =>
        t.id === id ? { ...t, dueDate: newDate, skipped: false } : t,
      ),
    }));
  }, []);

  const rolloverOverdue = useCallback(() => {
    const today = todayKey();
    setStore((s) => {
      let count = 0;
      const next = s.todos.map((t) => {
        if (!t.done && !t.skipped && t.dueDate < today) {
          count += 1;
          return {
            ...t,
            rolledOverFrom: t.rolledOverFrom ?? t.dueDate,
            dueDate: today,
          };
        }
        return t;
      });
      if (count > 0) {
        ev.taskRollover({ count });
        toast.success(`Rolled over ${count} task${count === 1 ? '' : 's'} to today`);
      }
      return { ...s, todos: next };
    });
  }, []);

  const addHabit = useCallback((name: string, emoji: string, color: string) => {
    ev.habitAdd();
    setStore((s) => ({
      ...s,
      habits: [...s.habits, { id: uid(), name, emoji, color, createdAt: Date.now(), log: {} }],
    }));
  }, []);

  const toggleHabit = useCallback((habitId: string, key: string) => {
    setStore((s) => {
      const habits = s.habits.map((h) => {
        if (h.id !== habitId) return h;
        const next = { ...h, log: { ...h.log, [key]: !h.log[key] } };
        // Only celebrate when checking IN (not unchecking) and only for today
        const turningOn = !h.log[key];
        const isToday = key === todayKey();
        ev.habitCheckIn({ to_state: turningOn ? 'done' : 'open' });
        if (turningOn && isToday) {
          const { current } = habitStreak(next);
          if (current === 7 || current === 30 || current === 100 || current === 365) {
            ev.habitStreakMilestone({ days: current });
            const banners = {
              7: '7-day streak — one full week of showing up. 🔥',
              30: '30-day streak — the habit is yours now. ⚡',
              100: '100 days — you are this person. 💪',
              365: '365 DAYS — a year built. 🏆',
            } as const;
            setTimeout(() => toast.success(banners[current as 7 | 30 | 100 | 365]), 60);
          }
        }
        return next;
      });
      return { ...s, habits };
    });
  }, []);

  const togglePauseHabit = useCallback((id: string) => {
    setStore((s) => {
      const h = s.habits.find((x) => x.id === id);
      if (h) ev.habitPauseToggle({ to_state: !h.paused ? 'paused' : 'active' });
      return {
        ...s,
        habits: s.habits.map((h2) => (h2.id === id ? { ...h2, paused: !h2.paused } : h2)),
      };
    });
  }, []);

  const deleteHabit = useCallback((id: string) => {
    ev.habitDelete();
    setStore((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }));
  }, []);

  const addGoal = useCallback(
    (g: Omit<Goal, 'id' | 'createdAt' | 'milestones' | 'status'> & { milestones?: string[] }) => {
      ev.goalAdd();
      setStore((s) => ({
        ...s,
        goals: [
          {
            ...g,
            id: uid(),
            createdAt: Date.now(),
            status: 'planning',
            milestones: (g.milestones ?? [])
              .filter(Boolean)
              .map((text) => ({ id: uid(), text, done: false })),
          },
          ...s.goals,
        ],
      }));
    },
    [],
  );

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    if (patch.status) ev.goalStatusChange({ to_status: patch.status });
    setStore((s) => ({ ...s, goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  }, []);

  const toggleMilestone = useCallback((goalId: string, msId: string) => {
    type Suggest = { goalId: string; title: string };
    setStore((s) => {
      const goal = s.goals.find((g) => g.id === goalId);
      const milestone = goal?.milestones.find((m) => m.id === msId);
      if (milestone) ev.goalMilestoneToggle({ to_state: !milestone.done ? 'done' : 'open' });
      const suggestRef: { value: Suggest | null } = { value: null };
      const goals = s.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => (m.id === msId ? { ...m, done: !m.done } : m));
        const next = { ...g, milestones };
        // Auto-suggest mark-done when last milestone flips to true and goal isn't already done/cancelled
        const allDone = milestones.length > 0 && milestones.every((m) => m.done);
        const someWereOpen = g.milestones.some((m) => m.id === msId && !m.done); // user just checked it
        if (allDone && someWereOpen && g.status !== 'done' && g.status !== 'cancelled') {
          suggestRef.value = { goalId: g.id, title: g.title };
        }
        return next;
      });
      const captured = suggestRef.value;
      if (captured) {
        setTimeout(() => {
          toast(
            (t) => (
              <span className="flex items-center gap-2">
                All milestones done! Mark <strong>&ldquo;{captured.title}&rdquo;</strong> as done?
                <button
                  type="button"
                  onClick={() => {
                    setStore((cur) => ({
                      ...cur,
                      goals: cur.goals.map((g) => (g.id === captured.goalId ? { ...g, status: 'done' as const } : g)),
                    }));
                    toast.dismiss(t.id);
                    toast.success('Goal completed 🎉');
                  }}
                  className="rounded bg-white px-2 py-0.5 text-[11px] font-bold text-emerald-700"
                >
                  Yes
                </button>
              </span>
            ),
            { duration: 7000 },
          );
        }, 100);
      }
      return { ...s, goals };
    });
  }, []);

  const addMilestone = useCallback((goalId: string, text: string) => {
    ev.goalMilestoneAdd();
    setStore((s) => ({
      ...s,
      goals: s.goals.map((g) =>
        g.id === goalId ? { ...g, milestones: [...g.milestones, { id: uid(), text, done: false }] } : g,
      ),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    ev.goalDelete();
    setStore((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
  }, []);

  // ── Tracker CRUD ─────────────────────────────────────────
  const addTracker = useCallback(
    (
      t: Omit<SavingsTracker, 'id' | 'createdAt' | 'contributions'> & {
        startingAmount?: number;
      },
    ) => {
      ev.trackerAdd();
      setStore((s) => ({
        ...s,
        trackers: [
          {
            ...t,
            id: uid(),
            createdAt: Date.now(),
            contributions:
              t.startingAmount && t.startingAmount > 0
                ? [{ id: uid(), date: todayKey(), amount: t.startingAmount, note: 'Starting balance' }]
                : [],
          },
          ...s.trackers,
        ],
      }));
    },
    [],
  );

  const updateTracker = useCallback((id: string, patch: Partial<SavingsTracker>) => {
    setStore((s) => ({
      ...s,
      trackers: s.trackers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteTracker = useCallback((id: string) => {
    ev.trackerDelete();
    setStore((s) => ({ ...s, trackers: s.trackers.filter((t) => t.id !== id) }));
  }, []);

  const togglePauseTracker = useCallback((id: string) => {
    setStore((s) => {
      const t = s.trackers.find((x) => x.id === id);
      if (t) ev.trackerPauseToggle({ to_state: !t.paused ? 'paused' : 'active' });
      return {
        ...s,
        trackers: s.trackers.map((t2) => (t2.id === id ? { ...t2, paused: !t2.paused } : t2)),
      };
    });
  }, []);

  const addContribution = useCallback(
    (trackerId: string, c: { date?: string; amount: number; note?: string }) => {
      ev.trackerContribution({ amount: c.amount });
      setStore((s) => ({
        ...s,
        trackers: s.trackers.map((t) =>
          t.id === trackerId
            ? {
                ...t,
                contributions: [
                  ...t.contributions,
                  { id: uid(), date: c.date ?? todayKey(), amount: c.amount, note: c.note },
                ].sort((a, b) => a.date.localeCompare(b.date)),
              }
            : t,
        ),
      }));
    },
    [],
  );

  const deleteContribution = useCallback((trackerId: string, contributionId: string) => {
    setStore((s) => ({
      ...s,
      trackers: s.trackers.map((t) =>
        t.id === trackerId ? { ...t, contributions: t.contributions.filter((c) => c.id !== contributionId) } : t,
      ),
    }));
  }, []);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buildyouryear-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported your data');
  }, [store]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<Store>;
        setStore({
          todos: parsed.todos ?? [],
          habits: parsed.habits ?? [],
          goals: parsed.goals ?? [],
          trackers: parsed.trackers ?? [],
        });
        toast.success('Imported data');
      } catch {
        toast.error('Could not parse that file');
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <Fragment>
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_2px_8px_-3px_rgba(0,0,0,0.06)]">
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" aria-hidden />

      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div role="tablist" aria-label="Daily tracker sections" className="flex flex-wrap gap-1 rounded-xl bg-zinc-100 p-1">
          <TabButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
          <TabButton
            active={tab === 'todos'}
            onClick={() => setTab('todos')}
            icon={<ListChecks className="h-4 w-4" />}
            label="Today"
            count={store.todos.filter((t) => !t.done && t.dueDate === todayKey()).length}
          />
          <TabButton
            active={tab === 'habits'}
            onClick={() => setTab('habits')}
            icon={<Repeat className="h-4 w-4" />}
            label="Habits"
            count={store.habits.filter((h) => !h.paused).length}
          />
          <TabButton
            active={tab === 'goals'}
            onClick={() => setTab('goals')}
            icon={<Target className="h-4 w-4" />}
            label="Goals"
            count={store.goals.filter((g) => g.status !== 'done' && g.status !== 'cancelled').length}
          />
          <TabButton
            active={tab === 'trackers'}
            onClick={() => setTab('trackers')}
            icon={<PiggyBank className="h-4 w-4" />}
            label="Save & Track"
            count={store.trackers.filter((t) => !t.paused).length}
          />
        </div>

        <div className="flex items-center gap-2">
          <SyncIndicator status={syncStatus} />
          {/* Connected action group — mirrors the tab pills on the left for symmetry */}
          <div className="inline-flex items-center divide-x divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <label className="inline-flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-700">
              <Upload className="h-3.5 w-3.5" />
              Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    ev.dashboardAction({ action: 'import' });
                    handleImport(f);
                  }
                  e.target.value = '';
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                ev.dashboardAction({ action: 'export' });
                handleExport();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-emerald-50/60 hover:text-emerald-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              type="button"
              onClick={async () => {
                const hasData =
                  store.todos.length > 0 || store.habits.length > 0 || store.goals.length > 0;
                if (hasData) {
                  const ok = await confirm({
                    title: 'Replace your data with the demo set?',
                    message:
                      'This swaps your current todos, habits, goals, and trackers for the sample dataset. Your existing data will be lost.',
                    confirmLabel: 'Load demo',
                    cancelLabel: 'Keep mine',
                    tone: 'warning',
                  });
                  if (!ok) return;
                }
                ev.dashboardAction({ action: 'load_demo' });
                setStore(generateSampleStore());
                toast.success('Sample data loaded');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              title="Replace your data with a demo set"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load demo
            </button>
          </div>
          {/* Primary CTA stays distinct */}
          <button
            type="button"
            onClick={async () => {
              const hasData =
                store.todos.length > 0 || store.habits.length > 0 || store.goals.length > 0;
              if (hasData) {
                const ok = await confirm({
                  title: 'Load the 6-month transformation plan?',
                  message:
                    'This replaces your current habits, goals, and trackers with a curated 6-month plan. Your existing setup will be lost.',
                  confirmLabel: 'Load the plan',
                  cancelLabel: 'Keep mine',
                  tone: 'warning',
                });
                if (!ok) return;
              }
              ev.dashboardAction({ action: 'load_plan' });
              setStore(generateTransformPlan());
              toast.success("Your 6-month plan is loaded — let's go.");
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-md"
            title="Load a curated 6-month transformation plan"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Setup 6-month plan
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5">
        {!hydrated ? (
          <div className="grid h-80 place-items-center text-sm text-zinc-400">Loading your data…</div>
        ) : tab === 'dashboard' ? (
          <DashboardView
            store={store}
            onJump={setTab}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onToggleHabit={toggleHabit}
            onLoadSample={() => {
              setStore(generateSampleStore());
              toast.success('Sample data loaded');
            }}
            onLoadPlan={() => {
              setStore(generateTransformPlan());
              toast.success('Your 6-month plan is loaded — let\'s go.');
            }}
          />
        ) : tab === 'todos' ? (
          <TodosView
            todos={store.todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onSkip={skipTodo}
            onReschedule={rescheduleTodo}
            onRollover={rolloverOverdue}
            confirm={confirm}
          />
        ) : tab === 'habits' ? (
          <HabitsView habits={store.habits} onAdd={addHabit} onToggle={toggleHabit} onDelete={deleteHabit} onTogglePause={togglePauseHabit} confirm={confirm} />
        ) : tab === 'goals' ? (
          <GoalsView
            goals={store.goals}
            onAdd={addGoal}
            onUpdate={updateGoal}
            onDelete={deleteGoal}
            onToggleMilestone={toggleMilestone}
            onAddMilestone={addMilestone}
            confirm={confirm}
          />
        ) : (
          <TrackersView
            confirm={confirm}
            trackers={store.trackers}
            onAdd={addTracker}
            onTogglePause={togglePauseTracker}
            onUpdate={updateTracker}
            onDelete={deleteTracker}
            onAddContribution={addContribution}
            onDeleteContribution={deleteContribution}
          />
        )}
      </div>
    </div>
    {/* App-wide confirmation modal (Promise-based) */}
    <ConfirmDialog options={confirmOptions} />
    </Fragment>
  );
}

function SyncIndicator({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  const map = {
    saving: {
      cls: 'border-zinc-200 bg-white text-zinc-500',
      dot: 'bg-amber-400 animate-pulse',
      label: 'Saving…',
    },
    saved: {
      cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      dot: 'bg-emerald-500',
      label: 'Saved',
    },
    error: {
      cls: 'border-rose-200 bg-rose-50 text-rose-700',
      dot: 'bg-rose-500',
      label: 'Save failed',
    },
  } as const;
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${m.cls}`}
      title={status === 'saved' ? 'Your changes are saved to your account' : undefined}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  /** Optional count chip shown on the right of the label. Hidden if undefined or 0. */
  count?: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
        active
          ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100'
          : 'text-zinc-600 hover:bg-white/60 hover:text-zinc-900'
      }`}
    >
      {icon}
      {label}
      {count != null && count > 0 && (
        <span
          className={`ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums ${
            active
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-zinc-200/80 text-zinc-600'
          }`}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

function DashboardView({
  store,
  onJump,
  onAddTodo,
  onToggleTodo,
  onToggleHabit,
  onLoadSample,
  onLoadPlan,
}: {
  store: Store;
  onJump: (t: Tab) => void;
  onAddTodo: (t: Omit<Todo, 'id' | 'createdAt' | 'done'>) => void;
  onToggleTodo: (id: string) => void;
  onToggleHabit: (id: string, key: string) => void;
  onLoadSample: () => void;
  onLoadPlan: () => void;
}) {
  const today = todayKey();

  // ── Today snapshot ─────────────────────────────────
  const todayTodos = store.todos.filter((t) => t.dueDate === today);
  const todayDone = todayTodos.filter((t) => t.done).length;
  const todayPct = todayTodos.length === 0 ? 0 : Math.round((todayDone / todayTodos.length) * 100);

  // ── 14-day trend ───────────────────────────────────
  const trend = useMemo(() => {
    const arr: { date: string; label: string; completed: number; created: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dateKey(d);
      const created = store.todos.filter((t) => t.dueDate === k).length;
      const completed = store.todos.filter((t) => t.dueDate === k && t.done).length;
      arr.push({
        date: k,
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        completed,
        created,
      });
    }
    return arr;
  }, [store.todos]);

  // ── Habit stats ────────────────────────────────────
  const habitStats = useMemo(
    () =>
      store.habits.map((h) => {
        const { current, best } = habitStreak(h);
        let last7 = 0;
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          if (h.log[dateKey(d)]) last7++;
        }
        return { habit: h, current, best, last7 };
      }),
    [store.habits],
  );

  const habitsTodayDone = store.habits.filter((h) => h.log[today]).length;
  const habitsPct = store.habits.length === 0 ? 0 : Math.round((habitsTodayDone / store.habits.length) * 100);

  // ── Goal stats ─────────────────────────────────────
  const goalsByStatus = {
    planning: store.goals.filter((g) => g.status === 'planning').length,
    in_progress: store.goals.filter((g) => g.status === 'in_progress').length,
    done: store.goals.filter((g) => g.status === 'done').length,
  };
  const goalsAvg =
    store.goals.length === 0
      ? 0
      : Math.round(store.goals.reduce((s, g) => s + goalProgress(g), 0) / store.goals.length);

  const score = Math.round(todayPct * 0.4 + habitsPct * 0.35 + goalsAvg * 0.25);

  // ── Week-over-week (for deltas) ────────────────────
  const wow = useMemo(() => {
    const sumWindow = (startDaysAgo: number) => {
      let tasks = 0;
      let habits = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (startDaysAgo + i));
        const k = dateKey(d);
        tasks += store.todos.filter((t) => t.dueDate === k && t.done).length;
        habits += store.habits.reduce((s, h) => s + (h.log[k] ? 1 : 0), 0);
      }
      return { tasks, habits };
    };
    const cur = sumWindow(0);
    const prev = sumWindow(7);
    return {
      cur,
      prev,
      taskDelta: prev.tasks === 0 ? (cur.tasks > 0 ? 100 : 0) : Math.round(((cur.tasks - prev.tasks) / prev.tasks) * 100),
      habitDelta: prev.habits === 0 ? (cur.habits > 0 ? 100 : 0) : Math.round(((cur.habits - prev.habits) / prev.habits) * 100),
    };
  }, [store.todos, store.habits]);

  // ── Habit weekly bar (7d) ──────────────────────────
  const habitWeek = useMemo(() => {
    const arr: { label: string; pct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dateKey(d);
      const done = store.habits.filter((h) => h.log[k]).length;
      const pct = store.habits.length === 0 ? 0 : Math.round((done / store.habits.length) * 100);
      arr.push({ label: shortLabel(d), pct });
    }
    return arr;
  }, [store.habits]);

  // ── Category breakdown (last 30 days, all tasks) ───
  const categoryData = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffKey = dateKey(cutoff);
    const counts: Record<Category, number> = { work: 0, personal: 0, learning: 0, health: 0, other: 0 };
    for (const t of store.todos) {
      if (t.dueDate >= cutoffKey) counts[t.category]++;
    }
    return (Object.keys(counts) as Category[])
      .map((c) => ({ name: CATEGORY_META[c].label, key: c, value: counts[c], color: CATEGORY_COLORS[c] }))
      .filter((d) => d.value > 0);
  }, [store.todos]);

  // ── Best day of week (avg completed by weekday over last 28 days) ──
  const dowData = useMemo(() => {
    const buckets: { sum: number; count: number }[] = Array.from({ length: 7 }, () => ({ sum: 0, count: 0 }));
    for (let i = 0; i < 28; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = dateKey(d);
      const done = store.todos.filter((t) => t.dueDate === k && t.done).length;
      buckets[d.getDay()].sum += done;
      buckets[d.getDay()].count++;
    }
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return labels.map((label, i) => ({
      label,
      avg: buckets[i].count === 0 ? 0 : Math.round((buckets[i].sum / buckets[i].count) * 10) / 10,
    }));
  }, [store.todos]);

  const bestDow = dowData.reduce((a, b) => (b.avg > a.avg ? b : a), dowData[0]);

  // ── Upcoming deadlines (goals + overdue tasks) ─────
  const upcoming = useMemo(() => {
    const items: { id: string; kind: 'goal' | 'task'; title: string; days: number; status?: string }[] = [];
    for (const g of store.goals) {
      if (g.status === 'done' || !g.deadline) continue;
      const days = Math.ceil((new Date(g.deadline + 'T00:00:00').getTime() - Date.now()) / 86400000);
      items.push({ id: g.id, kind: 'goal', title: g.title, days, status: g.status });
    }
    for (const t of store.todos) {
      if (t.done) continue;
      const days = Math.ceil((new Date(t.dueDate + 'T00:00:00').getTime() - Date.now()) / 86400000);
      if (days <= 7) items.push({ id: t.id, kind: 'task', title: t.text, days });
    }
    return items.sort((a, b) => a.days - b.days).slice(0, 6);
  }, [store.goals, store.todos]);

  // ── Recent wins (completed today) ──────────────────
  const recentWins = useMemo(() => {
    const wins: { id: string; kind: 'task' | 'habit' | 'goal' | 'milestone'; text: string; meta?: string }[] = [];
    for (const t of store.todos) {
      if (t.done && t.completedAt && t.completedAt >= Date.now() - 86400000) {
        wins.push({ id: t.id, kind: 'task', text: t.text, meta: CATEGORY_META[t.category].label });
      }
    }
    for (const h of store.habits) {
      if (h.log[today]) {
        wins.push({ id: 'h-' + h.id, kind: 'habit', text: h.name, meta: h.emoji });
      }
    }
    for (const g of store.goals) {
      if (g.status === 'done') {
        wins.push({ id: 'g-' + g.id, kind: 'goal', text: g.title });
      }
    }
    return wins.slice(0, 6);
  }, [store.todos, store.habits, store.goals, today]);

  // ── Smart insights ─────────────────────────────────
  const insights = useMemo(() => {
    const out: { icon: ReactNode; text: ReactNode; tone: 'pos' | 'neu' | 'warn' }[] = [];
    if (wow.cur.tasks > 0 || wow.prev.tasks > 0) {
      const delta = wow.taskDelta;
      out.push({
        icon: delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />,
        text: (
          <>
            <strong>{wow.cur.tasks}</strong> tasks done this week — {delta >= 0 ? 'up' : 'down'}{' '}
            <strong className={delta >= 0 ? 'text-emerald-700' : 'text-rose-700'}>{Math.abs(delta)}%</strong> vs last week
          </>
        ),
        tone: delta >= 0 ? 'pos' : 'warn',
      });
    }
    if (habitStats.length > 0) {
      const top = habitStats.reduce((a, b) => (b.current > a.current ? b : a), habitStats[0]);
      if (top.current >= 2) {
        out.push({
          icon: <Flame className="h-3.5 w-3.5" />,
          text: (
            <>
              Best streak: <strong>{top.habit.emoji} {top.habit.name}</strong> — <strong>{top.current} days</strong>
            </>
          ),
          tone: 'pos',
        });
      }
    }
    if (bestDow && bestDow.avg > 0) {
      out.push({
        icon: <Sun className="h-3.5 w-3.5" />,
        text: (
          <>
            You crush tasks on <strong>{bestDow.label}s</strong> — avg <strong>{bestDow.avg}</strong>/day
          </>
        ),
        tone: 'neu',
      });
    }
    const overdue = store.todos.filter((t) => !t.done && t.dueDate < today).length;
    if (overdue > 0) {
      out.push({
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        text: (
          <>
            <strong>{overdue}</strong> overdue task{overdue === 1 ? '' : 's'} — clear them or reschedule
          </>
        ),
        tone: 'warn',
      });
    }
    const atRisk = store.goals.filter((g) => {
      if (g.status === 'done' || !g.deadline) return false;
      const days = Math.ceil((new Date(g.deadline + 'T00:00:00').getTime() - Date.now()) / 86400000);
      return days >= 0 && days <= 7 && goalProgress(g) < 75;
    }).length;
    if (atRisk > 0) {
      out.push({
        icon: <Target className="h-3.5 w-3.5" />,
        text: (
          <>
            <strong>{atRisk}</strong> goal{atRisk === 1 ? '' : 's'} at risk — under 75% with &lt;7 days
          </>
        ),
        tone: 'warn',
      });
    }
    if (out.length === 0) {
      out.push({
        icon: <Sparkles className="h-3.5 w-3.5" />,
        text: <>Add tasks, habits and goals to unlock personalized insights.</>,
        tone: 'neu',
      });
    }
    return out.slice(0, 4);
  }, [wow, habitStats, bestDow, store.todos, store.goals, today]);

  // ── Greeting ───────────────────────────────────────
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return 'Burning the midnight oil';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Winding down';
  }, []);

  const empty = store.todos.length === 0 && store.habits.length === 0 && store.goals.length === 0;
  if (empty) return <EmptyDashboard onJump={onJump} onLoadSample={onLoadSample} onLoadPlan={onLoadPlan} />;

  const focusTasks = todayTodos.filter((t) => !t.done).sort((a, b) => {
    const pri = { high: 0, medium: 1, low: 2 } as const;
    return pri[a.priority] - pri[b.priority];
  }).slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Greeting + Quick Add */}
      <QuickAddBar greeting={greeting} onAdd={onAddTodo} />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Productivity Score"
          value={`${score}`}
          suffix="/100"
          accent="emerald"
          hint={score >= 80 ? 'On fire 🔥' : score >= 50 ? 'Solid pace' : 'Just getting started'}
        />
        <StatCard
          icon={<Check className="h-4 w-4" />}
          label="Today's Tasks"
          value={`${todayDone}/${todayTodos.length}`}
          suffix={` · ${todayPct}%`}
          accent="sky"
          hint={todayTodos.length === 0 ? 'Add tasks for today' : `${todayTodos.length - todayDone} left`}
          delta={{ value: wow.taskDelta, label: 'wk' }}
        />
        <StatCard
          icon={<Flame className="h-4 w-4" />}
          label="Habits Today"
          value={`${habitsTodayDone}/${store.habits.length}`}
          suffix={` · ${habitsPct}%`}
          accent="amber"
          hint={
            habitStats.length > 0
              ? `Top streak: ${Math.max(0, ...habitStats.map((h) => h.current))} days`
              : 'Add a habit to start'
          }
          delta={{ value: wow.habitDelta, label: 'wk' }}
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Goal Progress"
          value={`${goalsAvg}%`}
          accent="violet"
          hint={`${goalsByStatus.in_progress} in progress · ${goalsByStatus.done} done`}
        />
      </div>

      {/* Today's Focus + Smart Insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Today's focus"
            subtitle={
              todayTodos.length === 0
                ? 'Nothing planned — add a task above'
                : focusTasks.length === 0
                ? 'All today\'s tasks are done. Nice work.'
                : `${focusTasks.length} task${focusTasks.length === 1 ? '' : 's'} to ship today`
            }
            right={
              <button
                type="button"
                onClick={() => onJump('todos')}
                className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-900"
              >
                View all →
              </button>
            }
          />
          {focusTasks.length === 0 ? (
            todayTodos.length === 0 ? (
              <EmptyHint text="Add today's tasks above to see them here." />
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-6 text-center text-[13px] text-emerald-700">
                🎉 Inbox zero for today.
              </div>
            )
          ) : (
            <ul className="space-y-1.5">
              {focusTasks.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onToggleTodo(t.id)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50/40"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-zinc-300 bg-white transition-colors group-hover:border-emerald-400">
                      <Check className="h-3 w-3 text-transparent group-hover:text-emerald-400" strokeWidth={3} />
                    </span>
                    <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_META[t.priority].dot}`} />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-zinc-800">{t.text}</span>
                    <span className={`inline-flex h-5 shrink-0 items-center rounded-full border px-1.5 text-[10.5px] font-medium ${CATEGORY_META[t.category].chip}`}>
                      {CATEGORY_META[t.category].emoji}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Today's habits quick-strip */}
          {store.habits.length > 0 && (
            <div className="mt-4 border-t border-zinc-100 pt-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Today's habits</div>
                <button
                  type="button"
                  onClick={() => onJump('habits')}
                  className="text-[11.5px] font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  All habits →
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {store.habits.map((h) => {
                  const done = !!h.log[today];
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => onToggleHabit(h.id, today)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition-all ${
                        done
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-emerald-300 hover:text-emerald-700'
                      }`}
                    >
                      <span className="text-sm leading-none">{h.emoji}</span>
                      {h.name}
                      {done && <Check className="h-3 w-3" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Smart insights"
            subtitle="Auto-generated from your data"
            right={<Sparkles className="h-4 w-4 text-emerald-500" />}
          />
          <ul className="space-y-2">
            {insights.map((i, idx) => (
              <li
                key={idx}
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-[12.5px] leading-relaxed ${
                  i.tone === 'pos'
                    ? 'border-emerald-100 bg-emerald-50/60 text-emerald-900'
                    : i.tone === 'warn'
                    ? 'border-amber-100 bg-amber-50/60 text-amber-900'
                    : 'border-zinc-100 bg-zinc-50/60 text-zinc-800'
                }`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md ${
                    i.tone === 'pos'
                      ? 'bg-emerald-100 text-emerald-700'
                      : i.tone === 'warn'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {i.icon}
                </span>
                <span className="min-w-0 flex-1">{i.text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Tasks — last 14 days" subtitle="Completed vs created" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }} labelStyle={{ color: '#52525b' }} />
                <Area type="monotone" dataKey="created" stroke="#0ea5e9" strokeWidth={2} fill="url(#gradCreated)" name="Created" />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fill="url(#gradCompleted)" name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Today's score" subtitle="Blended productivity" />
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={[{ name: 'score', value: score, fill: '#10b981' }]}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: '#f4f4f5' }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-3xl font-bold text-zinc-900">{score}</div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-500">of 100</div>
                <div className="mt-1 text-[10.5px] text-zinc-400">
                  T {todayPct}% · H {habitsPct}% · G {goalsAvg}%
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Habit consistency heatmap */}
      <HabitHeatmap habits={store.habits} onJump={onJump} />


      {/* Row: streaks + categories + best day */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Streak board" subtitle="Your top habit runs" />
          <div className="space-y-2.5 pt-1">
            {habitStats.length === 0 ? (
              <EmptyHint text="Add a habit to see streaks." onAction={() => onJump('habits')} actionLabel="Add habit" />
            ) : (
              habitStats
                .sort((a, b) => b.current - a.current)
                .slice(0, 4)
                .map(({ habit, current, best, last7 }) => (
                  <div key={habit.id} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-lg shadow-sm ring-1 ring-zinc-100">
                      {habit.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-zinc-900">{habit.name}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-zinc-500">
                        <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3 text-amber-500" /> {current}d</span>
                        <span className="text-zinc-300">·</span>
                        <span>Best {best}</span>
                        <span className="text-zinc-300">·</span>
                        <span>{last7}/7</span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Tasks by category" subtitle="Last 30 days" />
          {categoryData.length === 0 ? (
            <EmptyHint text="No tasks in the last 30 days." />
          ) : (
            <div className="flex h-56 items-center gap-3">
              <div className="h-full w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="95%"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {categoryData.map((d) => (
                        <Cell key={d.key} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map((d) => {
                    const total = categoryData.reduce((s, x) => s + x.value, 0);
                    const pct = Math.round((d.value / total) * 100);
                    return (
                      <div key={d.key} className="flex items-center gap-2 text-[12px]">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                        <span className="min-w-0 flex-1 truncate text-zinc-700">
                          {CATEGORY_META[d.key].emoji} {d.name}
                        </span>
                        <span className="tabular-nums text-zinc-500">{d.value} · {pct}%</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Best day of week" subtitle="Avg tasks done · last 28 days" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dowData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} allowDecimals />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }} formatter={(v) => [`${v}`, 'Avg']} />
                <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                  {dowData.map((d) => (
                    <Cell key={d.label} fill={d.label === bestDow.label ? '#10b981' : '#a7f3d0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row: deadlines + recent wins */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Upcoming & at-risk"
            subtitle="Goals with deadlines + tasks due this week"
            right={<Clock className="h-4 w-4 text-amber-500" />}
          />
          {upcoming.length === 0 ? (
            <EmptyHint text="Nothing pressing. Set a deadline on a goal to track it here." />
          ) : (
            <ul className="space-y-2">
              {upcoming.map((u) => (
                <li
                  key={u.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                    u.days < 0
                      ? 'border-rose-100 bg-rose-50/50'
                      : u.days <= 1
                      ? 'border-amber-100 bg-amber-50/50'
                      : 'border-zinc-100 bg-zinc-50/40'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold ${
                      u.days < 0
                        ? 'bg-rose-500 text-white'
                        : u.days === 0
                        ? 'bg-amber-500 text-white'
                        : 'bg-white text-zinc-700 ring-1 ring-zinc-200'
                    }`}
                  >
                    {u.days < 0 ? `${Math.abs(u.days)}d` : u.days === 0 ? 'Now' : `${u.days}d`}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <span className={`inline-flex h-4 items-center rounded-full px-1.5 text-[9.5px] font-bold uppercase tracking-wider ${
                        u.kind === 'goal' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {u.kind}
                      </span>
                      {u.status && <span className="capitalize">{u.status.replace('_', ' ')}</span>}
                    </div>
                    <div className="mt-0.5 truncate text-[13.5px] font-semibold text-zinc-900">{u.title}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recent wins"
            subtitle="Completed in the last 24 hours"
            right={<Zap className="h-4 w-4 text-emerald-500" />}
          />
          {recentWins.length === 0 ? (
            <EmptyHint text="No wins logged yet — go check something off." />
          ) : (
            <ul className="space-y-2">
              {recentWins.map((w) => (
                <li key={w.id} className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
                      <span className="font-bold uppercase tracking-wider">{w.kind}</span>
                      {w.meta && <span>· {w.meta}</span>}
                    </div>
                    <div className="mt-0.5 truncate text-[13.5px] font-semibold text-zinc-900">{w.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Habits 7-day bar (kept smaller, full width below) */}
      <Card>
        <CardHeader title="Habits — last 7 days" subtitle="Daily completion %" />
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={habitWeek} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e4e4e7' }} formatter={(v) => [`${v}%`, 'Done']} />
              <Bar dataKey="pct" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Goals in flight */}
      <Card>
        <CardHeader
          title="Goals in flight"
          subtitle="Short and long-term — sorted by progress"
          right={
            <button
              type="button"
              onClick={() => onJump('goals')}
              className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Manage goals →
            </button>
          }
        />
        {store.goals.length === 0 ? (
          <EmptyHint text="No goals yet. Add a short-term win or a big dream." onAction={() => onJump('goals')} actionLabel="Add a goal" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...store.goals]
              .sort((a, b) => goalProgress(b) - goalProgress(a))
              .slice(0, 6)
              .map((g) => {
                const p = goalProgress(g);
                return (
                  <div key={g.id} className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[10.5px] font-semibold ${
                            g.horizon === 'short' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-violet-50 text-violet-700 border-violet-200'
                          }`}>
                            {g.horizon === 'short' ? 'Short-term' : 'Long-term'}
                          </span>
                          <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[10.5px] font-medium ${CATEGORY_META[g.category].chip}`}>
                            {CATEGORY_META[g.category].emoji} {CATEGORY_META[g.category].label}
                          </span>
                        </div>
                        <div className="mt-2 truncate text-sm font-semibold text-zinc-900">{g.title}</div>
                      </div>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-zinc-700">{p}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full ${p >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                        style={{ width: `${p}%` }}
                      />
                    </div>
                    {g.deadline && (
                      <div className="mt-2 text-[11px] text-zinc-500">
                        <Calendar className="mr-1 inline h-3 w-3" />
                        Due {new Date(g.deadline + 'T00:00:00').toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </Card>
    </div>
  );
}

const CATEGORY_COLORS: Record<Category, string> = {
  work: '#0ea5e9',
  personal: '#8b5cf6',
  learning: '#f59e0b',
  health: '#10b981',
  other: '#94a3b8',
};

function QuickAddBar({
  greeting,
  onAdd,
}: {
  greeting: string;
  onAdd: (t: Omit<Todo, 'id' | 'createdAt' | 'done'>) => void;
}) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const today = todayKey();
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const submit = () => {
    const v = text.trim();
    if (!v) {
      toast.error('Type a task first');
      return;
    }
    onAdd({ text: v, priority, category: 'work', dueDate: today });
    setText('');
    toast.success('Added to today');
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-sky-50/40 p-3.5 shadow-sm">
      <div className="mb-2 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">{dateLabel}</div>
          <div className="text-[16px] font-bold leading-tight text-zinc-900">{greeting} — what's the next move?</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Add a task for today and press Enter…"
          aria-label="Quick add task"
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            aria-label="Priority"
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[12.5px] font-semibold text-zinc-700 focus:border-emerald-400 focus:outline-none"
          >
            {Object.entries(PRIORITY_META).map(([v, m]) => (
              <option key={v} value={v}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Habit consistency heatmap — interactive, filterable, with stats ─────────
type HeatCell = {
  key: string;
  date: Date;
  done: number; // -1 = future
  isFuture: boolean;
  isToday: boolean;
};

const HEATMAP_WINDOWS = [
  { weeks: 8, label: '8w' },
  { weeks: 12, label: '12w' },
  { weeks: 26, label: '6m' },
  { weeks: 52, label: '1y' },
] as const;

function HabitHeatmap({ habits, onJump }: { habits: Habit[]; onJump: (t: Tab) => void }) {
  const [weeks, setWeeks] = useState<8 | 12 | 26 | 52>(12);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ cell: HeatCell; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedHabits = useMemo(
    () => (selectedHabitId ? habits.filter((h) => h.id === selectedHabitId) : habits),
    [habits, selectedHabitId],
  );
  const denom = selectedHabits.length; // max possible per day

  // Build the week-aligned grid
  const grid = useMemo<HeatCell[][]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayK = dateKey(today);
    const totalDays = weeks * 7;
    const start = new Date(today);
    start.setDate(today.getDate() - (totalDays - 1));
    const shift = start.getDay(); // align column 1 to Sunday
    start.setDate(start.getDate() - shift);

    const out: HeatCell[][] = [];
    let bucket: HeatCell[] = [];
    for (let i = 0; i < totalDays + shift; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const k = dateKey(d);
      const isFuture = d > today;
      const done = isFuture ? -1 : selectedHabits.reduce((s, h) => s + (h.log[k] ? 1 : 0), 0);
      bucket.push({ key: k, date: d, done, isFuture, isToday: k === todayK });
      if (bucket.length === 7) {
        out.push(bucket);
        bucket = [];
      }
    }
    if (bucket.length) out.push(bucket);
    return out;
  }, [weeks, selectedHabits]);

  // Stats over the window
  const stats = useMemo(() => {
    const flat = grid.flat().filter((c) => !c.isFuture);
    let total = 0;
    let activeDays = 0;
    let perfect = 0;
    let bestRun = 0;
    let run = 0;
    for (const c of flat) {
      const done = Math.max(0, c.done);
      total += done;
      if (done > 0) activeDays++;
      const isPerfect = denom > 0 && done === denom;
      if (isPerfect) {
        run++;
        if (run > bestRun) bestRun = run;
        perfect++;
      } else {
        run = 0;
      }
    }
    const trackedDays = flat.length;
    const consistency = trackedDays === 0 || denom === 0 ? 0 : Math.round((total / (trackedDays * denom)) * 100);
    const avg = trackedDays === 0 ? 0 : Math.round((total / trackedDays) * 10) / 10;
    return { total, activeDays, perfect, bestRun, trackedDays, consistency, avg };
  }, [grid, denom]);

  // Best week within the window
  const bestWeek = useMemo(() => {
    let best = { sum: -1, start: null as Date | null, end: null as Date | null };
    for (const week of grid) {
      const past = week.filter((c) => !c.isFuture);
      if (past.length === 0) continue;
      const sum = past.reduce((s, c) => s + Math.max(0, c.done), 0);
      if (sum > best.sum) best = { sum, start: past[0].date, end: past[past.length - 1].date };
    }
    return best;
  }, [grid]);

  // Per-habit completion in the window (for habit chip badges)
  const habitPctInWindow = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(dateKey(d));
    }
    const map = new Map<string, number>();
    for (const h of habits) {
      const done = days.filter((k) => h.log[k]).length;
      map.set(h.id, Math.round((done / days.length) * 100));
    }
    return map;
  }, [habits, weeks]);

  const gap = weeks >= 52 ? 2 : 3;
  const cellSize = weeks >= 52 ? 11 : weeks >= 26 ? 13 : weeks >= 12 ? 16 : 18;

  function tone(c: HeatCell): string {
    if (c.isFuture) return 'bg-transparent ring-0';
    if (c.done <= 0) return 'bg-zinc-100 ring-zinc-200/40';
    if (selectedHabitId) {
      // Single-habit view — use its own color
      const h = selectedHabits[0];
      return `${colorSolid(h?.color ?? 'emerald')} ring-white/0`;
    }
    const pct = denom === 0 ? 0 : c.done / denom;
    if (pct <= 0.25) return 'bg-emerald-200 ring-emerald-300/30';
    if (pct <= 0.5) return 'bg-emerald-400 ring-emerald-500/30';
    if (pct < 1) return 'bg-emerald-600 ring-emerald-700/30';
    return 'bg-emerald-800 ring-emerald-900/40';
  }

  // Month labels (sparse: only at column boundaries where the month changes)
  const monthLabels = useMemo(() => {
    const out: { col: number; label: string }[] = [];
    let lastMonth = -1;
    grid.forEach((week, i) => {
      const first = week[0]?.date;
      if (!first) return;
      if (first.getMonth() !== lastMonth) {
        out.push({ col: i, label: first.toLocaleDateString(undefined, { month: 'short' }) });
        lastMonth = first.getMonth();
      }
    });
    return out;
  }, [grid]);

  const handleEnter = (cell: HeatCell, e: React.MouseEvent<HTMLButtonElement>) => {
    const c = containerRef.current;
    if (!c) return;
    const cb = e.currentTarget.getBoundingClientRect();
    const pb = c.getBoundingClientRect();
    setHover({
      cell,
      x: cb.left - pb.left + cb.width / 2,
      y: cb.top - pb.top,
    });
  };

  const selectedName = selectedHabitId ? habits.find((h) => h.id === selectedHabitId)?.name ?? 'habit' : 'all habits';
  const winLabel = HEATMAP_WINDOWS.find((w) => w.weeks === weeks)?.label ?? `${weeks}w`;

  return (
    <Card>
      <CardHeader
        title="Habit consistency"
        subtitle={`Last ${winLabel} · ${selectedName} · each square is one day`}
        right={
          <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-[11.5px]">
            {HEATMAP_WINDOWS.map((w) => (
              <button
                key={w.weeks}
                type="button"
                onClick={() => setWeeks(w.weeks)}
                className={`rounded-md px-2 py-1 font-semibold capitalize transition-colors ${
                  weeks === w.weeks ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                aria-pressed={weeks === w.weeks}
              >
                {w.label}
              </button>
            ))}
          </div>
        }
      />

      {habits.length === 0 ? (
        <EmptyHint text="Add a habit to grow your heatmap." onAction={() => onJump('habits')} actionLabel="Add habit" />
      ) : (
        <>
          {/* Habit filter chips */}
          {habits.length > 1 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              <FilterChip
                active={selectedHabitId === null}
                onClick={() => setSelectedHabitId(null)}
                color="emerald"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">All</span>
                <span>·</span>
                <span className="font-bold tabular-nums">{habits.length}</span>
              </FilterChip>
              {habits.map((h) => (
                <FilterChip
                  key={h.id}
                  active={selectedHabitId === h.id}
                  onClick={() => setSelectedHabitId(h.id)}
                  color={h.color}
                >
                  <span className="text-sm leading-none">{h.emoji}</span>
                  <span className="max-w-[120px] truncate">{h.name}</span>
                  <span className="rounded-full bg-white/70 px-1.5 text-[10px] font-bold tabular-nums text-zinc-700">
                    {habitPctInWindow.get(h.id) ?? 0}%
                  </span>
                </FilterChip>
              ))}
            </div>
          )}

          {/* Stat tiles */}
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <HeatStat
              label="Consistency"
              value={`${stats.consistency}%`}
              hint={`${stats.total} check-in${stats.total === 1 ? '' : 's'}`}
              accent="emerald"
              ring={stats.consistency}
            />
            <HeatStat
              label={selectedHabitId ? 'Days done' : 'Perfect days'}
              value={selectedHabitId ? `${stats.activeDays}` : `${stats.perfect}`}
              hint={selectedHabitId ? `out of ${stats.trackedDays}` : `all ${denom} habits done`}
              accent="amber"
            />
            <HeatStat
              label="Avg per day"
              value={`${stats.avg}`}
              hint={denom > 1 ? `out of ${denom}` : 'check-ins / day'}
              accent="sky"
            />
            <HeatStat
              label="Best run"
              value={`${stats.bestRun}d`}
              hint={selectedHabitId ? 'consecutive days' : 'consecutive perfect days'}
              accent="rose"
            />
          </div>

          {/* Heatmap + side insight panel — structured side-by-side on desktop */}
          <div ref={containerRef} className="relative grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr] lg:gap-6">
            {/* Grid block — compact, framed */}
            <div className="overflow-x-auto rounded-xl border border-zinc-100 bg-gradient-to-br from-zinc-50/60 to-white p-4 lg:p-5">
              <div className="inline-flex flex-col" style={{ gap: `${gap}px` }}>
                {/* Month labels */}
                <div
                  className="ml-[28px] grid"
                  style={{
                    gridTemplateColumns: `repeat(${grid.length}, ${cellSize}px)`,
                    columnGap: `${gap}px`,
                  }}
                >
                  {grid.map((_, i) => {
                    const ml = monthLabels.find((m) => m.col === i);
                    return (
                      <div key={`m-${i}`} className="h-3 text-[10px] font-semibold text-zinc-500">
                        {ml?.label ?? ''}
                      </div>
                    );
                  })}
                </div>

                {/* Weekday labels + cells */}
                <div className="flex" style={{ gap: '6px' }}>
                  <div
                    className="flex flex-col text-[9.5px] font-semibold text-zinc-400"
                    style={{ gap: `${gap}px` }}
                  >
                    {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                      <div
                        key={i}
                        className="grid w-5 place-items-center text-right"
                        style={{ height: cellSize }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="flex" style={{ gap: `${gap}px` }}>
                    {grid.map((week, wi) => (
                      <div key={wi} className="flex flex-col" style={{ gap: `${gap}px` }}>
                        {week.map((cell) => {
                          const isInteractive = !cell.isFuture;
                          return (
                            <button
                              key={cell.key}
                              type="button"
                              disabled={!isInteractive}
                              onMouseEnter={isInteractive ? (e) => handleEnter(cell, e) : undefined}
                              onMouseLeave={isInteractive ? () => setHover(null) : undefined}
                              onFocus={isInteractive ? (e) => handleEnter(cell, e as unknown as React.MouseEvent<HTMLButtonElement>) : undefined}
                              onBlur={isInteractive ? () => setHover(null) : undefined}
                              aria-label={
                                cell.isFuture
                                  ? `${cell.date.toLocaleDateString()} (future)`
                                  : `${cell.date.toLocaleDateString()}: ${cell.done} of ${denom} habits done`
                              }
                              className={`rounded-[3px] ring-1 ring-inset outline-none transition-transform ${
                                cell.isToday ? 'ring-2 ring-emerald-500 ring-offset-1' : ''
                              } ${tone(cell)} ${
                                isInteractive
                                  ? 'cursor-pointer hover:z-10 hover:scale-[1.35] hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1'
                                  : 'cursor-default'
                              }`}
                              style={{ width: cellSize, height: cellSize }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Side insight panel — fills empty desktop space, stacks below on mobile */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
              <SidePanelTile
                label="Best week"
                value={bestWeek.start && bestWeek.sum > 0 ? `${bestWeek.sum}` : '—'}
                hint={
                  bestWeek.start && bestWeek.sum > 0
                    ? `${bestWeek.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}${
                        bestWeek.end && bestWeek.end.getTime() !== bestWeek.start.getTime()
                          ? ` – ${bestWeek.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                          : ''
                      }`
                    : 'No check-ins yet'
                }
                badge={bestWeek.sum > 0 ? 'check-ins' : undefined}
                tone="emerald"
              />
              {(() => {
                // Top habit by completion in window
                const entries = Array.from(habitPctInWindow.entries());
                if (entries.length === 0) return null;
                const top = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
                const topHabit = habits.find((h) => h.id === top[0]);
                if (!topHabit) return null;
                return (
                  <SidePanelTile
                    label="Most consistent"
                    value={`${top[1]}%`}
                    hint={topHabit.name}
                    badge={topHabit.emoji}
                    tone="amber"
                  />
                );
              })()}
              <SidePanelTile
                label="Tracking since"
                value={`${stats.trackedDays}d`}
                hint={`in this ${winLabel} window`}
                tone="sky"
              />
              <div className="hidden rounded-xl border border-zinc-100 bg-white p-3 lg:block">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Scale</div>
                <div className="mt-2">
                  <HeatmapScale singleColor={selectedHabitId ? selectedHabits[0]?.color ?? 'emerald' : null} />
                </div>
              </div>
            </div>

            {/* Tooltip */}
            {hover && (
              <div
                className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full"
                style={{ left: hover.x, top: hover.y - 6 }}
              >
                <HeatmapTooltip cell={hover.cell} habits={selectedHabits} totalHabits={denom} />
              </div>
            )}
          </div>

          {/* Mobile-only scale legend (desktop shows it in side panel) */}
          <div className="mt-3 flex items-center justify-end border-t border-zinc-100 pt-3 lg:hidden">
            <HeatmapScale singleColor={selectedHabitId ? selectedHabits[0]?.color ?? 'emerald' : null} />
          </div>
        </>
      )}
    </Card>
  );
}

function SidePanelTile({
  label,
  value,
  hint,
  badge,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  badge?: string;
  tone: 'emerald' | 'amber' | 'sky';
}) {
  const tones = {
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50/60', border: 'border-emerald-100' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50/60', border: 'border-amber-100' },
    sky: { text: 'text-sky-700', bg: 'bg-sky-50/60', border: 'border-sky-100' },
  } as const;
  const t = tones[tone];
  return (
    <div className={`rounded-xl border p-3 ${t.border} ${t.bg}`}>
      <div className="flex items-center justify-between gap-2">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${t.text}`}>{label}</div>
        {badge && (
          <span className="rounded-full bg-white/70 px-1.5 text-[11px] font-semibold tabular-nums text-zinc-700">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-1 text-[1.25rem] font-bold tabular-nums leading-none text-zinc-900">{value}</div>
      <div className="mt-1 truncate text-[11px] text-zinc-500">{hint}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: ReactNode;
}) {
  const activeBg: Record<string, string> = {
    emerald: 'border-emerald-400 bg-emerald-50 text-emerald-800',
    sky: 'border-sky-400 bg-sky-50 text-sky-800',
    violet: 'border-violet-400 bg-violet-50 text-violet-800',
    amber: 'border-amber-400 bg-amber-50 text-amber-800',
    rose: 'border-rose-400 bg-rose-50 text-rose-800',
    teal: 'border-teal-400 bg-teal-50 text-teal-800',
    indigo: 'border-indigo-400 bg-indigo-50 text-indigo-800',
    orange: 'border-orange-400 bg-orange-50 text-orange-800',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold shadow-sm transition-all ${
        active
          ? (activeBg[color] ?? activeBg.emerald)
          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
      }`}
    >
      {children}
    </button>
  );
}

function HeatStat({
  label,
  value,
  hint,
  accent,
  ring,
}: {
  label: string;
  value: string;
  hint: string;
  accent: 'emerald' | 'sky' | 'amber' | 'rose';
  ring?: number;
}) {
  const accents = {
    emerald: { text: 'text-emerald-700', bar: 'bg-emerald-500' },
    sky: { text: 'text-sky-700', bar: 'bg-sky-500' },
    amber: { text: 'text-amber-700', bar: 'bg-amber-500' },
    rose: { text: 'text-rose-700', bar: 'bg-rose-500' },
  } as const;
  const a = accents[accent];
  return (
    <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50/50 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${a.text}`}>{label}</div>
        {ring !== undefined && (
          <div className="relative h-5 w-5">
            <svg viewBox="0 0 20 20" className="h-5 w-5 -rotate-90">
              <circle cx="10" cy="10" r="8" stroke="#e4e4e7" strokeWidth="2.5" fill="none" />
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className={a.text}
                strokeDasharray={`${(Math.min(100, Math.max(0, ring)) / 100) * 50.27} 50.27`}
              />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-1 text-[18px] font-bold tabular-nums leading-none text-zinc-900">{value}</div>
      <div className="mt-1 text-[10.5px] text-zinc-500">{hint}</div>
    </div>
  );
}

function HeatmapTooltip({
  cell,
  habits,
  totalHabits,
}: {
  cell: HeatCell;
  habits: Habit[];
  totalHabits: number;
}) {
  const doneHabits = habits.filter((h) => h.log[cell.key]);
  const missedHabits = habits.filter((h) => !h.log[cell.key]);
  const dateLabel = cell.date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-w-[180px] rounded-xl border border-zinc-200 bg-white p-2.5 shadow-xl">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[11.5px] font-bold text-zinc-900">{dateLabel}</span>
        {cell.isToday && (
          <span className="rounded-full bg-emerald-100 px-1.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">
            Today
          </span>
        )}
      </div>
      {totalHabits === 0 ? (
        <div className="text-[11.5px] text-zinc-500">No habits tracked.</div>
      ) : (
        <>
          <div className="mb-1.5 flex items-center gap-1.5 text-[11.5px]">
            <span className="font-bold text-zinc-900">{cell.done}</span>
            <span className="text-zinc-500">of {totalHabits} done</span>
            {cell.done === totalHabits && cell.done > 0 && (
              <span className="ml-auto text-[10px] font-bold text-emerald-700">PERFECT 🎯</span>
            )}
          </div>
          {/* progress bar */}
          <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${totalHabits === 0 ? 0 : (cell.done / totalHabits) * 100}%` }}
            />
          </div>
          <ul className="space-y-0.5">
            {doneHabits.map((h) => (
              <li key={h.id} className="flex items-center gap-1.5 text-[11px] text-zinc-700">
                <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={3} />
                <span className="text-[12px] leading-none">{h.emoji}</span>
                <span className="truncate">{h.name}</span>
              </li>
            ))}
            {missedHabits.map((h) => (
              <li key={h.id} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="h-2.5 w-2.5 rounded-sm border border-zinc-300" />
                <span className="text-[12px] leading-none opacity-60">{h.emoji}</span>
                <span className="truncate line-through">{h.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function HeatmapScale({ singleColor }: { singleColor: string | null }) {
  if (singleColor) {
    return (
      <div className="hidden items-center gap-1.5 text-[10px] text-zinc-500 sm:flex">
        <span>Missed</span>
        <span className="h-3 w-3 rounded-[3px] bg-zinc-100 ring-1 ring-inset ring-zinc-200/50" />
        <span className={`h-3 w-3 rounded-[3px] ${colorSolid(singleColor)}`} />
        <span>Done</span>
      </div>
    );
  }
  return (
    <div className="hidden items-center gap-1.5 text-[10px] text-zinc-500 sm:flex">
      <span>None</span>
      <span className="h-3 w-3 rounded-[3px] bg-zinc-100 ring-1 ring-inset ring-zinc-200/40" />
      <span className="h-3 w-3 rounded-[3px] bg-emerald-200" />
      <span className="h-3 w-3 rounded-[3px] bg-emerald-400" />
      <span className="h-3 w-3 rounded-[3px] bg-emerald-600" />
      <span className="h-3 w-3 rounded-[3px] bg-emerald-800" />
      <span>All</span>
    </div>
  );
}

function EmptyDashboard({
  onJump,
  onLoadSample,
  onLoadPlan,
}: {
  onJump: (t: Tab) => void;
  onLoadSample: () => void;
  onLoadPlan: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-emerald-50/40 px-6 py-10 text-center sm:py-14">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-zinc-100">✨</div>
      <h2 className="mt-4 text-xl font-bold text-zinc-900 sm:text-2xl">Welcome to your tracker</h2>
      <p className="mx-auto mt-1.5 max-w-lg text-sm text-zinc-500">
        The hard part isn&rsquo;t the app — it&rsquo;s knowing what to track. Start with a proven plan, then tune as you go.
      </p>

      {/* Featured primary CTA — the curated 6-month plan */}
      <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 p-5 text-left shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-lg text-white shadow-md">
            🚀
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-zinc-900">Setup the 6-month transformation plan</h3>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-zinc-600">
              A curated foundation: <strong>6 daily habits</strong> (water, movement, meditation, reading, journaling, sleep)
              and <strong>10 goals</strong> (4 short-term wins for momentum, 6 long-term anchors). Each goal already has
              milestones broken down. Tweak anything later.
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-1 text-[11.5px] text-zinc-600 sm:grid-cols-2">
              <li>💧 Drink 2 L water</li>
              <li>🏃 Move 30 min / day</li>
              <li>🧘 Meditate 10 min</li>
              <li>📖 Read 20 min</li>
              <li>✍️ Journal 5 lines</li>
              <li>💤 Bed by 10:30 PM</li>
            </ul>
            <button
              type="button"
              onClick={onLoadPlan}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:from-emerald-700 hover:to-teal-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Setup my 6-month plan
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-7 flex max-w-md items-center gap-2 text-[10.5px] uppercase tracking-wider text-zinc-400">
        <span className="h-px flex-1 bg-zinc-200" />
        <span>or</span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-zinc-600 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Try sample dashboard data
        </button>
        <StartButton onClick={() => onJump('todos')} icon={<ListChecks className="h-4 w-4" />} label="Add today's tasks" />
        <StartButton onClick={() => onJump('habits')} icon={<Repeat className="h-4 w-4" />} label="Track a habit" />
        <StartButton onClick={() => onJump('goals')} icon={<Target className="h-4 w-4" />} label="Set a goal" />
      </div>
    </div>
  );
}

function StartButton({ onClick, icon, label }: { onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-zinc-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  hint,
  accent,
  delta,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  accent: 'emerald' | 'sky' | 'amber' | 'violet';
  delta?: { value: number; label: string };
}) {
  const accents = {
    emerald: { bar: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    sky: { bar: 'from-sky-500 to-cyan-400', bg: 'bg-sky-50', text: 'text-sky-700' },
    amber: { bar: 'from-amber-500 to-orange-400', bg: 'bg-amber-50', text: 'text-amber-700' },
    violet: { bar: 'from-violet-500 to-purple-400', bg: 'bg-violet-50', text: 'text-violet-700' },
  } as const;
  const a = accents[accent];
  const showDelta = delta !== undefined && delta.value !== 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.bar}`} aria-hidden />
      <div className="flex items-center justify-between">
        <div className={`grid h-7 w-7 place-items-center rounded-lg ${a.bg} ${a.text}`}>{icon}</div>
        {showDelta && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10.5px] font-bold ${
              delta!.value > 0
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
            title={`${delta!.value > 0 ? '+' : ''}${delta!.value}% vs last ${delta!.label}`}
          >
            {delta!.value > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {Math.abs(delta!.value)}%
          </span>
        )}
      </div>
      <div className="mt-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-[1.5rem] font-bold tabular-nums leading-none text-zinc-900">{value}</span>
        {suffix && <span className="text-[11.5px] font-medium text-zinc-500">{suffix}</span>}
      </div>
      {hint && <div className="mt-1.5 text-[11.5px] text-zinc-500">{hint}</div>}
    </div>
  );
}

function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-2">
      <div>
        <h3 className="text-[14.5px] font-bold text-zinc-900">{title}</h3>
        {subtitle && <p className="text-[12px] text-zinc-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/** Celebration banner shown when every today task is done. */
function DayDoneCelebration({ count }: { count: number }) {
  // Compute day-of-year deterministically on the client (matches the hero block math)
  const day = (() => {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
    return Math.max(1, Math.min(365, Math.floor((now.getTime() - start.getTime()) / 86_400_000)));
  })();
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 p-4 shadow-sm sm:p-5"
      style={{ animation: 'fadeUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" />
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-emerald-100">
          ✨
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            Day {day} · done
          </div>
          <div className="mt-0.5 text-[15.5px] font-bold tracking-tight text-zinc-900">
            Day {day} is yours. ✨
          </div>
          <div className="mt-0.5 text-[12.5px] text-zinc-600">
            All <strong className="text-zinc-900 tabular-nums">{count}</strong> task{count === 1 ? '' : 's'} done — one more brick in your year.
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyHint({
  text,
  onAction,
  actionLabel,
}: {
  text: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-6 text-center text-[13px] text-zinc-500">
      {text}
      {onAction && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function TodosView({
  todos,
  onAdd,
  onToggle,
  onDelete,
  onSkip,
  onReschedule,
  onRollover,
  confirm,
}: {
  todos: Todo[];
  onAdd: (t: Omit<Todo, 'id' | 'createdAt' | 'done'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSkip: (id: string) => void;
  onReschedule: (id: string, newDate: string) => void;
  onRollover: () => void;
  confirm: ConfirmFn;
}) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [dueDate, setDueDate] = useState(todayKey());
  const [filter, setFilter] = useState<'today' | 'all' | 'overdue'>('today');

  const today = todayKey();
  const submit = () => {
    const v = text.trim();
    if (!v) {
      toast.error('Add a task description first');
      return;
    }
    onAdd({ text: v, priority, category, dueDate });
    setText('');
    toast.success('Task added');
  };

  /**
   * "Resolved" = either done or skipped. Skipped tasks don't count as open or overdue.
   */
  const isResolved = (t: Todo) => t.done || t.skipped;

  const filtered = todos
    .filter((t) => {
      if (filter === 'today') return t.dueDate === today;
      if (filter === 'overdue') return !isResolved(t) && t.dueDate < today;
      return true;
    })
    .sort((a, b) => {
      // Resolved (done OR skipped) at the bottom
      const aR = isResolved(a) ? 1 : 0;
      const bR = isResolved(b) ? 1 : 0;
      if (aR !== bR) return aR - bR;
      const pri = { high: 0, medium: 1, low: 2 } as const;
      if (pri[a.priority] !== pri[b.priority]) return pri[a.priority] - pri[b.priority];
      return a.dueDate.localeCompare(b.dueDate);
    });

  const todayTotal = todos.filter((t) => t.dueDate === today).length;
  const todayDone = todos.filter((t) => t.dueDate === today && isResolved(t)).length;
  const overdue = todos.filter((t) => !isResolved(t) && t.dueDate < today).length;

  const askDeleteTodo = async (t: Todo) => {
    const ok = await confirm({
      title: 'Delete this task?',
      subject: t.text,
      message: 'This removes the task permanently. To keep it in your history, use Skip instead.',
      confirmLabel: 'Delete task',
      cancelLabel: 'Keep it',
      tone: 'danger',
    });
    if (ok) onDelete(t.id);
  };

  const askRollover = async () => {
    const ok = await confirm({
      title: `Roll over ${overdue} task${overdue === 1 ? '' : 's'} to today?`,
      message:
        'Unfinished tasks from earlier days will move to today. Their original date is kept as a small ↪ tag on each card.',
      confirmLabel: 'Roll over',
      cancelLabel: 'Not now',
      tone: 'info',
    });
    if (ok) onRollover();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50/60 p-3.5 shadow-sm">
        {/* Quick-add presets — one tap to seed text + category */}
        <QuickAddPresets
          onPick={(p) => {
            ev.taskQuickAddPreset({ preset: p.text.trim().replace(/[^a-z0-9]+/gi, '_').toLowerCase().slice(0, 24) });
            setText((cur) => (cur ? cur : p.text));
            setCategory(p.category);
          }}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="What do you want to get done?"
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            aria-label="Task description"
          />
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add task
          </button>
        </div>
        {/* Connected 3-up control group — symmetric thirds */}
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-zinc-200 sm:overflow-hidden sm:rounded-lg sm:border sm:border-zinc-200 sm:bg-white">
          <SelectChip
            label="Priority"
            value={priority}
            onChange={(v) => setPriority(v as Priority)}
            options={Object.entries(PRIORITY_META).map(([v, m]) => ({ value: v, label: m.label }))}
            joined
          />
          <SelectChip
            label="Category"
            value={category}
            onChange={(v) => setCategory(v as Category)}
            options={Object.entries(CATEGORY_META).map(([v, m]) => ({ value: v, label: `${m.emoji} ${m.label}` }))}
            joined
          />
          <label className="inline-flex w-full items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[12px] sm:rounded-none sm:border-0 sm:py-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Due</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 bg-transparent text-[12.5px] font-medium text-zinc-700 focus:outline-none"
              aria-label="Due date"
            />
          </label>
        </div>
      </div>

      {/* Rollover banner — shown only when there are overdue, unresolved tasks */}
      {overdue > 0 && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-3.5 py-2.5 shadow-sm"
          style={{ animation: 'fadeUp 500ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
        >
          <div className="flex items-center gap-2.5 text-[12.5px] text-amber-900">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-base shadow-sm ring-1 ring-amber-200">
              ↪
            </span>
            <span>
              <strong className="tabular-nums">{overdue}</strong>{' '}
              task{overdue === 1 ? '' : 's'} from earlier {overdue === 1 ? 'is' : 'are'} unfinished — bring them into today?
            </span>
          </div>
          <button
            type="button"
            onClick={askRollover}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-md"
          >
            Roll over to today
          </button>
        </div>
      )}

      {/* Filter row — stats on the left, segmented filter on the right, equal visual weight */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center divide-x divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11.5px] text-zinc-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Today</span>
            <strong className="tabular-nums text-zinc-900">{todayDone}/{todayTotal}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11.5px] text-zinc-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Overdue</span>
            <strong className={`tabular-nums ${overdue > 0 ? 'text-rose-600' : 'text-zinc-900'}`}>{overdue}</strong>
          </span>
        </div>
        <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-[12px]">
          {(['today', 'all', 'overdue'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                if (filter !== f) ev.taskFilterChange({ to: f });
                setFilter(f);
              }}
              className={`rounded-md px-2.5 py-1 font-semibold capitalize transition-colors ${
                filter === f ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Day-done celebration banner — fires when all today's tasks are completed */}
      {filter === 'today' && todayTotal > 0 && todayDone === todayTotal && (
        <DayDoneCelebration count={todayTotal} />
      )}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <EmptyHint
            text={
              filter === 'today'
                ? "Today's a blank canvas — add a task above to get going."
                : filter === 'overdue'
                ? 'Nice — nothing overdue.'
                : 'No tasks yet.'
            }
          />
        ) : (
          filtered.map((t) => (
            <TodoCard
              key={t.id}
              todo={t}
              today={today}
              onToggle={onToggle}
              onSkip={onSkip}
              onReschedule={onReschedule}
              onDelete={() => askDeleteTodo(t)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/** Single row in the Today list — with hover actions and reschedule popover. */
function TodoCard({
  todo: t,
  today,
  onToggle,
  onSkip,
  onReschedule,
  onDelete,
}: {
  todo: Todo;
  today: string;
  onToggle: (id: string) => void;
  onSkip: (id: string) => void;
  onReschedule: (id: string, date: string) => void;
  onDelete: () => void;
}) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Close popover on outside click / Esc
  useEffect(() => {
    if (!rescheduleOpen) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setRescheduleOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setRescheduleOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [rescheduleOpen]);

  const isOverdue = !t.done && !t.skipped && t.dueDate < today;
  const overdueDays = isOverdue
    ? Math.floor((new Date(today).getTime() - new Date(t.dueDate).getTime()) / 86_400_000)
    : 0;
  const isTomorrowOrLater = !t.done && !t.skipped && t.dueDate > today;
  const dueDays = isTomorrowOrLater
    ? Math.floor((new Date(t.dueDate).getTime() - new Date(today).getTime()) / 86_400_000)
    : 0;
  const dueLabel =
    t.dueDate === today
      ? 'today'
      : isOverdue
      ? `overdue ${overdueDays}d`
      : dueDays > 0
      ? dueDays === 1
        ? 'tomorrow'
        : `in ${dueDays}d`
      : new Date(t.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const spineColor = t.skipped
    ? 'bg-zinc-300'
    : t.done
    ? 'bg-zinc-200'
    : t.priority === 'high'
    ? 'bg-rose-500'
    : t.priority === 'medium'
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  // Helper to compute date string offset from today
  const dateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const cardBase = t.done
    ? 'border-zinc-100 opacity-70'
    : t.skipped
    ? 'border-zinc-200 bg-zinc-50/50'
    : 'border-zinc-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md';

  const textCls = t.done
    ? 'text-zinc-400 line-through'
    : t.skipped
    ? 'text-zinc-500 line-through decoration-dashed'
    : 'text-zinc-900';

  return (
    <div
      className={`group relative flex items-start gap-3 overflow-visible rounded-xl border bg-white p-3 pl-4 shadow-sm transition-all ${cardBase} ${
        rescheduleOpen ? 'z-50' : 'z-0'
      }`}
    >
      {/* Priority spine */}
      <span aria-hidden className={`absolute left-0 top-0 h-full w-1 ${spineColor}`} />

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(t.id)}
        aria-label={t.done ? 'Mark as not done' : 'Mark as done'}
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all ${
          t.done
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-zinc-300 bg-white hover:border-emerald-400 hover:scale-110'
        }`}
      >
        {t.done && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className={`text-[14px] font-medium ${textCls}`}>{t.text}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10.5px]">
          {/* Skipped tag (replaces priority chip when skipped) */}
          {t.skipped ? (
            <span className="inline-flex h-5 items-center gap-1 rounded-full border border-zinc-300 bg-zinc-100 px-1.5 font-semibold text-zinc-600">
              ⏭ Skipped
            </span>
          ) : (
            <span className={`inline-flex h-5 items-center gap-1 rounded-full border px-1.5 font-semibold ${PRIORITY_META[t.priority].chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_META[t.priority].dot}`} />
              {PRIORITY_META[t.priority].label}
            </span>
          )}

          <span className={`inline-flex h-5 items-center rounded-full border px-1.5 font-medium ${CATEGORY_META[t.category].chip}`}>
            {CATEGORY_META[t.category].emoji} {CATEGORY_META[t.category].label}
          </span>

          <span
            className={`inline-flex h-5 items-center gap-1 rounded-full border px-1.5 font-medium ${
              isOverdue
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : t.dueDate === today
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-zinc-200 bg-white text-zinc-600'
            }`}
          >
            <Calendar className="h-2.5 w-2.5" />
            {dueLabel}
          </span>

          {t.rolledOverFrom && (
            <span
              className="inline-flex h-5 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 font-semibold text-amber-700"
              title={`Originally due ${t.rolledOverFrom}`}
            >
              ↪ from {new Date(t.rolledOverFrom + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Hover action group — three icons + reschedule popover */}
      <div className="relative flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Reschedule */}
        <button
          type="button"
          onClick={() => setRescheduleOpen((v) => !v)}
          aria-label="Reschedule task"
          title="Reschedule"
          className={`rounded-md p-1.5 transition-colors ${
            rescheduleOpen
              ? 'bg-sky-50 text-sky-700'
              : 'text-zinc-400 hover:bg-sky-50 hover:text-sky-700'
          }`}
        >
          <Clock className="h-4 w-4" />
        </button>
        {/* Skip / unskip */}
        <button
          type="button"
          onClick={() => onSkip(t.id)}
          aria-label={t.skipped ? 'Unskip task' : 'Skip task'}
          title={t.skipped ? 'Unskip' : 'Skip — keep in history but mark not doing'}
          className={`rounded-md p-1.5 transition-colors ${
            t.skipped
              ? 'bg-zinc-100 text-zinc-700'
              : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
          }`}
        >
          {/* Inline "skip" icon (forward step) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete task"
          title="Delete"
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Reschedule popover — premium edition */}
        {rescheduleOpen && (
          <ReschedulePopover
            ref={popoverRef}
            currentDate={t.dueDate}
            today={today}
            onPick={(date, label) => {
              onReschedule(t.id, date);
              setRescheduleOpen(false);
              toast.success(label ? `Moved to ${label}` : 'Rescheduled');
            }}
            onClose={() => setRescheduleOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

/* ──────────────── Reschedule popover (premium) ─────────────────────────── */

type ReschedulePopoverProps = {
  currentDate: string;
  today: string;
  onPick: (date: string, label?: string) => void;
  onClose: () => void;
};

const ReschedulePopover = forwardRef<HTMLDivElement, ReschedulePopoverProps>(function ReschedulePopover(
  { currentDate, today, onPick, onClose },
  ref,
) {
  // Calendar month state — starts at the month of currentDate, or today if invalid
  const seed = useMemo(() => {
    const d = new Date(currentDate + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return new Date(today + 'T00:00:00');
    return d;
  }, [currentDate, today]);

  const [monthCursor, setMonthCursor] = useState(() => new Date(seed.getFullYear(), seed.getMonth(), 1));

  // Quick options — date + label + keyboard shortcut
  const offsetDate = (days: number) => {
    const d = new Date(today + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const nextWeekendDate = () => {
    // Next Saturday from today (or today if today is Saturday)
    const d = new Date(today + 'T00:00:00');
    const day = d.getDay(); // 0=Sun..6=Sat
    const delta = day === 6 ? 0 : (6 - day + 7) % 7;
    d.setDate(d.getDate() + delta);
    return d.toISOString().slice(0, 10);
  };

  const quickOptions: { key: string; label: string; icon: string; date: string; shortcut: string }[] = useMemo(
    () => [
      { key: 'today',    label: 'Today',         icon: '☀️',  date: today,             shortcut: 'T' },
      { key: 'tomorrow', label: 'Tomorrow',      icon: '🌤️',  date: offsetDate(1),     shortcut: 'M' },
      { key: 'weekend',  label: 'This weekend',  icon: '🌴',  date: nextWeekendDate(), shortcut: 'S' },
      { key: 'nextweek', label: 'Next week',     icon: '🚀',  date: offsetDate(7),     shortcut: 'W' },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today],
  );

  // Auto-flip: render above the trigger if there's not enough room below
  const [flipUp, setFlipUp] = useState(false);
  useEffect(() => {
    // Inner ref measure on mount
    const el = (ref as React.MutableRefObject<HTMLDivElement | null>).current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    if (rect.bottom > viewportH - 12) {
      setFlipUp(true);
    }
  }, [ref]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const match = quickOptions.find((q) => q.shortcut.toLowerCase() === k);
      if (match) {
        e.preventDefault();
        onPick(match.date, match.label.toLowerCase());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickOptions, onPick]);

  // Build the calendar grid for monthCursor
  const calendar = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = (first.getDay() + 6) % 7; // Mon-first: 0..6
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { date: string | null; day: number | null }[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ date: null, day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const iso = date.toISOString().slice(0, 10);
      cells.push({ date: iso, day: d });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
    return cells;
  }, [monthCursor]);

  const monthLabel = monthCursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const currentLabel = currentDate === today ? 'Today' : fmt(currentDate);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Reschedule task"
      className={`absolute right-0 z-50 w-[300px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.30)] ${
        flipUp ? 'bottom-9' : 'top-9'
      }`}
      style={{ animation: 'fadeUp 220ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      {/* Top accent stripe */}
      <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" aria-hidden />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
          <Clock className="h-3 w-3" />
          Reschedule
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="grid h-6 w-6 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Quick options */}
      <div className="space-y-0.5 px-1.5 pb-2">
        {quickOptions.map((q) => {
          const active = q.date === currentDate;
          return (
            <button
              key={q.key}
              type="button"
              onClick={() => onPick(q.date, q.label.toLowerCase())}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                  : 'text-zinc-700 hover:bg-emerald-50/60 hover:text-emerald-800'
              }`}
            >
              <span aria-hidden className="text-[14px] leading-none">{q.icon}</span>
              <span className="flex-1 text-left">{q.label}</span>
              <span className="text-[10.5px] font-medium tabular-nums text-zinc-400">{fmt(q.date)}</span>
              <kbd className="ml-1 hidden rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 font-mono text-[9.5px] font-semibold text-zinc-500 sm:inline-block">
                {q.shortcut}
              </kbd>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-100" />

      {/* Mini calendar */}
      <div className="px-3 py-2.5">
        {/* Month switcher */}
        <div className="mb-1.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonthCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
            className="grid h-6 w-6 place-items-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="text-[12px] font-bold text-zinc-700">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setMonthCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
            className="grid h-6 w-6 place-items-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 text-center text-[9.5px] font-bold uppercase tracking-wider text-zinc-400">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Day cells */}
        <div className="mt-1 grid grid-cols-7 gap-px">
          {calendar.map((cell, i) => {
            if (!cell.date) return <span key={i} className="h-7" />;
            const isToday = cell.date === today;
            const isCurrent = cell.date === currentDate;
            const isPast = cell.date < today;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPick(cell.date!, fmt(cell.date!))}
                disabled={isPast && !isCurrent}
                className={`grid h-7 place-items-center rounded-md text-[11.5px] font-semibold tabular-nums transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : isToday
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-100'
                    : isPast
                    ? 'text-zinc-300'
                    : 'text-zinc-700 hover:bg-zinc-100'
                } ${isPast && !isCurrent ? 'cursor-not-allowed' : ''}`}
                aria-label={fmt(cell.date)}
                title={fmt(cell.date)}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer — current status + shortcuts hint */}
      <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/60 px-3 py-2 text-[10.5px]">
        <span className="text-zinc-500">
          Currently: <span className="font-bold text-zinc-800">{currentLabel}</span>
        </span>
        <span className="text-zinc-400">
          <kbd className="mr-0.5 rounded border border-zinc-200 bg-white px-1 py-px font-mono text-[9.5px] font-semibold text-zinc-500">Esc</kbd>
          to close
        </span>
      </div>
    </div>
  );
});

/** One-tap presets that prefill the task input + category. */
function QuickAddPresets({
  onPick,
}: {
  onPick: (p: { text: string; category: Category }) => void;
}) {
  const presets: { emoji: string; label: string; text: string; category: Category }[] = [
    { emoji: '📞', label: 'Call',     text: 'Call ',          category: 'work' },
    { emoji: '📧', label: 'Email',    text: 'Email ',         category: 'work' },
    { emoji: '💻', label: 'Code',     text: 'Code ',          category: 'work' },
    { emoji: '🏃', label: 'Move',     text: 'Exercise — ',    category: 'health' },
    { emoji: '📚', label: 'Read',     text: 'Read ',          category: 'learning' },
    { emoji: '🧘', label: 'Reflect',  text: 'Reflect on ',    category: 'personal' },
  ];
  return (
    <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
        Quick add
      </span>
      {presets.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onPick({ text: p.text, category: p.category })}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11.5px] font-semibold text-zinc-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
        >
          <span aria-hidden>{p.emoji}</span>
          {p.label}
        </button>
      ))}
    </div>
  );
}

function SelectChip({
  label,
  value,
  onChange,
  options,
  joined = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  /** If true, drop the outer border/radius so the chip can sit inside a connected group. */
  joined?: boolean;
}) {
  const containerCls = joined
    ? 'inline-flex w-full items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 sm:rounded-none sm:border-0 sm:py-1.5'
    : 'inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1.5';
  return (
    <label className={containerCls}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[12.5px] font-medium text-zinc-700 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function HabitsView({
  habits,
  onAdd,
  onToggle,
  onDelete,
  onTogglePause,
  confirm,
}: {
  habits: Habit[];
  onAdd: (name: string, emoji: string, color: string) => void;
  onToggle: (id: string, key: string) => void;
  onDelete: (id: string) => void;
  onTogglePause: (id: string) => void;
  confirm: ConfirmFn;
}) {
  const askDelete = async (h: Habit) => {
    const days = Object.values(h.log).filter(Boolean).length;
    const ok = await confirm({
      title: 'Delete this habit?',
      subject: h.name,
      message:
        days > 0
          ? `You've checked in ${days} time${days === 1 ? '' : 's'} on this habit. All history will be lost.`
          : 'No check-ins yet — safe to remove.',
      confirmLabel: 'Delete habit',
      cancelLabel: 'Keep it',
      tone: 'danger',
    });
    if (ok) onDelete(h.id);
  };
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(HABIT_EMOJIS[0]);
  const [color, setColor] = useState<string>(HABIT_COLORS[0]);

  const last7 = useMemo(() => {
    const arr: { key: string; label: string; sublabel: string; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push({
        key: dateKey(d),
        label: shortLabel(d).slice(0, 1),
        sublabel: String(d.getDate()),
        isToday: i === 0,
      });
    }
    return arr;
  }, []);

  const submit = () => {
    const v = name.trim();
    if (!v) {
      toast.error('Give your habit a name');
      return;
    }
    onAdd(v, emoji, color);
    setName('');
    toast.success('Habit added');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50/60 p-3.5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="New habit — e.g. Drink 8 glasses of water"
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            aria-label="Habit name"
          />
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add habit
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Icon</span>
          <div className="flex flex-wrap gap-1">
            {HABIT_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`grid h-7 w-7 place-items-center rounded-md text-base transition-all ${
                  emoji === e ? 'bg-emerald-100 ring-2 ring-emerald-400' : 'bg-white hover:bg-zinc-100'
                }`}
                aria-label={`Choose icon ${e}`}
              >
                {e}
              </button>
            ))}
          </div>
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Color</span>
          <div className="flex flex-wrap gap-1">
            {HABIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-6 w-6 rounded-full border-2 transition-all ${
                  color === c ? 'border-zinc-900' : 'border-white'
                } ${colorDot(c)}`}
                aria-label={`Choose color ${c}`}
              />
            ))}
          </div>
        </div>
      </div>

      {habits.length === 0 ? (
        <EmptyHint text="No habits yet. Tiny daily wins compound — start with one." />
      ) : (
        <div className="space-y-2.5">
          <div className="hidden grid-cols-[1fr_auto_auto] items-center gap-3 px-3 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-400 sm:grid">
            <div>Habit</div>
            <div className="flex items-center gap-1">
              {last7.map((d) => (
                <div key={d.key} className="grid w-9 place-items-center">
                  <span>{d.label}</span>
                </div>
              ))}
            </div>
            <div className="w-20 text-right">Streak</div>
          </div>

          {habits.map((h) => {
            const { current, best } = habitStreak(h);
            return (
              <div
                key={h.id}
                className={`group flex flex-col gap-2 rounded-xl border bg-white p-3 shadow-sm transition-all sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-3 ${
                  h.paused
                    ? 'border-zinc-200 opacity-70'
                    : 'border-zinc-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-lg text-lg ${colorSoft(h.color)} ${h.paused ? 'grayscale' : ''}`}>
                    {h.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`truncate text-sm font-semibold ${h.paused ? 'text-zinc-500' : 'text-zinc-900'}`}>{h.name}</span>
                      {h.paused && (
                        <span className="inline-flex h-4 items-center gap-1 rounded-full border border-zinc-300 bg-zinc-100 px-1.5 text-[9.5px] font-bold uppercase tracking-wider text-zinc-600">
                          ⏸ Paused
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {Object.values(h.log).filter(Boolean).length} total check-ins
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {last7.map((d) => {
                    const done = !!h.log[d.key];
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => onToggle(h.id, d.key)}
                        aria-label={`${done ? 'Unmark' : 'Mark'} ${h.name} for ${d.key}`}
                        className={`grid h-9 w-9 place-items-center rounded-lg text-[10.5px] font-bold transition-all ${
                          done
                            ? `${colorSolid(h.color)} text-white shadow-sm`
                            : d.isToday
                            ? 'border-2 border-dashed border-zinc-300 bg-white text-zinc-400 hover:border-emerald-400 hover:text-emerald-600'
                            : 'border border-zinc-200 bg-zinc-50 text-zinc-400 hover:bg-white hover:text-zinc-700'
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" strokeWidth={3} /> : d.sublabel}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                      <Flame className="h-3.5 w-3.5" />
                      {current}
                    </div>
                    <div className="text-[10.5px] text-zinc-400">best {best}</div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => onTogglePause(h.id)}
                      aria-label={h.paused ? 'Resume habit' : 'Pause habit'}
                      title={h.paused ? 'Resume tracking' : 'Pause — keep history but stop daily nags'}
                      className={`rounded-md p-1.5 transition-colors ${
                        h.paused
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
                      }`}
                    >
                      {h.paused ? <Zap className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => askDelete(h)}
                      aria-label="Delete habit"
                      title="Delete habit"
                      className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function colorDot(c: string) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500', sky: 'bg-sky-500', violet: 'bg-violet-500', amber: 'bg-amber-500',
    rose: 'bg-rose-500', teal: 'bg-teal-500', indigo: 'bg-indigo-500', orange: 'bg-orange-500',
  };
  return map[c] ?? 'bg-emerald-500';
}
function colorSolid(c: string) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500', sky: 'bg-sky-500', violet: 'bg-violet-500', amber: 'bg-amber-500',
    rose: 'bg-rose-500', teal: 'bg-teal-500', indigo: 'bg-indigo-500', orange: 'bg-orange-500',
  };
  return map[c] ?? 'bg-emerald-500';
}
function colorSoft(c: string) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-50 ring-1 ring-emerald-100',
    sky: 'bg-sky-50 ring-1 ring-sky-100',
    violet: 'bg-violet-50 ring-1 ring-violet-100',
    amber: 'bg-amber-50 ring-1 ring-amber-100',
    rose: 'bg-rose-50 ring-1 ring-rose-100',
    teal: 'bg-teal-50 ring-1 ring-teal-100',
    indigo: 'bg-indigo-50 ring-1 ring-indigo-100',
    orange: 'bg-orange-50 ring-1 ring-orange-100',
  };
  return map[c] ?? 'bg-emerald-50 ring-1 ring-emerald-100';
}

function GoalsView({
  goals,
  onAdd,
  onUpdate,
  onDelete,
  onToggleMilestone,
  onAddMilestone,
  confirm,
}: {
  goals: Goal[];
  onAdd: (g: Omit<Goal, 'id' | 'createdAt' | 'milestones' | 'status'> & { milestones?: string[] }) => void;
  onUpdate: (id: string, patch: Partial<Goal>) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (goalId: string, msId: string) => void;
  onAddMilestone: (goalId: string, text: string) => void;
  confirm: ConfirmFn;
}) {
  const askDeleteGoal = async (g: Goal) => {
    const doneMs = g.milestones.filter((m) => m.done).length;
    const ok = await confirm({
      title: 'Delete this goal?',
      subject: g.title,
      message:
        g.milestones.length > 0
          ? `${doneMs} of ${g.milestones.length} milestone${g.milestones.length === 1 ? '' : 's'} done. All progress will be lost.`
          : 'No milestones yet — safe to remove.',
      confirmLabel: 'Delete goal',
      cancelLabel: 'Keep it',
      tone: 'danger',
    });
    if (ok) onDelete(g.id);
  };
  const handleDeleteGoalById = (id: string) => {
    const g = goals.find((x) => x.id === id);
    if (g) askDeleteGoal(g);
  };
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [horizon, setHorizon] = useState<GoalHorizon>('short');
  const [category, setCategory] = useState<Category>('personal');
  const [scope, setScope] = useState<Scope>('personal');
  const [deadline, setDeadline] = useState('');
  const [milestonesText, setMilestonesText] = useState('');
  const [scopeFilter, setScopeFilter] = useState<Scope | 'all'>('all');
  const [horizonFilter, setHorizonFilter] = useState<'all' | 'short' | 'long'>('all');

  const submit = () => {
    const v = title.trim();
    if (!v) {
      toast.error('Give your goal a title');
      return;
    }
    onAdd({
      title: v,
      description: description.trim(),
      horizon,
      category,
      scope,
      deadline: deadline || undefined,
      milestones: milestonesText.split('\n').map((s) => s.trim()).filter(Boolean),
    });
    setTitle('');
    setDescription('');
    setDeadline('');
    setMilestonesText('');
    setOpen(false);
    toast.success('Goal added');
  };

  const filtered = goals.filter(
    (g) =>
      (scopeFilter === 'all' || g.scope === scopeFilter) &&
      (horizonFilter === 'all' || g.horizon === horizonFilter),
  );
  const personalGoals = filtered.filter((g) => g.scope === 'personal');
  const professionalGoals = filtered.filter((g) => g.scope === 'professional');

  return (
    <div className="space-y-4">
      {/* Scope segmented control + counts */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50/60 p-3 shadow-sm">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <ScopeTab
            active={scopeFilter === 'all'}
            onClick={() => setScopeFilter('all')}
            icon={<Target className="h-4 w-4" />}
            label="All goals"
            count={goals.length}
            personal={goals.filter((g) => g.scope === 'personal').length}
            professional={goals.filter((g) => g.scope === 'professional').length}
          />
          <ScopeTab
            active={scopeFilter === 'personal'}
            onClick={() => setScopeFilter('personal')}
            icon={<Heart className="h-4 w-4" />}
            label="Personal"
            count={goals.filter((g) => g.scope === 'personal').length}
            accent="rose"
          />
          <ScopeTab
            active={scopeFilter === 'professional'}
            onClick={() => setScopeFilter('professional')}
            icon={<Briefcase className="h-4 w-4" />}
            label="Professional"
            count={goals.filter((g) => g.scope === 'professional').length}
            accent="sky"
          />
        </div>
      </div>

      {/* Secondary controls: horizon filter + new goal */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 text-[12px]">
          {(['all', 'short', 'long'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setHorizonFilter(f)}
              className={`rounded-md px-2.5 py-1 font-semibold capitalize transition-colors ${
                horizonFilter === f ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {f === 'all' ? 'All horizons' : f === 'short' ? 'Short-term' : 'Long-term'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {open ? 'Cancel' : 'New goal'}
        </button>
      </div>

      {open && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ship v1 of the product"
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Why this matters (optional)</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="A note to your future self about the why"
                className="mt-1 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <Label>Scope</Label>
              <div className="mt-1 inline-flex w-full rounded-lg bg-zinc-100 p-0.5 text-[12.5px]">
                {(['personal', 'professional'] as const).map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setScope(sc)}
                    className={`flex-1 rounded-md px-2 py-1.5 font-semibold capitalize transition-colors ${
                      scope === sc ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-600'
                    }`}
                  >
                    {sc === 'personal' ? '❤️ Personal' : '💼 Professional'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Horizon</Label>
              <div className="mt-1 inline-flex w-full rounded-lg bg-zinc-100 p-0.5 text-[12.5px]">
                {(['short', 'long'] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHorizon(h)}
                    className={`flex-1 rounded-md px-2 py-1.5 font-semibold transition-colors ${
                      horizon === h ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-600'
                    }`}
                  >
                    {h === 'short' ? 'Short-term (weeks)' : 'Long-term (months/years)'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {Object.entries(CATEGORY_META).map(([v, m]) => (
                  <option key={v} value={v}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Deadline (optional)</Label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Milestones (one per line)</Label>
              <textarea
                value={milestonesText}
                onChange={(e) => setMilestonesText(e.target.value)}
                rows={3}
                placeholder={'Outline the spec\nShip MVP\nRun first 5 user interviews'}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <Award className="h-4 w-4" />
              Save goal
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyHint text="No goals here yet. Pick one big thing — make it concrete and time-bound." />
      ) : scopeFilter === 'all' ? (
        <div className="space-y-5">
          {personalGoals.length > 0 && (
            <ScopeSection
              icon={<Heart className="h-4 w-4" />}
              label="Personal"
              count={personalGoals.length}
              accent="rose"
            >
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {personalGoals.map((g) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    onUpdate={onUpdate}
                    onDelete={handleDeleteGoalById}
                    onToggleMilestone={onToggleMilestone}
                    onAddMilestone={onAddMilestone}
                  />
                ))}
              </div>
            </ScopeSection>
          )}
          {professionalGoals.length > 0 && (
            <ScopeSection
              icon={<Briefcase className="h-4 w-4" />}
              label="Professional"
              count={professionalGoals.length}
              accent="sky"
            >
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {professionalGoals.map((g) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    onUpdate={onUpdate}
                    onDelete={handleDeleteGoalById}
                    onToggleMilestone={onToggleMilestone}
                    onAddMilestone={onAddMilestone}
                  />
                ))}
              </div>
            </ScopeSection>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onUpdate={onUpdate}
              onDelete={handleDeleteGoalById}
              onToggleMilestone={onToggleMilestone}
              onAddMilestone={onAddMilestone}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ScopeTab({
  active,
  onClick,
  icon,
  label,
  count,
  personal,
  professional,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count: number;
  personal?: number;
  professional?: number;
  accent?: 'rose' | 'sky';
}) {
  const accentClasses =
    accent === 'rose'
      ? 'data-[active=true]:border-rose-300 data-[active=true]:bg-rose-50 data-[active=true]:text-rose-800'
      : accent === 'sky'
      ? 'data-[active=true]:border-sky-300 data-[active=true]:bg-sky-50 data-[active=true]:text-sky-800'
      : 'data-[active=true]:border-emerald-300 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-800';
  return (
    <button
      type="button"
      data-active={active}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-left shadow-sm transition-all hover:border-zinc-300 ${accentClasses}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-600 group-data-[active=true]:bg-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-zinc-900">{label}</span>
        <span className="block text-[11px] text-zinc-500">
          {personal !== undefined && professional !== undefined ? (
            <>{personal} personal · {professional} professional</>
          ) : (
            <>{count} {count === 1 ? 'goal' : 'goals'}</>
          )}
        </span>
      </span>
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-zinc-700 group-data-[active=true]:bg-white">
        {count}
      </span>
    </button>
  );
}

function ScopeSection({
  icon,
  label,
  count,
  accent,
  children,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  accent: 'rose' | 'sky';
  children: ReactNode;
}) {
  const accentMap = {
    rose: { chip: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'from-rose-500 to-pink-500' },
    sky: { chip: 'bg-sky-50 text-sky-700 border-sky-200', bar: 'from-sky-500 to-cyan-500' },
  } as const;
  const a = accentMap[accent];
  return (
    <section>
      <header className="mb-2.5 flex items-center gap-2.5">
        <span className={`grid h-7 w-7 place-items-center rounded-lg border ${a.chip}`}>{icon}</span>
        <h3 className="text-[14.5px] font-bold text-zinc-900">{label}</h3>
        <span className={`inline-flex h-5 items-center rounded-full bg-gradient-to-r ${a.bar} px-2 text-[10.5px] font-bold text-white shadow-sm`}>
          {count}
        </span>
        <div className="h-px flex-1 bg-zinc-100" />
      </header>
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{children}</span>;
}

function GoalCard({
  goal,
  onUpdate,
  onDelete,
  onToggleMilestone,
  onAddMilestone,
}: {
  goal: Goal;
  onUpdate: (id: string, patch: Partial<Goal>) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (goalId: string, msId: string) => void;
  onAddMilestone: (goalId: string, text: string) => void;
}) {
  const [newMs, setNewMs] = useState('');
  const [editTitle, setEditTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(goal.title);

  const p = goalProgress(goal);
  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline + 'T00:00:00').getTime() - Date.now()) / 86400000)
    : null;

  const statusMeta: Record<GoalStatus, { label: string; chip: string; icon: string }> = {
    planning:    { label: 'Planning',    chip: 'bg-zinc-100 text-zinc-700 border-zinc-200',         icon: '📋' },
    in_progress: { label: 'In progress', chip: 'bg-sky-50 text-sky-700 border-sky-200',             icon: '🚀' },
    done:        { label: 'Done',        chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅' },
    cancelled:   { label: 'Cancelled',   chip: 'bg-zinc-100 text-zinc-500 border-zinc-200',         icon: '🚫' },
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10.5px] font-semibold ${
              goal.scope === 'professional'
                ? 'border-sky-200 bg-sky-50 text-sky-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}>
              {goal.scope === 'professional' ? <Briefcase className="h-2.5 w-2.5" /> : <Heart className="h-2.5 w-2.5" />}
              {goal.scope === 'professional' ? 'Professional' : 'Personal'}
            </span>
            <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[10.5px] font-semibold ${
              goal.horizon === 'short' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-violet-50 text-violet-700 border-violet-200'
            }`}>
              {goal.horizon === 'short' ? 'Short-term' : 'Long-term'}
            </span>
            <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[10.5px] font-medium ${CATEGORY_META[goal.category].chip}`}>
              {CATEGORY_META[goal.category].emoji} {CATEGORY_META[goal.category].label}
            </span>
            <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[10.5px] font-semibold ${statusMeta[goal.status].chip}`}>
              <CircleDot className="mr-1 h-2.5 w-2.5" />
              {statusMeta[goal.status].label}
            </span>
          </div>

          {editTitle ? (
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={() => {
                onUpdate(goal.id, { title: draftTitle.trim() || goal.title });
                setEditTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdate(goal.id, { title: draftTitle.trim() || goal.title });
                  setEditTitle(false);
                }
                if (e.key === 'Escape') {
                  setDraftTitle(goal.title);
                  setEditTitle(false);
                }
              }}
              className="mt-2 w-full rounded-md border border-emerald-300 px-2 py-1 text-[15px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditTitle(true)}
              className="group/title mt-2 flex items-center gap-1 text-left text-[15px] font-bold text-zinc-900"
            >
              <span className="line-clamp-2">{goal.title}</span>
              <Pencil className="h-3 w-3 text-zinc-300 opacity-0 transition-opacity group-hover/title:opacity-100" />
            </button>
          )}
          {goal.description && <p className="mt-1 text-[12.5px] text-zinc-500">{goal.description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          aria-label="Delete goal"
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="font-semibold text-zinc-600">Progress</span>
          <span className="font-bold tabular-nums text-zinc-900">{p}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full transition-all ${p >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
            style={{ width: `${p}%` }}
          />
        </div>
        {goal.deadline && (
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>
              <Calendar className="mr-1 inline h-3 w-3" />
              {new Date(goal.deadline + 'T00:00:00').toLocaleDateString()}
            </span>
            {daysLeft !== null && (
              <span className={daysLeft < 0 ? 'font-semibold text-rose-600' : daysLeft < 7 ? 'font-semibold text-amber-600' : ''}>
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 inline-flex w-full rounded-lg bg-zinc-100 p-0.5 text-[11px]">
        {(['planning', 'in_progress', 'done', 'cancelled'] as const).map((st) => {
          const isActive = goal.status === st;
          const activeColor =
            st === 'done'
              ? 'text-emerald-700'
              : st === 'cancelled'
              ? 'text-zinc-500'
              : st === 'in_progress'
              ? 'text-sky-700'
              : 'text-zinc-700';
          return (
            <button
              key={st}
              type="button"
              onClick={() => {
                onUpdate(goal.id, { status: st });
                if (st === 'done') toast.success('Goal completed 🎉');
                else if (st === 'cancelled') toast('Goal cancelled', { icon: '🚫' });
              }}
              className={`flex flex-1 items-center justify-center gap-1 rounded-md px-1.5 py-1 font-semibold transition-colors ${
                isActive ? `bg-white ${activeColor} shadow-sm` : 'text-zinc-500 hover:text-zinc-800'
              }`}
              title={statusMeta[st].label}
            >
              <span aria-hidden className="text-[12px] leading-none">{statusMeta[st].icon}</span>
              <span className="hidden sm:inline">{statusMeta[st].label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 border-t border-zinc-100 pt-3">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Milestones</div>
        <div className="mt-1.5 space-y-1.5">
          {goal.milestones.length === 0 && (
            <div className="text-[12px] text-zinc-400">Break it down into bite-size steps below.</div>
          )}
          {goal.milestones.map((m) => (
            <label
              key={m.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[13px] transition-colors hover:bg-zinc-50"
            >
              <input
                type="checkbox"
                checked={m.done}
                onChange={() => onToggleMilestone(goal.id, m.id)}
                className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-400"
              />
              <span className={m.done ? 'text-zinc-400 line-through' : 'text-zinc-800'}>{m.text}</span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <input
            type="text"
            value={newMs}
            onChange={(e) => setNewMs(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newMs.trim()) {
                onAddMilestone(goal.id, newMs.trim());
                setNewMs('');
              }
            }}
            placeholder="Add a milestone…"
            className="flex-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[12.5px] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="button"
            onClick={() => {
              if (newMs.trim()) {
                onAddMilestone(goal.id, newMs.trim());
                setNewMs('');
              }
            }}
            className="rounded-md border border-zinc-200 bg-white p-1.5 text-zinc-500 hover:border-emerald-300 hover:text-emerald-700"
            aria-label="Add milestone"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Save & Track view (numeric, time-bound trackers) ────────────────────────
const TRACKER_EMOJIS = ['📱', '💻', '🏠', '🚗', '✈️', '🎓', '💍', '🎸', '📚', '💰', '🏖️', '🎯'];
const CURRENCY_UNITS: { unit: string; position: 'prefix' | 'suffix'; label: string }[] = [
  { unit: '$', position: 'prefix', label: '$ USD' },
  { unit: '₹', position: 'prefix', label: '₹ INR' },
  { unit: '€', position: 'prefix', label: '€ EUR' },
  { unit: '£', position: 'prefix', label: '£ GBP' },
  { unit: '¥', position: 'prefix', label: '¥ JPY/CNY' },
  { unit: 'books', position: 'suffix', label: 'books (count)' },
  { unit: 'km', position: 'suffix', label: 'km (distance)' },
  { unit: 'kg', position: 'suffix', label: 'kg (weight)' },
  { unit: 'hr', position: 'suffix', label: 'hr (hours)' },
];

function TrackersView({
  trackers,
  onAdd,
  onUpdate,
  onDelete,
  onAddContribution,
  onDeleteContribution,
  onTogglePause,
  confirm,
}: {
  trackers: SavingsTracker[];
  onAdd: (t: Omit<SavingsTracker, 'id' | 'createdAt' | 'contributions'> & { startingAmount?: number }) => void;
  onUpdate: (id: string, patch: Partial<SavingsTracker>) => void;
  onDelete: (id: string) => void;
  onAddContribution: (trackerId: string, c: { date?: string; amount: number; note?: string }) => void;
  onDeleteContribution: (trackerId: string, contributionId: string) => void;
  onTogglePause: (id: string) => void;
  confirm: ConfirmFn;
}) {
  const askDeleteTracker = async (t: SavingsTracker) => {
    const ok = await confirm({
      title: 'Delete this savings tracker?',
      subject: t.name,
      message:
        t.contributions.length > 0
          ? `${t.contributions.length} contribution${t.contributions.length === 1 ? '' : 's'} will be lost. The goal will also be removed.`
          : 'No contributions yet — safe to remove.',
      confirmLabel: 'Delete tracker',
      cancelLabel: 'Keep it',
      tone: 'danger',
    });
    if (ok) onDelete(t.id);
  };
  const handleDeleteTrackerById = (id: string) => {
    const t = trackers.find((x) => x.id === id);
    if (t) askDeleteTracker(t);
  };
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Scope | 'all'>('all');

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(TRACKER_EMOJIS[0]);
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState<{ unit: string; position: 'prefix' | 'suffix' }>({ unit: '$', position: 'prefix' });
  const [monthlyTarget, setMonthlyTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [scope, setScope] = useState<Scope>('personal');
  const [category, setCategory] = useState<Category>('personal');
  const [startingAmount, setStartingAmount] = useState('');

  const submit = () => {
    const v = name.trim();
    const tgt = parseFloat(target);
    if (!v) {
      toast.error('Give your tracker a name');
      return;
    }
    if (!Number.isFinite(tgt) || tgt <= 0) {
      toast.error('Set a target greater than 0');
      return;
    }
    const mt = parseFloat(monthlyTarget);
    const sa = parseFloat(startingAmount);
    onAdd({
      name: v,
      emoji,
      target: tgt,
      unit: unit.unit,
      unitPosition: unit.position,
      monthlyTarget: Number.isFinite(mt) && mt > 0 ? mt : undefined,
      deadline: deadline || undefined,
      scope,
      category,
      startingAmount: Number.isFinite(sa) && sa > 0 ? sa : undefined,
    });
    setName('');
    setTarget('');
    setMonthlyTarget('');
    setDeadline('');
    setStartingAmount('');
    setOpen(false);
    toast.success('Tracker created — start logging contributions!');
  };

  const filtered = trackers.filter((t) => filter === 'all' || t.scope === filter);
  const personal = trackers.filter((t) => t.scope === 'personal');
  const professional = trackers.filter((t) => t.scope === 'professional');

  // Aggregate totals
  const totalCurrent = trackers.reduce((s, t) => s + trackerCurrent(t), 0);
  const totalTarget = trackers.reduce((s, t) => s + t.target, 0);
  const aggregatePct = totalTarget === 0 ? 0 : Math.round((totalCurrent / totalTarget) * 100);
  const completed = trackers.filter((t) => trackerProgress(t) >= 100).length;

  return (
    <div className="space-y-4">
      {/* Scope tabs + summary */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50/60 p-3 shadow-sm">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <ScopeTab
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            icon={<Wallet className="h-4 w-4" />}
            label="All trackers"
            count={trackers.length}
            personal={personal.length}
            professional={professional.length}
          />
          <ScopeTab
            active={filter === 'personal'}
            onClick={() => setFilter('personal')}
            icon={<Heart className="h-4 w-4" />}
            label="Personal"
            count={personal.length}
            accent="rose"
          />
          <ScopeTab
            active={filter === 'professional'}
            onClick={() => setFilter('professional')}
            icon={<Briefcase className="h-4 w-4" />}
            label="Professional"
            count={professional.length}
            accent="sky"
          />
        </div>
      </div>

      {/* Header row: aggregate stats + new button */}
      {trackers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-zinc-600">
            <span>
              <strong className="text-zinc-900 tabular-nums">{aggregatePct}%</strong> across all
            </span>
            <span className="text-zinc-300">·</span>
            <span>
              <strong className="text-zinc-900 tabular-nums">{completed}</strong> /{trackers.length} complete
            </span>
            <span className="text-zinc-300">·</span>
            <span>
              <strong className="text-zinc-900">{trackers.reduce((s, t) => s + t.contributions.length, 0)}</strong>{' '}
              total contributions
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {open ? 'Cancel' : 'New tracker'}
          </button>
        </div>
      )}

      {/* Add tracker form */}
      {(open || trackers.length === 0) && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white p-4 shadow-sm">
          {trackers.length === 0 && !open && (
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-[14.5px] font-bold text-zinc-900">Create your first tracker 🎯</div>
                <div className="mt-0.5 text-[12px] text-zinc-500">
                  Pick a goal you can measure — like "Save $800 for an iPad by Sep 2026".
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Get started
              </button>
            </div>
          )}

          {(open || trackers.length === 0) && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Name</Label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. iPad Pro M5, Emergency fund, 12 books in 2026…"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Icon</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {TRACKER_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`grid h-8 w-8 place-items-center rounded-md text-lg transition-all ${
                        emoji === e ? 'bg-emerald-100 ring-2 ring-emerald-400' : 'bg-white hover:bg-zinc-100'
                      }`}
                      aria-label={`Choose icon ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Target</Label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="800"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm tabular-nums focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <Label>Unit</Label>
                <select
                  value={`${unit.unit}|${unit.position}`}
                  onChange={(e) => {
                    const [u, p] = e.target.value.split('|');
                    setUnit({ unit: u, position: p as 'prefix' | 'suffix' });
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {CURRENCY_UNITS.map((u) => (
                    <option key={u.unit + u.position} value={`${u.unit}|${u.position}`}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Monthly target (optional)</Label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(e.target.value)}
                  placeholder="80"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm tabular-nums focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <Label>Deadline (optional)</Label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <Label>Scope</Label>
                <div className="mt-1 inline-flex w-full rounded-lg bg-zinc-100 p-0.5 text-[12.5px]">
                  {(['personal', 'professional'] as const).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setScope(sc)}
                      className={`flex-1 rounded-md px-2 py-1.5 font-semibold capitalize transition-colors ${
                        scope === sc ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-600'
                      }`}
                    >
                      {sc === 'personal' ? '❤️ Personal' : '💼 Professional'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {Object.entries(CATEGORY_META).map(([v, m]) => (
                    <option key={v} value={v}>
                      {m.emoji} {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <Label>Starting amount (optional)</Label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={startingAmount}
                  onChange={(e) => setStartingAmount(e.target.value)}
                  placeholder="Add what you've already saved/done so far"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm tabular-nums focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-end gap-2">
            {open && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <PiggyBank className="h-4 w-4" />
              Create tracker
            </button>
          </div>
        </div>
      )}

      {/* Trackers list */}
      {trackers.length > 0 && filtered.length === 0 && (
        <EmptyHint text={`No ${filter} trackers yet.`} />
      )}

      {filtered.length > 0 && (
        <>
          {filter === 'all' ? (
            <div className="space-y-5">
              {personal.length > 0 && (
                <ScopeSection icon={<Heart className="h-4 w-4" />} label="Personal" count={personal.length} accent="rose">
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {personal.map((t) => (
                      <TrackerCard
                        key={t.id}
                        tracker={t}
                        onUpdate={onUpdate}
                        onDelete={handleDeleteTrackerById}
                        onAddContribution={onAddContribution}
                        onDeleteContribution={onDeleteContribution}
                        onTogglePause={onTogglePause}
                      />
                    ))}
                  </div>
                </ScopeSection>
              )}
              {professional.length > 0 && (
                <ScopeSection
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Professional"
                  count={professional.length}
                  accent="sky"
                >
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {professional.map((t) => (
                      <TrackerCard
                        key={t.id}
                        tracker={t}
                        onUpdate={onUpdate}
                        onDelete={handleDeleteTrackerById}
                        onAddContribution={onAddContribution}
                        onDeleteContribution={onDeleteContribution}
                        onTogglePause={onTogglePause}
                      />
                    ))}
                  </div>
                </ScopeSection>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {filtered.map((t) => (
                <TrackerCard
                  key={t.id}
                  tracker={t}
                  onUpdate={onUpdate}
                  onDelete={handleDeleteTrackerById}
                  onAddContribution={onAddContribution}
                  onDeleteContribution={onDeleteContribution}
                  onTogglePause={onTogglePause}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TrackerCard({
  tracker,
  onUpdate,
  onDelete,
  onAddContribution,
  onDeleteContribution,
  onTogglePause,
}: {
  tracker: SavingsTracker;
  onUpdate: (id: string, patch: Partial<SavingsTracker>) => void;
  onDelete: (id: string) => void;
  onAddContribution: (trackerId: string, c: { date?: string; amount: number; note?: string }) => void;
  onDeleteContribution: (trackerId: string, contributionId: string) => void;
  onTogglePause: (id: string) => void;
}) {
  const current = trackerCurrent(tracker);
  const remaining = trackerRemaining(tracker);
  const pct = trackerProgress(tracker);
  const monthlyAvg = trackerMonthlyAvg(tracker);
  const eta = trackerEtaMonths(tracker);
  const isDone = pct >= 100;

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const daysLeft = tracker.deadline
    ? Math.ceil((new Date(tracker.deadline + 'T00:00:00').getTime() - Date.now()) / 86400000)
    : null;

  // On-track check: if we have monthly target + deadline, are we on track?
  const monthsToDeadline = daysLeft !== null ? Math.ceil(daysLeft / 30) : null;
  const onTrack =
    monthsToDeadline !== null && tracker.monthlyTarget
      ? remaining <= tracker.monthlyTarget * monthsToDeadline
      : null;

  const logContribution = () => {
    const v = parseFloat(amount);
    if (!Number.isFinite(v) || v === 0) {
      toast.error('Enter an amount');
      return;
    }
    onAddContribution(tracker.id, { amount: v, note: note.trim() || undefined });
    setAmount('');
    setNote('');
    toast.success(v > 0 ? `+${formatTrackerValue(v, tracker)} logged` : `${formatTrackerValue(v, tracker)} logged`);
  };

  const sortedContributions = [...tracker.contributions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className={`h-1 w-full bg-gradient-to-r ${
        isDone ? 'from-emerald-500 to-emerald-400' : tracker.scope === 'professional' ? 'from-sky-500 to-cyan-400' : 'from-rose-500 to-pink-400'
      }`} />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-zinc-100 bg-gradient-to-br from-white to-zinc-50 text-xl shadow-sm">
              {tracker.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10.5px] font-semibold ${
                  tracker.scope === 'professional'
                    ? 'border-sky-200 bg-sky-50 text-sky-700'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}>
                  {tracker.scope === 'professional' ? <Briefcase className="h-2.5 w-2.5" /> : <Heart className="h-2.5 w-2.5" />}
                  {tracker.scope === 'professional' ? 'Professional' : 'Personal'}
                </span>
                <span className={`inline-flex h-5 items-center rounded-full border px-2 text-[10.5px] font-medium ${CATEGORY_META[tracker.category].chip}`}>
                  {CATEGORY_META[tracker.category].emoji} {CATEGORY_META[tracker.category].label}
                </span>
                {isDone && (
                  <span className="inline-flex h-5 items-center gap-1 rounded-full bg-emerald-500 px-2 text-[10.5px] font-bold text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    Achieved
                  </span>
                )}
                {tracker.paused && (
                  <span className="inline-flex h-5 items-center gap-1 rounded-full border border-zinc-300 bg-zinc-100 px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    ⏸ Paused
                  </span>
                )}
                {/* On-pace insight chip — only when monthly target + deadline + not done/paused */}
                {!isDone && !tracker.paused && onTrack !== null && (
                  <span
                    className={`inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10px] font-bold uppercase tracking-wider ${
                      onTrack
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    }`}
                    title={onTrack ? 'You are on pace to hit your target by the deadline' : 'Behind pace — consider increasing your monthly contributions'}
                  >
                    {onTrack ? 'On pace' : 'Behind'}
                  </span>
                )}
              </div>
              <h3 className={`mt-1.5 truncate text-[15.5px] font-bold ${tracker.paused ? 'text-zinc-500' : 'text-zinc-900'}`}>{tracker.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onTogglePause(tracker.id)}
              aria-label={tracker.paused ? 'Resume tracker' : 'Pause tracker'}
              title={tracker.paused ? 'Resume contributions' : 'Pause — keep history but stop counting in active'}
              className={`rounded-md p-1.5 transition-colors ${
                tracker.paused
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
              }`}
            >
              {tracker.paused ? <Zap className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => onDelete(tracker.id)}
              aria-label="Delete tracker"
              title="Delete tracker"
              className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Big number + progress */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[24px] font-bold tabular-nums leading-none text-zinc-900">
                {formatTrackerValue(current, tracker)}
              </div>
              <div className="mt-1 text-[11.5px] text-zinc-500">
                of <span className="font-semibold tabular-nums text-zinc-700">{formatTrackerValue(tracker.target, tracker)}</span>
                {!isDone && (
                  <> · {formatTrackerValue(remaining, tracker)} to go</>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[20px] font-bold tabular-nums leading-none ${isDone ? 'text-emerald-700' : 'text-zinc-900'}`}>
                {pct}%
              </div>
              {monthlyAvg > 0 && (
                <div className="mt-1 text-[10.5px] text-zinc-500">
                  ≈ {formatTrackerValue(monthlyAvg, tracker)}/mo recent
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`h-full rounded-full transition-all ${
                isDone
                  ? 'bg-emerald-500'
                  : tracker.scope === 'professional'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Footer signals */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-zinc-500">
            {tracker.monthlyTarget && (
              <span className="inline-flex items-center gap-1">
                <Target className="h-3 w-3" />
                Plan {formatTrackerValue(tracker.monthlyTarget, tracker)}/mo
              </span>
            )}
            {eta !== null && !isDone && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ETA {eta === 0 ? 'this month' : `${eta} mo`}
              </span>
            )}
            {tracker.deadline && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(tracker.deadline + 'T00:00:00').toLocaleDateString()}
                {daysLeft !== null && (
                  <span
                    className={
                      daysLeft < 0
                        ? 'font-semibold text-rose-600'
                        : daysLeft < 30
                        ? 'font-semibold text-amber-600'
                        : ''
                    }
                  >
                    {' '}
                    ({daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d`})
                  </span>
                )}
              </span>
            )}
            {onTrack !== null && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-bold ${
                  onTrack ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {onTrack ? '✓ On track' : '⚠ Behind plan'}
              </span>
            )}
          </div>
        </div>

        {/* Contribution form */}
        {!isDone && !tracker.paused && (
          <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5">
            {/* Quick-add preset chips — pick smart defaults based on unit + target */}
            <QuickContributionPresets
              tracker={tracker}
              onPick={(v) => {
                onAddContribution(tracker.id, { amount: v });
                toast.success(`+${formatTrackerValue(v, tracker)} logged`);
              }}
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[12.5px]">
                <span className="text-zinc-400">{tracker.unitPosition === 'prefix' ? tracker.unit : ''}</span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && logContribution()}
                  placeholder="Amount"
                  className="w-24 bg-transparent tabular-nums focus:outline-none"
                  aria-label="Contribution amount"
                />
                <span className="text-zinc-400">{tracker.unitPosition === 'suffix' ? tracker.unit : ''}</span>
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && logContribution()}
                placeholder="Note (optional)"
                className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[12.5px] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="button"
                onClick={logContribution}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-emerald-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Log
              </button>
              {tracker.monthlyTarget && (
                <button
                  type="button"
                  onClick={() => {
                    onAddContribution(tracker.id, { amount: tracker.monthlyTarget!, note: 'Monthly contribution' });
                    toast.success(`+${formatTrackerValue(tracker.monthlyTarget!, tracker)} logged`);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-2 py-1 text-[11.5px] font-semibold text-emerald-700 hover:bg-emerald-50"
                  title="Log your planned monthly contribution"
                >
                  +{formatTrackerValue(tracker.monthlyTarget, tracker)} (monthly)
                </button>
              )}
            </div>
          </div>
        )}

        {/* History toggle + list */}
        {tracker.contributions.length > 0 && (
          <div className="mt-3 border-t border-zinc-100 pt-2.5">
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              className="flex w-full items-center justify-between gap-2 text-left text-[11.5px] font-semibold text-zinc-600 hover:text-zinc-900"
            >
              <span>
                {tracker.contributions.length} contribution{tracker.contributions.length === 1 ? '' : 's'}
              </span>
              <span className={`text-[10px] text-zinc-400 transition-transform ${showHistory ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showHistory && (
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto pr-1">
                {sortedContributions.map((c) => (
                  <li
                    key={c.id}
                    className="group flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] transition-colors hover:bg-zinc-50"
                  >
                    <span className="w-20 shrink-0 text-[10.5px] text-zinc-400">
                      {new Date(c.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`tabular-nums font-bold ${c.amount > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {c.amount > 0 ? '+' : ''}
                      {formatTrackerValue(c.amount, tracker)}
                    </span>
                    {c.note && <span className="min-w-0 flex-1 truncate text-zinc-500">— {c.note}</span>}
                    <button
                      type="button"
                      onClick={() => onDeleteContribution(tracker.id, c.id)}
                      aria-label="Delete contribution"
                      className="rounded p-0.5 text-zinc-300 opacity-0 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Smart quick-add preset chips for a tracker.
 * Picks 4 sensible default amounts based on the tracker's unit + target size.
 * Falls back to monthlyTarget if set.
 */
function QuickContributionPresets({
  tracker,
  onPick,
}: {
  tracker: SavingsTracker;
  onPick: (amount: number) => void;
}) {
  // Pick 4 presets that scale to the target. For currency targets we use {1%, 5%, 10%, monthly|25%}
  const target = tracker.target || 100;
  const monthly = tracker.monthlyTarget;
  const presetCandidates: number[] = [];
  // Always include 1% and 5% of target (rounded)
  const round = (n: number) => {
    if (n >= 1000) return Math.round(n / 100) * 100;
    if (n >= 100) return Math.round(n / 10) * 10;
    if (n >= 10) return Math.round(n);
    return Math.round(n * 10) / 10;
  };
  presetCandidates.push(round(target * 0.01));
  presetCandidates.push(round(target * 0.05));
  presetCandidates.push(round(target * 0.1));
  if (monthly && monthly > 0) presetCandidates.push(monthly);
  else presetCandidates.push(round(target * 0.25));

  // Deduplicate + sort ascending, drop zero
  const presets = Array.from(new Set(presetCandidates.filter((n) => n > 0))).sort((a, b) => a - b).slice(0, 4);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
        Quick add
      </span>
      {presets.map((amount) => (
        <button
          key={amount}
          type="button"
          onClick={() => onPick(amount)}
          className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[11.5px] font-bold text-emerald-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md"
        >
          +{formatTrackerValue(amount, tracker)}
        </button>
      ))}
      {tracker.monthlyTarget && !presets.includes(tracker.monthlyTarget) && (
        <button
          type="button"
          onClick={() => onPick(tracker.monthlyTarget!)}
          className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11.5px] font-bold text-emerald-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-md"
          title="Log your planned monthly contribution"
        >
          +{formatTrackerValue(tracker.monthlyTarget, tracker)} (monthly)
        </button>
      )}
    </div>
  );
}
