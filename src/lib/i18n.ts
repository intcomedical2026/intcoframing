export const locales = ["en", "es", "pt", "fr", "de", "ja"] as const;
export const prefixedLocales = ["es", "pt", "fr", "de", "ja"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
};

const translations: Record<Locale, Record<string, string>> = {
  en: {
    perfectSolution: "Looking for the Perfect Solution?",
    contactToday: "Contact us today for your decor solution needs.",
    contactUs: "Contact Us",
    product: "Product",
    quickLinks: "Quick Links",
    newsletter: "Newsletter",
    newsletterText: "Premier interior decoration manufacturing updates, category launches and solution insights.",
    latestProducts: "Latest Products",
    solutions: "Solutions",
    featuredProducts: "Featured Products",
    exploreMore: "Explore More",
    readMore: "Read More",
    search: "Search",
    myCart: "My Cart",
    language: "Language",
    quote: "Get a Quote",
    addToCart: "Add To Cart",
    quantity: "Quantity",
    aboutThisItem: "About This Item",
    relatedProducts: "Related Products",
    all: "All",
    accept: "Accept",
    reject: "Reject",
    privacyTitle: "We Value Your Privacy",
    privacyText:
      "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.",
  },
  es: {
    perfectSolution: "¿Busca la solución perfecta?",
    contactToday: "Contáctenos hoy para sus necesidades de decoración.",
    contactUs: "Contáctenos",
    product: "Producto",
    quickLinks: "Enlaces rápidos",
    newsletter: "Boletín",
    newsletterText: "Actualizaciones de fabricación, lanzamientos de categorías y soluciones de decoración.",
    latestProducts: "Últimos productos",
    solutions: "Soluciones",
    featuredProducts: "Productos destacados",
    exploreMore: "Explorar más",
    readMore: "Leer más",
    search: "Buscar",
    myCart: "Mi carrito",
    language: "Idioma",
    quote: "Solicitar cotización",
    addToCart: "Añadir al carrito",
    quantity: "Cantidad",
    aboutThisItem: "Sobre este artículo",
    relatedProducts: "Productos relacionados",
    all: "Todo",
    accept: "Aceptar",
    reject: "Rechazar",
    privacyTitle: "Valoramos su privacidad",
    privacyText: "Usamos cookies para mejorar la navegación, personalizar contenido y analizar el tráfico.",
  },
  pt: {
    perfectSolution: "Procura a solução perfeita?",
    contactToday: "Fale conosco hoje para suas necessidades de decoração.",
    contactUs: "Contate-nos",
    product: "Produto",
    quickLinks: "Links rápidos",
    newsletter: "Newsletter",
    newsletterText: "Atualizações de fabricação, lançamentos de categorias e soluções de decoração.",
    latestProducts: "Produtos recentes",
    solutions: "Soluções",
    featuredProducts: "Produtos em destaque",
    exploreMore: "Explorar mais",
    readMore: "Ler mais",
    search: "Pesquisar",
    myCart: "Meu carrinho",
    language: "Idioma",
    quote: "Solicitar orçamento",
    addToCart: "Adicionar ao carrinho",
    quantity: "Quantidade",
    aboutThisItem: "Sobre este item",
    relatedProducts: "Produtos relacionados",
    all: "Todos",
    accept: "Aceitar",
    reject: "Rejeitar",
    privacyTitle: "Valorizamos sua privacidade",
    privacyText: "Usamos cookies para melhorar a navegação, personalizar conteúdo e analisar o tráfego.",
  },
  fr: {
    perfectSolution: "Vous cherchez la solution parfaite ?",
    contactToday: "Contactez-nous pour vos besoins en décoration.",
    contactUs: "Contactez-nous",
    product: "Produit",
    quickLinks: "Liens rapides",
    newsletter: "Newsletter",
    newsletterText: "Actualités de fabrication, lancements de catégories et solutions de décoration.",
    latestProducts: "Derniers produits",
    solutions: "Solutions",
    featuredProducts: "Produits vedettes",
    exploreMore: "Explorer",
    readMore: "Lire la suite",
    search: "Rechercher",
    myCart: "Mon panier",
    language: "Langue",
    quote: "Demander un devis",
    addToCart: "Ajouter au panier",
    quantity: "Quantité",
    aboutThisItem: "À propos de cet article",
    relatedProducts: "Produits associés",
    all: "Tous",
    accept: "Accepter",
    reject: "Refuser",
    privacyTitle: "Nous respectons votre confidentialité",
    privacyText: "Nous utilisons des cookies pour améliorer la navigation, personnaliser le contenu et analyser le trafic.",
  },
  de: {
    perfectSolution: "Suchen Sie die perfekte Lösung?",
    contactToday: "Kontaktieren Sie uns für Ihre Dekorationslösung.",
    contactUs: "Kontakt",
    product: "Produkt",
    quickLinks: "Schnelllinks",
    newsletter: "Newsletter",
    newsletterText: "Updates zu Fertigung, Kategorien und Dekorationslösungen.",
    latestProducts: "Neueste Produkte",
    solutions: "Lösungen",
    featuredProducts: "Empfohlene Produkte",
    exploreMore: "Mehr erfahren",
    readMore: "Weiterlesen",
    search: "Suchen",
    myCart: "Mein Warenkorb",
    language: "Sprache",
    quote: "Angebot anfordern",
    addToCart: "In den Warenkorb",
    quantity: "Menge",
    aboutThisItem: "Über diesen Artikel",
    relatedProducts: "Ähnliche Produkte",
    all: "Alle",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    privacyTitle: "Wir schätzen Ihre Privatsphäre",
    privacyText: "Wir verwenden Cookies, um die Navigation zu verbessern, Inhalte zu personalisieren und Traffic zu analysieren.",
  },
  ja: {
    perfectSolution: "最適なソリューションをお探しですか？",
    contactToday: "装飾ソリューションについて今すぐお問い合わせください。",
    contactUs: "お問い合わせ",
    product: "製品",
    quickLinks: "クイックリンク",
    newsletter: "ニュースレター",
    newsletterText: "製造、カテゴリ、新しい装飾ソリューションの最新情報。",
    latestProducts: "最新製品",
    solutions: "ソリューション",
    featuredProducts: "注目製品",
    exploreMore: "詳しく見る",
    readMore: "続きを読む",
    search: "検索",
    myCart: "カート",
    language: "言語",
    quote: "見積もり依頼",
    addToCart: "カートに追加",
    quantity: "数量",
    aboutThisItem: "この商品について",
    relatedProducts: "関連商品",
    all: "すべて",
    accept: "同意",
    reject: "拒否",
    privacyTitle: "プライバシーを尊重します",
    privacyText: "閲覧体験の向上、コンテンツの最適化、トラフィック分析のため Cookie を使用します。",
  },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function parseLocalizedSegments(segments: string[] = []) {
  const first = segments[0];
  if (isLocale(first) && first !== "en") {
    return {
      locale: first,
      path: normalizePath(segments.slice(1).join("/")),
    };
  }
  return {
    locale: "en" as Locale,
    path: normalizePath(segments.join("/")),
  };
}

export function normalizePath(path: string) {
  const normalized = path.trim().replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "/";
}

export function localizePath(locale: Locale, path: string) {
  const normalized = normalizePath(path);
  if (locale === "en") return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function languageAlternates(path: string) {
  const normalized = normalizePath(path);
  return {
    en: localizePath("en", normalized),
    es: localizePath("es", normalized),
    pt: localizePath("pt", normalized),
    fr: localizePath("fr", normalized),
    de: localizePath("de", normalized),
    ja: localizePath("ja", normalized),
    "x-default": localizePath("en", normalized),
  };
}

export function t(locale: Locale, key: string) {
  return translations[locale]?.[key] || translations.en[key] || key;
}
