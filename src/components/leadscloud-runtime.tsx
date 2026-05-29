"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LEADSCLOUD_ENTERPRISE_ID,
  LEADSCLOUD_FORM_ID_LIST,
  LEADSCLOUD_PARENT_TEMPLATE_ID,
  leadsCloudBuryClass,
} from "@/lib/leadscloud";

type LeadsCloudQueue = ((...args: unknown[]) => void) & { a?: unknown[][] };

declare global {
  interface Window {
    _XHLF?: LeadsCloudQueue;
    formDownLoadPDF?: () => void;
  }
}

const FORM_SCRIPT_SRC = "https://libtx.leadscloud.com/Front-Form/buryForm/xhlform_NEW.js";
const CATALOG_DOWNLOAD_EVENT = "intco:catalog-download-complete";

function ensureDownloadAnchor() {
  const existing = document.getElementById("goPdf");
  if (existing instanceof HTMLAnchorElement) return existing;

  const anchor = document.createElement("a");
  anchor.id = "goPdf";
  anchor.download = "";
  anchor.target = "_blank";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  return anchor;
}

export function LeadsCloudFormsRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const renderForms = () => {
      const slots = LEADSCLOUD_FORM_ID_LIST.flatMap((formId) =>
        Array.from(document.getElementsByClassName(leadsCloudBuryClass(formId))),
      );

      if (!slots.length) return;

      slots.forEach((slot) => {
        if (slot.querySelector(".xhl_form")) {
          slot.innerHTML = "";
        }
      });

      const queue = ((...args: unknown[]) => {
        queue.a = queue.a || [];
        queue.a.push(args);
      }) as LeadsCloudQueue;
      queue.a = [];
      window._XHLF = queue;
      window._XHLF(
        LEADSCLOUD_ENTERPRISE_ID,
        LEADSCLOUD_PARENT_TEMPLATE_ID,
        [...LEADSCLOUD_FORM_ID_LIST],
        "empty.css",
        "true",
      );

      document.querySelectorAll('script[data-intco-leadscloud-form="true"]').forEach((node) => node.remove());
      const script = document.createElement("script");
      script.async = true;
      script.charset = "UTF-8";
      script.src = FORM_SCRIPT_SRC;
      script.dataset.intcoLeadscloudForm = "true";
      document.head.appendChild(script);
    };

    ensureDownloadAnchor();
    window.formDownLoadPDF = () => {
      const anchor = ensureDownloadAnchor();
      if (anchor.getAttribute("href")) {
        anchor.click();
        anchor.removeAttribute("href");
        window.dispatchEvent(new Event(CATALOG_DOWNLOAD_EVENT));
      }
    };

    renderForms();
    window.addEventListener("intco:leadscloud-rerender", renderForms);

    return () => {
      window.removeEventListener("intco:leadscloud-rerender", renderForms);
    };
  }, [pathname]);

  return null;
}
