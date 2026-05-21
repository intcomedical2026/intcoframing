from __future__ import annotations

import argparse
import urllib.parse

from intco_parity_lib import LOCALES, PARITY_ROOT, full_url, load_json, localize_path, parse_html, read_routes, request_text, update_ledger, write_json


def href_path(href: str) -> str:
    parsed = urllib.parse.urlparse(href)
    value = parsed.path or "/"
    if len(value) > 1:
        value = value.rstrip("/")
    return value


def expected_hreflangs(base: str, canonical_path: str) -> dict[str, str]:
    expected = {locale: href_path(full_url(base, localize_path(locale, canonical_path))) for locale in LOCALES}
    expected["x-default"] = expected["en"]
    return expected


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify every generated localized route.")
    parser.add_argument("--base", default="http://127.0.0.1:3000")
    parser.add_argument("--routes", default=str(PARITY_ROOT / "localized-routes.json"))
    parser.add_argument("--batch")
    parser.add_argument("--entry")
    parser.add_argument("--locale")
    parser.add_argument("--limit", type=int)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--expect-canonical", type=int)
    parser.add_argument("--expect-unique-canonical", type=int)
    parser.add_argument("--expect-localized", type=int)
    args = parser.parse_args()

    routes = read_routes(args.routes)
    selected = routes
    if args.entry:
        selected = [route for route in selected if route["entryId"] == args.entry or route["canonicalPath"] == args.entry]
    if args.batch:
        selected = [route for route in selected if route["batch"] == args.batch or route["batch"].startswith(args.batch)]
    if args.locale:
        selected = [route for route in selected if route["locale"] == args.locale]
    if args.limit:
        selected = selected[: args.limit]
    if not args.all and not args.batch and not args.entry and not args.locale and not args.limit:
        parser.error("Use --all, --batch, --entry, --locale, or --limit to make the verification scope explicit.")

    cache: dict[str, dict] = {}
    results = []
    for index, route in enumerate(selected, 1):
        url = full_url(args.base, route["localizedPath"])
        if route["localizedPath"] not in cache:
            status, raw, final_url = request_text(url)
            parsed = parse_html(raw, url) if status else {"text": [], "headings": [], "images": [], "hreflangs": [], "canonical": ""}
            cache[route["localizedPath"]] = {"status": status, "raw": raw, "finalUrl": final_url, "parsed": parsed}
        fetched = cache[route["localizedPath"]]
        parsed = fetched["parsed"]
        expected_canonical = href_path(full_url(args.base, route["localizedPath"]))
        actual_canonical = href_path(parsed.get("canonical") or fetched["finalUrl"])
        actual_hreflangs = {item["lang"]: href_path(item["href"]) for item in parsed.get("hreflangs", [])}
        expected_alternates = expected_hreflangs(args.base, route["canonicalPath"])
        missing_hreflangs = [lang for lang, path in expected_alternates.items() if actual_hreflangs.get(lang) != path]
        checks = {
            "status": fetched["status"] == 200,
            "canonical": actual_canonical == expected_canonical,
            "hreflang": not missing_hreflangs,
            "headings": bool(parsed.get("headings")),
            "bodyText": bool(parsed.get("text")),
        }
        ok = all(checks.values())
        results.append(
            {
                "entryId": route["entryId"],
                "locale": route["locale"],
                "canonicalPath": route["canonicalPath"],
                "localizedPath": route["localizedPath"],
                "url": url,
                "status": fetched["status"],
                "finalUrl": fetched["finalUrl"],
                "checks": checks,
                "actualCanonicalPath": actual_canonical,
                "expectedCanonicalPath": expected_canonical,
                "missingHreflangs": missing_hreflangs,
                "ok": ok,
            }
        )
        print(f"[{index}/{len(selected)}] {route['entryId']} {route['locale']} {route['localizedPath']} {'PASS' if ok else 'FAIL'}")

    failures = [result for result in results if not result["ok"]]
    by_entry: dict[str, list[dict]] = {}
    for result in results:
        by_entry.setdefault(result["entryId"], []).append(result)
    for entry_id, entry_results in by_entry.items():
        passed = len([result for result in entry_results if result["ok"]])
        total = len(entry_results)
        update_ledger(
            entry_id,
            {
                "checks": {"localizedRoutes": "PASS" if passed == total else "FAIL"},
                "evidence": {"localizedRoutes": str(PARITY_ROOT / "route-results.json")},
            },
        )
    summary = {
        "base": args.base,
        "checked": len(results),
        "uniqueLocalizedPathsFetched": len(cache),
        "passed": len(results) - len(failures),
        "failed": len(failures),
        "failures": failures,
        "results": results,
    }
    if args.all:
        stats = load_json(PARITY_ROOT / "manifest-stats.json")
        count_failures = []
        if args.expect_canonical is not None and stats.get("semanticEntries") != args.expect_canonical:
            count_failures.append("semanticEntries")
        if args.expect_unique_canonical is not None and stats.get("uniqueCanonicalUrls") != args.expect_unique_canonical:
            count_failures.append("uniqueCanonicalUrls")
        if args.expect_localized is not None and stats.get("localizedRouteChecks") != args.expect_localized:
            count_failures.append("localizedRouteChecks")
        summary["countFailures"] = count_failures
        failures.extend({"countFailure": key} for key in count_failures)

    write_json(PARITY_ROOT / "route-results.json", summary)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
