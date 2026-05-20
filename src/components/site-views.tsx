import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Factory, Layers, Leaf, Search, Truck } from "lucide-react";
import {
  BlogPost,
  ContentPage,
  formatDate,
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
          <SectionTitle eyebrow={t(locale, "latestProducts")} title="Recently captured from the original catalog" />
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

export function ProductListingView({
  title,
  description,
  products,
  categories,
  heroImage,
  locale,
}: {
  title: string;
  description?: string;
  products: Product[];
  categories?: ProductCategory[];
  heroImage?: string;
  locale: Locale;
}) {
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
      <section className="bg-neutral-100 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {products.map((product, index) => (
            <div key={product.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function SolutionsListingView({ solutions, locale }: { solutions: Solution[]; locale: Locale }) {
  return (
    <>
      <PageHero
        title="Solutions"
        description="Turnkey support across trend research, design engineering, manufacturing delivery, global supply, certification and retailer support."
      />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {solutions.map((solution, index) => (
            <div key={solution.slug} data-reveal style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
              <FeatureCard item={solution} iconIndex={index} href={localizePath(locale, solution.path)} locale={locale} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function ProjectsListingView({ projects, category, locale }: { projects: Project[]; category?: string; locale: Locale }) {
  const filtered = category ? projects.filter((project) => (project.categoryKey || project.category) === category) : projects;

  return (
    <>
      <PageHero
        title={category || "Projects"}
        description="Artistry meets functionality. INTCO products integrate into residential and commercial scenarios."
      />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {filtered.map((project, index) => (
            <div key={project.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
              <ImageCard href={localizePath(locale, project.path)} title={project.title} label={project.category} imageUrl={project.imageUrl} alt={project.imageAlt} locale={locale} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function BlogListingView({ posts, locale, activeCategory }: { posts: BlogPost[]; locale: Locale; activeCategory?: string }) {
  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean)));
  const filteredPosts = activeCategory ? posts.filter((post) => post.category === activeCategory) : posts;
  const visiblePosts = filteredPosts.length ? filteredPosts : posts;
  return (
    <>
      <PageHero
        title="Blog"
        description="Home decor, interior design, product material, exhibition and industry trend articles from INTCO Framing."
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
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {visiblePosts.map((post, index) => (
            <div key={post.slug} data-reveal style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
              <BlogCard post={post} locale={locale} />
            </div>
          ))}
        </div>
      </section>
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
  return <DetailView item={page} label="INTCO" locale={locale} />;
}

export function ContactView({ page, locale }: { page: ContentPage; locale: Locale }) {
  const contacts = [
    { title: "Call Now", value: "+86 13371591392", href: "tel:+8613371591392" },
    { title: "Live Chat", value: "+86 17753315610", href: "tel:+8617753315610" },
    { title: "Email Us", value: "info@intcoframing-us.com", href: "mailto:info@intcoframing-us.com" },
    { title: "Order A SAMPLE", value: t(locale, "quote"), href: localizePath(locale, "/enquiry-list") },
  ];
  return (
    <>
      <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label="INTCO" />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {contacts.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="block bg-neutral-50 p-6 ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:bg-neutral-950 hover:text-white"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
            >
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">{item.title}</div>
              <div className="mt-4 text-xl font-semibold">{item.value}</div>
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
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder="Name" />
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder="Email" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder="Phone" />
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder="Company" />
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
  return (
    <Link href={localizePath(locale, product.path)} className="group block h-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.imageAlt || product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(min-width: 1024px) 25vw, 50vw" />
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
