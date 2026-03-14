# SkillSwap for Devs

SkillSwap is a two-sided marketplace connecting junior developers and indie founders to build MVPs using equity/revenue-share collaboration.

## Architecture Overview

### Frontend
- React + Vite + TypeScript
- TanStack Query for cached data orchestration
- Framer Motion transitions
- Tailwind design tokens and component primitives
- Command Palette (`CMD/CTRL + K`)
- Route-based code splitting

### Backend
- Supabase Postgres with RLS policies
- Supabase Auth (OAuth-ready)
- Realtime for messaging updates
- Edge Functions:
  - `send-email` (SendGrid)
  - `notify-event` (event notifications)
  - `job-worker` (async job execution)

### Scale/Performance Patterns
- Cached query abstraction in `src/services/cache/query-cache.ts`
- Infinite pagination + selective columns on feeds
- Composite and GIN indexes for search and high-volume access paths
- Event bus + job queue for decoupled write side-effects
- DB views/functions for AI scoring and trust scoring

## Product Features
- AI-based project recommendations (`projects_scored` view)
- Founder trust score + trust badge support
- Community layer (`/community`, `/discussions`, `/posts`)
- Collaboration Kanban milestones (`/collaboration`)
- Public developer portfolio URLs (`/portfolio/:username`)
- Referral/conversion infrastructure + feature gating tables
- Admin and analytics pages

## Database
Migrations:
- `202610010001_init.sql` (core schema)
- `202610010002_hardening.sql` (security hardening)
- `202610010003_scale_features.sql` (scale + growth + AI features)

## Local Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Supabase Local
```bash
supabase start
supabase db reset
supabase functions serve
```

## Deployment Guide (Vercel)
1. Import repository into Vercel.
2. Set environment variables.
3. Deploy frontend.
4. Deploy Supabase migrations/functions from CI.

## Contribution Guide
1. Create a feature branch.
2. Run quality checks:
   ```bash
   npm run lint
   npm run test
   npm run test:e2e
   ```
3. Ensure schema changes include migration + policy updates.
4. Submit PR with test evidence and rollout notes.


## Deployment Guide (Netlify)
1. Connect repository to Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify environment variables.
5. Deploy with SPA redirects from `netlify.toml`.
