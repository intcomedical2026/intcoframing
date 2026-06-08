# Search Keyword Pagination Restoration Audit

Target: `https://www.intcoframing-us.com/index.php?keyword=`

Scope: empty-keyword search pagination, including `/index.php?keyword=` and `/page/N/?keyword=` pages visible in the source pagination.

## Before

- Local `/page/2?keyword=` rendered the Next 404 shell instead of the source search result list.
- Source `/page/2/?keyword=` rendered page 2 of the same empty-keyword search list with 12 products and active pagination state `2`.

## Source Audit

- Source pagination contains 108 empty-keyword result items.
- Source page size is 12 items.
- Visible source pagination range is 9 pages.
- Source page 2 first item: `Aluminum Framed Rounded Corners Poster Frame`.
- Source page 2 last item: `Bi-Color Deep Iron Framed Round Mirror`.

Source screenshots:

- `reports/visual-parity/search-index-keyword/pagination-final/original/page-2-viewport.png`
- `reports/visual-parity/search-index-keyword/pagination-final/original/page-2-fullpage.png`

## Implementation

- Added route-aware handling for search pagination paths:
  - `/index.php?keyword=`
  - `/?keyword=`
  - `/page/2?keyword=` through `/page/9?keyword=`
- Added a route-scoped source snapshot for the empty-keyword search result ordering, images, and excerpts.
- Reused the source result list only for empty keyword search; non-empty keyword search still uses local product/blog filtering.
- Kept source-style pagination links, active page state, previous/next arrows, and 12 items per page.
- Preserved query-aware SEO for restored search pages: canonical, hreflang alternates, OpenGraph URL, and JSON-LD page URL keep `?keyword=` instead of pointing at queryless `/page/N` paths.
- Restricted empty-keyword pagination to the source-observed 9 pages so `/page/10?keyword=` and higher do not create crawlable false search pages.
- Normalized repeated `keyword` query parameters by using the first value, matching Next.js string/string-array search parameter behavior.
- Kept non-empty keyword pagination functional by allowing `/page/N?keyword=<term>` only up to that term's actual local result page count.

## After Verification

Playwright DOM audit at `2048x1152`:

| Page | Local URL | Status | Visible 404 | Search list | Active page | Result count | Source title parity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `/index.php?keyword=` | 200 | No | Yes | 1 | 12 | Pass |
| 2 | `/page/2?keyword=` | 200 | No | Yes | 2 | 12 | Pass |
| 3 | `/page/3?keyword=` | 200 | No | Yes | 3 | 12 | Pass |
| 4 | `/page/4?keyword=` | 200 | No | Yes | 4 | 12 | Pass |
| 5 | `/page/5?keyword=` | 200 | No | Yes | 5 | 12 | Pass |
| 6 | `/page/6?keyword=` | 200 | No | Yes | 6 | 12 | Pass |
| 7 | `/page/7?keyword=` | 200 | No | Yes | 7 | 12 | Pass |
| 8 | `/page/8?keyword=` | 200 | No | Yes | 8 | 12 | Pass |
| 9 | `/page/9?keyword=` | 200 | No | Yes | 9 | 12 | Pass |

Negative route and SEO checks:

- `/page/10?keyword=` returns 404 because the source empty-keyword pagination ends at page 9.
- `/page/2` without `keyword` returns 404 and is not treated as a search page.
- `/page/2?keyword=a&keyword=b` does not crash; the first query value is normalized.
- `/page/2?keyword=` canonical and OpenGraph URL include `/page/2?keyword=`.
- `/page/2?keyword=` hreflang alternates include locale-specific `/page/2?keyword=` URLs.
- `/page/2?keyword=` JSON-LD `WebPage.url` includes `/page/2?keyword=`.
- `/page/2?keyword=` language switcher links preserve `?keyword=` so localized links do not point at queryless `/page/2` routes.
- `/page/2?keyword=mirror` renders search results instead of following a generated pagination link to 404.
- `/page/999?keyword=mirror` returns 404 because it exceeds the actual filtered result page count.
- Non-empty keyword pages after page 1 avoid cross-locale hreflang/page-switcher URLs that may not exist in every localized search result set.

Current screenshots:

- `reports/visual-parity/search-index-keyword/pagination-final/current/page-2-viewport.png`
- `reports/visual-parity/search-index-keyword/pagination-final/current/page-2-fullpage.png`

## Remaining Differences

- The source screenshot can show third-party LeadsCloud/cookie overlays depending on vendor script timing and browser storage state. The local page preserves the existing LeadsCloud runtime and cookie banner behavior rather than hard-coding or faking those overlays.
- Source WordPress page titles for pages 2-6 are inconsistent (`Industry News`, PHP warning text, `Inspiration`). Local metadata uses normalized search-result titles while preserving the visible page content and pagination behavior.
