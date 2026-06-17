"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-20";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o10sbz2i";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const languages = ["en", "es", "pt", "fr", "de", "ja"];
const localizedTypes = ["product", "productCategory", "blogPost", "project", "solution", "contentPage"];
const hiddenCreateTemplateTypes = new Set([...localizedTypes, "siteSettings", "homePage"]);

export default defineConfig({
  name: "intco-framing-us",
  title: "INTCO Framing US",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((template) => !hiddenCreateTemplateTypes.has(template.schemaType)),
      ...localizedTypes.flatMap((schemaType) =>
        languages.map((language) => ({
          id: `${schemaType}-${language}`,
          title: `${schemaType} (${language})`,
          schemaType,
          parameters: [{ name: "language", type: "string" }],
          value: ({ language: templateLanguage, category }: { language?: string; category?: string }) => ({
            language: templateLanguage || language,
            ...(schemaType === "product" ? { brand: "INTCO Framing" } : {}),
            ...(schemaType === "blogPost" && category ? { category } : {}),
          }),
        })),
      ),
    ],
  },
});
