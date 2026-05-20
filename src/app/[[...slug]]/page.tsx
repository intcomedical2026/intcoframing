import { notFound } from "next/navigation";
import { SiteChrome } from "@/components/site-chrome";
import {
  BlogListingView,
  ContentPageView,
  DetailView,
  HomeView,
  ProductListingView,
  ProjectsListingView,
  SolutionsListingView,
} from "@/components/site-views";
import { cleanPath, getSiteData } from "@/lib/site-data";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function SitePage({ params }: PageProps) {
  const { slug = [] } = await params;
  const path = cleanPath(slug.join("/"));
  const data = await getSiteData();

  return <SiteChrome settings={data.siteSettings} categories={data.productCategories}>{renderRoute(path, data)}</SiteChrome>;
}

function renderRoute(path: string, data: Awaited<ReturnType<typeof getSiteData>>) {
  if (path === "/") return <HomeView data={data} />;

  if (path === "/products") {
    const parents = data.productCategories.filter((category) => !category.parentSlug);
    return (
      <ProductListingView
        title="Products"
        description="Mirror, picture frame, art, furniture and memo board categories captured from the original INTCO Framing catalog."
        products={data.products}
        categories={parents}
        heroImage={parents[0]?.imageUrl}
      />
    );
  }

  if (path === "/solutions") return <SolutionsListingView solutions={data.solutions} />;
  const solution = data.solutions.find((item) => item.path === path || path.endsWith(`/${item.slug}`));
  if (solution) return <DetailView item={solution} label="Solution" />;

  if (path === "/projects") return <ProjectsListingView projects={data.projects} />;
  if (path === "/projects/residential") return <ProjectsListingView projects={data.projects} category="Residential" />;
  if (path === "/projects/commercial") return <ProjectsListingView projects={data.projects} category="Commercial" />;
  const project = data.projects.find((item) => item.path === path || path === `/projects/${item.slug}`);
  if (project) return <DetailView item={project} label={project.category || "Project"} />;

  if (path === "/blog") return <BlogListingView posts={data.blogPosts} />;
  const post = data.blogPosts.find((item) => item.path === path || path === `/news/${item.slug}`);
  if (post) return <DetailView item={post} label={post.category || "Blog"} />;

  const page = data.pages.find((item) => item.path === path);
  if (page) return <ContentPageView page={page} />;

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
      />
    );
  }

  const product = data.products.find((item) => item.path === path || path.endsWith(`/${item.slug}`));
  if (product) return <DetailView item={product} label="Product" />;

  notFound();
}
