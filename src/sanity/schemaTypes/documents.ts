import { defineField, defineType } from "sanity";

const sourceFields = [
  defineField({ name: "sourceUrl", type: "url" }),
  defineField({ name: "sourceId", type: "number" }),
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
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
    defineField({ name: "navigation", type: "array", of: [{ type: "link" }] }),
    defineField({ name: "footerColumns", type: "array", of: [{ type: "footerColumn" }] }),
  ],
});

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroSlides", type: "array", of: [{ type: "heroSlide" }] }),
    defineField({ name: "companyProfile", type: "companyProfile" }),
    defineField({ name: "stats", type: "array", of: [{ type: "statItem" }] }),
    defineField({ name: "projectsIntro", type: "introBlock" }),
    defineField({ name: "blogIntro", type: "introBlock" }),
  ],
});

export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "parentSlug", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "navImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "navImageUrl", title: "Source Nav Image URL", type: "url" }),
    defineField({ name: "order", type: "number" }),
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
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "categorySlugs", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "mainCategorySlug", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", type: "array", of: [{ type: "url" }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "updatedAt", type: "datetime" }),
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
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "order", type: "number" }),
    ...sourceFields,
  ],
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "category", type: "string", options: { list: ["Residential", "Commercial"] } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", type: "array", of: [{ type: "url" }] }),
    ...sourceFields,
  ],
});

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "category", type: "string" }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({ name: "galleryUrls", type: "array", of: [{ type: "url" }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    ...sourceFields,
  ],
});

export const contentPage = defineType({
  name: "contentPage",
  title: "Content Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "bodyText", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
    ...sourceFields,
  ],
});
