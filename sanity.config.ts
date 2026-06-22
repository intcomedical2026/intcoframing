"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vzcnnept";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const languages = ["en", "es", "pt", "fr", "de", "ja"];
const localizedTypes = ["product", "productCategory", "blogPost", "project", "solution", "contentPage"];
const hiddenCreateTemplateTypes = new Set([...localizedTypes, "siteSettings", "homePage"]);

export default defineConfig({
  name: "intco-framing-us",
  title: "INTCO Content Studio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((template) => !hiddenCreateTemplateTypes.has(template.schemaType)),
      ...localizedTypes.flatMap((schemaType) =>
        languages.map((language) => ({
          id: `${schemaType}-${language}`,
          title: templateTitle(schemaType, language),
          schemaType,
          parameters: [
            { name: "language", type: "string" },
            { name: "category", type: "string" },
            { name: "categorySlugs", type: "array" },
            { name: "mainCategorySlug", type: "string" },
          ],
          value: ({
            language: templateLanguage,
            category,
            categorySlugs,
            mainCategorySlug,
          }: {
            language?: string;
            category?: string;
            categorySlugs?: string[];
            mainCategorySlug?: string;
          }) => ({
            language: templateLanguage || language,
            ...(schemaType === "product"
              ? {
                  brand: "INTCO Framing",
                  ...(categorySlugs?.length ? { categorySlugs } : {}),
                  ...(mainCategorySlug ? { mainCategorySlug } : {}),
                }
              : {}),
            ...(schemaType === "blogPost" && category ? { category } : {}),
          }),
        })),
      ),
    ],
  },
});

function templateTitle(schemaType: string, language: string) {
  const contentTitle: Record<string, string> = {
    product: "Product",
    productCategory: "Product Category",
    blogPost: "News Post",
    project: "Project",
    solution: "Solution",
    contentPage: "Page",
  };
  const title = contentTitle[schemaType] || schemaType;
  if (language === "en") return `New ${title}`;
  return `Translation - ${title} (${language.toUpperCase()})`;
}
