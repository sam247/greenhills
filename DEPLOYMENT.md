# Deploying to Vercel

## Environment variables

Set these in the Vercel project (**Settings → Environment Variables**), for Production and Preview as needed:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Settings → API → Project URL). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (Settings → API → Project API keys → `anon` `public`). |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, e.g. `https://your-domain.vercel.app` or your custom domain. Used for auth email links and password reset redirects. |

Copy `.env.local.example` to `.env.local` for local development and fill in the same values.

## Supabase Auth URLs

In the Supabase dashboard (**Authentication → URL configuration**):

- Add your Vercel URL (and production custom domain) to **Redirect URLs**.
- Set **Site URL** to your production URL (or the primary URL users should land on after email confirmation).

Email confirmation and password reset links use `NEXT_PUBLIC_SITE_URL` (or the browser origin locally) from [`src/lib/site-url.ts`](src/lib/site-url.ts) and [`src/hooks/useAuth.tsx`](src/hooks/useAuth.tsx).

## Security

Do not commit real keys. If keys were ever exposed in a public repo, rotate the anon key in Supabase and update Vercel env vars.
