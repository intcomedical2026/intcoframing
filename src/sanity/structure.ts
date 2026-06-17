import type { StructureBuilder, StructureResolver } from "sanity/structure";

const languages = [
  { id: "en", title: "English" },
  { id: "es", title: "Spanish" },
  { id: "pt", title: "Portuguese" },
  { id: "fr", title: "French" },
  { id: "de", title: "German" },
  { id: "ja", title: "Japanese" },
];

const singletonIds = {
  homePage: {
    en: "homePage",
    es: "i18n.es.homePage",
    pt: "i18n.pt.homePage",
    fr: "i18n.fr.homePage",
    de: "i18n.de.homePage",
    ja: "i18n.ja.homePage",
  },
  siteSettings: {
    en: "siteSettings",
    es: "i18n.es.siteSettings",
    pt: "i18n.pt.siteSettings",
    fr: "i18n.fr.siteSettings",
    de: "i18n.de.siteSettings",
    ja: "i18n.ja.siteSettings",
  },
} as const;

type LocalizedSingletonType = keyof typeof singletonIds;

function localizedList(
  S: StructureBuilder,
  schemaType: string,
  title: string,
  language = "en",
  ordering: Array<{ field: string; direction: "asc" | "desc" }> = [{ field: "_updatedAt", direction: "desc" }],
) {
  return S.documentTypeList(schemaType)
    .title(title)
    .schemaType(schemaType)
    .filter(`_type == $type && coalesce(language, "en") == $language`)
    .params({ type: schemaType, language })
    .defaultOrdering(ordering)
    .initialValueTemplates([S.initialValueTemplateItem(`${schemaType}-${language}`, { language })]);
}

function allLanguageList(S: StructureBuilder, schemaType: string, title: string) {
  return S.list()
    .title(title)
    .items([
      S.listItem()
        .title("English - daily editing")
        .child(localizedList(S, schemaType, "English", "en")),
      S.divider(),
      ...languages
        .filter((language) => language.id !== "en")
        .map((language) =>
          S.listItem()
            .title(language.title)
            .child(localizedList(S, schemaType, language.title, language.id)),
        ),
      S.divider(),
      S.listItem()
        .title("All languages")
        .child(
          S.documentTypeList(schemaType)
            .title("All languages")
            .schemaType(schemaType)
            .filter(`_type == $type`)
            .params({ type: schemaType })
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),
    ]);
}

function categoryList(S: StructureBuilder, title: string, category: string) {
  return S.listItem()
    .title(title)
    .child(
      S.documentTypeList("blogPost")
        .title(title)
        .schemaType("blogPost")
        .filter(`_type == "blogPost" && coalesce(language, "en") == "en" && category == $category`)
        .params({ category })
        .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        .initialValueTemplates([S.initialValueTemplateItem("blogPost-en", { language: "en", category })]),
    );
}

function singletonLanguageList(S: StructureBuilder, schemaType: LocalizedSingletonType, title: string) {
  return S.list()
    .title(title)
    .items(
      languages.map((language) =>
        S.listItem()
          .title(language.title)
          .child(
            S.document()
              .schemaType(schemaType)
              .documentId(singletonIds[schemaType][language.id as keyof (typeof singletonIds)[LocalizedSingletonType]])
              .title(`${title} - ${language.title}`),
          ),
      ),
    );
}

const hiddenDefaultTypes = new Set([
  "siteSettings",
  "homePage",
  "productCategory",
  "product",
  "solution",
  "project",
  "blogPost",
  "contentPage",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("INTCO Content")
    .items([
      S.listItem()
        .title("Products")
        .child(
          S.list()
            .title("Products")
            .items([
              S.listItem()
                .title("Products - English")
                .child(localizedList(S, "product", "Products - English", "en", [{ field: "title", direction: "asc" }])),
              S.listItem()
                .title("Product Categories - English")
                .child(localizedList(S, "productCategory", "Product Categories - English", "en", [{ field: "order", direction: "asc" }])),
              S.divider(),
              S.listItem().title("Products by language").child(allLanguageList(S, "product", "Products by language")),
              S.listItem().title("Categories by language").child(allLanguageList(S, "productCategory", "Categories by language")),
            ]),
        ),
      S.listItem()
        .title("News & Blog")
        .child(
          S.list()
            .title("News & Blog")
            .items([
              S.listItem()
                .title("All English posts")
                .child(localizedList(S, "blogPost", "All English posts", "en", [{ field: "publishedAt", direction: "desc" }])),
              S.divider(),
              categoryList(S, "Expo", "Expo"),
              categoryList(S, "Industry News", "Industry News"),
              categoryList(S, "Inspiration", "Inspiration"),
              categoryList(S, "New Products", "New Products"),
              categoryList(S, "Press Release", "Press Release"),
              categoryList(S, "Tips", "Tips"),
              S.divider(),
              S.listItem().title("Posts by language").child(allLanguageList(S, "blogPost", "Posts by language")),
            ]),
        ),
      S.listItem()
        .title("Projects")
        .child(allLanguageList(S, "project", "Projects")),
      S.listItem()
        .title("Solutions")
        .child(allLanguageList(S, "solution", "Solutions")),
      S.listItem()
        .title("Pages")
        .child(allLanguageList(S, "contentPage", "Pages")),
      S.divider(),
      S.listItem()
        .title("Home Page")
        .child(singletonLanguageList(S, "homePage", "Home Page")),
      S.listItem()
        .title("Site Settings")
        .child(singletonLanguageList(S, "siteSettings", "Site Settings")),
      S.divider(),
      S.listItem()
        .title("Advanced - all document types")
        .child(
          S.list()
            .title("Advanced")
            .items(S.documentTypeListItems().filter((item) => item.getId() && !hiddenDefaultTypes.has(item.getId()!))),
        ),
    ]);
