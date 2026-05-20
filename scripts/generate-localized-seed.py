from __future__ import annotations

import copy
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


INPUT = Path("sanity/seed/intcoframing.seed.json")
OUTPUT = Path("sanity/seed/intcoframing.localized.json")
CACHE = Path("sanity/seed/.translation-cache.json")

LOCALES = {
    "es": "Spanish",
    "pt": "Portuguese",
    "fr": "French",
    "de": "German",
    "ja": "Japanese",
}

TEXT_FIELDS = {
    "siteSettings": ["title", "description", "address"],
    "homePage": ["title"],
    "productCategories": ["title", "description"],
    "products": ["title", "description", "bodyText"],
    "solutions": ["title", "description", "bodyText"],
    "projects": ["title", "description", "bodyText", "category"],
    "blogPosts": ["title", "excerpt", "bodyText", "category"],
    "pages": ["title", "description", "bodyText"],
}

BODY_LIMIT = 2200
DELIMITER = "\n<<<INTCO_ITEM>>>\n"


def chunk_text(text: str, limit: int = 3400) -> list[str]:
    if len(text) <= limit:
        return [text]
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    for line in text.splitlines():
        addition = len(line) + 1
        if current and current_len + addition > limit:
            chunks.append("\n".join(current))
            current = []
            current_len = 0
        current.append(line)
        current_len += addition
    if current:
        chunks.append("\n".join(current))
    return chunks


def translate(text: str, locale: str, cache: dict[str, str]) -> str:
    value = str(text or "").strip()
    if not value:
        return ""
    key = f"{locale}:{value}"
    if key in cache:
        return cache[key]

    translated_parts = []
    for chunk in chunk_text(value):
        url = (
            "https://translate.googleapis.com/translate_a/single"
            f"?client=gtx&sl=en&tl={locale}&dt=t&q={urllib.parse.quote(chunk)}"
        )
        for attempt in range(4):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                data = json.load(urllib.request.urlopen(req, timeout=40))
                translated_parts.append("".join(part[0] for part in data[0] if part and part[0]))
                break
            except Exception:
                if attempt == 3:
                    translated_parts.append(chunk)
                else:
                    time.sleep(0.7 + attempt)

    result = "\n".join(translated_parts).strip()
    cache[key] = result
    if len(cache) % 50 == 0:
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    return result


def request_translation(text: str, locale: str) -> str:
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl=en&tl={locale}&dt=t&q={urllib.parse.quote(text)}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    data = json.load(urllib.request.urlopen(req, timeout=45))
    return "".join(part[0] for part in data[0] if part and part[0]).strip()


def translate_missing(locale: str, texts: list[str], cache: dict[str, str]) -> None:
    unique = []
    seen = set()
    for text in texts:
        value = str(text or "").strip()
        if not value or DELIMITER.strip() in value:
            continue
        key = f"{locale}:{value}"
        if key in cache or value in seen:
            continue
        seen.add(value)
        unique.append(value)

    batches: list[list[str]] = []
    current: list[str] = []
    current_len = 0
    for text in unique:
        addition = len(text) + len(DELIMITER)
        if current and current_len + addition > 4300:
            batches.append(current)
            current = []
            current_len = 0
        current.append(text)
        current_len += addition
    if current:
        batches.append(current)

    for index, batch in enumerate(batches, start=1):
        joined = DELIMITER.join(batch)
        try:
            translated = request_translation(joined, locale)
            parts = [part.strip() for part in translated.split("<<<INTCO_ITEM>>>")]
            if len(parts) != len(batch):
                raise ValueError("batch split mismatch")
            for source, result in zip(batch, parts):
                cache[f"{locale}:{source}"] = result
        except Exception:
            for source in batch:
                cache[f"{locale}:{source}"] = translate(source, locale, cache)
        if index % 20 == 0:
            print(f"  translated batch {index}/{len(batches)} for {locale}")
            CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


def localize_link(link: dict[str, Any], locale: str, cache: dict[str, str]) -> dict[str, Any]:
    localized = dict(link)
    localized["label"] = translate(link.get("label", ""), locale, cache)
    return localized


def localize_object(value: Any, locale: str, cache: dict[str, str]) -> Any:
    if isinstance(value, list):
        return [localize_object(item, locale, cache) for item in value]
    if not isinstance(value, dict):
        return value

    localized = copy.deepcopy(value)
    for key, item in list(localized.items()):
        if key in {"label", "title", "description", "subtitle", "cta", "value"} and isinstance(item, str):
            localized[key] = translate(item, locale, cache) if key != "value" else item
        elif isinstance(item, (dict, list)):
            localized[key] = localize_object(item, locale, cache)
    return localized


def collect_object_text(value: Any, texts: list[str]) -> None:
    if isinstance(value, list):
        for item in value:
            collect_object_text(item, texts)
        return
    if not isinstance(value, dict):
        return
    for key, item in value.items():
        if key in {"label", "title", "description", "subtitle", "cta"} and isinstance(item, str):
            texts.append(item)
        elif isinstance(item, (dict, list)):
            collect_object_text(item, texts)


def collect_doc_text(doc: dict[str, Any], fields: list[str], texts: list[str]) -> None:
    for field in fields:
        if isinstance(doc.get(field), str):
            value = doc[field]
            if field == "bodyText":
                value = value[:BODY_LIMIT]
            texts.append(value)
    if doc.get("title"):
        texts.append(doc["title"])
    description = doc.get("description") or doc.get("excerpt") or ""
    if description:
        texts.append(description[:155])


def localize_doc(doc: dict[str, Any], fields: list[str], locale: str, cache: dict[str, str]) -> dict[str, Any]:
    localized = copy.deepcopy(doc)
    for field in fields:
        if isinstance(localized.get(field), str):
            value = localized[field]
            if field == "bodyText":
                value = value[:BODY_LIMIT]
            localized[field] = translate(value, locale, cache)
    localized["metaTitle"] = rewrite_title(localized.get("title", ""), doc.get("_type", ""), locale, cache)
    base_description = localized.get("description") or localized.get("excerpt") or ""
    localized["metaDescription"] = rewrite_description(base_description, locale, cache)
    localized["imageAlt"] = translate(doc.get("title", ""), locale, cache)
    return localized


def rewrite_title(title: str, doc_type: str, locale: str, cache: dict[str, str]) -> str:
    if not title:
        return "INTCO Framing"
    suffix = {
        "product": " | INTCO Framing",
        "blogPost": " | INTCO Insights",
        "project": " | INTCO Projects",
        "solution": " | INTCO Solutions",
    }.get(doc_type, " | INTCO Framing")
    return f"{title}{suffix}"


def rewrite_description(description: str, locale: str, cache: dict[str, str]) -> str:
    value = (description or "").strip()
    if value:
        return value[:155]
    fallback = "Discover INTCO Framing interior decoration products, manufacturing capabilities and retail solutions."
    return translate(fallback, locale, cache)


def main() -> None:
    seed = json.loads(INPUT.read_text(encoding="utf-8"))
    cache: dict[str, str] = {}
    if CACHE.exists():
        cache = json.loads(CACHE.read_text(encoding="utf-8"))
    output: dict[str, Any] = {}
    if OUTPUT.exists():
        output = json.loads(OUTPUT.read_text(encoding="utf-8"))

    for locale in LOCALES:
        if locale in output:
            print(f"Skipping existing {LOCALES[locale]} ({locale})")
            continue
        print(f"Generating {LOCALES[locale]} ({locale})")
        texts: list[str] = []
        collect_object_text(seed["siteSettings"], texts)
        collect_object_text(seed["homePage"], texts)
        for collection in ["productCategories", "products", "solutions", "projects", "blogPosts", "pages"]:
            for doc in seed[collection]:
                collect_doc_text(doc, TEXT_FIELDS[collection], texts)
        translate_missing(locale, texts, cache)

        localized: dict[str, Any] = {}
        localized["siteSettings"] = localize_object(seed["siteSettings"], locale, cache)
        localized["homePage"] = localize_object(seed["homePage"], locale, cache)
        for collection in ["productCategories", "products", "solutions", "projects", "blogPosts", "pages"]:
            localized[collection] = [
                localize_doc(doc, TEXT_FIELDS[collection], locale, cache)
                for doc in seed[collection]
            ]
        output[locale] = localized
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
        OUTPUT.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
