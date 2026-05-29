import { NextResponse, type NextRequest } from "next/server";

const prefixedLocales = new Set(["es", "pt", "fr", "de", "ja"]);

const legacyRedirects: Record<string, string> = {
  "/picture-frame-all": "/picture-frame",
  "/products/art-all": "/art",
  "/products/furniture-all": "/furniture",
  "/products/memo-board-all": "/memo-board",
  "/products/mirror-all": "/mirror",
  "/products/picture-frame-all": "/picture-frame",
  "/sample-page": "/",
  "/solutions-center/design-engineering": "/solutions/design-engineering",
  "/solutions/business-insights-trends/bestsellers": "/solutions/business-insights-trends",
  "/solutions/business-insights-trends/trend": "/solutions/business-insights-trends",
  "/solutions/business-insights-trends/trend-2": "/solutions/business-insights-trends",
  "/solutions/business-insights-trends/trend-2-2": "/solutions/business-insights-trends",
  "/blog/expo": "/blog?category=Expo",
  "/blog/industry-news": "/blog?category=Industry%20News",
  "/blog/inspiration": "/inspiration",
  "/blog/press-release": "/blog?category=Press%20Release",
  "/blog/tips": "/blog?category=Tips",
  "/author/admin": "/blog",
  "/author/chengpin": "/blog",
  "/author/wqq-admin": "/blog",
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalizedPathname = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");

  if (normalizedPathname !== pathname) {
    return redirectTo(request, normalizedPathname);
  }

  const legacyDestination = legacyRedirects[normalizedPathname];
  if (legacyDestination) {
    return redirectTo(request, legacyDestination);
  }

  const requestHeaders = new Headers(request.headers);
  const firstSegment = normalizedPathname.split("/").filter(Boolean)[0];
  requestHeaders.set("x-intco-locale", firstSegment && prefixedLocales.has(firstSegment) ? firstSegment : "en");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function redirectTo(request: NextRequest, destinationPath: string) {
  const destination = new URL(request.url);
  const [pathname, search = ""] = destinationPath.split("?");
  destination.pathname = pathname || "/";
  destination.search = search ? `?${search}` : request.nextUrl.search;
  return NextResponse.redirect(destination, 301);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
