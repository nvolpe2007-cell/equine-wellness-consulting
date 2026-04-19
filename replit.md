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

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
