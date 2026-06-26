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
type LeadsCloudChatQueue = ((...args: unknown[]) => void) & { a?: unknown[][] | { openChat?: () => void } };

declare global {
  interface Window {
    _XHLF?: LeadsCloudQueue;
    formDownLoadPDF?: () => void;
  }
}

const FORM_SCRIPT_SRC = "https://libtx.leadscloud.com/Front-Form/buryForm/xhlform_NEW.js";
const CHAT_SCRIPT_SRC = "https://libtx.leadscloud.com/xhltrackingwithchat.js";
const CHAT_SCRIPT_ID = "intco-leadscloud-chat-script";
const CATALOG_DOWNLOAD_EVENT = "intco:catalog-download-complete";
const FORM_IDLE_FALLBACK_MS = 12000;
const FORM_VIEWPORT_MARGIN = "700px 0px";

type LeadsCloudLocale = "en" | "es" | "pt" | "fr" | "de" | "ja";

const LEADSCLOUD_FORM_COPY: Record<
  LeadsCloudLocale,
  {
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    submit: string;
  }
> = {
  en: {
    labels: {
      name: "Name",
      companyName: "Company Name",
      country: "Country",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    placeholders: {
      name: "Name",
      companyName: "Company Name",
      country: "Country",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    submit: "Submit",
  },
  es: {
    labels: {
      name: "Nombre",
      companyName: "Nombre de la empresa",
      country: "País o región",
      email: "Correo electrónico",
      phone: "Teléfono",
      whatsapp: "WhatsApp",
      message: "Mensaje",
    },
    placeholders: {
      name: "Nombre",
      companyName: "Nombre de la empresa",
      country: "País o región",
      email: "Correo electrónico",
      phone: "Teléfono",
      whatsapp: "WhatsApp",
      message: "Mensaje",
    },
    submit: "Enviar",
  },
  pt: {
    labels: {
      name: "Nome",
      companyName: "Nome da empresa",
      country: "País ou região",
      email: "E-mail",
      phone: "Telefone",
      whatsapp: "WhatsApp",
      message: "Mensagem",
    },
    placeholders: {
      name: "Nome",
      companyName: "Nome da empresa",
      country: "País ou região",
      email: "E-mail",
      phone: "Telefone",
      whatsapp: "WhatsApp",
      message: "Mensagem",
    },
    submit: "Enviar",
  },
  fr: {
    labels: {
      name: "Nom",
      companyName: "Nom de l'entreprise",
      country: "Pays ou région",
      email: "E-mail",
      phone: "Téléphone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    placeholders: {
      name: "Nom",
      companyName: "Nom de l'entreprise",
      country: "Pays ou région",
      email: "E-mail",
      phone: "Téléphone",
      whatsapp: "WhatsApp",
      message: "Message",
    },
    submit: "Envoyer",
  },
  de: {
    labels: {
      name: "Name",
      companyName: "Firmenname",
      country: "Land oder Region",
      email: "E-Mail",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      message: "Nachricht",
    },
    placeholders: {
      name: "Name",
      companyName: "Firmenname",
      country: "Land oder Region",
      email: "E-Mail",
      phone: "Telefon",
      whatsapp: "WhatsApp",
      message: "Nachricht",
    },
    submit: "Senden",
  },
  ja: {
    labels: {
      name: "氏名",
      companyName: "会社名",
      country: "国・地域",
      email: "メール",
      phone: "電話",
      whatsapp: "WhatsApp",
      message: "メッセージ",
    },
    placeholders: {
      name: "氏名",
      companyName: "会社名",
      country: "国・地域",
      email: "メール",
      phone: "電話",
      whatsapp: "WhatsApp",
      message: "メッセージ",
    },
    submit: "送信",
  },
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type ChatRuntimeWindow = Window & {
  _XHL?: LeadsCloudChatQueue;
  __intcoLoadLeadsCloudChat?: () => void;
};

function currentLeadsCloudLocale(): LeadsCloudLocale {
  const lang = document.documentElement.lang.split("-")[0];
  return lang === "es" || lang === "pt" || lang === "fr" || lang === "de" || lang === "ja" ? lang : "en";
}

function fieldKeyForControl(control: Element) {
  const field = control.querySelector("input, textarea");
  if (!field) return undefined;
  const classList = Array.from(field.classList);
  if (classList.includes("a1009")) return "name";
  if (classList.includes("a1001")) return "companyName";
  if (classList.includes("a1003")) return "country";
  if (classList.includes("a10010")) return "email";
  if (classList.includes("a10012")) return "phone";
  if (classList.includes("a10052")) return "whatsapp";
  if (field instanceof HTMLTextAreaElement || classList.includes("xhl-textarea")) return "message";
  return undefined;
}

function localizeLeadsCloudForms() {
  const copy = LEADSCLOUD_FORM_COPY[currentLeadsCloudLocale()];

  document.querySelectorAll(".intco-leadscloud-main-form .xhl-control-group, .intco-leadscloud-localized-form .xhl-control-group, .intco-leadscloud-newsletter .xhl-control-group, .intco-contact-form .xhl-control-group").forEach((control) => {
    const key = fieldKeyForControl(control);
    if (!key) return;

    const label = control.querySelector(".xhl-control-label");
    if (label && label.textContent !== copy.labels[key]) label.textContent = copy.labels[key];

    const field = control.querySelector("input, textarea");
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      if (field.placeholder !== copy.placeholders[key]) field.placeholder = copy.placeholders[key];
    }
  });

  document.querySelectorAll(".intco-leadscloud-main-form .xhl-submit, .intco-leadscloud-localized-form .xhl-submit, .intco-leadscloud-newsletter .xhl-submit, .intco-contact-form .xhl-submit").forEach((button) => {
    if (button.textContent !== copy.submit) button.textContent = copy.submit;
  });
}

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
    const collectSlots = () =>
      LEADSCLOUD_FORM_ID_LIST.flatMap((formId) =>
        Array.from(document.getElementsByClassName(leadsCloudBuryClass(formId))),
      );

    const renderForms = () => {
      const slots = collectSlots();

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
      script.addEventListener("load", () => {
        window.setTimeout(localizeLeadsCloudForms, 0);
        window.setTimeout(localizeLeadsCloudForms, 750);
        window.setTimeout(localizeLeadsCloudForms, 2000);
      });
      document.head.appendChild(script);
    };
    const idleWindow = window as IdleWindow;
    let observer: IntersectionObserver | undefined;
    let formLocalizationObserver: MutationObserver | undefined;
    let idleHandle: number | undefined;
    let fallbackTimer: number | undefined;
    let scheduled = false;

    const scheduleRenderForms = () => {
      if (scheduled) return;
      scheduled = true;

      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(renderForms, { timeout: 2500 });
        return;
      }

      fallbackTimer = window.setTimeout(renderForms, 1500);
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

    const initialSlots = collectSlots();
    if (initialSlots.length) {
      if ("MutationObserver" in window) {
        formLocalizationObserver = new MutationObserver(() => {
          localizeLeadsCloudForms();
        });
        formLocalizationObserver.observe(document.body, { childList: true, subtree: true });
      }

      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              observer?.disconnect();
              scheduleRenderForms();
            }
          },
          { rootMargin: FORM_VIEWPORT_MARGIN },
        );
        initialSlots.forEach((slot) => observer?.observe(slot));
        fallbackTimer = window.setTimeout(scheduleRenderForms, FORM_IDLE_FALLBACK_MS);
      } else {
        scheduleRenderForms();
      }
    }

    window.addEventListener("intco:leadscloud-rerender", renderForms);

    return () => {
      observer?.disconnect();
      formLocalizationObserver?.disconnect();
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      window.removeEventListener("intco:leadscloud-rerender", renderForms);
    };
  }, [pathname]);

  return null;
}

function loadLeadsCloudChat() {
  const runtimeWindow = window as ChatRuntimeWindow;

  if (!runtimeWindow._XHL) {
    const queue = ((...args: unknown[]) => {
      const queued = Array.isArray(queue.a) ? queue.a : [];
      queued.push(args);
      queue.a = queued;
    }) as LeadsCloudChatQueue;
    queue.a = [];
    runtimeWindow._XHL = queue;
  }

  if (typeof runtimeWindow._XHL === "function") {
    runtimeWindow._XHL("entID", LEADSCLOUD_ENTERPRISE_ID);
  }

  if (document.getElementById(CHAT_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = CHAT_SCRIPT_ID;
  script.async = true;
  script.charset = "UTF-8";
  script.src = CHAT_SCRIPT_SRC;
  script.dataset.intcoLeadscloudChat = "true";
  document.head.appendChild(script);
}

export function LeadsCloudChatRuntime() {
  useEffect(() => {
    const runtimeWindow = window as ChatRuntimeWindow;

    const loadOnce = () => {
      loadLeadsCloudChat();
    };

    runtimeWindow.__intcoLoadLeadsCloudChat = loadOnce;

    return () => {
      if (runtimeWindow.__intcoLoadLeadsCloudChat === loadOnce) {
        delete runtimeWindow.__intcoLoadLeadsCloudChat;
      }
    };
  }, []);

  return (
    <span
      hidden
      data-intco-leadscloud-chat={CHAT_SCRIPT_SRC}
      data-intco-leadscloud-command="entID"
      data-intco-leadscloud-enterprise={LEADSCLOUD_ENTERPRISE_ID}
    />
  );
}
