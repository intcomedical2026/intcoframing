"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

export type SolutionsServiceItem = {
  title: string;
  description: string;
  imageUrl: string;
  path: string;
};

export function SolutionsServicesSection({ items, locale }: { items: SolutionsServiceItem[]; locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-[50px] lg:flex-row">
      <ul className="flex w-full flex-col gap-4 lg:w-[406px] lg:shrink-0" data-reveal="left">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <li key={item.title}>
              <button
                type="button"
                aria-pressed={selected}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="h-[74px] w-full px-3 text-center text-xl font-semibold leading-tight transition duration-500 lg:h-[100px] lg:text-2xl"
                style={{ backgroundColor: selected ? "#484653" : "#ffffff", color: selected ? "#ffffff" : "#3e3e3e" }}
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex-1 overflow-hidden bg-white p-4 transition duration-500 lg:p-[75px_73px_74px_70px]" data-reveal="right">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <div key={item.title} className={`${selected ? "grid" : "hidden"} gap-8 animate-[intco-hero-copy_900ms_ease-out_both] lg:grid-cols-[minmax(240px,400px)_1fr] lg:gap-[72px]`}>
              <div className="relative aspect-[400/530] overflow-hidden bg-neutral-100">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(min-width: 1024px) 400px, 100vw" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[30px] font-semibold leading-[39px] text-[#3e3e3e] lg:text-[38px]">{item.title}</h3>
                <p className="mt-8 text-lg leading-8 text-[#363636] lg:mt-[42px]">{item.description}</p>
                <div className="mt-10 lg:mt-[15vh]">
                  <Link
                    href={localizePath(locale, item.path)}
                    className="inline-flex h-[58px] w-[254px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-700 hover:bg-[#484653] hover:text-white"
                  >
                    More Information
                    <ArrowRight className="ml-2" size={22} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
