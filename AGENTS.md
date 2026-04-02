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
| Location landing pages | `src/data/locationPages.ts` → `/locations/[slug]` |
| Canonical site URL (sitemap, metadata, JSON-LD) | `src/lib/seo-config.ts` (`SITE_URL`) |
| Shorter service list (nav, filters) | `src/data/services.ts` |
| Supabase clients & generated types | `src/lib/supabase/` |
| Auth helpers / hooks | `src/hooks/useAuth.tsx`, `src/components/ProtectedRoute.tsx` |

## Public marketing site

- **Home and sections:** `src/components/pages/Index.tsx` composes hero, trust, services, reviews, CTA, etc.
- **Static-ish pages:** `about`, `commercial`, `domestic`, `contact`, `gallery`, `testimonials`, `privacy`, etc. under `src/app/<route>/`.
- **Metadata:** Root defaults live in `src/app/layout.tsx` (title template, description, Open Graph / Twitter using `SITE_URL` and `/logo.png`). The homepage sets `metadata` in `src/app/page.tsx` with an **absolute** title so it can target Hertfordshire / Hemel Hempstead electrician queries without duplicating the template suffix.
- **Sitemap:** `src/app/sitemap.ts` — generated at **`/sitemap.xml`**. It includes static routes, every `servicePages` and `industries` URL, and every `locationPages` URL. Rebuild or redeploy to refresh URLs when data files change.
- **Robots:** `src/app/robots.ts` — serves **`/robots.txt`** and points crawlers at `${SITE_URL}/sitemap.xml`.

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

## Location landing pages (local SEO)

### Data

- **`src/data/locationPages.ts`** — array of **`LocationPageData`** (slug, town, title, metaDescription, keywords, copy blocks, related links).
- **`src/app/locations/[slug]/page.tsx`** — `generateStaticParams()` from `locationPages`; `generateMetadata()` sets canonical `${SITE_URL}/locations/{slug}`.
- **`src/components/seo/LocationPageTemplate.tsx`** — page layout, optional JSON-LD (`Electrician` + `areaServed`), CTA.

### Full-width page pattern (marketing pages)

Location pages follow the same layout convention as **`ServicePageTemplate`** and other marketing pages:

- Each **section** is **full viewport width** (backgrounds and borders span edge to edge).
- Inner content uses **`container`** only — **do not** wrap the whole page in `max-w-3xl` or similar; that narrows the entire layout and breaks alignment with the rest of the site.
- Use **`max-w-2xl`** (or similar) only on **individual** blocks where line length should be capped (e.g. hero intro line), not on the outer `container`.
- Alternate **section backgrounds** (`bg-muted/30`, `bg-primary/5`, borders) and use **grids** (`sm:grid-cols-2`, `md:grid-cols-3`) for lists and related links so content uses the full content width on large screens.

### Adding a town

1. Append a new object to **`locationPages`** with a unique `slug` and copy tailored to that town (natural use of “Hertfordshire electricians”, “{town} electricians”, etc.).
2. **Areas** section pills: in **`src/components/home/AreasSection.tsx`**, add `slug: "your-slug"` next to the town `name` so the pill links to `/locations/your-slug`.

## Conventions

- Prefer **existing patterns** (Layout wrapper, `ServicePageTemplate`, `LocationPageTemplate`, shadcn components) over one-off duplicates.
- **Marketing pages:** full-width sections + `container` inner; see *Full-width page pattern* under location pages above.
- **Images** for the static site live under `public/` and are referenced with root paths (e.g. `/logo.png`).
- After DB schema changes, update **`database.types.ts`** and any affected queries.
