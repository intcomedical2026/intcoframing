import { defineField, defineType } from "sanity";

const editorGroups = [
  { name: "content", title: "Edit Content", default: true },
  { name: "media", title: "Images" },
  { name: "seo", title: "SEO - optional" },
  { name: "inquiry", title: "Inquiry - optional" },
  { name: "system", title: "System" },
];

const settingsGroups = [
  { name: "content", title: "Business Info", default: true },
  { name: "navigation", title: "Navigation" },
  { name: "media", title: "Logos" },
  { name: "seo", title: "SEO - optional" },
  { name: "system", title: "System" },
];

const slugFieldDescription = "Click Generate from the title when creating a new item. Keep it short, lowercase, and unique.";
const pathFieldDescription = "Full website path, starting with /. Example: /mirror/led-mirror/product-name. Do not include the domain.";
const sourceUrlDescription = "Imported from the old site. Keep this for migration history unless a developer asks you to change it.";

const sourceFields = [
  defineField({ name: "sourceUrl", title: "Old Site URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
  defineField({ name: "sourceId", title: "Old Site ID", type: "number", group: "system", readOnly: true, hidden: true }),
];

const languageOptions = [
  { title: "English", value: "en" },
  { title: "Spanish", value: "es" },
  { title: "Portuguese", value: "pt" },
  { title: "French", value: "fr" },
  { title: "German", value: "de" },
  { title: "Japanese", value: "ja" },
];

const productCategorySlugOptions = [
  { title: "Mirror", value: "mirror" },
  { title: "Picture Frame", value: "picture-frame" },
  { title: "Art", value: "art" },
  { title: "Furniture", value: "furniture" },
  { title: "Memo Board", value: "memo-board" },
];

const localizationFields = [
  defineField({
    name: "language",
    title: "Language",
    type: "string",
    group: "system",
    options: { list: languageOptions },
    initialValue: "en",
    readOnly: true,
    description: "Set automatically from the Studio section you create content in.",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "translationGroup",
    title: "Translation Group",
    type: "string",
    group: "system",
    description: "Stable ID shared by all language versions of the same content item.",
    readOnly: true,
    hidden: true,
  }),
];

const seoField = defineField({ name: "seo", title: "SEO", type: "seoFields", group: "seo" });

const migrationFields = [
  defineField({ name: "legacyUrls", title: "Legacy URLs", type: "array", group: "system", of: [{ type: "url" }], readOnly: true, hidden: true }),
];

const intelligenceFields = [
  defineField({ name: "faqs", title: "FAQs", type: "array", group: "seo", description: "Optional. Add common questions if they should appear in search/AI results.", of: [{ type: "faqItem" }] }),
  defineField({ name: "evidence", title: "Evidence / Claims", type: "array", group: "seo", of: [{ type: "evidenceItem" }], hidden: true }),
  defineField({ name: "datePublished", title: "SEO Date Published", type: "datetime", group: "seo", hidden: true }),
  defineField({ name: "dateModified", title: "SEO Date Modified", type: "datetime", group: "seo", hidden: true }),
];

const inquiryField = defineField({ name: "inquiryRouting", title: "Inquiry Routing", type: "inquiryRouting", group: "inquiry" });

const localizedSlugOptions = {
  source: "title",
  isUnique: isUniqueWithinLanguage,
};

type SlugValidationContext = {
  document?: {
    _id?: string;
    _type?: string;
    language?: string;
  };
  getClient: (options: { apiVersion: string }) => {
    withConfig: (config: { perspective: "raw" }) => {
      fetch: <T>(query: string, params: Record<string, string>) => Promise<T>;
    };
  };
};

async function isUniqueWithinLanguage(slug: string, context: SlugValidationContext): Promise<boolean> {
  const { document, getClient } = context;
  if (!document?._id || !document?._type) return true;

  const currentId = document._id.replace(/^drafts\./, "");
  const draftId = `drafts.${currentId}`;
  const language = document.language || "en";

  const query = /* groq */ `!defined(*[
    _type == $type &&
    slug.current == $slug &&
    coalesce(language, "en") == $language &&
    !(_id in [$currentId, $draftId])
  ][0]._id)`;

  return getClient({ apiVersion: "2026-05-20" }).withConfig({ perspective: "raw" }).fetch<boolean>(query, {
    type: document._type,
    slug,
    language,
    currentId,
    draftId,
  });
}

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: settingsGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text", group: "content", rows: 3 }),
    defineField({ name: "sourceSite", title: "Public Website URL", type: "url", group: "content" }),
    defineField({ name: "logo", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "logoUrl", title: "Source Logo URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "footerLogo", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "footerLogoUrl", title: "Source Footer Logo URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "phone", type: "string", group: "content" }),
    defineField({ name: "secondaryPhone", type: "string", group: "content" }),
    defineField({ name: "email", type: "string", group: "content" }),
    defineField({ name: "address", type: "string", group: "content" }),
    defineField({ name: "contactPoints", title: "Contact Points", type: "array", group: "content", of: [{ type: "contactPoint" }] }),
    defineField({ name: "sameAs", title: "Social Profiles", type: "array", group: "content", of: [{ type: "url" }] }),
    defineField({ name: "navigation", type: "array", group: "navigation", of: [{ type: "link" }] }),
    defineField({ name: "footerColumns", type: "array", group: "navigation", of: [{ type: "footerColumn" }] }),
    seoField,
    defineField({ name: "faqs", title: "Organization FAQs", type: "array", group: "seo", of: [{ type: "faqItem" }] }),
    defineField({ name: "evidence", title: "Organization Evidence / Claims", type: "array", group: "seo", of: [{ type: "evidenceItem" }] }),
    defineField({ name: "datePublished", title: "Date Published", type: "datetime", group: "seo" }),
    defineField({ name: "dateModified", title: "Date Modified", type: "datetime", group: "seo" }),
  ],
});

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: editorGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "heroSlides", title: "Hero Slides", type: "array", group: "content", of: [{ type: "heroSlide" }] }),
    defineField({ name: "companyProfile", type: "companyProfile", group: "content" }),
    defineField({ name: "stats", type: "array", group: "content", of: [{ type: "statItem" }] }),
    defineField({ name: "projectsIntro", title: "Projects Intro", type: "introBlock", group: "content" }),
    defineField({ name: "blogIntro", title: "Blog Intro", type: "introBlock", group: "content" }),
    seoField,
    ...intelligenceFields,
  ],
});

export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  groups: editorGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", title: "Category Name", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", group: "content", options: localizedSlugOptions, description: slugFieldDescription, validation: (rule) => rule.required() }),
    defineField({ name: "path", title: "Page Path", type: "string", group: "content", description: pathFieldDescription }),
    defineField({ name: "parentSlug", title: "Parent Category Slug", type: "string", group: "content" }),
    defineField({ name: "description", title: "Short Description", type: "text", group: "content", rows: 4 }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string", group: "media" }),
    defineField({ name: "image", title: "Main Image", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "navImageAlt", title: "Navigation Image Alt Text", type: "string", group: "media" }),
    defineField({ name: "navImage", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "navImageUrl", title: "Source Nav Image URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "order", type: "number", group: "content", description: "Lower numbers appear first in category lists." }),
    seoField,
    ...intelligenceFields,
    inquiryField,
    ...migrationFields,
    ...sourceFields,
  ],
  preview: {
    select: { title: "title", subtitle: "path", media: "image" },
  },
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: editorGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", title: "Product Name", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", group: "content", options: localizedSlugOptions, description: slugFieldDescription, validation: (rule) => rule.required() }),
    defineField({ name: "path", title: "Page Path", type: "string", group: "content", description: pathFieldDescription }),
    defineField({ name: "categorySlugs", title: "Product Categories", type: "array", group: "content", description: "Select every category this product belongs to.", of: [{ type: "string", options: { list: productCategorySlugOptions } }] }),
    defineField({ name: "mainCategorySlug", title: "Main Category", type: "string", group: "content", options: { list: productCategorySlugOptions }, description: "Primary category used for breadcrumbs and listing pages." }),
    defineField({ name: "description", title: "Short Description", type: "text", group: "content", rows: 4 }),
    defineField({ name: "bodyText", title: "Product Details", type: "text", group: "content", rows: 8 }),
    defineField({ name: "sku", title: "SKU / Item Number", type: "string", group: "content" }),
    defineField({ name: "brand", type: "string", group: "content", initialValue: "INTCO Framing" }),
    defineField({ name: "material", type: "string", group: "content" }),
    defineField({ name: "dimensions", type: "string", group: "content" }),
    defineField({ name: "offers", title: "Offers / Inquiry Options", type: "array", group: "inquiry", of: [{ type: "offerItem" }] }),
    defineField({ name: "imageAlt", title: "Main Image Alt Text", type: "string", group: "media" }),
    defineField({ name: "image", title: "Main Image", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Main Image URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "gallery", title: "Gallery Images", type: "array", group: "media", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", title: "Source Gallery URLs", type: "array", group: "system", of: [{ type: "url" }], readOnly: true, hidden: true }),
    defineField({ name: "publishedAt", title: "Publish Date", type: "datetime", group: "content" }),
    defineField({ name: "updatedAt", title: "Last Updated", type: "datetime", group: "seo" }),
    seoField,
    ...intelligenceFields,
    inquiryField,
    ...migrationFields,
    ...sourceFields,
  ],
  preview: {
    select: { title: "title", subtitle: "path", media: "image" },
  },
});

export const solution = defineType({
  name: "solution",
  title: "Solution",
  type: "document",
  groups: editorGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", title: "Solution Name", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", group: "content", options: localizedSlugOptions, description: slugFieldDescription, validation: (rule) => rule.required() }),
    defineField({ name: "path", title: "Page Path", type: "string", group: "content", description: pathFieldDescription }),
    defineField({ name: "description", type: "text", group: "content", rows: 4 }),
    defineField({ name: "bodyText", title: "Page Body", type: "text", group: "content", rows: 8 }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string", group: "media" }),
    defineField({ name: "image", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "order", type: "number", group: "content", description: "Lower numbers appear first in solution lists." }),
    seoField,
    ...intelligenceFields,
    inquiryField,
    ...migrationFields,
    ...sourceFields,
  ],
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: editorGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", title: "Project Name", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", group: "content", options: localizedSlugOptions, description: slugFieldDescription, validation: (rule) => rule.required() }),
    defineField({ name: "path", title: "Page Path", type: "string", group: "content", description: pathFieldDescription }),
    defineField({ name: "category", type: "string", group: "content", options: { list: ["Residential", "Commercial"] } }),
    defineField({ name: "description", type: "text", group: "content", rows: 4 }),
    defineField({ name: "bodyText", title: "Project Details", type: "text", group: "content", rows: 8 }),
    defineField({ name: "imageAlt", title: "Main Image Alt Text", type: "string", group: "media" }),
    defineField({ name: "image", title: "Main Image", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Main Image URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "gallery", title: "Gallery Images", type: "array", group: "media", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", title: "Source Gallery URLs", type: "array", group: "system", of: [{ type: "url" }], readOnly: true, hidden: true }),
    seoField,
    ...intelligenceFields,
    inquiryField,
    ...migrationFields,
    ...sourceFields,
  ],
});

export const blogPost = defineType({
  name: "blogPost",
  title: "News Post",
  type: "document",
  groups: editorGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", title: "News Title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", group: "content", options: localizedSlugOptions, description: slugFieldDescription, validation: (rule) => rule.required() }),
    defineField({ name: "path", title: "Page Path", type: "string", group: "content", description: pathFieldDescription }),
    defineField({
      name: "category",
      type: "string",
      group: "content",
      options: { list: ["Expo", "Industry News", "Inspiration", "New Products", "Press Release", "Tips"] },
    }),
    defineField({ name: "excerpt", title: "Short Summary", type: "text", group: "content", rows: 3, description: "Used on listing cards and search snippets." }),
    defineField({ name: "bodyText", title: "Article Body", type: "text", group: "content", rows: 12 }),
    defineField({ name: "imageAlt", title: "Cover Image Alt Text", type: "string", group: "media" }),
    defineField({ name: "image", title: "Cover Image", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Cover Image URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    defineField({ name: "gallery", title: "Gallery Images", type: "array", group: "media", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", title: "Source Gallery URLs", type: "array", group: "system", of: [{ type: "url" }], readOnly: true, hidden: true }),
    defineField({ name: "publishedAt", title: "Publish Date", type: "datetime", group: "content" }),
    seoField,
    ...intelligenceFields,
    ...migrationFields,
    ...sourceFields,
  ],
});

export const contentPage = defineType({
  name: "contentPage",
  title: "Content Page",
  type: "document",
  groups: editorGroups,
  fields: [
    ...localizationFields,
    defineField({ name: "title", title: "Page Title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", group: "content", options: localizedSlugOptions, description: slugFieldDescription, validation: (rule) => rule.required() }),
    defineField({ name: "path", title: "Page Path", type: "string", group: "content", description: pathFieldDescription }),
    defineField({ name: "description", type: "text", group: "content", rows: 4 }),
    defineField({ name: "bodyText", title: "Page Body", type: "text", group: "content", rows: 10 }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string", group: "media" }),
    defineField({ name: "image", type: "image", group: "media", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url", group: "system", description: sourceUrlDescription, readOnly: true, hidden: true }),
    seoField,
    ...intelligenceFields,
    inquiryField,
    ...migrationFields,
    ...sourceFields,
  ],
});
