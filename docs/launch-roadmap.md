# INTCO Framing Relaunch Roadmap

Last updated: 2026-05-29

This file is the durable source of truth for the relaunch work. Keep it updated when a phase starts, finishes, or changes scope.

## Goal

Prepare the refreshed INTCO Framing multilingual website for production launch with stable i18n, complete Sanity content modeling, clean data import, SEO/GEO readiness, inquiry form integration, and safe migration from the old WordPress site.

## Current Operating Principles

- English is the default locale with no URL prefix.
- Spanish, Portuguese, French, German, and Japanese use URL prefixes: `/es`, `/pt`, `/fr`, `/de`, `/ja`.
- Every language page must be a real URL, not client-side language switching.
- Canonical must point to the current localized page.
- Hreflang must include all six languages plus `x-default`.
- Sanity schema must be finalized before production data import.
- Use staging import before production import.
- Old WordPress URLs must be mapped to new URLs before launch.

## Phase 0: Baseline Freeze

Status: Complete with accepted token-rotation waiver

Purpose: Freeze the current technical and content baseline so later work is auditable.

Tasks:

- Record current Git branch, commit, and dirty files.
- Record current Vercel project, production domain, and environment variables.
- Record Sanity project ID, datasets, schemas, and token status.
- Export or back up current Sanity dataset before destructive/import work.
- Crawl old WordPress site and generate a legacy URL inventory.
- Rotate any token that was shared in chat before production use, unless the project owner explicitly accepts that risk for the current workstream.

Exit criteria:

- Baseline note exists in repo.
- Old URL list exists.
- Sanity backup/export exists.
- Secrets required for production are identified and rotated or explicitly risk-accepted where needed.

Current evidence:

- Baseline note: `docs/phase-0-baseline-20260528.md`
- Sanity backup: `backups/sanity-production-20260528T063320Z.tar.gz`
- Legacy URL inventory: `reports/launch/legacy-wordpress-urls-20260528T063320Z.csv`
- Vercel baseline: project `kkkkkongjhs-projects/intcoframing`, production alias `https://intcoframing-wheat.vercel.app`, required public Sanity/site env keys present.
- Token rotation risk: explicitly waived by the project owner on 2026-05-28 so Phase 1 can proceed. Rotate before final launch if possible.

## Phase 1: Translation Completion and Sanity Schema Finalization

Status: Complete

Purpose: Complete multilingual content and finalize CMS structure before importing real content.

Tasks:

- Run or review the i18n generation process.
- Audit six-language coverage for navigation, page chrome, CTA copy, product/category pages, solution pages, contact page, metadata, and image alt text.
- Fix SSR `<html lang>` correctness and verify rendered HTML language attributes.
- Finalize Sanity schemas for:
  - SEO: `seoTitle`, `seoDescription`, `canonicalPath`, `ogImage`, `imageAlt`.
  - GEO/AEO: `faq[]`, evidence/claim fields if needed, `datePublished`, `dateModified`.
  - Product structured data: `sku`, `brand`, `category`, `material`, `dimensions`, `offers` or inquiry-oriented offer catalog.
  - Inquiry routing: `inquiryFormId`, product/category/form context fields.
  - Migration: `legacyUrls[]` for 301 redirect mapping.
  - Contact and organization data: `contactPoint`, address, phone, email, socials.
- Decide inquiry backend before finalizing schema:
  - Email only.
  - CRM such as HubSpot or Zoho.
  - Airtable/Google Sheet.
  - Custom API/database.

Exit criteria:

- No high-risk English leakage in non-English core pages.
- Sanity schema supports SEO/GEO/product/inquiry/migration needs.
- Inquiry backend decision is made.
- `npm run lint` and `npm run build` pass.
- Route/i18n verification passes.

Current evidence:

- Phase 1 note: `docs/phase-1-schema-i18n-20260528.md`
- `npm run i18n:generate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npx sanity schemas validate`: 0 errors, 0 warnings.
- Route verification: 1482 checked, 1482 passed, 0 failed.
- Core visible text audit: 50 non-English representative pages checked, 0 high-risk English UI leakage findings.
- Raw-CJK image URL smoke: 30 affected Japanese pages returned 200 with no `ByteString` production server log errors after URL normalization.
- Inquiry backend decision updated during Phase 3: the original site uses LeadsCloud/询盘云, not a custom Vercel API baseline. Runtime configuration must follow the original LeadsCloud setup unless the owner explicitly changes vendors.
- Reverified after token-rotation waiver on 2026-05-28: `npm run lint`, `npm run build`, `npx sanity schemas validate`, `npm run i18n:generate`, full route verification, and a 50-page non-English UI text leak audit all passed.

## Phase 2: Sanity Data Import

Status: Complete

Purpose: Import clean data once, after fields are stable.

Tasks:

- Create or confirm a staging dataset.
- Import localized content into staging.
- Verify Studio editing experience.
- Verify frontend reads expected staging content.
- Check images, slugs, alt text, FAQ fields, SEO fields, product fields, and legacy URLs.
- Fix import scripts or seed data as needed.
- Export staging as a backup.
- Import into production dataset.

Exit criteria:

- Staging import verified.
- Production import completed.
- Frontend renders content from Sanity without relying on fallback seed for core entities.
- Sanity content can be edited safely in Studio.

Current evidence:

- Phase 2 preparation note: `docs/phase-2-sanity-import-20260528.md`
- Local dry-run report for staging: `reports/launch/sanity-import-dry-run-20260528T080222Z.json`
- Prepared import payload: 1452 documents across `en`, `es`, `pt`, `fr`, `de`, and `ja`.
- Dry-run missing fields: SEO 0, image alt 0, legacy URLs 0, language 0, translation group 0.
- Phase 2 helper scripts added: `sanity:dataset:ensure`, `sanity:import`, and `sanity:verify:import`.
- Read-only production verification before Phase 2 import failed as expected: current production is not yet a complete localized Sanity source of truth.
- Staging dataset creation with the current token failed because the token lacks `sanity.project.datasets/create`; report: `reports/launch/sanity-dataset-staging-token-permission-20260528.json`.
- Latest staging check on 2026-05-28: token-based dataset list shows only `production`; `staging` verification fails with dataset not found; latest reports: `reports/launch/sanity-dataset-staging-latest-20260528.json` and `reports/launch/sanity-import-verify-staging-missing-20260528.json`.
- Staging confirmed: `reports/launch/sanity-dataset-staging-confirmed-20260528.json`.
- Staging import: 1452/1452 documents imported; report `reports/launch/sanity-import-staging-20260528-rerun.json`.
- Staging verification: passed with 0 count failures and 0 missing-field failure groups; report `reports/launch/sanity-import-verify-staging-20260528-rerun.json`.
- Staging backup: `backups/sanity-staging-20260528T084900Z.tar.gz`.
- Production pre-import backup: `backups/sanity-production-pre-import-20260528T085100Z.tar.gz`.
- Production import: 1452/1452 documents imported; report `reports/launch/sanity-import-production-20260528.json`.
- Production verification: passed with 0 count failures and 0 missing-field failure groups; report `reports/launch/sanity-import-verify-production-20260528.json`.
- Frontend staging probe and smoke passed: `reports/launch/staging-frontend-probe-20260528.json`, `reports/launch/staging-frontend-smoke-20260528.json`.
- Frontend production smoke passed: `reports/launch/production-frontend-smoke-20260528.json`.

## Phase 3: SEO/GEO and Inquiry Form Integration

Status: In progress

Purpose: Make the site search-ready, AI-answer-ready, and lead-ready.

SEO/GEO tasks:

- Generate JSON-LD for Organization, WebSite, BreadcrumbList, Product, FAQPage, and relevant CollectionPage pages.
- Ensure every important page has unique localized title and meta description.
- Add FAQ blocks where useful for AEO/GEO extraction.
- Add last-updated or date-modified signals.
- Verify sitemap includes only canonical production URLs.
- Verify robots.txt permits crawling.
- Check Open Graph and social preview data.
- Run rich results validation for representative pages.

Inquiry tasks:

- Implement Contact page submission.
- Implement product/category inquiry submission.
- Include page/product context in every inquiry.
- Add validation, success state, error state, spam protection, and server-side handling.
- Confirm notifications or CRM records are created.

Performance tasks:

- Preserve original-site visual parity while improving the Vercel test site's Core Web Vitals.
- Optimize homepage LCP, Speed Index, and Total Blocking Time on desktop and mobile.
- Improve image cache lifetime and image delivery without removing required source-site sections.
- Delay non-critical third-party chat/form runtime so it does not compete with the first paint.
- Keep GTM and LeadsCloud IDs/configuration matching the original site; only adjust loading priority unless the owner approves a vendor/config change.
- Record optimization evidence in `docs/phase-3-performance-optimization-20260529.md`.

Exit criteria:

- SEO/GEO P0/P1 checks pass.
- Inquiry forms work on Contact and product pages.
- Submissions reach the chosen destination with useful context.
- Build and smoke tests pass.

Current evidence:

- Phase 3 audit note: `docs/phase-3-seo-geo-inquiry-20260528.md`
- Phase 3 external launch gate runbook: `docs/phase-3-external-launch-gates-20260529.md`
- Final-domain preflight note: `docs/final-domain-preflight-20260529.md`
- Original inquiry/analytics configuration restored from the live WordPress site:
  - Google verification `XxIbPVYkAfTn87yksZcHyjNaILrUXOCBthdp9uhcLr0`
  - GTM `GTM-NFFXV4DP`
  - LeadsCloud enterprise ID `200365`
  - LeadsCloud parent template `02376509567647f8b38260d65d403b72`
  - LeadsCloud forms `6189597577e948eca67e7bd73f903247`, `5d1c229ef1f642eda662373b8f5dab11`, `07843196750e465ab3297ef006ca12e2`, and `500882e169604e22811adcefebc5aac2`
- Mock Contact/product/footer forms replaced with original LeadsCloud embed slots.
- Catalog download restored to the original form-before-download behavior.
- Product enquiry cart now writes the LeadsCloud `productList` context shape using source IDs, URLs, and SKUs when available.
- Visible FAQ/evidence sections added for Sanity-backed priority pages so FAQPage JSON-LD is backed by user-visible content.
- Baseline FAQ/evidence content imported to staging and production for 324 priority documents; verification reports:
  - `reports/launch/sanity-import-verify-staging-phase3-intelligence-20260528.json`
  - `reports/launch/sanity-import-verify-production-phase3-intelligence-20260528.json`
- Old WordPress sitemap redirect map implemented in `src/proxy.ts` using explicit `301` redirects. Local audit checked 262 legacy URLs from `reports/launch/legacy-wordpress-urls-20260528T063320Z.csv`: 261 trailing-slash redirects, 19 mapped redirects, 0 failures.
- Local static SEO URL check passed with current `NEXT_PUBLIC_SITE_URL=https://intcoframing-wheat.vercel.app`: sitemap has 1476 canonical URLs, robots points to that sitemap/host, and representative canonical/hreflang sets are complete.
- Local verification passed: `npm run lint`, `npm run build`, and Playwright checks for `/products`, `/contact`, `/enquiry-list`, a product detail page, and `/es/products`.
- Local HTML checks confirmed visible FAQ/evidence and FAQPage JSON-LD on `/products` and `/es/products`.
- Sanity frontend query was slimmed from broad all-document payloads to list projections plus current-route detail fetches. Representative raw response sizes are now under the Next.js data-cache 2 MB item limit:
  - `/ja/products`: 530,747 bytes
  - `/ja/contact`: 529,211 bytes
  - `/news/canvas-art-a-perfect-addition-to-your-home-decor`: 534,529 bytes
  - `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf`: 389,758 bytes
- Reverification after query slimming on 2026-05-29: `npm run lint`, `npm run build`, `npm run intco:routes -- --base http://127.0.0.1:3000 --all`, local HTML smoke for representative SEO/inquiry pages, and `git diff --check` all passed. The full route run completed 1482/1482 routes with exit code 0, and the sampled dev-server log no longer showed the previous Next.js data-cache size warning.
- Product-detail LCP image warning addressed on 2026-05-29 by migrating Next.js Image hero priority handling to the Next 16 `preload`/`loading="eager"` APIs. Headless Chrome console verification for `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf` reported 0 image/LCP warnings and 0 non-analytics browser errors; follow-up `npm run lint` and `npm run build` passed.
- Homepage performance optimization plan added on 2026-05-29 after owner PageSpeed test showed desktop performance 82 and mobile performance 72 on `https://intcoframing-wheat.vercel.app/`. First-pass scope: image cache/format policy, homepage LCP/SI, third-party script timing/TBT, mobile cookie timing, and post-deploy retest. Plan: `docs/phase-3-performance-optimization-20260529.md`.
- Homepage performance first pass implemented on 2026-05-29. Local verification passed `npm run lint`, `npm run build`, visual screenshots at 1440px/390px, and Chrome network capture with no early hero GIF, YouTube thumbnail, LeadsCloud form script, 3840w image, footer background, or bottom CTA background request in the first 8 seconds. Launch verifier passed automated checks with configured Vercel test origin: `reports/launch/launch-readiness-local-performance-site-origin-20260529.json`.
- Representative Open Graph/social preview metadata verified locally on 2026-05-29 for `/`, `/products`, `/es/products`, `/contact`, `/ja/contact`, `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf`, `/news/canvas-art-a-perfect-addition-to-your-home-decor`, `/solutions/business-insights-trends`, `/fr/solutions/design-engineering`, and `/de/solutions/manufacturing-delivery`. Each checked page returned status 200 and had title, meta description, `og:title`, `og:description`, `og:image`, `og:image:alt`, `twitter:card`, and `twitter:image`.
- Original-site Cloudflare script audit completed on 2026-05-29. Report: `reports/launch/original-cloudflare-script-audit-20260529.json`. The checked WordPress pages do not contain a Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js` or `data-cf-beacon`); they only contain Cloudflare platform scripts injected by hosting/security features. Do not add a Cloudflare Web Analytics beacon unless a real Cloudflare Web Analytics token is provided.
- FAQ/evidence content was refreshed and re-imported on 2026-05-29 with a stricter AEO audit. New script: `npm run sanity:audit:aeo`. Staging and production imports both wrote 1452/1452 documents and passed `sanity:verify:import`. Production AEO report `reports/launch/aeo-content-audit-production-phase3-aeo-refresh-20260529.json` passed with 324/324 intelligence documents having at least 3 FAQs, evidence, and `dateModified`, totaling 972 FAQs and 324 evidence items with 0 failures.
- Local frontend smoke after Sanity cache refresh confirmed `/products`, `/who-we-are/philosophy`, and `/ja/contact` render visible FAQ content, FAQPage JSON-LD, the new inquiry-details FAQ, and `dateModified`.
- Launch-readiness verifier added on 2026-05-29: `npm run launch:verify`. Local report `reports/launch/launch-readiness-local-20260529.json` passed all automated checks with `automatedOk=true`: robots/sitemap, 1476 sitemap URLs, 11 representative page metadata/JSON-LD/LeadsCloud slots, and 262 legacy WordPress URL redirects. `ready=false` remains correct because external launch gates are still pending.
- Important external dependency: LeadsCloud chat only hydrates for domains configured in LeadsCloud. `intcoframing-us.com` is configured; the tested Vercel preview domains are not.
- Important external dependency: Sanity CORS could not be verified with the current Editor token because it lacks `sanity.project.cors/read`. Final domain CORS must be checked with a logged-in Sanity user or project-level token before launch, especially for `/studio`.
- External launch gates now have explicit required evidence in `docs/phase-3-external-launch-gates-20260529.md`: final Vercel production env/domain, Sanity CORS, LeadsCloud domain status, live LeadsCloud submission records, Rich Results validation, and Search Console sitemap/ownership.
- Final-domain preflight on 2026-05-29 proved `https://www.intcoframing-us.com` is still serving the old Cloudflare/WordPress site, not the refreshed Next/Vercel deployment. Report: `reports/launch/launch-readiness-final-domain-preflight-20260529.json`; note: `docs/final-domain-preflight-20260529.md`. The preflight failed robots, sitemap, representative page metadata/JSON-LD, and sampled legacy redirects, while confirming `leadsCloudDomain.ok=true` for the effective host `intcoframing-us.com`.

## Phase 4: Migration and Launch Readiness

Status: Blocked by Phases 1-3

Purpose: Prepare final domain switch and prevent traffic/SEO loss.

Tasks:

- Configure `NEXT_PUBLIC_SITE_URL` to the final production domain.
- Configure Sanity CORS for Vercel and final production domains.
- Configure Vercel production environment variables.
- Add 301 redirects from old WordPress URLs to new URLs.
- Verify important legacy URLs redirect to the best matching new pages.
- Submit sitemap in Google Search Console.
- Verify domain ownership in Search Console.
- Check 404 handling and redirect loops.
- Run Core Web Vitals / Lighthouse checks on core templates.
- Confirm production deployment uses correct Sanity dataset.

Exit criteria:

- Final domain loads the new site.
- Sitemap and robots are correct.
- Legacy URLs redirect correctly.
- Search Console is configured.
- Core pages pass smoke tests in all six languages.

## Hard Launch Gates

The site should not be launched until all of these are true:

- `NEXT_PUBLIC_SITE_URL` is the final production domain.
- Sanity production dataset contains complete content.
- Sanity CORS includes the production domain.
- Vercel production environment variables are complete.
- All six language URL structures work.
- Canonical and hreflang are correct.
- Sitemap contains final canonical URLs only.
- 301 redirect map is implemented and tested locally, then re-tested on the final production domain.
- Contact and inquiry forms submit successfully.
- Search Console domain ownership is verified.
- New sitemap is submitted.
- `npm run lint` passes.
- `npm run build` passes.
- Route verification passes.

## Immediate Next Step

Continue Phase 3.

First concrete next task: point `https://www.intcoframing-us.com` to the refreshed Vercel Production deployment, set Vercel Production `NEXT_PUBLIC_SITE_URL=https://www.intcoframing-us.com`, redeploy, confirm Sanity CORS for the final origin, then rerun `npm run launch:verify -- --base https://www.intcoframing-us.com --expected-origin https://www.intcoframing-us.com --expected-sitemap-count 1476 --legacy-limit all --report reports/launch/launch-readiness-final-YYYYMMDD.json`. Do not pass the manual confirmation flags until Sanity CORS, live LeadsCloud submissions, Rich Results, and Search Console have actually been verified.
