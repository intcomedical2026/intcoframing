import { defineField, defineType } from "sanity";

const sourceFields = [
  defineField({ name: "sourceUrl", type: "url" }),
  defineField({ name: "sourceId", type: "number" }),
];

const languageOptions = [
  { title: "English", value: "en" },
  { title: "Spanish", value: "es" },
  { title: "Portuguese", value: "pt" },
  { title: "French", value: "fr" },
  { title: "German", value: "de" },
  { title: "Japanese", value: "ja" },
];

const localizationFields = [
  defineField({
    name: "language",
    type: "string",
    options: { list: languageOptions },
    initialValue: "en",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "translationGroup",
    title: "Translation Group",
    type: "string",
    description: "Stable ID shared by all language versions of the same content item.",
  }),
];

const seoField = defineField({ name: "seo", title: "SEO", type: "seoFields" });

const migrationFields = [
  defineField({ name: "legacyUrls", title: "Legacy URLs", type: "array", of: [{ type: "url" }] }),
];

const intelligenceFields = [
  defineField({ name: "faqs", title: "FAQs", type: "array", of: [{ type: "faqItem" }] }),
  defineField({ name: "evidence", title: "Evidence / Claims", type: "array", of: [{ type: "evidenceItem" }] }),
  defineField({ name: "datePublished", title: "Date Published", type: "datetime" }),
  defineField({ name: "dateModified", title: "Date Modified", type: "datetime" }),
];

const inquiryField = defineField({ name: "inquiryRouting", title: "Inquiry Routing", type: "inquiryRouting" });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "sourceSite", type: "url" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "logoUrl", title: "Source Logo URL", type: "url" }),
    defineField({ name: "footerLogo", type: "image", options: { hotspot: true } }),
    defineField({ name: "footerLogoUrl", title: "Source Footer Logo URL", type: "url" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "secondaryPhone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "contactPoints", title: "Contact Points", type: "array", of: [{ type: "contactPoint" }] }),
    defineField({ name: "sameAs", title: "Social Profiles", type: "array", of: [{ type: "url" }] }),
    defineField({ name: "navigation", type: "array", of: [{ type: "link" }] }),
    defineField({ name: "footerColumns", type: "array", of: [{ type: "footerColumn" }] }),
    seoField,
    defineField({ name: "faqs", title: "Organization FAQs", type: "array", of: [{ type: "faqItem" }] }),
    defineField({ name: "evidence", title: "Organization Evidence / Claims", type: "array", of: [{ type: "evidenceItem" }] }),
  ],
});

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroSlides", type: "array", of: [{ type: "heroSlide" }] }),
    defineField({ name: "companyProfile", type: "companyProfile" }),
    defineField({ name: "stats", type: "array", of: [{ type: "statItem" }] }),
    defineField({ name: "projectsIntro", type: "introBlock" }),
    defineField({ name: "blogIntro", type: "introBlock" }),
    seoField,
    ...intelligenceFields,
  ],
});

export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "parentSlug", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "navImageAlt", title: "Navigation Image Alt Text", type: "string" }),
    defineField({ name: "navImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "navImageUrl", title: "Source Nav Image URL", type: "url" }),
    defineField({ name: "order", type: "number" }),
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
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "categorySlugs", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "mainCategorySlug", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "sku", title: "SKU", type: "string" }),
    defineField({ name: "brand", type: "string", initialValue: "INTCO Framing" }),
    defineField({ name: "material", type: "string" }),
    defineField({ name: "dimensions", type: "string" }),
    defineField({ name: "offers", title: "Offers / Inquiry Options", type: "array", of: [{ type: "offerItem" }] }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", type: "array", of: [{ type: "url" }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "updatedAt", type: "datetime" }),
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
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "order", type: "number" }),
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
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "category", type: "string", options: { list: ["Residential", "Commercial"] } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", type: "array", of: [{ type: "url" }] }),
    seoField,
    ...intelligenceFields,
    inquiryField,
    ...migrationFields,
    ...sourceFields,
  ],
});

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", type: "array", of: [{ type: "url" }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
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
  fields: [
    ...localizationFields,
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    seoField,
    ...intelligenceFields,
    inquiryField,
    ...migrationFields,
    ...sourceFields,
  ],
});
