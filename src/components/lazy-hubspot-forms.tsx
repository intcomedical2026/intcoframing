"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { Locale } from "@/lib/i18n";
import type { HubSpotEnquiryCartItem } from "@/components/hubspot-forms";

type MainInquiryFormProps = {
  locale: Locale;
};

type CatalogDownloadFormProps = {
  locale: Locale;
  catalogName?: string;
  catalogUrl: string;
  downloadOnSuccess?: boolean;
  onSuccess?: () => void;
};

type EnquiryCartFormProps = {
  locale: Locale;
  items: HubSpotEnquiryCartItem[];
  onSuccess?: () => void;
};

type HubSpotFormModule = typeof import("@/components/hubspot-forms");
type HubSpotFormExportName = "HubSpotMainInquiryForm" | "HubSpotCatalogDownloadForm" | "HubSpotEnquiryCartForm";

let hubSpotFormsPromise: Promise<HubSpotFormModule> | null = null;

function loadHubSpotForms() {
  hubSpotFormsPromise ??= import("@/components/hubspot-forms");
  return hubSpotFormsPromise;
}

function useLazyForm<TProps>(formName: HubSpotFormExportName) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [Form, setForm] = useState<ComponentType<TProps> | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    let cancelled = false;
    const load = () => {
      void loadHubSpotForms().then((module) => {
        if (!cancelled) setForm(() => module[formName] as ComponentType<TProps>);
      });
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [formName]);

  return { containerRef, Form };
}

export function LazyHubSpotMainInquiryForm(props: MainInquiryFormProps) {
  const { containerRef, Form } = useLazyForm<MainInquiryFormProps>("HubSpotMainInquiryForm");
  return <div ref={containerRef}>{Form ? <Form {...props} /> : <HubSpotFormPlaceholder />}</div>;
}

export function LazyHubSpotCatalogDownloadForm(props: CatalogDownloadFormProps) {
  const { containerRef, Form } = useLazyForm<CatalogDownloadFormProps>("HubSpotCatalogDownloadForm");
  return <div ref={containerRef}>{Form ? <Form {...props} /> : <HubSpotFormPlaceholder />}</div>;
}

export function LazyHubSpotEnquiryCartForm(props: EnquiryCartFormProps) {
  const { containerRef, Form } = useLazyForm<EnquiryCartFormProps>("HubSpotEnquiryCartForm");
  return <div ref={containerRef}>{Form ? <Form {...props} /> : <HubSpotFormPlaceholder />}</div>;
}

export type { HubSpotEnquiryCartItem };

function HubSpotFormPlaceholder() {
  return (
    <form className="xhl_form intco-hubspot-form" aria-hidden="true">
      <fieldset disabled>
        <PlaceholderField field="name" />
        <PlaceholderField field="email" />
        <PlaceholderField field="country" />
        <PlaceholderField field="phone" />
        <PlaceholderField field="companyName" />
        <div className="usedComp xhl-control-group component xhl-form-text">
          <label className="xhl-control-label inpt">Message</label>
          <div className="xhl-controls">
            <textarea className="xhl-textarea xhl-valtype" placeholder="Message" tabIndex={-1} />
          </div>
        </div>
        <div className="xhl-footer">
          <button type="button" className="xhl-submit" disabled tabIndex={-1}>
            Submit
          </button>
        </div>
      </fieldset>
    </form>
  );
}

function PlaceholderField({ field }: { field: "name" | "email" | "country" | "phone" | "companyName" }) {
  const label = field === "companyName" ? "Company Name" : field.charAt(0).toUpperCase() + field.slice(1);
  return (
    <div className="usedComp xhl-control-group component xhl-form-input">
      <label className="xhl-control-label inpt">{label}</label>
      <div className="xhl-controls">
        <input className="xhl-input-xlarge xhl-valtype" placeholder={label} tabIndex={-1} />
      </div>
    </div>
  );
}
