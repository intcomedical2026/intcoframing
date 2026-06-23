"use client";

import { useState } from "react";
import { Locale, t } from "@/lib/i18n";

export type ContactFactory = {
  title: string;
  address: string;
  zip: string;
  lat: number;
  lng: number;
  mapUrl: string;
};

export function ContactMapTabs({ factories, locale }: { factories: ContactFactory[]; locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFactory = factories[activeIndex] || factories[0];
  const mapTiles = buildMapTiles(activeFactory);
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
          <div className="intco-contact-map-frame" data-reveal="fade" data-has-map="true">
            <div className="intco-contact-tile-map" role="img" aria-label={`${activeFactory.title} map`}>
              <div className="intco-contact-tile-map-inner" style={{ gridTemplateColumns: `repeat(${mapTiles.columns}, 256px)` }}>
                {mapTiles.tiles.map((tile) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={`${tile.x}-${tile.y}`} src={tile.url} alt="" loading="lazy" decoding="async" />
                ))}
              </div>
              <span className="intco-contact-map-marker" aria-hidden="true" />
              <span className="intco-contact-map-attribution">© OpenStreetMap contributors © CARTO</span>
            </div>
            <div className="intco-contact-map-overlay">
              <span>{activeFactory.title}</span>
              <a href={mapLink || activeFactory.mapUrl} target="_blank" rel="noopener noreferrer">
                {mapLinkLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type ContactMapTile = {
  x: number;
  y: number;
  url: string;
};

function buildMapTiles(factory: ContactFactory) {
  const zoom = 13;
  const columns = 7;
  const rows = 5;
  const center = lngLatToTile(factory.lng, factory.lat, zoom);
  const tiles: ContactMapTile[] = [];

  for (let row = -Math.floor(rows / 2); row <= Math.floor(rows / 2); row += 1) {
    for (let column = -Math.floor(columns / 2); column <= Math.floor(columns / 2); column += 1) {
      const x = center.x + column;
      const y = center.y + row;
      tiles.push({ x, y, url: contactMapTileUrl(x, y, zoom) });
    }
  }

  return { columns, tiles };
}

function lngLatToTile(lng: number, lat: number, zoom: number) {
  const latRadians = (lat * Math.PI) / 180;
  const scale = 2 ** zoom;

  return {
    x: Math.floor(((lng + 180) / 360) * scale),
    y: Math.floor(((1 - Math.log(Math.tan(latRadians) + 1 / Math.cos(latRadians)) / Math.PI) / 2) * scale),
  };
}

function contactMapTileUrl(x: number, y: number, zoom: number) {
  const subdomains = ["a", "b", "c", "d"];
  const subdomain = subdomains[Math.abs(x + y) % subdomains.length];
  return `https://${subdomain}.basemaps.cartocdn.com/light_all/${zoom}/${x}/${y}.png`;
}

function googleMapSearchUrl(address: string) {
  if (!address) return "";

  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", address);
  return url.toString();
}

const googleMapLinkLabel: Record<Locale, string> = {
  en: "Open in Google Maps",
  es: "Abrir en Google Maps",
  pt: "Abrir no Google Maps",
  fr: "Ouvrir dans Google Maps",
  de: "In Google Maps öffnen",
  ja: "Google マップで開く",
};
