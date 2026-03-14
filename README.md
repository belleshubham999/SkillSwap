# SkillSwap for Devs

Production-ready SaaS marketplace connecting junior developers with indie founders to build MVPs in exchange for equity, revenue share, and portfolio work.

## Stack
- Frontend: React + Vite + TypeScript + Tailwind + Framer Motion + React Router + RHF + Zod + TanStack Query + Headless UI + Radix
- Backend: Supabase (Postgres, Auth, RLS, Edge Functions, Realtime, Storage)
- Email: SendGrid via Supabase Edge Function
- Deployment: Vercel
- Analytics: Plausible

## Project Structure
```
src/
  app/
  components/
  features/
  hooks/
  lib/
  pages/
  services/
  types/
supabase/
  migrations/
  functions/
tests/
  unit/
  integration/
  e2e/
```

## Local setup
1. Install dependencies
```bash
npm install
```
2. Copy envs
```bash
cp .env.example .env
```
3. Start app
```bash
npm run dev
```

## Supabase setup
```bash
supabase start
supabase db reset
supabase functions serve
```

## Authentication
Enable OAuth providers in Supabase:
- Google
- GitHub

Set redirect URL to:
- `http://localhost:5173/dashboard`
- production domain `/dashboard`

## Features shipped
- Auth + protected routes + onboarding
- Developer/Founder profiles
- Project draft/publish/edit/close data model
- Discovery + filter + match score view
- Application workflows with duplicate prevention
- Match creation trigger and collaboration fields
- Review system
- In-app notifications + realtime + email edge function
- Realtime messaging
- Developer/founder/admin dashboards
- SEO (meta, OG, robots, sitemap)
- Performance (lazy routes, code splitting, skeletons)
- Security (RLS + schema checks + zod validation)
- Unit/integration/e2e tests
- Husky + ESLint + Prettier scripts

## Deployment (Vercel)
1. Import repository into Vercel.
2. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Deploy.

## Analytics
Plausible script loaded in `index.html`; replace `data-domain` with your production domain.
