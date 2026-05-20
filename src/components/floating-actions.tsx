"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronUp, Mail, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizePath, t } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/site-data";

export function FloatingActions({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const phone = (settings.phone || "").replace(/[^\d+]/g, "");
  const whatsapp = phone ? `https://api.whatsapp.com/send?phone=${phone.replace(/^\+/, "")}&text=Hello` : localizePath(locale, "/contact");

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setVisible(window.scrollY > 500);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="intco-floating-actions fixed right-4 bottom-8 z-40 hidden flex-col gap-2 md:flex"
      data-visible={visible}
      aria-label="Quick contact actions"
    >
      <FloatingLink href={whatsapp} label={settings.phone || t(locale, "contactUs")} external>
        <MessageCircle size={20} />
      </FloatingLink>
      <FloatingLink href={settings.email ? `mailto:${settings.email}` : localizePath(locale, "/contact")} label={settings.email || t(locale, "contactUs")}>
        <Mail size={20} />
      </FloatingLink>
      <FloatingLink href={phone ? `tel:${phone}` : localizePath(locale, "/contact")} label={settings.phone || t(locale, "contactUs")}>
        <Phone size={20} />
      </FloatingLink>
      <FloatingLink href={localizePath(locale, "/enquiry-list")} label={t(locale, "myCart")}>
        <ShoppingBag size={20} />
      </FloatingLink>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group relative flex size-12 items-center justify-center bg-neutral-950 text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700"
      >
        <ChevronUp size={22} />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap bg-neutral-950 px-3 py-2 text-xs font-semibold opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          Top
        </span>
      </button>
    </div>
  );
}

function FloatingLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group relative flex size-12 items-center justify-center bg-neutral-950 text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700"
    >
      {children}
      <span className="pointer-events-none absolute right-full mr-3 max-w-64 truncate whitespace-nowrap bg-neutral-950 px-3 py-2 text-xs font-semibold opacity-0 shadow-lg transition duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}
