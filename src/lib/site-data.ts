import { createClient } from "next-sanity";
import seed from "../../sanity/seed/intcoframing.seed.json";
import localizedSeed from "../../sanity/seed/intcoframing.localized.json";
import { t, type Locale } from "./i18n";

export type LinkItem = {
  label: string;
  path: string;
};

export type ImageLike = {
  imageUrl?: string;
  navImageUrl?: string;
  galleryUrls?: string[];
  imageAlt?: string;
  navImageAlt?: string;
};

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  canonicalPath?: string;
  ogImageUrl?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
  anchorId?: string;
};

export type EvidenceItem = {
  claim: string;
  methodology?: string;
  sourceName?: string;
  sourceUrl?: string;
  collectedAt?: string;
  limitations?: string;
};

export type OfferItem = {
  offerType?: "inquiry" | "sample" | "quote";
  price?: number;
  priceCurrency?: string;
  availability?: string;
  url?: string;
  validFrom?: string;
  validThrough?: string;
  note?: string;
};

export type InquiryRouting = {
  inquiryFormId?: string;
  recipientEmail?: string;
  subjectPrefix?: string;
  crmPipeline?: string;
  successMessage?: string;
};

export type ContactPoint = {
  contactType?: string;
  phone?: string;
  email?: string;
  areaServed?: string;
  availableLanguages?: string[];
};

type SeoContent = {
  language?: Locale;
  translationGroup?: string;
  seo?: SeoFields;
  faqs?: FaqItem[];
  evidence?: EvidenceItem[];
  datePublished?: string;
  dateModified?: string;
  legacyUrls?: string[];
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
  contactPoints?: ContactPoint[];
  sameAs?: string[];
  navigation?: LinkItem[];
  footerColumns?: { title: string; links: LinkItem[] }[];
} & Pick<SeoContent, "language" | "translationGroup" | "seo" | "faqs" | "evidence">;

export type ProductCategory = ImageLike & SeoContent & {
  title: string;
  slug: string;
  path: string;
  parentSlug?: string;
  description?: string;
  order?: number;
  inquiryRouting?: InquiryRouting;
};

export type Product = ImageLike & SeoContent & {
  title: string;
  slug: string;
  path: string;
  sourceId?: number;
  categorySlugs?: string[];
  mainCategorySlug?: string;
  description?: string;
  bodyText?: string;
  sourceUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  sku?: string;
  brand?: string;
  material?: string;
  dimensions?: string;
  offers?: OfferItem[];
  inquiryRouting?: InquiryRouting;
};

export type Solution = ImageLike & SeoContent & {
  title: string;
  slug: string;
  path: string;
  description?: string;
  bodyText?: string;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  inquiryRouting?: InquiryRouting;
};

export type Project = ImageLike & SeoContent & {
  title: string;
  slug: string;
  path: string;
  category?: string;
  categoryKey?: string;
  description?: string;
  bodyText?: string;
  metaTitle?: string;
  metaDescription?: string;
  inquiryRouting?: InquiryRouting;
};

export type BlogPost = ImageLike & SeoContent & {
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

export type ContentPage = ImageLike & SeoContent & {
  title: string;
  slug: string;
  path: string;
  description?: string;
  bodyText?: string;
  metaTitle?: string;
  metaDescription?: string;
  inquiryRouting?: InquiryRouting;
};

export type HomePage = SeoContent & {
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

const seoListProjection = /* groq */ `
  language,
  translationGroup,
  seo,
  datePublished,
  dateModified,
  legacyUrls
`;

const seoDetailProjection = /* groq */ `
  ${seoListProjection},
  faqs,
  evidence
`;

const productCategoryListProjection = /* groq */ `{
  title,
  "slug": slug.current,
  path,
  parentSlug,
  description,
  order,
  imageAlt,
  navImageAlt,
  inquiryRouting,
  ${seoListProjection},
  "imageUrl": coalesce(image.asset->url, imageUrl),
  "navImageUrl": coalesce(navImage.asset->url, navImageUrl)
}`;

const productCategoryDetailProjection = /* groq */ `{
  ...,
  "slug": slug.current,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  "navImageUrl": coalesce(navImage.asset->url, navImageUrl)
}`;

const productListProjection = /* groq */ `{
  title,
  "slug": slug.current,
  path,
  sourceId,
  categorySlugs,
  mainCategorySlug,
  description,
  sourceUrl,
  metaTitle,
  metaDescription,
  sku,
  brand,
  material,
  dimensions,
  imageAlt,
  inquiryRouting,
  ${seoListProjection},
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;

const productDetailProjection = /* groq */ `{
  ...,
  ${seoDetailProjection},
  "slug": slug.current,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  "galleryUrls": coalesce(gallery[].asset->url, galleryUrls)
}`;

const solutionListProjection = /* groq */ `{
  title,
  "slug": slug.current,
  path,
  description,
  order,
  metaTitle,
  metaDescription,
  imageAlt,
  inquiryRouting,
  ${seoListProjection},
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;

const solutionDetailProjection = /* groq */ `{
  ...,
  ${seoDetailProjection},
  "slug": slug.current,
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;

const projectListProjection = /* groq */ `{
  title,
  "slug": slug.current,
  path,
  category,
  categoryKey,
  description,
  metaTitle,
  metaDescription,
  imageAlt,
  inquiryRouting,
  ${seoListProjection},
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;

const projectDetailProjection = /* groq */ `{
  ...,
  ${seoDetailProjection},
  "slug": slug.current,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  "galleryUrls": coalesce(gallery[].asset->url, galleryUrls)
}`;

const blogPostListProjection = /* groq */ `{
  title,
  "slug": slug.current,
  path,
  category,
  categoryKey,
  excerpt,
  publishedAt,
  metaTitle,
  metaDescription,
  imageAlt,
  ${seoListProjection},
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;

const blogPostDetailProjection = /* groq */ `{
  ...,
  ${seoDetailProjection},
  "slug": slug.current,
  "imageUrl": coalesce(image.asset->url, imageUrl),
  "galleryUrls": coalesce(gallery[].asset->url, galleryUrls)
}`;

const contentPageListProjection = /* groq */ `{
  title,
  "slug": slug.current,
  path,
  description,
  metaTitle,
  metaDescription,
  imageAlt,
  inquiryRouting,
  ${seoListProjection},
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;

const contentPageDetailProjection = /* groq */ `{
  ...,
  ${seoDetailProjection},
  "slug": slug.current,
  "imageUrl": coalesce(image.asset->url, imageUrl)
}`;

const siteQuery = /* groq */ `{
  "siteSettings": coalesce(*[_type == "siteSettings" && language == $locale][0], *[_type == "siteSettings" && coalesce(language, "en") == "en"][0]){
    ...,
    "logoUrl": coalesce(logo.asset->url, logoUrl),
    "footerLogoUrl": coalesce(footerLogo.asset->url, footerLogoUrl)
  },
  "homePage": coalesce(*[_type == "homePage" && language == $locale][0], *[_type == "homePage" && coalesce(language, "en") == "en"][0]){
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
  "productCategories": select(
    count(*[_type == "productCategory" && language == $locale]) > 0 =>
      *[_type == "productCategory" && language == $locale] | order(order asc, title asc)${productCategoryListProjection},
    *[_type == "productCategory" && coalesce(language, "en") == "en"] | order(order asc, title asc)${productCategoryListProjection}
  ),
  "products": select(
    count(*[_type == "product" && language == $locale]) > 0 =>
      *[_type == "product" && language == $locale] | order(publishedAt desc, title asc)${productListProjection},
    *[_type == "product" && coalesce(language, "en") == "en"] | order(publishedAt desc, title asc)${productListProjection}
  ),
  "solutions": select(
    count(*[_type == "solution" && language == $locale]) > 0 =>
      *[_type == "solution" && language == $locale] | order(order asc, title asc)${solutionListProjection},
    *[_type == "solution" && coalesce(language, "en") == "en"] | order(order asc, title asc)${solutionListProjection}
  ),
  "projects": select(
    count(*[_type == "project" && language == $locale]) > 0 =>
      *[_type == "project" && language == $locale] | order(title asc)${projectListProjection},
    *[_type == "project" && coalesce(language, "en") == "en"] | order(title asc)${projectListProjection}
  ),
  "blogPosts": select(
    count(*[_type == "blogPost" && language == $locale]) > 0 =>
      *[_type == "blogPost" && language == $locale] | order(publishedAt desc, title asc)${blogPostListProjection},
    *[_type == "blogPost" && coalesce(language, "en") == "en"] | order(publishedAt desc, title asc)${blogPostListProjection}
  ),
  "pages": select(
    count(*[_type == "contentPage" && language == $locale]) > 0 =>
      *[_type == "contentPage" && language == $locale] | order(title asc)${contentPageListProjection},
    *[_type == "contentPage" && coalesce(language, "en") == "en"] | order(title asc)${contentPageListProjection}
  ),
  "currentProductCategory": coalesce(
    *[_type == "productCategory" && language == $locale && (path == $path || slug.current == $slug)][0]${productCategoryDetailProjection},
    *[_type == "productCategory" && coalesce(language, "en") == "en" && (path == $path || slug.current == $slug)][0]${productCategoryDetailProjection}
  ),
  "currentProduct": coalesce(
    *[_type == "product" && language == $locale && (path == $path || slug.current == $slug)][0]${productDetailProjection},
    *[_type == "product" && coalesce(language, "en") == "en" && (path == $path || slug.current == $slug)][0]${productDetailProjection}
  ),
  "currentSolution": coalesce(
    *[_type == "solution" && language == $locale && (path == $path || slug.current == $slug)][0]${solutionDetailProjection},
    *[_type == "solution" && coalesce(language, "en") == "en" && (path == $path || slug.current == $slug)][0]${solutionDetailProjection}
  ),
  "currentProject": coalesce(
    *[_type == "project" && language == $locale && (path == $path || slug.current == $slug)][0]${projectDetailProjection},
    *[_type == "project" && coalesce(language, "en") == "en" && (path == $path || slug.current == $slug)][0]${projectDetailProjection}
  ),
  "currentBlogPost": coalesce(
    *[_type == "blogPost" && language == $locale && (path == $path || path == $newsPath || slug.current == $slug)][0]${blogPostDetailProjection},
    *[_type == "blogPost" && coalesce(language, "en") == "en" && (path == $path || path == $newsPath || slug.current == $slug)][0]${blogPostDetailProjection}
  ),
  "currentPage": coalesce(
    *[_type == "contentPage" && language == $locale && (path == $path || slug.current == $slug)][0]${contentPageDetailProjection},
    *[_type == "contentPage" && coalesce(language, "en") == "en" && (path == $path || slug.current == $slug)][0]${contentPageDetailProjection}
  )
}`;

export const fallbackData = seed as SiteData;
const localizedFallback = localizedSeed as Partial<Record<Exclude<Locale, "en">, SiteData>>;

type RemoteSiteData = Partial<SiteData> & {
  currentProductCategory?: ProductCategory;
  currentProduct?: Product;
  currentSolution?: Solution;
  currentProject?: Project;
  currentBlogPost?: BlogPost;
  currentPage?: ContentPage;
};

export async function getSiteData(locale: Locale = "en", currentPath = ""): Promise<SiteData> {
  try {
    const path = cleanPath(currentPath || "");
    const slug = pathSlug(path);
    const newsPath = slug ? `/news/${slug}` : "";
    const data = await client.fetch<RemoteSiteData>(siteQuery, { locale, path, slug, newsPath }, { next: { revalidate: 60 } });
    if (!data?.siteSettings || !data?.homePage) {
      return localizeSiteData(fallbackData, locale);
    }
    const remoteData = {
      siteSettings: data.siteSettings,
      homePage: data.homePage,
      productCategories: mergeCurrentItem(data.productCategories?.length ? data.productCategories : fallbackData.productCategories, data.currentProductCategory),
      products: mergeCurrentItem(data.products?.length ? data.products : fallbackData.products, data.currentProduct),
      solutions: mergeCurrentItem(data.solutions?.length ? data.solutions : fallbackData.solutions, data.currentSolution),
      projects: mergeCurrentItem(data.projects?.length ? data.projects : fallbackData.projects, data.currentProject),
      blogPosts: mergeCurrentItem(data.blogPosts?.length ? data.blogPosts : fallbackData.blogPosts, data.currentBlogPost),
      pages: mergeCurrentItem(data.pages?.length ? data.pages : fallbackData.pages, data.currentPage),
    };
    if (hasRemoteLocaleData(remoteData, locale)) {
      return normalizeSiteAssetUrls(remoteData);
    }
    return localizeSiteData(remoteData, locale);
  } catch {
    return localizeSiteData(fallbackData, locale);
  }
}

function pathSlug(path: string) {
  return path.split("/").filter(Boolean).at(-1) || "";
}

function mergeCurrentItem<T extends { slug: string; path: string }>(items: T[], current?: T): T[] {
  if (!current) return items;
  let found = false;
  const merged = items.map((item) => {
    const matches = item.path === current.path || item.slug === current.slug;
    if (!matches) return item;
    found = true;
    return { ...item, ...current };
  });
  return found ? merged : [current, ...merged];
}

function hasRemoteLocaleData(data: SiteData, locale: Locale) {
  if (locale === "en") return true;
  return (
    data.siteSettings.language === locale ||
    data.homePage.language === locale ||
    data.productCategories.some((item) => item.language === locale) ||
    data.products.some((item) => item.language === locale) ||
    data.solutions.some((item) => item.language === locale) ||
    data.projects.some((item) => item.language === locale) ||
    data.blogPosts.some((item) => item.language === locale) ||
    data.pages.some((item) => item.language === locale)
  );
}

function localizeSiteData(data: SiteData, locale: Locale): SiteData {
  const normalizedData = normalizeSiteAssetUrls(data);
  if (locale === "en") return normalizedData;
  const localized = localizedFallback[locale];
  if (!localized) return normalizedData;
  const normalizedLocalized = normalizeSiteAssetUrls(localized as SiteData);
  const homePage = { ...(normalizedLocalized.homePage || normalizedData.homePage) };
  if (homePage.heroSlides?.[0] && normalizedData.homePage.heroSlides?.[0]) {
    homePage.heroSlides = [...homePage.heroSlides];
    homePage.heroSlides[0] = { ...homePage.heroSlides[0], title: normalizedData.homePage.heroSlides[0].title };
  }

  return polishLocalizedSiteData({
    siteSettings: { ...(normalizedLocalized.siteSettings || normalizedData.siteSettings), title: normalizedData.siteSettings.title },
    homePage: { ...homePage, title: normalizedData.homePage.title },
    productCategories: mergeBySlug(normalizedData.productCategories, normalizedLocalized.productCategories),
    products: mergeBySlug(normalizedData.products, normalizedLocalized.products),
    solutions: mergeBySlug(normalizedData.solutions, normalizedLocalized.solutions),
    projects: mergeBySlug(normalizedData.projects, normalizedLocalized.projects),
    blogPosts: mergeBySlug(normalizedData.blogPosts, normalizedLocalized.blogPosts),
    pages: mergeBySlug(normalizedData.pages, normalizedLocalized.pages),
  }, locale);
}

function normalizeSiteAssetUrls(data: Partial<SiteData>): SiteData {
  return {
    siteSettings: {
      ...(data.siteSettings || fallbackData.siteSettings),
      logoUrl: encodeRemoteUrl(data.siteSettings?.logoUrl),
      footerLogoUrl: encodeRemoteUrl(data.siteSettings?.footerLogoUrl),
    },
    homePage: {
      ...(data.homePage || fallbackData.homePage),
      heroSlides: (data.homePage?.heroSlides || fallbackData.homePage.heroSlides)?.map((slide) => ({
        ...slide,
        imageUrl: encodeRemoteUrl(slide.imageUrl),
      })),
      companyProfile: data.homePage?.companyProfile
        ? {
            ...data.homePage.companyProfile,
            imageUrl: encodeRemoteUrl(data.homePage.companyProfile.imageUrl),
          }
        : data.homePage?.companyProfile,
    },
    productCategories: (data.productCategories || fallbackData.productCategories).map(normalizeImageLike),
    products: (data.products || fallbackData.products).map(normalizeImageLike),
    solutions: (data.solutions || fallbackData.solutions).map(normalizeImageLike),
    projects: (data.projects || fallbackData.projects).map(normalizeImageLike),
    blogPosts: (data.blogPosts || fallbackData.blogPosts).map(normalizeImageLike),
    pages: (data.pages || fallbackData.pages).map(normalizeImageLike),
  };
}

function normalizeImageLike<T extends ImageLike>(item: T): T {
  return {
    ...item,
    imageUrl: encodeRemoteUrl(item.imageUrl),
    navImageUrl: encodeRemoteUrl(item.navImageUrl),
    galleryUrls: item.galleryUrls?.map(encodeRemoteUrl).filter(Boolean) as string[] | undefined,
  };
}

function encodeRemoteUrl(value?: string) {
  if (!value) return undefined;
  try {
    return encodeURI(decodeURI(value));
  } catch {
    return encodeURI(value);
  }
}

const categoryTitleOverrides: Partial<Record<Exclude<Locale, "en">, Record<string, string>>> = {
  es: {
    mirror: "Espejos",
    "picture-frame": "Marcos de fotos",
    art: "Arte mural",
    furniture: "Muebles",
    "memo-board": "Tableros de notas",
  },
  pt: {
    mirror: "Espelhos",
    "picture-frame": "Porta-retratos",
    art: "Arte de parede",
    furniture: "Móveis",
    "memo-board": "Quadros de notas",
  },
  fr: {
    mirror: "Miroirs",
    "picture-frame": "Cadres photo",
    art: "Art mural",
    furniture: "Meubles",
    "memo-board": "Tableaux mémo",
  },
  de: {
    mirror: "Spiegel",
    "picture-frame": "Bilderrahmen",
    art: "Wandkunst",
    furniture: "Möbel",
    "memo-board": "Memoboards",
  },
  ja: {
    mirror: "ミラー",
    "picture-frame": "額縁",
    art: "アート",
    furniture: "家具",
    "memo-board": "メモボード",
  },
};

const solutionTitleOverrides: Partial<Record<Exclude<Locale, "en">, Record<string, string>>> = {
  es: {
    "business-insights-trends": "Perspectivas y tendencias empresariales",
    "design-engineering": "Diseño e ingeniería",
    "manufacturing-delivery": "Fabricación y entrega",
    "global-production-and-supply": "Producción y suministro global",
    certification: "Certificación",
    "retailer-support": "Soporte para minoristas",
  },
  pt: {
    "business-insights-trends": "Insights e tendências de negócios",
    "design-engineering": "Design e engenharia",
    "manufacturing-delivery": "Fabricação e entrega",
    "global-production-and-supply": "Produção e fornecimento global",
    certification: "Certificação",
    "retailer-support": "Suporte ao varejista",
  },
  fr: {
    "business-insights-trends": "Perspectives et tendances commerciales",
    "design-engineering": "Conception et ingénierie",
    "manufacturing-delivery": "Fabrication et livraison",
    "global-production-and-supply": "Production et approvisionnement mondiaux",
    certification: "Certification",
    "retailer-support": "Assistance aux détaillants",
  },
  de: {
    "business-insights-trends": "Geschäftseinblicke und Trends",
    "design-engineering": "Design und Technik",
    "manufacturing-delivery": "Fertigung und Lieferung",
    "global-production-and-supply": "Globale Produktion und Lieferung",
    certification: "Zertifizierung",
    "retailer-support": "Händlerunterstützung",
  },
  ja: {
    "business-insights-trends": "ビジネスインサイトとトレンド",
    "design-engineering": "設計とエンジニアリング",
    "manufacturing-delivery": "製造と配送",
    "global-production-and-supply": "グローバル生産・供給",
    certification: "認証",
    "retailer-support": "リテーラーサポート",
  },
};

const pageTitleOverrides: Partial<Record<Exclude<Locale, "en">, Record<string, string>>> = {
  es: { "who-we-are": "Quiénes somos" },
  ja: {
    contact: "お問い合わせ",
    "who-we-are": "会社概要",
    sustainability: "サステナビリティ",
    philosophy: "理念",
  },
};

function polishLocalizedSiteData(data: SiteData, locale: Locale): SiteData {
  if (locale === "en") return data;
  const categories = categoryTitleOverrides[locale] || {};
  const solutions = solutionTitleOverrides[locale] || {};
  const pages = pageTitleOverrides[locale] || {};
  const navLabels: Record<string, string> = {
    "/": t(locale, "home"),
    "/products": t(locale, "products"),
    "/projects": t(locale, "projects"),
    "/solutions": t(locale, "solutions"),
    "/who-we-are": t(locale, "aboutIntco"),
    "/blog": t(locale, "blog"),
    "/contact": t(locale, "contact"),
  };

  return {
    ...data,
    siteSettings: {
      ...data.siteSettings,
      navigation: data.siteSettings.navigation?.map((item) => ({ ...item, label: navLabels[item.path] || item.label })),
      footerColumns: data.siteSettings.footerColumns?.map((column) => ({
        ...column,
        title: column.title === "Producto" || column.title === "Produto" || column.title === "Produit" ? t(locale, "product") : column.title,
        links: column.links.map((link) => ({ ...link, label: navLabels[link.path] || titleForCategoryPath(link.path, categories) || link.label })),
      })),
    },
    homePage: {
      ...data.homePage,
      heroSlides: data.homePage.heroSlides?.map((slide) => ({
        ...slide,
        title: slide.primaryCta?.path ? titleForCategoryPath(slide.primaryCta.path, categories) || slide.title : slide.title,
      })),
    },
    productCategories: data.productCategories.map((category) => {
      const title = categories[category.slug];
      return title ? withLocalizedTitle(category, title, "INTCO Framing") : category;
    }),
    solutions: data.solutions.map((solution) => {
      const title = solutions[solution.slug];
      return title ? withLocalizedTitle(solution, title, "INTCO Solutions") : solution;
    }),
    pages: data.pages.map((page) => {
      const title = pages[page.slug] || navLabels[page.path];
      return title ? withLocalizedTitle(page, title, "INTCO Framing") : page;
    }),
  };
}

function titleForCategoryPath(path: string, categories: Record<string, string>) {
  const slug = path.replace(/^\/+/, "");
  return categories[slug];
}

function withLocalizedTitle<T extends { title: string; metaTitle?: string; imageAlt?: string }>(item: T, title: string, suffix: string): T {
  return {
    ...item,
    title,
    metaTitle: item.metaTitle ? `${title} | ${suffix}` : item.metaTitle,
    imageAlt: item.imageAlt ? title : item.imageAlt,
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
