import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Factory,
  Globe2,
  Headphones,
  Layers,
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
import { CatalogDownloadButton } from "@/components/catalog-download-dialog";
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
import { LEADSCLOUD_FORM_IDS, leadsCloudBuryClass } from "@/lib/leadscloud";

const PRODUCT_CATALOG_IMAGES = [
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/manual1-257x300-1.png",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/COLLECTION1.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/m-257x300-1.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/gong-257x300-1.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/manual1-257x300-1.jpg",
];

const PRODUCT_REPORT_IMAGES = [
  { title: "FSC", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/FSC.jpg" },
  { title: "ISO14001", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/ISO14001.jpg" },
  { title: "GRS", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/GRS.jpg" },
  { title: "ISO9001", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/ISO9001.jpg" },
];

const WHAT_WE_DO_IMAGES: Record<string, string> = {
  mirror: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo1.png",
  "picture frame": "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo2.png",
  art: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo3.png",
  furniture: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo5.png",
  "memo board": "https://www.intcoframing-us.com/wp-content/uploads/2024/01/whatWeDo4.png",
};

const PRODUCTS_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/products.png";
const PRODUCT_TEST_REPORT_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/testreportBg.png";
const PRODUCT_CONTACT_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/orderBg.png";

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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/09/2-1-1.jpg",
  },
  {
    title: "Standing Mirror",
    path: "/mirror/standing-mirror",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/m2.jpg",
  },
  {
    title: "Leaner Mirror",
    path: "/mirror/leaner-mirror",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/m3.jpg",
  },
  {
    title: "Door Mirror",
    path: "/mirror/door-mirror",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/m4.jpg",
  },
  {
    title: "LED Mirror",
    path: "/mirror/led-mirror",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/m6.jpg",
  },
];

const MIRROR_BEST_SELLERS = [
  {
    title: "Aluminum Framed Arched Full Length Standing Mirror",
    path: "/mirror/standing-mirror/aluminum-framed-arched-full-length-standing-mirror",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-75.jpg",
  },
  {
    title: "Aluminum Framed Round Wall Mirror with Wood Grain",
    path: "/mirror/wall-mirror/aluminum-framed-round-wall-mirror-with-wood-grain",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/4-40.jpg",
  },
  {
    title: "Decorative Aluminum Framed Gold Wall Mirror",
    path: "/mirror/wall-mirror/decorative-aluminum-framed-gold-wall-mirror",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-72.jpg",
  },
  {
    title: "Arched Alumium Framed LED Bathroom Wall Mounted Mirror",
    path: "/arched-alumium-framed-led-bathroom-wall-mounted-mirror",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/3-21.jpg",
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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/COLLECTION1.png",
  },
  {
    title: "Wall Frame",
    path: "/picture-frame/wall-frame",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/COLLECTION2.png",
  },
  {
    title: "Poster Frame",
    path: "/picture-frame/poster-frame",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/COLLECTION3.png",
  },
  {
    title: "Document Frame",
    path: "/picture-frame/document-frame",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/COLLECTION4.png",
  },
  {
    title: "Shadow Box",
    path: "/picture-frame/shadow-box",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/COLLECTION5.png",
  },
  {
    title: "Collage Frame",
    path: "/picture-frame/collage-frame",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/COLLECTION6.png",
  },
];

const PICTURE_FRAME_BEST_SELLERS = [
  {
    title: "Modern Black Aluminum Framed Poster Frame",
    path: "/picture-frame/poster-frame-2/modern-black-alumium-framed-poster-frame",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/3-2-8.jpg",
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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/h1.jpg",
  },
  {
    title: "Canvas Art",
    path: "/art/canvas-art",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/h2.jpg",
  },
  {
    title: "Alternative Wall Decor",
    path: "/art/alternative-wall-decor",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/h3.jpg",
  },
];

const ART_BEST_SELLERS = [
  {
    title: "Modern Abstract Canvas Wall Art",
    path: "/art/canvas-art/modern-abstract-canvas-wall-art",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-96.jpg",
  },
  {
    title: "Large Framed Canvas Wall Art Abstract Neutral",
    path: "/art/canvas-art/large-framed-canvas-wall-art-abstract-neutral",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-103.jpg",
  },
  {
    title: "Framed Landscape Wall Art Room Decor 24x30",
    path: "/art/framed-art/framed-landscape-wall-art-room-decor-24x30",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/3-1-2.jpg",
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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/j1.jpg",
  },
  {
    title: "Shelf",
    path: "/furniture/shelf",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/j2.jpg",
  },
];

const FURNITURE_BEST_SELLERS = [
  {
    title: "Black Rectangular Medicine Cabinet with Mirror 22x26.8 in",
    path: "/black-rectangular-medicine-cabinet-with-mirror-22x26-8-in",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-33.jpg",
  },
  {
    title: "Rectangular Frameless Mirror Medicine Cabinet 31.4x24.4",
    path: "/rectangular-medicine-cabinet-without-mirror-31-4x24-4",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-32.jpg",
  },
  {
    title: "Floating Shelves",
    path: "/furniture/shelf/floating-shelves",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/20-1.jpg",
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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/g1.jpg",
  },
  {
    title: "Dry Erase Board",
    path: "/memo-board/dry-erase-board",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/g2.jpg",
  },
  {
    title: "Cork Board",
    path: "/memo-board/cork-board",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/g3.jpg",
  },
  {
    title: "Linen Board",
    path: "/memo-board/linen-board",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/g4.jpg",
  },
];

const MEMO_BOARD_BEST_SELLERS = [
  {
    title: "Chalkboard Style Board Monthly Wall Calendar 18×24 Inch",
    path: "/chalkboard-style-board-monthly-wall-calendar-18x24-inch",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2.jpg",
  },
  {
    title: "Wall Cork Board for Picture Display 20×20 Inch",
    path: "/wall-cork-board-for-photo-display-20x20-inch",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-2.jpg",
  },
  {
    title: "Gold Framed Weekly Calendar Dry Erase Board 16×16 in",
    path: "/gold-framed-weekly-calendar-dry-erase-board-16x16-in",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-1.jpg",
  },
  {
    title: "Gold Aluminum Framed Linen Bulletin Board 20X28",
    path: "/gold-aluminum-framed-linen-bulletin-board-20x28",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-3.jpg",
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
    pdfUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Mirror-Intco-Framing.pdf",
  },
  {
    title: "Picture Frame",
    imageUrl: PRODUCT_CATALOG_IMAGES[1],
    description:
      "Our picture frames are made of environmentally friendly materials. Explore picture frames in various shapes and styles at INTCO Framing. Display your cherished photos, meaningful moments, and essential documents elegantly.",
    pdfUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Picture-Frame-Intco-Framing.pdf",
  },
  {
    title: "Art",
    imageUrl: PRODUCT_CATALOG_IMAGES[2],
    description:
      "Create your own gallery with wall art from INTCO Framing. Our diverse selection of art ensures your home is as exceptional as your individual taste.",
    pdfUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Art-Intco-Framing.pdf",
  },
  {
    title: "Memo Board",
    imageUrl: PRODUCT_CATALOG_IMAGES[3],
    description:
      "Discover a variety of framed chalkboards and cork boards at INTCO Framing. Whether it's a reminder, a note, or a piece of encouragement, add your personal touch to these boards. Explore our selection and find the perfect one that resonates with you!",
    pdfUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Memo-Board-%E2%80%94-Intco-Framing.pdf",
  },
  {
    title: "Furniture",
    imageUrl: PRODUCT_CATALOG_IMAGES[4],
    description:
      "INTCO Framing delivers top-quality furniture, ranging from medicine cabinets to shelves, designed to maximize home storage space. INTCO Framing provides innovative storage solutions for a clutter-free living environment.",
    pdfUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Furniture-Intco-Framing.pdf",
  },
];

const CONTACT_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/lxwm.jpg";
const CONTACT_FORM_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/contact_03.png";
const CONTACT_FORM_BADGE_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/contact3.png";

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

const HOME_PROFILE_VIDEO_SRC = "https://www.youtube.com/embed/N7I6CgHXCZQ?si=S5SW7QBzqJsOwXMC&autoplay=1&rel=0";
const HOME_PROFILE_VIDEO_THUMB = "https://i.ytimg.com/vi/N7I6CgHXCZQ/maxresdefault.jpg";
const HOME_PROFILE_VIDEO_SRC_DOC = `
<!doctype html>
<html>
<head>
<style>
*{box-sizing:border-box}body{margin:0;background:#000;font-family:Arial,Helvetica,sans-serif}a{position:absolute;inset:0;display:block;color:#fff;text-decoration:none;overflow:hidden}img{width:100%;height:100%;object-fit:cover;display:block}.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.05) 32%,rgba(0,0,0,.22))}.title{position:absolute;left:76px;top:18px;font-size:21px;font-weight:700;line-height:1.15;text-shadow:0 1px 2px rgba(0,0,0,.8)}.channel{position:absolute;left:76px;top:47px;font-size:14px;text-shadow:0 1px 2px rgba(0,0,0,.8)}.badge{position:absolute;left:30px;top:18px;width:40px;height:40px;border-radius:50%;background:#fff;color:#0067b1;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}.play{position:absolute;left:50%;top:50%;width:68px;height:48px;border-radius:13px;background:#f00;transform:translate(-50%,-50%)}.play:before{content:"";position:absolute;left:27px;top:14px;border-left:17px solid #fff;border-top:10px solid transparent;border-bottom:10px solid transparent}.watch{position:absolute;right:48px;bottom:28px;font-size:18px;text-shadow:0 1px 2px rgba(0,0,0,.8)}.yt{position:absolute;right:14px;bottom:25px;font-size:17px;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.8)}
</style>
</head>
<body>
<a href="${HOME_PROFILE_VIDEO_SRC}" aria-label="Play INTCO Framing YouTube video">
<img src="${HOME_PROFILE_VIDEO_THUMB}" alt="">
<span class="shade"></span><span class="badge">INTCO</span><span class="title">Intco Framing | End-to-end Home Decor Solutions</span><span class="channel">INTCO Framing</span><span class="play"></span><span class="watch">前往平台观看</span><span class="yt">YouTube</span>
</a>
</body>
</html>`;

const SOURCE_HOME_HERO_SLIDES: NonNullable<SiteData["homePage"]["heroSlides"]> = [
  {
    title: "INTCO FRAMING",
    subtitle: "We are committed to offering you turnkey service and ready to\ncreate retail solutions custom tailored to fulfill all your needs.",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/20240229-145653.jpg",
    primaryCta: { label: "Latest Products", path: "/products" },
    secondaryCta: { label: "Solutions", path: "/solutions" },
  },
  {
    title: "",
    subtitle: "",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/07/20240712-150123.gif",
    primaryCta: { label: "Explore More", path: "/mirror/led-mirror" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Mirror",
    subtitle: "Decorating your wall with a mirror can add depth and fascination into your room.\nlntco Framing offers a range of mirrors suitable for any room in your home.",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/3-1.jpg",
    primaryCta: { label: "Explore More", path: "/mirror" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Picture Frame",
    subtitle: "Our picture frames are all made of environmentally friendly materials.\nExplore picture frames in various shapes and styles at Intco Framing.",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/image.jpg",
    primaryCta: { label: "Explore More", path: "/picture-frame" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Wall Art",
    subtitle: "Create your own gallery with wall art from Intco Framing.\nOur diverse selection of art ensures your home is as exceptional as your individual taste.",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/4.jpg",
    primaryCta: { label: "Explore More", path: "/art" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
  {
    title: "Flexible Manufacturing",
    subtitle: "With over 20 years of manufacturing experience, lntco Framing stands out for its flexible manufacturing capabilities.",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/111.jpg",
    primaryCta: { label: "Explore More", path: "/solutions/manufacturing-delivery" },
    secondaryCta: { label: "Contact Us", path: "/contact" },
  },
];

const HOME_PRODUCT_COPY: Record<string, { title: string; description: string }> = {
  mirror: {
    title: "Mirror",
    description: "Decorating your wall with a mirror can add depth and fascination into rooms. Intco Framing offers a range of mirrors suitable for any room in home!",
  },
  "picture-frame": {
    title: "Picture Frame",
    description:
      "Our picture frames are all made of environmentally friendly materials. Explore picture frames in various shapes and styles at Intco Framing. Display your cherished photos, meaningful moments, and essential documents elegantly.",
  },
  art: {
    title: "Art",
    description: "Create your own gallery with wall art from Intco Framing. Our diverse selection of art ensures your home is as exceptional as your individual taste.",
  },
  furniture: {
    title: "Furniture",
    description:
      "Intco Framing delivers top-quality furniture, ranging from medicine cabinets to shelves, designed to maximize home storage space. Intco Framing provides innovative storage solutions for a clutter-free living environment.",
  },
  "memo-board": {
    title: "Memo Board",
    description:
      "Discover a variety of framed chalkboards and cork boards at Intco Framing. Whether it's a reminder, a note, or a piece of encouragement, add your personal touch to these boards. Explore our selection and find the perfect one that resonates with you!",
  },
};

const HOME_PROFILE_LINKS = [
  {
    label: "Sustainability",
    path: "/who-we-are/sustainability",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/cboe-icon-01.png",
  },
  {
    label: "Certification",
    path: "/solutions/certification",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/cboe-icon-02.png",
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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/PROJECTS1.jpg",
  },
  {
    title: "Commercial",
    path: "/projects/commercial",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/PROJECTS2.jpg",
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

function localizedHomeHeroSlides(homePage: SiteData["homePage"], locale: Locale) {
  if (locale === "en") return SOURCE_HOME_HERO_SLIDES;
  const localizedSlides = homePage.heroSlides || [];
  return SOURCE_HOME_HERO_SLIDES.map((sourceSlide, index) => {
    const localizedIndex = SOURCE_HERO_LOCALIZED_INDEX[index];
    const translated = localizedIndex >= 0 ? localizedSlides[localizedIndex] : undefined;
    return {
      ...sourceSlide,
      title: translated?.title ?? sourceSlide.title,
      subtitle: translated?.subtitle ?? sourceSlide.subtitle,
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

function localizeSourceProductCard<T extends { title: string; path: string; imageUrl: string }>(card: T, products: Product[], locale: Locale): T {
  if (locale === "en") return card;
  const product = products.find((item) => item.path === card.path);
  return product ? { ...card, title: product.title } : card;
}

function localizeSourceCopyItems(items: Array<{ title: string; body: string }>, categories: ProductCategory[], locale: Locale) {
  if (locale === "en") return items;
  return items.map((item) => {
    const category = categoryBySourceTitle(categories, item.title);
    return {
      title: category?.title || item.title,
      body: category?.description || item.body,
    };
  });
}

function localizedCategoryIntro(category: ProductCategory | undefined, fallback: string, locale: Locale) {
  return locale === "en" ? fallback : category?.description || fallback;
}

const PROJECTS_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj.jpg";

const PROJECTS_SOURCE_ITEMS = [
  {
    title: "Living Room",
    path: "/projects/living-room",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/%E7%94%BB%E6%9D%BF-1-1.jpg",
    description:
      "Transform your living room into a sanctuary of comfort and style with our curated collection. Our carefully selected furniture pieces seamlessly blend aesthetic…",
  },
  {
    title: "Bedroom",
    path: "/projects/bedroom",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/%E7%94%BB%E6%9D%BF-1-1-1.jpg",
    description:
      "Indulge in the serenity of our bedroom collection, where tranquility meets timeless design. Our carefully curated pieces promise a sanctuary of relaxation and r…",
  },
  {
    title: "Bathroom",
    path: "/projects/bathroom",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-1-2-1.jpg",
    description:
      "Step into a realm of tranquility with our exquisite bathroom collection, where luxury meets functionality. Elevate your daily routine in a space designed for se…",
  },
  {
    title: "Dining Room",
    path: "/projects/dining-room",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-1-3-1.jpg",
    description:
      "Transform your dining experience into a visual feast with our dining room collection. Immerse yourself in the perfect blend of contemporary elegance and comfort…",
  },
  {
    title: "Kitchen",
    path: "/projects/kitchen",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-1-5-1.jpg",
    description:
      "Infuse your kitchen with the warmth of modern aesthetics. Embrace the art of culinary creation in a kitchen that seamlessly blends style and functionality, wher…",
  },
];

const PROJECTS_SOURCE_CHILDRENS_ROOM = {
  title: "Children's Room",
  path: "/projects/childrens-room",
  imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E5%84%BF%E7%AB%A5.jpg",
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
      imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-11-1.jpg",
      description:
        "Experience the epitome of luxury and sophistication in our hotel collection, where every detail is curated for an unparalleled stay.Our thoughtfully curated spa…",
    },
    {
      title: "Office",
      path: "/projects/office",
      imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E5%8A%9E%E5%85%AC%E5%AE%A41.jpg",
      description:
        "Our exclusive decor collection designed toelevate your office space to new heights of sophistication. From sleek desk accessories to statement wall art, each pi…",
    },
    {
      title: "Gallery",
      path: "/projects/gallery",
      imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-11-3.jpg",
      description:
        "Our art collection is a celebration of diverse styles and expressions. Wander through our gallery space, where every brushstroke tells a unique story. Elevate y…",
    },
    {
      title: "Cafes",
      path: "/projects/cafes",
      imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-11-4.jpg",
      description:
        "Experience the sophisticated ambiance enhanced by our curated wall decor collection, transforming every corner into a gallery of visual delight. Allow the rich …",
    },
  ],
  3: [
    {
      title: "Restaurant",
      path: "/projects/restaurant",
      imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-11-5.jpg",
      description:
        "Our thoughtfully selected collection transforms the dining experience, creating an atmosphere that sparks conversation and enhances the pleasure of every bite. …",
    },
    {
      title: "Large Commercial Space",
      path: "/projects/large-commercial-space",
      imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-11-6.jpg",
      description:
        "Transform vast expanses into dynamic hubs of innovation and style with our large commercial space solutions. Elevate the ambiance with our curated collection, o…",
    },
    {
      title: "School",
      path: "/projects/school",
      imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E7%94%BB%E6%9D%BF-11-7.jpg",
      description:
        "Create an inspiring and conducive learning environment with our tailored solutions for schools. Our comprehensive approach to educational spaces brings together…",
    },
  ],
};

const PROJECTS_SOURCE_COMMERCIAL_ITEMS = [...PROJECTS_SOURCE_PAGE_ITEMS[2].slice(1), ...PROJECTS_SOURCE_PAGE_ITEMS[3]];

const HOME_BLOG_CATEGORIES = ["All", "Expo", "Industry News", "Inspiration", "New Arrivals", "Press Release", "Tips"];

const HOME_BLOG_CARDS = [
  {
    title: "Canvas Art: A Perfect Addition to Your Home Decor",
    path: "/news/canvas-art-a-perfect-addition-to-your-home-decor",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/09/8-1-1.jpg",
    date: "Sep 09, 2025",
    description: "",
    category: "All",
  },
  {
    title: "Creative Gallery Wall Ideas: Transform Your Walls with Frames, Art and Memo Boards",
    path: "/news/creative-gallery-wall-ideas-transform-your-walls-with-frames-art-and-memo-boards",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/09/5416b754-a48c-4209-a071-d16586157fbe.png",
    date: "Sep 04, 2025",
    description: "Discover creative gallery wall ideas with frames, art, mirrors & memo boards. Tr...",
    category: "All",
  },
  {
    title: "Top Frame Design Trends in 2025 for Interiors and Art Galleries",
    path: "/news/top-frame-design-trends-in-2025-for-interiors-and-art-galleries",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/08/premium_photo-1706561252292-a468453e49bb.avif",
    date: "Aug 26, 2025",
    description: "",
    category: "All",
  },
  {
    title: "Which One Suits Your Project?——A Guide to Mirror Materials",
    path: "/news/which-one-suits-your-project-a-guide-to-mirror-materials",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/08/1.jpg",
    date: "Aug 19, 2025",
    description: "",
    category: "All",
  },
  {
    title: "Modern? Rustic? Classic? The Custom Framing Guide Every Home Needs",
    path: "/news/modern-rustic-classic-the-custom-framing-guide-every-home-needs",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/08/1280X1280-3.png",
    date: "Aug 09, 2025",
    description: "Explore Intco Framing's custom picture frames and frame mouldings. Discover mode...",
    category: "Inspiration",
  },
  {
    title: "Sustainable Furniture Choices: Eco-Friendly Options for the Modern Home",
    path: "/news/sustainable-furniture-choices-eco-friendly-options-for-the-modern-home",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/04/1-medium-shot-woman-restoring-furniture-scaled.webp",
    date: "Apr 23, 2025",
    description: "Discover eco-friendly furniture that blend style & sustainability for modern hom...",
    category: "Industry News",
  },
  {
    title: "Functional Decor: Incorporating Memo Boards into Your Home Office",
    path: "/news/functional-decor-incorporating-memo-boards-into-your-home-office",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/04/1-postcard-pictures-rack-against-white-scaled.webp",
    date: "Apr 16, 2025",
    description: "Discover how to integrate memo boards into your home office for stylish organiza...",
    category: "Industry News",
  },
  {
    title: "The Art of Framing: Enhancing Your Artwork with Unique Picture Frames",
    path: "/news/the-art-of-framing-enhancing-your-artwork-with-unique-picture-frames",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/04/1-top-view-wooden-frames-arrangement-scaled.jpg",
    date: "Apr 09, 2025",
    description: "Discover how unique picture frames enhance your art. Expert tips on styles, mate...",
    category: "Industry News",
  },
  {
    title: "Intco Framing Will Be Participating in The 135th CANTON FAIR",
    path: "/news/intco-framing-will-be-participating-in-the-135th-canton-fair",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/04/20240410-112017.jpg",
    date: "Apr 10, 2024",
    description: "Intco Framing Will Be Participating in The 135th CANTON FAIR",
    category: "Expo",
  },
  {
    title: "Visit Intco Framing at 2024 VIFA Expo",
    path: "/news/visit-intco-framing-at-2024-vifa-expo",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/20240227-090025-scaled.jpg",
    date: "Feb 27, 2024",
    description: "Intco Framing will be showcasing latest innovations in home decor solutions at V...",
    category: "Expo",
  },
  {
    title: "Tips for Installing Picture Frames in Your Home",
    path: "/news/tips-for-installing-picture-frames-in-your-home",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/03/1-high-angle-beautiful-plants-home-scaled.jpg",
    date: "Apr 02, 2025",
    description: "Discover expert tips for installing picture frames to enhance your home decor. L...",
    category: "Industry News",
  },
  {
    title: "Interior Deco Market Outlook 2025: Key Trends and Challenges",
    path: "/news/interior-deco-market-outlook-2025-key-trends-and-challenges",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2025/03/1-home-plant-vase-decoration-arrangement-scaled.jpg",
    date: "Mar 26, 2025",
    description: "Explore the Interior Decor Market Outlook 2025: Key trends, challenges, sustaina...",
    category: "Industry News",
  },
  {
    title: "What's the Best Way to Frame Black-and-White Photos?",
    path: "/news/whats-the-best-way-to-frame-black-and-white-photos",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/12/1-picture-framing-scaled.jpg",
    date: "Dec 12, 2024",
    description: "In conclusion, framing black-and-white photos requires careful consideration of ...",
    category: "Inspiration",
  },
  {
    title: "Bulk Picture Frame Orders for Wholesale Buyers: A Complete Guide",
    path: "/news/bulk-picture-frame-orders-for-wholesale-buyers-a-complete-guide",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/12/1-INTCO-Framing.webp",
    date: "Dec 05, 2024",
    description: "Ordering picture frames in bulk offers substantial benefits for wholesale buyers...",
    category: "Inspiration",
  },
  {
    title: "Poster Frames vs. Picture Frames: Understanding the Difference",
    path: "/news/poster-frames-vs-picture-frames-understanding-the-difference",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/11/1-Intcos-Poster-Frame.webp",
    date: "Nov 28, 2024",
    description: "Deciding on the appropriate frame for your posters, art prints, or photos is a c...",
    category: "Inspiration",
  },
  {
    title: "Framing the Future: A Comprehensive Guide to A-Paper Sizes",
    path: "/news/framing-the-future-a-comprehensive-guide-to-a-paper-sizes",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/11/1-natural-burl-wood-framing.webp",
    date: "Nov 21, 2024",
    description: "A-sizes are a system of paper sizes that are standardized by the International O...",
    category: "Inspiration",
  },
  {
    title: "The 2023 Bloomberg Green ESG 50 Companies to Watch List is officially released",
    path: "/news/the-2023-bloomberg-green-esg-50-companies-to-watch-list-is-officially-released",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Intco-Recycling-has-been-awarded-the-Best-Bloomberg-Green-ESG-Projects.jpg",
    date: "Jan 29, 2024",
    description: "The 2023 Bloomberg Green ESG 50 Companies to Watch List is officially released.",
    category: "Press Release",
  },
  {
    title: "The Clear Difference: Picture Frame vs Photo Frame Explained",
    path: "/news/the-clear-difference-picture-frame-vs-photo-frame-explained",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/06/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%873_20240611140721.jpg",
    date: "Jun 13, 2024",
    description: "A picture frame is a decorative edging designed to encase and protect artwork, p...",
    category: "Tips",
  },
  {
    title: "How To Choose The Right Mirror Cabinet for Your Bathroom",
    path: "/news/how-to-choose-the-right-mirror-cabinet-for-your-bathroom",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/medicine-cabinet-ideas-for-bathroom.jpg",
    date: "Feb 23, 2024",
    description: "It's vital to get the correct mirror cabinet for your purposes since it may trul...",
    category: "Tips",
  },
];

const SOLUTIONS_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/pj-1.jpg";
const SOLUTIONS_INTRO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/solution1.png";
const SOLUTIONS_PROCESS_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/solutionBg.png";
const SOLUTIONS_RELATED_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/solution9.png";
const SOLUTIONS_CONTACT_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/projectPage5.png";
const BUSINESS_INSIGHTS_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/BusinessInsights1.png";
const BUSINESS_INSIGHTS_MARKET_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/BusinessInsights2.png";
const BUSINESS_INSIGHTS_MARKET_ICON = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/BusinessInsights10.jpg";
const BUSINESS_INSIGHTS_RECOMMENDATION_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/BusinessInsights9.png";
const DESIGN_ENGINEERING_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/shutterstock3.png";
const DESIGN_ENGINEERING_MAIN_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/shutterstock4.png";
const MANUFACTURING_DELIVERY_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/ManufacturingBg.png";
const MANUFACTURING_DELIVERY_DOWN_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/down.jpg";
const GLOBAL_PRODUCTION_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/shutterstock1.png";
const GLOBAL_PRODUCTION_BUILDING_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E5%8A%9E%E5%85%AC%E5%A4%A7%E6%A5%BC2-1-scaled.jpg";
const CERTIFICATION_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification1.png";
const CERTIFICATION_BG_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/CertificationBg.png";
const CERTIFICATION_GRID_IMAGES = [
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification2.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification3.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification4.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification5.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification6.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification7.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification8.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification9.jpg",
];
const CERTIFICATION_SWIPER_IMAGES = [
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification10.png",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification11.png",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification12.png",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Certification13.png",
];
const RETAILER_SUPPORT_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E6%9C%AA%E6%A0%87%E9%A2%98-2-3.jpg";
const RETAILER_SUPPORT_TURN_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/RetailerSupport11.jpg";
const RETAILER_SUPPORT_GLOBAL_DECOR = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Global_.png";
const RETAILER_SUPPORT_GLOBAL_IMAGES = [
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E6%9C%AA%E6%A0%87%E9%A2%98-1-3.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/223.jpg",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/02/147.jpg",
];
const RETAILER_SUPPORT_DISTRIBUTION_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/RetailerSuppor5-1.png";
const RETAILER_SUPPORT_MARKETING_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/RetailerSuppor6-1.png";
const RETAILER_SUPPORT_SERVICE_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/RetailerSuppor7.png";
const MANUFACTURING_PACKAGING_IMAGES = [
  {
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Manufacturing7.png",
    imageAlt: "Manufacturing7",
  },
  {
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Manufacturing8.png",
    imageAlt: "Manufacturing8",
  },
];

const BUSINESS_INSIGHTS_TREND_SLIDES = [
  {
    path: "/solutions/business-insights-trends",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/1-131.jpg",
  },
  {
    path: "/solutions/business-insights-trends",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2-112.jpg",
  },
  {
    path: "/solutions/business-insights-trends",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/3-96.jpg",
  },
];

const WHO_WE_ARE_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240205105129.jpg";
const WHO_WE_ARE_INTRO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/aboutUs2.png";
const WHO_WE_ARE_STATS_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/hc-about-us-page.jpg";
const WHO_WE_ARE_MAP_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/map-hc-bg-01.png";

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
  { year: "2002", title: "Shanghai Base", description: "Picture Frame Mouldings", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2002.jpg" },
  { year: "2005", title: "Shandong Base", description: "Art / Picture / Mirror Frames", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2005.jpg" },
  { year: "2009", title: "Shanghai Base", description: "Greenwood Brand Picture Frame Mouldings", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2009.jpg" },
  { year: "2010", title: "Lu'an Base", description: "Picture Frame Mouldings", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2010.jpg" },
  { year: "2010", title: "Zheniiang Base", description: "GREENMAX Brand Recycling Machines", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2010_2.jpg" },
  { year: "2015", title: "Domestic Marketing Center", description: "25 Exhibition Offices in China", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2015.jpg" },
  { year: "2016", title: "Shandong Base ll", description: "MDF Frames Aluminum Frames", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2016.jpg" },
  { year: "2018", title: "Malaysia Base", description: "100,000 Tons r-PS Pellets", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2018.jpg" },
  { year: "2019", title: "Integration of two networks", description: "Recycle the Compressed Foam in Shanghai", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2019.jpg" },
  { year: "2019", title: "Malaysia Base ll", description: "50,000 Tons r-PET Pellets", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2019_2.jpg" },
  { year: "2021", title: "Shandong Base lll", description: "Aluminum Frames Canvas Art Art Frames", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2021.jpg" },
  { year: "2021", title: "IPO in Shanghai", description: "STOCK SYMBOL: 688087", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2021_2.jpg" },
  { year: "2022", title: "Lu'an Basell", description: "Multi-category Decorative Mouldings", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2022.jpg" },
  { year: "2022", title: "Vietnam Base", description: "Frame / Decorative Mouldings Picture / Mirror Frames", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/2022_2.jpg" },
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

const WHO_WE_ARE_PARTNER_LOGOS = Array.from({ length: 15 }, (_, index) => `https://www.intcoframing-us.com/wp-content/uploads/2024/01/comP${index + 1}.png`);

const WHO_WE_ARE_PARTNER_CARDS = [
  { title: "Our Products", path: "/products", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/aboutUs3.png" },
  { title: "Solutions", path: "/solutions", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/aboutUs4.png" },
  { title: "Projects", path: "/projects", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/aboutUs5.png" },
];

const SUSTAINABILITY_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/Sustainability1.jpg";
const SUSTAINABILITY_VIDEO_SRC = "https://www.youtube.com/embed/uzpr_7MwI_c?si=BM4lcdw_WKcepCph";
const SUSTAINABILITY_INTRO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability2.png";
const SUSTAINABILITY_REPORT_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability3.png";
const SUSTAINABILITY_REPORT_PDF = "https://www.intcoframing-us.com/wp-content/uploads/2024/02/ESG-Report-Intco-Framing.pdf";
const SUSTAINABILITY_EXTERNAL_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/wwa-er-pic-01.jpg";
const SUSTAINABILITY_EXTERNAL_IMAGES = [
  "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/wwa-er-pic-02.png",
  "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/wwa-er-pic-03.png",
  "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/wwa-er-pic-04.png",
  "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/wwa-er-pic-05.png",
  "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/wwa-er-pic-06.png",
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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability13.png",
    description:
      "Intco emphasizes on the environmental impact of the whole life cycle of products, and with advanced plastic recycling technology and recycled plastic products, it realizes the high-value recycling of plastics and opens up the entire industrial chain of plastic recycling, forming a unique “Circular Economy lntegration” business model.",
  },
  {
    title: "Comprehensive Environmental Initiatives",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability14.png",
    description:
      "Recognizing the pressing issue of climate change, we respond by implementing strategies to reduce ourcarbon footprint,emphasizing the judicious use of resources across all operations. Furthermore, we focus on optimizing waste utilization,transforming it into a valuable resource. We conscientiously uphold the highest environmental standards in every aspect of our business.",
  },
  {
    title: "Nurturing A Diverse And Inclusive Work Environment",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Sustainability15.png",
    description:
      "Our company is committed to fostering a workplace culture that embodies genuine care for our employees.We prioritize diversity and inclusion,actively valuing and respecting individuals of different nationalities,ethnicities,and backgrounds. In our pursuit of an inclusive and equal opportunity environment, we offer positions tailored to recruit employees with disabilities.",
  },
];

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

const PHILOSOPHY_HERO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy1.png";
const PHILOSOPHY_CEO_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy2.png";
const PHILOSOPHY_QUOTE_TOP = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Philosophy11.png";
const PHILOSOPHY_QUOTE_BOTTOM = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Philosophy10.png";
const PHILOSOPHY_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/PhilosophyBg.png";
const PHILOSOPHY_CENTER_BG = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Philosophy18.jpg";
const PHILOSOPHY_TEAM_IMAGE = "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy8.png";
const PHILOSOPHY_CONTACT_IMAGE = "https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Philosophy9.png";

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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/p1.png",
  },
  {
    title: "Vision",
    body: "Becoming a Global Leader in High-tech Recycled Resource Manufacturing",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/p2.png",
  },
  {
    title: "Spirit",
    body: "Honesty & Integrity, Diligence & Hardworking, Professionalism,Teamwork, Customer First",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/p3.png",
  },
  {
    title: "Values",
    body: "Love Goodness Truth",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/p4.png",
  },
  {
    title: "Objective",
    body: "With Human Wisdom Serving Human Needs",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/p5.png",
  },
  {
    title: "lmprovement & Innovation",
    body: "Every Suggestion Will be Cherished, Every lmprovement Will be Awarded",
    details: ["The Duty to Our Enterprise:", "Growing Our Business", "The Duty to Society:", "Practicing Ethical Behavior"],
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/p6.png",
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
  { imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy3.png", label: "WORLD CLASS CUSTOMER SERVICE" },
  { imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy5.png", label: "MEET THE TEAM" },
];

const PHILOSOPHY_GALLERY_MOSAIC = [
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy4.png",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy6.png",
  "https://www.intcoframing-us.com/wp-content/uploads/2024/01/Philosophy7.png",
];

const SOLUTIONS_INTRO_COPY =
  "We are dedicated to providing innovative and sustainable solutions. Collaborating seamlessly with our clients, we strive for continuous improvement in every aspect of our offerings. From innovative product designs to sustainable manufacturing practices, our solutions are crafted with a focus on the future.";

const SOLUTIONS_SERVICE_ITEMS: SolutionsServiceItem[] = [
  {
    title: "Business Insights & Trends",
    path: "/solutions/business-insights-trends",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/11.jpg",
    description:
      "With extensive relationships with our retail partners, we hold a distinct advantage which includes real time global market analysis. We offer real-time market performance to keep retailers informed about the latest trends, selling cycles and white space opportunities enabling strategic decision-making for expanded product offerings.",
  },
  {
    title: "Design & Engineering",
    path: "/solutions/design-engineering",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/22-1.jpg",
    description:
      "Collaborate with our skilled design and engineering teams for innovative product design, professional packaging design, cost engineering, captivating display design, extensive product research, and customizable solutions tailored to meet your unique needs. We prioritize innovation and aesthetic appeal, ensuring your products stand out in the competitive market.",
  },
  {
    title: "Manufacturing & Delivery",
    path: "/solutions/manufacturing-delivery",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/33-1.jpg",
    description:
      "Intco's vertically integrated supply chain of raw materials, we maintain control over product quality from the source, ensuring consistent excellence for initial orders and reorders. With formidable production capabilities, we have the capacity to manufacture 1.2 million boxes of PS moulding annually. We can meet the demands of large-scale production while consistently upholding rigorous standards of quality.",
  },
  {
    title: "Global Production and Supply",
    path: "/solutions/global-production-and-supply",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/44.jpg",
    description:
      "By strategically locating our factories in China, Vietnam and Malaysia, we enhance our resilience to external factors that may impact the supply chain and maximize efficiency and flexibility in meeting your demands. All of our factories ensure advanced production technology and equipment, quality manufacturing and flexible shipping. Operating in strict adherence to international quality standards, each factory has earned high recognition for product quality from our customers.",
  },
  {
    title: "Certification",
    path: "/solutions/certification",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/55.jpg",
    description:
      "Rest easy with our commitment to quality and compliance. Intco Framing provides outstanding products and quality services to global customers. We actively certify quality systems and cooperate with third-party audit agencies, customers, and suppliers for audit supervision.",
  },
  {
    title: "Retailer Support",
    path: "/solutions/retailer-support",
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/02/66.jpg",
    description:
      "As the only home décor manufacturer that starts with recycled materials around the world, we truly ensure quality control from the source, and pride ourselves on offering continuous assistance to ensure the prosperity of your retail business.",
  },
];

const SOLUTIONS_PROCESS_STEPS = [
  { label: "Design", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/solution3.png" },
  { label: "Frame Extrusion", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/solution4.png" },
  { label: "Assemble", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/solution5.png" },
  { label: "Warehousing", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/solution6.png" },
  { label: "Packing", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/solution7.png" },
  { label: "Quality Control", imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/01/solution8.png" },
];

const SOLUTIONS_PROCESS_LABELS: Record<Locale, string[]> = {
  en: ["Design", "Frame Extrusion", "Assemble", "Warehousing", "Packing", "Quality Control"],
  es: ["Diseño", "Extrusión de marcos", "Ensamblaje", "Almacenaje", "Embalaje", "Control de calidad"],
  pt: ["Design", "Extrusão de molduras", "Montagem", "Armazenagem", "Embalagem", "Controle de qualidade"],
  fr: ["Design", "Extrusion de cadres", "Assemblage", "Stockage", "Emballage", "Contrôle qualité"],
  de: ["Design", "Rahmenextrusion", "Montage", "Lagerung", "Verpackung", "Qualitätskontrolle"],
  ja: ["デザイン", "フレーム押出", "組立", "倉庫保管", "梱包", "品質管理"],
};

const SUSTAINABILITY_LABELS: Record<Locale, { watchVideo: string; downloadPdf: string; externalRatings: string; environmentalContribution: string; protectTree: string; inAction: string; meetTeam: string; years: string }> = {
  en: {
    watchVideo: "Watch Video",
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
  const { homePage, productCategories, solutions, blogPosts } = data;
  const parentCategories = productCategories.filter((category) => !category.parentSlug).slice(0, 5);
  const href = (path: string) => localizePath(locale, path);
  const heroSlides = localizedHomeHeroSlides(homePage, locale);
  const localizedBlogCards = blogPosts
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

      <section className="relative overflow-hidden bg-white px-4 pt-16 sm:px-6 lg:pt-[100px]">
        <div className="intco-source-container px-5">
          <div className="lg:flex">
            <div className="pb-8 lg:w-1/2 lg:pb-[90px]">
              <HomeSourceTitle title={(homePage.companyProfile?.title || "COMPANY PROFILE").toUpperCase()} align="left" />
              <p className="mt-10 max-w-2xl text-pretty text-lg leading-[30px] text-[#363636] lg:mt-[50px]">
                {homePage.companyProfile?.description ||
                  "Founded in 2002, INTCO upholds the reputation for high quality, greatdesigns, and fast delivery to fulfill all aspects of a project - from artistryto functionality, saving you time and money."}
              </p>
              <ul className="mt-5 space-y-2 text-lg leading-10 text-[#363636]">
                {(homePage.companyProfile?.points || []).map((point, index) => (
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
            <div className="flex items-end lg:w-1/2">
              <LazyVideoEmbed className="aspect-video w-full overflow-hidden bg-black" srcDoc={HOME_PROFILE_VIDEO_SRC_DOC} title="YouTube video player" />
            </div>
          </div>
        </div>
        <div className="intco-source-container relative z-10 -mt-16 px-5">
          <div className="relative py-5">
            <div className="absolute inset-y-0 right-0 w-4/5 bg-[rgba(72,70,83,0.27)]" />
            <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {localizedHomeStats(locale).map((stat) => (
                <div key={stat.label} className="flex items-center justify-center pb-10 pt-5 text-[#484653]">
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

      <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-16 pt-16 sm:px-6 lg:pt-[230px]">
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
  const copy = locale === "en" ? HOME_PRODUCT_COPY[category.slug] || { title: category.title, description: category.description || "" } : { title: category.title, description: category.description || "" };
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
  if (locale !== "en") return solution.description || "";
  const byTitle: Record<string, string> = {
    "Business Insights & Trends": "With extensive relationships with our retail partners, we hold a distinct advant...",
    "Design & Engineering": "Collaborate with our skilled design and engineering teams for innovative product...",
    "Manufacturing & Delivery": "Intco's vertically integrated supply chain of raw materials, we maintain control...",
    "Global Production and Supply": "By strategically locating our factories in China, Vietnam and Malaysia, we enhan...",
    Certification: "Rest easy with our commitment to quality and compliance. Intco Framing provides ...",
    "Retailer Support": "As the only home decor manufacturer that starts with recycled materials around t...",
  };
  return byTitle[solution.title] || solution.description || "";
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
  const activeManual = PRODUCT_MANUALS[0];
  const localizedManuals = PRODUCT_MANUALS.map((manual) => {
    if (locale === "en") return manual;
    const category = categoryBySourceTitle(categories, manual.title);
    return {
      ...manual,
      title: category?.title || manual.title,
      description: category?.description || manual.description,
    };
  });
  const localizedActiveManual = localizedManuals[0] || activeManual;

  return (
    <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-10 sm:px-6 lg:pt-[99px]">
      <div className="mx-auto max-w-[1600px]">
        <ProductSourceTitle title={t(locale, "catalog")} />
        <ProductSectionDescription first={title} second={description} className="lg:mt-[55px]" />
        <div className="mt-8 flex flex-col gap-3 lg:mt-[55px] lg:flex-row lg:gap-[39px]">
          <div className="wow fadeInUp grid gap-3 sm:grid-cols-5 lg:flex lg:w-[370px] lg:flex-col" data-reveal="source-up">
            {localizedManuals.map((manual, index) => (
                <CatalogDownloadButton
                  key={manual.title}
                  pdfUrl={manual.pdfUrl}
                  className={`flex h-14 items-center justify-center px-4 text-center text-base font-semibold transition duration-200 hover:bg-[#484653] hover:text-white lg:h-[127px] lg:text-2xl ${index === 0 ? "bg-[#484653] text-white" : "bg-white text-[#3e3e3e]"}`}
                >
                  {manual.title}
                </CatalogDownloadButton>
              ))}
          </div>
          <div className="wow fadeInDown bg-white p-5 lg:min-h-[520px] lg:flex-1 lg:p-[70px]" data-reveal="source-down">
            <div className="grid gap-7 lg:grid-cols-[45%_1fr] lg:gap-[5%]">
              <div className="relative mx-auto aspect-[257/300] w-full max-w-[257px] bg-neutral-100 lg:max-w-none">
                <Image src={activeManual.imageUrl} alt={localizedActiveManual.title} fill className="object-cover" sizes="(min-width: 1024px) 28vw, 257px" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-semibold leading-[39px] text-[#3e3e3e] lg:text-[38px]">{localizedActiveManual.title}</h3>
                  <p className="mt-8 text-base leading-[30px] text-[#363636] lg:mt-10 lg:text-lg">{localizedActiveManual.description}</p>
                </div>
                <CatalogDownloadButton pdfUrl={activeManual.pdfUrl} className="mt-10 inline-flex h-[58px] w-[200px] items-center justify-center rounded-full border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white lg:mt-[120px]">
                  {t(locale, "exploreMore")} <Download className="ml-2" size={20} />
                </CatalogDownloadButton>
              </div>
            </div>
            <div className="sr-only">
              {localizedManuals.slice(1).map((manual) => (
                <p key={manual.title}>
                  {manual.title}: {manual.description}
                </p>
              ))}
              <span>{t(locale, "catalog")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductTestReportSection({ title, description, locale }: { title: string; description: string; locale: Locale }) {
  return (
    <section className="overflow-hidden bg-white bg-cover bg-center px-5 pb-16 pt-10 sm:px-6 lg:pb-[120px] lg:pt-[99px]" style={{ backgroundImage: `url(${PRODUCT_TEST_REPORT_BG})` }}>
      <div className="mx-auto max-w-[1600px]">
        <ProductSourceTitle title={t(locale, "testReport")} />
        <ProductSectionDescription first={title} second={description} className="lg:mt-[55px]" />
        <div className="mx-auto mt-10 grid max-w-[1230px] gap-6 sm:grid-cols-2 lg:mt-[55px] lg:grid-cols-4">
          {PRODUCT_REPORT_IMAGES.map((report, index) => (
            <div key={report.title} className="wow fadeInUp bg-white p-2.5" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
              <div className="relative aspect-[292/213] shadow-[0_0_10px_3px_#ccc]">
                <Image src={report.imageUrl} alt={report.title} fill className="object-cover" sizes="292px" />
              </div>
              <span className="sr-only">{report.title}</span>
            </div>
          ))}
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
        <p className="wow fadeInUp mx-auto mt-9 max-w-[1100px] text-center text-base leading-[30px] text-[#363636] lg:mt-[55px] lg:text-lg" data-reveal="source-up">
          {t(locale, "contactFormIntro")}
        </p>
        <div className="ORDERASAMPLEFlex intco-leadscloud-main-form mx-auto mt-12 max-w-[1446px] lg:mt-[55px]">
          <div className={leadsCloudBuryClass(LEADSCLOUD_FORM_IDS.main)} />
        </div>
      </div>
    </section>
  );
}

function MirrorCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = MIRROR_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = MIRROR_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(MIRROR_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Mirror"} locale={locale} path={category?.path} />

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-[99px] max-lg:pt-12">
        <div className="mx-auto max-w-[1160px]">
          <ProductSourceTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Mirror"}</h1>
      <Image src="https://www.intcoframing-us.com/wp-content/uploads/2024/07/%E6%9C%AA%E6%A0%87%E9%A2%98-3.jpg" alt="" width={1} height={1} className="hidden" />
          <p className="wow fadeInUp mx-auto mb-[86px] mt-[55px] max-w-[1120px] text-center text-lg leading-[30px] text-[#363636] max-lg:mb-10 max-lg:mt-8 max-lg:text-base" data-reveal="source-up">
            {localizedCategoryIntro(category, "Find the perfect mirror at Intco Framing. Explore the latest bathroom solutions at INTCO Framing with our wall mirrors, standing mirrors, and LED mirrors.", locale)}
          </p>
          <ul className="grid gap-x-[67px] gap-y-[68px] md:grid-cols-2 lg:grid-cols-3">
            {collectionCards.map((card, index) => (
              <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
                <Link href={localizePath(locale, card.path)} className="group relative block overflow-hidden rounded-[20px] bg-neutral-200">
                  <div className="relative aspect-[305/380]">
                    <Image src={card.imageUrl} alt={card.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 50vw" />
                  </div>
                  <div className="absolute inset-0 rounded-[20px] bg-black/30 px-[5%] opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-[31px] left-[34px] translate-y-[-10px] text-2xl font-semibold leading-9 text-white">{card.title}</div>
                  </div>
                  <span className="sr-only">{card.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-[68px] flex justify-center max-lg:mt-10">
            <Link href={localizePath(locale, "/mirror")} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-lg font-semibold text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-[99px] max-lg:pt-12">
        <div className="mx-auto max-w-[1300px]">
          <ProductSourceTitle title={t(locale, "bestSellers")} />
          <div className="relative mt-[64px] px-[70px] max-lg:px-0">
            <button type="button" aria-label={t(locale, "previousBestSeller")} className="absolute left-0 top-[173px] z-[2] flex size-[30px] items-center justify-center rounded-full bg-[#484653] text-white max-lg:hidden">
              ‹
            </button>
            <button type="button" aria-label={t(locale, "nextBestSeller")} className="absolute right-0 top-[173px] z-[2] flex size-[30px] items-center justify-center rounded-full bg-[#484653] text-white max-lg:hidden">
              ›
            </button>
            <ul className="grid gap-[30px] md:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((item, index) => (
                <li key={item.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <Link href={localizePath(locale, item.path)} className="group block text-center">
                    <div className="relative aspect-square rounded-full bg-white">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-contain transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, 50vw" />
                    </div>
                    <div className="mx-auto mb-[97px] mt-[39px] max-w-[280px] text-sm font-medium leading-[18px] text-[#484653] max-lg:mb-10">{item.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto max-w-[1600px] space-y-5 pb-4 text-lg leading-[30px] text-[#3e3e3e] max-lg:text-base max-lg:leading-7">
            {copy.map((item) => (
              <div key={item.title}>
                <p className="font-semibold text-[#484653]">{item.title}</p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <span className="sr-only">{t(locale, "products")}</span>
        </div>
      </section>

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

      <section className="overflow-hidden bg-[#f3f3f3] pb-[5px] pt-6 lg:pb-7 lg:pt-[99px]">
        <div className="intco-source-container px-5">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <p className="wow fadeInUp mx-auto mb-0 mt-4 max-w-[1160px] text-center text-base leading-6 text-[#363636] lg:mb-[86px] lg:mt-[55px]" data-reveal="source-up">
            {localizedCategoryIntro(category, "Find the perfect picture frame at Intco Framing. Browse our best sellers, including tabletop frames, wall frames, and poster frames. Everything you want is here.", locale)}
          </p>
          <ul className="grid gap-[34px] md:grid-cols-2 lg:grid-cols-3 lg:gap-x-[67px] lg:gap-y-[68px]">
            {collectionCards.map((card, index) => (
              <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
                <PictureFrameCollectionCard card={card} locale={locale} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center lg:mt-[68px]">
            <Link href={localizePath(locale, "/picture-frame")} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] pb-[40px] pt-12 lg:pt-[99px]">
        <PictureFrameSectionTitle title={t(locale, "bestSellers")} />
        <div className="intco-source-container mt-10 px-5 lg:mt-[65px]">
          <div className="relative min-h-[430px] cursor-pointer lg:min-h-[994px]">
            <button type="button" aria-label={t(locale, "previousBestSeller")} className="absolute left-[-10px] top-[151px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ‹
            </button>
            <button type="button" aria-label={t(locale, "nextBestSeller")} className="absolute right-[-10px] top-[151px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ›
            </button>
            <div className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((item, index) => (
                <Link key={item.title} href={localizePath(locale, item.path)} className="wow fadeInUp group block text-center" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <div className="relative aspect-square rounded-full bg-white">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-contain transition duration-700 group-hover:scale-105" sizes="270px" />
                  </div>
                  <div className="mx-auto mb-12 mt-[39px] max-w-[270px] text-sm font-medium leading-[18px] text-[#484653] lg:mb-[97px]">{item.title}</div>
                </Link>
              ))}
            </div>
            <div className="space-y-6 text-base font-normal leading-6 text-[#363636] lg:space-y-6">
              {copy.map((item) => (
                <p key={item.title}>
                  <strong className="font-semibold">{item.title}</strong>
                  <br />
                  {item.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

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
        <p className="wow fadeInUp mx-auto mb-[55px] mt-[55px] max-w-[1160px] text-center text-base leading-6 text-[#363636]" data-reveal="source-up">
          {t(locale, "contactFormIntro")}
        </p>
        <div className="ORDERASAMPLEFlex intco-leadscloud-main-form mx-auto max-w-[1160px] pb-[77px] lg:px-[77px]">
          <div className={leadsCloudBuryClass(LEADSCLOUD_FORM_IDS.main)} />
        </div>
      </div>
    </section>
  );
}

function PictureFrameCollectionCard({
  card,
  locale,
}: {
  card: (typeof PICTURE_FRAME_COLLECTION_CARDS)[number];
  locale: Locale;
}) {
  return (
    <Link href={localizePath(locale, card.path)} className="group relative block aspect-[342/426] overflow-hidden rounded-[20px]">
      <Image src={card.imageUrl} alt={card.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 342px, 100vw" />
      <span className="absolute inset-0 rounded-[20px] bg-black/30 px-[5%] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute bottom-[31px] left-[34px] -translate-y-2.5 text-2xl font-semibold leading-9 text-white">{card.title}</span>
      </span>
    </Link>
  );
}

function ArtCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = ART_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = ART_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(ART_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Art"} locale={locale} path={category?.path} />

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-[5px] pt-12 lg:pt-[99px]">
        <div className="mx-auto max-w-[1160px]">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Art"}</h1>
          <p className="wow fadeInUp mx-auto mb-10 mt-8 max-w-[1000px] text-center text-base leading-6 text-[#363636] lg:mb-[86px] lg:mt-[55px]" data-reveal="source-up">
            {localizedCategoryIntro(category, "Explore Intco Framing unique art collection. From framed art and canvas art to alternative wall decor, discover our best sellers to suit your style. Shop now!", locale)}
          </p>
          <ul className="grid gap-[34px] md:grid-cols-2 lg:grid-cols-3 lg:gap-x-[67px] lg:gap-y-[68px]">
            {collectionCards.map((card, index) => (
              <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                <ArtCollectionCard card={card} locale={locale} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center lg:mt-[68px]">
            <Link href={localizePath(locale, "/art")} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-12 lg:pt-[99px]">
        <PictureFrameSectionTitle title={t(locale, "bestSellers")} />
        <div className="mx-auto mt-10 max-w-[1160px] lg:mt-[65px]">
          <div className="relative">
            <button type="button" aria-label={t(locale, "previousBestSeller")} className="absolute left-[-30px] top-[138px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ‹
            </button>
            <button type="button" aria-label={t(locale, "nextBestSeller")} className="absolute right-[-30px] top-[138px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ›
            </button>
            <ul className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((item, index) => (
                <li key={item.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <Link href={localizePath(locale, item.path)} className="group block text-center">
                    <div className="relative aspect-square bg-white">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="270px" />
                    </div>
                    <div className="mx-auto mb-10 mt-[39px] max-w-[270px] text-sm font-medium leading-[18px] text-[#484653] lg:mb-[97px]">{item.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 pb-0 text-base font-normal leading-6 text-[#363636] lg:mt-0">
            {copy.map((item) => (
              <div key={item.title}>
                <p>
                  <strong className="font-semibold">{item.title}</strong>
                </p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PictureFrameContactSection locale={locale} />
    </>
  );
}

function ArtCollectionCard({
  card,
  locale,
}: {
  card: (typeof ART_COLLECTION_CARDS)[number];
  locale: Locale;
}) {
  return (
    <Link href={localizePath(locale, card.path)} className="group relative block aspect-[342/426] overflow-hidden rounded-[20px]">
      <Image src={card.imageUrl} alt={card.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 342px, 100vw" />
      <span className="absolute inset-0 rounded-[20px] bg-black/30 px-[5%] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute bottom-[31px] left-[34px] -translate-y-2.5 text-2xl font-semibold leading-9 text-white">{card.title}</span>
      </span>
    </Link>
  );
}

function FurnitureCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = FURNITURE_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = FURNITURE_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(FURNITURE_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Furniture"} locale={locale} path={category?.path} />

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-[5px] pt-12 lg:pt-[99px]">
        <div className="mx-auto max-w-[1160px]">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Furniture"}</h1>
          <p className="wow fadeInUp mx-auto mb-10 mt-8 max-w-[1160px] text-center text-base leading-6 text-[#363636] lg:mb-[86px] lg:mt-[55px]" data-reveal="source-up">
            {localizedCategoryIntro(category, "Explore Intco Framing premium furniture collection. From medicine cabinets to shelves, discover our latest home storage solutions. Shop now!", locale)}
          </p>
          <ul className="grid gap-[34px] md:grid-cols-2 lg:grid-cols-3 lg:gap-x-[67px] lg:gap-y-[68px]">
            {collectionCards.map((card, index) => (
              <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                <FurnitureCollectionCard card={card} locale={locale} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center lg:mt-[68px]">
            <Link href={localizePath(locale, "/furniture")} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
          <span className="sr-only">{t(locale, "products")}</span>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-12 lg:pt-[99px]">
        <PictureFrameSectionTitle title={t(locale, "bestSellers")} />
        <div className="mx-auto mt-10 max-w-[1160px] lg:mt-[65px]">
          <div className="relative">
            <button type="button" aria-label={t(locale, "previousBestSeller")} className="absolute left-[-30px] top-[138px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ‹
            </button>
            <button type="button" aria-label={t(locale, "nextBestSeller")} className="absolute right-[-30px] top-[138px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ›
            </button>
            <ul className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((item, index) => (
                <li key={item.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <Link href={localizePath(locale, item.path)} className="group block text-center">
                    <div className="relative aspect-square bg-white">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="270px" />
                    </div>
                    <div className="mx-auto mb-10 mt-[39px] max-w-[270px] text-sm font-medium leading-[18px] text-[#484653] lg:mb-[97px]">{item.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 pb-0 text-base font-normal leading-6 text-[#363636]">
            {copy.map((item) => (
              <div key={item.title}>
                <p>
                  <strong className="font-semibold">{item.title}</strong>
                </p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PictureFrameContactSection locale={locale} />
    </>
  );
}

function FurnitureCollectionCard({
  card,
  locale,
}: {
  card: (typeof FURNITURE_COLLECTION_CARDS)[number];
  locale: Locale;
}) {
  return (
    <Link href={localizePath(locale, card.path)} className="group relative block aspect-[342/426] overflow-hidden rounded-[20px]">
      <Image src={card.imageUrl} alt={card.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 342px, 100vw" />
      <span className="absolute inset-0 rounded-[20px] bg-black/30 px-[5%] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute bottom-[31px] left-[34px] -translate-y-2.5 text-2xl font-semibold leading-9 text-white">{card.title}</span>
      </span>
    </Link>
  );
}

function MemoBoardCategorySourceView({ locale, category, categories, products }: { locale: Locale; category?: ProductCategory; categories: ProductCategory[]; products: Product[] }) {
  const collectionCards = MEMO_BOARD_COLLECTION_CARDS.map((card) => localizeSourceCategoryCard(card, categories, locale));
  const bestSellers = MEMO_BOARD_BEST_SELLERS.map((item) => localizeSourceProductCard(item, products, locale));
  const copy = localizeSourceCopyItems(MEMO_BOARD_CATEGORY_COPY, categories, locale);
  return (
    <>
      <ProductCategorySourceHero title={category?.title || "Memo Board"} locale={locale} path={category?.path} />

      <section className="overflow-hidden bg-[#f3f3f3] pb-[5px] pt-12 lg:pt-[99px]">
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <PictureFrameSectionTitle title={t(locale, "collection")} />
          <h1 className="sr-only">{category?.title || "Memo Board"}</h1>
          <div className="wow fadeInUp DESC center margin86" data-reveal="source-up" aria-hidden="true" />
          <ul className="m-0 mt-[86px] grid list-none gap-[34px] p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-[67px] lg:gap-y-[68px]">
            {collectionCards.map((card, index) => (
              <li key={card.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${(index % 3) * 80}ms` } as React.CSSProperties}>
                <MemoBoardCollectionCard card={card} locale={locale} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center lg:mt-0">
            <Link href={localizePath(locale, "/memo-board")} className="inline-flex h-[58px] w-[306px] items-center justify-center rounded-[29px] border-2 border-[#484653] text-base font-normal text-[#484653] transition duration-700 hover:scale-105 hover:bg-[#484653] hover:text-white lg:text-lg">
              {t(locale, "viewAllProducts")} <ArrowRight className="ml-2" size={22} />
            </Link>
          </div>
          <span className="sr-only">{t(locale, "products")}</span>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] pb-10 pt-12 lg:pt-[99px]">
        <PictureFrameSectionTitle title={t(locale, "bestSellers")} />
        <div className="intco-source-container mt-10 px-5 lg:mt-[65px] min-[1601px]:px-[70px]">
          <div className="relative">
            <button type="button" aria-label={t(locale, "previousBestSeller")} className="absolute left-[-30px] top-[138px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ‹
            </button>
            <button type="button" aria-label={t(locale, "nextBestSeller")} className="absolute right-[-30px] top-[138px] z-[2] hidden size-[30px] items-center justify-center rounded-full bg-[#484653] text-xl leading-[30px] text-white lg:flex">
              ›
            </button>
            <ul className="m-0 grid list-none gap-[26px] p-0 md:grid-cols-2 lg:grid-cols-4">
              {bestSellers.map((item, index) => (
                <li key={item.title} className="wow fadeInUp" data-reveal="source-up" style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <Link href={localizePath(locale, item.path)} className="group block pb-10 text-center lg:pb-[97px]">
                    <div className="relative aspect-square bg-white">
                      <Image src={item.imageUrl} alt={item.title} fill loading="eager" className="object-cover transition duration-700 group-hover:scale-105" sizes="270px" />
                    </div>
                    <div className="mx-auto mt-[39px] max-w-[270px] text-sm font-medium leading-[18px] text-[#484653]">{item.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="intco-source-container px-5 min-[1601px]:px-0">
          <div className="space-y-6 pb-0 text-base font-normal leading-6 text-[#363636]">
            {copy.map((item) => (
              <div key={item.title}>
                <p>
                  <strong className="font-semibold">{item.title}</strong>
                </p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PictureFrameContactSection locale={locale} />
    </>
  );
}

function MemoBoardCollectionCard({
  card,
  locale,
}: {
  card: (typeof MEMO_BOARD_COLLECTION_CARDS)[number];
  locale: Locale;
}) {
  return (
    <Link href={localizePath(locale, card.path)} className="group relative block aspect-[342/426] overflow-hidden rounded-[20px]">
      <Image src={card.imageUrl} alt={card.title} fill loading="eager" className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 342px, 100vw" />
      <span className="absolute inset-0 rounded-[20px] bg-black/30 px-[5%] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="absolute bottom-[31px] left-[34px] -translate-y-2.5 text-2xl font-semibold leading-9 text-white">{card.title}</span>
      </span>
    </Link>
  );
}

export function ProductListingView({
  title,
  description,
  products,
  categories,
  heroImage,
  category,
  locale,
}: {
  title: string;
  description?: string;
  products: Product[];
  categories?: ProductCategory[];
  heroImage?: string;
  category?: ProductCategory;
  locale: Locale;
}) {
  if (category?.slug === "mirror") {
    return <MirrorCategorySourceView locale={locale} category={category} categories={categories || []} products={products} />;
  }
  if (category?.slug === "picture-frame") {
    return <PictureFrameCategorySourceView locale={locale} category={category} categories={categories || []} products={products} />;
  }
  if (category?.slug === "art") {
    return <ArtCategorySourceView locale={locale} category={category} categories={categories || []} products={products} />;
  }
  if (category?.slug === "furniture") {
    return <FurnitureCategorySourceView locale={locale} category={category} categories={categories || []} products={products} />;
  }
  if (category?.slug === "memo-board") {
    return <MemoBoardCategorySourceView locale={locale} category={category} categories={categories || []} products={products} />;
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
            <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{category?.title || title}</h2>
            <p className="mt-4 text-pretty leading-8 text-neutral-600">
              {category?.description || description || "Explore INTCO Framing product collections for retail, hospitality, residential and commercial interior programs."}
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
    if (locale === "en") return item;
    const solution = solutions.find((entry) => entry.path === item.path);
    return {
      ...item,
      title: solution?.title || item.title,
      description: solution?.description || item.description,
    };
  });
  const relatedLinks = SOLUTIONS_RELATED_LINKS.map((item) => ({
    ...item,
    title: item.path === "/products" ? t(locale, "featuredProductsLabel") : item.path === "/projects" ? t(locale, "latestProjects") : t(locale, "customerService"),
    description: t(locale, "productCatalogIntroDescription"),
  }));
  return (
    <>
      <SolutionsSourceHero title={page?.title || t(locale, "solutions")} locale={locale} />

      <section className="overflow-hidden bg-[#f8f8f8] px-4 py-16 sm:px-6 lg:py-[100px]">
        <div className="intco-source-container px-5">
          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(420px,783px)] lg:gap-[122px]">
            <div data-reveal="left">
              <SolutionsSourceTitle title={t(locale, "endToEndHomeDecor")} align="left" />
              <p className="mt-[64px] max-w-[690px] text-lg font-normal leading-8 text-[#363636]">{locale === "en" ? SOLUTIONS_INTRO_COPY : page?.description || t(locale, "sourceHomeSolutionsIntro")}</p>
              <div className="mt-[55px]">
                <SolutionsOutlineLink href={href("/who-we-are")} width={254}>
                  {t(locale, "aboutIntco")}
                </SolutionsOutlineLink>
              </div>
            </div>
            <div className="relative aspect-[783/504] w-full overflow-hidden" data-reveal="right">
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
    <div className={`relative uppercase ${centered ? "text-center" : "text-left"}`} data-reveal={centered ? "fade" : "left"}>
      <div
        className={`pointer-events-none absolute top-0 text-[70px] font-semibold leading-none text-transparent opacity-20 [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-[46px] max-[650px]:hidden ${
          centered ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : `left-0 ${wide ? "max-w-[1200px]" : "max-w-[760px]"} -translate-x-5 whitespace-normal`
        }`}
      >
        {title}
      </div>
      <h2
        className={`relative z-10 inline-block border-b border-[#484653] pb-[47px] text-[45px] font-semibold leading-[39px] text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-4xl max-[650px]:text-[28px] ${
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

function BusinessInsightsHero({ locale }: { locale: Locale }) {
  const title = pick(BUSINESS_INSIGHTS_PAGE.heroTitle, locale);
  return (
    <section className="relative aspect-[1920/600] min-h-[260px] overflow-hidden">
      <Image src={BUSINESS_INSIGHTS_HERO_IMAGE} alt={title} fill className="object-cover" sizes="100vw" preload />
      <div className="absolute inset-0 bg-white/30" />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center">
        <div className="intco-source-container px-5 text-center text-[#484653] max-lg:text-left">
          <h1 className="text-[42px] font-bold leading-[80px] text-[#333333] max-lg:text-[38px] max-lg:leading-tight">{title}</h1>
          <nav className="flex items-center justify-center gap-3 py-3 text-lg font-medium leading-10 max-lg:justify-start max-lg:text-base lg:text-xl" aria-label="Breadcrumb">
            <BreadcrumbLink href={localizePath(locale, "/")}>{t(locale, "home")}</BreadcrumbLink>
            <span>›</span>
            <BreadcrumbLink href={localizePath(locale, "/solutions")}>{t(locale, "solutions")}</BreadcrumbLink>
            <span>›</span>
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
        <Image src="https://www.intcoframing-us.com/wp-content/uploads/2024/01/Solutions1.png" alt="" width={1} height={1} className="hidden" />

        <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-0 pt-[29px] sm:px-6">
        <div className="mx-auto max-w-[1160px]">
          <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.main, locale)} />
          <div className="mt-[58px] grid bg-white lg:grid-cols-[61.25%_1fr]" data-reveal="fade">
            <div className="relative aspect-[710/478] overflow-hidden">
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

      <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-[148px] pt-[70px] sm:px-6 max-lg:py-12">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid items-start gap-[100px] lg:grid-cols-[480px_580px]">
            <div className="flex flex-col items-start" data-reveal="fade">
              <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.trend, locale)} align="left" />
              <p className="mb-[77px] mt-[58px] max-w-[551px] text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px] max-lg:mb-8">{pick(BUSINESS_INSIGHTS_PAGE.copy.trend, locale)}</p>
              <BusinessInsightsOutlineLink href={localizePath(locale, "/solutions/business-insights-trends")} width={306}>
                {t(locale, "exploreMore")}
              </BusinessInsightsOutlineLink>
            </div>
            <div className="relative overflow-hidden bg-white" data-reveal="fade">
              <div className="flex w-[300%]">
                {BUSINESS_INSIGHTS_TREND_SLIDES.map((slide) => (
                  <Link key={slide.imageUrl} href={localizePath(locale, slide.path)} className="relative block aspect-[580/321] w-1/3 shrink-0">
                    <Image src={slide.imageUrl} alt="" fill className="object-cover" sizes="580px" />
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

      <section className="overflow-hidden bg-white px-4 pb-0 pt-10 sm:px-6">
        <div className="mx-auto max-w-[1160px]">
          <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.industryReport, locale)} align="left" />
          <p className="mb-[34px] mt-[58px] text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px] max-lg:mb-10">{pick(BUSINESS_INSIGHTS_PAGE.copy.trend, locale)}</p>
          <ul className="-mx-[41px] grid md:grid-cols-3">
            {BUSINESS_INSIGHTS_PAGE.reports.map((report, index) => {
              const reportTitle = pick(report.title, locale);
              return (
                <li key={reportTitle} className="box-border px-[41px] pb-0 max-md:mb-10" data-reveal style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
                  <article>
                    <Link href={localizePath(locale, report.path)} className="group block">
                      <div className="relative aspect-[332/257] overflow-hidden bg-neutral-100">
                        <Image src={report.imageUrl} alt={reportTitle} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 332px, 100vw" />
                      </div>
                      <h3 className="mt-[29px] line-clamp-2 h-[3em] text-[26px] font-semibold leading-[1.5] text-[#484653] max-lg:text-xl">{reportTitle}</h3>
                    </Link>
                    <div className="mt-[14px] text-base font-light leading-[39px] text-[#999]">{report.date}</div>
                    <p className="text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px]">{pick(report.excerpt, locale)}</p>
                    <div className="mb-[45px] mt-[39px] max-lg:mb-10">
                      <BusinessInsightsOutlineLink href={localizePath(locale, report.path)}>{t(locale, "readMore")}</BusinessInsightsOutlineLink>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 pb-10 pt-10 sm:px-6">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid items-start gap-[96px] pb-[135px] lg:grid-cols-[564px_1fr] max-lg:gap-8 max-lg:pb-10">
            <div className="relative aspect-[564/368] overflow-hidden" data-reveal="fade">
              <Image src={BUSINESS_INSIGHTS_RECOMMENDATION_IMAGE} alt="BusinessInsights9" fill className="object-cover" sizes="(min-width: 1024px) 564px, 100vw" />
            </div>
            <div data-reveal="fade">
              <BusinessInsightsTitle title={pick(BUSINESS_INSIGHTS_PAGE.sectionTitles.bestsellers, locale)} align="left" narrow />
              <p className="mt-[58px] max-w-[599px] text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px] max-lg:mt-8">{pick(BUSINESS_INSIGHTS_PAGE.copy.recommendation, locale)}</p>
              <div className="mt-[90px] max-lg:mt-8">
                <BusinessInsightsOutlineLink href={localizePath(locale, "/products")}>{t(locale, "exploreMore")}</BusinessInsightsOutlineLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f8f8f8] px-4 pb-10 pt-10 sm:px-6 max-lg:pb-10">
        <div className="mx-auto max-w-[1160px]">
          <BusinessInsightsTitle title={t(locale, "ourManufacturing")} />
          <p className="mx-auto mb-[58px] mt-[55px] max-w-[1320px] text-center text-base leading-6 text-[#363636] min-[1601px]:text-lg min-[1601px]:leading-[30px] max-lg:mb-10">{t(locale, "sourceManufacturingIntro")}</p>
          <div className="mb-[55px] flex overflow-hidden rounded-md bg-white shadow-[0_2px_27px_0_rgba(114,114,114,0.2)] max-lg:flex-col" data-reveal="fade">
            <div className="w-[58%] overflow-hidden rounded-md max-lg:w-full">
              <LazyVideoEmbed className="aspect-video w-full overflow-hidden bg-black" srcDoc={HOME_PROFILE_VIDEO_SRC_DOC} title="YouTube video player" />
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
            <iframe
              src="https://www.youtube.com/embed/N7I6CgHXCZQ?si=S5SW7QBzqJsOwXMC"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
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

function ProjectsSourceListingView({ locale, pageNumber, projects, variant = "all" }: { locale: Locale; pageNumber: number; projects: Project[]; variant?: "all" | "residential" | "commercial" }) {
  const isResidential = variant === "residential";
  const isCommercial = variant === "commercial";
  const activePage = isResidential || isCommercial ? 1 : PROJECTS_SOURCE_PAGE_ITEMS[pageNumber] ? pageNumber : 1;
  const items = isCommercial ? PROJECTS_SOURCE_COMMERCIAL_ITEMS : PROJECTS_SOURCE_PAGE_ITEMS[activePage];
  const pageHref = (page: number) => (page === 1 ? "/projects" : `/projects/page/${page}`);
  const title = isResidential ? t(locale, "residential") : isCommercial ? t(locale, "commercial") : t(locale, "projects").toUpperCase();
  const heroTitle = isResidential ? t(locale, "residential") : isCommercial ? t(locale, "commercial") : t(locale, "projects");
  const paginationItems =
    activePage === 1
      ? [
          { label: "1", page: 1, current: true },
          { label: "2", page: 2 },
          { label: "3", page: 3 },
            { label: ">", page: 2, ariaLabel: t(locale, "nextProjectsPage") },
        ]
      : activePage === 2
        ? [
            { label: "<", page: 1, ariaLabel: t(locale, "previousProjectsPage") },
            { label: "1", page: 1 },
            { label: "2", page: 2, current: true },
            { label: "3", page: 3 },
            { label: ">", page: 3, ariaLabel: t(locale, "nextProjectsPage") },
          ]
        : [
            { label: "<", page: 2, ariaLabel: t(locale, "previousProjectsPage") },
            { label: "1", page: 1 },
            { label: "2", page: 2 },
            { label: "3", page: 3, current: true },
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
              <ProjectsSourceCard key={project.title} project={project} projects={projects} index={index} locale={locale} />
            ))}
          </div>
          {!isCommercial ? (
            <nav className="flex h-[120px] items-start justify-center gap-[6px] py-[30px]" aria-label="Projects pagination">
              {paginationItems.map((item, index) =>
                item.current ? (
                  <span key={`${item.label}-${index}`} className="flex size-[30px] items-center justify-center bg-[#484653] text-base leading-[30px] text-white" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link key={`${item.label}-${index}`} href={localizePath(locale, pageHref(item.page))} className="flex size-[30px] items-center justify-center bg-[#f3f3f3] text-base leading-[30px] text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white" aria-label={item.ariaLabel}>
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          ) : null}
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

function ProjectsSourceCard({ project, projects, index, locale }: { project: (typeof PROJECTS_SOURCE_ITEMS)[number]; projects: Project[]; index: number; locale: Locale }) {
  const localized = locale === "en" ? undefined : projects.find((item) => item.path === project.path);
  const textReveal = index % 2 === 0 ? "up" : "down";
  const imageReveal = index % 2 === 0 ? "down" : "up";
  const text = (
    <div className="intco-project-card-text" data-reveal={textReveal}>
      <div className="intco-project-card-title">{localized?.title || project.title}</div>
      <p className="intco-project-card-desc">{localized?.description || project.description}</p>
    </div>
  );
  const image = (
    <div className="intco-project-card-image" data-reveal={imageReveal}>
      <div className="intco-project-card-image-inner">
        <Image src={project.imageUrl} alt={localized?.imageAlt || localized?.title || project.title} fill className="object-cover transition duration-[1500ms] hover:scale-105" sizes="(min-width: 1601px) 1106px, (min-width: 1024px) 50vw, 100vw" />
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

export function BlogListingView({ posts, locale, activeCategory, page }: { posts: BlogPost[]; locale: Locale; activeCategory?: string; page?: ContentPage }) {
  const pageLines = contentLines(page?.bodyText, 120);
  const sourceCategoryOrder = ["Expo", "Industry News", "Inspiration", "New Arrivals", "Press Release", "Tips"];
  const categorySet = new Set(posts.map((post) => post.categoryKey || post.category).filter(Boolean));
  const categories = sourceCategoryOrder.filter((name) => pageLines.includes(name) || categorySet.has(name));
  const datedPosts = posts.map((post) => ({ ...post, publishedAt: post.publishedAt || blogDateFor(pageLines, post.title) }));
  const filteredPosts = activeCategory ? datedPosts.filter((post) => (post.categoryKey || post.category) === activeCategory) : datedPosts;
  const visiblePosts = filteredPosts.length ? filteredPosts : datedPosts;
  const popularPosts = datedPosts.slice(0, 5);
  return (
    <>
      <PageHero
        title={page?.title || t(locale, "blog")}
        description={page?.description || "Home decor, interior design, product material, exhibition and industry trend articles from INTCO Framing."}
        imageUrl={page?.imageUrl}
      />
      <section className="bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
          {["All", ...categories].map((category) => (
            <Link
              key={category}
              href={category === "All" ? localizePath(locale, "/blog") : `${localizePath(locale, "/blog")}?category=${encodeURIComponent(category || "")}`}
              className={`border px-4 py-2 text-sm font-semibold ${
                (category === "All" && !activeCategory) || category === activeCategory
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
      </section>
      <ContactBand locale={locale} />
    </>
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
            <ProductQuotePanel locale={locale} product={{ slug: product.slug, title: displayTitle, path: product.path, sourceId: product.sourceId, sourceUrl: product.sourceUrl, sku: product.sku, imageUrl: primary }} />
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
  locale,
}: {
  project: Project;
  products: Product[];
  projects: Project[];
  locale: Locale;
}) {
  const lines = contentLines(project.bodyText, 100);
  const usedItemNames = extractBetween(lines, "USED ITEMS", "YOU MAY ALSO LIKE").filter((line) => !line.includes("Explore more details"));
  const usedProducts = usedItemNames
    .map((name) => products.find((product) => product.title.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Product[];
  const gallery = itemGallery(project);
  const usedStart = lines.findIndex((line) => line === "USED ITEMS");
  const body = lines.slice(0, usedStart > -1 ? usedStart : lines.length);
  const relatedProjectNames = extractBetween(lines, "YOU MAY ALSO LIKE", "GET MORE INSPIRATION");
  const relatedByName = relatedProjectNames
    .map((name) => projects.find((item) => item.title.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Project[];
  const relatedProjects = (relatedByName.length ? relatedByName : projects.filter((item) => item.slug !== project.slug)).slice(0, 4);
  const inspirationLines = extractAfter(lines, "GET MORE INSPIRATION", 8);

  return (
    <>
      <PageHero title={project.title} description={project.description} imageUrl={project.imageUrl} label={project.category || "Project"} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="grid gap-4" data-reveal="left">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              {gallery[0] ? <Image src={gallery[0]} alt={project.imageAlt || project.title} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" /> : null}
            </div>
            {gallery.length > 1 ? (
              <div className="grid grid-cols-3 gap-4">
                {gallery.slice(1, 8).map((image) => (
                  <div key={image} className="relative aspect-[4/3] bg-neutral-100">
                    <Image src={image} alt={project.imageAlt || project.title} fill className="object-cover" sizes="220px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <article className="flex flex-col justify-center" data-reveal="right">
            <p className="text-sm font-bold uppercase text-emerald-700">{project.category || "Project"}</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{project.title}</h2>
            <div className="mt-6 space-y-4 text-pretty leading-8 text-neutral-600">
              {(body.length ? body : [project.description || ""]).filter(Boolean).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
      <section className="bg-neutral-100 py-16">
        <SectionTitle eyebrow={t(locale, "usedItems")} title={t(locale, "productsInProject")} />
        {usedItemNames.length ? (
          <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
            {usedItemNames.map((name) => (
              <span key={name} className="bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-black/5">
                {name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {(usedProducts.length ? usedProducts : products.slice(0, 4)).map((product, index) => (
            <div key={product.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <SectionTitle eyebrow={t(locale, "youMayAlsoLike")} title={t(locale, "moreProjectIdeas")} />
        {relatedProjectNames.length ? (
          <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
            {relatedProjectNames.map((name) => (
              <span key={name} className="bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                {name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {relatedProjects.map((item, index) => (
            <div key={item.slug} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <ImageCard href={localizePath(locale, item.path)} title={item.title} label={item.category} imageUrl={item.imageUrl} alt={item.imageAlt} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      {inspirationLines.length ? (
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow={t(locale, "blog")} title={t(locale, "getMoreInspiration").toUpperCase()} />
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {inspirationLines.map((line, index) => (
              <div key={`${line}-${index}`} className="bg-white p-5 text-sm font-semibold leading-6 text-neutral-700 ring-1 ring-black/5">
                {line}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <ContactBand locale={locale} />
    </>
  );
}

export function BlogPostView({ post, posts, locale }: { post: BlogPost; posts: BlogPost[]; locale: Locale }) {
  const lines = contentLines(post.bodyText, 120);
  const gallery = itemGallery(post);
  const popularPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 5);
  const supplementalLines = locale === "en" ? blogSourceSupplementLines(post.slug).filter((line) => !containsRenderedLine(lines, line)) : [];

  return (
    <>
      <PageHero title={post.title} description={post.excerpt} imageUrl={post.imageUrl} label={post.category || t(locale, "blog")} />
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <article data-reveal="left">
            {post.publishedAt ? <p className="text-sm font-semibold text-emerald-700">{formatDate(post.publishedAt)}</p> : null}
            {gallery[0] ? (
              <div className="relative mt-6 aspect-[16/9] overflow-hidden bg-neutral-100">
                <Image src={gallery[0]} alt={post.imageAlt || post.title} fill className="object-cover" sizes="(min-width: 1024px) 65vw, 100vw" />
              </div>
            ) : null}
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.slice(1, 8).map((image) => (
                  <div key={image} className="relative aspect-[4/3] bg-neutral-100">
                    <Image src={image} alt={post.imageAlt || post.title} fill className="object-cover" sizes="180px" />
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
              {(lines.length ? lines : [post.excerpt || ""]).filter(Boolean).map((line) =>
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
                  sourceUrl: detailProduct.sourceUrl,
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
      <PageHero title={t(locale, "myCart")} description={t(locale, "quote")} />
      <EnquiryList locale={locale} />
    </>
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
            <SustainabilityVideoButton src={SUSTAINABILITY_VIDEO_SRC} label={labels.watchVideo} />
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
            <Image src="https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Sustainability16.png" alt="" fill className="object-contain" sizes="22px" />
          </div>
          <div className="relative mr-[11px] aspect-[89/119] max-w-[89px] flex-1">
            <Image src="https://www.intcoframing-us.com/wp-content/themes/chengpin/images/Sustainability12.png" alt="" fill className="object-contain" sizes="89px" />
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
              <h2 className="text-center text-[38px] font-semibold leading-[30px] text-[#484653] max-lg:text-3xl">ESG Report 2022</h2>
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

function PhilosophySourceView({ locale }: { locale: Locale }) {
  const values = localizedPhilosophyValues(locale);
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
        <div className="intco-source-container px-5">
          <ul className="grid gap-3 lg:grid-cols-2">
            {PHILOSOPHY_GALLERY_TOP.map((item) => (
              <li key={item.imageUrl}>
                <PhilosophyGalleryTile imageUrl={item.imageUrl} label={item.label} locale={locale} />
              </li>
            ))}
          </ul>
          <div className="mt-[13px] flex gap-[14px] max-lg:flex-col">
            <div className="w-[59.62%] max-lg:w-full">
              <div className="relative aspect-[1015/669] overflow-hidden rounded-[3px]">
                <Image src={PHILOSOPHY_GALLERY_MOSAIC[0]} alt="Philosophy team collaboration" fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-[14px]">
              {PHILOSOPHY_GALLERY_MOSAIC.slice(1).map((imageUrl) => (
                <div key={imageUrl} className="relative aspect-[674/328] flex-1 overflow-hidden rounded-[3px]">
                  <Image src={imageUrl} alt="Philosophy workplace" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
                </div>
              ))}
            </div>
          </div>
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
  return (
    <section id="goinput" className="intco-contact-index intco-contact-message-section">
      <div className="intco-source-container px-5 min-[1601px]:px-0">
        <ProductSourceTitle title={t(locale, "orderSample")} />
        <p className="intco-contact-form-desc" data-reveal="fade">
          {t(locale, "contactFormIntro")}
        </p>
        <div className="intco-contact-message-grid">
          <div className={`intco-contact-form ${leadsCloudBuryClass("5d7b74d8ea0b4f4fb26aa05682c8ae4e")}`} data-reveal="source-down">
            <div className={leadsCloudBuryClass(LEADSCLOUD_FORM_IDS.main)} />
          </div>
          <div className="intco-contact-form-image-wrap" data-reveal="source-up">
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
  "/wp-content/themes/",
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
  return !url || /\/products\.png($|\?)/.test(url);
}

function parseProductDetails(product: Product, locale: Locale) {
  const lines = contentLines(product.bodyText, 140);
  const specLabels = productSpecLabels(locale);
  const displayTitle = lines[0] || product.title;
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
