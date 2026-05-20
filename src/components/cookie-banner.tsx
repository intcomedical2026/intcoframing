"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function CookieBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(localStorage.getItem("intco-cookie-choice") === null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  function choose(value: string) {
    localStorage.setItem("intco-cookie-choice", value);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-4xl bg-white p-5 shadow-2xl ring-1 ring-black/10">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-neutral-950">{t(locale, "privacyTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{t(locale, "privacyText")}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => choose("reject")}
            className="rounded border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700"
          >
            {t(locale, "reject")}
          </button>
          <button
            type="button"
            onClick={() => choose("accept")}
            className="rounded bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
          >
            {t(locale, "accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
