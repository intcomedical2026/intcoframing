import { buildLlmsIndex } from "@/lib/llms";
import { getSiteData } from "@/lib/site-data";

export const revalidate = 3600;

export async function GET() {
  const data = await getSiteData("en");
  return new Response(buildLlmsIndex(data), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
