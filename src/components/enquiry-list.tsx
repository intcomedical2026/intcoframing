"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizePath, t } from "@/lib/i18n";

type CartItem = {
  slug: string;
  title: string;
  path: string;
  imageUrl?: string;
  quantity: number;
};

export function EnquiryList({ locale }: { locale: Locale }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(JSON.parse(localStorage.getItem("intco-enquiry-cart") || "[]"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function clear() {
    localStorage.removeItem("intco-enquiry-cart");
    setItems([]);
  }

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-neutral-950">{t(locale, "myCart")}</h2>
        <div className="mt-8 space-y-4">
          {items.length ? (
            items.map((item) => (
              <div key={item.slug} className="grid gap-4 border border-neutral-200 p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
                <div className="relative aspect-square bg-neutral-100">
                  {item.imageUrl ? <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="96px" /> : null}
                </div>
                <div>
                  <Link href={localizePath(locale, item.path)} className="font-semibold text-neutral-950">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500">
                    {t(locale, "quantity")}: {item.quantity}
                  </p>
                </div>
                <Link href={localizePath(locale, "/contact")} className="rounded bg-emerald-700 px-5 py-3 text-sm font-bold text-white">
                  {t(locale, "quote")}
                </Link>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-neutral-300 p-8 text-neutral-600">
              No products have been added yet.
            </div>
          )}
        </div>
        {items.length ? (
          <button type="button" onClick={clear} className="mt-6 border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700">
            Clear
          </button>
        ) : null}
      </div>
    </section>
  );
}
