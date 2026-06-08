# Batch 006 - Aluminum Framed Mirror Diff Record

Source URL: https://www.intcoframing-us.com/mirror/led-mirror/arched-led-vanity-mirror/
Local URL: http://127.0.0.1:3000/mirror/led-mirror/arched-led-vanity-mirror
Initial audit: reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/audit.json

## Initial Evidence

- Source status: 200
- Local status: 200
- Source H1/H2: `Aluminum Framed Mirror`
- Local H1/H2 before fix: `Arched LED Vanity Mirror`
- Source title tag: `Arched LED Vanity Mirror`
- Local title tag before fix: `Aluminum Framed Mirror | INTCO Framing`
- Source screenshots:
  - `reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/original/viewport.png`
  - `reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/original/long.png`
- Local screenshots before fix:
  - `reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/current/viewport.png`
  - `reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/current/long.png`

## Differences To Restore

1. Product visible title:
   - Source visible product title is `Aluminum Framed Mirror`.
   - Local rendered `Arched LED Vanity Mirror` because product detail rendering used the first `bodyText` line instead of the source product title.

2. Main product media:
   - Source displays two large vertical product images in the center column using `2025/12/未标题-3.jpg` then `2025/12/未标题-1.jpg`.
   - Local displayed one framed gallery box with thumbnails, which does not match the source page for this product.

3. Related products:
   - Source related product order visible in text/links:
     `Elegant Oval LED Mirror`,
     `Arched Alumium Framed LED Bathroom Wall Mounted Mirror`,
     `Classic LED Mirror`,
     `Aluminum Framed Mirror`,
     `Hollywood Vanity LED Mirror`,
     `Iron Framed LED Mirror with Shelf`.
   - Local related product order before fix:
     `Classic LED Mirror`,
     `Elegant Oval LED Mirror`,
     `Modern Square LED Mirror`,
     `Wavy Edge LED Mirror`,
     `Hollywood Vanity LED Mirror`,
     `Sleek Deep-Edge Aluminum Alloy Round Mirror`.

4. Shared protected areas:
   - Do not change LeadsCloud / inquiry cloud runtime, Sanity configuration, Vercel config, SEO alternates/canonical, sitemap/robots, redirects, or GTM.
   - This batch should stay inside product-detail source-style rendering and local source visual evidence files.

## Restoration Applied

- Product detail visible title now uses the source search title for this route, so the hero and product H1 render `Aluminum Framed Mirror`.
- Batch-specific product media now renders the two source detail images:
  - `https://www.intcoframing-us.com/wp-content/uploads/2025/12/未标题-3.jpg`
  - `https://www.intcoframing-us.com/wp-content/uploads/2025/12/未标题-1.jpg`
- Product description now prefers the source body detail line, matching `This Aluminum Framed Mirror creates...`.
- Related products now use the source order and source cards:
  `Elegant Oval LED Mirror`,
  `Arched Alumium Framed LED Bathroom Wall Mounted Mirror`,
  `Classic LED Mirror`,
  `Aluminum Framed Mirror`,
  `Hollywood Vanity LED Mirror`,
  `Iron Framed LED Mirror with Shelf`.
- Related visual layout was adjusted to source carousel behavior: one large visible related product card with the remaining related items retained in DOM order.

## Final Verification

- Final audit: `reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/audit.json`
- Final local screenshot: `reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/current/long.png`
- Final source screenshot: `reports/visual-parity/search-product-pages/006-arched-led-vanity-mirror/original/long.png`
- Source/local HTTP status: 200 / 200
- H1/H2 mismatch: false
- Categories present: true / true
- Best sellers present: true / true
- Specs present: true / true
- Residual audit note: `titleMismatch` remains true because the source HTML title is `Arched LED Vanity Mirror` while the local SEO title remains `Aluminum Framed Mirror | INTCO Framing`. This batch did not alter SEO/canonical/hreflang systems per the protected-configuration requirement.
- Validation commands:
  - `npx tsc --noEmit --incremental false`: passed
  - `npm run lint`: passed with 0 errors and 7 existing warnings
  - `npm run build`: passed
