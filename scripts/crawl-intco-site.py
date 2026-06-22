from __future__ import annotations

import concurrent.futures
import html
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


BASE_URL = "https://www.intcoframing-us.com"
WP_API = f"{BASE_URL}/wp-json/wp/v2"
OUTPUT = Path("sanity/seed/intcoframing.seed.json")
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
)


PARENT_CATEGORY_ASSETS = {
    "mirror": {
        "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/07/未标题-3.jpg",
        "navImageUrl": f"{BASE_URL}/wp-content/uploads/2024/01/pro-nav-pic-02.jpg",
        "description": "Decorating your wall with a mirror can add depth and fascination into rooms. Intco Framing offers a range of mirrors suitable for any room in home!",
    },
    "picture-frame": {
        "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/09/20240911-093414-1-e1726018748935.jpg",
        "navImageUrl": f"{BASE_URL}/wp-content/uploads/2024/01/pro-nav-pic-01.jpg",
        "description": "Our picture frames are all made of environmentally friendly materials. Explore picture frames in various shapes and styles at Intco Framing.",
    },
    "art": {
        "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/07/3-1.jpg",
        "navImageUrl": f"{BASE_URL}/wp-content/uploads/2024/01/pro-nav-pic-03.jpg",
        "description": "Create your own gallery with wall art from Intco Framing. Our diverse selection of art ensures your home is as exceptional as your individual taste.",
    },
    "furniture": {
        "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/07/4-1.jpg",
        "navImageUrl": f"{BASE_URL}/wp-content/uploads/2024/01/pro-nav-pic-05.jpg",
        "description": "Intco Framing delivers top-quality furniture, ranging from medicine cabinets to shelves, designed to maximize home storage space.",
    },
    "memo-board": {
        "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/01/product4.png",
        "navImageUrl": f"{BASE_URL}/wp-content/uploads/2024/01/pro-nav-pic-04.jpg",
        "description": "Discover framed chalkboards, cork boards, dry erase boards and linen boards for notes, reminders and personal organization.",
    },
}

SOLUTION_ASSETS = {
    "business-insights-trends": f"{BASE_URL}/wp-content/uploads/2024/01/Solutions1.png",
    "design-engineering": f"{BASE_URL}/wp-content/uploads/2024/01/Solutions2.png",
    "manufacturing-delivery": f"{BASE_URL}/wp-content/uploads/2024/01/Solutions3.png",
    "global-production-and-supply": f"{BASE_URL}/wp-content/uploads/2024/01/Solutions4.png",
    "certification": f"{BASE_URL}/wp-content/uploads/2024/01/Solutions5.png",
    "retailer-support": f"{BASE_URL}/wp-content/uploads/2024/02/333-1.jpg",
}

COMMON_IMAGE_PARTS = (
    "cplogo101.png",
    "logo2.png",
    "pro-nav-pic",
    "xia1.jpg",
    "xia2.jpg",
    "Solutions1.png",
    "Solutions2.png",
    "Solutions3.png",
    "Solutions4.png",
    "Solutions5.png",
    "333-1.jpg",
    "contact.png",
    "project111-",
)

NOISE_TEXT = {
    "INTCO",
    "Home",
    "Products",
    "Projects",
    "Solutions",
    "About INTCO",
    "Who We Are",
    "Sustainability",
    "Philosophy",
    "Contact",
    "Explore More",
    "Contact Us",
    "Read More",
    "My Cart",
    "Product",
    "Quick Links",
    "Newsletter",
    "Follow Us",
    "Reject",
    "Accept",
    "Business Insights & Trends",
    "Design & Engineering",
    "Manufacturing & Delivery",
    "Global Production and Supply",
    "Certification",
    "Retailer Support",
    "Mirror",
    "Wall Mirror",
    "Standing Mirror",
    "Leaner Mirror",
    "Door Mirror",
    "LED Mirror",
    "Picture frame",
    "Picture Frame",
    "Tabletop Frame",
    "Wall Frame",
    "Poster Frame",
    "Document Frame",
    "Shadow Box",
    "Collage Frame",
    "Art",
    "Framed Art",
    "Canvas Art",
    "Alternative Wall Decor",
    "Furniture",
    "Medicine Cabinet",
    "Shelf",
    "Memo Board",
    "Chalkboard",
    "Dry Erase Board",
    "Cork Board",
    "Linen Board",
    "Residential",
    "Commercial",
    "Chat With Us",
    "Leave a Message",
    "Categories",
    "BEST SELLERS",
    "Get a Quote",
    "Add To Cart",
    "Any size, color",
    "can be customized",
    "Table of Contents",
}


class LinkImageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.images: list[str] = []
        self.text: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "svg", "noscript"}:
            self._skip_depth += 1
            return
        attr = dict(attrs)
        href = attr.get("href")
        if tag == "a" and href:
            self.links.append(href)
        if tag == "img":
            src = attr.get("data-src") or attr.get("src")
            if src:
                self.images.append(src)

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "svg", "noscript"} and self._skip_depth:
            self._skip_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        value = normalize_text(data)
        if value:
            self.text.append(value)


def request_url(url: str, accept: str = "text/html") -> bytes:
    req = urllib.request.Request(
        url.replace("http://", "https://"),
        headers={"User-Agent": USER_AGENT, "Accept": accept},
    )
    with urllib.request.urlopen(req, timeout=45) as response:
        return response.read()


def get_json(url: str) -> Any:
    return json.loads(request_url(url, "application/json").decode("utf-8", "ignore"))


def normalize_text(value: str) -> str:
    value = html.unescape(value).replace("\xa0", " ").replace("\r", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def slug_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path.strip("/")
    return path.split("/")[-1] if path else "home"


def to_https(url: str) -> str:
    return urllib.parse.urljoin(BASE_URL, html.unescape(url)).replace("http://", "https://")


def doc_id(prefix: str, slug: str | int) -> str:
    clean = re.sub(r"[^a-zA-Z0-9_.-]+", "-", str(slug)).strip("-").lower()
    return f"{prefix}.{clean}"


def parse_html_page(url: str) -> dict[str, Any]:
    try:
        raw = request_url(url).decode("utf-8", "ignore")
    except Exception as exc:
        return {"url": url, "error": str(exc), "title": "", "imageUrls": [], "bodyText": ""}

    parser = LinkImageParser()
    parser.feed(raw)
    title_match = re.search(r"<title[^>]*>(.*?)</title>", raw, re.I | re.S)
    title = normalize_text(re.sub(r"<[^>]+>", " ", title_match.group(1))) if title_match else ""
    og_title = extract_meta(raw, "og:title")
    meta_desc = extract_meta(raw, "description") or extract_meta(raw, "og:description")
    date = extract_meta(raw, "article:published_time")

    image_urls: list[str] = []
    for src in parser.images:
        absolute = to_https(src)
        if not any(part in absolute for part in COMMON_IMAGE_PARTS) and absolute not in image_urls:
            image_urls.append(absolute)

    body_lines: list[str] = []
    seen: set[str] = set()
    for line in parser.text:
        if line in seen or is_noise_line(line):
            continue
        seen.add(line)
        body_lines.append(line)

    if og_title:
        title = og_title
    elif title:
        title = title.replace(" - Intco Framing", "").replace(" | Intco Framing", "")
    else:
        title = body_lines[0] if body_lines else slug_from_url(url).replace("-", " ").title()

    return {
        "url": to_https(url),
        "title": title,
        "description": meta_desc,
        "date": date,
        "imageUrls": image_urls[:8],
        "bodyText": "\n".join(body_lines[:80]),
    }


def extract_meta(raw: str, name: str) -> str:
    patterns = [
        rf'<meta[^>]+property=["\']{re.escape(name)}["\'][^>]+content=["\']([^"\']+)["\']',
        rf'<meta[^>]+name=["\']{re.escape(name)}["\'][^>]+content=["\']([^"\']+)["\']',
        rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']{re.escape(name)}["\']',
    ]
    for pattern in patterns:
        match = re.search(pattern, raw, re.I | re.S)
        if match:
            return normalize_text(match.group(1))
    return ""


def fetch_sitemap_locations() -> dict[str, list[str]]:
    index = request_url(f"{BASE_URL}/wp-sitemap.xml").decode("utf-8", "ignore")
    sitemap_urls = re.findall(r"<loc>(.*?)</loc>", index)
    groups: dict[str, list[str]] = {}
    for sitemap_url in sitemap_urls:
        xml = request_url(sitemap_url).decode("utf-8", "ignore")
        locations = [to_https(item) for item in re.findall(r"<loc>(.*?)</loc>", xml)]
        groups[sitemap_url] = locations
    return groups


def fetch_all_posts() -> list[dict[str, Any]]:
    first = get_json(f"{WP_API}/posts?per_page=100&page=1")
    posts = list(first)
    if len(first) == 100:
        page = 2
        while True:
            try:
                current = get_json(f"{WP_API}/posts?per_page=100&page={page}")
            except urllib.error.HTTPError:
                break
            if not current:
                break
            posts.extend(current)
            if len(current) < 100:
                break
            page += 1
    return posts


def build_site_settings() -> dict[str, Any]:
    return {
        "_type": "siteSettings",
        "_id": "siteSettings",
        "title": "INTCO Framing",
        "description": "Premier interior decoration manufacturer for mirrors, picture frames, wall art, furniture and memo boards.",
        "sourceSite": BASE_URL,
        "logoUrl": f"{BASE_URL}/wp-content/uploads/2024/02/cplogo101.png",
        "footerLogoUrl": f"{BASE_URL}/wp-content/uploads/2024/01/logo2.png",
        "phone": "+86 13371591392",
        "secondaryPhone": "+86 17753315610",
        "email": "info@intcoframing-us.com",
        "address": "Qingtian Road, Zibo, Shandong, China",
        "navigation": [
            {"label": "Home", "path": "/"},
            {"label": "Products", "path": "/products"},
            {"label": "Projects", "path": "/projects"},
            {"label": "Solutions", "path": "/solutions"},
            {"label": "About INTCO", "path": "/who-we-are"},
            {"label": "Contact", "path": "/contact"},
        ],
        "footerColumns": [
            {
                "title": "Product",
                "links": [
                    {"label": "Mirror", "path": "/mirror"},
                    {"label": "Picture frame", "path": "/picture-frame"},
                    {"label": "Art", "path": "/art"},
                    {"label": "Furniture", "path": "/furniture"},
                    {"label": "Memo Board", "path": "/memo-board"},
                ],
            },
            {
                "title": "Quick Links",
                "links": [
                    {"label": "Projects", "path": "/projects"},
                    {"label": "Solutions", "path": "/solutions"},
                    {"label": "About INTCO", "path": "/who-we-are"},
                    {"label": "Blog", "path": "/blog"},
                    {"label": "Contact", "path": "/contact"},
                ],
            },
        ],
    }


def build_home_page() -> dict[str, Any]:
    return {
        "_type": "homePage",
        "_id": "homePage",
        "title": "INTCO FRAMING",
        "heroSlides": [
            {
                "title": "INTCO FRAMING",
                "subtitle": "We are committed to offering you turnkey service and ready to create retail solutions custom tailored to fulfill all your needs.",
                "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/02/20240229-145653.jpg",
                "primaryCta": {"label": "Latest Products", "path": "/products"},
                "secondaryCta": {"label": "Solutions", "path": "/solutions"},
            },
            {
                "title": "Mirror",
                "subtitle": "Decorating your wall with a mirror can add depth and fascination into your room. Intco Framing offers a range of mirrors suitable for any room in your home.",
                "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/02/3-1.jpg",
                "primaryCta": {"label": "Explore More", "path": "/mirror"},
                "secondaryCta": {"label": "Contact Us", "path": "/contact"},
            },
            {
                "title": "Picture Frame",
                "subtitle": "Our picture frames are all made of environmentally friendly materials. Explore picture frames in various shapes and styles at Intco Framing.",
                "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/02/image.jpg",
                "primaryCta": {"label": "Explore More", "path": "/picture-frame"},
                "secondaryCta": {"label": "Contact Us", "path": "/contact"},
            },
            {
                "title": "Wall Art",
                "subtitle": "Create your own gallery with wall art from Intco Framing. Our diverse selection of art ensures your home is as exceptional as your individual taste.",
                "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/02/4.jpg",
                "primaryCta": {"label": "Explore More", "path": "/art"},
                "secondaryCta": {"label": "Contact Us", "path": "/contact"},
            },
            {
                "title": "Flexible Manufacturing",
                "subtitle": "With over 20 years of manufacturing experience, Intco Framing stands out for its flexible manufacturing capabilities.",
                "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/02/111.jpg",
                "primaryCta": {"label": "Explore More", "path": "/solutions/manufacturing-delivery"},
                "secondaryCta": {"label": "Contact Us", "path": "/contact"},
            },
        ],
        "companyProfile": {
            "title": "COMPANY PROFILE",
            "description": "Founded in 2002, INTCO upholds the reputation for high quality, great designs, and fast delivery to fulfill all aspects of a project - from artistry to functionality, saving you time and money.",
            "points": [
                "Cutting-edge Advanced",
                "Best-in-Class Retail Design",
                "On-Time Delivery Service",
                "End-to-end Support",
            ],
            "imageUrl": f"{BASE_URL}/wp-content/uploads/2024/02/333-1.jpg",
        },
        "stats": [
            {"value": "3", "label": "Business Units"},
            {"value": "6", "label": "Production Bases"},
            {"value": "30+", "label": "Years Experience"},
            {"value": "4000+", "label": "Employees"},
        ],
        "projectsIntro": {
            "title": "PROJECTS",
            "description": "Artistry meets functionality. From public spaces to homes, our diverse products seamlessly integrate into diverse scenarios.",
            "cta": "Customized Solution For Every Industry Needs!",
        },
        "blogIntro": {
            "title": "BLOG",
            "description": "When it comes to home decor, we're the experts. As an interior decoration solutions provider, we design and implement our solutions to help you achieve the scene you expected.",
        },
    }


def build_categories(categories: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_id = {item["id"]: item for item in categories}
    order = [
        "mirror",
        "wall-mirror",
        "standing-mirror",
        "leaner-mirror",
        "door-mirror",
        "led-mirror",
        "picture-frame",
        "tabletop-frame",
        "wall-frame",
        "poster-frame",
        "document-frame",
        "shadow-box",
        "collage-frame",
        "art",
        "framed-art",
        "canvas-art",
        "alternative-wall-decor",
        "furniture",
        "medicine-cabinet",
        "shelf",
        "memo-board",
        "chalkboard",
        "dry-erase-board",
        "cork-board",
        "linen-board",
    ]
    order_index = {slug: index for index, slug in enumerate(order)}
    docs = []
    for category in categories:
        slug = category["slug"]
        parent = by_id.get(category.get("parent"))
        parent_slug = parent["slug"] if parent else ""
        assets = PARENT_CATEGORY_ASSETS.get(slug, {})
        path = f"/{slug}" if not parent_slug else f"/{parent_slug}/{slug}"
        docs.append(
            {
                "_type": "productCategory",
                "_id": doc_id("productCategory", slug),
                "title": html.unescape(category["name"]),
                "slug": slug,
                "path": path,
                "parentSlug": parent_slug,
                "description": assets.get("description") or normalize_text(category.get("description", "")),
                "imageUrl": assets.get("imageUrl", ""),
                "navImageUrl": assets.get("navImageUrl", ""),
                "order": order_index.get(slug, 1000),
                "sourceId": category["id"],
            }
        )
    return sorted(docs, key=lambda item: (item["order"], item["title"]))


def build_products(posts: list[dict[str, Any]], category_by_id: dict[int, dict[str, Any]]) -> list[dict[str, Any]]:
    def enrich(post: dict[str, Any]) -> dict[str, Any]:
        page = parse_html_page(post["link"])
        title = normalize_text(re.sub("<[^>]+>", " ", post["title"]["rendered"]))
        category_slugs = [category_by_id[item]["slug"] for item in post.get("categories", []) if item in category_by_id]
        main_category = category_slugs[0] if category_slugs else ""
        image_urls = page["imageUrls"]
        body_text = page["bodyText"]
        description = page["description"] or first_meaningful_line(body_text, title)
        return {
            "_type": "product",
            "_id": doc_id("product", post["id"]),
            "title": title,
            "slug": post["slug"],
            "path": "/" + urllib.parse.urlparse(to_https(post["link"])).path.strip("/"),
            "sourceUrl": to_https(post["link"]),
            "sourceId": post["id"],
            "categorySlugs": category_slugs,
            "mainCategorySlug": main_category,
            "description": description,
            "bodyText": body_text,
            "imageUrl": image_urls[0] if image_urls else "",
            "galleryUrls": image_urls,
            "publishedAt": post.get("date", ""),
            "updatedAt": post.get("modified", ""),
        }

    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        products = list(pool.map(enrich, posts))
    return products


def build_solutions(pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    solution_slugs = [
        "business-insights-trends",
        "design-engineering",
        "manufacturing-delivery",
        "global-production-and-supply",
        "certification",
        "retailer-support",
    ]
    by_slug = {item["slug"]: item for item in pages}
    docs = []
    for index, slug in enumerate(solution_slugs):
        page = by_slug.get(slug)
        if not page:
            continue
        title = normalize_text(re.sub("<[^>]+>", " ", page["title"]["rendered"]))
        parsed = parse_html_page(page["link"])
        body_text = parsed["bodyText"]
        docs.append(
            {
                "_type": "solution",
                "_id": doc_id("solution", slug),
                "title": title,
                "slug": slug,
                "path": "/solutions/" + slug,
                "sourceUrl": to_https(page["link"]),
                "description": parsed["description"] or first_meaningful_line(body_text, title),
                "bodyText": body_text,
                "imageUrl": SOLUTION_ASSETS.get(slug, parsed["imageUrls"][0] if parsed["imageUrls"] else ""),
                "order": index,
            }
        )
    return docs


def first_meaningful_line(body_text: str, title: str = "") -> str:
    for line in body_text.splitlines():
        line = normalize_text(line)
        if len(line) > 45 and line != title and not is_noise_line(line):
            return line[:280]
    return ""


def is_noise_line(line: str) -> bool:
    line = normalize_text(line)
    if not line:
        return True
    lowered = line.lower()
    if line in NOISE_TEXT:
        return True
    if line.startswith("+86") or "[email protected]" in line or "info@intcoframing-us.com" in line:
        return True
    if line.startswith("Copyright @") or line.startswith("We Value Your Privacy"):
        return True
    if "/www/wwwroot" in line or "single-news.php" in line:
        return True
    if lowered in {"warning", "on line"}:
        return True
    if "undefined variable" in lowered or "trying to access" in lowered:
        return True
    if "attempt to read property" in lowered:
        return True
    if re.fullmatch(r"\d{1,3}", line):
        return True
    return False


def build_news(news_urls: list[str]) -> list[dict[str, Any]]:
    def enrich(url: str) -> dict[str, Any]:
        parsed = parse_html_page(url)
        title = parsed["title"].replace(" - Intco Framing", "").strip()
        slug = slug_from_url(url)
        body_text = parsed["bodyText"]
        return {
            "_type": "blogPost",
            "_id": doc_id("blogPost", slug),
            "title": title,
            "slug": slug,
            "path": "/news/" + slug,
            "sourceUrl": to_https(url),
            "category": infer_news_category(body_text),
            "excerpt": parsed["description"] or first_meaningful_line(body_text, title),
            "bodyText": body_text,
            "imageUrl": parsed["imageUrls"][0] if parsed["imageUrls"] else "",
            "galleryUrls": parsed["imageUrls"][:4],
            "publishedAt": parsed["date"],
        }

    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        docs = list(pool.map(enrich, news_urls))
    return docs


def infer_news_category(body_text: str) -> str:
    lowered = body_text.lower()
    if "expo" in lowered or "fair" in lowered:
        return "Expo"
    if "press release" in lowered or "bloomberg" in lowered:
        return "Press Release"
    if "trend" in lowered or "market" in lowered:
        return "Industry News"
    if "tips" in lowered or "how to" in lowered or "guide" in lowered:
        return "Tips"
    if "new arrival" in lowered or "latest" in lowered:
        return "New Arrivals"
    return "Inspiration"


def build_projects(project_urls: list[str]) -> list[dict[str, Any]]:
    category_lookup = {
        "living-room": "Residential",
        "childrens-room": "Residential",
        "kitchen": "Residential",
        "dining-room": "Residential",
        "bathroom": "Residential",
        "bedroom": "Residential",
        "school": "Commercial",
        "large-commercial-space": "Commercial",
        "restaurant": "Commercial",
        "cafes": "Commercial",
        "gallery": "Commercial",
        "office": "Commercial",
        "hotel": "Commercial",
    }

    def enrich(url: str) -> dict[str, Any]:
        parsed = parse_html_page(url)
        slug = slug_from_url(url)
        title = parsed["title"].replace(" - Intco Framing", "").strip()
        body_text = parsed["bodyText"]
        return {
            "_type": "project",
            "_id": doc_id("project", slug),
            "title": title,
            "slug": slug,
            "path": "/projects/" + slug,
            "sourceUrl": to_https(url),
            "category": category_lookup.get(slug, "Commercial"),
            "description": parsed["description"] or first_meaningful_line(body_text, title),
            "bodyText": body_text,
            "imageUrl": parsed["imageUrls"][0] if parsed["imageUrls"] else "",
            "galleryUrls": parsed["imageUrls"][:8],
        }

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        return list(pool.map(enrich, project_urls))


def main() -> None:
    started = time.time()
    categories = get_json(f"{WP_API}/categories?per_page=100")
    pages = get_json(f"{WP_API}/pages?per_page=100")
    posts = fetch_all_posts()
    sitemaps = fetch_sitemap_locations()
    news_urls = next((urls for name, urls in sitemaps.items() if "posts-news" in name), [])
    project_urls = next((urls for name, urls in sitemaps.items() if "posts-project" in name), [])

    category_docs = build_categories(categories)
    category_by_id = {item["id"]: item for item in categories}
    data = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "sourceSite": BASE_URL,
        "sanity": {
            "organizationId": "oSsROqrgs",
            "projectId": "vzcnnept",
            "dataset": "production",
        },
        "siteSettings": build_site_settings(),
        "homePage": build_home_page(),
        "productCategories": category_docs,
        "products": build_products(posts, category_by_id),
        "solutions": build_solutions(pages),
        "projects": build_projects(project_urls),
        "blogPosts": build_news(news_urls),
        "pages": build_static_pages(pages),
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    elapsed = time.time() - started
    print(
        "Wrote "
        f"{OUTPUT} with {len(data['products'])} products, "
        f"{len(data['blogPosts'])} blog posts, {len(data['projects'])} projects "
        f"and {len(data['productCategories'])} product categories in {elapsed:.1f}s."
    )


def build_static_pages(pages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    wanted = {
        "products": "/products",
        "projects": "/projects",
        "solutions-center": "/solutions",
        "who-we-are": "/who-we-are",
        "sustainability": "/who-we-are/sustainability",
        "philosophy": "/who-we-are/philosophy",
        "contact": "/contact",
        "blog": "/blog",
    }
    docs = []
    for page in pages:
        slug = page["slug"]
        if slug not in wanted:
            continue
        parsed = parse_html_page(page["link"])
        title = normalize_text(re.sub("<[^>]+>", " ", page["title"]["rendered"]))
        docs.append(
            {
                "_type": "contentPage",
                "_id": doc_id("contentPage", slug),
                "title": title,
                "slug": slug,
                "path": wanted[slug],
                "sourceUrl": to_https(page["link"]),
                "description": parsed["description"] or first_meaningful_line(parsed["bodyText"], title),
                "bodyText": parsed["bodyText"],
                "imageUrl": parsed["imageUrls"][0] if parsed["imageUrls"] else "",
            }
        )
    return docs


if __name__ == "__main__":
    main()
