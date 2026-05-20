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
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "subtitle", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
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
    defineField({ name: "imageUrl", title: "Source Image URL", type: "url" }),
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
