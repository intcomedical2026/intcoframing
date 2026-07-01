"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const heroNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-source-hero].intco-source-hero-category"));
    const heroTimer = window.setTimeout(() => {
      heroNodes.forEach((node) => {
        node.dataset.heroActive = "true";
      });
    }, 70);

    let observer: IntersectionObserver | null = null;
    let fallbackTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
    let idleCallback: number | null = null;

    const initRevealObserver = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (!nodes.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        window.clearTimeout(heroTimer);
        heroNodes.forEach((node) => {
          node.dataset.heroActive = "true";
        });
        nodes.forEach((node) => {
          node.dataset.revealVisible = "true";
          if (node.classList.contains("wow")) node.classList.add("animated");
        });
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || !observer) return;
            const element = entry.target as HTMLElement;
            element.dataset.revealVisible = "true";
            if (element.classList.contains("wow")) element.classList.add("animated");
            observer.unobserve(element);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );

      nodes.forEach((node) => {
        node.dataset.revealVisible = node.dataset.revealVisible || "false";
        observer?.observe(node);
      });
    };

    if ("requestIdleCallback" in window) {
      idleCallback = window.requestIdleCallback(initRevealObserver, { timeout: 1500 });
    } else {
      fallbackTimer = globalThis.setTimeout(initRevealObserver, 800);
    }

    return () => {
      window.clearTimeout(heroTimer);
      if (fallbackTimer !== null) globalThis.clearTimeout(fallbackTimer);
      if (idleCallback !== null) window.cancelIdleCallback(idleCallback);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
