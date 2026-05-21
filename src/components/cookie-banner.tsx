"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function CookieBanner({ locale, currentPath }: { locale: Locale; currentPath?: string }) {
  const shouldRender = !currentPath || currentPath === "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldRender) return;
    const timer = window.setTimeout(() => {
      setVisible(localStorage.getItem("intco-cookie-choice") === null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [shouldRender]);

  if (!shouldRender || !visible) return null;

  function choose(value: string) {
    localStorage.setItem("intco-cookie-choice", value);
    setVisible(false);
  }

  return (
    <div className="intco-cookie-enter fixed bottom-[220px] left-0 z-[70] w-[195px] rounded-tr-[22px] border border-[#484653] bg-white p-3 shadow-2xl lg:hidden">
      <div className="grid gap-3">
        <div>
          <h2 className="text-[20px] font-semibold leading-8 text-[#363636]">{t(locale, "privacyTitle")}</h2>
          <p className="mt-1 text-[13px] leading-[18px] text-[#555]">{t(locale, "privacyText")}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => choose("reject")}
            className="h-[30px] flex-1 rounded-full bg-neutral-200 text-sm text-neutral-500 transition-colors duration-200 hover:bg-neutral-300"
          >
            {t(locale, "reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("accept")}
            className="h-[30px] flex-1 rounded-full bg-[#22213c] text-sm text-white transition-colors duration-200 hover:bg-[#484653]"
          >
            {t(locale, "accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
