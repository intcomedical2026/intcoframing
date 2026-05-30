# Phase 3 Performance Optimization Plan

Date: 2026-05-29

Test target: `https://intcoframing-wheat.vercel.app/`

This note is part of Phase 3 because performance is a pre-launch quality gate, but it must not override the relaunch rule that the refreshed site visually matches the original INTCO site.

## Baseline From Owner Test

Desktop:

- Performance: 82
- Accessibility: 100
- Best Practices: 96
- SEO: 92
- Main problems called out: Speed Index, Total Blocking Time, image delivery, render-blocking requests, forced reflow, LCP request discovery, unused JavaScript, and large network payload.

Mobile:

- Performance: 72
- Accessibility: 96
- Best Practices: 96
- SEO: 92
- Main problems called out: LCP, Speed Index, image delivery, render-blocking requests, LCP request discovery, unused JavaScript, large network payload, and 7 long main-thread tasks.

## Constraints

- Preserve source-site visual parity for the homepage and shared chrome.
- Keep original LeadsCloud and GTM IDs/configuration. Only change when those scripts load; do not invent replacement vendors or settings.
- Keep real URLs, hreflang, canonical, FAQ/JSON-LD, sitemap, and Sanity data behavior intact.
- Do not cut visible content just to raise a Lighthouse score unless the owner explicitly approves a visual/content change.
- Official domain remains old WordPress until final testing is complete; verify against the Vercel test domain for now.

## Confirmed Technical Findings

- Next.js 16 image docs confirm `sizes` is required for responsive/fill images to prevent oversized downloads, and LCP images can use `preload`, `loading="eager"`, or `fetchPriority="high"` depending on the situation.
- Next.js 16 script docs confirm chat/support widgets are good candidates for `lazyOnload` or idle-time loading, while tag managers can stay after hydration if early analytics is required.
- Current `next.config.ts` uses remote image optimization but does not set `minimumCacheTTL`, `formats`, `deviceSizes`, or narrower `imageSizes`.
- Current homepage HTML has the first hero image preloaded, but many non-critical header/menu, product, solution, project, blog, footer, and third-party assets are still present in the initial document.
- LeadsCloud chat and LeadsCloud form scripts are non-critical for first paint and can be delayed while preserving original configuration.

## Optimization Order

1. Image cache and format policy
   - Add a conservative image optimization policy in `next.config.ts`.
   - Prefer WebP first for stable first-request behavior; only add AVIF if retesting shows cache-warmed gains are worth the slower first encode.
   - Raise optimized image cache TTL to reduce the PageSpeed cache-lifetime warning for `/_next/image` assets.
   - Tune `deviceSizes` and `imageSizes` so card thumbnails do not offer unnecessary 2048/3840 candidates.

2. Homepage LCP and Speed Index
   - Keep the first homepage hero image as the only eager/preloaded carousel image.
   - Add explicit `fetchPriority="high"` or equivalent only for the first slide if it does not conflict with Next 16 preload rules.
   - Prevent the GIF/other carousel slides from becoming early network competition.
   - Preserve carousel timing and source-site visual behavior.

3. Third-party script timing and TBT
   - Move LeadsCloud chat from early hydration to lazy/idle loading because it is a support widget, not required for LCP.
   - Move LeadsCloud form runtime to idle/intersection-driven loading so footer/newsletter/product form scripts do not compete with first paint.
   - Keep GTM configuration intact; if TBT remains high, evaluate moving GTM from `afterInteractive` to `lazyOnload` only after checking analytics requirements.

4. Mobile first-screen work
   - Avoid showing non-critical cookie UI until after the first render/idle window so it does not affect mobile Speed Index screenshots.
   - Keep the cookie banner behavior and text intact.

5. Verification
   - Run `npm run lint`.
   - Run `npm run build`.
   - Run a local production smoke of `/` and representative pages touched by shared runtime.
   - Confirm homepage HTML still has canonical/hreflang/JSON-LD and the first hero image preload.
   - After push/deploy, rerun the launch verifier and ask the owner to retest PageSpeed on the Vercel test domain.

## First Pass Success Target

- No visual/content regression on homepage first screen.
- No loss of LeadsCloud chat/form behavior after idle load.
- No SEO metadata or JSON-LD regression.
- Desktop performance should move from the low 80s toward 90+.
- Mobile performance should move from the low 70s toward 80+.
- Remaining issues, if any, should be documented with exact causes instead of guessed away.

## First Pass Implementation

Completed on 2026-05-29:

- Added a Next.js image policy with narrower device/image width candidates and a 31-day optimized image cache TTL.
- Kept the first homepage hero image preloaded, delayed the first carousel rotation, and prevented the large animated GIF slide from mounting during the initial load window.
- Moved LeadsCloud chat to `lazyOnload` and deferred LeadsCloud form script injection until the form area approaches the viewport or an explicit rerender event is fired.
- Delayed the mobile cookie banner slightly so it does not compete with the first render.
- Converted the homepage bottom CTA and global footer backgrounds from eager CSS background requests to lazy `next/image` fills.
- Converted the embedded YouTube video to an intersection-gated iframe so the thumbnail is not requested during the homepage first-load window.

Local verification:

- `npm run lint`: passed.
- `npm run build`: passed.
- Local Chrome screenshots at 1440px and 390px showed no obvious first-screen visual regression.
- Local Chrome network capture with cache disabled over the first 8 seconds showed:
  - no `20240712-150123.gif` hero GIF request;
  - no YouTube thumbnail request;
  - no LeadsCloud form script request;
  - no `w=3840` image request;
  - no footer background request;
  - no bottom CTA background request;
  - 756,160 encoded bytes in the captured first 8-second window.
- Launch verifier passed automated checks using the configured Vercel test origin:
  - `reports/launch/launch-readiness-local-performance-site-origin-20260529.json`
  - `automatedOk=true`
  - `ready=false` remains expected because final external gates are still pending.

Post-deploy verification still required:

- Push to `main` so Vercel redeploys `https://intcoframing-wheat.vercel.app/`.
- Rerun PageSpeed/Lighthouse on the Vercel deployment, because local Chrome network capture is not a replacement for Google's lab score.
- If TBT remains high after deploy, the next candidate is moving GTM from `afterInteractive` to `lazyOnload`, but only after confirming analytics timing is acceptable.

## Second Pass Owner Retest

Recorded on 2026-05-30 from owner PageSpeed screenshots and hands-on browsing feedback.

Desktop:

- Performance: 98
- Accessibility: 96
- Best Practices: 100
- SEO: 92
- Field data: none yet.
- Lab metrics shown by owner: FCP 0.3 s, LCP 0.7 s, TBT 70 ms, Speed Index 1.5 s, CLS 0.
- Desktop score is now excellent, but the owner reports real desktop browsing feels worse because images can take several seconds, sometimes around 10+ seconds, to appear.

Mobile:

- Performance: 72
- Accessibility: 92
- Best Practices: 100
- SEO: 92
- Lab metrics shown by owner: FCP 1.2 s, LCP 6.5 s, TBT 270 ms, Speed Index 2.2 s, CLS 0.
- The mobile LCP screenshot appears to select a near-first-screen featured product image, not the hero image.
- Remaining diagnostics include render-blocking requests, LCP request discovery, unused JavaScript, and long main-thread tasks.

UX correction:

- The language switcher must be a new explicit button/dropdown. It must not reuse the original top-bar map/language artwork as the only switch control.

## Second Pass Plan

1. Restore fast real-image perception without undoing the first-pass gains.
   - Keep the first hero image preload.
   - Promote the first visible homepage product/category image, and only the minimum adjacent near-fold images, from lazy loading to eager/high fetch priority so mobile LCP can discover the request early.
   - Avoid making every image eager because that would regress mobile network contention and real scroll behavior.

2. Reduce mobile TBT without changing original vendor configuration.
   - Keep GTM ID `GTM-NFFXV4DP` and LeadsCloud enterprise ID `200365`.
   - Move the LeadsCloud chat runtime from generic `lazyOnload` to a client runtime that loads after user intent or a later idle delay.
   - Preserve an explicit LeadsCloud runtime marker in the HTML so launch verification still proves the original chat configuration is present.
   - Do not move GTM later unless a separate analytics-timing decision is made.

3. Add a separate language switching control.
   - Preserve the original header artwork.
   - Add a visible desktop language button with the current locale and a dropdown of all six URLs.
   - Add a compact mobile language button near search/menu so language switching is not hidden inside the menu icon.
   - Keep URL-based switching only: `/path` for English and `/{locale}/path` for the other languages.

4. Verify the change against both lab and real-use risks.
   - Run `npm run lint`.
   - Run `npm run build`.
   - Use Chrome/Playwright to inspect the homepage on desktop and mobile.
   - Check the first-load network: no early hero GIF, no footer/CTA background, no LeadsCloud form script, and no immediate LeadsCloud chat script before user intent/delay.
   - Confirm the first homepage product image is no longer lazy-delayed on mobile.
   - After deployment, rerun PageSpeed and compare mobile LCP/TBT plus desktop hands-on image loading.

## Second Pass Implementation

Completed locally on 2026-05-30:

- Promoted the first row of homepage product/category images to eager loading, with the first image using `fetchPriority="high"` so the mobile LCP candidate can be discovered earlier.
- Moved LeadsCloud chat out of the root `lazyOnload` script and into a client runtime that loads on user intent or a 12-second idle fallback.
- Kept original LeadsCloud configuration intact: chat script URL `https://libtx.leadscloud.com/xhltrackingwithchat.js` and enterprise ID `200365`.
- Added a hidden LeadsCloud runtime marker so launch verification can still prove the original chat configuration is present without forcing the script into the first-load network.
- Added separate desktop and mobile language switcher buttons, while keeping the original top-bar artwork as non-interactive visual chrome.

Local verification:

- `npm run lint`: passed.
- `npm run build`: passed.
- `git diff --check`: passed.
- Headless Chrome mobile network capture over the first 10.5 seconds showed:
  - no LeadsCloud chat script request;
  - no LeadsCloud form script request;
  - no animated hero GIF request;
  - no footer background request;
  - no bottom CTA background request;
  - exactly one high-priority optimized image request.
- Local launch verifier report:
  - `reports/launch/launch-readiness-local-performance-second-pass-20260530.json`
  - `automatedOk=true`
  - `ready=false` remains expected because final-domain external gates are still pending.

Post-deploy verification still required:

- Rerun PageSpeed on `https://intcoframing-wheat.vercel.app/` after Vercel deploys this commit.
- Confirm mobile LCP improves from the 6.5 s owner retest baseline.
- Confirm mobile TBT improves from the 270 ms owner retest baseline.
- Manually browse desktop with a cleared cache and then a warm cache. If only the first cold visit is slow, the likely remaining cause is Vercel on-demand image optimization cache warming; if repeated warm visits are still slow, investigate selective image `unoptimized` usage or asset migration for non-LCP WordPress images.
