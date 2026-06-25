import Image from "next/image";
import Link from "next/link";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Download,
  Factory,
  Globe2,
  Headphones,
  Heart,
  Layers,
  Link2,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Ruler,
  Search,
} from "lucide-react";
import {
  BlogPost,
  ContentPage,
  formatDate,
  ImageLike,
  linesFromBody,
  Product,
  ProductCategory,
  Project,
  SiteData,
  Solution,
} from "@/lib/site-data";
import { Locale, blogCategoryLabel, localizePath, t } from "@/lib/i18n";
import {
  BUSINESS_INSIGHTS_PAGE,
  CERTIFICATION_PAGE,
  DESIGN_ENGINEERING_PAGE,
  GLOBAL_PRODUCTION_PAGE,
  LATEST_PRIMARY_CARDS,
  LATEST_SECONDARY_CARDS,
  MANUFACTURING_DELIVERY_PAGE,
  PROJECT_CARDS,
  RETAILER_SUPPORT_PAGE,
  SECTION_TITLES,
  pick,
} from "@/lib/solution-page-content";
import { ProductQuotePanel } from "@/components/product-quote-panel";
import { ProjectSourceGallerySwitcher } from "@/components/project-source-gallery-switcher";
import { SourceCategoryAddCartButton } from "@/components/source-category-add-cart-button";
import { ProductTestReportCoverflow } from "@/components/product-test-report-coverflow";
import { ProductCatalogTabs } from "@/components/product-catalog-tabs";
import { EnquiryList } from "@/components/enquiry-list";
import { LeadsCloudChatLink } from "@/components/leadscloud-chat-link";
import { CountUpStat } from "@/components/count-up-stat";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomeBlogSection } from "@/components/home-blog-section";
import { LazyVideoEmbed } from "@/components/lazy-video-embed";
import { SolutionsServicesSection, type SolutionsServiceItem } from "@/components/solutions-services-section";
import { SustainabilitySavingsTabs, SustainabilityVideoButton } from "@/components/sustainability-interactions";
import { WhoWeAreHistoryCarousel } from "@/components/who-we-are-history-carousel";
import { ContactMapTabs, type ContactFactory } from "@/components/contact-map-tabs";
import { HubSpotCatalogDownloadForm, HubSpotMainInquiryForm } from "@/components/hubspot-forms";
import {
  SourceProductAboutTabs,
  SourceProductGallery,
  SourceProductPurchaseControls,
  SourceRelatedProductsCarousel,
  type SourceColorChoice,
  type SourceRelatedProductItem,
} from "@/components/product-detail-source-interactions";
import { SOURCE_CATEGORY_LISTING_SNAPSHOTS } from "@/lib/source-category-listing-snapshots";
import { SOURCE_EMPTY_SEARCH_RESULTS, SOURCE_SEARCH_PAGE_SIZE, type SourceSearchResultItem } from "@/lib/source-search-results";

const PRODUCT_CATALOG_IMAGES = [
  "https://cdn.sanity.io/images/vzcnnept/production/4bc0e652c785ba585fe5eccee48b4058b96d2950-454x530.png",
  "https://cdn.sanity.io/images/vzcnnept/production/f5dd336b3e41d282253fd70fbced4d4acca35e66-425x530.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/5c51a4c3594ae05ad9ea8ba92b2bb5a90cc32d87-454x530.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/c23c5f7f54232cc44d01c43fd0e3bdbab82db3e2-454x530.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/9234092f7b021aa0b287e9bd0c8c0d31709be8b5-454x530.jpg",
];

const PRODUCT_REPORT_IMAGES = [
  { title: "FSC", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/642f57b565e401ac471efd3efa5454c4c20391c9-1240x1754.jpg" },
  { title: "ISO14001", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c91d7e684e95cebfeb0be3953cdfbf82c2fef012-1242x1748.jpg" },
  { title: "GRS", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8ca3426d219b5024cb61a26b45c1f15aad76ccf3-1241x1754.jpg" },
  { title: "ISO9001", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/82a14994d92311fd8706331d12f414eb3d403e44-1241x1754.jpg" },
];
const PRODUCT_REPORT_COVERFLOW_IMAGES = [
  PRODUCT_REPORT_IMAGES[1],
  PRODUCT_REPORT_IMAGES[2],
  PRODUCT_REPORT_IMAGES[0],
  PRODUCT_REPORT_IMAGES[3],
].filter(Boolean);
const WHAT_WE_DO_IMAGES: Record<string, string> = {
  mirror: "https://cdn.sanity.io/images/vzcnnept/production/dbc7073033b5ae16397f4914e0b6b7edcc3a1795-780x400.png",
  "picture frame": "https://cdn.sanity.io/images/vzcnnept/production/a167ef9afdeb8e629ab03cadb6190ab9756be1d3-780x400.png",
  art: "https://cdn.sanity.io/images/vzcnnept/production/735e5bcaf0d3bfe4421702212caa4ece5babc958-507x400.png",
  furniture: "https://cdn.sanity.io/images/vzcnnept/production/121d379a84100bd69e52c184fd40e551dd3f2bcf-517x400.png",
  "memo board": "https://cdn.sanity.io/images/vzcnnept/production/a3facdafa5adc642f3207e2c30b87b1c4cfb4b40-507x400.png",
};

const PRODUCTS_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/991d03d3894b0110d5612585b3ed49bc3fcd6132-1920x600.png";
const PRODUCT_TEST_REPORT_BG = "https://cdn.sanity.io/images/vzcnnept/production/19bc871cefc66c9f2b32cd7fc7dc531a0e144dee-1920x1153.png";
const PRODUCT_CONTACT_BG = "https://cdn.sanity.io/images/vzcnnept/production/2d72032762681b2813ab438b348244f0b7712214-1620x926.png";

const PRODUCT_CATEGORY_CARDS = [
  {
    title: "Mirror",
    path: "/mirror",
    imageUrl: WHAT_WE_DO_IMAGES.mirror,
  },
  {
    title: "Picture frame",
    path: "/picture-frame",
    imageUrl: WHAT_WE_DO_IMAGES["picture frame"],
  },
  {
    title: "Art",
    path: "/art",
    imageUrl: WHAT_WE_DO_IMAGES.art,
  },
  {
    title: "Furniture",
    path: "/furniture",
    imageUrl: WHAT_WE_DO_IMAGES.furniture,
  },
  {
    title: "Memo Board",
    path: "/memo-board",
    imageUrl: WHAT_WE_DO_IMAGES["memo board"],
  },
];

const MIRROR_COLLECTION_CARDS = [
  {
    title: "Wall Mirror",
    path: "/mirror/wall-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/ea7d1f8e4dda8f6a2f048a5aabce5c62332413cb-1200x1200.jpg",
  },
  {
    title: "Standing Mirror",
    path: "/mirror/standing-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8b5dee8703df8bfa1c9f7df6dcf312434f5d9b2c-488x608.jpg",
  },
  {
    title: "Leaner Mirror",
    path: "/mirror/leaner-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/aad0dbb336ea6f6165118668c3d4be65ff6aff48-488x608.jpg",
  },
  {
    title: "Door Mirror",
    path: "/mirror/door-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1c2b109e53fb4557d96cfeb37d232a217a8ad648-488x608.jpg",
  },
  {
    title: "LED Mirror",
    path: "/mirror/led-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/22e3bc607d9a7c4cbbd4fe86b4ca61592cb0e468-488x608.jpg",
  },
];

const MIRROR_BEST_SELLERS = [
  {
    title: "Aluminum Framed Arched Full Length Standing Mirror",
    path: "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8cf43b1679a5b07bb0450b9e1bd8e8f1072e70d7-1080x1080.jpg",
  },
  {
    title: "Aluminum Framed Round Wall Mirror with Wood Grain",
    path: "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8644e87dadf2b904a30bc284e4b812fb6ee7aae0-1080x1080.jpg",
  },
  {
    title: "Decorative Aluminum Framed Gold Wall Mirror",
    path: "/mirror/wall-mirror/decorative-aluminum-framed-gold-wall-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/0f63578666b66d119db869ab988d480bc29762ca-1080x1080.jpg",
  },
  {
    title: "Arched Alumium Framed LED Bathroom Wall Mounted Mirror",
    path: "/arched-alumium-framed-led-bathroom-wall-mounted-mirror",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3b44e5899cb0d9e6c02f640c2888536abcaea7c1-1080x1080.jpg",
  },
];

const MIRROR_CATEGORY_COPY = [
  {
    title: "Wall Mirror",
    body: "Wall mirrors are designed to be mounted on walls, offering a space-efficient solution. They come in various shapes and sizes, serving both functional and decorative purposes.",
  },
  {
    title: "Standing Mirror",
    body: "Standing mirrors are large, full-length mirrors typically placed on the floor. They offer the convenience of being placed anywhere in a room without the need for wall mounting. Standing mirrors are adjustable, making them ideal for different viewing angles.",
  },
  {
    title: "Leaner Mirror",
    body: "Leaner mirrors are larger mirrors that leaned against a wall rather than being mounted or placed on the floor. Leaner mirrors are popular for creating a stylish focal point and can visually expand the space.",
  },
  {
    title: "Door Mirror",
    body: "Door mirrors are designed to be mounted on the back of doors. They are space-saving and convenient, allowing for a quick outfit check as you enter or exit a room. Door mirrors are a practical solution for smaller spaces.",
  },
  {
    title: "LED Mirror",
    body: "LED mirrors come equipped with built-in LED lights, providing both illumination and functionality. They are often used in bathrooms or dressing areas to ensure optimal lighting for tasks like grooming and applying makeup.",
  },
];

const PICTURE_FRAME_COLLECTION_CARDS = [
  {
    title: "Tabletop Frame",
    path: "/picture-frame/tabletop-frame",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f8ba7c363f4cf5afb43d3fdc9f1dc30eeb4f8385-488x608.png",
  },
  {
    title: "Wall Frame",
    path: "/picture-frame/wall-frame",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/ec9a37de70cee2c75520d84beb2883d0b5e165be-488x608.png",
  },
  {
    title: "Poster Frame",
    path: "/picture-frame/poster-frame",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8d38b81a4e34ffb579a2e6027992bb761e2881fd-488x608.png",
  },
  {
    title: "Document Frame",
    path: "/picture-frame/document-frame",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1ebac44adfa4ba3ac82147de574a6903ffd38bb6-488x608.png",
  },
  {
    title: "Shadow Box",
    path: "/picture-frame/shadow-box",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/487eb0674cb4f5b56675170ca144778a6e34c2e0-488x608.png",
  },
  {
    title: "Collage Frame",
    path: "/picture-frame/collage-frame",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/2db3e3f5842a41b4dd01e2b4950e465ba69d7a6d-488x608.png",
  },
];

const PICTURE_FRAME_BEST_SELLERS = [
  {
    title: "Modern Black Aluminum Framed Poster Frame",
    path: "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a343a2ca1f9bf3c46641aa1c401e9f2ba587df3b-1080x1080.jpg",
  },
];

const PICTURE_FRAME_CATEGORY_COPY = [
  {
    title: "Tabletop Frame",
    body: "Tabletop frames are ideal for displaying photos on tables, shelves, or desks. Typically small and delicate, available in various shapes and materials to complement home decor.",
  },
  {
    title: "Wall Frame",
    body: "Most wall frames have a simple design that suits various home styles. If you plan to concentrate your photo displays on the wall, wall frames are a stylish option for creating a personalized space.",
  },
  {
    title: "Poster Frame",
    body: "Specifically designed for large posters, suitable for displaying artwork or collectibles. Typically simple in appearance to highlight the content being displayed. If you have large posters or artwork, choosing poster frames can effectively protect and showcase them.",
  },
  {
    title: "Document Frame",
    body: "Specifically designed to commemorate graduation photos and other essential documents. If you want to commemorate the special moment of your life, graduation frames are a meaningful choice.",
  },
  {
    title: "Shadow Box",
    body: "Suitable for displaying three-dimensional items such as medals, certificates, small objects, etc.",
  },
  {
    title: "Collage Frame",
    body: "Contains multiple photo slots, display multiple photos simultaneously, ideal for creating a photo wall or showcasing multiple important moments in life.",
  },
];

const ART_COLLECTION_CARDS = [
  {
    title: "Framed Art",
    path: "/art/framed-art",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/fbaddb82ec6612fd37198c47ac4515a1b7dd3e40-488x608.jpg",
  },
  {
    title: "Canvas Art",
    path: "/art/canvas-art",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1c8fa7b8179ca326b22cee6af1332f5b75a083e7-488x608.jpg",
  },
  {
    title: "Alternative Wall Decor",
    path: "/art/alternative-wall-decor",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/24b7d6f0bd8c302eeca1959d29ff59d95d395089-488x608.jpg",
  },
];

const ART_BEST_SELLERS = [
  {
    title: "Modern Abstract Canvas Wall Art",
    path: "/art/canvas-art/modern-abstract-canvas-wall-art",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9120ac358e686bd5728f47a28796caeb13550f4a-1080x1080.jpg",
  },
  {
    title: "Large Framed Canvas Wall Art Abstract Neutral",
    path: "/art/canvas-art/large-framed-canvas-wall-art-abstract-neutral",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6cb84a2de3622c91518a4b10b48253021c967ae8-1080x1080.jpg",
  },
  {
    title: "Framed Landscape Wall Art Room Decor 24x30",
    path: "/art/framed-art/framed-landscape-wall-art-room-decor-24x30",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f746ecef522aaff7341514ecc19810571b05d68c-1080x1080.jpg",
  },
];

const ART_CATEGORY_COPY = [
  {
    title: "Framed Art",
    body: "Framed art refers to artworks that are encased in a frame, providing both aesthetic and protective elements. The frame not only enhances the visual appeal of the artwork but also adds a layer of durability.",
  },
  {
    title: "Canvas Art",
    body: "Canvas art involves the direct printing or painting of images onto a canvas material. Canvas artworks often have a contemporary and modern aesthetic, with the canvas texture adding depth and character to the piece.",
  },
  {
    title: "Alternative Wall Décor",
    body: "Alternative wall décor encompasses a broad category of non-traditional and unconventional art pieces. This can include wood wall sculptures, woodblock print, or any creative installation that deviates from traditional framed or canvas art.",
  },
];

const FURNITURE_COLLECTION_CARDS = [
  {
    title: "Medicine Cabinet",
    path: "/furniture/medicine-cabinet",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/124a8aa00a5ceb681e46059f8e0b75b45a6eb844-488x608.jpg",
  },
  {
    title: "Shelf",
    path: "/furniture/shelf",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b2ad72d6f2c68e4ee657a2f0f08b642f3ff02594-488x608.jpg",
  },
];

const FURNITURE_BEST_SELLERS = [
  {
    title: "Black Rectangular Medicine Cabinet with Mirror 22x26.8 in",
    path: "/black-rectangular-medicine-cabinet-with-mirror-22x26-8-in",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/37a215cf76f626f7a04d8d9ebab283a5e0720b85-1080x1080.jpg",
  },
  {
    title: "Rectangular Frameless Mirror Medicine Cabinet 31.4x24.4",
    path: "/rectangular-medicine-cabinet-without-mirror-31-4x24-4",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/34ae05a8958a03ab3734491c866655fe1996c4b9-1080x1080.jpg",
  },
  {
    title: "Floating Shelves",
    path: "/furniture/shelf/floating-shelves",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/40401a0d63fb47ff88b241dbb69fee241424bc3e-1080x1080.jpg",
  },
];

const FURNITURE_CATEGORY_COPY = [
  {
    title: "Medicine Cabinet",
    body: "Combining a mirror with a medicine cabinet maximizes space utilization in bathrooms or other areas where it is installed. It serves dual purposes, providing storage for medications and toiletries while also serving as a mirror for grooming and personal care routines.",
  },
  {
    title: "Shelf",
    body: "Shelves maximize vertical space, allowing for efficient use of wall space and freeing up floor space for other purposes. Our shelves come in various shapes, sizes, and materials, allowing for customization to suit different storage needs and aesthetic preferences.",
  },
];

const MEMO_BOARD_COLLECTION_CARDS = [
  {
    title: "Chalkboard",
    path: "/memo-board/chalkboard",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3833cc2ffb3e0229af4932c81caf423418b2b3bb-488x608.jpg",
  },
  {
    title: "Dry Erase Board",
    path: "/memo-board/dry-erase-board",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9c11936d29b6115515d4b08afb905b999d44759b-488x608.jpg",
  },
  {
    title: "Cork Board",
    path: "/memo-board/cork-board",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/73838581e5a5a336e6145f18fb599b9d5d82550b-488x608.jpg",
  },
  {
    title: "Linen Board",
    path: "/memo-board/linen-board",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/7b5baa77481a0038d942d8fe37dbc1600b75dc23-488x608.jpg",
  },
];

const MEMO_BOARD_BEST_SELLERS = [
  {
    title: "Chalkboard Style Board Monthly Wall Calendar 18×24 Inch",
    path: "/chalkboard-style-board-monthly-wall-calendar-18x24-inch",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/89b55318b5d02a11b67f710808d0c2418197c9b1-1080x1080.jpg",
  },
  {
    title: "Wall Cork Board for Picture Display 20×20 Inch",
    path: "/wall-cork-board-for-photo-display-20x20-inch",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b9c9f7e70da023ab0a78096cc8ef43917a5b06c7-1080x1080.jpg",
  },
  {
    title: "Gold Framed Weekly Calendar Dry Erase Board 16×16 in",
    path: "/gold-framed-weekly-calendar-dry-erase-board-16x16-in",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b91804ba297fd21f5e08dd74e2c0b53e30ac07d2-1080x1080.jpg",
  },
  {
    title: "Gold Aluminum Framed Linen Bulletin Board 20X28",
    path: "/gold-aluminum-framed-linen-bulletin-board-20x28",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6ea0600570f656b12b767de33e7a9b27a68796b1-1080x1080.jpg",
  },
];

const MEMO_BOARD_CATEGORY_COPY = [
  {
    title: "Chalkboard",
    body: "Chalkboards have a smooth, matte black surface made of slate, wood, or other materials. Chalkboards are commonly used in classrooms, restaurants, cafes, and homes for writing menus, announcements, or artwork.",
  },
  {
    title: "Dry Erase Board",
    body: "Dry erase boards have a smooth, glossy surface designed for writing with dry erase markers, which can be easily wiped off. They are widely used in offices, meeting rooms, classrooms, and homes for brainstorming, presentations, scheduling, and note-taking.",
  },
  {
    title: "Cork Board",
    body: "Cork boards have a textured surface made of cork, a natural and sustainable material designed for pinning and displaying papers, notes, photos, and other lightweight items using push pins or thumbtacks. Cork boards are durable and self-healing.",
  },
  {
    title: "Linen Board",
    body: "Linen boards have a fabric-covered surface made of linen stretched over a backing board. Linen boards offer a more decorative and sophisticated appearance compared to cork boards, making them suitable for upscale or professional environments.",
  },
];

const PRODUCT_MANUALS = [
  {
    title: "Mirror",
    imageUrl: PRODUCT_CATALOG_IMAGES[0],
    description:
      "Decorating your wall with a mirror can add depth and fascination into your room. INTCO Framing offers a range ofmirrors suitable for any room in your home. Discover the ideal mirror to elevate your living space!",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/e9504a0c561871fc3bf64977c0cf3422b14d4ac8.pdf",
  },
  {
    title: "Picture Frame",
    imageUrl: PRODUCT_CATALOG_IMAGES[1],
    description:
      "Our picture frames are made of environmentally friendly materials. Explore picture frames in various shapes and styles at INTCO Framing. Display your cherished photos, meaningful moments, and essential documents elegantly.",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/ac5a5dc71999df117a822840396e5316e959fe85.pdf",
  },
  {
    title: "Art",
    imageUrl: PRODUCT_CATALOG_IMAGES[2],
    description:
      "Create your own gallery with wall art from INTCO Framing. Our diverse selection of art ensures your home is as exceptional as your individual taste.",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/028977eafacb8b680ee14b5fa6e189aaaa896015.pdf",
  },
  {
    title: "Memo Board",
    imageUrl: PRODUCT_CATALOG_IMAGES[3],
    description:
      "Discover a variety of framed chalkboards and cork boards at INTCO Framing. Whether it's a reminder, a note, or a piece of encouragement, add your personal touch to these boards. Explore our selection and find the perfect one that resonates with you!",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/6d799c22532743367157073fba4e53c7f23f434a.pdf",
  },
  {
    title: "Furniture",
    imageUrl: PRODUCT_CATALOG_IMAGES[4],
    description:
      "INTCO Framing delivers top-quality furniture, ranging from medicine cabinets to shelves, designed to maximize home storage space. INTCO Framing provides innovative storage solutions for a clutter-free living environment.",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/48aef4ec319fa1fafea80f9950e259b3cf5d48c0.pdf",
  },
];

const CONTACT_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/845d15b6ca8b13aea633aec140bb453434d77111-1920x600.jpg";
const CONTACT_FORM_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/c0c47f087a702a75fe1c217d2a2840c48805ca27-738x754.png";
const CONTACT_FORM_BADGE_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/3119322a4552b57420e30024f3a679b668e3f1f4-226x226.png";

const CONTACT_FACTORIES: ContactFactory[] = [
  {
    title: "Zibo Factory",
    address: "Qingtian Road, Qilu Chemical Industrial Park, Zibo, Shandong, China",
    zip: "Zip Code: 255414",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.8953210238024!2d118.2205699495053!3d36.80707716313149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35eaeb718bb68031%3A0x1be93d82102dfb49!2z6Iux56eR5Zu96ZmF!5e0!3m2!1sen!2s!4v1707203861992!5m2!1sen!2s",
  },
  {
    title: "Shanghai Factory",
    address: "No. 1299 Hubin Road, Fengxian District. Shanghai 201417, China",
    zip: "Zip Code: 201417",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3426.529914858967!2d121.44445908788926!3d30.815814515989736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b29a062652a48d%3A0x91572df7921c48a1!2sHu%20Bin%20Lu%2C%20Feng%20Xian%20Qu%2C%20Shang%20Hai%20Shi%2C%20China%2C%20201424!5e0!3m2!1sen!2s!4v1707203884177!5m2!1sen!2s",
  },
  {
    title: "Vietnam Factory",
    address: "Lot CN - 01/02 And CN - 01/03, South Of Zone A Bim Son Industrial Park, Bac Son Ward, Bim Son Town, Thanh Hoa, Vietnam",
    zip: "Zip Code: 444964",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.735946325924!2d105.84062237598233!3d20.10332201891823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31366367ff3917ed%3A0xbfcafdb0c07ecdf7!2sIntco%20Industries%20Vietnam%20Co.%2C%20Ltd!5e0!3m2!1sen!2s!4v1707203919001!5m2!1sen!2s",
  },
];

const CONTACT_FACTORY_LABELS: Record<Locale, { zibo: string; shanghai: string; vietnam: string; zip: string }> = {
  en: { zibo: "Zibo Factory", shanghai: "Shanghai Factory", vietnam: "Vietnam Factory", zip: "Zip Code" },
  es: { zibo: "Fábrica de Zibo", shanghai: "Fábrica de Shanghái", vietnam: "Fábrica de Vietnam", zip: "Código postal" },
  pt: { zibo: "Fábrica de Zibo", shanghai: "Fábrica de Xangai", vietnam: "Fábrica do Vietnã", zip: "Código postal" },
  fr: { zibo: "Usine de Zibo", shanghai: "Usine de Shanghai", vietnam: "Usine du Vietnam", zip: "Code postal" },
  de: { zibo: "Werk Zibo", shanghai: "Werk Shanghai", vietnam: "Werk Vietnam", zip: "Postleitzahl" },
  ja: { zibo: "淄博工場", shanghai: "上海工場", vietnam: "ベトナム工場", zip: "郵便番号" },
};

function localizedContactFactories(locale: Locale) {
  const labels = CONTACT_FACTORY_LABELS[locale];
  const titles = [labels.zibo, labels.shanghai, labels.vietnam];
  return CONTACT_FACTORIES.map((factory, index) => ({
    ...factory,
    title: titles[index] || factory.title,
    zip: factory.zip.replace(/^Zip Code/i, labels.zip),
  }));
}

const HOME_PROFILE_VIDEO_ID = "N7I6CgHXCZQ";
const HOME_PROFILE_VIDEO_SI = "S5SW7QBzqJsOwXMC";
const YOUTUBE_PLAYER_LANGUAGE: Record<Locale, string> = {
  en: "en",
  es: "es",
  pt: "pt",
  fr: "fr",
  de: "de",
  ja: "ja",
};
const HOME_PROFILE_VIDEO_COPY: Record<Locale, { playerTitle: string }> = {
  en: {
    playerTitle: "INTCO Framing video player",
  },
  es: {
    playerTitle: "Reproductor de video de INTCO Framing",
  },
  pt: {
    playerTitle: "Reprodutor de vídeo da INTCO Framing",
  },
  fr: {
    playerTitle: "Lecteur vidéo INTCO Framing",
  },
  de: {
    playerTitle: "INTCO Framing Videoplayer",
  },
  ja: {
    playerTitle: "INTCO Framing 動画プレーヤー",
  },
};

function homeProfileVideoSrc(locale: Locale) {
  const params = new URLSearchParams({
    si: HOME_PROFILE_VIDEO_SI,
    rel: "0",
    hl: YOUTUBE_PLAYER_LANGUAGE[locale],
    cc_lang_pref: YOUTUBE_PLAYER_LANGUAGE[locale],
  });
  return `https://www.youtube.com/embed/${HOME_PROFILE_VIDEO_ID}?${params.toString()}`;
}

const SOURCE_HOME_HERO_SLIDES: NonNullable<SiteData["homePage"]["heroSlides"]> = [
  {
    title: "INTCO FRAMING",
    subtitle: "We are committed to offering you turnkey service and ready to\ncreate retail solutions custom tailored to fulfill all your needs.",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5d66331f0d3c70250f5caf36a22be525464bbf6b-1920x940.jpg",
    primaryCta: { label: "Latest Products", path: "/products" },
    secondaryCta: { label: "Solutions", path: "/solutions" },
  },
  {
    title: "",
    subtitle: "",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/ca3c4efdafa252fe5fa5fb0c8973b8ad40625b8d-1920x940.gif",
    primaryCta: { label: "Explore More", path: "/mirror/led-mirror" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Mirror",
    subtitle: "Decorating your wall with a mirror can add depth and fascination into your room.\nlntco Framing offers a range of mirrors suitable for any room in your home.",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/59a0c1d393448f0d47ae814715b99daae1faf5e3-1920x940.jpg",
    primaryCta: { label: "Explore More", path: "/mirror" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Picture Frame",
    subtitle: "Our picture frames are all made of environmentally friendly materials.\nExplore picture frames in various shapes and styles at Intco Framing.",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/10b32dc50a81865cd7b9541a700b1428d0e62f46-1920x940.jpg",
    primaryCta: { label: "Explore More", path: "/picture-frame" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Wall Art",
    subtitle: "Create your own gallery with wall art from Intco Framing.\nOur diverse selection of art ensures your home is as exceptional as your individual taste.",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1c1c10a8712275c957d19aa26fb554e28cd8f5ba-1920x940.jpg",
    primaryCta: { label: "Explore More", path: "/art" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Flexible Manufacturing",
    subtitle: "With over 20 years of manufacturing experience, lntco Framing stands out for its flexible manufacturing capabilities.",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f4c03606892e1fcba5c39322ad30f3c6d2bab328-865x424.jpg",
    primaryCta: { label: "Explore More", path: "/solutions/manufacturing-delivery" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
];

const HOME_PRODUCT_COPY: Record<Locale, Record<string, string>> = {
  en: {
    mirror: "Decorating your wall with a mirror can add depth and fascination into rooms. Intco Framing offers a range of mirrors suitable for any room in home!",
    "picture-frame":
      "Our picture frames are all made of environmentally friendly materials. Explore picture frames in various shapes and styles at Intco Framing. Display your cherished photos, meaningful moments, and essential documents elegantly.",
    art: "Create your own gallery with wall art from Intco Framing. Our diverse selection of art ensures your home is as exceptional as your individual taste.",
    furniture:
      "Intco Framing delivers top-quality furniture, ranging from medicine cabinets to shelves, designed to maximize home storage space. Intco Framing provides innovative storage solutions for a clutter-free living environment.",
    "memo-board":
      "Discover a variety of framed chalkboards and cork boards at Intco Framing. Whether it's a reminder, a note, or a piece of encouragement, add your personal touch to these boards. Explore our selection and find the perfect one that resonates with you!",
  },
  es: {
    mirror: "Decorar la pared con un espejo aporta profundidad y carácter. Intco Framing ofrece espejos adecuados para cualquier espacio del hogar.",
    "picture-frame": "Nuestros marcos están fabricados con materiales respetuosos con el medio ambiente. Descubra estilos y formatos para fotos, recuerdos y documentos.",
    art: "Cree su propia galería con el arte mural de Intco Framing. Nuestra selección hace que su hogar refleje su gusto personal.",
    furniture: "Intco Framing ofrece muebles de alta calidad, desde botiquines con espejo hasta estantes, pensados para optimizar el almacenamiento en casa.",
    "memo-board": "Descubra pizarras y tableros de corcho enmarcados para recordatorios, notas e ideas. Encuentre la pieza perfecta para su espacio.",
  },
  pt: {
    mirror: "Decorar a parede com um espelho traz profundidade e charme. A Intco Framing oferece opções adequadas para qualquer ambiente da casa.",
    "picture-frame": "Nossas molduras são feitas com materiais ambientalmente responsáveis. Explore formatos e estilos para fotos, lembranças e documentos.",
    art: "Crie sua própria galeria com as artes de parede da Intco Framing. Nossa seleção faz sua casa refletir seu estilo pessoal.",
    furniture: "A Intco Framing oferece móveis de alta qualidade, de armários com espelho a prateleiras, para ampliar o armazenamento com praticidade.",
    "memo-board": "Descubra quadros e painéis emoldurados para lembretes, recados e inspirações. Encontre a opção ideal para o seu espaço.",
  },
  fr: {
    mirror: "Décorer un mur avec un miroir apporte profondeur et caractère. INTCO Framing propose des miroirs adaptés à chaque pièce de la maison.",
    "picture-frame": "Nos cadres sont fabriqués à partir de matériaux respectueux de l'environnement. Découvrez des formats et des styles pour photos, souvenirs et documents.",
    art: "Créez votre propre galerie avec l'art mural INTCO Framing. Notre sélection aide votre intérieur à refléter pleinement votre style.",
    furniture: "INTCO Framing propose du mobilier de qualité, des armoires miroir aux étagères, pour optimiser le rangement avec élégance.",
    "memo-board": "Découvrez des tableaux et panneaux encadrés pour notes, rappels et inspirations. Trouvez la pièce idéale pour votre espace.",
  },
  de: {
    mirror: "Ein Spiegel an der Wand sorgt für Tiefe und Charakter. INTCO Framing bietet passende Spiegel für jeden Raum im Zuhause.",
    "picture-frame": "Unsere Rahmen werden aus umweltfreundlichen Materialien gefertigt. Entdecken Sie Formate und Stile für Fotos, Erinnerungen und Dokumente.",
    art: "Gestalten Sie Ihre eigene Galerie mit Wandkunst von INTCO Framing. Unsere Auswahl bringt Ihren persönlichen Stil nach Hause.",
    furniture: "INTCO Framing bietet hochwertige Möbel von Spiegelschränken bis Regalen, um Stauraum stilvoll und effizient zu erweitern.",
    "memo-board": "Entdecken Sie gerahmte Tafeln und Pinnwände für Erinnerungen, Notizen und Ideen. Finden Sie die passende Lösung für Ihren Raum.",
  },
  ja: {
    mirror: "壁に鏡を取り入れることで、空間に奥行きと魅力が生まれます。INTCO Framing は住まいのさまざまな空間に合う鏡を提案します。",
    "picture-frame": "当社のフレームは環境に配慮した素材で作られています。写真や思い出、書類に合う多彩なスタイルをご覧ください。",
    art: "INTCO Framing のウォールアートでご自宅に自分だけのギャラリーを作りましょう。多彩な表現で空間に個性を与えます。",
    furniture: "ミラーキャビネットからシェルフまで、INTCO Framing は収納性を高める高品質な家具を提供します。",
    "memo-board": "メモや予定、アイデアを書き留められるフレーム付きボードを豊富にご用意。空間に合う一枚が見つかります。",
  },
};

const HOME_PROFILE_LINKS = [
  {
    label: "Sustainability",
    path: "/who-we-are/sustainability",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/82de05797e23e94e04f6ca63942dc064ee923161-108x110.png",
  },
  {
    label: "Certification",
    path: "/solutions/certification",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/0b9a89c2bc436c50470232b489a6b7ac7569abed-108x110.png",
  },
];

const HOME_PROFILE_STATS = [
  { value: "3", label: "Business Units", iconClass: "intco-home-stat-icon-frame" },
  { value: "6", label: "Production Bases", iconClass: "intco-home-stat-icon-base" },
  { value: "30", suffix: "+", label: "Years Experience", iconClass: "intco-home-stat-icon-stock" },
  { value: "4000", suffix: "+", label: "Employees", iconClass: "intco-home-stat-icon-team" },
];

const HOME_PROJECT_CARDS = [
  {
    title: "Residential",
    path: "/projects/residential",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/acce0a49eca755d0ab290d995d5fc2a77dd9b16e-780x400.jpg",
  },
  {
    title: "Commercial",
    path: "/projects/commercial",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/cc52cccd09155ee4b5d5b80e356a8326e0f025dc-780x400.jpg",
  },
];

const CATEGORY_SLUG_BY_SOURCE_TITLE: Record<string, string> = {
  Mirror: "mirror",
  "Wall Mirror": "wall-mirror",
  "Standing Mirror": "standing-mirror",
  "Leaner Mirror": "leaner-mirror",
  "Door Mirror": "door-mirror",
  "LED Mirror": "led-mirror",
  "Picture frame": "picture-frame",
  "Picture Frame": "picture-frame",
  "Tabletop Frame": "tabletop-frame",
  "Wall Frame": "wall-frame",
  "Poster Frame": "poster-frame",
  "Document Frame": "document-frame",
  "Shadow Box": "shadow-box",
  "Collage Frame": "collage-frame",
  Art: "art",
  "Wall Art": "art",
  "Framed Art": "framed-art",
  "Canvas Art": "canvas-art",
  "Alternative Wall Décor": "alternative-wall-decor",
  Furniture: "furniture",
  "Medicine Cabinet": "medicine-cabinet",
  Shelf: "shelf",
  "Memo Board": "memo-board",
  Chalkboard: "chalkboard",
  "Dry Erase Board": "dry-erase-board",
  "Cork Board": "cork-board",
  "Linen Board": "linen-board",
};

const SOURCE_HERO_LOCALIZED_INDEX = [0, -1, 1, 2, 3, 4];

const HOME_HERO_FALLBACK_SUBTITLES: Record<Locale, { intro: string; mirror: string; pictureFrame: string; wallArt: string; manufacturing: string }> = {
  en: {
    intro: "We are committed to offering you turnkey service and ready to create retail solutions custom tailored to fulfill all your needs.",
    mirror: "Decorating your wall with a mirror can add depth and fascination into your room. Intco Framing offers a range of mirrors suitable for any room in your home.",
    pictureFrame: "Our picture frames are all made of environmentally friendly materials. Explore picture frames in various shapes and styles at Intco Framing.",
    wallArt: "Create your own gallery with wall art from Intco Framing. Our diverse selection of art ensures your home is as exceptional as your individual taste.",
    manufacturing: "With over 20 years of manufacturing experience, Intco Framing stands out for its flexible manufacturing capabilities.",
  },
  es: {
    intro: "Nos comprometemos a ofrecer un servicio llave en mano y soluciones minoristas personalizadas para cubrir todas sus necesidades.",
    mirror: "Decorar la pared con un espejo aporta profundidad y encanto. INTCO Framing ofrece espejos adecuados para cualquier estancia del hogar.",
    pictureFrame: "Nuestros marcos están fabricados con materiales respetuosos con el medio ambiente. Descubra formas y estilos para cada espacio.",
    wallArt: "Cree su propia galería con el arte mural de INTCO Framing. Nuestra selección ayuda a reflejar su estilo personal.",
    manufacturing: "Con más de 20 años de experiencia, INTCO Framing destaca por su fabricación flexible y fiable.",
  },
  pt: {
    intro: "Estamos prontos para oferecer um serviço turnkey e soluções de varejo personalizadas para atender a todas as suas necessidades.",
    mirror: "Decorar a parede com um espelho traz profundidade e charme. A INTCO Framing oferece opções para qualquer ambiente da casa.",
    pictureFrame: "Nossas molduras são produzidas com materiais sustentáveis. Explore diferentes formatos e estilos para cada espaço.",
    wallArt: "Crie sua própria galeria com as artes de parede da INTCO Framing. Nossa seleção valoriza o estilo único da sua casa.",
    manufacturing: "Com mais de 20 anos de experiência, a INTCO Framing se destaca por sua fabricação flexível e confiável.",
  },
  fr: {
    intro: "Nous proposons un service clé en main et des solutions retail sur mesure pour répondre à l'ensemble de vos besoins.",
    mirror: "Un miroir apporte profondeur et raffinement à vos murs. INTCO Framing propose des modèles adaptés à chaque pièce.",
    pictureFrame: "Nos cadres sont conçus à partir de matériaux respectueux de l'environnement. Découvrez formats et styles pour tous les espaces.",
    wallArt: "Créez votre propre galerie avec l'art mural INTCO Framing. Notre sélection valorise le style singulier de votre intérieur.",
    manufacturing: "Avec plus de 20 ans d'expérience, INTCO Framing se distingue par une fabrication flexible et fiable.",
  },
  de: {
    intro: "Wir bieten schlüsselfertigen Service und maßgeschneiderte Retail-Lösungen für Ihre individuellen Anforderungen.",
    mirror: "Ein Spiegel verleiht Wänden Tiefe und Ausdruck. INTCO Framing bietet passende Modelle für jeden Raum im Zuhause.",
    pictureFrame: "Unsere Rahmen werden aus umweltfreundlichen Materialien gefertigt. Entdecken Sie Formen und Stile für jede Umgebung.",
    wallArt: "Gestalten Sie Ihre eigene Galerie mit Wandkunst von INTCO Framing. Unsere Auswahl unterstreicht den persönlichen Stil Ihres Zuhauses.",
    manufacturing: "Mit über 20 Jahren Erfahrung steht INTCO Framing für flexible und zuverlässige Fertigung.",
  },
  ja: {
    intro: "ターンキーサービスと小売向けのカスタムソリューションで、多様なニーズにお応えします。",
    mirror: "壁に鏡を取り入れることで、空間に奥行きと魅力が生まれます。住まいのあらゆる空間に合う製品をご提案します。",
    pictureFrame: "当社のフレームは環境配慮型素材で作られています。さまざまな形状とスタイルからお選びいただけます。",
    wallArt: "INTCO Framing のウォールアートで、自分だけのギャラリーを演出しましょう。空間に個性をもたらします。",
    manufacturing: "20年以上の実績を持つ INTCO Framing は、柔軟で信頼性の高い製造力を強みとしています。",
  },
};

const HOME_COMPANY_PROFILE_FALLBACK: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Company Profile",
    description: "Founded in 2002, INTCO upholds the reputation for high quality, great designs, and fast delivery to fulfill all aspects of a project - from artistry to functionality, saving you time and money.",
  },
  es: {
    title: "Perfil de la empresa",
    description: "Fundada en 2002, INTCO mantiene una sólida reputación por su calidad, diseño y rapidez de entrega, cubriendo cada aspecto del proyecto con eficiencia.",
  },
  pt: {
    title: "Perfil da empresa",
    description: "Fundada em 2002, a INTCO é reconhecida por qualidade, design e agilidade na entrega, atendendo cada etapa do projeto com eficiência.",
  },
  fr: {
    title: "Profil de l'entreprise",
    description: "Fondée en 2002, INTCO est reconnue pour sa qualité, son design et sa rapidité d'exécution, couvrant tous les aspects d'un projet avec efficacité.",
  },
  de: {
    title: "Unternehmensprofil",
    description: "Seit 2002 steht INTCO für Qualität, starkes Design und schnelle Lieferung, um alle Projektanforderungen effizient und wirtschaftlich abzudecken.",
  },
  ja: {
    title: "会社概要",
    description: "2002年の創業以来、INTCO は高品質、優れたデザイン、迅速な納品で評価され、芸術性から機能性まで幅広いプロジェクト要件に応えてきました。",
  },
};

const HOME_COMPANY_PROFILE_POINT_SOURCE = [
  "Cutting-edge Advanced",
  "Best-in-Class Retail Design",
  "On-Time Delivery Service",
  "End-to-end Support",
];

const HOME_COMPANY_PROFILE_POINTS_FALLBACK: Record<Locale, string[]> = {
  en: HOME_COMPANY_PROFILE_POINT_SOURCE,
  es: [
    "Tecnología avanzada de vanguardia",
    "Diseño retail de primer nivel",
    "Servicio de entrega puntual",
    "Soporte integral de extremo a extremo",
  ],
  pt: [
    "Tecnologia avançada de ponta",
    "Design de varejo de primeira classe",
    "Serviço de entrega pontual",
    "Suporte completo de ponta a ponta",
  ],
  fr: [
    "Technologie avancée de pointe",
    "Design retail de premier ordre",
    "Service de livraison ponctuel",
    "Accompagnement de bout en bout",
  ],
  de: [
    "Fortschrittliche Spitzentechnologie",
    "Retail-Design auf höchstem Niveau",
    "Pünktlicher Lieferservice",
    "End-to-End-Support",
  ],
  ja: [
    "最先端の高度な技術",
    "最高水準のリテールデザイン",
    "納期厳守の配送サービス",
    "エンドツーエンドのサポート",
  ],
};

const HOME_SOLUTION_FALLBACK_DESCRIPTIONS: Record<string, Record<Locale, string>> = {
  "/solutions/business-insights-trends": {
    en: "With extensive relationships with our retail partners, we hold a distinct advantage which includes real time global market analysis.",
    es: "Gracias a nuestra estrecha relación con socios minoristas, ofrecemos análisis del mercado global en tiempo real para apoyar mejores decisiones.",
    pt: "Com relações sólidas com parceiros de varejo, entregamos análises globais em tempo real para apoiar decisões mais inteligentes.",
    fr: "Grâce à nos relations avec nos partenaires retail, nous fournissons des analyses marché en temps réel pour soutenir les décisions stratégiques.",
    de: "Dank enger Beziehungen zu Handelspartnern liefern wir Echtzeit-Analysen des globalen Marktes für fundierte Entscheidungen.",
    ja: "小売パートナーとの強い連携により、グローバル市場の動向をリアルタイムで分析し、意思決定を支援します。",
  },
  "/solutions/design-engineering": {
    en: "Collaborate with our skilled design and engineering teams for innovative product design, packaging and display support.",
    es: "Colabore con nuestros equipos de diseño e ingeniería para impulsar innovación de producto, empaque y exhibición.",
    pt: "Trabalhe com nossas equipes de design e engenharia para desenvolver produtos, embalagens e exibições mais competitivos.",
    fr: "Collaborez avec nos équipes design et ingénierie pour faire avancer l'innovation produit, l'emballage et le display.",
    de: "Arbeiten Sie mit unseren Design- und Engineering-Teams an Produktinnovation, Verpackung und Display-Lösungen.",
    ja: "デザインとエンジニアリングのチームが、製品開発からパッケージ・展示設計まで一体で支援します。",
  },
  "/solutions/manufacturing-delivery": {
    en: "Our vertically integrated supply chain helps us maintain stable quality, strong capacity and dependable delivery.",
    es: "Nuestra cadena de suministro integrada verticalmente nos permite mantener calidad estable, capacidad sólida y entregas fiables.",
    pt: "Nossa cadeia integrada verticalmente garante qualidade estável, alta capacidade e entregas confiáveis.",
    fr: "Notre chaîne intégrée verticalement garantit une qualité stable, une forte capacité et des livraisons fiables.",
    de: "Unsere vertikal integrierte Lieferkette sichert stabile Qualität, hohe Kapazität und verlässliche Lieferungen.",
    ja: "垂直統合型のサプライチェーンにより、安定した品質と高い生産能力、確かな納品体制を実現します。",
  },
  "/solutions/global-production-and-supply": {
    en: "With production in China, Vietnam and Malaysia, we improve flexibility, resilience and response speed across the supply chain.",
    es: "Con producción en China, Vietnam y Malasia, aumentamos la flexibilidad, la resiliencia y la velocidad de respuesta de la cadena de suministro.",
    pt: "Com produção na China, Vietnã e Malásia, ampliamos a flexibilidade, a resiliência e a velocidade da cadeia de suprimentos.",
    fr: "Avec des sites en Chine, au Vietnam et en Malaisie, nous renforçons flexibilité, résilience et réactivité de la supply chain.",
    de: "Mit Produktionsstandorten in China, Vietnam und Malaysia erhöhen wir Flexibilität, Resilienz und Reaktionsgeschwindigkeit der Lieferkette.",
    ja: "中国・ベトナム・マレーシアの生産拠点により、サプライチェーン全体の柔軟性と回復力、対応スピードを高めています。",
  },
  "/solutions/certification": {
    en: "Rest easy with our commitment to quality and compliance, backed by active certifications and third-party supervision.",
    es: "Confíe en nuestro compromiso con la calidad y el cumplimiento, respaldado por certificaciones activas y auditorías externas.",
    pt: "Conte com nosso compromisso com qualidade e conformidade, apoiado por certificações e auditorias externas.",
    fr: "Appuyez-vous sur notre engagement qualité et conformité, soutenu par des certifications actives et des audits externes.",
    de: "Verlassen Sie sich auf unser Qualitäts- und Compliance-Versprechen, gestützt durch Zertifizierungen und externe Audits.",
    ja: "品質とコンプライアンスへの取り組みを、各種認証と第三者監査でしっかり裏付けています。",
  },
  "/solutions/retailer-support": {
    en: "We support retail partners from recycled-material sourcing to ongoing sell-through assistance and merchandising collaboration.",
    es: "Apoyamos a los socios minoristas desde el origen de materiales reciclados hasta la asistencia comercial y de exhibición continua.",
    pt: "Apoiamos parceiros de varejo desde a origem de materiais reciclados até merchandising e suporte contínuo às vendas.",
    fr: "Nous accompagnons les distributeurs depuis l'origine des matériaux recyclés jusqu'au merchandising et au support commercial continu.",
    de: "Wir unterstützen Handelspartner von der Herkunft recycelter Materialien bis zu Merchandising und laufender Verkaufsunterstützung.",
    ja: "再生素材の調達段階から売場づくり、継続的な販売支援まで、小売パートナーを一貫してサポートします。",
  },
};

function localizedHomeHeroSlides(homePage: SiteData["homePage"], locale: Locale, categories: ProductCategory[], solutions: Solution[]) {
  if (locale === "en") return SOURCE_HOME_HERO_SLIDES;
  const localizedSlides = homePage.heroSlides || [];
  const fallbackSubtitles = HOME_HERO_FALLBACK_SUBTITLES[locale];
  return SOURCE_HOME_HERO_SLIDES.map((sourceSlide, index) => {
    const localizedIndex = SOURCE_HERO_LOCALIZED_INDEX[index];
    const translated = localizedIndex >= 0 ? localizedSlides[localizedIndex] : undefined;
    const fallbackTitle =
      index === 2
        ? categories.find((item) => item.path === "/mirror")?.title
        : index === 3
          ? categories.find((item) => item.path === "/picture-frame")?.title
          : index === 4
            ? categories.find((item) => item.path === "/art")?.title
            : index === 5
              ? solutions.find((item) => item.path === "/solutions/manufacturing-delivery")?.title
              : sourceSlide.title;
    const fallbackSubtitle =
      index === 0
        ? fallbackSubtitles.intro
        : index === 2
          ? fallbackSubtitles.mirror
          : index === 3
            ? fallbackSubtitles.pictureFrame
            : index === 4
              ? fallbackSubtitles.wallArt
              : index === 5
                ? fallbackSubtitles.manufacturing
                : sourceSlide.subtitle;
    return {
      ...sourceSlide,
      title: translated?.title ?? fallbackTitle ?? sourceSlide.title,
      subtitle: translated?.subtitle ?? fallbackSubtitle ?? sourceSlide.subtitle,
      primaryCta: sourceSlide.primaryCta
        ? {
            ...sourceSlide.primaryCta,
            label: translated?.primaryCta?.label || t(locale, sourceSlide.primaryCta.path === "/products" ? "latestProducts" : "exploreMore"),
          }
        : undefined,
      secondaryCta: sourceSlide.secondaryCta
        ? {
            ...sourceSlide.secondaryCta,
            label: translated?.secondaryCta?.label || t(locale, sourceSlide.secondaryCta.path === "/solutions" ? "solutions" : "contactUs"),
          }
        : undefined,
    };
  });
}

function localizedHomeStats(locale: Locale) {
  return HOME_PROFILE_STATS.map((stat) => {
    const keyByLabel: Record<string, string> = {
      "Business Units": "businessUnits",
      "Production Bases": "productionBases",
      "Years Experience": "yearsExperience",
      Employees: "employees",
    };
    return { ...stat, label: t(locale, keyByLabel[stat.label] || stat.label) };
  });
}

function localizedHomeProfileLinks(locale: Locale) {
  return HOME_PROFILE_LINKS.map((item) => ({
    ...item,
    label: item.path.includes("sustainability") ? t(locale, "sustainability") : t(locale, "certification"),
  }));
}

function localizedHomeCompanyProfilePoints(locale: Locale, points?: string[]) {
  const sourcePoints = points?.length ? points : HOME_COMPANY_PROFILE_POINT_SOURCE;
  const fallbackPoints = HOME_COMPANY_PROFILE_POINTS_FALLBACK[locale] || HOME_COMPANY_PROFILE_POINT_SOURCE;
  const stillSourceEnglish = sourcePoints.every((point, index) => point === HOME_COMPANY_PROFILE_POINT_SOURCE[index]);
  return locale === "en" || !stillSourceEnglish ? sourcePoints : fallbackPoints;
}

function localizedProjectCard(project: (typeof HOME_PROJECT_CARDS)[number], locale: Locale) {
  return {
    ...project,
    title: project.title === "Residential" ? t(locale, "residential") : t(locale, "commercial"),
  };
}

function categoryBySourceTitle(categories: ProductCategory[], title: string) {
  const slug = CATEGORY_SLUG_BY_SOURCE_TITLE[title] || title.toLowerCase().replace(/\s+/g, "-");
  return categories.find((category) => category.slug === slug);
}

function localizeSourceCategoryCard<T extends { title: string; path: string; imageUrl: string }>(card: T, categories: ProductCategory[], locale: Locale): T {
  if (locale === "en") return card;
  const category = categories.find((item) => item.path === card.path) || categoryBySourceTitle(categories, card.title);
  return category ? { ...card, title: category.title } : card;
}

function sourceCategoryViewAllHref(cards: Array<{ path: string }>, fallbackPath: string, locale: Locale) {
  return localizePath(locale, cards[0]?.path || fallbackPath);
}

function localizeSourceProductCard<T extends { title: string; path: string; imageUrl: string }>(card: T, products: Product[], locale: Locale): T {
  if (locale === "en") return card;
  const product = products.find((item) => item.path === card.path);
  return product ? { ...card, title: product.title } : card;
}

const CATEGORY_COPY_BODY_TRANSLATIONS: Record<Exclude<Locale, "en">, Record<string, string>> = {
  es: {
    "Wall Mirror":
      "Los espejos de pared están diseñados para instalarse en muros y ofrecen una solución que ahorra espacio. Están disponibles en distintas formas y tamaños, con funciones decorativas y prácticas.",
    "Standing Mirror":
      "Los espejos de pie son espejos grandes de cuerpo entero que normalmente se colocan en el suelo. Pueden ubicarse libremente sin montaje mural y ajustarse para distintos ángulos de visión.",
    "Leaner Mirror":
      "Los espejos apoyados son piezas de gran formato que se apoyan contra la pared en lugar de fijarse o colocarse con soporte. Crean un punto focal elegante y ayudan a ampliar visualmente el espacio.",
    "Door Mirror":
      "Los espejos de puerta se instalan en la parte posterior de las puertas. Ahorran espacio y permiten revisar rápidamente el atuendo al entrar o salir, por lo que son ideales para zonas compactas.",
    "LED Mirror":
      "Los espejos LED integran iluminación, combinando luz y funcionalidad. Se usan a menudo en baños o vestidores para tareas como el cuidado personal y el maquillaje.",
    "Tabletop Frame":
      "Los marcos de sobremesa son ideales para mostrar fotos en mesas, estanterías o escritorios. Suelen ser pequeños y delicados, y están disponibles en distintas formas y materiales para complementar la decoración del hogar.",
    "Wall Frame":
      "La mayoría de los marcos de pared tienen un diseño sencillo que se adapta a diversos estilos de hogar. Si desea concentrar sus fotos en la pared, son una opción elegante para crear un espacio personalizado.",
    "Poster Frame":
      "Diseñados específicamente para pósteres grandes, son adecuados para exhibir obras de arte o piezas coleccionables. Su apariencia suele ser sencilla para destacar el contenido, protegerlo y presentarlo de forma efectiva.",
    "Document Frame":
      "Diseñados para conmemorar fotos de graduación y otros documentos importantes. Si desea conservar un momento especial de su vida, los marcos para documentos son una elección significativa.",
    "Shadow Box":
      "Adecuados para exhibir objetos tridimensionales como medallas, certificados y piezas pequeñas.",
    "Collage Frame":
      "Incluyen varias aberturas para fotos y permiten mostrar múltiples imágenes a la vez, ideales para crear una pared fotográfica o presentar varios momentos importantes.",
    "Framed Art":
      "El arte enmarcado se refiere a obras protegidas por un marco, que aporta valor estético y protección. El marco realza la apariencia de la obra y añade durabilidad.",
    "Canvas Art":
      "El arte en lienzo consiste en imprimir o pintar imágenes directamente sobre tela. Suele ofrecer una estética contemporánea, con una textura que añade profundidad y carácter.",
    "Alternative Wall Décor":
      "La decoración mural alternativa abarca piezas no tradicionales y creativas, como esculturas de madera, impresiones en bloques o instalaciones que se apartan del arte enmarcado o en lienzo convencional.",
    "Medicine Cabinet":
      "Combinar un espejo con un botiquín maximiza el uso del espacio en baños u otras áreas. Cumple una doble función: almacenamiento para medicamentos y artículos de tocador, y espejo para el cuidado personal.",
    "Shelf":
      "Las repisas aprovechan el espacio vertical, liberando superficie en el suelo. Nuestras repisas vienen en distintas formas, tamaños y materiales para adaptarse a diversas necesidades de almacenamiento y estilos.",
    "Chalkboard":
      "Los pizarrones tienen una superficie negra mate y lisa, hecha de pizarra, madera u otros materiales. Se usan en aulas, restaurantes, cafeterías y hogares para menús, avisos o dibujos.",
    "Dry Erase Board":
      "Las pizarras blancas tienen una superficie lisa y brillante para escribir con marcadores borrables. Se usan en oficinas, salas de reunión, aulas y hogares para ideas, presentaciones, planificación y notas.",
    "Cork Board":
      "Los tableros de corcho tienen una superficie texturizada de corcho natural y sostenible, pensada para fijar papeles, notas, fotos y objetos ligeros con chinchetas. Son duraderos y autorreparables.",
    "Linen Board":
      "Los tableros de lino tienen una superficie de tela tensada sobre una base. Ofrecen una apariencia más decorativa y sofisticada que el corcho, adecuada para entornos profesionales o de mayor nivel.",
  },
  pt: {
    "Wall Mirror":
      "Os espelhos de parede são feitos para instalação em paredes e oferecem uma solução que economiza espaço. Estão disponíveis em diferentes formas e tamanhos, com funções decorativas e práticas.",
    "Standing Mirror":
      "Os espelhos de chão são espelhos grandes, de corpo inteiro, normalmente colocados no piso. Podem ser posicionados livremente sem fixação na parede e ajustados para diferentes ângulos de visão.",
    "Leaner Mirror":
      "Os espelhos de apoio são peças maiores que ficam encostadas à parede, em vez de serem fixadas ou apoiadas por suporte. Criam um ponto focal elegante e ajudam a ampliar visualmente o ambiente.",
    "Door Mirror":
      "Os espelhos de porta são instalados na parte de trás das portas. Economizam espaço e permitem uma checagem rápida do visual ao entrar ou sair, sendo ideais para áreas compactas.",
    "LED Mirror":
      "Os espelhos LED contam com iluminação integrada, unindo luz e funcionalidade. São frequentemente usados em banheiros ou áreas de vestir para cuidados pessoais e maquiagem.",
    "Tabletop Frame":
      "Porta-retratos de mesa são ideais para exibir fotos em mesas, prateleiras ou escrivaninhas. Geralmente pequenos e delicados, estão disponíveis em diversas formas e materiais para complementar a decoração.",
    "Wall Frame":
      "A maioria dos quadros de parede tem design simples e combina com diferentes estilos de casa. Para concentrar suas fotos na parede, são uma opção elegante para criar um espaço personalizado.",
    "Poster Frame":
      "Projetados especificamente para pôsteres grandes, são adequados para exibir obras de arte ou itens colecionáveis. O visual costuma ser simples para destacar, proteger e valorizar o conteúdo exibido.",
    "Document Frame":
      "Projetados para celebrar fotos de formatura e outros documentos importantes. Para guardar um momento especial da vida, os quadros para documentos são uma escolha significativa.",
    "Shadow Box":
      "Adequadas para exibir itens tridimensionais, como medalhas, certificados e pequenos objetos.",
    "Collage Frame":
      "Contêm várias aberturas para fotos e permitem exibir diversas imagens ao mesmo tempo, ideais para criar uma parede de fotos ou mostrar vários momentos importantes.",
    "Framed Art":
      "Arte emoldurada refere-se a obras envolvidas por uma moldura, oferecendo valor estético e proteção. A moldura realça o visual da obra e acrescenta durabilidade.",
    "Canvas Art":
      "Arte em tela envolve impressão ou pintura diretamente sobre o tecido. Essas peças costumam ter estética contemporânea, com textura que acrescenta profundidade e personalidade.",
    "Alternative Wall Décor":
      "Decoração de parede alternativa inclui peças criativas e não tradicionais, como esculturas em madeira, impressões em bloco ou instalações que fogem da arte emoldurada ou em tela convencional.",
    "Medicine Cabinet":
      "Combinar espelho e armário para medicamentos maximiza o uso do espaço em banheiros ou outras áreas. A peça oferece armazenamento para medicamentos e produtos de higiene, além de funcionar como espelho.",
    "Shelf":
      "As prateleiras aproveitam o espaço vertical, liberando área no piso. Nossas prateleiras vêm em várias formas, tamanhos e materiais para atender a diferentes necessidades de armazenamento e estilos.",
    "Chalkboard":
      "Os quadros de giz têm superfície preta fosca e lisa, feita de ardósia, madeira ou outros materiais. São usados em salas de aula, restaurantes, cafés e residências para menus, avisos ou desenhos.",
    "Dry Erase Board":
      "Os quadros brancos têm superfície lisa e brilhante para escrita com marcadores apagáveis. São comuns em escritórios, salas de reunião, escolas e casas para ideias, apresentações, agendas e notas.",
    "Cork Board":
      "Os quadros de cortiça têm superfície texturizada feita de cortiça natural e sustentável, ideal para fixar papéis, notas, fotos e itens leves com tachinhas. São duráveis e autorregenerativos.",
    "Linen Board":
      "Os quadros de linho têm superfície revestida com tecido esticado sobre uma base. Oferecem aparência mais decorativa e sofisticada que a cortiça, adequada para ambientes profissionais ou refinados.",
  },
  fr: {
    "Wall Mirror":
      "Les miroirs muraux sont conçus pour être fixés au mur et offrent une solution gain de place. Disponibles dans de nombreuses formes et dimensions, ils sont à la fois décoratifs et fonctionnels.",
    "Standing Mirror":
      "Les miroirs sur pied sont de grands miroirs pleine longueur, généralement posés au sol. Ils peuvent être placés librement sans fixation murale et ajustés selon différents angles de vue.",
    "Leaner Mirror":
      "Les miroirs à poser sont de grands miroirs appuyés contre un mur, plutôt que fixés ou installés sur support. Ils créent un point focal élégant et agrandissent visuellement l’espace.",
    "Door Mirror":
      "Les miroirs de porte se fixent à l’arrière des portes. Pratiques et peu encombrants, ils permettent une vérification rapide de la tenue et conviennent aux petits espaces.",
    "LED Mirror":
      "Les miroirs LED intègrent un éclairage, combinant luminosité et fonctionnalité. Ils sont souvent utilisés dans les salles de bains ou espaces dressing pour la toilette et le maquillage.",
    "Tabletop Frame":
      "Les cadres à poser sont parfaits pour présenter des photos sur des tables, étagères ou bureaux. Généralement petits et délicats, ils existent en plusieurs formes et matériaux pour compléter la décoration intérieure.",
    "Wall Frame":
      "La plupart des cadres muraux ont un design simple adapté à différents styles d’intérieur. Si vous souhaitez concentrer vos photos au mur, ils constituent une option élégante pour personnaliser l’espace.",
    "Poster Frame":
      "Spécialement conçus pour les grands posters, ils conviennent à l’exposition d’œuvres ou d’objets de collection. Leur apparence simple met le contenu en valeur tout en le protégeant efficacement.",
    "Document Frame":
      "Conçus pour mettre en valeur les photos de remise de diplôme et autres documents importants. Pour commémorer un moment spécial, les cadres pour documents sont un choix plein de sens.",
    "Shadow Box":
      "Adaptées à l’exposition d’objets en trois dimensions, comme des médailles, certificats ou petits souvenirs.",
    "Collage Frame":
      "Dotés de plusieurs ouvertures photo, ils permettent d’afficher plusieurs images en même temps, idéal pour créer un mur photo ou présenter différents moments importants.",
    "Framed Art":
      "L’art encadré désigne des œuvres placées dans un cadre, apportant à la fois esthétique et protection. Le cadre renforce l’impact visuel de l’œuvre et ajoute une couche de durabilité.",
    "Canvas Art":
      "L’art sur toile consiste à imprimer ou peindre une image directement sur une toile. Ces œuvres ont souvent une esthétique contemporaine, avec une texture qui apporte profondeur et caractère.",
    "Alternative Wall Décor":
      "La décoration murale alternative regroupe des pièces créatives et non traditionnelles, comme les sculptures murales en bois, les impressions sur bois ou les installations qui s’éloignent des cadres et toiles classiques.",
    "Medicine Cabinet":
      "Associer un miroir à une armoire à pharmacie optimise l’espace dans la salle de bains ou ailleurs. La pièce offre du rangement pour médicaments et articles de toilette, tout en servant de miroir.",
    "Shelf":
      "Les étagères exploitent l’espace vertical, libérant de la surface au sol. Nos étagères existent en plusieurs formes, tailles et matériaux pour s’adapter aux besoins de rangement et aux styles décoratifs.",
    "Chalkboard":
      "Les tableaux noirs possèdent une surface mate et lisse, en ardoise, bois ou autres matériaux. Ils sont utilisés dans les salles de classe, restaurants, cafés et maisons pour menus, annonces ou dessins.",
    "Dry Erase Board":
      "Les tableaux blancs ont une surface lisse et brillante conçue pour les marqueurs effaçables. Ils sont courants dans les bureaux, salles de réunion, classes et maisons pour idées, présentations, plannings et notes.",
    "Cork Board":
      "Les panneaux en liège ont une surface texturée en liège naturel et durable, conçue pour fixer papiers, notes, photos et objets légers avec des punaises. Ils sont résistants et auto-cicatrisants.",
    "Linen Board":
      "Les panneaux en lin possèdent une surface textile tendue sur un support. Plus décoratifs et sophistiqués que le liège, ils conviennent aux environnements professionnels ou haut de gamme.",
  },
  de: {
    "Wall Mirror":
      "Wandspiegel werden an der Wand montiert und bieten eine platzsparende Lösung. Sie sind in vielen Formen und Größen erhältlich und erfüllen sowohl dekorative als auch praktische Funktionen.",
    "Standing Mirror":
      "Standspiegel sind große Ganzkörperspiegel, die meist auf dem Boden stehen. Sie lassen sich flexibel ohne Wandmontage platzieren und für verschiedene Blickwinkel ausrichten.",
    "Leaner Mirror":
      "Anlehnspiegel sind größere Spiegel, die an die Wand gelehnt werden, statt fest montiert oder aufgestellt zu sein. Sie schaffen einen stilvollen Blickfang und vergrößern Räume optisch.",
    "Door Mirror":
      "Türspiegel werden auf der Rückseite von Türen montiert. Sie sparen Platz und ermöglichen einen schnellen Outfit-Check beim Betreten oder Verlassen des Raums, ideal für kompakte Bereiche.",
    "LED Mirror":
      "LED-Spiegel verfügen über integrierte Beleuchtung und verbinden Licht mit Funktionalität. Sie werden häufig in Badezimmern oder Ankleidebereichen für Pflege und Make-up verwendet.",
    "Tabletop Frame":
      "Tischrahmen eignen sich ideal, um Fotos auf Tischen, Regalen oder Schreibtischen zu präsentieren. Sie sind meist klein und fein gearbeitet und in verschiedenen Formen und Materialien erhältlich.",
    "Wall Frame":
      "Die meisten Wandrahmen haben ein schlichtes Design, das zu vielen Wohnstilen passt. Wenn Sie Fotos gebündelt an der Wand zeigen möchten, sind Wandrahmen eine stilvolle Lösung.",
    "Poster Frame":
      "Speziell für große Poster entwickelt und geeignet für Kunstwerke oder Sammlerstücke. Das meist schlichte Erscheinungsbild hebt den Inhalt hervor und schützt sowie präsentiert ihn wirkungsvoll.",
    "Document Frame":
      "Speziell für Abschlussfotos und andere wichtige Dokumente entwickelt. Wenn Sie einen besonderen Moment bewahren möchten, sind Dokumentenrahmen eine bedeutungsvolle Wahl.",
    "Shadow Box":
      "Geeignet zur Präsentation dreidimensionaler Objekte wie Medaillen, Zertifikate und kleiner Erinnerungsstücke.",
    "Collage Frame":
      "Mit mehreren Fotoöffnungen können mehrere Bilder gleichzeitig gezeigt werden, ideal für Fotowände oder zur Präsentation wichtiger Lebensmomente.",
    "Framed Art":
      "Gerahmte Kunst bezeichnet Werke, die von einem Rahmen eingefasst sind und dadurch Ästhetik und Schutz erhalten. Der Rahmen verstärkt die Wirkung des Kunstwerks und erhöht die Haltbarkeit.",
    "Canvas Art":
      "Leinwandkunst entsteht durch Druck oder Malerei direkt auf Leinwand. Diese Werke wirken oft modern und zeitgemäß, wobei die Leinwandstruktur Tiefe und Charakter verleiht.",
    "Alternative Wall Décor":
      "Alternative Wanddekoration umfasst kreative, nicht traditionelle Stücke wie Holz-Wandskulpturen, Holzblockdrucke oder Installationen abseits klassischer Rahmen- und Leinwandkunst.",
    "Medicine Cabinet":
      "Die Kombination aus Spiegel und Medizinschrank nutzt den Platz im Badezimmer oder anderen Bereichen optimal. Sie bietet Stauraum für Medikamente und Pflegeprodukte und dient zugleich als Spiegel.",
    "Shelf":
      "Regale nutzen vertikalen Raum effizient und schaffen mehr freie Bodenfläche. Unsere Regale sind in verschiedenen Formen, Größen und Materialien erhältlich und passen zu unterschiedlichen Stauraum- und Stilbedürfnissen.",
    "Chalkboard":
      "Kreidetafeln haben eine glatte, matte schwarze Oberfläche aus Schiefer, Holz oder anderen Materialien. Sie werden in Schulen, Restaurants, Cafés und zu Hause für Menüs, Hinweise oder Zeichnungen genutzt.",
    "Dry Erase Board":
      "Whiteboards haben eine glatte, glänzende Oberfläche für trocken abwischbare Marker. Sie werden in Büros, Besprechungsräumen, Schulen und zu Hause für Ideen, Präsentationen, Planung und Notizen genutzt.",
    "Cork Board":
      "Korktafeln besitzen eine strukturierte Oberfläche aus natürlichem, nachhaltigem Kork, auf der Papiere, Notizen, Fotos und leichte Objekte mit Pinnnadeln befestigt werden können. Sie sind robust und selbstheilend.",
    "Linen Board":
      "Leinentafeln haben eine stoffbezogene Oberfläche aus gespanntem Leinen auf einer Trägerplatte. Sie wirken dekorativer und hochwertiger als Korktafeln und eignen sich für professionelle oder gehobene Umgebungen.",
  },
  ja: {
    "Wall Mirror":
      "壁掛けミラーは壁面に取り付けるために設計され、省スペースで使えるアイテムです。さまざまな形状とサイズがあり、装飾性と実用性を兼ね備えています。",
    "Standing Mirror":
      "スタンドミラーは床に置いて使う大型の全身鏡です。壁に固定せず自由に配置でき、角度調整がしやすいため、さまざまな視点で身だしなみを確認できます。",
    "Leaner Mirror":
      "リーナーミラーは壁に立て掛けて使う大型ミラーです。空間のアクセントになり、部屋をより広く見せる効果もあります。",
    "Door Mirror":
      "ドアミラーはドアの背面に取り付けるためのミラーです。省スペースで、出入りの際に服装をすばやく確認できるため、限られた空間に適しています。",
    "LED Mirror":
      "LEDミラーは照明を内蔵し、明るさと機能性を兼ね備えています。洗面所やドレッシングスペースで、身だしなみやメイクのための適切な照明を提供します。",
    "Tabletop Frame":
      "卓上フレームは、テーブル、棚、デスクの上で写真を飾るのに最適です。小ぶりで繊細なデザインが多く、さまざまな形状や素材からインテリアに合わせて選べます。",
    "Wall Frame":
      "壁フレームはシンプルなデザインが多く、幅広い住空間のスタイルに調和します。写真を壁面にまとめて飾りたい場合、個性ある空間づくりに適した選択肢です。",
    "Poster Frame":
      "ポスターフレームは大型ポスター向けに設計され、アート作品やコレクションの展示に適しています。装飾を抑えたデザインで内容を引き立て、作品を保護しながら美しく見せます。",
    "Document Frame":
      "ドキュメントフレームは卒業写真や大切な書類を記念として飾るために設計されています。人生の特別な瞬間を残したいときに意味のある選択肢です。",
    "Shadow Box":
      "シャドーボックスは、メダル、証明書、小物などの立体的なアイテムを飾るのに適しています。",
    "Collage Frame":
      "コラージュフレームは複数の写真枠を備え、一度に複数の写真を飾れます。フォトウォールづくりや、人生の大切な瞬間をまとめて見せるのに最適です。",
    "Framed Art":
      "フレームアートは、作品を額装することで美観と保護性を高めたアートです。フレームは作品の見栄えを引き立てるだけでなく、耐久性も高めます。",
    "Canvas Art":
      "キャンバスアートは、キャンバス素材に直接印刷または描画した作品です。現代的な印象を与え、キャンバスの質感が作品に奥行きと個性を加えます。",
    "Alternative Wall Décor":
      "オルタナティブウォールデコールは、従来の額装アートやキャンバスアートにとらわれない装飾です。木製ウォールスカルプチャー、木版プリント、創造的なインスタレーションなどが含まれます。",
    "Medicine Cabinet":
      "ミラー付きメディシンキャビネットは、浴室などの限られた空間を有効活用できます。薬や洗面用品の収納として使えるだけでなく、身だしなみ用の鏡としても機能します。",
    "Shelf":
      "シェルフは壁面の縦方向のスペースを活用し、床面をすっきり保ちます。さまざまな形状、サイズ、素材を用意しており、収納ニーズやインテリアに合わせて選べます。",
    "Chalkboard":
      "チョークボードは、スレート、木材、その他素材で作られた滑らかな黒色マット面を持つボードです。教室、レストラン、カフェ、家庭でメニュー、案内、アートの記入に使われます。",
    "Dry Erase Board":
      "ホワイトボードは、ドライイレースマーカーで書き消しできる滑らかな光沢面を持つボードです。オフィス、会議室、教室、家庭でアイデア出し、プレゼン、予定管理、メモに使われます。",
    "Cork Board":
      "コルクボードは、天然でサステナブルなコルク素材の表面を備え、紙、メモ、写真、軽量アイテムをピンで留めて掲示できます。耐久性があり、ピン跡が戻りやすい特徴があります。",
    "Linen Board":
      "リネンボードは、台板にリネン生地を張ったファブリック面のボードです。コルクボードより装飾性と上質感があり、プロフェッショナルな空間や洗練された環境に適しています。",
  },
};

const CATEGORY_INTRO_TRANSLATIONS: Record<Exclude<Locale, "en">, Record<string, string>> = {
  es: {
    "Find the perfect mirror at Intco Framing. Explore the latest bathroom solutions at INTCO Framing with our wall mirrors, standing mirrors, and LED mirrors.":
      "Encuentre el espejo perfecto en Intco Framing. Explore nuestras soluciones para baño con espejos de pared, espejos de pie y espejos LED.",
    "Find the perfect picture frame at Intco Framing. Browse our best sellers, including tabletop frames, wall frames, and poster frames. Everything you want is here.":
      "Encuentre el marco perfecto en Intco Framing. Explore nuestros más vendidos, incluidos marcos de sobremesa, marcos de pared y marcos para póster. Todo lo que busca está aquí.",
    "Explore Intco Framing unique art collection. From framed art and canvas art to alternative wall decor, discover our best sellers to suit your style. Shop now!":
      "Explore la colección de arte única de Intco Framing. Desde arte enmarcado y lienzos hasta decoración mural alternativa, descubra los más vendidos que encajan con su estilo.",
    "Explore Intco Framing premium furniture collection. From medicine cabinets to shelves, discover our latest home storage solutions. Shop now!":
      "Explore la colección de muebles premium de Intco Framing. Desde botiquines hasta repisas, descubra nuestras últimas soluciones de almacenamiento para el hogar.",
  },
  pt: {
    "Find the perfect mirror at Intco Framing. Explore the latest bathroom solutions at INTCO Framing with our wall mirrors, standing mirrors, and LED mirrors.":
      "Encontre o espelho perfeito na Intco Framing. Explore nossas soluções para banheiro com espelhos de parede, espelhos de chão e espelhos LED.",
    "Find the perfect picture frame at Intco Framing. Browse our best sellers, including tabletop frames, wall frames, and poster frames. Everything you want is here.":
      "Encontre a moldura perfeita na Intco Framing. Veja nossos mais vendidos, incluindo porta-retratos de mesa, quadros de parede e molduras para pôsteres.",
    "Explore Intco Framing unique art collection. From framed art and canvas art to alternative wall decor, discover our best sellers to suit your style. Shop now!":
      "Explore a coleção exclusiva de arte da Intco Framing. De arte emoldurada e telas a decoração de parede alternativa, descubra os mais vendidos para o seu estilo.",
    "Explore Intco Framing premium furniture collection. From medicine cabinets to shelves, discover our latest home storage solutions. Shop now!":
      "Explore a coleção premium de móveis da Intco Framing. De armários para medicamentos a prateleiras, conheça nossas soluções mais recentes de armazenamento doméstico.",
  },
  fr: {
    "Find the perfect mirror at Intco Framing. Explore the latest bathroom solutions at INTCO Framing with our wall mirrors, standing mirrors, and LED mirrors.":
      "Trouvez le miroir idéal chez Intco Framing. Découvrez nos solutions de salle de bains avec miroirs muraux, miroirs sur pied et miroirs LED.",
    "Find the perfect picture frame at Intco Framing. Browse our best sellers, including tabletop frames, wall frames, and poster frames. Everything you want is here.":
      "Trouvez le cadre idéal chez Intco Framing. Parcourez nos meilleures ventes, dont les cadres à poser, cadres muraux et cadres pour posters.",
    "Explore Intco Framing unique art collection. From framed art and canvas art to alternative wall decor, discover our best sellers to suit your style. Shop now!":
      "Explorez la collection d’art unique d’Intco Framing. De l’art encadré aux toiles et décorations murales alternatives, découvrez nos meilleures ventes adaptées à votre style.",
    "Explore Intco Framing premium furniture collection. From medicine cabinets to shelves, discover our latest home storage solutions. Shop now!":
      "Explorez la collection de meubles premium d’Intco Framing. Des armoires à pharmacie aux étagères, découvrez nos dernières solutions de rangement pour la maison.",
  },
  de: {
    "Find the perfect mirror at Intco Framing. Explore the latest bathroom solutions at INTCO Framing with our wall mirrors, standing mirrors, and LED mirrors.":
      "Finden Sie den passenden Spiegel bei Intco Framing. Entdecken Sie aktuelle Badlösungen mit Wandspiegeln, Standspiegeln und LED-Spiegeln.",
    "Find the perfect picture frame at Intco Framing. Browse our best sellers, including tabletop frames, wall frames, and poster frames. Everything you want is here.":
      "Finden Sie den passenden Bilderrahmen bei Intco Framing. Entdecken Sie unsere Bestseller, darunter Tischrahmen, Wandrahmen und Posterrahmen.",
    "Explore Intco Framing unique art collection. From framed art and canvas art to alternative wall decor, discover our best sellers to suit your style. Shop now!":
      "Entdecken Sie die einzigartige Kunstkollektion von Intco Framing. Von gerahmter Kunst und Leinwandbildern bis zu alternativer Wanddekoration finden Sie Bestseller für Ihren Stil.",
    "Explore Intco Framing premium furniture collection. From medicine cabinets to shelves, discover our latest home storage solutions. Shop now!":
      "Entdecken Sie die Premium-Möbelkollektion von Intco Framing. Von Medizinschränken bis zu Regalen finden Sie aktuelle Aufbewahrungslösungen für Ihr Zuhause.",
  },
  ja: {
    "Find the perfect mirror at Intco Framing. Explore the latest bathroom solutions at INTCO Framing with our wall mirrors, standing mirrors, and LED mirrors.":
      "Intco Framingで理想のミラーを見つけてください。壁掛けミラー、スタンドミラー、LEDミラーなど、最新のバスルームソリューションをご覧いただけます。",
    "Find the perfect picture frame at Intco Framing. Browse our best sellers, including tabletop frames, wall frames, and poster frames. Everything you want is here.":
      "Intco Framingで最適な額縁を見つけてください。卓上フレーム、壁フレーム、ポスターフレームなど、人気商品を幅広くご用意しています。",
    "Explore Intco Framing unique art collection. From framed art and canvas art to alternative wall decor, discover our best sellers to suit your style. Shop now!":
      "Intco Framingの個性豊かなアートコレクションをご覧ください。フレームアート、キャンバスアート、オルタナティブウォールデコールまで、スタイルに合う人気商品をお選びいただけます。",
    "Explore Intco Framing premium furniture collection. From medicine cabinets to shelves, discover our latest home storage solutions. Shop now!":
      "Intco Framingのプレミアム家具コレクションをご覧ください。メディシンキャビネットからシェルフまで、最新のホーム収納ソリューションをご提案します。",
  },
};

function localizeSourceCopyItems(items: Array<{ title: string; body: string }>, categories: ProductCategory[], locale: Locale) {
  if (locale === "en") return items;
  return items.map((item) => {
    const category = categoryBySourceTitle(categories, item.title);
    const translatedBody = CATEGORY_COPY_BODY_TRANSLATIONS[locale]?.[item.title];
    return {
      title: category?.title || item.title,
      body: translatedBody || category?.description || item.body,
    };
  });
}

function localizedCategoryIntro(category: ProductCategory | undefined, fallback: string, locale: Locale) {
  if (locale === "en") return fallback;
  return CATEGORY_INTRO_TRANSLATIONS[locale]?.[fallback] || category?.description || fallback;
}

function solutionTitleFallback(locale: Locale, path: string, fallback: string) {
  switch (path) {
    case "/solutions/business-insights-trends":
      return t(locale, "businessInsights");
    case "/solutions/design-engineering":
      return t(locale, "designEngineering");
    case "/solutions/manufacturing-delivery":
      return t(locale, "manufacturingDelivery");
    case "/solutions/global-production-and-supply":
      return t(locale, "globalProductionAndSupply");
    case "/solutions/certification":
      return t(locale, "certification");
    case "/solutions/retailer-support":
      return t(locale, "retailerSupport");
    default:
      return fallback;
  }
}

function solutionDescriptionFallback(locale: Locale, path: string, fallback: string) {
  return HOME_SOLUTION_FALLBACK_DESCRIPTIONS[path]?.[locale] || fallback;
}

const PROJECTS_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/9b23c10023cc8a909addb8f37416a5b645a3c9d6-1920x600.jpg";

const PROJECTS_SOURCE_ITEMS = [
  {
    title: "Living Room",
    path: "/projects/living-room",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5ce16cd5091a3670547c1fba432b74c29f8e1d30-1920x600.jpg",
    description:
      "Transform your living room into a sanctuary of comfort and style with our curated collection. Our carefully selected furniture pieces seamlessly blend aesthetic…",
  },
  {
    title: "Bedroom",
    path: "/projects/bedroom",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5dbce0690de3ee1cad5c101630d2a7836acdfd9f-1920x600.jpg",
    description:
      "Indulge in the serenity of our bedroom collection, where tranquility meets timeless design. Our carefully curated pieces promise a sanctuary of relaxation and r…",
  },
  {
    title: "Bathroom",
    path: "/projects/bathroom",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a01b0f5bbc659deccd2fa1b9d6aa90e9bcbb998d-1920x600.jpg",
    description:
      "Step into a realm of tranquility with our exquisite bathroom collection, where luxury meets functionality. Elevate your daily routine in a space designed for se…",
  },
  {
    title: "Dining Room",
    path: "/projects/dining-room",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/89acde9c8166abb67d259d867bd216b627f8e747-1920x600.jpg",
    description:
      "Transform your dining experience into a visual feast with our dining room collection. Immerse yourself in the perfect blend of contemporary elegance and comfort…",
  },
  {
    title: "Kitchen",
    path: "/projects/kitchen",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/eb11242f592f8c9114ea829817db66889d728891-1920x600.jpg",
    description:
      "Infuse your kitchen with the warmth of modern aesthetics. Embrace the art of culinary creation in a kitchen that seamlessly blends style and functionality, wher…",
  },
];

const PROJECTS_SOURCE_CHILDRENS_ROOM = {
  title: "Children's Room",
  path: "/projects/childrens-room",
  imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/89b4c59e8ce555489d6be8ce837167c81fb45ef8-1920x600.jpg",
  description:
    "Step into a world of imagination and whimsy with our enchanting children's room collection. Designed to spark creativity and nurture dreams, each piece is craft…",
};

const PROJECTS_SOURCE_PAGE_ITEMS: Record<number, typeof PROJECTS_SOURCE_ITEMS> = {
  1: PROJECTS_SOURCE_ITEMS,
  2: [
    PROJECTS_SOURCE_CHILDRENS_ROOM,
    {
      title: "Hotel",
      path: "/projects/hotel",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a7cdcd0667ed9c3001562568060b733f6e1f4695-1920x600.jpg",
      description:
        "Experience the epitome of luxury and sophistication in our hotel collection, where every detail is curated for an unparalleled stay.Our thoughtfully curated spa…",
    },
    {
      title: "Office",
      path: "/projects/office",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c38074316781cff5e02748afe546e2d42426307e-1920x600.jpg",
      description:
        "Our exclusive decor collection designed toelevate your office space to new heights of sophistication. From sleek desk accessories to statement wall art, each pi…",
    },
    {
      title: "Gallery",
      path: "/projects/gallery",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f2ad1f3996fbc651c928fd0f65631e6e821df111-1920x600.jpg",
      description:
        "Our art collection is a celebration of diverse styles and expressions. Wander through our gallery space, where every brushstroke tells a unique story. Elevate y…",
    },
    {
      title: "Cafes",
      path: "/projects/cafes",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/504b428e70e599afa0726bb0609a6a7071fc940b-1920x600.jpg",
      description:
        "Experience the sophisticated ambiance enhanced by our curated wall decor collection, transforming every corner into a gallery of visual delight. Allow the rich …",
    },
  ],
  3: [
    {
      title: "Restaurant",
      path: "/projects/restaurant",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f5ebdca06555a9bd8d8a3b14f34d1b8b905fa8b2-1920x600.jpg",
      description:
        "Our thoughtfully selected collection transforms the dining experience, creating an atmosphere that sparks conversation and enhances the pleasure of every bite. …",
    },
    {
      title: "Large Commercial Space",
      path: "/projects/large-commercial-space",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b8ae99414189f7642a6b67702a6874e415d41286-1920x600.jpg",
      description:
        "Transform vast expanses into dynamic hubs of innovation and style with our large commercial space solutions. Elevate the ambiance with our curated collection, o…",
    },
    {
      title: "School",
      path: "/projects/school",
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5c7f35f8591a4f5fc05ea7c0a91fd7ee14e28b61-1920x600.jpg",
      description:
        "Create an inspiring and conducive learning environment with our tailored solutions for schools. Our comprehensive approach to educational spaces brings together…",
    },
  ],
};

const PROJECTS_SOURCE_PAGE_SIZE = 5;
const PROJECTS_SOURCE_ORDER = [...PROJECTS_SOURCE_PAGE_ITEMS[1], ...PROJECTS_SOURCE_PAGE_ITEMS[2], ...PROJECTS_SOURCE_PAGE_ITEMS[3]].map((item) => item.path);
const PROJECTS_SOURCE_ITEM_BY_PATH = new Map([...PROJECTS_SOURCE_PAGE_ITEMS[1], ...PROJECTS_SOURCE_PAGE_ITEMS[2], ...PROJECTS_SOURCE_PAGE_ITEMS[3]].map((item) => [item.path, item]));
const PROJECTS_SOURCE_RESIDENTIAL_PATHS = new Set([...PROJECTS_SOURCE_ITEMS, PROJECTS_SOURCE_CHILDRENS_ROOM].map((item) => item.path));
const PROJECTS_SOURCE_COMMERCIAL_PATHS = new Set([...PROJECTS_SOURCE_PAGE_ITEMS[2].slice(1), ...PROJECTS_SOURCE_PAGE_ITEMS[3]].map((item) => item.path));
type ProjectSourceCopy = {
  title: string;
  description: string;
};

const PROJECTS_SOURCE_COPY_TRANSLATIONS: Record<Exclude<Locale, "en">, Record<string, ProjectSourceCopy>> = {
  es: {
    "/projects/living-room": {
      title: "Sala de estar",
      description: "Transforma tu sala de estar en un refugio de confort y estilo con nuestra colección seleccionada. Cada pieza combina estética y funcionalidad de forma natural.",
    },
    "/projects/bedroom": {
      title: "Dormitorio",
      description: "Disfruta la serenidad de nuestra colección para dormitorio, donde la calma se une al diseño atemporal para crear un espacio pensado para el descanso.",
    },
    "/projects/bathroom": {
      title: "Baño",
      description: "Entra en un ambiente de tranquilidad con nuestra colección para baño, donde el lujo y la funcionalidad elevan la rutina diaria.",
    },
    "/projects/dining-room": {
      title: "Comedor",
      description: "Convierte cada comida en una experiencia visual con nuestra colección para comedor, que combina elegancia contemporánea y comodidad.",
    },
    "/projects/kitchen": {
      title: "Cocina",
      description: "Aporta calidez moderna a tu cocina con soluciones que integran estilo y funcionalidad para realzar cada momento culinario.",
    },
    "/projects/childrens-room": {
      title: "Habitación infantil",
      description: "Descubre una habitación infantil llena de imaginación y encanto, diseñada para despertar la creatividad y acompañar los sueños de los niños.",
    },
    "/projects/hotel": {
      title: "Hotel",
      description: "Ofrece lujo y sofisticación con nuestra colección para hoteles, cuidada en cada detalle para mejorar la experiencia de cada estancia.",
    },
    "/projects/office": {
      title: "Oficina",
      description: "Eleva tu oficina con una colección decorativa exclusiva, desde accesorios de escritorio hasta arte mural que aporta orden y sofisticación.",
    },
    "/projects/gallery": {
      title: "Galería",
      description: "Nuestra colección de arte celebra estilos y expresiones diversas. Cada obra aporta una historia propia y enriquece la experiencia del espacio.",
    },
    "/projects/cafes": {
      title: "Cafés",
      description: "Crea una atmósfera sofisticada con decoración mural seleccionada, transformando cada rincón del café en una experiencia visual acogedora.",
    },
    "/projects/restaurant": {
      title: "Restaurante",
      description: "Nuestra colección transforma la experiencia gastronómica, creando un ambiente que invita a conversar y realza el placer de cada bocado.",
    },
    "/projects/large-commercial-space": {
      title: "Gran espacio comercial",
      description: "Convierte grandes superficies en espacios dinámicos de innovación y estilo con soluciones decorativas pensadas para ambientes comerciales.",
    },
    "/projects/school": {
      title: "Escuela",
      description: "Crea entornos de aprendizaje inspiradores y funcionales con soluciones adaptadas a escuelas, pensadas para apoyar la concentración y la creatividad.",
    },
  },
  pt: {
    "/projects/living-room": {
      title: "Sala de estar",
      description: "Transforme sua sala de estar em um refúgio de conforto e estilo com nossa coleção selecionada. Cada peça combina estética e funcionalidade com naturalidade.",
    },
    "/projects/bedroom": {
      title: "Quarto",
      description: "Aproveite a serenidade da nossa coleção para quarto, onde tranquilidade e design atemporal criam um espaço dedicado ao descanso.",
    },
    "/projects/bathroom": {
      title: "Banheiro",
      description: "Entre em um ambiente de tranquilidade com nossa coleção para banheiro, onde luxo e funcionalidade elevam a rotina diária.",
    },
    "/projects/dining-room": {
      title: "Sala de jantar",
      description: "Transforme cada refeição em uma experiência visual com nossa coleção para sala de jantar, unindo elegância contemporânea e conforto.",
    },
    "/projects/kitchen": {
      title: "Cozinha",
      description: "Leve o calor da estética moderna para sua cozinha com soluções que unem estilo e funcionalidade em cada momento culinário.",
    },
    "/projects/childrens-room": {
      title: "Quarto infantil",
      description: "Entre em um universo de imaginação e encanto com nossa coleção para quarto infantil, criada para estimular a criatividade e os sonhos.",
    },
    "/projects/hotel": {
      title: "Hotel",
      description: "Experimente luxo e sofisticação com nossa coleção para hotéis, pensada em cada detalhe para elevar a experiência da hospedagem.",
    },
    "/projects/office": {
      title: "Escritório",
      description: "Eleve seu escritório com uma coleção decorativa exclusiva, de acessórios de mesa a arte de parede que traz sofisticação ao ambiente.",
    },
    "/projects/gallery": {
      title: "Galeria",
      description: "Nossa coleção de arte celebra estilos e expressões diversas. Cada obra conta uma história e valoriza a experiência do espaço.",
    },
    "/projects/cafes": {
      title: "Cafés",
      description: "Crie uma atmosfera sofisticada com decoração de parede selecionada, transformando cada canto do café em uma experiência visual acolhedora.",
    },
    "/projects/restaurant": {
      title: "Restaurante",
      description: "Nossa coleção transforma a experiência gastronômica, criando um ambiente que inspira conversas e valoriza o prazer de cada refeição.",
    },
    "/projects/large-commercial-space": {
      title: "Grande espaço comercial",
      description: "Transforme áreas amplas em ambientes dinâmicos de inovação e estilo com soluções decorativas para grandes espaços comerciais.",
    },
    "/projects/school": {
      title: "Escola",
      description: "Crie ambientes de aprendizagem inspiradores e funcionais com soluções para escolas, pensadas para apoiar concentração e criatividade.",
    },
  },
  fr: {
    "/projects/living-room": {
      title: "Salon",
      description: "Transformez votre salon en refuge de confort et de style avec notre collection soigneusement sélectionnée, où esthétique et fonctionnalité s'accordent naturellement.",
    },
    "/projects/bedroom": {
      title: "Chambre",
      description: "Profitez de la sérénité de notre collection pour chambre, où calme et design intemporel composent un espace dédié au repos.",
    },
    "/projects/bathroom": {
      title: "Salle de bain",
      description: "Entrez dans un univers apaisant avec notre collection pour salle de bain, où luxe et fonctionnalité subliment la routine quotidienne.",
    },
    "/projects/dining-room": {
      title: "Salle à manger",
      description: "Transformez chaque repas en expérience visuelle avec notre collection pour salle à manger, entre élégance contemporaine et confort.",
    },
    "/projects/kitchen": {
      title: "Cuisine",
      description: "Apportez la chaleur d'une esthétique moderne à votre cuisine avec des solutions qui allient style et fonctionnalité.",
    },
    "/projects/childrens-room": {
      title: "Chambre d'enfant",
      description: "Entrez dans un monde d'imagination avec notre collection pour chambre d'enfant, conçue pour stimuler la créativité et accompagner les rêves.",
    },
    "/projects/hotel": {
      title: "Hôtel",
      description: "Découvrez le luxe et la sophistication de notre collection hôtelière, pensée dans chaque détail pour enrichir l'expérience du séjour.",
    },
    "/projects/office": {
      title: "Bureau",
      description: "Valorisez votre bureau avec une collection décorative exclusive, des accessoires de travail à l'art mural qui structure l'espace.",
    },
    "/projects/gallery": {
      title: "Galerie",
      description: "Notre collection d'art célèbre la diversité des styles et des expressions. Chaque oeuvre raconte une histoire et enrichit l'espace.",
    },
    "/projects/cafes": {
      title: "Cafés",
      description: "Créez une ambiance sophistiquée avec une décoration murale choisie, transformant chaque recoin du café en expérience visuelle accueillante.",
    },
    "/projects/restaurant": {
      title: "Restaurant",
      description: "Notre collection transforme l'expérience culinaire en créant une atmosphère propice aux échanges et au plaisir de chaque bouchée.",
    },
    "/projects/large-commercial-space": {
      title: "Grand espace commercial",
      description: "Transformez de vastes surfaces en lieux dynamiques d'innovation et de style grâce à nos solutions pour grands espaces commerciaux.",
    },
    "/projects/school": {
      title: "École",
      description: "Créez des espaces d'apprentissage inspirants et fonctionnels avec des solutions scolaires pensées pour soutenir concentration et créativité.",
    },
  },
  de: {
    "/projects/living-room": {
      title: "Wohnzimmer",
      description: "Verwandeln Sie Ihr Wohnzimmer mit unserer kuratierten Kollektion in einen Ort voller Komfort und Stil, an dem Design und Funktion harmonieren.",
    },
    "/projects/bedroom": {
      title: "Schlafzimmer",
      description: "Genießen Sie die Ruhe unserer Schlafzimmerkollektion, in der zeitloses Design und Entspannung zu einem stimmigen Rückzugsort werden.",
    },
    "/projects/bathroom": {
      title: "Badezimmer",
      description: "Betreten Sie eine ruhige Badwelt, in der Luxus und Funktionalität zusammenkommen und die tägliche Routine aufwerten.",
    },
    "/projects/dining-room": {
      title: "Esszimmer",
      description: "Machen Sie jede Mahlzeit zu einem visuellen Erlebnis mit unserer Esszimmerkollektion, die moderne Eleganz und Komfort verbindet.",
    },
    "/projects/kitchen": {
      title: "Küche",
      description: "Bringen Sie moderne Wärme in Ihre Küche mit Lösungen, die Stil und Funktionalität für jeden kulinarischen Moment verbinden.",
    },
    "/projects/childrens-room": {
      title: "Kinderzimmer",
      description: "Entdecken Sie ein Kinderzimmer voller Fantasie und Charme, gestaltet, um Kreativität zu wecken und Träume wachsen zu lassen.",
    },
    "/projects/hotel": {
      title: "Hotel",
      description: "Erleben Sie Luxus und Raffinesse mit unserer Hotelkollektion, deren Details auf einen hochwertigen Aufenthalt abgestimmt sind.",
    },
    "/projects/office": {
      title: "Büro",
      description: "Werten Sie Ihr Büro mit einer exklusiven Dekorkollektion auf, von Schreibtischaccessoires bis zu Wandkunst mit professioneller Wirkung.",
    },
    "/projects/gallery": {
      title: "Galerie",
      description: "Unsere Kunstkollektion feiert vielfältige Stile und Ausdrucksformen. Jedes Werk erzählt eine Geschichte und bereichert den Raum.",
    },
    "/projects/cafes": {
      title: "Cafés",
      description: "Schaffen Sie eine anspruchsvolle Atmosphäre mit kuratierter Wanddekoration, die jede Ecke des Cafés visuell und einladend gestaltet.",
    },
    "/projects/restaurant": {
      title: "Restaurant",
      description: "Unsere Kollektion verwandelt das Speiseerlebnis und schafft eine Atmosphäre, die Gespräche anregt und jeden Bissen aufwertet.",
    },
    "/projects/large-commercial-space": {
      title: "Große Gewerbefläche",
      description: "Verwandeln Sie weitläufige Flächen in dynamische Orte für Innovation und Stil mit Lösungen für große gewerbliche Räume.",
    },
    "/projects/school": {
      title: "Schule",
      description: "Schaffen Sie inspirierende und funktionale Lernumgebungen mit Lösungen für Schulen, die Konzentration und Kreativität unterstützen.",
    },
  },
  ja: {
    "/projects/living-room": {
      title: "リビングルーム",
      description: "厳選されたコレクションで、リビングルームを快適さとスタイルが調和するくつろぎの空間へ。美しさと機能性を自然に融合します。",
    },
    "/projects/bedroom": {
      title: "寝室",
      description: "静けさと時代を超えたデザインが出会うベッドルームコレクション。休息とリラックスのための穏やかな空間を演出します。",
    },
    "/projects/bathroom": {
      title: "バスルーム",
      description: "上質なバスルームコレクションで、ラグジュアリーと機能性が調和する落ち着いた空間へ。毎日の身支度を快適に整えます。",
    },
    "/projects/dining-room": {
      title: "ダイニングルーム",
      description: "ダイニングルームコレクションで、食事の時間を視覚的にも豊かな体験に。現代的なエレガンスと心地よさを取り入れます。",
    },
    "/projects/kitchen": {
      title: "キッチン",
      description: "モダンな美しさと温もりをキッチンに。スタイルと機能性が調和する空間で、料理を楽しむ時間を引き立てます。",
    },
    "/projects/childrens-room": {
      title: "子ども部屋",
      description: "想像力と遊び心に満ちた子ども部屋コレクション。創造性を育み、夢を広げる空間づくりをサポートします。",
    },
    "/projects/hotel": {
      title: "ホテル",
      description: "細部までこだわったホテル向けコレクションで、上質さと洗練を演出。快適な滞在体験を高める空間づくりを支えます。",
    },
    "/projects/office": {
      title: "オフィス",
      description: "オフィス空間をより洗練された印象へ導く装飾コレクション。デスク周りからウォールアートまで、働く環境を上質に整えます。",
    },
    "/projects/gallery": {
      title: "ギャラリー",
      description: "多彩なスタイルと表現を楽しめるアートコレクション。ひとつひとつの作品が物語を持ち、空間の印象を豊かに高めます。",
    },
    "/projects/cafes": {
      title: "カフェ",
      description: "厳選されたウォールデコールが、カフェの隅々まで洗練された雰囲気を演出。視覚的な楽しさと心地よさを加えます。",
    },
    "/projects/restaurant": {
      title: "レストラン",
      description: "丁寧に選ばれたコレクションが食事の場を魅力的に演出し、会話を生み、ひと口ごとの楽しさを引き立てます。",
    },
    "/projects/large-commercial-space": {
      title: "大型商業スペース",
      description: "広い商業空間を、革新性とスタイルが息づくダイナミックな場へ。厳選された装飾で空間全体の印象を高めます。",
    },
    "/projects/school": {
      title: "学校",
      description: "学校空間を明るく、機能的で刺激ある学びの場へ。厳選された装飾が、集中力と創造性を支える環境づくりに貢献します。",
    },
  },
};

function localizedProjectsSourceCopy(locale: Locale, path: string) {
  if (locale === "en") return undefined;
  return PROJECTS_SOURCE_COPY_TRANSLATIONS[locale]?.[path];
}

const PROJECTS_SOURCE_DETAIL_GALLERIES: Record<string, string[]> = {
  "/projects/living-room": [
    "https://cdn.sanity.io/images/vzcnnept/production/5ce16cd5091a3670547c1fba432b74c29f8e1d30-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/1cbe84d71532acac681f9d8088d203a4f4923d56-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/b8ae2a5beaff44c479c1818e6d23aed44dc95670-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/450689083a62361140f79febbf34a486c2044f9d-1080x1080.jpg",
  ],
  "/projects/bedroom": [
    "https://cdn.sanity.io/images/vzcnnept/production/5dbce0690de3ee1cad5c101630d2a7836acdfd9f-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/5ecf695529b1974b8ff0bf9bb6fdb95c9fdfe954-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/c6da053408ca4a96633645de532de35f87c89c23-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/ae57ca8e8e9d7a80e8a2142dc585f1e35783a25a-1080x1080.jpg",
  ],
  "/projects/bathroom": [
    "https://cdn.sanity.io/images/vzcnnept/production/a01b0f5bbc659deccd2fa1b9d6aa90e9bcbb998d-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/1d6ec50d7d79c06f1fccb74e20cc9c7d7c5c881f-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/51e0b149cb4f828bd83790d1e07021d8101e4c5e-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/32f1000ae83e5c7e068f5cad7f25980a610cb671-1080x1080.jpg",
  ],
  "/projects/dining-room": [
    "https://cdn.sanity.io/images/vzcnnept/production/89acde9c8166abb67d259d867bd216b627f8e747-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/c9d3362378d65bc2702d22120f7126f9bce7bbcf-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/7bd642f77e346783c12de768d9ece35c4b141e31-1080x1080.jpg",
  ],
  "/projects/kitchen": [
    "https://cdn.sanity.io/images/vzcnnept/production/eb11242f592f8c9114ea829817db66889d728891-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/7fe4dce1b03481e7d0805b0b4ad1fabb11f24291-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/32f1000ae83e5c7e068f5cad7f25980a610cb671-1080x1080.jpg",
  ],
  "/projects/childrens-room": [
    "https://cdn.sanity.io/images/vzcnnept/production/84f35d091f23a7d55436d1f8fd5c92445df06420-1106x420.png",
    "https://cdn.sanity.io/images/vzcnnept/production/e96950b6210073a5da109e27393086a1b0fd216e-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/ba126f52f315d0f70a5e270721d06f8972af682b-1080x1080.jpg",
  ],
  "/projects/hotel": [
    "https://cdn.sanity.io/images/vzcnnept/production/22c9049c35b1916f9a83e67079c8ef8d06fa6302-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/7bd642f77e346783c12de768d9ece35c4b141e31-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/1659e8ce9765c82462f658d0960f5198f7e3034d-1080x1080.jpg",
  ],
  "/projects/office": [
    "https://cdn.sanity.io/images/vzcnnept/production/fbc3be12b63747974da2476efab32a3a333b6089-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/871ac86d3f6dfe13832e07b7fedcb6d3c18969e8-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/dccf911c504ba983f163f9246dd4e6e95206cab7-1080x1080.jpg",
  ],
  "/projects/gallery": [
    "https://cdn.sanity.io/images/vzcnnept/production/331d576a78832a4c73cbfad09ca453d4a7fe8377-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/8112dc14764d3e1a12730e9b10c53d7e49872bac-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/9963674620497798ad6e062c493289cdbfd2630d-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/899923a410c83f07d4b22b9460f3c235d21b4938-1080x1080.jpg",
  ],
  "/projects/cafes": [
    "https://cdn.sanity.io/images/vzcnnept/production/20bf9ec54cc885e74355a4bf9e6c54c400f21460-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/5d3658c9347fb302c6253ebeb9ae248d5717a448-1080x1080.jpg",
  ],
  "/projects/restaurant": [
    "https://cdn.sanity.io/images/vzcnnept/production/c2d73ebb162dd04c1502ef3d0d135a3aa04a2374-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/aaedd66fe7e0d7e6b6e52762cedf089d689e9c6f-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/5d3658c9347fb302c6253ebeb9ae248d5717a448-1080x1080.jpg",
  ],
  "/projects/large-commercial-space": [
    "https://cdn.sanity.io/images/vzcnnept/production/c6104295b6195a624096b89c522338a7ffd4fa2c-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/48526aa3e6163f0bfeec11ceb719bbd00814030f-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/caa2db5555e6ab89793cd5056e6f2abfe1a6bd7c-1080x1080.jpg",
  ],
  "/projects/school": [
    "https://cdn.sanity.io/images/vzcnnept/production/ef4ee20e434bd7034f80026dc5c5e4b82a813751-1920x600.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/3dc64e00857087d71b8f35ffe3a4b4111963e333-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/6f89b155c01940f5997184eaa71ed381f76c42fe-1080x1080.jpg",
    "https://cdn.sanity.io/images/vzcnnept/production/a0208bcb2a777c3b60a77970f8f46ce2249c7f01-1080x1080.jpg",
  ],
};

const HOME_BLOG_CATEGORIES = ["All", "Expo", "Industry News", "Inspiration", "New Arrivals", "Press Release", "Tips"];

const HOME_BLOG_CARDS = [
  {
    title: "Canvas Art: A Perfect Addition to Your Home Decor",
    path: "/news/canvas-art-a-perfect-addition-to-your-home-decor",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/32251e6010c926b0cf75acd3bfc4134d1a40b1e7-1080x1080.jpg",
    date: "Sep 09, 2025",
    description: "",
    category: "All",
  },
  {
    title: "Creative Gallery Wall Ideas: Transform Your Walls with Frames, Art and Memo Boards",
    path: "/news/creative-gallery-wall-ideas-transform-your-walls-with-frames-art-and-memo-boards",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/456d37a9538525fed7319e95c99986cd54fc7953-1125x750.png",
    date: "Sep 04, 2025",
    description: "Discover creative gallery wall ideas with frames, art, mirrors & memo boards. Tr...",
    category: "All",
  },
  {
    title: "Top Frame Design Trends in 2025 for Interiors and Art Galleries",
    path: "/news/top-frame-design-trends-in-2025-for-interiors-and-art-galleries",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8f491690a6ec17bcacfbf240bbe2929a9064790e-387x581.avif",
    date: "Aug 26, 2025",
    description: "",
    category: "All",
  },
  {
    title: "Which One Suits Your Project?——A Guide to Mirror Materials",
    path: "/news/which-one-suits-your-project-a-guide-to-mirror-materials",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/4904bfc1efd243bd7ba12b96d417c53e2f086a59-2000x2000.jpg",
    date: "Aug 19, 2025",
    description: "",
    category: "All",
  },
  {
    title: "Modern? Rustic? Classic? The Custom Framing Guide Every Home Needs",
    path: "/news/modern-rustic-classic-the-custom-framing-guide-every-home-needs",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a5b63ab67958f2f8da02885c75ec12dd497bf575-498x487.png",
    date: "Aug 09, 2025",
    description: "Explore Intco Framing's custom picture frames and frame mouldings. Discover mode...",
    category: "Inspiration",
  },
  {
    title: "Sustainable Furniture Choices: Eco-Friendly Options for the Modern Home",
    path: "/news/sustainable-furniture-choices-eco-friendly-options-for-the-modern-home",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/245de63448574dbe9567494a5b8af21bdb43cc80-2560x1707.webp",
    date: "Apr 23, 2025",
    description: "Discover eco-friendly furniture that blend style & sustainability for modern hom...",
    category: "Industry News",
  },
  {
    title: "Functional Decor: Incorporating Memo Boards into Your Home Office",
    path: "/news/functional-decor-incorporating-memo-boards-into-your-home-office",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/0e2dfb5ca25c2935e9660d5d6ffa55e4a4f7d531-2560x1808.webp",
    date: "Apr 16, 2025",
    description: "Discover how to integrate memo boards into your home office for stylish organiza...",
    category: "Industry News",
  },
  {
    title: "The Art of Framing: Enhancing Your Artwork with Unique Picture Frames",
    path: "/news/the-art-of-framing-enhancing-your-artwork-with-unique-picture-frames",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3b620182d53b9435938b3164288bdaa71c4f04e5-2560x1707.jpg",
    date: "Apr 09, 2025",
    description: "Discover how unique picture frames enhance your art. Expert tips on styles, mate...",
    category: "Industry News",
  },
  {
    title: "Intco Framing Will Be Participating in The 135th CANTON FAIR",
    path: "/news/intco-framing-will-be-participating-in-the-135th-canton-fair",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6fb876067d7a87144fad81205cf56690fe586e00-510x466.jpg",
    date: "Apr 10, 2024",
    description: "Intco Framing Will Be Participating in The 135th CANTON FAIR",
    category: "Expo",
  },
  {
    title: "Visit Intco Framing at 2024 VIFA Expo",
    path: "/news/visit-intco-framing-at-2024-vifa-expo",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/76c68de8cfa6e97d804edd342abb63be5a20de4f-1830x2560.jpg",
    date: "Feb 27, 2024",
    description: "Intco Framing will be showcasing latest innovations in home decor solutions at V...",
    category: "Expo",
  },
  {
    title: "Tips for Installing Picture Frames in Your Home",
    path: "/news/tips-for-installing-picture-frames-in-your-home",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6edb5646a90fd14eaffb49c84a27c1c9ba890b9e-1707x2560.jpg",
    date: "Apr 02, 2025",
    description: "Discover expert tips for installing picture frames to enhance your home decor. L...",
    category: "Industry News",
  },
  {
    title: "Interior Deco Market Outlook 2025: Key Trends and Challenges",
    path: "/news/interior-deco-market-outlook-2025-key-trends-and-challenges",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1206c42ea2bd4c336918be1b929f2193c65edc30-1709x2560.jpg",
    date: "Mar 26, 2025",
    description: "Explore the Interior Decor Market Outlook 2025: Key trends, challenges, sustaina...",
    category: "Industry News",
  },
  {
    title: "What's the Best Way to Frame Black-and-White Photos?",
    path: "/news/whats-the-best-way-to-frame-black-and-white-photos",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/412d7d712045d0685371b217c6fa7b319028be8d-2560x1707.jpg",
    date: "Dec 12, 2024",
    description: "In conclusion, framing black-and-white photos requires careful consideration of ...",
    category: "Inspiration",
  },
  {
    title: "Bulk Picture Frame Orders for Wholesale Buyers: A Complete Guide",
    path: "/news/bulk-picture-frame-orders-for-wholesale-buyers-a-complete-guide",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/883a451e7e685e826d22235dee2421b8fe808186-867x877.webp",
    date: "Dec 05, 2024",
    description: "Ordering picture frames in bulk offers substantial benefits for wholesale buyers...",
    category: "Inspiration",
  },
  {
    title: "Poster Frames vs. Picture Frames: Understanding the Difference",
    path: "/news/poster-frames-vs-picture-frames-understanding-the-difference",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/ea9fcbe4096a6129ab342bd8cee50dcd521c383f-879x879.webp",
    date: "Nov 28, 2024",
    description: "Deciding on the appropriate frame for your posters, art prints, or photos is a c...",
    category: "Inspiration",
  },
  {
    title: "Framing the Future: A Comprehensive Guide to A-Paper Sizes",
    path: "/news/framing-the-future-a-comprehensive-guide-to-a-paper-sizes",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/4feb5c6d5a90fe424ad0e42e4801b6b07d9a6bd3-641x638.webp",
    date: "Nov 21, 2024",
    description: "A-sizes are a system of paper sizes that are standardized by the International O...",
    category: "Inspiration",
  },
  {
    title: "The 2023 Bloomberg Green ESG 50 Companies to Watch List is officially released",
    path: "/news/the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c0c66a43ed43152ada4d13eafd9d3f7e410a338e-1080x692.jpg",
    date: "Jan 29, 2024",
    description: "The 2023 Bloomberg Green ESG 50 Companies to Watch List is officially released.",
    category: "Press Release",
  },
  {
    title: "The Clear Difference: Picture Frame vs Photo Frame Explained",
    path: "/news/the-clear-difference-picture-frame-vs-photo-frame-explained",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/825f1651e09f364b64034ef90af2e52c23c7e28a-464x371.jpg",
    date: "Jun 13, 2024",
    description: "A picture frame is a decorative edging designed to encase and protect artwork, p...",
    category: "Tips",
  },
  {
    title: "How To Choose The Right Mirror Cabinet for Your Bathroom",
    path: "/news/how-to-choose-the-right-mirror-cabinet-for-your-bathroom",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/ed2b8e7503ab75a1707161133e65a486f250bbd4-800x511.jpg",
    date: "Feb 23, 2024",
    description: "It's vital to get the correct mirror cabinet for your purposes since it may trul...",
    category: "Tips",
  },
];

const SOLUTIONS_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/9b23c10023cc8a909addb8f37416a5b645a3c9d6-1920x600.jpg";
const SOLUTIONS_INTRO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/5e9bb9fa595bfab693a3b2394cef41f169a63abc-783x504.png";
const SOLUTIONS_PROCESS_BG = "https://cdn.sanity.io/images/vzcnnept/production/65ab6e4bc300f519d770cddd197b2dd74ae667f4-1920x1142.png";
const SOLUTIONS_RELATED_BG = "https://cdn.sanity.io/images/vzcnnept/production/143ffee4a155c3a173ce736c4b9715d87414e459-1920x800.png";
const SOLUTIONS_CONTACT_BG = "https://cdn.sanity.io/images/vzcnnept/production/87780f5172f8855bbe66e56a051b065fb5729b55-1920x600.png";
const BUSINESS_INSIGHTS_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/84f1bbba0333ecaa3afd99f0db4148b7baefffef-1920x600.png";
const BUSINESS_INSIGHTS_MARKET_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/1e1e5bff813a778a4443003177d328fead15b24c-980x660.png";
const BUSINESS_INSIGHTS_MARKET_ICON = "https://cdn.sanity.io/images/vzcnnept/production/4f5ab080edcb8e1556296f9b4aa5d8ed368c1762-174x170.jpg";
const BUSINESS_INSIGHTS_RECOMMENDATION_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/174cf78f684c1c8d7dd085e565e4170bd3f30050-905x591.png";
const DESIGN_ENGINEERING_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/bc4fa5d06204c93cbab4c5975bbe3ed5e9da1dc8-1920x600.png";
const DESIGN_ENGINEERING_MAIN_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/c4eb2f57e1f48597166d6f676699c54dfa9cc270-1600x468.png";
const MANUFACTURING_DELIVERY_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/6858db993d1a3b9e16cd35de0eac22fed5f4ba0f-1920x600.png";
const MANUFACTURING_DELIVERY_DOWN_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/12cd3a42b2528a056ded48c92c7a189cfd041bbf-1920x874.jpg";
const GLOBAL_PRODUCTION_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/a217c8e3be82e749bfe25334c673b8da0a86c731-1920x600.png";
const GLOBAL_PRODUCTION_BUILDING_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/8cb95e251cd49e74e98f1b418431235eb028f2c4-2560x1440.jpg";
const CERTIFICATION_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/a4143fa5e862d832ca8f4cf2b85521022d9e388c-1920x600.png";
const CERTIFICATION_BG_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/b0a9d6522b72f192e35665fe3b0218dd347acbb6-1920x850.png";
const CERTIFICATION_GRID_IMAGES = [
  "https://cdn.sanity.io/images/vzcnnept/production/11a3832cdecf679369faafa969b78dc25661d378-366x240.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/f158ba1ffd4e57e76a817b3e48218200151554b6-365x240.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/f364de36fc9b0f315a880c5a4a3f84a8352de8d7-365x240.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/cc204a7d1c409ecb9e0a45c6a234f4f9236d7538-365x240.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/5b99f81835920ffc478aef91c43c910c301b992f-365x240.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/22bbd1a72122900f11b31ed45cda249f9b9c1d06-365x240.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/4fd597c7447e414bc0b20520b02e671b2d7423af-365x240.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/31d36f783e6f23385d5cd271cc6c1a56a60c63e9-365x240.jpg",
];
const CERTIFICATION_SWIPER_IMAGES = [
  "https://cdn.sanity.io/images/vzcnnept/production/e134261de9d6e9358680700fb9d37e4c8b6f5f2e-273x386.png",
  "https://cdn.sanity.io/images/vzcnnept/production/b6f0c5e3829659a8de99525303e52464e0abafc6-273x387.png",
  "https://cdn.sanity.io/images/vzcnnept/production/914d7d649a02697ca8263033b56a7a108de04cdb-275x388.png",
  "https://cdn.sanity.io/images/vzcnnept/production/2138bfacce25d57771b66d955c14bcf3e6ba12df-275x388.png",
];
const RETAILER_SUPPORT_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/ad6694cc5319337b7f85dd858edaa4e510fc3d22-1920x600.jpg";
const RETAILER_SUPPORT_TURN_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/afb9eb36c44a0acfcf2bfb52b533688f4e2b0dac-806x427.jpg";
const RETAILER_SUPPORT_GLOBAL_DECOR = "https://cdn.sanity.io/images/vzcnnept/production/79e55e9d00a71bb8aea1dc434611c9a82a02cb56-861x210.png";
const RETAILER_SUPPORT_GLOBAL_IMAGES = [
  "https://cdn.sanity.io/images/vzcnnept/production/8db8f6544a4244e1193ef83f052e8367b87a466a-524x350.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/9a81d1397afbecdbae1428bebfd63b43e5cba8ec-524x350.jpg",
  "https://cdn.sanity.io/images/vzcnnept/production/25e362976382a8faab9464e83c02a73c2a57abc1-524x350.jpg",
];
const RETAILER_SUPPORT_DISTRIBUTION_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/a54aa9117bb27bdcb3fd9878b1e44afc86afbaa6-760x400.png";
const RETAILER_SUPPORT_MARKETING_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/9a58818d9f5fea8c7a4fda2e52b07e8b3801a398-760x400.png";
const RETAILER_SUPPORT_SERVICE_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/832152d21b1bd732fa057eb238f2947d51dc6a85-978x669.png";
const MANUFACTURING_PACKAGING_IMAGES = [
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/978eaee449f4c4e1636cd0ca7612d32fddb6af77-765x408.png",
    imageAlt: "Manufacturing7",
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6da61720a557ef5bdef22e40fde97342a681b1fe-617x613.png",
    imageAlt: "Manufacturing8",
  },
];

const BUSINESS_INSIGHTS_TREND_SLIDES = [
  {
    path: "/solutions/business-insights-trends/trend",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/e0167fe949ed12227452065aea070984eee70332-1000x554.jpg",
  },
  {
    path: "/solutions/business-insights-trends/trend-2",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/068692f4e16d08f7f1d83cf960b85d93c1c91291-1000x554.jpg",
  },
  {
    path: "/solutions/business-insights-trends/trend-2-2",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/12f81e4baa849c407f78a636b7fd652fa50642a8-1000x554.jpg",
  },
];

const BUSINESS_INSIGHTS_TREND_REPORTS = [
  {
    title: "Trend",
    path: "/solutions/business-insights-trends/trend",
    coverUrl: "https://cdn.sanity.io/images/vzcnnept/production/92c4e097b80b075f5e9b5eecb71cc07463820353-690x582.jpg",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/b3cc15000470da4fae35eabd7bffc0fe750ad296.pdf",
  },
  {
    title: "Trend2",
    path: "/solutions/business-insights-trends/trend-2",
    coverUrl: "https://cdn.sanity.io/images/vzcnnept/production/7122bf537a96658f450d8aa4f056967ea6c2d8b8-690x582.png",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/fff4b61c3f82b94bc22a7eccb440c82d2efbc43f.pdf",
  },
  {
    title: "Trend3",
    path: "/solutions/business-insights-trends/trend-2-2",
    coverUrl: "https://cdn.sanity.io/images/vzcnnept/production/77fd52fd1920d88e66321a93c24ddd9bd920b57c-690x582.jpg",
    pdfUrl: "https://cdn.sanity.io/files/vzcnnept/production/5f2e633df74c61bd1c940cf0666025936405f18a.pdf",
  },
];

const BUSINESS_INSIGHTS_TREND_REPORT_COPY: Record<
  Locale,
  {
    downloadTitle: string;
    intro: string;
    downloadAria: string;
    reportTitles: Record<string, string>;
  }
> = {
  en: {
    downloadTitle: "DOWNLOAD TREND REPORT",
    intro: "In need of our trend reports? No problem! Simply complete the form below, you will have access to all our trend reports and stay informed about the latest trends.",
    downloadAria: "Download trend report",
    reportTitles: {
      "/solutions/business-insights-trends/trend": "Trend",
      "/solutions/business-insights-trends/trend-2": "Trend2",
      "/solutions/business-insights-trends/trend-2-2": "Trend3",
    },
  },
  es: {
    downloadTitle: "DESCARGAR INFORME DE TENDENCIAS",
    intro: "¿Necesita nuestros informes de tendencias? Complete el formulario a continuación para acceder a todos nuestros informes y mantenerse al día sobre las últimas tendencias.",
    downloadAria: "Descargar informe de tendencias",
    reportTitles: {
      "/solutions/business-insights-trends/trend": "Tendencias",
      "/solutions/business-insights-trends/trend-2": "Tendencias 2",
      "/solutions/business-insights-trends/trend-2-2": "Tendencias 3",
    },
  },
  pt: {
    downloadTitle: "BAIXAR RELATÓRIO DE TENDÊNCIAS",
    intro: "Precisa dos nossos relatórios de tendências? Basta preencher o formulário abaixo para acessar todos os relatórios e acompanhar as últimas tendências.",
    downloadAria: "Baixar relatório de tendências",
    reportTitles: {
      "/solutions/business-insights-trends/trend": "Tendências",
      "/solutions/business-insights-trends/trend-2": "Tendências 2",
      "/solutions/business-insights-trends/trend-2-2": "Tendências 3",
    },
  },
  fr: {
    downloadTitle: "TÉLÉCHARGER LE RAPPORT DE TENDANCES",
    intro: "Besoin de nos rapports de tendances ? Remplissez simplement le formulaire ci-dessous pour accéder à tous nos rapports et rester informé des dernières tendances.",
    downloadAria: "Télécharger le rapport de tendances",
    reportTitles: {
      "/solutions/business-insights-trends/trend": "Tendances",
      "/solutions/business-insights-trends/trend-2": "Tendances 2",
      "/solutions/business-insights-trends/trend-2-2": "Tendances 3",
    },
  },
  de: {
    downloadTitle: "TRENDREPORT HERUNTERLADEN",
    intro: "Benötigen Sie unsere Trendreports? Füllen Sie einfach das Formular unten aus, um Zugriff auf alle Trendreports zu erhalten und über aktuelle Trends informiert zu bleiben.",
    downloadAria: "Trendreport herunterladen",
    reportTitles: {
      "/solutions/business-insights-trends/trend": "Trends",
      "/solutions/business-insights-trends/trend-2": "Trends 2",
      "/solutions/business-insights-trends/trend-2-2": "Trends 3",
    },
  },
  ja: {
    downloadTitle: "トレンドレポートをダウンロード",
    intro: "トレンドレポートをご希望ですか？以下のフォームにご記入いただくと、すべてのトレンドレポートにアクセスでき、最新トレンドを把握できます。",
    downloadAria: "トレンドレポートをダウンロード",
    reportTitles: {
      "/solutions/business-insights-trends/trend": "トレンド",
      "/solutions/business-insights-trends/trend-2": "トレンド 2",
      "/solutions/business-insights-trends/trend-2-2": "トレンド 3",
    },
  },
};

function localizedBusinessInsightsTrendReportTitle(locale: Locale, report: (typeof BUSINESS_INSIGHTS_TREND_REPORTS)[number]) {
  return BUSINESS_INSIGHTS_TREND_REPORT_COPY[locale].reportTitles[report.path] || report.title;
}

const BUSINESS_INSIGHTS_BESTSELLER_GROUPS = [
  {
    title: "PICTURE FRAME",
    products: [
      {
        title: "PS Framed Vintage Wood Grain Tabletop Picture Frame",
        path: "/ps-framed-vintage-wood-grain-tabletop-photo-frame",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/dff42f59e1e337d978fd8e58ddde7a4e468e62fb-1080x1080.jpg",
      },
      {
        title: "Modern Black Aluminum Framed Poster Frame",
        path: "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a343a2ca1f9bf3c46641aa1c401e9f2ba587df3b-1080x1080.jpg",
      },
      {
        title: "3 Opening 4x6 Collage Picture Frame Natural Plastic Picture Frames Grey Wood Grain",
        path: "/picture-frame/collage-frame/3-opening-4x6-collage-picture-frame-natural-plastic-picture-frames-grey-wood-grain",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/af868e0960a451524393afe3689cd41a42436cb8-1080x1080.jpg",
      },
    ],
  },
  {
    title: "MIRROR",
    products: [
      {
        title: "Aluminum Framed Round Wall Mirror with Wood Grain",
        path: "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8644e87dadf2b904a30bc284e4b812fb6ee7aae0-1080x1080.jpg",
      },
      {
        title: "Classic Contemporary PS Framed Gold Full Length Leaner Mirror",
        path: "/classic-contemporary-ps-framed-gold-full-length-leaner-mirror",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a9d8e7dfddd89ef200e57e7ffb8ad52a41c18c8e-1080x1080.jpg",
      },
      {
        title: "Aluminum Framed Arched Full Length Standing Mirror",
        path: "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8cf43b1679a5b07bb0450b9e1bd8e8f1072e70d7-1080x1080.jpg",
      },
      {
        title: "Arched Alumium Framed LED Bathroom Wall Mounted Mirror",
        path: "/arched-alumium-framed-led-bathroom-wall-mounted-mirror",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3b44e5899cb0d9e6c02f640c2888536abcaea7c1-1080x1080.jpg",
      },
    ],
  },
  {
    title: "ART",
    products: [
      {
        title: "Modern Abstract Canvas Wall Art",
        path: "/art/canvas-art/modern-abstract-canvas-wall-art",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9120ac358e686bd5728f47a28796caeb13550f4a-1080x1080.jpg",
      },
      {
        title: "Figurative Lady Framed Wall Art 22x24",
        path: "/art/framed-art/figurative-lady-framed-wall-art-22x24",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/352bb32e01d092264b70d66e7fe57f6f29ccfeea-1080x1080.jpg",
      },
      {
        title: "Black Framed Abstract Wall Art Set of 2",
        path: "/art/framed-art/black-framed-abstract-wall-art-set-of-2",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/03f36fa5e9ae35e5d61123385238aa444e2980d1-1080x1080.jpg",
      },
      {
        title: "Neutral Minimalist Framed Abstract Wall Art",
        path: "/neutral-minimalist-framed-abstract-wall-art",
        imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/95401b4ce58aaf00600ac74972077608f8658c16-1080x1080.jpg",
      },
    ],
  },
];

const BUSINESS_INSIGHTS_BESTSELLER_LABELS: Record<Locale, { heroTitle: string }> = {
  en: { heroTitle: "Bestsellers" },
  es: { heroTitle: "Más vendidos" },
  pt: { heroTitle: "Mais vendidos" },
  fr: { heroTitle: "Meilleures ventes" },
  de: { heroTitle: "Bestseller" },
  ja: { heroTitle: "ベストセラー" },
};

const BUSINESS_INSIGHTS_BESTSELLER_GROUP_TITLE_TRANSLATIONS: Record<Exclude<Locale, "en">, Record<string, string>> = {
  es: {
    "PICTURE FRAME": "MARCOS DE FOTOS",
    MIRROR: "ESPEJOS",
    ART: "ARTE",
  },
  pt: {
    "PICTURE FRAME": "MOLDURAS",
    MIRROR: "ESPELHOS",
    ART: "ARTE",
  },
  fr: {
    "PICTURE FRAME": "CADRES PHOTO",
    MIRROR: "MIROIRS",
    ART: "ART",
  },
  de: {
    "PICTURE FRAME": "BILDERRAHMEN",
    MIRROR: "SPIEGEL",
    ART: "KUNST",
  },
  ja: {
    "PICTURE FRAME": "額縁",
    MIRROR: "ミラー",
    ART: "アート",
  },
};

const BUSINESS_INSIGHTS_BESTSELLER_PRODUCT_TITLE_TRANSLATIONS: Record<Exclude<Locale, "en">, Record<string, string>> = {
  es: {
    "/ps-framed-vintage-wood-grain-tabletop-photo-frame": "Marco de sobremesa PS con veta de madera vintage",
    "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame": "Marco para póster moderno de aluminio negro",
    "/picture-frame/collage-frame/3-opening-4x6-collage-picture-frame-natural-plastic-picture-frames-grey-wood-grain": "Marco collage 4x6 de 3 aberturas en plástico gris veta madera",
    "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain": "Espejo redondo de pared con marco de aluminio y veta de madera",
    "/classic-contemporary-ps-framed-gold-full-length-leaner-mirror": "Espejo apoyado de cuerpo entero con marco PS dorado",
    "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror": "Espejo de pie arqueado de cuerpo entero con marco de aluminio",
    "/arched-alumium-framed-led-bathroom-wall-mounted-mirror": "Espejo LED arqueado de baño para pared con marco de aluminio",
    "/art/canvas-art/modern-abstract-canvas-wall-art": "Arte de pared en lienzo abstracto moderno",
    "/art/framed-art/figurative-lady-framed-wall-art-22x24": "Arte mural enmarcado de figura femenina 22x24",
    "/art/framed-art/black-framed-abstract-wall-art-set-of-2": "Set de 2 artes murales abstractos con marco negro",
    "/neutral-minimalist-framed-abstract-wall-art": "Arte abstracto minimalista neutro enmarcado",
  },
  pt: {
    "/ps-framed-vintage-wood-grain-tabletop-photo-frame": "Porta-retrato de mesa PS com textura de madeira vintage",
    "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame": "Moldura moderna preta de alumínio para pôster",
    "/picture-frame/collage-frame/3-opening-4x6-collage-picture-frame-natural-plastic-picture-frames-grey-wood-grain": "Moldura collage 4x6 com 3 aberturas em plástico cinza amadeirado",
    "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain": "Espelho redondo de parede com moldura de alumínio e textura de madeira",
    "/classic-contemporary-ps-framed-gold-full-length-leaner-mirror": "Espelho de corpo inteiro apoiado com moldura PS dourada",
    "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror": "Espelho de pé arqueado de corpo inteiro com moldura de alumínio",
    "/arched-alumium-framed-led-bathroom-wall-mounted-mirror": "Espelho LED arqueado de banheiro com moldura de alumínio",
    "/art/canvas-art/modern-abstract-canvas-wall-art": "Arte de parede em tela abstrata moderna",
    "/art/framed-art/figurative-lady-framed-wall-art-22x24": "Arte de parede emoldurada com figura feminina 22x24",
    "/art/framed-art/black-framed-abstract-wall-art-set-of-2": "Conjunto de 2 artes abstratas com moldura preta",
    "/neutral-minimalist-framed-abstract-wall-art": "Arte abstrata minimalista neutra emoldurada",
  },
  fr: {
    "/ps-framed-vintage-wood-grain-tabletop-photo-frame": "Cadre photo de table en PS effet bois vintage",
    "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame": "Cadre poster moderne en aluminium noir",
    "/picture-frame/collage-frame/3-opening-4x6-collage-picture-frame-natural-plastic-picture-frames-grey-wood-grain": "Cadre collage 4x6 à 3 ouvertures en plastique gris effet bois",
    "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain": "Miroir mural rond avec cadre aluminium effet bois",
    "/classic-contemporary-ps-framed-gold-full-length-leaner-mirror": "Miroir à poser pleine longueur avec cadre PS doré",
    "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror": "Miroir sur pied arqué pleine longueur avec cadre aluminium",
    "/arched-alumium-framed-led-bathroom-wall-mounted-mirror": "Miroir LED mural arqué pour salle de bain avec cadre aluminium",
    "/art/canvas-art/modern-abstract-canvas-wall-art": "Art mural abstrait moderne sur toile",
    "/art/framed-art/figurative-lady-framed-wall-art-22x24": "Art mural encadré figure féminine 22x24",
    "/art/framed-art/black-framed-abstract-wall-art-set-of-2": "Lot de 2 arts muraux abstraits avec cadre noir",
    "/neutral-minimalist-framed-abstract-wall-art": "Art abstrait minimaliste neutre encadré",
  },
  de: {
    "/ps-framed-vintage-wood-grain-tabletop-photo-frame": "PS-Tischbilderrahmen in Vintage-Holzmaserung",
    "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame": "Moderner schwarzer Aluminium-Posterrahmen",
    "/picture-frame/collage-frame/3-opening-4x6-collage-picture-frame-natural-plastic-picture-frames-grey-wood-grain": "Collage-Bilderrahmen 4x6 mit 3 Öffnungen in grauer Holzmaserung",
    "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain": "Runder Wandspiegel mit Aluminiumrahmen in Holzmaserung",
    "/classic-contemporary-ps-framed-gold-full-length-leaner-mirror": "Goldener PS-Anlehnspiegel in voller Länge",
    "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror": "Gewölbter Standspiegel in voller Länge mit Aluminiumrahmen",
    "/arched-alumium-framed-led-bathroom-wall-mounted-mirror": "Gewölbter LED-Badspiegel zur Wandmontage mit Aluminiumrahmen",
    "/art/canvas-art/modern-abstract-canvas-wall-art": "Modernes abstraktes Leinwandbild",
    "/art/framed-art/figurative-lady-framed-wall-art-22x24": "Gerahmtes Wandbild mit Frauenfigur 22x24",
    "/art/framed-art/black-framed-abstract-wall-art-set-of-2": "2-teiliges abstraktes Wandbild-Set mit schwarzem Rahmen",
    "/neutral-minimalist-framed-abstract-wall-art": "Neutral-minimalistisches abstraktes Wandbild mit Rahmen",
  },
  ja: {
    "/ps-framed-vintage-wood-grain-tabletop-photo-frame": "ヴィンテージ木目調PS卓上フォトフレーム",
    "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame": "モダンブラックアルミ製ポスターフレーム",
    "/picture-frame/collage-frame/3-opening-4x6-collage-picture-frame-natural-plastic-picture-frames-grey-wood-grain": "グレー木目調プラスチック 3面4x6 コラージュフォトフレーム",
    "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain": "木目調アルミフレーム丸型ウォールミラー",
    "/classic-contemporary-ps-framed-gold-full-length-leaner-mirror": "ゴールドPSフレーム全身リーナーミラー",
    "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror": "アルミフレーム アーチ型全身スタンドミラー",
    "/arched-alumium-framed-led-bathroom-wall-mounted-mirror": "アルミフレーム アーチ型LED浴室ウォールミラー",
    "/art/canvas-art/modern-abstract-canvas-wall-art": "モダン抽象キャンバスウォールアート",
    "/art/framed-art/figurative-lady-framed-wall-art-22x24": "女性モチーフ額装ウォールアート 22x24",
    "/art/framed-art/black-framed-abstract-wall-art-set-of-2": "ブラックフレーム抽象ウォールアート 2点セット",
    "/neutral-minimalist-framed-abstract-wall-art": "ニュートラル ミニマリスト額装抽象アート",
  },
};

function localizedBusinessInsightsBestsellerGroupTitle(locale: Locale, title: string) {
  if (locale === "en") return title;
  return BUSINESS_INSIGHTS_BESTSELLER_GROUP_TITLE_TRANSLATIONS[locale]?.[title] || title;
}

function localizedBusinessInsightsBestsellerProductTitle(locale: Locale, product: (typeof BUSINESS_INSIGHTS_BESTSELLER_GROUPS)[number]["products"][number]) {
  if (locale === "en") return product.title;
  return BUSINESS_INSIGHTS_BESTSELLER_PRODUCT_TITLE_TRANSLATIONS[locale]?.[product.path] || product.title;
}

const WHO_WE_ARE_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/1c4d82f7a7171314c190f172c0846063ceaa00ae-1920x601.jpg";
const WHO_WE_ARE_INTRO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/9066546fcd7e65c8edf8fddf265b74c09b0004bf-883x420.png";
const WHO_WE_ARE_STATS_BG = "https://cdn.sanity.io/images/vzcnnept/production/a1668f307b18570dbfb30f7019af1133a11f497d-1920x214.jpg";
const WHO_WE_ARE_MAP_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/57b757db6fe6e2c149eead826e841ae60b5b8b3c-1595x931.png";

const WHO_WE_ARE_STATS = [
  { value: "3", label: "Business Units", Icon: Layers },
  { value: "6", label: "Production Bases", Icon: Factory },
  { value: "30+", label: "Years Experience", Icon: Globe2 },
  { value: "4000+", label: "Employees", Icon: PackageCheck },
];

const WHO_WE_ARE_INTRO_COPY: Record<Locale, string[]> = {
  en: [
    "Intco Framing (stock symbol 688087), a leading interior décor manufacturer specializing in picture frames, art, mirrors, memo boards and furniture.",
    "We provide customized solutions for diverse applications, tailoring designs to complement residential, commercial, and office spaces.",
  ],
  es: [
    "Intco Framing (código bursátil 688087) es un fabricante líder de decoración de interiores especializado en marcos, arte, espejos, tableros de notas y muebles.",
    "Ofrecemos soluciones personalizadas para distintos usos, con diseños adaptados a espacios residenciales, comerciales y de oficina.",
  ],
  pt: [
    "A Intco Framing (código de ações 688087) é uma fabricante líder de decoração de interiores, especializada em molduras, arte, espelhos, quadros de notas e móveis.",
    "Oferecemos soluções personalizadas para diferentes aplicações, com designs pensados para ambientes residenciais, comerciais e corporativos.",
  ],
  fr: [
    "Intco Framing (code boursier 688087) est un fabricant majeur de décoration intérieure, spécialisé dans les cadres, l'art mural, les miroirs, les tableaux mémo et le mobilier.",
    "Nous proposons des solutions personnalisées pour de nombreux usages, avec des designs adaptés aux espaces résidentiels, commerciaux et professionnels.",
  ],
  de: [
    "Intco Framing (Börsenkürzel 688087) ist ein führender Hersteller für Innendekoration mit Schwerpunkt auf Bilderrahmen, Kunst, Spiegeln, Memoboards und Möbeln.",
    "Wir entwickeln maßgeschneiderte Lösungen für vielfältige Anwendungen und stimmen Designs auf Wohn-, Gewerbe- und Büroräume ab.",
  ],
  ja: [
    "Intco Framing（証券コード 688087）は、額縁、アート、ミラー、メモボード、家具を手がけるインテリア装飾メーカーです。",
    "住宅、商業施設、オフィスなど多様な空間に合わせて、用途に応じたカスタムソリューションを提供しています。",
  ],
};

const WHO_WE_ARE_GLOBAL_MARKET_INTRO: Record<Locale, string> = {
  en: "Operating on a global scale, we have established a widespread presence in the market, collaborating with numerous high-quality retail partners worldwide",
  es: "Con operaciones a escala global, hemos construido una amplia presencia en el mercado y colaboramos con numerosos socios minoristas de alta calidad en todo el mundo.",
  pt: "Com atuação global, consolidamos ampla presença no mercado e colaboramos com diversos parceiros varejistas de alta qualidade em todo o mundo.",
  fr: "Présents à l'échelle mondiale, nous avons développé une large présence sur le marché et collaborons avec de nombreux partenaires distributeurs de qualité.",
  de: "Mit globaler Ausrichtung haben wir eine starke Marktpräsenz aufgebaut und arbeiten weltweit mit zahlreichen hochwertigen Handelspartnern zusammen.",
  ja: "グローバルに事業を展開し、世界各地の優良小売パートナーと連携しながら、幅広い市場プレゼンスを築いています。",
};

const WHO_WE_ARE_HISTORY = [
  { year: "2002", title: "Shanghai Base", description: "Picture Frame Mouldings", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/d90df6ccf1e7992b59047d058cc726671440752e-235x292.jpg" },
  { year: "2005", title: "Shandong Base", description: "Art / Picture / Mirror Frames", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5df6a135d7d21f806533913fd6b635a35da8d8c1-235x292.jpg" },
  { year: "2009", title: "Shanghai Base", description: "Greenwood Brand Picture Frame Mouldings", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6ffc3c32206e85c80e57d186e43d9bb49b7309d0-235x292.jpg" },
  { year: "2010", title: "Lu'an Base", description: "Picture Frame Mouldings", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b6288fbd92bf19161b81d20a17add77666e04d98-235x292.jpg" },
  { year: "2010", title: "Zheniiang Base", description: "GREENMAX Brand Recycling Machines", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/bff75b93e18c5f97c619e3678161763442589bfc-235x292.jpg" },
  { year: "2015", title: "Domestic Marketing Center", description: "25 Exhibition Offices in China", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9b5f8d2c6a8822441e3e8c171322891aa42d083c-235x292.jpg" },
  { year: "2016", title: "Shandong Base ll", description: "MDF Frames Aluminum Frames", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/85f660ed64104f0946b1257257734852ac20db65-235x292.jpg" },
  { year: "2018", title: "Malaysia Base", description: "100,000 Tons r-PS Pellets", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/75bae5cb2f747680ebc8f472b126b3ca69a74720-235x292.jpg" },
  { year: "2019", title: "Integration of two networks", description: "Recycle the Compressed Foam in Shanghai", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1cb4ac16c5eb3f393fa84781fcf03049dbe2aef1-235x292.jpg" },
  { year: "2019", title: "Malaysia Base ll", description: "50,000 Tons r-PET Pellets", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8bf0899a901514dca3092739df01254f399e9203-235x292.jpg" },
  { year: "2021", title: "Shandong Base lll", description: "Aluminum Frames Canvas Art Art Frames", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3440c9d96a7902952fd79a31c603eb66a24da927-235x292.jpg" },
  { year: "2021", title: "IPO in Shanghai", description: "STOCK SYMBOL: 688087", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/eadbc265dc81bed03ecf40b91317bb39ab1d24b3-235x292.jpg" },
  { year: "2022", title: "Lu'an Basell", description: "Multi-category Decorative Mouldings", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8bbb8f06a96c5288cd2ee22e4df7f859ca580f59-235x292.jpg" },
  { year: "2022", title: "Vietnam Base", description: "Frame / Decorative Mouldings Picture / Mirror Frames", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/bbc07c2e601cf25626ba1c5bbcc41b0d84f295b3-235x292.jpg" },
];

const WHO_WE_ARE_HISTORY_TRANSLATIONS: Partial<Record<Locale, Array<{ title: string; description: string }>>> = {
  es: [
    { title: "Base de Shanghái", description: "Molduras para marcos" },
    { title: "Base de Shandong", description: "Arte / marcos / espejos" },
    { title: "Base de Shanghái", description: "Molduras Greenwood" },
    { title: "Base de Lu'an", description: "Molduras para marcos" },
    { title: "Base de Zhenjiang", description: "Máquinas de reciclaje GREENMAX" },
    { title: "Centro de marketing nacional", description: "25 oficinas de exhibición en China" },
    { title: "Base de Shandong II", description: "Marcos MDF y de aluminio" },
    { title: "Base de Malasia", description: "100.000 toneladas de pellets r-PS" },
    { title: "Integración de dos redes", description: "Reciclaje de espuma comprimida en Shanghái" },
    { title: "Base de Malasia II", description: "50.000 toneladas de pellets r-PET" },
    { title: "Base de Shandong III", description: "Marcos de aluminio, lienzos y arte enmarcado" },
    { title: "Salida a bolsa en Shanghái", description: "Código bursátil: 688087" },
    { title: "Base de Lu'an II", description: "Molduras decorativas multicategoría" },
    { title: "Base de Vietnam", description: "Marcos, molduras decorativas, cuadros y espejos" },
  ],
  pt: [
    { title: "Base de Xangai", description: "Molduras para porta-retratos" },
    { title: "Base de Shandong", description: "Arte / molduras / espelhos" },
    { title: "Base de Xangai", description: "Molduras Greenwood" },
    { title: "Base de Lu'an", description: "Molduras para porta-retratos" },
    { title: "Base de Zhenjiang", description: "Máquinas de reciclagem GREENMAX" },
    { title: "Centro de marketing nacional", description: "25 escritórios de exposição na China" },
    { title: "Base de Shandong II", description: "Molduras MDF e de alumínio" },
    { title: "Base da Malásia", description: "100.000 toneladas de pellets r-PS" },
    { title: "Integração de duas redes", description: "Reciclagem de espuma comprimida em Xangai" },
    { title: "Base da Malásia II", description: "50.000 toneladas de pellets r-PET" },
    { title: "Base de Shandong III", description: "Molduras de alumínio, canvas art e arte emoldurada" },
    { title: "IPO em Xangai", description: "Código de ações: 688087" },
    { title: "Base de Lu'an II", description: "Molduras decorativas multicategoria" },
    { title: "Base do Vietnã", description: "Molduras, perfis decorativos, quadros e espelhos" },
  ],
  fr: [
    { title: "Base de Shanghai", description: "Moulures pour cadres photo" },
    { title: "Base du Shandong", description: "Art / cadres / miroirs" },
    { title: "Base de Shanghai", description: "Moulures Greenwood" },
    { title: "Base de Lu'an", description: "Moulures pour cadres photo" },
    { title: "Base de Zhenjiang", description: "Machines de recyclage GREENMAX" },
    { title: "Centre marketing national", description: "25 bureaux d'exposition en Chine" },
    { title: "Base du Shandong II", description: "Cadres MDF et aluminium" },
    { title: "Base de Malaisie", description: "100 000 tonnes de granulés r-PS" },
    { title: "Intégration de deux réseaux", description: "Recyclage de mousse compressée à Shanghai" },
    { title: "Base de Malaisie II", description: "50 000 tonnes de granulés r-PET" },
    { title: "Base du Shandong III", description: "Cadres aluminium, canvas et cadres d'art" },
    { title: "IPO à Shanghai", description: "Code boursier : 688087" },
    { title: "Base de Lu'an II", description: "Moulures décoratives multi-catégories" },
    { title: "Base du Vietnam", description: "Cadres, moulures décoratives, tableaux et miroirs" },
  ],
  de: [
    { title: "Standort Shanghai", description: "Bilderrahmenleisten" },
    { title: "Standort Shandong", description: "Kunst / Bilder / Spiegelrahmen" },
    { title: "Standort Shanghai", description: "Greenwood Bilderrahmenleisten" },
    { title: "Standort Lu'an", description: "Bilderrahmenleisten" },
    { title: "Standort Zhenjiang", description: "GREENMAX Recyclingmaschinen" },
    { title: "Nationales Marketingzentrum", description: "25 Ausstellungsbüros in China" },
    { title: "Standort Shandong II", description: "MDF- und Aluminiumrahmen" },
    { title: "Standort Malaysia", description: "100.000 Tonnen r-PS-Pellets" },
    { title: "Integration zweier Netzwerke", description: "Recycling von Pressschaum in Shanghai" },
    { title: "Standort Malaysia II", description: "50.000 Tonnen r-PET-Pellets" },
    { title: "Standort Shandong III", description: "Aluminiumrahmen, Leinwandkunst und Kunstrahmen" },
    { title: "Börsengang in Shanghai", description: "Börsenkürzel: 688087" },
    { title: "Standort Lu'an II", description: "Dekorleisten für mehrere Kategorien" },
    { title: "Standort Vietnam", description: "Rahmen, Dekorleisten, Bilder- und Spiegelrahmen" },
  ],
  ja: [
    { title: "上海拠点", description: "額縁モールディング" },
    { title: "山東拠点", description: "アート / 額縁 / ミラーフレーム" },
    { title: "上海拠点", description: "Greenwood ブランド額縁モールディング" },
    { title: "六安拠点", description: "額縁モールディング" },
    { title: "鎮江拠点", description: "GREENMAX リサイクル機械" },
    { title: "国内マーケティングセンター", description: "中国に25カ所の展示オフィス" },
    { title: "山東拠点 II", description: "MDF フレーム、アルミフレーム" },
    { title: "マレーシア拠点", description: "r-PS ペレット 10万トン" },
    { title: "2つのネットワークを統合", description: "上海で圧縮フォームをリサイクル" },
    { title: "マレーシア拠点 II", description: "r-PET ペレット 5万トン" },
    { title: "山東拠点 III", description: "アルミフレーム、キャンバスアート、アートフレーム" },
    { title: "上海で上場", description: "証券コード: 688087" },
    { title: "六安拠点 II", description: "多カテゴリ装飾モールディング" },
    { title: "ベトナム拠点", description: "フレーム、装飾モールディング、額縁、ミラーフレーム" },
  ],
};

const WHO_WE_ARE_MARKETS = [
  { continent: "North America", countries: ["United States", "Canada", "Mexico", "Panama"], top: "22%", right: "81.97%", color: "#c00000", scale: 1.5 },
  { continent: "Europe", countries: ["Germany", "United Kingdom", "Spain", "France", "Portugal", "Denmark", "Italy"], top: "23.61%", right: "47.65%", color: "#2f5597" },
  { continent: "Asia", countries: ["China", "Malaysia", "Japan", "Turkey", "Thailand", "Singapore", "U.A.E", "Pakistan"], top: "39.81%", right: "25.36%", color: "#ffc000" },
  { continent: "Africa", countries: ["South Africa", "Egypt", "Libya", "Morocco"], top: "53.54%", right: "43.33%", color: "#7030a0" },
  { continent: "South America", countries: ["Brazil", "Uruguay", "Chile", "Argentina", "Peru", "Ecuador", "Colombia"], top: "64.88%", right: "66.56%", color: "#c00000" },
  { continent: "Oceania", countries: ["Australia", "New Zealand"], top: "80.15%", right: "9.27%", color: "#548235" },
];

const WHO_WE_ARE_MARKET_TRANSLATIONS: Partial<Record<Locale, Record<string, { continent: string; countries: string[] }>>> = {
  es: {
    "North America": { continent: "América del Norte", countries: ["Estados Unidos", "Canadá", "México", "Panamá"] },
    Europe: { continent: "Europa", countries: ["Alemania", "Reino Unido", "España", "Francia", "Portugal", "Dinamarca", "Italia"] },
    Asia: { continent: "Asia", countries: ["China", "Malasia", "Japón", "Turquía", "Tailandia", "Singapur", "EAU", "Pakistán"] },
    Africa: { continent: "África", countries: ["Sudáfrica", "Egipto", "Libia", "Marruecos"] },
    "South America": { continent: "América del Sur", countries: ["Brasil", "Uruguay", "Chile", "Argentina", "Perú", "Ecuador", "Colombia"] },
    Oceania: { continent: "Oceanía", countries: ["Australia", "Nueva Zelanda"] },
  },
  pt: {
    "North America": { continent: "América do Norte", countries: ["Estados Unidos", "Canadá", "México", "Panamá"] },
    Europe: { continent: "Europa", countries: ["Alemanha", "Reino Unido", "Espanha", "França", "Portugal", "Dinamarca", "Itália"] },
    Asia: { continent: "Ásia", countries: ["China", "Malásia", "Japão", "Turquia", "Tailândia", "Singapura", "EAU", "Paquistão"] },
    Africa: { continent: "África", countries: ["África do Sul", "Egito", "Líbia", "Marrocos"] },
    "South America": { continent: "América do Sul", countries: ["Brasil", "Uruguai", "Chile", "Argentina", "Peru", "Equador", "Colômbia"] },
    Oceania: { continent: "Oceania", countries: ["Austrália", "Nova Zelândia"] },
  },
  fr: {
    "North America": { continent: "Amérique du Nord", countries: ["États-Unis", "Canada", "Mexique", "Panama"] },
    Europe: { continent: "Europe", countries: ["Allemagne", "Royaume-Uni", "Espagne", "France", "Portugal", "Danemark", "Italie"] },
    Asia: { continent: "Asie", countries: ["Chine", "Malaisie", "Japon", "Turquie", "Thaïlande", "Singapour", "Émirats arabes unis", "Pakistan"] },
    Africa: { continent: "Afrique", countries: ["Afrique du Sud", "Égypte", "Libye", "Maroc"] },
    "South America": { continent: "Amérique du Sud", countries: ["Brésil", "Uruguay", "Chili", "Argentine", "Pérou", "Équateur", "Colombie"] },
    Oceania: { continent: "Océanie", countries: ["Australie", "Nouvelle-Zélande"] },
  },
  de: {
    "North America": { continent: "Nordamerika", countries: ["Vereinigte Staaten", "Kanada", "Mexiko", "Panama"] },
    Europe: { continent: "Europa", countries: ["Deutschland", "Vereinigtes Königreich", "Spanien", "Frankreich", "Portugal", "Dänemark", "Italien"] },
    Asia: { continent: "Asien", countries: ["China", "Malaysia", "Japan", "Türkei", "Thailand", "Singapur", "VAE", "Pakistan"] },
    Africa: { continent: "Afrika", countries: ["Südafrika", "Ägypten", "Libyen", "Marokko"] },
    "South America": { continent: "Südamerika", countries: ["Brasilien", "Uruguay", "Chile", "Argentinien", "Peru", "Ecuador", "Kolumbien"] },
    Oceania: { continent: "Ozeanien", countries: ["Australien", "Neuseeland"] },
  },
  ja: {
    "North America": { continent: "北米", countries: ["米国", "カナダ", "メキシコ", "パナマ"] },
    Europe: { continent: "ヨーロッパ", countries: ["ドイツ", "英国", "スペイン", "フランス", "ポルトガル", "デンマーク", "イタリア"] },
    Asia: { continent: "アジア", countries: ["中国", "マレーシア", "日本", "トルコ", "タイ", "シンガポール", "アラブ首長国連邦", "パキスタン"] },
    Africa: { continent: "アフリカ", countries: ["南アフリカ", "エジプト", "リビア", "モロッコ"] },
    "South America": { continent: "南米", countries: ["ブラジル", "ウルグアイ", "チリ", "アルゼンチン", "ペルー", "エクアドル", "コロンビア"] },
    Oceania: { continent: "オセアニア", countries: ["オーストラリア", "ニュージーランド"] },
  },
};

const WHO_WE_ARE_PARTNER_LOGOS = [
  "https://cdn.sanity.io/images/vzcnnept/production/dfdb51d363d64f77d78e860a4b22c0e7eaa1e83b-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/9eb5f44cfaf190b989729e1c71ae4e33eb2a1d54-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/635141b3494ce0cc410d28daf5abcd8d877cbbc5-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/8736091ea449845662382abda8345601f0408b4b-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/41b13e669e9d64a2eb933db73d1bfa0d396696f4-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/13b9fd929b5f414ce1f18fb3948de4fccc4365fc-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/142327a5cb1a38d0f4aad6cdcac7fcf8aa5a339e-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/ca95736c4b416d3d0d2276671ffdb16d475a15e1-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/991ca0ce6cdb60392e9a86c458238a79d25cb127-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/0b1c47eb28da639adfe4d53e72908db6b6863b7f-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/594e7640b6ec161a07fad741bb6de559eefd5bc7-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/cca0e420f1f7b6c0c1ee74ce052bdfdad31fc784-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/7ad3d413e36d8d043d4de160b1a645f5493a8baa-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/e776cf87b5bb9a74d64e2b379a29dd1e02caf442-240x125.png",
  "https://cdn.sanity.io/images/vzcnnept/production/af9b716dfe92fb4ff797471f58056363e45d3a5e-240x125.png",
];

const WHO_WE_ARE_PARTNER_CARDS = [
  { title: "Our Products", path: "/products", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/eda05bd30e3aef069caea06746d3bb65b6bfa5e8-654x697.png" },
  { title: "Solutions", path: "/solutions", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/94dd32c709ccc96fc486a6f99fc045511d1eb502-926x336.png" },
  { title: "Projects", path: "/projects", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b23f7166315055b685ace8c0bd3646963eba2f04-926x336.png" },
];

const SUSTAINABILITY_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/3754da3e3f4a80f769428af8eb127f0b39ae3615-1920x600.jpg";
const SUSTAINABILITY_VIDEO_SRC = "https://www.youtube.com/embed/uzpr_7MwI_c?si=BM4lcdw_WKcepCph";
const SUSTAINABILITY_INTRO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/49d37b58a8bd63e1495a37daf1381027313f320e-680x400.png";
const SUSTAINABILITY_REPORT_IMAGE = "/assets/intco/esg/esg-report-2025-cover.jpg";
const SUSTAINABILITY_REPORT_PDF = "/assets/intco/esg/esg-report-2025.pdf";
const SUSTAINABILITY_EXTERNAL_BG = "https://cdn.sanity.io/images/vzcnnept/production/9c7ce4b16d9a18e477d4c58a270b52e94c729ea3-1920x800.jpg";
const SUSTAINABILITY_EXTERNAL_IMAGES = [
  "https://cdn.sanity.io/images/vzcnnept/production/eb599578ba99d480f7fe787958658713b9821ff3-381x468.png",
  "https://cdn.sanity.io/images/vzcnnept/production/88b8f363d856bf07f5d2ad35549af7f9200762f6-381x468.png",
  "https://cdn.sanity.io/images/vzcnnept/production/63f7baad9d49539b17f7029ef8b46dccd8960671-381x468.png",
  "https://cdn.sanity.io/images/vzcnnept/production/87f7017106ea8d55027d678e2e5e8a2ece38ef37-381x220.png",
  "https://cdn.sanity.io/images/vzcnnept/production/e11c11564a9865e4e08ce9934d1b34223e00ac90-381x220.png",
];

const SUSTAINABILITY_INTRO_COPY: Record<Locale, string[]> = {
  en: [
    "Intco Recycling(688087.SH) is a high-tech manufacturer in resource recycling, and its affiliate, Intco Framing is one of the world’s largest makers of frames.",
    "We have developed an innovative end-to-end process of plastic recycling and reuse, that transforming recycled plastics into trendy, high-quality household and consumer goods.",
    "As a global leader in resource recycling, INTCO Recycling launched its PET recycling base in Malaysia in 2018. Spanning the recycling of multiple types of plastics, this facility transforms beverage bottles into food-grade plastic.",
    "Sustainable materials, net-zero and a circular economy. Intco Recycling has been committed to ESG for more than 20 years. What is the future of resource regeneration? We can’t wait to see it.",
  ],
  es: [
    "INTCO Recycling (688087.SH) es un fabricante de alta tecnología especializado en reciclaje de recursos, y su filial INTCO Framing es uno de los mayores fabricantes de marcos del mundo.",
    "Hemos desarrollado un proceso integral e innovador de reciclaje y reutilización de plásticos, transformando materiales reciclados en productos para el hogar y consumo modernos y de alta calidad.",
    "Como líder global en reciclaje de recursos, INTCO Recycling inauguró en 2018 su base de reciclaje PET en Malasia. La planta procesa varios tipos de plástico y convierte botellas de bebidas en plástico apto para uso alimentario.",
    "Materiales sostenibles, cero emisiones netas y economía circular. INTCO Recycling lleva más de 20 años comprometida con ESG, y el futuro de la regeneración de recursos apenas empieza.",
  ],
  pt: [
    "A INTCO Recycling (688087.SH) é uma fabricante de alta tecnologia focada em reciclagem de recursos, e sua afiliada INTCO Framing está entre as maiores fabricantes de molduras do mundo.",
    "Desenvolvemos um processo integrado e inovador de reciclagem e reutilização de plásticos, transformando materiais reciclados em produtos domésticos e de consumo modernos e de alta qualidade.",
    "Como líder global em reciclagem de recursos, a INTCO Recycling lançou em 2018 sua base de reciclagem PET na Malásia. A unidade processa diversos tipos de plástico e converte garrafas em plástico de grau alimentício.",
    "Materiais sustentáveis, neutralidade de carbono e economia circular. A INTCO Recycling mantém há mais de 20 anos um compromisso com ESG e com o futuro da regeneração de recursos.",
  ],
  fr: [
    "INTCO Recycling (688087.SH) est un fabricant de haute technologie spécialisé dans le recyclage des ressources, et sa filiale INTCO Framing compte parmi les plus grands fabricants de cadres au monde.",
    "Nous avons développé un processus intégré et innovant de recyclage et de réutilisation des plastiques, transformant les matériaux recyclés en produits de maison et de consommation tendance et de haute qualité.",
    "Leader mondial du recyclage des ressources, INTCO Recycling a lancé en 2018 sa base de recyclage PET en Malaisie. Ce site traite plusieurs types de plastiques et transforme les bouteilles en plastique de qualité alimentaire.",
    "Matériaux durables, neutralité carbone et économie circulaire. INTCO Recycling s'engage depuis plus de 20 ans dans l'ESG et dans l'avenir de la régénération des ressources.",
  ],
  de: [
    "INTCO Recycling (688087.SH) ist ein Hightech-Hersteller im Bereich Ressourcenrecycling, und die Tochtergesellschaft INTCO Framing zählt zu den größten Rahmenherstellern der Welt.",
    "Wir haben einen innovativen End-to-End-Prozess für Kunststoffrecycling und Wiederverwendung entwickelt, der recycelte Materialien in moderne, hochwertige Haushalts- und Konsumgüter verwandelt.",
    "Als globaler Vorreiter im Ressourcenrecycling eröffnete INTCO Recycling 2018 seine PET-Recyclingbasis in Malaysia. Dort werden verschiedene Kunststoffarten verarbeitet und Getränkeflaschen zu lebensmitteltauglichem Kunststoff recycelt.",
    "Nachhaltige Materialien, Netto-Null und Kreislaufwirtschaft. INTCO Recycling engagiert sich seit mehr als 20 Jahren für ESG und für die Zukunft der Ressourcenerneuerung.",
  ],
  ja: [
    "INTCO Recycling（688087.SH）は資源リサイクル分野のハイテクメーカーであり、その関連会社であるINTCO Framingは世界有数のフレームメーカーです。",
    "当社はプラスチックのリサイクルと再利用を一貫して行う革新的なプロセスを構築し、再生素材を高品質で現代的な家庭用品・消費財へと生まれ変わらせています。",
    "資源リサイクルのグローバルリーダーとして、INTCO Recyclingは2018年にマレーシアでPETリサイクル拠点を稼働しました。この施設では複数種類のプラスチックを処理し、飲料ボトルを食品グレードのプラスチックへ再生しています。",
    "持続可能な素材、ネットゼロ、循環型経済。INTCO Recyclingは20年以上にわたりESGと資源再生の未来に取り組み続けています。",
  ],
};

const SUSTAINABILITY_ENVIRONMENTAL_COPY: Record<Locale, string> = {
  en: "Intco Recycling has reduced 200,000 tons of carbon emissions, saved 300,000 tons of crude oil, and protected 2 million trees every year, an elegant and profitable solution for the recycling of waste EPS foam.",
  es: "INTCO Recycling reduce cada año 200,000 toneladas de emisiones de carbono, ahorra 300,000 toneladas de petróleo crudo y protege 2 millones de árboles, aportando una solución eficaz y rentable para reciclar residuos de espuma EPS.",
  pt: "A INTCO Recycling reduz todos os anos 200.000 toneladas de emissões de carbono, economiza 300.000 toneladas de petróleo bruto e protege 2 milhões de árvores, oferecendo uma solução eficiente e rentável para reciclar resíduos de espuma EPS.",
  fr: "INTCO Recycling réduit chaque année 200 000 tonnes d'émissions carbone, économise 300 000 tonnes de pétrole brut et protège 2 millions d'arbres, grâce à une solution efficace et rentable pour recycler les déchets de mousse EPS.",
  de: "INTCO Recycling reduziert jedes Jahr 200.000 Tonnen CO₂-Emissionen, spart 300.000 Tonnen Rohöl und schützt 2 Millionen Bäume. So entsteht eine effiziente und rentable Lösung für das Recycling von EPS-Schaumabfällen.",
  ja: "INTCO Recyclingは毎年20万トンの炭素排出量を削減し、30万トンの原油を節約し、200万本の木を守っています。これは廃EPSフォームのリサイクルに向けた効率的で収益性の高い解決策です。",
};

const SUSTAINABILITY_TREE_ITEMS = [
  { value: "15", unit: "Pieces", label: "Art Frames" },
  { value: "60", unit: "Meters", label: "Baseboards" },
  { value: "100", unit: "Pieces", label: "Picture Frames" },
];

type SustainabilityTreeItem = (typeof SUSTAINABILITY_TREE_ITEMS)[number];

const SUSTAINABILITY_TREE_ITEMS_LOCALIZED: Record<Locale, SustainabilityTreeItem[]> = {
  en: SUSTAINABILITY_TREE_ITEMS,
  es: [
    { value: "15", unit: "piezas", label: "Marcos de arte" },
    { value: "60", unit: "metros", label: "Rodapiés" },
    { value: "100", unit: "piezas", label: "Marcos de fotos" },
  ],
  pt: [
    { value: "15", unit: "peças", label: "Molduras de arte" },
    { value: "60", unit: "metros", label: "Rodapés" },
    { value: "100", unit: "peças", label: "Porta-retratos" },
  ],
  fr: [
    { value: "15", unit: "pièces", label: "Cadres d'art" },
    { value: "60", unit: "mètres", label: "Plinthes" },
    { value: "100", unit: "pièces", label: "Cadres photo" },
  ],
  de: [
    { value: "15", unit: "Stück", label: "Kunstrahmen" },
    { value: "60", unit: "Meter", label: "Sockelleisten" },
    { value: "100", unit: "Stück", label: "Bilderrahmen" },
  ],
  ja: [
    { value: "15", unit: "点", label: "アートフレーム" },
    { value: "60", unit: "メートル", label: "幅木" },
    { value: "100", unit: "点", label: "額縁" },
  ],
};

const SUSTAINABILITY_ACTION_CARDS = [
  {
    title: "Innovating Circular Economy Models",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/d3b1582f70e2c324181233d31d148831542b45f8-497x342.png",
    description:
      "Intco emphasizes on the environmental impact of the whole life cycle of products, and with advanced plastic recycling technology and recycled plastic products, it realizes the high-value recycling of plastics and opens up the entire industrial chain of plastic recycling, forming a unique “Circular Economy lntegration” business model.",
  },
  {
    title: "Comprehensive Environmental Initiatives",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/bfc90d1c0b9593c0313d4e35a680a167fc8e3922-497x342.png",
    description:
      "Recognizing the pressing issue of climate change, we respond by implementing strategies to reduce ourcarbon footprint,emphasizing the judicious use of resources across all operations. Furthermore, we focus on optimizing waste utilization,transforming it into a valuable resource. We conscientiously uphold the highest environmental standards in every aspect of our business.",
  },
  {
    title: "Nurturing A Diverse And Inclusive Work Environment",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/bb19995517c08ebcddf60535822c805f8b675758-497x342.png",
    description:
      "Our company is committed to fostering a workplace culture that embodies genuine care for our employees.We prioritize diversity and inclusion,actively valuing and respecting individuals of different nationalities,ethnicities,and backgrounds. In our pursuit of an inclusive and equal opportunity environment, we offer positions tailored to recruit employees with disabilities.",
  },
];

export const BLOG_SOURCE_PAGE_SIZE = 10;

type BlogSourceCard = (typeof HOME_BLOG_CARDS)[number];
type BlogSourceListItem = BlogPost & {
  category?: string;
  categoryKey?: string;
  excerpt?: string;
  publishedAt?: string;
};

const BLOG_SOURCE_CARD_BY_PATH = new Map(HOME_BLOG_CARDS.map((item) => [item.path, item]));

const VANITY_MIRROR_ARTICLE_SLUG = "5-ways-an-led-bathroom-vanity-mirror-can-lmprove-your-space";
const MEDICINE_CABINET_ARTICLE_SLUG = "the-major-materials-of-medicine-mirror-cabinet";
const BLOOMBERG_ESG_ARTICLE_SLUG = "the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released";

const VANITY_MIRROR_ARTICLE_SECTIONS = [
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/621657bacc11b549c5658ede5bef818a8133d5f8-600x641.jpg",
    imageAlt: "LED Round Black Aluminum Picture Frame Wall Mirror ideas",
    heading: "1) LED Mirrors Simulate Natural Lighting",
    paragraphs: [
      "If you have a steady stream of sunshine in your bathroom, consider yourself lucky. Natural lighting not only makes mornings easier, but also adds much-needed freshness to bathrooms.",
      "Luckily, even those of us without bright bathroom windows can turn to LED lights for a dose of sunshine. Why go the mirror route? Incorporating them through your mirror takes up minimal space and ensures their light hits you head-on.",
    ],
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/ca1a6ab93776706989866d10490b7c6720a830db-600x583.jpg",
    imageAlt: "Bathroom Round Wall Mirror with LED Lighted",
    heading: "2) Bathrooms with LED Mirrors Feel Bigger",
    paragraphs: [
      "It’s common knowledge in the interior design world that mirrors make rooms feel bigger. Coupled with the invigorating feel of LED lights, your mirror can truly maximise your space. If you’re working with a particularly small bathroom, you won’t regret installing this take on frame moulding.",
    ],
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8e21d9ce80094b8748390161c41b922026bfb6e1-600x641.jpg",
    imageAlt: "LED Rectangle Gold Aluminum Picture Frame Wall Mirror ideas",
    heading: "3) LED Lights Save Energy",
    paragraphs: [
      "Did you know that LED lights use 75% less energy than traditional lighting methods? This makes them a strong choice both financially and environmentally. Depending on the LED bathroom vanity mirror you choose, you can stop using your overhead lights altogether.",
      "If you’re the type to leave the house with lights on, your energy bill will thank you for making the switch!",
    ],
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/638fd8174e83c8f413858d36734c5b885d3c1b7a-600x641.jpg",
    imageAlt: "Oval Gold Aluminum Picture Frame LED Bathroom Mirror ideas",
    heading: "4) LED Bathroom Mirrors Work Well With Most Designs",
    paragraphs: [
      "When you picture LED bathroom mirrors, you might imagine a stark or clinical look. That is one potential outcome, but when paired with the right frame moulding or mirror moulding frame, you can invoke any aesthetic. Minimalist, eclectic, tropical, boho, mid century modern – the list of compatible styles goes on.",
      "Without having to worry about other lighting sources, you might even find that LED bathroom mirrors pull an entire design together!",
    ],
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9c562e9104fbd02683db8ecd4b76ec1e1de3286e-600x641.jpg",
    imageAlt: "LED Arch Gold Aluminum Picture Frame Wall Mirror ideas",
    heading: "5) Grooming is Easier With LED Bathroom Mirrors",
    paragraphs: [
      "If you have a habit of messing up makeup or nicking your skin while shaving, your bathroom lighting might be to blame. Under the focused light of LEDs, it’s almost impossible to miss a spot.",
      "Ready to make the switch to an LED bathroom vanity mirror? Do so in style by exploring our collection of frame moulding and mirror moulding frame options.",
      "While you’re in the market for fresh frames, don’t forget to grab one or two for photos around the house! We recommend one of our customer favourites: aluminum picture frames.",
    ],
  },
];

const VANITY_MIRROR_ARTICLE_LOCALIZATIONS = {
  ja: {
    title: "LED バスルームミラーが空間を変える 5 つの方法",
    category: "インスピレーション",
    tocTitle: "目次",
    introParagraphs: [
      "一見すると目立たない場所かもしれませんが、バスルームは住まいの中でも大切な空間です。朝の身支度を整え、夜には一日の疲れをほどき、気分をリセットする場所でもあります。",
      "この重要な空間をリフレッシュしたいなら、LED ライト付きのバニティミラーへのアップグレードは、近年注目されているバスルームトレンドの一つです。",
      "LED 照明に無機質な印象を持っている方も心配はいりません。デザイン業界で人気を集めているのには理由があります。適切なフレームモールディングと組み合わせれば、仕上がりは非常にスタイリッシュになります。",
      "LED バスルームミラーが幅広いインテリアテイストで支持される理由を見ていきましょう。",
      "LED ミラーのモールディングフレームがバスルームを向上させる 5 つの方法をご紹介します。",
    ],
    ledLinkText: "LED ミラー",
    sections: [
      {
        heading: "1) LED ミラーは自然光のような明るさを再現します",
        paragraphs: [
          "バスルームに十分な日差しが入るなら、とても恵まれた環境です。自然光は朝の身支度をしやすくするだけでなく、バスルームに清潔で爽やかな印象をもたらします。",
          "明るい窓がないバスルームでも、LED ライトを使えば自然光に近い明るさを取り入れられます。ミラーに組み込むことで場所を取らず、光が正面から当たるため実用性も高まります。",
        ],
      },
      {
        heading: "2) LED ミラーのあるバスルームは広く感じられます",
        paragraphs: [
          "インテリアデザインでは、ミラーが空間を広く見せることはよく知られています。LED の明るさと組み合わせることで、ミラーは空間の広がりをさらに引き出します。特に小さなバスルームでは、このタイプのフレームモールディングを取り入れる価値があります。",
        ],
      },
      {
        heading: "3) LED ライトは省エネです",
        paragraphs: [
          "LED ライトは従来の照明に比べて消費電力を大きく抑えられます。経済面でも環境面でも優れた選択肢です。選ぶ LED バスルームミラーによっては、天井照明を使う頻度を減らすこともできます。",
          "外出時に照明を消し忘れがちな方にとっても、LED への切り替えは電気代の節約につながります。",
        ],
      },
      {
        heading: "4) LED バスルームミラーは多くのデザインに調和します",
        paragraphs: [
          "LED バスルームミラーと聞くと、無機質で臨床的な印象を思い浮かべるかもしれません。しかし、適切なフレームモールディングやミラーモールディングフレームと組み合わせれば、ミニマル、エクレクティック、トロピカル、ボーホー、ミッドセンチュリーモダンなど、さまざまなスタイルを表現できます。",
          "他の照明との組み合わせに悩む必要が少なくなり、LED バスルームミラーが空間全体のデザインをまとめてくれることもあります。",
        ],
      },
      {
        heading: "5) LED バスルームミラーで身支度がしやすくなります",
        paragraphs: [
          "メイクがうまく決まらなかったり、シェービングで肌を傷つけやすかったりする場合、原因はバスルームの照明かもしれません。LED の集中的な光の下では、細かな部分も見逃しにくくなります。",
          "LED バスルームバニティミラーへ切り替える準備はできていますか？フレームモールディングやミラーモールディングフレームのコレクションから、スタイルに合う選択肢を見つけてください。",
          "新しいフレームを検討する際は、住まいの写真用フレームもぜひ合わせてご覧ください。おすすめは、お客様から人気の高いアルミ製ピクチャーフレームです。",
        ],
      },
    ],
  },
} as const;

const VANITY_MIRROR_POPULAR_POSTS = [
  {
    title: "The 2023 Bloomberg Green ESG…",
    category: "Press Release",
    date: "Jan 29, 2024",
    path: "/news/the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released",
    categoryPath: "/blog?category=Press%20Release",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c0c66a43ed43152ada4d13eafd9d3f7e410a338e-1080x692.jpg",
  },
  {
    title: "5 Ways an LED Bathroom Vanit…",
    category: "Inspiration",
    date: "Jan 29, 2024",
    path: "/news/5-ways-an-led-bathroom-vanity-mirror-can-lmprove-your-space",
    categoryPath: "/inspiration",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1806276ee0c14b9b9bd56e338f59a4a9f7c7bb9e-800x533.jpg",
  },
  {
    title: "The Major Materials of Medic…",
    category: "Industry News",
    date: "Jan 29, 2024",
    path: "/news/the-major-materials-of-medicine-mirror-cabinet",
    categoryPath: "/blog?category=Industry%20News",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1304805420f6e5ee0ccfa6bdcd180e0a013b47fe-800x511.jpg",
  },
];

const VANITY_MIRROR_INSTAGRAM_ITEMS = [
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/7898a18d52c731d3a24a9ee2e467ad8d845a39f7-120x120.png",
    href: "https://www.instagram.com/p/CkxQ1LqtEGJ/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/dd7a8779ddf7cc38d27bc41264af77f39cc497e3-120x120.png",
    href: "https://www.instagram.com/p/CfqZ5_fJnwY/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/112f069c24ffb87c80c3f192a2363fc3d7abcc14-120x120.png",
    href: "https://www.instagram.com/p/Ciyv9OIp1PW/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/407e87955ba179b66763d92cd6742586ff0a5f3f-120x120.png",
    href: "https://www.instagram.com/p/CdKGZBhPWls/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/0acc5cbdd255843d8e0ad225a5b76c63b0e64ae7-123x123.png",
    href: "https://www.instagram.com/p/CdzaQlsvZBq/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/15eba394957915918e4a6516bd3c09b7d6487478-120x120.png",
    href: "https://www.instagram.com/p/CkKnOS0LajF/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
  },
];

const SOURCE_NEWS_ARTICLES = {
  [MEDICINE_CABINET_ARTICLE_SLUG]: {
    title: "The Major Materials of Medicine Mirror Cabinet",
    category: "Industry News",
    categoryPath: "/blog?category=Industry%20News",
    date: "Jan 29, 2024",
    previousPath: "/news/the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released",
    nextPath: "/news/5-ways-an-led-bathroom-vanity-mirror-can-lmprove-your-space",
    introParagraphs: [
      "Bathroom medicine cabinets make for a great storage solution to keep all your accessories and frequently used products. It can function both as a mirror and extra storage – an ideal choice for those who have limited square footage in their bathroom.",
      "Most medicine cabinets are designed with a mirrored door and sized to fit above the sink, under a lighting fixture. You can use them to put on makeup, put in your contact lenses, or shave.",
      "Bathroom medicine cabinets are available in various materials – you can choose from aluminum, wood, plastic, stainless steel, etc. Let’s explore some of them in a little more detail.",
    ],
    leadImage: {
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1304805420f6e5ee0ccfa6bdcd180e0a013b47fe-800x511.jpg",
      imageAlt: "wood medicine mirror cabinet for bathroom",
    },
    sections: [
      {
        heading: "Wood Cabinets",
        paragraphs: [
          "Wood is always a popular choice in home design and bathroom cabinet styles because it can be stained any color and has a distinct look thanks to the natural grain. Wood is a natural material that looks high-end.",
          "However, wood can be prone to warping or splitting in humid bathrooms, so it’s best suited for well-ventilated bathrooms or bathrooms without showers.",
        ],
      },
      {
        heading: "Stainless Steel Cabinets",
        paragraphs: [
          "One of the most durable and beautiful options for bathroom medicine cabinets is stainless steel-framed ones. These have inherent protection against harmful pests, bacteria, and germs. What’s more, they have a lovely shine that lends a clean look to a bathroom.",
        ],
      },
      {
        heading: "Plastic Cabinets",
        paragraphs: [
          "When it comes to bathroom medicine cabinets, the lightweight plastic is easier to work with and install. Also, the material is less expensive as compared to the others.",
          "However, do know that plastic medicine cabinets may lack durability and are less rigid. But, as long as you store light products or medicines – your cabinet may serve you well.",
          "Intco Framing is one of the most professional mirror cabinet manufacturers and suppliers in China. We transform bathrooms into personal spaces for well-being. We achieve this by providing added value to customers through products that perfectly combine aesthetics and functionality, as well as tradition and innovation.",
          "Moreover, we make use of the best quality raw materials in the manufacturing of our range. This allows us to become the manufacturer of the top brands in the field of the bathroom retailing industry.",
          "If you are a bathroom retail store and looking for a qualified manufacturer, contact us now to get the brochures and quotation.",
        ],
      },
    ],
  },
  [BLOOMBERG_ESG_ARTICLE_SLUG]: {
    title: "The 2023 Bloomberg Green ESG 50 Companies to Watch List is officially released",
    category: "Press Release",
    categoryPath: "/blog?category=Press%20Release",
    date: "Jan 29, 2024",
    previousPath: "/news/how-to-choose-the-right-mirror-cabinet-for-your-bathroom",
    nextPath: "/news/the-major-materials-of-medicine-mirror-cabinet",
    introParagraphs: [
      "SUZHOU, China, Jan. 16, 2024 /PRNewswire/ — On December 20, 2023, 2023 Bloomberg Green ESG 50 Companies to Watch List (or ESG 50 in brief) is officially released at the Four Seasons Hotel in Suzhou.",
      "Bloomberg Green ESG 50 is an annual list compiled and published by Bloomberg Green in China. 2023 marks the first ESG 50 list release. The list includes both public and private companies. Bloomberg’s ESG scoring methodology is characterized by a bottom-up, model-driven method driven primarily by self-reported, publicly available information that results in a fully transparent, parametric, rules-based scoring framework.",
    ],
    leadImage: {
      imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/03f0cfe73dc2bb89e6d23bd6adeec4dbad47c871-1080x692.jpg",
      imageAlt: "The 2023 Bloomberg Green ESG 50 Companies to Watch List is officially released",
    },
    sections: [
      {
        paragraphs: ["The following is the complete list (arranged not in any particular order)"],
      },
      {
        heading: "Fast ESG Developing Companies",
        paragraphs: ["Grandblue Environment Co.,Ltd.", "Marriott", "INTCO MEDICAL"],
      },
      {
        heading: "Most ESG Promising Brands",
        paragraphs: ["NaaS Technology Inc.", "Nespresso", "SHUI ON LAND", "UNIQLO"],
      },
      {
        heading: "Best ESG Projects",
        paragraphs: [
          "McDonald’s China (Project: Green Tray)",
          "Pernod Ricard China (Project: Martell Mangrove Conservation)",
          "O’right Inc. (Project: Melting Greenland)",
          "Honor Device Co., Ltd. (Project: Tech for Good: Mobile Accessibility Assistance)",
          "Shandong Intco Recycilng Resources Co.,ltd. (Project: Food-Grade PET ‘Bottle-to-Bottle’ High-Quality Application)",
          "Tapestry (Project: COACH China Cool)",
          "TCL Technology Group Corporation (Project: TCL Solar Low-Carbon Campus)",
          "Tencent Holdings Limited (Project: Tencent Biodiversity Conservation Initiatives)",
          "Starbucks China (Project: Starbucks China Coffee Innovation Park)",
          "China International Capital Corporation Limited (Project: CICC-Nanping: Ecological Carbon Sink+)",
        ],
      },
      {
        heading: "ESG Top List – Environmental",
        paragraphs: ["Blancpain", "Hua Xia Bank Co.,Limited", "JD.com", "Lenovo Group", "LONGi Green Energy Technology Co., Ltd", "GDS Holdings Limited", "Vitesco Technologies", "Xiaomi Corporation", "China Merchants Shekou Industrial Zone Holding Co., Ltd", "Chint New Energy Technology Co., Ltd.", "China Modern Dairy Holdings Ltd."],
      },
      {
        heading: "ESG Top List – Social",
        paragraphs: ["ERICSSON GROUP", "Yum China", "BMW Group Region China", "MASTER KONG HOLDINGS CO.,LTD", "Nestlé (China) Ltd.", "UBS", "DBS BANK", "BANK OF CHINA"],
      },
      {
        heading: "ESG Top List – Governance",
        paragraphs: ["Tongwei Company Limited", "Sino Biopharmaceutical Limited"],
      },
      {
        heading: "ESG Grand Prize – Best Companies",
        paragraphs: [
          "The Bank of East Asia(China) Limited.",
          "Foxconn Industrial Internet Co., Ltd.",
          "KINGFA SCI.&TECH.CO.,LTD.",
          "Jinko Solar Co., Ltd.",
          "China Mengniu Dairy Co., Ltd.",
          "GLP China",
          "SY Holdings Group Limited.",
          "Cisco China Co., Ltd.",
          "Trina Solar Co., Ltd.",
          "NetEase, Inc.",
          "Chint Anneng Digital Power(Zhejiang)Co.,Ltd.",
          "CSSC(Hong Kong)Shipping Company Limited",
          "Jones Lang LaSalle",
          "The 2023 Bloomberg Green ESG Leading Forum commenced before the list was released. Leaders and professionals from the industries and international academic institutes joined and discussed the avant-garde innovations in the ESG field.",
          "Bloomberg Green centers on the business, science, and technology of climate change. The brand will utilize Bloomberg’s deep data expertise to produce original reporting and solutions-driven coverage, as well as business and investment focused content.",
          "Bloomberg Green strives to promote more initiatives that help transformation of a green and low-carbon economy, thereby building a new blueprint for a healthy, prosperous, and sustainable green economy.",
        ],
      },
      {
        heading: "About INTCO",
        paragraphs: [
          "INTCO Recycling (688087.SH) is a high-tech manufacturer specializing in resource recycling. We have successfully unlocked the entire industrial chain of plastic recycling and reuse, and transformed it into an innovative business by precisely fusing plastic recycling and reuse with cutting-edge consumer goods.",
        ],
      },
    ],
  },
} as const;

const SOURCE_BLOG_LABELS: Record<
  Locale,
  {
    popularPosts: string;
    shopNow: string;
    previous: string;
    next: string;
    favorite: string;
    copyLink: string;
    categoryLabels: Record<string, string>;
  }
> = {
  en: {
    popularPosts: "Popular Posts",
    shopNow: "Shop Now",
    previous: "PREVIOUS",
    next: "NEXT",
    favorite: "Favorite",
    copyLink: "Copy link",
    categoryLabels: {
      "Industry News": "Industry News",
      Inspiration: "Inspiration",
      "Press Release": "Press Release",
    },
  },
  es: {
    popularPosts: "Publicaciones populares",
    shopNow: "Comprar ahora",
    previous: "ANTERIOR",
    next: "SIGUIENTE",
    favorite: "Favorito",
    copyLink: "Copiar enlace",
    categoryLabels: {
      "Industry News": "Noticias del sector",
      Inspiration: "Inspiración",
      "Press Release": "Comunicado de prensa",
    },
  },
  pt: {
    popularPosts: "Posts populares",
    shopNow: "Comprar agora",
    previous: "ANTERIOR",
    next: "PRÓXIMO",
    favorite: "Favorito",
    copyLink: "Copiar link",
    categoryLabels: {
      "Industry News": "Notícias do setor",
      Inspiration: "Inspiração",
      "Press Release": "Comunicado de imprensa",
    },
  },
  fr: {
    popularPosts: "Articles populaires",
    shopNow: "Acheter maintenant",
    previous: "PRÉCÉDENT",
    next: "SUIVANT",
    favorite: "Favori",
    copyLink: "Copier le lien",
    categoryLabels: {
      "Industry News": "Actualités du secteur",
      Inspiration: "Inspiration",
      "Press Release": "Communiqué de presse",
    },
  },
  de: {
    popularPosts: "Beliebte Beiträge",
    shopNow: "Jetzt kaufen",
    previous: "ZURÜCK",
    next: "WEITER",
    favorite: "Favorit",
    copyLink: "Link kopieren",
    categoryLabels: {
      "Industry News": "Branchennachrichten",
      Inspiration: "Inspiration",
      "Press Release": "Pressemitteilung",
    },
  },
  ja: {
    popularPosts: "人気記事",
    shopNow: "今すぐ購入",
    previous: "前の記事",
    next: "次の記事",
    favorite: "お気に入り",
    copyLink: "リンクをコピー",
    categoryLabels: {
      "Industry News": "業界ニュース",
      Inspiration: "インスピレーション",
      "Press Release": "プレスリリース",
    },
  },
};

const SOURCE_NEWS_ARTICLE_LOCALIZATIONS = {
  ja: {
    [MEDICINE_CABINET_ARTICLE_SLUG]: {
      title: "ミラーキャビネットの主な素材",
      category: "業界ニュース",
      introParagraphs: [
        "バスルーム用のミラーキャビネットは、アクセサリーや日常的に使うアイテムをすっきり収納できる便利な収納ソリューションです。鏡としても追加収納としても機能するため、バスルームの面積が限られている場合に特に適しています。",
        "多くのミラーキャビネットは鏡付きの扉を備え、洗面台の上や照明器具の下に収まるサイズで設計されています。メイク、コンタクトレンズの装着、シェービングなど、毎日の身支度にも活用できます。",
        "バスルーム用ミラーキャビネットには、アルミ、木材、プラスチック、ステンレスなどさまざまな素材があります。ここでは代表的な素材を少し詳しく見ていきます。",
      ],
      leadImageAlt: "バスルーム用木製ミラーキャビネット",
      sections: [
        {
          heading: "木製キャビネット",
          paragraphs: [
            "木材は、住宅デザインやバスルームキャビネットで常に人気のある素材です。好みの色に染色でき、自然な木目によって独特の表情が生まれます。高級感を演出しやすい天然素材でもあります。",
            "一方で、湿度の高いバスルームでは反りや割れが起こりやすい場合があります。そのため、換気の良いバスルームやシャワーのない空間により適しています。",
          ],
        },
        {
          heading: "ステンレス製キャビネット",
          paragraphs: [
            "バスルーム用ミラーキャビネットの中でも、ステンレスフレームは耐久性と美しさを兼ね備えた選択肢です。害虫、細菌、雑菌への耐性があり、さらに美しい光沢がバスルームに清潔感をもたらします。",
          ],
        },
        {
          heading: "プラスチック製キャビネット",
          paragraphs: [
            "バスルーム用ミラーキャビネットでは、軽量なプラスチックは加工や設置がしやすい素材です。他の素材と比べてコストを抑えやすい点も特徴です。",
            "ただし、プラスチック製ミラーキャビネットは耐久性や剛性の面で劣る場合があります。それでも、軽い日用品や薬を収納する用途であれば十分に役立ちます。",
            "Intco Framing は、中国で高い専門性を持つミラーキャビネットメーカーおよびサプライヤーの一つです。私たちは、バスルームを心地よいウェルビーイング空間へ変えることを目指しています。美しさと機能性、伝統と革新を兼ね備えた製品を通じて、お客様に価値を提供します。",
            "また、当社は高品質な原材料を使用して製品を製造しています。これにより、バスルーム小売業界における主要ブランドの製造パートナーとして選ばれています。",
            "バスルーム関連の小売店として信頼できるメーカーをお探しの場合は、ぜひお問い合わせください。製品カタログとお見積もりをご案内します。",
          ],
        },
      ],
    },
    [BLOOMBERG_ESG_ARTICLE_SLUG]: {
      title: "2023 Bloomberg Green ESG 注目企業 50 社リストが正式発表",
      category: "プレスリリース",
      introParagraphs: [
        "中国・蘇州、2024 年 1 月 16 日 /PRNewswire/ — 2023 年 12 月 20 日、2023 Bloomberg Green ESG 注目企業 50 社リスト（以下 ESG 50）が蘇州のフォーシーズンズホテルで正式に発表されました。",
        "Bloomberg Green ESG 50 は、中国で Bloomberg Green が選定・発表する年次リストです。2023 年は初回の ESG 50 リスト発表となります。このリストには上場企業と非上場企業の双方が含まれます。Bloomberg の ESG スコアリング手法は、企業の自己開示情報と公開情報を主な根拠とするボトムアップ型・モデル駆動型の方法で、透明性の高いパラメトリックかつルールベースの評価フレームワークを形成しています。",
      ],
      leadImageAlt: "2023 Bloomberg Green ESG 注目企業 50 社リスト発表",
      sections: [
        {
          paragraphs: ["以下は全リストです（順不同）。"],
        },
        {
          heading: "ESG 成長企業",
          paragraphs: ["Grandblue Environment Co.,Ltd.", "Marriott", "INTCO MEDICAL"],
        },
        {
          heading: "ESG 有望ブランド",
          paragraphs: ["NaaS Technology Inc.", "Nespresso", "SHUI ON LAND", "UNIQLO"],
        },
        {
          heading: "優秀 ESG プロジェクト",
          paragraphs: [
            "McDonald’s China（Project: Green Tray）",
            "Pernod Ricard China（Project: Martell Mangrove Conservation）",
            "O’right Inc.（Project: Melting Greenland）",
            "Honor Device Co., Ltd.（Project: Tech for Good: Mobile Accessibility Assistance）",
            "Shandong Intco Recycilng Resources Co.,ltd.（Project: Food-Grade PET ‘Bottle-to-Bottle’ High-Quality Application）",
            "Tapestry（Project: COACH China Cool）",
            "TCL Technology Group Corporation（Project: TCL Solar Low-Carbon Campus）",
            "Tencent Holdings Limited（Project: Tencent Biodiversity Conservation Initiatives）",
            "Starbucks China（Project: Starbucks China Coffee Innovation Park）",
            "China International Capital Corporation Limited（Project: CICC-Nanping: Ecological Carbon Sink+）",
          ],
        },
        {
          heading: "ESG トップリスト - 環境",
          paragraphs: ["Blancpain", "Hua Xia Bank Co.,Limited", "JD.com", "Lenovo Group", "LONGi Green Energy Technology Co., Ltd", "GDS Holdings Limited", "Vitesco Technologies", "Xiaomi Corporation", "China Merchants Shekou Industrial Zone Holding Co., Ltd", "Chint New Energy Technology Co., Ltd.", "China Modern Dairy Holdings Ltd."],
        },
        {
          heading: "ESG トップリスト - 社会",
          paragraphs: ["ERICSSON GROUP", "Yum China", "BMW Group Region China", "MASTER KONG HOLDINGS CO.,LTD", "Nestlé (China) Ltd.", "UBS", "DBS BANK", "BANK OF CHINA"],
        },
        {
          heading: "ESG トップリスト - ガバナンス",
          paragraphs: ["Tongwei Company Limited", "Sino Biopharmaceutical Limited"],
        },
        {
          heading: "ESG グランプリ - 優秀企業",
          paragraphs: [
            "The Bank of East Asia(China) Limited.",
            "Foxconn Industrial Internet Co., Ltd.",
            "KINGFA SCI.&TECH.CO.,LTD.",
            "Jinko Solar Co., Ltd.",
            "China Mengniu Dairy Co., Ltd.",
            "GLP China",
            "SY Holdings Group Limited.",
            "Cisco China Co., Ltd.",
            "Trina Solar Co., Ltd.",
            "NetEase, Inc.",
            "Chint Anneng Digital Power(Zhejiang)Co.,Ltd.",
            "CSSC(Hong Kong)Shipping Company Limited",
            "Jones Lang LaSalle",
            "2023 Bloomberg Green ESG Leading Forum は、リスト発表に先立って開催されました。各業界のリーダーや国際的な学術機関の専門家が参加し、ESG 分野における先進的なイノベーションについて議論しました。",
            "Bloomberg Green は、気候変動に関するビジネス、科学、テクノロジーに焦点を当てています。同ブランドは Bloomberg の深いデータ知見を活用し、独自の報道、課題解決に向けたカバレッジ、ビジネスおよび投資に関するコンテンツを提供します。",
            "Bloomberg Green は、グリーンで低炭素な経済への移行を促進する取り組みをさらに推進し、健全で豊か、かつ持続可能なグリーン経済の新たな青写真を描くことを目指しています。",
          ],
        },
        {
          heading: "INTCO について",
          paragraphs: [
            "INTCO Recycling（688087.SH）は、資源リサイクルを専門とするハイテクメーカーです。プラスチックのリサイクルと再利用に関する産業チェーン全体を構築し、先進的な消費財と精密に融合させることで、革新的なビジネスへと発展させてきました。",
          ],
        },
      ],
    },
  },
} as const;

const SOURCE_BLOG_POPULAR_POST_TRANSLATIONS: Partial<Record<Locale, Record<string, { title: string; category: string }>>> = {
  ja: {
    "/news/the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released": {
      title: "2023 Bloomberg Green ESG…",
      category: "プレスリリース",
    },
    "/news/5-ways-an-led-bathroom-vanity-mirror-can-lmprove-your-space": {
      title: "LED バスルームミラーで空間を…",
      category: "インスピレーション",
    },
    "/news/the-major-materials-of-medicine-mirror-cabinet": {
      title: "ミラーキャビネットの主な素材",
      category: "業界ニュース",
    },
  },
};

function localizeSourceBlogCategory(locale: Locale, category: string) {
  return SOURCE_BLOG_LABELS[locale].categoryLabels[category] || category;
}

function localizedSourceBlogPopularPost(locale: Locale, item: (typeof VANITY_MIRROR_POPULAR_POSTS)[number]) {
  const translated = SOURCE_BLOG_POPULAR_POST_TRANSLATIONS[locale]?.[item.path];
  return {
    ...item,
    title: translated?.title || item.title,
    category: translated?.category || localizeSourceBlogCategory(locale, item.category),
  };
}

function localizedSourceNewsArticle(article: (typeof SOURCE_NEWS_ARTICLES)[keyof typeof SOURCE_NEWS_ARTICLES], post: BlogPost, locale: Locale) {
  const localized = SOURCE_NEWS_ARTICLE_LOCALIZATIONS[locale as keyof typeof SOURCE_NEWS_ARTICLE_LOCALIZATIONS]?.[post.slug as keyof (typeof SOURCE_NEWS_ARTICLE_LOCALIZATIONS)["ja"]];
  if (!localized) {
    return {
      ...article,
      category: localizeSourceBlogCategory(locale, article.category),
    };
  }

  return {
    ...article,
    title: localized.title,
    category: localized.category,
    introParagraphs: localized.introParagraphs,
    leadImage: article.leadImage
      ? {
          ...article.leadImage,
          imageAlt: localized.leadImageAlt,
        }
      : article.leadImage,
    sections: localized.sections,
  };
}

function normalizedBlogActiveCategory(category?: string) {
  const normalized = category?.trim();
  return normalized && normalized !== "All" ? normalized : undefined;
}

function blogSourceCategory(post: BlogPost, override?: BlogSourceCard) {
  return override?.category && override.category !== "All" ? override.category : post.categoryKey || post.category;
}

function blogSourceDate(post: BlogPost, pageLines: string[], override?: BlogSourceCard) {
  return post.publishedAt || override?.date || blogDateFor(pageLines, post.title);
}

function blogSourceDateValue(value?: string) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function orderedBlogSourceItems(posts: BlogPost[], page?: ContentPage): BlogSourceListItem[] {
  const pageLines = contentLines(page?.bodyText, 120);
  const orderMap = new Map(HOME_BLOG_CARDS.map((item, index) => [item.path, index]));

  return posts
    .slice()
    .sort((a, b) => {
      const aOrder = orderMap.get(a.path) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap.get(b.path) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;

      const aDate = blogSourceDateValue(blogSourceDate(a, pageLines, BLOG_SOURCE_CARD_BY_PATH.get(a.path)));
      const bDate = blogSourceDateValue(blogSourceDate(b, pageLines, BLOG_SOURCE_CARD_BY_PATH.get(b.path)));
      if (aDate !== bDate) return bDate - aDate;

      return a.title.localeCompare(b.title);
    })
    .map((post) => {
      const override = BLOG_SOURCE_CARD_BY_PATH.get(post.path);
      const category = blogSourceCategory(post, override);
      return {
        ...post,
        category,
        categoryKey: category,
        excerpt: post.excerpt || override?.description || "",
        publishedAt: blogSourceDate(post, pageLines, override),
        imageUrl: override?.imageUrl || post.imageUrl,
        imageAlt: post.imageAlt || override?.title || post.title,
      };
    });
}

function filteredBlogSourceItems(posts: BlogPost[], page: ContentPage | undefined, activeCategory?: string) {
  const category = normalizedBlogActiveCategory(activeCategory);
  const items = orderedBlogSourceItems(posts, page);
  return category ? items.filter((post) => post.categoryKey === category || post.category === category) : items;
}

export function blogListingPageCount(posts: BlogPost[], page: ContentPage | undefined, activeCategory?: string) {
  const items = filteredBlogSourceItems(posts, page, activeCategory);
  return Math.max(1, Math.ceil(items.length / BLOG_SOURCE_PAGE_SIZE));
}

function relatedBlogSourceItems(posts: BlogPost[], currentSlug: string, page: ContentPage | undefined, currentCategory?: string, limit = 3) {
  const ordered = orderedBlogSourceItems(posts, page).filter((item) => item.slug !== currentSlug);
  const matching = currentCategory ? ordered.filter((item) => item.categoryKey === currentCategory || item.category === currentCategory) : [];
  const remainder = ordered.filter((item) => !matching.some((match) => match.slug === item.slug));
  return [...matching, ...remainder].slice(0, limit);
}

const SUSTAINABILITY_ACTION_CARD_COPY: Record<Locale, Array<Pick<(typeof SUSTAINABILITY_ACTION_CARDS)[number], "title" | "description">>> = {
  en: SUSTAINABILITY_ACTION_CARDS.map(({ title, description }) => ({ title, description })),
  es: [
    {
      title: "Innovación en modelos de economía circular",
      description:
        "INTCO considera el impacto ambiental durante todo el ciclo de vida del producto. Con tecnología avanzada de reciclaje y productos fabricados con plástico reciclado, impulsa el reciclaje de alto valor y conecta toda la cadena industrial para crear un modelo distintivo de economía circular integrada.",
    },
    {
      title: "Iniciativas ambientales integrales",
      description:
        "Ante el desafío del cambio climático, reducimos nuestra huella de carbono, optimizamos el uso de recursos en todas las operaciones y convertimos residuos en recursos valiosos, manteniendo altos estándares ambientales en cada parte del negocio.",
    },
    {
      title: "Un entorno laboral diverso e inclusivo",
      description:
        "Fomentamos una cultura de cuidado genuino hacia los empleados. Valoramos la diversidad de nacionalidades, etnias y trayectorias, y promovemos oportunidades inclusivas, incluidas posiciones adaptadas para empleados con discapacidad.",
    },
  ],
  pt: [
    {
      title: "Inovação em modelos de economia circular",
      description:
        "A INTCO considera o impacto ambiental em todo o ciclo de vida do produto. Com tecnologia avançada de reciclagem e produtos de plástico reciclado, realiza reciclagem de alto valor e integra toda a cadeia industrial em um modelo próprio de economia circular.",
    },
    {
      title: "Iniciativas ambientais abrangentes",
      description:
        "Diante das mudanças climáticas, reduzimos a pegada de carbono, usamos recursos com responsabilidade em todas as operações e transformamos resíduos em recursos valiosos, mantendo padrões ambientais rigorosos em todo o negócio.",
    },
    {
      title: "Ambiente de trabalho diverso e inclusivo",
      description:
        "Promovemos uma cultura de cuidado genuíno com os colaboradores. Valorizamos nacionalidades, etnias e origens diversas e buscamos oportunidades inclusivas, incluindo posições adaptadas para colaboradores com deficiência.",
    },
  ],
  fr: [
    {
      title: "Innovation dans les modèles d'économie circulaire",
      description:
        "INTCO prend en compte l'impact environnemental sur tout le cycle de vie des produits. Grâce à des technologies avancées de recyclage et aux plastiques recyclés, l'entreprise valorise les matériaux et relie toute la chaîne industrielle dans un modèle intégré d'économie circulaire.",
    },
    {
      title: "Initiatives environnementales complètes",
      description:
        "Face au changement climatique, nous réduisons notre empreinte carbone, optimisons l'utilisation des ressources dans toutes nos opérations et transformons les déchets en ressources utiles, tout en respectant des standards environnementaux élevés.",
    },
    {
      title: "Un environnement de travail diversifié et inclusif",
      description:
        "Nous développons une culture d'entreprise attentive aux collaborateurs. Nous valorisons la diversité des nationalités, origines et parcours, et favorisons des opportunités inclusives, y compris pour les personnes en situation de handicap.",
    },
  ],
  de: [
    {
      title: "Innovation für Kreislaufwirtschaftsmodelle",
      description:
        "INTCO betrachtet die Umweltauswirkungen über den gesamten Produktlebenszyklus. Mit fortschrittlicher Recyclingtechnologie und Produkten aus recyceltem Kunststoff ermöglicht das Unternehmen hochwertige Wiederverwertung und verbindet die gesamte industrielle Kette zu einem integrierten Kreislaufwirtschaftsmodell.",
    },
    {
      title: "Umfassende Umweltinitiativen",
      description:
        "Als Antwort auf den Klimawandel reduzieren wir unseren CO₂-Fußabdruck, setzen Ressourcen in allen Abläufen verantwortungsvoll ein und verwandeln Abfälle in wertvolle Ressourcen, während wir hohe Umweltstandards einhalten.",
    },
    {
      title: "Ein vielfältiges und inklusives Arbeitsumfeld",
      description:
        "Wir fördern eine Unternehmenskultur, die echte Fürsorge für Mitarbeitende lebt. Unterschiedliche Nationalitäten, Ethnien und Hintergründe werden wertgeschätzt; zugleich schaffen wir inklusive Chancen, auch für Mitarbeitende mit Behinderung.",
    },
  ],
  ja: [
    {
      title: "循環型経済モデルの革新",
      description:
        "INTCOは製品ライフサイクル全体の環境負荷を重視しています。高度なリサイクル技術と再生プラスチック製品により、プラスチックの高付加価値リサイクルを実現し、産業チェーン全体をつなぐ独自の循環型経済モデルを構築しています。",
    },
    {
      title: "包括的な環境への取り組み",
      description:
        "気候変動への対応として、当社はカーボンフットプリントの削減、事業全体での資源の有効活用、廃棄物の資源化を推進し、あらゆる業務で高い環境基準を守っています。",
    },
    {
      title: "多様でインクルーシブな職場環境",
      description:
        "当社は従業員を大切にする企業文化を育んでいます。国籍、民族、背景の違いを尊重し、障がいのある従業員向けの職務を含め、誰もが活躍できる機会づくりに取り組んでいます。",
    },
  ],
};

function localizedSustainabilityActionCards(locale: Locale) {
  const copy = SUSTAINABILITY_ACTION_CARD_COPY[locale];
  return SUSTAINABILITY_ACTION_CARDS.map((card, index) => ({ ...card, ...copy[index] }));
}

const PHILOSOPHY_HERO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/3b68fa7c7b25e9369f475bbf642cf726d608e602-1920x600.png";
const PHILOSOPHY_CEO_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/837fe8ac45ed4a821a7f640cb0bfd00321db3c43-763x658.png";
const PHILOSOPHY_QUOTE_TOP = "https://cdn.sanity.io/images/vzcnnept/production/e9d84177feceffec8aa4827f63d794db39d00082-32x29.png";
const PHILOSOPHY_QUOTE_BOTTOM = "https://cdn.sanity.io/images/vzcnnept/production/99c995f2763d83ab2e8cdf415d10ac66267dea05-410x360.png";
const PHILOSOPHY_BG = "https://cdn.sanity.io/images/vzcnnept/production/880925b1d4c3c8d9323170b70d0ac5569e2c3fc3-1920x1835.png";
const PHILOSOPHY_CENTER_BG = "https://cdn.sanity.io/images/vzcnnept/production/08b83d56001542f057dd3453f64652316df1f56b-1920x966.jpg";
const PHILOSOPHY_TEAM_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/436cb771086c0db9f0dd6c38b38be168e663a6b4-1262x683.png";
const PHILOSOPHY_CONTACT_IMAGE = "https://cdn.sanity.io/images/vzcnnept/production/e1ada54b21ce23e43637ec0747fd1f99c7b31bb0-428x428.png";

const PHILOSOPHY_QUOTE: Record<Locale, string> = {
  en: "We have a dynamic and hardworking team making concerted efforts on adifficult but worthwhile cause. The recycling industry has a profound impact on the environment and society, leading to sustainable development.",
  es: "Contamos con un equipo dinámico y trabajador que une esfuerzos en una causa difícil, pero valiosa. La industria del reciclaje tiene un impacto profundo en el medio ambiente y la sociedad, e impulsa el desarrollo sostenible.",
  pt: "Temos uma equipe dinâmica e dedicada que trabalha em conjunto por uma causa difícil, mas valiosa. A indústria da reciclagem tem impacto profundo no meio ambiente e na sociedade, impulsionando o desenvolvimento sustentável.",
  fr: "Nous avons une équipe dynamique et engagée qui unit ses efforts autour d'une cause exigeante, mais essentielle. L'industrie du recyclage a un impact majeur sur l'environnement et la société, et favorise le développement durable.",
  de: "Wir haben ein dynamisches und engagiertes Team, das gemeinsam an einer anspruchsvollen, aber wertvollen Aufgabe arbeitet. Die Recyclingbranche hat einen tiefgreifenden Einfluss auf Umwelt und Gesellschaft und fördert nachhaltige Entwicklung.",
  ja: "私たちには、困難でありながら価値ある使命に一丸となって取り組む、活力ある勤勉なチームがあります。リサイクル産業は環境と社会に大きな影響を与え、持続可能な発展を支えています。",
};

const PHILOSOPHY_VALUES = [
  {
    title: "Mission",
    body: "Focus on the Recycling of Resources, for the Sustainable Development of the Earth",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3f7fa0481ece77af11444cccea5c1ee8ece62bc5-116x116.png",
  },
  {
    title: "Vision",
    body: "Becoming a Global Leader in High-tech Recycled Resource Manufacturing",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/37a7e0618c73900adf1b679ff80dbe80c6a3db41-116x116.png",
  },
  {
    title: "Spirit",
    body: "Honesty & Integrity, Diligence & Hardworking, Professionalism,Teamwork, Customer First",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/261993aa07d10da9061ce1b8f86a4e1f3c2f8907-116x116.png",
  },
  {
    title: "Values",
    body: "Love Goodness Truth",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6cff20d3f99a7e49913b0018f329b547bf4179ab-116x116.png",
  },
  {
    title: "Objective",
    body: "With Human Wisdom Serving Human Needs",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5db6954ad19cfcdfb27186a589c30e71b29b81d3-116x116.png",
  },
  {
    title: "lmprovement & Innovation",
    body: "Every Suggestion Will be Cherished, Every lmprovement Will be Awarded",
    details: ["The Duty to Our Enterprise:", "Growing Our Business", "The Duty to Society:", "Practicing Ethical Behavior"],
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c95d292cac7ea91f721005cd28a190564988349a-116x116.png",
  },
];

type PhilosophyValue = (typeof PHILOSOPHY_VALUES)[number];

const PHILOSOPHY_VALUE_COPY: Record<Locale, Array<Pick<PhilosophyValue, "title" | "body" | "details">>> = {
  en: PHILOSOPHY_VALUES.map(({ title, body, details }) => ({ title, body, details })),
  es: [
    { title: "Misión", body: "Centrarnos en el reciclaje de recursos para el desarrollo sostenible de la Tierra" },
    { title: "Visión", body: "Convertirnos en un líder global en fabricación de alta tecnología con recursos reciclados" },
    { title: "Espíritu", body: "Honestidad e integridad, diligencia y esfuerzo, profesionalismo, trabajo en equipo, cliente primero" },
    { title: "Valores", body: "Amor, bondad y verdad" },
    { title: "Objetivo", body: "Servir las necesidades humanas con sabiduría humana" },
    { title: "Mejora e innovación", body: "Cada sugerencia será valorada, cada mejora será reconocida", details: ["Nuestro deber con la empresa:", "Hacer crecer el negocio", "Nuestro deber con la sociedad:", "Actuar con ética"] },
  ],
  pt: [
    { title: "Missão", body: "Focar na reciclagem de recursos para o desenvolvimento sustentável da Terra" },
    { title: "Visão", body: "Tornar-se líder global em fabricação de alta tecnologia com recursos reciclados" },
    { title: "Espírito", body: "Honestidade e integridade, diligência e trabalho árduo, profissionalismo, trabalho em equipe, cliente em primeiro lugar" },
    { title: "Valores", body: "Amor, bondade e verdade" },
    { title: "Objetivo", body: "Usar a sabedoria humana para atender às necessidades humanas" },
    { title: "Melhoria e inovação", body: "Cada sugestão será valorizada, cada melhoria será reconhecida", details: ["Nosso dever com a empresa:", "Expandir o negócio", "Nosso dever com a sociedade:", "Praticar conduta ética"] },
  ],
  fr: [
    { title: "Mission", body: "Se concentrer sur le recyclage des ressources pour le développement durable de la Terre" },
    { title: "Vision", body: "Devenir un leader mondial de la fabrication high-tech à partir de ressources recyclées" },
    { title: "Esprit", body: "Honnêteté et intégrité, diligence et effort, professionnalisme, travail d'équipe, client d'abord" },
    { title: "Valeurs", body: "Amour, bonté et vérité" },
    { title: "Objectif", body: "Mettre la sagesse humaine au service des besoins humains" },
    { title: "Amélioration et innovation", body: "Chaque suggestion sera valorisée, chaque amélioration sera reconnue", details: ["Notre devoir envers l'entreprise :", "Développer l'activité", "Notre devoir envers la société :", "Agir avec éthique"] },
  ],
  de: [
    { title: "Mission", body: "Fokus auf Ressourcenrecycling für die nachhaltige Entwicklung der Erde" },
    { title: "Vision", body: "Ein globaler Marktführer in der Hightech-Fertigung mit recycelten Ressourcen werden" },
    { title: "Geist", body: "Ehrlichkeit und Integrität, Fleiß und Einsatz, Professionalität, Teamarbeit, Kunde zuerst" },
    { title: "Werte", body: "Liebe, Güte und Wahrheit" },
    { title: "Ziel", body: "Mit menschlicher Weisheit menschlichen Bedürfnissen dienen" },
    { title: "Verbesserung und Innovation", body: "Jeder Vorschlag wird geschätzt, jede Verbesserung wird anerkannt", details: ["Unsere Pflicht gegenüber dem Unternehmen:", "Unser Geschäft ausbauen", "Unsere Pflicht gegenüber der Gesellschaft:", "Ethisch handeln"] },
  ],
  ja: [
    { title: "ミッション", body: "地球の持続可能な発展のため、資源リサイクルに注力する" },
    { title: "ビジョン", body: "再生資源を活用するハイテク製造のグローバルリーダーになる" },
    { title: "精神", body: "誠実と公正、勤勉と努力、プロフェッショナリズム、チームワーク、顧客第一" },
    { title: "価値観", body: "愛、善、真実" },
    { title: "目的", body: "人間の知恵で人々のニーズに応える" },
    { title: "改善と革新", body: "すべての提案を大切にし、すべての改善を評価する", details: ["企業への責任：", "事業を成長させる", "社会への責任：", "倫理的に行動する"] },
  ],
};

function localizedPhilosophyValues(locale: Locale): PhilosophyValue[] {
  const copy = PHILOSOPHY_VALUE_COPY[locale];
  return PHILOSOPHY_VALUES.map((value, index) => ({ ...value, ...copy[index] }));
}

const PHILOSOPHY_GALLERY_TOP = [
  { imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b7dd638d546d21a99980709c12640657a1ca8181-794x371.png", label: "WORLD CLASS CUSTOMER SERVICE" },
  { imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/68cee9b3b7be3c399ffed342d67c0a97d460a7fb-794x371.png", label: "MEET THE TEAM" },
];

const PHILOSOPHY_RESPONSIBILITY_CARDS = [
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6f614c8ca537aebac5ecc7e0d34e80584a9cadea-954x629.png",
    dutyIndex: 0,
    titleIndex: 1,
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/90fff62281c718efd3165b915b6c8f1f6cab1c95-633x308.png",
    dutyIndex: 2,
    titleIndex: 3,
  },
  {
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5ac64badf2abcf3bbb4eb20bb874e5e5555c59da-633x308.png",
    dutyIndex: 2,
    titleIndex: 3,
  },
];

const SOLUTIONS_INTRO_COPY =
  "We are dedicated to providing innovative and sustainable solutions. Collaborating seamlessly with our clients, we strive for continuous improvement in every aspect of our offerings. From innovative product designs to sustainable manufacturing practices, our solutions are crafted with a focus on the future.";

const SOLUTIONS_SERVICE_ITEMS: SolutionsServiceItem[] = [
  {
    title: "Business Insights & Trends",
    path: "/solutions/business-insights-trends",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/3a3ec21ad4ae68fed0ad99c58fc6e9123ade79a8-400x530.jpg",
    description:
      "With extensive relationships with our retail partners, we hold a distinct advantage which includes real time global market analysis. We offer real-time market performance to keep retailers informed about the latest trends, selling cycles and white space opportunities enabling strategic decision-making for expanded product offerings.",
  },
  {
    title: "Design & Engineering",
    path: "/solutions/design-engineering",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/528d3c4fa7fa432ffe08a1975a8d84e4303ce3df-400x530.jpg",
    description:
      "Collaborate with our skilled design and engineering teams for innovative product design, professional packaging design, cost engineering, captivating display design, extensive product research, and customizable solutions tailored to meet your unique needs. We prioritize innovation and aesthetic appeal, ensuring your products stand out in the competitive market.",
  },
  {
    title: "Manufacturing & Delivery",
    path: "/solutions/manufacturing-delivery",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b7f4b8b21bf7d2f16103b3fa8164b5521db1784a-400x530.jpg",
    description:
      "Intco's vertically integrated supply chain of raw materials, we maintain control over product quality from the source, ensuring consistent excellence for initial orders and reorders. With formidable production capabilities, we have the capacity to manufacture 1.2 million boxes of PS moulding annually. We can meet the demands of large-scale production while consistently upholding rigorous standards of quality.",
  },
  {
    title: "Global Production and Supply",
    path: "/solutions/global-production-and-supply",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/885c2595d3afbacbe5b64c80f3ca5f12d8e07450-400x530.jpg",
    description:
      "By strategically locating our factories in China, Vietnam and Malaysia, we enhance our resilience to external factors that may impact the supply chain and maximize efficiency and flexibility in meeting your demands. All of our factories ensure advanced production technology and equipment, quality manufacturing and flexible shipping. Operating in strict adherence to international quality standards, each factory has earned high recognition for product quality from our customers.",
  },
  {
    title: "Certification",
    path: "/solutions/certification",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f8f13954a15413c3470e8af6a4373cfd4973030c-400x530.jpg",
    description:
      "Rest easy with our commitment to quality and compliance. Intco Framing provides outstanding products and quality services to global customers. We actively certify quality systems and cooperate with third-party audit agencies, customers, and suppliers for audit supervision.",
  },
  {
    title: "Retailer Support",
    path: "/solutions/retailer-support",
    imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1edb806933a8a175dfb189bd58da09f476788734-400x530.jpg",
    description:
      "As the only home décor manufacturer that starts with recycled materials around the world, we truly ensure quality control from the source, and pride ourselves on offering continuous assistance to ensure the prosperity of your retail business.",
  },
];

const SOLUTIONS_PROCESS_STEPS = [
  { label: "Design", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/230b7b7bf3e3912b6812bab875a4f69ed6336b21-277x277.png" },
  { label: "Frame Extrusion", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c9daa2ff601a25e9b55c28a25855dcd93e66f5ea-278x277.png" },
  { label: "Assemble", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5a6e6f4bbc5ef8d691ee6944e62b970be951c1e2-277x277.png" },
  { label: "Warehousing", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1f819e2126c489e6f1a955b2b78381d8c9f2048d-278x277.png" },
  { label: "Packing", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/11c6c560c192430e474eb990329e6544222b71d5-278x277.png" },
  { label: "Quality Control", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/e1200e8c935f853748e9878914bcbb07d460346c-278x277.png" },
];

const SOLUTIONS_PROCESS_LABELS: Record<Locale, string[]> = {
  en: ["Design", "Frame Extrusion", "Assemble", "Warehousing", "Packing", "Quality Control"],
  es: ["Diseño", "Extrusión de marcos", "Ensamblaje", "Almacenaje", "Embalaje", "Control de calidad"],
  pt: ["Design", "Extrusão de molduras", "Montagem", "Armazenagem", "Embalagem", "Controle de qualidade"],
  fr: ["Design", "Extrusion de cadres", "Assemblage", "Stockage", "Emballage", "Contrôle qualité"],
  de: ["Design", "Rahmenextrusion", "Montage", "Lagerung", "Verpackung", "Qualitätskontrolle"],
  ja: ["デザイン", "フレーム押出", "組立", "倉庫保管", "梱包", "品質管理"],
};

const SUSTAINABILITY_LABELS: Record<Locale, { watchVideo: string; closeVideo: string; videoTitle: string; downloadPdf: string; externalRatings: string; environmentalContribution: string; protectTree: string; inAction: string; meetTeam: string; years: string }> = {
  en: {
    watchVideo: "Watch Video",
    closeVideo: "Close video",
    videoTitle: "Sustainability video",
    downloadPdf: "Download PDF",
    externalRatings: "EXTERNAL RATINGS",
    environmentalContribution: "ENVIRONMENTAL CONTRIBUTION",
    protectTree: "HOW TO PROTECT A TREE",
    inAction: "SUSTAINABILITY IN ACTION",
    meetTeam: "MEET THE TEAM",
    years: "20+ Years",
  },
  es: {
    watchVideo: "Ver video",
    closeVideo: "Cerrar video",
    videoTitle: "Video de sostenibilidad",
    downloadPdf: "Descargar PDF",
    externalRatings: "CALIFICACIONES EXTERNAS",
    environmentalContribution: "CONTRIBUCIÓN AMBIENTAL",
    protectTree: "CÓMO PROTEGER UN ÁRBOL",
    inAction: "SOSTENIBILIDAD EN ACCIÓN",
    meetTeam: "CONOZCA AL EQUIPO",
    years: "Más de 20 años",
  },
  pt: {
    watchVideo: "Ver vídeo",
    closeVideo: "Fechar vídeo",
    videoTitle: "Vídeo de sustentabilidade",
    downloadPdf: "Baixar PDF",
    externalRatings: "AVALIAÇÕES EXTERNAS",
    environmentalContribution: "CONTRIBUIÇÃO AMBIENTAL",
    protectTree: "COMO PROTEGER UMA ÁRVORE",
    inAction: "SUSTENTABILIDADE EM AÇÃO",
    meetTeam: "CONHEÇA A EQUIPE",
    years: "Mais de 20 anos",
  },
  fr: {
    watchVideo: "Voir la vidéo",
    closeVideo: "Fermer la vidéo",
    videoTitle: "Vidéo sur la durabilité",
    downloadPdf: "Télécharger le PDF",
    externalRatings: "ÉVALUATIONS EXTERNES",
    environmentalContribution: "CONTRIBUTION ENVIRONNEMENTALE",
    protectTree: "COMMENT PROTÉGER UN ARBRE",
    inAction: "DURABILITÉ EN ACTION",
    meetTeam: "RENCONTREZ L'ÉQUIPE",
    years: "Plus de 20 ans",
  },
  de: {
    watchVideo: "Video ansehen",
    closeVideo: "Video schließen",
    videoTitle: "Nachhaltigkeitsvideo",
    downloadPdf: "PDF herunterladen",
    externalRatings: "EXTERNE BEWERTUNGEN",
    environmentalContribution: "UMWELTBEITRAG",
    protectTree: "WIE MAN EINEN BAUM SCHÜTZT",
    inAction: "NACHHALTIGKEIT IN AKTION",
    meetTeam: "DAS TEAM KENNENLERNEN",
    years: "Über 20 Jahre",
  },
  ja: {
    watchVideo: "動画を見る",
    closeVideo: "動画を閉じる",
    videoTitle: "サステナビリティ動画",
    downloadPdf: "PDF をダウンロード",
    externalRatings: "外部評価",
    environmentalContribution: "環境への貢献",
    protectTree: "木を守る方法",
    inAction: "サステナビリティの実践",
    meetTeam: "チーム紹介",
    years: "20年以上",
  },
};

const SOLUTIONS_RELATED_LINKS = [
  { number: "01", title: "Featured Products", path: "/products", description: "We offer product brochures covering various categories for your information." },
  { number: "02", title: "Latest  Projects", path: "/projects", description: "We offer product brochures covering various categories for your information." },
  { number: "03", title: "Customer  Service", path: "/contact", description: "We offer product brochures covering various categories for your information." },
];

export function HomeView({ data, locale }: { data: SiteData; locale: Locale }) {
  const { homePage, productCategories, solutions, blogPosts, pages } = data;
  const parentCategories = productCategories.filter((category) => !category.parentSlug).slice(0, 5);
  const href = (path: string) => localizePath(locale, path);
  const heroSlides = localizedHomeHeroSlides(homePage, locale, productCategories, solutions);
  const companyProfileFallback = HOME_COMPANY_PROFILE_FALLBACK[locale];
  const companyProfilePoints = localizedHomeCompanyProfilePoints(locale, homePage.companyProfile?.points);
  const blogPage = pages.find((page) => page.path === "/blog");
  const localizedBlogCards = orderedBlogSourceItems(blogPosts, blogPage)
    .filter((post) => post.imageUrl)
    .map((post) => ({
      title: post.title,
      path: post.path,
      imageUrl: post.imageUrl || "",
      date: formatDate(post.publishedAt),
      description: post.excerpt || post.metaDescription || "",
      category: post.categoryKey || post.category || "All",
    }));
  const homeBlogCards = localizedBlogCards.length ? localizedBlogCards : HOME_BLOG_CARDS;

  return (
    <>
      <HeroCarousel slides={heroSlides} fallbackTitle={homePage.title} locale={locale} />
      <span className="sr-only">{t(locale, "latestProducts")}</span>

      <section className="overflow-hidden bg-[#f3f3f3] px-4 py-7 sm:px-6 lg:py-[99px]">
        <HomeSourceTitle title={t(locale, "featuredProducts").toUpperCase()} />
        <div className="intco-source-container mt-8 px-5 lg:mt-[65px]">
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-[30px]">
            {parentCategories.slice(0, 2).map((category, index) => (
              <HomeProductTile
                key={category.slug}
                category={category}
                locale={locale}
                wide
                eager
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            ))}
          </div>
          <div className="mt-[30px] grid gap-5 lg:grid-cols-3 lg:gap-[30px]">
            {parentCategories.slice(2, 5).map((category) => (
              <HomeProductTile key={category.slug} category={category} locale={locale} />
            ))}
          </div>
          <div className="mt-12 flex justify-center lg:mt-16">
            <SourcePillLink href={href("/products")}>{t(locale, "exploreMore")}</SourcePillLink>
          </div>
        </div>
      </section>

      <section className="intco-home-company-profile relative overflow-visible bg-white px-4 pt-16 sm:px-6 min-[900px]:pt-[100px]">
        <div className="intco-source-container px-5">
          <div className="intco-home-company-layout">
            <div className="pb-8 min-[900px]:pb-[70px]">
              <HomeSourceTitle title={(homePage.companyProfile?.title || companyProfileFallback.title).toUpperCase()} align="left" />
              <p className="mt-10 max-w-2xl text-pretty text-lg leading-[30px] text-[#363636] lg:mt-[50px]">
                {homePage.companyProfile?.description || companyProfileFallback.description}
              </p>
              <ul className="mt-5 space-y-2 text-lg leading-10 text-[#363636]">
                {companyProfilePoints.map((point, index) => (
                  <li key={point} className="group flex items-center gap-[13px]">
                    <span className="flex size-[26px] items-center justify-center rounded-full border border-[#484653] text-sm transition duration-200 group-hover:bg-[#484653] group-hover:text-white">
                      {index + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-end gap-8">
                {localizedHomeProfileLinks(locale).map((item) => (
                  <Link key={item.label} href={href(item.path)} className="group flex flex-col justify-end text-lg font-semibold text-[#484653] transition duration-200 hover:-translate-y-2">
                    <Image src={item.imageUrl} alt={item.label} width={108} height={110} className="h-[110px] w-[108px] object-contain" />
                    <span className="mt-5">{item.label}</span>
                  </Link>
                ))}
                <SourcePillLink href={href("/who-we-are")} compact>
                  {t(locale, "readMore")}
                </SourcePillLink>
              </div>
            </div>
            <div className="intco-home-company-video">
              <LazyVideoEmbed className="aspect-video w-full overflow-hidden bg-black" src={homeProfileVideoSrc(locale)} title={HOME_PROFILE_VIDEO_COPY[locale].playerTitle} />
            </div>
          </div>
        </div>
        <div className="aboutus-index-list2 intco-home-company-stats intco-source-container px-5">
          <div className="relative">
            <div className="intco-home-company-stats-list relative grid gap-6 sm:grid-cols-2 min-[900px]:grid-cols-4">
              {localizedHomeStats(locale).map((stat) => (
                <div key={stat.label} className="intco-home-company-stat flex items-center justify-center pb-10 pt-5 text-[#484653]">
                  <div className="mr-[13px]">
                    <i className={`intco-home-stat-icon ${stat.iconClass}`} aria-hidden="true" />
                  </div>
                  <div className="leading-none">
                    <div className="text-[70px] font-semibold leading-none max-[1466px]:text-[45px]">
                      <CountUpStat value={stat.value} />
                      {stat.suffix ? <sup>{stat.suffix}</sup> : null}
                    </div>
                    <div className="mt-2 text-right text-sm font-semibold leading-[22px]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-16 pt-16 sm:px-6 min-[900px]:pt-[110px]">
        <div className="intco-source-container px-5">
          <HomeSourceTitle title={t(locale, "solutions").toUpperCase()} align="left" />
          <p className="mt-10 max-w-[1160px] text-pretty text-lg leading-8 text-[#363636] lg:mt-[68px]">
            {t(locale, "sourceHomeSolutionsIntro")}
          </p>
          <div className="mt-10 grid gap-x-[17px] gap-y-10 px-[10px] sm:grid-cols-2 lg:mt-[50px] lg:grid-cols-3 lg:gap-y-[80px]">
            {solutions.slice(0, 6).map((solution) => (
              <HomeSolutionTile key={solution.slug} solution={solution} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-10 sm:px-6">
        <div className="intco-source-container px-5">
          <HomeSourceTitle title={t(locale, "projects").toUpperCase()} align="left" />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 lg:flex-nowrap">
            <p className="max-w-[512px] text-pretty text-base leading-6 text-[#363636]">
              {t(locale, "sourceProjectsIntroLine1")}
              <br />
              {t(locale, "sourceProjectsIntroLine2")}
            </p>
            <div className="flex max-w-[631px] items-center bg-white px-8 py-[18px] text-[#484653]">
              <p className="max-w-[300px] text-base font-semibold leading-[30px]">{t(locale, "customizedIndustrySolution")}</p>
              <Link href={href("/contact")} className="inline-flex h-[66px] items-center rounded-md bg-[#484653] px-5 text-base font-semibold text-white">
                <span className="border-r border-white pr-3">{t(locale, "contactUs")}</span>
                <ArrowRight className="ml-3" size={22} />
              </Link>
            </div>
          </div>
          <div className="relative mt-[55px] px-[70px] max-[900px]:px-0">
            <button type="button" aria-label={t(locale, "previousProject")} className="absolute left-0 top-1/2 z-10 flex size-[53px] -translate-y-1/2 items-center justify-center rounded-full bg-[#484653] text-white max-[900px]:hidden">
              <i className="intco-source-iconfont intco-source-icon-arrow-left" aria-hidden="true" style={{ color: "#fff", fontSize: 32 }} />
            </button>
            <button type="button" aria-label={t(locale, "nextProject")} className="absolute right-0 top-1/2 z-10 flex size-[53px] -translate-y-1/2 items-center justify-center rounded-full bg-[#484653] text-white max-[900px]:hidden">
              <i className="intco-source-iconfont intco-source-icon-arrow-right" aria-hidden="true" style={{ color: "#fff", fontSize: 32 }} />
            </button>
            <div className="grid gap-[11px] lg:grid-cols-2">
              {HOME_PROJECT_CARDS.map((project) => (
                <HomeProjectTile key={project.title} project={project} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeBlogSection categories={HOME_BLOG_CATEGORIES} intro={homePage.blogIntro?.description} locale={locale} posts={homeBlogCards} />
      <HomeBottomContactBand locale={locale} />
    </>
  );
}

function HomeSourceTitle({ title, align = "center" }: { title: string; align?: "left" | "center" }) {
  return (
    <div className={`intco-home-source-title ${align === "left" ? "intco-home-source-title-left" : ""}`} data-tit={title}>
      <h2 className="title_text">
        {title}
      </h2>
    </div>
  );
}

function SourcePillLink({ href, children, compact }: { href: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white ${compact ? "h-[54px] px-10" : "h-[66px] px-20"}`}
    >
      {children}
      <ArrowRight className="ml-3" size={20} />
    </Link>
  );
}

function HomeProductTile({
  category,
  locale,
  wide,
  eager,
  fetchPriority,
}: {
  category: ProductCategory;
  locale: Locale;
  wide?: boolean;
  eager?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}) {
  const copy = {
    title: category.title,
    description: category.description || HOME_PRODUCT_COPY[locale][category.slug] || HOME_PRODUCT_COPY.en[category.slug] || "",
  };
  const imageUrl = category.imageUrl || category.navImageUrl || "";
  return (
    <Link href={localizePath(locale, category.path)} className="group relative block overflow-hidden rounded-[20px] bg-neutral-200">
      <div className={`relative ${wide ? "aspect-[1.78]" : "aspect-[1.16]"}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.imageAlt || copy.title}
            fill
            className="object-cover"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={fetchPriority}
            sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          />
        ) : null}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-black/45 px-[5%] text-center text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <h3 className="text-balance text-3xl font-semibold leading-none">{copy.title}</h3>
        <p className="mt-5 line-clamp-2 text-pretty text-lg leading-[26px]">{copy.description}</p>
        <span className="mt-7 inline-flex h-12 items-center rounded-full border-2 border-white px-10 text-lg font-medium">
          {t(locale, "exploreMore")} <ArrowRight className="ml-2" size={18} />
        </span>
      </div>
    </Link>
  );
}

function HomeSolutionTile({ solution, locale }: { solution: Solution; locale: Locale }) {
  return (
    <Link href={localizePath(locale, solution.path)} className="group block overflow-hidden bg-white shadow-[0_10px_22px_rgba(0,0,0,0.06)]">
      <div className="relative aspect-[487/363] overflow-hidden bg-neutral-100">
        {solution.imageUrl ? (
          <Image
            src={solution.imageUrl}
            alt={solution.imageAlt || solution.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1601px) 487px, (min-width: 1280px) calc((100vw - 150px) / 3), (min-width: 1024px) calc((100vw - 80px) / 3), (min-width: 640px) calc((100vw - 80px) / 2), calc(100vw - 58px)"
          />
        ) : null}
      </div>
      <div className="min-h-[306px] bg-white px-9 py-12 text-[#363636]">
        <h3 className="border-b border-[#484653] pb-4 text-balance text-lg font-semibold leading-6 text-[#363636]">{solution.title}</h3>
        <p className="mt-7 line-clamp-3 min-h-[84px] text-pretty text-lg leading-7 text-[#363636]">{homeSolutionDescription(solution, locale)}</p>
        <span className="mt-8 inline-flex items-center text-lg font-semibold text-[#484653]">
          {t(locale, "exploreMore")} <ArrowRight className="ml-2" size={18} />
        </span>
      </div>
    </Link>
  );
}

function HomeProjectTile({ project, locale }: { project: (typeof HOME_PROJECT_CARDS)[number]; locale: Locale }) {
  const localizedProject = localizedProjectCard(project, locale);
  return (
    <Link href={localizePath(locale, project.path)} className="group relative block overflow-hidden">
      <div className="relative aspect-[780/400] bg-neutral-200">
        <Image src={project.imageUrl} alt={localizedProject.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="absolute inset-5 rounded-md bg-white/75 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="absolute right-8 top-7 flex size-9 items-center justify-center rounded-full bg-white text-[#987754]">+</span>
        <h3 className="px-12 pt-20 text-3xl font-semibold text-[#484653]">{localizedProject.title}</h3>
        <span className="absolute bottom-16 left-11 inline-flex items-center text-2xl font-semibold text-[#484653]">
          {t(locale, "exploreMore")}
          <span className="ml-3 flex size-8 items-center justify-center rounded-full border-2 border-[#484653]">
            <ArrowRight size={17} />
          </span>
        </span>
      </div>
    </Link>
  );
}

function HomeBottomContactBand({ locale }: { locale: Locale }) {
  return (
    <section
      className="relative mb-[55px] overflow-hidden bg-[#484653] py-[98px] max-[650px]:mb-5 max-[650px]:p-5"
      style={{
        fontFamily: "var(--font-montserrat), var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      <Image src={SOLUTIONS_CONTACT_BG} alt="" fill className="object-cover object-center" sizes="100vw" />
      <span className="sr-only">{t(locale, "getInTouch")}</span>
      <div className="relative z-10 mx-auto box-border flex max-w-[1600px] flex-col items-center justify-between rounded-md bg-[rgba(72,70,83,0.8)] px-0 py-[8vh] text-center text-white max-[1600px]:max-w-[1466px] max-[1366px]:max-w-[1200px] max-[650px]:h-fit max-[650px]:p-8">
        <h2 className="wow fadeInUp w-full text-[38px] font-semibold leading-[15px] text-white max-[650px]:text-lg max-[650px]:leading-5" data-reveal="source-up">
          {t(locale, "perfectSolution")}
        </h2>
        <p className="wow fadeInUp my-8 w-full text-2xl font-normal leading-9 text-white max-[650px]:pb-2.5 max-[650px]:text-sm max-[650px]:leading-5" data-reveal="source-up" style={{ "--reveal-delay": "90ms" } as React.CSSProperties}>
          {t(locale, "contactToday")}
        </p>
        <div className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": "180ms" } as React.CSSProperties}>
          <LeadsCloudChatLink
            fallbackHref={localizePath(locale, "/contact#chat")}
            className="mx-auto box-content flex h-[58px] w-[200px] items-center justify-center rounded-[33px] border-2 border-white bg-white p-0 text-lg font-medium leading-[54px] text-[#484653] transition duration-700 hover:border-[#484653] hover:bg-[#484653] hover:text-white"
          >
            <i className="intco-source-iconfont intco-source-icon-phone-loudspeaker mr-[9px]" aria-hidden="true" style={{ fontSize: 24 }} />
            {t(locale, "contactUs")}
          </LeadsCloudChatLink>
        </div>
      </div>
    </section>
  );
}

function homeSolutionDescription(solution: Solution, locale: Locale) {
  return solution.description || solutionDescriptionFallback(locale, solution.path, "");
}

export function ProductsLandingView({
  page,
  categories,
  locale,
}: {
  page?: ContentPage;
  products: Product[];
  categories: ProductCategory[];
  projects: Project[];
  locale: Locale;
}) {
  const pageLines = contentLines(page?.bodyText, 80);
  const intro = extractAfter(pageLines, "WHAT WE DO", 2);
  const catalogLines = extractAfter(pageLines, "Catalog", 2);
  const testReportLines = extractAfter(pageLines, "TEST REPORT", 2);
  const introTitle = locale === "en" ? intro[0] || t(locale, "productLandingIntroTitle") : t(locale, "productLandingIntroTitle");
  const introDescription = locale === "en" ? intro[1] || t(locale, "productLandingIntroDescription") : t(locale, "productLandingIntroDescription");
  const projectLines = extractAfter(pageLines, "PROJECTS", 2);
  const projectTitle = locale === "en" ? projectLines[0] || t(locale, "sourceProjectsIntroLine1") : t(locale, "sourceProjectsIntroLine1");
  const projectDescription = locale === "en" ? projectLines[1] || t(locale, "productLandingProjectDescription") : t(locale, "productLandingProjectDescription");
  const catalogTitle = locale === "en" ? catalogLines[0] || t(locale, "productCatalogIntroTitle") : t(locale, "productCatalogIntroTitle");
  const catalogDescription = locale === "en" ? catalogLines[1] || t(locale, "productCatalogIntroDescription") : t(locale, "productCatalogIntroDescription");
  const reportTitle = locale === "en" ? testReportLines[0] || t(locale, "productReportIntroTitle") : t(locale, "productReportIntroTitle");
  const reportDescription = locale === "en" ? testReportLines[1] || t(locale, "productReportIntroDescription") : t(locale, "productReportIntroDescription");
  const localizedCategoryCards = categories
    .filter((category) => !category.parentSlug)
    .slice(0, 5)
    .map((category) => ({
      title: category.title,
      path: category.path,
      imageUrl: WHAT_WE_DO_IMAGES[category.slug] || category.imageUrl || category.navImageUrl || "",
    }))
    .filter((category) => category.imageUrl);
  const sourceCategoryCards = localizedCategoryCards.length ? localizedCategoryCards : PRODUCT_CATEGORY_CARDS;

  return (
    <>
      <ProductSourceHero title={page?.title || t(locale, "products")} locale={locale} />

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-[30px] sm:px-6 lg:pt-[99px]">
        <div className="mx-auto max-w-[1600px]">
          <ProductSourceTitle title={t(locale, "whatWeDo")} />
          <ProductSectionDescription first={introTitle} second={introDescription} className="lg:mt-[58px]" />
          <div className="mt-2 lg:mt-[58px]">
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-10">
              {sourceCategoryCards.slice(0, 2).map((category, index) => (
                <ProductSourceTile key={category.title} category={category} locale={locale} index={index} wide />
              ))}
            </div>
            <div className="mt-[30px] grid gap-5 lg:grid-cols-3 lg:gap-[65px]">
              {sourceCategoryCards.slice(2).map((category, index) => (
                <ProductSourceTile key={category.title} category={category} locale={locale} index={index + 2} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-10 sm:px-6 lg:pt-[99px]">
        <div className="mx-auto max-w-[1600px]">
          <ProductSourceTitle title={t(locale, "projects").toUpperCase()} />
          <ProductSectionDescription first={projectTitle} second={projectDescription} className="lg:mt-[55px]" />
          <div className="mt-8 grid gap-10 lg:mt-[55px] lg:grid-cols-2">
            {HOME_PROJECT_CARDS.map((project, index) => (
              <ProductProjectTile key={project.title} project={project} locale={locale} index={index} />
            ))}
          </div>
        </div>
      </section>

      <ProductCatalogSection title={catalogTitle} description={catalogDescription} categories={categories} locale={locale} />
      <ProductTestReportSection title={reportTitle} description={reportDescription} locale={locale} />
      <ProductContactSection locale={locale} />
    </>
  );
}

function ProductSourceHero({ title, locale }: { title: string; locale: Locale }) {
  return <ProductHeroSourceFrame title={title} locale={locale} variant="products" />;
}

function ProductCategorySourceHero({ title, locale, path }: { title: string; locale: Locale; path?: string }) {
  return <ProductHeroSourceFrame title={title} locale={locale} variant="category" categoryPath={path} />;
}

function ProductHeroSourceFrame({ title, locale, variant, categoryPath }: { title: string; locale: Locale; variant: "products" | "category"; categoryPath?: string }) {
  const isProducts = variant === "products";

  return (
    <section className={`intco-source-hero ${isProducts ? "intco-source-hero-products" : "intco-source-hero-category"}`} data-source-hero>
      {!isProducts && locale === "en" ? <span className="sr-only">Category</span> : null}
      <div className="intco-source-hero-slide" data-source-hero-slide>
        <div className="intco-source-hero-bg" data-source-hero-bg>
          <Image src={PRODUCTS_HERO_IMAGE} alt={isProducts ? title : "products"} fill preload className="object-cover" sizes="100vw" />
        </div>
        <div className="intco-source-hero-content" data-source-hero-content>
          <div className="intco-source-container intco-source-hero-inner px-5 min-[1601px]:px-0">
            <div className="intco-source-hero-text" data-source-hero-text>
              <h1 className="intco-source-hero-title" data-source-hero-title>
                {title}
              </h1>
              <nav className="intco-source-hero-crumbs" data-source-hero-crumbs aria-label="Breadcrumb">
                <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                {isProducts ? (
                  <span>{title}</span>
                ) : (
                  <>
                    <BreadcrumbLink href={localizePath(locale, "/products")}>{t(locale, "products")}</BreadcrumbLink>
                    <span className="intco-source-hero-separator">›</span>
                    <BreadcrumbLink href={localizePath(locale, categoryPath || `/${title.toLowerCase().replace(/\s+/g, "-")}`)}>{title}</BreadcrumbLink>
                  </>
                )}
              </nav>
            </div>
            <div className="intco-source-hero-actions" data-source-hero-actions>
              <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")} data-source-hero-cta>
                {t(locale, "chatWithUs")}
              </LeadsCloudChatLink>
              <a href={localizePath(locale, "/products/#goinput")} data-source-hero-cta>
                {t(locale, "leaveMessage")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSourceTitle({ title, align = "center" }: { title: string; align?: "left" | "center" }) {
  const centered = align === "center";
  return (
    <div className={`selefTitle intco-product-source-title ${centered ? "" : "intco-product-source-title-left"}`} data-source-title data-tit={title}>
      <h2 className="title_text" data-source-title-text>
        {title}
      </h2>
    </div>
  );
}

function ProductSectionDescription({ first, second, className = "" }: { first: string; second: string; className?: string }) {
  return (
    <p className={`wow fadeInUp mx-auto mt-3 max-w-[1100px] text-center text-base leading-6 text-[#363636] lg:mt-9 lg:text-lg lg:leading-[30px] ${className}`} data-reveal="source-up">
      {first}
      <br />
      {second}
    </p>
  );
}

function ProductSourceTile({
  category,
  locale,
  index,
  wide,
}: {
  category: { title: string; path: string; imageUrl: string };
  locale: Locale;
  index: number;
  wide?: boolean;
}) {
  return (
    <Link
      href={localizePath(locale, category.path)}
      className="wow fadeInUp group relative block overflow-hidden rounded-[20px] bg-neutral-200"
      data-reveal="source-up"
      style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
    >
      <div className={`relative overflow-hidden ${wide ? "h-[579px] lg:h-auto lg:aspect-[1.95]" : "h-[676px] lg:h-auto lg:aspect-[1.27]"}`}>
        <Image src={category.imageUrl} alt={category.title} width={wide ? 780 : 507} height={400} className="h-auto max-w-none lg:hidden" sizes="780px" />
        <Image src={category.imageUrl} alt={category.title} fill className="hidden object-cover lg:block" sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} />
      </div>
      <div className="absolute inset-0 rounded-[20px] bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="absolute bottom-[31px] left-[34px] translate-y-[-10px] text-2xl font-semibold leading-9 text-white">{category.title}</h3>
      </div>
    </Link>
  );
}

function ProductProjectTile({
  project,
  locale,
  index,
}: {
  project: (typeof HOME_PROJECT_CARDS)[number];
  locale: Locale;
  index: number;
}) {
  const localizedProject = localizedProjectCard(project, locale);
  return (
    <Link
      href={localizePath(locale, project.path)}
      className="wow fadeInUp group relative block overflow-hidden rounded-[20px] bg-neutral-200"
      data-reveal="source-up"
      style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
    >
      <div className="relative aspect-[1.95]">
        <Image src={project.imageUrl} alt={localizedProject.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="absolute inset-[20px] rounded-[20px] bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:inset-x-8 lg:bottom-8 lg:top-[30px]">
        <div className="flex h-full flex-col justify-between p-7 text-white lg:p-10">
          <h3 className="text-2xl font-semibold lg:text-3xl">{localizedProject.title}</h3>
          <span className="inline-flex h-[58px] w-[200px] items-center justify-center rounded-full border-2 border-white text-lg font-medium">
            {t(locale, "exploreMore")} <ArrowRight className="ml-2" size={20} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductCatalogSection({ title, description, categories, locale }: { title: string; description: string; categories: ProductCategory[]; locale: Locale }) {
  const localizedManuals = PRODUCT_MANUALS.map((manual) => {
    if (locale === "en") return manual;
    const category = categoryBySourceTitle(categories, manual.title);
    return {
      ...manual,
      title: category?.title || manual.title,
      description: category?.description || manual.description,
    };
  });

  return (
    <section className="Products intco-product-catalog-section">
      <div className="m-width-content margin100">
        <div className="ipd-20 margin-project-c">
          <ProductSourceTitle title={t(locale, "catalog")} />
          <ProductSectionDescription first={title} second={description} className="intco-product-catalog-desc" />
          <ProductCatalogTabs manuals={localizedManuals} exploreMoreLabel={t(locale, "exploreMore")} locale={locale} />
        </div>
      </div>
    </section>
  );
}

function ProductTestReportSection({ title, description, locale }: { title: string; description: string; locale: Locale }) {
  return (
    <section className="Products TestReport intco-products-test-report" style={{ backgroundImage: `url(${PRODUCT_TEST_REPORT_BG})` }}>
      <ProductSourceTitle title={t(locale, "testReport")} />
      <div className="m-width-content margin100 intco-products-test-report-content">
        <div className="ipd-20 margin-project-c intco-products-test-report-inner">
          <p className="DESC center margin55 intco-products-test-report-desc">
            {title}
            <br />
            {description}
          </p>
          <ProductTestReportCoverflow reports={PRODUCT_REPORT_COVERFLOW_IMAGES} />
        </div>
      </div>
    </section>
  );
}

function ProductContactSection({ locale }: { locale: Locale }) {
  return (
    <section id="goinput" className="overflow-hidden bg-[#f3f3f3] bg-cover bg-center px-5 pb-16 pt-[50px] sm:px-6 lg:pb-[77px] lg:pt-[100px]" style={{ backgroundImage: `url(${PRODUCT_CONTACT_BG})` }}>
      <div className="mx-auto max-w-[1600px]">
        <ProductSourceTitle title={t(locale, "getInTouch")} />
        <div className="ORDERASAMPLEFlex intco-leadscloud-main-form mx-auto mt-12 max-w-[1006px] lg:mt-[55px]">
          <HubSpotMainInquiryForm locale={locale} />
        </div>
      </div>
    </section>
  );
}

function findCategoryBySlug(categories: ProductCategory[], slug?: string) {
  if (!slug) return undefined;
  return categories.find((category) => category.slug === slug);
}

function resolveTopLevelCategory(category: ProductCategory | undefined, categories: ProductCategory[]) {
  let current = category;
  while (current?.parentSlug) {
    current = findCategoryBySlug(categories, current.parentSlug) || current;
    if (current.slug === category?.slug) break;
  }
  return current;
}

function productCategoryTemplateContext(product: Product, categories: ProductCategory[]) {
  const matchedCategories = Array.from(new Set([product.mainCategorySlug, ...(product.categorySlugs || [])]))
    .map((slug) => findCategoryBySlug(categories, slug))
    .filter((category): category is ProductCategory => Boolean(category));
  const mainCategory = findCategoryBySlug(categories, product.mainCategorySlug);
  const activeCategory = (mainCategory?.parentSlug ? mainCategory : undefined) || matchedCategories.find((category) => Boolean(category.parentSlug));
  const topCategory =
    resolveTopLevelCategory(mainCategory, categories) ||
    resolveTopLevelCategory(activeCategory, categories) ||
    matchedCategories.find((category) => !category.parentSlug);
  const siblingCategories = topCategory ? categories.filter((category) => category.parentSlug === topCategory.slug) : [];

  return {
    topCategory,
    activeCategory,
    siblingCategories,
  };
}

function categoryTemplateContext(category: ProductCategory, categories: ProductCategory[]) {
  const topCategory = resolveTopLevelCategory(category, categories) || category;
  const activeCategory = category.parentSlug ? category : undefined;
  const siblingCategories = categories.filter((item) => item.parentSlug === topCategory.slug);

  return {
    topCategory,
    activeCategory,
    siblingCategories,
  };
}

function sourceCategoryCardImage(category: ProductCategory) {
  return category.navImageUrl || category.imageUrl || PRODUCTS_HERO_IMAGE;
}

function sourceCategoryIntro(category: ProductCategory, topCategory: ProductCategory) {
  return category.description || topCategory.description || "Explore the latest INTCO Framing collections in a source-style layout powered by Sanity content.";
}

type SourceCategoryArchiveProduct = {
  key: string;
  title: string;
  path: string;
  imageUrl: string;
  imageAlt: string;
  sourceId?: string;
  colors: Array<{ imageUrl: string; color: string }>;
};

function sourceCategoryListingSearchImage(path: string) {
  return SOURCE_EMPTY_SEARCH_RESULTS.find((item) => item.path === path)?.imageUrl;
}

function sourceCategoryArchiveProducts(category: ProductCategory, products: Product[]): SourceCategoryArchiveProduct[] {
  const snapshotItems = SOURCE_CATEGORY_LISTING_SNAPSHOTS[category.path] || [];
  const snapshotByPath = new Map(snapshotItems.map((item) => [item.path, item]));
  const snapshotBySourceId = new Map(snapshotItems.map((item) => [item.sourceId, item]));

  if (!products.length && snapshotItems.length) {
    return snapshotItems.map((item) => {
      return {
        key: item.sourceId || item.path,
        title: item.title,
        path: item.path,
        imageUrl: item.imageUrl,
        imageAlt: item.title,
        sourceId: item.sourceId,
        colors: item.colors,
      };
    });
  }

  return products.slice(0, 12).map((product) => {
    const snapshot = snapshotByPath.get(product.path) || snapshotBySourceId.get(String(product.sourceId || ""));
    const imageUrl = preferredImage(product) || snapshot?.imageUrl || sourceCategoryListingSearchImage(product.path) || PRODUCTS_HERO_IMAGE;
    return {
      key: String(product.sourceId || product.slug),
      title: product.title,
      path: product.path,
      imageUrl,
      imageAlt: product.imageAlt || product.title,
      sourceId: product.sourceId ? String(product.sourceId) : undefined,
      colors: snapshot?.colors || [],
    };
  });
}

function sourceCategoryFilterGroups(topCategory: ProductCategory) {
  if (topCategory.slug === "mirror") {
    return [
      { title: "Material", values: ["Plastic", "Metal", "Wood", "Frameless"] },
      { title: "Shape", values: ["Oval", "Rectangle", "Arched", "Round", "Irregular"] },
      { title: "Color", values: ["White", "Black", "Wood", "Gold", "Silver"] },
      { title: "Size", values: ['500×500×100mm', '460×1460mm', '600×600×30mm', '18"×60"', '24"×36"'] },
    ];
  }
  if (topCategory.slug === "picture-frame") {
    return [
      { title: "Material", values: ["Plastic", "Metal", "Wood"] },
      { title: "Color", values: ["White", "Black", "Wood", "Gold", "Silver"] },
      { title: "Size", values: ['5"x7"', '11"×14"', '8"x10"', '16"×16"', '12"x12"'] },
    ];
  }
  if (topCategory.slug === "art") {
    return [
      { title: "Subject", values: ["Botanical", "Abstract", "Animal", "Landscape", "Coastal"] },
      { title: "Size", values: ['20"×20"', '24"×30"', '31.5"×31.5"', '22"×24"'] },
    ];
  }
  if (topCategory.slug === "furniture") {
    return [
      { title: "Material", values: ["Engineered Wood", "Metal", "Wood"] },
      { title: "Size", values: ['68"×56"×14.7"', '22"×26.8"', '31.4"×24.4"'] },
    ];
  }
  return [
    { title: "Material", values: ["Wood", "Aluminum", "Cork", "Linen"] },
    { title: "Size", values: ["50×70cm", '18"×24"', "20×28"] },
  ];
}

function SourceCategoryArchiveCard({ item, locale }: { item: SourceCategoryArchiveProduct; locale: Locale }) {
  return (
    <li className="wow fadeInUp">
      <div className="Products1-right-item">
        <i className="list-love botche">
          <SourceCategoryAddCartButton productId={item.sourceId || item.key} productLink={localizePath(locale, item.path)} productName={item.title} productImg={item.imageUrl} productColor={item.colors[0]?.color || ""} />
        </i>
        <Link href={localizePath(locale, item.path)} className="img-box">
          <Image src={item.imageUrl} alt={item.imageAlt} title={item.title} fill className="object-contain" sizes="(min-width: 1024px) 260px, 50vw" />
        </Link>
        <div className={`Products1-right-text ${item.colors.length ? "" : "noheng"}`}>
          <div className="list-color">
            {item.colors.map((color) => (
              <span key={`${item.key}-${color.imageUrl}-${color.color}`} data-url={color.imageUrl} style={{ background: `${color.color} no-repeat center` }} />
            ))}
          </div>
          <Link href={localizePath(locale, item.path)}> {item.title}</Link>
        </div>
      </div>
    </li>
  );
}

function SourceCategoryArchiveView({
  locale,
  category,
  topCategory,
  siblingCategories,
  products,
}: {
  locale: Locale;
  category: ProductCategory;
  topCategory: ProductCategory;
  siblingCategories: ProductCategory[];
  products: Product[];
}) {
  const archiveProducts = sourceCategoryArchiveProducts(category, products);
  const filterGroups = sourceCategoryFilterGroups(topCategory);
  const bestSellerItems = products.slice(0, 4).map((product) => ({
    title: product.title,
    path: product.path,
    imageUrl: sourceCategoryListingSearchImage(product.path) || preferredImage(product) || PRODUCTS_HERO_IMAGE,
    imageAlt: product.imageAlt || product.title,
  }));
  const copy = localizeSourceCopyItems(
    siblingCategories.map((item) => ({
      title: item.title,
      body: item.description || topCategory.description || "",
    })),
    siblingCategories,
    locale,
  );

  return (
    <>
      <ProductCategorySourceHero title={category.title} locale={locale} path={category.path} />

      <section className="Products Products1 intco-source-category-archive">
        <div className="m-width-content">
          <div className="ipd-20">
            <div className="DESC center margin86" aria-hidden="true" />
            <h1 className="sr-only">{category.title}</h1>
            <div className="Products1Content content-product">
              <aside className="Products1-left">
                <div className="wow fadeInUp">
                  <div className="Products1-title">Categories</div>
                  <ul className="Products1-ul">
                    {siblingCategories.map((item) => (
                      <li key={item.slug} className={item.slug === category.slug ? "selectProducts1Li" : ""}>
                        <Link href={localizePath(locale, item.path)}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={localizePath(locale, topCategory.path)} className="selectBtn">
                    View All Products <i className="iconfont icon-jiantou_xiangyou" aria-hidden="true" />
                  </Link>
                </div>
                <div className="wow fadeInUp hc-mrt-box">
                  <div className="Products1-title">Filters</div>
                  <ul className="Products1-2ul">
                    {filterGroups.map((group) => (
                      <li key={group.title}>
                        <div className="Products1-2ul-title">
                          {group.title}
                          <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
                        </div>
                        <ul className="Products1-2ul-child showMore">
                          {group.values.map((value) => (
                            <li key={value}>
                              <input type="radio" id={`${category.slug}-${group.title}-${value}`.replace(/[^a-zA-Z0-9_-]/g, "-")} name={`${category.slug}-${group.title}`} className="myCheckbox" value={value} />
                              <label className="mark" htmlFor={`${category.slug}-${group.title}-${value}`.replace(/[^a-zA-Z0-9_-]/g, "-")}>
                                {value}
                              </label>
                            </li>
                          ))}
                          {group.values.length >= 5 ? <div className="morderBtn">+ Show All</div> : null}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="wow fadeInUp ContactUsBox">
                  <div className="topCircle">
                    <Image src="https://cdn.sanity.io/images/vzcnnept/production/c4d604701c4116717ac6ff1fe7215192e1b4d1b6-130x130.png" alt="" width={70} height={70} />
                  </div>
                  <div className="ContactUs-text">
                    Need Help?
                    <br />
                    Talk to experts
                  </div>
                  <div className="flexContentItem">
                    <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")}>
                      <div className="selectBtn">
                        <i className="iconfont icon-24gf-phoneLoudspeaker" aria-hidden="true" />
                        Contact Us
                      </div>
                    </LeadsCloudChatLink>
                  </div>
                  <div className="point point1" />
                  <div className="point point2" />
                  <div className="point point3" />
                  <div className="point point4" />
                </div>
              </aside>
              <div className="Products1-right">
                <div className="Products1-right-list pright">
                  <ul>{archiveProducts.map((item) => <SourceCategoryArchiveCard key={item.key} item={item} locale={locale} />)}</ul>
                  {archiveProducts.length >= SOURCE_SEARCH_PAGE_SIZE ? (
                    <div className="page-box">
                      <div className="page-inner">
                        <span className="current">1</span>
                        <a className="page larger" href={localizePath(locale, `${category.path}/page/2`)}>
                          2
                        </a>
                        <a className="nextpostslink" rel="next" aria-label="Next page" href={localizePath(locale, `${category.path}/page/2`)}>
                          &gt;
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SourceCategoryBestSellersSection locale={locale} items={bestSellerItems} copy={copy} />

      <ProductContactSection locale={locale} />
    </>
  );
}

function SourceCategoryCollectionCard({
  category,
  locale,
  active,
}: {
  category: ProductCategory;
  locale: Locale;
  active?: boolean;
}) {
  return (
    <Link
      href={localizePath(locale, category.path)}
      className={`group relative block overflow-hidden rounded-[20px] bg-neutral-200 ring-1 transition duration-300 ${
        active ? "ring-[#484653]" : "ring-black/5 hover:ring-[#484653]/30"
      }`}
    >
      <div className="relative aspect-[342/426]">
        <Image src={sourceCategoryCardImage(category)} alt={category.navImageAlt || category.imageAlt || category.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 342px, 100vw" />
      </div>
      <div className={`absolute inset-0 rounded-[20px] bg-black/30 transition duration-300 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <span className="absolute bottom-[31px] left-[34px] -translate-y-2.5 text-2xl font-semibold leading-9 text-white">{category.title}</span>
      </div>
    </Link>
  );
}

function SourceCategoryW3CollectionCard({
  card,
  locale,
  eager = false,
}: {
  card: { title: string; path: string; imageUrl: string };
  locale: Locale;
  eager?: boolean;
}) {
  return (
    <Link href={localizePath(locale, card.path)} className="w-item-box group">
      <div className="img-box">
        <Image
          src={card.imageUrl}
          alt={card.title}
          title={card.title}
          fill
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1600px) 489px, (min-width: 1024px) 31vw, 100vw"
        />
      </div>
      <div className="bottomText">
        <div className="b-text">{card.title}</div>
      </div>
    </Link>
  );
}

type SourceCategoryBestSellerCard = {
  title: string;
  path: string;
  imageUrl: string;
  imageAlt?: string;
};

function SourceCategoryBestSellersSection({
  locale,
  items,
  copy,
}: {
  locale: Locale;
  items: SourceCategoryBestSellerCard[];
  copy: Array<{ title: string; body: string }>;
}) {
  return (
    <section className="Products Products1 Products11 intco-source-category-best-sellers">
      <ProductSourceTitle title={t(locale, "bestSellers")} />
      <div className="m-width-content">
        <div className="ipd-20 margin-project-c BESTSwiperContent">
          <button type="button" aria-label={t(locale, "nextBestSeller")} className="swiper-button-next">
            <span className="source-swiper-arrow source-swiper-arrow-next" aria-hidden="true" />
          </button>
          <button type="button" aria-label={t(locale, "previousBestSeller")} className="swiper-button-prev">
            <span className="source-swiper-arrow source-swiper-arrow-prev" aria-hidden="true" />
          </button>
          <div className="BESTSwiper">
            <div className="swiper gallery-top">
              <div className="swiper-wrapper">
                {items.map((item, index) => (
                  <Link
                    key={item.title}
                    href={localizePath(locale, item.path)}
                    className="wow fadeInUp swiper-slide"
                    data-reveal="source-up"
                    style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
                  >
                    <div className="topImgBox">
                      <div className="img-box">
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt || item.title}
                          title={item.title}
                          fill
                          className="object-contain transition duration-700"
                          sizes="346px"
                        />
                      </div>
                    </div>
                    <div className="bottomText">{item.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="DESC">
            {copy.map((item) => (
              <div key={item.title}>
                <p>
                  <strong>{item.title}</strong>
                </p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCategorySourceDynamicView({
  locale,
  category,
  allCategories,
  products,
}: {
  locale: Locale;
  category: ProductCategory;
  allCategories: ProductCategory[];
  products: Product[];
}) {
  const { topCategory, activeCategory, siblingCategories } = categoryTemplateContext(category, allCategories);
  if (activeCategory && siblingCategories.length) {
    return <SourceCategoryArchiveView locale={locale} category={category} topCategory={topCategory} siblingCategories={siblingCategories} products={products} />;
  }

  const collectionCategories = siblingCategories.length ? siblingCategories : [topCategory];
  const visibleProducts = products.slice(0, 8);

  return (
    <>
      <ProductCategorySourceHero title={category.title} locale={locale} path={category.path} />

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-12 lg:pt-[99px]">
        <div className="mx-auto max-w-[1160px]">
          <ProductSourceTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category.title}</h1>
          <p className="wow fadeInUp mx-auto mb-10 mt-8 max-w-[1120px] text-center text-base leading-7 text-[#363636] lg:mb-[86px] lg:mt-[55px] lg:text-lg lg:leading-[30px]" data-reveal="source-up">
            {sourceCategoryIntro(category, topCategory)}
          </p>
          {collectionCategories.length > 1 ? (
            <div className="mb-8 flex flex-wrap justify-center gap-3 lg:mb-10">
              {collectionCategories.map((item) => {
                const isActive = item.slug === (activeCategory?.slug || category.slug);
                return (
                  <Link
                    key={item.slug}
                    href={localizePath(locale, item.path)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition duration-200 ${
                      isActive ? "border-[#484653] bg-[#484653] text-white" : "border-[#484653]/25 bg-white text-[#484653] hover:border-[#484653] hover:bg-[#484653] hover:text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          ) : null}
          <ul className="grid gap-[34px] md:grid-cols-2 lg:grid-cols-3 lg:gap-x-[67px] lg:gap-y-[68px]">
            {collectionCategories.map((item, index) => (
              <li key={item.slug} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
                <SourceCategoryCollectionCard category={item} locale={locale} active={item.slug === (activeCategory?.slug || category.slug)} />
              </li>
            ))}
          </ul>
          {topCategory.slug !== category.slug ? (
            <div className="mt-10 flex justify-center lg:mt-[68px]">
              <Link href={localizePath(locale, topCategory.path)} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-semibold text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
                {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-12 lg:pt-[99px]">
        <div className="mx-auto max-w-[1300px]">
          <ProductSourceTitle title={t(locale, "bestSellers")} />
          <div className="relative mt-10 px-0 lg:mt-[64px] lg:px-[70px]">
            <ul className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((item, index) => (
                <li key={item.slug} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <Link href={localizePath(locale, item.path)} className="group block text-center">
                    <div className="relative aspect-square rounded-full bg-white">
                      {preferredImage(item) ? <Image src={preferredImage(item)} alt={item.imageAlt || item.title} fill className="object-contain transition duration-700 group-hover:scale-105" sizes="270px" /> : null}
                    </div>
                    <div className="mx-auto mb-10 mt-[39px] max-w-[270px] text-sm font-medium leading-[18px] text-[#484653] lg:mb-[97px]">{item.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto max-w-[1100px] space-y-5 text-base leading-7 text-[#3e3e3e] lg:text-lg lg:leading-[30px]">
            {(activeCategory ? [activeCategory] : collectionCategories).map((item) => (
              <div key={item.slug}>
                <p className="font-semibold text-[#484653]">{item.title}</p>
                <p>{item.description || topCategory.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductContactSection locale={locale} />
    </>
  );
}

function MirrorCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = MIRROR_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = MIRROR_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(MIRROR_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Mirror"} locale={locale} path={category?.path} />

      <section className="Products Products1 Products11 intco-source-category-collection">
        <div className="m-width-content">
          <div className="ipd-20">
          <ProductSourceTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Mirror"}</h1>
      <Image src="https://cdn.sanity.io/images/vzcnnept/production/5df3e4d8db105ece9affc16ab9aa72d315001279-785x440.jpg" alt="" width={1} height={1} className="hidden" />
          <p className="wow fadeInUp mx-auto mb-[86px] mt-[55px] max-w-[1120px] text-center text-lg leading-[30px] text-[#363636] max-lg:mb-10 max-lg:mt-8 max-lg:text-base" data-reveal="source-up">
            {localizedCategoryIntro(category, "Find the perfect mirror at Intco Framing. Explore the latest bathroom solutions at INTCO Framing with our wall mirrors, standing mirrors, and LED mirrors.", locale)}
          </p>
          <div className="product-index-list">
            <div className="w3Box">
              <ul>
                {collectionCards.map((card, index) => (
                  <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
                    <SourceCategoryW3CollectionCard card={card} locale={locale} eager={index < 3} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-[68px] flex justify-center max-lg:mt-10">
            <Link href={sourceCategoryViewAllHref(collectionCards, "/mirror", locale)} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-lg font-semibold text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
          </div>
        </div>
      </section>

      <SourceCategoryBestSellersSection locale={locale} items={bestSellers} copy={copy} />

      <ProductContactSection locale={locale} />
    </>
  );
}

function PictureFrameCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = PICTURE_FRAME_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = PICTURE_FRAME_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(PICTURE_FRAME_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Picture frame"} locale={locale} path={category?.path} />

      <section className="Products Products1 Products11 intco-source-category-collection">
        <div className="m-width-content">
          <div className="ipd-20">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <p className="wow fadeInUp mx-auto mb-0 mt-4 max-w-[1160px] text-center text-base leading-6 text-[#363636] lg:mb-[86px] lg:mt-[55px]" data-reveal="source-up">
            {localizedCategoryIntro(category, "Find the perfect picture frame at Intco Framing. Browse our best sellers, including tabletop frames, wall frames, and poster frames. Everything you want is here.", locale)}
          </p>
          <div className="product-index-list">
            <div className="w3Box">
              <ul>
                {collectionCards.map((card, index) => (
                  <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
                    <PictureFrameCollectionCard card={card} locale={locale} eager={index < 3} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex justify-center lg:mt-[68px]">
            <Link href={sourceCategoryViewAllHref(collectionCards, "/picture-frame", locale)} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
          </div>
        </div>
      </section>

      <SourceCategoryBestSellersSection locale={locale} items={bestSellers} copy={copy} />

      <PictureFrameContactSection locale={locale} />
    </>
  );
}

function PictureFrameSectionTitle({ title }: { title: string }) {
  return (
    <div className="selefTitle intco-product-source-title" data-source-title data-tit={title}>
      <h2 className="title_text" data-source-title-text>
        {title}
      </h2>
    </div>
  );
}

function PictureFrameContactSection({ locale }: { locale: Locale }) {
  return (
    <section id="goinput" className="overflow-hidden bg-[#f3f3f3] bg-cover bg-center pb-0 pt-[50px] lg:pt-[100px]" style={{ backgroundImage: `url(${PRODUCT_CONTACT_BG})` }}>
      <div className="intco-source-container px-5">
        <PictureFrameSectionTitle title={t(locale, "getInTouch")} />
        <div className="ORDERASAMPLEFlex intco-leadscloud-main-form mx-auto mt-12 max-w-[1006px] pb-[77px] lg:mt-[55px]">
          <HubSpotMainInquiryForm locale={locale} />
        </div>
      </div>
    </section>
  );
}

function PictureFrameCollectionCard({
  card,
  locale,
  eager = false,
}: {
  card: (typeof PICTURE_FRAME_COLLECTION_CARDS)[number];
  locale: Locale;
  eager?: boolean;
}) {
  return <SourceCategoryW3CollectionCard card={card} locale={locale} eager={eager} />;
}

function ArtCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = ART_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = ART_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(ART_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Art"} locale={locale} path={category?.path} />

      <section className="Products Products1 Products11 intco-source-category-collection">
        <div className="m-width-content">
          <div className="ipd-20">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Art"}</h1>
          <p className="wow fadeInUp mx-auto mb-10 mt-8 max-w-[1000px] text-center text-base leading-6 text-[#363636] lg:mb-[86px] lg:mt-[55px]" data-reveal="source-up">
            {localizedCategoryIntro(category, "Explore Intco Framing unique art collection. From framed art and canvas art to alternative wall decor, discover our best sellers to suit your style. Shop now!", locale)}
          </p>
          <div className="product-index-list">
            <div className="w3Box">
              <ul>
                {collectionCards.map((card, index) => (
                  <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                    <ArtCollectionCard card={card} locale={locale} eager={index < 3} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex justify-center lg:mt-[68px]">
            <Link href={sourceCategoryViewAllHref(collectionCards, "/art", locale)} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
          </div>
        </div>
      </section>

      <SourceCategoryBestSellersSection locale={locale} items={bestSellers} copy={copy} />

      <PictureFrameContactSection locale={locale} />
    </>
  );
}

function ArtCollectionCard({
  card,
  locale,
  eager = false,
}: {
  card: (typeof ART_COLLECTION_CARDS)[number];
  locale: Locale;
  eager?: boolean;
}) {
  return <SourceCategoryW3CollectionCard card={card} locale={locale} eager={eager} />;
}

function FurnitureCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = FURNITURE_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = FURNITURE_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(FURNITURE_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Furniture"} locale={locale} path={category?.path} />

      <section className="Products Products1 Products11 intco-source-category-collection">
        <div className="m-width-content">
          <div className="ipd-20">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Furniture"}</h1>
          <p className="wow fadeInUp mx-auto mb-10 mt-8 max-w-[1160px] text-center text-base leading-6 text-[#363636] lg:mb-[86px] lg:mt-[55px]" data-reveal="source-up">
            {localizedCategoryIntro(category, "Explore Intco Framing premium furniture collection. From medicine cabinets to shelves, discover our latest home storage solutions. Shop now!", locale)}
          </p>
          <div className="product-index-list">
            <div className="w3Box">
              <ul>
                {collectionCards.map((card, index) => (
                  <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                    <FurnitureCollectionCard card={card} locale={locale} eager={index < 3} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex justify-center lg:mt-[68px]">
            <Link href={sourceCategoryViewAllHref(collectionCards, "/furniture", locale)} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
          <span className="sr-only">{t(locale, "products")}</span>
          </div>
        </div>
      </section>

      <SourceCategoryBestSellersSection locale={locale} items={bestSellers} copy={copy} />

      <PictureFrameContactSection locale={locale} />
    </>
  );
}

function FurnitureCollectionCard({
  card,
  locale,
  eager = false,
}: {
  card: (typeof FURNITURE_COLLECTION_CARDS)[number];
  locale: Locale;
  eager?: boolean;
}) {
  return <SourceCategoryW3CollectionCard card={card} locale={locale} eager={eager} />;
}

function MemoBoardCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = MEMO_BOARD_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = MEMO_BOARD_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(MEMO_BOARD_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Memo Board"} locale={locale} path={category?.path} />

      <section className="Products Products1 Products11 intco-source-category-collection">
        <div className="m-width-content">
          <div className="ipd-20">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Memo Board"}</h1>
          <div className="wow fadeInUp DESC center margin86" data-reveal="source-up" aria-hidden="true" />
          <div className="product-index-list">
            <div className="w3Box">
              <ul>
                {collectionCards.map((card, index) => (
                  <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
                    <MemoBoardCollectionCard card={card} locale={locale} eager={index < 3} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex justify-center lg:mt-0">
            <Link href={sourceCategoryViewAllHref(collectionCards, "/memo-board", locale)} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
          <span className="sr-only">{t(locale, "products")}</span>
          </div>
        </div>
      </section>

      <SourceCategoryBestSellersSection locale={locale} items={bestSellers} copy={copy} />

      <PictureFrameContactSection locale={locale} />
    </>
  );
}

function MemoBoardCollectionCard({
  card,
  locale,
  eager = false,
}: {
  card: (typeof MEMO_BOARD_COLLECTION_CARDS)[number];
  locale: Locale;
  eager?: boolean;
}) {
  return <SourceCategoryW3CollectionCard card={card} locale={locale} eager={eager} />;
}

export function ProductListingView({
  title,
  description,
  products,
  categories,
  allCategories,
  heroImage,
  category,
  locale,
}: {
  title: string;
  description?: string;
  products: Product[];
  categories?: ProductCategory[];
  allCategories?: ProductCategory[];
  heroImage?: string;
  category?: ProductCategory;
  locale: Locale;
}) {
  const sourceCategories = allCategories || categories || [];

  if (category?.slug === "mirror") {
    return <MirrorCategorySourceView locale={locale} category={category} categories={sourceCategories} products={products} />;
  }
  if (category?.slug === "picture-frame") {
    return <PictureFrameCategorySourceView locale={locale} category={category} categories={sourceCategories} products={products} />;
  }
  if (category?.slug === "art") {
    return <ArtCategorySourceView locale={locale} category={category} categories={sourceCategories} products={products} />;
  }
  if (category?.slug === "furniture") {
    return <FurnitureCategorySourceView locale={locale} category={category} categories={sourceCategories} products={products} />;
  }
  if (category?.slug === "memo-board") {
    return <MemoBoardCategorySourceView locale={locale} category={category} categories={sourceCategories} products={products} />;
  }

  if (category) {
    return <ProductCategorySourceDynamicView locale={locale} category={category} allCategories={sourceCategories} products={products} />;
  }

  const bestSellers = products.slice(0, 4);
  return (
    <>
      <PageHero title={title} description={description} imageUrl={heroImage} />
      {categories?.length ? (
        <section className="bg-white py-12">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {categories.map((category, index) => (
              <div key={category.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
                <CategoryCard category={category} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "viewAllProducts")}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{title}</h2>
            <p className="mt-4 text-pretty leading-8 text-neutral-600">
              {description || "Explore INTCO Framing product collections for retail, hospitality, residential and commercial interior programs."}
            </p>
          </div>
          {bestSellers.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal="right">
              {bestSellers.map((product) => (
                <Link key={product.slug} href={localizePath(locale, product.path)} className="group bg-neutral-50 p-3 ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5">
                  <div className="relative aspect-square bg-white">
                    {preferredImage(product) ? <Image src={preferredImage(product)} alt={product.imageAlt || product.title} fill className="object-cover" sizes="180px" /> : null}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-neutral-900">{product.title}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <section className="bg-neutral-100 py-14">
        <SectionTitle eyebrow={t(locale, "bestSellers")} title={products.length ? t(locale, "productCatalog") : t(locale, "product")} description={products.length ? undefined : "No products are currently available for this category."} />
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {products.map((product, index) => (
            <div key={product.slug} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function SolutionsListingView({
  solutions,
  page,
  locale,
}: {
  solutions: Solution[];
  page?: ContentPage;
  products?: Product[];
  projects?: Project[];
  locale: Locale;
}) {
  const href = (path: string) => localizePath(locale, path);
  const localizedServiceItems = SOLUTIONS_SERVICE_ITEMS.map((item) => {
    const solution = solutions.find((entry) => entry.path === item.path);
    return {
      ...item,
      title: solution?.title || solutionTitleFallback(locale, item.path, item.title),
      description: solution?.description || solutionDescriptionFallback(locale, item.path, item.description),
    };
  });
  const relatedLinks = SOLUTIONS_RELATED_LINKS.map((item) => ({
    ...item,
    title: item.path === "/products" ? t(locale, "featuredProductsLabel") : item.path === "/projects" ? t(locale, "latestProjects") : t(locale, "customerService"),
    description: item.path === "/products" ? t(locale, "productCatalogIntroDescription") : item.path === "/projects" ? t(locale, "productLandingProjectDescription") : t(locale, "contactSupportIntro"),
  }));
  return (
    <>
      <SolutionsSourceHero title={page?.title || t(locale, "solutions")} locale={locale} />

      <section className="intco-solutions-intro-section overflow-hidden bg-[#f8f8f8] px-4 py-16 sm:px-6 lg:py-[100px]">
        <div className="intco-source-container px-5">
          <div className="intco-solutions-intro-flex grid gap-12 lg:grid-cols-[1fr_minmax(420px,783px)] lg:gap-[122px]">
            <div className="intco-solutions-intro-left" data-reveal="left">
              <SolutionsSourceTitle title={t(locale, "endToEndHomeDecor")} align="left" />
              <p className="intco-solutions-intro-copy mt-[64px] max-w-[690px]">{locale === "en" ? SOLUTIONS_INTRO_COPY : t(locale, "sourceHomeSolutionsIntro")}</p>
              <div className="mt-[55px]">
                <SolutionsOutlineLink href={href("/who-we-are")} width={254}>
                  {t(locale, "aboutIntco")}
                </SolutionsOutlineLink>
              </div>
            </div>
            <div className="intco-solutions-intro-media relative aspect-[783/504] w-full overflow-hidden" data-reveal="right">
              <Image src={SOLUTIONS_INTRO_IMAGE} alt={t(locale, "endToEndHomeDecor")} fill className="object-cover" sizes="(min-width: 1024px) 783px, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f8f8f8] px-4 py-16 sm:px-6 lg:py-[100px]">
        <div className="intco-source-container px-5">
          <SolutionsSourceTitle title={t(locale, "servicesWeOffer")} />
          <div className="mt-[64px]">
            <SolutionsServicesSection items={localizedServiceItems} locale={locale} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f8f8f8] bg-cover bg-center px-4 pt-16 sm:px-6 lg:pt-[116px]" style={{ backgroundImage: `url(${SOLUTIONS_PROCESS_BG})` }}>
        <div className="intco-source-container px-5">
          <SolutionsSourceTitle title={t(locale, "howItWorks")} />
          <div className="mt-[64px]">
            <SolutionsProcessGrid locale={locale} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 pt-16 sm:px-6 lg:pt-[87px]">
        <div className="intco-source-container px-5">
          <SolutionsSourceTitle title={t(locale, "youMayAlsoLike")} />
        </div>
      </section>
      <section className="relative mb-[55px] mt-[64px] overflow-hidden">
        <div className="relative aspect-[1920/800] min-h-[540px]">
          <Image src={SOLUTIONS_RELATED_BG} alt={t(locale, "youMayAlsoLike")} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 flex flex-col bg-black/30 lg:flex-row">
            {relatedLinks.map((item) => (
              <SolutionsRelatedCard key={item.number} item={item} href={href(item.path)} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <SolutionsContactBand locale={locale} />
    </>
  );
}

function SolutionsSourceHero({
  title,
  locale,
  imageUrl = SOLUTIONS_HERO_IMAGE,
  imageAlt = "Solutions",
  tone = "light",
}: {
  title: string;
  locale: Locale;
  imageUrl?: string;
  imageAlt?: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <section className="relative aspect-[1920/600] min-h-[260px] overflow-hidden">
      <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="100vw" preload unoptimized />
      <div className={`absolute inset-0 ${isDark ? "bg-black/[0.22]" : "bg-white/30"}`} />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center">
        <div className={`intco-source-container px-5 text-center max-lg:text-left ${isDark ? "text-white" : "text-[#484653]"}`}>
          <h1 className={`text-[66px] leading-[80px] max-[1466px]:text-[40px] max-[1466px]:leading-[56px] max-[650px]:text-[26px] max-[650px]:leading-[1.2] ${isDark ? "font-semibold text-white" : "font-bold text-[#333333]"}`}>{title}</h1>
          <div className="flex items-center justify-center gap-3 py-3 text-[26px] font-medium leading-10 max-[1466px]:text-xl max-lg:justify-start max-lg:text-base">
            <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
            <ArrowRight size={18} strokeWidth={1.8} />
            <span>{title}</span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-[30px] max-lg:justify-start max-lg:gap-3">
            <LeadsCloudChatLink
              fallbackHref={localizePath(locale, "/contact#chat")}
              className="inline-flex h-12 w-[232px] items-center justify-center rounded-[29px] border-2 border-[#484653] bg-white text-lg font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white max-lg:w-[142px] max-lg:text-base"
            >
              {t(locale, "chatWithUs")}
            </LeadsCloudChatLink>
            <Link
              href={localizePath(locale, "/products/#goinput")}
              className="inline-flex h-12 w-[232px] items-center justify-center rounded-[29px] border-2 border-[#484653] bg-white text-lg font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white max-lg:w-[142px] max-lg:text-base"
            >
              {t(locale, "leaveMessage")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsSourceTitle({ title, align = "center", wide = false }: { title: string; align?: "left" | "center"; wide?: boolean }) {
  const centered = align === "center";
  return (
    <div className={`intco-solutions-source-title relative uppercase ${centered ? "text-center" : "intco-solutions-source-title-left text-left"}`} data-reveal={centered ? "fade" : "left"}>
      <div
        className={`intco-solutions-source-title-backdrop pointer-events-none absolute top-0 text-[70px] font-semibold leading-none text-transparent opacity-20 [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-[46px] max-[650px]:hidden ${
          centered ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : `left-0 ${wide ? "max-w-[1200px]" : "max-w-[760px]"} -translate-x-5 whitespace-normal`
        }`}
      >
        {title}
      </div>
      <h2
        className={`intco-solutions-source-title-text relative z-10 inline-block border-b border-[#484653] pb-[47px] text-[45px] font-semibold leading-[39px] text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-4xl max-[650px]:text-[28px] ${
          centered ? "" : `${wide ? "max-w-[1200px]" : "max-w-[760px]"} leading-[1.4]`
        }`}
      >
        {title}
        <span className={`absolute bottom-0 h-[5px] w-[65px] translate-y-1/2 bg-[#484653] ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`} />
      </h2>
    </div>
  );
}

function WhoWeAreSourceTitle({ title, align = "center", wide = false }: { title: string; align?: "left" | "center"; wide?: boolean }) {
  const centered = align === "center";
  return (
    <div className={`relative uppercase ${centered ? "text-center" : "text-left"}`} data-reveal={centered ? "fade" : "left"}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 z-[2] text-[70px] font-semibold leading-none text-white opacity-20 [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-[46px] max-[650px]:hidden ${
          centered ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : `left-0 -translate-x-5 whitespace-nowrap ${wide ? "max-w-none" : ""}`
        }`}
      >
        {title}
      </span>
      <h2
        className={`relative z-[3] inline-block w-fit border-b border-[#484653] pb-[47px] text-[45px] font-semibold leading-[39px] text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-4xl max-[650px]:pb-2 max-[650px]:text-xl max-[650px]:leading-[1.3] ${
          centered ? "mx-auto" : `mx-0 ${wide ? "max-w-none max-lg:max-w-full max-lg:whitespace-normal lg:whitespace-nowrap" : "max-w-full"}`
        }`}
      >
        {title}
        <span className={`absolute bottom-0 h-[5px] w-[65px] translate-y-1/2 bg-[#484653] max-[650px]:h-0.5 max-[650px]:w-10 ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`} />
      </h2>
    </div>
  );
}

function SolutionsOutlineLink({ href, children, width = 200 }: { href: string; children: React.ReactNode; width?: number }) {
  return (
    <Link
      href={href}
      className="inline-flex h-[58px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-700 hover:bg-[#484653] hover:text-white"
      style={{ width }}
    >
      {children}
      <ArrowRight className="ml-2" size={22} />
    </Link>
  );
}

function SolutionsProcessGrid({ locale }: { locale: Locale }) {
  const labels = SOLUTIONS_PROCESS_LABELS[locale];
  return (
    <ul className="grid gap-x-[100px] gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
      {SOLUTIONS_PROCESS_STEPS.map((step, index) => (
        <li key={step.label} className="relative flex justify-center" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
          <div className="relative mb-16 w-full max-w-[278px] lg:mb-[140px]">
            <div className="relative aspect-square overflow-hidden rounded-full">
              <Image src={step.imageUrl} alt={labels[index] || step.label} fill className="object-cover transition duration-700 hover:scale-110" sizes="278px" />
            </div>
            <div className="mt-5 text-center text-[22px] font-normal leading-tight text-[#363636] lg:text-[28px]">{labels[index] || step.label}</div>
            {index !== 2 && index !== 5 ? (
              <ArrowRight
                className={`absolute hidden text-[#484653] lg:block ${index === 3 || index === 4 ? "rotate-180" : ""}`}
                size={72}
                strokeWidth={1}
                style={{ right: "-92px", top: "38%" }}
              />
            ) : null}
            {index === 2 ? <ArrowRight className="absolute left-1/2 hidden rotate-90 text-[#484653] lg:block" size={72} strokeWidth={1} style={{ top: "130%", transform: "translateX(-50%) rotate(90deg)" }} /> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function SolutionsRelatedCard({ item, href, locale }: { item: (typeof SOLUTIONS_RELATED_LINKS)[number]; href: string; locale: Locale }) {
  return (
    <div className="group relative min-h-[180px] flex-1 cursor-pointer border-b border-white/85 lg:border-b-0 lg:border-r last:border-r-0" data-reveal>
      <div className="absolute bottom-10 left-8 text-white transition duration-500 group-hover:opacity-0 lg:bottom-[141px]">
        <div className="text-2xl font-semibold leading-[39px]">{item.number}</div>
        <div className="mt-[25px] max-w-[187px] text-[32px] font-semibold leading-tight lg:text-[40px]">{item.title}</div>
      </div>
      <div className="absolute left-1/2 top-1/2 w-[min(406px,calc(100%-48px))] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white px-[49px] pb-8 pt-[70px] opacity-0 shadow-xl transition duration-500 group-hover:opacity-100 max-lg:relative max-lg:left-auto max-lg:top-auto max-lg:mx-6 max-lg:w-auto max-lg:translate-x-0 max-lg:translate-y-0 max-lg:bg-white/90 max-lg:opacity-100 max-lg:shadow-none lg:h-[510px]">
        <div className="text-2xl font-semibold leading-[39px] text-[#3e3e3e]">{item.number}</div>
        <div className="mt-[25px] max-w-[187px] text-[32px] font-semibold leading-tight text-[#3e3e3e] lg:text-[40px]">{item.title}</div>
        <p className="mt-5 max-w-[312px] text-lg leading-7 text-[#363636]">{item.description}</p>
        <div className="mt-[68px] max-lg:mt-6">
          <SolutionsOutlineLink href={href}>{t(locale, "exploreMore")}</SolutionsOutlineLink>
        </div>
      </div>
    </div>
  );
}

function SolutionsContactBand({ locale }: { locale: Locale }) {
  return (
    <section className="relative mb-[55px] bg-cover bg-center px-4 py-16 sm:px-6 lg:py-[98px]" style={{ backgroundImage: `url(${SOLUTIONS_CONTACT_BG})` }}>
      <span className="sr-only">{t(locale, "getInTouch")}</span>
      <div className="intco-source-container rounded-md bg-[rgba(72,70,83,0.8)] px-6 py-12 text-center text-white lg:py-[8vh]" data-reveal="fade">
        <h2 className="text-[32px] font-semibold leading-tight lg:text-[38px] lg:leading-[15px]">{t(locale, "perfectSolution")}</h2>
        <p className="my-8 text-2xl font-normal">{t(locale, "contactToday")}</p>
        <LeadsCloudChatLink
          fallbackHref={localizePath(locale, "/contact#chat")}
          className="mx-auto inline-flex h-[58px] w-[200px] items-center justify-center rounded-[29px] border-2 border-white bg-white text-lg font-medium text-[#484653] transition duration-700 hover:border-[#484653] hover:bg-[#484653] hover:text-white"
        >
          <Phone className="mr-[9px]" size={22} />
          {t(locale, "contactUs")}
        </LeadsCloudChatLink>
      </div>
    </section>
  );
}

function BusinessInsightsHero({ locale, title: customTitle, parentCrumb = false }: { locale: Locale; title?: string; parentCrumb?: boolean }) {
  const parentTitle = pick(BUSINESS_INSIGHTS_PAGE.heroTitle, locale);
  const title = customTitle || parentTitle;
  return (
    <section className="relative aspect-[1920/600] min-h-[260px] overflow-hidden">
      <Image src={BUSINESS_INSIGHTS_HERO_IMAGE} alt={title} fill className="object-cover" sizes="100vw" preload />
      <div className="absolute inset-0 bg-white/30" />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center">
        <div className="intco-source-container px-5 text-center text-[#484653] max-lg:text-left">
          <h1 className="text-[66px] font-semibold leading-[99px] text-[#333333] max-lg:text-[38px] max-lg:leading-tight">{title}</h1>
          <nav className="flex items-center justify-center gap-3 py-3 text-[26px] font-medium leading-10 max-lg:justify-start max-lg:text-base" aria-label="Breadcrumb">
            <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
            <span>›</span>
            <BreadcrumbLink href={localizePath(locale, "/solutions")}>{t(locale, "solutions")}</BreadcrumbLink>
            <span>›</span>
            {parentCrumb ? (
              <>
                <BreadcrumbLink href={localizePath(locale, "/solutions/business-insights-trends")}>{parentTitle}</BreadcrumbLink>
                <span>›</span>
              </>
            ) : null}
            <span>{title}</span>
          </nav>
          <div className="flex flex-wrap justify-center max-lg:justify-start">
            <LeadsCloudChatLink
              fallbackHref={localizePath(locale, "/contact#chat")}
              className="m-[15px] box-content inline-flex h-12 w-[232px] items-center justify-center rounded-[29px] border-2 border-[#484653] bg-white text-lg font-semibold leading-[48px] text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white max-lg:w-[142px] max-lg:text-base"
            >
              {t(locale, "chatWithUs")}
            </LeadsCloudChatLink>
            <Link
              href={localizePath(locale, "/products/#goinput")}
              className="m-[15px] box-content inline-flex h-12 w-[232px] items-center justify-center rounded-[29px] border-2 border-[#484653] bg-white text-lg font-semibold leading-[48px] text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white max-lg:w-[142px] max-lg:text-base"
            >
              {t(locale, "leaveMessage")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessInsightsTitle({
  title,
  align = "center",
  narrow = false,
}: {
  title: string;
  align?: "left" | "center";
  narrow?: boolean;
}) {
  const centered = align === "center";
  return (
    <div className={`relative uppercase ${centered ? "text-center" : "text-left"}`}>
      <div
        className={`pointer-events-none absolute top-0 text-[70px] font-semibold leading-none text-transparent opacity-20 [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-[46px] max-[650px]:hidden ${
          centered ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : `left-0 -translate-x-5 ${narrow ? "max-w-[430px] whitespace-normal leading-[1.08]" : "whitespace-nowrap"}`
        }`}
      >
        {title}
      </div>
      <h2
        className={`relative z-10 inline-block border-b border-[#484653] pb-[47px] text-[45px] font-semibold text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:pb-5 max-[1600px]:text-4xl max-[650px]:pb-4 max-[650px]:text-[26px] ${
          centered ? "leading-[39px]" : `${narrow ? "max-w-[430px] leading-[60px] max-[1600px]:leading-[50px]" : "leading-[39px]"}`
        }`}
      >
        {title}
        <span className={`absolute bottom-0 h-[5px] w-[65px] translate-y-1/2 bg-[#484653] ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`} />
      </h2>
    </div>
  );
}

function BusinessInsightsOutlineLink({ href, children, width = 200 }: { href: string; children: React.ReactNode; width?: number }) {
  return (
    <Link
      href={href}
      className="inline-flex h-[58px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-700 hover:bg-[#484653] hover:text-white"
      style={{ width }}
    >
      {children}
      <ArrowRight className="ml-2" size={22} />
    </Link>
  );
}

function BusinessInsightsSourceView({ locale }: { locale: Locale }) {
  return (
    <>
      <div className="intco-business-insights-page">
        <BusinessInsightsHero locale={locale} />
        <span className="sr-only">{t(locale, "servicesWeProvide")}</span>
        <span className="sr-only">{t(locale, "youMayAlsoLike")}</span>
        <Image src="https://cdn.sanity.io/images/vzcnnept/production/e253ed577fa5ced89e9f9692d88344600dd4b669-487x363.png" alt="" width={1} height={1} className="hidden" />

        <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-10 pt-10 sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.main, locale)} />
          <div className="mt-[58px] grid bg-white lg:h-[660px] lg:grid-cols-[980px_1fr]" data-reveal="fade">
            <div className="relative h-full min-h-[320px] overflow-hidden">
              <Image src={BUSINESS_INSIGHTS_MARKET_IMAGE} alt="BusinessInsights2" fill className="object-cover" sizes="(min-width: 1024px) 61vw, 100vw" />
            </div>
            <div className="box-border px-8 pb-10 pt-10 text-center lg:px-[77px] lg:pb-0 lg:pt-[98px]">
              <div className="relative mx-auto size-[170px] overflow-hidden rounded-full max-lg:size-[120px]">
                <Image src={BUSINESS_INSIGHTS_MARKET_ICON} alt="" fill className="object-cover" sizes="170px" />
              </div>
              <h2 className="mx-auto mb-[42px] mt-[65px] text-2xl font-semibold leading-9 text-[#3e3e3e] max-lg:my-6">{pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.market, locale)}</h2>
              <p className="text-left text-base font-normal leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px]">{pick(BUSINESS_INSIGHTS_PAGE.copy.market, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-[100px] pt-10 sm:px-6 max-lg:py-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid items-start lg:h-[500px] lg:grid-cols-[698px_800px] lg:gap-[102px]">
            <div className="flex flex-col items-start lg:h-[500px]" data-reveal="fade">
              <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.trend, locale)} align="left" />
              <p className="mb-[77px] mt-[58px] max-w-[551px] text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px] max-lg:mb-8">{pick(BUSINESS_INSIGHTS_PAGE.copy.trend, locale)}</p>
              <BusinessInsightsOutlineLink href={localizePath(locale, "/solutions/business-insights-trends/trend")} width={306}>
                {t(locale, "exploreMore")}
              </BusinessInsightsOutlineLink>
            </div>
            <div className="relative overflow-hidden bg-white lg:h-[500px]" data-reveal="fade">
              <div className="flex w-[300%]">
                {BUSINESS_INSIGHTS_TREND_SLIDES.map((slide) => (
                  <Link key={slide.imageUrl} href={localizePath(locale, slide.path)} className="relative block aspect-[800/443] w-1/3 shrink-0 lg:h-[443px]">
                    <Image src={slide.imageUrl} alt="" fill className="object-cover" sizes="800px" />
                  </Link>
                ))}
              </div>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {BUSINESS_INSIGHTS_TREND_SLIDES.map((slide, index) => (
                  <span key={slide.imageUrl} className={`size-2 rounded-full ${index === 0 ? "bg-[#484653]" : "bg-[#bfc0c4]"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 pb-10 pt-10 sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.industryReport, locale)} align="left" />
          <p className="mb-[58px] mt-[58px] text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[27px] max-lg:mb-10">{pick(BUSINESS_INSIGHTS_PAGE.copy.trend, locale)}</p>
          <div className="index-BusinessInsights-list">
            <ul className="-mx-[41px] flex max-md:mx-0 max-md:block">
              {BUSINESS_INSIGHTS_PAGE.reports.map((report, index) => {
                const reportTitle = pick(report.title, locale);
                return (
                  <li key={reportTitle} className="box-border w-1/3 px-[41px] pb-0 max-md:mb-10 max-md:w-full max-md:px-0" data-reveal style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                    <article>
                      <Link href={localizePath(locale, report.path)} className="group block">
                        <div className="relative aspect-[332/257] overflow-hidden bg-neutral-100">
                          <Image src={report.imageUrl} alt={reportTitle} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 479px, 100vw" />
                        </div>
                        <h3 className="mt-[29px] line-clamp-2 h-[3em] text-[26px] font-semibold leading-[1.5] text-[#484653] max-lg:text-xl">{reportTitle}</h3>
                      </Link>
                      <div className="mt-[14px] text-base font-light leading-[39px] text-[#999]">{report.date}</div>
                      <p className="text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[27px]">{pick(report.excerpt, locale)}</p>
                      <div className="mt-[30px] max-lg:mb-10">
                        <BusinessInsightsOutlineLink href={localizePath(locale, report.path)}>{t(locale, "readMore")}</BusinessInsightsOutlineLink>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 pb-10 pt-10 sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid items-start gap-[96px] pb-[101px] lg:grid-cols-[905px_497px] max-lg:gap-8 max-lg:pb-10">
            <div className="relative aspect-[564/368] overflow-hidden" data-reveal="fade">
              <Image src={BUSINESS_INSIGHTS_RECOMMENDATION_IMAGE} alt="BusinessInsights9" fill className="object-cover" sizes="(min-width: 1024px) 905px, 100vw" />
            </div>
            <div data-reveal="fade">
              <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.bestsellers, locale)} align="left" narrow />
              <p className="mt-[58px] max-w-[497px] text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[27px] max-lg:mt-8">{pick(BUSINESS_INSIGHTS_PAGE.copy.recommendation, locale)}</p>
              <div className="mt-[90px] max-lg:mt-8">
                <BusinessInsightsOutlineLink href={localizePath(locale, "/solutions/business-insights-trends/bestsellers")}>{t(locale, "exploreMore")}</BusinessInsightsOutlineLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f8f8f8] px-4 pb-10 pt-10 sm:px-6 max-lg:pb-10">
        <div className="mx-auto max-w-[1600px]">
          <BusinessInsightsTitle title={t(locale, "ourManufacturing")} />
          <p className="mx-auto mb-[58px] mt-[55px] max-w-[1600px] text-center text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[27px] max-lg:mb-10">{t(locale, "sourceManufacturingIntro")}</p>
          <div className="mb-[55px] flex overflow-hidden rounded-md bg-white shadow-[0_2px_27px_0_rgba(114,114,114,0.2)] max-lg:flex-col" data-reveal="fade">
            <div className="w-[58%] overflow-hidden rounded-md max-lg:w-full">
              <LazyVideoEmbed className="aspect-video w-full overflow-hidden bg-black" src={homeProfileVideoSrc(locale)} title={HOME_PROFILE_VIDEO_COPY[locale].playerTitle} />
            </div>
            <div className="flex w-[42%] flex-col justify-center px-[5%] py-10 text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px] max-lg:w-full">
              <p>{t(locale, "sourceManufacturingDescription")}</p>
              <div className="mt-[6vh] text-right max-lg:mt-8 max-lg:text-left">
                <BusinessInsightsOutlineLink href={localizePath(locale, "/solutions/manufacturing-delivery")}>{t(locale, "exploreMore")}</BusinessInsightsOutlineLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SolutionsContactBand locale={locale} />
      </div>
    </>
  );
}

function BusinessInsightsTrendReportView({ locale, report }: { locale: Locale; report: (typeof BUSINESS_INSIGHTS_TREND_REPORTS)[number] }) {
  const copy = BUSINESS_INSIGHTS_TREND_REPORT_COPY[locale];
  const reportTitle = localizedBusinessInsightsTrendReportTitle(locale, report);
  return (
    <div className="intco-business-insights-page">
      <BusinessInsightsHero locale={locale} title={reportTitle} parentCrumb />
      <section className="overflow-hidden bg-[#f8f8f8] px-4 pb-[100px] pt-[58px] sm:px-6">
        <div className="mx-auto max-w-[1160px]">
          <BusinessInsightsTitle title={copy.downloadTitle} align="left" />
          <p className="mt-[58px] max-w-[970px] text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px]">
            {copy.intro}
          </p>
          <div className="intco-business-trend-report-message">
            <div className="intco-business-trend-report-grid">
              <div className="intco-business-trend-report-form intco-hubspot-localized-form" data-reveal="fade">
                <HubSpotCatalogDownloadForm locale={locale} catalogName={reportTitle} catalogUrl={report.pdfUrl} downloadOnSuccess />
              </div>
              <div className="intco-business-trend-report-cover" data-reveal="fade">
                <a href={report.pdfUrl} className="group block" aria-label={`${copy.downloadAria}: ${reportTitle}`}>
                  <span className="relative block aspect-[500/422] overflow-hidden bg-white">
                    <Image src={report.coverUrl} alt={reportTitle} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 500px, 100vw" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BusinessInsightsBestsellersView({ locale }: { locale: Locale }) {
  return (
    <div className="intco-business-insights-page">
      <BusinessInsightsHero locale={locale} title={BUSINESS_INSIGHTS_BESTSELLER_LABELS[locale].heroTitle} parentCrumb />
      {BUSINESS_INSIGHTS_BESTSELLER_GROUPS.map((group, groupIndex) => {
        const groupTitle = localizedBusinessInsightsBestsellerGroupTitle(locale, group.title);
        return (
          <section key={groupTitle} className="intco-business-bestseller-section overflow-hidden pb-10 pt-10">
            <div className="intco-business-bestseller-container">
              <BusinessInsightsTitle title={groupTitle} />
              <div className="intco-business-bestseller-stage">
                <button type="button" aria-label={t(locale, "previousBestSeller")} className="intco-business-bestseller-arrow intco-business-bestseller-arrow-prev">
                  <span className="source-swiper-arrow source-swiper-arrow-prev" aria-hidden="true" />
                </button>
                <button type="button" aria-label={t(locale, "nextBestSeller")} className="intco-business-bestseller-arrow intco-business-bestseller-arrow-next">
                  <span className="source-swiper-arrow source-swiper-arrow-next" aria-hidden="true" />
                </button>
                <div className="intco-business-bestseller-grid">
                  {group.products.map((product, index) => {
                    const productTitle = localizedBusinessInsightsBestsellerProductTitle(locale, product);
                    return (
                      <Link
                        key={product.path}
                        href={localizePath(locale, product.path)}
                        className="intco-business-bestseller-card group"
                        data-reveal
                        style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
                      >
                        <span className="intco-business-bestseller-image">
                          <Image src={product.imageUrl} alt={productTitle} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 334px, 85vw" />
                        </span>
                        <span className="intco-business-bestseller-name">
                          {productTitle}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}
      <ProductContactSection locale={locale} />
    </div>
  );
}

export function BusinessInsightsChildView({ path, locale }: { path: string; locale: Locale }) {
  const report = BUSINESS_INSIGHTS_TREND_REPORTS.find((item) => item.path === path);
  if (report) {
    return <BusinessInsightsTrendReportView locale={locale} report={report} />;
  }
  if (path === "/solutions/business-insights-trends/bestsellers") {
    return <BusinessInsightsBestsellersView locale={locale} />;
  }
  return null;
}

function DesignEngineeringSourceView({ locale }: { locale: Locale }) {
  return (
    <div className="intco-design-source-page">
      <DesignEngineeringHero locale={locale} />
      <section className="bg-white pb-10 pt-10">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <div className="mb-[55px]">
            <ProjectsSourceTitle title={pick(SECTION_TITLES.ourExpertise, locale)} backdrop={pick(SECTION_TITLES.ourExpertise, locale)} />
          </div>
          <p className="intco-design-desc mb-[58px]" data-reveal="up">
            {pick(DESIGN_ENGINEERING_PAGE.copy.intro, locale)}
          </p>
          <div className="intco-design-main-image" data-reveal="up">
            <Image src={DESIGN_ENGINEERING_MAIN_IMAGE} alt="shutterstock4" fill className="object-cover" sizes="(min-width: 1601px) 1600px, 100vw" />
          </div>
          <div className="intco-design-child-title">{pick(DESIGN_ENGINEERING_PAGE.sectionTitles.productDesign, locale)}</div>
          <p className="intco-design-desc mt-10" data-reveal="up">
            {pick(DESIGN_ENGINEERING_PAGE.copy.productDesignDescription, locale)}
          </p>
          <ul className="intco-design-product-list">
            {DESIGN_ENGINEERING_PAGE.productRows.map((item, index) => (
              <li key={item.imageAlt} data-reveal="up">
                <DesignEngineeringProductRow item={item} reverse={Boolean(item.reverse)} index={index} locale={locale} />
              </li>
            ))}
          </ul>
          <div className="intco-design-feature-grid">
            {DESIGN_ENGINEERING_PAGE.features.map((item, index) => (
              <DesignEngineeringFeatureCard key={item.imageAlt} item={item} index={index} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <LatestCollectionBlock locale={locale} />
      <OurManufacturingBlock locale={locale} variant="design" />
      <ProjectsSourceContactBand locale={locale} />
    </div>
  );
}

function DesignEngineeringHero({ locale }: { locale: Locale }) {
  const title = pick(DESIGN_ENGINEERING_PAGE.heroTitle, locale);
  return (
    <section className="intco-design-hero">
      <Image src={DESIGN_ENGINEERING_HERO_IMAGE} alt="shutterstock3" fill className="object-cover" sizes="100vw" preload unoptimized />
      <div className="absolute inset-0 bg-white/30" />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center">
        <div className="intco-source-container intco-design-hero-inner px-5 text-center text-[#484653] max-lg:text-left">
          <h1 className="intco-design-hero-title">{title}</h1>
          <nav className="flex flex-wrap items-center justify-center gap-3 py-3 text-sm font-medium leading-[19px] text-[#484653] max-lg:justify-start max-lg:py-0 lg:text-[26px] lg:leading-10" aria-label="Breadcrumb">
            <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
            <ArrowRight size={18} strokeWidth={1.8} />
            <BreadcrumbLink href={localizePath(locale, "/solutions")}>{t(locale, "solutions")}</BreadcrumbLink>
            <ArrowRight size={18} strokeWidth={1.8} />
            <span>{title}</span>
          </nav>
          <div className="mt-[17px] flex flex-nowrap justify-center gap-[30px] max-lg:justify-start max-lg:gap-3">
            <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")} className="intco-design-hero-button">
              {t(locale, "chatWithUs")}
            </LeadsCloudChatLink>
            <Link href={localizePath(locale, "/products/#goinput")} className="intco-design-hero-button">
              {t(locale, "leaveMessage")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesignEngineeringProductRow({
  item,
  reverse,
  index,
  locale,
}: {
  item: (typeof DESIGN_ENGINEERING_PAGE.productRows)[number];
  reverse: boolean;
  index: number;
  locale: Locale;
}) {
  const copy = (
    <div className="intco-design-row-copy" data-reveal={reverse ? "down" : "up"} style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
      <h3>
        {pick(item.title, locale)}
        <span />
      </h3>
      <p>{pick(item.body, locale)}</p>
    </div>
  );
  const image = (
    <div className="intco-design-row-image" data-reveal={reverse ? "up" : "down"} style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
      <Image src={item.imageUrl} alt={pick(item.title, locale)} fill className="object-cover transition duration-700 hover:scale-105" sizes="(min-width: 1601px) 660px, 100vw" />
    </div>
  );

  return (
    <div className="intco-design-product-row">
      {reverse ? (
        <>
          {image}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {image}
        </>
      )}
    </div>
  );
}

function DesignEngineeringFeatureCard({
  item,
  index,
  locale,
}: {
  item: (typeof DESIGN_ENGINEERING_PAGE.features)[number];
  index: number;
  locale: Locale;
}) {
  return (
    <div className="intco-design-feature-card" data-reveal="up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
      <Image src={item.imageUrl} alt={pick(item.title, locale)} fill className="object-cover transition duration-700 hover:scale-110" sizes="(min-width: 1601px) 346px, 50vw" />
      <div>{pick(item.title, locale)}</div>
    </div>
  );
}

function DesignEngineeringLatestCard({
  item,
  locale,
  variant,
  index,
  reveal = "up",
}: {
  item: (typeof LATEST_PRIMARY_CARDS)[number];
  locale: Locale;
  variant: "primary" | "secondary";
  index: number;
  reveal?: "up" | "fade";
}) {
  return (
    <Link href={localizePath(locale, item.path)} className={`intco-design-latest-card ${variant === "primary" ? "intco-design-latest-card-primary" : "intco-design-latest-card-secondary"}`} data-reveal={reveal} style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
      <Image src={item.imageUrl} alt="" fill className="object-cover transition duration-500 hover:scale-105" sizes={variant === "primary" ? "(min-width: 1601px) 780px, 100vw" : "(min-width: 1601px) 510px, 100vw"} />
      <span>
        <strong>{pick(item.title, locale)}</strong>
      </span>
    </Link>
  );
}

function DesignEngineeringProjectCard({
  item,
  locale,
  index,
}: {
  item: (typeof PROJECT_CARDS)[number];
  locale: Locale;
  index: number;
}) {
  return (
    <Link href={localizePath(locale, item.path)} className="intco-design-project-card" data-reveal="fade" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
      <Image src={item.imageUrl} alt="" fill className="object-cover transition duration-500 hover:scale-105" sizes="(min-width: 1601px) 780px, 100vw" />
      <span>
        <em>{pick(item.eyebrow, locale)}</em>
        <strong>{pick(item.title, locale)}</strong>
        <i />
      </span>
    </Link>
  );
}

// Shared "Latest Collection" block, used by 4 source views (Design / Manufacturing / Retailer / Certification / Global)
function LatestCollectionBlock({ locale }: { locale: Locale }) {
  return (
    <section className="bg-white pb-10 pt-10 lg:py-[40px]">
      <div className="intco-source-container px-5 min-[1601px]:px-0">
        <div className="mb-[55px]">
          <ProjectsSourceTitle title={t(locale, "latestCollection")} backdrop={t(locale, "latestCollection")} />
        </div>
        <p className="intco-design-desc mb-[58px]">
          {t(locale, "productLandingIntroTitle")} {t(locale, "productLandingIntroDescription")}
        </p>
        <div className="intco-design-latest-grid intco-design-latest-primary">
          {LATEST_PRIMARY_CARDS.map((item, index) => (
            <DesignEngineeringLatestCard key={item.path} item={item} locale={locale} variant="primary" index={index} reveal="fade" />
          ))}
        </div>
        <div className="intco-design-latest-grid intco-design-latest-secondary">
          {LATEST_SECONDARY_CARDS.map((item, index) => (
            <DesignEngineeringLatestCard key={item.path} item={item} locale={locale} variant="secondary" index={index} reveal="fade" />
          ))}
        </div>
        <div className="intco-design-latest-grid intco-design-latest-primary">
          {PROJECT_CARDS.map((item, index) => (
            <DesignEngineeringProjectCard key={item.path} item={item} locale={locale} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Shared "Our Manufacturing" block with embedded YouTube + Explore More
function OurManufacturingBlock({ locale, variant = "default" }: { locale: Locale; variant?: "default" | "design" }) {
  return (
    <section className={`bg-white py-10 ${variant === "design" ? "pb-[95px]" : "lg:pb-[96px] lg:pt-[40px]"}`}>
      <div className="intco-source-container px-5 min-[1601px]:px-0">
        <div className="mb-[55px]">
          <ProjectsSourceTitle title={t(locale, "ourManufacturing")} backdrop={t(locale, "ourManufacturing")} />
        </div>
        <p className="intco-design-desc mb-[58px]">
          {t(locale, "sourceManufacturingIntro")}
        </p>
        <div className="intco-design-manufacturing" data-reveal="fade">
          <div className="intco-design-video">
            <LazyVideoEmbed className="absolute inset-0" src={homeProfileVideoSrc(locale)} title={HOME_PROFILE_VIDEO_COPY[locale].playerTitle} />
          </div>
          <div className="intco-design-manufacturing-copy">
            <p>{t(locale, "sourceManufacturingDescription")}</p>
            <div className="intco-design-explore-wrap">
              <Link href={localizePath(locale, "/solutions/business-insights-trends")} className="intco-design-explore">
                {t(locale, "exploreMore")} <ArrowRight className="ml-2" size={22} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManufacturingDeliverySourceView({ locale }: { locale: Locale }) {
  return (
    <div className="intco-md-page">
      <ManufacturingDeliveryHero locale={locale} />

      <section className="intco-md-section intco-md-section-production">
        <div className="intco-source-container">
          <ManufacturingDeliveryRow item={MANUFACTURING_DELIVERY_PAGE.rows[0]} variant="production" index={0} locale={locale} />
        </div>
        <div className="intco-md-bottom-bg" aria-hidden="true" />
      </section>

      <section className="intco-md-section intco-md-section-digital">
        <div className="intco-source-container">
          <ManufacturingDeliveryRow item={MANUFACTURING_DELIVERY_PAGE.rows[1]} variant="digital" index={1} locale={locale} />
        </div>
        <div className="intco-md-image-bg" aria-hidden="true" />
        <div className="intco-md-left-bg" aria-hidden="true" />
        <div className="intco-md-top-strip" aria-hidden="true" />
      </section>

      <section className="intco-md-section intco-md-section-automation">
        <div className="intco-source-container">
          <ManufacturingDeliveryRow item={MANUFACTURING_DELIVERY_PAGE.rows[2]} variant="automation" index={2} locale={locale} />
        </div>
      </section>

      <section className="intco-md-section intco-md-section-flexible">
        <div className="intco-source-container">
          <ManufacturingDeliveryRow item={MANUFACTURING_DELIVERY_PAGE.rows[3]} variant="flexible" index={3} locale={locale} />
        </div>
      </section>

      <section className="intco-md-section intco-md-section-quality">
        <div className="intco-source-container">
          <ManufacturingDeliveryRow item={MANUFACTURING_DELIVERY_PAGE.rows[4]} variant="quality" index={4} locale={locale} />
        </div>
      </section>

      <section className="intco-md-section intco-md-section-packaging">
        <div className="intco-source-container">
          <div className="intco-md-packaging-images">
            {MANUFACTURING_PACKAGING_IMAGES.map((item, index) => (
              <div key={item.imageUrl} className="intco-md-packaging-image" data-reveal="fade" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                <div className="intco-md-image-box">
                  <Image src={item.imageUrl} alt={item.imageAlt} fill className="object-cover" sizes={index === 0 ? "(min-width: 1601px) 765px, 100vw" : "(min-width: 1601px) 617px, 100vw"} />
                </div>
              </div>
            ))}
          </div>
          <div className="intco-md-packaging-row">
            <div className="intco-md-packaging-copy">
              <ManufacturingDeliveryTitle title={pick(MANUFACTURING_DELIVERY_PAGE.sectionTitles.packaging, locale)} compact />
              <div>{pick(MANUFACTURING_DELIVERY_PAGE.packagingCopy, locale)}</div>
            </div>
            <div className="intco-md-packaging-spacer" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="intco-md-down-section">
        <div className="intco-md-down-image" data-reveal="fade">
          <Image src={MANUFACTURING_DELIVERY_DOWN_IMAGE} alt="down" fill className="object-cover" sizes="100vw" />
        </div>
      </section>

      <section className="intco-md-delivery-section">
        <div className="intco-source-container">
          <ProjectsSourceTitle title={pick(MANUFACTURING_DELIVERY_PAGE.sectionTitles.delivery, locale)} backdrop={pick(MANUFACTURING_DELIVERY_PAGE.sectionTitles.delivery, locale)} />
          <p className="intco-md-delivery-copy">{pick(MANUFACTURING_DELIVERY_PAGE.deliveryCopy, locale)}</p>
          <div className="intco-md-delivery-border" aria-hidden="true" />
        </div>
      </section>

      <LatestCollectionBlock locale={locale} />
      <OurManufacturingBlock locale={locale} />
      <ProjectsSourceContactBand locale={locale} />
    </div>
  );
}

function ManufacturingDeliveryHero({ locale }: { locale: Locale }) {
  const title = pick(MANUFACTURING_DELIVERY_PAGE.heroTitle, locale);
  return (
    <section className="intco-design-hero">
      <Image src={MANUFACTURING_DELIVERY_HERO_IMAGE} alt="ManufacturingBg" fill className="object-cover" sizes="100vw" preload unoptimized />
      <div className="absolute inset-0 bg-white/30" />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center">
        <div className="intco-source-container intco-design-hero-inner px-5 text-center text-[#484653] max-lg:text-left">
          <h1 className="intco-design-hero-title">{title}</h1>
          <nav className="flex flex-wrap items-center justify-center gap-3 py-3 text-sm font-medium leading-[19px] text-[#484653] max-lg:justify-start max-lg:py-0 lg:text-[26px] lg:leading-10" aria-label="Breadcrumb">
            <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
            <ArrowRight size={18} strokeWidth={1.8} />
            <BreadcrumbLink href={localizePath(locale, "/solutions")}>{t(locale, "solutions")}</BreadcrumbLink>
            <ArrowRight size={18} strokeWidth={1.8} />
            <span>{title}</span>
          </nav>
          <div className="mt-[17px] flex flex-nowrap justify-center gap-[30px] max-lg:justify-start max-lg:gap-3">
            <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")} className="intco-design-hero-button">
              {t(locale, "chatWithUs")}
            </LeadsCloudChatLink>
            <Link href={localizePath(locale, "/products/#goinput")} className="intco-design-hero-button">
              {t(locale, "leaveMessage")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManufacturingDeliveryRow({
  item,
  variant,
  index,
  locale,
}: {
  item: (typeof MANUFACTURING_DELIVERY_PAGE.rows)[number];
  variant: "production" | "digital" | "automation" | "flexible" | "quality";
  index: number;
  locale: Locale;
}) {
  const copy = (
    <div className="intco-md-row-copy" data-reveal={variant === "digital" || variant === "flexible" ? "up" : "down"} style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
      <ManufacturingDeliveryTitle title={pick(item.title, locale)} />
      <div className="intco-md-row-text">{pick(item.body, locale)}</div>
    </div>
  );
  const image = (
    <div className="intco-md-row-image" data-reveal={variant === "digital" || variant === "flexible" ? "down" : "up"} style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
      <div className="intco-md-image-box">
        <Image src={item.imageUrl} alt={item.imageAlt} fill className="object-cover" sizes="(min-width: 1601px) 954px, 100vw" />
      </div>
    </div>
  );

  return (
    <div className={`intco-md-row intco-md-row-${variant}`}>
      {variant === "digital" || variant === "flexible" ? (
        <>
          {copy}
          {image}
        </>
      ) : (
        <>
          {image}
          {copy}
        </>
      )}
      {variant === "automation" ? <div className="intco-md-automation-square" aria-hidden="true" /> : null}
      {variant === "quality" ? <div className="intco-md-quality-bg" aria-hidden="true" /> : null}
    </div>
  );
}

function ManufacturingDeliveryTitle({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <div className={`intco-md-title ${compact ? "intco-md-title-compact" : ""}`}>
      <div className="intco-md-title-text">{title}</div>
    </div>
  );
}

function RetailerSupportSourceView({ locale }: { locale: Locale }) {
  return (
    <div className="intco-retailer-page">
      <RetailerSupportHero locale={locale} />

      <section className="intco-retailer-customer-section">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <div className="intco-retailer-title-wrap">
            <ProjectsSourceTitle title={pick(RETAILER_SUPPORT_PAGE.sectionTitles.customerService, locale)} backdrop={pick(RETAILER_SUPPORT_PAGE.sectionTitles.customerService, locale)} />
          </div>
          <p className="intco-retailer-desc intco-retailer-desc-center" data-reveal="fade">
            {pick(RETAILER_SUPPORT_PAGE.customerCopy, locale)}
          </p>
          <div className="intco-retailer-turn-row">
            <div className="intco-retailer-turn-copy" data-reveal="up">
              <h2>{pick(RETAILER_SUPPORT_PAGE.sectionTitles.turnKey, locale)}</h2>
              <p>{pick(RETAILER_SUPPORT_PAGE.turnCopy, locale)}</p>
            </div>
            <div className="intco-retailer-turn-image-wrap" data-reveal="down">
              <div className="intco-retailer-turn-image">
                <Image src={RETAILER_SUPPORT_TURN_IMAGE} alt="RetailerSupport11" fill className="object-cover" sizes="(min-width: 1601px) 730px, (min-width: 1024px) 53vw, 100vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="intco-retailer-global-section">
        <div className="intco-retailer-global-layout" style={{ "--retailer-global-decor": `url(${RETAILER_SUPPORT_GLOBAL_DECOR})` } as React.CSSProperties}>
          <div className="intco-retailer-global-left">
            <div className="intco-retailer-global-swiper" data-reveal="up">
              <span className="intco-retailer-swiper-arrow intco-retailer-swiper-arrow-prev" aria-hidden="true">
                ‹
              </span>
              <span className="intco-retailer-swiper-arrow intco-retailer-swiper-arrow-next" aria-hidden="true">
                ›
              </span>
              <div className="intco-retailer-global-track">
                {RETAILER_SUPPORT_GLOBAL_IMAGES.map((imageUrl) => (
                  <div key={imageUrl} className="intco-retailer-global-slide">
                    <Image src={imageUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 62vw, 100vw" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="intco-retailer-global-copy" data-reveal="down">
            <h2>{pick(RETAILER_SUPPORT_PAGE.sectionTitles.globalSupply, locale)}</h2>
            <p>{pick(RETAILER_SUPPORT_PAGE.globalCopy, locale)}</p>
          </div>
          <div className="intco-retailer-global-decor" aria-hidden="true">
            <Image src={RETAILER_SUPPORT_GLOBAL_DECOR} alt="" fill className="object-contain" sizes="(min-width: 1024px) 861px, 100vw" />
          </div>
        </div>
      </section>

      <section className="intco-retailer-card-section">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <ul className="intco-retailer-card-list">
            <li>
              <RetailerSupportOverlayCard
                title={pick(RETAILER_SUPPORT_PAGE.sectionTitles.distribution, locale)}
                body={pick(RETAILER_SUPPORT_PAGE.distributionCopy, locale)}
                imageUrl={RETAILER_SUPPORT_DISTRIBUTION_IMAGE}
                imageAlt="RetailerSuppor5"
                imageFirst
              />
            </li>
            <li>
              <RetailerSupportOverlayCard
                title={pick(RETAILER_SUPPORT_PAGE.sectionTitles.marketing, locale)}
                body={
                  <>
                    {pick(RETAILER_SUPPORT_PAGE.marketingCopyBefore, locale)}{" "}
                    <a href="https://www.intco-framing.com/framing-studio/" target="_blank" rel="noopener noreferrer">
                      {pick(RETAILER_SUPPORT_PAGE.marketingLinkLabel, locale)}
                    </a>{" "}
                    {pick(RETAILER_SUPPORT_PAGE.marketingCopyAfter, locale)}
                  </>
                }
                imageUrl={RETAILER_SUPPORT_MARKETING_IMAGE}
                imageAlt="RetailerSuppor6"
                variant="reverse"
              />
            </li>
            <li>
              <div className="intco-retailer-service-row">
                <div className="intco-retailer-service-image" data-reveal="up">
                  <div className="intco-retailer-service-image-box">
                    <Image src={RETAILER_SUPPORT_SERVICE_IMAGE} alt="" fill className="object-cover" sizes="(min-width: 1601px) 930px, (min-width: 1024px) 55vw, 100vw" />
                  </div>
                </div>
                <div className="intco-retailer-service-copy" data-reveal="down">
                  <p>{pick(RETAILER_SUPPORT_PAGE.serviceCopy, locale)}</p>
                  <ul className="intco-retailer-contact-list">
                    <li data-reveal="up">
                      <span className="intco-retailer-contact-icon">
                        <Phone size={36} strokeWidth={1.8} />
                      </span>
                      <p>
                        {t(locale, "telephone")} {RETAILER_SUPPORT_PAGE.contact.telephoneNumber.split(" ")[0]}
                        <br />
                        {RETAILER_SUPPORT_PAGE.contact.telephoneNumber.split(" ")[1]}
                      </p>
                      <a href={RETAILER_SUPPORT_PAGE.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        {t(locale, "callNow")}
                      </a>
                    </li>
                    <li data-reveal="up">
                      <span className="intco-retailer-contact-icon">
                        <Headphones size={36} strokeWidth={1.8} />
                      </span>
                      <p>{t(locale, "liveChat")}</p>
                      <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")}>{t(locale, "contactNow")}</LeadsCloudChatLink>
                    </li>
                    <li data-reveal="up">
                      <span className="intco-retailer-contact-icon">
                        <Mail size={36} strokeWidth={1.8} />
                      </span>
                      <p>
                        {t(locale, "sendEmail")}
                        <br />
                        {RETAILER_SUPPORT_PAGE.contact.email}
                      </p>
                      <a href={`mailto:${RETAILER_SUPPORT_PAGE.contact.email}`}>{t(locale, "emailUs")}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <LatestCollectionBlock locale={locale} />
      <OurManufacturingBlock locale={locale} />
      <ProjectsSourceContactBand locale={locale} />
    </div>
  );
}

function RetailerSupportOverlayCard({
  title,
  body,
  imageUrl,
  imageAlt,
  imageFirst = false,
  variant = "default",
}: {
  title: string;
  body: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  imageFirst?: boolean;
  variant?: "default" | "reverse";
}) {
  const image = (
    <div className="intco-retailer-overlay-image" data-reveal={variant === "reverse" ? "down" : "up"}>
      <div className="intco-retailer-overlay-image-box">
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="(min-width: 1601px) 760px, (min-width: 1024px) 50vw, 100vw" />
      </div>
    </div>
  );
  const content = (
    <div className="intco-retailer-overlay-content" data-reveal={variant === "reverse" ? "up" : "down"}>
      <div className="intco-retailer-overlay-card">
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </div>
  );

  return (
    <div className={`intco-retailer-overlay-row ${variant === "reverse" ? "intco-retailer-overlay-row-reverse" : ""}`}>
      {imageFirst ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </div>
  );
}

function RetailerSupportHero({ locale }: { locale: Locale }) {
  const title = pick(RETAILER_SUPPORT_PAGE.heroTitle, locale);
  return (
    <section className="intco-source-hero intco-source-hero-category intco-retailer-hero" data-source-hero>
      <div className="intco-source-hero-slide" data-source-hero-slide>
        <div className="intco-source-hero-bg" data-source-hero-bg>
          <Image src={RETAILER_SUPPORT_HERO_IMAGE} alt={title} fill className="object-cover" sizes="100vw" preload unoptimized />
        </div>
        <div className="intco-source-hero-content" data-source-hero-content>
          <div className="intco-source-container intco-source-hero-inner px-5 min-[1601px]:px-0">
            <div className="intco-source-hero-text" data-source-hero-text>
              <h1 className="intco-source-hero-title" data-source-hero-title>
                {title}
              </h1>
              <nav className="intco-source-hero-crumbs" data-source-hero-crumbs aria-label="Breadcrumb">
                <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                <BreadcrumbLink href={localizePath(locale, "/solutions")}>{t(locale, "solutions")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                <span>{title}</span>
              </nav>
            </div>
            <div className="intco-source-hero-actions" data-source-hero-actions>
              <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")} data-source-hero-cta>
                {t(locale, "chatWithUs")}
              </LeadsCloudChatLink>
              <a href={localizePath(locale, "/products/#goinput")} data-source-hero-cta>
                {t(locale, "leaveMessage")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificationSourceView({ locale }: { locale: Locale }) {
  return (
    <div className="intco-certification-page">
      <CertificationHero locale={locale} />

      <section className="intco-certification-section" style={{ "--certification-bg": `url(${CERTIFICATION_BG_IMAGE})` } as React.CSSProperties}>
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <div className="intco-certification-title-wrap">
            <ProjectsSourceTitle title={pick(CERTIFICATION_PAGE.sectionTitle, locale)} backdrop={pick(CERTIFICATION_PAGE.sectionTitle, locale)} />
          </div>
          <p className="intco-certification-desc" data-reveal="fade">
            {pick(CERTIFICATION_PAGE.copy, locale)}
          </p>
          <ul className="intco-certification-grid">
            {CERTIFICATION_GRID_IMAGES.map((imageUrl, index) => (
              <li key={imageUrl} data-reveal="up" style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <div className="intco-certification-card">
                  <div className="intco-certification-grid-image">
                    <Image src={imageUrl} alt="" fill className="object-cover" sizes="(min-width: 1601px) 320px, (min-width: 1024px) 25vw, 50vw" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="intco-certification-swiper-wrap">
            <span className="intco-certification-arrow intco-certification-arrow-prev" aria-hidden="true">
              ‹
            </span>
            <span className="intco-certification-arrow intco-certification-arrow-next" aria-hidden="true">
              ›
            </span>
            <div className="intco-certification-swiper-grid">
              {CERTIFICATION_SWIPER_IMAGES.map((imageUrl, index) => (
                <div key={imageUrl} className="intco-certification-swiper-slide" data-reveal="up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <div className="intco-certification-swiper-image">
                    <Image src={imageUrl} alt="" fill className="object-contain" sizes="(min-width: 1601px) 250px, (min-width: 1024px) 20vw, 50vw" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LatestCollectionBlock locale={locale} />
      <OurManufacturingBlock locale={locale} />
      <ProjectsSourceContactBand locale={locale} />
    </div>
  );
}

function CertificationHero({ locale }: { locale: Locale }) {
  const title = pick(CERTIFICATION_PAGE.heroTitle, locale);
  return (
    <section className="intco-source-hero intco-source-hero-category" data-source-hero>
      <div className="intco-source-hero-slide" data-source-hero-slide>
        <div className="intco-source-hero-bg" data-source-hero-bg>
          <Image src={CERTIFICATION_HERO_IMAGE} alt={title} fill className="object-cover" sizes="100vw" preload unoptimized />
        </div>
        <div className="intco-source-hero-content" data-source-hero-content>
          <div className="intco-source-container intco-source-hero-inner px-5 min-[1601px]:px-0">
            <div className="intco-source-hero-text" data-source-hero-text>
              <h1 className="intco-source-hero-title" data-source-hero-title>
                {title}
              </h1>
              <nav className="intco-source-hero-crumbs" data-source-hero-crumbs aria-label="Breadcrumb">
                <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                <BreadcrumbLink href={localizePath(locale, "/solutions")}>{t(locale, "solutions")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                <span>{title}</span>
              </nav>
            </div>
            <div className="intco-source-hero-actions" data-source-hero-actions>
              <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")} data-source-hero-cta>
                {t(locale, "chatWithUs")}
              </LeadsCloudChatLink>
              <a href={localizePath(locale, "/products/#goinput")} data-source-hero-cta>
                {t(locale, "leaveMessage")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GlobalProductionSupplySourceView({ locale }: { locale: Locale }) {
  return (
    <div className="intco-global-production-page">
      <GlobalProductionHero locale={locale} />

      <section className="intco-global-production-card-section">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <div className="intco-global-production-card">
            <div className="intco-global-production-image" data-reveal="up">
              <Image src={GLOBAL_PRODUCTION_BUILDING_IMAGE} alt="Intco" fill className="object-cover" sizes="(min-width: 1601px) 580px, (min-width: 1024px) 36vw, 100vw" />
            </div>
            <div className="intco-global-production-content" data-reveal="down">
              <p className="intco-global-production-bases" style={{ whiteSpace: "pre-line" }}>
                {pick(GLOBAL_PRODUCTION_PAGE.basesLines, locale)}
              </p>
              <div className="intco-global-production-title">
                <div className="intco-global-production-title-text" style={{ whiteSpace: "pre-line" }}>
                  {pick(GLOBAL_PRODUCTION_PAGE.partnerTitle, locale)}
                </div>
              </div>
              <ul className="intco-global-production-features">
                {GLOBAL_PRODUCTION_PAGE.features.map((item) => (
                  <li key={item.iconUrl}>
                    <span className="intco-global-production-icon">
                      <Image src={item.iconUrl} alt="" width={58} height={58} />
                    </span>
                    <span>{pick(item.label, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="intco-global-production-copy-section">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <p className="intco-global-production-copy" data-reveal="up">
            {pick(GLOBAL_PRODUCTION_PAGE.copy, locale)}
          </p>
        </div>
      </section>

      <LatestCollectionBlock locale={locale} />
      <OurManufacturingBlock locale={locale} />
      <ProjectsSourceContactBand locale={locale} />
    </div>
  );
}

function GlobalProductionHero({ locale }: { locale: Locale }) {
  const title = pick(GLOBAL_PRODUCTION_PAGE.heroTitle, locale);
  return (
    <section className="intco-source-hero intco-source-hero-category" data-source-hero>
      <div className="intco-source-hero-slide" data-source-hero-slide>
        <div className="intco-source-hero-bg" data-source-hero-bg>
          <Image src={GLOBAL_PRODUCTION_HERO_IMAGE} alt={title} fill className="object-cover" sizes="100vw" preload unoptimized />
        </div>
        <div className="intco-source-hero-content" data-source-hero-content>
          <div className="intco-source-container intco-source-hero-inner px-5 min-[1601px]:px-0">
            <div className="intco-source-hero-text" data-source-hero-text>
              <h1 className="intco-source-hero-title" data-source-hero-title>
                {title}
              </h1>
              <nav className="intco-source-hero-crumbs" data-source-hero-crumbs aria-label="Breadcrumb">
                <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                <BreadcrumbLink href={localizePath(locale, "/solutions")}>{t(locale, "solutions")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                <span>{title}</span>
              </nav>
            </div>
            <div className="intco-source-hero-actions" data-source-hero-actions>
              <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")} data-source-hero-cta>
                {t(locale, "chatWithUs")}
              </LeadsCloudChatLink>
              <a href={localizePath(locale, "/products/#goinput")} data-source-hero-cta>
                {t(locale, "leaveMessage")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProjectsListingView({ projects, category, page, locale, pageNumber = 1 }: { projects: Project[]; category?: string; page?: ContentPage; locale: Locale; pageNumber?: number }) {
  if (!category) {
    return <ProjectsSourceListingView locale={locale} pageNumber={pageNumber} projects={projects} />;
  }
  if (category === "Residential") {
    return <ProjectsSourceListingView locale={locale} pageNumber={1} variant="residential" projects={projects} />;
  }
  if (category === "Commercial") {
    return <ProjectsSourceListingView locale={locale} pageNumber={1} variant="commercial" projects={projects} />;
  }

  const filtered = category ? projects.filter((project) => (project.categoryKey || project.category) === category) : projects;
  const projectNav = projects.slice(0, 5);
  const pageLines = contentLines(page?.bodyText, 40);
  const introLines = pageLines.slice(1, 3);
  const title = category ? projectCategoryTitle(locale, category) : page?.title || t(locale, "projects");

  return (
    <>
      <PageHero
        title={title}
        description={page?.description || "Artistry meets functionality. INTCO products integrate into residential and commercial scenarios."}
        imageUrl={page?.imageUrl}
      />
      <section className="bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href={localizePath(locale, "/projects")} className="border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition duration-200 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white">
            {t(locale, "viewAll")}
          </Link>
          {projectNav.map((item) => (
            <Link key={item.slug} href={localizePath(locale, item.path)} className="border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition duration-200 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white">
              {item.title}
            </Link>
          ))}
        </div>
        {introLines.length ? (
          <div className="mx-auto mt-8 max-w-4xl px-4 text-center sm:px-6 lg:px-8" data-reveal="fade">
            <h2 className="text-balance text-3xl font-semibold text-neutral-950">{introLines[0]}</h2>
            {introLines[1] ? <p className="mt-4 text-pretty text-lg leading-8 text-neutral-600">{introLines[1]}</p> : null}
          </div>
        ) : null}
      </section>
      <section className="bg-neutral-100 py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
          {filtered.map((project, index) => (
            <Link
              key={project.slug}
              href={localizePath(locale, project.path)}
              className="group grid overflow-hidden bg-white ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-lg lg:grid-cols-2"
              data-reveal
              style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}
            >
              <div className={`relative min-h-72 bg-neutral-200 ${index % 2 ? "lg:order-2" : ""}`}>
                {project.imageUrl ? <Image src={project.imageUrl} alt={project.imageAlt || project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 50vw, 100vw" /> : null}
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-sm font-bold uppercase text-emerald-700">{project.category || t(locale, "projects")}</p>
                <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{project.title}</h2>
                <p className="mt-4 text-pretty leading-8 text-neutral-600">{project.description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase text-emerald-700 transition-transform duration-200 group-hover:translate-x-1">
                  {t(locale, "exploreMore")} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

function projectCategoryTitle(locale: Locale, category: string) {
  const titles: Record<string, Record<Locale, string>> = {
    Residential: {
      en: "Residential Projects",
      es: "Proyectos residenciales",
      pt: "Projetos residenciais",
      fr: "Projets résidentiels",
      de: "Wohnprojekte",
      ja: "住宅プロジェクト",
    },
    Commercial: {
      en: "Commercial Projects",
      es: "Proyectos comerciales",
      pt: "Projetos comerciais",
      fr: "Projets commerciaux",
      de: "Gewerbeprojekte",
      ja: "商業プロジェクト",
    },
  };
  return titles[category]?.[locale] || `${category} ${t(locale, "projects")}`;
}

type ProjectSourceListItem = {
  title: string;
  path: string;
  imageUrl: string;
  imageAlt?: string;
  description: string;
  category?: string;
};

type ProjectSourceExternalCard = {
  href: string;
  imageUrl: string;
  title: string;
  date?: string;
  description?: string;
};

type ProjectSourceDetailSnapshot = {
  usedItems: ProjectSourceExternalCard[];
  relatedProjects: ProjectSourceExternalCard[];
  inspirationItems: ProjectSourceExternalCard[];
};

const PROJECT_SOURCE_BLOG_BLOOMBERG = {
  href: "/news/the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released/",
  imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c0c66a43ed43152ada4d13eafd9d3f7e410a338e-1080x692.jpg",
  title: "The 2023 Bloomberg Green ESG…",
  date: "29 Jan 2024",
  description: "The 2023 Bloomberg Green ESG 50 Companies to Watch List is officially released.",
};

const PROJECT_SOURCE_BLOG_MEDICINE_MIRROR = {
  href: "/news/the-major-materials-of-medicine-mirror-cabinet/",
  imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1304805420f6e5ee0ccfa6bdcd180e0a013b47fe-800x511.jpg",
  title: "The Major Materials of Medic…",
  date: "29 Jan 2024",
  description: "Bathroom medicine cabinets are available in various materials - you can choose f…",
};

const PROJECT_SOURCE_BLOG_LED_BATHROOM = {
  href: "/news/5-ways-an-led-bathroom-vanity-mirror-can-lmprove-your-space/",
  imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/1806276ee0c14b9b9bd56e338f59a4a9f7c7bb9e-800x533.jpg",
  title: "5 Ways an LED Bathroom Vanit…",
  date: "29 Jan 2024",
  description: "Looking to revitalise your bathroom? Heres how an LED bathroom vanity mirror wit…",
};

const PROJECT_SOURCE_BLOG_COMMON = [PROJECT_SOURCE_BLOG_BLOOMBERG, PROJECT_SOURCE_BLOG_MEDICINE_MIRROR, PROJECT_SOURCE_BLOG_LED_BATHROOM];
const PROJECT_SOURCE_BLOG_LED_AND_BLOOMBERG = [PROJECT_SOURCE_BLOG_LED_BATHROOM, PROJECT_SOURCE_BLOG_BLOOMBERG];

const PROJECTS_SOURCE_DETAIL_SNAPSHOTS: Record<string, ProjectSourceDetailSnapshot> = {
  "/projects/living-room": {
    usedItems: [
      { href: "/neutral-minimalist-framed-abstract-wall-art/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/95401b4ce58aaf00600ac74972077608f8658c16-1080x1080.jpg", title: "Neutral Minimalist Framed Abstract Wall Art" },
      { href: "/round-wood-decorative-mirror-for-wall/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/35b38303209b2db4e5cecbe1025fedcef72efea5-1080x1080.jpg", title: "Washed White Round Wood Decorative Mirror for Wall" },
      { href: "/art/canvas-art/modern-abstract-canvas-wall-art/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9120ac358e686bd5728f47a28796caeb13550f4a-1080x1080.jpg", title: "Modern Abstract Canvas Wall Art" },
    ],
    relatedProjects: [
      { href: "/projects/bedroom/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5dbce0690de3ee1cad5c101630d2a7836acdfd9f-1920x600.jpg", title: "Bedroom" },
      { href: "/projects/dining-room/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/89acde9c8166abb67d259d867bd216b627f8e747-1920x600.jpg", title: "Dining Room" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/bedroom": {
    usedItems: [
      { href: "/art/canvas-art/large-framed-canvas-wall-art-abstract-neutral/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6cb84a2de3622c91518a4b10b48253021c967ae8-1080x1080.jpg", title: "Large Framed Canvas Wall Art Abstract Neutral" },
      { href: "/natural-wood-wall-tabletop-picture-frame-with-plastic-frame-11x14-in/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/09ea9413566f0357014f69b31a67004cf2ff4042-1080x1080.jpg", title: "Natural Wood Wall & Tabletop Picture Frame with Plastic Frame" },
    ],
    relatedProjects: [
      { href: "/projects/living-room/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5ce16cd5091a3670547c1fba432b74c29f8e1d30-1920x600.jpg", title: "Living Room" },
      { href: "/projects/bathroom/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a01b0f5bbc659deccd2fa1b9d6aa90e9bcbb998d-1920x600.jpg", title: "Bathroom" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/bathroom": {
    usedItems: [
      { href: "/black-rectangular-medicine-cabinet-with-mirror-22x26-8-in/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/37a215cf76f626f7a04d8d9ebab283a5e0720b85-1080x1080.jpg", title: "Black Rectangular Medicine Cabinet with Mirror 22x26.8 in" },
      { href: "/aluminum-black-collage-picture-frame-with-2-4x6-and-2-6x8-openings/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/4ed7f3effb2c253e623ce143ba1ba593bf997837-1080x1080.jpg", title: "Aluminum Collage Picture Frame with 2-4x6 and 2-6x8 Openings" },
    ],
    relatedProjects: [
      { href: "/projects/kitchen/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/eb11242f592f8c9114ea829817db66889d728891-1920x600.jpg", title: "Kitchen" },
      { href: "/projects/childrens-room/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/89b4c59e8ce555489d6be8ce837167c81fb45ef8-1920x600.jpg", title: "Children's Room" },
    ],
    inspirationItems: [PROJECT_SOURCE_BLOG_LED_BATHROOM],
  },
  "/projects/dining-room": {
    usedItems: [{ href: "/art/canvas-art/uttermost-mystic-forest-hand-painted-art-with-frame/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f20befa5fb75f512a24b25b196c236f0fcee6b84-1080x1080.jpg", title: "Uttermost Mystic Forest Hand Painted Art with Frame" }],
    relatedProjects: [
      { href: "/projects/bathroom/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a01b0f5bbc659deccd2fa1b9d6aa90e9bcbb998d-1920x600.jpg", title: "Bathroom" },
      { href: "/projects/living-room/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5ce16cd5091a3670547c1fba432b74c29f8e1d30-1920x600.jpg", title: "Living Room" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_LED_AND_BLOOMBERG,
  },
  "/projects/kitchen": {
    usedItems: [{ href: "/aluminum-black-collage-picture-frame-with-2-4x6-and-2-6x8-openings/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/4ed7f3effb2c253e623ce143ba1ba593bf997837-1080x1080.jpg", title: "Aluminum Collage Picture Frame with 2-4x6 and 2-6x8 Openings" }],
    relatedProjects: [
      { href: "/projects/dining-room/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/89acde9c8166abb67d259d867bd216b627f8e747-1920x600.jpg", title: "Dining Room" },
      { href: "/projects/living-room/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5ce16cd5091a3670547c1fba432b74c29f8e1d30-1920x600.jpg", title: "Living Room" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_LED_AND_BLOOMBERG,
  },
  "/projects/childrens-room": {
    usedItems: [
      { href: "/french-floral-landscapes-illustrations-framed-wall-art/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/d04057d178f5bd219f7e9f6cb909ad2b88c5f048-1080x1080.jpg", title: "French Floral Landscapes Illustrations Framed Wall Art" },
      { href: "/art/framed-art/animal-giraffe-framed-wall-art-decor-piece-of-2/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/e5cb8370f0373446cba58ceff8ff9a09884249c5-1080x1080.jpg", title: "Animal Giraffe Framed Wall Art Decor Piece of 2" },
    ],
    relatedProjects: [
      { href: "/projects/bathroom/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/a01b0f5bbc659deccd2fa1b9d6aa90e9bcbb998d-1920x600.jpg", title: "Bathroom" },
      { href: "/projects/bedroom/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5dbce0690de3ee1cad5c101630d2a7836acdfd9f-1920x600.jpg", title: "Bedroom" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_LED_AND_BLOOMBERG,
  },
  "/projects/hotel": {
    usedItems: [
      { href: "/art/canvas-art/uttermost-mystic-forest-hand-painted-art-with-frame/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f20befa5fb75f512a24b25b196c236f0fcee6b84-1080x1080.jpg", title: "Uttermost Mystic Forest Hand Painted Art with Frame" },
      { href: "/wood-wall-mounted-picture-frame-11x14-matted-to-8x10/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/6e34961f3cd6d04ef6f065272f5056c58fcd7a88-1080x1080.jpg", title: "Wood Wall Mounted Picture Frame 11x14 Matted to 8x10" },
    ],
    relatedProjects: [
      { href: "/projects/cafes/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/504b428e70e599afa0726bb0609a6a7071fc940b-1920x600.jpg", title: "Cafes" },
      { href: "/projects/restaurant/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f5ebdca06555a9bd8d8a3b14f34d1b8b905fa8b2-1920x600.jpg", title: "Restaurant" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/office": {
    usedItems: [
      { href: "/art/framed-art/black-framed-abstract-wall-art-set-of-2/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/03f36fa5e9ae35e5d61123385238aa444e2980d1-1080x1080.jpg", title: "Black Framed Abstract Wall Art Set of 2" },
      { href: "/ps-framed-vintage-wood-grain-tabletop-photo-frame/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/dff42f59e1e337d978fd8e58ddde7a4e468e62fb-1080x1080.jpg", title: "PS Framed Vintage Wood Grain Tabletop Picture Frame" },
    ],
    relatedProjects: [
      { href: "/projects/cafes/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/504b428e70e599afa0726bb0609a6a7071fc940b-1920x600.jpg", title: "Cafes" },
      { href: "/projects/school/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/5c7f35f8591a4f5fc05ea7c0a91fd7ee14e28b61-1920x600.jpg", title: "School" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/gallery": {
    usedItems: [
      { href: "/art/framed-art/framed-print-coastal-wall-art-2-piece-20x20/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/687d69958b25f5106b78bc06e5160347364ecb8e-1080x1080.jpg", title: "Framed Print Coastal Wall Art 2 Piece 20x20" },
      { href: "/art/canvas-art/white-flowers-floral-canvas-wall-art-print/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/68f2d06de68cfdd2fa2aa4f9e67f890de9e62146-1080x1080.jpg", title: "White Flowers Floral Canvas Wall Art Print" },
      { href: "/art/canvas-art/sea-star-and-sea-shell-theme-canvas-wall-art-piece-of-2/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/19e377c1ffe8f262a8d798e5db344a5f1445867e-1080x1080.jpg", title: "Sea Star and Sea Shell Theme Canvas Wall Art Piece of 2" },
    ],
    relatedProjects: [
      { href: "/projects/cafes/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/504b428e70e599afa0726bb0609a6a7071fc940b-1920x600.jpg", title: "Cafes" },
      { href: "/projects/restaurant/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f5ebdca06555a9bd8d8a3b14f34d1b8b905fa8b2-1920x600.jpg", title: "Restaurant" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/cafes": {
    usedItems: [{ href: "/minimalist-botanical-leaf-framed-wall-art/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/23bf3c8fb3f04a0315b6bab940c016e93b3daf26-1080x1080.jpg", title: "Minimalist Botanical Leaf Framed Wall Art" }],
    relatedProjects: [
      { href: "/projects/restaurant/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f5ebdca06555a9bd8d8a3b14f34d1b8b905fa8b2-1920x600.jpg", title: "Restaurant" },
      { href: "/projects/gallery/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f2ad1f3996fbc651c928fd0f65631e6e821df111-1920x600.jpg", title: "Gallery" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/restaurant": {
    usedItems: [
      { href: "/minimalist-botanical-leaf-framed-wall-art/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/23bf3c8fb3f04a0315b6bab940c016e93b3daf26-1080x1080.jpg", title: "Minimalist Botanical Leaf Framed Wall Art" },
      { href: "/botanical-wall-art-wooden-vintage-tropical-leaves-nature-wall-decor/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/d788b85e949f7b5b9d0a616ec93e4471480bd61d-1080x1080.jpg", title: "Botanical Wall Art Wooden Vintage Tropical Leaves Nature Wall Decor" },
    ],
    relatedProjects: [
      { href: "/projects/cafes/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/504b428e70e599afa0726bb0609a6a7071fc940b-1920x600.jpg", title: "Cafes" },
      { href: "/projects/large-commercial-space/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b8ae99414189f7642a6b67702a6874e415d41286-1920x600.jpg", title: "Large Commercial Space" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/large-commercial-space": {
    usedItems: [{ href: "/modern-mirror-with-non-rusting-iron-metal-framed-wall-mounted-decorative-mirror/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/9f53a5bcf0e275c82030900dd6e680ded8fb73a7-1080x1080.jpg", title: "Modern Mirror with Non-Rusting Iron Metal Framed Wall Mounted Decorative Mirror" }],
    relatedProjects: [
      { href: "/projects/gallery/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f2ad1f3996fbc651c928fd0f65631e6e821df111-1920x600.jpg", title: "Gallery" },
      { href: "/projects/restaurant/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f5ebdca06555a9bd8d8a3b14f34d1b8b905fa8b2-1920x600.jpg", title: "Restaurant" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
  "/projects/school": {
    usedItems: [
      { href: "/wall-cork-board-for-photo-display-20x20-inch/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/b9c9f7e70da023ab0a78096cc8ef43917a5b06c7-1080x1080.jpg", title: "Wall Cork Board for Picture Display 20x20 Inch" },
      { href: "/chalkboard-style-memo-board-50x70cm/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/8c3456fa15507254a18f9c29114b907963c2fd50-1080x1080.jpg", title: "Chalkboard Style Memo Board 50x70cm" },
      { href: "/dry-erase-wall-calendar-with-black-frame-40x40cm/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/17993d5c9cc7bb8f62005ac226b212daa537bb3d-1080x1080.jpg", title: "Dry Erase Wall Calendar with Black Frame 40x40cm" },
    ],
    relatedProjects: [
      { href: "/projects/gallery/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/f2ad1f3996fbc651c928fd0f65631e6e821df111-1920x600.jpg", title: "Gallery" },
      { href: "/projects/office/", imageUrl: "https://cdn.sanity.io/images/vzcnnept/production/c38074316781cff5e02748afe546e2d42426307e-1920x600.jpg", title: "Office" },
    ],
    inspirationItems: PROJECT_SOURCE_BLOG_COMMON,
  },
};

function orderedProjectsSourceItems(projects: Project[], locale: Locale, variant: "all" | "residential" | "commercial" = "all"): ProjectSourceListItem[] {
  const filtered = projects.filter((project) => {
    const category = project.categoryKey || project.category;
    if (variant === "residential") return PROJECTS_SOURCE_RESIDENTIAL_PATHS.has(project.path) || category === "Residential";
    if (variant === "commercial") return PROJECTS_SOURCE_COMMERCIAL_PATHS.has(project.path) || category === "Commercial";
    return true;
  });
  const orderMap = new Map(PROJECTS_SOURCE_ORDER.map((path, index) => [path, index]));
  return filtered
    .slice()
    .sort((a, b) => {
      const aOrder = orderMap.get(a.path) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap.get(b.path) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.title.localeCompare(b.title);
    })
    .map((project) => {
      const fallback = PROJECTS_SOURCE_ITEM_BY_PATH.get(project.path);
      const localizedCopy = localizedProjectsSourceCopy(locale, project.path);
      const title = localizedCopy?.title || project.title;
      return {
        title,
        path: project.path,
        imageUrl: fallback?.imageUrl || project.imageUrl || PROJECTS_HERO_IMAGE,
        imageAlt: project.imageAlt || title,
        description: localizedCopy?.description || fallback?.description || project.description || "",
        category: project.categoryKey || project.category,
      };
    });
}

function ProjectsSourceListingView({ locale, pageNumber, projects, variant = "all" }: { locale: Locale; pageNumber: number; projects: Project[]; variant?: "all" | "residential" | "commercial" }) {
  const isResidential = variant === "residential";
  const isCommercial = variant === "commercial";
  const isFilteredArchive = isResidential || isCommercial;
  const allItems = orderedProjectsSourceItems(projects, locale, variant);
  const totalPages = Math.max(1, Math.ceil(allItems.length / PROJECTS_SOURCE_PAGE_SIZE));
  const activePage = isFilteredArchive ? 1 : pageNumber >= 1 && pageNumber <= totalPages ? pageNumber : 1;
  const startIndex = (activePage - 1) * PROJECTS_SOURCE_PAGE_SIZE;
  const items = isFilteredArchive ? allItems : allItems.slice(startIndex, startIndex + PROJECTS_SOURCE_PAGE_SIZE);
  const pageHref = (page: number) => (page === 1 ? "/projects" : `/projects/page/${page}`);
  const title = isResidential ? t(locale, "residential") : isCommercial ? t(locale, "commercial") : t(locale, "projects").toUpperCase();
  const heroTitle = isResidential ? t(locale, "residential") : isCommercial ? t(locale, "commercial") : t(locale, "projects");
  const paginationItems = isFilteredArchive
    ? []
    : [
        ...(activePage > 1 ? [{ label: "<", page: activePage - 1, ariaLabel: t(locale, "previousProjectsPage") }] : []),
        ...Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return { label: String(page), page, current: page === activePage };
        }),
        ...(activePage < totalPages ? [{ label: ">", page: activePage + 1, ariaLabel: t(locale, "nextProjectsPage") }] : []),
      ];

  return (
    <div className="intco-projects-source-page">
      <ProjectsSourceHero locale={locale} title={heroTitle} showProjectsCrumb={isResidential || isCommercial} />
      <section className="bg-[#f3f3f3] pb-10 pt-5 lg:pt-[99px]">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <ProjectsSourceTitle title={title} backdrop={t(locale, "residential").toUpperCase()} />
          <p className="intco-projects-source-intro">
            {t(locale, "sourceProjectsIntroLine1")}
            <br />
            {t(locale, "productLandingProjectDescription")}
          </p>
          <nav className="flex justify-center gap-[10px] lg:gap-[130px]" aria-label="Project categories">
            <Link href={localizePath(locale, "/projects")} aria-current={!isResidential && !isCommercial ? "page" : undefined} className={`box-border flex h-11 flex-1 items-center justify-center rounded-[29px] border-2 border-[#484653] text-sm font-semibold transition duration-700 lg:box-content lg:h-[58px] lg:w-[232px] lg:flex-none lg:text-lg ${isResidential || isCommercial ? "bg-white text-[#484653] hover:bg-[#484653] hover:text-white" : "bg-[#484653] text-white"}`}>
              {t(locale, "viewAll")}
            </Link>
            <Link href={localizePath(locale, "/projects/residential")} aria-current={isResidential ? "page" : undefined} className={`box-border flex h-11 flex-1 items-center justify-center rounded-[29px] border-2 border-[#484653] text-sm font-semibold transition duration-700 lg:box-content lg:h-[58px] lg:w-[232px] lg:flex-none lg:text-lg ${isResidential ? "bg-[#484653] text-white" : "bg-white text-[#484653] hover:bg-[#484653] hover:text-white"}`}>
              {t(locale, "residential")}
            </Link>
            <Link href={localizePath(locale, "/projects/commercial")} aria-current={isCommercial ? "page" : undefined} className={`box-border flex h-11 flex-1 items-center justify-center rounded-[29px] border-2 border-[#484653] text-sm font-semibold transition duration-700 lg:box-content lg:h-[58px] lg:w-[232px] lg:flex-none lg:text-lg ${isCommercial ? "bg-[#484653] text-white" : "bg-white text-[#484653] hover:bg-[#484653] hover:text-white"}`}>
              {t(locale, "commercial")}
            </Link>
          </nav>
          <div className="pt-5 lg:pt-[59px]">
            {items.map((project, index) => (
              <ProjectsSourceCard key={project.path} project={project} index={index} locale={locale} />
            ))}
          </div>
          <nav className="flex h-[120px] items-start justify-center gap-[6px] py-[30px]" aria-label="Projects pagination">
            {paginationItems.map((item, index) =>
              "current" in item && item.current ? (
                <span key={`${item.label}-${index}`} className="flex size-[30px] items-center justify-center bg-[#484653] text-base leading-[30px] text-white" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link key={`${item.label}-${index}`} href={localizePath(locale, pageHref(item.page))} className="flex size-[30px] items-center justify-center bg-[#f3f3f3] text-base leading-[30px] text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white" aria-label={"ariaLabel" in item ? item.ariaLabel : undefined}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </section>
      <ProjectsSourceContactBand locale={locale} />
    </div>
  );
}

function ProjectsSourceHero({ locale, title, showProjectsCrumb = false }: { locale: Locale; title: string; showProjectsCrumb?: boolean }) {
  const isProjectsIndex = title === t(locale, "projects");

  return (
    <section className="relative aspect-[1920/600] min-h-[122px] overflow-hidden lg:min-h-[260px]">
      <Image src={PROJECTS_HERO_IMAGE} alt={title} fill className="object-cover" sizes="100vw" preload />
      <div className="absolute inset-0 bg-white/30" />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center">
        <div className="intco-source-container px-5 text-center text-[#484653] max-lg:text-left">
          <h1 className={`text-[32px] leading-[48px] lg:text-[66px] lg:leading-[80px] ${isProjectsIndex ? "font-bold text-[#333333]" : "font-semibold text-[#484653]"}`}>{title}</h1>
          <nav className="flex items-center justify-center gap-3 py-3 text-sm font-medium leading-[19px] text-[#484653] max-lg:py-0 lg:text-xl lg:leading-10" aria-label="Breadcrumb">
            <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
            <ArrowRight size={18} strokeWidth={1.8} />
            {showProjectsCrumb ? (
              <>
                <BreadcrumbLink href={localizePath(locale, "/projects")}>{t(locale, "projects")}</BreadcrumbLink>
                <ArrowRight size={18} strokeWidth={1.8} />
                <span>{title}</span>
              </>
            ) : (
              <span>{t(locale, "projects")}</span>
            )}
          </nav>
          <div className="mt-4 flex flex-nowrap justify-center gap-[30px] max-lg:justify-start max-lg:gap-3">
            <LeadsCloudChatLink
              fallbackHref={localizePath(locale, "/contact#chat")}
              className="box-content inline-flex h-12 w-[142px] items-center justify-center whitespace-nowrap rounded-[29px] border-2 border-[#484653] bg-white text-base font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white lg:w-[232px] lg:text-lg"
            >
              {t(locale, "chatWithUs")}
            </LeadsCloudChatLink>
            <Link
              href={localizePath(locale, "/products/#goinput")}
              className="box-content inline-flex h-12 w-[142px] items-center justify-center whitespace-nowrap rounded-[29px] border-2 border-[#484653] bg-white text-base font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white lg:w-[232px] lg:text-lg"
            >
              {t(locale, "leaveMessage")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSourceTitle({ title, backdrop }: { title: string; backdrop: string }) {
  return (
    <div className="intco-projects-source-title" data-reveal="fade">
      <div className="intco-projects-source-title-backdrop" aria-hidden="true">
        {backdrop}
      </div>
      <div className="intco-projects-source-title-text">
        {title}
      </div>
    </div>
  );
}

function ProjectsSourceCard({ project, index, locale }: { project: ProjectSourceListItem; index: number; locale: Locale }) {
  const textReveal = index % 2 === 0 ? "up" : "down";
  const imageReveal = index % 2 === 0 ? "down" : "up";
  const text = (
    <div className="intco-project-card-text" data-reveal={textReveal}>
      <div className="intco-project-card-title">{project.title}</div>
      <p className="intco-project-card-desc">{project.description}</p>
    </div>
  );
  const image = (
    <div className="intco-project-card-image" data-reveal={imageReveal}>
      <div className="intco-project-card-image-inner">
        <Image src={project.imageUrl} alt={project.imageAlt || project.title} fill className="object-cover transition duration-[1500ms] hover:scale-105" sizes="(min-width: 1601px) 1106px, (min-width: 1024px) 50vw, 100vw" />
      </div>
    </div>
  );

  return (
    <Link href={localizePath(locale, project.path)} className={`intco-project-card ${index % 2 === 0 ? "flex-col-reverse lg:flex-row" : "flex-col lg:flex-row"}`}>
      {index % 2 === 0 ? (
        <>
          {text}
          {image}
        </>
      ) : (
        <>
          {image}
          {text}
        </>
      )}
    </Link>
  );
}

function ProjectsSourceContactBand({ locale }: { locale: Locale }) {
  return (
    <section className="relative mb-[30px] bg-cover bg-center p-5 lg:mb-[55px] lg:px-0 lg:py-[98px]" style={{ backgroundImage: `url(${SOLUTIONS_CONTACT_BG})` }}>
      <span className="sr-only">{t(locale, "getInTouch")}</span>
      <div className="intco-source-container flex flex-col items-center justify-center rounded-md bg-[rgba(72,70,83,0.8)] px-6 py-12 text-center text-white lg:min-h-[321px] lg:px-0 lg:py-[8vh]" data-reveal="fade">
        <h2 className="w-full text-[32px] font-semibold leading-tight lg:text-[38px] lg:leading-[15px]">{t(locale, "perfectSolution")}</h2>
        <p className="my-8 w-full text-lg font-normal lg:text-2xl lg:leading-9">{t(locale, "contactToday")}</p>
        <LeadsCloudChatLink
          fallbackHref={localizePath(locale, "/contact#chat")}
          className="mx-auto box-content inline-flex h-[58px] w-[200px] items-center justify-center rounded-[29px] border-2 border-white bg-white text-lg font-medium leading-[54px] text-[#484653] transition duration-700 hover:border-[#484653] hover:bg-[#484653] hover:text-white"
        >
          <Phone className="mr-[9px]" size={22} />
          {t(locale, "contactUs")}
        </LeadsCloudChatLink>
      </div>
    </section>
  );
}

export function BlogListingView({
  posts,
  locale,
  activeCategory,
  page,
  pageNumber = 1,
  basePath = "/blog",
}: {
  posts: BlogPost[];
  locale: Locale;
  activeCategory?: string;
  page?: ContentPage;
  pageNumber?: number;
  basePath?: "/blog" | "/inspiration";
}) {
  const currentCategory = normalizedBlogActiveCategory(activeCategory);
  const orderedPosts = orderedBlogSourceItems(posts, page);
  const filteredPosts = currentCategory ? orderedPosts.filter((post) => post.categoryKey === currentCategory || post.category === currentCategory) : orderedPosts;
  const categories = HOME_BLOG_CATEGORIES.filter((category) => category === "All" || filteredBlogSourceItems(posts, page, category).length > 0);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / BLOG_SOURCE_PAGE_SIZE));
  const currentPage = pageNumber >= 1 && pageNumber <= totalPages ? pageNumber : 1;
  const startIndex = (currentPage - 1) * BLOG_SOURCE_PAGE_SIZE;
  const visiblePosts = filteredPosts.slice(startIndex, startIndex + BLOG_SOURCE_PAGE_SIZE);
  const popularPosts = orderedPosts.slice(0, 5);
  const heroTitle = basePath === "/inspiration" ? blogCategoryLabel(locale, "Inspiration") : page?.title || t(locale, "blog");
  const pageHref = (page: number) => {
    const pagePath = page <= 1 ? basePath : `${basePath}/page/${page}`;
    if (basePath === "/inspiration") return localizePath(locale, pagePath);
    return `${localizePath(locale, pagePath)}${currentCategory ? `?category=${encodeURIComponent(currentCategory)}` : ""}`;
  };
  const categoryHref = (category: string) => {
    if (category === "All") return localizePath(locale, "/blog");
    if (category === "Inspiration") return localizePath(locale, "/inspiration");
    return `${localizePath(locale, "/blog")}?category=${encodeURIComponent(category)}`;
  };

  return (
    <>
      <PageHero
        title={heroTitle}
        description={page?.description || t(locale, "blogIntroDescription")}
        imageUrl={page?.imageUrl}
      />
      <section className="bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <Link
              key={category}
              href={categoryHref(category)}
              className={`border px-4 py-2 text-sm font-semibold ${
                (category === "All" && !currentCategory) || category === currentCategory
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-neutral-200 text-neutral-700"
              }`}
            >
              {blogCategoryLabel(locale, category)}
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-neutral-100 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {visiblePosts.map((post, index) => (
              <div key={post.slug} data-reveal style={{ "--reveal-delay": `${(index % 2) * 90}ms` } as React.CSSProperties}>
                <BlogCard post={post} locale={locale} />
              </div>
            ))}
          </div>
          <aside className="space-y-5" data-reveal="right">
            <form action={localizePath(locale, "/index.php")} className="flex border border-neutral-200 bg-white p-3">
              <input name="keyword" aria-label={t(locale, "search")} placeholder={t(locale, "search")} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <button type="submit" className="flex size-10 items-center justify-center bg-neutral-950 text-white" aria-label={t(locale, "search")}>
                <Search size={18} />
              </button>
            </form>
            <div className="bg-white p-6 ring-1 ring-black/5">
              <h2 className="text-balance text-xl font-semibold text-neutral-950">{t(locale, "popularPosts")}</h2>
              <div className="mt-5 space-y-4">
                {popularPosts.map((post) => (
                  <Link key={post.slug} href={localizePath(locale, post.path)} className="group grid grid-cols-[72px_1fr] gap-3">
                    <div className="relative aspect-square bg-neutral-100">
                      {post.imageUrl ? <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill className="object-cover" sizes="72px" /> : null}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">{formatDate(post.publishedAt)}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-neutral-800 transition-colors duration-200 group-hover:text-emerald-700">{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-neutral-950 p-6 text-white">
              <p className="text-sm font-bold uppercase text-emerald-300">{t(locale, "shopNow")}</p>
              <h2 className="mt-3 text-balance text-2xl font-semibold">{t(locale, "perfectSolution")}</h2>
              <Link href={localizePath(locale, "/products")} className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold uppercase text-neutral-950">
                {t(locale, "exploreMore")} <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
        {filteredPosts.length === 0 ? <p className="mx-auto mt-8 max-w-7xl px-4 text-sm text-neutral-500 sm:px-6 lg:px-8">{t(locale, "noPostsFound")}</p> : null}
        {totalPages > 1 ? <BlogPagination locale={locale} currentPage={currentPage} totalPages={totalPages} pageHref={pageHref} /> : null}
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

function BlogPagination({
  locale,
  currentPage,
  totalPages,
  pageHref,
}: {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  pageHref: (page: number) => string;
}) {
  const firstVisiblePage = currentPage <= 3 ? 1 : currentPage >= totalPages - 1 ? Math.max(1, totalPages - 4) : currentPage - 2;
  const pageLinks = Array.from({ length: Math.min(5, totalPages - firstVisiblePage + 1) }, (_, index) => firstVisiblePage + index);

  return (
    <div className="page-box">
      <div className="page-inner">
        <nav className="wp-pagenavi" aria-label={t(locale, "blogPagination")}>
          {currentPage > 1 ? (
            <Link className="previouspostslink" rel="prev" aria-label={t(locale, "previousPage")} href={pageHref(currentPage - 1)}>
              &lt;
            </Link>
          ) : null}
          {pageLinks.map((page) =>
            page === currentPage ? (
              <span key={page} aria-current="page" className="current">
                {page}
              </span>
            ) : (
              <Link key={page} className={page < currentPage ? "page smaller" : "page larger"} title={`Page ${page}`} href={pageHref(page)}>
                {page}
              </Link>
            ),
          )}
          {pageLinks[pageLinks.length - 1] < totalPages ? <span className="extend">...</span> : null}
          {currentPage < totalPages ? (
            <Link className="nextpostslink" rel="next" aria-label={t(locale, "nextPage")} href={pageHref(currentPage + 1)}>
              &gt;
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}

type SearchResultItem = Omit<SourceSearchResultItem, "imageUrl" | "imageAlt" | "description"> & {
  imageUrl?: string;
  imageAlt?: string;
  description?: string;
};

const SOURCE_SEARCH_RESULT_OVERRIDES = new Map(SOURCE_EMPTY_SEARCH_RESULTS.map((item) => [item.path, item]));

function orderedSearchCatalogResults(products: Product[]) {
  const orderMap = new Map(SOURCE_EMPTY_SEARCH_RESULTS.map((item, index) => [item.path, index]));
  return products
    .slice()
    .sort((a, b) => {
      const aOrder = orderMap.get(a.path) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap.get(b.path) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.title.localeCompare(b.title);
    })
    .map((product) => searchResultFromProduct(product));
}

export function SearchResultsView({ products, posts, keyword, locale, pageNumber = 1 }: { products: Product[]; posts: BlogPost[]; keyword: string; locale: Locale; pageNumber?: number }) {
  const normalizedKeyword = keyword.trim();
  const currentPage = Math.max(1, Math.floor(pageNumber) || 1);
  const results = normalizedKeyword ? filteredSearchResults(products, posts, normalizedKeyword) : orderedSearchCatalogResults(products);
  const totalPages = Math.max(1, Math.ceil(results.length / SOURCE_SEARCH_PAGE_SIZE));
  const startIndex = (currentPage - 1) * SOURCE_SEARCH_PAGE_SIZE;
  const visibleResults = results.slice(startIndex, startIndex + SOURCE_SEARCH_PAGE_SIZE);
  const showPagination = results.length > SOURCE_SEARCH_PAGE_SIZE;

  return (
    <section className="main intco-search-source-page">
      <div className="main-box">
        <div className="search-box">
          <div className="intco-source-container px-5 min-[1601px]:px-0">
            <div className="search-tool">
              <div className="search-tool-inner">
                <form action={localizePath(locale, "/index.php")} method="get">
                  <input type="text" name="keyword" placeholder={t(locale, "search")} defaultValue={normalizedKeyword} />
                  <button type="submit" aria-label={t(locale, "search")}>
                    <Search size={30} strokeWidth={1.6} />
                  </button>
                </form>
              </div>
            </div>
            <div className="search-list">
              <ul>
                {visibleResults.map((item) => (
                  <li key={`${item.path}-${item.title}`}>
                    <div className="li-inner intco-search-clear">
                      <div className="img-box">
                        <Link href={localizePath(locale, item.path)} title={item.title}>
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.imageAlt || item.title} width={800} height={800} className="intco-search-result-image" sizes="(min-width: 1601px) 388px, (min-width: 1024px) 278px, 308px" loading="eager" />
                          ) : null}
                        </Link>
                      </div>
                      <div className="img-text">
                        <div className="t intco-search-clear">
                          <Link href={localizePath(locale, item.path)}>{item.title}</Link>
                        </div>
                        <div className="d">{item.description || ""}</div>
                        <div className="m">
                          <Link className="see-more" href={localizePath(locale, item.path)}>
                            <span>{t(locale, "readMore")}</span>
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {visibleResults.length === 0 ? <p className="intco-search-empty">{t(locale, "noResultsFound")}</p> : null}
              {showPagination ? <SearchPagination locale={locale} currentPage={currentPage} totalPages={totalPages} keyword={normalizedKeyword} /> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function filteredSearchResults(products: Product[], posts: BlogPost[], keyword: string): SearchResultItem[] {
  const lowered = keyword.toLowerCase();
  const productResults = products
    .filter((item) => searchHaystack(item.title, item.description, item.bodyText).includes(lowered))
    .map((item) => searchResultFromProduct(item));
  const postResults = posts
    .filter((item) => searchHaystack(item.title, item.excerpt, item.bodyText).includes(lowered))
    .map((item) => ({
      title: item.title,
      path: item.path,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt || item.title,
      description: item.excerpt,
    }));
  return [...productResults, ...postResults];
}

function searchHaystack(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ").toLowerCase();
}

function searchResultFromProduct(product: Product): SearchResultItem {
  const override = SOURCE_SEARCH_RESULT_OVERRIDES.get(product.path);
  return {
    title: product.title,
    path: product.path,
    imageUrl: override?.imageUrl || preferredImage(product),
    imageAlt: override?.imageAlt || product.imageAlt || product.title,
    description: override?.description ?? product.description,
  };
}

function SearchPagination({ locale, currentPage, totalPages, keyword }: { locale: Locale; currentPage: number; totalPages: number; keyword: string }) {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "?keyword=";
  const pageHref = (page: number) => (page <= 1 ? `${localizePath(locale, "/index.php")}${query}` : `${localizePath(locale, `/page/${page}`)}${query}`);
  const firstVisiblePage = currentPage <= 3 ? 1 : currentPage >= totalPages - 1 ? Math.max(1, totalPages - 4) : currentPage - 2;
  const pageLinks = Array.from({ length: Math.min(5, totalPages - firstVisiblePage + 1) }, (_, index) => firstVisiblePage + index);

  return (
    <div className="page-box">
      <div className="page-inner">
        <nav className="wp-pagenavi" aria-label={t(locale, "searchResultsPagination")}>
          {currentPage > 1 ? (
            <Link className="previouspostslink" rel="prev" aria-label={t(locale, "previousPage")} href={pageHref(currentPage - 1)}>
              &lt;
            </Link>
          ) : null}
          {pageLinks.map((page) =>
            page === currentPage ? (
              <span key={page} aria-current="page" className="current">
                {page}
              </span>
            ) : (
              <Link key={page} className={page < currentPage ? "page smaller" : "page larger"} title={`Page ${page}`} href={pageHref(page)}>
                {page}
              </Link>
            ),
          )}
          {pageLinks[pageLinks.length - 1] < totalPages ? <span className="extend">...</span> : null}
          {currentPage < totalPages ? (
            <Link className="nextpostslink" rel="next" aria-label={t(locale, "nextPage")} href={pageHref(currentPage + 1)}>
              &gt;
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}

export function ProductDetailView({
  product,
  relatedProducts,
  locale,
}: {
  product: Product;
  relatedProducts: Product[];
  locale: Locale;
}) {
  const details = parseProductDetails(product, locale);
  const displayTitle = details.displayTitle || product.title;
  const gallery = itemGallery(product);
  const primary = gallery[0] || preferredImage(product);
  const bestSellers = relatedProducts.slice(0, 4);

  return (
    <>
      <section className="bg-neutral-100 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 text-sm text-neutral-600 sm:px-6 lg:px-8">
          <Link href={localizePath(locale, "/products")} className="font-semibold text-emerald-700">
            {t(locale, "products")}
          </Link>
          <span>/</span>
          <span>{displayTitle}</span>
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div data-reveal="left">
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              {primary ? <Image src={primary} alt={product.imageAlt || displayTitle} fill loading="eager" className="object-contain" sizes="(min-width: 1024px) 52vw, 100vw" /> : null}
            </div>
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
                {gallery.slice(0, 8).map((image, index) => (
                  <div key={image} className="relative aspect-square bg-neutral-100 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 50}ms` } as React.CSSProperties}>
                    <Image src={image} alt={product.imageAlt || displayTitle} fill loading={index === 0 ? "eager" : undefined} className="object-contain" sizes="120px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <article data-reveal="right">
            {details.bestSellerPairs.length ? (
              <div className="mb-6 bg-neutral-50 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase text-emerald-700">{t(locale, "bestSellers")}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {details.bestSellerPairs.map((item) => (
                    <div key={`${item.title}-${item.itemNumber}`} className="bg-white p-3">
                      <p className="line-clamp-2 text-xs font-semibold leading-4 text-neutral-700">{item.title}</p>
                      <p className="mt-2 text-xs font-bold text-neutral-950">{item.itemNumber}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : bestSellers.length ? (
              <div className="mb-6 bg-neutral-50 p-4 ring-1 ring-black/5">
                <p className="text-xs font-bold uppercase text-emerald-700">{t(locale, "bestSellers")}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {bestSellers.map((item) => (
                    <Link key={item.slug} href={localizePath(locale, item.path)} className="group">
                      <div className="relative aspect-square bg-white">
                        {preferredImage(item) ? <Image src={preferredImage(item)} alt={item.imageAlt || item.title} fill className="object-contain" sizes="96px" /> : null}
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-4 text-neutral-700 group-hover:text-emerald-700">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "product")}</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{displayTitle}</h1>
            {product.description ? <p className="mt-4 text-pretty text-base leading-8 text-neutral-600">{product.description}</p> : null}
            <dl className="mt-7 grid gap-px overflow-hidden bg-neutral-200 ring-1 ring-neutral-200">
              {details.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[140px_1fr] bg-white">
                  <dt className="bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-600">{spec.label}</dt>
                  <dd className="px-4 py-3 text-sm font-semibold text-neutral-950">{spec.value || "-"}</dd>
                </div>
              ))}
            </dl>
            <ProductQuotePanel locale={locale} product={{ slug: product.slug, title: displayTitle, path: product.path, sourceId: product.sourceId, sku: product.sku, imageUrl: primary }} />
          </article>
        </div>
      </section>

      <section className="bg-neutral-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "aboutThisItem")}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{t(locale, "descriptionHighlights")}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2" data-reveal="right">
              <div className="bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-xl font-semibold text-neutral-950">{t(locale, "description")}</h3>
                <div className="mt-4 space-y-3 text-pretty text-sm leading-7 text-neutral-600">
                  {(details.descriptionLines.length ? details.descriptionLines : linesFromBody(product.bodyText, 3)).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 ring-1 ring-black/5">
                <h3 className="text-xl font-semibold text-neutral-950">{t(locale, "highlights")}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-700">
                  {(details.highlightLines.length ? details.highlightLines : linesFromBody(product.bodyText, 6).slice(1)).map((line) => (
                    <li key={line} className="flex gap-3">
                      <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="bg-white py-16">
          <SectionTitle eyebrow={t(locale, "relatedProducts")} title={t(locale, "relatedProducts")} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {relatedProducts.slice(0, 4).map((item, index) => (
              <div key={item.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <ProductCard product={item} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <ServicesBand locale={locale} />
    </>
  );
}

export function SolutionDetailView({
  solution,
  products,
  projects,
  locale,
}: {
  solution: Solution;
  products: Product[];
  projects: Project[];
  locale: Locale;
}) {
  if (solution.slug === "business-insights-trends") {
    return <BusinessInsightsSourceView locale={locale} />;
  }
  if (solution.slug === "design-engineering") {
    return <DesignEngineeringSourceView locale={locale} />;
  }
  if (solution.slug === "manufacturing-delivery") {
    return <ManufacturingDeliverySourceView locale={locale} />;
  }
  if (solution.slug === "global-production-and-supply") {
    return <GlobalProductionSupplySourceView locale={locale} />;
  }
  if (solution.slug === "certification") {
    return <CertificationSourceView locale={locale} />;
  }
  if (solution.slug === "retailer-support") {
    return <RetailerSupportSourceView locale={locale} />;
  }

  const sections = sectionize(contentLines(solution.bodyText, 120));

  return (
    <>
      <PageHero title={solution.title} description={solution.description} imageUrl={solution.imageUrl} label={t(locale, "solutions")} />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div data-reveal="left">
            <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "servicesWeOffer")}</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{solution.title}</h2>
            <p className="mt-5 text-pretty leading-8 text-neutral-600">{solution.description}</p>
          </div>
          <div className="grid gap-5" data-reveal="right">
            {sections.map((section) => (
              <div key={section.title} className="bg-neutral-50 p-6 ring-1 ring-black/5">
                <h3 className="text-balance text-2xl font-semibold text-neutral-950">{section.title}</h3>
                <div className="mt-4 space-y-3 text-pretty text-sm leading-7 text-neutral-600">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ServicesBand locale={locale} />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <RelatedGrid title={t(locale, "featuredProductsLabel")} items={products.slice(0, 4)} locale={locale} kind="product" />
          <RelatedGrid title={t(locale, "latestProjects")} items={projects.slice(0, 4)} locale={locale} kind="project" />
        </div>
      </section>
      <ContactBand locale={locale} />
    </>
  );
}

export function ProjectDetailView({
  project,
  products,
  projects,
  posts = [],
  locale,
}: {
  project: Project;
  products: Product[];
  projects: Project[];
  posts?: BlogPost[];
  locale: Locale;
}) {
  const lines = contentLines(project.bodyText, 100);
  const usedItemNames = extractBetween(lines, "USED ITEMS", "YOU MAY ALSO LIKE").filter((line) => !line.includes("Explore more details"));
  const usedProducts = usedItemNames
    .map((name) => findSourceProductByTitle(products, name))
    .filter(Boolean) as Product[];
  const gallery = projectSourceDetailGallery(project);
  const mainDescription = projectSourceMainDescription(project, lines);
  const relatedProjectNames = extractBetween(lines, "YOU MAY ALSO LIKE", "GET MORE INSPIRATION");
  const relatedByName = relatedProjectNames
    .map((name) => projects.find((item) => normalizeSourceTitle(item.title) === normalizeSourceTitle(name)))
    .filter(Boolean) as Project[];
  const relatedProjects = (relatedByName.length ? relatedByName : projects.filter((item) => item.slug !== project.slug)).slice(0, 4);
  const inspirationLines = extractAfter(lines, "GET MORE INSPIRATION", 8);
  const inspirationPosts = sourceProjectInspirationPosts(posts, inspirationLines).slice(0, 4);
  const categoryPath = (project.categoryKey || project.category) === "Commercial" ? "/projects/commercial" : "/projects/residential";
  const sourceSnapshot = PROJECTS_SOURCE_DETAIL_SNAPSHOTS[project.path];
  const sourceUsedItems = usedProducts.length
    ? usedProducts.map((product) => ({
        href: product.path,
        imageUrl: preferredImage(product),
        title: product.title,
      }))
    : sourceSnapshot?.usedItems || [];
  const sourceRelatedProjects = relatedProjects.length
    ? relatedProjects.slice(0, 2).map((item) => ({
        href: item.path,
        imageUrl: PROJECTS_SOURCE_ITEM_BY_PATH.get(item.path)?.imageUrl || preferredImage(item),
        title: item.title,
      }))
    : sourceSnapshot?.relatedProjects || [];
  const fallbackInspirationPosts = inspirationPosts.length ? inspirationPosts : posts.slice(0, 3);
  const sourceInspirationItems = fallbackInspirationPosts.length
    ? fallbackInspirationPosts.map((post) => ({
        href: post.path,
        imageUrl: post.imageUrl || "",
        title: post.title,
        date: formatDate(post.publishedAt),
        description: post.excerpt || "",
      }))
    : sourceSnapshot?.inspirationItems || [];

  return (
    <div className="intco-project-detail-source-page intco-project-source-exact">
      <ProjectsSourceHero locale={locale} title={project.title} showProjectsCrumb />

      <div className="project22-index">
        <div className="m-width-content intco-source-container">
          <div className="ipd-20">
            <ProjectSourceGallerySwitcher
              contactLabel={t(locale, "contactUs")}
              description={mainDescription}
              fallbackHref={localizePath(locale, "/contact#chat")}
              gallery={gallery}
              title={project.title}
            />
          </div>
        </div>
      </div>

      <div className="project22-index margin100">
        <div className="m-width-content intco-source-container">
          <div className="ipd-20">
            <ProjectDetailSourceTitle title="USED ITEMS" />
            <div className="product-index-list">
              <div className="w3-project22 hc-w3-project">
                <ul>
                  {sourceUsedItems.map((item) => (
                    <ProjectSourceUsedItem key={`${item.href}-${item.title}`} item={item} locale={locale} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="project22-index2 margin100">
        <div className="m-width-content intco-source-container">
          <div className="ipd-20">
            <ProjectDetailSourceTitle title="YOU MAY ALSO LIKE" />
            <div className="product-index-list">
              <ul>
                {sourceRelatedProjects.map((item) => (
                  <ProjectSourceRelatedItem key={`${item.href}-${item.title}`} item={item} locale={locale} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {sourceInspirationItems.length || inspirationLines.length ? (
        <div className="project22-index3 margin100">
          <div className="m-width-content intco-source-container">
            <div className="ipd-20">
            <ProjectDetailSourceTitle title="GET MORE INSPIRATION" />
              <div className="product-index-list noBorderRadius">
                <div className="w3-project-index3">
                  <ul>
                    {sourceInspirationItems.map((item) => (
                      <ProjectSourceInspirationItem key={`${item.href}-${item.title}`} item={item} locale={locale} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="sr-only">
        <Link href={localizePath(locale, categoryPath)}>{project.category || "Projects"}</Link>
      </div>
    </div>
  );
}

function ProjectDetailSourceTitle({ title }: { title: string }) {
  return (
    <div className="selefTitle leftTitle margin64" data-tit={title}>
      <div className="title_text">{title}</div>
    </div>
  );
}

function ProjectSourceUsedItem({ item, locale }: { item: ProjectSourceExternalCard; locale: Locale }) {
  return (
    <li className="wow fadeInUp">
      <Link href={localizeSourceHref(item.href, locale)}>
        <div className="w-item-box">
          <div className="img-box">
            <img src={item.imageUrl} title={item.title} alt={item.title} />
          </div>
          <div className="box-item-bottom">
            <div className="View-All-btn">
              <div className="View-All-btn-item">{item.title}</div>
            </div>
          </div>
          <div className="bottomText" />
        </div>
      </Link>
    </li>
  );
}

function ProjectSourceRelatedItem({ item, locale }: { item: ProjectSourceExternalCard; locale: Locale }) {
  return (
    <li className="wow fadeInUp">
      <div className="w-item-box">
        <div className="img-box">
          <Link href={localizeSourceHref(item.href, locale)}>
            <img src={item.imageUrl} title={item.title} alt={item.title} />
          </Link>
        </div>
        <div className="bottomText bottomText3">
          <div className="b-text-center">{item.title}</div>
        </div>
      </div>
    </li>
  );
}

function ProjectSourceInspirationItem({ item, locale }: { item: ProjectSourceExternalCard; locale: Locale }) {
  return (
    <li className="wow fadeInUp">
      <div className="w-item-box">
        <div className="img-box">
          <Link href={localizeSourceHref(item.href, locale)}>
            <img src={item.imageUrl} title={item.title} alt={item.title} />
          </Link>
        </div>
        <div className="index3-item-bottom">
          <div className="index3-item-title">{item.title}</div>
          {item.date ? <div className="index3-item-desc">{item.date}</div> : null}
          {item.description ? <div className="DESC">{item.description}</div> : null}
          <div className="View-All-btn">
            <Link href={localizeSourceHref(item.href, locale)} className="View-All-btn-item itemBntBlock">
              {t(locale, "readMore")}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

function localizeSourceHref(href: string, locale: Locale) {
  try {
    const url = new URL(href);
    if (url.hostname === "www.intcoframing-us.com" || url.hostname === "intcoframing-us.com") {
      return localizePath(locale, url.pathname.replace(/\/$/, "") || "/");
    }
  } catch {
    return localizePath(locale, href);
  }
  return href;
}

function projectSourceDetailGallery(project: Project) {
  const gallery = itemGallery(project);
  if (gallery.length) return gallery;
  const sourceGallery = PROJECTS_SOURCE_DETAIL_GALLERIES[project.path] || [];
  if (sourceGallery.length) return sourceGallery;
  const fallback = PROJECTS_SOURCE_ITEM_BY_PATH.get(project.path)?.imageUrl;
  return Array.from(new Set([fallback || ""].filter(Boolean)));
}

function projectSourceMainDescription(project: Project, lines: string[]) {
  const title = normalizeSourceTitle(project.title);
  const stopIndex = lines.findIndex((line) => line.includes("Explore more details") || line === "USED ITEMS");
  const candidates = lines
    .slice(0, stopIndex > -1 ? stopIndex : lines.length)
    .filter((line) => normalizeSourceTitle(line) !== title)
    .filter((line) => !/^[A-Z\s'&-]{3,}$/.test(line));
  return candidates.join(" ") || project.description || PROJECTS_SOURCE_ITEM_BY_PATH.get(project.path)?.description || "";
}

function findSourceProductByTitle(products: Product[], title: string) {
  const needle = normalizeSourceTitle(title);
  return products.find((product) => {
    const candidate = normalizeSourceTitle(product.title);
    return candidate === needle || candidate.includes(needle) || needle.includes(candidate);
  });
}

function sourceProjectInspirationPosts(posts: BlogPost[], lines: string[]) {
  const matched = lines
    .map((line) => posts.find((post) => normalizeSourceTitle(post.title) === normalizeSourceTitle(line) || normalizeSourceTitle(post.title).includes(normalizeSourceTitle(line.replace(/…$/, "")))))
    .filter(Boolean) as BlogPost[];
  return matched.length ? matched : posts;
}

function normalizeSourceTitle(value: string) {
  return value
    .replace(/&[#a-z0-9]+;/gi, "")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .toLowerCase();
}

function VanityMirrorArticleSourceView({ post, locale }: { post: BlogPost; locale: Locale }) {
  const localized = VANITY_MIRROR_ARTICLE_LOCALIZATIONS[locale as keyof typeof VANITY_MIRROR_ARTICLE_LOCALIZATIONS];
  const title = localized?.title || "5 Ways an LED Bathroom Vanity Mirror Can lmprove Your Space";
  const category = localized?.category || localizeSourceBlogCategory(locale, "Inspiration");
  const tocTitle = localized?.tocTitle || "Table of Contents";
  const introParagraphs = localized?.introParagraphs || [
    "Though it may not seem important, the bathroom is one of the most sacred areas in the home. It’s where you get ready in the morning, decompress at night, and wash away the stress of the day.",
    "Looking to revitalise this critical space? Upgrading to a vanity mirror with LED lights is one of the latest bathroom trends.",
    "If that style of lighting sounds a bit soulless for your taste, don’t worry. There’s a reason it’s taken the design world by storm. With the right frame moulding, the final result is nothing short of stylish.",
    "Let’s explore what makes the LED bathroom vanity mirror so popular for a wide array of aesthetics!",
    "Here are 5 Ways an LED Mirror Moulding Frame Can Improve Your Bathroom:",
  ];
  const sections = VANITY_MIRROR_ARTICLE_SECTIONS.map((section, index) => ({
    ...section,
    heading: localized?.sections[index]?.heading || section.heading,
    paragraphs: localized?.sections[index]?.paragraphs || section.paragraphs,
  }));
  return (
    <div className="intco-source-blog-detail">
      <section className="intco-source-blog-hero">
        <Image src="https://cdn.sanity.io/images/vzcnnept/production/9b078225adf32f44c9ae421de1073b547267e78f-1920x600.png" alt={title} fill className="object-cover" sizes="100vw" preload />
        <div className="intco-source-blog-hero-content">
          <div className="m-width-content">
            <div className="ipd-20">
              <h1>{title}</h1>
              <nav className="crumbs-box" aria-label="Breadcrumb">
                <Link className="home" href={localizePath(locale, "/")}>{t(locale, "home")}</Link>
                <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
                <Link href={localizePath(locale, "/blog")}>{t(locale, "blog")}</Link>
                <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
                <Link href={localizePath(locale, "/inspiration")}>{category}</Link>
                <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
                <span>{title}</span>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="Bestsellers-index belog1-index belogDetail-index intco-source-blog-body">
        <div className="m-width-content">
          <div className="ipd-20">
            <div className="intco-source-blog-grid">
              <article className="wow fadeInUp leftBox">
                <div className="belogDetail-item">
                  <Link href={localizePath(locale, "/inspiration")}>
                    <div className="Inspiration">{category}</div>
                  </Link>
                  <div className="belogDetail-title">{title}</div>
                  <div className="line" />
                  <div className="timeSelect">
                    <div className="rightBtn">Jan 29, 2024</div>
                  </div>

                  <div className="DESC textcenter">
                    <BlogArticleToc title={tocTitle} sections={sections} />
                    {introParagraphs.map((paragraph, index) => (
                      <p key={`${paragraph}-${index}`}>
                        {index === 4 && localized ? (
                          <>
                            <Link href={localizePath(locale, "/mirror/led-mirror")}><strong>{localized.ledLinkText}</strong></Link>
                            のモールディングフレームがバスルームを向上させる 5 つの方法をご紹介します。
                          </>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))}
                  </div>

                  {sections.map((section, index) => (
                    <div key={section.heading} className="intco-source-blog-section">
                      <div className="fixedImg" data-reveal="fade" style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}>
                        <div className="img-box">
                          <Image src={section.imageUrl} alt={section.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 820px, 100vw" />
                        </div>
                      </div>
                      <div className="belogDetail-3TITLE" id={`heading-${index}`}>
                        <h2>{section.heading}</h2>
                      </div>
                      <div className="DESC textcenter">
                        {section.paragraphs.map((paragraph, paragraphIndex) => (
                          <p key={paragraph}>
                            {renderVanityMirrorParagraph(paragraph, locale, index, paragraphIndex)}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  <SourceBlogFooter title={title} currentPath={post.path} previousPath="/news/the-major-materials-of-medicine-mirror-cabinet" nextPath="/news/the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released" locale={locale} />
                </div>
              </article>

              <SourceBlogSidebar locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <ProductContactSection locale={locale} />
    </div>
  );
}

function SourceNewsArticleSourceView({
  article,
  post,
  locale,
}: {
  article: (typeof SOURCE_NEWS_ARTICLES)[keyof typeof SOURCE_NEWS_ARTICLES];
  post: BlogPost;
  locale: Locale;
}) {
  const localizedArticle = localizedSourceNewsArticle(article, post, locale);
  return (
    <div className="intco-source-blog-detail">
      <section className="intco-source-blog-hero">
        <Image src="https://cdn.sanity.io/images/vzcnnept/production/9b078225adf32f44c9ae421de1073b547267e78f-1920x600.png" alt={localizedArticle.title} fill className="object-cover" sizes="100vw" preload />
        <div className="intco-source-blog-hero-content">
          <div className="m-width-content">
            <div className="ipd-20">
              <h1>{localizedArticle.title}</h1>
              <nav className="crumbs-box" aria-label="Breadcrumb">
                <Link className="home" href={localizePath(locale, "/")}>{t(locale, "home")}</Link>
                <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
                <Link href={localizePath(locale, "/blog")}>{t(locale, "blog")}</Link>
                <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
                <Link href={localizePath(locale, article.categoryPath)}>{localizedArticle.category}</Link>
                <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
                <span>{localizedArticle.title}</span>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="Bestsellers-index belog1-index belogDetail-index intco-source-blog-body">
        <div className="m-width-content">
          <div className="ipd-20">
            <div className="intco-source-blog-grid">
              <article className="wow fadeInUp leftBox">
                <div className="belogDetail-item">
                  <Link href={localizePath(locale, article.categoryPath)}>
                    <div className="Inspiration">{localizedArticle.category}</div>
                  </Link>
                  <div className="belogDetail-title">{localizedArticle.title}</div>
                  <div className="line" />
                  <div className="timeSelect">
                    <div className="rightBtn">{localizedArticle.date}</div>
                  </div>

                  <div className="DESC textcenter">
                    {localizedArticle.introParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {localizedArticle.leadImage ? (
                    <div className="fixedImg" data-reveal="fade">
                      <div className="img-box">
                        <Image src={localizedArticle.leadImage.imageUrl} alt={localizedArticle.leadImage.imageAlt} fill className="object-cover" sizes="540px" />
                      </div>
                    </div>
                  ) : null}

                  {localizedArticle.sections.map((section, index) => (
                    <div key={`${"heading" in section ? section.heading : "section"}-${index}`} className="intco-source-blog-section">
                      {"heading" in section && section.heading ? (
                        <div className="belogDetail-3TITLE">
                          <h2>{section.heading}</h2>
                        </div>
                      ) : null}
                      <div className="DESC textcenter">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ))}

                  <SourceBlogFooter title={localizedArticle.title} currentPath={post.path} previousPath={localizedArticle.previousPath} nextPath={localizedArticle.nextPath} locale={locale} />
                </div>
              </article>

              <SourceBlogSidebar locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <ProductContactSection locale={locale} />
    </div>
  );
}

function SourceBlogFooter({
  title,
  currentPath,
  previousPath,
  nextPath,
  locale,
}: {
  title: string;
  currentPath: string;
  previousPath?: string;
  nextPath?: string;
  locale: Locale;
}) {
  const labels = SOURCE_BLOG_LABELS[locale];
  const pageLink = (path: string | undefined, content: React.ReactNode, className?: string) => {
    if (!path) {
      return (
        <a href="#top" className={className}>
          {content}
        </a>
      );
    }
    return (
      <Link href={localizePath(locale, path)} className={className}>
        {content}
      </Link>
    );
  };

  return (
    <>
      <div className="belogDetail-bottom">
        <div className="bottom-item">
          <a href="#top" className="leftIcon favorite" aria-label={labels.favorite}>
            <Heart size={22} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </div>
        <div className="bottom-item intco-source-blog-share">
          <a href="https://www.facebook.com/IntcoFraming.cn/" style={{ background: "#4F5FBF" }} aria-label="Facebook"><span aria-hidden="true">f</span></a>
          <a href="https://twitter.com/intco_framing" style={{ background: "#48BDE9" }} aria-label="Twitter"><i className="iconfont icon-tuite" aria-hidden="true" /></a>
          <a href="https://www.linkedin.com/company/intcoframing/" style={{ background: "#0077B5" }} aria-label="LinkedIn"><span aria-hidden="true">in</span></a>
          <a href={`mailto:?subject=${encodeURIComponent(title)}`} style={{ background: "#D54B3D" }} aria-label="Email"><span aria-hidden="true">M</span></a>
          <a href="https://www.instagram.com/intcoframing/" style={{ background: "#FBAE59" }} aria-label="Instagram"><Camera size={19} strokeWidth={2.7} aria-hidden="true" /></a>
          <a href={localizePath(locale, currentPath)} style={{ background: "#484653" }} className="copyRightIcon" aria-label={labels.copyLink}><Link2 size={20} strokeWidth={3} aria-hidden="true" /></a>
        </div>
      </div>

      <div className="flex-pagation">
        <div className="flex-pagation-item">
          {pageLink(previousPath, (
            <>
              <i className="iconfont icon-jiantou_liebiaoxiangzuo" aria-hidden="true" />
              {labels.previous}
            </>
          ))}
        </div>
        <div className="flex-pagation-item">
          {pageLink(nextPath, (
            <>
              {labels.next}
              <i className="iconfont icon-jiantou_liebiaoxiangyou" aria-hidden="true" />
            </>
          ))}
        </div>
      </div>
    </>
  );
}

function SourceBlogSidebar({ locale }: { locale: Locale }) {
  const labels = SOURCE_BLOG_LABELS[locale];
  return (
    <aside className="wow fadeInDown rightBox">
      <div className="right-box-title">{labels.popularPosts}</div>
      <ul className="intco-source-popular-posts">
        {VANITY_MIRROR_POPULAR_POSTS.map((item) => {
          const localizedItem = localizedSourceBlogPopularPost(locale, item);
          return (
          <li key={localizedItem.path}>
            <div className="belog1-index-item">
              <div className="leftImg-item">
                <Link href={localizePath(locale, localizedItem.path)}>
                  <div className="img-box">
                    <Image src={localizedItem.imageUrl} alt={localizedItem.title} fill className="object-cover" sizes="110px" />
                  </div>
                </Link>
              </div>
              <div className="index-item-right">
                <div className="item-title">
                  <Link href={localizePath(locale, localizedItem.categoryPath)}>{localizedItem.category}</Link>
                  <span className="time">{localizedItem.date}</span>
                </div>
                <div className="item-desc">
                  <Link href={localizePath(locale, localizedItem.path)}>{localizedItem.title}</Link>
                </div>
              </div>
            </div>
          </li>
        );
        })}
      </ul>
      <div className="img-box intco-source-shop-image">
        <Image src="https://cdn.sanity.io/images/vzcnnept/production/de2294ff8cd53e361d8ead4e8b68e4cef370c4f1-400x400.png" alt={labels.shopNow} fill className="object-cover" sizes="360px" />
      </div>
      <div className="View-All-btn">
        <Link href={localizePath(locale, "/products")} className="View-All-btn-item itemBntBlock">
          {labels.shopNow}
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="right-box-title">Instagram</div>
      <div className="index-belogDetail-list">
        <ul>
          {VANITY_MIRROR_INSTAGRAM_ITEMS.map((item, index) => (
            <li key={item.imageUrl}>
              <div className="img-box">
                <a href={item.href} target="_blank" rel="noreferrer">
                  <Image src={item.imageUrl} alt={`Instagram ${index + 1}`} fill className="object-cover" sizes="112px" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function BlogArticleToc({ title, sections }: { title: string; sections: Array<{ heading: string }> }) {
  return (
    <div className="headings-navigation">
      <h4>{title}</h4>
      <ul id="toc-list">
        {sections.map((section, index) => (
          <li key={section.heading} className="toc-item">
            <a href={`#heading-${index}`} className="toc-link">
              {index + 1}. {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderVanityMirrorParagraph(paragraph: string, locale: Locale, sectionIndex: number, paragraphIndex: number) {
  if (locale !== "en") return paragraph;
  if (sectionIndex === 1 && paragraphIndex === 0) {
    return (
      <>
        It’s common knowledge in the interior design world that <Link href={localizePath(locale, "/mirror")}>mirrors</Link> make rooms feel bigger. Coupled with the invigorating feel of LED lights, your mirror can truly maximise your space. If you’re working with a particularly small bathroom, you won’t regret installing this take on frame moulding.
      </>
    );
  }
  if (sectionIndex === 4 && paragraphIndex === 2) {
    return (
      <>
        While you’re in the market for fresh frames, don’t forget to grab one or two for photos around the house! We recommend one of our customer favourites: aluminum <Link href={localizePath(locale, "/picture-frame")}>picture frames</Link>.
      </>
    );
  }
  return paragraph;
}

export function BlogPostView({
  post,
  posts,
  locale,
  page,
}: {
  post: BlogPost;
  posts: BlogPost[];
  locale: Locale;
  page?: ContentPage;
}) {
  const orderedPosts = orderedBlogSourceItems(posts, page);
  const sourcePost = orderedPosts.find((item) => item.slug === post.slug) || post;
  const currentCategory = sourcePost.categoryKey || sourcePost.category;
  const lines = contentLines(sourcePost.bodyText, 120);
  const gallery = itemGallery(sourcePost);
  const popularPosts = orderedPosts.filter((item) => item.slug !== post.slug).slice(0, 5);
  const relatedPosts = relatedBlogSourceItems(posts, post.slug, page, currentCategory, 3);
  const supplementalLines = locale === "en" ? blogSourceSupplementLines(post.slug).filter((line) => !containsRenderedLine(lines, line)) : [];

  if (sourcePost.slug === VANITY_MIRROR_ARTICLE_SLUG && !lines.length) {
    return <VanityMirrorArticleSourceView post={sourcePost} locale={locale} />;
  }

  const sourceNewsArticle = SOURCE_NEWS_ARTICLES[sourcePost.slug as keyof typeof SOURCE_NEWS_ARTICLES];
  if (sourceNewsArticle && !lines.length) {
    return <SourceNewsArticleSourceView article={sourceNewsArticle} post={sourcePost} locale={locale} />;
  }

  return (
    <>
      <PageHero title={sourcePost.title} description={sourcePost.excerpt} imageUrl={sourcePost.imageUrl} label={sourcePost.category || t(locale, "blog")} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <article data-reveal="left">
            {sourcePost.publishedAt ? <p className="text-sm font-semibold text-emerald-700">{formatDate(sourcePost.publishedAt)}</p> : null}
            {gallery[0] ? (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-neutral-100">
                <Image src={gallery[0]} alt={sourcePost.imageAlt || sourcePost.title} fill className="object-cover" sizes="(min-width: 1024px) 65vw, 100vw" />
              </div>
            ) : null}
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.slice(1, 8).map((image) => (
                  <div key={image} className="relative aspect-[4/3] bg-neutral-100">
                    <Image src={image} alt={sourcePost.imageAlt || sourcePost.title} fill className="object-cover" sizes="180px" />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-8 space-y-5 text-pretty text-base leading-8 text-neutral-700">
              {supplementalLines.map((line) => (
                <h2 key={line} className="pt-4 text-balance text-2xl font-semibold text-neutral-950">
                  {line}
                </h2>
              ))}
              {(lines.length ? lines : [sourcePost.excerpt || ""]).filter(Boolean).map((line) =>
                looksLikeHeading(line) ? (
                  <h2 key={line} className="pt-4 text-balance text-2xl font-semibold text-neutral-950">
                    {line}
                  </h2>
                ) : (
                  <p key={line}>{line}</p>
                )
              )}
            </div>
          </article>
          <aside className="space-y-5" data-reveal="right">
            <form action={localizePath(locale, "/index.php")} className="flex border border-neutral-200 bg-neutral-50 p-3">
              <input name="keyword" aria-label={t(locale, "search")} placeholder={t(locale, "search")} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              <button type="submit" className="flex size-10 items-center justify-center bg-neutral-950 text-white" aria-label={t(locale, "search")}>
                <Search size={18} />
              </button>
            </form>
            <div className="bg-neutral-50 p-6 ring-1 ring-black/5">
              <h2 className="text-xl font-semibold text-neutral-950">{t(locale, "popularPosts")}</h2>
              <div className="mt-5 space-y-4">
                {popularPosts.map((item) => (
                  <Link key={item.slug} href={localizePath(locale, item.path)} className="group block border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold text-emerald-700">{formatDate(item.publishedAt)}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-neutral-800 group-hover:text-emerald-700">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-neutral-950 p-6 text-white">
              <p className="text-sm font-bold uppercase text-emerald-300">{t(locale, "shopNow")}</p>
              <h2 className="mt-3 text-balance text-2xl font-semibold">{t(locale, "perfectSolution")}</h2>
              <Link href={localizePath(locale, "/products")} className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold uppercase text-neutral-950">
                {t(locale, "exploreMore")} <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
      {relatedPosts.length ? (
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow={currentCategory ? blogCategoryLabel(locale, currentCategory) : t(locale, "blog")} title={t(locale, "relatedArticles")} />
          <div className="mx-auto mt-8 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {relatedPosts.map((item, index) => (
              <div key={item.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <BlogCard post={item} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <ContactBand locale={locale} />
    </>
  );
}

export function DetailView({
  item,
  label,
  locale,
  relatedProducts = [],
}: {
  item: Product | Solution | Project | BlogPost | ContentPage;
  label: string;
  locale: Locale;
  relatedProducts?: Product[];
}) {
  const body = "bodyText" in item ? item.bodyText : "";
  const lines = linesFromBody(body, 22);
  const gallery = item.galleryUrls?.filter(Boolean).slice(0, 6) || [];
  const detailProduct = label === "Product" && "slug" in item ? (item as Product) : null;

  return (
    <>
      <PageHero title={item.title} description={"description" in item ? item.description : "excerpt" in item ? item.excerpt : ""} imageUrl={item.imageUrl} label={label} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div data-reveal="left">
            {item.imageUrl ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(min-width: 1024px) 52vw, 100vw" />
              </div>
            ) : null}
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {gallery.slice(1).map((image, index) => (
                  <div key={image} className="relative aspect-square overflow-hidden bg-neutral-100" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                    <Image src={image} alt={item.imageAlt || item.title} fill className="object-cover transition-transform duration-500 hover:scale-110" sizes="180px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <article data-reveal="right">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-emerald-700">{label}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950 sm:text-4xl">{item.title}</h2>
            {"publishedAt" in item && item.publishedAt ? (
              <p className="mt-3 text-sm font-semibold text-neutral-500">{formatDate(item.publishedAt)}</p>
            ) : null}
            <div className="mt-7 space-y-4 text-pretty text-base leading-8 text-neutral-700">
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {detailProduct ? (
              <ProductQuotePanel
                locale={locale}
                product={{
                  slug: detailProduct.slug,
                  title: detailProduct.title,
                  path: detailProduct.path,
                  sourceId: detailProduct.sourceId,
                  sku: detailProduct.sku,
                  imageUrl: detailProduct.imageUrl,
                }}
              />
            ) : null}
          </article>
        </div>
        {relatedProducts.length ? (
          <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow={t(locale, "relatedProducts")} title={t(locale, "aboutThisItem")} />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product, index) => (
                <div key={product.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                  <ProductCard product={product} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

export function EnquiryListView({ locale }: { locale: Locale }) {
  return (
    <>
      <EnquiryListSourceHero locale={locale} />
      <EnquiryList locale={locale} />
    </>
  );
}

function EnquiryListSourceHero({ locale }: { locale: Locale }) {
  return (
    <section className="inner-banner intco-enquiry-hero">
      <div className="swiper">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="bg-box">
              <div className="imgshow">
                <img src={PRODUCTS_HERO_IMAGE} title="products" alt="products" />
              </div>
            </div>
            <div className="banner-content">
              <div className="intco-source-container">
                <div className="intco-source-pad">
                  <div className="text">
                    <div className="text-p center">
                      <h2 className="text-p-title f-84">Enquiry List</h2>
                      <div className="crumbs-box">
                        <a className="home" href={localizePath(locale, "/")}>
                          <div>{t(locale, "home")}</div>
                        </a>
                        <span>
                          <i className="iconfont icon-jiantou_liebiaoxiangyou" /> Enquiry List
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="banner-a">
                    <LeadsCloudChatLink fallbackHref={localizePath(locale, "/contact#chat")}>
                      {t(locale, "chatWithUs")}
                    </LeadsCloudChatLink>
                    <a href={localizePath(locale, "/products/#goinput")}>{t(locale, "leaveMessage")}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoWeAreSourceView({ page, locale }: { page: ContentPage; locale: Locale }) {
  const href = (path: string) => localizePath(locale, path);
  const aboutIntro = WHO_WE_ARE_INTRO_COPY[locale];
  const globalMarketIntro = WHO_WE_ARE_GLOBAL_MARKET_INTRO[locale];
  const statKeys: Record<string, string> = {
    "Business Units": "businessUnits",
    "Production Bases": "productionBases",
    "Years Experience": "yearsExperience",
    Employees: "employees",
  };
  const stats = WHO_WE_ARE_STATS.map((stat) => ({ ...stat, label: t(locale, statKeys[stat.label] || stat.label) }));
  const markets = WHO_WE_ARE_MARKETS.map((market) => localizeWhoWeAreMarket(market, locale));
  const history = localizeWhoWeAreHistory(locale);

  return (
    <>
      <SolutionsSourceHero title={page.title} locale={locale} imageUrl={WHO_WE_ARE_HERO_IMAGE} imageAlt={page.title} />
      {locale === "en" ? <p className="sr-only">Learn More about Intco Framing | Premium Home Décor Manufacturer &amp; Supplier</p> : null}

      <section className="mb-[100px] bg-white pt-[108px] max-lg:mb-16 max-lg:pt-16">
        <div className="intco-source-container px-5">
          <div className="bg-white">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-[100px]">
              <div className="flex items-start" data-reveal="left">
                <div className="relative aspect-[883/420] w-full max-w-[883px] overflow-hidden">
                  <Image src={WHO_WE_ARE_INTRO_IMAGE} alt="aboutUs2" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
                </div>
              </div>
              <div className="flex flex-col justify-center pb-12 lg:pb-0" data-reveal="right">
                <WhoWeAreSourceTitle title={t(locale, "aboutUs")} align="left" />
                <div className="mt-8 max-w-[720px] text-lg leading-[1.78] text-[#363636]">
                  {aboutIntro.map((line, index) => (
                    <p key={line} className={index ? "mt-7" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-0 bg-cover bg-center" style={{ backgroundImage: `url(${WHO_WE_ARE_STATS_BG})` }}>
          <div className="intco-source-container px-5">
            <ul className="grid bg-transparent sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => {
                const countValue = stat.value.replace("+", "");
                const suffix = stat.value.endsWith("+") ? "+" : "";
                return (
                  <li key={stat.label} className="relative z-[3]" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                    <div className={`flex justify-center py-[50px] ${index > 0 ? "lg:border-l-2 lg:border-[#bdbdbd]" : ""}`}>
                      <div className="flex items-center justify-center px-[30px] text-[#484653]">
                        <div className="relative mr-[13px] flex size-[76px] shrink-0 items-center justify-center">
                          <span className="absolute left-1 top-1 size-11 rounded-full bg-[#c3c2c6]" aria-hidden="true" />
                          <stat.Icon className="relative z-[3]" size={index === 3 ? 64 : 58} strokeWidth={1.4} />
                        </div>
                        <div className="inline-block">
                          <div className="text-[58px] font-semibold leading-none lg:text-[66px]">
                            <CountUpStat value={countValue} />
                            {suffix ? <sup className="align-super text-[32px] leading-none">{suffix}</sup> : null}
                          </div>
                          <div className="mt-3 text-lg font-semibold leading-tight">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f3f3] pb-[98px] pt-[108px] max-lg:py-16">
        <div className="intco-source-container px-5">
          <WhoWeAreSourceTitle title={t(locale, "ourHistory")} align="left" />
          <div className="mt-16">
            <WhoWeAreHistoryCarousel items={history} />
          </div>
        </div>
      </section>

      <section className="bg-white pt-[118px] max-lg:pt-16">
        <div className="intco-source-container px-5">
          <WhoWeAreSourceTitle title={t(locale, "globalMarket")} />
          <p className="mx-auto mt-16 max-w-[980px] text-center text-lg leading-8 text-[#363636]" data-reveal="fade">
            {globalMarketIntro}
          </p>
        </div>
      </section>

      <section className="mt-[53px] bg-white max-lg:mt-8">
        <div className="intco-source-container px-5">
          <div className="relative" data-reveal="fade">
            <div className="relative aspect-[1600/934] w-full">
              <Image src={WHO_WE_ARE_MAP_IMAGE} alt="Global market map" fill className="object-contain" sizes="100vw" />
              <div className="absolute inset-0 hidden lg:block">
                {markets.map((market) => (
                  <WhoWeAreMarketMarker key={market.continent} market={market} />
                ))}
              </div>
            </div>
            <div className="absolute bottom-[-5px] left-[47px] flex flex-col items-center text-center text-[#484653] max-lg:static max-lg:mt-8 max-lg:flex-row max-lg:justify-center max-lg:gap-8">
              <div className="flex flex-col items-center">
                <MapPin size={54} strokeWidth={1.2} />
                <div className="-my-1 text-5xl font-bold leading-tight">
                  <CountUpStat value="120" />
                  <sup className="text-2xl">+</sup>
                </div>
                <div className="text-sm font-semibold">{t(locale, "countriesRegions")}</div>
              </div>
              <div className="my-[36.5px] h-0.5 w-40 bg-[#484653] max-lg:my-0 max-lg:h-20 max-lg:w-0.5" />
              <div className="flex flex-col items-center">
                <Globe2 size={54} strokeWidth={1.2} />
                <div className="-my-1 text-5xl font-bold leading-tight">
                  <CountUpStat value="12000" />
                  <sup className="text-2xl">+</sup>
                </div>
                <div className="text-sm font-semibold">{t(locale, "clients")}</div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:hidden">
            {markets.map((market) => (
              <div key={market.continent} className="border border-neutral-200 p-4">
                <div className="font-semibold text-[#484653]">{market.continent}</div>
                <p className="mt-2 text-sm leading-6 text-[#363636]">{market.countries.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-[100px] pt-16 max-lg:pb-16">
        <div className="intco-source-container px-5">
          <WhoWeAreSourceTitle title={t(locale, "ourPartners")} />
          <ul className="mt-16 grid grid-cols-2 gap-x-[6.25%] gap-y-[57px] sm:grid-cols-3 lg:grid-cols-5" data-reveal="fade">
            {WHO_WE_ARE_PARTNER_LOGOS.map((logo, index) => (
              <li key={logo} className="flex justify-center" style={{ "--reveal-delay": `${(index % 5) * 50}ms` } as React.CSSProperties}>
                <div className="relative aspect-[192/100] w-full max-w-[180px]">
                  <Image src={logo} alt={`comP${index + 1}`} fill className="object-contain" sizes="180px" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white pb-[116px] max-lg:pb-16">
        <div className="intco-source-container px-5">
          <WhoWeAreSourceTitle title={t(locale, "intelligentCompanyPartner")} align="left" wide />
          <p className="mt-[55px] max-w-[1104px] text-lg leading-8 text-[#363636]" data-reveal="left">
            {aboutIntro[0] || page.description}
          </p>
          <div className="mt-12 grid gap-5 lg:grid-cols-[41.3%_1fr]">
            <WhoWeArePartnerCard card={WHO_WE_ARE_PARTNER_CARDS[0]} href={href(WHO_WE_ARE_PARTNER_CARDS[0].path)} locale={locale} large />
            <div className="grid gap-[15px]">
              {WHO_WE_ARE_PARTNER_CARDS.slice(1).map((card) => (
                <WhoWeArePartnerCard key={card.title} card={card} href={href(card.path)} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <HomeBottomContactBand locale={locale} />
    </>
  );
}

function localizeWhoWeAreMarket(market: (typeof WHO_WE_ARE_MARKETS)[number], locale: Locale) {
  const translated = WHO_WE_ARE_MARKET_TRANSLATIONS[locale]?.[market.continent];
  return translated ? { ...market, ...translated } : market;
}

function localizeWhoWeAreHistory(locale: Locale) {
  const translated = WHO_WE_ARE_HISTORY_TRANSLATIONS[locale];
  if (!translated) return WHO_WE_ARE_HISTORY;
  return WHO_WE_ARE_HISTORY.map((item, index) => ({
    ...item,
    title: translated[index]?.title || item.title,
    description: translated[index]?.description || item.description,
  }));
}

function WhoWeAreMarketMarker({ market }: { market: (typeof WHO_WE_ARE_MARKETS)[number] }) {
  return (
    <dl className="group absolute" style={{ top: market.top, right: market.right }}>
      <dt className="relative">
        <span
          className="absolute right-full top-full z-[4] -mr-[3px] -mt-px block h-[38px] w-[219px] -translate-x-[10%] bg-white/90 text-center text-[22px] font-medium leading-[38px] text-[#1479c2] opacity-0 shadow-sm transition duration-700 group-hover:translate-x-0 group-hover:opacity-100"
        >
          {market.continent}
        </span>
        <span
          className="relative z-[3] block size-3.5 rounded-full [background:var(--dot-color)] after:absolute after:left-1/2 after:top-1/2 after:size-[23px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:opacity-50 after:[animation:intco-map-pulse_2s_infinite] after:[background:var(--dot-color)] before:absolute before:left-1/2 before:top-1/2 before:size-[33px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:opacity-40 before:[animation:intco-map-pulse-large_2s_infinite] before:[background:var(--dot-color)]"
          style={{ "--dot-color": market.color, transform: market.scale ? `scale(${market.scale})` : undefined } as React.CSSProperties}
        />
      </dt>
      <dd className="absolute right-full top-[52px] z-[4] w-[219px] -translate-x-[10%] text-lg leading-[30px] text-[#363636] opacity-0 transition duration-700 group-hover:translate-x-0 group-hover:opacity-100">
        {market.countries.map((country) => (
          <span key={country} className="mr-[15px] inline-block">
            {country}
          </span>
        ))}
        <span aria-hidden="true">...</span>
      </dd>
    </dl>
  );
}

function WhoWeArePartnerCard({ card, href, locale, large = false }: { card: (typeof WHO_WE_ARE_PARTNER_CARDS)[number]; href: string; locale: Locale; large?: boolean }) {
  const label = card.path === "/products" ? t(locale, "products") : card.path === "/solutions" ? t(locale, "solutions") : t(locale, "projects");
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-md ${large ? "aspect-[547/583]" : "aspect-[1033/375]"}`} data-reveal>
      <Image src={card.imageUrl} alt={label} fill className="object-cover transition duration-700 group-hover:scale-105" sizes={large ? "(min-width: 1024px) 42vw, 100vw" : "(min-width: 1024px) 58vw, 100vw"} />
      <span className="absolute inset-0 z-[3] bg-[rgba(72,70,83,0.2)] opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true" />
      <span className="absolute inset-0 z-10 block">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-2xl font-bold text-white">{label}</span>
        <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 pb-[49px] text-lg font-semibold text-white max-sm:pb-6">
          {t(locale, "readMore")} <ArrowRight size={22} />
        </span>
      </span>
    </Link>
  );
}

function SustainabilitySourceHero({ locale }: { locale: Locale }) {
  const labels = SUSTAINABILITY_LABELS[locale];
  return (
    <section className="relative aspect-[1920/600] min-h-[320px] overflow-hidden max-[650px]:min-h-0">
      <Image src={SUSTAINABILITY_HERO_IMAGE} alt="Sustainability1" fill className="object-cover" sizes="100vw" preload />
      <div className="absolute inset-0 bg-white/30" />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center max-[650px]:hidden">
        <div className="intco-source-container px-5 text-center text-white">
          <h1 className="text-[66px] font-semibold leading-none max-[1466px]:text-[40px] max-[650px]:text-[32px]">{t(locale, "sustainability")}</h1>
          <div className="mt-5 flex items-center justify-center gap-3 text-lg font-medium max-[650px]:text-base">
            <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
            <ArrowRight size={18} strokeWidth={1.8} />
            <span>{t(locale, "sustainability")}</span>
          </div>
          <div className="mt-7">
            <SustainabilityVideoButton src={SUSTAINABILITY_VIDEO_SRC} label={labels.watchVideo} title={labels.videoTitle} closeLabel={labels.closeVideo} />
          </div>
          <div className="mt-6 flex justify-center gap-[30px] max-sm:flex-col max-sm:items-center max-sm:gap-3">
            <LeadsCloudChatLink
              fallbackHref={localizePath(locale, "/contact#chat")}
              className="flex h-12 w-[232px] items-center justify-center rounded-[29px] border-2 border-[#484653] bg-white text-lg font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white"
            >
              {t(locale, "chatWithUs")}
            </LeadsCloudChatLink>
            <Link
              href={localizePath(locale, "/products/#goinput")}
              className="flex h-12 w-[232px] items-center justify-center rounded-[29px] border-2 border-[#484653] bg-white text-lg font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white"
            >
              {t(locale, "leaveMessage")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SustainabilitySourceTitle({ title, light = false }: { title: string; light?: boolean }) {
  return (
    <div className="relative text-center uppercase" data-reveal="fade">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-0 z-[2] -translate-x-1/2 whitespace-nowrap text-[70px] font-semibold leading-[39px] opacity-20 max-[1600px]:text-[46px] max-[650px]:hidden ${
          light ? "text-transparent [-webkit-text-stroke:1px_#fff]" : "text-white [-webkit-text-stroke:1px_#3d3d3d]"
        }`}
      >
        {title}
      </span>
      <h2
        className={`relative z-[3] mx-auto inline-block w-fit border-b pb-[47px] text-[45px] font-semibold leading-[39px] max-[1600px]:text-4xl max-[650px]:pb-2 max-[650px]:text-xl max-[650px]:leading-[1.3] ${
          light ? "border-white text-white" : "border-[#484653] text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d]"
        }`}
      >
        {title}
        <span className={`absolute bottom-0 left-1/2 h-[5px] w-[65px] -translate-x-1/2 translate-y-1/2 max-[650px]:h-0.5 max-[650px]:w-10 ${light ? "bg-white" : "bg-[#484653]"}`} />
      </h2>
    </div>
  );
}

function SustainabilityExternalRatings({ locale }: { locale: Locale }) {
  const labels = SUSTAINABILITY_LABELS[locale];
  return (
    <section className="bg-cover bg-center bg-no-repeat px-5 py-20 lg:pb-[100px]" style={{ backgroundImage: `url(${SUSTAINABILITY_EXTERNAL_BG})` }}>
      <div className="intco-source-container">
        <SustainabilitySourceTitle title={labels.externalRatings} light />
        <ul className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-[47px]" data-reveal="fade">
          {SUSTAINABILITY_EXTERNAL_IMAGES.slice(0, 3).map((image, index) => (
            <li key={image}>
              <Image src={image} alt={`External rating ${index + 1}`} width={360} height={460} className="h-auto w-full rounded-[10px]" sizes="(min-width: 1024px) 25vw, 50vw" />
            </li>
          ))}
          <li className="flex flex-col justify-between gap-8">
            {SUSTAINABILITY_EXTERNAL_IMAGES.slice(3).map((image, index) => (
              <Image key={image} src={image} alt={`External rating ${index + 4}`} width={360} height={210} className="h-auto w-full rounded-[10px]" sizes="(min-width: 1024px) 25vw, 50vw" />
            ))}
          </li>
        </ul>
      </div>
    </section>
  );
}

function SustainabilityTreeCard({ item, index }: { item: SustainabilityTreeItem; index: number }) {
  return (
    <li data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
      <div className="flex min-h-[211px] justify-between rounded-md bg-[#f3f3f3] pb-12 pl-10 pr-[49px] pt-3 max-lg:px-6">
        <div>
          <div className="flex items-center text-[#569654]">
            <span className="text-[90px] font-black leading-none max-lg:text-6xl">
              <CountUpStat value={item.value} />
            </span>
            <span className="ml-[18px] text-[34px] font-semibold text-[#484653] max-lg:text-2xl">{item.unit}</span>
          </div>
          <div className="mt-1 text-[26px] font-medium leading-none text-[#484653] max-lg:text-xl">{item.label}</div>
        </div>
        <div className="mt-[33px] flex max-w-[89px] flex-1 items-center">
          <div className="relative aspect-[22/19] max-w-[22px] flex-1">
            <Image src="https://cdn.sanity.io/images/vzcnnept/production/d0e5d645d1ed097e71a568d19049fda29431668b-22x19.png" alt="" fill className="object-contain" sizes="22px" />
          </div>
          <div className="relative mr-[11px] aspect-[89/119] max-w-[89px] flex-1">
            <Image src="https://cdn.sanity.io/images/vzcnnept/production/6fb71fe9e817ddfde1ef873d72cb66f0c7342012-89x119.png" alt="" fill className="object-contain" sizes="89px" />
          </div>
        </div>
      </div>
    </li>
  );
}

function SustainabilitySourceView({ locale }: { locale: Locale }) {
  const labels = SUSTAINABILITY_LABELS[locale];
  const introCopy = SUSTAINABILITY_INTRO_COPY[locale];
  const treeItems = SUSTAINABILITY_TREE_ITEMS_LOCALIZED[locale];
  const actionCards = localizedSustainabilityActionCards(locale);
  return (
    <>
      <span className="sr-only">{labels.inAction}</span>
      <SustainabilitySourceHero locale={locale} />

      <section className="bg-white px-5 pb-[100px] pt-[100px] max-[650px]:pb-8 max-[650px]:pt-5">
        <div className="intco-source-container">
          <div className="grid gap-[101px] lg:grid-cols-2">
            <div className="text-lg leading-[1.55] text-[#363636]" data-reveal="left">
              {introCopy.map((line) => (
                <p key={line} className="mb-10 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
            <div className="relative aspect-[680/400] w-full overflow-hidden rounded-md" data-reveal="right">
              <Image src={SUSTAINABILITY_INTRO_IMAGE} alt="Sustainability2" fill className="object-cover transition duration-700 hover:scale-105" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>

          <div className="mt-[90px] grid gap-0 lg:grid-cols-[49.125%_1fr]" data-reveal="fade">
            <div className="relative aspect-[786/399] overflow-hidden">
              <Image src={SUSTAINABILITY_REPORT_IMAGE} alt="Sustainability3" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="flex flex-col items-center justify-center rounded-r-md bg-white px-8 py-16 shadow-[0_11px_12px_1px_rgba(101,101,101,0.08)] max-lg:rounded-b-md max-lg:rounded-r-none">
              <h2 className="text-center text-[38px] font-semibold leading-[30px] text-[#484653] max-lg:text-3xl">ESG Report 2025</h2>
              <Link
                href={SUSTAINABILITY_REPORT_PDF}
                target="_blank"
                rel="noreferrer"
                className="mt-[50px] inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-700 hover:bg-[#484653] hover:text-white"
              >
                {labels.downloadPdf} <Download className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SustainabilityExternalRatings locale={locale} />

      <section className="bg-[#f3f3f3] pt-[100px]">
        <div className="intco-source-container px-5">
          <SustainabilitySourceTitle title={labels.environmentalContribution} />
          <p className="mx-auto mb-[86px] mt-16 max-w-[1320px] text-center text-lg leading-8 text-[#363636]" data-reveal="fade">
            {SUSTAINABILITY_ENVIRONMENTAL_COPY[locale]}
          </p>
        </div>
        <SustainabilitySavingsTabs locale={locale} />
      </section>

      <section className="bg-white px-5 pt-[100px]">
        <div className="intco-source-container">
          <SustainabilitySourceTitle title={labels.protectTree} />
          <ul className="mt-16 grid gap-12 lg:grid-cols-3">
            {treeItems.map((item, index) => (
              <SustainabilityTreeCard key={item.label} item={item} index={index} />
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-[100px] bg-[#f3f3f3] px-5 pb-[100px] pt-[100px]">
        <div className="intco-source-container">
          <SustainabilitySourceTitle title={labels.inAction} />
          <ul className="mt-16 grid gap-[55px] lg:grid-cols-3">
            {actionCards.map((card, index) => (
              <li key={card.title} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <div className="group relative aspect-[436/300] overflow-hidden">
                  <Image src={card.imageUrl} alt={card.title} fill className="object-cover transition duration-700 group-hover:scale-110" sizes="(min-width: 1024px) 33vw, 100vw" />
                </div>
                <h2 className="mb-[39px] mt-11 text-[30px] font-semibold leading-[1.35] text-[#363636] max-lg:text-2xl">{card.title}</h2>
                <p className="text-lg leading-[1.55] text-[#363636]">{card.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function PhilosophySourceTitle({ title, align = "center" }: { title: string; align?: "left" | "center" }) {
  const centered = align === "center";
  return (
    <div className={`relative uppercase ${centered ? "text-center" : "text-left"}`} data-reveal={centered ? "fade" : "left"}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 z-[2] text-[70px] font-semibold leading-[39px] text-white opacity-20 [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-[46px] max-[650px]:hidden ${
          centered ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : "left-0 max-w-[80%] whitespace-normal"
        }`}
      >
        {title}
      </span>
      <h2
        className={`relative z-[3] inline-block border-b border-[#484653] pb-[47px] text-[45px] font-semibold leading-[39px] text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-4xl max-[650px]:pb-3 max-[650px]:text-2xl max-[650px]:leading-[1.25] ${
          centered ? "mx-auto" : "max-w-[80%] text-left max-lg:max-w-full"
        }`}
      >
        {title}
        <span className={`absolute bottom-0 h-[5px] w-[65px] translate-y-1/2 bg-[#484653] max-[650px]:h-0.5 max-[650px]:w-10 ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`} />
      </h2>
    </div>
  );
}

function PhilosophyValueCard({ item, index }: { item: PhilosophyValue; index: number }) {
  return (
    <li className={`${index % 2 === 1 ? "lg:border-l-2 lg:border-[#bdbdbd]" : ""} mb-[70px]`} data-reveal style={{ "--reveal-delay": `${(index % 2) * 80}ms` } as React.CSSProperties}>
      <div className="flex gap-6 pl-[74px] max-lg:pl-4 max-sm:flex-col">
        <div className="w-full max-w-[116px] shrink-0">
          <div className="relative aspect-square transition duration-300 group-hover:-translate-y-2">
            <Image src={item.imageUrl} alt={item.title} fill className="object-contain transition duration-300 hover:-translate-y-2" sizes="116px" />
          </div>
        </div>
        <div className="flex-1 pr-6">
          <h3 className="mb-[18px] mt-4 text-[28px] font-semibold leading-[30px] text-[#484653]">{item.title}</h3>
          <div className="text-base leading-6 text-[#363636]">
            <p>{item.body}</p>
            {item.details?.map((detail) => (
              <p key={detail}>{detail}</p>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

function PhilosophyGalleryTile({ imageUrl, label, locale }: { imageUrl: string; label?: string; locale: Locale }) {
  const displayLabel = label === "WORLD CLASS CUSTOMER SERVICE" ? t(locale, "worldClassCustomerService") : label === "MEET THE TEAM" ? SUSTAINABILITY_LABELS[locale].meetTeam : label;
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-[3px]" data-reveal>
      <div className="relative aspect-[861/402]">
        <Image src={imageUrl} alt={displayLabel || "Philosophy"} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <span className="absolute inset-0 z-[2] bg-black/0 transition duration-700 group-hover:bg-black/45" aria-hidden="true" />
      {displayLabel ? (
        <span className="absolute bottom-[35px] left-[41px] z-[3] text-white">
          <span className="block text-lg leading-7">{displayLabel}</span>
        </span>
      ) : null}
    </div>
  );
}

function PhilosophyResponsibilityTile({
  imageUrl,
  duty,
  title,
  priority,
}: {
  imageUrl: string;
  duty: string;
  title: string;
  priority?: boolean;
}) {
  return (
    <div className="group relative h-full cursor-pointer overflow-hidden rounded-[3px]" data-reveal>
      <div className={`relative ${priority ? "aspect-[1015/669]" : "aspect-[674/328]"} max-lg:aspect-[861/402]`}>
        <Image src={imageUrl} alt={title} fill className="object-cover" sizes={priority ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"} />
      </div>
      <span className="absolute inset-0 z-[2] bg-black/45 transition duration-700 group-hover:bg-black/55" aria-hidden="true" />
      <span className="absolute bottom-[47px] left-[50px] z-[3] max-w-[calc(100%-80px)] text-white max-lg:bottom-8 max-lg:left-8 max-sm:bottom-6 max-sm:left-6">
        <span className="block text-[24px] font-normal leading-[1.25] max-sm:text-lg">{duty}</span>
        <span className="mt-[8px] block text-[30px] font-semibold leading-[1.15] max-sm:text-[22px]">{title}</span>
      </span>
    </div>
  );
}

function PhilosophySourceView({ locale }: { locale: Locale }) {
  const values = localizedPhilosophyValues(locale);
  const responsibilityCopy = values[5]?.details || PHILOSOPHY_VALUES[5].details || [];
  return (
    <>
      <span className="sr-only">{t(locale, "philosophy")} | INTCO Framing</span>
      <SolutionsSourceHero title={t(locale, "philosophy")} locale={locale} imageUrl={PHILOSOPHY_HERO_IMAGE} imageAlt={t(locale, "philosophy")} tone="dark" />

      <section className="bg-white bg-center bg-no-repeat pt-[99px] max-lg:pt-10" style={{ backgroundImage: `url(${PHILOSOPHY_BG})` }}>
        <div className="intco-source-container px-5">
          <div className="relative">
            <div className="absolute -left-7 top-[18px] h-full w-[96.625%] rounded-md bg-white shadow-[0_2px_27px_0_rgba(114,114,114,0.2)] max-lg:hidden" />
            <div className="relative z-[2] flex justify-center rounded-md bg-white py-[58px] pb-12 shadow-[0_2px_27px_0_rgba(114,114,114,0.2)] max-lg:flex-col max-lg:px-6">
              <div className="w-full max-w-[641px]" data-reveal="left">
                <div className="relative aspect-[641/553]">
                  <Image src={PHILOSOPHY_CEO_IMAGE} alt="Frank Liu" fill className="object-contain" sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
              </div>
              <div className="relative flex-1 pb-[150px] pl-[159px] pr-[91px] pt-[99px] max-lg:p-8" data-reveal="right">
                <div className="absolute left-[94px] top-[89px] w-8 max-lg:hidden">
                  <div className="relative aspect-[32/29]">
                    <Image src={PHILOSOPHY_QUOTE_TOP} alt="" fill className="object-contain" sizes="32px" />
                  </div>
                </div>
                <p className="max-w-[481px] text-lg leading-[1.68] text-[#363636]">{PHILOSOPHY_QUOTE[locale]}</p>
                <p className="mt-[100px] w-full text-right text-2xl font-semibold leading-[30px] text-[#484653] max-lg:mt-10">—— Frank Liu，CEO</p>
                <div className="absolute bottom-0 right-[91px] w-full max-w-[310px] max-lg:hidden">
                  <div className="relative aspect-[310/272]">
                    <Image src={PHILOSOPHY_QUOTE_BOTTOM} alt="" fill className="object-contain" sizes="310px" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[100px]">
            <PhilosophySourceTitle title={t(locale, "philosophy").toUpperCase()} />
            <ul className="mt-[70px] grid lg:grid-cols-2">
              {values.map((item, index) => (
                <PhilosophyValueCard key={item.title} item={item} index={index} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white pt-[94px] max-lg:pt-8">
        <div className="mx-auto w-[calc(100%-88px)] max-w-[1980px] max-lg:w-[calc(100%-40px)]">
          <div className="flex gap-[14px] max-lg:flex-col">
            <div className="w-[59.62%] max-lg:w-full">
              <PhilosophyResponsibilityTile
                imageUrl={PHILOSOPHY_RESPONSIBILITY_CARDS[0].imageUrl}
                duty={responsibilityCopy[PHILOSOPHY_RESPONSIBILITY_CARDS[0].dutyIndex] || ""}
                title={responsibilityCopy[PHILOSOPHY_RESPONSIBILITY_CARDS[0].titleIndex] || ""}
                priority
              />
            </div>
            <div className="flex flex-1 flex-col gap-[14px]">
              {PHILOSOPHY_RESPONSIBILITY_CARDS.slice(1).map((item) => (
                <PhilosophyResponsibilityTile
                  key={item.imageUrl}
                  imageUrl={item.imageUrl}
                  duty={responsibilityCopy[item.dutyIndex] || ""}
                  title={responsibilityCopy[item.titleIndex] || ""}
                />
              ))}
            </div>
          </div>
          <ul className="mt-[13px] grid gap-3 lg:grid-cols-2">
            {PHILOSOPHY_GALLERY_TOP.map((item) => (
              <li key={item.imageUrl}>
                <PhilosophyGalleryTile imageUrl={item.imageUrl} label={item.label} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden bg-white pt-[200px] max-[1600px]:pt-[100px] max-lg:pt-16">
        <div className="flex bg-center bg-no-repeat py-[162px] pb-[121px] max-lg:flex-col max-lg:py-0" style={{ backgroundImage: `url(${PHILOSOPHY_CENTER_BG})` }}>
          <div className="w-[65.7%] max-lg:w-full" data-reveal="left">
            <div className="relative aspect-[1261/682] overflow-hidden">
              <Image src={PHILOSOPHY_TEAM_IMAGE} alt={SUSTAINABILITY_LABELS[locale].meetTeam} fill className="object-cover" sizes="(min-width: 1024px) 66vw, 100vw" />
            </div>
          </div>
          <div className="ml-[120px] max-w-[460px] pt-28 max-[1600px]:mx-[50px] max-lg:m-0 max-lg:max-w-none max-lg:bg-white max-lg:p-8" data-reveal="right">
            <h2 className="text-[34px] font-semibold leading-none text-[#484653]">{SUSTAINABILITY_LABELS[locale].years}</h2>
            <div className="mb-[65px] mt-[31px] h-0.5 w-full bg-[#484653] max-lg:mb-6" />
            <p className="max-w-[374px] text-lg leading-[1.68] text-[#363636] max-lg:max-w-none">
              {t(locale, "philosophyCustomerService")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f3f3] pb-[100px] pt-[100px] max-lg:py-16">
        <div className="relative mx-auto box-border w-[71.61%] max-w-[calc(100%-430px)] bg-white py-[107px] pb-[98px] pl-[103px] max-lg:w-full max-lg:max-w-full max-lg:px-8 max-lg:py-12">
          <div className="max-w-[80%] max-lg:max-w-full" data-reveal="left">
            <PhilosophySourceTitle title={t(locale, "doNotHesitate")} align="left" />
            <span className="sr-only">{t(locale, "getInTouch")}</span>
            <p className="mt-8 max-w-[80%] text-lg leading-[1.68] text-[#363636] max-lg:max-w-full">{t(locale, "contactFormIntro")}</p>
            <Link
              href={localizePath(locale, "/contact")}
              className="mt-12 inline-flex h-[58px] w-[200px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-700 hover:bg-[#484653] hover:text-white"
            >
              {t(locale, "contactUs")} <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          <div className="absolute right-[6%] top-6 z-[3] w-full max-w-[428px] translate-x-[41%] max-lg:hidden" data-reveal="right">
            <div className="relative aspect-square">
              <Image src={PHILOSOPHY_CONTACT_IMAGE} alt={t(locale, "contactUs")} fill className="object-contain" sizes="428px" />
            </div>
            <div className="absolute -bottom-8 right-[68px] w-full max-w-[138px]">
              <div className="relative aspect-square">
                <Image src={PHILOSOPHY_QUOTE_BOTTOM} alt="" fill className="object-contain" sizes="138px" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ContentPageView({ page, locale }: { page: ContentPage; locale: Locale }) {
  if (page.path === "/who-we-are") {
    return <WhoWeAreSourceView page={page} locale={locale} />;
  }

  if (page.path === "/who-we-are/sustainability") {
    return <SustainabilitySourceView locale={locale} />;
  }

  if (page.path === "/who-we-are/philosophy") {
    return <PhilosophySourceView locale={locale} />;
  }

  return <DetailView item={page} label="INTCO" locale={locale} />;
}

const privacyPolicySections = [
  {
    title: "Information We Collect",
    body: [
      "We may collect contact details that you choose to provide, such as name, company name, email address, phone number, country or region, product interests, and messages submitted through enquiry, newsletter, chat, catalogue download, or contact forms.",
      "We may also collect technical information when you use the website, including IP address, device and browser information, pages viewed, referring pages, approximate location, and cookie or similar technology data.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use information to respond to enquiries, provide product and project information, process sample or quotation requests, improve website performance, measure content effectiveness, protect the website, and communicate with customers and prospects.",
      "If you subscribe to updates or request marketing information, we may use your contact details to send relevant product, service, or company communications. You can ask us to stop these communications at any time.",
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    body: [
      "The website may use cookies and similar technologies to remember preferences, support website functions, understand traffic, and improve the visitor experience. You can manage cookies through your browser settings. Some website features may not work correctly if cookies are disabled.",
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We may share information with service providers that help us operate the website, manage enquiries, provide customer support, host data, analyze traffic, send communications, or support business operations.",
      "We may also disclose information if required by law, to protect our rights, to prevent misuse of the website, or as part of a business transaction involving INTCO Framing.",
    ],
  },
  {
    title: "Data Retention and Security",
    body: [
      "We keep personal information only for as long as needed for the purposes described in this policy, unless a longer retention period is required or permitted by law.",
      "We use reasonable administrative, technical, and organizational measures to protect information. No website, transmission method, or storage system can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "International Visitors",
    body: [
      "INTCO Framing works with customers and partners in multiple countries and regions. Information submitted through the website may be processed in locations different from where you live, subject to applicable legal requirements.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may contact us to request access, correction, deletion, or other handling of personal information that you have provided to us, subject to applicable law and verification requirements.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "For privacy questions or requests, contact us at info@intcoframing-us.com or through the contact page on this website.",
    ],
  },
];

export function PrivacyPolicyView({ locale }: { locale: Locale }) {
  return (
    <div className="bg-white">
      <section className="bg-[#f4f4f1] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <nav className="mb-8 flex items-center gap-3 text-sm font-semibold text-[#484653]" aria-label="Breadcrumb">
            <Link href={localizePath(locale, "/")}>{t(locale, "home")}</Link>
            <span aria-hidden="true">/</span>
            <span>{t(locale, "privacyPolicy")}</span>
          </nav>
          <p className="text-sm font-bold uppercase text-[#727272]">INTCO Framing</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#242331] sm:text-5xl">{t(locale, "privacyPolicy")}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#555] sm:text-lg">
            This policy explains how INTCO Framing collects, uses, shares, and protects information when you visit this website or contact us through the website.
          </p>
          <p className="mt-5 text-sm font-semibold text-[#484653]">Last updated: June 17, 2026</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="space-y-10">
            {privacyPolicySections.map((section) => (
              <section key={section.title} className="border-b border-neutral-200 pb-9 last:border-b-0 last:pb-0">
                <h2 className="text-2xl font-semibold leading-tight text-[#242331]">{section.title}</h2>
                <div className="mt-5 space-y-4 text-base leading-8 text-[#555]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>

          <aside className="h-fit border-l-4 border-[#484653] bg-[#f8f8f6] p-6">
            <h2 className="text-lg font-semibold text-[#242331]">Privacy Contact</h2>
            <p className="mt-3 text-sm leading-6 text-[#555]">For privacy requests, email us or use the contact page.</p>
            <a className="mt-5 block text-sm font-semibold text-[#484653] underline underline-offset-4" href="mailto:info@intcoframing-us.com">
              info@intcoframing-us.com
            </a>
            <Link className="mt-3 block text-sm font-semibold text-[#484653] underline underline-offset-4" href={localizePath(locale, "/contact")}>
              {t(locale, "contact")}
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

export function ContactView({ locale }: { page: ContentPage; locale: Locale }) {
  return (
    <div className="intco-contact-source-page">
      <ContactSourceHero locale={locale} />
      <ContactMapTabs factories={localizedContactFactories(locale)} locale={locale} />
      <ContactSupportSection locale={locale} />
      <ContactSampleSection locale={locale} />
    </div>
  );
}

function ContactSourceHero({ locale }: { locale: Locale }) {
  return (
    <section className="intco-source-hero intco-source-hero-category intco-contact-hero" data-source-hero>
      <div className="intco-source-hero-slide" data-source-hero-slide>
        <div className="intco-source-hero-bg" data-source-hero-bg>
          <Image src={CONTACT_HERO_IMAGE} alt="lxwm" fill preload unoptimized className="object-cover" sizes="100vw" />
        </div>
        <div className="intco-source-hero-content" data-source-hero-content>
          <div className="intco-source-container intco-source-hero-inner px-5 min-[1601px]:px-0">
            <div className="intco-source-hero-text" data-source-hero-text>
              <h1 className="intco-source-hero-title" data-source-hero-title>
                {t(locale, "contact")}
              </h1>
              <nav className="intco-source-hero-crumbs" data-source-hero-crumbs aria-label="Breadcrumb">
                <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
                <span className="intco-source-hero-separator">›</span>
                <span>{t(locale, "contact")}</span>
              </nav>
            </div>
            <div className="intco-source-hero-actions" data-source-hero-actions>
              <LeadsCloudChatLink fallbackHref="#chat" data-source-hero-cta>
                {t(locale, "chatWithUs")}
              </LeadsCloudChatLink>
              <a href={localizePath(locale, "/products/#goinput")} data-source-hero-cta>
                {t(locale, "leaveMessage")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSupportSection({ locale }: { locale: Locale }) {
  const contacts = [
    {
      title: t(locale, "telephone"),
      description: (
        <>
          <a href="https://api.whatsapp.com/send?phone=8613371591392&text=Hello" target="_blank" rel="noopener noreferrer">
            +86 13371591392
          </a>
          <br />
          <a href="https://api.whatsapp.com/send?phone=8617753315610&text=Hello" target="_blank" rel="noopener noreferrer">
            +86 17753315610
          </a>
        </>
      ),
      action: t(locale, "callNow"),
      href: "https://api.whatsapp.com/send?phone=8613371591392&text=Hello",
      iconClass: "intco-source-icon-phone",
    },
    {
      title: t(locale, "liveChat"),
      description: null,
      action: t(locale, "contactNow"),
      href: "#chat",
      iconClass: "intco-source-icon-service",
    },
    {
      title: t(locale, "sendEmail"),
      description: <a href="mailto:info@intcoframing-us.com">info@intcoframing-us.com</a>,
      action: t(locale, "emailUs"),
      href: "mailto:info@intcoframing-us.com",
      iconClass: "intco-source-icon-email",
    },
  ];

  return (
    <section id="chat" className="intco-contact-index intco-contact-support-section">
      <div className="intco-source-container px-5 min-[1601px]:px-0">
        <p className="intco-contact-desc intco-contact-desc-center" data-reveal="fade">
          {t(locale, "contactSupportIntro")}
        </p>
        <ul className="intco-contact-list intco-contact-support-list">
          {contacts.map((contact, index) => (
            <li key={contact.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
              <i className={`intco-source-iconfont ${contact.iconClass}`} aria-hidden="true" />
              <div className="intco-contact-center-item">
                <div className="intco-contact-item-title">{contact.title}</div>
                <div className="intco-contact-item-desc">{contact.description}</div>
              </div>
              {contact.href === "#chat" ? (
                <LeadsCloudChatLink fallbackHref="#chat" className="intco-contact-view-button">
                  <span>{contact.action}</span>
                </LeadsCloudChatLink>
              ) : (
                <a href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined} className="intco-contact-view-button">
                  <span>{contact.action}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ContactSampleSection({ locale }: { locale: Locale }) {
  const intro = t(locale, "contactFormIntro");
  const contactIntro =
    locale === "en" ? (
      <>
        Don&apos;t Hesitate to Reach Us
        <br />
        We are always here to address all your concerns and provide solutions.
      </>
    ) : (
      intro
    );

  return (
    <section id="goinput" className="index-message-grid contact-index intco-contact-index intco-contact-message-section">
      <div className="intco-source-container px-5 min-[1601px]:px-0">
        <div className="selefTitle intco-product-source-title intco-contact-sample-title margin55" data-source-title data-tit={t(locale, "orderSample")}>
          <h2 className="title_text" data-source-title-text>
            {t(locale, "orderSample")}
          </h2>
        </div>
        <div className="DESC leftTitle margin55 intco-contact-form-desc" data-reveal="fade">
          {contactIntro}
        </div>
        <div className="msg-grid intco-contact-message-grid">
          <div className="text intco-contact-form" data-reveal="source-down">
            <HubSpotMainInquiryForm locale={locale} />
          </div>
          <div className="imgshow intco-contact-form-image-wrap" data-reveal="source-up">
            <div className="intco-contact-form-image">
              <Image src={CONTACT_FORM_IMAGE} alt="" fill className="object-cover" sizes="(min-width: 1024px) 509px, 80vw" />
            </div>
            <div className="intco-contact-form-badge">
              <Image src={CONTACT_FORM_BADGE_IMAGE} alt="" fill className="object-cover" sizes="163px" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBand({ locale }: { locale: Locale }) {
  return (
    <section className="bg-neutral-950 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div data-reveal="left">
          <p className="text-sm font-bold uppercase text-emerald-300">{t(locale, "getInTouch")}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold">{t(locale, "perfectSolution")}</h2>
          <p className="mt-3 text-pretty text-white/70">{t(locale, "contactToday")}</p>
        </div>
        <Link href={localizePath(locale, "/contact")} className="inline-flex w-fit items-center gap-2 bg-white px-6 py-3 text-sm font-bold uppercase text-neutral-950 transition duration-200 hover:-translate-y-0.5" data-reveal="right">
          {t(locale, "contactUs")} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function ServicesBand({ locale }: { locale: Locale }) {
  const services = [
    { title: t(locale, "designEngineering"), description: t(locale, "serviceDesignDescription"), icon: Ruler },
    { title: t(locale, "qualityManufacturing"), description: t(locale, "serviceQualityDescription"), icon: Factory },
    { title: t(locale, "globalDelivery"), description: t(locale, "serviceDeliveryDescription"), icon: PackageCheck },
  ];

  return (
    <section className="bg-neutral-950 py-16 text-white">
      <SectionTitle eyebrow={t(locale, "servicesWeProvide")} title={t(locale, "servicesWeOffer")} dark />
      <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div key={service.title} className="bg-white/5 p-6 ring-1 ring-white/10" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <div className="flex size-12 items-center justify-center bg-emerald-700 text-white">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 text-balance text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-pretty text-sm leading-7 text-white/70">{service.description}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <Link href={localizePath(locale, "/solutions")} className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm font-bold uppercase transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950">
          {t(locale, "exploreMore")} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function RelatedGrid({ title, items, locale, kind }: { title: string; items: Array<Product | Project>; locale: Locale; kind: "product" | "project" }) {
  return (
    <div>
      <SectionTitle eyebrow={t(locale, "youMayAlsoLike")} title={title} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) =>
          kind === "product" ? (
            <ProductCard key={item.slug} product={item as Product} locale={locale} />
          ) : (
            <ImageCard key={item.slug} href={localizePath(locale, item.path)} title={item.title} label={"category" in item ? item.category : undefined} imageUrl={item.imageUrl} alt={item.imageAlt} locale={locale} />
          )
        )}
      </div>
    </div>
  );
}

function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} prefetch={true}>
      {children}
    </Link>
  );
}

function PageHero({ title, description, imageUrl, label }: { title: string; description?: string; imageUrl?: string; label?: string }) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {imageUrl ? <Image src={imageUrl} alt={title} fill className="object-cover opacity-55" sizes="100vw" preload /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.38))]" />
      <div className="intco-page-hero-copy relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">{label || "INTCO Framing"}</p>
        <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold sm:text-6xl">{title}</h1>
        {description ? <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-white/85">{description}</p> : null}
      </div>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  dark,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <p className={`text-sm font-bold uppercase tracking-[0.28em] ${dark ? "text-emerald-300" : "text-emerald-700"}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-balance text-3xl font-semibold sm:text-5xl ${dark ? "text-white" : "text-neutral-950"}`}>{title}</h2>
      {description ? <p className={`mx-auto mt-4 max-w-3xl text-pretty text-lg leading-8 ${dark ? "text-white/70" : "text-neutral-600"}`}>{description}</p> : null}
    </div>
  );
}

function CategoryCard({ category, locale }: { category: ProductCategory; locale: Locale }) {
  return (
    <Link href={localizePath(locale, category.path)} className="group block h-full overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[5/4] overflow-hidden bg-neutral-100">
        {category.imageUrl || category.navImageUrl ? (
          <Image
            src={category.imageUrl || category.navImageUrl || ""}
            alt={category.imageAlt || category.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(min-width: 1024px) 20vw, 50vw"
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded border border-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-white">
            {t(locale, "exploreMore")} <ArrowRight size={16} />
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-balance text-xl font-semibold text-neutral-950">{category.title}</h3>
        <p className="mt-3 line-clamp-3 text-pretty text-sm leading-6 text-neutral-600">{category.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700 transition-transform duration-200 group-hover:translate-x-1">
          {t(locale, "exploreMore")} <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const imageUrl = preferredImage(product);
  return (
    <Link href={localizePath(locale, product.path)} className="group block h-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.imageAlt || product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(min-width: 1024px) 25vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm font-semibold text-neutral-400">{product.title}</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-balance text-lg font-semibold leading-7 text-neutral-950">{product.title}</h3>
        <p className="mt-3 line-clamp-3 text-pretty text-sm leading-6 text-neutral-600">{product.description}</p>
      </div>
    </Link>
  );
}

function ImageCard({
  href,
  title,
  label,
  imageUrl,
  alt,
  locale,
}: {
  href: string;
  title: string;
  label?: string;
  imageUrl?: string;
  alt?: string;
  locale: Locale;
}) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-neutral-800">
      {imageUrl ? <Image src={imageUrl} alt={alt || title} fill className="object-cover opacity-75 transition duration-500 group-hover:scale-110 group-hover:opacity-90" sizes="(min-width: 1024px) 25vw, 50vw" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-5 flex items-center justify-center bg-white/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-800">
          {t(locale, "exploreMore")} <ArrowRight size={16} />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white transition-transform duration-300 group-hover:-translate-y-2">
        {label ? <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{label}</p> : null}
        <h3 className="mt-2 text-balance text-2xl font-semibold">{title}</h3>
      </div>
    </Link>
  );
}

function BlogCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  return (
    <Link href={localizePath(locale, post.path)} className="group block h-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(min-width: 1024px) 33vw, 50vw" />
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wide text-emerald-700">
          <span>{post.category || "Inspiration"}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-balance text-xl font-semibold leading-7 text-neutral-950">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-pretty text-sm leading-6 text-neutral-600">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function contentLines(bodyText?: string, max = 80) {
  const noise = new Set(["Blog", '">', ">", "-", "+", '" alt="', '"/>']);
  const lines = (bodyText || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.length > 1 || /^[A-Za-z0-9]$/.test(line))
    .filter((line) => !noise.has(line))
    .filter((line) => !isSourceNoiseLine(line))
    .filter((line) => !line.startsWith("We use cookies"))
    .filter((line, index, list) => list.indexOf(line) === index);

  return lines.slice(0, max);
}

const sourceNoiseFragments = [
  "undefined array key",
  "clave de matriz",
  "chave de matriz",
  "clé de tableau",
  "undefinierter array",
  "未定義の配列キー",
  "attempt to read property",
  "themes/chengpin",
  "services we provide",
  "servicios que ofrecemos",
  "serviços que oferecemos",
  "services que nous proposons",
  "dienstleistungen, die wir bieten",
  "当社が提供するサービス",
  "qingtian",
  "zibo, shandong",
  "previous",
  "popular posts",
  "entradas populares",
  "postagens populares",
  "articles populaires",
  "beliebte beiträge",
  "人気の投稿",
];

function isSourceNoiseLine(line: string) {
  const lowered = line.toLowerCase();
  return (
    line === "Warning" ||
    lowered === "blogue" ||
    lowered === "ブログ" ||
    lowered.includes("cookie") ||
    sourceNoiseFragments.some((fragment) => lowered.includes(fragment)) ||
    lowered === "on line"
  );
}

function blogSourceSupplementLines(slug: string) {
  const supplements: Record<string, string[]> = {
    "canvas-art-a-perfect-addition-to-your-home-decor": ["Why Choose Canvas Art for Your Home?"],
    "vanity-mirror-trends-analyzing-modern-designs-and-features": ["Popular Vanity Mirror Styles in 202 5"],
    "framing-the-future-a-comprehensive-guide-to-a-paper-sizes": ["What to Consider When Buying an A-Size Frame", "Find Any Size Frame Online, Including All A-Paper Sizes"],
    "how-does-a-magnetic-memo-board-enhance-your-workspace-efficiency": ["How to Maximize the Benefits of a magnetic memo board ?"],
    "how-mirror-thickness-impacts-bedroom-visual-appeal": [
      "The Role of mirror s in Enhancing Bedroom Aesthetics",
      "How mirror Depth Influences Room Appearance",
      "Practical Benefits of Various mirror thickness es in Bedrooms",
    ],
    "exploring-the-appeal-of-plastic-picture-frames": [
      "Advantages of Using P lastic P icture F rames in Modern Interiors",
      "Living Room Enhancements with plastic picture frames",
      "Dining Room Accents with picture frames",
      "Integrating plastic picture frames with Existing Decor",
    ],
  };
  return supplements[slug] || [];
}

function containsRenderedLine(lines: string[], needle: string) {
  const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();
  return normalize(lines.join(" ")).includes(normalize(needle));
}

function extractAfter(lines: string[], marker: string, count: number) {
  const index = lines.findIndex((line) => line.toLowerCase() === marker.toLowerCase() || line.toLowerCase().includes(marker.toLowerCase()));
  return index >= 0 ? lines.slice(index + 1, index + 1 + count) : [];
}

function extractBetween(lines: string[], startMarker: string, endMarker: string) {
  const start = lines.findIndex((line) => line.toLowerCase() === startMarker.toLowerCase());
  if (start < 0) return [];
  const end = lines.findIndex((line, index) => index > start && line.toLowerCase() === endMarker.toLowerCase());
  return lines.slice(start + 1, end > start ? end : undefined);
}

function blogDateFor(lines: string[], title: string) {
  const index = lines.findIndex((line) => line === title);
  if (index < 0) return "";
  return lines.slice(index + 1, index + 4).find((line) => /^[A-Z][a-z]{2} \d{2}, \d{4}$/.test(line)) || "";
}

function preferredImage(item: ImageLike) {
  const gallery = (item.galleryUrls || []).filter(Boolean);
  if (item.imageUrl && !looksGenericImage(item.imageUrl)) return item.imageUrl;
  return gallery.find((image) => !looksGenericImage(image)) || item.imageUrl || item.navImageUrl || "";
}

function itemGallery(item: ImageLike) {
  const urls = [preferredImage(item), ...(item.galleryUrls || []), item.imageUrl || item.navImageUrl || ""].filter(Boolean);
  return Array.from(new Set(urls));
}

function looksGenericImage(url?: string) {
  return !url || /\/products\.png($|\?)/.test(url) || url === PRODUCTS_HERO_IMAGE;
}

function isProductCdnImage(url?: string) {
  if (!url) return false;
  try {
    return new URL(url).hostname === "cdn.sanity.io";
  } catch {
    return false;
  }
}

function parseProductDetails(product: Product, locale: Locale) {
  const lines = contentLines(product.bodyText, 140);
  const specLabels = productSpecLabels(locale);
  const displayTitle = product.title || lines[0] || "";
  const itemNumber = valueAfterLabel(lines, ["Item#:", "Item #:", "Item#:"]);
  const color = valueAfterLabel(lines, ["Color:"]);
  const sizes = valuesAfterLabel(lines, ["Size:"]);
  const subject = valueAfterLabel(lines, ["Subject:"]);
  const material = valueAfterLabel(lines, ["Material:"]);
  const highlightStart = lines.findIndex((line) => /^Highlights$/i.test(line));
  const relatedStart = lines.findIndex((line) => /^Related Products$/i.test(line));
  const serviceStart = lines.findIndex((line) => /^SERVICES WE PROVIDE$/i.test(line));
  const end = [relatedStart, serviceStart].filter((index) => index > highlightStart).sort((a, b) => a - b)[0] || lines.length;
  const detailLines = highlightStart >= 0 ? lines.slice(highlightStart + 1, end) : linesFromBody(product.bodyText, 8);
  const descriptionLines = detailLines.slice(0, 1);
  const highlightLines = detailLines.slice(1).filter((line) => !/^Description$/i.test(line));
  const specs = [
    { label: specLabels.itemNumber, value: itemNumber },
    ...(subject ? [{ label: specLabels.subject, value: subject }] : []),
    ...(material ? [{ label: specLabels.material, value: material }] : []),
    { label: specLabels.color, value: color },
    { label: specLabels.size, value: sizes.join(" / ") },
    { label: `${t(locale, "quantity")}:`, value: "- / +" },
  ];
  const firstSpecIndex = lines.findIndex((line) => /^Item\s?#:\s*$/i.test(line));
  const bestSellerLines = firstSpecIndex > 1 ? lines.slice(1, firstSpecIndex) : [];
  const bestSellerPairs: Array<{ title: string; itemNumber: string }> = [];
  for (let index = 1; index < bestSellerLines.length; index += 1) {
    const item = bestSellerLines[index];
    if (/^Item\s?#:/i.test(item || "")) {
      const title = bestSellerLines[index - 1];
      if (title) bestSellerPairs.push({ title, itemNumber: item });
    }
  }

  return { specs, descriptionLines, highlightLines, bestSellerPairs, displayTitle };
}

function productSpecLabels(locale: Locale) {
  const labels: Record<Locale, { itemNumber: string; subject: string; material: string; color: string; size: string }> = {
    en: { itemNumber: "Item#:", subject: "Subject:", material: "Material:", color: "Color:", size: "Size:" },
    es: { itemNumber: "Artículo #:", subject: "Tema:", material: "Material:", color: "Color:", size: "Tamaño:" },
    pt: { itemNumber: "Item #:", subject: "Tema:", material: "Material:", color: "Cor:", size: "Tamanho:" },
    fr: { itemNumber: "Réf. :", subject: "Sujet :", material: "Matériau :", color: "Couleur :", size: "Dimensions :" },
    de: { itemNumber: "Art.-Nr.:", subject: "Motiv:", material: "Material:", color: "Farbe:", size: "Größe:" },
    ja: { itemNumber: "品番:", subject: "テーマ:", material: "素材:", color: "カラー:", size: "サイズ:" },
  };
  return labels[locale];
}

function valueAfterLabel(lines: string[], labels: string[]) {
  return valuesAfterLabel(lines, labels)[0] || "";
}

function valuesAfterLabel(lines: string[], labels: string[]) {
  const normalizedLabels = labels.map((label) => label.replace(/\s+/g, "").toLowerCase());
  const aboutIndex = lines.findIndex((line) => /^ABOUT THIS ITEM$/i.test(line));
  const searchable = aboutIndex > 0 ? lines.slice(0, aboutIndex) : lines;
  const matches = searchable
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => normalizedLabels.some((label) => line.replace(/\s+/g, "").toLowerCase().startsWith(label)));
  const index = matches.at(-1)?.index ?? -1;
  if (index < 0) return [];
  const inline = lines[index].split(/[:：]/).slice(1).join(":").trim();
  if (inline) return [inline];
  const values: string[] = [];
  for (const next of lines.slice(index + 1)) {
    if (/^(Item|Color|Size|Subject|Quantity|ABOUT THIS ITEM|Description|Highlights|Related Products)/i.test(next)) break;
    values.push(next);
  }
  return values;
}

function sectionize(lines: string[]) {
  const sections: Array<{ title: string; body: string[] }> = [];
  let current: { title: string; body: string[] } | null = null;

  lines.forEach((line) => {
    if (looksLikeHeading(line)) {
      current = { title: line, body: [] };
      sections.push(current);
      return;
    }
    if (!current) {
      current = { title: "Overview", body: [] };
      sections.push(current);
    }
    current.body.push(line);
  });

  return sections.filter((section) => section.body.length || section.title !== "Overview");
}

function looksLikeHeading(line: string) {
  const known = new Set([
    "ABOUT US",
    "OUR HISTORY",
    "GLOBAL MARKET",
    "Mission",
    "Vision",
    "Spirit",
    "Values",
    "Objective",
    "lmprovement & Innovation",
    "Market Survey",
    "TREND INSIGHTS",
    "INDUSTRY REPORT",
    "PRODUCT DESIGN",
    "PACKAGING DESIGN",
    "COST ENGINEERING",
    "DISPLAY DESIGN",
    "PRODUCT RESEARCH",
    "CUSTOMIZABLE SOLUTIONS",
    "PRODUCTION CAPACITY",
    "DIGITAL MANAGEMENT SYSTEM",
    "AUTOMATION",
    "FLEXIBLE MANUFACTURING",
    "SUSTAINABILITY IN ACTION",
    "Innovating Circular Economy Models",
    "Comprehensive Environmental Initiatives",
    "Nurturing A Diverse And Inclusive Work Environment",
  ]);
  if (known.has(line)) return true;
  if (line.length > 52 || /[.!?]$/.test(line)) return false;
  return /^[A-Z0-9& /-]+$/.test(line) && /[A-Z]/.test(line);
}


// ============ SOURCE-STYLE PRODUCT DETAIL VIEW (1:1 Clone) ============

const SOURCE_PRODUCT_HERO_BG = "https://cdn.sanity.io/images/vzcnnept/production/991d03d3894b0110d5612585b3ed49bc3fcd6132-1920x600.png";
const SOURCE_CONTACT_IMG = "https://cdn.sanity.io/images/vzcnnept/production/c4d604701c4116717ac6ff1fe7215192e1b4d1b6-130x130.png";
const SOURCE_SEARCH_BY_PATH = new Map(SOURCE_EMPTY_SEARCH_RESULTS.map((item) => [item.path, item]));
const SOURCE_SEARCH_BY_TITLE = new Map(SOURCE_EMPTY_SEARCH_RESULTS.map((item) => [sourceTitleKey(item.title), item]));

type SourceProductCard = {
  title: string;
  path: string;
  imageUrl?: string;
  imageAlt?: string;
  sku?: string;
};

function sourceTitleKey(title: string) {
  return title.toLowerCase().replace(/&amp;/g, "&").replace(/[.…]+$/g, "").replace(/\s+/g, " ").trim();
}

function sourceSearchItemFromTitle(title: string) {
  const key = sourceTitleKey(title);
  return SOURCE_SEARCH_BY_TITLE.get(key)
    || SOURCE_EMPTY_SEARCH_RESULTS.find((item) => sourceTitleKey(item.title).startsWith(key))
    || SOURCE_EMPTY_SEARCH_RESULTS.find((item) => key.startsWith(sourceTitleKey(item.title)));
}

const SOURCE_PRODUCT_DETAIL_SNAPSHOT_ROOT = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "reports",
  "visual-parity",
  "search-product-pages",
);

const SOURCE_PRODUCT_DETAIL_SNAPSHOT_FILES: Record<string, string> = {
  "/mirror/led-mirror/classic-led-mirror": "001-mirror-classic-led-mirror/original/dom.html",
  "/mirror/led-mirror/hollywood-full-length-led-mirror": "002-full-length-led-mirror/original/dom.html",
  "/mirror/led-mirror/modern-square-led-mirror-2": "003-square-led-mirror-2/original/dom.html",
  "/mirror/led-mirror/modern-square-led-mirror": "004-modern-square-led-mirror/original/dom.html",
  "/mirror/led-mirror/hollywood-vanity-led-mirror": "005-hollywood-vanity-led-mirror/original/dom.html",
  "/mirror/led-mirror/arched-led-vanity-mirror": "006-arched-led-vanity-mirror/original/dom.html",
};

type SourceProductDetailSnapshot = {
  mediaImages: string[];
  bestSellerItems: SourceProductCard[];
  relatedItems: SourceProductCard[];
  colorChoices: SourceColorChoice[];
  sizeOptions: string[];
};

const sourceProductDetailSnapshotCache = new Map<string, SourceProductDetailSnapshot>();

function sourceSnapshotHtml(productPath: string) {
  const relativeFile = SOURCE_PRODUCT_DETAIL_SNAPSHOT_FILES[productPath];
  if (!relativeFile) return "";
  const snapshotFile = path.join(SOURCE_PRODUCT_DETAIL_SNAPSHOT_ROOT, relativeFile);
  if (!existsSync(snapshotFile)) return "";
  return readFileSync(snapshotFile, "utf8");
}

function decodeSourceHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;|&#8230;/g, "...")
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&#215;|&times;/g, "x")
    .trim();
}

function stripSourceHtml(value: string) {
  return decodeSourceHtml(value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
}

function sourceAttr(block: string, name: string) {
  return new RegExp(`${name}=["']([^"']+)["']`, "i").exec(block)?.[1] || "";
}

function sourcePathFromHref(href: string) {
  try {
    const url = new URL(href, "https://intcoframing.local");
    const pathname = url.pathname.trim().replace(/^\/+|\/+$/g, "");
    return pathname ? `/${pathname}` : "/";
  } catch {
    const normalized = href.split("#")[0].split("?")[0].trim().replace(/^\/+|\/+$/g, "");
    return normalized ? `/${normalized}` : "/";
  }
}

function sourceProductCartLink(product: Product) {
  const normalizedPath = product.path.startsWith("/") ? product.path : `/${product.path}`;
  return normalizedPath;
}

function sourceSnapshotMediaImages(html: string) {
  if (!html) return [];
  const slidesMatch = html.match(/var\s+ourslides\s*=\s*\[\s*\[([\s\S]*?)\]\s*,/);
  if (slidesMatch) {
    return Array.from(new Set(Array.from(slidesMatch[1].matchAll(/<img\s+src=["']([^"']+)["']/g), (match) => match[1]).filter(Boolean)));
  }
  const mainSwiperMatch = html.match(/<div class="product111-swiper"[\s\S]*?<div class="swiper-wrapper"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
  if (!mainSwiperMatch) return [];
  return Array.from(new Set(Array.from(mainSwiperMatch[1].matchAll(/<img\s+src=["']([^"']+)["']/g), (match) => match[1]).filter(Boolean)));
}

function sourceSnapshotBestSellers(html: string) {
  const listMatch = html.match(/<ul class="Products1-2ul">([\s\S]*?)<\/ul>/);
  if (!listMatch) return [];
  const items: SourceProductCard[] = [];
  for (const match of listMatch[1].matchAll(/<li\b[\s\S]*?<\/li>/g)) {
    const block = match[0];
    const leftBox = block.match(/<div class="leftBox">([\s\S]*?)<div class="DESCtEXT">/)?.[1] || block;
    const titleLink = leftBox.match(/<a\s+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/);
    const imageTag = block.match(/<div class="rightImg">[\s\S]*?<img\s+([^>]+)>/);
    if (!titleLink) continue;
    const sku = stripSourceHtml(block.match(/<div class="DESCtEXT">\s*Item\s?#:\s*([\s\S]*?)<\/div>/i)?.[1] || "");
    items.push({
      title: stripSourceHtml(titleLink[2]),
      path: sourcePathFromHref(titleLink[1]),
      imageUrl: imageTag ? sourceAttr(imageTag[1], "src") : undefined,
      imageAlt: imageTag ? sourceAttr(imageTag[1], "alt") || sourceAttr(imageTag[1], "title") : undefined,
      sku,
    });
  }
  return items;
}

function sourceSnapshotRelatedItems(html: string) {
  const bestSwiperMatch = html.match(/<div class="BESTSwiper">([\s\S]*?)<!-- list -->/);
  if (!bestSwiperMatch) return [];
  const items: SourceProductCard[] = [];
  for (const match of bestSwiperMatch[1].matchAll(/<a\s+href=["']([^"']+)["'][^>]*class=["'][^"']*swiper-slide[^"']*["'][\s\S]*?<div class="topImgBox">[\s\S]*?<img\s+([^>]+)>[\s\S]*?<div class="bottomText">([\s\S]*?)<\/div>\s*<\/a>/g)) {
    const imageAttrs = match[2];
    const title = stripSourceHtml(match[3]);
    if (!title) continue;
    items.push({
      title,
      path: sourcePathFromHref(match[1]),
      imageUrl: sourceAttr(imageAttrs, "src"),
      imageAlt: sourceAttr(imageAttrs, "alt") || sourceAttr(imageAttrs, "title") || title,
    });
  }
  return items;
}

function sourceSnapshotColorChoices(html: string) {
  const choices: SourceColorChoice[] = [];
  for (const match of html.matchAll(/<div\s+class=["'][^"']*colorItem[^"']*["']([^>]*)>/g)) {
    const attrs = match[1];
    const color = sourceAttr(attrs, "data-color");
    choices.push({
      color: color ? `#${color.replace(/^#/, "")}` : undefined,
      itemNumber: sourceAttr(attrs, "data-item") || undefined,
    });
  }
  return choices;
}

function sourceSnapshotSizeOptions(html: string) {
  const sizes: string[] = [];
  for (const match of html.matchAll(/<div\s+class=["'][^"']*sizeItem[^"']*["']([^>]*)>([\s\S]*?)<\/div>/g)) {
    const attrs = match[1];
    const value = sourceAttr(attrs, "data-value") || stripSourceHtml(match[2]);
    if (value) sizes.push(decodeSourceHtml(value));
  }
  return Array.from(new Set(sizes));
}

function sourceProductDetailSnapshot(productPath: string): SourceProductDetailSnapshot {
  const cached = sourceProductDetailSnapshotCache.get(productPath);
  if (cached) return cached;
  const html = sourceSnapshotHtml(productPath);
  const snapshot = {
    mediaImages: sourceSnapshotMediaImages(html),
    bestSellerItems: sourceSnapshotBestSellers(html),
    relatedItems: sourceSnapshotRelatedItems(html),
    colorChoices: sourceSnapshotColorChoices(html),
    sizeOptions: sourceSnapshotSizeOptions(html),
  };
  sourceProductDetailSnapshotCache.set(productPath, snapshot);
  return snapshot;
}

const SOURCE_PRODUCT_SERVICE_ITEMS = [
  { icon: "https://cdn.sanity.io/images/vzcnnept/production/e253ed577fa5ced89e9f9692d88344600dd4b669-487x363.png", title: "Business Insights & Trends", path: "/solutions/business-insights-trends" },
  { icon: "https://cdn.sanity.io/images/vzcnnept/production/02faafad6b61c091883dfa0f57c9db53a29c69d6-487x363.png", title: "Design & Engineering", path: "/solutions/design-engineering" },
  { icon: "https://cdn.sanity.io/images/vzcnnept/production/a433d36c6ab610824b2cfdbfb562d401c8cfa33b-487x363.png", title: "Manufacturing & Delivery", path: "/solutions/manufacturing-delivery" },
  { icon: "https://cdn.sanity.io/images/vzcnnept/production/bfe8aefc5839e723b9e71da577a07d9b0deefb53-487x364.png", title: "Global Production and Supply", path: "/solutions/global-production-and-supply" },
  { icon: "https://cdn.sanity.io/images/vzcnnept/production/6ece258656c92afb448216ae11e249045f9e5f54-487x364.png", title: "Certification", path: "/solutions/certification" },
  { icon: "https://cdn.sanity.io/images/vzcnnept/production/d5e7f3612839fbb04ef8121c5feb515cfa75c843-487x364.jpg", title: "Retailer Support", path: "/solutions/retailer-support" },
];

function sourceServiceTitle(locale: Locale, path: string, fallback: string) {
  switch (path) {
    case "/solutions/business-insights-trends":
      return t(locale, "businessInsights");
    case "/solutions/design-engineering":
      return t(locale, "designEngineering");
    case "/solutions/manufacturing-delivery":
      return t(locale, "manufacturingDelivery");
    case "/solutions/global-production-and-supply":
      return t(locale, "globalProductionAndSupply");
    case "/solutions/certification":
      return t(locale, "certification");
    case "/solutions/retailer-support":
      return t(locale, "retailerSupport");
    default:
      return fallback;
  }
}

function sourceProductCardImage(item: Product) {
  const sourceSearchImage = SOURCE_SEARCH_BY_PATH.get(item.path)?.imageUrl;
  const firstSpecificImage = [sourceSearchImage, ...itemGallery(item), preferredImage(item)].find(
    (image): image is string => isProductCdnImage(image) && !looksGenericImage(image),
  );
  return firstSpecificImage || "";
}

function sanitizeSourceProductCard(item: SourceProductCard): SourceProductCard {
  const sourceSearchItem = SOURCE_SEARCH_BY_PATH.get(item.path);
  const imageUrl = [sourceSearchItem?.imageUrl, item.imageUrl].find(
    (image): image is string => isProductCdnImage(image) && !looksGenericImage(image),
  );
  return {
    ...item,
    imageUrl,
    imageAlt: sourceSearchItem?.imageAlt || item.imageAlt || item.title,
  };
}

function sourceRelatedCardsFromBody(product: Product) {
  const lines = contentLines(product.bodyText, 180);
  const relatedStart = lines.findIndex((line) => /^Related Products$/i.test(line));
  if (relatedStart < 0) return [];
  const end = lines.findIndex((line, index) => index > relatedStart && /^SERVICES WE PROVIDE$/i.test(line));
  const relatedLines = lines.slice(relatedStart + 1, end > relatedStart ? end : undefined);
  const cards: SourceProductCard[] = [];
  const seen = new Set<string>();

  relatedLines.forEach((line) => {
    const sourceItem = sourceSearchItemFromTitle(line);
    if (!sourceItem || seen.has(sourceItem.path)) return;
    seen.add(sourceItem.path);
    cards.push({
      title: sourceItem.title,
      path: sourceItem.path,
      imageUrl: sourceItem.imageUrl,
      imageAlt: sourceItem.imageAlt || sourceItem.title,
    });
  });

  return cards;
}

function sourceBestSellerCardsFromBody(details: ReturnType<typeof parseProductDetails>) {
  const cards: SourceProductCard[] = [];
  const seen = new Set<string>();

  details.bestSellerPairs.forEach((pair) => {
    const sourceItem = sourceSearchItemFromTitle(pair.title);
    if (!sourceItem || seen.has(sourceItem.path)) return;
    seen.add(sourceItem.path);
    cards.push({
      title: pair.title.replace(/…/g, "..."),
      path: sourceItem.path,
      imageUrl: sourceItem.imageUrl,
      imageAlt: sourceItem.imageAlt || sourceItem.title,
      sku: pair.itemNumber.replace(/^Item\s?#:\s*/i, "").trim(),
    });
  });

  return cards;
}

export function ProductDetailSourceView({
  product,
  relatedProducts,
  locale,
  categories,
}: {
  product: Product;
  relatedProducts: Product[];
  locale: Locale;
  categories: ProductCategory[];
}) {
  const { topCategory, activeCategory, siblingCategories } = productCategoryTemplateContext(product, categories);
  const details = parseProductDetails(product, locale);
  const sourceSearchItem = SOURCE_SEARCH_BY_PATH.get(product.path);
  const sourceDetailSnapshot = sourceProductDetailSnapshot(product.path);
  const displayTitle = product.title || details.displayTitle || sourceSearchItem?.title || "";
  const gallery = itemGallery(product).filter((image) => isProductCdnImage(image) && !looksGenericImage(image));
  const primary = [gallery[0], preferredImage(product), sourceSearchItem?.imageUrl].find(
    (image): image is string => isProductCdnImage(image) && !looksGenericImage(image),
  );
  const sourceSnapshotImages = sourceDetailSnapshot.mediaImages.filter((image) => isProductCdnImage(image) && !looksGenericImage(image));
  const galleryImages = gallery.length
    ? Array.from(new Set([primary, ...gallery].filter((image): image is string => Boolean(image))))
    : sourceSnapshotImages.length
      ? sourceSnapshotImages
      : [primary].filter((image): image is string => Boolean(image));
  const bodyBestSellerItems = sourceBestSellerCardsFromBody(details);
  const bestSellerItems = bodyBestSellerItems.length
      ? bodyBestSellerItems.map(sanitizeSourceProductCard)
    : relatedProducts.length
      ? relatedProducts.slice(0, 4).map((item) => ({
        title: item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title,
        path: item.path,
        imageUrl: sourceProductCardImage(item),
        imageAlt: SOURCE_SEARCH_BY_PATH.get(item.path)?.imageAlt || item.imageAlt || item.title,
        sku: item.sku,
      }))
      : sourceDetailSnapshot.bestSellerItems.map(sanitizeSourceProductCard);
  const bodyRelatedCards = sourceRelatedCardsFromBody(product);
  const relatedProductCards = relatedProducts.slice(0, 6).map((item) => ({
    title: item.title,
    path: item.path,
    imageUrl: sourceProductCardImage(item),
    imageAlt: SOURCE_SEARCH_BY_PATH.get(item.path)?.imageAlt || item.imageAlt || item.title,
  }));
  const sourceRelatedCards = bodyRelatedCards.length
      ? bodyRelatedCards.map(sanitizeSourceProductCard)
    : relatedProductCards.length
      ? relatedProductCards
      : sourceDetailSnapshot.relatedItems.map(sanitizeSourceProductCard);
  const sourceRelatedItems: SourceRelatedProductItem[] = sourceRelatedCards.map((item) => ({
    title: item.title,
    href: localizePath(locale, item.path),
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt || item.title,
  }));

  const sidebarCategories = siblingCategories.length ? siblingCategories : topCategory ? [topCategory] : [];
  const activeSidebarSlug = activeCategory?.slug || topCategory?.slug;
  const specLabels = productSpecLabels(locale);
  const itemNumber = details.specs.find((spec) => /item|art|réf|品番/i.test(spec.label))?.value || product.sku || "";
  const size = details.specs.find((spec) => /size|tamaño|tamanho|taille|größe|サイズ/i.test(spec.label))?.value || product.dimensions || "";
  const aboutThisItemTitle = t(locale, "aboutThisItem").toUpperCase();
  const servicesTitle = t(locale, "servicesWeProvide").toUpperCase();
  const relatedProductsTitle = t(locale, "relatedProducts");
  const detailImages = galleryImages.length ? galleryImages : [primary].filter((image): image is string => Boolean(image));
  const colorChoices = ["#000000"].map((color) => ({
        color,
        itemNumber,
      }));
  const sizeOptions = size
      ? size.split(/\s+\/\s+/).filter(Boolean)
      : sourceDetailSnapshot.sizeOptions;
  const aboutDescriptionLines = details.descriptionLines.length ? details.descriptionLines : product.description ? [product.description] : [];
  const aboutHighlightLines = details.highlightLines.length ? details.highlightLines : linesFromBody(product.bodyText, 6);
  const sourceProductLink = sourceProductCartLink(product);

  return (
    <>
      {/* Banner with Hero */}
      <section className="banner index-banner seleftextp">
        <div className="swiper swiper-container">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="bg-box bg-box-shadow06">
                <div className="imgshow">
                  <img src={SOURCE_PRODUCT_HERO_BG} alt={displayTitle} />
                </div>
              </div>
              <div className="banner-content">
                <div className="intco-source-container">
                  <div className="text">
                    <div className="text-p center">
                      <h2 className="text-p-title f-84">{displayTitle}</h2>
                      {/* Breadcrumbs */}
                      <div className="crumbs-box crumbs-box2">
                        <a className="home" href={localizePath(locale, "/")}>
                          <div>{t(locale, "home")}</div>
                        </a>
                        <i className="iconfont icon-jiantou_liebiaoxiangyou" />
                        <a href={localizePath(locale, "/products")}>{t(locale, "products")}</a>
                        {topCategory && (
                          <>
                            <i className="iconfont icon-jiantou_liebiaoxiangyou" />
                            <a href={localizePath(locale, topCategory.path)}>{topCategory.title}</a>
                          </>
                        )}
                        {activeCategory ? (
                          <>
                            <i className="iconfont icon-jiantou_liebiaoxiangyou" />
                            <a href={localizePath(locale, activeCategory.path)}>{activeCategory.title}</a>
                          </>
                        ) : null}
                      </div>
                    </div>
                    {/* CTA Buttons */}
                    <div className="banner-a">
                      <LeadsCloudChatLink
                        fallbackHref={localizePath(locale, "/contact#chat")}
                        className="banner-btn"
                      >
                        {t(locale, "chatWithUs")}
                      </LeadsCloudChatLink>
                      <a href={localizePath(locale, "/products/#goinput")}>{t(locale, "leaveMessage")}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <div className="Products Products1 Products111">
        <div className="intco-source-container">
          <div className="Products1Content">
            {/* Left Sidebar */}
            <div className="Products1-left">
              {/* Categories */}
              <div className="wow fadeInUp">
                <div className="Products1-title">{t(locale, "categories")}</div>
                <ul className="Products1-ul">
                  {sidebarCategories.map((cat) => (
                    <li key={cat.path} className={cat.slug === activeSidebarSlug ? "selectProducts1Li" : ""}>
                      <a href={localizePath(locale, cat.path)}>{cat.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Best Sellers */}
              <div className="hc-mrt-box">
                <div className="Products1-title">{t(locale, "bestSellers")}</div>
                <ul className="Products1-2ul">
                  {bestSellerItems.map((item) => (
                    <li key={item.path} className="wow fadeInUp">
                      <div className="leftBox">
                        <div>
                          <a href={localizePath(locale, item.path)}>
                            {item.title}
                          </a>
                        </div>
                        {item.sku && <div className="DESCtEXT">{locale === "en" ? "Item #:" : specLabels.itemNumber} {item.sku}</div>}
                      </div>
                      <div className="rightImg">
                        <a href={localizePath(locale, item.path)}>
                          <div className="img-box">
                            {item.imageUrl && (
                              <Image 
                                src={item.imageUrl} 
                                alt={item.imageAlt || item.title} 
                                width={80} 
                                height={80}
                                className="object-cover"
                              />
                            )}
                          </div>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="Productsprodis-right">
              <div className="Products1-center">
                <SourceProductGallery images={detailImages} title={displayTitle} primaryAlt={product.imageAlt || displayTitle} />
              </div>
              <div className="wow fadeInUp Products1-right-right">
                  {/* Product Title */}
                  <h1 className="Products1-right-title">{displayTitle}</h1>
                  
                  {/* Get a Quote Button */}
                  <LeadsCloudChatLink
                    fallbackHref={localizePath(locale, "/contact#chat")}
                    className="Quote"
                  >
                    {t(locale, "quote")}
                  </LeadsCloudChatLink>
                  
                  <SourceProductPurchaseControls
                    itemLabel={specLabels.itemNumber}
                    colorLabel={specLabels.color}
                    sizeLabel={specLabels.size}
                    quantityLabel={`${t(locale, "quantity")}:`}
                    addToCartLabel={t(locale, "addToCart")}
                    initialItemNumber={itemNumber}
                    colorChoices={colorChoices}
                    sizeOptions={sizeOptions}
                    product={{
                      productId: product.sourceId ? String(product.sourceId) : product.slug,
                      productLink: sourceProductLink,
                      productName: displayTitle,
                      productImg: detailImages[0] || "",
                    }}
                  />
                  
                  {/* Customize Note */}
                  <div className="quoteLineText">
                    {locale === "en" ? (
                      <>
                        Any size, color
                        <br />
                        can be customized
                      </>
                    ) : (
                      t(locale, "customizableSizeColor")
                    )}
                  </div>
                  
                  {/* Contact Section */}
                  <div className="qutelineconcr hc-qutelineconcr">
                    <div className="topCircle">
                      <img src={SOURCE_CONTACT_IMG} alt="" />
                    </div>
                    <div className="point point1" />
                    <div className="point point2" />
                    <div className="point point3" />
                    <div className="point point4" />
                    <div className="flexContentItem">
                      <LeadsCloudChatLink
                        fallbackHref={localizePath(locale, "/contact#chat")}
                      >
                        <div className="selectBtn">
                          <i className="iconfont icon-24gf-phoneLoudspeaker" />
                          {" "}
                          {t(locale, "contactUs")}
                        </div>
                      </LeadsCloudChatLink>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About This Item Section */}
      <div className="Products Products1 Products11">
        <div className="intco-source-container">
          <div className="selefTitle" data-tit={aboutThisItemTitle}>
            <div className="title_text">{aboutThisItemTitle}</div>
          </div>

          <SourceProductAboutTabs
            descriptionLabel={t(locale, "description")}
            highlightsLabel={t(locale, "highlights")}
            descriptionLines={aboutDescriptionLines}
            highlightLines={aboutHighlightLines}
          />
        </div>
      </div>

      {/* Related Products Section */}
      <div className="Products">
        <div className="selefTitle" data-tit={t(locale, "bestSellers").toUpperCase()}>
          <div className="title_text">{relatedProductsTitle}</div>
        </div>
        <div className="intco-source-container margin-project-c BESTSwiperContent">
          <SourceRelatedProductsCarousel items={sourceRelatedItems} />
        </div>
      </div>

      {/* Services Section */}
      <div className="Products Products1 Products11 Products111 whiteBg">
        <div className="intco-source-container">
          <div className="selefTitle margin55" data-tit={servicesTitle}>
            <div className="title_text">{servicesTitle}</div>
          </div>
          <div className="product-index-list">
            <div className="w3Box-product111">
              <ul>
                {SOURCE_PRODUCT_SERVICE_ITEMS.map((service, idx) => (
                  <li key={idx} className="wow fadeInUp">
                    <a href={localizePath(locale, service.path)}>
                      <div className="w-item-box">
                        <div className="img-box">
                          <img src={service.icon} alt={sourceServiceTitle(locale, service.path, service.title)} />
                        </div>
                        <div className="bottomText">
                          <div className="b-text">{sourceServiceTitle(locale, service.path, service.title)}</div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="product-service-more">
              <a href={localizePath(locale, "/solutions")}>{t(locale, "exploreMore")}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
