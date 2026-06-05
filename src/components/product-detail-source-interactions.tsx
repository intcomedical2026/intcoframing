"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type SourceRelatedProductItem = {
  title: string;
  href: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SourceColorChoice = {
  color?: string;
  itemNumber?: string;
};

export function SourceProductGallery({
  images,
  title,
  primaryAlt,
}: {
  images: string[];
  title: string;
  primaryAlt?: string;
}) {
  const safeImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImageCount = safeImages.length || 1;
  const boundedIndex = Math.min(activeIndex, activeImageCount - 1);

  if (!safeImages.length) return null;

  return (
    <>
      <div className="product111-swiper" id="mainSwiper">
        <div className="swiper swiper-container">
          <div
            className="swiper-wrapper"
            style={{ transform: `translate3d(-${boundedIndex * 100}%, 0, 0)` }}
          >
            {safeImages.map((image, index) => (
              <div
                key={image}
                className={`swiper-slide ${index === boundedIndex ? "swiper-slide-active" : ""}`}
                aria-hidden={index !== boundedIndex}
              >
                <div className="img-box centerImg">
                  <Image
                    src={image}
                    alt={index === 0 ? (primaryAlt || title) : `${title} ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1280px) 620px, 90vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {safeImages.length > 1 ? (
        <div className="product111-swiper-thumbs" id="thumbsSwiper">
          <div className="swiper swiper-container">
            <div className="swiper-wrapper">
              {safeImages.map((image, index) => (
                <button
                  key={`${image}-thumb`}
                  type="button"
                  className={`swiper-slide ${index === boundedIndex ? "swiper-slide-thumb-active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${title} image ${index + 1}`}
                >
                  <div className="img-box centerImg">
                    <Image
                      src={image}
                      alt={`${title} ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="114px"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SourceProductPurchaseControls({
  itemLabel,
  colorLabel,
  sizeLabel,
  quantityLabel,
  addToCartLabel,
  initialItemNumber,
  colorChoices,
  sizeOptions,
}: {
  itemLabel: string;
  colorLabel: string;
  sizeLabel: string;
  quantityLabel: string;
  addToCartLabel: string;
  initialItemNumber: string;
  colorChoices: SourceColorChoice[];
  sizeOptions: string[];
}) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const selectedItemNumber = colorChoices[selectedColorIndex]?.itemNumber || initialItemNumber;

  return (
    <>
      <div className="quoteLine">
        <div>{itemLabel}</div>
        <div className="DESC item-name">{selectedItemNumber}</div>
      </div>

      <div className="quoteLine">
        <div>{colorLabel}</div>
        <div className="quoteLineList colorList">
          {colorChoices.map((choice, index) => (
            <button
              key={`${choice.color || "source-color"}-${index}`}
              type="button"
              className={`materialItem colorItem choose ${index === selectedColorIndex ? "active" : ""}`}
              style={choice.color ? { background: choice.color } : undefined}
              onClick={() => setSelectedColorIndex(index)}
              aria-label={`${colorLabel} ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="quoteLine">
        <div>{sizeLabel}</div>
        <div className="quoteLineList">
          {sizeOptions.map((size, index) => (
            <button
              key={`${size}-${index}`}
              type="button"
              className={`materialItem choose sizeItem ${index === selectedSizeIndex ? "active" : ""}`}
              onClick={() => setSelectedSizeIndex(index)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="quoteLine">
        <div>{quantityLabel}</div>
        <div className="quantity-input">
          <button type="button" className="minus-btn" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            -
          </button>
          <input type="number" className="quantity-input-field" value={quantity} min={1} readOnly />
          <button type="button" className="plus-btn" onClick={() => setQuantity((value) => value + 1)}>
            +
          </button>
        </div>
      </div>

      <div className="quoteLine">
        <button type="button" className="buy-btn">
          {addToCartLabel}
        </button>
      </div>
    </>
  );
}

export function SourceProductAboutTabs({
  descriptionLabel,
  highlightsLabel,
  descriptionLines,
  highlightLines,
}: {
  descriptionLabel: string;
  highlightsLabel: string;
  descriptionLines: string[];
  highlightLines: string[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panels = [descriptionLines, highlightLines];

  return (
    <div>
      <div className="AboutThisItemBtn">
        {[descriptionLabel, highlightsLabel].map((label, index) => (
          <button
            key={label}
            type="button"
            className={`BtnItem ${index === activeIndex ? "selectAboutThisItem" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="swiperHuaLang">
        <div className="swiper swiper-container">
          <div
            className="swiper-wrapper"
            style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
          >
            {panels.map((lines, panelIndex) => (
              <div
                key={panelIndex === 0 ? "description" : "highlights"}
                className={`swiper-slide ${panelIndex === activeIndex ? "swiper-slide-active" : ""}`}
                aria-hidden={panelIndex !== activeIndex}
              >
                <div className="wow fadeInUp AboutThisItemText">
                  <div className="DESC">
                    <div>
                      {lines.map((line, lineIndex) => (
                        <div key={`${panelIndex}-${lineIndex}`} data-zone-id="0" data-line-index={lineIndex} data-line="true">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SourceRelatedProductsCarousel({ items }: { items: SourceRelatedProductItem[] }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 650) {
        setVisibleCount(1);
        return;
      }
      if (window.innerWidth <= 1200) {
        setVisibleCount(2);
        return;
      }
      setVisibleCount(4);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxStart = Math.max(0, items.length - visibleCount);
  const boundedStart = Math.min(startIndex, maxStart);
  const visibleItems = items.slice(boundedStart, boundedStart + visibleCount);

  useEffect(() => {
    setStartIndex((value) => Math.min(value, Math.max(0, items.length - visibleCount)));
  }, [items.length, visibleCount]);

  return (
    <div className="BESTSwiper">
      <button
        type="button"
        className={`swiper-button-next ${boundedStart >= maxStart ? "swiper-button-disabled" : ""}`}
        aria-label="Next slide"
        aria-disabled={boundedStart >= maxStart}
        onClick={() => setStartIndex((value) => Math.min(maxStart, value + 1))}
      >
        <span className="source-swiper-arrow source-swiper-arrow-next" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`swiper-button-prev ${boundedStart <= 0 ? "swiper-button-disabled" : ""}`}
        aria-label="Previous slide"
        aria-disabled={boundedStart <= 0}
        onClick={() => setStartIndex((value) => Math.max(0, value - 1))}
      >
        <span className="source-swiper-arrow source-swiper-arrow-prev" aria-hidden="true" />
      </button>
      <div className="swiper swiper-container gallery-top">
        <div className="swiper-wrapper">
          {visibleItems.map((item) => (
            <a key={item.href} href={item.href} className="wow fadeInUp swiper-slide">
              <div className="topImgBox">
                <div className="img-box">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title}
                      fill
                      className="object-contain"
                      sizes="373px"
                    />
                  ) : null}
                </div>
              </div>
              <div className="bottomText">{item.title}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
