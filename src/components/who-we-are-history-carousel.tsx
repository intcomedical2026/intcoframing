"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useRef } from "react";

type HistoryItem = {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
};

export function WhoWeAreHistoryCarousel({ items }: { items: HistoryItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "previous" | "next") => {
    const element = scrollerRef.current;
    if (!element) return;

    const card = element.querySelector<HTMLElement>("[data-history-card]");
    const gap = Number.parseFloat(window.getComputedStyle(element).columnGap || window.getComputedStyle(element).gap || "0") || 0;
    const amount = card ? card.offsetWidth + gap : element.clientWidth * 0.75;
    element.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="relative px-0 lg:px-[70px]">
      <button
        type="button"
        aria-label="Previous history item"
        onClick={() => scroll("previous")}
        className="absolute left-0 top-[44%] z-10 hidden size-[38px] items-center justify-center rounded-full bg-[#484653] text-white transition duration-300 hover:bg-[#363442] lg:flex"
      >
        <ChevronLeft size={22} strokeWidth={2.4} />
      </button>
      <button
        type="button"
        aria-label="Next history item"
        onClick={() => scroll("next")}
        className="absolute right-0 top-[44%] z-10 hidden size-[38px] items-center justify-center rounded-full bg-[#484653] text-white transition duration-300 hover:bg-[#363442] lg:flex"
      >
        <ChevronRight size={22} strokeWidth={2.4} />
      </button>

      <div ref={scrollerRef} className="flex snap-x gap-7 overflow-x-auto scroll-smooth pb-3 pt-[100px] [scrollbar-width:none] lg:gap-[68px] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => (
          <article
            key={`${item.year}-${item.title}-${index}`}
            data-history-card
            data-reveal
            style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as CSSProperties}
            className="relative min-w-[min(386px,calc(100vw-56px))] snap-start border-4 border-[#484653] bg-[#f3f3f3] p-5 text-[#484653] lg:min-w-[calc((100%_-_136px)/3)] lg:max-w-[calc((100%_-_136px)/3)] lg:basis-[calc((100%_-_136px)/3)]"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={`absolute -left-[72px] hidden h-1 w-[68px] bg-[#484653] lg:block ${index % 2 === 0 ? "top-[30%]" : "bottom-[10%]"}`}
              />
            ) : null}
            <div className="relative -mt-[108px] w-[60%]">
              <div className="relative aspect-[188/234] overflow-hidden bg-white">
                <Image src={item.imageUrl} alt={`${item.year} ${item.title}`} fill className="object-cover" sizes="232px" />
              </div>
              <span className="absolute -bottom-[50px] right-[50px] h-0 w-0 border-y-[14px] border-l-[14px] border-y-transparent border-l-[#484653]" aria-hidden="true" />
            </div>
            <div className="flex pt-[50px]">
              <div className="mr-5 shrink-0 text-[62px] font-semibold leading-none">
                {item.year}
                <span className="mt-[5px] block h-1.5 w-full bg-[#484653]" />
              </div>
              <div className="pt-[50px]">
                <h3 className="text-xl font-semibold leading-9">{item.title}</h3>
                <p className="mt-2.5 line-clamp-4 max-w-32 text-lg leading-[1.5]">{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
