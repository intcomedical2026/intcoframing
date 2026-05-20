import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Search } from "lucide-react";
import { CookieBanner } from "@/components/cookie-banner";
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
      <Header settings={settings} categories={categories} locale={locale} currentPath={currentPath} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} locale={locale} />
      <CookieBanner locale={locale} />
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
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="bg-neutral-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <Phone size={14} />
              {settings.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail size={14} />
              {settings.email}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={href("/enquiry-list")} className="font-medium text-emerald-200 transition hover:text-white">
              {t(locale, "myCart")}
            </Link>
            <Link href={href("/contact")} className="font-medium text-emerald-200 transition hover:text-white">
              {t(locale, "perfectSolution")}
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href={href("/")} className="flex items-center gap-3" aria-label="INTCO Framing home">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.title}
              width={132}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          ) : (
            <span className="text-xl font-bold tracking-wide">{settings.title}</span>
          )}
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide text-neutral-700 lg:flex">
          {(settings.navigation || []).map((item) => (
            <div key={item.path} className="group relative py-7">
              <Link href={href(item.path)} className="transition hover:text-emerald-700">
                {item.label}
              </Link>
              {item.path === "/products" ? (
                <div className="pointer-events-none absolute left-1/2 top-full w-[760px] -translate-x-1/2 translate-y-2 opacity-0 shadow-2xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-5 gap-0 bg-white p-3">
                    {parents.map((category) => (
                      <Link
                        key={category.slug}
                        href={href(category.path)}
                        className="group/card border-r border-neutral-100 p-3 last:border-r-0"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                          {category.navImageUrl || category.imageUrl ? (
                            <Image
                              src={category.navImageUrl || category.imageUrl || ""}
                              alt={category.title}
                              fill
                              className="object-cover transition duration-500 group-hover/card:scale-105"
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
        <form action={href("/index.php")} className="hidden w-44 items-center border border-neutral-200 px-3 py-2 xl:flex">
          <Search size={16} className="text-neutral-500" />
          <input
            name="keyword"
            aria-label={t(locale, "search")}
            placeholder={t(locale, "search")}
            className="ml-2 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </form>
        <details className="relative hidden lg:block">
          <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-wide text-neutral-700">
            {localeLabels[locale]}
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
        <div className="flex items-center gap-2 lg:hidden">
          <details className="relative">
            <summary className="cursor-pointer list-none rounded border border-neutral-300 px-3 py-2 text-sm font-semibold">
              {localeLabels[locale]}
            </summary>
            <div className="absolute right-0 top-12 z-50 w-44 bg-white p-2 shadow-xl ring-1 ring-black/10">
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
          <Link href={href("/products")} className="rounded border border-neutral-300 px-3 py-2 text-sm font-semibold">
            Products
          </Link>
          <Link href={href("/contact")} className="rounded bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">
            {t(locale, "contactUs")}
          </Link>
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
