"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizePath, t } from "@/lib/i18n";

type CartItem = {
  slug: string;
  title: string;
  path: string;
  sourceId?: number;
  sku?: string;
  imageUrl?: string;
  quantity: number;
};

type LeadsCloudProductItem = {
  productId: string;
  productLink: string;
  productName: string;
  productImg: string;
  productQuantity: number;
  productColor: string | null;
  productItem: string;
  productSize: string | null;
  newcolor: Array<{ color: string; item: string }>;
  newsize: string[];
};

export function ProductQuotePanel({
  locale,
  product,
}: {
  locale: Locale;
  product: { slug: string; title: string; path: string; sourceId?: number; sku?: string; imageUrl?: string };
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    const current = JSON.parse(localStorage.getItem("intco-enquiry-cart") || "[]") as CartItem[];
    const existing = current.find((item) => item.slug === product.slug);
    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({ ...product, quantity });
    }
    localStorage.setItem("intco-enquiry-cart", JSON.stringify(current));
    syncLeadsCloudProductList(current);
    setAdded(true);
  }

  return (
    <div className="mt-8 border border-neutral-200 bg-neutral-50 p-5">
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">{t(locale, "quote")}</div>
      <label className="mt-4 block text-sm font-semibold text-neutral-700" htmlFor="quantity">
        {t(locale, "quantity")}
      </label>
      <div className="mt-2 flex items-center">
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          className="size-11 border border-neutral-300 bg-white text-xl transition-colors duration-200 hover:bg-neutral-950 hover:text-white"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          id="quantity"
          value={quantity}
          readOnly
          className="h-11 w-16 border-y border-neutral-300 bg-white text-center text-sm font-semibold"
        />
        <button
          type="button"
          onClick={() => setQuantity((value) => value + 1)}
          className="size-11 border border-neutral-300 bg-white text-xl transition-colors duration-200 hover:bg-neutral-950 hover:text-white"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={addToCart}
        className="mt-4 w-full rounded bg-emerald-700 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-950"
      >
        {t(locale, "addToCart")}
      </button>
      {added ? (
        <Link href={localizePath(locale, "/enquiry-list")} className="mt-3 block text-sm font-semibold text-emerald-700">
          {t(locale, "myCart")}
        </Link>
      ) : null}
    </div>
  );
}

function syncLeadsCloudProductList(items: CartItem[]) {
  const productList: LeadsCloudProductItem[] = items.map((item) => ({
    productId: item.sourceId ? String(item.sourceId) : item.slug,
    productLink: new URL(item.path, window.location.origin).toString(),
    productName: item.title,
    productImg: item.imageUrl || "",
    productQuantity: item.quantity,
    productColor: null,
    productItem: item.sku || item.title,
    productSize: null,
    newcolor: [],
    newsize: [],
  }));

  localStorage.setItem("productList", JSON.stringify(productList));
  document.cookie = "withProduct=true; path=/; max-age=2592000";
}
