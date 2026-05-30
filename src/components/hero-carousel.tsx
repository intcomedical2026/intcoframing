"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomePage } from "@/lib/site-data";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";

type HeroSlide = NonNullable<HomePage["heroSlides"]>[number];
const HERO_FIRST_ROTATION_DELAY_MS = 14000;
const HERO_ROTATION_DELAY_MS = 9000;

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
  const activeIndex = active % items.length;

  useEffect(() => {
    if (items.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setActive((index) => (index + 1) % items.length);
    }, activeIndex === 0 ? HERO_FIRST_ROTATION_DELAY_MS : HERO_ROTATION_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, items.length, paused]);

  return (
    <section
      className="relative aspect-[1920/940] min-h-[194px] overflow-hidden bg-[#f3f3f3] text-[#484653]"
      aria-label="Featured INTCO Framing slides"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="intco-hero-track flex h-full" style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}>
        {items.map((slide, index) => {
          const hasText = Boolean(slide.title || slide.subtitle);
          const hasActions = Boolean(slide.primaryCta || slide.secondaryCta);
          const isAnimatedSlide = Boolean(slide.imageUrl?.toLowerCase().endsWith(".gif"));
          const shouldRenderImage = !isAnimatedSlide || index === activeIndex;
          return (
            <div key={`${slide.title || slide.imageUrl || fallbackTitle}-${index}`} className="intco-hero-slide relative h-full w-full shrink-0" data-active={index === activeIndex}>
              {slide.imageUrl && shouldRenderImage ? (
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || fallbackTitle}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  unoptimized={slide.imageUrl?.endsWith(".gif")}
                  className="object-cover"
                  sizes="100vw"
                />
              ) : null}
              {hasText || hasActions ? (
                <div className="absolute inset-0 hidden lg:block">
                  <div className="intco-source-container h-full px-5">
                    <div className={`flex h-full ${hasText ? "items-center" : "items-start"}`}>
                      <div className={`intco-hero-copy max-w-5xl ${hasText ? "" : "pt-[548px]"}`} aria-live={index === activeIndex ? "polite" : undefined}>
                        {hasText ? (
                          <>
                            <h1 className="text-balance text-[112px] font-bold leading-none text-[#484653] max-[1600px]:text-[85px] max-[1466px]:text-[40px]">{slide.title || fallbackTitle}</h1>
                            {slide.subtitle ? <p className="mt-5 max-w-[1160px] whitespace-pre-line text-pretty text-[28px] font-semibold leading-[1.45] text-[#484653] max-[1200px]:text-lg">{slide.subtitle}</p> : null}
                          </>
                        ) : null}
                        {hasActions ? (
                          <div className={`flex flex-wrap gap-[29px] ${hasText ? "mt-12" : ""}`}>
                            {slide.primaryCta ? <HeroPillLink href={localizePath(locale, slide.primaryCta.path)}>{slide.primaryCta.label}</HeroPillLink> : null}
                            {slide.secondaryCta ? <HeroPillLink href={localizePath(locale, slide.secondaryCta.path)}>{slide.secondaryCta.label}</HeroPillLink> : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {items.length > 1 ? (
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-4 lg:bottom-5">
          {items.map((slide, index) => (
            <button
              key={`${slide.title || slide.imageUrl || "slide"}-dot-${index}`}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.title || slide.primaryCta?.label || "INTCO Framing"}`}
              aria-current={index === activeIndex}
              onClick={() => setActive(index)}
              className="size-3.5 rounded-full border border-white bg-transparent transition-colors duration-200 hover:bg-white aria-current:bg-white"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HeroPillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-[66px] items-center rounded-full border-2 border-[#484653] px-10 text-lg font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white">
      {children}
    </Link>
  );
}
