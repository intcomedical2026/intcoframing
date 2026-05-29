# Phase 0 Baseline Freeze

Generated: 2026-05-28T06:33:20Z

Status: Complete with accepted token-rotation waiver.

## Scope

This baseline captures the current technical/content state for the INTCO Framing relaunch before schema changes, Sanity imports, SEO/GEO implementation, inquiry integration, or final launch migration work.

## Git Baseline

- Repository: `https://github.com/kkkkkongjh/intcoframing.git`
- Local path: `/Users/kong/Desktop/webproject/intcoframing-us`
- Branch: `main`
- HEAD: `6c380b9187732a177779b3e145b45e7372815e66`
- HEAD summary: `6c380b9 Complete multilingual parity updates`
- Remote tracking: `main...origin/main`
- Dirty/untracked files observed during baseline:
  - `src/app/[[...slug]]/page.tsx`
  - `src/components/site-views.tsx`
  - `src/components/sustainability-interactions.tsx`
  - `src/lib/i18n.ts`
  - `src/lib/site-data.ts`
  - `src/lib/solution-page-content.ts`
  - `docs/`
  - `backups/`
  - `reports/launch/`

## Local Environment Baseline

- Node project: `intco-framing-next-sanity`
- Next.js: `16.2.6`
- React: `19.2.4`
- Sanity package: `^5.26.0`
- Sanity CLI: `@sanity/cli/6.6.0`
- Vercel CLI: `54.4.1`

Environment values from `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: `o10sbz2i`
- `NEXT_PUBLIC_SANITY_DATASET`: `production`
- `NEXT_PUBLIC_SANITY_API_VERSION`: `2026-05-20`
- `NEXT_PUBLIC_SITE_URL`: `https://intcoframing-wheat.vercel.app`
- `SANITY_UPLOAD_ASSETS`: `false`
- `SANITY_API_TOKEN`: missing
- `SANITY_API_READ_TOKEN`: present

Environment values from `.env.example`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: `o10sbz2i`
- `NEXT_PUBLIC_SANITY_DATASET`: `production`
- `NEXT_PUBLIC_SANITY_API_VERSION`: `2026-05-20`
- `NEXT_PUBLIC_SITE_URL`: `https://www.intcoframing-us.com`
- `SANITY_API_TOKEN`: placeholder/missing
- `SANITY_API_READ_TOKEN`: placeholder/missing

## Vercel Baseline

- Local `.vercel/project.json`: present after local link.
- This local checkout is linked to Vercel project `kkkkkongjhs-projects/intcoframing`.
- Vercel CLI is logged in as `kkkkkongjh`.
- Vercel team/scope: `kkkkkongjhs-projects`.
- Project name: `intcoframing`.
- Project owner: `kkkkkongjh's projects`.
- Project root directory: `.`.
- Vercel Node.js version: `24.x`.
- Vercel framework preset: Next.js.
- Vercel build command: `npm run build` or `next build`.
- Vercel output directory: Next.js default.
- Vercel install command: default package-manager install command.
- Current local public site URL points to `https://intcoframing-wheat.vercel.app`.
- `https://intcoframing-wheat.vercel.app` responds with HTTP 200 from Vercel.
- `https://www.intcoframing-us.com` responds with HTTP 200 from Cloudflare/WordPress and is not yet the new Vercel site.
- Latest inspected production deployment:
  - Project: `intcoframing`
  - Target: production
  - Status: Ready
  - Alias: `https://intcoframing-wheat.vercel.app`
  - Created: 2026-05-27 17:42:27 CST

Production environment variable keys listed in Vercel:

- `NEXT_PUBLIC_SITE_URL`: production
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: production, preview
- `NEXT_PUBLIC_SANITY_DATASET`: production, preview
- `NEXT_PUBLIC_SANITY_API_VERSION`: production, preview

Blocked Vercel facts:

- Secret values were not read or recorded.
- The final custom domain is not yet pointed at the new Vercel site; `https://www.intcoframing-us.com` still serves Cloudflare/WordPress.

## Sanity Baseline

- Project ID: `o10sbz2i`
- Dataset in use: `production`
- API version in local config: `2026-05-20`
- Dataset list via `SANITY_API_READ_TOKEN`: `production`
- Sanity CLI is not interactively logged in, but read-token access works.

Remote document counts in `production`:

- `siteSettings`: 1
- `homePage`: 1
- `productCategory`: 25
- `product`: 108
- `solution`: 6
- `project`: 13
- `blogPost`: 80
- `contentPage`: 8
- Total exported documents: 242

Current schema files:

- `src/sanity/schemaTypes/documents.ts`
- `src/sanity/schemaTypes/objects.ts`
- `src/sanity/schemaTypes/index.ts`

Current schema gap for later Phase 1:

- No dedicated SEO object yet.
- No `faq[]` schema yet.
- No `legacyUrls[]` migration field yet.
- Product schema does not yet include `sku`, `offers`, `brand`, `material`, `dimensions`, or inquiry routing fields.
- Contact/organization structured data fields are still limited.

## Sanity Backup

Production dataset export completed successfully.

- File: `backups/sanity-production-20260528T063320Z.tar.gz`
- Size: approximately 298 KB
- SHA-256: `dba0aa27b0deafba8de8a3aa5a426a75f8b8ebf9c9e9629d49e8e2fef4270c2f`
- Export output: 242 documents, 0 assets.

## Legacy WordPress URL Inventory

Old WordPress sitemap index:

- `https://www.intcoframing-us.com/wp-sitemap.xml`

Generated inventory:

- CSV: `reports/launch/legacy-wordpress-urls-20260528T063320Z.csv`
- Summary: `reports/launch/legacy-wordpress-urls-20260528T063320Z.summary.json`
- CSV SHA-256: `f2e90cee51f288be2488cf1909768630465eb1d308639da1a6d1130cf3b01db4`
- Total legacy URLs: 262

Legacy URL counts by sitemap:

- `wp-sitemap-posts-post-1`: 108
- `wp-sitemap-posts-news-1`: 80
- `wp-sitemap-posts-page-1`: 26
- `wp-sitemap-taxonomies-category-1`: 25
- `wp-sitemap-posts-project-1`: 13
- `wp-sitemap-taxonomies-blog-1`: 5
- `wp-sitemap-users-1`: 3
- `wp-sitemap-taxonomies-project_category-1`: 2

All generated redirect suggestions are marked `unreviewed`. They are an inventory seed, not an approved 301 redirect map.

## Secret / Token Status

- `.env.local` currently contains a read token but no editor/import token.
- A Sanity token was previously shared in chat. It should be revoked or rotated before production launch.
- The project owner explicitly waived this token-rotation blocker on 2026-05-28 so Phase 1 can proceed.
- Do not use or store the chat-shared token in repo artifacts.
- Before Phase 2 import, a fresh editor token is required.
- Before final launch, all production tokens must be stored only in Vercel/Sanity/local secret stores, not in tracked files or chat.

## Phase 0 Exit Criteria

- Baseline note exists in repo: complete.
- Old URL list exists: complete.
- Sanity backup/export exists: complete.
- Secrets required for production are identified: complete.
- Secrets rotated where needed: risk accepted for Phase 1 by explicit user waiver on 2026-05-28.
- Vercel project/environment status recorded: complete for Phase 0 baseline.

## Remaining Risk Before Phase 1

Phase 1 may start because the project owner explicitly waived the blocker. This remains a production security risk:

1. Revoke/rotate the Sanity token that was shared in chat, then confirm the new token strategy before final launch if possible.

Recommended Sanity token action:

1. Open Sanity Manage for project `o10sbz2i`.
2. Go to API tokens.
3. Revoke the token that was shared in chat.
4. Create a fresh editor token only when Phase 2 import is about to run.
5. Keep the fresh token out of tracked files and out of chat if possible.
