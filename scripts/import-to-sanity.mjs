import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const allLocales = ["en", "es", "pt", "fr", "de", "ja"];
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o10sbz2i";
const dataset = args.dataset || process.env.SANITY_IMPORT_DATASET || process.env.SANITY_TARGET_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-20";
const token = process.env.SANITY_API_TOKEN;
const seedPath = path.resolve("sanity/seed/intcoframing.seed.json");
const localizedSeedPath = path.resolve("sanity/seed/intcoframing.localized.json");
const dryRun = args.dryRun || process.env.SANITY_IMPORT_DRY_RUN === "true";
const uploadAssets = !dryRun && process.env.SANITY_UPLOAD_ASSETS === "true";
const importLocales = normalizeLocales(args.locales || process.env.SANITY_IMPORT_LOCALES || "en,es,pt,fr,de,ja");
const reportPath = path.resolve(args.report || `reports/launch/sanity-import-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);

if (!dryRun && dataset === "production" && process.env.SANITY_ALLOW_PRODUCTION_IMPORT !== "true") {
  console.error("Refusing to import into production without SANITY_ALLOW_PRODUCTION_IMPORT=true.");
  console.error("Run a staging import first, then explicitly opt in before production import.");
  process.exit(1);
}

if (!dryRun && !token) {
  console.error("SANITY_API_TOKEN is required to import content.");
  console.error("Create a Sanity token with Editor permissions and put it in .env.local or the shell environment.");
  process.exit(1);
}

const client = dryRun
  ? undefined
  : createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });

const seed = JSON.parse(await fs.readFile(seedPath, "utf8"));
const localizedSeed = JSON.parse(await fs.readFile(localizedSeedPath, "utf8"));
const assetCache = new Map();

const socialProfiles = [
  "https://www.facebook.com/IntcoFraming.cn/",
  "https://www.youtube.com/@intcoframing",
  "https://www.linkedin.com/company/intcoframing/",
  "https://twitter.com/intco_framing",
  "https://www.instagram.com/intcoframing/",
  "https://www.pinterest.com/intco_framing/",
];

const inquiryFormByType = {
  siteSettings: "site-contact",
  homePage: "site-contact",
  productCategory: "category-inquiry",
  product: "product-inquiry",
  solution: "solution-inquiry",
  project: "project-inquiry",
  contentPage: "page-inquiry",
};

const intelligenceDocTypes = new Set(["siteSettings", "homePage", "productCategory", "solution", "project", "contentPage"]);
const evidenceCollectedAt = "2026-05-28";
const contentReviewedAt = "2026-05-29T00:00:00.000Z";

const faqTemplates = {
  en: {
    overviewQuestion: (title) => `What information does ${title} provide for buyers?`,
    overviewAnswer: (_title, description) =>
      `${ensurePeriod(description || "INTCO Framing provides interior decoration products, manufacturing services, and project support for retail and commercial buyers")} This page helps buyers compare options, understand INTCO Framing capabilities, and request specifications, samples, catalogs, or project support.`,
    inquiryQuestion: (title) => `How can I request details about ${title}?`,
    inquiryAnswer: "Use the inquiry form, live chat, phone, or email on this website. INTCO Framing can follow up with product details, samples, catalogs, and project support.",
    requirementsQuestion: (title) => `What should I include in a ${title} inquiry?`,
    requirementsAnswer:
      "Include the intended product or category, quantity, size, material, target market, timeline, destination, and whether you need samples, catalog files, or project support. This helps INTCO Framing route the request and respond with useful next steps.",
  },
  es: {
    overviewQuestion: (title) => `¿Qué información ofrece ${title} para compradores?`,
    overviewAnswer: (_title, description) =>
      `${ensurePeriod(description || "INTCO Framing ofrece productos de decoración interior, servicios de fabricación y soporte de proyectos para compradores minoristas y comerciales")} Esta página ayuda a comparar opciones, entender las capacidades de INTCO Framing y solicitar especificaciones, muestras, catálogos o soporte de proyecto.`,
    inquiryQuestion: (title) => `¿Cómo puedo solicitar detalles sobre ${title}?`,
    inquiryAnswer: "Use el formulario de consulta, el chat en vivo, el teléfono o el correo electrónico del sitio. INTCO Framing puede enviar detalles de producto, muestras, catálogos y soporte de proyecto.",
    requirementsQuestion: (title) => `¿Qué debo incluir en una consulta sobre ${title}?`,
    requirementsAnswer:
      "Incluya el producto o categoría prevista, cantidad, tamaño, material, mercado objetivo, calendario, destino y si necesita muestras, archivos de catálogo o soporte de proyecto. Esto ayuda a INTCO Framing a dirigir la solicitud y responder con próximos pasos útiles.",
  },
  pt: {
    overviewQuestion: (title) => `Quais informações ${title} oferece aos compradores?`,
    overviewAnswer: (_title, description) =>
      `${ensurePeriod(description || "A INTCO Framing oferece produtos de decoração de interiores, serviços de fabricação e suporte a projetos para compradores de varejo e comerciais")} Esta página ajuda compradores a comparar opções, entender as capacidades da INTCO Framing e solicitar especificações, amostras, catálogos ou suporte ao projeto.`,
    inquiryQuestion: (title) => `Como posso solicitar detalhes sobre ${title}?`,
    inquiryAnswer: "Use o formulário de consulta, chat ao vivo, telefone ou e-mail do site. A INTCO Framing pode enviar detalhes de produto, amostras, catálogos e suporte ao projeto.",
    requirementsQuestion: (title) => `O que devo incluir em uma consulta sobre ${title}?`,
    requirementsAnswer:
      "Inclua o produto ou categoria pretendida, quantidade, tamanho, material, mercado-alvo, prazo, destino e se precisa de amostras, arquivos de catálogo ou suporte ao projeto. Isso ajuda a INTCO Framing a encaminhar a solicitação e responder com próximos passos úteis.",
  },
  fr: {
    overviewQuestion: (title) => `Quelles informations ${title} fournit-il aux acheteurs ?`,
    overviewAnswer: (_title, description) =>
      `${ensurePeriod(description || "INTCO Framing fournit des produits de décoration intérieure, des services de fabrication et un accompagnement projet pour les acheteurs retail et commerciaux")} Cette page aide les acheteurs à comparer les options, comprendre les capacités d'INTCO Framing et demander des spécifications, échantillons, catalogues ou un accompagnement projet.`,
    inquiryQuestion: (title) => `Comment demander des détails sur ${title} ?`,
    inquiryAnswer: "Utilisez le formulaire de demande, le chat en direct, le téléphone ou l'e-mail du site. INTCO Framing peut transmettre des détails produit, des échantillons, des catalogues et un accompagnement projet.",
    requirementsQuestion: (title) => `Que faut-il inclure dans une demande sur ${title} ?`,
    requirementsAnswer:
      "Indiquez le produit ou la catégorie visée, la quantité, la taille, le matériau, le marché cible, le calendrier, la destination et si vous souhaitez des échantillons, fichiers catalogue ou un accompagnement projet. Cela aide INTCO Framing à orienter la demande.",
  },
  de: {
    overviewQuestion: (title) => `Welche Informationen bietet ${title} für Käufer?`,
    overviewAnswer: (_title, description) =>
      `${ensurePeriod(description || "INTCO Framing bietet Produkte für Innendekoration, Fertigungsservices und Projektunterstützung für Retail- und Gewerbekäufer")} Diese Seite hilft Käufern, Optionen zu vergleichen, INTCO Framing Fähigkeiten zu verstehen und Spezifikationen, Muster, Kataloge oder Projektunterstützung anzufordern.`,
    inquiryQuestion: (title) => `Wie kann ich Details zu ${title} anfragen?`,
    inquiryAnswer: "Nutzen Sie das Anfrageformular, den Live-Chat, Telefon oder E-Mail auf dieser Website. INTCO Framing kann Produktdetails, Muster, Kataloge und Projektunterstützung bereitstellen.",
    requirementsQuestion: (title) => `Was gehört in eine Anfrage zu ${title}?`,
    requirementsAnswer:
      "Nennen Sie Produkt oder Kategorie, Menge, Größe, Material, Zielmarkt, Zeitplan, Zielort und ob Sie Muster, Katalogdateien oder Projektunterstützung benötigen. So kann INTCO Framing die Anfrage richtig zuordnen und hilfreiche nächste Schritte liefern.",
  },
  ja: {
    overviewQuestion: (title) => `${title} はバイヤー向けに何を提供しますか？`,
    overviewAnswer: (_title, description) =>
      `${ensurePeriod(description || "INTCO Framing は小売・商業バイヤー向けに、インテリア装飾製品、製造サービス、プロジェクト支援を提供しています")} このページでは、選択肢の比較、INTCO Framing の対応力の確認、仕様・サンプル・カタログ・プロジェクト支援の問い合わせができます。`,
    inquiryQuestion: (title) => `${title} について詳しく問い合わせるには？`,
    inquiryAnswer: "サイト内の問い合わせフォーム、ライブチャット、電話、メールをご利用ください。INTCO Framing が製品情報、サンプル、カタログ、プロジェクト支援についてご案内します。",
    requirementsQuestion: (title) => `${title} の問い合わせには何を含めるべきですか？`,
    requirementsAnswer:
      "希望する製品またはカテゴリー、数量、サイズ、素材、対象市場、希望時期、納品先、サンプル・カタログファイル・プロジェクト支援の要否を記載してください。INTCO Framing が内容に応じて適切に確認し、次の対応をご案内します。",
  },
};

const evidenceTemplates = {
  en: {
    claim: (title) => `${title} content is based on INTCO Framing source material.`,
    methodology: "Content was migrated from the original INTCO Framing website and normalized for the refreshed multilingual site.",
    limitations: "Operational details, inventory, and availability should be confirmed through the inquiry form before purchase or project planning.",
  },
  es: {
    claim: (title) => `El contenido de ${title} se basa en material fuente de INTCO Framing.`,
    methodology: "El contenido se migró del sitio original de INTCO Framing y se normalizó para el sitio multilingüe renovado.",
    limitations: "Los detalles operativos, inventario y disponibilidad deben confirmarse mediante el formulario de consulta antes de la compra o planificación del proyecto.",
  },
  pt: {
    claim: (title) => `O conteúdo de ${title} é baseado em material fonte da INTCO Framing.`,
    methodology: "O conteúdo foi migrado do site original da INTCO Framing e normalizado para o site multilíngue renovado.",
    limitations: "Detalhes operacionais, estoque e disponibilidade devem ser confirmados pelo formulário de consulta antes da compra ou planejamento do projeto.",
  },
  fr: {
    claim: (title) => `Le contenu de ${title} s'appuie sur les sources INTCO Framing.`,
    methodology: "Le contenu a été migré depuis le site original INTCO Framing et normalisé pour le site multilingue rénové.",
    limitations: "Les détails opérationnels, stocks et disponibilités doivent être confirmés via le formulaire de demande avant achat ou planification de projet.",
  },
  de: {
    claim: (title) => `Der Inhalt von ${title} basiert auf Quellmaterial von INTCO Framing.`,
    methodology: "Die Inhalte wurden von der ursprünglichen INTCO Framing Website migriert und für die neue mehrsprachige Website normalisiert.",
    limitations: "Operative Details, Bestand und Verfügbarkeit sollten vor Kauf oder Projektplanung über das Anfrageformular bestätigt werden.",
  },
  ja: {
    claim: (title) => `${title} の内容は INTCO Framing の元情報に基づいています。`,
    methodology: "コンテンツは元の INTCO Framing サイトから移行し、リニューアル後の多言語サイト向けに整理しています。",
    limitations: "運用詳細、在庫、提供可否は、購入またはプロジェクト計画前に問い合わせフォームで確認してください。",
  },
};

async function loadEnvFile(filePath) {
  try {
    const raw = await fs.readFile(path.resolve(filePath), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index).trim();
      const value = unquoteEnvValue(trimmed.slice(index + 1).trim());
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function unquoteEnvValue(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--dry-run") {
      parsed.dryRun = true;
    } else if (value === "--dataset") {
      parsed.dataset = values[index + 1];
      index += 1;
    } else if (value.startsWith("--dataset=")) {
      parsed.dataset = value.slice("--dataset=".length);
    } else if (value === "--locales") {
      parsed.locales = values[index + 1];
      index += 1;
    } else if (value.startsWith("--locales=")) {
      parsed.locales = value.slice("--locales=".length);
    } else if (value === "--report") {
      parsed.report = values[index + 1];
      index += 1;
    } else if (value.startsWith("--report=")) {
      parsed.report = value.slice("--report=".length);
    } else if (value === "--skip-dataset-check") {
      parsed.skipDatasetCheck = true;
    }
  }
  return parsed;
}

function normalizeLocales(value) {
  const locales = String(value || "")
    .split(",")
    .map((locale) => locale.trim())
    .filter(Boolean);
  const invalid = locales.filter((locale) => !allLocales.includes(locale));
  if (invalid.length) {
    console.error(`Invalid locale(s): ${invalid.join(", ")}`);
    process.exit(1);
  }
  return locales.length ? locales : ["en"];
}

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

function localizeDocIdentity(doc, locale) {
  const copy = { ...doc };
  const baseId = copy._id;
  copy.language = locale;
  copy.translationGroup = copy.translationGroup || baseId;
  if (locale !== "en") {
    copy._id = localizedDocumentId(baseId, locale);
  }
  return copy;
}

function localizedDocumentId(baseId, locale) {
  return `i18n.${locale}.${baseId}`.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function deriveCommonFields(doc) {
  const copy = { ...doc };
  removeBlankUrlFields(copy);
  const docPath = copy.path || "/";
  const imageUrl = primaryImageUrl(copy);
  const fallbackDescription = overviewTextForDoc(copy);

  if (imageUrl && !copy.imageAlt && copy.title) {
    copy.imageAlt = copy.title;
  }

  if (copy.sourceUrl && !copy.legacyUrls?.length) {
    copy.legacyUrls = [copy.sourceUrl];
  }

  if (copy.publishedAt && !copy.datePublished) {
    copy.datePublished = copy.publishedAt;
  }
  if (!copy.dateModified) {
    copy.dateModified = copy.updatedAt || copy.publishedAt || contentReviewedAt;
  }

  copy.seo = {
    seoTitle: firstText(copy.seo?.seoTitle, copy.metaTitle, copy.title && `${copy.title} | INTCO Framing`),
    seoDescription: truncate(firstText(copy.seo?.seoDescription, copy.metaDescription, fallbackDescription), 155),
    canonicalPath: copy.seo?.canonicalPath || docPath,
    ogImageUrl: copy.seo?.ogImageUrl || imageUrl,
    imageAlt: copy.seo?.imageAlt || copy.imageAlt || copy.title,
    noIndex: copy.seo?.noIndex || false,
  };

  if (copy._type === "siteSettings") {
    copy.sameAs = copy.sameAs?.length ? copy.sameAs : socialProfiles;
    copy.contactPoints = copy.contactPoints?.length
      ? copy.contactPoints
      : [
          {
            contactType: "customer service",
            phone: copy.phone,
            email: copy.email,
            areaServed: "Global",
            availableLanguages: ["English", "Spanish", "Portuguese", "French", "German", "Japanese"],
          },
        ];
  }

  if (copy._type === "product") {
    copy.brand = copy.brand || "INTCO Framing";
    copy.sku = copy.sku || valueAfterLabel(copy.bodyText, ["Item#:", "Item #:", "SKU:"]);
    copy.material = copy.material || valueAfterLabel(copy.bodyText, ["Material:"]);
    copy.dimensions = copy.dimensions || valueAfterLabel(copy.bodyText, ["Size:", "Dimensions:"]);
    copy.offers = copy.offers?.length
      ? copy.offers
      : [
          {
            offerType: "inquiry",
            url: copy.path ? `${seed.siteSettings?.sourceSite || "https://www.intcoframing-us.com"}${copy.path}` : copy.sourceUrl,
            note: "Request pricing, samples, and availability through the product inquiry form.",
          },
        ];
  }

  const formId = inquiryFormByType[copy._type];
  if (formId && copy._type !== "siteSettings" && copy._type !== "blogPost") {
    copy.inquiryRouting = {
      inquiryFormId: copy.inquiryRouting?.inquiryFormId || formId,
      recipientEmail: copy.inquiryRouting?.recipientEmail || seed.siteSettings?.email,
      subjectPrefix: copy.inquiryRouting?.subjectPrefix || `[INTCO] ${copy.title || copy._type}`,
      crmPipeline: copy.inquiryRouting?.crmPipeline || "website-inquiry",
      successMessage: copy.inquiryRouting?.successMessage || "Thank you. The INTCO Framing team will contact you soon.",
    };
  }

  if (intelligenceDocTypes.has(copy._type)) {
    copy.faqs = copy.faqs?.length ? copy.faqs : defaultFaqsForDoc(copy, fallbackDescription);
    copy.evidence = copy.evidence?.length ? copy.evidence : defaultEvidenceForDoc(copy);
  }

  return copy;
}

function defaultFaqsForDoc(doc, fallbackDescription) {
  const locale = allLocales.includes(doc.language) ? doc.language : "en";
  const templates = faqTemplates[locale];
  const title = doc.title || seed.siteSettings?.title || "INTCO Framing";
  const description = truncatePlain(firstText(fallbackDescription, doc.description, doc.excerpt, meaningfulBodyText(doc.bodyText), seed.siteSettings?.description), 260);
  return [
    {
      question: templates.overviewQuestion(title),
      answer: templates.overviewAnswer(title, description),
      anchorId: "overview",
    },
    {
      question: templates.inquiryQuestion(title),
      answer: templates.inquiryAnswer,
      anchorId: "inquiry",
    },
    {
      question: templates.requirementsQuestion(title),
      answer: templates.requirementsAnswer,
      anchorId: "inquiry-details",
    },
  ];
}

function defaultEvidenceForDoc(doc) {
  const locale = allLocales.includes(doc.language) ? doc.language : "en";
  const templates = evidenceTemplates[locale];
  const title = doc.title || seed.siteSettings?.title || "INTCO Framing";
  return [
    {
      claim: templates.claim(title),
      methodology: templates.methodology,
      sourceName: "INTCO Framing source website",
      sourceUrl: doc.sourceUrl || seed.siteSettings?.sourceSite,
      collectedAt: evidenceCollectedAt,
      limitations: templates.limitations,
    },
  ];
}

function removeBlankUrlFields(doc) {
  for (const field of ["logoUrl", "footerLogoUrl", "imageUrl", "navImageUrl", "sourceUrl"]) {
    if (typeof doc[field] === "string" && !doc[field].trim()) {
      delete doc[field];
    }
  }
  if (Array.isArray(doc.galleryUrls)) {
    doc.galleryUrls = doc.galleryUrls.filter((url) => typeof url === "string" && url.trim());
    if (!doc.galleryUrls.length) delete doc.galleryUrls;
  }
}

function primaryImageUrl(doc) {
  return doc.imageUrl || doc.navImageUrl || doc.logoUrl || doc.footerLogoUrl || doc.galleryUrls?.[0];
}

function firstText(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function overviewTextForDoc(doc) {
  return truncatePlain(firstText(doc.description, doc.excerpt, meaningfulBodyText(doc.bodyText), seed.siteSettings?.description), 260);
}

function meaningfulBodyText(bodyText) {
  if (!bodyText) return "";
  const ignored = /^(home|blog|contact|products|projects|solutions|about us|who we are|cookies?|we use cookies|accept|reject|search|popular posts|read more)$/i;
  const lines = String(bodyText)
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((line) => !ignored.test(line));
  return lines.find((line) => line.length >= 80) || lines.find((line) => line.length >= 40) || lines[0] || "";
}

function truncate(value, max) {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}...` : value;
}

function truncatePlain(value, max) {
  if (!value) return "";
  const normalized = String(value).replace(/\s+/g, " ").replace(/\.{3,}$/g, "").trim();
  if (normalized.length <= max) return normalized;
  return normalized.slice(0, max).replace(/\s+\S*$/g, "").replace(/[,:;，、。]+$/g, "").trim();
}

function ensurePeriod(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return /[.!?。！？]$/.test(text) ? text : `${text}.`;
}

function valueAfterLabel(bodyText, labels) {
  if (!bodyText) return undefined;
  const lines = String(bodyText)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  for (const label of labels) {
    const index = lines.findIndex((line) => line.toLowerCase() === label.toLowerCase());
    if (index >= 0 && lines[index + 1]) return lines[index + 1];
    const inline = lines.find((line) => line.toLowerCase().startsWith(label.toLowerCase()));
    if (inline) {
      const value = inline.slice(label.length).trim();
      if (value) return value;
    }
  }
  return undefined;
}

async function withImages(doc) {
  const copy = withArrayItemKeys(deriveCommonFields(slugifyDoc(doc)));

  if (copy.logoUrl) copy.logo = await uploadImage(copy.logoUrl, "logo");
  if (copy.footerLogoUrl) copy.footerLogo = await uploadImage(copy.footerLogoUrl, "footer-logo");
  if (copy.imageUrl) copy.image = await uploadImage(copy.imageUrl, copy.slug?.current || copy.title);
  if (copy.navImageUrl) copy.navImage = await uploadImage(copy.navImageUrl, `${copy.title}-nav`);
  if (copy.seo?.ogImageUrl) copy.seo.ogImage = await uploadImage(copy.seo.ogImageUrl, `${copy.slug?.current || copy.title}-og`);

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

function withArrayItemKeys(value, pathSegments = []) {
  if (Array.isArray(value)) {
    const usedKeys = new Set();
    return value.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const keyedItem = withArrayItemKeys(item, [...pathSegments, String(index)]);
      const existingKey = typeof keyedItem._key === "string" && keyedItem._key.trim() ? keyedItem._key.trim() : undefined;
      const fallbackKey = stableArrayKey(pathSegments, index, keyedItem);
      const key = uniqueArrayKey(existingKey || fallbackKey, usedKeys);
      return { ...keyedItem, _key: key };
    });
  }

  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, withArrayItemKeys(child, [...pathSegments, key])]),
  );
}

function stableArrayKey(pathSegments, index, item) {
  const payload = JSON.stringify({ path: pathSegments.join("."), index, item: { ...item, _key: undefined } });
  return `k${crypto.createHash("sha1").update(payload).digest("hex").slice(0, 11)}`;
}

function uniqueArrayKey(key, usedKeys) {
  let candidate = key;
  let suffix = 1;
  while (usedKeys.has(candidate)) {
    candidate = `${key}${suffix}`;
    suffix += 1;
  }
  usedKeys.add(candidate);
  return candidate;
}

async function commitInBatches(docs, size = 25) {
  if (!client) throw new Error("Cannot commit without a Sanity client.");
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

function docsForLocale(locale) {
  const source = locale === "en" ? seed : localizedSeed[locale];
  if (!source) {
    console.error(`Missing localized seed for locale ${locale}.`);
    process.exit(1);
  }
  return [
    source.siteSettings,
    source.homePage,
    ...source.productCategories,
    ...source.products,
    ...source.solutions,
    ...source.projects,
    ...source.blogPosts,
    ...source.pages,
  ].map((doc) => localizeDocIdentity(doc, locale));
}

function summarizePreparedDocs(docs) {
  const counts = {};
  const missing = {
    seo: 0,
    imageAlt: 0,
    legacyUrls: 0,
    language: 0,
    translationGroup: 0,
  };
  const productSpecs = {
    total: 0,
    sku: 0,
    brand: 0,
    material: 0,
    dimensions: 0,
    offers: 0,
  };
  const intelligence = {
    faqs: 0,
    evidence: 0,
  };

  for (const doc of docs) {
    counts[doc.language] ||= {};
    counts[doc.language][doc._type] = (counts[doc.language][doc._type] || 0) + 1;
    if (!doc.seo?.seoTitle || !doc.seo?.seoDescription || !doc.seo?.canonicalPath) missing.seo += 1;
    if (doc.imageUrl && !doc.imageAlt) missing.imageAlt += 1;
    if (doc.sourceUrl && !doc.legacyUrls?.length) missing.legacyUrls += 1;
    if (!doc.language) missing.language += 1;
    if (!doc.translationGroup) missing.translationGroup += 1;
    if (doc.faqs?.length) intelligence.faqs += 1;
    if (doc.evidence?.length) intelligence.evidence += 1;
    if (doc._type === "product") {
      productSpecs.total += 1;
      if (doc.sku) productSpecs.sku += 1;
      if (doc.brand) productSpecs.brand += 1;
      if (doc.material) productSpecs.material += 1;
      if (doc.dimensions) productSpecs.dimensions += 1;
      if (doc.offers?.length) productSpecs.offers += 1;
    }
  }

  return {
    projectId,
    dataset,
    apiVersion,
    ok: true,
    dryRun,
    uploadAssets,
    locales: importLocales,
    totalDocuments: docs.length,
    counts,
    missing,
    productSpecs,
    intelligence,
  };
}

async function assertDatasetExists() {
  if (!client || args.skipDatasetCheck) return;

  try {
    await client.fetch("count(*[0...1])");
  } catch (error) {
    const summary = {
      projectId,
      dataset,
      apiVersion,
      ok: false,
      dryRun,
      uploadAssets,
      locales: importLocales,
      totalDocuments: 0,
      error: {
        message: `Could not query dataset "${dataset}" before import. Create it first, or pass --skip-dataset-check only if you have separately confirmed it exists.`,
        originalMessage: error.message,
        statusCode: error.statusCode,
        traceId: error.traceId,
        responseMessage: error.response?.body?.message,
      },
    };
    await writeReport(summary);
    console.error(`Could not verify Sanity dataset before import: ${summary.error.responseMessage || error.message}`);
    process.exit(1);
  }
}

async function writeReport(summary) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(`Wrote import report to ${reportPath}`);
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

const docs = importLocales.flatMap(docsForLocale);

if (!dryRun) {
  await assertDatasetExists();
}

console.log(
  `${dryRun ? "Preparing" : uploadAssets ? "Uploading images and importing" : "Importing"} ${docs.length} documents (${importLocales.join(", ")}) to ${projectId}/${dataset}...`,
);
const prepared = [];
for (const doc of docs) {
  prepared.push(await withImages(doc));
}
const summary = summarizePreparedDocs(prepared);
await writeReport(summary);
if (dryRun) {
  console.log("Dry run complete. No Sanity documents were written.");
  process.exit(0);
}
await commitInBatches(prepared);
console.log("Sanity import complete.");
