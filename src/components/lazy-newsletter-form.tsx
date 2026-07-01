"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Send } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type NewsletterFormComponent = ComponentType<{ locale: Locale }>;

let newsletterFormPromise: Promise<NewsletterFormComponent> | null = null;

function loadNewsletterForm() {
  newsletterFormPromise ??= import("@/components/hubspot-forms").then((mod) => mod.HubSpotNewsletterForm);
  return newsletterFormPromise;
}

export function LazyNewsletterForm({ locale }: { locale: Locale }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [Form, setForm] = useState<NewsletterFormComponent | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    let cancelled = false;
    const load = () => {
      void loadNewsletterForm().then((component) => {
        if (!cancelled) setForm(() => component);
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
      { rootMargin: "700px 0px" },
    );

    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {Form ? (
        <Form locale={locale} />
      ) : (
        <form className="intco-footer-newsletter-fallback" aria-hidden="true">
          <input type="email" placeholder="Email" disabled tabIndex={-1} />
          <button type="button" disabled tabIndex={-1} aria-label="Loading newsletter form">
            <Send size={20} aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  );
}
