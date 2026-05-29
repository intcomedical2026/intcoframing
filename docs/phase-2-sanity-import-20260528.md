# Phase 2 Sanity Import

Generated: 2026-05-28

Status: Complete.

## Scope

Phase 2 is responsible for importing complete multilingual content into Sanity after Phase 1 schema and i18n work is stable.

This note records the staged import, production import, backups, and verification evidence.

## Import Model

The import pipeline now prepares one Sanity document per locale for each content entity.

Supported locales:

- `en`
- `es`
- `pt`
- `fr`
- `de`
- `ja`

Each prepared document includes:

- `language`
- `translationGroup`
- SEO defaults
- image alt defaults
- legacy URL mappings
- inquiry routing defaults
- product structured-data fields where available

English documents keep their source IDs. Non-English documents use stable localized IDs in the form `i18n.<locale>.<source-id>`.

## Frontend Read Strategy

The frontend query now asks Sanity for documents matching the current locale.

If localized Sanity documents exist for the requested locale, the frontend uses them directly. If they do not exist yet, it falls back to the English Sanity data and localizes it from the local seed. This keeps the site usable during the staged import window while still allowing Sanity to become the source of truth after import.

## Safety Guards

The import script now supports:

- `--dry-run`
- `--dataset`
- `--locales`
- `--report`

The script refuses to import into `production` unless `SANITY_ALLOW_PRODUCTION_IMPORT=true` is intentionally set.

`SANITY_API_TOKEN` is required only for real imports, not dry-runs.

Additional Phase 2 scripts:

- `npm run sanity:dataset:ensure -- --dataset staging`
- `npm run sanity:import -- --dataset staging`
- `npm run sanity:verify:import -- --dataset staging`

`sanity:dataset:ensure` creates or confirms the target dataset through `@sanity/client` and writes a dataset report.

`sanity:verify:import` performs a read-only content audit after import. It checks per-locale document counts, missing language/translation-group fields, SEO fields, image alt fields, legacy URL mappings, and product brand/offer fields.

## Dry-Run Evidence

Command:

```sh
npm run sanity:import:dry-run -- --dataset staging
```

Report:

- `reports/launch/sanity-import-dry-run-20260528T080222Z.json`

Summary:

- Project: `o10sbz2i`
- Dataset target: `staging`
- Dry run: true
- Total prepared documents: 1452
- Locales: `en`, `es`, `pt`, `fr`, `de`, `ja`
- Missing SEO fields: 0
- Missing image alt fields: 0
- Missing legacy URL fields: 0
- Missing language fields: 0
- Missing translation group fields: 0

Per-locale prepared counts:

- `siteSettings`: 1
- `homePage`: 1
- `productCategory`: 25
- `product`: 108
- `solution`: 6
- `project`: 13
- `blogPost`: 80
- `contentPage`: 8

Product structured-data preparation:

- Product spec-bearing records: 648
- SKU fields: 216
- Brand fields: 648
- Material fields: 15
- Dimensions fields: 108
- Offer records: 648

## Import Results

Current local environment:

- `SANITY_API_TOKEN`: present in `.env.local`
- Sanity CLI login state: not logged in locally; use `npx sanity login` if manual CLI dataset operations are needed

Dataset creation attempt:

```sh
npm run sanity:dataset:ensure -- --dataset staging --report reports/launch/sanity-dataset-staging-token-permission-20260528.json
```

Result:

- Failed because the token is missing the `sanity.project.datasets/create` grant.
- Report: `reports/launch/sanity-dataset-staging-token-permission-20260528.json`

Latest retry:

```sh
npm run sanity:dataset:ensure -- --dataset staging --report reports/launch/sanity-dataset-staging-latest-20260528.json
```

Result:

- Failed because the current token still lacks the `sanity.project.datasets/create` grant.
- Report: `reports/launch/sanity-dataset-staging-latest-20260528.json`

Staging verification command:

```sh
npm run sanity:verify:import -- --dataset staging --report reports/launch/sanity-import-verify-staging-missing-20260528.json
```

Result:

- Failed because dataset `staging` does not exist in project `o10sbz2i`.
- Report: `reports/launch/sanity-import-verify-staging-missing-20260528.json`

Current known datasets from token-based read:

- `production`
- `staging`

Staging dataset confirmation:

- Command: `npm run sanity:dataset:ensure -- --dataset staging --report reports/launch/sanity-dataset-staging-confirmed-20260528.json`
- Result: passed.
- Report: `reports/launch/sanity-dataset-staging-confirmed-20260528.json`

Staging import:

- Command: `npm run sanity:import -- --dataset staging --report reports/launch/sanity-import-staging-20260528-rerun.json`
- Result: passed, 1452/1452 documents imported.
- Report: `reports/launch/sanity-import-staging-20260528-rerun.json`

Staging import verification:

- Command: `npm run sanity:verify:import -- --dataset staging --report reports/launch/sanity-import-verify-staging-20260528-rerun.json`
- Result: passed.
- Report: `reports/launch/sanity-import-verify-staging-20260528-rerun.json`
- Count failures: 0
- Missing-field failure groups: 0

Staging backup:

- Command: `npx sanity datasets export staging backups/sanity-staging-20260528T084900Z.tar.gz --project-id o10sbz2i --overwrite`
- Result: passed, 1452/1452 documents exported, 0/0 assets.
- Backup: `backups/sanity-staging-20260528T084900Z.tar.gz`

Production pre-import backup:

- Command: `npx sanity datasets export production backups/sanity-production-pre-import-20260528T085100Z.tar.gz --project-id o10sbz2i --overwrite`
- Result: passed, 242/242 documents exported, 0/0 assets.
- Backup: `backups/sanity-production-pre-import-20260528T085100Z.tar.gz`

Production import:

- Command: `SANITY_ALLOW_PRODUCTION_IMPORT=true npm run sanity:import -- --dataset production --report reports/launch/sanity-import-production-20260528.json`
- Result: passed, 1452/1452 documents imported.
- Report: `reports/launch/sanity-import-production-20260528.json`

Production import verification:

- Command: `npm run sanity:verify:import -- --dataset production --report reports/launch/sanity-import-verify-production-20260528.json`
- Result: passed.
- Report: `reports/launch/sanity-import-verify-production-20260528.json`
- Count failures: 0
- Missing-field failure groups: 0

The earlier read-only production verification command:

```sh
npm run sanity:verify:import -- --dataset production --report reports/launch/sanity-import-verify-production-prephase2-20260528.json
```

Result:

- Failed as expected before Phase 2 import.
- Count failures: 48
- Missing-field failure groups: 1
- Existing production documents missing `language`: 242

This confirms production is not yet a complete localized Sanity source of truth and prevents the fallback-rendered frontend from being mistaken for a completed import.

That failing pre-import report is retained as baseline evidence. The production import verification report above is the current authoritative result.

## Frontend Verification

Staging frontend probe:

- Temporarily patched staging `homePage.heroSlides[0].title` to a unique probe marker.
- Built and started the app with `NEXT_PUBLIC_SANITY_DATASET=staging`.
- Confirmed the marker appeared in rendered HTML at `/`.
- Restored staging `homePage.heroSlides[0].title` to `INTCO FRAMING`.
- Report: `reports/launch/staging-frontend-probe-20260528.json`

Staging frontend smoke:

- Command: `node scripts/verify-staging-frontend-smoke.mjs http://127.0.0.1:3001`
- Result: passed, 12/12 representative pages.
- Report: `reports/launch/staging-frontend-smoke-20260528.json`

Production frontend smoke:

- Command: `node scripts/verify-staging-frontend-smoke.mjs http://127.0.0.1:3001 --dataset production --report reports/launch/production-frontend-smoke-20260528.json --no-probe`
- Result: passed, 12/12 representative pages.
- Report: `reports/launch/production-frontend-smoke-20260528.json`

Note: a full 1482-route staging verification run was attempted after staging import, but was stopped after more than five minutes with no output. The authoritative route/i18n coverage remains the Phase 1 full route pass. Phase 2 frontend evidence is the staging probe plus staging and production representative smoke tests.

## Verification Run After Phase 1

These commands passed before moving beyond local preparation:

- `npm run lint`
- `npm run build`
- `npx sanity schemas validate`
- `npm run i18n:generate`
- `npm run intco:routes -- --base http://127.0.0.1:3001 --all --expect-canonical 247 --expect-unique-canonical 244 --expect-localized 1482`

Route verification result:

- Checked: 1482
- Passed: 1482
- Failed: 0
- Count failures: 0

Additional UI text leak audit:

- Checked 50 representative non-English pages.
- High-risk English UI phrase findings: 0.

Latest tooling verification after adding Phase 2 helper scripts:

- `node --check scripts/verify-sanity-import.mjs`: passed.
- `node --check scripts/ensure-sanity-dataset.mjs`: passed.
- `node --check scripts/sanity-env.mjs`: passed.
- `node --check scripts/import-to-sanity.mjs`: passed.
- `node --check scripts/verify-staging-frontend-smoke.mjs`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npx sanity schemas validate`: passed with 0 errors and 0 warnings.

## Phase 2 Exit Criteria

- Staging import verified: complete.
- Production import completed: complete.
- Frontend renders content from Sanity without relying only on fallback seed: complete, proved by staging probe and production smoke.
- Sanity content can be edited safely in Studio: structurally complete; Studio manual editing UX still should be spot-checked by a logged-in project user during Phase 4 launch readiness.
