import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  skipTrailingSlashRedirect: true,
  outputFileTracingIncludes: {
    "/*": ["./reports/visual-parity/search-product-pages/*/original/dom.html"],
  },
  images: {
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1600, 1920, 2048],
    imageSizes: [32, 48, 64, 96, 128, 180, 222, 256, 320],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.intcoframing-us.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
