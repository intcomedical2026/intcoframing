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

export function HomeView({ data }: { data: SiteData }) {
  const { homePage, productCategories, products, solutions, projects, blogPosts } = data;
  const hero = homePage.heroSlides?.[0];
  const parentCategories = productCategories.filter((category) => !category.parentSlug).slice(0, 5);
  const latestPosts = blogPosts.slice(0, 6);

  return (
    <>
      <section className="relative min-h-[620px] overflow-hidden bg-neutral-950 text-white">
        {hero?.imageUrl ? (
          <Image src={hero.imageUrl} alt={hero.title} fill priority className="object-cover opacity-70" sizes="100vw" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.3),rgba(0,0,0,.08))]" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-emerald-300">Premier Interior Decoration Manufacturer</p>
            <h1 className="mt-5 text-5xl font-bold leading-none sm:text-7xl lg:text-8xl">{hero?.title || homePage.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">{hero?.subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              {hero?.primaryCta ? <PrimaryLink href={hero.primaryCta.path}>{hero.primaryCta.label}</PrimaryLink> : null}
              {hero?.secondaryCta ? <SecondaryLink href={hero.secondaryCta.path}>{hero.secondaryCta.label}</SecondaryLink> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <SectionTitle eyebrow="Featured Products" title="Category depth for retail programs" />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
          {parentCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
          <div className="relative min-h-[420px] overflow-hidden bg-neutral-300">
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
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-emerald-700">Company Profile</p>
            <h2 className="mt-4 text-3xl font-semibold text-neutral-950 sm:text-5xl">{homePage.companyProfile?.title}</h2>
            <p className="mt-5 text-lg leading-8 text-neutral-700">{homePage.companyProfile?.description}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {(homePage.companyProfile?.points || []).map((point, index) => (
                <li key={point} className="flex items-center gap-3 bg-white p-4 text-sm font-semibold text-neutral-800">
                  <span className="flex size-8 shrink-0 items-center justify-center bg-emerald-700 text-white">{index + 1}</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {(homePage.stats || []).map((stat) => (
            <div key={stat.label} className="bg-white p-6">
              <div className="text-4xl font-bold text-emerald-700">{stat.value}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <SectionTitle
          eyebrow="Solutions"
          title="Turnkey service from insight to delivery"
          description="We are committed to offering you retail solutions custom tailored to fulfill all your needs."
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {solutions.map((solution, index) => (
            <FeatureCard key={solution.slug} item={solution} iconIndex={index} href={solution.path} />
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 py-16 text-white">
        <SectionTitle
          eyebrow={homePage.projectsIntro?.title || "Projects"}
          title={homePage.projectsIntro?.cta || "Customized solution for every industry needs"}
          description={homePage.projectsIntro?.description}
          dark
        />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {projects.slice(0, 4).map((project) => (
            <ImageCard key={project.slug} href={project.path} title={project.title} label={project.category} imageUrl={project.imageUrl} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <SectionTitle eyebrow="Blog" title="Interior decor expertise" description={homePage.blogIntro?.description} />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <SectionTitle eyebrow="Latest Products" title="Recently captured from the original catalog" />
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.slug} product={product} />
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
}: {
  title: string;
  description?: string;
  products: Product[];
  categories?: ProductCategory[];
  heroImage?: string;
}) {
  return (
    <>
      <PageHero title={title} description={description} imageUrl={heroImage} />
      {categories?.length ? (
        <section className="bg-white py-12">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>
      ) : null}
      <section className="bg-neutral-100 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

export function SolutionsListingView({ solutions }: { solutions: Solution[] }) {
  return (
    <>
      <PageHero
        title="Solutions"
        description="Turnkey support across trend research, design engineering, manufacturing delivery, global supply, certification and retailer support."
      />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {solutions.map((solution, index) => (
            <FeatureCard key={solution.slug} item={solution} iconIndex={index} href={solution.path} />
          ))}
        </div>
      </section>
    </>
  );
}

export function ProjectsListingView({ projects, category }: { projects: Project[]; category?: string }) {
  const filtered = category ? projects.filter((project) => project.category === category) : projects;

  return (
    <>
      <PageHero
        title={category || "Projects"}
        description="Artistry meets functionality. INTCO products integrate into residential and commercial scenarios."
      />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {filtered.map((project) => (
            <ImageCard key={project.slug} href={project.path} title={project.title} label={project.category} imageUrl={project.imageUrl} />
          ))}
        </div>
      </section>
    </>
  );
}

export function BlogListingView({ posts }: { posts: BlogPost[] }) {
  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean)));
  return (
    <>
      <PageHero
        title="Blog"
        description="Home decor, interior design, product material, exhibition and industry trend articles from INTCO Framing."
      />
      <section className="bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
          {["All", ...categories].map((category) => (
            <span key={category} className="border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700">
              {category}
            </span>
          ))}
        </div>
      </section>
      <section className="bg-neutral-100 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}

export function DetailView({ item, label }: { item: Product | Solution | Project | BlogPost | ContentPage; label: string }) {
  const body = "bodyText" in item ? item.bodyText : "";
  const lines = linesFromBody(body, 22);
  const gallery = item.galleryUrls?.filter(Boolean).slice(0, 6) || [];

  return (
    <>
      <PageHero title={item.title} description={"description" in item ? item.description : "excerpt" in item ? item.excerpt : ""} imageUrl={item.imageUrl} label={label} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div>
            {item.imageUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(min-width: 1024px) 52vw, 100vw" />
              </div>
            ) : null}
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {gallery.slice(1).map((image) => (
                  <div key={image} className="relative aspect-square overflow-hidden bg-neutral-100">
                    <Image src={image} alt={item.title} fill className="object-cover" sizes="180px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <article>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-emerald-700">{label}</p>
            <h2 className="mt-3 text-3xl font-semibold text-neutral-950 sm:text-4xl">{item.title}</h2>
            {"publishedAt" in item && item.publishedAt ? (
              <p className="mt-3 text-sm font-semibold text-neutral-500">{formatDate(item.publishedAt)}</p>
            ) : null}
            <div className="mt-7 space-y-4 text-base leading-8 text-neutral-700">
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

export function ContentPageView({ page }: { page: ContentPage }) {
  return <DetailView item={page} label="INTCO" />;
}

function PageHero({ title, description, imageUrl, label }: { title: string; description?: string; imageUrl?: string; label?: string }) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {imageUrl ? <Image src={imageUrl} alt={title} fill className="object-cover opacity-55" sizes="100vw" priority /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.38))]" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">{label || "INTCO Framing"}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-6xl">{title}</h1>
        {description ? <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">{description}</p> : null}
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
      <h2 className={`mt-3 text-3xl font-semibold sm:text-5xl ${dark ? "text-white" : "text-neutral-950"}`}>{title}</h2>
      {description ? <p className={`mx-auto mt-4 max-w-3xl text-lg leading-8 ${dark ? "text-white/70" : "text-neutral-600"}`}>{description}</p> : null}
    </div>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded bg-emerald-600 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-emerald-500">
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded border border-white/55 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-neutral-950">
      {children}
    </Link>
  );
}

function CategoryCard({ category }: { category: ProductCategory }) {
  return (
    <Link href={category.path} className="group block overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[5/4] bg-neutral-100">
        {category.imageUrl || category.navImageUrl ? (
          <Image
            src={category.imageUrl || category.navImageUrl || ""}
            alt={category.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 20vw, 50vw"
          />
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-neutral-950">{category.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">{category.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
          Explore More <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.path} className="group block bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm font-semibold text-neutral-400">{product.title}</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-neutral-950">{product.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">{product.description}</p>
      </div>
    </Link>
  );
}

function FeatureCard({ item, iconIndex, href }: { item: Solution; iconIndex: number; href: string }) {
  const icons = [Search, Layers, Factory, Truck, Leaf, ArrowRight];
  const Icon = icons[iconIndex % icons.length];
  return (
    <Link href={href} className="group block bg-neutral-50 p-7 ring-1 ring-black/5 transition hover:bg-neutral-950 hover:text-white">
      <div className="flex size-12 items-center justify-center bg-emerald-700 text-white">
        <Icon size={24} />
      </div>
      <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-neutral-600 transition group-hover:text-white/70">{item.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700 transition group-hover:text-emerald-300">
        Explore More <ArrowRight size={16} />
      </span>
    </Link>
  );
}

function ImageCard({ href, title, label, imageUrl }: { href: string; title: string; label?: string; imageUrl?: string }) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-neutral-800">
      {imageUrl ? <Image src={imageUrl} alt={title} fill className="object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90" sizes="(min-width: 1024px) 25vw, 50vw" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {label ? <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{label}</p> : null}
        <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
      </div>
    </Link>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={post.path} className="group block bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 50vw" />
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wide text-emerald-700">
          <span>{post.category || "Inspiration"}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-7 text-neutral-950">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">{post.excerpt}</p>
      </div>
    </Link>
  );
}
