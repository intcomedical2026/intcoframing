"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { CatalogDownloadButton } from "@/components/catalog-download-dialog";

export type ProductCatalogManual = {
  title: string;
  imageUrl: string;
  description: string;
  pdfUrl: string;
};

type ProductCatalogTabsProps = {
  manuals: ProductCatalogManual[];
  exploreMoreLabel: string;
};

export function ProductCatalogTabs({ manuals, exploreMoreLabel }: ProductCatalogTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function selectManual(index: number) {
    setActiveIndex(index);
  }

  function onManualKeyDown(event: KeyboardEvent<HTMLLIElement>, index: number) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectManual(index);
  }

  return (
    <div className="MANUALFlex intco-product-catalog-tabs">
      <ul className="wow fadeInUp product-ul-li" data-reveal="source-up">
        {manuals.map((manual, index) => (
          <li
            key={manual.title}
            className={index === activeIndex ? "selectcurLi" : ""}
            role="button"
            tabIndex={0}
            aria-pressed={index === activeIndex}
            onClick={() => selectManual(index)}
            onKeyDown={(event) => onManualKeyDown(event, index)}
          >
            {manual.title}
          </li>
        ))}
      </ul>
      <div className="huaLangSwiper" id="layerDemo">
        <div className="swiper-container swiper">
          <div
            className="swiper-wrapper"
            style={{
              transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
              transitionDuration: "500ms",
            }}
          >
            {manuals.map((manual, index) => (
              <div className="swiper-slide" key={manual.title} aria-hidden={index !== activeIndex}>
                <div className="wow fadeInDown MANUALFlex-Right fixed" data-reveal="source-down">
                  <div className="pic">
                    <div className="hc-img-box">
                      <Image src={manual.imageUrl} alt="" title={manual.title} width={600} height={700} sizes="(min-width: 1024px) 34vw, 360px" />
                    </div>
                  </div>
                  <div className="flexColum rightINFO">
                    <div>
                      <h4>{manual.title}</h4>
                      <div className="DESC MANUALDESC">{manual.description}</div>
                    </div>
                    <div className="flexContent DownloadBTN">
                      <CatalogDownloadButton pdfUrl={manual.pdfUrl} className="selectBtn hc-down">
                        {exploreMoreLabel}
                        <i className="iconfont icon-a-xiazai2" aria-hidden="true" />
                      </CatalogDownloadButton>
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
