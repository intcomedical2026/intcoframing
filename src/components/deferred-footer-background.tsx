"use client";

import { useEffect } from "react";

export function DeferredFooterBackground({ imageUrl, targetId }: { imageUrl: string; targetId: string }) {
  useEffect(() => {
    const footer = document.getElementById(targetId);
    if (!footer) return undefined;

    const applyBackground = () => {
      footer.style.backgroundImage = `url("${imageUrl}")`;
    };

    if (!("IntersectionObserver" in window)) {
      applyBackground();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        applyBackground();
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, [imageUrl, targetId]);

  return null;
}
