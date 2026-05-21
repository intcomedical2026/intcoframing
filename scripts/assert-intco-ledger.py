from __future__ import annotations

import argparse

from intco_parity_lib import load_json


def main() -> int:
    parser = argparse.ArgumentParser(description="Assert INTCO no-sampling ledger status.")
    parser.add_argument("--ledger", default=".omx/intco-parity/ledger.json")
    parser.add_argument("--canonical-count", type=int, required=True)
    parser.add_argument("--unique-canonical-count", type=int, required=True)
    parser.add_argument("--localized-count", type=int, required=True)
    parser.add_argument("--batch")
    parser.add_argument("--no-sampling", action="store_true")
    parser.add_argument("--allow-pending", action="store_true")
    args = parser.parse_args()

    ledger = load_json(args.ledger)
    entries = ledger.get("entries", [])
    if args.batch:
        entries = [entry for entry in entries if entry.get("batch") == args.batch or entry.get("batch", "").startswith(args.batch)]

    failures = []
    stats = ledger.get("stats", {})
    expected = {
        "semanticEntries": args.canonical_count,
        "uniqueCanonicalUrls": args.unique_canonical_count,
        "localizedRouteChecks": args.localized_count,
    }
    for key, value in expected.items():
        if stats.get(key) != value:
            failures.append({"key": key, "expected": value, "actual": stats.get(key)})
    if args.no_sampling:
        sampled = [entry["entryId"] for entry in entries if entry.get("sampleOnly")]
        if sampled:
            failures.append({"key": "sampleOnly", "entries": sampled})
    if not args.allow_pending:
        pending = [entry["entryId"] for entry in entries if entry.get("status") != "done"]
        if pending:
            failures.append({"key": "pendingEntries", "count": len(pending), "entries": pending[:25]})

    if failures:
        print(f"Ledger assertion failed: {failures}")
        return 1

    done = len([entry for entry in entries if entry.get("status") == "done"])
    print(f"Ledger OK: checked={len(entries)} done={done} pending={len(entries) - done} noSampling={args.no_sampling}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
