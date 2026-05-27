import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DocumentLanguage } from "@/components/document-language";
import { SiteChrome } from "@/components/site-chrome";
import {
  BlogListingView,
  BlogPostView,
  ContactView,
  ContentPageView,
  EnquiryListView,
  HomeView,
  ProductDetailView,
  ProductListingView,
  ProductsLandingView,
  ProjectDetailView,
  ProjectsListingView,
  SolutionDetailView,
  SolutionsListingView,
} from "@/components/site-views";
import { getSiteData, type BlogPost, type Product } from "@/lib/site-data";
import { languageAlternates, localizePath, parseLocalizedSegments, t, type Locale } from "@/lib/i18n";
import { absoluteUrl, siteOrigin } from "@/lib/site-url";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{ keyword?: string; category?: string }>;
};

const socialProfiles = [
  "https://www.facebook.com/IntcoFraming.cn/",
  "https://www.youtube.com/@intcoframing",
  "https://www.linkedin.com/company/intcoframing/",
  "https://twitter.com/intco_framing",
  "https://www.instagram.com/intcoframing/",
  "https://www.pinterest.com/intco_framing/",
];

const legacyProductAllRedirects: Record<string, string> = {
  "/products/mirror-all": "/mirror",
  "/products/picture-frame-all": "/picture-frame",
  "/products/art-all": "/art",
  "/products/furniture-all": "/furniture",
  "/products/memo-board-all": "/memo-board",
};

type JsonLdNode = Record<string, unknown>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const { locale, path } = parseLocalizedSegments(slug);
  const data = await getSiteData(locale);
  const meta = resolveRouteMeta(path, data, locale);
  const alternates = languageAlternates(path);

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(siteOrigin),
    alternates: {
      canonical: localizePath(locale, path),
      languages: alternates,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: absoluteUrl(localizePath(locale, path)),
      images: meta.image ? [{ url: meta.image, alt: meta.imageAlt || meta.title }] : undefined,
    },
  };
}

export default async function SitePage({ params, searchParams }: PageProps) {
  const { slug = [] } = await params;
  const query = (await searchParams) || {};
  const { locale, path } = parseLocalizedSegments(slug);
  const data = await getSiteData(locale);
  const jsonLd = buildStructuredData(path, data, locale);

  return (
    <SiteChrome settings={data.siteSettings} categories={data.productCategories} solutions={data.solutions} locale={locale} currentPath={path}>
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

function renderRoute(path: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale, query: { keyword?: string; category?: string }) {
  if (path === "/") return <HomeView data={data} locale={locale} />;

  const legacyProductAllTarget = legacyProductAllRedirects[path];
  if (legacyProductAllTarget) permanentRedirect(localizePath(locale, legacyProductAllTarget));
  if (path === "/news") permanentRedirect(localizePath(locale, "/blog"));
  if (path.startsWith("/solutions/business-insights-trends/")) {
    permanentRedirect(localizePath(locale, "/solutions/business-insights-trends"));
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
  if (path === "/projects/page/2") return <ProjectsListingView projects={data.projects} page={data.pages.find((item) => item.path === "/projects")} locale={locale} pageNumber={2} />;
  if (path === "/projects/page/3") return <ProjectsListingView projects={data.projects} page={data.pages.find((item) => item.path === "/projects")} locale={locale} pageNumber={3} />;
  if (path === "/projects/residential") return <ProjectsListingView projects={data.projects} category="Residential" page={data.pages.find((item) => item.path === "/projects")} locale={locale} />;
  if (path === "/projects/commercial") return <ProjectsListingView projects={data.projects} category="Commercial" page={data.pages.find((item) => item.path === "/projects")} locale={locale} />;
  const project = data.projects.find((item) => item.path === path || path === `/projects/${item.slug}`);
  if (project) return <ProjectDetailView project={project} products={data.products} projects={data.projects} locale={locale} />;

  if (path === "/blog") return <BlogListingView posts={data.blogPosts} locale={locale} activeCategory={query.category} page={data.pages.find((item) => item.path === "/blog")} />;
  if (path === "/inspiration") return <BlogListingView posts={data.blogPosts} locale={locale} activeCategory="Inspiration" page={data.pages.find((item) => item.path === "/blog")} />;
  const post = data.blogPosts.find((item) => item.path === path || path === `/news/${item.slug}`);
  if (post) return <BlogPostView post={post} posts={data.blogPosts} locale={locale} />;

  if (path === "/index.php") {
    const keyword = query.keyword || "";
    const lowered = keyword.toLowerCase();
    const products = data.products.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(lowered));
    const posts = data.blogPosts.filter((item) => `${item.title} ${item.excerpt}`.toLowerCase().includes(lowered));
    return <BlogListingView posts={[...posts, ...products.slice(0, 12).map(productToPost)]} locale={locale} page={data.pages.find((item) => item.path === "/blog")} />;
  }

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
        heroImage={category.imageUrl || category.navImageUrl}
        category={category}
        locale={locale}
      />
    );
  }

  const product = data.products.find((item) => item.path === path || path.endsWith(`/${item.slug}`));
  if (product) return <ProductDetailView product={product} locale={locale} relatedProducts={data.products.filter((item) => item.slug !== product.slug && item.categorySlugs?.some((slug) => product.categorySlugs?.includes(slug))).slice(0, 8)} />;

  notFound();
}

type RouteMeta = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

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
    const meta = metadataFromItem(page, data, defaults);
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

  const item =
    data.products.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.blogPosts.find((entry) => entry.path === path || path === `/news/${entry.slug}`) ||
    data.projects.find((entry) => entry.path === path || path === `/projects/${entry.slug}`) ||
    data.solutions.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.pages.find((entry) => entry.path === path) ||
    data.productCategories.find((entry) => entry.path === path);

  if (!item) {
    if (path === "/inspiration") {
      return routeMetaDefaults["/inspiration"][locale] || routeMetaDefaults["/inspiration"].en || { title: "Inspiration | INTCO Framing", description: data.siteSettings.description || "" };
    }
    return {
      title: "INTCO Framing",
      description: data.siteSettings.description || "",
    };
  }

  const defaults = routeMetaDefaults[path]?.[locale] || routeMetaDefaults[path]?.en;
  return metadataFromItem(item, data, defaults);
}

type MetadataItem = {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
};

function metadataFromItem(item: MetadataItem | undefined, data: Awaited<ReturnType<typeof getSiteData>>, defaults?: RouteMeta): RouteMeta {
  if (!item) {
    return defaults || { title: "INTCO Framing", description: data.siteSettings.description || "" };
  }
  return {
    title: item.metaTitle || defaults?.title || `${item.title} | INTCO Framing`,
    description:
      item.metaDescription ||
      defaults?.description ||
      item.description ||
      item.excerpt ||
      data.siteSettings.description ||
      "",
    image: item.imageUrl || defaults?.image,
    imageAlt: item.imageAlt || defaults?.imageAlt || item.title,
  };
}

function buildStructuredData(path: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale): JsonLdNode[] {
  const meta = resolveRouteMeta(path, data, locale);
  const localizedPath = localizePath(locale, path);
  const currentUrl = absoluteUrl(localizedPath);
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
      address: data.siteSettings.address
        ? {
            "@type": "PostalAddress",
            streetAddress: data.siteSettings.address,
          }
        : undefined,
      sameAs: socialProfiles,
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
      "@type": path === "/contact" ? "ContactPage" : "WebPage",
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
    },
  ];

  const breadcrumb = buildBreadcrumbList(path, data, locale);
  if (breadcrumb) nodes.push(breadcrumb);

  const product = data.products.find((item) => item.path === path || path.endsWith(`/${item.slug}`));
  if (product) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${currentUrl}#product`,
      name: product.title,
      url: currentUrl,
      image: absoluteOptionalUrl(product.imageUrl),
      description: product.metaDescription || product.description || product.bodyText,
      brand: {
        "@type": "Brand",
        name: "INTCO Framing",
      },
      category: resolveProductCategory(product, data),
    });
  }

  const post = data.blogPosts.find((item) => item.path === path || path === `/news/${item.slug}`);
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
      author: { "@id": organizationId },
      publisher: { "@id": organizationId },
      inLanguage: locale,
    });
  }

  return nodes;
}

function buildBreadcrumbList(path: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale): JsonLdNode | undefined {
  if (path === "/") return undefined;

  const crumbs = [{ name: t(locale, "home"), path: "/" }];
  if (path.startsWith("/news/")) {
    const post = data.blogPosts.find((entry) => entry.path === path || path === `/news/${entry.slug}`);
    crumbs.push({ name: t(locale, "blog"), path: "/blog" }, { name: post?.title || resolveBreadcrumbName(path, path.split("/").at(-1) || "Article", data), path });
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
        crumbs.push({ name: resolveBreadcrumbName(current, segment, data), path: current });
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

function resolveBreadcrumbName(path: string, fallback: string, data: Awaited<ReturnType<typeof getSiteData>>) {
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

function productToPost(product: Product): BlogPost {
  return {
    title: product.title,
    slug: product.slug,
    path: product.path,
    category: "Product",
    excerpt: product.description,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
  };
}
