import { SanityStudio } from "@/components/sanity-studio";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "INTCO Content Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export { viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <SanityStudio />;
}
