"use client";

import { useState } from "react";
import { Locale, t } from "@/lib/i18n";

export type ContactFactory = {
  title: string;
  address: string;
  zip: string;
  mapUrl: string;
};

export function ContactMapTabs({ factories, locale }: { factories: ContactFactory[]; locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFactory = factories[activeIndex] || factories[0];

  return (
    <>
      <section className="intco-contact-index intco-contact-factory-section">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <p className="intco-contact-desc intco-contact-desc-center" data-reveal="fade">
            {t(locale, "contactFactoryIntro")}
          </p>
          <ul className="intco-contact-list intco-contact-factory-list">
            {factories.map((factory, index) => (
              <li key={factory.title} className="wow fadeInUp" data-reveal="source-up" data-active={index === activeIndex ? "true" : undefined}>
                <button type="button" className="intco-contact-factory-card" onClick={() => setActiveIndex(index)}>
                  <i className="intco-source-iconfont intco-source-icon-location" aria-hidden="true" />
                  <span className="intco-contact-center-item">
                    <span className="intco-contact-item-title">{factory.title}</span>
                    <span className="intco-contact-item-desc">{factory.address}</span>
                  </span>
                  <span className="intco-contact-zip">{factory.zip}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="intco-contact-index intco-contact-map-section">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <div className="intco-contact-map-frame" data-reveal="fade">
            <iframe
              key={`${activeFactory.title}-${locale}`}
              src={activeFactory.mapUrl}
              title={`${activeFactory.title} map`}
              width="100%"
              height="550"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
