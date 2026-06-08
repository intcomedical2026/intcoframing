"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { LeadsCloudChatLink } from "./leadscloud-chat-link";

type ProjectSourceGallerySwitcherProps = {
  contactLabel: string;
  description: string;
  fallbackHref: string;
  gallery: string[];
  title: string;
};

export function ProjectSourceGallerySwitcher({ contactLabel, description, fallbackHref, gallery, title }: ProjectSourceGallerySwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] || gallery[0] || "";
  const slideWidth = 172.5;
  const slideGap = 15;
  const showPrevious = () => setActiveIndex((index) => (gallery.length ? (index - 1 + gallery.length) % gallery.length : 0));
  const showNext = () => setActiveIndex((index) => (gallery.length ? (index + 1) % gallery.length : 0));

  return (
    <>
      <div className="project22IndexTopsWIPER">
        <div className="product123-swiper-top">
          <div className="swiper swiper-container">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="img-w">
                  <div className="img-box">
                    {activeImage ? <img src={activeImage} alt="" title={title} /> : null}
                  </div>
                  <div className="fixedRight">
                    <div className="fixedRight-top">{title}</div>
                    <div className="DESC">{description}</div>
                    <div className="View-All-btn">
                      <LeadsCloudChatLink fallbackHref={fallbackHref} className="View-All-btn-item">
                        <Phone size={20} />
                        {contactLabel}
                      </LeadsCloudChatLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product111-s-btn-swiper">
        <div className="pbs-warp fixed">
          <div className="pbs-pic fixed">
            <div className="swiper swiper-container">
              <div className="swiper-wrapper" style={{ transform: `translate3d(-${activeIndex * (slideWidth + slideGap)}px, 0, 0)` }}>
                {gallery.map((image, index) => (
                  <div key={image} className={`swiper-slide ${index === activeIndex ? "swiper-slide-thumb-active" : ""}`}>
                    <button type="button" className="b-item" aria-label={`Show ${title} image ${index + 1}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}>
                      <span className="img-box">
                        <img src={image} alt="" title={title} />
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              {gallery.length > 1 ? (
                <>
                  <button type="button" className="swiper-button-prev swiper-button-white" aria-label={`Show previous ${title} image`} onClick={showPrevious} />
                  <button type="button" className="swiper-button-next swiper-button-white" aria-label={`Show next ${title} image`} onClick={showNext} />
                </>
              ) : null}
            </div>
          </div>
          <div className="pbs-text">
            <p>
              Explore more details on our projects across diverse settings, gain inspiration, and infuse a <br />
              unique charm into your space.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
