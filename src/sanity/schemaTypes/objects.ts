import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "path", type: "string", validation: (rule) => rule.required() }),
  ],
});

export const footerColumn = defineType({
  name: "footerColumn",
  title: "Footer Column",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "links", type: "array", of: [{ type: "link" }] }),
  ],
});

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero Slide",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Slide Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "subtitle", title: "Slide Subtitle", type: "text" }),
    defineField({ name: "image", title: "Slide Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url", hidden: true }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "link" }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "link" }),
  ],
});

export const statItem = defineType({
  name: "statItem",
  title: "Stat",
  type: "object",
  fields: [
    defineField({ name: "value", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
  ],
});

export const companyProfile = defineType({
  name: "companyProfile",
  title: "Company Profile",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "points", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url", hidden: true }),
  ],
});

export const introBlock = defineType({
  name: "introBlock",
  title: "Intro Block",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "cta", type: "string" }),
  ],
});

export const seoFields = defineType({
  name: "seoFields",
  title: "SEO Settings",
  type: "object",
  fields: [
    defineField({ name: "seoTitle", title: "Search Title", type: "string", description: "Optional. Leave blank to use the page/product/news title." }),
    defineField({ name: "seoDescription", title: "Search Description", type: "text", rows: 3, description: "Optional. Short description for Google and social previews." }),
    defineField({
      name: "keywords",
      title: "SEO Keywords",
      type: "array",
      description: "Optional. Imported from the old site when available. Operations can add, remove, or reorder keywords.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "canonicalPath", title: "Canonical Path", type: "string", description: "Advanced. Usually leave blank unless a developer gives you an exact path." }),
    defineField({ name: "ogImage", title: "Social Share Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "ogImageUrl", title: "Open Graph Source URL", type: "url", hidden: true }),
    defineField({ name: "imageAlt", title: "Social Image Alt Text", type: "string" }),
    defineField({ name: "noIndex", title: "Hide from Search Engines", type: "boolean", initialValue: false, description: "Keep off for normal public pages." }),
  ],
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "anchorId", title: "Anchor ID", type: "string" }),
  ],
});

export const evidenceItem = defineType({
  name: "evidenceItem",
  title: "Evidence / Claim",
  type: "object",
  fields: [
    defineField({ name: "claim", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "methodology", type: "text", rows: 3 }),
    defineField({ name: "sourceName", type: "string" }),
    defineField({ name: "sourceUrl", type: "url" }),
    defineField({ name: "collectedAt", type: "date" }),
    defineField({ name: "limitations", type: "text", rows: 3 }),
  ],
});

export const offerItem = defineType({
  name: "offerItem",
  title: "Offer / Inquiry Option",
  type: "object",
  fields: [
    defineField({
      name: "offerType",
      title: "Offer Type",
      type: "string",
      options: {
        list: [
          { title: "Inquiry Only", value: "inquiry" },
          { title: "Sample Request", value: "sample" },
          { title: "Quote Request", value: "quote" },
        ],
      },
      initialValue: "inquiry",
    }),
    defineField({ name: "price", type: "number" }),
    defineField({ name: "priceCurrency", type: "string", initialValue: "USD" }),
    defineField({ name: "availability", type: "string" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "validFrom", type: "date" }),
    defineField({ name: "validThrough", type: "date" }),
    defineField({ name: "note", type: "text", rows: 3 }),
  ],
});

export const inquiryRouting = defineType({
  name: "inquiryRouting",
  title: "Inquiry Routing",
  type: "object",
  fields: [
    defineField({ name: "inquiryFormId", title: "Inquiry Form ID", type: "string" }),
    defineField({ name: "recipientEmail", title: "Recipient Email", type: "string" }),
    defineField({ name: "subjectPrefix", title: "Email Subject Prefix", type: "string" }),
    defineField({ name: "crmPipeline", title: "CRM Pipeline", type: "string" }),
    defineField({ name: "successMessage", title: "Success Message", type: "text", rows: 3 }),
  ],
});

export const contactPoint = defineType({
  name: "contactPoint",
  title: "Contact Point",
  type: "object",
  fields: [
    defineField({ name: "contactType", title: "Contact Type", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "areaServed", title: "Area Served", type: "string" }),
    defineField({ name: "availableLanguages", title: "Available Languages", type: "array", of: [{ type: "string" }] }),
  ],
});
