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
        <div className="mx-auto flex h-full max-w-[1160px] items-center justify-between px-0 text-base font-medium">
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
            <div className="absolute right-0 top-0 h-[53px] w-[95px] opacity-60">
              <div className="mt-2 h-9 rounded-full border border-white/30 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-[57px] max-w-[1160px] items-center justify-between gap-6 px-5 lg:h-[90px] lg:px-0">
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
          {(settings.navigation || []).map((item) => (
            <div key={item.path} className="group relative py-7">
              <Link
                href={href(item.path)}
                className={`relative mx-5 block whitespace-nowrap leading-[45px] transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:bg-[#484653] after:transition-transform after:duration-200 hover:text-[#484653] ${currentPath === item.path ? "after:scale-x-100" : "after:scale-x-0 group-hover:after:scale-x-100"}`}
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
          ))}
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
        <details className="relative hidden lg:block">
          <summary className="ml-5 flex size-8 cursor-pointer list-none items-center justify-center border border-[#484653] text-xs font-semibold uppercase text-[#484653]" aria-label="Change language">
            {locale === "en" ? "EN" : locale.toUpperCase()}
          </summary>
          <div className="absolute right-0 top-8 w-44 bg-white p-2 shadow-xl ring-1 ring-black/10">
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

  return (
    <footer className="bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.26em] text-emerald-300">{t(locale, "perfectSolution")}</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
              {t(locale, "contactToday")}
            </h2>
          </div>
          <div className="flex items-center lg:justify-end">
            <Link
              href={href("/contact")}
              className="inline-flex items-center justify-center rounded bg-emerald-600 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-emerald-500"
            >
              {t(locale, "contactUs")}
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          {settings.footerLogoUrl ? (
            <Image src={settings.footerLogoUrl} alt={settings.title} width={138} height={48} className="h-12 w-auto" />
          ) : (
            <h3 className="text-xl font-bold">{settings.title}</h3>
          )}
          <div className="mt-6 space-y-3 text-sm text-neutral-300">
            <p className="flex gap-3">
              <Phone size={16} className="mt-0.5 text-emerald-300" />
              <span>
                {settings.phone}
                <br />
                {settings.secondaryPhone}
              </span>
            </p>
            <p className="flex gap-3">
              <Mail size={16} className="mt-0.5 text-emerald-300" />
              <span>{settings.email}</span>
            </p>
            <p className="flex gap-3">
              <MapPin size={16} className="mt-0.5 text-emerald-300" />
              <span>{settings.address}</span>
            </p>
          </div>
        </div>
        <FooterColumn title={t(locale, "product")} links={parents.map((item) => ({ label: item.title, path: href(item.path) }))} />
        {(settings.footerColumns || []).slice(1).map((column) => (
          <FooterColumn
            key={column.title}
            title={column.title}
            links={(column.links || []).map((link) => ({ ...link, path: href(link.path) }))}
          />
        ))}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">{t(locale, "newsletter")}</h3>
          <p className="mt-4 text-sm leading-6 text-neutral-300">
            {t(locale, "newsletterText")}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-neutral-400">
        Copyright @ 2023 INTCO, All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; path: string }> }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-neutral-300">
        {links.map((link) => (
          <li key={`${title}-${link.path}`}>
            <Link href={link.path} className="transition hover:text-emerald-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
