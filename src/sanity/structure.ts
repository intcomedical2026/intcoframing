import type { StructureBuilder, StructureResolver } from "sanity/structure";

const languages = [
  { id: "en", title: "English" },
  { id: "es", title: "Spanish" },
  { id: "pt", title: "Portuguese" },
  { id: "fr", title: "French" },
  { id: "de", title: "German" },
  { id: "ja", title: "Japanese" },
];

const productCategoryGroups = [
  {
    title: "Mirror",
    slug: "mirror",
    children: [
      { title: "Wall Mirror", slug: "wall-mirror" },
      { title: "Standing Mirror", slug: "standing-mirror" },
      { title: "Leaner Mirror", slug: "leaner-mirror" },
      { title: "Door Mirror", slug: "door-mirror" },
      { title: "LED Mirror", slug: "led-mirror" },
    ],
  },
  {
    title: "Picture Frame",
    slug: "picture-frame",
    children: [
      { title: "Tabletop Frame", slug: "tabletop-frame" },
      { title: "Wall Frame", slug: "wall-frame" },
      { title: "Poster Frame", slug: "poster-frame" },
      { title: "Document Frame", slug: "document-frame" },
      { title: "Shadow Box", slug: "shadow-box" },
      { title: "Collage Frame", slug: "collage-frame" },
    ],
  },
  {
    title: "Art",
    slug: "art",
    children: [
      { title: "Framed Art", slug: "framed-art" },
      { title: "Canvas Art", slug: "canvas-art" },
      { title: "Alternative Wall Decor", slug: "alternative-wall-decor" },
    ],
  },
  {
    title: "Furniture",
    slug: "furniture",
    children: [
      { title: "Medicine Cabinet", slug: "medicine-cabinet" },
      { title: "Shelf", slug: "shelf" },
    ],
  },
  {
    title: "Memo Board",
    slug: "memo-board",
    children: [
      { title: "Chalkboard", slug: "chalkboard" },
      { title: "Dry Erase Board", slug: "dry-erase-board" },
      { title: "Cork Board", slug: "cork-board" },
      { title: "Linen Board", slug: "linen-board" },
    ],
  },
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

function dailyList(
  S: StructureBuilder,
  schemaType: string,
  title: string,
  ordering: Array<{ field: string; direction: "asc" | "desc" }> = [{ field: "_updatedAt", direction: "desc" }],
) {
  return localizedList(S, schemaType, title, "en", ordering);
}

function productCategoryDocumentList(
  S: StructureBuilder,
  title: string,
  categorySlug: string,
  initialCategorySlugs: string[] = [categorySlug],
  mainCategorySlug = categorySlug,
) {
  return S.documentTypeList("product")
    .title(title)
    .schemaType("product")
    .filter(`_type == "product" && coalesce(language, "en") == "en" && $categorySlug in categorySlugs`)
    .params({ categorySlug })
    .defaultOrdering([{ field: "title", direction: "asc" }])
    .initialValueTemplates([S.initialValueTemplateItem("product-en", { language: "en", categorySlugs: initialCategorySlugs, mainCategorySlug })]);
}

function productCategoryListItem(S: StructureBuilder, category: (typeof productCategoryGroups)[number]) {
  return S.listItem()
    .title(category.title)
    .child(
      S.list()
        .title(category.title)
        .items([
          S.listItem()
            .title(`All ${category.title} Products`)
            .child(productCategoryDocumentList(S, `All ${category.title} Products`, category.slug)),
          S.divider(),
          ...category.children.map((child) =>
            S.listItem()
              .title(child.title)
              .child(productCategoryDocumentList(S, child.title, child.slug, [category.slug, child.slug], category.slug)),
          ),
        ]),
    );
}

function productsDashboard(S: StructureBuilder) {
  return S.list()
    .title("Products")
    .items([
      S.listItem()
        .title("All Products")
        .child(dailyList(S, "product", "All Products", [{ field: "title", direction: "asc" }])),
      S.listItem()
        .title("Uncategorized")
        .child(
          S.documentTypeList("product")
            .title("Uncategorized Products")
            .schemaType("product")
            .filter(`_type == "product" && coalesce(language, "en") == "en" && (!defined(categorySlugs) || count(categorySlugs) == 0)`)
            .defaultOrdering([{ field: "title", direction: "asc" }])
            .initialValueTemplates([S.initialValueTemplateItem("product-en", { language: "en" })]),
        ),
      S.divider(),
      ...productCategoryGroups.map((category) => productCategoryListItem(S, category)),
    ]);
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
    .title("INTCO Studio")
    .items([
      S.listItem()
        .title("Start Here")
        .child(
          S.list()
            .title("Start Here")
            .items([
              S.listItem()
                .title("Add or Edit Products")
                .child(productsDashboard(S)),
              S.listItem()
                .title("Add or Edit News")
                .child(dailyList(S, "blogPost", "News", [{ field: "publishedAt", direction: "desc" }])),
              S.listItem()
                .title("Product Categories")
                .child(dailyList(S, "productCategory", "Product Categories", [{ field: "order", direction: "asc" }])),
              S.divider(),
              S.listItem()
                .title("Home Page")
                .child(
                  S.document()
                    .schemaType("homePage")
                    .documentId(singletonIds.homePage.en)
                    .title("Home Page"),
                ),
              S.listItem()
                .title("Site Settings")
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId(singletonIds.siteSettings.en)
                    .title("Site Settings"),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Products")
        .child(productsDashboard(S)),
      S.listItem()
        .title("News")
        .child(
          S.list()
            .title("News")
            .items([
              S.listItem()
                .title("All News")
                .child(dailyList(S, "blogPost", "All News", [{ field: "publishedAt", direction: "desc" }])),
              S.divider(),
              categoryList(S, "Expo", "Expo"),
              categoryList(S, "Industry News", "Industry News"),
              categoryList(S, "Inspiration", "Inspiration"),
              categoryList(S, "New Products", "New Products"),
              categoryList(S, "Press Release", "Press Release"),
              categoryList(S, "Tips", "Tips"),
            ]),
        ),
      S.listItem()
        .title("Categories")
        .child(dailyList(S, "productCategory", "Product Categories", [{ field: "order", direction: "asc" }])),
      S.listItem()
        .title("Projects")
        .child(dailyList(S, "project", "Projects", [{ field: "title", direction: "asc" }])),
      S.listItem()
        .title("Solutions")
        .child(dailyList(S, "solution", "Solutions", [{ field: "order", direction: "asc" }])),
      S.divider(),
      S.listItem()
        .title("Advanced")
        .child(
          S.list()
            .title("Advanced")
            .items([
              S.listItem()
                .title("Products by language")
                .child(allLanguageList(S, "product", "Products by language")),
              S.listItem()
                .title("Categories by language")
                .child(allLanguageList(S, "productCategory", "Categories by language")),
              S.listItem()
                .title("News by language")
                .child(allLanguageList(S, "blogPost", "News by language")),
              S.listItem()
                .title("Projects by language")
                .child(allLanguageList(S, "project", "Projects by language")),
              S.listItem()
                .title("Solutions by language")
                .child(allLanguageList(S, "solution", "Solutions by language")),
              S.listItem()
                .title("Pages by language")
                .child(allLanguageList(S, "contentPage", "Pages by language")),
              S.divider(),
              S.listItem()
                .title("Home Page by language")
                .child(singletonLanguageList(S, "homePage", "Home Page")),
              S.listItem()
                .title("Site Settings by language")
                .child(singletonLanguageList(S, "siteSettings", "Site Settings")),
              S.divider(),
              S.listItem()
                .title("Developer tools")
                .child(
                  S.list()
                    .title("Developer tools")
                    .items(S.documentTypeListItems().filter((item) => item.getId() && !hiddenDefaultTypes.has(item.getId()!))),
                ),
            ]),
        ),
    ]);
