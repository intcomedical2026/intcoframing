# Final Domain Preflight

Date: 2026-05-29

Target:

```text
https://www.intcoframing-us.com
```

Status: Not ready for Phase 3 completion or Phase 4 launch validation.

## Command

```bash
npm run launch:verify -- \
  --base https://www.intcoframing-us.com \
  --expected-origin https://www.intcoframing-us.com \
  --expected-sitemap-count 1476 \
  --legacy-limit 40 \
  --allow-external-pending \
  --report reports/launch/launch-readiness-final-domain-preflight-20260529.json
```

## Report

```text
reports/launch/launch-readiness-final-domain-preflight-20260529.json
```

Summary:

```text
ready=false
automatedOk=false
externalOk=false
```

## Findings

- The final public domain is still serving the old Cloudflare/WordPress site, not the refreshed Next/Vercel site.
- Response headers for `/` show `server: cloudflare` and `content-type: text/html; charset=UTF-8`.
- `https://www.intcoframing-us.com/robots.txt` still points to `https://www.intcoframing-us.com/wp-sitemap.xml`.
- `https://www.intcoframing-us.com/sitemap.xml` returns the old site's 404 HTML, not the new Next sitemap.
- The new multilingual sitemap expectation is not met: expected 1476 canonical URLs; observed 0 `<loc>` entries from `/sitemap.xml`.
- Representative pages do not contain the refreshed site's canonical, full hreflang set, or expected JSON-LD nodes.
- Sampled legacy WordPress URLs still return 200 at trailing-slash WordPress URLs instead of 301 redirecting to no-trailing-slash refreshed routes.

## Positive Finding

LeadsCloud is already enabled for the final domain according to the original runtime endpoint:

```text
POST https://fetchip.leadscloud.com/visitor-chat/track/getStatus
orgId=200365
website=intcoframing-us.com
```

Verifier result:

```text
leadsCloudDomain.ok=true
statusListLength=1
useStatus=1
matomoSiteId=25957
container=4FufP67P
```

This confirms the original LeadsCloud account recognizes the effective final-domain host `intcoframing-us.com`.

## Required Before Retesting

- Point `www.intcoframing-us.com` to the refreshed Vercel Production deployment.
- Set Vercel Production `NEXT_PUBLIC_SITE_URL=https://www.intcoframing-us.com`.
- Redeploy Production after the environment change.
- Confirm Sanity CORS includes `https://www.intcoframing-us.com`.
- Then rerun the final-domain verifier with `--legacy-limit all`.

Do not mark Phase 3 complete from this report. This report proves the final domain has not yet switched to the refreshed site.

