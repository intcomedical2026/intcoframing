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

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) {
      return () => window.clearTimeout(heroTimer);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      window.clearTimeout(heroTimer);
      heroNodes.forEach((node) => {
        node.dataset.heroActive = "true";
      });
      nodes.forEach((node) => {
        node.dataset.revealVisible = "true";
        if (node.classList.contains("wow")) node.classList.add("animated");
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
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
      observer.observe(node);
    });

    return () => {
      window.clearTimeout(heroTimer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
