"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type ProductTestReportItem = {
  title: string;
  imageUrl: string;
};

const VISIBLE_OFFSETS = [-3, -2, -1, 0, 1, 2, 3] as const;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function ProductTestReportCoverflow({ reports }: { reports: ProductTestReportItem[] }) {
  const safeReports = reports.filter((report) => report.imageUrl);
  const [activeIndex, setActiveIndex] = useState(Math.min(3, Math.max(safeReports.length - 1, 0)));
  const dragStartRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);

  if (!safeReports.length) return null;

  const currentIndex = wrapIndex(activeIndex, safeReports.length);
  const moveBy = (step: number) => setActiveIndex((index) => index + step);

  return (
    <div
      className="wow fadeInUp intco-products-test-report-coverflow"
      data-reveal="source-up"
      onClick={(event) => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetFromCenter = event.clientX - (rect.left + rect.width / 2);
        moveBy(Math.abs(offsetFromCenter) < 130 ? 1 : offsetFromCenter > 0 ? 1 : -1);
      }}
      onPointerDown={(event) => {
        dragStartRef.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (dragStartRef.current === null) return;
        const delta = event.clientX - dragStartRef.current;
        dragStartRef.current = null;
        if (Math.abs(delta) < 35) return;
        suppressClickRef.current = true;
        moveBy(delta > 0 ? -1 : 1);
      }}
      onPointerCancel={() => {
        dragStartRef.current = null;
      }}
    >
      <div className="ptest-swiper" role="region" aria-label="Test report carousel">
        <div className="swiper-container">
          <div className="swiper-wrapper intco-products-test-report-track">
            {VISIBLE_OFFSETS.map((offset) => {
              const virtualIndex = activeIndex + offset;
              const reportIndex = wrapIndex(virtualIndex, safeReports.length);
              const report = safeReports[reportIndex];
              const isActive = offset === 0;

              return (
                <button
                  key={virtualIndex}
                  type="button"
                  className={`swiper-slide intco-products-test-report-slide ${isActive ? "swiper-slide-active" : ""}`}
                  data-report-position={offset}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    moveBy(isActive ? 1 : offset);
                  }}
                  aria-label={isActive ? `Next test report after ${report.title}` : `Show ${report.title}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="himg-box">
                    <Image
                      src={report.imageUrl}
                      alt={report.title}
                      title={report.title}
                      width={272}
                      height={385}
                      sizes="272px"
                      quality={72}
                      priority={Math.abs(offset) <= 1}
                      className="intco-products-test-report-img"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {safeReports[currentIndex]?.title}
      </div>
    </div>
  );
}
