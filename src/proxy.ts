import { NextResponse, type NextRequest } from "next/server";

const prefixedLocales = new Set(["es", "pt", "fr", "de", "ja"]);

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  requestHeaders.set("x-intco-locale", firstSegment && prefixedLocales.has(firstSegment) ? firstSegment : "en");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
