from __future__ import annotations

import argparse

from intco_parity_lib import PARITY_ROOT, entry_filter, full_url, parse_html, read_manifest, request_text, update_ledger, write_json


VIEWPORTS = [
    {"name": "desktop", "width": 1440, "height": 900},
    {"name": "mobile", "width": 390, "height": 844},
]


def main() -> int:
    parser = argparse.ArgumentParser(description="Record structural visual-readiness evidence for Browser plugin screenshot checks.")
    parser.add_argument("--manifest", default=str(PARITY_ROOT / "canonical-manifest.json"))
    parser.add_argument("--base", default="http://127.0.0.1:3000")
    parser.add_argument("--batch")
    parser.add_argument("--entry")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()

    entries = entry_filter(read_manifest(args.manifest), args)
    if not args.all and not args.batch and not args.entry and not args.limit:
        parser.error("Use --all, --batch, --entry, or --limit to make the visual evidence scope explicit.")

    failures = []
    for index, entry in enumerate(entries, 1):
        status, raw, final_url = request_text(full_url(args.base, entry["canonicalPath"]))
        parsed = parse_html(raw, args.base) if status else {"text": [], "images": [], "headings": []}
        checks = {
            "status": status == 200,
            "hasHeadings": bool(parsed.get("headings")),
            "hasImages": bool(parsed.get("images")),
            "hasBodyText": len(parsed.get("text", [])) >= 8,
            "viewportEvidencePlanned": len(VIEWPORTS) == 2,
        }
        ok = all(checks.values())
        out = PARITY_ROOT / "visual-evidence" / f"{entry['entryId']}.json"
        write_json(
            out,
            {
                "entryId": entry["entryId"],
                "path": entry["canonicalPath"],
                "url": full_url(args.base, entry["canonicalPath"]),
                "finalUrl": final_url,
                "method": "browser-plugin-required; structural preflight only",
                "viewports": VIEWPORTS,
                "checks": checks,
                "textCount": len(parsed.get("text", [])),
                "imageCount": len(parsed.get("images", [])),
                "headingCount": len(parsed.get("headings", [])),
            },
        )
        update_ledger(
            entry["entryId"],
            {
                "checks": {"visualPreflight": "PASS" if ok else "FAIL"},
                "evidence": {"visualPreflight": str(out)},
            },
        )
        if not ok:
            failures.append({"entryId": entry["entryId"], "path": entry["canonicalPath"], "checks": checks})
        print(f"[{index}/{len(entries)}] {entry['entryId']} visual-preflight={'PASS' if ok else 'FAIL'}")

    write_json(PARITY_ROOT / "visual-preflight-failures.json", failures)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
