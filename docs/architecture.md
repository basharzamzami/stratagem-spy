# Architecture

- Vite + React + TypeScript
- Router: React Router v6
- Styling: Tailwind + shadcn/ui
- Data: React Query + Supabase functions
- Charts: Recharts via ui/chart wrapper

## Principles
- Small, composable components
- Server calls via service layer (src/services)
- Edge functions per capability; adapters per provider
- Caching & timeouts on client; rate limits on server
