"use client";

import { useEffect } from "react";

const GTM_ID = "GTM-NFFXV4DP";
const CLARITY_PROJECT_ID = "xcusp9mr3y";
const HUBSPOT_PORTAL_ID = "242615166";
const HUBSPOT_REGION = "na2";
const CONSENT_STORAGE_KEY = "intco-cookie-choice";
const CONSENT_EVENT = "intco-cookie-choice";
const ANALYTICS_DELAY_MS = 6500;

declare global {
  type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] };

  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    clarity?: ClarityFunction;
  }
}

let analyticsLoaded = false;

function appendScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  appendScript("intco-gtm-loader", `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);

  window.clarity =
    window.clarity ||
    function clarityQueue(...args: unknown[]) {
      (window.clarity!.q = window.clarity!.q || []).push(args);
    };
  appendScript("intco-clarity-loader", `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`);

  appendScript("hs-script-loader", `https://js-${HUBSPOT_REGION}.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`);
}

function scheduleAnalyticsLoad() {
  const run = () => {
    if (window.localStorage.getItem(CONSENT_STORAGE_KEY) === "accept") {
      loadAnalytics();
    }
  };

  const timer = window.setTimeout(() => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 3000 });
      return;
    }
    run();
  }, ANALYTICS_DELAY_MS);

  return () => window.clearTimeout(timer);
}

export function ConsentAnalytics() {
  useEffect(() => {
    let cancelScheduledLoad = scheduleAnalyticsLoad();

    function onConsent() {
      cancelScheduledLoad();
      cancelScheduledLoad = scheduleAnalyticsLoad();
    }

    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => {
      cancelScheduledLoad();
      window.removeEventListener(CONSENT_EVENT, onConsent);
    };
  }, []);

  return null;
}
