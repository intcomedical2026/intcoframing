# INTCO Framing Next.js + Sanity Rebuild

This project rebuilds `https://www.intcoframing-us.com` with Next.js, Tailwind CSS and Sanity CMS.

## Stack

- Next.js App Router
- Tailwind CSS
- Sanity Studio mounted at `/studio`
- Sanity Content Lake project: `o10sbz2i`
- Default dataset: `production`
- Vercel-ready environment variables

## Content Migration

The original WordPress site was crawled into:

```text
sanity/seed/intcoframing.seed.json
```

Current seed coverage:

- 108 products
- 80 blog/news posts
- 13 projects
- 25 product categories
- home page, site settings, solutions, contact/about pages

Refresh the crawl:

```bash
npm run crawl:intco
```

Import the seed into Sanity:

```powershell
$env:SANITY_API_TOKEN="sk..."
npm run sanity:import
```

By default the import writes every document plus the original image URLs. The frontend can render those URLs immediately. A Sanity token with Editor permissions is required.

To also copy remote images into Sanity image assets, run:

```powershell
$env:SANITY_API_TOKEN="sk..."
$env:SANITY_UPLOAD_ASSETS="true"
npm run sanity:import
```

Asset upload can take a long time because the migrated catalog has many product and gallery images.

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Sanity Studio:

```text
http://localhost:3000/studio
```

## Vercel Environment Variables

Set these in Vercel:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=o10sbz2i
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-20
```

If the Sanity dataset is private, also add a Viewer token:

```text
SANITY_API_READ_TOKEN=sk...
```

Only local/import jobs need the write token:

```text
SANITY_API_TOKEN=sk...
```

## Verification

```bash
npm run lint
npm run build
```

The route renderer preserves original-style paths such as:

```text
/mirror/led-mirror/classic-led-mirror
/news/top-frame-design-trends-in-2025-for-interiors-and-art-galleries
/projects/living-room
/solutions/business-insights-trends
```
