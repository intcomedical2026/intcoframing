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
  const mapUrl = localizeGoogleMapUrl(activeFactory.mapUrl, locale);
  const mapLink = googleMapSearchUrl(activeFactory.address);
  const mapLinkLabel = googleMapLinkLabel[locale] || googleMapLinkLabel.en;

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
          <div className="intco-contact-map-frame" data-reveal="fade" data-has-map="false">
            <div className="intco-contact-map-fallback">
              <i className="intco-source-iconfont intco-source-icon-location" aria-hidden="true" />
              <span className="intco-contact-map-label">{activeFactory.title}</span>
              <strong>{activeFactory.address}</strong>
              <span>{activeFactory.zip}</span>
              <a href={mapLink || mapUrl} target="_blank" rel="noopener noreferrer">
                {mapLinkLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function googleMapSearchUrl(address: string) {
  if (!address) return "";

  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", address);
  return url.toString();
}

const googleMapLanguage: Record<Locale, { language: string; region: string }> = {
  en: { language: "en", region: "US" },
  es: { language: "es", region: "ES" },
  pt: { language: "pt", region: "BR" },
  fr: { language: "fr", region: "FR" },
  de: { language: "de", region: "DE" },
  ja: { language: "ja", region: "JP" },
};

const googleMapLinkLabel: Record<Locale, string> = {
  en: "Open in Google Maps",
  es: "Abrir en Google Maps",
  pt: "Abrir no Google Maps",
  fr: "Ouvrir dans Google Maps",
  de: "In Google Maps öffnen",
  ja: "Google マップで開く",
};

function localizeGoogleMapUrl(source: string, locale: Locale) {
  const config = googleMapLanguage[locale] || googleMapLanguage.en;

  try {
    const url = new URL(source);
    const pb = url.searchParams.get("pb");

    if (pb) {
      url.searchParams.set("pb", pb.replace(/!1s[a-z]{2}(?:-[A-Z]{2})?!2s/g, `!1s${config.language}!2s`));
    }

    url.searchParams.set("hl", config.language);
    url.searchParams.set("language", config.language);
    url.searchParams.set("region", config.region);

    return url.toString();
  } catch {
    const separator = source.includes("?") ? "&" : "?";
    return `${source}${separator}hl=${config.language}&language=${config.language}&region=${config.region}`;
  }
}
