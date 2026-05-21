from __future__ import annotations

import sys

from intco_parity_lib import (
    LOCALES,
    LOCALIZED_SEED_PATH,
    PARITY_ROOT,
    REPORT_ROOT,
    SEED_PATH,
    build_manifest,
    initial_ledger,
    load_json,
    localized_routes,
    manifest_stats,
    write_json,
)


EXPECTED_STATS = {
    "semanticEntries": 247,
    "uniqueCanonicalUrls": 244,
    "localizedRouteChecks": 1482,
    "duplicateSemanticUrls": ["/blog", "/projects", "/solutions"],
}


def main() -> int:
    if not SEED_PATH.exists():
        print(f"Missing seed file: {SEED_PATH}", file=sys.stderr)
        return 2

    seed = load_json(SEED_PATH)
    entries = build_manifest(seed)
    routes = localized_routes(entries)
    stats = manifest_stats(entries, routes)

    failures = []
    for key, expected in EXPECTED_STATS.items():
        if stats.get(key) != expected:
            failures.append({"key": key, "expected": expected, "actual": stats.get(key)})
    if len(LOCALES) != 6:
        failures.append({"key": "locales", "expected": 6, "actual": len(LOCALES)})
    if LOCALIZED_SEED_PATH.exists():
        localized = load_json(LOCALIZED_SEED_PATH)
        available = sorted(localized.keys()) if isinstance(localized, dict) else []
        missing = [locale for locale in LOCALES if locale != "en" and locale not in available]
        if missing:
            failures.append({"key": "localizedSeedLocales", "expected": LOCALES, "actual": available})

    existing_ledger_path = PARITY_ROOT / "ledger.json"
    existing_entries = {}
    if existing_ledger_path.exists():
        existing = load_json(existing_ledger_path)
        existing_entries = {entry.get("entryId"): entry for entry in existing.get("entries", [])}

    ledger = initial_ledger(entries, stats)
    for entry in ledger["entries"]:
        previous = existing_entries.get(entry["entryId"])
        if previous:
            entry.update({
                "status": previous.get("status", entry["status"]),
                "checks": previous.get("checks", entry["checks"]),
                "evidence": previous.get("evidence", entry["evidence"]),
            })

    write_json(PARITY_ROOT / "canonical-manifest.json", entries)
    write_json(PARITY_ROOT / "localized-routes.json", routes)
    write_json(PARITY_ROOT / "manifest-stats.json", stats)
    write_json(PARITY_ROOT / "ledger.json", ledger)
    write_json(REPORT_ROOT / "manifest-stats.json", stats)

    failure_path = PARITY_ROOT / "manifest-failures.json"
    if failures:
        write_json(failure_path, failures)
        print(f"Manifest assertions failed: {failures}", file=sys.stderr)
        return 1
    if failure_path.exists():
        failure_path.unlink()

    print(
        "Manifest OK: "
        f"{stats['semanticEntries']} semantic entries, "
        f"{stats['uniqueCanonicalUrls']} unique canonical URLs, "
        f"{stats['localizedRouteChecks']} localized route checks, "
        f"duplicates={stats['duplicateSemanticUrls']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
