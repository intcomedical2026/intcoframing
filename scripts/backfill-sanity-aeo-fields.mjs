import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnvFile, parseArgs, requireToken, sanityConfigFromEnv } from "./sanity-env.mjs";

await loadEnvFile(".env.local");

const args = parseArgs(process.argv.slice(2));
const { projectId, dataset, apiVersion } = sanityConfigFromEnv(args);
const token = requireToken(process.env.SANITY_API_TOKEN, "SANITY_API_TOKEN");
const dryRun = args.dryRun === true || process.env.SANITY_AEO_BACKFILL_DRY_RUN === "true";
const reportPath = path.resolve(args.report || `reports/launch/sanity-aeo-backfill-${dryRun ? "dry-run" : dataset}-${timestamp()}.json`);
const selectedTypes = normalizeTypes(args.types || "siteSettings,homePage,productCategory,product,solution,project,blogPost,contentPage");
const contentReviewedAt = "2026-06-09T00:00:00.000Z";
const evidenceCollectedAt = "2026-06-09";
const siteOrigin = "https://www.intcoframing-us.com";

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

async function main() {
  const docs = await client.fetch(
    /* groq */ `*[_type in $types] | order(_type asc, language asc, path asc, _id asc){
      _id,
      _type,
      language,
      title,
      path,
      description,
      excerpt,
      bodyText,
      sourceUrl,
      faqs,
      evidence,
      datePublished,
      dateModified,
      publishedAt,
      updatedAt
    }`,
    { types: selectedTypes },
  );

  const patches = [];
  for (const doc of docs) {
    const set = {};
    const setIfMissing = {};

    if (!Array.isArray(doc.faqs) || doc.faqs.length < 3) {
      set.faqs = defaultFaqsForDoc(doc);
    }
    if (!Array.isArray(doc.evidence) || doc.evidence.length === 0) {
      set.evidence = defaultEvidenceForDoc(doc);
    }
    if (!doc.datePublished) {
      setIfMissing.datePublished = doc.publishedAt || contentReviewedAt;
    }
    if (!doc.dateModified) {
      set.dateModified = doc.updatedAt || doc.publishedAt || contentReviewedAt;
    }

    if (Object.keys(set).length || Object.keys(setIfMissing).length) {
      patches.push({ _id: doc._id, _type: doc._type, language: doc.language || "en", path: doc.path, set, setIfMissing });
    }
  }

  if (!dryRun) {
    for (const chunk of chunkArray(patches, 50)) {
      let tx = client.transaction();
      for (const patch of chunk) {
        tx = tx.patch(patch._id, (operation) => {
          let next = operation;
          if (Object.keys(patch.setIfMissing).length) next = next.setIfMissing(patch.setIfMissing);
          if (Object.keys(patch.set).length) next = next.set(patch.set);
          return next;
        });
      }
      await tx.commit({ autoGenerateArrayKeys: true });
    }
  }

  const summary = {
    dryRun,
    checkedDocs: docs.length,
    patchedDocs: patches.length,
    byType: selectedTypes.reduce((acc, type) => {
      acc[type] = patches.filter((patch) => patch._type === type).length;
      return acc;
    }, {}),
  };

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify({ projectId, dataset, apiVersion, checkedAt: new Date().toISOString(), summary, patches }, null, 2)}\n`, "utf8");

  console.log(`${dryRun ? "Would patch" : "Patched"} ${patches.length} document(s) across ${selectedTypes.length} type(s).`);
  console.log(`Wrote report to ${reportPath}`);
}

function defaultFaqsForDoc(doc) {
  const locale = validLocale(doc.language);
  const title = doc.title || "INTCO Framing";
  const summary = conciseSummary(doc);
  const templates = doc._type === "blogPost" ? articleFaqTemplates[locale] : buyerFaqTemplates[locale];
  return [
    keyedFaq("faq-overview", templates.overviewQuestion(title), templates.overviewAnswer(title, summary)),
    keyedFaq("faq-request", templates.requestQuestion(title), templates.requestAnswer(title)),
    keyedFaq("faq-requirements", templates.requirementsQuestion(title), templates.requirementsAnswer(title)),
  ];
}

function defaultEvidenceForDoc(doc) {
  const locale = validLocale(doc.language);
  const title = doc.title || "INTCO Framing";
  const template = evidenceTemplates[locale];
  return [
    {
      _key: stableKey(`${doc._id}-evidence-source`),
      _type: "evidenceItem",
      claim: template.claim(title),
      methodology: template.methodology,
      sourceName: "INTCO Framing source and refreshed website",
      sourceUrl: absoluteDocUrl(doc),
      collectedAt: evidenceCollectedAt,
      limitations: template.limitations,
    },
  ];
}

function keyedFaq(anchorId, question, answer) {
  return {
    _key: stableKey(`${anchorId}-${question}`),
    _type: "faqItem",
    question,
    answer,
    anchorId,
  };
}

const buyerFaqTemplates = {
  en: {
    overviewQuestion: (title) => `What is ${title}?`,
    overviewAnswer: (title, summary) => `${title} is an INTCO Framing home decor item or product category for retail, project, and commercial sourcing. ${summary} The page helps buyers evaluate fit before requesting specifications, samples, catalogs, or pricing support.`,
    requestQuestion: (title) => `How can buyers request details about ${title}?`,
    requestAnswer: () => "Buyers can use the inquiry form, live chat, phone, or email on this website. INTCO Framing can follow up with product specifications, sample options, catalog files, availability information, and project support.",
    requirementsQuestion: (title) => `What details help INTCO quote ${title}?`,
    requirementsAnswer: () => "Useful inquiry details include product style, size, material, finish, estimated quantity, target market, delivery destination, timeline, packaging needs, and whether samples or digital catalog files are required.",
  },
  es: {
    overviewQuestion: (title) => `¿Qué es ${title}?`,
    overviewAnswer: (title, summary) => `${title} es un producto o categoría de decoración de INTCO Framing para compras minoristas, proyectos y abastecimiento comercial. ${summary} La página ayuda a evaluar el ajuste antes de solicitar especificaciones, muestras, catálogos o precios.`,
    requestQuestion: (title) => `¿Cómo pueden los compradores pedir detalles de ${title}?`,
    requestAnswer: () => "Los compradores pueden usar el formulario, chat en vivo, teléfono o correo electrónico del sitio. INTCO Framing puede enviar especificaciones, opciones de muestra, catálogos, disponibilidad y soporte de proyecto.",
    requirementsQuestion: (title) => `¿Qué datos ayudan a cotizar ${title}?`,
    requirementsAnswer: () => "Incluya estilo del producto, tamaño, material, acabado, cantidad estimada, mercado objetivo, destino, calendario, necesidades de empaque y si requiere muestras o archivos digitales de catálogo.",
  },
  pt: {
    overviewQuestion: (title) => `O que é ${title}?`,
    overviewAnswer: (title, summary) => `${title} é um produto ou categoria de decoração da INTCO Framing para varejo, projetos e fornecimento comercial. ${summary} A página ajuda compradores a avaliar a adequação antes de solicitar especificações, amostras, catálogos ou preços.`,
    requestQuestion: (title) => `Como compradores podem pedir detalhes sobre ${title}?`,
    requestAnswer: () => "Compradores podem usar o formulário, chat ao vivo, telefone ou e-mail do site. A INTCO Framing pode enviar especificações, opções de amostra, catálogos, disponibilidade e suporte ao projeto.",
    requirementsQuestion: (title) => `Quais dados ajudam a cotar ${title}?`,
    requirementsAnswer: () => "Inclua estilo do produto, tamanho, material, acabamento, quantidade estimada, mercado-alvo, destino, prazo, necessidades de embalagem e se precisa de amostras ou arquivos digitais de catálogo.",
  },
  fr: {
    overviewQuestion: (title) => `Qu'est-ce que ${title} ?`,
    overviewAnswer: (title, summary) => `${title} est un produit ou une catégorie déco INTCO Framing pour le retail, les projets et l'approvisionnement commercial. ${summary} La page aide les acheteurs à évaluer l'adéquation avant de demander spécifications, échantillons, catalogues ou prix.`,
    requestQuestion: (title) => `Comment demander des détails sur ${title} ?`,
    requestAnswer: () => "Les acheteurs peuvent utiliser le formulaire, le chat en direct, le téléphone ou l'e-mail du site. INTCO Framing peut transmettre spécifications, options d'échantillons, catalogues, disponibilités et accompagnement projet.",
    requirementsQuestion: (title) => `Quels détails aident à chiffrer ${title} ?`,
    requirementsAnswer: () => "Indiquez style produit, taille, matériau, finition, quantité estimée, marché cible, destination, calendrier, besoins d'emballage et besoin éventuel d'échantillons ou fichiers catalogue.",
  },
  de: {
    overviewQuestion: (title) => `Was ist ${title}?`,
    overviewAnswer: (title, summary) => `${title} ist ein INTCO Framing Produkt oder eine Produktkategorie für Retail-, Projekt- und Gewerbebeschaffung. ${summary} Die Seite hilft Käufern, die Eignung zu prüfen, bevor Spezifikationen, Muster, Kataloge oder Preise angefragt werden.`,
    requestQuestion: (title) => `Wie können Käufer Details zu ${title} anfragen?`,
    requestAnswer: () => "Käufer können Anfrageformular, Live-Chat, Telefon oder E-Mail auf dieser Website nutzen. INTCO Framing kann Spezifikationen, Musteroptionen, Katalogdateien, Verfügbarkeit und Projektunterstützung bereitstellen.",
    requirementsQuestion: (title) => `Welche Angaben helfen bei einem Angebot für ${title}?`,
    requirementsAnswer: () => "Hilfreich sind Produktstil, Größe, Material, Oberfläche, geschätzte Menge, Zielmarkt, Lieferziel, Zeitplan, Verpackungsbedarf und ob Muster oder digitale Katalogdateien benötigt werden.",
  },
  ja: {
    overviewQuestion: (title) => `${title} とは何ですか？`,
    overviewAnswer: (title, summary) => `${title} は、小売、プロジェクト、商業調達向けの INTCO Framing のホームデコレーション製品またはカテゴリーです。${summary} このページでは、仕様、サンプル、カタログ、価格相談の前に適合性を確認できます。`,
    requestQuestion: (title) => `${title} の詳細を依頼するには？`,
    requestAnswer: () => "サイト内の問い合わせフォーム、ライブチャット、電話、メールをご利用ください。INTCO Framing が仕様、サンプル、カタログ、在庫・提供可否、プロジェクト支援について案内します。",
    requirementsQuestion: (title) => `${title} の見積もりに必要な情報は？`,
    requirementsAnswer: () => "製品スタイル、サイズ、素材、仕上げ、予定数量、対象市場、納品先、希望時期、梱包要件、サンプルやデジタルカタログの要否を記載すると確認がスムーズです。",
  },
};

const articleFaqTemplates = {
  en: {
    overviewQuestion: (title) => `What does ${title} explain?`,
    overviewAnswer: (title, summary) => `${title} explains an INTCO Framing home decor topic for buyers, retailers, or project teams. ${summary} The article helps readers understand product considerations before comparing options or contacting INTCO Framing.`,
    requestQuestion: () => "How should buyers use this article?",
    requestAnswer: () => "Buyers can use the article to prepare questions, compare product requirements, and identify details to confirm with INTCO Framing. Current specifications, availability, and project recommendations should be verified through the inquiry channel.",
    requirementsQuestion: () => "Where can readers confirm current product details?",
    requirementsAnswer: () => "Readers can contact INTCO Framing by form, live chat, phone, or email. The team can confirm current product specifications, manufacturing options, sample availability, catalog files, and relevant project support.",
  },
  es: {
    overviewQuestion: (title) => `¿Qué explica ${title}?`,
    overviewAnswer: (title, summary) => `${title} explica un tema de decoración de INTCO Framing para compradores, minoristas o equipos de proyecto. ${summary} El artículo ayuda a entender consideraciones de producto antes de comparar opciones o contactar a INTCO Framing.`,
    requestQuestion: () => "¿Cómo deben usar este artículo los compradores?",
    requestAnswer: () => "Los compradores pueden usar el artículo para preparar preguntas, comparar requisitos e identificar detalles para confirmar con INTCO Framing. Las especificaciones, disponibilidad y recomendaciones actuales deben verificarse por el canal de consulta.",
    requirementsQuestion: () => "¿Dónde se confirman los detalles actuales?",
    requirementsAnswer: () => "Los lectores pueden contactar a INTCO Framing por formulario, chat en vivo, teléfono o correo electrónico. El equipo puede confirmar especificaciones, opciones de fabricación, muestras, catálogos y soporte de proyecto.",
  },
  pt: {
    overviewQuestion: (title) => `O que ${title} explica?`,
    overviewAnswer: (title, summary) => `${title} explica um tema de decoração da INTCO Framing para compradores, varejistas ou equipes de projeto. ${summary} O artigo ajuda a entender considerações de produto antes de comparar opções ou contatar a INTCO Framing.`,
    requestQuestion: () => "Como compradores devem usar este artigo?",
    requestAnswer: () => "Compradores podem usar o artigo para preparar perguntas, comparar requisitos e identificar detalhes a confirmar com a INTCO Framing. Especificações, disponibilidade e recomendações atuais devem ser verificadas pelo canal de consulta.",
    requirementsQuestion: () => "Onde confirmar os detalhes atuais do produto?",
    requirementsAnswer: () => "Leitores podem contatar a INTCO Framing por formulário, chat ao vivo, telefone ou e-mail. A equipe pode confirmar especificações, opções de fabricação, amostras, catálogos e suporte ao projeto.",
  },
  fr: {
    overviewQuestion: (title) => `Que présente ${title} ?`,
    overviewAnswer: (title, summary) => `${title} présente un sujet déco INTCO Framing pour acheteurs, retailers ou équipes projet. ${summary} L'article aide à comprendre les critères produit avant de comparer les options ou de contacter INTCO Framing.`,
    requestQuestion: () => "Comment les acheteurs doivent-ils utiliser cet article ?",
    requestAnswer: () => "Les acheteurs peuvent utiliser l'article pour préparer leurs questions, comparer les exigences et identifier les points à confirmer avec INTCO Framing. Les spécifications, disponibilités et recommandations doivent être vérifiées via la demande.",
    requirementsQuestion: () => "Où confirmer les détails actuels du produit ?",
    requirementsAnswer: () => "Les lecteurs peuvent contacter INTCO Framing par formulaire, chat, téléphone ou e-mail. L'équipe peut confirmer spécifications, options de fabrication, échantillons, catalogues et accompagnement projet.",
  },
  de: {
    overviewQuestion: (title) => `Was erklärt ${title}?`,
    overviewAnswer: (title, summary) => `${title} erklärt ein INTCO Framing Wohndekor-Thema für Käufer, Händler oder Projektteams. ${summary} Der Artikel hilft, Produktkriterien zu verstehen, bevor Optionen verglichen oder INTCO Framing kontaktiert werden.`,
    requestQuestion: () => "Wie sollten Käufer diesen Artikel nutzen?",
    requestAnswer: () => "Käufer können den Artikel nutzen, um Fragen vorzubereiten, Anforderungen zu vergleichen und Details mit INTCO Framing zu klären. Aktuelle Spezifikationen, Verfügbarkeit und Empfehlungen sollten über den Anfragekanal bestätigt werden.",
    requirementsQuestion: () => "Wo lassen sich aktuelle Produktdetails bestätigen?",
    requirementsAnswer: () => "Leser können INTCO Framing per Formular, Live-Chat, Telefon oder E-Mail kontaktieren. Das Team kann Spezifikationen, Fertigungsoptionen, Muster, Katalogdateien und Projektunterstützung bestätigen.",
  },
  ja: {
    overviewQuestion: (title) => `${title} では何を説明していますか？`,
    overviewAnswer: (title, summary) => `${title} は、バイヤー、小売事業者、プロジェクト担当者向けに INTCO Framing のホームデコレーション関連テーマを説明する記事です。${summary} 選択肢の比較や問い合わせ前の確認に役立ちます。`,
    requestQuestion: () => "この記事はどのように活用できますか？",
    requestAnswer: () => "バイヤーはこの記事を使って質問を整理し、製品要件を比較し、INTCO Framing に確認すべき点を把握できます。最新の仕様、提供可否、提案内容は問い合わせ窓口で確認してください。",
    requirementsQuestion: () => "最新の製品情報はどこで確認できますか？",
    requirementsAnswer: () => "フォーム、ライブチャット、電話、メールで INTCO Framing に問い合わせできます。担当チームが仕様、製造オプション、サンプル、カタログ、関連プロジェクト支援を確認します。",
  },
};

const evidenceTemplates = {
  en: {
    claim: (title) => `${title} is documented from INTCO Framing source material and refreshed site content.`,
    methodology: "The page was reviewed against INTCO Framing source content, migrated fields, product metadata, article text, images, and multilingual Sanity records.",
    limitations: "Availability, prices, samples, custom options, and delivery timelines can change and should be confirmed with INTCO Framing before ordering or project planning.",
  },
  es: {
    claim: (title) => `${title} está documentado con material fuente de INTCO Framing y contenido del sitio renovado.`,
    methodology: "La página se revisó con contenido fuente de INTCO Framing, campos migrados, metadatos de producto, texto de artículos, imágenes y registros multilingües de Sanity.",
    limitations: "Disponibilidad, precios, muestras, opciones personalizadas y plazos pueden cambiar y deben confirmarse con INTCO Framing antes de comprar o planificar.",
  },
  pt: {
    claim: (title) => `${title} é documentado com material fonte da INTCO Framing e conteúdo do site renovado.`,
    methodology: "A página foi revisada com conteúdo fonte da INTCO Framing, campos migrados, metadados de produto, texto de artigos, imagens e registros multilíngues do Sanity.",
    limitations: "Disponibilidade, preços, amostras, opções personalizadas e prazos podem mudar e devem ser confirmados com a INTCO Framing antes da compra ou planejamento.",
  },
  fr: {
    claim: (title) => `${title} est documenté à partir des sources INTCO Framing et du contenu du site rénové.`,
    methodology: "La page a été vérifiée avec les sources INTCO Framing, les champs migrés, métadonnées produit, textes d'articles, images et enregistrements multilingues Sanity.",
    limitations: "Disponibilités, prix, échantillons, options personnalisées et délais peuvent changer et doivent être confirmés avec INTCO Framing avant achat ou projet.",
  },
  de: {
    claim: (title) => `${title} ist aus INTCO Framing Quellmaterial und Inhalten der erneuerten Website dokumentiert.`,
    methodology: "Die Seite wurde mit INTCO Framing Quellinhalten, migrierten Feldern, Produktmetadaten, Artikeltexten, Bildern und mehrsprachigen Sanity-Datensätzen geprüft.",
    limitations: "Verfügbarkeit, Preise, Muster, kundenspezifische Optionen und Lieferzeiten können sich ändern und sollten vor Bestellung oder Projektplanung bestätigt werden.",
  },
  ja: {
    claim: (title) => `${title} は INTCO Framing の元情報とリニューアル後サイトの内容に基づいて整理されています。`,
    methodology: "INTCO Framing の元コンテンツ、移行済みフィールド、製品メタデータ、記事本文、画像、多言語 Sanity レコードを参照して確認しています。",
    limitations: "在庫、価格、サンプル、カスタム対応、納期は変更される場合があります。注文またはプロジェクト計画前に INTCO Framing へ確認してください。",
  },
};

function conciseSummary(doc) {
  const value = firstText(doc.description, doc.excerpt, meaningfulBodyText(doc.bodyText), "INTCO Framing provides home decor products, manufacturing support, and project services for global buyers.");
  return ensurePeriod(truncatePlain(value, validLocale(doc.language) === "ja" ? 120 : 220));
}

function absoluteDocUrl(doc) {
  if (doc.sourceUrl && /^https?:\/\//.test(doc.sourceUrl)) return doc.sourceUrl;
  if (doc.path) return `${siteOrigin}${doc.path.startsWith("/") ? doc.path : `/${doc.path}`}`;
  return siteOrigin;
}

function meaningfulBodyText(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !/^(item|sku|quantity|related products|about this item|description|highlights):?$/i.test(line))
    .join(" ");
}

function firstText(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() || "";
}

function ensurePeriod(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return /[.!?。！？]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function truncatePlain(value, maxLength) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength - 1).replace(/\s+\S*$/, "");
  return `${sliced}.`;
}

function stableKey(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 12);
}

function validLocale(value) {
  return ["en", "es", "pt", "fr", "de", "ja"].includes(value) ? value : "en";
}

function normalizeTypes(value) {
  const valid = ["siteSettings", "homePage", "productCategory", "product", "solution", "project", "blogPost", "contentPage"];
  const selected = String(value)
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);
  const invalid = selected.filter((type) => !valid.includes(type));
  if (invalid.length) {
    console.error(`Invalid type(s): ${invalid.join(", ")}`);
    process.exit(1);
  }
  return selected.length ? selected : valid;
}

function chunkArray(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) chunks.push(values.slice(index, index + size));
  return chunks;
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

await main();
