# Phase 3 External Launch Gates

Date: 2026-05-29

Status: Not complete

This runbook covers the Phase 3 items that cannot be truthfully completed by code alone. Do not mark Phase 3 complete until each gate below has evidence from the real production domain and the relevant external service.

## Canonical Launch Domain

Use one final canonical origin for all public metadata, sitemap URLs, redirects, and Search Console submission.

Recommended final origin:

```text
https://www.intcoframing-us.com
```

Reason:

- The original public site already uses `www.intcoframing-us.com`.
- Existing backlinks and WordPress sitemap URLs are under that host.
- LeadsCloud chat strips the leading `www.` before checking domain status, so the effective LeadsCloud website check is `intcoframing-us.com`.

Do not use a Vercel preview domain as the final `NEXT_PUBLIC_SITE_URL`.

## Gate 1: Vercel Production Environment

Required Production environment variables:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=o10sbz2i
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-20
NEXT_PUBLIC_SITE_URL=https://www.intcoframing-us.com
```

Optional runtime variable:

```text
SANITY_API_READ_TOKEN=<viewer token only if the Sanity dataset becomes private>
```

Rules:

- Do not add `SANITY_API_TOKEN` to Vercel unless a server-side import/admin job truly needs it.
- Do not expose any non-public token using a `NEXT_PUBLIC_` prefix.
- After editing environment variables, redeploy the Production deployment.

Evidence required:

- Vercel Production deployment succeeds.
- `https://www.intcoframing-us.com/robots.txt` points to `https://www.intcoframing-us.com/sitemap.xml`.
- `https://www.intcoframing-us.com/sitemap.xml` contains only `https://www.intcoframing-us.com/...` URLs.

Verification:

```bash
npm run launch:verify -- \
  --base https://www.intcoframing-us.com \
  --expected-origin https://www.intcoframing-us.com \
  --expected-sitemap-count 1476 \
  --legacy-limit all \
  --report reports/launch/launch-readiness-final-20260529.json
```

Expected before all external gates are confirmed:

- `automatedOk=true`
- `ready=false`
- external pending items may remain

## Gate 2: Sanity CORS

Sanity Studio runs in the browser at `/studio`, so the final production origin must be allowed in Sanity CORS.

Required allowed origins:

```text
https://www.intcoframing-us.com
https://intcoframing-wheat.vercel.app
```

Add any active Vercel production alias if it differs from the above.

Where to configure:

```text
Sanity Manage → Project o10sbz2i → API → CORS origins
```

Recommended setting:

- Allow credentials: enabled for Studio origins.

Evidence required:

- A logged-in Sanity project user confirms the origins above are listed.
- `/studio` opens on the final domain and reaches the Sanity login/editor flow without browser CORS errors.

Verifier note:

- The current token cannot read Sanity CORS because it lacks `sanity.project.cors/read`.
- After manual verification, rerun `npm run launch:verify` with `--sanity-cors-confirmed`.
- Only use that flag after the Sanity dashboard has been checked.

## Gate 3: LeadsCloud Domain

The restored implementation uses the original LeadsCloud values from the WordPress site:

```text
Enterprise ID: 200365
Parent template: 02376509567647f8b38260d65d403b72
Chat script: https://libtx.leadscloud.com/xhltrackingwithchat.js
Form script: https://libtx.leadscloud.com/Front-Form/buryForm/xhlform_NEW.js
Main form: 6189597577e948eca67e7bd73f903247
Footer newsletter form: 5d1c229ef1f642eda662373b8f5dab11
Catalog download form: 07843196750e465ab3297ef006ca12e2
Enquiry cart form: 500882e169604e22811adcefebc5aac2
```

Original chat-domain behavior:

- The original chat script checks `window.location.host`.
- If the host starts with `www.`, it strips `www.`.
- For `https://www.intcoframing-us.com`, LeadsCloud checks `intcoframing-us.com`.

Verifier endpoint copied from the original script:

```text
POST https://fetchip.leadscloud.com/visitor-chat/track/getStatus
orgId=200365
website=intcoframing-us.com
```

Evidence required:

- `npm run launch:verify` reports `leadsCloudDomain.ok=true` on the final domain.
- On the final domain, chat CTAs open the LeadsCloud chat UI.
- Contact, product inquiry, footer newsletter, catalog download, and enquiry cart form slots all hydrate from LeadsCloud.

Do not replace LeadsCloud with a local form handler unless the owner explicitly changes vendors.

## Gate 4: Real Inquiry Submission

Do not submit test leads until the owner confirms it is safe to send them to the live LeadsCloud account.

Minimum test submissions:

- Contact page main inquiry form.
- Product/category inquiry form.
- Enquiry list/cart form with at least one product in `localStorage.productList`.
- Footer newsletter form.
- Catalog download form, including successful PDF download callback.

Evidence required:

- Each submitted test appears in LeadsCloud with page/product context.
- Product enquiry includes the original `productList` shape with source product ID, source URL, SKU, product name, and quantity where available.
- Success/failure behavior matches the LeadsCloud embedded form behavior from the original site.

After this is proven, rerun `npm run launch:verify` with:

```bash
--form-submission-confirmed
```

Only use the flag after live LeadsCloud records are verified.

## Gate 5: Rich Results

Representative final-domain URLs to validate:

```text
https://www.intcoframing-us.com/
https://www.intcoframing-us.com/products
https://www.intcoframing-us.com/contact
https://www.intcoframing-us.com/mirror/wall-mirror/modern-black-iron-bathroom-mirror-with-shelf
https://www.intcoframing-us.com/news/canvas-art-a-perfect-addition-to-your-home-decor
https://www.intcoframing-us.com/solutions/business-insights-trends
https://www.intcoframing-us.com/es/products
https://www.intcoframing-us.com/ja/contact
```

Required structured data coverage:

- Organization
- WebSite
- WebPage or ContactPage
- BreadcrumbList where applicable
- Product on product detail pages
- BlogPosting on blog detail pages
- FAQPage where visible FAQ content exists

Evidence required:

- Google Rich Results Test screenshots or exported results for the representative URLs.
- No critical structured-data errors.

After this is proven, rerun `npm run launch:verify` with:

```bash
--rich-results-confirmed
```

## Gate 6: Search Console

Required Search Console actions:

- Verify ownership for `www.intcoframing-us.com`.
- Prefer a Domain property if DNS access is available; otherwise use URL-prefix verification for `https://www.intcoframing-us.com/`.
- Submit `https://www.intcoframing-us.com/sitemap.xml`.
- Inspect representative URLs after deployment.

Evidence required:

- Search Console property is verified.
- Sitemap is submitted and accepted.
- Representative URL inspection shows Google can fetch the deployed page.

After this is proven, rerun `npm run launch:verify` with:

```bash
--search-console-confirmed
```

## Final Phase 3 Pass Command

Run only after all external gates above are actually verified:

```bash
npm run launch:verify -- \
  --base https://www.intcoframing-us.com \
  --expected-origin https://www.intcoframing-us.com \
  --expected-sitemap-count 1476 \
  --legacy-limit all \
  --sanity-cors-confirmed \
  --form-submission-confirmed \
  --rich-results-confirmed \
  --search-console-confirmed \
  --report reports/launch/launch-readiness-final-20260529.json
```

Phase 3 can be marked complete only when this final-domain report has:

```text
automatedOk=true
externalOk=true
ready=true
```

