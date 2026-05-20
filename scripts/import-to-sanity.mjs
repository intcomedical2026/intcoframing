import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o10sbz2i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-20";
const token = process.env.SANITY_API_TOKEN;
const seedPath = path.resolve("sanity/seed/intcoframing.seed.json");
const uploadAssets = process.env.SANITY_UPLOAD_ASSETS === "true";

if (!token) {
  console.error("SANITY_API_TOKEN is required to import content.");
  console.error("Create a Sanity token with Editor permissions, then run:");
  console.error("  $env:SANITY_API_TOKEN='sk...'; npm run sanity:import");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const seed = JSON.parse(await fs.readFile(seedPath, "utf8"));
const assetCache = new Map();

async function uploadImage(url, label = "image") {
  if (!uploadAssets) return undefined;
  if (!url || typeof url !== "string") return undefined;
  if (assetCache.has(url)) return assetCache.get(url);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const filename = decodeURIComponent(new URL(url).pathname.split("/").pop() || `${label}.jpg`);
    const asset = await client.assets.upload("image", bytes, {
      filename,
      source: {
        name: "intcoframing-us.com",
        url,
      },
    });
    const reference = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    assetCache.set(url, reference);
    return reference;
  } catch (error) {
    console.warn(`Skipping image ${url}: ${error.message}`);
    assetCache.set(url, undefined);
    return undefined;
  }
}

function slugifyDoc(doc) {
  const copy = { ...doc };
  if (typeof copy.slug === "string") {
    copy.slug = { _type: "slug", current: copy.slug };
  }
  return copy;
}

async function withImages(doc) {
  const copy = slugifyDoc(doc);

  if (copy.logoUrl) copy.logo = await uploadImage(copy.logoUrl, "logo");
  if (copy.footerLogoUrl) copy.footerLogo = await uploadImage(copy.footerLogoUrl, "footer-logo");
  if (copy.imageUrl) copy.image = await uploadImage(copy.imageUrl, copy.slug?.current || copy.title);
  if (copy.navImageUrl) copy.navImage = await uploadImage(copy.navImageUrl, `${copy.title}-nav`);

  if (Array.isArray(copy.galleryUrls) && copy.galleryUrls.length) {
    const gallery = [];
    for (const url of copy.galleryUrls) {
      const image = await uploadImage(url, copy.slug?.current || copy.title);
      if (image) gallery.push(image);
    }
    if (gallery.length) copy.gallery = gallery;
  }

  if (Array.isArray(copy.heroSlides)) {
    copy.heroSlides = await Promise.all(
      copy.heroSlides.map(async (slide) => ({
        ...slide,
        image: await uploadImage(slide.imageUrl, slide.title),
      })),
    );
  }

  if (copy.companyProfile?.imageUrl) {
    copy.companyProfile = {
      ...copy.companyProfile,
      image: await uploadImage(copy.companyProfile.imageUrl, "company-profile"),
    };
  }

  return copy;
}

async function commitInBatches(docs, size = 25) {
  for (let index = 0; index < docs.length; index += size) {
    const batch = docs.slice(index, index + size);
    let transaction = client.transaction();
    for (const doc of batch) {
      transaction = transaction.createOrReplace(doc);
    }
    await transaction.commit();
    console.log(`Imported ${Math.min(index + size, docs.length)} / ${docs.length}`);
  }
}

const docs = [
  seed.siteSettings,
  seed.homePage,
  ...seed.productCategories,
  ...seed.products,
  ...seed.solutions,
  ...seed.projects,
  ...seed.blogPosts,
  ...seed.pages,
];

console.log(
  `${uploadAssets ? "Uploading images and importing" : "Importing"} ${docs.length} documents to ${projectId}/${dataset}...`,
);
const prepared = [];
for (const doc of docs) {
  prepared.push(await withImages(doc));
}
await commitInBatches(prepared);
console.log("Sanity import complete.");
