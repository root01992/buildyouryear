/**
 * Lightweight GA4 event helper.
 *
 * Design goals:
 *   1. SAFE — silently no-ops if window.gtag isn't ready (e.g. SSR, dev,
 *      ad-blocker, before script loads). Never throws.
 *   2. TYPED — preset event names + parameter shapes so analytics stays
 *      analyzable instead of devolving into a string-soup of one-off events.
 *   3. CHEAP — single import; no provider/context overhead.
 *
 * Usage:
 *   import { track, ev } from '@/lib/analytics';
 *
 *   // Raw, when you need a custom event
 *   track('search', { query, results: count });
 *
 *   // Preset (preferred where one exists)
 *   ev.ctaClick({ location: 'hero', label: 'start_day_1', destination: '/signup' });
 *   ev.taskAdd({ priority: 'high', category: 'work' });
 *
 * Event naming convention (matches GA4 best practices):
 *   - snake_case
 *   - present tense ("login", not "logged_in")
 *   - parameters are <= 25 per event, snake_case keys
 *   - reuse `cta_*`, `nav_*`, `task_*`, `habit_*`, `goal_*`, `tracker_*` prefixes
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type ScalarParam = string | number | boolean | undefined | null;
export type EventParams = Record<string, ScalarParam>;

/** Fire a GA4 event. Silently no-ops if gtag isn't available. */
export function track(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  try {
    // Strip undefined/null so GA doesn't store empty params
    const clean: Record<string, string | number | boolean> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null) continue;
        clean[k] = v;
      }
    }
    window.gtag('event', eventName, clean);
  } catch {
    /* never throw from analytics */
  }
}

/**
 * Preset event functions. Adding new events here keeps the event vocabulary
 * discoverable across the codebase and avoids string typos. If you're tempted
 * to call `track('foo_bar', ...)` directly more than once, add a preset.
 */
export const ev = {
  // ── Landing / marketing ─────────────────────────────────────────────
  ctaClick: (p: { location: string; label: string; destination?: string }) =>
    track('cta_click', { cta_location: p.location, cta_label: p.label, cta_destination: p.destination }),

  navClick: (p: { location: string; label: string; destination?: string }) =>
    track('nav_click', { nav_location: p.location, nav_label: p.label, nav_destination: p.destination }),

  faqToggle: (p: { question: string; opened: boolean }) =>
    track('faq_toggle', { question: p.question, opened: p.opened }),

  // ── Auth ──────────────────────────────────────────────────────────────
  signupSubmit: () => track('signup_submit'),
  signup: (p: { method?: string } = {}) => track('sign_up', { method: p.method ?? 'email' }),
  loginSubmit: () => track('login_submit'),
  login: (p: { method?: string } = {}) => track('login', { method: p.method ?? 'email' }),
  logout: () => track('logout'),
  authError: (p: { action: 'login' | 'signup'; message?: string }) =>
    track('auth_error', { auth_action: p.action, error_message: p.message }),
  passwordVisibilityToggle: (p: { visible: boolean }) =>
    track('auth_password_toggle', { visible: p.visible }),
  authModeSwitch: (p: { to: 'login' | 'signup' }) => track('auth_mode_switch', { to: p.to }),

  // ── App dashboard navigation ─────────────────────────────────────────
  tabSwitch: (p: { from: string; to: string }) => track('tab_switch', { from: p.from, to: p.to }),
  dashboardAction: (p: { action: 'import' | 'export' | 'load_demo' | 'load_plan' }) =>
    track('dashboard_action', { action: p.action }),

  // ── Todos ────────────────────────────────────────────────────────────
  taskAdd: (p: { priority?: string; category?: string }) => track('task_add', p),
  taskQuickAddPreset: (p: { preset: string }) => track('task_quick_add_preset', { preset: p.preset }),
  taskCheck: (p: { to_state: 'done' | 'open' }) => track('task_check', { to_state: p.to_state }),
  taskSkip: (p: { to_state: 'skipped' | 'unskipped' }) => track('task_skip', { to_state: p.to_state }),
  taskReschedule: (p: { quick_option?: string }) => track('task_reschedule', { quick_option: p.quick_option }),
  taskDelete: () => track('task_delete'),
  taskRollover: (p: { count: number }) => track('task_rollover', { count: p.count }),
  taskFilterChange: (p: { to: string }) => track('task_filter_change', { to: p.to }),

  // ── Habits ───────────────────────────────────────────────────────────
  habitAdd: () => track('habit_add'),
  habitCheckIn: (p: { to_state: 'done' | 'open' }) => track('habit_check_in', { to_state: p.to_state }),
  habitPauseToggle: (p: { to_state: 'paused' | 'active' }) =>
    track('habit_pause_toggle', { to_state: p.to_state }),
  habitDelete: () => track('habit_delete'),
  habitStreakMilestone: (p: { days: number }) => track('habit_streak_milestone', { days: p.days }),

  // ── Goals ────────────────────────────────────────────────────────────
  goalAdd: () => track('goal_add'),
  goalStatusChange: (p: { to_status: 'planning' | 'in_progress' | 'done' | 'cancelled' }) =>
    track('goal_status_change', { to_status: p.to_status }),
  goalMilestoneToggle: (p: { to_state: 'done' | 'open' }) =>
    track('goal_milestone_toggle', { to_state: p.to_state }),
  goalMilestoneAdd: () => track('goal_milestone_add'),
  goalDelete: () => track('goal_delete'),

  // ── Trackers (Save & Track) ──────────────────────────────────────────
  trackerAdd: () => track('tracker_add'),
  trackerContribution: (p: { amount: number; is_preset?: boolean; is_monthly?: boolean }) =>
    track('tracker_contribution', { amount: p.amount, is_preset: p.is_preset, is_monthly: p.is_monthly }),
  trackerPauseToggle: (p: { to_state: 'paused' | 'active' }) =>
    track('tracker_pause_toggle', { to_state: p.to_state }),
  trackerDelete: () => track('tracker_delete'),

  // ── User menu / account ──────────────────────────────────────────────
  userMenuOpen: () => track('user_menu_open'),
  passwordChange: () => track('password_change'),
  accountDelete: () => track('account_delete'),

  // ── Blog ─────────────────────────────────────────────────────────────
  blogPostOpen: (p: { slug: string; from?: string }) =>
    track('blog_post_open', { slug: p.slug, from: p.from }),
  blogInternalLink: (p: { from: string; to: string }) =>
    track('blog_internal_link', { from: p.from, to: p.to }),
  blogCtaClick: (p: { slug: string; label: string; destination?: string }) =>
    track('blog_cta_click', { slug: p.slug, label: p.label, destination: p.destination }),
} as const;
