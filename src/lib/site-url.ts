const DEFAULT_SITE_ORIGIN = "https://www.intcoframing-us.com";

function normalizeOrigin(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/\/+$/g, "");
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const siteOrigin =
  normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  DEFAULT_SITE_ORIGIN;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin}${normalized}`;
}
