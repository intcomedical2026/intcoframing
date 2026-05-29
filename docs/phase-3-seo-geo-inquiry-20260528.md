# Phase 3 SEO/GEO and Inquiry Integration Audit

Date: 2026-05-28

Status: In progress

## Scope Completed in This Pass

- Audited the original WordPress site inquiry and analytics configuration from:
  - `https://www.intcoframing-us.com/`
  - `https://www.intcoframing-us.com/products/`
  - `https://www.intcoframing-us.com/contact/`
  - `https://www.intcoframing-us.com/enquiry-list/`
  - `https://www.intcoframing-us.com/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf/`
- Replaced local mock/fake forms with the original LeadsCloud embedded form slots.
- Restored original GTM, Google verification, LeadsCloud chat bootstrap, LeadsCloud form bootstrap, catalog download callback, and inquiry cart product context.
- Added visible FAQ/evidence rendering for Sanity-backed priority pages so FAQPage JSON-LD is supported by on-page content.
- Generated and imported baseline FAQ/evidence content for priority Sanity documents.
- Implemented and tested the old WordPress sitemap redirect map locally.
- Slimmed Sanity frontend reads so large localized pages stay under the Next.js data-cache item limit while preserving full current-page detail data.
- Tuned the product-detail LCP image handling for Next.js 16.
- Verified the implementation locally with Next.js, Playwright, lint, and production build.

## Original Site Configuration Evidence

These values were copied from the live WordPress source and LeadsCloud runtime responses. Do not change them without checking the original site or the LeadsCloud backend.

- Google verification token: `XxIbPVYkAfTn87yksZcHyjNaILrUXOCBthdp9uhcLr0`
- GTM ID: `GTM-NFFXV4DP`
- LeadsCloud enterprise ID: `200365`
- LeadsCloud parent template ID: `02376509567647f8b38260d65d403b72`
- LeadsCloud form script: `https://libtx.leadscloud.com/Front-Form/buryForm/xhlform_NEW.js`
- LeadsCloud chat script: `https://libtx.leadscloud.com/xhltrackingwithchat.js`
- LeadsCloud form IDs:
  - Main contact/product inquiry: `6189597577e948eca67e7bd73f903247`
  - Footer newsletter: `5d1c229ef1f642eda662373b8f5dab11`
  - Catalog download: `07843196750e465ab3297ef006ca12e2`
  - Enquiry cart: `500882e169604e22811adcefebc5aac2`
- Original wrapper class seen on contact/enquiry forms: `BURY_CODE_5d7b74d8ea0b4f4fb26aa05682c8ae4e`
- Original catalog popup title: `Fill out the form to download！`
- Original successful catalog submission callback: `formDownLoadPDF()`

## Code Changes

- Added exact LeadsCloud constants in `src/lib/leadscloud.ts`.
- Added a client runtime in `src/components/leadscloud-runtime.tsx` that:
  - queues `_XHLF("200365", "02376509567647f8b38260d65d403b72", formIds, "empty.css", "true")`;
  - reloads the original LeadsCloud form script after route changes and catalog modal opens;
  - creates the original hidden `#goPdf` download anchor;
  - defines `window.formDownLoadPDF()` so the catalog form can trigger the PDF download after successful submission.
- Added `src/components/leadscloud-chat-link.tsx` so chat CTAs call `_XHL.a.openChat()` when the LeadsCloud chat runtime is available.
- Added `src/components/catalog-download-dialog.tsx` so catalog downloads use the original `078431...` LeadsCloud form before downloading.
- Updated `src/app/layout.tsx` with original Google verification, GTM, GTM noscript, and LeadsCloud chat bootstrap.
- Updated `src/components/site-chrome.tsx` so footer newsletter uses the original LeadsCloud footer form.
- Updated `src/components/site-views.tsx` so:
  - product/category inquiry bands use `618959...`;
  - contact page uses the original `5d7...` wrapper plus inner `618959...`;
  - catalog download uses `078431...`;
  - chat CTAs use the LeadsCloud chat handler instead of plain anchors where the original site opens chat.
- Updated `src/components/enquiry-list.tsx` so the enquiry list page uses the original `500882...` cart form.
- Updated `src/components/product-quote-panel.tsx` so adding a product writes the original LeadsCloud `productList` shape using Sanity `sourceId`, `sourceUrl`, and `sku` when available.
- Updated `next.config.ts` with `skipTrailingSlashRedirect: true` so `src/proxy.ts` can control migration redirect status codes.
- Updated `src/proxy.ts` so:
  - old WordPress trailing-slash URLs return explicit `301` redirects to no-trailing-slash canonical paths;
  - old product-all, WordPress utility, blog taxonomy, author, and retired solution URLs redirect to the closest new page;
  - existing locale header behavior for SSR language detection is preserved.
- Updated `src/lib/site-data.ts` so broad Sanity all-site reads use lightweight list projections, while the current route fetches full detail data for the matching category, product, solution, project, blog post, or page.
- Updated `src/app/[[...slug]]/page.tsx` so both metadata generation and page rendering pass the current path into `getSiteData()`.
- Updated above-the-fold `next/image` usage from deprecated `priority` to Next.js 16 `preload` on single-image hero sections.
- Updated the product detail primary image and first matching thumbnail to `loading="eager"` so the duplicated above-the-fold product image no longer triggers the Next.js LCP warning while preserving the original thumbnail layout.

## Verification Run

Commands:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run sanity:import:dry-run -- --report reports/launch/sanity-import-dry-run-phase3-intelligence-20260528.json`: passed.
- `SANITY_IMPORT_DATASET=staging npm run sanity:import -- --report reports/launch/sanity-import-staging-phase3-intelligence-20260528.json`: imported 1452/1452 documents.
- `npm run sanity:verify:import -- --dataset staging --report reports/launch/sanity-import-verify-staging-phase3-intelligence-20260528.json`: passed.
- `SANITY_ALLOW_PRODUCTION_IMPORT=true SANITY_IMPORT_DATASET=production npm run sanity:import -- --report reports/launch/sanity-import-production-phase3-intelligence-20260528.json`: imported 1452/1452 documents.
- `npm run sanity:verify:import -- --dataset production --report reports/launch/sanity-import-verify-production-phase3-intelligence-20260528.json`: passed.
- Legacy redirect audit against `reports/launch/legacy-wordpress-urls-20260528T063320Z.csv`: 262 URLs checked, 261 trailing-slash `301` redirects, 19 mapped `301` redirects, 243 final `200` responses, 1 root `200`, 0 failures.
- Local sitemap/robots/canonical/hreflang static check with current `NEXT_PUBLIC_SITE_URL=https://intcoframing-wheat.vercel.app`: passed. Sitemap produced 1476 `<loc>` entries, all under the configured origin, no query/hash URLs, and all six language alternates plus `x-default`. Representative pages `/products`, `/es/products`, `/contact`, and `/ja/contact` had self-canonical URLs and complete hreflang sets.
- Local server: `npm run dev -- --hostname 127.0.0.1 --port 3001`.
- 2026-05-29 query-slimming verification:
  - `npm run lint`: passed.
  - `npm run build`: passed.
  - `npm run intco:routes -- --base http://127.0.0.1:3000 --all`: 1482/1482 routes completed with exit code 0.
  - `git diff --check`: passed.
  - Representative local HTML smoke passed for `/products`, `/ja/contact`, `/news/canvas-art-a-perfect-addition-to-your-home-decor`, `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf`, and legacy `/blog/expo/` redirect behavior.
  - Representative Sanity response sizes after slimming:
    - `/ja/products`: 530,747 bytes
    - `/ja/contact`: 529,211 bytes
    - `/news/canvas-art-a-perfect-addition-to-your-home-decor`: 534,529 bytes
    - `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf`: 389,758 bytes
  - Sampled dev-server logs after route verification and representative page requests no longer showed the previous Next.js data-cache item-size warning.
- 2026-05-29 product-detail LCP image verification:
  - Read current Next.js 16 image docs in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`; `priority` is deprecated in favor of `preload`, and browser LCP warnings may require `loading="eager"` for above-the-fold images.
  - `npm run lint`: passed.
  - `npm run build`: passed.
  - `git diff --check`: passed.
  - Local HTML check for `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf` confirmed both repeated `2-75.jpg` product image tags now use `loading="eager"`.
  - Headless Chrome console/log check for `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf?lcp-check=3`: 0 image/LCP warnings and 0 non-analytics errors.
- 2026-05-29 Open Graph/social preview verification:
  - Checked representative local pages: `/`, `/products`, `/es/products`, `/contact`, `/ja/contact`, `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf`, `/news/canvas-art-a-perfect-addition-to-your-home-decor`, `/solutions/business-insights-trends`, `/fr/solutions/design-engineering`, and `/de/solutions/manufacturing-delivery`.
  - All checked pages returned status 200.
  - All checked pages had title, meta description, `og:title`, `og:description`, `og:image`, `og:image:alt`, `twitter:card`, and `twitter:image`.
  - English, Spanish, Japanese, French, and German samples were included in this pass.
- 2026-05-29 original-site Cloudflare script audit:
  - Report: `reports/launch/original-cloudflare-script-audit-20260529.json`.
  - Checked original pages `/`, `/products/`, `/contact/`, `/enquiry-list/`, and `/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf/`.
  - No checked original page contained a Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js` or `data-cf-beacon`).
  - The checked original pages did contain Cloudflare Rocket Loader, email decode, and challenge-platform scripts. These are Cloudflare hosting/security platform injections, not a portable Web Analytics token.
  - Decision: do not add Cloudflare Web Analytics to the Vercel site unless a real Cloudflare Web Analytics token is provided. Adding an invented beacon would violate the original-site 1:1 configuration rule.
- 2026-05-29 AEO FAQ/evidence refresh:
  - Updated `scripts/import-to-sanity.mjs` so generated intelligence content now creates 3 FAQ items per priority document, uses fuller extraction-ready answers, and sets `dateModified` to `2026-05-29T00:00:00.000Z` when no source update date exists.
  - Added `scripts/audit-aeo-content.mjs` and package script `npm run sanity:audit:aeo`.
  - Dry run passed: `reports/launch/sanity-import-dry-run-phase3-aeo-refresh-20260529.json`.
  - Staging import wrote 1452/1452 documents: `reports/launch/sanity-import-staging-phase3-aeo-refresh-20260529.json`.
  - Staging verification passed: `reports/launch/sanity-import-verify-staging-phase3-aeo-refresh-20260529.json`.
  - Staging AEO audit passed: `reports/launch/aeo-content-audit-staging-phase3-aeo-refresh-20260529.json`.
  - Production import wrote 1452/1452 documents: `reports/launch/sanity-import-production-phase3-aeo-refresh-20260529.json`.
  - Production verification passed: `reports/launch/sanity-import-verify-production-phase3-aeo-refresh-20260529.json`.
  - Production AEO audit passed: `reports/launch/aeo-content-audit-production-phase3-aeo-refresh-20260529.json`.
  - Production AEO audit result: 324/324 intelligence documents have at least 3 FAQs, evidence, and `dateModified`; total FAQs 972, total evidence items 324, failure count 0.
  - Production sample query confirmed `/contact`, `/products`, `/who-we-are/philosophy`, and `/who-we-are/sustainability` now have 3 FAQs, 1 evidence item, and `dateModified=2026-05-29T00:00:00.000Z`.
  - Local frontend smoke after Sanity cache refresh confirmed `/products`, `/who-we-are/philosophy`, and `/ja/contact` render visible FAQ content, FAQPage JSON-LD, the new inquiry-details FAQ, and `dateModified`.
- 2026-05-29 launch-readiness verifier:
  - Added `scripts/verify-launch-readiness.mjs` and package script `npm run launch:verify`.
  - The verifier checks robots, sitemap URL origin/count, canonical, full hreflang sets, `<html lang>`, titles/descriptions, Open Graph/Twitter metadata, JSON-LD types, original LeadsCloud form slots, GTM, Google verification, legacy URL redirects, LeadsCloud domain status through the original runtime endpoint, Sanity CORS when the token permits it, and manual launch gates.
  - Local command: `npm run launch:verify -- --base http://127.0.0.1:3000 --expected-origin https://intcoframing-wheat.vercel.app --expected-sitemap-count 1476 --legacy-limit all --allow-external-pending --report reports/launch/launch-readiness-local-20260529.json`.
  - Local report: `reports/launch/launch-readiness-local-20260529.json`.
  - Result: `automatedOk=true`, `externalOk=false`, `ready=false`.
  - Automated pass details: robots passed, sitemap passed with 1476 URLs, 11 representative pages passed metadata/JSON-LD/LeadsCloud slot checks, and all 262 legacy WordPress URL redirects ended on non-WordPress 200 pages.
  - External pending details are intentional hard gates: LeadsCloud has no enabled status entry for `intcoframing-wheat.vercel.app`, the current token cannot read Sanity CORS (`sanity.project.cors/read` missing), live LeadsCloud form submission is not yet owner-approved, Rich Results validation is not yet run on the final domain, and Search Console ownership/sitemap submission is not yet confirmed.
- 2026-05-29 external launch gate runbook:
  - Added `docs/phase-3-external-launch-gates-20260529.md`.
  - The runbook records the final-domain rule, Vercel production environment variables, Sanity CORS origins, original LeadsCloud values and domain-status behavior, live inquiry submission evidence, Rich Results representative URLs, Search Console tasks, and the final `npm run launch:verify` command that may mark Phase 3 ready.
- 2026-05-29 final-domain preflight:
  - Ran `npm run launch:verify -- --base https://www.intcoframing-us.com --expected-origin https://www.intcoframing-us.com --expected-sitemap-count 1476 --legacy-limit 40 --allow-external-pending --report reports/launch/launch-readiness-final-domain-preflight-20260529.json`.
  - Report: `reports/launch/launch-readiness-final-domain-preflight-20260529.json`.
  - Note: `docs/final-domain-preflight-20260529.md`.
  - Result: `ready=false`, `automatedOk=false`, `externalOk=false`.
  - The final public domain is still serving the old Cloudflare/WordPress site. Evidence: `/robots.txt` points to `wp-sitemap.xml`, `/sitemap.xml` returns old-site 404 HTML, representative pages lack the refreshed site's canonical/hreflang/JSON-LD output, and sampled legacy URLs still return old trailing-slash WordPress pages instead of refreshed 301 redirects.
  - Positive external finding: `leadsCloudDomain.ok=true` for the final domain because the original script checks `intcoframing-us.com` and LeadsCloud returns one enabled status entry.

Playwright checks:

- `/products`
  - Main form rendered: `from_6189597577e948eca67e7bd73f903247`
  - Footer newsletter rendered: `from_5d1c229ef1f642eda662373b8f5dab11`
  - GTM present: yes
  - `#goPdf` present: yes
- `/products` catalog popup after clicking Explore More
  - Dialog title: `Fill out the form to download！`
  - Catalog form rendered: `from_07843196750e465ab3297ef006ca12e2`
  - Hidden PDF href set to the original catalog PDF URL.
- `/contact`
  - Main form rendered: `from_6189597577e948eca67e7bd73f903247`
  - Footer newsletter rendered: `from_5d1c229ef1f642eda662373b8f5dab11`
  - `<html lang>`: `en`
- `/enquiry-list`
  - Enquiry cart form rendered: `from_500882e169604e22811adcefebc5aac2`
  - Footer newsletter rendered: `from_5d1c229ef1f642eda662373b8f5dab11`
- `/es/products`
  - Main form rendered: `from_6189597577e948eca67e7bd73f903247`
  - Footer newsletter rendered: `from_5d1c229ef1f642eda662373b8f5dab11`
  - `<html lang>`: `es`
- Product detail add-to-cart
  - `localStorage.productList` matches the original LeadsCloud product context shape.
  - Uses source product ID `2184`, source URL, and SKU `TM30105` for the tested product.
  - Cookie `withProduct=true` is set.
- `/products` after production FAQ/evidence import
  - Visible FAQ section present.
  - Visible evidence section present.
  - FAQPage JSON-LD present.
- `/es/products` after production FAQ/evidence import
  - `<html lang>`: `es`
  - Spanish FAQ section present.
  - Spanish evidence section present.
  - FAQPage JSON-LD present.

Sanity intelligence content:

- Dry-run prepared 324 documents with FAQs and 324 documents with evidence.
- Staging verification passed with expected FAQ/evidence counts.
- Production verification passed with expected FAQ/evidence counts.

Browser console:

- Errors: 0
- Warnings: the previous Next.js LCP image warning on the product detail hero image was resolved in the 2026-05-29 verification pass.
- Earlier dev-server logs reported a Next.js data-cache warning for `/es/products`: the Sanity query response was over 2 MB and could not be cached by the Next.js data cache. The 2026-05-29 query-slimming pass reduced representative responses below the cache limit and the sampled dev-server logs no longer showed that warning.

## Important LeadsCloud Domain Finding

The original LeadsCloud chat script checks the current website host before loading the chat UI. The script strips `www.` before checking.

Observed status checks:

- Endpoint copied from the original chat script: `https://fetchip.leadscloud.com/visitor-chat/track/getStatus`
- Original script parameters: `orgId=200365` and `website=<current host without leading www.>`
- `intcoframing-us.com`: configured, status list present.
- `www.intcoframing-us.com`: status list empty, but the script strips `www.` on the real site, so the effective checked host is `intcoframing-us.com`.
- `intcoframing-wheat.vercel.app`: status list empty.
- `intcoframing-t6os.vercel.app`: status list empty.
- `127.0.0.1:3001`: status list empty.

Implication:

- The code now matches the original bootstrap, but the chat widget will only fully hydrate on a LeadsCloud-configured domain.
- For launch, either point the final domain to the new Vercel project or add the new Vercel/custom domain inside LeadsCloud before relying on live chat.
- This is an external LeadsCloud account setting and should not be faked in code.

## External Configuration Checks

- Current local `NEXT_PUBLIC_SITE_URL`: `https://intcoframing-wheat.vercel.app`.
- Sanity CLI CORS check attempted with the configured token and failed because the token lacks project-level `sanity.project.cors/read`.
- Runtime site data is fetched server-side through `src/lib/site-data.ts`; if `SANITY_API_READ_TOKEN` is present it uses that token, otherwise it uses the CDN for the public dataset.
- Sanity Studio runs in the browser under `/studio`, so the final Vercel/custom domain should still be added to Sanity CORS before launch.
- This CORS check is an external Sanity project setting and cannot be truthfully marked complete until a logged-in Sanity user or a project-level token with CORS permissions verifies it.

## SEO/GEO Current State

Already present in code:

- Localized canonical and hreflang generation.
- Sitemap with localized alternates.
- Robots.txt generation.
- JSON-LD for Organization, WebSite, WebPage/ContactPage, BreadcrumbList, Product, BlogPosting, and FAQPage when FAQ content exists.
- Product schema fields for SKU, brand, dimensions, material, and offers where data exists.

Known remaining gaps:

- FAQ/evidence content is populated, refreshed, and passes the automated AEO extraction audit for priority pages, categories, solutions, projects, site settings, and home page. Human brand/editorial review is still recommended, but the structured extraction gate is satisfied.
- `NEXT_PUBLIC_SITE_URL` must be set to the final launch domain before sitemap/canonical validation.
- The final public domain currently still serves the old Cloudflare/WordPress site. It must be pointed to the refreshed Vercel Production deployment before final-domain SEO/GEO/inquiry checks can pass.
- `npm run launch:verify` should be rerun against the final domain after the final Vercel production environment variables and domain alias are frozen.
- Rich Results validation still needs to be run against deployed final-domain URLs.
- Sanity CORS for the final Vercel/custom domain still needs project-level verification.
- The old WordPress redirect map is implemented and passed local verification, but still needs final-domain verification after launch domain DNS/Vercel aliasing is complete.
- The previously observed product-detail LCP image warning is resolved locally; full Core Web Vitals/Lighthouse checks still belong in final-domain Phase 4 validation.
- The previous all-site Sanity query size issue has been addressed locally by list projections plus current-route detail reads. Re-check this on deployed final-domain traffic after production environment variables are frozen.

## Phase 3 Remaining Work

- Run final-domain sitemap, canonical, hreflang, robots, redirects, LeadsCloud-domain, Sanity-CORS, and rich-results checks after `NEXT_PUBLIC_SITE_URL` is set to the final production domain.
- Confirm LeadsCloud has the launch domain configured for chat.
- Test a real form submission only after the owner confirms it is safe to send a test lead to the live LeadsCloud account.
