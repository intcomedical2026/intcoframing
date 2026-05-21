"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomePage } from "@/lib/site-data";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

type HeroSlide = NonNullable<HomePage["heroSlides"]>[number];

export function HeroCarousel({
  slides,
  fallbackTitle,
  locale,
}: {
  slides?: HeroSlide[];
  fallbackTitle: string;
  locale: Locale;
}) {
  const items = useMemo(() => (slides?.length ? slides : [{ title: fallbackTitle }]), [fallbackTitle, slides]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeSlide = items[active % items.length];
  const hasCopy = Boolean(activeSlide.title || activeSlide.subtitle);

  useEffect(() => {
    if (items.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % items.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  return (
    <section
      className="relative min-h-[194px] overflow-hidden bg-[#f3f3f3] text-[#484653] lg:min-h-[706px]"
      aria-label="Featured INTCO Framing slides"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {items.map((slide, index) => (
        <div key={`${slide.title}-${index}`} className="intco-hero-slide absolute inset-0" data-active={index === active}>
          {slide.imageUrl ? (
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={index < 2}
              unoptimized={slide.imageUrl?.endsWith(".gif")}
              className="object-cover"
              sizes="100vw"
            />
          ) : null}
        </div>
      ))}
      {hasCopy ? <div className="absolute inset-0 hidden bg-white/30 lg:block" /> : null}
      <div className="relative mx-auto flex min-h-[194px] max-w-[1600px] items-center px-4 sm:px-6 lg:min-h-[706px]">
        {hasCopy ? (
          <div key={`${activeSlide.title}-${active}`} className="intco-hero-copy hidden max-w-5xl lg:block" aria-live="polite">
            <h1 className="text-balance text-[112px] font-semibold leading-none text-[#484653]">{activeSlide.title || fallbackTitle}</h1>
            {activeSlide.subtitle ? <p className="mt-5 max-w-4xl text-pretty text-[28px] font-semibold leading-[1.45] text-[#484653]">{activeSlide.subtitle}</p> : null}
            <div className="mt-12 flex flex-wrap gap-7">
              {activeSlide.primaryCta ? <HeroPrimaryLink href={localizePath(locale, activeSlide.primaryCta.path)}>{activeSlide.primaryCta.label}</HeroPrimaryLink> : null}
              {activeSlide.secondaryCta ? <HeroSecondaryLink href={localizePath(locale, activeSlide.secondaryCta.path)}>{activeSlide.secondaryCta.label}</HeroSecondaryLink> : null}
            </div>
          </div>
        ) : null}
      </div>
      {items.length > 1 ? (
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-4 lg:bottom-5">
          {items.map((slide, index) => (
            <button
              key={`${slide.title}-dot-${index}`}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className="size-3.5 rounded-full border border-white bg-transparent transition-colors duration-200 hover:bg-white aria-current:bg-white lg:rounded-none"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HeroPrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-[66px] items-center rounded-full border-2 border-[#484653] px-10 text-lg font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white">
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}

function HeroSecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-[66px] items-center rounded-full border-2 border-[#484653] px-10 text-lg font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white">
      {children}
    </Link>
  );
}
