# Greenhills — agent and contributor guide

This document describes how the site is structured, how the backend fits in, and how to add or extend programmatic (SEO) pages. Use it when onboarding tools or humans who will change the codebase.

## Stack

- **Framework:** Next.js 15 (App Router), React 18, TypeScript.
- **Styling:** Tailwind CSS, shadcn/ui (Radix), Framer Motion where motion is used.
- **Backend:** [Supabase](https://supabase.com/) — Postgres, Auth (email/password and flows used by `/login`, `/portal`), and Row Level Security on tables. The app uses `@supabase/ssr` with cookie-based sessions (`middleware.ts` → `src/lib/supabase/middleware.ts`).
- **Deployment:** Typically Vercel; environment variables are documented in [DEPLOYMENT.md](DEPLOYMENT.md).

## Repository layout (high level)

| Area | Location |
|------|----------|
| App routes | `src/app/` |
| Shared UI | `src/components/` (e.g. `layout/`, `home/`, `pages/`, `portal/`, `seo/`) |
| Data for SEO slugs | `src/data/servicePages.ts` |
| Shorter service list (nav, filters) | `src/data/services.ts` |
| Supabase clients & generated types | `src/lib/supabase/` |
| Auth helpers / hooks | `src/hooks/useAuth.tsx`, `src/components/ProtectedRoute.tsx` |

## Public marketing site

- **Home and sections:** `src/components/pages/Index.tsx` composes hero, trust, services, reviews, CTA, etc.
- **Static-ish pages:** `about`, `commercial`, `domestic`, `contact`, `gallery`, `testimonials`, `privacy`, etc. under `src/app/<route>/`.
- **Metadata:** Root defaults live in `src/app/layout.tsx` (title template, description, Open Graph / Twitter using `https://greenhillselectric.co.uk` and `/logo.png` for share images).

## Backend (Supabase)

### Environment

Required public variables (see `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` — used for auth email links and password reset redirects.

### Session refresh

`middleware.ts` runs `updateSession` on most requests so Supabase auth cookies stay in sync. Static assets are excluded via the `matcher` regex.

### Typed schema

`src/lib/supabase/database.types.ts` is the generated (or maintained) TypeScript view of the database. When the schema changes, regenerate or update this file so `createClient<Database>()` stays accurate.

### Tables (overview)

The portal and service pages integrate with tables such as:

- **`profiles`**, **`user_roles`** — user profile and role (e.g. admin vs customer) for `/portal`.
- **`projects`**, **`documents`**, **`invoices`**, **`messages`** — job/customer workflow in the portal.
- **`job_uploads`** — gallery and “recent work” on service pages; includes `service_slug` and `image_urls` (queried in `ServicePageTemplate.tsx`).
- **`accounting_connections`** — optional accounting integration in admin UI.

Row policies and auth are enforced in Supabase; the Next app only uses the **anon** key in the browser and server helpers — never commit service role keys.

### Where Supabase is used

- **Browser:** `getSupabaseBrowserClient()` from `src/lib/supabase/client.ts` (portal UI, gallery, service page “recent work”).
- **Server:** `src/lib/supabase/server.ts` for server components or route handlers when needed.
- **Middleware:** `src/lib/supabase/middleware.ts` for session refresh.

## Programmatic page expansion (SEO services & industries)

### Single source of truth

All URLs under `/services/[slug]` and `/industries/[slug]` are driven by one array: **`src/data/servicePages.ts`**.

Each entry is a **`ServicePageData`** object with fields such as:

- `slug` — URL segment (must be unique).
- `category` — `"service"` or `"industry"` (controls breadcrumb label: “Services” vs “Industries” in `ServicePageTemplate`).
- `title`, `subtitle`, `intro`, `includes`, `audience`, `localParagraph`
- `relatedLinks` — internal links to other slugs
- Optional: `trustPoints`, `faq`, `ctaText`, `ctaSubtext`, `location`

### Routes

Two dynamic routes render the **same** component tree for a given slug:

| Route | File | Notes |
|-------|------|--------|
| `/services/[slug]` | `src/app/services/[slug]/page.tsx` | `generateStaticParams()` emits all `servicePages` slugs. |
| `/industries/[slug]` | `src/app/industries/[slug]/page.tsx` | Same `generateStaticParams()`; same `ServiceSlugRoute`. |

`src/components/pages/ServiceSlugRoute.tsx` looks up the slug in `servicePages` and renders `ServicePageTemplate`, or `notFound()` if the slug is missing.

### How to add a new page

1. **Add one object** to the `servicePages` array in `src/data/servicePages.ts` with a new unique `slug` and filled-out copy.
2. Set **`category`** to `"service"` or `"industry"` depending on whether you want it positioned as a service or industry page in the template breadcrumb.
3. **Link to it** from navigation, footer, `relatedLinks` on sibling pages, or homepage sections as appropriate (`src/components/home/ServicesSection.tsx`, `Footer.tsx`, etc.).
4. **Build** — `generateStaticParams` will pick up the new slug automatically; no new route file is required.

### Optional: aligning with `services.ts`

`src/data/services.ts` lists shorter entries used for nav and gallery category mapping. When adding a major new line of business, consider whether a matching entry belongs there too for consistent filters and links.

## Conventions

- Prefer **existing patterns** (Layout wrapper, `ServicePageTemplate`, shadcn components) over one-off duplicates.
- **Images** for the static site live under `public/` and are referenced with root paths (e.g. `/logo.png`).
- After DB schema changes, update **`database.types.ts`** and any affected queries.
