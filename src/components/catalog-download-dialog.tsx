"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { LEADSCLOUD_FORM_IDS, leadsCloudBuryClass } from "@/lib/leadscloud";

const CATALOG_DOWNLOAD_EVENT = "intco:catalog-download-complete";
const LEADSCLOUD_RERENDER_EVENT = "intco:leadscloud-rerender";

type CatalogDownloadButtonProps = {
  pdfUrl: string;
  className?: string;
  children: ReactNode;
};

function setDownloadHref(pdfUrl: string) {
  const anchor = document.getElementById("goPdf");
  if (anchor instanceof HTMLAnchorElement) {
    anchor.href = pdfUrl;
  }
}

function clearDownloadHref() {
  const anchor = document.getElementById("goPdf");
  if (anchor instanceof HTMLAnchorElement) {
    anchor.removeAttribute("href");
  }
}

export function CatalogDownloadButton({ pdfUrl, className, children }: CatalogDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const closeAfterDownload = () => setIsOpen(false);
    window.dispatchEvent(new Event(LEADSCLOUD_RERENDER_EVENT));
    window.addEventListener(CATALOG_DOWNLOAD_EVENT, closeAfterDownload);
    return () => window.removeEventListener(CATALOG_DOWNLOAD_EVENT, closeAfterDownload);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        clearDownloadHref();
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setDownloadHref(pdfUrl);
          setIsOpen(true);
        }}
      >
        {children}
      </button>
      {isOpen ? (
        <div className="intco-catalog-modal" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            clearDownloadHref();
            setIsOpen(false);
          }
        }}>
          <div className="intco-catalog-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <button
              type="button"
              className="intco-catalog-dialog-close"
              aria-label="Close"
              onClick={() => {
                clearDownloadHref();
                setIsOpen(false);
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <h2 id={titleId} className="intco-catalog-dialog-title">
              Fill out the form to download！
            </h2>
            <div className="pop-d-from intco-catalog-download-form">
              <div className="pdf-inner">
                <div className={leadsCloudBuryClass(LEADSCLOUD_FORM_IDS.catalogDownload)} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
