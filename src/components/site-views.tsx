import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Factory,
  Globe2,
  Layers,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Ruler,
  Search,
  ShoppingCart,
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
import { Locale, localizePath, t } from "@/lib/i18n";
import { ProductQuotePanel } from "@/components/product-quote-panel";
import { EnquiryList } from "@/components/enquiry-list";
import { CountUpStat } from "@/components/count-up-stat";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomeBlogSection } from "@/components/home-blog-section";
import { SolutionsServicesSection, type SolutionsServiceItem } from "@/components/solutions-services-section";

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

const PRODUCT_CONTACT_FIELDS = [
  { label: "姓名", placeholder: "Name", required: true },
  { label: "公司名称", placeholder: "Company Name", required: true },
  { label: "国家地区", placeholder: "Country", required: true },
  { label: "邮箱", placeholder: "Email", required: true },
  { label: "电话", placeholder: "Phone", required: true },
  { label: "WhatsApp", placeholder: "WhatsApp", required: false },
];

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
  { value: "3", label: "Business Units", Icon: Layers },
  { value: "6", label: "Production Bases", Icon: Factory },
  { value: "30+", label: "Years Experience", Icon: Globe2 },
  { value: "4000+", label: "Employees", Icon: PackageCheck },
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
    imageUrl: "https://www.intcoframing-us.com/wp-content/uploads/2024/06/微信图片3_20240611140721.jpg",
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

const SOLUTIONS_RELATED_LINKS = [
  { number: "01", title: "Featured Products", path: "/products", description: "We offer product brochures covering various categories for your information." },
  { number: "02", title: "Latest  Projects", path: "/projects", description: "We offer product brochures covering various categories for your information." },
  { number: "03", title: "Customer  Service", path: "/contact", description: "We offer product brochures covering various categories for your information." },
];

export function HomeView({ data, locale }: { data: SiteData; locale: Locale }) {
  const { homePage, productCategories, solutions } = data;
  const parentCategories = productCategories.filter((category) => !category.parentSlug).slice(0, 5);
  const href = (path: string) => localizePath(locale, path);
  const heroSlides = SOURCE_HOME_HERO_SLIDES;

  return (
    <>
      <HeroCarousel slides={heroSlides} fallbackTitle={homePage.title} locale={locale} />
      <span className="sr-only">Latest Products</span>

      <section className="overflow-hidden bg-[#f3f3f3] px-4 py-7 sm:px-6 lg:py-[99px]">
        <HomeSourceTitle title="FEATURED PRODUCTS" />
        <div className="intco-source-container mt-8 px-5 lg:mt-[65px]">
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-[30px]">
            {parentCategories.slice(0, 2).map((category) => (
              <HomeProductTile key={category.slug} category={category} locale={locale} wide />
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
              <HomeSourceTitle title="COMPANY PROFILE" align="left" />
              <p className="mt-10 max-w-2xl text-pretty text-lg leading-[30px] text-[#363636] lg:mt-[50px]">
                Founded in 2002, INTCO upholds the reputation for high quality, greatdesigns, and fast delivery to fulfill all aspects of a project - from artistryto functionality, saving you time and money.
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
                {HOME_PROFILE_LINKS.map((item) => (
                  <Link key={item.label} href={href(item.path)} className="group flex flex-col justify-end text-lg font-semibold text-[#484653] transition duration-200 hover:-translate-y-2">
                    <Image src={item.imageUrl} alt={item.label} width={58} height={58} className="size-14 object-contain" />
                    <span className="mt-5">{item.label}</span>
                  </Link>
                ))}
                <SourcePillLink href={href("/who-we-are")} compact>
                  Read More
                </SourcePillLink>
              </div>
            </div>
            <div className="flex items-end lg:w-1/2">
              <div className="aspect-video w-full overflow-hidden bg-black">
                <iframe
                  className="size-full"
                  srcDoc={HOME_PROFILE_VIDEO_SRC_DOC}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="intco-source-container relative z-10 -mt-16 px-5">
          <div className="relative py-5">
            <div className="absolute inset-y-0 right-0 w-4/5 bg-[rgba(72,70,83,0.27)]" />
            <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOME_PROFILE_STATS.map((stat) => (
                <div key={stat.label} className="flex items-center justify-center text-[#484653]">
                  <div className="relative mr-4">
                    <span className="absolute -left-1 top-0 size-11 rounded-full bg-[#c3c2c6]" />
                    <stat.Icon className="relative z-10 size-[60px] stroke-[1.4]" />
                  </div>
                  <div className="leading-none">
                    <div className="text-[56px] font-semibold leading-none">{stat.value}</div>
                    <div className="mt-2 text-right text-lg font-semibold leading-[22px]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-16 pt-16 sm:px-6 lg:pt-[230px]">
        <div className="intco-source-container px-5">
          <HomeSourceTitle title="SOLUTIONS" align="left" />
          <p className="mt-10 max-w-4xl text-pretty text-lg leading-8 text-[#363636] lg:mt-[68px]">
            We are committed to offering you turnkey service and ready to create retail solutions custom tailored to fulfill all your needs.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {solutions.slice(0, 6).map((solution) => (
              <HomeSolutionTile key={solution.slug} solution={solution} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-4 pb-10 sm:px-6">
        <div className="intco-source-container px-5">
          <HomeSourceTitle title="PROJECTS" align="left" />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <p className="text-pretty text-lg leading-8 text-[#363636]">
              Artistry meets functionality.
              <br />
              From public spaces to homes,
              <br />
              our diverse products seamlessly integrate into diverse scenarios.
            </p>
            <div className="flex max-w-[631px] items-center gap-8 bg-white px-8 py-[18px] text-[#484653]">
              <p className="max-w-[300px] text-2xl font-semibold leading-[30px]">Customized Solution For Every Industry Needs!</p>
              <Link href={href("/contact")} className="inline-flex h-[66px] items-center rounded-md bg-[#484653] px-5 text-lg font-semibold text-white">
                <span className="border-r border-white pr-3">Contact Us</span>
                <ArrowRight className="ml-3" size={22} />
              </Link>
            </div>
          </div>
          <div className="mt-[55px] grid gap-8 lg:grid-cols-2">
            {HOME_PROJECT_CARDS.map((project) => (
              <HomeProjectTile key={project.title} project={project} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <HomeBlogSection categories={HOME_BLOG_CATEGORIES} intro={homePage.blogIntro?.description} locale={locale} posts={HOME_BLOG_CARDS} />
    </>
  );
}

function HomeSourceTitle({ title, align = "center" }: { title: string; align?: "left" | "center" }) {
  const centered = align === "center";
  return (
    <div className={`relative overflow-hidden ${centered ? "text-center" : "text-left"}`}>
      <div className={`pointer-events-none absolute top-0 whitespace-nowrap text-5xl font-semibold uppercase text-transparent opacity-20 [-webkit-text-stroke:1px_#3d3d3d] sm:text-[70px] max-[1600px]:text-[46px] max-[650px]:text-4xl ${centered ? "left-1/2 -translate-x-1/2" : "-left-5"}`}>
        {title}
      </div>
      <h2 className={`relative z-10 inline-block border-b border-[#484653] pb-8 text-balance text-3xl font-semibold uppercase leading-none text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] sm:text-[45px] max-[1600px]:text-4xl max-[650px]:text-xl ${centered ? "" : "ml-0"}`}>
        {title}
        <span className={`absolute bottom-0 h-[5px] w-[65px] translate-y-1/2 bg-[#484653] ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`} />
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

function HomeProductTile({ category, locale, wide }: { category: ProductCategory; locale: Locale; wide?: boolean }) {
  const copy = HOME_PRODUCT_COPY[category.slug] || { title: category.title, description: category.description || "" };
  const imageUrl = category.imageUrl || category.navImageUrl || "";
  return (
    <Link href={localizePath(locale, category.path)} className="group relative block overflow-hidden rounded-[20px] bg-neutral-200">
      <div className={`relative ${wide ? "aspect-[1.78]" : "aspect-[1.16]"}`}>
        {imageUrl ? <Image src={imageUrl} alt={category.imageAlt || copy.title} fill className="object-cover" sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} /> : null}
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
      <div className="relative aspect-[1.72] overflow-hidden bg-neutral-100">
        {solution.imageUrl ? <Image src={solution.imageUrl} alt={solution.imageAlt || solution.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1280px) 33vw, 50vw" /> : null}
      </div>
      <div className="min-h-[306px] bg-white px-9 py-12 text-[#363636]">
        <h3 className="border-b border-[#484653] pb-4 text-balance text-lg font-semibold leading-6 text-[#363636]">{solution.title}</h3>
        <p className="mt-7 line-clamp-3 min-h-[84px] text-pretty text-lg leading-7 text-[#363636]">{homeSolutionDescription(solution)}</p>
        <span className="mt-8 inline-flex items-center text-lg font-semibold text-[#484653]">
          {t(locale, "exploreMore")} <ArrowRight className="ml-2" size={18} />
        </span>
      </div>
    </Link>
  );
}

function HomeProjectTile({ project, locale }: { project: (typeof HOME_PROJECT_CARDS)[number]; locale: Locale }) {
  return (
    <Link href={localizePath(locale, project.path)} className="group relative block overflow-hidden">
      <div className="relative aspect-[1.9] bg-neutral-200">
        <Image src={project.imageUrl} alt={project.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="absolute inset-5 rounded-md bg-white/75 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="absolute right-8 top-7 flex size-9 items-center justify-center rounded-full bg-white text-[#987754]">+</span>
        <h3 className="px-12 pt-20 text-3xl font-semibold text-[#484653]">{project.title}</h3>
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

function homeSolutionDescription(solution: Solution) {
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
  const introTitle = intro[0] || "Making your space more than just a place.";
  const introDescription = intro[1] || "Discover the perfect accents for your room with our exceptional collections";
  const projectLines = extractAfter(pageLines, "PROJECTS", 2);
  const projectTitle = projectLines[0] || "Artistry meets functionality.";
  const projectDescription =
    projectLines[1] || "From commercial spaces to homes, our diverse products seamlessly integrate into diverse scenarios.";
  const catalogTitle = catalogLines[0] || "Interested in delving into more details about our products?";
  const catalogDescription = catalogLines[1] || "We offer product brochures covering various categories for your information.";
  const reportTitle = testReportLines[0] || "Rest easy with our commitment to quality and compliance.";
  const reportDescription = testReportLines[1] || "Intco Framing provides outstanding products and quality services to global customers.";

  return (
    <>
      <ProductSourceHero title={page?.title || "Products"} locale={locale} />

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-[30px] sm:px-6 lg:pt-[99px]">
        <div className="mx-auto max-w-[1600px]">
          <ProductSourceTitle title="WHAT WE DO" />
          <ProductSectionDescription first={introTitle} second={introDescription} className="lg:mt-[58px]" />
          <div className="mt-2 lg:mt-[58px]">
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-10">
              {PRODUCT_CATEGORY_CARDS.slice(0, 2).map((category, index) => (
                <ProductSourceTile key={category.title} category={category} locale={locale} index={index} wide />
              ))}
            </div>
            <div className="mt-[30px] grid gap-5 lg:grid-cols-3 lg:gap-[65px]">
              {PRODUCT_CATEGORY_CARDS.slice(2).map((category, index) => (
                <ProductSourceTile key={category.title} category={category} locale={locale} index={index + 2} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-10 sm:px-6 lg:pt-[99px]">
        <div className="mx-auto max-w-[1600px]">
          <ProductSourceTitle title="PROJECTS" />
          <ProductSectionDescription first={projectTitle} second={projectDescription} className="lg:mt-[55px]" />
          <div className="mt-8 grid gap-10 lg:mt-[55px] lg:grid-cols-2">
            {HOME_PROJECT_CARDS.map((project, index) => (
              <ProductProjectTile key={project.title} project={project} locale={locale} index={index} />
            ))}
          </div>
        </div>
      </section>

      <ProductCatalogSection title={catalogTitle} description={catalogDescription} locale={locale} />
      <ProductTestReportSection title={reportTitle} description={reportDescription} />
      <ProductContactSection />
    </>
  );
}

function ProductSourceHero({ title, locale }: { title: string; locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative h-[122px] overflow-hidden bg-white lg:aspect-[3.2] lg:h-auto">
        <Image src={PRODUCTS_HERO_IMAGE} alt={title} fill priority className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0 hidden bg-white/30 lg:block" />
        <div className="absolute inset-x-0 bottom-0 top-6 bg-white lg:hidden" />
        <div className="absolute inset-0 flex flex-col items-center px-5 pt-[26px] text-center lg:justify-center lg:pt-0">
          <h1 className="text-[32px] font-semibold leading-none text-[#484653] lg:text-[84px]">{title}</h1>
          <nav className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[15px] font-medium text-[#484653] lg:mt-5 lg:text-xl" aria-label="Breadcrumb">
            <Link href={localizePath(locale, "/")} className="transition-colors duration-200 hover:text-[#987754]">
              Home
            </Link>
            <span>›</span>
            <span>{title}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-[42px] lg:mt-7 lg:gap-6">
            <a href="#goinput" className="inline-flex h-12 min-w-[130px] items-center justify-center rounded-full border-2 border-[#484653] px-3 text-base font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white lg:h-[58px] lg:min-w-[200px] lg:px-6 lg:text-lg">
              Chat With Us
            </a>
            <a href="#goinput" className="inline-flex h-12 min-w-[130px] items-center justify-center rounded-full border-2 border-[#484653] px-3 text-base font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white lg:h-[58px] lg:min-w-[200px] lg:px-6 lg:text-lg">
              Leave a Message
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSourceTitle({ title, align = "center" }: { title: string; align?: "left" | "center" }) {
  const centered = align === "center";
  return (
    <div className={`relative overflow-hidden ${centered ? "text-center" : "text-left"}`}>
      <div className={`pointer-events-none absolute top-0 whitespace-nowrap text-[42px] font-semibold uppercase text-transparent opacity-20 [-webkit-text-stroke:1px_#3d3d3d] lg:text-[70px] ${centered ? "left-1/2 -translate-x-1/2" : "-left-5"}`}>
        {title}
      </div>
      <h2 className={`relative z-10 inline-block border-b border-[#484653] pb-[10px] text-[20px] font-semibold uppercase leading-none text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] lg:pb-[47px] lg:text-[45px] ${centered ? "" : "ml-0"}`}>
        {title}
        <span className={`absolute bottom-0 h-0.5 w-10 translate-y-1/2 bg-[#484653] lg:h-[5px] lg:w-[65px] ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`} />
      </h2>
    </div>
  );
}

function ProductSectionDescription({ first, second, className = "" }: { first: string; second: string; className?: string }) {
  return (
    <p className={`mx-auto mt-3 max-w-[1100px] text-center text-base leading-6 text-[#363636] lg:mt-9 lg:text-lg lg:leading-[30px] ${className}`}>
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
  category: (typeof PRODUCT_CATEGORY_CARDS)[number];
  locale: Locale;
  index: number;
  wide?: boolean;
}) {
  return (
    <Link
      href={localizePath(locale, category.path)}
      className="group relative block overflow-hidden rounded-[20px] bg-neutral-200"
      data-reveal
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
  return (
    <Link
      href={localizePath(locale, project.path)}
      className="group relative block overflow-hidden rounded-[20px] bg-neutral-200"
      data-reveal
      style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
    >
      <div className="relative aspect-[1.95]">
        <Image src={project.imageUrl} alt={project.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="absolute inset-[20px] rounded-[20px] bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:inset-x-8 lg:bottom-8 lg:top-[30px]">
        <div className="flex h-full flex-col justify-between p-7 text-white lg:p-10">
          <h3 className="text-2xl font-semibold lg:text-3xl">{project.title}</h3>
          <span className="inline-flex h-[58px] w-[200px] items-center justify-center rounded-full border-2 border-white text-lg font-medium">
            Explore More <ArrowRight className="ml-2" size={20} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductCatalogSection({ title, description, locale }: { title: string; description: string; locale: Locale }) {
  const activeManual = PRODUCT_MANUALS[0];

  return (
    <section className="overflow-hidden bg-[#f3f3f3] px-5 pb-10 pt-10 sm:px-6 lg:pt-[99px]">
      <div className="mx-auto max-w-[1600px]">
        <ProductSourceTitle title="Catalog" />
        <ProductSectionDescription first={title} second={description} className="lg:mt-[55px]" />
        <div className="mt-8 flex flex-col gap-3 lg:mt-[55px] lg:flex-row lg:gap-[39px]">
          <div className="grid gap-3 sm:grid-cols-5 lg:flex lg:w-[370px] lg:flex-col">
            {PRODUCT_MANUALS.map((manual, index) => (
              <Link
                key={manual.title}
                href={manual.pdfUrl}
                target="_blank"
                className={`flex h-14 items-center justify-center px-4 text-center text-base font-semibold transition duration-200 hover:bg-[#484653] hover:text-white lg:h-[127px] lg:text-2xl ${index === 0 ? "bg-[#484653] text-white" : "bg-white text-[#3e3e3e]"}`}
              >
                {manual.title}
              </Link>
            ))}
          </div>
          <div className="bg-white p-5 lg:min-h-[520px] lg:flex-1 lg:p-[70px]">
            <div className="grid gap-7 lg:grid-cols-[45%_1fr] lg:gap-[5%]">
              <div className="relative mx-auto aspect-[257/300] w-full max-w-[257px] bg-neutral-100 lg:max-w-none">
                <Image src={activeManual.imageUrl} alt={activeManual.title} fill className="object-cover" sizes="(min-width: 1024px) 28vw, 257px" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-semibold leading-[39px] text-[#3e3e3e] lg:text-[38px]">{activeManual.title}</h3>
                  <p className="mt-8 text-base leading-[30px] text-[#363636] lg:mt-10 lg:text-lg">{activeManual.description}</p>
                </div>
                <Link href={activeManual.pdfUrl} target="_blank" className="mt-10 inline-flex h-[58px] w-[200px] items-center justify-center rounded-full border-2 border-[#484653] text-lg font-medium text-[#484653] transition duration-200 hover:bg-[#484653] hover:text-white lg:mt-[120px]">
                  Explore More <Download className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            <div className="sr-only">
              {PRODUCT_MANUALS.slice(1).map((manual) => (
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

function ProductTestReportSection({ title, description }: { title: string; description: string }) {
  return (
    <section className="overflow-hidden bg-white bg-cover bg-center px-5 pb-16 pt-10 sm:px-6 lg:pb-[120px] lg:pt-[99px]" style={{ backgroundImage: `url(${PRODUCT_TEST_REPORT_BG})` }}>
      <div className="mx-auto max-w-[1600px]">
        <ProductSourceTitle title="TEST REPORT" />
        <ProductSectionDescription first={title} second={description} className="lg:mt-[55px]" />
        <div className="mx-auto mt-10 grid max-w-[1230px] gap-6 sm:grid-cols-2 lg:mt-[55px] lg:grid-cols-4">
          {PRODUCT_REPORT_IMAGES.map((report, index) => (
            <div key={report.title} className="bg-white p-2.5" data-reveal style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}>
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

function ProductContactSection() {
  return (
    <section id="goinput" className="overflow-hidden bg-[#f3f3f3] bg-cover bg-center px-5 pb-16 pt-[50px] sm:px-6 lg:pb-[77px] lg:pt-[100px]" style={{ backgroundImage: `url(${PRODUCT_CONTACT_BG})` }}>
      <div className="mx-auto max-w-[1600px]">
        <ProductSourceTitle title="GET IN TOUCH" />
        <p className="mx-auto mt-9 max-w-[1100px] text-center text-base leading-[30px] text-[#363636] lg:mt-[55px] lg:text-lg">
          Don&apos;t Hesitate to Reach Us.We are always here to address all your concerns and provide solutions.
        </p>
        <form className="mx-auto mt-12 grid max-w-[1446px] gap-x-[58px] gap-y-7 lg:mt-[55px] lg:grid-cols-2">
          {PRODUCT_CONTACT_FIELDS.map((field) => (
            <ProductContactField key={field.label} label={field.label} placeholder={field.placeholder} required={field.required} />
          ))}
          <ProductContactField label="留言" placeholder="Message" required multiline />
          <div className="flex justify-center lg:col-span-2">
            <button type="button" className="h-16 w-[240px] rounded-md border-2 border-[#484653] bg-transparent text-xl font-normal text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white lg:h-20 lg:w-[300px] lg:text-2xl">
              提交
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function ProductContactField({
  label,
  placeholder,
  required,
  multiline,
}: {
  label: string;
  placeholder: string;
  required: boolean;
  multiline?: boolean;
}) {
  const id = `product-contact-${placeholder.toLowerCase().replace(/\s+/g, "-")}`;
  const inputClass =
    "w-full rounded-md border border-[#717171] bg-white px-5 text-2xl font-light text-[#727272] outline-none placeholder:text-[#727272] placeholder:opacity-100";

  return (
    <div className={multiline ? "lg:col-span-2" : ""}>
      <label htmlFor={id} className="block text-sm leading-[18px] text-[#666]">
        {label}
      </label>
      <div className="relative mt-[9px]">
        {multiline ? (
          <textarea id={id} readOnly placeholder={placeholder} className={`${inputClass} h-[272px] resize-none py-5`} />
        ) : (
          <input id={id} readOnly type="text" placeholder={placeholder} className={`${inputClass} h-20 leading-[80px]`} />
        )}
        {required ? <span className="absolute right-[-11px] top-1/2 -translate-y-1/2 text-sm leading-none text-red-600">*</span> : null}
      </div>
    </div>
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
  return (
    <>
      <SolutionsSourceHero title={page?.title || "Solutions"} locale={locale} />

      <section className="overflow-hidden bg-[#f8f8f8] px-4 py-16 sm:px-6 lg:py-[100px]">
        <div className="intco-source-container px-5">
          <div className="grid gap-12 lg:grid-cols-[1fr_minmax(420px,783px)] lg:gap-[122px]">
            <div data-reveal="left">
              <SolutionsSourceTitle title="END-TO-END HOME DECOR SOLUTIONS" align="left" />
              <p className="mt-[64px] max-w-[690px] text-lg font-normal leading-8 text-[#363636]">{SOLUTIONS_INTRO_COPY}</p>
              <div className="mt-[55px]">
                <SolutionsOutlineLink href={href("/who-we-are")} width={254}>
                  About Intco
                </SolutionsOutlineLink>
              </div>
            </div>
            <div className="relative aspect-[783/504] w-full overflow-hidden" data-reveal="right">
              <Image src={SOLUTIONS_INTRO_IMAGE} alt="End-to-end Home Decor Solutions" fill className="object-cover" sizes="(min-width: 1024px) 783px, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f8f8f8] px-4 py-16 sm:px-6 lg:py-[100px]">
        <div className="intco-source-container px-5">
          <SolutionsSourceTitle title="SERVICES WE OFFER" />
          <div className="mt-[64px]">
            <SolutionsServicesSection items={SOLUTIONS_SERVICE_ITEMS} locale={locale} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f8f8f8] bg-cover bg-center px-4 pt-16 sm:px-6 lg:pt-[116px]" style={{ backgroundImage: `url(${SOLUTIONS_PROCESS_BG})` }}>
        <div className="intco-source-container px-5">
          <SolutionsSourceTitle title="HOW IT WORKS" />
          <div className="mt-[64px]">
            <SolutionsProcessGrid />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 pt-16 sm:px-6 lg:pt-[87px]">
        <div className="intco-source-container px-5">
          <SolutionsSourceTitle title="YOU MAY ALSO LIKE" />
        </div>
      </section>
      <section className="relative mb-[55px] mt-[64px] overflow-hidden">
        <div className="relative aspect-[1920/800] min-h-[540px]">
          <Image src={SOLUTIONS_RELATED_BG} alt="You may also like" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 flex flex-col bg-black/30 lg:flex-row">
            {SOLUTIONS_RELATED_LINKS.map((item) => (
              <SolutionsRelatedCard key={item.number} item={item} href={href(item.path)} />
            ))}
          </div>
        </div>
      </section>

      <SolutionsContactBand locale={locale} />
    </>
  );
}

function SolutionsSourceHero({ title, locale }: { title: string; locale: Locale }) {
  return (
    <section className="relative aspect-[1920/600] min-h-[260px] overflow-hidden">
      <Image src={SOLUTIONS_HERO_IMAGE} alt="Solutions" fill className="object-cover" sizes="100vw" priority />
      <div className="absolute inset-0 bg-white/30" />
      <div className="intco-page-hero-copy absolute inset-0 z-10 flex items-center">
        <div className="intco-source-container px-5 text-center text-[#484653]">
          <h1 className="text-[42px] font-semibold leading-none sm:text-[56px] lg:text-[66px]">{title}</h1>
          <div className="mt-5 flex items-center justify-center gap-3 text-lg font-medium lg:text-xl">
            <Link href={localizePath(locale, "/")}>Home</Link>
            <ArrowRight size={18} strokeWidth={1.8} />
            <span>{title}</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={localizePath(locale, "/contact")}
              className="inline-flex h-[58px] min-w-[154px] items-center justify-center rounded-[29px] border border-[#484653] px-8 text-lg font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white"
            >
              Chat With Us
            </Link>
            <Link
              href={localizePath(locale, "/products/#goinput")}
              className="inline-flex h-[58px] min-w-[154px] items-center justify-center rounded-[29px] border border-[#484653] px-8 text-lg font-semibold text-[#484653] transition duration-500 hover:bg-[#484653] hover:text-white"
            >
              Leave a Message
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionsSourceTitle({ title, align = "center" }: { title: string; align?: "left" | "center" }) {
  const centered = align === "center";
  return (
    <div className={`relative uppercase ${centered ? "text-center" : "text-left"}`} data-reveal={centered ? "fade" : "left"}>
      <div
        className={`pointer-events-none absolute top-0 text-[70px] font-semibold leading-none text-transparent opacity-20 [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-[46px] max-[650px]:hidden ${
          centered ? "left-1/2 -translate-x-1/2 whitespace-nowrap" : "left-0 max-w-[760px] -translate-x-5 whitespace-normal"
        }`}
      >
        {title}
      </div>
      <h2
        className={`relative z-10 inline-block border-b border-[#484653] pb-[47px] text-[45px] font-semibold leading-[39px] text-[#3e3e3e] [-webkit-text-stroke:1px_#3d3d3d] max-[1600px]:text-4xl max-[650px]:text-[28px] ${
          centered ? "" : "max-w-[760px] leading-[1.4]"
        }`}
      >
        {title}
        <span className={`absolute bottom-0 h-[5px] w-[65px] translate-y-1/2 bg-[#484653] ${centered ? "left-1/2 -translate-x-1/2" : "left-0"}`} />
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

function SolutionsProcessGrid() {
  return (
    <ul className="grid gap-x-[100px] gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
      {SOLUTIONS_PROCESS_STEPS.map((step, index) => (
        <li key={step.label} className="relative flex justify-center" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
          <div className="relative mb-16 w-full max-w-[278px] lg:mb-[140px]">
            <div className="relative aspect-square overflow-hidden rounded-full">
              <Image src={step.imageUrl} alt={step.label} fill className="object-cover transition duration-700 hover:scale-110" sizes="278px" />
            </div>
            <div className="mt-5 text-center text-[22px] font-normal leading-tight text-[#363636] lg:text-[28px]">{step.label}</div>
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

function SolutionsRelatedCard({ item, href }: { item: (typeof SOLUTIONS_RELATED_LINKS)[number]; href: string }) {
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
          <SolutionsOutlineLink href={href}>Explore More</SolutionsOutlineLink>
        </div>
      </div>
    </div>
  );
}

function SolutionsContactBand({ locale }: { locale: Locale }) {
  return (
    <section className="relative mb-[55px] bg-cover bg-center px-4 py-16 sm:px-6 lg:py-[98px]" style={{ backgroundImage: `url(${SOLUTIONS_CONTACT_BG})` }}>
      <span className="sr-only">GET IN TOUCH</span>
      <div className="intco-source-container rounded-md bg-[rgba(72,70,83,0.8)] px-6 py-12 text-center text-white lg:py-[8vh]" data-reveal="fade">
        <h2 className="text-[32px] font-semibold leading-tight lg:text-[38px] lg:leading-[15px]">Looking for the Perfect Solution?</h2>
        <p className="my-8 text-2xl font-normal">Contact us today for your decor solution needs.</p>
        <Link
          href={localizePath(locale, "/contact")}
          className="mx-auto inline-flex h-[58px] w-[200px] items-center justify-center rounded-[29px] border-2 border-white bg-white text-lg font-medium text-[#484653] transition duration-700 hover:border-[#484653] hover:bg-[#484653] hover:text-white"
        >
          <Phone className="mr-[9px]" size={22} />
          Contact Us
        </Link>
      </div>
    </section>
  );
}

export function ProjectsListingView({ projects, category, page, locale }: { projects: Project[]; category?: string; page?: ContentPage; locale: Locale }) {
  const filtered = category ? projects.filter((project) => (project.categoryKey || project.category) === category) : projects;
  const projectNav = projects.slice(0, 5);
  const pageLines = contentLines(page?.bodyText, 40);
  const introLines = pageLines.slice(1, 3);
  const title = category ? `${category} Projects` : page?.title || "Projects";

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
                <p className="text-sm font-bold uppercase text-emerald-700">{project.category || "Project"}</p>
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

export function BlogListingView({ posts, locale, activeCategory, page }: { posts: BlogPost[]; locale: Locale; activeCategory?: string; page?: ContentPage }) {
  const pageLines = contentLines(page?.bodyText, 120);
  const sourceCategoryOrder = ["Expo", "Industry News", "Inspiration", "New Arrivals", "Press Release", "Tips"];
  const categorySet = new Set(posts.map((post) => post.category).filter(Boolean));
  const categories = sourceCategoryOrder.filter((name) => pageLines.includes(name) || categorySet.has(name));
  const datedPosts = posts.map((post) => ({ ...post, publishedAt: post.publishedAt || blogDateFor(pageLines, post.title) }));
  const filteredPosts = activeCategory ? datedPosts.filter((post) => post.category === activeCategory) : datedPosts;
  const visiblePosts = filteredPosts.length ? filteredPosts : datedPosts;
  const popularPosts = datedPosts.slice(0, 5);
  return (
    <>
      <PageHero
        title={page?.title || "Blog"}
        description={page?.description || "Home decor, interior design, product material, exhibition and industry trend articles from INTCO Framing."}
        imageUrl={page?.imageUrl}
      />
      <section className="bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
          {[t(locale, "all"), ...categories].map((category) => (
            <Link
              key={category}
              href={category === t(locale, "all") ? localizePath(locale, "/blog") : `${localizePath(locale, "/blog")}?category=${encodeURIComponent(category || "")}`}
              className={`border px-4 py-2 text-sm font-semibold ${
                (category === t(locale, "all") && !activeCategory) || category === activeCategory
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-neutral-200 text-neutral-700"
              }`}
            >
              {category}
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
  const details = parseProductDetails(product);
  const displayTitle = details.displayTitle || product.title;
  const gallery = itemGallery(product);
  const primary = gallery[0] || preferredImage(product);
  const bestSellers = relatedProducts.slice(0, 4);

  return (
    <>
      <section className="bg-neutral-100 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 text-sm text-neutral-600 sm:px-6 lg:px-8">
          <Link href={localizePath(locale, "/products")} className="font-semibold text-emerald-700">
            Products
          </Link>
          <span>/</span>
          <span>{displayTitle}</span>
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div data-reveal="left">
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              {primary ? <Image src={primary} alt={product.imageAlt || displayTitle} fill className="object-contain" sizes="(min-width: 1024px) 52vw, 100vw" priority /> : null}
            </div>
            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
                {gallery.slice(0, 8).map((image, index) => (
                  <div key={image} className="relative aspect-square bg-neutral-100 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 50}ms` } as React.CSSProperties}>
                    <Image src={image} alt={product.imageAlt || displayTitle} fill className="object-contain" sizes="120px" />
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
            <ProductQuotePanel locale={locale} product={{ slug: product.slug, title: displayTitle, path: product.path, imageUrl: primary }} />
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
  const sections = sectionize(contentLines(solution.bodyText, 120));

  return (
    <>
      <PageHero title={solution.title} description={solution.description} imageUrl={solution.imageUrl} label="Solution" />
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
          <SectionTitle eyebrow="Blog" title="GET MORE INSPIRATION" />
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
  const supplementalLines = blogSourceSupplementLines(post.slug).filter((line) => !containsRenderedLine(lines, line));

  return (
    <>
      <PageHero title={post.title} description={post.excerpt} imageUrl={post.imageUrl} label={post.category || "Blog"} />
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
            {label === "Product" && "slug" in item ? (
              <ProductQuotePanel
                locale={locale}
                product={{ slug: item.slug, title: item.title, path: item.path, imageUrl: item.imageUrl }}
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

export function ContentPageView({ page, locale }: { page: ContentPage; locale: Locale }) {
  const lines = contentLines(page.bodyText, 140);

  if (page.path === "/who-we-are") {
    const timeline = parseTimeline(lines);
    return (
      <>
        <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label="INTCO" />
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "aboutUs")}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{lines.find((line) => line.includes("Intco Framing")) || page.title}</h2>
            </div>
            <div className="space-y-4 text-pretty leading-8 text-neutral-600" data-reveal="right">
              {lines.slice(lines.findIndex((line) => line === "ABOUT US") + 1, lines.findIndex((line) => line === "OUR HISTORY")).filter((line) => !["Business Units", "Production Bases", "+", "Years Experience", "4000", "Employees"].includes(line)).slice(0, 4).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              { value: "5", label: "Business Units" },
              { value: "8", label: "Production Bases" },
              { value: "20+", label: "Years Experience" },
              { value: "4000", label: "Employees" },
            ].map((stat, index) => (
              <div key={stat.label} className="bg-neutral-50 p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <div className="text-4xl font-bold text-emerald-700">
                  <CountUpStat value={stat.value} />
                </div>
                <p className="mt-2 text-sm font-semibold uppercase text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow={t(locale, "ourHistory")} title={t(locale, "ourHistory")} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {timeline.map((item, index) => (
              <div key={`${item.year}-${index}`} className="bg-white p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties}>
                <div className="text-3xl font-bold text-emerald-700">{item.year}</div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
                  {item.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "globalMarket")}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{t(locale, "globalMarket")}</h2>
            </div>
            <p className="text-pretty text-lg leading-8 text-neutral-600" data-reveal="right">
              {lines.find((line) => line.includes("Operating on a global scale")) || "We have established a widespread presence in the market, collaborating with numerous high-quality retail partners worldwide."}
            </p>
          </div>
        </section>
        <ContactBand locale={locale} />
      </>
    );
  }

  if (page.path === "/who-we-are/sustainability") {
    const sections = sectionize(lines);
    return (
      <>
        <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label="ESG" />
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
            <div data-reveal="left">
              <p className="text-sm font-bold uppercase text-emerald-700">ESG & Sustainability in Action</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold text-neutral-950">{lines[0] || page.title}</h2>
              <Link href="#" className="mt-7 inline-flex items-center gap-2 bg-neutral-950 px-6 py-3 text-sm font-bold uppercase text-white">
                ESG Report 2022 / Download PDF <Download size={16} />
              </Link>
              {lines.includes("EXTERNAL RATINGS") ? <p className="mt-5 text-sm font-bold uppercase tracking-wide text-emerald-700">EXTERNAL RATINGS</p> : null}
            </div>
            <div className="space-y-4 text-pretty leading-8 text-neutral-600" data-reveal="right">
              {lines.slice(1, 6).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow="ENVIRONMENTAL CONTRIBUTION" title="Cumulative Savings" description={lines.find((line) => line.includes("reduced 200,000 tons"))} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ["2.5 Million", "Tons Carbon Emissions"],
              ["3.75", "Tons Crude Oil Resources"],
              ["2 Million", "Trees Were Protected"],
              ["1.2 Million", "Boxes PS Mouldings"],
            ].map(([value, label], index) => (
              <div key={label} className="bg-white p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <div className="text-4xl font-bold text-emerald-700">{value}</div>
                <p className="mt-3 text-sm font-semibold uppercase text-neutral-600">{label}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
          <SectionTitle eyebrow="SUSTAINABILITY IN ACTION" title="Innovating circular economy models" />
          <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {sections.slice(-3).map((section, index) => (
              <div key={section.title} className="bg-neutral-50 p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
                <h3 className="text-balance text-2xl font-semibold text-neutral-950">{section.title}</h3>
                <p className="mt-4 text-pretty text-sm leading-7 text-neutral-600">{section.body.join(" ")}</p>
              </div>
            ))}
          </div>
        </section>
        <ContactBand locale={locale} />
      </>
    );
  }

  if (page.path === "/who-we-are/philosophy") {
    const sections = sectionize(lines);
    return (
      <>
        <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label={t(locale, "philosophy")} />
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8" data-reveal="fade">
            <h2 className="text-balance text-4xl font-semibold text-neutral-950">{lines[0] || "Our Mission & Vision | Intco Framing"}</h2>
            <p className="text-pretty text-2xl font-semibold leading-10 text-neutral-950">
              {lines.find((line) => line.includes("dynamic and hardworking")) || "We have a dynamic and hardworking team making concerted efforts on a difficult but worthwhile cause."}
            </p>
            <p className="mt-5 text-sm font-bold uppercase text-emerald-700">{lines.find((line) => line.includes("Frank Liu")) || "—— Frank Liu，CEO"}</p>
          </div>
        </section>
        <section className="bg-neutral-100 py-16">
          <SectionTitle eyebrow={t(locale, "philosophy")} title={t(locale, "missionVisionValues")} />
          <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {sections.filter((section) => ["Mission", "Vision", "Spirit", "Values", "Objective", "lmprovement & Innovation"].includes(section.title)).map((section, index) => (
              <div key={section.title} className="bg-white p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${(index % 3) * 70}ms` } as React.CSSProperties}>
                <h3 className="text-xl font-semibold text-neutral-950">{section.title}</h3>
                <p className="mt-4 text-pretty text-sm leading-7 text-neutral-600">{section.body.join(" ")}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <InfoPanel icon={<Globe2 size={24} />} eyebrow={t(locale, "worldClassCustomerService")} title="20+ Years" description="Our Customer Service Team has an in-depth knowledge of the picture framing industry and is here to support you with seamless end-to-end solutions." />
            <InfoPanel icon={<Phone size={24} />} eyebrow={t(locale, "doNotHesitate")} title="Unmatched quality and service" description="Unmatched quality and service will help you running a better business." />
          </div>
        </section>
        <ContactBand locale={locale} />
      </>
    );
  }

  return <DetailView item={page} label="INTCO" locale={locale} />;
}

export function ContactView({ page, locale }: { page: ContentPage; locale: Locale }) {
  const lines = contentLines(page.bodyText, 80);
  const factories = parseFactories(lines);
  const contacts = [
    { title: t(locale, "telephone"), value: "+86 13371591392", action: t(locale, "callNow"), href: "tel:+8613371591392", icon: Phone },
    { title: t(locale, "liveChat"), value: "+86 17753315610", action: t(locale, "contactNow"), href: "tel:+8617753315610", icon: Search },
    { title: t(locale, "sendEmail"), value: "info@intcoframing-us.com", action: t(locale, "emailUs"), href: "mailto:info@intcoframing-us.com", icon: Mail },
    { title: t(locale, "orderSample"), value: t(locale, "quote"), action: t(locale, "myCart"), href: localizePath(locale, "/enquiry-list"), icon: ShoppingCart },
  ];
  return (
    <>
      <PageHero title={page.title} description={page.description} imageUrl={page.imageUrl} label="INTCO" />
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8" data-reveal="fade">
          <p className="text-sm font-bold uppercase text-emerald-700">{t(locale, "contactUs")}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{lines[0] || "Connect with INTCO Framing"}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-pretty text-lg leading-8 text-neutral-600">
            {lines.find((line) => line.includes("overseas factories")) || lines[1] || page.description}
          </p>
          {lines.find((line) => line.includes("committed team")) ? (
            <p className="mx-auto mt-3 max-w-3xl text-pretty leading-7 text-neutral-600">{lines.find((line) => line.includes("committed team"))}</p>
          ) : null}
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {factories.map((factory, index) => (
            <div key={factory.title} className="bg-neutral-50 p-6 ring-1 ring-black/5" data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}>
              <div className="flex size-12 items-center justify-center bg-emerald-700 text-white">
                <MapPin size={22} />
              </div>
              <h3 className="mt-5 text-balance text-xl font-semibold text-neutral-950">{factory.title}</h3>
              <p className="mt-3 text-pretty text-sm leading-7 text-neutral-600">{factory.address}</p>
              <p className="mt-2 text-sm font-semibold text-neutral-900">{factory.zip}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {contacts.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block bg-neutral-50 p-6 ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:bg-neutral-950 hover:text-white"
              data-reveal
              style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
            >
              <div className="flex size-11 items-center justify-center bg-emerald-700 text-white">
                <item.icon size={20} />
              </div>
              <div className="mt-4 text-sm font-bold uppercase text-emerald-700">{item.title}</div>
              <div className="mt-4 text-xl font-semibold">{item.value}</div>
              <div className="mt-2 text-sm font-semibold text-neutral-500 group-hover:text-white/70">{item.action}</div>
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div className="bg-neutral-950 p-8 text-white" data-reveal="left">
            <h2 className="text-balance text-3xl font-semibold">{t(locale, "perfectSolution")}</h2>
            <div className="mt-6 space-y-4 text-pretty text-sm leading-7 text-white/75">
              {linesFromBody(page.bodyText, 8).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <form className="grid gap-4 bg-neutral-100 p-6" data-reveal="right">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "name")} />
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "email")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "phone")} />
              <input className="h-12 border border-neutral-200 bg-white px-4 text-sm outline-none" placeholder={t(locale, "company")} />
            </div>
            <textarea className="min-h-36 border border-neutral-200 bg-white p-4 text-sm outline-none" placeholder={t(locale, "quote")} />
            <button type="button" className="w-fit rounded bg-emerald-700 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-neutral-950">
              {t(locale, "contactUs")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function InfoPanel({ icon, eyebrow, title, description }: { icon: React.ReactNode; eyebrow: string; title: string; description?: string }) {
  return (
    <div className="bg-neutral-50 p-7 ring-1 ring-black/5" data-reveal>
      <div className="flex size-12 items-center justify-center bg-emerald-700 text-white">{icon}</div>
      <p className="mt-6 text-sm font-bold uppercase text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold text-neutral-950">{title}</h2>
      {description ? <p className="mt-4 text-pretty leading-8 text-neutral-600">{description}</p> : null}
    </div>
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
    { title: t(locale, "designEngineering"), description: "Product design, cost engineering, packaging and display support.", icon: Ruler },
    { title: t(locale, "qualityManufacturing"), description: "Vertically integrated production with quality control from source materials.", icon: Factory },
    { title: t(locale, "globalDelivery"), description: "Flexible shipping through China, Vietnam and Malaysia production bases.", icon: PackageCheck },
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

function PageHero({ title, description, imageUrl, label }: { title: string; description?: string; imageUrl?: string; label?: string }) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {imageUrl ? <Image src={imageUrl} alt={title} fill className="object-cover opacity-55" sizes="100vw" priority /> : null}
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

function isSourceNoiseLine(line: string) {
  const lowered = line.toLowerCase();
  return (
    line === "Warning" ||
    lowered.includes("undefined array key") ||
    lowered.includes("attempt to read property") ||
    lowered.includes("/wp-content/themes/") ||
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

function parseProductDetails(product: Product) {
  const lines = contentLines(product.bodyText, 140);
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
    { label: "Item#:", value: itemNumber },
    ...(subject ? [{ label: "Subject:", value: subject }] : []),
    ...(material ? [{ label: "Material:", value: material }] : []),
    { label: "Color:", value: color },
    { label: "Size:", value: sizes.join(" / ") },
    { label: "Quantity:", value: "- / +" },
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

function parseTimeline(lines: string[]) {
  const start = lines.findIndex((line) => line === "OUR HISTORY");
  const end = lines.findIndex((line) => line === "GLOBAL MARKET");
  const timelineLines = lines.slice(start > -1 ? start + 1 : 0, end > start ? end : undefined);
  const entries: Array<{ year: string; body: string[] }> = [];
  let current: { year: string; body: string[] } | null = null;

  timelineLines.forEach((line) => {
    if (/^20\d{2}$/.test(line)) {
      current = { year: line, body: [] };
      entries.push(current);
      return;
    }
    current?.body.push(line);
  });

  return entries.filter((entry) => entry.body.length).slice(0, 12);
}

function parseFactories(lines: string[]) {
  const factories: Array<{ title: string; address: string; zip: string }> = [];
  lines.forEach((line, index) => {
    if (!/Factory$/i.test(line)) return;
    factories.push({
      title: line,
      address: lines[index + 1] || "",
      zip: lines[index + 2] || "",
    });
  });

  if (!factories.length) {
    const start = lines.length >= 9 ? 2 : -1;
    if (start >= 0) {
      for (let index = start; index + 2 < lines.length && factories.length < 3; index += 3) {
        factories.push({
          title: lines[index],
          address: lines[index + 1],
          zip: lines[index + 2],
        });
      }
    }
  }

  return factories.length
    ? factories
    : [
        { title: "Zibo Factory", address: "Qingtian Road, Qilu Chemical Industrial Park, Zibo, Shandong, China", zip: "Zip Code: 255414" },
        { title: "Shanghai Factory", address: "No. 1299 Hubin Road, Fengxian District. Shanghai 201417, China", zip: "Zip Code: 201417" },
        { title: "Vietnam Factory", address: "Lot CN - 01/02 And CN - 01/03, South Of Zone A Bim Son Industrial Park, Thanh Hoa, Vietnam", zip: "Zip Code: 444964" },
      ];
}
