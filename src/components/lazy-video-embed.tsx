"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoEmbedProps = {
  srcDoc: string;
  title: string;
  className?: string;
  rootMargin?: string;
};

export function LazyVideoEmbed({
  srcDoc,
  title,
  className,
  rootMargin = "600px 0px",
}: LazyVideoEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const node = ref.current;
    if (!node) return;

    if (typeof window.IntersectionObserver === "undefined") {
      const timer = globalThis.setTimeout(() => setShouldLoad(true), 2500);
      return () => globalThis.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <iframe
          className="size-full"
          srcDoc={srcDoc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
    </div>
  );
}
