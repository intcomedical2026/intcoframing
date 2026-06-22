// Localized content for the six solution pages. Keep this file focused on
// view-specific copy. Short UI strings (chatWithUs, exploreMore, home,
// solutions, latestCollection, ourManufacturing, sourceManufacturingIntro,
// sourceManufacturingDescription, productLandingIntroTitle / Description,
// callNow, contactNow, emailUs, sendEmail, telephone, liveChat, leaveMessage,
// readMore) live in i18n.ts and should be accessed via t(locale, key).

import type { Locale } from "./i18n";

export type LocalizedString = Record<Locale, string>;

export function pick(value: LocalizedString, locale: Locale): string {
  return value[locale] || value.en;
}

// =============================================================================
// Shared section titles repeated across multiple views
// =============================================================================

export const SECTION_TITLES = {
  ourExpertise: {
    en: "OUR EXPERTISE GOES BEYOND FRAMING!",
    es: "¡NUESTRA EXPERIENCIA VA MÁS ALLÁ DEL ENMARCADO!",
    pt: "NOSSA EXPERTISE VAI ALÉM DO ENMOLDURAMENTO!",
    fr: "NOTRE EXPERTISE VA AU-DELÀ DE L'ENCADREMENT !",
    de: "UNSERE EXPERTISE GEHT ÜBER DAS RAHMEN HINAUS!",
    ja: "私たちの専門性は額装を超えて広がります！",
  } satisfies LocalizedString,
};

// =============================================================================
// /solutions/business-insights-trends
// =============================================================================

export const BUSINESS_INSIGHTS_PAGE = {
  heroTitle: {
    en: "Business Insights & Trends",
    es: "Información empresarial y tendencias",
    pt: "Insights de negócios e tendências",
    fr: "Analyses et tendances du marché",
    de: "Markteinblicke & Trends",
    ja: "ビジネスインサイト & トレンド",
  } satisfies LocalizedString,
  sectionTitles: {
    main: {
      en: "BUSINESS INSIGHTS & TRENDS",
      es: "INFORMACIÓN EMPRESARIAL Y TENDENCIAS",
      pt: "INSIGHTS DE NEGÓCIOS E TENDÊNCIAS",
      fr: "ANALYSES ET TENDANCES DU MARCHÉ",
      de: "MARKTEINBLICKE & TRENDS",
      ja: "ビジネスインサイト & トレンド",
    } satisfies LocalizedString,
    market: {
      en: "Market Survey",
      es: "Estudio de mercado",
      pt: "Pesquisa de mercado",
      fr: "Étude de marché",
      de: "Marktstudie",
      ja: "市場調査",
    } satisfies LocalizedString,
    trend: {
      en: "TREND INSIGHTS",
      es: "PERSPECTIVAS DE TENDENCIAS",
      pt: "INSIGHTS DE TENDÊNCIAS",
      fr: "ANALYSE DES TENDANCES",
      de: "TREND-EINBLICKE",
      ja: "トレンドインサイト",
    } satisfies LocalizedString,
    industryReport: {
      en: "INDUSTRY REPORT",
      es: "INFORME DEL SECTOR",
      pt: "RELATÓRIO DO SETOR",
      fr: "RAPPORT SECTORIEL",
      de: "BRANCHENBERICHT",
      ja: "業界レポート",
    } satisfies LocalizedString,
    bestsellers: {
      en: "BESTSELLERS RECOMMENDATIONS",
      es: "RECOMENDACIONES DE MÁS VENDIDOS",
      pt: "RECOMENDAÇÕES DOS MAIS VENDIDOS",
      fr: "RECOMMANDATIONS DES MEILLEURES VENTES",
      de: "BESTSELLER-EMPFEHLUNGEN",
      ja: "ベストセラーのおすすめ",
    } satisfies LocalizedString,
  },
  copy: {
    market: {
      en: "You can gain a competitive edge with our comprehensive market survey. Dive deep into consumer preferences and purchasing behavior. Our comprehensive survey provides reliable data, empowering you to refine your strategies and capture new opportunities.",
      es: "Obtenga una ventaja competitiva con nuestro completo estudio de mercado. Profundice en las preferencias y el comportamiento de compra del consumidor. Nuestro estudio aporta datos fiables que le permiten afinar sus estrategias y captar nuevas oportunidades.",
      pt: "Ganhe vantagem competitiva com nossa pesquisa de mercado abrangente. Aprofunde-se nas preferências do consumidor e no comportamento de compra. Nossa pesquisa oferece dados confiáveis para refinar suas estratégias e capturar novas oportunidades.",
      fr: "Prenez l'avantage grâce à notre étude de marché complète. Explorez les préférences et le comportement d'achat des consommateurs. Notre étude fournit des données fiables qui vous permettent d'affiner vos stratégies et de saisir de nouvelles opportunités.",
      de: "Verschaffen Sie sich mit unserer umfassenden Marktstudie einen Wettbewerbsvorteil. Tauchen Sie ein in Konsumentenpräferenzen und Kaufverhalten. Unsere Studie liefert verlässliche Daten, mit denen Sie Ihre Strategien schärfen und neue Chancen ergreifen können.",
      ja: "包括的な市場調査で競争優位を獲得できます。消費者の嗜好や購買行動を深く分析し、信頼性の高いデータを提供。戦略を磨き、新たな機会を捉えるための判断材料となります。",
    } satisfies LocalizedString,
    trend: {
      en: "Understand the latest consumer trends, technological advancements, and design preferences. Our insights offer a forward-looking perspective, enabling you to align your products or services with evolving market demands. Anticipate change and position your brand as an industry trendsetter.",
      es: "Comprenda las últimas tendencias de consumo, los avances tecnológicos y las preferencias de diseño. Nuestros análisis ofrecen una perspectiva prospectiva que le permite alinear sus productos o servicios con la demanda cambiante del mercado. Anticípese al cambio y posicione su marca como referente del sector.",
      pt: "Compreenda as últimas tendências de consumo, avanços tecnológicos e preferências de design. Nossas análises oferecem uma perspectiva voltada para o futuro, permitindo alinhar seus produtos ou serviços às demandas em evolução. Antecipe-se à mudança e posicione sua marca como referência no setor.",
      fr: "Cernez les dernières tendances de consommation, les avancées technologiques et les préférences en matière de design. Nos analyses offrent une perspective prospective, vous permettant d'aligner vos produits ou services sur l'évolution du marché. Anticipez le changement et positionnez votre marque comme un précurseur du secteur.",
      de: "Verstehen Sie aktuelle Konsumtrends, technologische Entwicklungen und Designvorlieben. Unsere Einblicke bieten eine zukunftsorientierte Perspektive, mit der Sie Produkte und Services an sich wandelnde Marktanforderungen anpassen können. Antizipieren Sie Veränderungen und positionieren Sie Ihre Marke als Trendsetter.",
      ja: "最新の消費者トレンド、技術革新、デザインの嗜好を把握。私たちのインサイトは将来を見据えた視点を提供し、変化する市場ニーズに製品・サービスを適応させる手助けとなります。変化を先取りし、業界のトレンドセッターとしてブランドを確立します。",
    } satisfies LocalizedString,
    recommendation: {
      en: "Explore bestsellers recommendations to stay informed about the best-selling styles, sizes, shapes, and materials. Discover effective sales and marketing strategies that have propelled products to best-seller status.",
      es: "Explore las recomendaciones de los más vendidos y manténgase al día sobre los estilos, tamaños, formas y materiales más populares. Descubra las estrategias de venta y marketing que han llevado a estos productos a la cima.",
      pt: "Explore as recomendações dos mais vendidos para se manter informado sobre estilos, tamanhos, formatos e materiais de maior sucesso. Descubra as estratégias de vendas e marketing que tornaram esses produtos best-sellers.",
      fr: "Découvrez les recommandations des meilleures ventes pour rester informé des styles, tailles, formes et matériaux les plus prisés. Explorez les stratégies commerciales et marketing qui ont propulsé ces produits au sommet.",
      de: "Entdecken Sie die Bestseller-Empfehlungen und bleiben Sie über die meistverkauften Stile, Größen, Formen und Materialien informiert. Lernen Sie die Vertriebs- und Marketingstrategien kennen, die diese Produkte an die Spitze gebracht haben.",
      ja: "ベストセラーのおすすめを通じて、人気のスタイル・サイズ・形状・素材を把握。商品をベストセラーへと押し上げた効果的な販売・マーケティング戦略を学べます。",
    } satisfies LocalizedString,
  },
  reports: [
    {
      title: {
        en: "The Major Materials of Medicine Mirror Cabinet",
        es: "Los principales materiales del armario espejo de baño",
        pt: "Os principais materiais do armário espelho para banheiro",
        fr: "Les principaux matériaux de l'armoire à pharmacie miroir",
        de: "Die wichtigsten Materialien von Spiegelschränken",
        ja: "ミラーキャビネットの主要素材",
      } satisfies LocalizedString,
      date: "29 Jan 2024",
      excerpt: {
        en: "Bathroom medicine cabinets are available in various materials - you can choose f...",
        es: "Los armarios de baño con espejo están disponibles en varios materiales: puede elegir entre...",
        pt: "Armários espelho de banheiro estão disponíveis em diversos materiais - você pode escolher...",
        fr: "Les armoires à pharmacie miroir existent en plusieurs matériaux - vous pouvez choisir parmi...",
        de: "Spiegelschränke fürs Bad gibt es in verschiedenen Materialien - Sie können wählen aus...",
        ja: "バスルームのミラーキャビネットには様々な素材があります。お選びいただける素材は...",
      } satisfies LocalizedString,
      path: "/news/the-major-materials-of-medicine-mirror-cabinet",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1304805420f6e5ee0ccfa6bdcd180e0a013b47fe-800x511.jpg",
    },
    {
      title: {
        en: "5 Ways an LED Bathroom Vanity Mirror Can Improve Your Space",
        es: "5 maneras en que un espejo LED para baño puede mejorar su espacio",
        pt: "5 formas como um espelho LED para banheiro pode melhorar seu espaço",
        fr: "5 façons dont un miroir LED de salle de bain peut transformer votre espace",
        de: "5 Wege, wie ein LED-Badspiegel Ihren Raum aufwertet",
        ja: "LED バスルームミラーが空間を変える 5 つの方法",
      } satisfies LocalizedString,
      date: "29 Jan 2024",
      excerpt: {
        en: "Looking to revitalise your bathroom? Heres how an LED bathroom vanity mirror wit...",
        es: "¿Quiere renovar su baño? Así es como un espejo LED de tocador puede transformar...",
        pt: "Quer renovar seu banheiro? Veja como um espelho LED de bancada pode transformar...",
        fr: "Envie de revitaliser votre salle de bain ? Voici comment un miroir LED de coiffeuse...",
        de: "Lust auf eine Bad-Renovierung? So wertet ein LED-Spiegel Ihren Raum auf...",
        ja: "バスルームをリフレッシュしたい？ LED バニティミラーで空間がどう変わるか...",
      } satisfies LocalizedString,
      path: "/news/5-ways-an-led-bathroom-vanity-mirror-can-lmprove-your-space",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1806276ee0c14b9b9bd56e338f59a4a9f7c7bb9e-800x533.jpg",
    },
  ],
};

// =============================================================================
// /solutions/design-engineering
// =============================================================================

export const DESIGN_ENGINEERING_PAGE = {
  heroTitle: {
    en: "Design & Engineering",
    es: "Diseño e ingeniería",
    pt: "Design e engenharia",
    fr: "Design & ingénierie",
    de: "Design und Technik",
    ja: "デザイン & エンジニアリング",
  } satisfies LocalizedString,
  sectionTitles: {
    productDesign: {
      en: "PRODUCT DESIGN",
      es: "DISEÑO DE PRODUCTO",
      pt: "DESIGN DE PRODUTO",
      fr: "DESIGN DE PRODUIT",
      de: "PRODUKTDESIGN",
      ja: "プロダクトデザイン",
    } satisfies LocalizedString,
  },
  copy: {
    intro: {
      en: "Collaborate with our skilled design and engineering teams for innovative product design, professional packaging design, cost engineering, captivating display design, extensive product research, and customizable solutions tailored to meet your unique needs. We prioritize innovation and aesthetic appeal, ensuring your products stand out in the competitive market.",
      es: "Colabore con nuestros equipos de diseño e ingeniería para obtener diseños de producto innovadores, embalaje profesional, ingeniería de costes, expositores atractivos, investigación de producto exhaustiva y soluciones personalizables a la medida de sus necesidades. Priorizamos la innovación y el atractivo estético para que sus productos destaquen en un mercado competitivo.",
      pt: "Colabore com nossas equipes de design e engenharia para obter design de produto inovador, embalagem profissional, engenharia de custo, displays atraentes, pesquisa abrangente de produto e soluções personalizáveis sob medida. Priorizamos a inovação e o apelo estético para garantir que seus produtos se destaquem no mercado competitivo.",
      fr: "Collaborez avec nos équipes de design et d'ingénierie pour bénéficier d'un design produit innovant, d'un emballage professionnel, d'une ingénierie des coûts, d'expositions attractives, d'une recherche produit approfondie et de solutions sur mesure adaptées à vos besoins. Nous misons sur l'innovation et l'esthétique pour que vos produits se démarquent.",
      de: "Arbeiten Sie mit unseren erfahrenen Design- und Entwicklungsteams an innovativem Produktdesign, professioneller Verpackung, Kostenoptimierung, ansprechender Warenpräsentation, fundierter Produktforschung und maßgeschneiderten Lösungen. Wir setzen auf Innovation und Ästhetik, damit Ihre Produkte im Wettbewerb herausstechen.",
      ja: "経験豊富なデザイン・エンジニアリングチームと協業し、革新的なプロダクトデザイン、プロフェッショナルなパッケージ、コストエンジニアリング、魅力的なディスプレイ、徹底した製品リサーチ、カスタマイズ可能なソリューションを提供します。革新性と美しさを重視し、競争の激しい市場で製品が際立つよう支援します。",
    } satisfies LocalizedString,
    productDesignDescription: {
      en: "We excel in product design, specializing in moulding with a focus on profiles, foils, and embossing. Annually, we launch over 5,000 unique designs, supported by a collection of 6000+ profiles.",
      es: "Destacamos en el diseño de producto, especializados en molduras con un enfoque en perfiles, foils y relieves. Anualmente lanzamos más de 5.000 diseños únicos, respaldados por una colección de más de 6.000 perfiles.",
      pt: "Somos especialistas em design de produto, com foco em molduras, perfis, foils e relevos. A cada ano lançamos mais de 5.000 designs exclusivos, sustentados por uma coleção de mais de 6.000 perfis.",
      fr: "Nous excellons dans le design produit, spécialisés dans la moulure avec une attention particulière aux profils, films et reliefs. Chaque année, nous lançons plus de 5 000 designs uniques, soutenus par une collection de plus de 6 000 profils.",
      de: "Wir glänzen im Produktdesign mit Spezialisierung auf Profilleisten, Folien und Prägungen. Jährlich bringen wir über 5.000 einzigartige Designs auf den Markt, gestützt auf eine Sammlung von mehr als 6.000 Profilen.",
      ja: "プロダクトデザインに強みを持ち、プロファイル、フィルム、エンボス加工を中心としたモールディングを得意としています。6,000 以上のプロファイルコレクションを基盤に、毎年 5,000 以上のオリジナルデザインを発表しています。",
    } satisfies LocalizedString,
  },
  productRows: [
    {
      title: {
        en: "Picture Frame",
        es: "Marco de cuadro",
        pt: "Moldura para quadro",
        fr: "Cadre photo",
        de: "Bilderrahmen",
        ja: "額縁",
      } satisfies LocalizedString,
      body: {
        en: "We provide design solutions for picture frames, offering tailored designs for both face paper and backboard. Our expertise ensures that every aspect of the frame, from the front-facing aesthetic to the supporting backboard, is thoughtfully crafted to meet the highest standards of design and functionality.",
        es: "Ofrecemos soluciones de diseño para marcos de cuadros, con diseños personalizados tanto para el papel frontal como para el respaldo. Nuestra experiencia garantiza que cada aspecto del marco, desde la estética frontal hasta el respaldo, esté cuidadosamente diseñado para cumplir los más altos estándares de diseño y funcionalidad.",
        pt: "Oferecemos soluções de design para molduras, com designs sob medida para a face e o suporte traseiro. Nossa expertise garante que cada aspecto da moldura, da estética frontal ao suporte traseiro, seja cuidadosamente elaborado dentro dos mais altos padrões de design e funcionalidade.",
        fr: "Nous proposons des solutions de design pour cadres photo, avec des conceptions sur mesure pour la face avant et le panneau arrière. Notre expertise garantit que chaque détail du cadre, de l'esthétique avant au support arrière, est pensé pour répondre aux standards les plus exigeants en design et fonctionnalité.",
        de: "Wir bieten Designlösungen für Bilderrahmen mit maßgeschneiderten Entwürfen für Vorderseite und Rückwand. Unsere Expertise sorgt dafür, dass jedes Detail des Rahmens - von der vorderen Ästhetik bis zur tragenden Rückwand - höchsten Ansprüchen an Design und Funktion gerecht wird.",
        ja: "額縁向けのデザインソリューションを提供し、表紙と裏板の双方にカスタマイズされたデザインを実現します。額の前面の美しさから裏板の機能まで、デザイン性と機能性の最高水準を満たすよう細部まで作り込みます。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3189552e24e25f07e182321bcb12bcc9cd5816e6-638x382.png",
      imageAlt: "Picture Frame",
      reverse: false,
    },
    {
      title: {
        en: "Mirror",
        es: "Espejo",
        pt: "Espelho",
        fr: "Miroir",
        de: "Spiegel",
        ja: "ミラー",
      } satisfies LocalizedString,
      body: {
        en: "We are dedicated to innovative design, and our mirrors showcase a diverse array of shapes. From contemporary to timeless classics, each mirror reflects our commitment to creativity.",
        es: "Apostamos por el diseño innovador y nuestros espejos presentan una amplia variedad de formas. Desde lo contemporáneo hasta los clásicos atemporales, cada espejo refleja nuestro compromiso con la creatividad.",
        pt: "Somos dedicados ao design inovador, e nossos espelhos apresentam uma ampla variedade de formatos. Do contemporâneo aos clássicos atemporais, cada espelho reflete nosso compromisso com a criatividade.",
        fr: "Nous nous consacrons au design innovant, et nos miroirs déclinent une grande variété de formes. Du contemporain aux classiques intemporels, chaque miroir reflète notre engagement créatif.",
        de: "Wir sind innovativem Design verpflichtet, und unsere Spiegel zeigen vielfältige Formen. Von modern bis zeitlos klassisch spiegelt jedes Stück unser kreatives Engagement wider.",
        ja: "革新的なデザインを追求し、ミラーは多彩な形状を取り揃えています。コンテンポラリーから時代を超えたクラシックまで、一つひとつが私たちの創造性への取り組みを映し出します。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/d05249fb9e221926b69bc4274669a5e16173d53d-660x383.png",
      imageAlt: "Mirror",
      reverse: true,
    },
    {
      title: {
        en: "Art",
        es: "Arte",
        pt: "Arte",
        fr: "Art",
        de: "Kunst",
        ja: "アート",
      } satisfies LocalizedString,
      body: {
        en: "With an exceptional team of skilled artists, our art design capabilities encompass both traditional hand-drawing and digital illustration. Paired with advanced printing technologies, our artworks come to life with unparalleled detail and vibrancy.",
        es: "Con un equipo excepcional de artistas, nuestras capacidades de diseño abarcan tanto el dibujo tradicional a mano como la ilustración digital. Junto con tecnologías de impresión avanzadas, nuestras obras cobran vida con un detalle y vivacidad sin igual.",
        pt: "Com uma equipe excepcional de artistas, nossas capacidades de design de arte abrangem tanto o desenho tradicional à mão quanto a ilustração digital. Aliadas a tecnologias avançadas de impressão, nossas obras ganham vida com detalhes e vibração sem igual.",
        fr: "Forte d'une équipe d'artistes talentueux, notre expertise artistique allie le dessin traditionnel à la main et l'illustration numérique. Associées à des technologies d'impression de pointe, nos œuvres prennent vie avec un détail et une vivacité inégalés.",
        de: "Mit einem herausragenden Team versierter Künstler verbinden unsere Kunstdesign-Fähigkeiten traditionelles Handzeichnen und digitale Illustration. Kombiniert mit modernster Drucktechnik werden unsere Werke mit unvergleichlichem Detail und Lebendigkeit zum Leben erweckt.",
        ja: "卓越したアーティストチームにより、伝統的な手描きとデジタルイラストの両方を駆使したアートデザインを実現。先進的な印刷技術と組み合わせることで、比類のないディテールと鮮やかさで作品が息づきます。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a63a2bd8e5e3201eb983b69a82fbb694b53f871b-660x383.png",
      imageAlt: "Art",
      reverse: false,
    },
  ],
  features: [
    {
      title: {
        en: "Packaging Design",
        es: "Diseño de embalaje",
        pt: "Design de embalagem",
        fr: "Design d'emballage",
        de: "Verpackungsdesign",
        ja: "パッケージデザイン",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/48c884fdc91a260ddf9cd2fa625ca728e5e95aed-356x500.png",
      imageAlt: "shutterstock8",
    },
    {
      title: {
        en: "Display Design",
        es: "Diseño de exhibidores",
        pt: "Design de display",
        fr: "Design d'affichage",
        de: "Warenpräsentation",
        ja: "ディスプレイデザイン",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b00e4cf5e8c3cb9e8ecc48c74ab9119d75f84480-356x500.png",
      imageAlt: "shutterstock9",
    },
    {
      title: {
        en: "Product Development Skill",
        es: "Capacidad de desarrollo de producto",
        pt: "Habilidade de desenvolvimento de produto",
        fr: "Savoir-faire en développement produit",
        de: "Produktentwicklungs-Know-how",
        ja: "製品開発スキル",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f59e4766c2b14045ce70204c98a4035e2aa9cb52-356x500.png",
      imageAlt: "shutterstock10",
    },
    {
      title: {
        en: "Multi Materials",
        es: "Múltiples materiales",
        pt: "Múltiplos materiais",
        fr: "Multi-matériaux",
        de: "Vielfältige Materialien",
        ja: "多彩な素材",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/27c1d6c6dcba1af4e82c96fd299e97589d9b3faa-356x500.png",
      imageAlt: "shutterstock11",
    },
  ],
};

// Shared "Latest Collection" cards (used by 4 source views)
export const LATEST_PRIMARY_CARDS = [
  {
    title: {
      en: "Mirror",
      es: "Espejo",
      pt: "Espelho",
      fr: "Miroir",
      de: "Spiegel",
      ja: "ミラー",
    } satisfies LocalizedString,
    path: "/mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5df3e4d8db105ece9affc16ab9aa72d315001279-785x440.jpg",
  },
  {
    title: {
      en: "Picture Frame",
      es: "Marco de cuadro",
      pt: "Moldura para quadro",
      fr: "Cadre photo",
      de: "Bilderrahmen",
      ja: "額縁",
    } satisfies LocalizedString,
    path: "/picture-frame",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f6b48b62beb7e5670309f7702c9762fe8d148282-1715x1087.jpg",
  },
];

export const LATEST_SECONDARY_CARDS = [
  {
    title: {
      en: "Art",
      es: "Arte",
      pt: "Arte",
      fr: "Art",
      de: "Kunst",
      ja: "アート",
    } satisfies LocalizedString,
    path: "/art",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f4b8a311e4e9e8e72b0ee226b38b4e20f40b00d8-513x442.jpg",
  },
  {
    title: {
      en: "Furniture",
      es: "Mobiliario",
      pt: "Mobiliário",
      fr: "Mobilier",
      de: "Möbel",
      ja: "家具",
    } satisfies LocalizedString,
    path: "/furniture",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9a5a34c44f9c4a33406737fbc30e69f3c1f46e20-513x442.jpg",
  },
  {
    title: {
      en: "Memo Board",
      es: "Pizarra memo",
      pt: "Quadro de avisos",
      fr: "Tableau mémo",
      de: "Memoboard",
      ja: "メモボード",
    } satisfies LocalizedString,
    path: "/memo-board",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/caadd1e53eb8f958d3723562a511e222a2042c9f-514x441.png",
  },
];

export const PROJECT_CARDS = [
  {
    eyebrow: {
      en: "Aesthetics Works",
      es: "Estética en acción",
      pt: "Estética em ação",
      fr: "Esthétique en action",
      de: "Ästhetik in Aktion",
      ja: "美的演出",
    } satisfies LocalizedString,
    title: {
      en: "Residential PROJECTS",
      es: "PROYECTOS residenciales",
      pt: "PROJETOS residenciais",
      fr: "PROJETS résidentiels",
      de: "Wohn-PROJEKTE",
      ja: "住宅プロジェクト",
    } satisfies LocalizedString,
    path: "/projects/residential",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/acce0a49eca755d0ab290d995d5fc2a77dd9b16e-780x400.jpg",
  },
  {
    eyebrow: {
      en: "Aesthetics Works",
      es: "Estética en acción",
      pt: "Estética em ação",
      fr: "Esthétique en action",
      de: "Ästhetik in Aktion",
      ja: "美的演出",
    } satisfies LocalizedString,
    title: {
      en: "Commercial PROJECTS",
      es: "PROYECTOS comerciales",
      pt: "PROJETOS comerciais",
      fr: "PROJETS commerciaux",
      de: "Gewerbe-PROJEKTE",
      ja: "商業プロジェクト",
    } satisfies LocalizedString,
    path: "/projects/commercial",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/cc52cccd09155ee4b5d5b80e356a8326e0f025dc-780x400.jpg",
  },
];

// =============================================================================
// /solutions/manufacturing-delivery
// =============================================================================

export const MANUFACTURING_DELIVERY_PAGE = {
  heroTitle: {
    en: "Manufacturing & Delivery",
    es: "Fabricación y entrega",
    pt: "Fabricação e entrega",
    fr: "Fabrication & livraison",
    de: "Fertigung & Lieferung",
    ja: "製造 & 配送",
  } satisfies LocalizedString,
  sectionTitles: {
    packaging: {
      en: "PACKAGING",
      es: "EMBALAJE",
      pt: "EMBALAGEM",
      fr: "EMBALLAGE",
      de: "VERPACKUNG",
      ja: "パッケージ",
    } satisfies LocalizedString,
    delivery: {
      en: "DELIVERY",
      es: "ENTREGA",
      pt: "ENTREGA",
      fr: "LIVRAISON",
      de: "LIEFERUNG",
      ja: "配送",
    } satisfies LocalizedString,
  },
  rows: [
    {
      key: "production",
      title: {
        en: "PRODUCTION CAPACITY",
        es: "CAPACIDAD DE PRODUCCIÓN",
        pt: "CAPACIDADE DE PRODUÇÃO",
        fr: "CAPACITÉ DE PRODUCTION",
        de: "PRODUKTIONSKAPAZITÄT",
        ja: "生産能力",
      } satisfies LocalizedString,
      body: {
        en: "Intco's vertically integrated supply chain of raw materials, we maintain control over product quality from the source, ensuring consistent excellence for initial orders and reorders. With formidable production capabilities, we have the capacity to manufacture 1.2 million boxes of PS moulding annually. We can meet the demands of large-scale production while consistently upholding rigorous standards of quality.",
        es: "Gracias a la cadena de suministro de materias primas verticalmente integrada de Intco, mantenemos el control de calidad desde el origen, garantizando una excelencia constante en pedidos iniciales y reposiciones. Con una capacidad productiva sólida, fabricamos 1,2 millones de cajas de molduras de PS al año. Cubrimos demandas de producción a gran escala manteniendo en todo momento estándares de calidad rigurosos.",
        pt: "Com a cadeia de suprimentos verticalmente integrada da Intco para matérias-primas, mantemos o controle de qualidade desde a origem, garantindo excelência consistente em pedidos iniciais e recompras. Com forte capacidade produtiva, fabricamos 1,2 milhão de caixas de molduras de PS por ano. Atendemos demandas de produção em larga escala mantendo padrões rigorosos de qualidade.",
        fr: "Grâce à la chaîne d'approvisionnement en matières premières verticalement intégrée d'Intco, nous maîtrisons la qualité dès la source, garantissant une excellence constante pour les commandes initiales et les réapprovisionnements. Avec nos capacités de production de premier plan, nous fabriquons 1,2 million de cartons de moulures PS par an et répondons aux demandes à grande échelle tout en maintenant des standards rigoureux.",
        de: "Dank Intcos vertikal integrierter Rohstoff-Lieferkette steuern wir die Produktqualität ab der Quelle und sichern gleichbleibende Exzellenz bei Erstaufträgen und Nachbestellungen. Mit beeindruckender Produktionskraft fertigen wir jährlich 1,2 Millionen Kartons PS-Profilleisten und erfüllen Großserien-Anforderungen bei konstant hohen Qualitätsstandards.",
        ja: "Intco の原材料を垂直統合したサプライチェーンにより、源流から品質を管理し、初回注文・追加注文を通じて一貫した品質を提供します。卓越した生産能力を有し、年間 120 万箱の PS モールディングを製造可能。厳格な品質基準を維持しながら大規模生産の需要に応えます。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/d738b3565f1cdce6a382c8ea47b51a56d207c930-954x570.png",
      imageAlt: "Manufacturing2",
    },
    {
      key: "digital",
      title: {
        en: "DIGITAL MANAGEMENT SYSTEM",
        es: "SISTEMA DE GESTIÓN DIGITAL",
        pt: "SISTEMA DE GESTÃO DIGITAL",
        fr: "SYSTÈME DE GESTION NUMÉRIQUE",
        de: "DIGITALES MANAGEMENTSYSTEM",
        ja: "デジタルマネジメントシステム",
      } satisfies LocalizedString,
      body: {
        en: "We utilize advanced digital management systems to enhance our operations, ensuring efficiency and precision throughout our processes. Our comprehensive suite includes APS (Advanced Planning and Scheduling), MRP (Manufacturing Resource Planning), MES (Manufacturing Execution System), SCM (Supply Chain Management), WMS (Warehouse Management System), TMS (Transportation Management System), SRM (Supplier Relationship Management), and CRM (Customer Relationship Management). This integrated approach allows us to optimize scheduling, resource allocation, manufacturing, supply chain, warehousing, transportation, supplier and customer relationships for a responsive and effective business ecosystem.",
        es: "Empleamos sistemas avanzados de gestión digital para mejorar nuestras operaciones, garantizando eficiencia y precisión en todos los procesos. Nuestro conjunto incluye APS (Planificación y Programación Avanzada), MRP (Planificación de Recursos de Fabricación), MES (Ejecución de Fabricación), SCM (Gestión de Cadena de Suministro), WMS (Gestión de Almacén), TMS (Gestión de Transporte), SRM (Relaciones con Proveedores) y CRM (Relaciones con Clientes). Este enfoque integrado optimiza la programación, asignación de recursos, fabricación, cadena de suministro, almacenamiento, transporte y relaciones con proveedores y clientes para un ecosistema empresarial ágil y eficaz.",
        pt: "Utilizamos sistemas avançados de gestão digital para potencializar as operações, garantindo eficiência e precisão em todos os processos. Nosso conjunto integrado inclui APS (Planejamento e Programação Avançados), MRP (Planejamento de Recursos de Manufatura), MES (Execução da Manufatura), SCM (Gestão da Cadeia de Suprimentos), WMS (Gestão de Armazém), TMS (Gestão de Transporte), SRM (Relação com Fornecedores) e CRM (Relação com Clientes). Essa abordagem integrada otimiza programação, alocação de recursos, manufatura, cadeia de suprimentos, armazenagem, transporte e relacionamentos para um ecossistema ágil e eficaz.",
        fr: "Nous utilisons des systèmes de gestion numérique avancés pour optimiser nos opérations, garantissant efficacité et précision tout au long du processus. Notre suite complète comprend APS (planification avancée), MRP (planification des ressources), MES (exécution de la fabrication), SCM (chaîne d'approvisionnement), WMS (entreposage), TMS (transport), SRM (fournisseurs) et CRM (clients). Cette approche intégrée optimise la planification, l'allocation des ressources, la fabrication, la logistique et les relations partenaires pour un écosystème commercial réactif et performant.",
        de: "Wir nutzen fortschrittliche digitale Managementsysteme, um unsere Abläufe zu optimieren und in allen Prozessen Effizienz und Präzision sicherzustellen. Unser umfassendes Toolset umfasst APS (erweiterte Planung und Terminierung), MRP (Fertigungsressourcenplanung), MES (Fertigungsausführung), SCM (Lieferkettenmanagement), WMS (Lagerverwaltung), TMS (Transportmanagement), SRM (Lieferantenbeziehungen) und CRM (Kundenbeziehungen). Dieser integrierte Ansatz optimiert Planung, Ressourcen, Fertigung, Lieferkette, Lager, Transport sowie Lieferanten- und Kundenbeziehungen für ein reaktionsschnelles und effektives Geschäftsökosystem.",
        ja: "高度なデジタルマネジメントシステムを活用し、業務全体で効率性と精度を確保しています。APS（高度生産計画）、MRP（製造資源計画）、MES（製造実行）、SCM（サプライチェーン管理）、WMS（倉庫管理）、TMS（輸送管理）、SRM（取引先管理）、CRM（顧客管理）を統合し、スケジュール、リソース配分、製造、サプライチェーン、倉庫、輸送、取引先・顧客との関係を最適化。即応性と実効性のあるビジネスエコシステムを実現します。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/48d0dfb7f2e97c02037ffa8a1f48e98b3b506fac-954x570.png",
      imageAlt: "Manufacturing3",
    },
    {
      key: "automation",
      title: {
        en: "AUTOMATION",
        es: "AUTOMATIZACIÓN",
        pt: "AUTOMAÇÃO",
        fr: "AUTOMATISATION",
        de: "AUTOMATISIERUNG",
        ja: "自動化",
      } satisfies LocalizedString,
      body: {
        en: "Our production facilities achieve a high level of automation, ensuring precision and consistency in every frame we create. This strategic integration of automation not only boosts productivity but also safeguards the rights and well-being of our workers.",
        es: "Nuestras plantas alcanzan un alto nivel de automatización, garantizando precisión y consistencia en cada marco. Esta integración estratégica no solo eleva la productividad, sino que también protege los derechos y el bienestar de nuestros trabajadores.",
        pt: "Nossas plantas alcançam um alto nível de automação, garantindo precisão e consistência em cada moldura produzida. Essa integração estratégica eleva a produtividade e ainda protege os direitos e o bem-estar dos nossos trabalhadores.",
        fr: "Nos sites de production atteignent un haut niveau d'automatisation, garantissant précision et constance dans chaque cadre fabriqué. Cette intégration stratégique de l'automatisation booste la productivité tout en préservant les droits et le bien-être de nos employés.",
        de: "Unsere Produktionsstätten erreichen einen hohen Automatisierungsgrad und sichern damit Präzision und Konsistenz bei jedem gefertigten Rahmen. Diese strategische Automatisierung steigert nicht nur die Produktivität, sondern schützt auch die Rechte und das Wohlergehen unserer Mitarbeitenden.",
        ja: "生産拠点は高度な自動化を実現し、すべての製品で精度と一貫性を確保しています。戦略的な自動化の導入により、生産性向上だけでなく、従業員の権利と福利の保護にも貢献しています。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/13ec4fb34b34ce726695b2b5e5c11c03e5964c42-855x590.png",
      imageAlt: "Manufacturing4",
    },
    {
      key: "flexible",
      title: {
        en: "FLEXIBLE MANUFACTURING",
        es: "FABRICACIÓN FLEXIBLE",
        pt: "FABRICAÇÃO FLEXÍVEL",
        fr: "FABRICATION FLEXIBLE",
        de: "FLEXIBLE FERTIGUNG",
        ja: "柔軟な製造体制",
      } satisfies LocalizedString,
      body: {
        en: "With over 20 years of manufacturing experience, Intco Framing stands out for its flexible production capabilities. Leveraging advanced production scheduling systems and digital management, coupled with sophisticated technology, our production lines and processes are flexible and adaptable. This enables us to efficiently meet your customized requirements with precision and agility.",
        es: "Con más de 20 años de experiencia en fabricación, Intco Framing destaca por su capacidad de producción flexible. Apoyados en sistemas avanzados de programación de producción y gestión digital, junto con tecnología sofisticada, nuestras líneas y procesos son flexibles y adaptables. Esto nos permite atender sus requisitos personalizados con precisión y agilidad.",
        pt: "Com mais de 20 anos de experiência em manufatura, a Intco Framing se destaca pela capacidade flexível de produção. Combinando sistemas avançados de programação, gestão digital e tecnologia sofisticada, nossas linhas e processos são adaptáveis. Isso nos permite atender requisitos personalizados com precisão e agilidade.",
        fr: "Forts de plus de 20 ans d'expérience industrielle, Intco Framing se distingue par sa capacité de production flexible. Grâce à des systèmes avancés de planification, à la gestion numérique et à des technologies de pointe, nos lignes et processus sont adaptables et permettent de répondre à vos besoins sur mesure avec précision et agilité.",
        de: "Mit über 20 Jahren Fertigungserfahrung überzeugt Intco Framing durch flexible Produktionskapazitäten. Fortschrittliche Planungssysteme, digitales Management und ausgereifte Technologie machen unsere Linien und Prozesse anpassungsfähig - so erfüllen wir Ihre individuellen Anforderungen präzise und agil.",
        ja: "20 年以上の製造経験を持つ Intco Framing は、柔軟な生産能力で際立っています。高度な生産スケジューリング、デジタル管理、洗練された技術を組み合わせ、生産ラインとプロセスを柔軟に適応。お客様のカスタマイズ要件に対し、精度と俊敏性をもって効率的に応えます。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/7f00f185dfc946607688eb928a5c9ca407744174-532x957.png",
      imageAlt: "Manufacturing5",
    },
    {
      key: "quality",
      title: {
        en: "QUALITY CONTROL",
        es: "CONTROL DE CALIDAD",
        pt: "CONTROLE DE QUALIDADE",
        fr: "CONTRÔLE QUALITÉ",
        de: "QUALITÄTSKONTROLLE",
        ja: "品質管理",
      } satisfies LocalizedString,
      body: {
        en: "We maintain strict internal control over product quality, subjecting all items to meticulous layers of inspection. Every product undergoes rigorous checks, ensuring that only the highest quality goods reach our customers.",
        es: "Mantenemos un estricto control interno sobre la calidad del producto, sometiendo cada artículo a meticulosas capas de inspección. Cada producto pasa por controles rigurosos para garantizar que solo los de máxima calidad lleguen a nuestros clientes.",
        pt: "Mantemos um controle interno rigoroso da qualidade do produto, submetendo cada item a múltiplas camadas de inspeção. Cada produto passa por verificações rigorosas, garantindo que apenas itens de máxima qualidade cheguem aos nossos clientes.",
        fr: "Nous appliquons un contrôle interne strict de la qualité, en soumettant chaque article à plusieurs niveaux d'inspection rigoureuse. Chaque produit subit des vérifications minutieuses, garantissant que seuls les articles de plus haute qualité parviennent à nos clients.",
        de: "Wir halten die Produktqualität streng intern unter Kontrolle und unterziehen jedes Erzeugnis mehrstufigen, sorgfältigen Prüfungen. So gelangen ausschließlich Produkte höchster Qualität zu unseren Kunden.",
        ja: "製品品質を厳格に内部管理し、すべてのアイテムを多段階で綿密に検査しています。すべての製品は厳しいチェックを経て、最高品質のものだけがお客様のもとへ届きます。",
      } satisfies LocalizedString,
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/0036cc335ca3a7a6297ef881f4472949fbf701bb-532x957.png",
      imageAlt: "Manufacturing6",
    },
  ],
  packagingCopy: {
    en: "We can meet your specific product and packaging standards with our own in-house product and package lab; if third-party testing is needed, we can handle that too. We offer packaging solutions that comply with ISTA standards, ranging from ISTA-1A to 6A. Our diverse packaging options are designed to meet the varying needs of transportation and ensure the safe transit of products.",
    es: "Podemos cumplir sus estándares específicos de producto y embalaje gracias a nuestro propio laboratorio interno de producto y embalaje; si necesita pruebas de terceros, también las gestionamos. Ofrecemos soluciones de embalaje que cumplen con las normas ISTA, desde ISTA-1A hasta 6A. Nuestras opciones diversas se adaptan a los distintos requisitos de transporte y aseguran el tránsito seguro de los productos.",
    pt: "Atendemos aos seus padrões específicos de produto e embalagem com nosso próprio laboratório interno de produto e embalagem; se for necessário teste de terceiros, também conduzimos. Oferecemos soluções de embalagem conforme normas ISTA, de ISTA-1A a 6A. Nossas opções diversas atendem às variadas necessidades de transporte e garantem o trânsito seguro dos produtos.",
    fr: "Nous pouvons répondre à vos exigences spécifiques produit et emballage grâce à notre laboratoire interne ; si des tests par un tiers sont requis, nous les organisons également. Nos solutions d'emballage respectent les normes ISTA, de ISTA-1A à 6A. Nos options variées s'adaptent aux différents besoins de transport et garantissent un acheminement sûr des produits.",
    de: "Mit unserem eigenen Produkt- und Verpackungslabor erfüllen wir Ihre spezifischen Produkt- und Verpackungsanforderungen; sollten Drittprüfungen nötig sein, organisieren wir auch diese. Wir bieten Verpackungslösungen nach ISTA-Standards von ISTA-1A bis 6A. Unsere vielfältigen Optionen erfüllen unterschiedliche Transportanforderungen und gewährleisten den sicheren Versand.",
    ja: "自社の製品・包装ラボで、お客様独自の製品・包装基準に対応できます。第三者試験が必要な場合も手配可能です。包装ソリューションは ISTA-1A から 6A までの ISTA 規格に準拠。多彩なオプションで多様な輸送ニーズに応え、製品の安全な輸送を確保します。",
  } satisfies LocalizedString,
  deliveryCopy: {
    en: "Our stable partnerships with numerous freight companies enable us to uphold timely deliveries even in challenging circumstances such as the ongoing pandemic. Our advanced TMS (Transportation Management System) is also your reliable partner in ensuring timely delivery commitments. Our dedication to precision in the delivery process guarantees your products reach you on time.",
    es: "Nuestras alianzas estables con numerosas empresas de transporte nos permiten mantener entregas puntuales incluso en circunstancias difíciles como la pandemia. Nuestro avanzado TMS (Sistema de Gestión del Transporte) también es su socio fiable para cumplir compromisos de entrega. Nuestra dedicación a la precisión en la entrega garantiza que sus productos lleguen a tiempo.",
    pt: "Nossas parcerias estáveis com diversas transportadoras permitem manter entregas pontuais mesmo em cenários desafiadores como a pandemia. Nosso TMS (Sistema de Gestão de Transporte) avançado é seu parceiro confiável para cumprir compromissos de entrega. Nosso compromisso com a precisão garante que seus produtos cheguem no prazo.",
    fr: "Nos partenariats solides avec de nombreux transporteurs nous permettent de tenir des délais de livraison, même dans des contextes complexes comme la pandémie. Notre TMS (système de gestion du transport) avancé est un partenaire fiable pour honorer vos engagements de livraison. Notre exigence de précision garantit l'arrivée à temps de vos produits.",
    de: "Stabile Partnerschaften mit zahlreichen Speditionen ermöglichen pünktliche Lieferungen selbst unter schwierigen Bedingungen wie der Pandemie. Unser fortschrittliches TMS (Transportation Management System) ist Ihr zuverlässiger Partner für termingerechte Lieferzusagen. Unsere Präzision im Versandprozess sorgt dafür, dass Ihre Produkte rechtzeitig ankommen.",
    ja: "多数の輸送会社との安定したパートナーシップにより、パンデミックなどの困難な状況下でも納期を守ります。先進的な TMS（輸送管理システム）が納期遵守を支え、配送プロセスの精度に対する徹底したこだわりで、製品を予定どおりお届けします。",
  } satisfies LocalizedString,
};

// =============================================================================
// /solutions/retailer-support
// =============================================================================

export const RETAILER_SUPPORT_PAGE = {
  heroTitle: {
    en: "Retailer Support",
    es: "Soporte al minorista",
    pt: "Suporte ao varejista",
    fr: "Soutien aux détaillants",
    de: "Einzelhandelsunterstützung",
    ja: "リテーラーサポート",
  } satisfies LocalizedString,
  sectionTitles: {
    customerService: {
      en: "Customer Service",
      es: "Servicio al cliente",
      pt: "Atendimento ao cliente",
      fr: "Service client",
      de: "Kundenservice",
      ja: "カスタマーサービス",
    } satisfies LocalizedString,
    turnKey: {
      en: "Turn Key Solutions",
      es: "Soluciones llave en mano",
      pt: "Soluções chave-na-mão",
      fr: "Solutions clés en main",
      de: "Schlüsselfertige Lösungen",
      ja: "ターンキーソリューション",
    } satisfies LocalizedString,
    globalSupply: {
      en: "Global Production and Supply",
      es: "Producción y suministro global",
      pt: "Produção e fornecimento global",
      fr: "Production et approvisionnement mondiaux",
      de: "Globale Produktion und Versorgung",
      ja: "グローバル生産・供給",
    } satisfies LocalizedString,
    distribution: {
      en: "International Distribution",
      es: "Distribución internacional",
      pt: "Distribuição internacional",
      fr: "Distribution internationale",
      de: "Internationale Distribution",
      ja: "国際流通",
    } satisfies LocalizedString,
    marketing: {
      en: "Marketing Support",
      es: "Soporte de marketing",
      pt: "Suporte de marketing",
      fr: "Soutien marketing",
      de: "Marketing-Unterstützung",
      ja: "マーケティングサポート",
    } satisfies LocalizedString,
  },
  customerCopy: {
    en: "As the only home décor manufacturer that starts with recycled materials around the world, we truly ensure quality control from the source, and pride ourselves on offering continuous assistance to ensure the prosperity of your retail business.",
    es: "Como el único fabricante de decoración del hogar a nivel mundial que parte de materiales reciclados, garantizamos realmente el control de calidad desde el origen y nos enorgullece brindar asistencia continua para asegurar la prosperidad de su negocio minorista.",
    pt: "Como o único fabricante de decoração para o lar no mundo que parte de materiais reciclados, garantimos o controle de qualidade desde a origem e nos orgulhamos de oferecer assistência contínua para assegurar a prosperidade do seu negócio varejista.",
    fr: "En tant que seul fabricant de décoration d'intérieur au monde à partir de matériaux recyclés, nous assurons réellement le contrôle qualité dès la source et avons à cœur d'offrir un accompagnement continu pour la prospérité de votre activité de détail.",
    de: "Als weltweit einziger Heimdekor-Hersteller, der mit recycelten Materialien startet, sichern wir Qualität wirklich ab der Quelle und sind stolz darauf, Sie kontinuierlich beim Erfolg Ihres Einzelhandels zu unterstützen.",
    ja: "リサイクル素材から出発する世界唯一のホームデコ製造業者として、源流から品質管理を徹底し、お客様の小売ビジネスの繁栄を支える継続的なサポートを提供できることを誇りに思います。",
  } satisfies LocalizedString,
  turnCopy: {
    en: "We offer one-stop solutions encompassing product development, design, production, and quality control, which streamlines your shopping experience while saving you time and energy, so that you can focus on driving your business. Our comprehensive service ensures that every aspect of the process is carefully managed, providing you with a hassle-free and efficient service from concept to delivery.",
    es: "Ofrecemos soluciones integrales que abarcan el desarrollo de producto, diseño, producción y control de calidad, simplificando su experiencia de compra y ahorrándole tiempo y energía para que pueda centrarse en hacer crecer su negocio. Nuestro servicio integral garantiza que cada etapa del proceso esté cuidadosamente gestionada, ofreciendo un servicio eficiente y sin complicaciones desde el concepto hasta la entrega.",
    pt: "Oferecemos soluções integradas que englobam desenvolvimento de produto, design, produção e controle de qualidade, simplificando sua experiência e poupando tempo e energia para que você foque no crescimento do negócio. Nosso serviço completo garante que cada etapa seja cuidadosamente gerenciada, oferecendo um serviço eficiente e sem complicações do conceito à entrega.",
    fr: "Nous proposons des solutions clés en main couvrant le développement, le design, la production et le contrôle qualité, simplifiant votre expérience tout en vous faisant gagner du temps et de l'énergie pour vous concentrer sur votre activité. Notre service complet veille à ce que chaque étape soit pilotée avec soin, du concept à la livraison.",
    de: "Wir bieten Komplettlösungen aus Produktentwicklung, Design, Produktion und Qualitätskontrolle - das vereinfacht Ihre Beschaffung und spart Zeit und Energie, damit Sie sich auf Ihr Geschäft konzentrieren können. Unser umfassender Service stellt sicher, dass jeder Prozessschritt sorgfältig gesteuert wird - reibungslos und effizient vom Konzept bis zur Lieferung.",
    ja: "製品開発、デザイン、生産、品質管理を網羅したワンストップソリューションを提供します。お客様の調達体験を効率化し、時間と労力を節約することで、ビジネスの推進に集中いただけます。プロセス全体を丁寧に管理し、コンセプトから納品まで手間のかからない効率的なサービスをお届けします。",
  } satisfies LocalizedString,
  globalCopy: {
    en: "By strategically locating our factories in China, Vietnam or Malaysia, we enhance our resilience to external factors that may impact the supply chain and maximize efficiency and flexibility in meeting your demands. All of our factories ensure advanced production technology and equipment, quality manufacturing and flexible shipping. Operating in strict adherence to international quality standards, each factory has earned high recognition for product quality from our customers.",
    es: "Al ubicar estratégicamente nuestras fábricas en China, Vietnam o Malasia, reforzamos nuestra resiliencia frente a factores externos que pueden afectar la cadena de suministro y maximizamos eficiencia y flexibilidad para atender su demanda. Todas nuestras plantas cuentan con tecnología y equipos de producción avanzados, fabricación de calidad y envíos flexibles. Operamos en estricto cumplimiento de las normas internacionales de calidad y cada fábrica goza de un alto reconocimiento por parte de nuestros clientes.",
    pt: "Com fábricas estrategicamente localizadas na China, Vietnã ou Malásia, reforçamos a resiliência frente a fatores externos que podem afetar a cadeia de suprimentos e maximizamos eficiência e flexibilidade para atender sua demanda. Todas as nossas plantas contam com tecnologia e equipamentos avançados, manufatura de qualidade e envio flexível. Atuamos em estrita conformidade com normas internacionais de qualidade e cada fábrica recebe alto reconhecimento dos nossos clientes.",
    fr: "En implantant stratégiquement nos usines en Chine, au Vietnam ou en Malaisie, nous renforçons notre résilience face aux aléas pouvant impacter la chaîne d'approvisionnement et maximisons efficacité et flexibilité pour répondre à vos besoins. Toutes nos usines disposent de technologies et d'équipements de pointe, d'une production de qualité et d'une expédition flexible. Opérant dans le strict respect des normes internationales de qualité, chacune est reconnue pour l'excellence de ses produits.",
    de: "Durch die strategische Verteilung unserer Werke auf China, Vietnam und Malaysia stärken wir unsere Widerstandsfähigkeit gegenüber externen Risiken und maximieren Effizienz und Flexibilität in der Belieferung. Alle Werke verfügen über fortschrittliche Produktionstechnik, qualitativ hochwertige Fertigung und flexible Logistik. Im strikten Einklang mit internationalen Qualitätsstandards genießen unsere Werke hohe Anerkennung unserer Kunden.",
    ja: "中国、ベトナム、マレーシアに工場を戦略的に配置することで、サプライチェーンに影響しうる外部要因への耐性を高め、需要対応の効率性と柔軟性を最大化しています。すべての工場が先進的な生産技術・設備、高品質な製造、柔軟な出荷を確保。国際的な品質基準を厳格に順守し、各拠点はお客様から高い評価を得ています。",
  } satisfies LocalizedString,
  distributionCopy: {
    en: "We further extend our global service capabilities by maintaining warehouses in various international locations. This strategic positioning ensures expedited deliveries, particularly beneficial for meeting urgent demands to fulfill our commitment to efficiency and customer satisfaction.",
    es: "Ampliamos nuestras capacidades de servicio global manteniendo almacenes en distintas ubicaciones internacionales. Este posicionamiento estratégico garantiza entregas ágiles, especialmente útiles para atender demandas urgentes y cumplir con nuestro compromiso de eficiencia y satisfacción del cliente.",
    pt: "Ampliamos nossas capacidades globais de serviço mantendo armazéns em diversos locais internacionais. Esse posicionamento estratégico garante entregas mais rápidas, especialmente úteis para atender demandas urgentes e cumprir nosso compromisso com eficiência e satisfação do cliente.",
    fr: "Nous renforçons nos capacités de service global en maintenant des entrepôts dans diverses zones internationales. Ce positionnement stratégique permet des livraisons accélérées, particulièrement utiles pour répondre aux demandes urgentes et tenir notre engagement d'efficacité et de satisfaction client.",
    de: "Wir erweitern unsere globale Servicefähigkeit durch Lager an verschiedenen internationalen Standorten. Diese strategische Positionierung sichert schnelle Lieferungen - besonders wertvoll bei dringenden Anforderungen und Beleg für unser Engagement für Effizienz und Kundenzufriedenheit.",
    ja: "国際的な複数拠点に倉庫を構えることで、グローバルなサービス能力をさらに拡張しています。この戦略的な配置により迅速な配送を実現。緊急ニーズへの対応に特に有効で、効率性と顧客満足への取り組みを体現しています。",
  } satisfies LocalizedString,
  marketingCopyBefore: {
    en: "Intco Framing offers the support you need to build a first-class website with high-definition product images and room scenes. Additionally, we provide samples with installation instructions and demonstration videos. To enhance customer experience, we offer an",
    es: "Intco Framing le brinda el soporte necesario para construir un sitio web de primer nivel con imágenes de producto de alta definición y escenas de ambiente. Además, ofrecemos muestras con instrucciones de instalación y vídeos demostrativos. Para mejorar la experiencia del cliente, disponemos de una",
    pt: "A Intco Framing oferece o suporte necessário para construir um site de alto nível com imagens de produto em alta definição e cenas de ambiente. Além disso, fornecemos amostras com instruções de instalação e vídeos demonstrativos. Para aprimorar a experiência do cliente, oferecemos uma",
    fr: "Intco Framing vous apporte le soutien nécessaire pour bâtir un site web de premier ordre avec des images produit haute définition et des mises en scène d'intérieur. Nous fournissons également des échantillons accompagnés d'instructions d'installation et de vidéos de démonstration. Pour enrichir l'expérience client, nous proposons un",
    de: "Intco Framing bietet die Unterstützung, die Sie für eine erstklassige Website mit hochauflösenden Produktbildern und Raumszenen benötigen. Zusätzlich liefern wir Muster mit Montageanleitungen und Demovideos. Für ein noch besseres Kundenerlebnis bieten wir ein",
    ja: "Intco Framing は、高解像度の製品画像や室内シーンを備えた一流のウェブサイト構築を支援します。さらに、取付説明書付きのサンプルやデモ動画も提供。お客様体験を高めるため、",
  } satisfies LocalizedString,
  marketingLinkLabel: {
    en: "online framing tool",
    es: "herramienta de enmarcado en línea",
    pt: "ferramenta de enquadramento online",
    fr: "outil d'encadrement en ligne",
    de: "Online-Rahmen-Tool",
    ja: "オンライン額装ツール",
  } satisfies LocalizedString,
  marketingCopyAfter: {
    en: "that allows you to personalize and visualize your framing choices conveniently.",
    es: "que le permite personalizar y visualizar sus elecciones de enmarcado de forma cómoda.",
    pt: "que permite personalizar e visualizar suas escolhas de moldura com praticidade.",
    fr: "qui vous permet de personnaliser et de visualiser vos choix d'encadrement en toute simplicité.",
    de: "mit dem Sie Ihre Rahmenwahl bequem personalisieren und visualisieren können.",
    ja: "を提供し、額装の選択をオンラインで手軽にパーソナライズ・可視化できます。",
  } satisfies LocalizedString,
  serviceCopy: {
    en: "We provide seamless communication and customized services for our clients. Our offices strategically located around the world, including in North America, Vietnam, and Malaysia, with an extensive service team boasting rich industry experience, we are ready to welcome clients at any time and provide personalized service. Our service team also conducts regular on-site visits, engaging in face-to-face discussions to better understand your needs and offer guidance. We provide 24/7 online customer support with quick responses to meet your needs promptly. We are always at your service, ready to address concerns and provide guidance at every step of our collaborative journey.",
    es: "Brindamos una comunicación fluida y servicios personalizados a nuestros clientes. Con oficinas estratégicas en distintos puntos del mundo, incluidas Norteamérica, Vietnam y Malasia, y un amplio equipo de servicio con gran experiencia en el sector, estamos siempre listos para recibir a los clientes y ofrecer atención personalizada. Nuestro equipo realiza visitas in situ periódicas para entender mejor sus necesidades y orientarle. Ofrecemos atención online 24/7 con respuestas rápidas para satisfacer sus necesidades sin demora. Siempre estamos a su disposición, listos para resolver dudas y guiarle en cada etapa de la colaboración.",
    pt: "Oferecemos comunicação fluida e serviços personalizados aos nossos clientes. Com escritórios estrategicamente localizados ao redor do mundo, incluindo América do Norte, Vietnã e Malásia, e uma ampla equipe de atendimento com vasta experiência no setor, estamos sempre prontos para receber clientes e oferecer atendimento personalizado. Nossa equipe realiza visitas presenciais regulares para entender melhor suas necessidades e orientá-lo. Oferecemos suporte online 24/7 com respostas rápidas. Estamos sempre à disposição para esclarecer dúvidas e orientar em todas as etapas da colaboração.",
    fr: "Nous offrons une communication fluide et des services sur mesure à nos clients. Avec des bureaux stratégiquement implantés dans le monde, notamment en Amérique du Nord, au Vietnam et en Malaisie, et une équipe dédiée riche d'une grande expérience sectorielle, nous accueillons nos clients à tout moment avec un service personnalisé. Notre équipe effectue également des visites régulières sur site pour mieux comprendre vos besoins. Notre support client en ligne 24/7 répond rapidement à vos sollicitations. Nous sommes toujours à votre disposition pour vous accompagner à chaque étape de notre collaboration.",
    de: "Wir bieten unseren Kunden reibungslose Kommunikation und maßgeschneiderte Services. Mit strategisch verteilten Büros u. a. in Nordamerika, Vietnam und Malaysia und einem erfahrenen Serviceteam empfangen wir Kunden jederzeit und bieten persönliche Betreuung. Unser Team führt zudem regelmäßig Vor-Ort-Termine, um Anforderungen besser zu verstehen. 24/7 Online-Kundensupport mit schnellen Antworten sorgt für zeitnahe Lösungen. Wir stehen jederzeit zu Ihrer Verfügung und begleiten Sie in jeder Phase der Zusammenarbeit.",
    ja: "クライアントへシームレスなコミュニケーションとカスタマイズされたサービスを提供します。北米、ベトナム、マレーシアなど世界各地の戦略的拠点と、業界経験豊富なサービスチームで、いつでもクライアントをお迎えし、パーソナライズされた対応を提供します。チームは定期的に現地訪問を行い、対面でニーズを把握し的確なアドバイスを実施。24 時間 365 日のオンラインカスタマーサポートで迅速に対応し、コラボレーションのあらゆる段階で常にお客様の側に立ち、相談ごとに丁寧に応じます。",
  } satisfies LocalizedString,
  contact: {
    telephoneNumber: "+86 13371591392",
    whatsappUrl: "https://api.whatsapp.com/send?phone=8613371591392",
    email: "info@intcoframing-us.com",
  },
};

// =============================================================================
// /solutions/certification
// =============================================================================

export const CERTIFICATION_PAGE = {
  heroTitle: {
    en: "Certification",
    es: "Certificación",
    pt: "Certificação",
    fr: "Certification",
    de: "Zertifizierung",
    ja: "認証",
  } satisfies LocalizedString,
  sectionTitle: {
    en: "RUN, GROW AND EXPAND YOUR BUSINESS",
    es: "DIRIJA, HAGA CRECER Y EXPANDA SU NEGOCIO",
    pt: "OPERE, FAÇA CRESCER E EXPANDA SEU NEGÓCIO",
    fr: "GÉREZ, DÉVELOPPEZ ET ÉTENDEZ VOTRE ACTIVITÉ",
    de: "FÜHREN, WACHSEN UND EXPANDIEREN SIE IHR GESCHÄFT",
    ja: "ビジネスを運営し、成長させ、拡大する",
  } satisfies LocalizedString,
  copy: {
    en: "Rest easy with our commitment to quality and compliance. Intco Framing provides outstanding products and quality services to global customers. We actively certify quality systems and cooperate with third-party audit agencies, customers, and suppliers for audit supervision.",
    es: "Tenga la tranquilidad de contar con nuestro compromiso con la calidad y el cumplimiento. Intco Framing ofrece productos sobresalientes y servicios de calidad a clientes globales. Certificamos activamente nuestros sistemas de calidad y colaboramos con agencias de auditoría externas, clientes y proveedores para la supervisión de auditorías.",
    pt: "Conte com nosso compromisso com qualidade e conformidade. A Intco Framing oferece produtos excepcionais e serviços de qualidade a clientes globais. Certificamos ativamente nossos sistemas de qualidade e cooperamos com agências de auditoria externas, clientes e fornecedores para supervisão de auditorias.",
    fr: "Soyez serein grâce à notre engagement en matière de qualité et de conformité. Intco Framing fournit des produits exceptionnels et un service de qualité à ses clients dans le monde entier. Nous certifions activement nos systèmes qualité et coopérons avec des organismes d'audit tiers, des clients et des fournisseurs pour la supervision des audits.",
    de: "Verlassen Sie sich auf unser Engagement für Qualität und Compliance. Intco Framing liefert weltweit hervorragende Produkte und Qualitätsservices. Wir zertifizieren unsere Qualitätssysteme aktiv und kooperieren mit unabhängigen Auditstellen, Kunden und Lieferanten zur Auditüberwachung.",
    ja: "品質とコンプライアンスに対する取り組みで、安心してご利用いただけます。Intco Framing は世界中のお客様に優れた製品と高品質なサービスを提供。品質システムの認証取得を積極的に進め、第三者監査機関、お客様、サプライヤーと連携して監査体制を整えています。",
  } satisfies LocalizedString,
};

// =============================================================================
// /solutions/global-production-and-supply
// =============================================================================

export const GLOBAL_PRODUCTION_PAGE = {
  heroTitle: {
    en: "Global Production and Supply",
    es: "Producción y suministro global",
    pt: "Produção e fornecimento global",
    fr: "Production et approvisionnement mondiaux",
    de: "Globale Produktion und Versorgung",
    ja: "グローバル生産・供給",
  } satisfies LocalizedString,
  partnerTitle: {
    en: "PARTNER WITH INTCO\nFOR THE BEST QUALITY PRODUCTS",
    es: "ASÓCIESE CON INTCO\nPARA OBTENER PRODUCTOS DE LA MÁXIMA CALIDAD",
    pt: "PARCERIA COM A INTCO\nPARA OS PRODUTOS DE MAIS ALTA QUALIDADE",
    fr: "ASSOCIEZ-VOUS À INTCO\nPOUR DES PRODUITS DE LA PLUS HAUTE QUALITÉ",
    de: "PARTNER WERDEN VON INTCO\nFÜR PRODUKTE HÖCHSTER QUALITÄT",
    ja: "INTCO とパートナーシップを結び\n最高品質の製品を",
  } satisfies LocalizedString,
  basesLines: {
    en: "Intco Vietnam\nIntco Malaysia",
    es: "Intco Vietnam\nIntco Malasia",
    pt: "Intco Vietnã\nIntco Malásia",
    fr: "Intco Vietnam\nIntco Malaisie",
    de: "Intco Vietnam\nIntco Malaysia",
    ja: "Intco Vietnam\nIntco Malaysia",
  } satisfies LocalizedString,
  copy: {
    en: "By strategically locating our factories in China, Vietnam and Malaysia, we enhance our resilience to external factors that may impact the supply chain and maximize efficiency and flexibility in meeting your demands. All of our factories ensure advanced production technology and equipment, quality manufacturing and flexible shipping. Operating in strict adherence to international quality standards, each factory has earned high recognition for product quality from our customers.",
    es: "Al ubicar estratégicamente nuestras fábricas en China, Vietnam y Malasia, fortalecemos nuestra resiliencia frente a factores externos que pueden afectar la cadena de suministro y maximizamos eficiencia y flexibilidad para atender su demanda. Todas nuestras plantas garantizan tecnología y equipos de producción avanzados, fabricación de calidad y envíos flexibles. Operamos en estricto cumplimiento de las normas internacionales de calidad y cada fábrica recibe un alto reconocimiento por parte de nuestros clientes.",
    pt: "Com fábricas estrategicamente localizadas na China, Vietnã e Malásia, reforçamos nossa resiliência a fatores externos que podem afetar a cadeia de suprimentos e maximizamos eficiência e flexibilidade para atender sua demanda. Todas as nossas plantas garantem tecnologia e equipamentos de produção avançados, manufatura de qualidade e envio flexível. Atuando em rigorosa conformidade com normas internacionais de qualidade, cada fábrica recebe alto reconhecimento dos nossos clientes.",
    fr: "En implantant stratégiquement nos usines en Chine, au Vietnam et en Malaisie, nous renforçons notre résilience face aux aléas pouvant impacter la chaîne d'approvisionnement et maximisons efficacité et flexibilité pour répondre à vos besoins. Toutes nos usines disposent de technologies et d'équipements de pointe, d'une production de qualité et d'une expédition flexible. Opérant dans le strict respect des normes internationales, chacune est reconnue pour l'excellence de ses produits.",
    de: "Durch die strategische Verteilung unserer Werke auf China, Vietnam und Malaysia stärken wir unsere Widerstandsfähigkeit gegenüber externen Risiken und maximieren Effizienz und Flexibilität in der Belieferung. Alle Werke verfügen über fortschrittliche Produktionstechnik, qualitativ hochwertige Fertigung und flexible Logistik. Im strikten Einklang mit internationalen Qualitätsstandards genießen unsere Werke hohe Anerkennung unserer Kunden.",
    ja: "中国、ベトナム、マレーシアに工場を戦略的に配置することで、サプライチェーンに影響しうる外部要因への耐性を高め、需要対応の効率性と柔軟性を最大化しています。すべての工場が先進的な生産技術・設備、高品質な製造、柔軟な出荷を確保。国際的な品質基準を厳格に順守し、各拠点はお客様から高い評価を得ています。",
  } satisfies LocalizedString,
  features: [
    {
      label: {
        en: "Flexible Shipping",
        es: "Envíos flexibles",
        pt: "Envio flexível",
        fr: "Expédition flexible",
        de: "Flexible Verschiffung",
        ja: "柔軟な出荷",
      } satisfies LocalizedString,
      iconUrl: "https://cdn.sanity.io/images/vzcnnept/production/2f4e6209a0b455826c8767300df6f437476728fd-68x68.png",
    },
    {
      label: {
        en: "Trade Facilitation",
        es: "Facilitación comercial",
        pt: "Facilitação comercial",
        fr: "Facilitation commerciale",
        de: "Handelserleichterung",
        ja: "貿易の円滑化",
      } satisfies LocalizedString,
      iconUrl: "https://cdn.sanity.io/images/vzcnnept/production/6c0ecde8196bb8ef6fd1079e5ab07970fe6c5172-68x68.png",
    },
    {
      label: {
        en: "Scale and Quality",
        es: "Escala y calidad",
        pt: "Escala e qualidade",
        fr: "Échelle et qualité",
        de: "Skalierung und Qualität",
        ja: "スケールと品質",
      } satisfies LocalizedString,
      iconUrl: "https://cdn.sanity.io/images/vzcnnept/production/61aece8a1c16c0a64d6c4288bd061b8c77638af6-68x68.png",
    },
    {
      label: {
        en: "Supply Chain Diversification",
        es: "Diversificación de la cadena de suministro",
        pt: "Diversificação da cadeia de suprimentos",
        fr: "Diversification de la chaîne d'approvisionnement",
        de: "Diversifizierung der Lieferkette",
        ja: "サプライチェーンの多様化",
      } satisfies LocalizedString,
      iconUrl: "https://cdn.sanity.io/images/vzcnnept/production/3d6ea41624baf255507b3ec299d00e906a62671e-68x68.png",
    },
    {
      label: {
        en: "Certification of Origin",
        es: "Certificación de origen",
        pt: "Certificação de origem",
        fr: "Certificat d'origine",
        de: "Ursprungszertifizierung",
        ja: "原産地証明",
      } satisfies LocalizedString,
      iconUrl: "https://cdn.sanity.io/images/vzcnnept/production/c1b5747369574d0948c2433e90dd3d4ed27f656f-68x68.png",
    },
  ],
};
