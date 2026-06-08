# Product Detail Restoration Diff Record

Product: Classic LED Mirror  
Path: `/mirror/led-mirror/classic-led-mirror`  
Batch: 001  
Captured: 2026-06-04

## Evidence Files

- Source audit: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/before-audit.json`
- Source viewport: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/before-original/viewport.png`
- Source long page: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/before-original/long.png`
- Local viewport before fix: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/before-current/viewport.png`
- Local long page before fix: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/before-current/long.png`

## Source Observations

- Source URL returns 200 and renders the product detail page, not a 404.
- Hero uses a full-width product background, centered product title, breadcrumb row, and two pill CTA links.
- Main product area is a grey band with three desktop columns: left categories and best sellers, center product image/gallery area, right quote/specification card.
- The page continues into `ABOUT THIS ITEM`, related products, services, footer, floating contact actions, and cookie banner.

## Local Before-Fix Observations

- Local URL returns 200 and has product detail DOM markers, but the rendered page does not visually match the source.
- Product detail source classes such as `banner`, `Products1Content`, `Productsprodis-right`, `AboutThisItemText`, and `BESTSwiper` have little or no matching CSS in `src/app/globals.css`.
- The hero image expands into an oversized blurred area, and the visible title/breadcrumb/CTA treatment from the source is missing from the viewport.
- The center product image/gallery column present on the source page is missing from the React detail layout.
- Product content appears too short visually; the footer arrives immediately after the oversized hero instead of after the source-style product, about, related, and services sections.
- The source screenshot shows the cookie banner on this product page. The current local cookie banner logic only renders on the home/search pages; this is recorded as a later global parity check because the first blocking issue is the missing product detail layout.

## Batch 001 Fix Scope

- Restore only product-detail visual/layout code needed for this first product page batch.
- Do not change LeadsCloud inquiry links, Sanity data, Vercel config, SEO metadata, hreflang/canonical, sitemap/robots, redirects, or GTM.
- Do not advance to product batch 002 until this batch has fresh local screenshots and a verification record.

## Final Verification

- Final audit: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/audit.json`
- Final source screenshot: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/original/long.png`
- Final local screenshot: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/current/long.png`
- Final local DOM: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/current/dom.html`
- Final local text: `reports/visual-parity/search-product-pages/001-mirror-classic-led-mirror/current/text.txt`

Verification commands completed:

- `npx tsc --noEmit --incremental false` passed.
- `npm run lint` passed with 0 errors and 7 pre-existing warnings.
- `npm run build` passed.
- `node scripts/audit-search-product-page.mjs /mirror/led-mirror/classic-led-mirror 1 Classic LED Mirror` passed with source/local status 200 and matching product H1.

Final visual status: Batch 001 is verified for progression to the next product page. Remaining non-blocking audit note: the browser title differs because the source dump does not expose a stable `<title>` value while local correctly emits `Classic LED Mirror | INTCO Framing`.
