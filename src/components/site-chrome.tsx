import Image from "next/image";
import Link from "next/link";
import { Languages, Mail, MapPin, Menu, Phone, Search } from "lucide-react";
import { CookieBanner } from "@/components/cookie-banner";
import { FloatingActions } from "@/components/floating-actions";
import { LeadsCloudChatRuntime, LeadsCloudFormsRuntime } from "@/components/leadscloud-runtime";
import { RevealRuntime } from "@/components/reveal-runtime";
import { Locale, localeLabels, locales, localizePath, t } from "@/lib/i18n";
import { LEADSCLOUD_FORM_IDS, leadsCloudBuryClass } from "@/lib/leadscloud";
import type { ProductCategory, SiteSettings, Solution } from "@/lib/site-data";

type ChromeProps = {
  settings: SiteSettings;
  categories: ProductCategory[];
  solutions: Solution[];
  locale: Locale;
  currentPath: string;
  children: React.ReactNode;
};

const HEADER_LANGUAGE_MAP_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/lg-bg-h.png";
const SOURCE_FOOTER_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/footer.png";

const footerSocialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/IntcoFraming.cn/", iconClass: "intco-social-facebook" },
  { label: "YouTube", href: "https://www.youtube.com/@intcoframing", iconClass: "intco-social-youtube" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/intcoframing/", iconClass: "intco-social-linkedin" },
  { label: "Twitter", href: "https://twitter.com/intco_framing", iconClass: "intco-social-twitter" },
  { label: "Instagram", href: "https://www.instagram.com/intcoframing/", iconClass: "intco-social-instagram" },
  { label: "Pinterest", href: "https://www.pinterest.com/intco_framing/", iconClass: "intco-social-pinterest" },
];

const PROJECT_NAV_ITEMS = [
  {
    label: "Residential",
    path: "/projects/residential",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/xia1.jpg",
  },
  {
    label: "Commercial",
    path: "/projects/commercial",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/xia2.jpg",
  },
];

function aboutNav(locale: Locale) {
  return [
    { label: t(locale, "whoWeAre"), path: "/who-we-are" },
    { label: t(locale, "sustainability"), path: "/who-we-are/sustainability" },
    { label: t(locale, "philosophy"), path: "/who-we-are/philosophy" },
  ];
}

function projectNav(locale: Locale) {
  return PROJECT_NAV_ITEMS.map((item) => ({
    ...item,
    label: item.path.includes("residential") ? t(locale, "residential") : t(locale, "commercial"),
  }));
}

function chromeLabel(locale: Locale, path: string, fallback: string) {
  const labels: Record<string, string> = {
    "/": t(locale, "home"),
    "/products": t(locale, "products"),
    "/projects": t(locale, "projects"),
    "/solutions": t(locale, "solutions"),
    "/who-we-are": t(locale, "aboutIntco"),
    "/blog": t(locale, "blog"),
    "/contact": t(locale, "contact"),
  };
  return labels[path] || fallback;
}

export function SiteChrome({ settings, categories, solutions, locale, currentPath, children }: ChromeProps) {
  return (
    <div lang={locale}>
      <RevealRuntime />
      <Header settings={settings} categories={categories} solutions={solutions} locale={locale} currentPath={currentPath} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} locale={locale} />
      {currentPath === "/" ? null : <FloatingActions settings={settings} locale={locale} />}
      <CookieBanner locale={locale} currentPath={currentPath} />
      <LeadsCloudChatRuntime />
      <LeadsCloudFormsRuntime />
    </div>
  );
}

function Header({
  settings,
  categories,
  solutions,
  locale,
  currentPath,
}: {
  settings: SiteSettings;
  categories: ProductCategory[];
  solutions: Solution[];
  locale: Locale;
  currentPath: string;
}) {
  const parents = categories.filter((category) => !category.parentSlug).slice(0, 5);
  const solutionNav = solutions.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 6);
  const href = (path: string) => localizePath(locale, path);
  const localizedAboutNav = aboutNav(locale);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="hidden h-[53px] bg-[#484652] text-white lg:block">
        <div className="intco-source-container flex h-full items-center justify-between px-5 text-base font-medium">
          <div className="flex items-center">
            <span className="inline-flex items-center gap-2">
              <Phone size={20} />
              {settings.phone}
            </span>
            <span className="mx-9 h-6 w-px bg-white" />
            <span className="inline-flex items-center gap-2">
              <Mail size={20} />
              {settings.email}
            </span>
          </div>
          <div className="relative flex items-center pr-[125px]">
            <div className="flex items-center gap-1">
              {footerSocialLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex size-[30px] items-center justify-center rounded-full bg-[#959595] text-[#484652] transition hover:bg-white"
                >
                  <SocialGlyph iconClass={item.iconClass} />
                </Link>
              ))}
            </div>
            <Link href={href("/enquiry-list")} className="ml-4 flex h-[34px] w-[171px] items-center justify-center rounded-full border-2 border-white text-lg font-semibold text-white">
              {t(locale, "myCart")}
            </Link>
            <LanguageSwitcher locale={locale} currentPath={currentPath} />
            <span
              className="absolute right-0 top-0 block h-[53px] w-[95px] bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${HEADER_LANGUAGE_MAP_IMAGE})` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="intco-source-container flex h-[57px] items-center justify-between gap-6 px-5 lg:h-[90px]">
        <Link href={href("/")} className="flex items-center gap-3" aria-label="INTCO Framing home">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.title}
              width={101}
              height={87}
              className="h-10 w-auto object-contain lg:h-[87px]"
              preload
            />
          ) : (
            <span className="text-xl font-bold tracking-wide">{settings.title}</span>
          )}
        </Link>
        <nav className="hidden flex-1 items-center justify-between px-[5%] text-xl font-semibold text-[#484653] lg:flex">
          {(settings.navigation || []).map((item) => {
            const isProducts = item.path === "/products";
            const isProjects = item.path === "/projects";
            const isSolutions = item.path === "/solutions";
            const isAbout = item.path === "/who-we-are";
            const isProductCategory = isProducts && parents.some((category) => currentPath === category.path || currentPath.startsWith(`${category.path}/`));
            const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(`${item.path}/`)) || isProductCategory;
            return (
              <div key={item.path} className="group relative flex h-[90px] items-center">
                <Link
                  href={href(item.path)}
                  className={`relative mx-5 block whitespace-nowrap leading-[45px] transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:bg-[#484653] after:transition-transform after:duration-500 hover:text-[#484653] ${isActive ? "after:scale-x-100" : "after:scale-x-0 group-hover:after:scale-x-100"}`}
                >
                  {chromeLabel(locale, item.path, item.label)}
                </Link>
                {isProducts ? <HeaderMegaDropdown items={parents.map((category) => ({ label: category.title, path: category.path, imageUrl: category.navImageUrl || category.imageUrl || "" }))} locale={locale} name="products" /> : null}
                {isProjects ? <HeaderMegaDropdown items={projectNav(locale)} locale={locale} name="projects" /> : null}
                {isSolutions ? <HeaderSecondNav items={solutionNav.map((solution) => ({ label: solution.title, path: solution.path }))} locale={locale} name="solutions" /> : null}
                {isAbout ? <HeaderSecondNav items={localizedAboutNav} locale={locale} name="about" /> : null}
              </div>
            );
          })}
        </nav>
        <form action={href("/index.php")} className="hidden items-center xl:flex">
          <button type="submit" aria-label={t(locale, "search")} className="text-[#484653]">
            <Search size={24} />
          </button>
          <input
            name="keyword"
            aria-label={t(locale, "search")}
            className="sr-only"
          />
        </form>
        <div className="flex items-center gap-5 text-[#484653] lg:hidden">
          <Link href={href("/index.php")} aria-label={t(locale, "search")}>
            <Search size={28} strokeWidth={2.8} />
          </Link>
          <LanguageSwitcher locale={locale} currentPath={currentPath} compact />
          <details className="relative">
            <summary className="cursor-pointer list-none" aria-label="Open menu">
              <Menu size={32} strokeWidth={2.8} />
            </summary>
            <div className="absolute right-0 top-10 z-50 w-64 bg-white p-3 shadow-xl ring-1 ring-black/10">
              {(settings.navigation || []).map((item) => (
                <div key={item.path} className="border-b border-neutral-100">
                  <Link href={href(item.path)} className="block px-3 py-3 text-sm font-semibold text-[#484653]">
                    {chromeLabel(locale, item.path, item.label)}
                  </Link>
                  {item.path === "/who-we-are"
                    ? localizedAboutNav.slice(1).map((child) => (
                        <Link key={child.path} href={href(child.path)} className="block px-6 pb-3 text-xs font-semibold text-neutral-600">
                          {child.label}
                        </Link>
                      ))
                    : null}
                </div>
              ))}
              {locales.map((item) => (
                <Link key={item} href={localizePath(item, currentPath)} className="block px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100">
                  {localeLabels[item]}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function LanguageSwitcher({ locale, currentPath, compact = false }: { locale: Locale; currentPath: string; compact?: boolean }) {
  const currentCode = locale.toUpperCase();
  return (
    <details className={`group relative ${compact ? "" : "ml-3"}`}>
      <summary
        className={`inline-flex cursor-pointer list-none items-center justify-center gap-1.5 rounded-full font-semibold uppercase transition-colors duration-200 [&::-webkit-details-marker]:hidden ${
          compact
            ? "h-9 border border-[#484653]/25 px-3 text-sm text-[#484653] hover:bg-[#f3f3f3]"
            : "h-[34px] border border-white/80 px-3 text-sm text-white hover:bg-white hover:text-[#484653]"
        }`}
        aria-label={t(locale, "language")}
      >
        <Languages size={compact ? 17 : 16} strokeWidth={2.4} />
        <span>{currentCode}</span>
      </summary>
      <div
        className={`absolute right-0 z-50 w-44 bg-white p-2 text-left shadow-xl ring-1 ring-black/10 ${
          compact ? "top-11" : "top-11"
        }`}
      >
        {locales.map((item) => (
          <Link
            key={item}
            href={localizePath(item, currentPath)}
            aria-current={item === locale ? "page" : undefined}
            className="block rounded px-3 py-2 text-sm font-semibold normal-case text-neutral-700 hover:bg-neutral-100 aria-current:bg-neutral-100 aria-current:text-[#484653]"
          >
            {localeLabels[item]}
          </Link>
        ))}
      </div>
    </details>
  );
}

function HeaderMegaDropdown({
  items,
  locale,
  name,
}: {
  items: Array<{ label: string; path: string; imageUrl?: string }>;
  locale: Locale;
  name: string;
}) {
  return (
    <div
      data-intco-dropdown={`mega-${name}`}
      className="pointer-events-none invisible fixed left-0 top-[142px] z-40 hidden w-screen bg-white/60 py-10 pb-[50px] opacity-0 transition-opacity duration-150 group-hover:visible group-hover:pointer-events-auto group-hover:block group-hover:opacity-100 lg:block"
    >
      <div className="intco-source-container">
        <ul className="flex">
          {items.map((item) => (
            <li
              key={item.path}
              className="group/nav-card ml-[22px] box-border rounded-[20px] border-[10px] border-white bg-white first:ml-0"
              style={{ width: "calc(20% - 17.6px)" }}
            >
              <Link href={localizePath(locale, item.path)} className="block">
                <div className="mb-2.5 text-[18px] font-semibold leading-[27px] text-[#484652]">{item.label}</div>
                <div className="relative overflow-hidden rounded-[10px] bg-neutral-100 pb-[84.6975%]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-[600ms] group-hover/nav-card:scale-110"
                      sizes="222px"
                    />
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HeaderSecondNav({
  items,
  locale,
  name,
}: {
  items: Array<{ label: string; path: string }>;
  locale: Locale;
  name: string;
}) {
  const widthClass = name === "solutions" ? "min-w-[286px]" : name === "about" ? "min-w-[151px]" : "";

  return (
    <div
      data-intco-dropdown={`second-${name}`}
      className="pointer-events-none absolute left-1/2 top-[68px] z-40 hidden -translate-x-1/2 pt-[19px] group-hover:pointer-events-auto group-hover:block"
    >
      <ul className={`bg-white/80 text-center ${widthClass}`}>
        {items.map((child) => {
          return (
            <li key={child.path}>
              <Link
                href={localizePath(locale, child.path)}
                className="block whitespace-nowrap px-5 py-[15px] text-base font-semibold leading-none text-[#484653] transition duration-[600ms] hover:bg-[#484652] hover:text-white"
              >
                {child.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SocialGlyph({ iconClass }: { iconClass: string }) {
  return <i className={`intco-social-iconfont ${iconClass}`} aria-hidden="true" />;
}

function Footer({ settings, categories, locale }: { settings: SiteSettings; categories: ProductCategory[]; locale: Locale }) {
  const parents = categories.filter((category) => !category.parentSlug).slice(0, 5);
  const href = (path: string) => localizePath(locale, path);
  const quickLinks = (settings.footerColumns || []).find((column) => column.title.toLowerCase().includes("quick"))?.links || [
    { label: t(locale, "projects"), path: "/projects" },
    { label: t(locale, "solutions"), path: "/solutions" },
    { label: t(locale, "aboutIntco"), path: "/who-we-are" },
    { label: t(locale, "blog"), path: "/blog" },
    { label: t(locale, "contact"), path: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#484653] text-white">
      <Image src={SOURCE_FOOTER_BG} alt="" fill className="object-cover object-bottom" sizes="100vw" />
      <div className="intco-source-container relative z-10 px-5">
        <div className="box-border flex min-h-[360px] flex-col justify-between pt-10 lg:min-h-[488px] min-[1601px]:min-h-[454px] min-[1601px]:pt-[74px]">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_1fr] lg:gap-5 xl:gap-[60px]">
            <div>
              <div className="w-[138px] max-w-[178px] pb-3 lg:w-[178px]">
                {settings.footerLogoUrl ? (
                  <Image src={settings.footerLogoUrl} alt={settings.title} width={178} height={104} className="h-auto w-full object-contain" />
                ) : (
                  <h3 className="text-2xl font-bold">{settings.title}</h3>
                )}
              </div>
              <ul className="text-base font-medium text-white min-[1601px]:text-xl">
                <FooterContactItem href={settings.phone ? `https://api.whatsapp.com/send?phone=${settings.phone.replace(/[^\d]/g, "")}&text=Hello` : href("/contact")}>
                  <Phone size={20} className="mr-2 mt-0.5 shrink-0" />
                  {settings.phone}
                </FooterContactItem>
                {settings.secondaryPhone ? (
                  <FooterContactItem href={`https://api.whatsapp.com/send?phone=${settings.secondaryPhone.replace(/[^\d]/g, "")}&text=Hello`}>
                    <span className="mr-2 inline-block w-5 shrink-0" />
                    {settings.secondaryPhone}
                  </FooterContactItem>
                ) : null}
                <FooterContactItem href={settings.email ? `mailto:${settings.email}` : href("/contact")}>
                  <Mail size={20} className="mr-2 mt-0.5 shrink-0" />
                  {settings.email}
                </FooterContactItem>
                <li className="mt-3 flex max-w-[388px] cursor-pointer text-left leading-6 min-[1601px]:mt-6">
                  <MapPin size={20} className="mr-2 mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </li>
              </ul>
            </div>

            <FooterColumn title={t(locale, "products")} links={parents.map((item) => ({ label: item.title, path: href(item.path) }))} />
            <FooterColumn title={t(locale, "quickLinks")} links={quickLinks.map((link) => ({ label: chromeLabel(locale, link.path, link.label), path: href(link.path) }))} />

            <div>
              <h3 className="pb-3 text-2xl font-semibold leading-tight text-white min-[1601px]:pb-12 min-[1601px]:text-[34px]">{t(locale, "newsletter")}</h3>
              <div className="h-search intco-leadscloud-newsletter" aria-label={t(locale, "newsletter")}>
                <div className={leadsCloudBuryClass(LEADSCLOUD_FORM_IDS.footerNewsletter)} />
              </div>
              <div className="mt-[25px] text-base font-semibold leading-3 text-white min-[1601px]:mt-[74px] min-[1601px]:text-xl">
                {t(locale, "followUs")}
                <div className="mt-[25px] flex flex-wrap gap-2.5">
                  {footerSocialLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex size-8 items-center justify-center rounded-full bg-[#959595] text-xs font-bold text-[#484653] transition hover:bg-white min-[1601px]:size-[50px] min-[1601px]:text-lg"
                    >
                      <SocialGlyph iconClass={item.iconClass} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-0 h-[50px] border-t border-white py-0 text-center text-base font-normal leading-[50px] text-white min-[1601px]:mt-[10vh] min-[1601px]:h-auto min-[1601px]:py-[4vh] min-[1601px]:text-xl min-[1601px]:leading-normal">
            Copyright @ 2023 INTCO , All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; path: string }> }) {
  return (
    <div>
      <h3 className="pb-3 text-2xl font-semibold leading-tight text-white min-[1601px]:pb-12 min-[1601px]:text-[34px]">{title}</h3>
      <ul className="text-base font-medium text-white min-[1601px]:text-xl">
        {links.map((link) => (
          <li key={`${title}-${link.path}`} className="mt-3 flex max-w-[388px] cursor-pointer leading-6 min-[1601px]:mt-6">
            <Link href={link.path} className="transition duration-500 hover:text-white/70">
              <span className="mr-2">→</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContactItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li className="mt-3 flex max-w-[388px] cursor-pointer leading-6 min-[1601px]:mt-6">
      <Link href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex transition duration-500 hover:text-white/70">
        {children}
      </Link>
    </li>
  );
}
