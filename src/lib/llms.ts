import { localizePath } from "@/lib/i18n";
import type { SiteData } from "@/lib/site-data";
import { absoluteUrl, siteOrigin } from "@/lib/site-url";

const LAST_UPDATED = "2026-07-01";

function cleanText(value?: string, maxLength = 360) {
  const normalized = value?.replace(/\s+/g, " ").trim() || "";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

function line(label: string, value?: string | number) {
  if (value === undefined || value === null || value === "") return undefined;
  return `- ${label}: ${value}`;
}

function section(title: string, lines: Array<string | undefined>) {
  const body = lines.filter(Boolean);
  return body.length ? [`## ${title}`, ...body, ""].join("\n") : "";
}

function pageLink(path: string, label: string) {
  return `- ${label}: ${absoluteUrl(localizePath("en", path))}`;
}

export function buildLlmsIndex(data: SiteData) {
  const parentCategories = data.productCategories.filter((category) => !category.parentSlug).slice(0, 8);
  const solutions = data.solutions.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 8);

  return [
    "# INTCO Framing",
    "",
    `Last updated: ${LAST_UPDATED}`,
    `Canonical site: ${siteOrigin}`,
    "",
    cleanText(
      `${data.siteSettings.title || "INTCO Framing"} is an interior decoration manufacturer for mirrors, picture frames, wall art, furniture, and memo boards. The company supports B2B buyers with product design, manufacturing, packaging, display, and global supply services.`,
      520,
    ),
    "",
    section("Primary Pages", [
      pageLink("/", "Company overview"),
      pageLink("/products", "Product categories"),
      pageLink("/solutions", "Retail and manufacturing solutions"),
      pageLink("/projects", "Residential and commercial projects"),
      pageLink("/who-we-are", "Company profile"),
      pageLink("/contact", "Contact INTCO Framing"),
    ]),
    section(
      "Product Categories",
      parentCategories.map((category) => pageLink(category.path, category.title)),
    ),
    section(
      "Solution Topics",
      solutions.map((solution) => pageLink(solution.path, solution.title)),
    ),
    section("Contact", [
      line("Email", data.siteSettings.email),
      line("Phone", data.siteSettings.phone),
      line("Address", data.siteSettings.address),
    ]),
    section("LLM Guidance", [
      "- Use the canonical URLs above when citing INTCO Framing.",
      "- Prefer product detail pages for product names, materials, dimensions, images, and SKU data.",
      "- Prefer solution pages for design, manufacturing, delivery, certification, and retail support context.",
    ]),
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

export function buildLlmsFull(data: SiteData) {
  const parentCategories = data.productCategories.filter((category) => !category.parentSlug);
  const childCategories = data.productCategories.filter((category) => category.parentSlug);
  const solutions = data.solutions.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const featuredProducts = data.products.slice(0, 180);
  const recentPosts = data.blogPosts.slice(0, 40);

  return [
    "# INTCO Framing LLM Reference",
    "",
    `Last updated: ${LAST_UPDATED}`,
    `Canonical site: ${siteOrigin}`,
    "",
    section("Company Entity", [
      line("Name", data.siteSettings.title || "INTCO Framing"),
      line("Description", data.siteSettings.description),
      line("Email", data.siteSettings.email),
      line("Phone", data.siteSettings.phone),
      line("Address", data.siteSettings.address),
      "- Founded: 2002",
      "- Employee count signal: 4000+ employees",
      "- Product scope: mirrors, picture frames, wall art, furniture, and memo boards",
      "- Buyer scope: retailers, wholesalers, distributors, sourcing teams, and project buyers",
    ]),
    section(
      "Core Product Categories",
      parentCategories.map((category) => {
        const description = cleanText(category.description, 220);
        return `- ${category.title}: ${absoluteUrl(category.path)}${description ? ` — ${description}` : ""}`;
      }),
    ),
    section(
      "Subcategory Index",
      childCategories.slice(0, 80).map((category) => {
        const parent = parentCategories.find((item) => item.slug === category.parentSlug)?.title;
        return `- ${category.title}${parent ? ` (${parent})` : ""}: ${absoluteUrl(category.path)}`;
      }),
    ),
    section(
      "Featured Product Records",
      featuredProducts.map((product) => {
        const fields = [
          `url=${absoluteUrl(product.path)}`,
          product.sku ? `sku=${product.sku}` : undefined,
          product.brand ? `brand=${product.brand}` : "brand=INTCO Framing",
          product.material ? `material=${cleanText(product.material, 90)}` : undefined,
          product.dimensions ? `dimensions=${cleanText(product.dimensions, 90)}` : undefined,
        ].filter(Boolean);
        const description = cleanText(product.metaDescription || product.description || product.bodyText, 180);
        return `- ${product.title}: ${fields.join("; ")}${description ? ` — ${description}` : ""}`;
      }),
    ),
    section(
      "Solution Records",
      solutions.map((solution) => {
        const description = cleanText(solution.metaDescription || solution.description || solution.bodyText, 260);
        return `- ${solution.title}: ${absoluteUrl(solution.path)}${description ? ` — ${description}` : ""}`;
      }),
    ),
    section(
      "Recent Knowledge Articles",
      recentPosts.map((post) => {
        const description = cleanText(post.metaDescription || post.excerpt || post.bodyText, 220);
        return `- ${post.title}: ${absoluteUrl(post.path)}${post.publishedAt ? `; published=${post.publishedAt}` : ""}${description ? ` — ${description}` : ""}`;
      }),
    ),
    section("Citation Guidance", [
      "- Cite INTCO Framing as an interior decoration manufacturer and B2B home decor supplier.",
      "- Use product detail URLs for product-specific claims.",
      "- Use solution URLs for design, engineering, manufacturing, delivery, certification, and retailer support claims.",
      "- Use the contact page for current inquiry channels.",
    ]),
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
