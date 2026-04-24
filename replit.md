# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/db run check-drift` — verify the live database matches `lib/db/src/schema/*`
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Newsletter (The Worthy Horse News)

Email delivery uses Resend (Replit integration). The subscribe endpoint
sends a welcome email and stores a per-subscriber unsubscribe token.

- `POST /api/newsletter/subscribe` — public; sends welcome email
- `GET  /api/newsletter/unsubscribe?token=...` — public HTML page; idempotent
- `GET  /api/newsletter/admin/stats` — requires `Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN`
- `POST /api/newsletter/admin/dispatch` — same auth; body: `{subject, body, preheader?, testEmail?}`
  - With `testEmail`: sends only to that address
  - Without: broadcasts to all active (non-unsubscribed) subscribers

Admin UI: `/admin/newsletter` on the equine-wellness web app (password = `NEWSLETTER_ADMIN_TOKEN`).

Required env / connections:
- Resend connection (set up via Replit integrations) — must have a verified
  sending domain on Resend, or set `NEWSLETTER_FROM_EMAIL` to an address on
  a verified domain. Without verification, sends will fail with a clear error.
- `NEWSLETTER_ADMIN_TOKEN` (shared) — gates the admin endpoints / page.
- `PUBLIC_SITE_URL` (optional) — base URL used in unsubscribe links;
  defaults to `https://$REPLIT_DEV_DOMAIN`.

## SEO & Analytics (equine-wellness)

The equine-wellness web app reads three optional Vite-time env vars to wire
up Google Search Console verification and Google Analytics 4. All three are
read at build/dev time — set them in the artifact's environment, then restart
the workflow (or redeploy) for changes to take effect.

- `VITE_SITE_URL` — canonical site URL used in `/sitemap.xml` and
  `/robots.txt` (e.g. `https://equinebodywork.com`). Defaults to the same
  value if unset. This is the single config value to swap when the real
  production domain is confirmed.
- `VITE_GSC_VERIFICATION` — the token portion of Google Search Console's
  HTML-tag verification (the `content="..."` value). When set, a
  `<meta name="google-site-verification">` tag is injected into the served
  HTML. When unset, the tag is omitted entirely.
- `VITE_GA4_MEASUREMENT_ID` — your GA4 Measurement ID (e.g. `G-XXXXXXXXXX`).
  When set, the gtag script is loaded and a `page_view` event is sent on
  every client-side route change plus a `newsletter_signup` event on
  successful signup. When unset, no analytics scripts are loaded.

`/sitemap.xml` and `/robots.txt` are generated dynamically by a Vite plugin
(`vite.config.ts`) from `src/content/newsletter-posts.ts` — no hand-edited
list to keep in sync.

Where to get the values:
- `VITE_GSC_VERIFICATION`: in Google Search Console → add a property →
  choose "HTML tag" verification → copy the `content` attribute value only
  (not the full tag).
- `VITE_GA4_MEASUREMENT_ID`: in Google Analytics → Admin → Data Streams →
  pick the web stream → copy the Measurement ID at the top.

## Schema drift detection

The signup flow once 500'd because `lib/db/src/schema/subscribers.ts` had
columns (`unsubscribe_token`, `unsubscribed_at`) that were never pushed to the
live database. To prevent that recurring silently:

- `lib/db/src/check-schema-drift.ts` introspects `information_schema` and
  compares every column declared in `lib/db/src/schema/*` against the live DB.
  It exits non-zero on any missing table, missing column, type mismatch, or
  nullability mismatch.
- The post-merge script (`scripts/post-merge.sh`) runs `pnpm --filter db push`
  followed by `pnpm --filter db run check-drift`, so a merge fails loudly if
  the schema and the database disagree.
- A `schema-drift` validation step is registered for the same command, so it
  can be run on demand alongside other quality gates.

When you change anything under `lib/db/src/schema/`, push it
(`pnpm --filter @workspace/db run push`) before relying on it from the API.
If `check-drift` reports drift, push the schema and re-run the check.

## Going live with Google (equine-wellness)

Once the real domain has been purchased and DNS points at the deployment,
three short manual steps make the site fully visible to Google. None of
this requires a developer — Susie (or whoever owns the Google account)
can do it from a browser.

1. **Verify the site in Google Search Console.** Go to
   [Search Console](https://search.google.com/search-console), add the
   site as a property, and choose the "HTML tag" verification method.
   Google will give a small `<meta>` tag — copy the value of its
   `content="..."` attribute (just the long token, not the whole tag),
   set it as the deployment env var `VITE_GSC_VERIFICATION`, and
   redeploy. Search Console will then click "Verify" and the site is
   confirmed as Susie's.

2. **Submit the sitemap.** In Search Console, open Sitemaps in the left
   nav and submit `https://<your-real-domain>/sitemap.xml`. Google will
   pick up every page and every newsletter post from there
   automatically — no need to re-submit when new posts are added.

3. **Set up Google Analytics 4.** In
   [Google Analytics](https://analytics.google.com), create a new GA4
   property for the site, add a Web data stream pointing at the live
   domain, and copy the Measurement ID at the top of the stream
   (`G-XXXXXXXXXX`). Set it as the deployment env var
   `VITE_GA4_MEASUREMENT_ID` and redeploy. Visits will start showing up
   in GA4 within a few minutes, and newsletter signups will appear as
   `newsletter_signup` events under Reports → Engagement → Events.

The site already ships with the supporting pieces:
- Per-page titles, descriptions, canonical URLs, Open Graph + Twitter
  Card meta, and a `noindex, follow` tag on unknown URLs.
- JSON-LD structured data (LocalBusiness, Person, Service x6, FAQPage)
  in `index.html` so Google can render rich results.
- A dynamic `/sitemap.xml` and `/robots.txt` generated from
  `src/content/newsletter-posts.ts` (no hand-editing needed).
- A modern favicon set (`favicon.ico`, `favicon.svg`, Apple touch icon,
  192/512 PNGs, plus `site.webmanifest` for mobile home screens) and a
  branded `opengraph.jpg` share card.
- A cookie consent banner that gates GA4 until the visitor accepts.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
