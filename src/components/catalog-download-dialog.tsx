"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { HubSpotCatalogDownloadForm } from "@/components/hubspot-forms";
import type { Locale } from "@/lib/i18n";

type CatalogDownloadButtonProps = {
  pdfUrl: string;
  catalogName?: string;
  locale: Locale;
  className?: string;
  children: ReactNode;
};

export function CatalogDownloadButton({ pdfUrl, catalogName, locale, className, children }: CatalogDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const dialog = (
    <div className="intco-catalog-modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setIsOpen(false);
      }
    }}>
      <div className="intco-catalog-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button
          type="button"
          className="intco-catalog-dialog-close"
          aria-label="Close"
          onClick={() => setIsOpen(false)}
        >
          <X size={18} aria-hidden="true" />
        </button>
        <h2 id={titleId} className="intco-catalog-dialog-title">
          Fill out the form to download！
        </h2>
        <div className="pop-d-from intco-catalog-download-form">
          <div className="pdf-inner">
            <HubSpotCatalogDownloadForm locale={locale} catalogName={catalogName} catalogUrl={pdfUrl} downloadOnSuccess onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {children}
      </button>
      {isOpen && typeof document !== "undefined" ? createPortal(dialog, document.body) : null}
    </>
  );
}
