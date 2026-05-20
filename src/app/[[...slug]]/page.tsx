import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { languageAlternates, localizePath, parseLocalizedSegments, type Locale } from "@/lib/i18n";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{ keyword?: string; category?: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://www.intcoframing-us.com");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const { locale, path } = parseLocalizedSegments(slug);
  const data = await getSiteData(locale);
  const meta = resolveRouteMeta(path, data);
  const alternates = languageAlternates(path);

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: localizePath(locale, path),
      languages: alternates,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localizePath(locale, path),
      images: meta.image ? [{ url: meta.image, alt: meta.imageAlt || meta.title }] : undefined,
    },
  };
}

export default async function SitePage({ params, searchParams }: PageProps) {
  const { slug = [] } = await params;
  const query = (await searchParams) || {};
  const { locale, path } = parseLocalizedSegments(slug);
  const data = await getSiteData(locale);

  return (
    <SiteChrome settings={data.siteSettings} categories={data.productCategories} locale={locale} currentPath={path}>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(locale)};` }} />
      {renderRoute(path, data, locale, query)}
    </SiteChrome>
  );
}

function renderRoute(path: string, data: Awaited<ReturnType<typeof getSiteData>>, locale: Locale, query: { keyword?: string; category?: string }) {
  if (path === "/") return <HomeView data={data} locale={locale} />;

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

function resolveRouteMeta(path: string, data: Awaited<ReturnType<typeof getSiteData>>) {
  const item =
    data.products.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.blogPosts.find((entry) => entry.path === path || path === `/news/${entry.slug}`) ||
    data.projects.find((entry) => entry.path === path || path === `/projects/${entry.slug}`) ||
    data.solutions.find((entry) => entry.path === path || path.endsWith(`/${entry.slug}`)) ||
    data.pages.find((entry) => entry.path === path) ||
    data.productCategories.find((entry) => entry.path === path);

  if (path === "/") {
    return {
      title: `${data.homePage.title} | INTCO Framing`,
      description: data.siteSettings.description || "",
      image: data.homePage.heroSlides?.[0]?.imageUrl,
      imageAlt: data.homePage.heroSlides?.[0]?.title,
    };
  }

  if (!item) {
    if (path === "/inspiration") {
      return {
        title: "Inspiration | INTCO Framing",
        description: "Interior decoration inspiration, product ideas and home decor insights from INTCO Framing.",
      };
    }
    return {
      title: "INTCO Framing",
      description: data.siteSettings.description || "",
    };
  }

  return {
    title: "metaTitle" in item && item.metaTitle ? item.metaTitle : `${item.title} | INTCO Framing`,
    description:
      ("metaDescription" in item && item.metaDescription) ||
      ("description" in item && item.description) ||
      ("excerpt" in item && item.excerpt) ||
      data.siteSettings.description ||
      "",
    image: "imageUrl" in item ? item.imageUrl : undefined,
    imageAlt: "imageAlt" in item ? item.imageAlt : item.title,
  };
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
