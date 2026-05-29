# Phase 1 Translation and Schema Finalization

Generated: 2026-05-28

Status: Complete.

Reverified after token-rotation waiver on 2026-05-28.

## Scope

Phase 1 covered multilingual readiness and Sanity schema design before any new Sanity data import work. No production import was run in this phase.

## I18n Process

- `npm run i18n:generate` now runs on macOS and Windows through `scripts/run-python.mjs`.
- Existing localized seed data was detected for Spanish, Portuguese, French, German, and Japanese.
- The generator skipped retranslation and rewrote the existing localized seed without content changes.

## SSR Language and Metadata

- Root layout reads `x-intco-locale` from `src/proxy.ts`.
- SSR `<html lang>` was verified on these sample URLs:
  - `/`: `en`
  - `/es`: `es`
  - `/pt/products`: `pt`
  - `/fr/solutions/design-engineering`: `fr`
  - `/de/contact`: `de`
  - `/ja/news/the-major-materials-of-medicine-mirror-cabinet`: `ja`
- Canonical URLs point to the current localized page.
- Hreflang alternates include `en`, `es`, `pt`, `fr`, `de`, `ja`, and `x-default`.

## Sanity Schema Finalization

Schema objects added:

- `seoFields`
- `faqItem`
- `evidenceItem`
- `offerItem`
- `inquiryRouting`
- `contactPoint`

Document schemas now support:

- SEO fields: title, description, canonical path, OG image, image alt, noindex.
- GEO/AEO fields: FAQs, evidence/claim records, published/modified dates.
- Product structured data fields: SKU, brand, material, dimensions, offers.
- Inquiry routing fields: form ID, recipient email, subject prefix, CRM pipeline, success message.
- Migration fields: legacy URLs.
- Organization/contact fields: contact points and sameAs social profiles.

## Import Preparation

`scripts/import-to-sanity.mjs` now enriches imported documents with:

- `seo` defaults derived from existing title/description/meta/image fields.
- `legacyUrls` derived from `sourceUrl`.
- `imageAlt` defaults from document titles.
- `datePublished` and `dateModified` derived from source dates.
- Product `brand`, `sku`, `material`, `dimensions`, and inquiry-only offers where available.
- Inquiry routing defaults for product, category, solution, project, and content pages.
- Organization contact points and social profiles for site settings.

Frontend image URLs are normalized with URI encoding before rendering. This prevents raw Chinese source filenames from entering Next.js image preload headers and causing production-mode `ByteString` header errors.

## Inquiry Backend Decision

Phase 1 decision:

- Use a Vercel serverless API as the submission layer in Phase 3.
- Use email notification as the baseline destination.
- Keep Sanity as the CMS for routing/configuration only, not as the inquiry database.
- Keep schema fields backend-agnostic so HubSpot, Zoho, Airtable, Google Sheets, or a database adapter can be added later without another schema redesign.

## Verification Evidence

- `npm run i18n:generate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npx sanity schemas validate`: passed with 0 errors and 0 warnings.
- `npm run intco:routes -- --base http://127.0.0.1:3001 --all --expect-canonical 247 --expect-unique-canonical 244 --expect-localized 1482`: passed.
- `.omx/intco-parity/route-results.json`: 1482 checked, 1482 passed, 0 failed.
- Core visible text audit: 50 non-English representative pages checked, 0 high-risk English UI leakage findings.
- Production-mode raw-CJK image URL smoke: 30 Japanese pages with Chinese source filenames returned 200 and produced no `ByteString` server log errors after URL normalization.

Latest recheck:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npx sanity schemas validate`: passed with 0 errors and 0 warnings.
- `npm run i18n:generate`: passed; existing Spanish, Portuguese, French, German, and Japanese seeds were detected and skipped.
- Full route verification: 1482 checked, 1482 passed, 0 failed.
- 50-page non-English UI phrase leak audit: 0 findings.

## Phase 1 Exit Criteria

- No high-risk English leakage in non-English core pages: complete.
- Sanity schema supports SEO/GEO/product/inquiry/migration needs: complete.
- Inquiry backend decision is made: complete.
- `npm run lint` passes: complete.
- `npm run build` passes: complete.
- Route/i18n verification passes: complete.

## Next Phase

Phase 2 can begin after explicit confirmation to work on Sanity datasets/imports.
