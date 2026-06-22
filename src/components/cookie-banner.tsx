"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { localizePath, t } from "@/lib/i18n";

const COOKIE_BANNER_DELAY_MS = 0;

export function CookieBanner({ locale, currentPath }: { locale: Locale; currentPath?: string }) {
  const isSearchPage = currentPath === "/index.php" || /^\/page\/\d+$/.test(currentPath || "");
  const shouldRender = true;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldRender) return;
    const timer = window.setTimeout(() => {
      setVisible(localStorage.getItem("intco-cookie-choice") === null);
    }, COOKIE_BANNER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [shouldRender]);

  if (!shouldRender || !visible) return null;

  function choose(value: string) {
    localStorage.setItem("intco-cookie-choice", value);
    setVisible(false);
  }

  const containerClassName = `intco-cookie-enter ${isSearchPage ? "intco-cookie-search-page" : ""} fixed bottom-[220px] left-0 z-[70] w-[195px] rounded-tr-[22px] border border-[#484653] bg-white p-3 shadow-2xl lg:bottom-0 lg:w-[80%] lg:rounded-none lg:border-0 lg:px-5 lg:py-[17px]`;
  const contentClassName = "grid gap-3 lg:flex lg:items-center lg:justify-between lg:gap-8";
  const copyClassName = "lg:flex-1";
  const titleClassName = "text-[20px] font-semibold leading-8 text-[#363636] lg:text-lg lg:leading-[30px]";
  const textClassName = "mt-1 text-[13px] leading-[18px] text-[#555] lg:text-sm lg:leading-[22px]";
  const actionsClassName = "flex gap-3 lg:w-[300px] lg:justify-between";
  const rejectClassName = "h-[30px] flex-1 rounded-full bg-neutral-200 text-sm text-neutral-500 transition-colors duration-200 hover:bg-neutral-300 lg:h-auto lg:rounded-[10px] lg:px-0 lg:py-2.5 lg:text-base lg:leading-[26px]";
  const acceptClassName = "h-[30px] flex-1 rounded-full bg-[#22213c] text-sm text-white transition-colors duration-200 hover:bg-[#484653] lg:h-auto lg:rounded-[10px] lg:px-0 lg:py-2.5 lg:text-base lg:leading-[26px]";

  return (
    <div className={containerClassName}>
      <div className={contentClassName}>
        <div className={copyClassName}>
          <h2 className={titleClassName}>{t(locale, "privacyTitle")}</h2>
          <p className={textClassName}>{t(locale, "privacyText")}</p>
          <Link href={localizePath(locale, "/privacy-policy")} className="mt-2 inline-block text-[13px] font-semibold text-[#22213c] underline underline-offset-4 lg:text-sm">
            {t(locale, "privacyLearnMore")}
          </Link>
        </div>
        <div className={actionsClassName}>
          <button
            type="button"
            onClick={() => choose("reject")}
            className={rejectClassName}
          >
            {t(locale, "reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("accept")}
            className={acceptClassName}
          >
            {t(locale, "accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
