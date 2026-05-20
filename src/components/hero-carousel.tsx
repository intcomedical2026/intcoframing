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

  useEffect(() => {
    if (items.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % items.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  return (
    <section
      className="relative min-h-[280px] overflow-hidden bg-neutral-950 text-white lg:min-h-[620px]"
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
              priority={index === 0}
              className="object-cover lg:opacity-70"
              sizes="100vw"
            />
          ) : null}
        </div>
      ))}
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.3),rgba(0,0,0,.08))] lg:block" />
      <div className="relative mx-auto flex min-h-[280px] max-w-7xl items-center px-4 py-12 sm:px-6 lg:min-h-[620px] lg:px-8 lg:py-20">
        <div key={`${activeSlide.title}-${active}`} className="intco-hero-copy hidden max-w-3xl lg:block" aria-live="polite">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-emerald-300">Premier Interior Decoration Manufacturer</p>
          <h1 className="mt-5 text-balance text-5xl font-bold leading-none sm:text-7xl lg:text-8xl">{activeSlide.title || fallbackTitle}</h1>
          {activeSlide.subtitle ? <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/85">{activeSlide.subtitle}</p> : null}
          <div className="mt-9 flex flex-wrap gap-4">
            {activeSlide.primaryCta ? <HeroPrimaryLink href={localizePath(locale, activeSlide.primaryCta.path)}>{activeSlide.primaryCta.label}</HeroPrimaryLink> : null}
            {activeSlide.secondaryCta ? <HeroSecondaryLink href={localizePath(locale, activeSlide.secondaryCta.path)}>{activeSlide.secondaryCta.label}</HeroSecondaryLink> : null}
          </div>
        </div>
      </div>
      {items.length > 1 ? (
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-4">
          {items.map((slide, index) => (
            <button
              key={`${slide.title}-dot-${index}`}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className="size-3.5 border border-white bg-transparent transition-colors duration-200 hover:bg-white aria-current:bg-white"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HeroPrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded bg-emerald-600 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-500">
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}

function HeroSecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded border border-white/55 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950">
      {children}
    </Link>
  );
}
