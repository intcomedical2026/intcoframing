from __future__ import annotations

import argparse

from intco_parity_lib import PARITY_ROOT, entry_filter, now_stamp, parse_html, read_manifest, request_text, update_ledger, write_json


def main() -> int:
    parser = argparse.ArgumentParser(description="Snapshot source INTCO pages without mutating seed data.")
    parser.add_argument("--manifest", default=str(PARITY_ROOT / "canonical-manifest.json"))
    parser.add_argument("--batch")
    parser.add_argument("--entry")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()

    entries = entry_filter(read_manifest(args.manifest), args)
    if not args.all and not args.batch and not args.entry and not args.limit:
        parser.error("Use --all, --batch, --entry, or --limit to make the snapshot scope explicit.")

    failures = []
    for index, entry in enumerate(entries, 1):
        status, raw, final_url = request_text(entry["sourceUrl"])
        parsed = parse_html(raw, entry["sourceUrl"]) if status else {"text": [], "images": [], "headings": []}
        payload = {
            "entryId": entry["entryId"],
            "canonicalPath": entry["canonicalPath"],
            "sourceUrl": entry["sourceUrl"],
            "finalUrl": final_url,
            "status": status,
            "generatedAt": now_stamp(),
            "title": parsed.get("title", ""),
            "metaDescription": parsed.get("metaDescription", ""),
            "canonical": parsed.get("canonical", ""),
            "hreflangs": parsed.get("hreflangs", []),
            "headings": parsed.get("headings", []),
            "images": parsed.get("images", []),
            "links": parsed.get("links", []),
            "text": parsed.get("text", []),
            "textHash": parsed.get("textHash", ""),
        }
        out = PARITY_ROOT / "source-snapshots" / f"{entry['entryId']}.json"
        write_json(out, payload)
        ok = status == 200 and bool(parsed.get("text"))
        update_ledger(
            entry["entryId"],
            {
                "checks": {"sourceSnapshot": "PASS" if ok else "FAIL"},
                "evidence": {"sourceSnapshot": str(out)},
            },
        )
        if not ok:
            failures.append({"entryId": entry["entryId"], "status": status, "sourceUrl": entry["sourceUrl"]})
        print(f"[{index}/{len(entries)}] {entry['entryId']} source status={status} text={len(parsed.get('text', []))} images={len(parsed.get('images', []))}")

    write_json(PARITY_ROOT / "source-snapshot-failures.json", failures)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
