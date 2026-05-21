from __future__ import annotations

import argparse
from pathlib import Path

from intco_parity_lib import PARITY_ROOT, load_json, now_stamp, write_json


def main() -> int:
    parser = argparse.ArgumentParser(description="Export ignored .omx parity evidence into reports/intco-parity.")
    parser.add_argument("--ledger", default=str(PARITY_ROOT / "ledger.json"))
    parser.add_argument("--out", default="reports/intco-parity")
    parser.add_argument("--allow-open", action="store_true", help="Export interim reports even while ledger entries remain pending.")
    args = parser.parse_args()

    out = Path(args.out)
    ledger = load_json(args.ledger)
    entries = ledger.get("entries", [])
    failures = [entry for entry in entries if entry.get("status") != "done"]
    status_counts: dict[str, int] = {}
    for entry in entries:
        status_counts[entry.get("status", "unknown")] = status_counts.get(entry.get("status", "unknown"), 0) + 1

    route_report_path = PARITY_ROOT / "route-results.json"
    route_report = load_json(route_report_path) if route_report_path.exists() else {
        "checked": 0,
        "passed": 0,
        "failed": 0,
        "failures": [],
    }

    write_json(out / "final-ledger.json", ledger)
    write_json(out / "route-report.json", route_report)
    write_json(out / "failures.json", failures)
    summary = [
        "# INTCO Parity Report",
        "",
        f"Generated: {now_stamp()}",
        f"Semantic entries: {ledger.get('stats', {}).get('semanticEntries')}",
        f"Unique canonical URLs: {ledger.get('stats', {}).get('uniqueCanonicalUrls')}",
        f"Localized route checks: {ledger.get('stats', {}).get('localizedRouteChecks')}",
        f"Duplicate semantic URLs: {', '.join(ledger.get('stats', {}).get('duplicateSemanticUrls', []))}",
        f"Ledger status counts: {status_counts}",
        f"Route checks: checked={route_report.get('checked')} passed={route_report.get('passed')} failed={route_report.get('failed')}",
        f"Open failures: {len(failures)}",
    ]
    (out / "final-summary.md").parent.mkdir(parents=True, exist_ok=True)
    (out / "final-summary.md").write_text("\n".join(summary) + "\n", encoding="utf-8")
    print(f"Exported parity report to {out}")
    return 0 if args.allow_open or not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
