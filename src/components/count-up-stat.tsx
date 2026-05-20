"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Parts = {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
};

export function CountUpStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);
  const parts = useMemo(() => parseValue(value), [value]);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element || !parts || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const start = performance.now();
        const duration = 1800;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(2, -10 * progress);
          setDisplay(formatValue(parts, parts.number * eased));
          if (progress < 1) {
            frame.current = window.requestAnimationFrame(tick);
          } else {
            setDisplay(value);
          }
        };

        setDisplay(formatValue(parts, 0));
        frame.current = window.requestAnimationFrame(tick);
        observer.unobserve(element);
      },
      { rootMargin: "0px 0px -2% 0px", threshold: 0.2 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [parts, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

function parseValue(value: string): Parts | null {
  const match = value.trim().match(/^([^0-9]*)([0-9][0-9.,]*)(.*)$/);
  if (!match) return null;
  const rawNumber = match[2].replace(/,/g, "");
  const number = Number(rawNumber);
  if (!Number.isFinite(number)) return null;
  const decimalPart = rawNumber.split(".")[1];
  return {
    prefix: match[1],
    number,
    suffix: match[3],
    decimals: decimalPart?.length || 0,
  };
}

function formatValue(parts: Parts, current: number) {
  return `${parts.prefix}${current.toFixed(parts.decimals)}${parts.suffix}`;
}
