"use client";

import { useId, useState, type ComponentType } from "react";
import { MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type FloatingInquiryPanelProps = {
  locale: Locale;
  formId: string;
  onClose: () => void;
};

type FloatingInquiryPanelComponent = ComponentType<FloatingInquiryPanelProps>;

let floatingInquiryPanelPromise: Promise<FloatingInquiryPanelComponent> | null = null;

function loadFloatingInquiryPanel() {
  floatingInquiryPanelPromise ??= import("@/components/hubspot-forms").then((mod) => mod.HubSpotFloatingInquiryPanel);
  return floatingInquiryPanelPromise;
}

export function FloatingInquiry({ locale }: { locale: Locale }) {
  const formId = useId();
  const panelId = `${formId}-panel`;
  const [isOpen, setIsOpen] = useState(false);
  const [Panel, setPanel] = useState<FloatingInquiryPanelComponent | null>(null);

  function preloadPanel() {
    if (Panel) return;
    void loadFloatingInquiryPanel().then((component) => {
      setPanel(() => component);
    });
  }

  function openPanel() {
    setIsOpen(true);
    preloadPanel();
  }

  return (
    <aside className="intco-floating-inquiry" data-open={isOpen} aria-label="Leave info for details">
      {!isOpen ? (
        <button
          type="button"
          className="intco-floating-inquiry-launcher"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onPointerEnter={preloadPanel}
          onFocus={preloadPanel}
          onClick={openPanel}
        >
          <MessageCircle size={24} aria-hidden="true" />
          <span>Chat with us</span>
        </button>
      ) : Panel ? (
        <Panel locale={locale} formId={formId} onClose={() => setIsOpen(false)} />
      ) : (
        <div id={panelId} className="intco-floating-inquiry-panel" aria-busy="true" />
      )}
    </aside>
  );
}
