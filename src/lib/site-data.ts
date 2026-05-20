import { createClient } from "next-sanity";
import seed from "../../sanity/seed/intcoframing.seed.json";

export type LinkItem = {
  label: string;
  path: string;
};

export type ImageLike = {
  imageUrl?: string;
  navImageUrl?: string;
  galleryUrls?: string[];
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
};

export type Solution = ImageLike & {
  title: string;
  slug: string;
  path: string;
  description?: string;
  bodyText?: string;
  order?: number;
};

export type Project = ImageLike & {
  title: string;
  slug: string;
  path: string;
  category?: string;
  description?: string;
  bodyText?: string;
};

export type BlogPost = ImageLike & {
  title: string;
  slug: string;
  path: string;
  category?: string;
  excerpt?: string;
  bodyText?: string;
  imageUrl?: string;
  publishedAt?: string;
};

export type ContentPage = ImageLike & {
  title: string;
  slug: string;
  path: string;
  description?: string;
  bodyText?: string;
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

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
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

export async function getSiteData(): Promise<SiteData> {
  try {
    const data = await client.fetch<Partial<SiteData>>(siteQuery, {}, { next: { revalidate: 60 } });
    if (!data?.siteSettings || !data?.homePage) {
      return fallbackData;
    }
    return {
      siteSettings: data.siteSettings,
      homePage: data.homePage,
      productCategories: data.productCategories?.length ? data.productCategories : fallbackData.productCategories,
      products: data.products?.length ? data.products : fallbackData.products,
      solutions: data.solutions?.length ? data.solutions : fallbackData.solutions,
      projects: data.projects?.length ? data.projects : fallbackData.projects,
      blogPosts: data.blogPosts?.length ? data.blogPosts : fallbackData.blogPosts,
      pages: data.pages?.length ? data.pages : fallbackData.pages,
    };
  } catch {
    return fallbackData;
  }
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
