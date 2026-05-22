import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Menu, Phone, Search } from "lucide-react";
import { CookieBanner } from "@/components/cookie-banner";
import { FloatingActions } from "@/components/floating-actions";
import { RevealRuntime } from "@/components/reveal-runtime";
import { Locale, localeLabels, locales, localizePath, t } from "@/lib/i18n";
import type { ProductCategory, SiteSettings } from "@/lib/site-data";

type ChromeProps = {
  settings: SiteSettings;
  categories: ProductCategory[];
  locale: Locale;
  currentPath: string;
  children: React.ReactNode;
};

const HEADER_LANGUAGE_MAP_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/lg-bg-h.png";
const SOURCE_FOOTER_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/footer.png";

const footerSocialLinks = [
  { label: "f", href: "https://www.facebook.com/IntcoFraming.cn/" },
  { label: "y", href: "https://www.youtube.com/@intcoframing" },
  { label: "in", href: "https://www.linkedin.com/company/intcoframing/" },
  { label: "x", href: "https://twitter.com/intco_framing" },
  { label: "ig", href: "https://www.instagram.com/intcoframing/" },
  { label: "p", href: "https://www.pinterest.com/intco_framing/" },
];

export function SiteChrome({ settings, categories, locale, currentPath, children }: ChromeProps) {
  return (
    <div lang={locale}>
      <RevealRuntime />
      <Header settings={settings} categories={categories} locale={locale} currentPath={currentPath} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} locale={locale} />
      <FloatingActions settings={settings} locale={locale} />
      <CookieBanner locale={locale} currentPath={currentPath} />
    </div>
  );
}

function Header({
  settings,
  categories,
  locale,
  currentPath,
}: {
  settings: SiteSettings;
  categories: ProductCategory[];
  locale: Locale;
  currentPath: string;
}) {
  const parents = categories.filter((category) => !category.parentSlug).slice(0, 5);
  const href = (path: string) => localizePath(locale, path);

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
              {["f", "y", "in", "x", "ig", "p"].map((label) => (
                <span key={label} className="flex size-[30px] items-center justify-center rounded-full bg-[#959595] text-[10px] font-bold uppercase text-[#484652]">
                  {label}
                </span>
              ))}
            </div>
            <Link href={href("/enquiry-list")} className="ml-4 flex h-[34px] w-[171px] items-center justify-center rounded-full border-2 border-white text-lg font-semibold text-white">
              {t(locale, "myCart")}
            </Link>
            <details className="absolute right-0 top-0 h-[53px] w-[95px]">
              <summary
                className="block h-[53px] w-[95px] cursor-pointer list-none bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${HEADER_LANGUAGE_MAP_IMAGE})` }}
                aria-label="Change language"
              />
              <div className="absolute right-0 top-[53px] z-50 w-44 bg-white p-2 text-left shadow-xl ring-1 ring-black/10">
                {locales.map((item) => (
                  <Link
                    key={item}
                    href={localizePath(item, currentPath)}
                    className="block px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                  >
                    {localeLabels[item]}
                  </Link>
                ))}
              </div>
            </details>
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
              priority
            />
          ) : (
            <span className="text-xl font-bold tracking-wide">{settings.title}</span>
          )}
        </Link>
        <nav className="hidden flex-1 items-center justify-center text-xl font-semibold text-[#484653] lg:flex">
          {(settings.navigation || []).map((item) => {
            const isActive = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(`${item.path}/`));
            return (
              <div key={item.path} className="group relative py-7">
                <Link
                  href={href(item.path)}
                  className={`relative mx-5 block whitespace-nowrap leading-[45px] transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:bg-[#484653] after:transition-transform after:duration-200 hover:text-[#484653] ${isActive ? "after:scale-x-100" : "after:scale-x-0 group-hover:after:scale-x-100"}`}
                >
                  {item.label}
                </Link>
                {item.path === "/products" ? (
                  <div className="pointer-events-none absolute left-1/2 top-full w-[760px] origin-top -translate-x-1/2 translate-y-2 scale-y-95 opacity-0 shadow-2xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-y-100 group-hover:opacity-100">
                    <div className="grid grid-cols-5 gap-0 bg-white p-3">
                      {parents.map((category) => (
                        <Link
                          key={category.slug}
                          href={href(category.path)}
                          className="group/card border-r border-neutral-100 p-3 transition-transform duration-200 hover:-translate-y-0.5 last:border-r-0"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                            {category.navImageUrl || category.imageUrl ? (
                              <Image
                                src={category.navImageUrl || category.imageUrl || ""}
                                alt={category.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                sizes="160px"
                              />
                            ) : null}
                          </div>
                          <div className="mt-3 text-center text-xs font-bold text-neutral-900">{category.title}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
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
        <div className="flex items-center gap-8 text-[#484653] lg:hidden">
          <Link href={href("/index.php")} aria-label={t(locale, "search")}>
            <Search size={28} strokeWidth={2.8} />
          </Link>
          <details className="relative">
            <summary className="cursor-pointer list-none" aria-label="Open menu">
              <Menu size={32} strokeWidth={2.8} />
            </summary>
            <div className="absolute right-0 top-10 z-50 w-64 bg-white p-3 shadow-xl ring-1 ring-black/10">
              {(settings.navigation || []).map((item) => (
                <Link key={item.path} href={href(item.path)} className="block border-b border-neutral-100 px-3 py-3 text-sm font-semibold text-[#484653]">
                  {item.label}
                </Link>
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

function Footer({ settings, categories, locale }: { settings: SiteSettings; categories: ProductCategory[]; locale: Locale }) {
  const parents = categories.filter((category) => !category.parentSlug).slice(0, 5);
  const href = (path: string) => localizePath(locale, path);
  const quickLinks = (settings.footerColumns || []).find((column) => column.title.toLowerCase().includes("quick"))?.links || [
    { label: "Projects", path: "/projects" },
    { label: "Solutions", path: "/solutions" },
    { label: "About INTCO", path: "/who-we-are" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-[#484653] bg-cover bg-bottom bg-no-repeat text-white" style={{ backgroundImage: `url(${SOURCE_FOOTER_BG})` }}>
      <div className="intco-source-container px-5">
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

            <FooterColumn title={t(locale, "product")} links={parents.map((item) => ({ label: item.title, path: href(item.path) }))} />
            <FooterColumn title={t(locale, "quickLinks")} links={quickLinks.map((link) => ({ ...link, path: href(link.path) }))} />

            <div>
              <h3 className="pb-3 text-2xl font-semibold leading-tight text-white min-[1601px]:pb-12 min-[1601px]:text-[34px]">{t(locale, "newsletter")}</h3>
              <form action={href("/contact")} className="relative flex h-[50px] w-full max-w-[388px] overflow-hidden rounded-md bg-white min-[1601px]:h-[78px]">
                <input
                  type="email"
                  name="email"
                  aria-label="Email"
                  placeholder="Email"
                  className="h-full min-w-0 flex-1 border-0 bg-white px-5 text-base font-light text-[#727272] outline-0 min-[1601px]:px-8 min-[1601px]:text-2xl"
                />
                <button type="submit" className="h-full w-[50px] shrink-0 bg-[#484653] text-center text-sm font-semibold text-white transition hover:bg-[#3b3945] min-[1601px]:w-[82px] min-[1601px]:text-base">
                  提交
                </button>
              </form>
              <div className="mt-[25px] text-base font-semibold leading-3 text-white min-[1601px]:mt-[74px] min-[1601px]:text-xl">
                Follow Us
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
                      {item.label}
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
