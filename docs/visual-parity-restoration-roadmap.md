# INTCO Visual Parity Restoration Roadmap

Last updated: 2026-05-30

This is the durable long-term goal for restoring the refreshed Next/Vercel site to 1:1 visual and interaction parity with the original INTCO Framing WordPress site.

## Long-Term Goal

Restore every supported page, every visible section, and every important interaction so the refreshed site matches the original site as closely as the current technology stack allows, while preserving the existing launch-critical configuration:

- LeadsCloud/询盘云 enterprise ID, form IDs, chat behavior, cart `productList` context, and form-before-download behavior.
- GTM ID, Google verification, analytics placement, and original-site external-service assumptions.
- Sanity project/dataset/schema wiring, imported content, localized URL structure, and Studio route.
- SEO/GEO work already completed: canonical, hreflang, sitemap, robots, JSON-LD, FAQ/evidence fields, redirects, and metadata.
- Vercel deployment behavior, environment-variable strategy, and performance fixes that do not alter visible parity.

The primary change surface is style, layout, animation timing, responsive behavior, and source-site visual fidelity. Business logic and integration configuration are protected unless a mismatch is proven against the original site and recorded before editing.

## Source of Truth

- Original visual baseline: `https://www.intcoframing-us.com/` while it still serves the WordPress site.
- Refreshed test site: `https://intcoframing-wheat.vercel.app/`.
- Local verification site: `http://127.0.0.1:3000` after `npm run build && npm run start`.
- Existing launch docs remain authoritative for non-visual gates, especially `docs/launch-roadmap.md`, `docs/phase-3-external-launch-gates-20260529.md`, and `docs/phase-3-performance-optimization-20260529.md`.

If the final domain later points to Vercel, archive the original WordPress screenshots before DNS changes. After that switch, the archived screenshots become the visual baseline.

## Non-Negotiable Rules

- Do not remove visible source-site sections to improve scores.
- Do not change LeadsCloud IDs, GTM ID, Google verification, Sanity project/dataset, canonical/hreflang rules, sitemap behavior, or 301 redirect mappings during a visual fix unless the owner explicitly requests it.
- Do not replace original-site imagery with invented imagery.
- Do not use JavaScript language switching; each locale remains a real URL.
- Do not mark a page visually complete from memory. Completion requires side-by-side screenshots or browser evidence.
- Do not batch unrelated templates into one large visual rewrite. Fix one route family at a time.
- Do not call a mismatch acceptable just because the layout is "modern" or "cleaner"; the target is original-site parity.

## Audit Method

For each route family:

1. Capture the original page and refreshed page.
   - Desktop: 1440px and 1920px widths.
   - Mobile: 390px width.
   - Use full-page screenshots and section-level screenshots for complex areas.
2. Inventory every visible section in order.
   - Header/top bar, navigation, dropdowns, hero, breadcrumbs, cards, forms, CTA bands, footer, floating actions, cookie/chat overlays, and mobile states.
3. Record section-level differences.
   - Layout dimensions, spacing, typography, colors, image crop, background treatment, hover states, animation timing, reveal behavior, slider behavior, sticky/fixed behavior, and responsive breakpoints.
4. Classify findings.
   - P0: missing section, wrong route state, broken interaction, wrong major layout, or integration regression.
   - P1: obvious visual mismatch, wrong animation, wrong image crop, wrong mobile behavior, or wrong typography/spacing.
   - P2: minor spacing, minor copy wrapping, low-impact hover/detail mismatch.
5. Implement scoped fixes.
   - Prefer existing components and CSS patterns.
   - Keep changes style/layout-oriented unless evidence proves a structural mismatch.
   - Preserve current SEO, i18n, Sanity, LeadsCloud, and performance behavior.
6. Verify before moving on.
   - Rebuild/lint as needed.
   - Re-capture screenshots.
   - Run interaction checks for menus, breadcrumbs, language switcher, product enquiry/cart, form embeds, sliders, videos, and accordions where relevant.
   - Record screenshots/reports under `reports/visual-parity/`.

## Page Batches

### Batch A: Shared Chrome and Homepage

Scope:

- Global top bar, social icons, language switcher, cart button, header navigation, mega menus, mobile menu, footer, floating actions, cookie/chat behavior, homepage sections, homepage carousel, product rows, solutions/cards, projects/blog blocks, and bottom CTA.

Exit criteria:

- Homepage desktop and mobile screenshots match the original site section-by-section.
- Shared header/footer behavior matches on representative inner pages.
- Existing performance improvements remain, but not at the expense of visual parity.

### Batch B: Product Landing, Category Pages, and Product Details

Scope:

- `/products`
- Root categories such as `/mirror`, `/picture-frame`, `/art`, `/furniture`, `/memo-board`
- Child category pages and representative product detail pages
- Product enquiry/cart flow and LeadsCloud product context

Exit criteria:

- Category hero, breadcrumb, filters/lists/grids, enquiry forms, product card states, and detail layout match the original templates.
- Product pages keep current Sanity data and inquiry integrations.

### Batch C: Solutions

Scope:

- `/solutions`
- `/solutions/business-insights-trends`
- `/solutions/design-engineering`
- `/solutions/manufacturing-delivery`
- `/solutions/global-production-and-supply`
- `/solutions/certification`
- `/solutions/retailer-support`

Exit criteria:

- Each solution detail page uses the source-site section structure, animation, card grid, video/embed, and responsive behavior in all supported locales.
- No locale falls back to plain text when the English page has source-style structure.

### Batch D: Projects

Scope:

- `/projects`
- `/projects/page/2`
- `/projects/page/3`
- `/projects/commercial`
- `/projects/residential`
- Representative project detail pages

Exit criteria:

- Listing, pagination, category pages, project cards, detail layouts, and CTA/contact blocks match the original site.
- Pagination and breadcrumb clicks remain responsive.

### Batch E: Contact and Company Pages

Scope:

- `/contact`
- `/who-we-are`
- `/who-we-are/philosophy`
- `/who-we-are/sustainability`
- Map tabs, factory blocks, contact information, contact form embeds, timeline/culture/sustainability sections, and all CTA microcopy.

Exit criteria:

- Contact and company pages visually match the original site, including forms and map/tab behavior.
- LeadsCloud slots remain original-config compatible.

### Batch F: Blog/News

Scope:

- `/blog`
- `/news/...` detail pages
- Category/date/card/list/detail templates

Exit criteria:

- Blog/news landing and detail pages match the original structure and visual rhythm.
- SEO/FAQ/dateModified data remains intact.

### Batch G: Multilingual Visual Pass

Scope:

- `/es`, `/pt`, `/fr`, `/de`, `/ja` versions of all templates above.

Exit criteria:

- Non-English pages keep the same visual structure as English and the original-site template.
- No English leakage in navigation, CTA, forms, section headings, image alt where visible or metadata relevant.
- Longer translations do not overflow buttons, cards, breadcrumbs, or mobile menus.

## Evidence Artifacts

Use these paths so progress survives context compaction:

- `reports/visual-parity/original/<route-slug>/<viewport>.png`
- `reports/visual-parity/current/<route-slug>/<viewport>.png`
- `reports/visual-parity/diff/<route-slug>/<viewport>.png`
- `reports/visual-parity/audits/<route-slug>.md`
- `reports/visual-parity/summary-YYYYMMDD.md`

Every completed route family should include:

- Original screenshot path.
- Current screenshot path.
- Difference notes.
- Fix commit(s).
- Verification commands.
- Remaining accepted differences, if any.

## Protected Configuration Checklist

Run this checklist after each batch:

- `npm run lint`
- `npm run build`
- `npm run launch:verify -- --base <local-or-vercel-url> --allowExternalPending --report <report-path>`
- Confirm no intentional changes to:
  - LeadsCloud enterprise/form IDs.
  - GTM and Google verification.
  - Sanity project/dataset/API version.
  - Canonical/hreflang URL rules.
  - Sitemap/robots output.
  - Legacy redirects.
  - Language URL prefixes.

## Immediate Next Work

Start with Batch A because shared chrome and the homepage affect every page. The first implementation task is not to edit styles immediately; it is to capture original/current screenshots, create the Batch A audit file, and list every mismatch by section before making fixes.
