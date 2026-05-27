import { createClient } from "next-sanity";
import seed from "../../sanity/seed/intcoframing.seed.json";
import localizedSeed from "../../sanity/seed/intcoframing.localized.json";
import type { Locale } from "./i18n";

export type LinkItem = {
  label: string;
  path: string;
};

export type ImageLike = {
  imageUrl?: string;
  navImageUrl?: string;
  galleryUrls?: string[];
  imageAlt?: string;
};

export type SiteSettings = {
  title: string;
  description?: string;
  sourceSite?: string;
  logoUrl?: string;
  footerLogoUrl?: string;
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  navigation?: LinkItem[];
  footerColumns?: { title: string; links: LinkItem[] }[];
};

export type ProductCategory = ImageLike & {
  title: string;
  slug: string;
  path: string;
  parentSlug?: string;
  description?: string;
  order?: number;
};

export type Product = ImageLike & {
  title: string;
  slug: string;
  path: string;
  categorySlugs?: string[];
  mainCategorySlug?: string;
  description?: string;
  bodyText?: string;
  sourceUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type Solution = ImageLike & {
  title: string;
  slug: string;
  path: string;
  description?: string;
  bodyText?: string;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
};

export type Project = ImageLike & {
  title: string;
  slug: string;
  path: string;
  category?: string;
  categoryKey?: string;
  description?: string;
  bodyText?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogPost = ImageLike & {
  title: string;
  slug: string;
  path: string;
  category?: string;
  categoryKey?: string;
  excerpt?: string;
  bodyText?: string;
  imageUrl?: string;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type ContentPage = ImageLike & {
  title: string;
  slug: string;
  path: string;
  description?: string;
  bodyText?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type HomePage = {
  title: string;
  heroSlides?: Array<{
    title: string;
    subtitle?: string;
    imageUrl?: string;
    primaryCta?: LinkItem;
    secondaryCta?: LinkItem;
  }>;
  companyProfile?: {
    title?: string;
    description?: string;
    points?: string[];
    imageUrl?: string;
  };
  stats?: Array<{ value: string; label: string }>;
  projectsIntro?: { title?: string; description?: string; cta?: string };
  blogIntro?: { title?: string; description?: string };
};

export type SiteData = {
  siteSettings: SiteSettings;
  homePage: HomePage;
  productCategories: ProductCategory[];
  products: Product[];
  solutions: Solution[];
  projects: Project[];
  blogPosts: BlogPost[];
  pages: ContentPage[];
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o10sbz2i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-20";
const readToken = process.env.SANITY_API_READ_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: readToken,
  useCdn: !readToken,
});

const siteQuery = /* groq */ `{
  "siteSettings": *[_type == "siteSettings"][0]{
    ...,
    "logoUrl": coalesce(logo.asset->url, logoUrl),
    "footerLogoUrl": coalesce(footerLogo.asset->url, footerLogoUrl)
  },
  "homePage": *[_type == "homePage"][0]{
    ...,
    heroSlides[]{
      ...,
      "imageUrl": coalesce(image.asset->url, imageUrl)
    },
    companyProfile{
      ...,
      "imageUrl": coalesce(image.asset->url, imageUrl)
    }
  },
  "productCategories": *[_type == "productCategory"] | order(order asc, title asc){
    ...,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "navImageUrl": coalesce(navImage.asset->url, navImageUrl)
  },
  "products": *[_type == "product"] | order(publishedAt desc, title asc){
    ...,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "galleryUrls": coalesce(gallery[].asset->url, galleryUrls)
  },
  "solutions": *[_type == "solution"] | order(order asc, title asc){
    ...,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl)
  },
  "projects": *[_type == "project"] | order(title asc){
    ...,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "galleryUrls": coalesce(gallery[].asset->url, galleryUrls)
  },
  "blogPosts": *[_type == "blogPost"] | order(publishedAt desc, title asc){
    ...,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "galleryUrls": coalesce(gallery[].asset->url, galleryUrls)
  },
  "pages": *[_type == "contentPage"] | order(title asc){
    ...,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl)
  }
}`;

export const fallbackData = seed as SiteData;
const localizedFallback = localizedSeed as Partial<Record<Exclude<Locale, "en">, SiteData>>;

export async function getSiteData(locale: Locale = "en"): Promise<SiteData> {
  try {
    const data = await client.fetch<Partial<SiteData>>(siteQuery, {}, { next: { revalidate: 60 } });
    if (!data?.siteSettings || !data?.homePage) {
      return localizeSiteData(fallbackData, locale);
    }
    return localizeSiteData({
      siteSettings: data.siteSettings,
      homePage: data.homePage,
      productCategories: data.productCategories?.length ? data.productCategories : fallbackData.productCategories,
      products: data.products?.length ? data.products : fallbackData.products,
      solutions: data.solutions?.length ? data.solutions : fallbackData.solutions,
      projects: data.projects?.length ? data.projects : fallbackData.projects,
      blogPosts: data.blogPosts?.length ? data.blogPosts : fallbackData.blogPosts,
      pages: data.pages?.length ? data.pages : fallbackData.pages,
    }, locale);
  } catch {
    return localizeSiteData(fallbackData, locale);
  }
}

function localizeSiteData(data: SiteData, locale: Locale): SiteData {
  if (locale === "en") return data;
  const localized = localizedFallback[locale];
  if (!localized) return data;
  const homePage = { ...(localized.homePage || data.homePage) };
  if (homePage.heroSlides?.[0] && data.homePage.heroSlides?.[0]) {
    homePage.heroSlides = [...homePage.heroSlides];
    homePage.heroSlides[0] = { ...homePage.heroSlides[0], title: data.homePage.heroSlides[0].title };
  }

  return {
    siteSettings: { ...(localized.siteSettings || data.siteSettings), title: data.siteSettings.title },
    homePage: { ...homePage, title: data.homePage.title },
    productCategories: mergeBySlug(data.productCategories, localized.productCategories),
    products: mergeBySlug(data.products, localized.products),
    solutions: mergeBySlug(data.solutions, localized.solutions),
    projects: mergeBySlug(data.projects, localized.projects),
    blogPosts: mergeBySlug(data.blogPosts, localized.blogPosts),
    pages: mergeBySlug(data.pages, localized.pages),
  };
}

function mergeBySlug<T extends { slug: string }>(base: T[], localized: T[] = []) {
  const bySlug = new Map(localized.map((item) => [item.slug, item]));
  return base.map((item) => {
    const translated = bySlug.get(item.slug);
    if (!translated) return item;
    const merged = { ...item, ...translated };
    if ("category" in item && item.category) {
      return { ...merged, categoryKey: item.category };
    }
    return merged;
  });
}

export function cleanPath(path: string) {
  const normalized = path.trim().replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "/";
}

export function linesFromBody(bodyText?: string, max = 12) {
  const noise = new Set([
    "Blog",
    "ABOUT THIS ITEM",
    "Description",
    "Highlights",
    "Related Products",
    "SERVICES WE PROVIDE",
    "Qingtian Road, Zibo, Shandong, China",
    "Item#:",
    "Color:",
    "Size:",
    "Quantity:",
    "-",
    "+",
    '">',
  ]);

  const lines = (bodyText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 2 && !noise.has(line))
    .filter((line, index, list) => list.indexOf(line) === index);

  return lines.slice(0, max);
}

export function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}
