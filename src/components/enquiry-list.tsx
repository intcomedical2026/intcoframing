"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizePath, t } from "@/lib/i18n";
import { LEADSCLOUD_FORM_IDS, leadsCloudBuryClass } from "@/lib/leadscloud";

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
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            {items.length ? (
              items.map((item) => (
                <div key={item.slug} className="grid gap-4 border border-neutral-200 p-4 transition-transform duration-300 hover:-translate-y-1 sm:grid-cols-[96px_1fr_auto] sm:items-center">
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
                  <Link href={localizePath(locale, item.path)} className="rounded bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-neutral-950">
                    {t(locale, "viewDetails")}
                  </Link>
                </div>
              ))
            ) : (
              <div className="border border-dashed border-neutral-300 p-8 text-neutral-600">
                No products have been added yet.
              </div>
            )}
          </div>
          <div className={`border border-neutral-200 bg-neutral-50 p-5 ${leadsCloudBuryClass("5d7b74d8ea0b4f4fb26aa05682c8ae4e")}`}>
            <div className={leadsCloudBuryClass(LEADSCLOUD_FORM_IDS.enquiryCart)} />
          </div>
        </div>
        {items.length ? (
          <button type="button" onClick={clear} className="mt-6 border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:border-neutral-950 hover:text-neutral-950">
            Clear
          </button>
        ) : null}
      </div>
    </section>
  );
}
