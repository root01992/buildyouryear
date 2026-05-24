# BuildYourYear

🌐 **Live site:** [www.buildyouryear.com](https://www.buildyouryear.com/)
📖 **Blog:** [buildyouryear.com/blog](https://www.buildyouryear.com/blog)
🚀 **Start free:** [Sign up — no credit card](https://www.buildyouryear.com/signup)

[![Open BuildYourYear](https://img.shields.io/badge/Open-buildyouryear.com-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://www.buildyouryear.com/)
[![Read the Blog](https://img.shields.io/badge/Read-The_Blog-0ea5e9?style=for-the-badge)](https://www.buildyouryear.com/blog)
[![Made with Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

---

**Plan your day. Build your year.** 365 small days. One transformed year.

[BuildYourYear](https://www.buildyouryear.com/) is a free habit tracker, daily to-do list, goal manager, and savings tracker — with a clean animated dashboard, a 12-week consistency heatmap, and a year-end recap that compounds. Backed by a MongoDB-stored account with bcrypt-hashed passwords and HttpOnly session cookies.

> 🌱 Build daily habits · 🎯 Ship goals · 💰 Save for what you want · 📈 Watch your year compound

### Featured reading

- 📖 [How to Build a Habit That Sticks](https://www.buildyouryear.com/blog/how-to-build-habits-that-stick) — the 365-day method
- ⚡ [The 12-Week Year Explained](https://www.buildyouryear.com/blog/12-week-year-explained) — Brian Moran's method
- 🔥 [Habit Tracking 101: Streaks & Heatmaps](https://www.buildyouryear.com/blog/habit-tracking-streaks-heatmaps)
- 🎯 [Goal Setting Frameworks Compared](https://www.buildyouryear.com/blog/goal-setting-frameworks-compared) — SMART vs OKRs vs 12-Week Year vs BHAG
- 📈 [The Compound Effect: 1% Daily Improvement](https://www.buildyouryear.com/blog/compound-effect-1-percent-better)
- 🎯 [Why You Quit Your Resolutions](https://www.buildyouryear.com/blog/why-new-year-resolutions-fail) — and how to finally finish them

## What's inside

- **Auth** — signup / login / logout with bcrypt + JWT in HttpOnly Secure cookies (`jose`)
- **Storage** — MongoDB Atlas (one `users` collection, data embedded per user)
- **Frontend** — Next.js 14 App Router · React 18 · Tailwind · Recharts
- **Sync** — every change is auto-saved within 600 ms; a `Saving…` / `Saved` indicator appears in the toolbar; `navigator.sendBeacon` flushes a final save when the tab closes

## Setup (one time)

### 1. Get a MongoDB Atlas cluster
- Sign in at https://cloud.mongodb.com
- Create a free M0 cluster (any region)
- **Database Access** → Add a new user with a **strong** password and `Read and write to any database` privileges
- **Network Access** → Allow your current IP (or `0.0.0.0/0` for dev only)
- **Connect** → **Drivers** → copy the connection string

### 2. Configure environment variables
Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

Then set the two required values:

```env
MONGODB_URI="mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dailytracker?retryWrites=true&w=majority"
AUTH_SECRET="<generate one>"
```

Generate a secret:

```bash
openssl rand -base64 48
```

### 3. Install & run

```bash
npm install
npm run dev        # HTTPS on https://localhost:3001 (mkcert cert auto-generated)
# or
npm run dev:http   # plain HTTP fallback
```

Open https://localhost:3001 and sign up.

## API surface

| Route | Verb | Description |
|---|---|---|
| `/api/auth/signup` | POST | `{ email, displayName, password }` → creates user, sets cookie |
| `/api/auth/login` | POST | `{ email, password }` → sets cookie |
| `/api/auth/logout` | POST | Clears cookie |
| `/api/auth/me` | GET | `{ user }` or 401 |
| `/api/data` | GET | `{ data: { todos, habits, goals, trackers } }` |
| `/api/data` | PUT | `{ data: ... }` — replaces the entire store for the signed-in user |

All routes use `runtime = 'nodejs'` (bcrypt is not Edge-compatible).

## Data model

Single collection: `users`

```ts
{
  _id: ObjectId,
  email: string,         // lowercased, unique index
  displayName: string,
  passwordHash: string,  // bcrypt cost 12
  data: {
    todos: Todo[],
    habits: Habit[],
    goals: Goal[],
    trackers: SavingsTracker[]
  },
  createdAt: Date,
  updatedAt: Date
}
```

The `data` field is replaced wholesale on each `PUT /api/data`. Server-side `sanitizeStore()` enforces sane upper bounds (5000 todos, 200 habits/goals/trackers) and rejects payloads > 256 KB.

## Security notes

- Passwords: bcrypt with cost 12, server-side only
- Sessions: HS256 JWT in an HttpOnly + Secure + SameSite=Lax cookie, 30-day expiry
- CSRF: Lax cookies + same-origin fetch defaults give baseline protection. Add a CSRF token for mutating routes if you exposing them cross-origin.
- HTTPS: dev server uses mkcert-signed certs (`npm run dev`); deploy behind HTTPS in production.

## Roadmap

- [ ] Email-based password reset
- [ ] Two-factor (TOTP)
- [ ] Rate-limiting on login (Redis + sliding window)
- [ ] Service worker for true offline-first
- [ ] Delete-account endpoint
