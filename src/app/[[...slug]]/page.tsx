import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DocumentLanguage } from "@/components/document-language";
import { SiteChrome } from "@/components/site-chrome";
import {
  blogListingPageCount,
  BusinessInsightsChildView,
  BlogListingView,
  BlogPostView,
  ContactView,
  ContentPageView,
  EnquiryListView,
  HomeView,
  ProductDetailSourceView,
  ProductListingView,
  ProductsLandingView,
  ProjectDetailView,
  ProjectsListingView,
  SearchResultsView,
  SolutionDetailView,
  SolutionsListingView,
} from "@/components/site-views";
import { getSiteData, type OfferItem, type Product } from "@/lib/site-data";
import { languageAlternates, localizePath, parseLocalizedSegments, t, type Locale } from "@/lib/i18n";
import { absoluteUrl, siteOrigin } from "@/lib/site-url";
import { SOURCE_SEARCH_PAGE_SIZE } from "@/lib/source-search-results";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<RawRouteQuery>;
};

type RawRouteQuery = {
  keyword?: string | string[];
  category?: string | string[];
};

type RouteQuery = {
  keyword: string;
  category?: string;
  hasKeyword: boolean;
};

type SearchRouteInfo = {
  pageNumber: number;
  keyword: string;
  path: string;
};

const socialProfiles = [
  "https://www.facebook.com/IntcoFraming.cn/",
  "https://www.youtube.com/@intcoframing",
  "https://www.linkedin.com/company/intcoframing/",
  "https://twitter.com/intco_framing",
  "https://www.instagram.com/intcoframing/",
  "https://www.pinterest.com/intco_framing/",
];

const PROJECTS_SOURCE_PAGE_SIZE = 5;
const BUSINESS_INSIGHTS_CHILD_PATHS = new Set([
  "/solutions/business-insights-trends/trend",
  "/solutions/business-insights-trends/trend-2",
  "/solutions/business-insights-trends/trend-2-2",
  "/solutions/business-insights-trends/bestsellers",
]);

const legacyProductAllRedirects: Record<string, string> = {
  "/products/mirror-all": "/mirror",
  "/products/picture-frame-all": "/picture-frame",
  "/products/art-all": "/art",
  "/products/furniture-all": "/furniture",
  "/products/memo-board-all": "/memo-board",
};

type JsonLdNode = Record<string, unknown>;

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const query = normalizeRouteQuery((await searchParams) || {});
  const { locale, path } = parseLocalizedSegments(slug);
  const data = await getSiteData(locale, path);
  const searchRoute = searchRouteInfoFor(path, query, data);
  const meta = searchRoute ? searchRouteMeta(searchRoute.pageNumber) : resolveRouteMeta(path, data, locale);
  const canonicalPath = searchRoute ? searchLocalizedHref(locale, searchRoute) : localizePath(locale, path);
  const alternates = searchRoute ? searchLanguageAlternates(searchRoute, locale) : languageAlternates(path);

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(siteOrigin),
    alternates: {
      canonical: canonicalPath,
      languages: alternates,
    },
    robots: meta.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: absoluteUrl(canonicalPath),
      images: meta.image ? [{ url: meta.image, alt: meta.imageAlt || meta.title }] : undefined,
    },
  };
}

export default async function SitePage({ params, searchParams }: PageProps) {
  const { slug = [] } = await params;
  const query = normalizeRouteQuery((await searchParams) || {});
  const { locale, path } = parseLocalizedSegments(slug);
  const data = await getSiteData(locale, path);
  const searchRoute = searchRouteInfoFor(path, query, data);
  const jsonLd = buildStructuredData(
    path,
    data,
    locale,
    searchRoute
      ? {
          meta: searchRouteMeta(searchRoute.pageNumber),
          localizedPath: searchLocalizedHref(locale, searchRoute),
          structuredPath: "/index.php",
          includeBreadcrumb: false,
        }
      : undefined,
  );
  const chromePath = searchRoute && path === "/" ? "/index.php" : path;
  const languagePath = searchRoute ? searchLanguageSwitcherPath(searchRoute) : path;

  return (
    <SiteChrome settings={data.siteSettings} categories={data.productCategories} solutions={data.solutions} locale={locale} currentPath={chromePath} languagePath={languagePath}>
      <DocumentLanguage locale={locale} />
      {jsonLd.map((item, index) => (
        <script
          key={`${String(item["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyJsonLd(item) }}
        />
      ))}
      {renderRoute(path, data, locale, query)}
    </SiteChrome>
  );
}

function renderRoute(path: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale, query: RouteQuery) {
  const searchRoute = searchRouteInfoFor(path, query, data);
  if (searchRoute) {
    return <SearchResultsView products={data.products} posts={data.blogPosts} keyword={searchRoute.keyword} locale={locale} pageNumber={searchRoute.pageNumber} />;
  }

  if (path === "/") return <HomeView data={data} locale={locale} />;

  const legacyProductAllTarget = legacyProductAllRedirects[path];
  if (legacyProductAllTarget) permanentRedirect(localizePath(locale, legacyProductAllTarget));
  if (path === "/news") permanentRedirect(localizePath(locale, "/blog"));
  if (path.startsWith("/solutions/business-insights-trends/")) {
    if (BUSINESS_INSIGHTS_CHILD_PATHS.has(path)) {
      return <BusinessInsightsChildView path={path} locale={locale} />;
    }
    notFound();
  }

  if (path === "/products") {
    return (
      <ProductsLandingView
        page={data.pages.find((item) => item.path === "/products")}
        products={data.products}
        categories={data.productCategories}
        projects={data.projects}
        locale={locale}
      />
    );
  }

  if (path === "/solutions") return <SolutionsListingView solutions={data.solutions} page={data.pages.find((item) => item.path === "/solutions")} products={data.products} projects={data.projects} locale={locale} />;
  const solution = data.solutions.find((item) => item.path === path || path.endsWith(`/${item.slug}`));
  if (solution) return <SolutionDetailView solution={solution} products={data.products} projects={data.projects} locale={locale} />;

  if (path === "/projects") return <ProjectsListingView projects={data.projects} page={data.pages.find((item) => item.path === "/projects")} locale={locale} />;
  const projectPageMatch = path.match(/^\/projects\/page\/(\d+)$/);
  if (projectPageMatch) {
    const pageNumber = Number(projectPageMatch[1]);
    const totalPages = Math.max(1, Math.ceil(data.projects.length / PROJECTS_SOURCE_PAGE_SIZE));
    if (Number.isInteger(pageNumber) && pageNumber >= 2 && pageNumber <= totalPages) {
      return <ProjectsListingView projects={data.projects} page={data.pages.find((item) => item.path === "/projects")} locale={locale} pageNumber={pageNumber} />;
    }
    notFound();
  }
  if (path === "/projects/residential") return <ProjectsListingView projects={data.projects} category="Residential" page={data.pages.find((item) => item.path === "/projects")} locale={locale} />;
  if (path === "/projects/commercial") return <ProjectsListingView projects={data.projects} category="Commercial" page={data.pages.find((item) => item.path === "/projects")} locale={locale} />;
  if (path === "/large-commercial-space") permanentRedirect(localizePath(locale, "/projects/large-commercial-space"));
  const project = data.projects.find((item) => item.path === path || path === `/projects/${item.slug}`);
  if (project) return <ProjectDetailView project={project} products={data.products} projects={data.projects} posts={data.blogPosts} locale={locale} />;

  const blogPage = data.pages.find((item) => item.path === "/blog");
  if (path === "/blog") return <BlogListingView posts={data.blogPosts} locale={locale} activeCategory={query.category} page={blogPage} />;
  const blogPageMatch = path.match(/^\/blog\/page\/(\d+)$/);
  if (blogPageMatch) {
    const pageNumber = Number(blogPageMatch[1]);
    const totalPages = blogListingPageCount(data.blogPosts, blogPage, query.category);
    if (Number.isInteger(pageNumber) && pageNumber >= 2 && pageNumber <= totalPages) {
      return <BlogListingView posts={data.blogPosts} locale={locale} activeCategory={query.category} page={blogPage} pageNumber={pageNumber} />;
    }
    notFound();
  }
  if (path === "/inspiration") return <BlogListingView posts={data.blogPosts} locale={locale} activeCategory="Inspiration" page={blogPage} basePath="/inspiration" />;
  const inspirationPageMatch = path.match(/^\/inspiration\/page\/(\d+)$/);
  if (inspirationPageMatch) {
    const pageNumber = Number(inspirationPageMatch[1]);
    const totalPages = blogListingPageCount(data.blogPosts, blogPage, "Inspiration");
    if (Number.isInteger(pageNumber) && pageNumber >= 2 && pageNumber <= totalPages) {
      return <BlogListingView posts={data.blogPosts} locale={locale} activeCategory="Inspiration" page={blogPage} pageNumber={pageNumber} basePath="/inspiration" />;
    }
    notFound();
  }
  const post = data.blogPosts.find((item) => item.path === path || path === `/news/${item.slug}`);
  if (post) return <BlogPostView post={post} posts={data.blogPosts} locale={locale} page={blogPage} />;

  if (path === "/enquiry-list") return <EnquiryListView locale={locale} />;

  const page = data.pages.find((item) => item.path === path);
  if (page?.path === "/contact") return <ContactView page={page} locale={locale} />;
  if (page) return <ContentPageView page={page} locale={locale} />;

  const category = data.productCategories.find((item) => item.path === path);
  if (category) {
    const children = data.productCategories.filter((item) => item.parentSlug === category.slug);
    const products = data.products.filter((product) => product.categorySlugs?.includes(category.slug));
    return (
      <ProductListingView
        title={category.title}
        description={category.description}
        products={products}
        categories={children}
        allCategories={data.productCategories}
        heroImage={category.imageUrl || category.navImageUrl}
        category={category}
        locale={locale}
      />
    );
  }

  const product = data.products.find((item) => item.path === path || path.endsWith(`/${item.slug}`));
  if (product) return <ProductDetailSourceView 
      product={product} 
      locale={locale} 
      relatedProducts={data.products.filter((item) => item.slug !== product.slug && item.categorySlugs?.some((slug) => product.categorySlugs?.includes(slug))).slice(0, 8)}
      categories={data.productCategories}
    />;

  notFound();
}

type RouteMeta = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

function normalizeRouteQuery(query: RawRouteQuery): RouteQuery {
  return {
    keyword: queryStringValue(query.keyword).trim(),
    category: queryStringValue(query.category) || undefined,
    hasKeyword: Object.prototype.hasOwnProperty.call(query, "keyword"),
  };
}

function queryStringValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function searchRouteInfoFor(path: string, query: RouteQuery, data: Awaited<ReturnType<typeof getSiteData>>): SearchRouteInfo | null {
  if (path === "/index.php") {
    return {
      pageNumber: 1,
      keyword: query.keyword,
      path: "/index.php",
    };
  }
  if (!query.hasKeyword) return null;
  if (path === "/") {
    return {
      pageNumber: 1,
      keyword: query.keyword,
      path: "/index.php",
    };
  }
  const pageMatch = path.match(/^\/page\/(\d+)$/);
  if (!pageMatch) return null;

  const pageNumber = Number(pageMatch[1]);
  const totalPages = query.keyword
    ? Math.max(1, Math.ceil(searchResultCountForKeyword(data, query.keyword) / SOURCE_SEARCH_PAGE_SIZE))
    : Math.max(1, Math.ceil(data.products.length / SOURCE_SEARCH_PAGE_SIZE));
  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) return null;

  return {
    pageNumber,
    keyword: query.keyword,
    path: `/page/${pageNumber}`,
  };
}

function searchResultCountForKeyword(data: Awaited<ReturnType<typeof getSiteData>>, keyword: string) {
  const lowered = keyword.toLowerCase();
  const productCount = data.products.filter((item) => routeSearchHaystack(item.title, item.description, item.bodyText).includes(lowered)).length;
  const postCount = data.blogPosts.filter((item) => routeSearchHaystack(item.title, item.excerpt, item.bodyText).includes(lowered)).length;
  return productCount + postCount;
}

function routeSearchHaystack(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ").toLowerCase();
}

function searchLocalizedHref(locale: Locale, route: SearchRouteInfo) {
  return localizePath(locale, searchPathWithQuery(route));
}

function searchLanguageAlternates(route: SearchRouteInfo, locale: Locale) {
  if (route.keyword && route.pageNumber > 1) {
    return {
      [locale]: searchLocalizedHref(locale, route),
    };
  }
  const alternates = languageAlternates(searchPathWithQuery(route));
  return alternates;
}

function searchLanguageSwitcherPath(route: SearchRouteInfo) {
  if (route.keyword && route.pageNumber > 1) {
    return `/index.php${searchQueryString(route.keyword)}`;
  }
  return searchPathWithQuery(route);
}

function searchPathWithQuery(route: SearchRouteInfo) {
  return `${route.path}${searchQueryString(route.keyword)}`;
}

function searchQueryString(keyword: string) {
  return `?keyword=${encodeURIComponent(keyword)}`;
}

function searchRouteMeta(pageNumber: number): RouteMeta {
  const title = "Search Result - Intco Framing";
  return {
    title: pageNumber > 1 ? `${title} | Page ${pageNumber}` : title,
    description: "",
  };
}

const routeMetaDefaults: Record<string, Partial<Record<Locale, RouteMeta>>> = {
  "/projects": {
    en: {
      title: "Transforming Residential and Commercial Spaces | Intco Framing Projects",
      description: "Discover our impressive portfolio of Intco Framing Projects for both residential and commercial spaces. Get inspired and start your own project today!",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj.jpg",
      imageAlt: "Projects",
    },
    es: {
      title: "Proyectos residenciales y comerciales | INTCO Framing",
      description: "Explore proyectos de INTCO Framing para hogares, comercios y espacios contract, con ideas de decoración listas para inspirar su próximo proyecto.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj.jpg",
      imageAlt: "Proyectos de INTCO Framing",
    },
    pt: {
      title: "Projetos residenciais e comerciais | INTCO Framing",
      description: "Conheça projetos da INTCO Framing para residências, varejo e espaços comerciais, com ideias de decoração para inspirar seu próximo ambiente.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj.jpg",
      imageAlt: "Projetos da INTCO Framing",
    },
    fr: {
      title: "Projets résidentiels et commerciaux | INTCO Framing",
      description: "Découvrez les projets INTCO Framing pour maisons, commerces et espaces professionnels, avec des idées déco pour inspirer votre prochain aménagement.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj.jpg",
      imageAlt: "Projets INTCO Framing",
    },
    de: {
      title: "Wohn- und Gewerbeprojekte | INTCO Framing",
      description: "Entdecken Sie INTCO Framing Projekte für Wohnräume, Handel und gewerbliche Flächen mit Dekorideen für Ihre nächste Raumgestaltung.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj.jpg",
      imageAlt: "INTCO Framing Projekte",
    },
    ja: {
      title: "住宅・商業空間プロジェクト | INTCO Framing",
      description: "住宅、店舗、商業空間に向けた INTCO Framing のプロジェクト事例をご覧ください。次の空間づくりに役立つ装飾アイデアを紹介します。",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj.jpg",
      imageAlt: "INTCO Framing プロジェクト",
    },
  },
  "/solutions/business-insights-trends": {
    en: {
      title: "Latest Business Insights & Trend Reports | Intco Framing",
      description: "Unlock key business insights and industry trends with Intco Framing. Read our detailed reports to stay competitive and informed.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/BusinessInsights1.png",
      imageAlt: "Business insights and trend reports",
    },
  },
  "/solutions/business-insights-trends/trend": {
    en: {
      title: "Trend | Intco Framing",
      description: "Download the INTCO Framing trend report and stay informed about the latest consumer, design, and market trends.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/11-3.jpg",
      imageAlt: "INTCO trend report",
    },
    es: {
      title: "Tendencias | Intco Framing",
      description: "Descargue el informe de tendencias de INTCO Framing y manténgase al día sobre consumidores, diseño y mercado.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/11-3.jpg",
      imageAlt: "Informe de tendencias de INTCO",
    },
    pt: {
      title: "Tendências | Intco Framing",
      description: "Baixe o relatório de tendências da INTCO Framing e acompanhe as novidades de consumo, design e mercado.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/11-3.jpg",
      imageAlt: "Relatório de tendências da INTCO",
    },
    fr: {
      title: "Tendances | Intco Framing",
      description: "Téléchargez le rapport de tendances INTCO Framing et suivez les dernières tendances consommateurs, design et marché.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/11-3.jpg",
      imageAlt: "Rapport de tendances INTCO",
    },
    de: {
      title: "Trends | Intco Framing",
      description: "Laden Sie den INTCO Framing Trendreport herunter und bleiben Sie über Verbraucher-, Design- und Markttrends informiert.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/11-3.jpg",
      imageAlt: "INTCO Trendreport",
    },
    ja: {
      title: "トレンド | Intco Framing",
      description: "INTCO Framing のトレンドレポートをダウンロードし、消費者・デザイン・市場の最新動向を把握できます。",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/11-3.jpg",
      imageAlt: "INTCO トレンドレポート",
    },
  },
  "/solutions/business-insights-trends/trend-2": {
    en: {
      title: "Trend2 | Intco Framing",
      description: "Download the INTCO Framing trend report and stay informed about the latest consumer, design, and market trends.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/Trends1.png",
      imageAlt: "INTCO trend report",
    },
    es: {
      title: "Tendencias 2 | Intco Framing",
      description: "Descargue el informe de tendencias de INTCO Framing y manténgase al día sobre consumidores, diseño y mercado.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/Trends1.png",
      imageAlt: "Informe de tendencias de INTCO",
    },
    pt: {
      title: "Tendências 2 | Intco Framing",
      description: "Baixe o relatório de tendências da INTCO Framing e acompanhe as novidades de consumo, design e mercado.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/Trends1.png",
      imageAlt: "Relatório de tendências da INTCO",
    },
    fr: {
      title: "Tendances 2 | Intco Framing",
      description: "Téléchargez le rapport de tendances INTCO Framing et suivez les dernières tendances consommateurs, design et marché.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/Trends1.png",
      imageAlt: "Rapport de tendances INTCO",
    },
    de: {
      title: "Trends 2 | Intco Framing",
      description: "Laden Sie den INTCO Framing Trendreport herunter und bleiben Sie über Verbraucher-, Design- und Markttrends informiert.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/Trends1.png",
      imageAlt: "INTCO Trendreport",
    },
    ja: {
      title: "トレンド 2 | Intco Framing",
      description: "INTCO Framing のトレンドレポートをダウンロードし、消費者・デザイン・市場の最新動向を把握できます。",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/Trends1.png",
      imageAlt: "INTCO トレンドレポート",
    },
  },
  "/solutions/business-insights-trends/trend-2-2": {
    en: {
      title: "Trend3 | Intco Framing",
      description: "Download the INTCO Framing trend report and stay informed about the latest consumer, design, and market trends.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/33-2.jpg",
      imageAlt: "INTCO trend report",
    },
    es: {
      title: "Tendencias 3 | Intco Framing",
      description: "Descargue el informe de tendencias de INTCO Framing y manténgase al día sobre consumidores, diseño y mercado.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/33-2.jpg",
      imageAlt: "Informe de tendencias de INTCO",
    },
    pt: {
      title: "Tendências 3 | Intco Framing",
      description: "Baixe o relatório de tendências da INTCO Framing e acompanhe as novidades de consumo, design e mercado.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/33-2.jpg",
      imageAlt: "Relatório de tendências da INTCO",
    },
    fr: {
      title: "Tendances 3 | Intco Framing",
      description: "Téléchargez le rapport de tendances INTCO Framing et suivez les dernières tendances consommateurs, design et marché.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/33-2.jpg",
      imageAlt: "Rapport de tendances INTCO",
    },
    de: {
      title: "Trends 3 | Intco Framing",
      description: "Laden Sie den INTCO Framing Trendreport herunter und bleiben Sie über Verbraucher-, Design- und Markttrends informiert.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/33-2.jpg",
      imageAlt: "INTCO Trendreport",
    },
    ja: {
      title: "トレンド 3 | Intco Framing",
      description: "INTCO Framing のトレンドレポートをダウンロードし、消費者・デザイン・市場の最新動向を把握できます。",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/33-2.jpg",
      imageAlt: "INTCO トレンドレポート",
    },
  },
  "/solutions/business-insights-trends/bestsellers": {
    en: {
      title: "Bestsellers | Intco Framing",
      description: "Explore INTCO Framing bestseller recommendations across picture frames, mirrors, and wall art.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/1-55.jpg",
      imageAlt: "INTCO bestseller recommendations",
    },
    es: {
      title: "Más vendidos | Intco Framing",
      description: "Explore las recomendaciones de productos más vendidos de INTCO Framing en marcos, espejos y arte mural.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/1-55.jpg",
      imageAlt: "Recomendaciones de más vendidos de INTCO",
    },
    pt: {
      title: "Mais vendidos | Intco Framing",
      description: "Explore as recomendações de produtos mais vendidos da INTCO Framing em molduras, espelhos e arte de parede.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/1-55.jpg",
      imageAlt: "Recomendações de mais vendidos da INTCO",
    },
    fr: {
      title: "Meilleures ventes | Intco Framing",
      description: "Découvrez les recommandations de meilleures ventes INTCO Framing pour les cadres photo, miroirs et arts muraux.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/1-55.jpg",
      imageAlt: "Recommandations des meilleures ventes INTCO",
    },
    de: {
      title: "Bestseller | Intco Framing",
      description: "Entdecken Sie INTCO Framing Bestseller-Empfehlungen für Bilderrahmen, Spiegel und Wandkunst.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/1-55.jpg",
      imageAlt: "INTCO Bestseller-Empfehlungen",
    },
    ja: {
      title: "ベストセラー | Intco Framing",
      description: "額縁、ミラー、ウォールアートにわたる INTCO Framing のベストセラーおすすめ商品をご覧ください。",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/1-55.jpg",
      imageAlt: "INTCO ベストセラーおすすめ",
    },
  },
  "/contact": {
    en: {
      title: "Connect with Intco Framing: Tel, Email, Live Chat",
      description: "Contact Intco Framing for assistance via telephone, email, or live chat. Our support team is available 24/7 to answer your questions about our overseas factories and services.",
      image: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/lxwm.jpg",
      imageAlt: "Contact INTCO Framing",
    },
  },
  "/inspiration": {
    en: {
      title: "Home Decor Inspiration & Design Ideas | INTCO Framing",
      description: "Explore interior decoration inspiration, wall decor ideas, frame styling tips and product insights from INTCO Framing.",
    },
    es: {
      title: "Inspiración para decoración y diseño de interiores | INTCO Framing",
      description: "Explore ideas de decoración, tendencias para paredes, consejos de marcos y soluciones de producto de INTCO Framing.",
    },
    pt: {
      title: "Inspiração em decoração e design de interiores | INTCO Framing",
      description: "Explore ideias de decoração, tendências para paredes, dicas de molduras e soluções de produto da INTCO Framing.",
    },
    fr: {
      title: "Inspiration déco et idées d'aménagement | INTCO Framing",
      description: "Explorez des idées de décoration intérieure, des tendances murales, des conseils d'encadrement et les solutions produits INTCO Framing.",
    },
    de: {
      title: "Deko-Inspiration und Interior-Ideen | INTCO Framing",
      description: "Entdecken Sie Wohnideen, Wanddekor-Trends, Rahmen-Tipps und Produktlösungen von INTCO Framing.",
    },
    ja: {
      title: "インテリア装飾のアイデアとインスピレーション | INTCO Framing",
      description: "壁面装飾、フレーム選び、ホームデコレーションのヒント、INTCO Framing の製品アイデアをご覧ください。",
    },
  },
};

const pageNumberLabels: Record<Locale, (page: string) => string> = {
  en: (page) => `Page ${page}`,
  es: (page) => `Página ${page}`,
  pt: (page) => `Página ${page}`,
  fr: (page) => `Page ${page}`,
  de: (page) => `Seite ${page}`,
  ja: (page) => `${page}ページ`,
};

function resolveRouteMeta(path: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale): RouteMeta {
  if (path === "/") {
    return {
      title: `${data.homePage.title} | INTCO Framing`,
      description: data.siteSettings.description || "",
      image: data.homePage.heroSlides?.[0]?.imageUrl,
      imageAlt: data.homePage.heroSlides?.[0]?.title,
    };
  }

  if (path === "/projects" || path === "/projects/page/2" || path === "/projects/page/3" || path === "/projects/residential" || path === "/projects/commercial") {
    const page = data.pages.find((entry) => entry.path === "/projects");
    const defaults = routeMetaDefaults["/projects"][locale] || routeMetaDefaults["/projects"].en;
    const meta = metadataFromItem(page, data, defaults, locale);
    const pageMatch = path.match(/^\/projects\/page\/(\d+)$/);
    if (pageMatch) {
      const suffix = pageNumberLabels[locale](pageMatch[1]);
      return {
        ...meta,
        title: `${meta.title} | ${suffix}`,
      };
    }
    return meta;
  }

  if (path === "/blog" || /^\/blog\/page\/\d+$/.test(path)) {
    const page = data.pages.find((entry) => entry.path === "/blog");
    const meta = metadataFromItem(page, data, undefined, locale);
    const pageMatch = path.match(/^\/blog\/page\/(\d+)$/);
    if (pageMatch) {
      const suffix = pageNumberLabels[locale](pageMatch[1]);
      return {
        ...meta,
        title: `${meta.title} | ${suffix}`,
      };
    }
    return meta;
  }

  if (path === "/inspiration" || /^\/inspiration\/page\/\d+$/.test(path)) {
    const defaults = routeMetaDefaults["/inspiration"][locale] || routeMetaDefaults["/inspiration"].en || { title: "Inspiration | INTCO Framing", description: data.siteSettings.description || "" };
    const pageMatch = path.match(/^\/inspiration\/page\/(\d+)$/);
    if (pageMatch) {
      const suffix = pageNumberLabels[locale](pageMatch[1]);
      return {
        ...defaults,
        title: `${defaults.title} | ${suffix}`,
      };
    }
    return defaults;
  }

  const routeDefaults = routeMetaDefaults[path]?.[locale] || routeMetaDefaults[path]?.en;
  if (routeDefaults && BUSINESS_INSIGHTS_CHILD_PATHS.has(path)) {
    return routeDefaults;
  }

  const item =
    data.products.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.blogPosts.find((entry) => entry.path === path || path === `/news/${entry.slug}`) ||
    data.projects.find((entry) => entry.path === path || path === `/projects/${entry.slug}`) ||
    data.solutions.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.pages.find((entry) => entry.path === path) ||
    data.productCategories.find((entry) => entry.path === path);

  if (!item) {
    if (path === "/index.php") {
      return {
        title: "Search Result - Intco Framing",
        description: "",
      };
    }
    if (path === "/inspiration") {
      return routeMetaDefaults["/inspiration"][locale] || routeMetaDefaults["/inspiration"].en || { title: "Inspiration | INTCO Framing", description: data.siteSettings.description || "" };
    }
    return {
      title: "INTCO Framing",
      description: data.siteSettings.description || "",
    };
  }

  return metadataFromItem(item, data, routeDefaults, locale);
}

type MetadataItem = {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    ogImageUrl?: string;
    imageAlt?: string;
    noIndex?: boolean;
  };
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
};

function metadataFromItem(item: MetadataItem | undefined, data: Awaited<ReturnType<typeof getSiteData>>, defaults?: RouteMeta, locale: Locale = "en"): RouteMeta {
  if (!item) {
    return defaults || { title: "INTCO Framing", description: data.siteSettings.description || "" };
  }
  const metaTitle = localizeMetaTitleSuffix(item.metaTitle, locale);
  return {
    title: item.seo?.seoTitle || metaTitle || defaults?.title || `${item.title} | INTCO Framing`,
    description:
      item.seo?.seoDescription ||
      item.metaDescription ||
      defaults?.description ||
      item.description ||
      item.excerpt ||
      data.siteSettings.description ||
      "",
    image: item.seo?.ogImageUrl || item.imageUrl || defaults?.image,
    imageAlt: item.seo?.imageAlt || item.imageAlt || defaults?.imageAlt || item.title,
    noIndex: item.seo?.noIndex,
  };
}

function localizeMetaTitleSuffix(title: string | undefined, locale: Locale) {
  if (!title || locale === "en") return title;
  const suffix: Record<Exclude<Locale, "en">, string> = {
    es: "Soluciones INTCO",
    pt: "Soluções INTCO",
    fr: "Solutions INTCO",
    de: "INTCO Lösungen",
    ja: "INTCO ソリューション",
  };
  return title.replace(/\|\s*INTCO Solutions\b/g, `| ${suffix[locale]}`);
}

function buildStructuredData(
  path: string,
  data: Awaited<ReturnType<typeof getSiteData>>,
  locale: Locale,
  options?: {
    meta?: RouteMeta;
    localizedPath?: string;
    structuredPath?: string;
    includeBreadcrumb?: boolean;
  },
): JsonLdNode[] {
  const structuredPath = options?.structuredPath || path;
  const meta = options?.meta || resolveRouteMeta(structuredPath, data, locale);
  const localizedPath = options?.localizedPath || localizePath(locale, structuredPath);
  const currentUrl = absoluteUrl(localizedPath);
  const routeItem = structuredDataItemForPath(structuredPath, data);
  const organizationId = `${siteOrigin}/#organization`;
  const websiteId = `${siteOrigin}/#website`;
  const image = meta.image ? absoluteUrl(meta.image) : undefined;
  const nodes: JsonLdNode[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: "INTCO Framing",
      alternateName: data.siteSettings.title,
      url: siteOrigin,
      logo: absoluteOptionalUrl(data.siteSettings.logoUrl || data.siteSettings.footerLogoUrl),
      description: data.siteSettings.description,
      email: data.siteSettings.email,
      telephone: data.siteSettings.phone,
      contactPoint: data.siteSettings.contactPoints?.length
        ? data.siteSettings.contactPoints.map((point) => ({
            "@type": "ContactPoint",
            contactType: point.contactType,
            telephone: point.phone,
            email: point.email,
            areaServed: point.areaServed,
            availableLanguage: point.availableLanguages,
          }))
        : undefined,
      address: data.siteSettings.address
        ? {
            "@type": "PostalAddress",
            streetAddress: data.siteSettings.address,
          }
        : undefined,
      sameAs: data.siteSettings.sameAs?.length ? data.siteSettings.sameAs : socialProfiles,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: siteOrigin,
      name: data.siteSettings.title || "INTCO Framing",
      description: data.siteSettings.description,
      publisher: { "@id": organizationId },
      inLanguage: locale,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteOrigin}/index.php?keyword={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": structuredPath === "/contact" ? "ContactPage" : "WebPage",
      "@id": `${currentUrl}#webpage`,
      url: currentUrl,
      name: meta.title,
      description: meta.description,
      isPartOf: { "@id": websiteId },
      inLanguage: locale,
      primaryImageOfPage: image
        ? {
            "@type": "ImageObject",
            url: image,
            caption: meta.imageAlt || meta.title,
          }
        : undefined,
      datePublished: validIsoDate(routeItem?.datePublished),
      dateModified: validIsoDate(routeItem?.dateModified),
    },
  ];

  const breadcrumb = options?.includeBreadcrumb === false ? undefined : buildBreadcrumbList(structuredPath, data, locale);
  if (breadcrumb) nodes.push(breadcrumb);

  const product = data.products.find((item) => item.path === structuredPath || structuredPath.endsWith(`/${item.slug}`));
  if (product) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${currentUrl}#product`,
      name: product.title,
      url: currentUrl,
      image: absoluteOptionalUrl(product.imageUrl),
      description: product.metaDescription || product.description || product.bodyText,
      sku: product.sku,
      brand: {
        "@type": "Brand",
        name: product.brand || "INTCO Framing",
      },
      category: resolveProductCategory(product, data),
      material: product.material,
      size: product.dimensions,
      offers: productOffers(product.offers, currentUrl),
    });
  }

  const post = data.blogPosts.find((item) => item.path === structuredPath || structuredPath === `/news/${item.slug}`);
  if (post) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${currentUrl}#article`,
      headline: post.title,
      url: currentUrl,
      image: absoluteOptionalUrl(post.imageUrl),
      description: post.metaDescription || post.excerpt || post.bodyText,
      datePublished: validIsoDate(post.publishedAt),
      dateModified: validIsoDate(post.dateModified),
      author: { "@id": organizationId },
      publisher: { "@id": organizationId },
      inLanguage: locale,
    });
  }

  if (routeItem?.faqs?.length) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${currentUrl}#faq`,
      mainEntity: routeItem.faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return nodes;
}

function structuredDataItemForPath(path: string, data: Awaited<ReturnType<typeof getSiteData>>) {
  if (path === "/") return data.homePage;
  return (
    data.products.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.blogPosts.find((entry) => entry.path === path || path === `/news/${entry.slug}`) ||
    data.projects.find((entry) => entry.path === path || path === `/projects/${entry.slug}`) ||
    data.solutions.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.pages.find((entry) => entry.path === path) ||
    data.productCategories.find((entry) => entry.path === path)
  );
}

function productOffers(offers: OfferItem[] | undefined, currentUrl: string) {
  if (!offers?.length) return undefined;
  const mapped = offers
    .map((offer) => {
      const hasPrice = typeof offer.price === "number";
      if (!hasPrice && !offer.url) return undefined;
      return {
        "@type": "Offer",
        price: offer.price,
        priceCurrency: offer.priceCurrency || "USD",
        availability: offer.availability,
        url: offer.url || currentUrl,
        validFrom: offer.validFrom,
        validThrough: offer.validThrough,
      };
    })
    .filter(Boolean);
  return mapped.length ? mapped : undefined;
}

function buildBreadcrumbList(path: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale): JsonLdNode | undefined {
  if (path === "/") return undefined;

  const crumbs = [{ name: t(locale, "home"), path: "/" }];
  if (path.startsWith("/news/")) {
    const post = data.blogPosts.find((entry) => entry.path === path || path === `/news/${entry.slug}`);
    crumbs.push({ name: t(locale, "blog"), path: "/blog" }, { name: post?.title || resolveBreadcrumbName(path, path.split("/").at(-1) || "Article", data, locale), path });
  } else if (path.startsWith("/blog/page/")) {
    const page = path.split("/").at(-1) || "1";
    crumbs.push({ name: t(locale, "blog"), path: "/blog" }, { name: pageNumberLabels[locale](page), path });
  } else if (path.startsWith("/inspiration/page/")) {
    const page = path.split("/").at(-1) || "1";
    crumbs.push({ name: resolveBreadcrumbName("/inspiration", "Inspiration", data, locale), path: "/inspiration" }, { name: pageNumberLabels[locale](page), path });
  } else if (path.startsWith("/projects/page/")) {
    const page = path.split("/").at(-1) || "1";
    crumbs.push({ name: t(locale, "projects"), path: "/projects" }, { name: pageNumberLabels[locale](page), path });
  } else {
    let current = "";
    path
      .split("/")
      .filter(Boolean)
      .forEach((segment) => {
        current += `/${segment}`;
        crumbs.push({ name: resolveBreadcrumbName(current, segment, data, locale), path: current });
      });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(localizePath(locale, crumb.path)),
    })),
  };
}

function resolveBreadcrumbName(path: string, fallback: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale) {
  const routeDefaultTitle = routeMetaDefaults[path]?.[locale]?.title || routeMetaDefaults[path]?.en?.title;
  if (routeDefaultTitle) return routeDefaultTitle.replace(/\s*\|\s*.*$/, "");
  const item =
    data.pages.find((entry) => entry.path === path) ||
    data.productCategories.find((entry) => entry.path === path) ||
    data.products.find((entry) => entry.path === path) ||
    data.solutions.find((entry) => entry.path === path) ||
    data.projects.find((entry) => entry.path === path) ||
    data.blogPosts.find((entry) => entry.path === path);
  return item?.title || fallback.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function resolveProductCategory(product: Product, data: Awaited<ReturnType<typeof getSiteData>>) {
  const slug = product.mainCategorySlug || product.categorySlugs?.[0];
  return data.productCategories.find((category) => category.slug === slug)?.title;
}

function absoluteOptionalUrl(value?: string) {
  return value ? absoluteUrl(value) : undefined;
}

function validIsoDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function stringifyJsonLd(value: JsonLdNode) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
