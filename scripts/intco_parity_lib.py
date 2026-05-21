from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


SOURCE_BASE = "https://www.intcoframing-us.com"
LOCALES = ["en", "es", "pt", "fr", "de", "ja"]
PARITY_ROOT = Path(".omx/intco-parity")
REPORT_ROOT = Path("reports/intco-parity")
SEED_PATH = Path("sanity/seed/intcoframing.seed.json")
LOCALIZED_SEED_PATH = Path("sanity/seed/intcoframing.localized.json")
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
)


class VisibleHtmlParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.text: list[str] = []
        self.images: list[str] = []
        self.links: list[str] = []
        self.headings: list[dict[str, str]] = []
        self._skip_depth = 0
        self._heading: str | None = None
        self._heading_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "svg", "noscript"}:
            self._skip_depth += 1
            return
        attr = dict(attrs)
        if tag == "img":
            src = attr.get("data-src") or attr.get("src")
            if src:
                self.images.append(src)
            if attr.get("alt"):
                self.text.append(normalize_text(attr["alt"] or ""))
        if tag in {"input", "textarea"} and attr.get("placeholder"):
            self.text.append(normalize_text(attr["placeholder"] or ""))
        if tag == "a" and attr.get("href"):
            self.links.append(attr["href"] or "")
        if tag in {"h1", "h2", "h3"}:
            self._heading = tag
            self._heading_text = []

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "svg", "noscript"} and self._skip_depth:
            self._skip_depth -= 1
        if self._heading == tag:
            value = normalize_text(" ".join(self._heading_text))
            if value:
                self.headings.append({"level": tag, "text": value})
            self._heading = None
            self._heading_text = []

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        value = normalize_text(data)
        if not value:
            return
        self.text.append(value)
        if self._heading:
            self._heading_text.append(value)


def load_json(path: Path | str) -> Any:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path: Path | str, payload: Any) -> None:
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def normalize_text(value: str) -> str:
    value = html.unescape(value or "").replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def clean_path(path: str | None) -> str:
    value = (path or "/").strip()
    value = re.sub(r"^/+|/+$", "", value)
    return f"/{value}" if value else "/"


def localize_path(locale: str, path: str) -> str:
    normalized = clean_path(path)
    if locale == "en":
        return normalized
    if normalized == "/":
        return f"/{locale}"
    return f"/{locale}{normalized}"


def source_url(path: str, explicit: str | None = None) -> str:
    if explicit:
        return explicit.replace("http://", "https://")
    if path == "/":
        return f"{SOURCE_BASE}/"
    return f"{SOURCE_BASE}{clean_path(path)}/"


def full_url(base: str, path: str) -> str:
    return urllib.parse.urljoin(base.rstrip("/") + "/", clean_path(path).lstrip("/"))


def slugify(value: str) -> str:
    value = normalize_text(value).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "entry"


def path_slug(path: str) -> str:
    normalized = clean_path(path)
    return "home" if normalized == "/" else slugify(normalized.strip("/"))


def lines_from_body(body: str | None, limit: int = 16) -> list[str]:
    lines: list[str] = []
    seen: set[str] = set()
    for raw in (body or "").splitlines():
        line = normalize_text(raw)
        if len(line) < 3 or line in seen or is_server_error_line(line):
            continue
        seen.add(line)
        lines.append(line)
        if len(lines) >= limit:
            break
    return lines


def is_server_error_line(line: str) -> bool:
    lowered = line.lower()
    return (
        line == "Warning"
        or "undefined array key" in lowered
        or "attempt to read property" in lowered
        or "/wp-content/themes/" in lowered
        or lowered == "on line"
        or line in {'" alt="', '"/>'}
    )


def item_images(item: dict[str, Any], limit: int = 8) -> list[str]:
    images = [item.get("imageUrl"), item.get("navImageUrl")]
    images.extend(item.get("galleryUrls") or [])
    result: list[str] = []
    for image in images:
        if image and image not in result:
            result.append(image)
        if len(result) >= limit:
            break
    return result


def expected_modules(semantic_type: str, path: str) -> list[str]:
    if semantic_type == "home":
        return ["INTCO FRAMING", "Latest Products", "Company Profile", "Solutions", "Projects", "Blog"]
    if path == "/products":
        return ["WHAT WE DO", "PROJECTS", "Catalog", "TEST REPORT", "GET IN TOUCH"]
    if path == "/projects":
        return ["Projects", "View All", "LIVING ROOM", "GET IN TOUCH"]
    if path == "/solutions":
        return ["END-TO-END HOME DECOR SOLUTIONS", "SERVICES WE OFFER", "HOW IT WORKS", "GET IN TOUCH"]
    if path == "/blog":
        return ["Blog", "Search", "Popular Posts", "GET IN TOUCH"]
    if path == "/contact":
        return ["Factory", "Telephone", "Live Chat", "Send an Email", "Order A SAMPLE"]
    if path == "/who-we-are":
        return ["ABOUT US", "OUR HISTORY", "GLOBAL MARKET", "GET IN TOUCH"]
    if path == "/who-we-are/sustainability":
        return ["ESG", "ENVIRONMENTAL CONTRIBUTION", "SUSTAINABILITY IN ACTION", "GET IN TOUCH"]
    if path == "/who-we-are/philosophy":
        return ["Mission", "Vision", "Values", "WORLD CLASS CUSTOMER SERVICE", "GET IN TOUCH"]
    if semantic_type in {"contentPage.products", "productCategory.parent", "productCategory.child"}:
        return ["Category", "Products", "GET IN TOUCH"]
    if semantic_type == "product":
        return ["BEST SELLERS", "Item#:", "Quantity", "ABOUT THIS ITEM", "Related Products", "SERVICES WE PROVIDE"]
    if semantic_type.startswith("solution"):
        return ["SERVICES", "YOU MAY ALSO LIKE", "GET IN TOUCH"]
    if semantic_type == "projectFilter":
        return ["Projects", "View All", "GET IN TOUCH"]
    if semantic_type.startswith("project"):
        return ["Projects", "USED ITEMS", "YOU MAY ALSO LIKE", "GET IN TOUCH"]
    if semantic_type.startswith("blog"):
        return ["Blog", "Search", "Popular Posts", "GET IN TOUCH"]
    return ["Hero", "Content", "GET IN TOUCH"]


def make_entry(
    entry_id: str,
    semantic_type: str,
    path: str,
    title: str,
    batch: str,
    template: str,
    source: str,
    item: dict[str, Any] | None = None,
) -> dict[str, Any]:
    item = item or {}
    canonical = clean_path(path)
    text_blocks = [title, *(lines_from_body(item.get("bodyText"), 12))]
    return {
        "entryId": entry_id,
        "semanticType": semantic_type,
        "canonicalPath": canonical,
        "sourceUrl": source,
        "templateFamily": template,
        "title": title,
        "batch": batch,
        "expectedImages": item_images(item),
        "expectedTextBlocks": [line for line in text_blocks if line],
        "expectedModules": expected_modules(semantic_type, canonical),
        "locales": LOCALES,
        "status": "pending",
        "sampleOnly": False,
    }


def build_manifest(seed: dict[str, Any]) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    home = seed.get("homePage") or {}
    entries.append(make_entry("home.index", "home", "/", home.get("title") or "INTCO Framing", "B1-home", "HomeView", source_url("/"), home))

    for page in seed.get("pages") or []:
        path = clean_path(page.get("path"))
        semantic = f"contentPage.{path_slug(path)}"
        template = "ContactView" if path == "/contact" else "ContentPageView"
        if path == "/products":
            template = "ProductsLandingView"
        elif path == "/projects":
            template = "ProjectsListingView"
        elif path == "/solutions":
            template = "SolutionsListingView"
        elif path == "/blog":
            template = "BlogListingView"
        entries.append(make_entry(f"content.{path_slug(path)}", semantic, path, page.get("title") or path, "B2-static", template, source_url(path, page.get("sourceUrl")), page))

    for category in seed.get("productCategories") or []:
        path = clean_path(category.get("path"))
        is_child = bool(category.get("parentSlug"))
        semantic = "productCategory.child" if is_child else "productCategory.parent"
        entries.append(make_entry(f"category.{category.get('slug') or path_slug(path)}", semantic, path, category.get("title") or path, "B3-categories", "ProductListingView", source_url(path, category.get("sourceUrl")), category))

    for product in seed.get("products") or []:
        path = clean_path(product.get("path"))
        group = product.get("mainCategorySlug") or (product.get("categorySlugs") or ["product"])[0]
        entries.append(make_entry(f"product.{group}.{product.get('slug') or path_slug(path)}", "product", path, product.get("title") or path, f"B4-products-{group}", "ProductDetailView", source_url(path, product.get("sourceUrl")), product))

    entries.append(make_entry("listing.solutions", "solutionListing", "/solutions", "Solutions", "B5-solutions", "SolutionsListingView", source_url("/solutions")))
    for solution in seed.get("solutions") or []:
        path = clean_path(solution.get("path"))
        entries.append(make_entry(f"solution.{solution.get('slug') or path_slug(path)}", "solutionDetail", path, solution.get("title") or path, "B5-solutions", "SolutionDetailView", source_url(path, solution.get("sourceUrl")), solution))

    entries.append(make_entry("listing.projects", "projectListing", "/projects", "Projects", "B6-projects", "ProjectsListingView", source_url("/projects")))
    entries.append(make_entry("listing.projects.residential", "projectFilter", "/projects/residential", "Residential Projects", "B6-projects", "ProjectsListingView", source_url("/projects")))
    entries.append(make_entry("listing.projects.commercial", "projectFilter", "/projects/commercial", "Commercial Projects", "B6-projects", "ProjectsListingView", source_url("/projects")))
    for project in seed.get("projects") or []:
        path = clean_path(project.get("path"))
        entries.append(make_entry(f"project.{project.get('slug') or path_slug(path)}", "projectDetail", path, project.get("title") or path, "B6-projects", "ProjectDetailView", source_url(path, project.get("sourceUrl")), project))

    entries.append(make_entry("listing.blog", "blogListing", "/blog", "Blog", "B7-blog", "BlogListingView", source_url("/blog")))
    entries.append(make_entry("listing.inspiration", "blogListing.inspiration", "/inspiration", "Inspiration", "B7-blog", "BlogListingView", source_url("/blog")))
    for post in seed.get("blogPosts") or []:
        path = clean_path(post.get("path"))
        category = slugify(post.get("category") or "post")
        entries.append(make_entry(f"blog.{category}.{post.get('slug') or path_slug(path)}", "blogPost", path, post.get("title") or path, "B7-blog", "BlogPostView", source_url(path, post.get("sourceUrl")), post))

    return entries


def localized_routes(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    routes: list[dict[str, Any]] = []
    for entry in entries:
        for locale in LOCALES:
            routes.append(
                {
                    "entryId": entry["entryId"],
                    "locale": locale,
                    "canonicalPath": entry["canonicalPath"],
                    "localizedPath": localize_path(locale, entry["canonicalPath"]),
                    "semanticType": entry["semanticType"],
                    "batch": entry["batch"],
                }
            )
    return routes


def manifest_stats(entries: list[dict[str, Any]], routes: list[dict[str, Any]]) -> dict[str, Any]:
    path_counts: dict[str, int] = {}
    for entry in entries:
        path_counts[entry["canonicalPath"]] = path_counts.get(entry["canonicalPath"], 0) + 1
    duplicates = sorted([path for path, count in path_counts.items() if count > 1])
    return {
        "semanticEntries": len(entries),
        "uniqueCanonicalUrls": len(path_counts),
        "localizedRouteChecks": len(routes),
        "duplicateSemanticUrls": duplicates,
    }


def initial_ledger(entries: list[dict[str, Any]], stats: dict[str, Any]) -> dict[str, Any]:
    return {
        "generatedAt": now_stamp(),
        "plan": ".omx/plans/intco-page-by-page-parity-ralplan-20260521.md",
        "stats": stats,
        "entries": [
            {
                "entryId": entry["entryId"],
                "path": entry["canonicalPath"],
                "batch": entry["batch"],
                "templateFamily": entry["templateFamily"],
                "status": "pending",
                "sampleOnly": False,
                "checks": {},
                "evidence": {},
            }
            for entry in entries
        ],
    }


def now_stamp() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def entry_filter(entries: list[dict[str, Any]], args: argparse.Namespace) -> list[dict[str, Any]]:
    selected = entries
    if getattr(args, "entry", None):
        selected = [entry for entry in selected if entry["entryId"] == args.entry or entry["canonicalPath"] == clean_path(args.entry)]
    if getattr(args, "batch", None):
        selected = [entry for entry in selected if entry["batch"] == args.batch or entry["batch"].startswith(args.batch)]
    if getattr(args, "limit", None):
        selected = selected[: int(args.limit)]
    return selected


def request_text(url: str, timeout: int = 45, attempts: int = 2) -> tuple[int, str, str]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"})
    last_error = ""
    for _ in range(attempts):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                final_url = response.geturl()
                return response.status, response.read().decode("utf-8", "ignore"), final_url
        except Exception as exc:
            last_error = str(exc)
    return 0, last_error, url


def parse_html(raw: str, base_url: str = SOURCE_BASE) -> dict[str, Any]:
    parser = VisibleHtmlParser()
    parser.feed(raw)
    title_match = re.search(r"<title[^>]*>(.*?)</title>", raw, re.I | re.S)
    title = normalize_text(re.sub(r"<[^>]+>", " ", title_match.group(1))) if title_match else ""
    meta_description = ""
    canonical = ""
    hreflangs: list[tuple[str, str]] = []
    attr_re = re.compile(r'([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(["\'])(.*?)\2', re.S)
    for tag_match in re.finditer(r"<(meta|link)\b[^>]*>", raw, re.I | re.S):
        tag_name = tag_match.group(1).lower()
        attrs = {name.lower(): html.unescape(value) for name, _, value in attr_re.findall(tag_match.group(0))}
        if tag_name == "meta" and attrs.get("name", "").lower() == "description":
            meta_description = normalize_text(attrs.get("content", ""))
        if tag_name == "link":
            rels = {part.strip().lower() for part in attrs.get("rel", "").split()}
            href = attrs.get("href", "")
            if "canonical" in rels and href:
                canonical = href
            if "alternate" in rels and attrs.get("hreflang") and href:
                hreflangs.append((attrs["hreflang"], href))
    images = [urllib.parse.urljoin(base_url, image) for image in parser.images]
    links = [urllib.parse.urljoin(base_url, link) for link in parser.links]
    text = []
    seen: set[str] = set()
    for line in parser.text:
        if line not in seen:
            seen.add(line)
            text.append(line)
    return {
        "title": title,
        "metaDescription": meta_description,
        "canonical": canonical,
        "hreflangs": [{"lang": lang, "href": href} for lang, href in hreflangs],
        "headings": parser.headings,
        "images": images,
        "links": links,
        "text": text,
        "textHash": hashlib.sha256("\n".join(text).encode("utf-8")).hexdigest(),
    }


def read_manifest(path: Path | None = None) -> list[dict[str, Any]]:
    return load_json(path or PARITY_ROOT / "canonical-manifest.json")


def read_routes(path: Path | None = None) -> list[dict[str, Any]]:
    return load_json(path or PARITY_ROOT / "localized-routes.json")


def update_ledger(entry_id: str, patch: dict[str, Any]) -> None:
    path = PARITY_ROOT / "ledger.json"
    if not path.exists():
        return
    ledger = load_json(path)
    for entry in ledger.get("entries", []):
        if entry.get("entryId") == entry_id:
            for key, value in patch.items():
                if isinstance(value, dict) and isinstance(entry.get(key), dict):
                    entry[key].update(value)
                else:
                    entry[key] = value
            break
    write_json(path, ledger)


def pass_fail(condition: bool) -> str:
    return "PASS" if condition else "FAIL"
