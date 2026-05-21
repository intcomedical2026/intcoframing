import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Factory,
  Globe2,
  Layers,
  Leaf,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Ruler,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import {
  BlogPost,
  ContentPage,
  formatDate,
  ImageLike,
  linesFromBody,
  Product,
  ProductCategory,
  Project,
  SiteData,
  Solution,
} from "@/lib/site-data";
import { Locale, localizePath, t } from "@/lib/i18n";
import { ProductQuotePanel } from "@/components/product-quote-panel";
import { EnquiryList } from "@/components/enquiry-list";
import { CountUpStat } from "@/components/count-up-stat";
import { HeroCarousel } from "@/components/hero-carousel";

const PRODUCT_CATALOG_IMAGES = [
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/manual1-257x300-1.png",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/COLLECTION1.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/m-257x300-1.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/gong-257x300-1.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/manual1-257x300-1.jpg",
];

const PRODUCT_REPORT_IMAGES = [
  { title: "FSC", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/FSC.jpg" },
  { title: "ISO14001", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/ISO14001.jpg" },
  { title: "GRS", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/GRS.jpg" },
  { title: "ISO9001", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/ISO9001.jpg" },
];

const WHAT_WE_DO_IMAGES: Record<string, string> = {
  mirror: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo1.png",
  "picture frame": "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo2.png",
  art: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo3.png",
  furniture: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo5.png",
  "memo board": "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo4.png",
};

export function HomeView({ data, locale }: { data: SiteData; locale: Locale }) {
  const { homePage, productCategories, products, solutions, projects, blogPosts } = data;
  const parentCategories = productCategories.filter((category) => !category.parentSlug).slice(0, 5);
  const latestPosts = blogPosts.slice(0, 6);
  const href = (path: string) => localizePath(locale, path);

  return (
    <>
      <HeroCarousel slides={homePage.heroSlides} fallbackTitle={homePage.title} locale={locale} />

      <section className="bg-white py-16">
        <div data-reveal="fade">
          <SectionTitle eyebrow={t(locale, "featuredProducts")} title="Category depth for retail programs" />
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
          {parentCategories.map((category, index) => (
            <div key={category.slug} data-reveal style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
              <CategoryCard category={category} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
          <div className="relative min-h-[420px] overflow-hidden bg-neutral-300" data-reveal="left">
            {homePage.companyProfile?.imageUrl ? (
              <Image
                src={homePage.companyProfile.imageUrl}
                alt={homePage.companyProfile.title || "Company profile"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            ) : null}
          </div>
          <div className="flex flex-col justify-center" data-reveal="right">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-emerald-700">Company Profile</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold text-neutral-950 sm:text-5xl">{homePage.companyProfile?.title}</h2>
            <p className="mt-5 text-pretty text-lg leading-8 text-neutral-700">{homePage.companyProfile?.description}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {(homePage.companyProfile?.points || []).map((point, index) => (
                <li key={point} className="flex items-center gap-3 bg-white p-4 text-sm font-semibold text-neutral-800 transition-transform duration-200 hover:-translate-y-0.5">
                  <span className="flex size-8 shrink-0 items-center justify-center bg-emerald-700 text-white">{index + 1}</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {(homePage.stats || []).map((stat, index) => (
            <div key={stat.label} className="bg-white p-6" data-reveal style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
              <div className="text-4xl font-bold text-emerald-700">
                <CountUpStat value={stat.value} />
              </div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div data-reveal="fade">
          <SectionTitle
            eyebrow={t(locale, "solutions")}
            title="Turnkey service from insight to delivery"
            description="We are committed to offering you retail solutions custom tailored to fulfill all your needs."
          />
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {solutions.map((solution, index) => (
            <div key={solution.slug} data-reveal style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
              <FeatureCard item={solution} iconIndex={index} href={href(solution.path)} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 py-16 text-white">
        <div data-reveal="fade">
          <SectionTitle
            eyebrow={homePage.projectsIntro?.title || "Projects"}
            title={homePage.projectsIntro?.cta || "Customized solution for every industry needs"}
            description={homePage.projectsIntro?.description}
            dark
          />
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {projects.slice(0, 4).map((project, index) => (
            <div key={project.slug} data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}>
              <ImageCard href={href(project.path)} title={project.title} label={project.category} imageUrl={project.imageUrl} alt={project.imageAlt} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div data-reveal="fade">
          <SectionTitle eyebrow="Blog" title="Interior decor expertise" description={homePage.blogIntro?.description} />
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {latestPosts.map((post, index) => (
            <div key={post.slug} data-reveal style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
              <BlogCard post={post} locale={locale} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <div data-reveal="fade">
          <SectionTitle eyebrow={t(locale, "latestProducts")} title={t(locale, "productCatalog")} />
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {products.slice(0, 8).map((product, index) => (
            <div key={product.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function ProductsLandingView({
  page,
  products,
  categories,
  projects,
  locale,
}: {
  page?: ContentPage;
  products: Product[];
  categories: ProductCategory[];
  projects: Project[];
  locale: Locale;
}) {
  const parentCategories = categories.filter((category) => !category.parentSlug).slice(0, 5);
  const pageLines = contentLines(page?.bodyText, 80);
  const intro = extractAfter(pageLines, "WHAT WE DO", 2);
  const catalogLines = extractAfter(pageLines, "Catalog", 2);
  const testReportLines = extractAfter(pageLines, "TEST REPORT", 2);
  const introTitle = intro[0] || pageLines[2] || page?.description || "";
  const introDescription = intro[1] || pageLines[3] || page?.description;
  const projectLines = extractAfter(pageLines, "PROJECTS", 2);
  const projectTitle = projectLines[0] || pageLines[5] || t(locale, "projects");
  const projectDescription = projectLines[1] || pageLines[6] || page?.description;
  const catalogTitle = catalogLines[0] || pageLines[8] || page?.description || t(locale, "catalog");
  const catalogDescription = catalogLines[1] || pageLines[9] || page?.description;
  const reportTitle = testReportLines[0] || pageLines[16] || page?.description || t(locale, "testReport");
  const reportDescription = testReportLines[1] || pageLines[17] || page?.description;

  return (
    <>
      <PageHero
        title={page?.title || "Products"}
        description={page?.description}
        imageUrl={page?.imageUrl || parentCategories[0]?.imageUrl}
      />
      <section className="bg-white py-16">
        <SectionTitle
          eyebrow={t(locale, "whatWeDo")}
          title={introTitle}
          description={introDescription}
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
          {parentCategories.map((category, index) => (
            <Link
              key={category.slug}
              href={localizePath(locale, category.path)}
              className="group grid overflow-hidden bg-neutral-50 ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-lg lg:grid-cols-[.82fr_1.18fr]"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
            >
              <div className="relative min-h-72 bg-neutral-100">
                {whatWeDoImage(category) ? (
                  <Image
                    src={whatWeDoImage(category)}
                    alt={category.imageAlt || category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 38vw, 100vw"
                  />
                ) : null}
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-sm font-bold uppercase text-emerald-700">{index + 1 < 10 ? `0${index + 1}` : index + 1}</p>
                <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{category.title}</h2>
                <p className="mt-4 text-pretty text-base leading-8 text-neutral-600">{category.description || categoryStory(category.title, pageLines)}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase text-emerald-700 transition-transform duration-200 group-hover:translate-x-1">
                  {t(locale, "exploreMore")} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase text-emerald-300">{t(locale, "projects")}</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold">{projectTitle}</h2>
            {projectDescription ? <p className="mt-4 text-pretty leading-8 text-white/70">{projectDescription}</p> : null}
            <Link href={localizePath(locale, "/projects")} className="mt-8 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-bold uppercase text-neutral-950 transition duration-200 hover:-translate-y-0.5">
              {t(locale, "exploreMore")} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2" data-reveal="right">
            {projects.slice(0, 4).map((project) => (
              <ImageCard key={project.slug} href={localizePath(locale, project.path)} title={project.title} label={project.category} imageUrl={project.imageUrl} alt={project.imageAlt} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "catalog")}</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{catalogTitle}</h2>
            {catalogDescription ? <p className="mt-4 text-pretty leading-8 text-neutral-600">{catalogDescription}</p> : null}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {PRODUCT_CATALOG_IMAGES.map((image, index) => (
                <div key={image} className="relative aspect-[257/300] bg-neutral-100 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}>
                  <Image src={image} alt={`${t(locale, "catalog")} ${index + 1}`} fill className="object-cover" sizes="160px" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-neutral-100 p-6" data-reveal="right">
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "testReport")}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{reportTitle}</h2>
            {reportDescription ? <p className="mt-4 text-pretty leading-8 text-neutral-600">{reportDescription}</p> : null}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {PRODUCT_REPORT_IMAGES.map((report, index) => (
                <div key={report.title} className="bg-white p-4 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}>
                  <div className="relative aspect-[4/3] bg-neutral-50">
                    <Image src={report.imageUrl} alt={report.title} fill className="object-contain" sizes="180px" />
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold text-neutral-800">{report.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <SectionTitle eyebrow={t(locale, "latestProducts")} title={t(locale, "viewAllProducts")} />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {products.slice(0, 12).map((product, index) => (
            <div key={product.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function ProductListingView({
  title,
  description,
  products,
  categories,
  heroImage,
  category,
  locale,
}: {
  title: string;
  description?: string;
  products: Product[];
  categories?: ProductCategory[];
  heroImage?: string;
  category?: ProductCategory;
  locale: Locale;
}) {
  const bestSellers = products.slice(0, 4);
  return (
    <>
      <PageHero title={title} description={description} imageUrl={heroImage} />
      {categories?.length ? (
        <section className="bg-white py-12">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {categories.map((category, index) => (
              <div key={category.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
                <CategoryCard category={category} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "viewAllProducts")}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{category?.title || title}</h2>
            <p className="mt-4 text-pretty leading-8 text-neutral-600">
              {category?.description || description || "Explore INTCO Framing product collections for retail, hospitality, residential and commercial interior programs."}
            </p>
          </div>
          {bestSellers.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal="right">
              {bestSellers.map((product) => (
                <Link key={product.slug} href={localizePath(locale, product.path)} className="group bg-neutral-50 p-3 ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5">
                  <div className="relative aspect-square bg-white">
                    {preferredImage(product) ? <Image src={preferredImage(product)} alt={product.imageAlt || product.title} fill className="object-cover" sizes="180px" /> : null}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-neutral-900">{product.title}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <section className="bg-neutral-100 py-14">
        <SectionTitle eyebrow={t(locale, "bestSellers")} title={products.length ? t(locale, "productCatalog") : t(locale, "product")} description={products.length ? undefined : "No products are currently available for this category."} />
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {products.map((product, index) => (
            <div key={product.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function SolutionsListingView({
  solutions,
  page,
  products = [],
  projects = [],
  locale,
}: {
  solutions: Solution[];
  page?: ContentPage;
  products?: Product[];
  projects?: Project[];
  locale: Locale;
}) {
  const lines = contentLines(page?.bodyText, 90);
  const intro = extractAfter(lines, "END-TO-END HOME DECOR SOLUTIONS", 2);
  const serviceCopy = extractBetween(lines, "SERVICES WE OFFER", "HOW IT WORKS").filter((line) => line !== "About Intco");
  const process = ["Design", "Frame Extrusion", "Assemble", "Warehousing", "Packing", "Quality Control"];
  return (
    <>
      <PageHero
        title={page?.title || "Solutions"}
        description={page?.description || "Turnkey support across trend research, design engineering, manufacturing delivery, global supply, certification and retailer support."}
        imageUrl={page?.imageUrl}
      />
      <section className="bg-white py-16">
        <SectionTitle
          eyebrow={t(locale, "endToEndHomeDecor")}
          title={intro[0] || "We are dedicated to providing innovative and sustainable solutions."}
          description={intro[1] || page?.description}
        />
      </section>
      <section className="bg-white py-14">
        <SectionTitle eyebrow={t(locale, "servicesWeOffer")} title={t(locale, "solutions")} />
        {serviceCopy.length ? (
          <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {serviceCopy.map((line, index) => (
              <div key={`${line}-${index}`} className="bg-neutral-50 p-6 text-pretty text-sm leading-7 text-neutral-600 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties}>
                {line}
              </div>
            ))}
          </div>
        ) : null}
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {solutions.map((solution, index) => (
            <div key={solution.slug} data-reveal style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
              <FeatureCard item={solution} iconIndex={index} href={localizePath(locale, solution.path)} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <section className="bg-neutral-100 py-16">
        <SectionTitle eyebrow={t(locale, "howItWorks")} title={t(locale, "servicesWeProvide")} />
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-6 lg:px-8">
          {process.map((step, index) => (
            <div key={step} className="bg-white p-5 text-center ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}>
              <div className="mx-auto flex size-12 items-center justify-center bg-emerald-700 text-sm font-bold text-white">{index + 1}</div>
              <h3 className="mt-4 text-balance text-base font-semibold text-neutral-950">{step}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionTitle eyebrow={t(locale, "featuredProductsLabel")} title={t(locale, "youMayAlsoLike")} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.slug} product={product} locale={locale} />
              ))}
            </div>
          </div>
          <div>
            <SectionTitle eyebrow={t(locale, "latestProjects")} title={t(locale, "customerService")} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {projects.slice(0, 4).map((project) => (
                <ImageCard key={project.slug} href={localizePath(locale, project.path)} title={project.title} label={project.category} imageUrl={project.imageUrl} alt={project.imageAlt} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function ProjectsListingView({ projects, category, page, locale }: { projects: Project[]; category?: string; page?: ContentPage; locale: Locale }) {
  const filtered = category ? projects.filter((project) => (project.categoryKey || project.category) === category) : projects;
  const projectNav = projects.slice(0, 5);
  const pageLines = contentLines(page?.bodyText, 40);
  const introLines = pageLines.slice(1, 3);
  const title = category ? `${category} Projects` : page?.title || "Projects";

  return (
    <>
      <PageHero
        title={title}
        description={page?.description || "Artistry meets functionality. INTCO products integrate into residential and commercial scenarios."}
        imageUrl={page?.imageUrl}
      />
      <section className="bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href={localizePath(locale, "/projects")} className="border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition duration-200 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white">
            {t(locale, "viewAll")}
          </Link>
          {projectNav.map((item) => (
            <Link key={item.slug} href={localizePath(locale, item.path)} className="border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition duration-200 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white">
              {item.title}
            </Link>
          ))}
        </div>
        {introLines.length ? (
          <div className="mx-auto mt-8 max-w-4xl px-4 text-center sm:px-6 lg:px-8" data-reveal="fade">
            <h2 className="text-balance text-3xl font-semibold text-neutral-950">{introLines[0]}</h2>
            {introLines[1] ? <p className="mt-4 text-pretty text-lg leading-8 text-neutral-600">{introLines[1]}</p> : null}
          </div>
        ) : null}
      </section>
      <section className="bg-neutral-100 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
          {filtered.map((project, index) => (
            <Link
              key={project.slug}
              href={localizePath(locale, project.path)}
              className="group grid overflow-hidden bg-white ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-lg lg:grid-cols-2"
              data-reveal
              style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}
            >
              <div className={`relative min-h-72 bg-neutral-200 ${index % 2 ? "lg:order-2" : ""}`}>
                {project.imageUrl ? <Image src={project.imageUrl} alt={project.imageAlt || project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 50vw, 100vw" /> : null}
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-sm font-bold uppercase text-emerald-700">{project.category || "Project"}</p>
                <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{project.title}</h2>
                <p className="mt-4 text-pretty leading-8 text-neutral-600">{project.description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase text-emerald-700 transition-transform duration-200 group-hover:translate-x-1">
                  {t(locale, "exploreMore")} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function BlogListingView({ posts, locale, activeCategory, page }: { posts: BlogPost[]; locale: Locale; activeCategory?: string; page?: ContentPage }) {
  const pageLines = contentLines(page?.bodyText, 120);
  const sourceCategoryOrder = ["Expo", "Industry News", "Inspiration", "New Arrivals", "Press Release", "Tips"];
  const categorySet = new Set(posts.map((post) => post.category).filter(Boolean));
  const categories = sourceCategoryOrder.filter((name) => pageLines.includes(name) || categorySet.has(name));
  const datedPosts = posts.map((post) => ({ ...post, publishedAt: post.publishedAt || blogDateFor(pageLines, post.title) }));
  const filteredPosts = activeCategory ? datedPosts.filter((post) => post.category === activeCategory) : datedPosts;
  const visiblePosts = filteredPosts.length ? filteredPosts : datedPosts;
  const popularPosts = datedPosts.slice(0, 5);
  return (
    <>
      <PageHero
        title={page?.title || "Blog"}
        description={page?.description || "Home decor, interior design, product material, exhibition and industry trend articles from INTCO Framing."}
        imageUrl={page?.imageUrl}
      />
      <section className="bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
          {[t(locale, "all"), ...categories].map((category) => (
            <Link
              key={category}
              href={category === t(locale, "all") ? localizePath(locale, "/blog") : `${localizePath(locale, "/blog")}?category=${encodeURIComponent(category || "")}`}
              className={`border px-4 py-2 text-sm font-semibold ${
                (category === t(locale, "all") && !activeCategory) || category === activeCategory
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-neutral-200 text-neutral-700"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-neutral-100 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {visiblePosts.map((post, index) => (
              <div key={post.slug} data-reveal style={{ "--reveal-delay": `${(index % 2) * 90}ms` } as React.CSSProperties}>
                <BlogCard post={post} locale={locale} />
              </div>
            ))}
          </div>
          <aside className="space-y-5" data-reveal="right">
            <form action={localizePath(locale, "/index.php")} className="flex border border-neutral-200 bg-white p-3">
              <input name="keyword" aria-label={t(locale, "search")} placeholder={t(locale, "search")} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <button type="submit" className="flex size-10 items-center justify-center bg-neutral-950 text-white" aria-label={t(locale, "search")}>
                <Search size={18} />
              </button>
            </form>
            <div className="bg-white p-6 ring-1 ring-black/5">
              <h2 className="text-balance text-xl font-semibold text-neutral-950">{t(locale, "popularPosts")}</h2>
              <div className="mt-5 space-y-4">
                {popularPosts.map((post) => (
                  <Link key={post.slug} href={localizePath(locale, post.path)} className="group grid grid-cols-[72px_1fr] gap-3">
                    <div className="relative aspect-square bg-neutral-100">
                      {post.imageUrl ? <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill className="object-cover" sizes="72px" /> : null}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">{formatDate(post.publishedAt)}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-neutral-800 transition-colors duration-200 group-hover:text-emerald-700">{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-neutral-950 p-6 text-white">
              <p className="text-sm font-bold uppercase text-emerald-300">{t(locale, "shopNow")}</p>
              <h2 className="mt-3 text-balance text-2xl font-semibold">{t(locale, "perfectSolution")}</h2>
              <Link href={localizePath(locale, "/products")} className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold uppercase text-neutral-950">
                {t(locale, "exploreMore")} <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function ProductDetailView({
  product,
  relatedProducts,
  locale,
}: {
  product: Product;
  relatedProducts: Product[];
  locale: Locale;
}) {
  const details = parseProductDetails(product);
  const displayTitle = details.displayTitle || product.title;
  const gallery = itemGallery(product);
  const primary = gallery[0] || preferredImage(product);
  const bestSellers = relatedProducts.slice(0, 4);

  return (
    <>
      <section className="bg-neutral-100 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 text-sm text-neutral-600 sm:px-6 lg:px-8">
          <Link href={localizePath(locale, "/products")} className="font-semibold text-emerald-700">
            Products
          </Link>
          <span>/</span>
          <span>{displayTitle}</span>
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div data-reveal="left">
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              {primary ? <Image src={primary} alt={product.imageAlt || displayTitle} fill className="object-contain" sizes="(min-width: 1024px) 52vw, 100vw" priority /> : null}
            </div>
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
                {gallery.slice(0, 8).map((image, index) => (
                  <div key={image} className="relative aspect-square bg-neutral-100 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 50}ms` } as React.CSSProperties}>
                    <Image src={image} alt={product.imageAlt || displayTitle} fill className="object-contain" sizes="120px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <article data-reveal="right">
            {details.bestSellerPairs.length ? (
              <div className="mb-6 bg-neutral-50 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase text-emerald-700">{t(locale, "bestSellers")}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {details.bestSellerPairs.map((item) => (
                    <div key={`${item.title}-${item.itemNumber}`} className="bg-white p-3">
                      <p className="line-clamp-2 text-xs font-semibold leading-4 text-neutral-700">{item.title}</p>
                      <p className="mt-2 text-xs font-bold text-neutral-950">{item.itemNumber}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : bestSellers.length ? (
              <div className="mb-6 bg-neutral-50 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase text-emerald-700">{t(locale, "bestSellers")}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {bestSellers.map((item) => (
                    <Link key={item.slug} href={localizePath(locale, item.path)} className="group">
                      <div className="relative aspect-square bg-white">
                        {preferredImage(item) ? <Image src={preferredImage(item)} alt={item.imageAlt || item.title} fill className="object-contain" sizes="96px" /> : null}
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-4 text-neutral-700 group-hover:text-emerald-700">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "product")}</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{displayTitle}</h1>
            {product.description ? <p className="mt-4 text-pretty text-base leading-8 text-neutral-600">{product.description}</p> : null}
            <dl className="mt-7 grid gap-px overflow-hidden bg-neutral-200 ring-1 ring-neutral-200">
              {details.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[140px_1fr] bg-white">
                  <dt className="bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-600">{spec.label}</dt>
                  <dd className="px-4 py-3 text-sm font-semibold text-neutral-950">{spec.value || "-"}</dd>
                </div>
              ))}
            </dl>
            <ProductQuotePanel locale={locale} product={{ slug: product.slug, title: displayTitle, path: product.path, imageUrl: primary }} />
          </article>
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "aboutThisItem")}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{t(locale, "descriptionHighlights")}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2" data-reveal="right">
              <div className="bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-xl font-semibold text-neutral-950">{t(locale, "description")}</h3>
                <div className="mt-4 space-y-3 text-pretty text-sm leading-7 text-neutral-600">
                  {(details.descriptionLines.length ? details.descriptionLines : linesFromBody(product.bodyText, 3)).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-xl font-semibold text-neutral-950">{t(locale, "highlights")}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-700">
                  {(details.highlightLines.length ? details.highlightLines : linesFromBody(product.bodyText, 6).slice(1)).map((line) => (
                    <li key={line} className="flex gap-3">
                      <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="bg-white py-16">
          <SectionTitle eyebrow={t(locale, "relatedProducts")} title={t(locale, "relatedProducts")} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {relatedProducts.slice(0, 4).map((item, index) => (
              <div key={item.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <ProductCard product={item} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <ServicesBand locale={locale} />
    </>
  );
}

export function SolutionDetailView({
  solution,
  products,
  projects,
  locale,
}: {
  solution: Solution;
  products: Product[];
  projects: Project[];
  locale: Locale;
}) {
  const sections = sectionize(contentLines(solution.bodyText, 120));

  return (
    <>
      <PageHero title={solution.title} description={solution.description} imageUrl={solution.imageUrl} label="Solution" />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "servicesWeOffer")}</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{solution.title}</h2>
            <p className="mt-5 text-pretty leading-8 text-neutral-600">{solution.description}</p>
          </div>
          <div className="grid gap-5" data-reveal="right">
            {sections.map((section) => (
              <div key={section.title} className="bg-neutral-50 p-6 ring-1 ring-black/5">
                <h3 className="text-balance text-2xl font-semibold text-neutral-950">{section.title}</h3>
                <div className="mt-4 space-y-3 text-pretty text-sm leading-7 text-neutral-600">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ServicesBand locale={locale} />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <RelatedGrid title={t(locale, "featuredProductsLabel")} items={products.slice(0, 4)} locale={locale} kind="product" />
          <RelatedGrid title={t(locale, "latestProjects")} items={projects.slice(0, 4)} locale={locale} kind="project" />
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function ProjectDetailView({
  project,
  products,
  projects,
  locale,
}: {
  project: Project;
  products: Product[];
  projects: Project[];
  locale: Locale;
}) {
  const lines = contentLines(project.bodyText, 100);
  const usedItemNames = extractBetween(lines, "USED ITEMS", "YOU MAY ALSO LIKE").filter((line) => !line.includes("Explore more details"));
  const usedProducts = usedItemNames
    .map((name) => products.find((product) => product.title.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Product[];
  const gallery = itemGallery(project);
  const usedStart = lines.findIndex((line) => line === "USED ITEMS");
  const body = lines.slice(0, usedStart > -1 ? usedStart : lines.length);
  const relatedProjectNames = extractBetween(lines, "YOU MAY ALSO LIKE", "GET MORE INSPIRATION");
  const relatedByName = relatedProjectNames
    .map((name) => projects.find((item) => item.title.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Project[];
  const relatedProjects = (relatedByName.length ? relatedByName : projects.filter((item) => item.slug !== project.slug)).slice(0, 4);
  const inspirationLines = extractAfter(lines, "GET MORE INSPIRATION", 8);

  return (
    <>
      <PageHero title={project.title} description={project.description} imageUrl={project.imageUrl} label={project.category || "Project"} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="grid gap-4" data-reveal="left">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              {gallery[0] ? <Image src={gallery[0]} alt={project.imageAlt || project.title} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" /> : null}
            </div>
            {gallery.length > 1 ? (
              <div className="grid grid-cols-3 gap-4">
                {gallery.slice(1, 8).map((image) => (
                  <div key={image} className="relative aspect-[4/3] bg-neutral-100">
                    <Image src={image} alt={project.imageAlt || project.title} fill className="object-cover" sizes="220px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <article className="flex flex-col justify-center" data-reveal="right">
            <p className="text-sm font-bold uppercase text-emerald-700">{project.category || "Project"}</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{project.title}</h2>
            <div className="mt-6 space-y-4 text-pretty leading-8 text-neutral-600">
              {(body.length ? body : [project.description || ""]).filter(Boolean).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
      <section className="bg-neutral-100 py-16">
        <SectionTitle eyebrow={t(locale, "usedItems")} title={t(locale, "productsInProject")} />
        {usedItemNames.length ? (
          <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
            {usedItemNames.map((name) => (
              <span key={name} className="bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-black/5">
                {name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {(usedProducts.length ? usedProducts : products.slice(0, 4)).map((product, index) => (
            <div key={product.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <SectionTitle eyebrow={t(locale, "youMayAlsoLike")} title={t(locale, "moreProjectIdeas")} />
        {relatedProjectNames.length ? (
          <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
            {relatedProjectNames.map((name) => (
              <span key={name} className="bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                {name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {relatedProjects.map((item, index) => (
            <div key={item.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <ImageCard href={localizePath(locale, item.path)} title={item.title} label={item.category} imageUrl={item.imageUrl} alt={item.imageAlt} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      {inspirationLines.length ? (
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow="Blog" title="GET MORE INSPIRATION" />
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {inspirationLines.map((line, index) => (
              <div key={`${line}-${index}`} className="bg-white p-5 text-sm font-semibold leading-6 text-neutral-700 ring-1 ring-black/5">
                {line}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <ContactBand locale={locale} />
    </>
  );
}

export function BlogPostView({ post, posts, locale }: { post: BlogPost; posts: BlogPost[]; locale: Locale }) {
  const lines = contentLines(post.bodyText, 120);
  const gallery = itemGallery(post);
  const popularPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 5);
  const supplementalLines = blogSourceSupplementLines(post.slug).filter((line) => !containsRenderedLine(lines, line));

  return (
    <>
      <PageHero title={post.title} description={post.excerpt} imageUrl={post.imageUrl} label={post.category || "Blog"} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <article data-reveal="left">
            {post.publishedAt ? <p className="text-sm font-semibold text-emerald-700">{formatDate(post.publishedAt)}</p> : null}
            {gallery[0] ? (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-neutral-100">
                <Image src={gallery[0]} alt={post.imageAlt || post.title} fill className="object-cover" sizes="(min-width: 1024px) 65vw, 100vw" />
              </div>
            ) : null}
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.slice(1, 8).map((image) => (
                  <div key={image} className="relative aspect-[4/3] bg-neutral-100">
                    <Image src={image} alt={post.imageAlt || post.title} fill className="object-cover" sizes="180px" />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-8 space-y-5 text-pretty text-base leading-8 text-neutral-700">
              {supplementalLines.map((line) => (
                <h2 key={line} className="pt-4 text-balance text-2xl font-semibold text-neutral-950">
                  {line}
                </h2>
              ))}
              {(lines.length ? lines : [post.excerpt || ""]).filter(Boolean).map((line) =>
                looksLikeHeading(line) ? (
                  <h2 key={line} className="pt-4 text-balance text-2xl font-semibold text-neutral-950">
                    {line}
                  </h2>
                ) : (
                  <p key={line}>{line}</p>
                )
              )}
            </div>
          </article>
          <aside className="space-y-5" data-reveal="right">
            <form action={localizePath(locale, "/index.php")} className="flex border border-neutral-200 bg-neutral-50 p-3">
              <input name="keyword" aria-label={t(locale, "search")} placeholder={t(locale, "search")} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <button type="submit" className="flex size-10 items-center justify-center bg-neutral-950 text-white" aria-label={t(locale, "search")}>
                <Search size={18} />
              </button>
            </form>
            <div className="bg-neutral-50 p-6 ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-neutral-950">{t(locale, "popularPosts")}</h2>
              <div className="mt-5 space-y-4">
                {popularPosts.map((item) => (
                  <Link key={item.slug} href={localizePath(locale, item.path)} className="group block border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold text-emerald-700">{formatDate(item.publishedAt)}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-neutral-800 group-hover:text-emerald-700">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-neutral-950 p-6 text-white">
              <p className="text-sm font-bold uppercase text-emerald-300">{t(locale, "shopNow")}</p>
              <h2 className="mt-3 text-balance text-2xl font-semibold">{t(locale, "perfectSolution")}</h2>
              <Link href={localizePath(locale, "/products")} className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold uppercase text-neutral-950">
                {t(locale, "exploreMore")} <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function DetailView({
  item,
  label,
  locale,
  relatedProducts = [],
}: {
  item: Product | Solution | Project | BlogPost | ContentPage;
  label: string;
  locale: Locale;
  relatedProducts?: Product[];
}) {
  const body = "bodyText" in item ? item.bodyText : "";
  const lines = linesFromBody(body, 22);
  const gallery = item.galleryUrls?.filter(Boolean).slice(0, 6) || [];

  return (
    <>
      <PageHero title={item.title} description={"description" in item ? item.description : "excerpt" in item ? item.excerpt : ""} imageUrl={item.imageUrl} label={label} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div data-reveal="left">
            {item.imageUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(min-width: 1024px) 52vw, 100vw" />
              </div>
            ) : null}
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {gallery.slice(1).map((image, index) => (
                  <div key={image} className="relative aspect-square overflow-hidden bg-neutral-100" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                    <Image src={image} alt={item.imageAlt || item.title} fill className="object-cover transition-transform duration-500 hover:scale-110" sizes="180px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <article data-reveal="right">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-emerald-700">{label}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950 sm:text-4xl">{item.title}</h2>
            {"publishedAt" in item && item.publishedAt ? (
              <p className="mt-3 text-sm font-semibold text-neutral-500">{formatDate(item.publishedAt)}</p>
            ) : null}
            <div className="mt-7 space-y-4 text-pretty text-base leading-8 text-neutral-700">
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {label === "Product" && "slug" in item ? (
              <ProductQuotePanel
                locale={locale}
                product={{ slug: item.slug, title: item.title, path: item.path, imageUrl: item.imageUrl }}
              />
            ) : null}
          </article>
        </div>
        {relatedProducts.length ? (
          <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow={t(locale, "relatedProducts")} title={t(locale, "aboutThisItem")} />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product, index) => (
                <div key={product.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                  <ProductCard product={product} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

export function EnquiryListView({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero title={t(locale, "myCart")} description={t(locale, "quote")} />
      <EnquiryList locale={locale} />
    </>
  );
}

export function ContentPageView({ page, locale }: { page: ContentPage; locale: Locale }) {
  const lines = contentLines(page.bodyText, 140);

  if (page.path === "/who-we-are") {
    const timeline = parseTimeline(lines);
    return (
      <>
        <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label="INTCO" />
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "aboutUs")}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{lines.find((line) => line.includes("Intco Framing")) || page.title}</h2>
            </div>
            <div className="space-y-4 text-pretty leading-8 text-neutral-600" data-reveal="right">
              {lines.slice(lines.findIndex((line) => line === "ABOUT US") + 1, lines.findIndex((line) => line === "OUR HISTORY")).filter((line) => !["Business Units", "Production Bases", "+", "Years Experience", "4000", "Employees"].includes(line)).slice(0, 4).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              { value: "5", label: "Business Units" },
              { value: "8", label: "Production Bases" },
              { value: "20+", label: "Years Experience" },
              { value: "4000", label: "Employees" },
            ].map((stat, index) => (
              <div key={stat.label} className="bg-neutral-50 p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <div className="text-4xl font-bold text-emerald-700">
                  <CountUpStat value={stat.value} />
                </div>
                <p className="mt-2 text-sm font-semibold uppercase text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow={t(locale, "ourHistory")} title={t(locale, "ourHistory")} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {timeline.map((item, index) => (
              <div key={`${item.year}-${index}`} className="bg-white p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties}>
                <div className="text-3xl font-bold text-emerald-700">{item.year}</div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
                  {item.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "globalMarket")}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{t(locale, "globalMarket")}</h2>
            </div>
            <p className="text-pretty text-lg leading-8 text-neutral-600" data-reveal="right">
              {lines.find((line) => line.includes("Operating on a global scale")) || "We have established a widespread presence in the market, collaborating with numerous high-quality retail partners worldwide."}
            </p>
          </div>
        </section>
        <ContactBand locale={locale} />
      </>
    );
  }

  if (page.path === "/who-we-are/sustainability") {
    const sections = sectionize(lines);
    return (
      <>
        <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label="ESG" />
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">ESG & Sustainability in Action</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{lines[0] || page.title}</h2>
              <Link href="#" className="mt-7 inline-flex items-center gap-2 bg-neutral-950 px-6 py-3 text-sm font-bold uppercase text-white">
                ESG Report 2022 / Download PDF <Download size={16} />
              </Link>
              {lines.includes("EXTERNAL RATINGS") ? <p className="mt-5 text-sm font-bold uppercase tracking-wide text-emerald-700">EXTERNAL RATINGS</p> : null}
            </div>
            <div className="space-y-4 text-pretty leading-8 text-neutral-600" data-reveal="right">
              {lines.slice(1, 6).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow="ENVIRONMENTAL CONTRIBUTION" title="Cumulative Savings" description={lines.find((line) => line.includes("reduced 200,000 tons"))} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ["2.5 Million", "Tons Carbon Emissions"],
              ["3.75", "Tons Crude Oil Resources"],
              ["2 Million", "Trees Were Protected"],
              ["1.2 Million", "Boxes PS Mouldings"],
            ].map(([value, label], index) => (
              <div key={label} className="bg-white p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <div className="text-4xl font-bold text-emerald-700">{value}</div>
                <p className="mt-3 text-sm font-semibold uppercase text-neutral-600">{label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
          <SectionTitle eyebrow="SUSTAINABILITY IN ACTION" title="Innovating circular economy models" />
          <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {sections.slice(-3).map((section, index) => (
              <div key={section.title} className="bg-neutral-50 p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <h3 className="text-balance text-2xl font-semibold text-neutral-950">{section.title}</h3>
                <p className="mt-4 text-pretty text-sm leading-7 text-neutral-600">{section.body.join(" ")}</p>
              </div>
            ))}
          </div>
        </section>
        <ContactBand locale={locale} />
      </>
    );
  }

  if (page.path === "/who-we-are/philosophy") {
    const sections = sectionize(lines);
    return (
      <>
        <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label={t(locale, "philosophy")} />
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8" data-reveal="fade">
            <h2 className="text-balance text-4xl font-semibold text-neutral-950">{lines[0] || "Our Mission & Vision | Intco Framing"}</h2>
            <p className="text-pretty text-2xl font-semibold leading-10 text-neutral-950">
              {lines.find((line) => line.includes("dynamic and hardworking")) || "We have a dynamic and hardworking team making concerted efforts on a difficult but worthwhile cause."}
            </p>
            <p className="mt-5 text-sm font-bold uppercase text-emerald-700">{lines.find((line) => line.includes("Frank Liu")) || "—— Frank Liu，CEO"}</p>
          </div>
        </section>
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow={t(locale, "philosophy")} title={t(locale, "missionVisionValues")} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {sections.filter((section) => ["Mission", "Vision", "Spirit", "Values", "Objective", "lmprovement & Innovation"].includes(section.title)).map((section, index) => (
              <div key={section.title} className="bg-white p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties}>
                <h3 className="text-xl font-semibold text-neutral-950">{section.title}</h3>
                <p className="mt-4 text-pretty text-sm leading-7 text-neutral-600">{section.body.join(" ")}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <InfoPanel icon={<Globe2 size={24} />} eyebrow={t(locale, "worldClassCustomerService")} title="20+ Years" description="Our Customer Service Team has an in-depth knowledge of the picture framing industry and is here to support you with seamless end-to-end solutions." />
            <InfoPanel icon={<Phone size={24} />} eyebrow={t(locale, "doNotHesitate")} title="Unmatched quality and service" description="Unmatched quality and service will help you running a better business." />
          </div>
        </section>
        <ContactBand locale={locale} />
      </>
    );
  }

  return <DetailView item={page} label="INTCO" locale={locale} />;
}

export function ContactView({ page, locale }: { page: ContentPage; locale: Locale }) {
  const lines = contentLines(page.bodyText, 80);
  const factories = parseFactories(lines);
  const contacts = [
    { title: t(locale, "telephone"), value: "+86 13371591392", action: t(locale, "callNow"), href: "tel:+8613371591392", icon: Phone },
    { title: t(locale, "liveChat"), value: "+86 17753315610", action: t(locale, "contactNow"), href: "tel:+8617753315610", icon: Search },
    { title: t(locale, "sendEmail"), value: "info@intcoframing-us.com", action: t(locale, "emailUs"), href: "mailto:info@intcoframing-us.com", icon: Mail },
    { title: t(locale, "orderSample"), value: t(locale, "quote"), action: t(locale, "myCart"), href: localizePath(locale, "/enquiry-list"), icon: ShoppingCart },
  ];
  return (
    <>
      <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label="INTCO" />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8" data-reveal="fade">
          <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "contactUs")}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{lines[0] || "Connect with INTCO Framing"}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg leading-8 text-neutral-600">
            {lines.find((line) => line.includes("overseas factories")) || lines[1] || page.description}
          </p>
          {lines.find((line) => line.includes("committed team")) ? (
            <p className="mx-auto mt-3 max-w-3xl text-pretty leading-7 text-neutral-600">{lines.find((line) => line.includes("committed team"))}</p>
          ) : null}
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {factories.map((factory, index) => (
            <div key={factory.title} className="bg-neutral-50 p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <div className="flex size-12 items-center justify-center bg-emerald-700 text-white">
                <MapPin size={22} />
              </div>
              <h3 className="mt-5 text-balance text-xl font-semibold text-neutral-950">{factory.title}</h3>
              <p className="mt-3 text-pretty text-sm leading-7 text-neutral-600">{factory.address}</p>
              <p className="mt-2 text-sm font-semibold text-neutral-900">{factory.zip}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {contacts.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block bg-neutral-50 p-6 ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:bg-neutral-950 hover:text-white"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
            >
              <div className="flex size-11 items-center justify-center bg-emerald-700 text-white">
                <item.icon size={20} />
              </div>
              <div className="mt-4 text-sm font-bold uppercase text-emerald-700">{item.title}</div>
              <div className="mt-4 text-xl font-semibold">{item.value}</div>
              <div className="mt-2 text-sm font-semibold text-neutral-500 group-hover:text-white/70">{item.action}</div>
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div className="bg-neutral-950 p-8 text-white" data-reveal="left">
            <h2 className="text-balance text-3xl font-semibold">{t(locale, "perfectSolution")}</h2>
            <div className="mt-6 space-y-4 text-pretty text-sm leading-7 text-white/75">
              {linesFromBody(page.bodyText, 8).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <form className="grid gap-4 bg-neutral-100 p-6" data-reveal="right">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "name")} />
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "email")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "phone")} />
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "company")} />
            </div>
            <textarea className="min-h-36 border border-neutral-200 bg-white p-4 text-sm outline-none" placeholder={t(locale, "quote")} />
            <button type="button" className="w-fit rounded bg-emerald-700 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-neutral-950">
              {t(locale, "contactUs")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function InfoPanel({ icon, eyebrow, title, description }: { icon: React.ReactNode; eyebrow: string; title: string; description?: string }) {
  return (
    <div className="bg-neutral-50 p-7 ring-1 ring-black/5" data-reveal>
      <div className="flex size-12 items-center justify-center bg-emerald-700 text-white">{icon}</div>
      <p className="mt-6 text-sm font-bold uppercase text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{title}</h2>
      {description ? <p className="mt-4 text-pretty leading-8 text-neutral-600">{description}</p> : null}
    </div>
  );
}

function ContactBand({ locale }: { locale: Locale }) {
  return (
    <section className="bg-neutral-950 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div data-reveal="left">
          <p className="text-sm font-bold uppercase text-emerald-300">{t(locale, "getInTouch")}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold">{t(locale, "perfectSolution")}</h2>
          <p className="mt-3 text-pretty text-white/70">{t(locale, "contactToday")}</p>
        </div>
        <Link href={localizePath(locale, "/contact")} className="inline-flex w-fit items-center gap-2 bg-white px-6 py-3 text-sm font-bold uppercase text-neutral-950 transition duration-200 hover:-translate-y-0.5" data-reveal="right">
          {t(locale, "contactUs")} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function ServicesBand({ locale }: { locale: Locale }) {
  const services = [
    { title: t(locale, "designEngineering"), description: "Product design, cost engineering, packaging and display support.", icon: Ruler },
    { title: t(locale, "qualityManufacturing"), description: "Vertically integrated production with quality control from source materials.", icon: Factory },
    { title: t(locale, "globalDelivery"), description: "Flexible shipping through China, Vietnam and Malaysia production bases.", icon: PackageCheck },
  ];

  return (
    <section className="bg-neutral-950 py-16 text-white">
      <SectionTitle eyebrow={t(locale, "servicesWeProvide")} title={t(locale, "servicesWeOffer")} dark />
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div key={service.title} className="bg-white/5 p-6 ring-1 ring-white/10" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <div className="flex size-12 items-center justify-center bg-emerald-700 text-white">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 text-balance text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-pretty text-sm leading-7 text-white/70">{service.description}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <Link href={localizePath(locale, "/solutions")} className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm font-bold uppercase transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950">
          {t(locale, "exploreMore")} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function RelatedGrid({ title, items, locale, kind }: { title: string; items: Array<Product | Project>; locale: Locale; kind: "product" | "project" }) {
  return (
    <div>
      <SectionTitle eyebrow={t(locale, "youMayAlsoLike")} title={title} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) =>
          kind === "product" ? (
            <ProductCard key={item.slug} product={item as Product} locale={locale} />
          ) : (
            <ImageCard key={item.slug} href={localizePath(locale, item.path)} title={item.title} label={"category" in item ? item.category : undefined} imageUrl={item.imageUrl} alt={item.imageAlt} locale={locale} />
          )
        )}
      </div>
    </div>
  );
}

function PageHero({ title, description, imageUrl, label }: { title: string; description?: string; imageUrl?: string; label?: string }) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {imageUrl ? <Image src={imageUrl} alt={title} fill className="object-cover opacity-55" sizes="100vw" priority /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.38))]" />
      <div className="intco-page-hero-copy relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">{label || "INTCO Framing"}</p>
        <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold sm:text-6xl">{title}</h1>
        {description ? <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-white/85">{description}</p> : null}
      </div>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  dark,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <p className={`text-sm font-bold uppercase tracking-[0.28em] ${dark ? "text-emerald-300" : "text-emerald-700"}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-balance text-3xl font-semibold sm:text-5xl ${dark ? "text-white" : "text-neutral-950"}`}>{title}</h2>
      {description ? <p className={`mx-auto mt-4 max-w-3xl text-pretty text-lg leading-8 ${dark ? "text-white/70" : "text-neutral-600"}`}>{description}</p> : null}
    </div>
  );
}

function CategoryCard({ category, locale }: { category: ProductCategory; locale: Locale }) {
  return (
    <Link href={localizePath(locale, category.path)} className="group block h-full overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[5/4] overflow-hidden bg-neutral-100">
        {category.imageUrl || category.navImageUrl ? (
          <Image
            src={category.imageUrl || category.navImageUrl || ""}
            alt={category.imageAlt || category.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(min-width: 1024px) 20vw, 50vw"
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded border border-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-white">
            {t(locale, "exploreMore")} <ArrowRight size={16} />
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-balance text-xl font-semibold text-neutral-950">{category.title}</h3>
        <p className="mt-3 line-clamp-3 text-pretty text-sm leading-6 text-neutral-600">{category.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700 transition-transform duration-200 group-hover:translate-x-1">
          {t(locale, "exploreMore")} <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const imageUrl = preferredImage(product);
  return (
    <Link href={localizePath(locale, product.path)} className="group block h-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.imageAlt || product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(min-width: 1024px) 25vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm font-semibold text-neutral-400">{product.title}</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-balance text-lg font-semibold leading-7 text-neutral-950">{product.title}</h3>
        <p className="mt-3 line-clamp-3 text-pretty text-sm leading-6 text-neutral-600">{product.description}</p>
      </div>
    </Link>
  );
}

function FeatureCard({ item, iconIndex, href, locale }: { item: Solution; iconIndex: number; href: string; locale: Locale }) {
  const icons = [Search, Layers, Factory, Truck, Leaf, ArrowRight];
  const Icon = icons[iconIndex % icons.length];
  return (
    <Link href={href} className="group block h-full bg-neutral-50 p-7 ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:bg-neutral-950 hover:text-white">
      <div className="flex size-12 items-center justify-center bg-emerald-700 text-white transition-transform duration-200 group-hover:scale-105">
        <Icon size={24} />
      </div>
      <h3 className="mt-6 text-balance text-xl font-semibold">{item.title}</h3>
      <p className="mt-4 line-clamp-4 text-pretty text-sm leading-7 text-neutral-600 transition-colors duration-200 group-hover:text-white/70">{item.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700 transition duration-200 group-hover:translate-x-1 group-hover:text-emerald-300">
        {t(locale, "exploreMore")} <ArrowRight size={16} />
      </span>
    </Link>
  );
}

function ImageCard({
  href,
  title,
  label,
  imageUrl,
  alt,
  locale,
}: {
  href: string;
  title: string;
  label?: string;
  imageUrl?: string;
  alt?: string;
  locale: Locale;
}) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-neutral-800">
      {imageUrl ? <Image src={imageUrl} alt={alt || title} fill className="object-cover opacity-75 transition duration-500 group-hover:scale-110 group-hover:opacity-90" sizes="(min-width: 1024px) 25vw, 50vw" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-5 flex items-center justify-center bg-white/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-800">
          {t(locale, "exploreMore")} <ArrowRight size={16} />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white transition-transform duration-300 group-hover:-translate-y-2">
        {label ? <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{label}</p> : null}
        <h3 className="mt-2 text-balance text-2xl font-semibold">{title}</h3>
      </div>
    </Link>
  );
}

function BlogCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  return (
    <Link href={localizePath(locale, post.path)} className="group block h-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(min-width: 1024px) 33vw, 50vw" />
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wide text-emerald-700">
          <span>{post.category || "Inspiration"}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-balance text-xl font-semibold leading-7 text-neutral-950">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-pretty text-sm leading-6 text-neutral-600">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function contentLines(bodyText?: string, max = 80) {
  const noise = new Set(["Blog", '">', ">", "-", "+", '" alt="', '"/>']);
  const lines = (bodyText || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.length > 1 || /^[A-Za-z0-9]$/.test(line))
    .filter((line) => !noise.has(line))
    .filter((line) => !isSourceNoiseLine(line))
    .filter((line) => !line.startsWith("We use cookies"))
    .filter((line, index, list) => list.indexOf(line) === index);

  return lines.slice(0, max);
}

function isSourceNoiseLine(line: string) {
  const lowered = line.toLowerCase();
  return (
    line === "Warning" ||
    lowered.includes("undefined array key") ||
    lowered.includes("attempt to read property") ||
    lowered.includes("/wp-content/themes/") ||
    lowered === "on line"
  );
}

function blogSourceSupplementLines(slug: string) {
  const supplements: Record<string, string[]> = {
    "canvas-art-a-perfect-addition-to-your-home-decor": ["Why Choose Canvas Art for Your Home?"],
    "vanity-mirror-trends-analyzing-modern-designs-and-features": ["Popular Vanity Mirror Styles in 202 5"],
    "framing-the-future-a-comprehensive-guide-to-a-paper-sizes": ["What to Consider When Buying an A-Size Frame", "Find Any Size Frame Online, Including All A-Paper Sizes"],
    "how-does-a-magnetic-memo-board-enhance-your-workspace-efficiency": ["How to Maximize the Benefits of a magnetic memo board ?"],
    "how-mirror-thickness-impacts-bedroom-visual-appeal": [
      "The Role of mirror s in Enhancing Bedroom Aesthetics",
      "How mirror Depth Influences Room Appearance",
      "Practical Benefits of Various mirror thickness es in Bedrooms",
    ],
    "exploring-the-appeal-of-plastic-picture-frames": [
      "Advantages of Using P lastic P icture F rames in Modern Interiors",
      "Living Room Enhancements with plastic picture frames",
      "Dining Room Accents with picture frames",
      "Integrating plastic picture frames with Existing Decor",
    ],
  };
  return supplements[slug] || [];
}

function containsRenderedLine(lines: string[], needle: string) {
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
  return normalize(lines.join(" ")).includes(normalize(needle));
}

function extractAfter(lines: string[], marker: string, count: number) {
  const index = lines.findIndex((line) => line.toLowerCase() === marker.toLowerCase() || line.toLowerCase().includes(marker.toLowerCase()));
  return index >= 0 ? lines.slice(index + 1, index + 1 + count) : [];
}

function extractBetween(lines: string[], startMarker: string, endMarker: string) {
  const start = lines.findIndex((line) => line.toLowerCase() === startMarker.toLowerCase());
  if (start < 0) return [];
  const end = lines.findIndex((line, index) => index > start && line.toLowerCase() === endMarker.toLowerCase());
  return lines.slice(start + 1, end > start ? end : undefined);
}

function blogDateFor(lines: string[], title: string) {
  const index = lines.findIndex((line) => line === title);
  if (index < 0) return "";
  return lines.slice(index + 1, index + 4).find((line) => /^[A-Z][a-z]{2} \d{2}, \d{4}$/.test(line)) || "";
}

function categoryStory(title: string, lines: string[]) {
  const lowered = title.toLowerCase();
  return (
    lines.find((line) => line.toLowerCase().includes(lowered.split(" ")[0]) && line.length > 80) ||
    "Discover category-specific products, materials and manufacturing support from INTCO Framing."
  );
}

function whatWeDoImage(category: ProductCategory) {
  return WHAT_WE_DO_IMAGES[category.title.toLowerCase()] || category.imageUrl || category.navImageUrl || "";
}

function preferredImage(item: ImageLike) {
  const gallery = (item.galleryUrls || []).filter(Boolean);
  if (item.imageUrl && !looksGenericImage(item.imageUrl)) return item.imageUrl;
  return gallery.find((image) => !looksGenericImage(image)) || item.imageUrl || item.navImageUrl || "";
}

function itemGallery(item: ImageLike) {
  const urls = [preferredImage(item), ...(item.galleryUrls || []), item.imageUrl || item.navImageUrl || ""].filter(Boolean);
  return Array.from(new Set(urls));
}

function looksGenericImage(url?: string) {
  return !url || /\/products\.png($|\?)/.test(url);
}

function parseProductDetails(product: Product) {
  const lines = contentLines(product.bodyText, 140);
  const displayTitle = lines[0] || product.title;
  const itemNumber = valueAfterLabel(lines, ["Item#:", "Item #:", "Item#:"]);
  const color = valueAfterLabel(lines, ["Color:"]);
  const sizes = valuesAfterLabel(lines, ["Size:"]);
  const subject = valueAfterLabel(lines, ["Subject:"]);
  const material = valueAfterLabel(lines, ["Material:"]);
  const highlightStart = lines.findIndex((line) => /^Highlights$/i.test(line));
  const relatedStart = lines.findIndex((line) => /^Related Products$/i.test(line));
  const serviceStart = lines.findIndex((line) => /^SERVICES WE PROVIDE$/i.test(line));
  const end = [relatedStart, serviceStart].filter((index) => index > highlightStart).sort((a, b) => a - b)[0] || lines.length;
  const detailLines = highlightStart >= 0 ? lines.slice(highlightStart + 1, end) : linesFromBody(product.bodyText, 8);
  const descriptionLines = detailLines.slice(0, 1);
  const highlightLines = detailLines.slice(1).filter((line) => !/^Description$/i.test(line));
  const specs = [
    { label: "Item#:", value: itemNumber },
    ...(subject ? [{ label: "Subject:", value: subject }] : []),
    ...(material ? [{ label: "Material:", value: material }] : []),
    { label: "Color:", value: color },
    { label: "Size:", value: sizes.join(" / ") },
    { label: "Quantity:", value: "- / +" },
  ];
  const firstSpecIndex = lines.findIndex((line) => /^Item\s?#:\s*$/i.test(line));
  const bestSellerLines = firstSpecIndex > 1 ? lines.slice(1, firstSpecIndex) : [];
  const bestSellerPairs: Array<{ title: string; itemNumber: string }> = [];
  for (let index = 1; index < bestSellerLines.length; index += 1) {
    const item = bestSellerLines[index];
    if (/^Item\s?#:/i.test(item || "")) {
      const title = bestSellerLines[index - 1];
      if (title) bestSellerPairs.push({ title, itemNumber: item });
    }
  }

  return { specs, descriptionLines, highlightLines, bestSellerPairs, displayTitle };
}

function valueAfterLabel(lines: string[], labels: string[]) {
  return valuesAfterLabel(lines, labels)[0] || "";
}

function valuesAfterLabel(lines: string[], labels: string[]) {
  const normalizedLabels = labels.map((label) => label.replace(/\s+/g, "").toLowerCase());
  const aboutIndex = lines.findIndex((line) => /^ABOUT THIS ITEM$/i.test(line));
  const searchable = aboutIndex > 0 ? lines.slice(0, aboutIndex) : lines;
  const matches = searchable
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => normalizedLabels.some((label) => line.replace(/\s+/g, "").toLowerCase().startsWith(label)));
  const index = matches.at(-1)?.index ?? -1;
  if (index < 0) return [];
  const inline = lines[index].split(/[:：]/).slice(1).join(":").trim();
  if (inline) return [inline];
  const values: string[] = [];
  for (const next of lines.slice(index + 1)) {
    if (/^(Item|Color|Size|Subject|Quantity|ABOUT THIS ITEM|Description|Highlights|Related Products)/i.test(next)) break;
    values.push(next);
  }
  return values;
}

function sectionize(lines: string[]) {
  const sections: Array<{ title: string; body: string[] }> = [];
  let current: { title: string; body: string[] } | null = null;

  lines.forEach((line) => {
    if (looksLikeHeading(line)) {
      current = { title: line, body: [] };
      sections.push(current);
      return;
    }
    if (!current) {
      current = { title: "Overview", body: [] };
      sections.push(current);
    }
    current.body.push(line);
  });

  return sections.filter((section) => section.body.length || section.title !== "Overview");
}

function looksLikeHeading(line: string) {
  const known = new Set([
    "ABOUT US",
    "OUR HISTORY",
    "GLOBAL MARKET",
    "Mission",
    "Vision",
    "Spirit",
    "Values",
    "Objective",
    "lmprovement & Innovation",
    "Market Survey",
    "TREND INSIGHTS",
    "INDUSTRY REPORT",
    "PRODUCT DESIGN",
    "PACKAGING DESIGN",
    "COST ENGINEERING",
    "DISPLAY DESIGN",
    "PRODUCT RESEARCH",
    "CUSTOMIZABLE SOLUTIONS",
    "PRODUCTION CAPACITY",
    "DIGITAL MANAGEMENT SYSTEM",
    "AUTOMATION",
    "FLEXIBLE MANUFACTURING",
    "SUSTAINABILITY IN ACTION",
    "Innovating Circular Economy Models",
    "Comprehensive Environmental Initiatives",
    "Nurturing A Diverse And Inclusive Work Environment",
  ]);
  if (known.has(line)) return true;
  if (line.length > 52 || /[.!?]$/.test(line)) return false;
  return /^[A-Z0-9& /-]+$/.test(line) && /[A-Z]/.test(line);
}

function parseTimeline(lines: string[]) {
  const start = lines.findIndex((line) => line === "OUR HISTORY");
  const end = lines.findIndex((line) => line === "GLOBAL MARKET");
  const timelineLines = lines.slice(start > -1 ? start + 1 : 0, end > start ? end : undefined);
  const entries: Array<{ year: string; body: string[] }> = [];
  let current: { year: string; body: string[] } | null = null;

  timelineLines.forEach((line) => {
    if (/^20\d{2}$/.test(line)) {
      current = { year: line, body: [] };
      entries.push(current);
      return;
    }
    current?.body.push(line);
  });

  return entries.filter((entry) => entry.body.length).slice(0, 12);
}

function parseFactories(lines: string[]) {
  const factories: Array<{ title: string; address: string; zip: string }> = [];
  lines.forEach((line, index) => {
    if (!/Factory$/i.test(line)) return;
    factories.push({
      title: line,
      address: lines[index + 1] || "",
      zip: lines[index + 2] || "",
    });
  });

  if (!factories.length) {
    const start = lines.length >= 9 ? 2 : -1;
    if (start >= 0) {
      for (let index = start; index + 2 < lines.length && factories.length < 3; index += 3) {
        factories.push({
          title: lines[index],
          address: lines[index + 1],
          zip: lines[index + 2],
        });
      }
    }
  }

  return factories.length
    ? factories
    : [
        { title: "Zibo Factory", address: "Qingtian Road, Qilu Chemical Industrial Park, Zibo, Shandong, China", zip: "Zip Code: 255414" },
        { title: "Shanghai Factory", address: "No. 1299 Hubin Road, Fengxian District. Shanghai 201417, China", zip: "Zip Code: 201417" },
        { title: "Vietnam Factory", address: "Lot CN - 01/02 And CN - 01/03, South Of Zone A Bim Son Industrial Park, Thanh Hoa, Vietnam", zip: "Zip Code: 444964" },
      ];
}
