import type { MetadataRoute } from "next";
import { languageAlternates, locales, localizePath } from "@/lib/i18n";
import { getSiteData, type ImageLike } from "@/lib/site-data";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 3600;

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  imageUrl?: string;
  publishedAt?: string;
};

const staticEntries: SitemapEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects/page/2", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects/page/3", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects/residential", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects/commercial", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products/mirror-all", priority: 0.8, changeFrequency: "weekly" },
  { path: "/picture-frame-all", priority: 0.8, changeFrequency: "weekly" },
  { path: "/picture-frame-all/page/2", priority: 0.7, changeFrequency: "weekly" },
  { path: "/picture-frame-all/page/3", priority: 0.7, changeFrequency: "weekly" },
  { path: "/products/art-all", priority: 0.8, changeFrequency: "weekly" },
  { path: "/products/furniture-all", priority: 0.8, changeFrequency: "weekly" },
  { path: "/products/memo-board-all", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/inspiration", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData("en");
  const entries = new Map<string, SitemapEntry>();

  const addEntry = (entry: SitemapEntry) => {
    if (!entry.path.includes("#") && !entry.path.includes("?")) {
      const existing = entries.get(entry.path);
      entries.set(entry.path, existing ? mergeEntry(existing, entry) : entry);
    }
  };

  staticEntries.forEach(addEntry);
  data.pages.forEach((page) => addEntry({ path: page.path, priority: page.path === "/contact" ? 0.85 : 0.75, changeFrequency: "monthly", imageUrl: page.imageUrl }));
  data.productCategories.forEach((category) => addEntry({ path: category.path, priority: category.parentSlug ? 0.75 : 0.85, changeFrequency: "weekly", imageUrl: category.imageUrl || category.navImageUrl }));
  data.products.forEach((product) => addEntry({ path: product.path, priority: 0.65, changeFrequency: "monthly", imageUrl: product.imageUrl }));
  data.solutions.forEach((solution) => addEntry({ path: solution.path, priority: 0.8, changeFrequency: "monthly", imageUrl: solution.imageUrl }));
  data.projects.forEach((project) => addEntry({ path: project.path, priority: 0.75, changeFrequency: "monthly", imageUrl: project.imageUrl }));
  data.blogPosts.forEach((post) => addEntry({ path: post.path, priority: 0.65, changeFrequency: "monthly", imageUrl: post.imageUrl, publishedAt: post.publishedAt }));

  return [...entries.values()].flatMap((entry) =>
    locales.map((locale) => ({
      url: absoluteUrl(localizePath(locale, entry.path)),
      lastModified: validDate(entry.publishedAt),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      images: absoluteImages(entry),
      alternates: {
        languages: absoluteLanguageAlternates(entry.path),
      },
    })),
  );
}

function mergeEntry(existing: SitemapEntry, next: SitemapEntry): SitemapEntry {
  return {
    ...existing,
    ...next,
    priority: Math.max(existing.priority, next.priority),
    changeFrequency: existing.priority >= next.priority ? existing.changeFrequency : next.changeFrequency,
    imageUrl: next.imageUrl || existing.imageUrl,
    publishedAt: next.publishedAt || existing.publishedAt,
  };
}

function absoluteLanguageAlternates(path: string) {
  return Object.fromEntries(Object.entries(languageAlternates(path)).map(([locale, href]) => [locale, absoluteUrl(href)]));
}

function absoluteImages(entry: ImageLike) {
  return entry.imageUrl ? [absoluteUrl(entry.imageUrl)] : undefined;
}

function validDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
