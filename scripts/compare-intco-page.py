from __future__ import annotations

import argparse
import re
import urllib.parse
from pathlib import Path

from intco_parity_lib import PARITY_ROOT, entry_filter, full_url, load_json, normalize_text, parse_html, read_manifest, request_text, update_ledger, write_json


COMMON_TEXT = {
    "Home",
    "Products",
    "Projects",
    "Solutions",
    "Blog",
    "Contact",
    "Search",
    "Menu",
}


def haystack(lines: list[str]) -> str:
    return " ".join(normalize_text(line).lower() for line in lines)


def contains_text(lines: list[str], needle: str) -> bool:
    value = normalize_text(needle)
    if len(value) < 3:
        return True
    local_text = haystack(lines)
    lowered = value.lower()
    if lowered in local_text:
        return True
    words = [word for word in re.findall(r"[a-z0-9]+", lowered) if len(word) > 2]
    if len(words) < 8:
        return False
    matches = sum(1 for word in words if word in local_text)
    return matches / len(words) >= 0.75


def image_name(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query)
    if query.get("url"):
        parsed = urllib.parse.urlparse(query["url"][0])
    path = urllib.parse.unquote(parsed.path)
    return Path(re.sub(r"[?#].*$", "", path)).name.lower()


def snapshot_for(entry: dict, refresh: bool = False) -> dict:
    path = PARITY_ROOT / "source-snapshots" / f"{entry['entryId']}.json"
    if path.exists() and not refresh:
        return load_json(path)
    status, raw, final_url = request_text(entry["sourceUrl"])
    parsed = parse_html(raw, entry["sourceUrl"]) if status else {"text": [], "images": [], "headings": []}
    payload = {
        "entryId": entry["entryId"],
        "canonicalPath": entry["canonicalPath"],
        "sourceUrl": entry["sourceUrl"],
        "finalUrl": final_url,
        "status": status,
        "title": parsed.get("title", ""),
        "metaDescription": parsed.get("metaDescription", ""),
        "headings": parsed.get("headings", []),
        "images": parsed.get("images", []),
        "links": parsed.get("links", []),
        "text": parsed.get("text", []),
        "textHash": parsed.get("textHash", ""),
    }
    write_json(path, payload)
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(description="Compare local English pages against source snapshots and manifest expectations.")
    parser.add_argument("--manifest", default=str(PARITY_ROOT / "canonical-manifest.json"))
    parser.add_argument("--base", default="http://127.0.0.1:3000")
    parser.add_argument("--batch")
    parser.add_argument("--entry")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--no-sampling", action="store_true")
    parser.add_argument("--fail-on-missing-copy", action="store_true")
    parser.add_argument("--fail-on-missing-image", action="store_true")
    parser.add_argument("--fail-on-module-drift", action="store_true")
    parser.add_argument("--mark-done", action="store_true")
    parser.add_argument("--refresh-source", action="store_true")
    args = parser.parse_args()

    entries = entry_filter(read_manifest(args.manifest), args)
    if not args.all and not args.batch and not args.entry and not args.limit:
        parser.error("Use --all, --batch, --entry, or --limit to make the comparison scope explicit.")
    if args.all and not args.no_sampling:
        parser.error("Full comparison requires --no-sampling.")

    failures = []
    for index, entry in enumerate(entries, 1):
        source = snapshot_for(entry, args.refresh_source)
        status, raw, final_url = request_text(full_url(args.base, entry["canonicalPath"]))
        local = parse_html(raw, args.base) if status else {"text": [], "images": [], "headings": [], "title": "", "metaDescription": ""}

        required_copy = []
        required_copy.extend(entry.get("expectedTextBlocks") or [])
        required_copy.extend([heading["text"] for heading in source.get("headings", []) if heading["text"] not in COMMON_TEXT][:8])
        required_copy = list(dict.fromkeys(required_copy))
        missing_copy = [text for text in required_copy if not contains_text(local.get("text", []), text)]

        local_image_names = {image_name(url) for url in local.get("images", []) if image_name(url)}
        required_images = [url for url in (entry.get("expectedImages") or source.get("images", [])[:6]) if image_name(url)]
        missing_images = [url for url in required_images if image_name(url) not in local_image_names]

        required_modules = entry.get("expectedModules") or []
        missing_modules = [module for module in required_modules if not contains_text(local.get("text", []), module)]

        checks = {
            "localStatus": "PASS" if status == 200 else "FAIL",
            "copy": "PASS" if not missing_copy else "FAIL",
            "images": "PASS" if not missing_images else "FAIL",
            "modules": "PASS" if not missing_modules else "FAIL",
            "metadata": "PASS" if local.get("title") and local.get("metaDescription") else "FAIL",
        }
        strict_fail = (
            status != 200
            or checks["metadata"] == "FAIL"
            or (args.fail_on_missing_copy and missing_copy)
            or (args.fail_on_missing_image and missing_images)
            or (args.fail_on_module_drift and missing_modules)
        )
        evidence_path = PARITY_ROOT / "evidence" / f"{entry['entryId']}.json"
        evidence = {
            "entryId": entry["entryId"],
            "path": entry["canonicalPath"],
            "sourceUrl": entry["sourceUrl"],
            "localUrl": full_url(args.base, entry["canonicalPath"]),
            "finalUrl": final_url,
            "checks": checks,
            "counts": {
                "copyRequired": len(required_copy),
                "copyMissing": len(missing_copy),
                "imagesRequired": len(required_images),
                "imagesMissing": len(missing_images),
                "modulesRequired": len(required_modules),
                "modulesMissing": len(missing_modules),
            },
            "missingCopy": missing_copy,
            "missingImages": missing_images,
            "missingModules": missing_modules,
            "sourceSnapshot": str(PARITY_ROOT / "source-snapshots" / f"{entry['entryId']}.json"),
        }
        write_json(evidence_path, evidence)
        update_ledger(
            entry["entryId"],
            {
                "status": "done" if args.mark_done and not strict_fail else "pending",
                "checks": checks,
                "evidence": {"pageCompare": str(evidence_path)},
            },
        )
        if strict_fail:
            failures.append(evidence)
        print(
            f"[{index}/{len(entries)}] {entry['entryId']} {entry['canonicalPath']} "
            f"copy={checks['copy']} images={checks['images']} modules={checks['modules']} metadata={checks['metadata']}"
        )

    write_json(PARITY_ROOT / "compare-failures.json", failures)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
