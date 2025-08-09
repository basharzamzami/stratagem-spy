# Ad Signal Hijack

A competitive intelligence module for real-time competitor ad tracking & decoding.

## URL
- /ad-signal-hijack

## Frontend
- React Router route wired in `src/App.tsx`
- Page: `src/pages/AdSignalHijack.tsx`
- Components: `src/components/ad-signal-hijack/*`
- Service layer: `src/services/adSignal.ts`

## Backend (Supabase Edge Functions)
- `supabase/functions/ad-signal-search` — fetches ads (Meta adapter for MVP)
- `supabase/functions/ad-signal-analytics` — aggregates angles/offers/formats/trends
- `supabase/functions/ad-signal-export` — CSV export (PDF TBD)
- Shared types/adapters: `supabase/functions/_shared/*`

## Database
- Migration: `supabase/migrations/2025-08-08_ad_signal_schema.sql`
- Tables: `competitors`, `ads`, `searches`, `exports`

## Setup
1) In Supabase (functions environment):
   - Set `META_ADS_ACCESS_TOKEN`
   - Deploy functions:
     - `supabase functions deploy ad-signal-search`
     - `supabase functions deploy ad-signal-analytics`
     - `supabase functions deploy ad-signal-export`
   - Apply migration: run the SQL in the migration file against your DB

2) In Lovable:
   - Ensure branch is `main`
   - Rebuild/redeploy

3) Locally:
   - `npm install`
   - `npm run dev`
   - Visit `/ad-signal-hijack`

## Usage
- Set filters in the sticky bar and click `Apply` to load feed
- Infinite scroll will load more pages as you scroll
- Analytics cards show angles, offer types, formats, and trend counts
- Export CSV from the Export & Reporting card

## Notes
- Without `META_ADS_ACCESS_TOKEN`, functions return empty/stub data quickly
- Timeouts added to prevent hanging requests
- Adapter pattern allows adding Google/YouTube/TikTok providers later
