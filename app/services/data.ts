// ============================================================
// ORVEX VISUALS — SERVICE DATA (Single Source of Truth)
// Update prices, packages, and service details here.
// Both /services and /services/[slug] pages import from this file.
// ============================================================

import {
  type LucideIcon,
  Camera,
  Video,
  Heart,
  Calendar,
  Cake,
  Baby,
  Flower2,
  Sparkles,
  Music,
  Gift,
  PartyPopper,
  Plane,
  Users,
  Crown,
  Image,
  Briefcase,
  Church,
  Home as HomeIcon,
  Film,
  Scissors,
  Frame,
  BookOpen,
  Coffee,
  Shirt,
  Building,
} from "lucide-react"
import { SERVICE_RATES, EVENT_ADDONS, GLOBAL_ADDONS, MISC_SERVICE_RATES } from "@/lib/constants"
import type { AppLocale } from "@/lib/i18n/config"

// ============ COMPUTED STARTING PRICES (from global rates) ============
// Change rates in lib/constants.ts → these update automatically
const PHOTO_STARTING = SERVICE_RATES["candid-photo"].ratePerHalfDay
const VIDEO_STARTING = SERVICE_RATES["cinematic-video"].ratePerHalfDay
const DRONE_STARTING = EVENT_ADDONS.drone.price

// ============ TYPES ============
export type Category = "all" | "wedding" | "pre-wedding" | "events" | "baby-kids" | "videography" | "corporate" | "products"

export interface ServiceCard {
  slug: string
  name: string
  category: Category
  description: string
  startingPrice: number
  icon: LucideIcon
  image: string
  popular?: boolean
}

export interface ServicePackage {
  name: string
  price: number
  duration: string
  features: string[]
  popular?: boolean
}

export interface ServiceFAQ {
  q: string
  a: string
}

export interface ServiceDetail {
  slug: string
  name: string
  tagline: string
  description: string
  longDescription: string
  icon: LucideIcon
  heroImage: string
  gallery: string[]
  packages: ServicePackage[]
  includes: string[]
  process: { step: string; description: string }[]
  faqs: ServiceFAQ[]
  relatedSlugs: string[]
}

// ============ CATEGORIES ============
export const categories: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All Services", icon: Sparkles },
  { id: "wedding", label: "Wedding", icon: Crown },
  { id: "pre-wedding", label: "Pre-Wedding", icon: Heart },
  { id: "events", label: "Events & Ceremonies", icon: PartyPopper },
  { id: "baby-kids", label: "Baby & Kids", icon: Baby },
  { id: "videography", label: "Videography", icon: Video },
  { id: "corporate", label: "Corporate & Portfolio", icon: Briefcase },
  { id: "products", label: "Albums & Prints", icon: Frame },
]

// ============ SERVICE CARDS (for listing page) ============
export const services: ServiceCard[] = [
  // ─── WEDDING ────────────────────────────────
  {
    slug: "wedding-photography",
    name: "Wedding Photography",
    category: "wedding",
    description: "Candid + Traditional coverage to capture every emotion of your big day. Multiple photographers available.",
    startingPrice: PHOTO_STARTING,
    icon: Camera,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    popular: true,
  },
  {
    slug: "candid-wedding-photography",
    name: "Candid Wedding Photography",
    category: "wedding",
    description: "Documentary-style storytelling that captures raw emotions, laughter, tears, and joy naturally.",
    startingPrice: PHOTO_STARTING,
    icon: Camera,
    image: "/images/portfolio/hero-1.webp",
    popular: true,
  },
  {
    slug: "christian-wedding-photography",
    name: "Christian Wedding Photography",
    category: "wedding",
    description: "Specialized coverage for church ceremonies, traditions, and receptions with cultural sensitivity.",
    startingPrice: PHOTO_STARTING,
    icon: Church,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "muslim-wedding-photography",
    name: "Muslim Wedding Photography",
    category: "wedding",
    description: "Professional coverage for Nikah, Walima, Mehendi, and all wedding ceremonies.",
    startingPrice: PHOTO_STARTING,
    icon: Crown,
    image: "/images/portfolio/hero-3.webp",
  },

  // ─── PRE-WEDDING ───────────────────────────
  {
    slug: "pre-wedding-photoshoot",
    name: "Pre-Wedding Photoshoot",
    category: "pre-wedding",
    description: "Beautiful couple shoots at Bangalore's best locations. Includes outfit changes and location scouting.",
    startingPrice: PHOTO_STARTING,
    icon: Heart,
    image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80",
    popular: true,
  },
  {
    slug: "post-wedding-photoshoot",
    name: "Post-Wedding Photoshoot",
    category: "pre-wedding",
    description: "Celebrate your new journey with stunning couple portraits at picturesque locations.",
    startingPrice: PHOTO_STARTING,
    icon: Heart,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "engagement-photography",
    name: "Engagement Photography",
    category: "pre-wedding",
    description: "Capture the moment you said yes. Ring ceremony and engagement party coverage.",
    startingPrice: PHOTO_STARTING,
    icon: Calendar,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "anniversary-photoshoot",
    name: "Anniversary Photoshoot",
    category: "pre-wedding",
    description: "Celebrate your journey together with a beautiful couple shoot at any milestone.",
    startingPrice: PHOTO_STARTING,
    icon: PartyPopper,
    image: "/images/portfolio/hero-2.webp",
  },

  // ─── EVENTS & CEREMONIES ───────────────────
  {
    slug: "birthday-photography",
    name: "Birthday Photography",
    category: "events",
    description: "From 1st birthdays to milestone celebrations. Candid and traditional coverage.",
    startingPrice: PHOTO_STARTING,
    icon: Cake,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "baby-shower-photography",
    name: "Baby Shower Photography",
    category: "events",
    description: "Document the joy and excitement as you celebrate the upcoming arrival.",
    startingPrice: PHOTO_STARTING,
    icon: Baby,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "haldi-mehendi-photography",
    name: "Haldi & Mehendi Photography",
    category: "events",
    description: "Vibrant colors, dancing, and intimate moments captured beautifully.",
    startingPrice: PHOTO_STARTING,
    icon: Flower2,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "sangeet-photography",
    name: "Sangeet Photography",
    category: "events",
    description: "Dance performances, energy, and unforgettable party moments documented.",
    startingPrice: PHOTO_STARTING,
    icon: Music,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "naming-ceremony-photography",
    name: "Naming Ceremony Photography",
    category: "events",
    description: "Your baby's special naming day captured with care and attention to every detail.",
    startingPrice: PHOTO_STARTING,
    icon: Gift,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "cradle-ceremony-photography",
    name: "Cradle Ceremony Photography",
    category: "events",
    description: "Beautiful coverage of your baby's cradle ceremony (Tottilu) with all rituals documented.",
    startingPrice: PHOTO_STARTING,
    icon: Baby,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "housewarming-photography",
    name: "Housewarming Photography",
    category: "events",
    description: "Document your Gruhapravesham or housewarming ceremony beautifully.",
    startingPrice: PHOTO_STARTING,
    icon: HomeIcon,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "upanayana-photography",
    name: "Upanayana / Thread Ceremony Photography",
    category: "events",
    description: "Sacred thread ceremony (Janeu) documentation with respect for traditions and rituals.",
    startingPrice: PHOTO_STARTING,
    icon: Sparkles,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "shastipurthi-photography",
    name: "Shastipurthi Photography",
    category: "events",
    description: "60th birthday celebration photography — a milestone event captured with grandeur.",
    startingPrice: PHOTO_STARTING,
    icon: Crown,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "puberty-ceremony-photography",
    name: "Puberty Function Photography",
    category: "events",
    description: "Respectful, professional coverage of coming-of-age ceremonies and celebrations.",
    startingPrice: PHOTO_STARTING,
    icon: Sparkles,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "holy-communion-photography",
    name: "Holy Communion & Baptism Photography",
    category: "events",
    description: "Professional coverage of First Holy Communion, Baptism, and Confirmation ceremonies.",
    startingPrice: PHOTO_STARTING,
    icon: Church,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "events-photography",
    name: "Events Photography",
    category: "events",
    description: "General event coverage — college fests, exhibitions, social gatherings, and more.",
    startingPrice: PHOTO_STARTING,
    icon: PartyPopper,
    image: "/images/portfolio/hero-1.webp",
  },

  // ─── BABY & KIDS ───────────────────────────
  {
    slug: "baby-photoshoot",
    name: "Baby Photoshoot",
    category: "baby-kids",
    description: "Themed baby photography with props, costumes, and professional setups.",
    startingPrice: PHOTO_STARTING,
    icon: Baby,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
    popular: true,
  },
  {
    slug: "newborn-photography",
    name: "Newborn Photography",
    category: "baby-kids",
    description: "Delicate, artistic portraits of your newest family member within the first 14 days.",
    startingPrice: PHOTO_STARTING,
    icon: Baby,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "maternity-photography",
    name: "Maternity Photography",
    category: "baby-kids",
    description: "Celebrate your pregnancy with elegant indoor/outdoor maternity portraits.",
    startingPrice: PHOTO_STARTING,
    icon: Heart,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "indoor-maternity-photoshoot",
    name: "Indoor Maternity Photoshoot",
    category: "baby-kids",
    description: "Studio maternity portraits with flowing fabrics, dramatic lighting, and silhouette shots.",
    startingPrice: PHOTO_STARTING,
    icon: Heart,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "family-photoshoot",
    name: "Family Photoshoot",
    category: "baby-kids",
    description: "Beautiful family portraits in studio or outdoor settings. All ages welcome.",
    startingPrice: PHOTO_STARTING,
    icon: Users,
    image: "/images/portfolio/hero-1.webp",
  },

  // ─── VIDEOGRAPHY ───────────────────────────
  {
    slug: "wedding-videography",
    name: "Wedding Videography",
    category: "videography",
    description: "Complete wedding day video coverage — traditional and cinematic options.",
    startingPrice: VIDEO_STARTING,
    icon: Video,
    image: "/images/portfolio/hero-3.webp",
    popular: true,
  },
  {
    slug: "cinematic-videography",
    name: "Cinematic Videography",
    category: "videography",
    description: "Film-quality wedding and event videography with professional color grading.",
    startingPrice: VIDEO_STARTING,
    icon: Video,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "candid-videography",
    name: "Candid Videography",
    category: "videography",
    description: "Natural, documentary-style video that captures real moments without direction.",
    startingPrice: VIDEO_STARTING,
    icon: Film,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "drone-photography",
    name: "Drone Photography & Video",
    category: "videography",
    description: "Stunning aerial shots and videos for weddings, events, and venues.",
    startingPrice: DRONE_STARTING,
    icon: Plane,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "video-editing-services",
    name: "Video Editing Services",
    category: "videography",
    description: "Professional post-production — color grading, highlight reels, and cinematic edits from your raw footage.",
    startingPrice: MISC_SERVICE_RATES.videoEditing,
    icon: Scissors,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "corporate-video-production",
    name: "Corporate Video Production",
    category: "videography",
    description: "Company profiles, product demos, testimonial videos, and event recap films.",
    startingPrice: VIDEO_STARTING,
    icon: Film,
    image: "/images/portfolio/hero-3.webp",
  },

  // ─── CORPORATE & PORTFOLIO ─────────────────
  {
    slug: "corporate-photography",
    name: "Corporate Event Photography",
    category: "corporate",
    description: "Professional coverage for conferences, team events, product launches, and seminars.",
    startingPrice: PHOTO_STARTING,
    icon: Briefcase,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "portrait-photography",
    name: "Portrait Photography",
    category: "corporate",
    description: "Professional headshots, LinkedIn profiles, and personal branding photography.",
    startingPrice: MISC_SERVICE_RATES.portrait,
    icon: Image,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "portfolio-photography",
    name: "Portfolio Shoot",
    category: "corporate",
    description: "Professional portfolio photography for models, actors, artists, and creative professionals.",
    startingPrice: MISC_SERVICE_RATES.portfolio,
    icon: Image,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "fashion-photography",
    name: "Fashion Photography",
    category: "corporate",
    description: "Editorial fashion shoots, lookbooks, and catalog photography for brands and designers.",
    startingPrice: PHOTO_STARTING,
    icon: Shirt,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "product-ecommerce-photography",
    name: "Product & E-Commerce Photography",
    category: "corporate",
    description: "Clean product shots for Amazon, Flipkart, Shopify stores, and catalogs.",
    startingPrice: MISC_SERVICE_RATES.productPhoto,
    icon: Camera,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "digital-photo-studio",
    name: "Digital Photo Studio",
    category: "corporate",
    description: "Walk-in studio sessions for passport photos, ID photos, family portraits, and professional headshots.",
    startingPrice: MISC_SERVICE_RATES.studioSession,
    icon: Building,
    image: "/images/portfolio/hero-2.webp",
  },

  // ─── ALBUMS & PRINTS (PRODUCTS) ────────────
  {
    slug: "album-design-printing",
    name: "Album Design & Printing",
    category: "products",
    description: "Premium wedding albums, Canvera albums, Karizma albums — designed and printed professionally.",
    startingPrice: MISC_SERVICE_RATES.albumDesign,
    icon: BookOpen,
    image: "/images/portfolio/hero-3.webp",
  },
  {
    slug: "photo-frames",
    name: "Photo Frames & Canvas Prints",
    category: "products",
    description: "Custom photo frames, canvas prints, acrylic prints, and wall art for your home.",
    startingPrice: MISC_SERVICE_RATES.photoFrame,
    icon: Frame,
    image: "/images/portfolio/hero-1.webp",
  },
  {
    slug: "photo-restoration",
    name: "Photo Restoration Service",
    category: "products",
    description: "Restore old, damaged, or faded photographs to their original glory with digital restoration.",
    startingPrice: MISC_SERVICE_RATES.photoRestoration,
    icon: Image,
    image: "/images/portfolio/hero-2.webp",
  },
  {
    slug: "personalized-gifts-printing",
    name: "Personalized Gifts & Mug Printing",
    category: "products",
    description: "Custom coffee mugs, cushion covers, keychains, and gifts with your favorite photos printed.",
    startingPrice: MISC_SERVICE_RATES.personalizedGift,
    icon: Coffee,
    image: "/images/portfolio/hero-3.webp",
  },
]

// ============ DETAILED SERVICE DATA (for individual pages) ============
export const serviceDetails: Record<string, ServiceDetail> = {
  "wedding-photography": {
    slug: "wedding-photography",
    name: "Wedding Photography",
    tagline: "Every Emotion, Every Detail, Forever",
    description: "Professional wedding photography that captures the essence of your celebration with a mix of candid and traditional styles.",
    longDescription: "Your wedding day is a once-in-a-lifetime event, and every moment deserves to be captured beautifully. Our wedding photography team specializes in both candid storytelling and traditional posed portraits, ensuring you have a complete visual narrative of your special day. From the bridal prep to the bidaai, from stolen glances to grand celebrations — we document it all.",
    icon: Camera,
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    ],
    packages: [
      {
        name: "Essential",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "Half Day (5 hrs)",
        features: ["1 Photographer", "Traditional Photography", "200+ Edited Photos", "Online Gallery", "Photo Delivery in 5 Days"],
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "Full Day (10 hrs)",
        features: ["2 Photographers", "Candid + Traditional", "500+ Edited Photos", "Online Gallery", "Pre-Wedding Consultation", "Same-Day Teaser", "25-sheet Photo Album"],
        popular: true,
      },
      {
        name: "Luxury",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
        duration: "Full Day (10 hrs)",
        features: ["2+ Photographers", "Candid + Traditional + Drone", "1000+ Edited Photos", "Online Gallery", "Pre-Wedding Photoshoot", "Same-Day Teaser Video", "40-sheet Premium Album", "Canvas Print (20x30)", "All Functions Covered"],
      },
    ],
    includes: [
      "Professional color-corrected and edited photos",
      "High-resolution digital delivery via cloud",
      "Pre-event consultation and planning",
      "Backup equipment on-site",
      "Quick preview within 48 hours",
      "Private online gallery for sharing",
    ],
    process: [
      { step: "Consultation", description: "We discuss your wedding schedule, style preferences, and must-have shots over a call or in person." },
      { step: "Planning", description: "Our team scouts the venue (if needed), plans the timeline, and coordinates with other vendors." },
      { step: "Shoot Day", description: "Our photographers arrive early, set up, and capture every moment from morning prep to the final send-off." },
      { step: "Delivery", description: "Photos are professionally edited and delivered via a private online gallery within 5 days. Videos within 15 days." },
    ],
    faqs: [
      { q: "How many photos will we receive?", a: "Depending on the package, you'll receive 200-1000+ professionally edited photos." },
      { q: "Do you cover destination weddings?", a: "Yes! We cover weddings across India. Travel and accommodation charges apply for outstation bookings." },
      { q: "Can we customize a package?", a: "Absolutely. Contact us on WhatsApp and we'll create a custom package tailored to your needs and budget." },
      { q: "Are prices inclusive of GST?", a: "Yes! All our prices are GST-inclusive. No hidden charges or surprise fees." },
      { q: "Do you provide raw/unedited photos?", a: "We deliver edited photos only. Raw files can be purchased as an add-on (₹5,000)." },
      { q: "What's your cancellation policy?", a: "Free cancellation 7+ days before. 50% refund 3-7 days. No refund within 3 days." },
    ],
    relatedSlugs: ["candid-wedding-photography", "wedding-videography", "pre-wedding-photoshoot"],
  },
  "pre-wedding-photoshoot": {
    slug: "pre-wedding-photoshoot",
    name: "Pre-Wedding Photoshoot",
    tagline: "Your Love Story, Beautifully Told",
    description: "Romantic couple photography at Bangalore's most stunning locations with professional styling guidance.",
    longDescription: "A pre-wedding photoshoot is the perfect way to celebrate your journey together before the big day. Our team helps you pick the perfect locations around Bangalore — from lush gardens and heritage buildings to urban rooftops and cozy cafes. We guide you on outfits, poses, and timing to create magazine-worthy couple portraits.",
    icon: Heart,
    heroImage: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80",
    ],
    packages: [
      {
        name: "Silver",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "3 hours",
        features: ["1 Location", "2 Outfit Changes", "50+ Edited Photos", "1 Photographer", "Online Gallery", "Delivery in 7 Days"],
      },
      {
        name: "Gold",
        price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "5 hours",
        features: ["2 Locations", "4 Outfit Changes", "100+ Edited Photos", "1 Photographer + Assistant", "Online Gallery", "Location Scouting", "Styling Guide"],
        popular: true,
      },
      {
        name: "Platinum",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["cinematic-video"].ratePerDay + EVENT_ADDONS.drone.price + GLOBAL_ADDONS["album-40"].price,
        duration: "8 hours",
        features: ["3 Locations", "6 Outfit Changes", "200+ Edited Photos", "2 Photographers", "Cinematic Video (3 min)", "Drone Shots", "Props & Styling", "Same-Day Sneak Peek"],
      },
    ],
    includes: [
      "Professional posing direction",
      "Location recommendations and scouting",
      "Outfit and styling consultation",
      "Professional editing and color grading",
      "Cloud delivery of high-resolution images",
      "Private shareable gallery",
    ],
    process: [
      { step: "Consultation", description: "We learn about you as a couple — your story, vibe, and preferences to plan the perfect shoot." },
      { step: "Planning", description: "Location finalization, outfit guidance, mood board creation, and schedule coordination." },
      { step: "Shoot Day", description: "Relaxed, fun session with professional direction. We capture genuine moments." },
      { step: "Delivery", description: "Professionally edited photos delivered within 7 days via your private online gallery." },
    ],
    faqs: [
      { q: "Best locations for pre-wedding in Bangalore?", a: "Cubbon Park, Nandi Hills, Lal Bagh, Palace Grounds, Hesaraghatta Lake, and heritage properties. We suggest based on your style." },
      { q: "What should we wear?", a: "We provide a styling guide. Generally, coordinating colors (not matching), solid colors, and comfortable outfits work best." },
      { q: "Can we bring props?", a: "Absolutely! We also have fairy lights, smoke bombs, and other items available." },
      { q: "What if it rains?", a: "We offer a free reschedule. Some couples love rainy shoots for the drama!" },
      { q: "How soon should we book?", a: "2-4 weeks in advance, especially during wedding season (Oct-Feb)." },
    ],
    relatedSlugs: ["engagement-photography", "wedding-photography", "post-wedding-photoshoot"],
  },
  "baby-photoshoot": {
    slug: "baby-photoshoot",
    name: "Baby Photoshoot",
    tagline: "Tiny Moments, Giant Memories",
    description: "Adorable themed baby photography with professional props, setups, and a safe environment.",
    longDescription: "Babies grow so fast — every week brings new expressions and milestones. Our baby photography sessions are designed to be fun, safe, and comfortable. We use soft lighting, baby-safe props, and create themed setups that result in photographs you'll treasure forever.",
    icon: Baby,
    heroImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
      "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80",
      "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80",
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80",
    ],
    packages: [
      {
        name: "Basic",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "1-2 hours",
        features: ["1 Theme Setup", "10+ Edited Photos", "Home Visit", "Basic Props", "Digital Delivery"],
      },
      {
        name: "Standard",
        price: SERVICE_RATES["candid-photo"].ratePerDay,
        duration: "2-3 hours",
        features: ["2 Theme Setups", "25+ Edited Photos", "Home/Studio", "Premium Props & Costumes", "Online Gallery", "Family Portraits Included"],
        popular: true,
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "3+ hours",
        features: ["3+ Theme Setups", "50+ Edited Photos", "Studio Session", "All Props & Costumes", "Family Portraits", "Canvas Print (12x18)", "Same-Week Delivery"],
      },
    ],
    includes: [
      "Baby-safe props and setups",
      "Patient, experienced photographer",
      "Flexible timing around baby's schedule",
      "Multiple outfit/theme changes",
      "Family/parent photos included",
      "High-resolution digital delivery",
    ],
    process: [
      { step: "Consultation", description: "We discuss your baby's age, favorite themes, and plan timing around nap/feed schedules." },
      { step: "Setup", description: "Our team sets up themed backdrops, props, and lighting in a baby-safe arrangement." },
      { step: "Session", description: "Patient, fun session with lots of breaks. Your baby's comfort comes first." },
      { step: "Delivery", description: "Professionally edited photos delivered within 5-7 days." },
    ],
    faqs: [
      { q: "What age is best for baby photoshoots?", a: "Popular milestones: newborn (5-14 days), 3 months, 6 months (sitting), 9 months (crawling), and 1 year (cake smash)." },
      { q: "Is the setup safe for babies?", a: "Absolutely. We use only baby-safe, non-toxic props. Safety is our top priority." },
      { q: "What if my baby is fussy?", a: "Totally normal! We keep sessions relaxed with breaks. We've never had one we couldn't complete." },
      { q: "Do you provide costumes?", a: "Yes! We have a collection of baby-safe costumes. You're also welcome to bring your own." },
      { q: "Can parents be in the photos?", a: "Of course! Family portraits are included in Standard and Premium packages." },
    ],
    relatedSlugs: ["newborn-photography", "maternity-photography", "birthday-photography"],
  },
  "engagement-photography": {
    slug: "engagement-photography",
    name: "Engagement Photography",
    tagline: "Every Promise, Every Emotion, Forever Framed",
    description: "Professional ring ceremony and engagement party photography capturing heartfelt moments with family and friends.",
    longDescription: "Your engagement is the beginning of a beautiful journey — a day filled with family, laughter, and the emotion of a promise made. Orvex Visuals brings the same storytelling care that we apply to full weddings: a blend of candid moments and composed portraits that capture the real spirit of your celebration. Whether it's an intimate ring ceremony at home or a grand engagement party, we plan with you, arrive prepared, and deliver a complete visual record that you'll look back on for years.",
    icon: Calendar,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      {
        name: "Essential",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "Half Day (5 hrs)",
        features: ["1 Photographer", "Candid Coverage", "100+ Edited Photos", "Ring Ceremony Focus", "Online Gallery", "Delivery in 5 Days"],
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "Full Day (10 hrs)",
        features: ["2 Photographers", "Candid + Traditional", "300+ Edited Photos", "Family Group Portraits", "Online Gallery", "25-sheet Photo Album"],
        popular: true,
      },
      {
        name: "Luxury",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
        duration: "Full Day (10 hrs)",
        features: ["2+ Photographers", "Candid + Traditional + Drone", "500+ Edited Photos", "Same-Day Sneak Peek", "Full Venue Coverage", "40-sheet Premium Album", "Priority Delivery"],
      },
    ],
    includes: [
      "Professional color-corrected and edited photos",
      "High-resolution digital delivery via cloud",
      "Pre-event planning consultation",
      "Backup equipment on-site",
      "Quick preview within 48 hours",
      "Private online gallery for sharing",
    ],
    process: [
      { step: "Consultation", description: "We discuss your engagement schedule, venue, guest count, and the moments that matter most to you." },
      { step: "Planning", description: "Our team reviews the venue layout, plans coverage positions, and coordinates timing with your schedule." },
      { step: "Event Day", description: "Photographers arrive before the ceremony begins and cover the full event — rituals, candid moments, and group portraits." },
      { step: "Delivery", description: "Professionally edited photos delivered via your private online gallery within 5 days." },
    ],
    faqs: [
      { q: "What does the Essential package include?", a: "A half-day session (5 hours) with one photographer focused on the ring ceremony and candid moments." },
      { q: "Can we include getting-ready shots?", a: "Yes. Pre-event bridal or groom prep photography can be added. Discuss this during consultation." },
      { q: "How far in advance should we book?", a: "2–4 weeks in advance is recommended. For peak months (Oct–Feb), book earlier." },
      { q: "Do you cover outdoor or outstation engagements?", a: "Yes. We cover events across Bangalore and outstation. Travel charges apply for outstation." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST. No hidden charges." },
    ],
    relatedSlugs: ["pre-wedding-photoshoot", "anniversary-photoshoot", "wedding-photography"],
  },
  "birthday-photography": {
    slug: "birthday-photography",
    name: "Birthday Photography",
    tagline: "Every Candle, Every Smile, Perfectly Captured",
    description: "Candid and traditional birthday photography for first birthdays, milestone celebrations, and family gatherings of all sizes.",
    longDescription: "Birthdays are moments families return to again and again — from the excitement of a child's first cake smash to the grandeur of a 60th milestone celebration. Orvex Visuals brings professional event photography coverage that captures the energy of the party, the joy on every face, and the small moments that make a birthday genuinely memorable. We work discreetly so guests stay relaxed, and we deliver a complete gallery that tells the full story of the day.",
    icon: Cake,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      {
        name: "Essential",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "Half Day (5 hrs)",
        features: ["1 Photographer", "Candid Coverage", "100+ Edited Photos", "Cake Cutting Coverage", "Online Gallery", "Delivery in 5 Days"],
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "Full Day (10 hrs)",
        features: ["2 Photographers", "Candid + Traditional", "300+ Edited Photos", "Family Group Portraits", "Online Gallery", "25-sheet Photo Album"],
        popular: true,
      },
      {
        name: "Luxury",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
        duration: "Full Day (10 hrs)",
        features: ["2+ Photographers", "Candid + Traditional + Drone", "500+ Edited Photos", "Same-Day Highlights Video", "Full Venue Coverage", "40-sheet Premium Album", "Priority Delivery"],
      },
    ],
    includes: [
      "Professional color-corrected and edited photos",
      "High-resolution digital delivery via cloud",
      "Pre-event planning consultation",
      "Backup equipment on-site",
      "Quick preview within 48 hours",
      "Private online gallery for sharing",
    ],
    process: [
      { step: "Consultation", description: "We discuss the venue, guest count, key activities, and specific moments you want captured." },
      { step: "Planning", description: "Our team prepares the coverage plan based on the event timeline and venue layout." },
      { step: "Event Day", description: "Photographers arrive before guests and cover the full celebration — from setup to the final send-off." },
      { step: "Delivery", description: "Professionally edited photos delivered via your private online gallery within 5 days." },
    ],
    faqs: [
      { q: "Do you cover themed birthday parties?", a: "Yes. We work with your decor and theme to compose photos that match the party aesthetic." },
      { q: "What is the minimum coverage duration?", a: "The Essential package covers 5 hours — enough for most birthday celebrations. Larger events benefit from full-day coverage." },
      { q: "Can we add a short highlight video?", a: "Yes. A same-day edit highlight reel is included in the Luxury package or available as an add-on." },
      { q: "Do you photograph 1st birthday cake smashes?", a: "Absolutely. First birthdays are a specialty — we keep sessions comfortable for babies and toddlers." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST. No hidden charges." },
    ],
    relatedSlugs: ["baby-photoshoot", "events-photography", "housewarming-photography"],
  },
  "housewarming-photography": {
    slug: "housewarming-photography",
    name: "Housewarming Photography",
    tagline: "New Home, New Chapter, Beautiful Memories",
    description: "Complete coverage of your Gruhapravesham or housewarming ceremony — from the puja rituals to the family celebration.",
    longDescription: "A housewarming ceremony is one of life's meaningful milestones — the day a house becomes a home for your family. Orvex Visuals documents every part of your Gruhapravesham or housewarming with care: the puja rituals, the family gathered in a new space for the first time, the blessings, and the celebration. Our photographers understand the cultural significance of the ceremony and work respectfully within the space to deliver photographs the whole family will keep for generations.",
    icon: HomeIcon,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      {
        name: "Essential",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "Half Day (5 hrs)",
        features: ["1 Photographer", "Candid Coverage", "Puja Ritual Coverage", "100+ Edited Photos", "Online Gallery", "Delivery in 5 Days"],
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "Full Day (10 hrs)",
        features: ["2 Photographers", "Candid + Traditional", "Rituals + Family Portraits", "300+ Edited Photos", "Online Gallery", "25-sheet Photo Album"],
        popular: true,
      },
      {
        name: "Luxury",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
        duration: "Full Day (10 hrs)",
        features: ["2+ Photographers", "Candid + Traditional + Drone", "Aerial Venue Shots", "500+ Edited Photos", "Same-Day Highlights", "40-sheet Premium Album", "Priority Delivery"],
      },
    ],
    includes: [
      "Coverage of puja rituals and family blessings",
      "Family group portraits inside the new home",
      "Professional color-corrected and edited photos",
      "High-resolution digital delivery via cloud",
      "Pre-event consultation and planning",
      "Private online gallery for sharing",
    ],
    process: [
      { step: "Consultation", description: "We understand the ceremony schedule, pandit timings, and which moments are most important for your family." },
      { step: "Planning", description: "Our team prepares based on your home layout and the full ceremony timeline." },
      { step: "Ceremony Day", description: "Photographers arrive before the puja begins and document rituals, guests, and family moments throughout." },
      { step: "Delivery", description: "Edited photos delivered via your private online gallery within 5 days." },
    ],
    faqs: [
      { q: "Are your photographers familiar with Gruhapravesham rituals?", a: "Yes. Our photographers are familiar with the key rituals and how to capture them well without disrupting the ceremony." },
      { q: "Can you cover an apartment housewarming?", a: "Absolutely. We work in all home sizes — apartments, independent houses, and large bungalows." },
      { q: "How early do photographers arrive?", a: "We typically arrive 30 minutes before the first ritual to set up and understand the space." },
      { q: "Do you travel outside Bangalore for housewarmings?", a: "Yes. Outstation coverage is available with applicable travel charges." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST. No hidden charges." },
    ],
    relatedSlugs: ["events-photography", "naming-ceremony-photography", "upanayana-photography"],
  },
  "events-photography": {
    slug: "events-photography",
    name: "Events Photography",
    tagline: "Every Gathering, Professionally Documented",
    description: "Professional event photography for college fests, exhibitions, social gatherings, product launches, and community celebrations.",
    longDescription: "Not every important occasion is a wedding — but all of them deserve professional documentation. Orvex Visuals covers a wide range of general events across Bangalore: cultural fests, brand exhibitions, association gatherings, private parties, award functions, and more. We match the coverage plan to your event size and format, ensuring you have a complete visual record of the atmosphere, key moments, and the people who were there.",
    icon: PartyPopper,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      {
        name: "Essential",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "Half Day (5 hrs)",
        features: ["1 Photographer", "Candid Coverage", "100+ Edited Photos", "Key Moments Focus", "Online Gallery", "Delivery in 5 Days"],
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "Full Day (10 hrs)",
        features: ["2 Photographers", "Candid + Traditional", "300+ Edited Photos", "Speaker and Stage Coverage", "Group Portraits", "25-sheet Photo Album"],
        popular: true,
      },
      {
        name: "Luxury",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
        duration: "Full Day (10 hrs)",
        features: ["2+ Photographers", "Candid + Traditional + Drone", "500+ Edited Photos", "Same-Day Highlights Video", "Aerial Venue Shots", "40-sheet Premium Album", "Priority Delivery"],
      },
    ],
    includes: [
      "Professional color-corrected and edited photos",
      "High-resolution digital delivery via cloud",
      "Pre-event planning and coverage coordination",
      "Backup equipment on-site",
      "Quick preview within 48 hours",
      "Private online gallery for sharing",
    ],
    process: [
      { step: "Consultation", description: "We understand the event format, schedule, key activities, and your coverage priorities." },
      { step: "Planning", description: "Coverage plan prepared based on venue, audience size, and event flow." },
      { step: "Live Coverage", description: "Photographers arrive early and cover the full event — atmosphere, speakers, performances, and candid crowd moments." },
      { step: "Delivery", description: "Edited photos delivered via your private online gallery within 5 days." },
    ],
    faqs: [
      { q: "What types of events do you cover?", a: "College fests, brand exhibitions, community gatherings, private parties, award nights, product launches, cultural shows, and more." },
      { q: "Can you cover multi-day events?", a: "Yes. Multi-day events are covered with day-wise pricing. Contact us on WhatsApp for a custom quote." },
      { q: "How many photographers do you send?", a: "Based on event size — Essential has 1, Premium and Luxury send 2 or more. Custom team sizing is available on request." },
      { q: "Can we get a same-day highlight video?", a: "Yes. A same-day edit highlight reel is included in the Luxury package or available as a standalone add-on." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST. No hidden charges." },
    ],
    relatedSlugs: ["birthday-photography", "housewarming-photography", "corporate-photography"],
  },
  "maternity-photography": {
    slug: "maternity-photography",
    name: "Maternity Photography",
    tagline: "Celebrating New Life, Beautifully Framed",
    description: "Elegant indoor and outdoor maternity portraits that celebrate your pregnancy with warmth, care, and professional guidance.",
    longDescription: "Pregnancy is a season of life that passes quickly and deserves to be beautifully documented. Orvex Visuals creates maternity portraits in both indoor studio settings and outdoor natural environments — whichever feels right for you. We guide outfit choices, posing, and timing around your comfort and pregnancy stage. Sessions are unhurried, supportive, and always focused on bringing out the natural emotion and beauty of this chapter.",
    icon: Heart,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      {
        name: "Essential",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "Half Day (5 hrs)",
        features: ["1 Photographer", "Indoor or Outdoor Session", "1 Outfit Setup", "100+ Edited Photos", "Online Gallery", "Delivery in 7 Days"],
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "Full Day (10 hrs)",
        features: ["1 Photographer + Assistant", "Indoor + Outdoor Session", "2 Outfit Setups", "Partner / Family Portraits", "200+ Edited Photos", "25-sheet Photo Album"],
        popular: true,
      },
      {
        name: "Luxury",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
        duration: "Full Day (10 hrs)",
        features: ["2 Photographers", "Studio + Location Session", "3+ Outfit Setups", "Silhouette & Creative Shots", "300+ Edited Photos", "Same-Day Sneak Peek", "40-sheet Premium Album", "Priority Delivery"],
      },
    ],
    includes: [
      "Posing guidance and styling consultation",
      "Indoor studio and outdoor location options",
      "Professional color-corrected and edited photos",
      "High-resolution digital delivery via cloud",
      "Partner and family portrait option",
      "Private online gallery for sharing",
    ],
    process: [
      { step: "Consultation", description: "We discuss your preferred style — studio vs. outdoor, outfit ideas, and whether you want solo or partner/family shots." },
      { step: "Planning", description: "Location and timing confirmed based on your comfort and ideal pregnancy stage (typically 28–34 weeks)." },
      { step: "Session", description: "Relaxed, guided session at your own pace — with breaks as needed and posing direction throughout." },
      { step: "Delivery", description: "Professionally edited photos delivered via your private online gallery within 7 days." },
    ],
    faqs: [
      { q: "When is the best time for a maternity shoot?", a: "Most photographers recommend 28–34 weeks — bump is prominent but you're still comfortable. We adjust around your schedule." },
      { q: "Indoor or outdoor — which is better?", a: "Both have their beauty. Indoor studio sessions offer controlled lighting. Outdoor sessions have natural light and a relaxed feel. We offer both." },
      { q: "Can my partner and kids be in the session?", a: "Yes. Partner and family portraits can be included in any session. Premium and Luxury packages are designed with this in mind." },
      { q: "What should I wear?", a: "We provide styling guidance. Flowy fabrics, solid colors, and comfortable fits work best. We can also suggest maternity clothing options." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST. No hidden charges." },
    ],
    relatedSlugs: ["baby-photoshoot", "newborn-photography", "indoor-maternity-photoshoot"],
  },
  "corporate-photography": {
    slug: "corporate-photography",
    name: "Corporate Event Photography",
    tagline: "Professional Coverage for Every Business Moment",
    description: "Experienced event photography for conferences, product launches, team events, award ceremonies, and corporate celebrations.",
    longDescription: "Corporate events require a photographer who is professional, unobtrusive, and delivers content that reflects the quality of your brand. Orvex Visuals covers corporate events across Bangalore — from small team gatherings and off-site celebrations to large conferences, product launches, and award nights. We capture speakers, audience energy, branding elements, and candid team moments so you walk away with a complete and usable visual record ready for internal communications, press, and social media.",
    icon: Briefcase,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      {
        name: "Essential",
        price: SERVICE_RATES["candid-photo"].ratePerHalfDay,
        duration: "Half Day (5 hrs)",
        features: ["1 Photographer", "Candid Coverage", "100+ Edited Photos", "Speaker and Stage Coverage", "Online Gallery", "Delivery in 5 Days"],
      },
      {
        name: "Premium",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
        duration: "Full Day (10 hrs)",
        features: ["2 Photographers", "Full Event Coverage", "300+ Edited Photos", "Candid Team Portraits", "Group Photos", "25-sheet Album"],
        popular: true,
      },
      {
        name: "Luxury",
        price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
        duration: "Full Day (10 hrs)",
        features: ["2+ Photographers", "Full Coverage + Drone", "500+ Edited Photos", "Aerial Venue Shots", "Same-Day Highlights Video", "40-sheet Premium Album", "Priority Delivery"],
      },
    ],
    includes: [
      "Professional color-corrected and edited photos",
      "High-resolution digital delivery via cloud",
      "Pre-event briefing and coverage planning",
      "Backup equipment on-site",
      "Quick preview within 48 hours",
      "Organized gallery with event tagging",
    ],
    process: [
      { step: "Briefing", description: "We understand your event format, brand guidelines, key speakers or moments, and deliverable requirements." },
      { step: "Planning", description: "Coverage plan prepared based on venue, agenda, and team size — including position scouting if needed." },
      { step: "Live Coverage", description: "Photographers arrive before the event starts and cover the full schedule — keynotes, networking, team moments, and official activities." },
      { step: "Delivery", description: "Edited photos organized and delivered via your private online gallery within 5 days." },
    ],
    faqs: [
      { q: "Do you sign NDAs for corporate events?", a: "Yes. We can sign standard NDAs and confidentiality agreements before the event." },
      { q: "Can we get high-res files for press and social media?", a: "Yes. All deliverables are high-resolution and optimized for both digital and print use." },
      { q: "Can you turn around hero shots for same-day posting?", a: "Yes. Same-day edits of 10–20 hero shots are available as an add-on for time-sensitive events." },
      { q: "Do you cover outstation corporate events?", a: "Yes. We cover events outside Bangalore with applicable travel and accommodation charges." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST. No hidden charges." },
    ],
    relatedSlugs: ["events-photography", "drone-photography", "corporate-video-production"],
  },

  // ── Variant Discovery Pages ──────────────────────────────────────────
  "candid-wedding-photography": {
    slug: "candid-wedding-photography",
    name: "Candid Wedding Photography",
    tagline: "Real Moments, Honestly Told",
    description: "Documentary-style wedding storytelling that captures raw emotions, laughter, tears, and joy as they happen — naturally, without direction.",
    longDescription: "Candid wedding photography is about truth. Instead of posed arrangements, our photographers work like photojournalists — blending into your celebration, anticipating moments, and pressing the shutter when real emotion peaks. The result is a wedding album that feels alive: the nervous laugh before the ceremony, the tear rolling down a parent's cheek, the unscripted first dance spin. Orvex Visuals has documented hundreds of candid wedding stories across Bangalore and beyond. Our approach keeps us invisible on your day so the moments stay genuine.",
    icon: Camera,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["1 Candid Photographer", "200+ Edited Photos", "Online Gallery", "Delivery in 5 Days"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["2 Candid Photographers", "500+ Edited Photos", "Online Gallery", "Same-Day Teaser", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["2+ Photographers", "Candid + Traditional", "1000+ Edited Photos", "Drone Coverage", "Same-Day Teaser", "40-sheet Album"] },
    ],
    includes: [
      "Documentary-style coverage throughout the day",
      "Genuine emotion capture without directing subjects",
      "High-resolution professionally edited images",
      "Pre-event consultation on coverage priorities",
      "Private online gallery for sharing",
      "Backup equipment on-site",
    ],
    process: [
      { step: "Consultation", description: "We learn your wedding schedule and key moments so we know exactly where to be." },
      { step: "Coverage Day", description: "Our photographers work unobtrusively, capturing moments as they unfold." },
      { step: "Curation", description: "The best frames are selected, color-graded, and retouched." },
      { step: "Delivery", description: "Photos delivered via private gallery within 5 days." },
    ],
    faqs: [
      { q: "What is candid photography?", a: "Candid photography means capturing real, unposed moments. We document your day as it happens without staging scenes." },
      { q: "Do you do any posed shots?", a: "We keep posed shots minimal — family group photos and a few couple portraits. The majority of the album is candid." },
      { q: "How many photos will we receive?", a: "200 to 1000+ depending on the package. All are professionally edited." },
      { q: "Are prices GST-inclusive?", a: "Yes. No hidden charges." },
    ],
    relatedSlugs: ["wedding-photography", "wedding-videography", "pre-wedding-photoshoot"],
  },

  "christian-wedding-photography": {
    slug: "christian-wedding-photography",
    name: "Christian Wedding Photography",
    tagline: "Grace, Joy, and Every Sacred Moment",
    description: "Specialized coverage for church ceremonies, vow exchanges, receptions, and Christian wedding traditions with cultural sensitivity.",
    longDescription: "A Christian wedding carries a beautiful set of rituals — the church procession, vow exchange at the altar, ring ceremony, first kiss, and the reception celebration that follows. Our photographers understand the reverence and joy of each moment and know how to capture them respectfully within church lighting and space constraints. We coordinate with priests and event coordinators ahead of time, position ourselves correctly, and deliver images that reflect the spiritual and celebratory nature of your day.",
    icon: Church,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Church Ceremony Coverage", "1 Photographer", "200+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Church + Reception Coverage", "2 Photographers", "500+ Edited Photos", "25-sheet Album", "Same-Day Teaser"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Day Coverage", "2+ Photographers", "Drone Shots", "1000+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Church ceremony coverage with permission coordination",
      "Reception and celebration coverage",
      "Bridal prep and portrait session",
      "Professionally edited high-resolution photos",
      "Private online gallery",
      "Pre-event site coordination",
    ],
    process: [
      { step: "Consultation", description: "We discuss your ceremony schedule, church policies, and reception plan." },
      { step: "Coordination", description: "We liaise with the church coordinator to confirm photography permissions and positioning." },
      { step: "Coverage Day", description: "From bridal prep through reception, our team captures every moment." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Do you have experience shooting inside churches?", a: "Yes. We've covered ceremonies in many Bangalore churches and understand lighting, movement restrictions, and positioning." },
      { q: "Can you shoot during the ceremony itself?", a: "Yes, subject to church permission. We always coordinate with the officiating priest before the event." },
      { q: "Do you cover both the church and the reception?", a: "Yes. Our full-day packages cover both." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["wedding-photography", "candid-wedding-photography", "holy-communion-photography"],
  },

  "muslim-wedding-photography": {
    slug: "muslim-wedding-photography",
    name: "Muslim Wedding Photography",
    tagline: "Every Ceremony, Beautifully Honored",
    description: "Professional coverage for Nikah, Walima, Mehendi, and all Muslim wedding functions with cultural understanding and respect.",
    longDescription: "A Muslim wedding is rich with ceremony — the intimate Nikah, the vibrant Mehendi, the celebratory Walima, and the various family rituals that tie the events together. Our photographers approach Muslim weddings with respect for traditions, understanding of coverage protocols, and the skill to capture both intimate and celebratory moments faithfully. We work closely with families to understand which moments matter most and how to document them respectfully.",
    icon: Crown,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Single Function Coverage", "1 Photographer", "200+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Multi-Function Coverage", "2 Photographers", "500+ Edited Photos", "25-sheet Album", "Same-Day Teaser"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["All Functions Covered", "2+ Photographers", "Drone Shots", "1000+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Nikah, Walima, and Mehendi coverage",
      "Candid and traditional documentary coverage",
      "Respectful coordination with event teams",
      "High-resolution professionally edited photos",
      "Private online gallery for family sharing",
      "Backup equipment on-site",
    ],
    process: [
      { step: "Consultation", description: "We discuss which functions you need covered and any cultural preferences for the shoot." },
      { step: "Planning", description: "We coordinate the schedule, venue layout, and coverage logistics with your family." },
      { step: "Coverage", description: "Our team covers each function respectfully and thoroughly." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Do you cover multi-day Muslim weddings?", a: "Yes. We offer multi-day coverage packages. Contact us for a custom quote." },
      { q: "Can you accommodate gender-separated events?", a: "Yes. We are experienced with gender-segregated ceremonies and can position accordingly." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["wedding-photography", "candid-wedding-photography", "haldi-mehendi-photography"],
  },

  "haldi-mehendi-photography": {
    slug: "haldi-mehendi-photography",
    name: "Haldi & Mehendi Photography",
    tagline: "Color, Ritual, and Pure Joy",
    description: "Vibrant, immersive coverage of Haldi and Mehendi functions — colors, dancing, rituals, and candid moments captured beautifully.",
    longDescription: "Haldi and Mehendi are among the most photographically rich events of any Indian wedding. The turmeric paste being applied, the intricate henna patterns taking shape, the singing, the laughing, the informal chaos of family — these moments deserve a photographer who loves the energy as much as you do. Our team specializes in handling the challenging lighting of outdoor Haldi functions and the close-up detail work of Mehendi sessions, delivering a set of images that are vibrant, warm, and full of life.",
    icon: Flower2,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Single Function", "1 Photographer", "150+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Haldi + Mehendi Coverage", "2 Photographers", "300+ Edited Photos", "25-sheet Album", "Same-Day Teaser"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "2+ Photographers", "Mehendi Detail Shots", "500+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Haldi ceremony coverage including application sequences",
      "Mehendi close-up detail photography",
      "Candid group and family moments",
      "Professionally edited vibrant color-graded photos",
      "Private online gallery",
      "Backup equipment on-site",
    ],
    process: [
      { step: "Consultation", description: "We discuss event timing, indoor/outdoor setup, and lighting conditions." },
      { step: "Preparation", description: "Our photographer arrives early to scout angles and prepare for the color and movement." },
      { step: "Coverage", description: "We document the rituals, the close-up mehendi art, and all candid moments." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Do you shoot Haldi and Mehendi as a combined package?", a: "Yes. Our full-day package covers both functions." },
      { q: "How do you protect equipment during Haldi?", a: "Our photographers use weather-sealed cameras and lenses. Equipment protection is always planned." },
      { q: "Can you capture mehendi close-ups?", a: "Yes. We use macro lenses for detailed mehendi pattern shots." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["wedding-photography", "sangeet-photography", "candid-wedding-photography"],
  },

  "sangeet-photography": {
    slug: "sangeet-photography",
    name: "Sangeet Photography",
    tagline: "Dance, Music, and Unforgettable Moments",
    description: "High-energy Sangeet coverage — dance performances, family entertainment, candid reactions, and all the joy of the night.",
    longDescription: "A Sangeet night is pure celebration — choreographed dances, impromptu performances, emotional songs, and the whole family together. Our photographers are skilled at fast-moving indoor event photography, using the right flash and natural light techniques to freeze action without killing the atmosphere. We capture the rehearsed performances and the spontaneous moments with equal skill.",
    icon: Music,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Event Coverage", "1 Photographer", "150+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Full Sangeet Coverage", "2 Photographers", "300+ Edited Photos", "Same-Day Teaser", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "2+ Photographers", "Candid + Posed", "500+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Dance performance and stage coverage",
      "Audience and reaction candid shots",
      "Family portrait moments",
      "Indoor event lighting techniques",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss the event schedule, stage setup, and key performance moments." },
      { step: "Venue Check", description: "Our photographer checks lighting conditions and positions in advance." },
      { step: "Coverage", description: "We cover performances, speeches, and candid celebrations through the night." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Can you freeze fast dance movements?", a: "Yes. We use the appropriate shutter speeds and flash techniques for action shots." },
      { q: "Is the coverage indoor or outdoor?", a: "We handle both indoor venue setups and outdoor Sangeet arrangements." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["wedding-photography", "haldi-mehendi-photography", "candid-wedding-photography"],
  },

  "wedding-videography": {
    slug: "wedding-videography",
    name: "Wedding Videography",
    tagline: "Your Day, Relived Forever",
    description: "Complete wedding day video coverage — traditional documentation and cinematic highlight films for every function.",
    longDescription: "A wedding film is the closest thing to being there again. Our wedding videography team captures vows, rituals, tears, laughter, and speeches in full motion, then edits them into films you'll want to watch every anniversary. We offer both traditional full-coverage documentation and cinematic highlight reels with original sound and music. From the morning preparation through the evening reception, every moment that matters is on film.",
    icon: Video,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["cinematic-video"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Traditional Video Coverage", "1 Videographer", "Full-Ceremony Edit", "Online Delivery"] },
      { name: "Premium", price: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Cinematic + Traditional", "2 Videographers", "Highlight Film", "Full Ceremony Edit", "Same-Day Teaser"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price, duration: "Full Day (10 hrs)", features: ["Full Cinematic Production", "2+ Videographers", "Drone Video", "Highlight Film", "Same-Day Edit", "All Functions"] },
    ],
    includes: [
      "Full ceremony and reception video coverage",
      "Cinematic highlight film with music",
      "Professional color grading and audio sync",
      "Drone footage (available as add-on)",
      "Online delivery via private link",
      "Backup equipment on-site",
    ],
    process: [
      { step: "Consultation", description: "We discuss your event schedule, style preferences, and film length expectations." },
      { step: "Planning", description: "Shot list, equipment plan, and team coordination are finalized." },
      { step: "Filming", description: "Our videographers capture every moment with professional cinema-grade equipment." },
      { step: "Delivery", description: "Highlight film and full edits delivered within 15 days." },
    ],
    faqs: [
      { q: "How long is the highlight film?", a: "Typically 5-10 minutes, depending on the package and footage." },
      { q: "Do you include a same-day edit?", a: "Same-day edits are available as part of the Luxury package and as an add-on." },
      { q: "Can you sync the audio from the ceremony?", a: "Yes. We use dedicated audio recording for ceremonies." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["wedding-photography", "cinematic-videography", "drone-photography"],
  },

  "post-wedding-photoshoot": {
    slug: "post-wedding-photoshoot",
    name: "Post-Wedding Photoshoot",
    tagline: "The Story Continues",
    description: "Relaxed couple portraits at beautiful locations after the wedding — all the romance, none of the day-of pressure.",
    longDescription: "The wedding day is a blur. A post-wedding photoshoot gives you the time to be fully present in your couple portraits — dressed in your wedding or bridal wear, at a stunning location, with no schedule pressure. Many couples say these are the most relaxed and natural images they have. We plan locations around Bangalore that match your aesthetic: heritage properties, lush gardens, or modern urban settings.",
    icon: Heart,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Silver", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "3 hours", features: ["1 Location", "2 Outfit Changes", "50+ Edited Photos", "1 Photographer", "Online Gallery"] },
      { name: "Gold", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "5 hours", features: ["2 Locations", "4 Outfit Changes", "100+ Edited Photos", "1 Photographer + Assistant", "Location Scouting", "25-sheet Album"], popular: true },
      { name: "Platinum", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["cinematic-video"].ratePerDay + EVENT_ADDONS.drone.price + GLOBAL_ADDONS["album-40"].price, duration: "8 hours", features: ["3 Locations", "6 Outfit Changes", "200+ Edited Photos", "2 Photographers", "Cinematic Video", "Drone Shots", "40-sheet Album"] },
    ],
    includes: [
      "Location scouting and planning",
      "Posing direction throughout the session",
      "Styling and outfit consultation",
      "Professional color-graded edits",
      "Private online gallery for sharing",
      "High-resolution digital files",
    ],
    process: [
      { step: "Consultation", description: "We plan locations, outfits, and timing based on your aesthetic." },
      { step: "Location Finalization", description: "Locations are scouted and confirmed based on natural light and accessibility." },
      { step: "Shoot Day", description: "Relaxed session with professional direction for natural and beautiful portraits." },
      { step: "Delivery", description: "Edited photos delivered within 7 days via private gallery." },
    ],
    faqs: [
      { q: "How soon after the wedding can we do this?", a: "Any time — within weeks or even months. Some couples do it on their first anniversary." },
      { q: "What should we wear?", a: "Wedding outfits work beautifully. We also provide an outfit guide for couple coordination." },
      { q: "Do you suggest locations?", a: "Yes. We suggest based on your style — Nandi Hills, heritage properties, Lal Bagh, and more." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["pre-wedding-photoshoot", "engagement-photography", "wedding-photography"],
  },

  "anniversary-photoshoot": {
    slug: "anniversary-photoshoot",
    name: "Anniversary Photoshoot",
    tagline: "Every Year, a New Story",
    description: "Celebrate your milestone anniversary with beautiful couple portraits — from intimate indoor sessions to outdoor location shoots.",
    longDescription: "Your anniversary is a celebration of a shared journey. Whether it is your first year or your twenty-fifth, an anniversary photoshoot gives you a set of images that capture who you are as a couple right now. Our photographers create an atmosphere that is relaxed and fun, producing portraits that are natural and timeless — a reflection of your bond, not just a posed photograph.",
    icon: PartyPopper,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Silver", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "3 hours", features: ["1 Location", "2 Outfit Changes", "50+ Edited Photos", "1 Photographer", "Online Gallery"] },
      { name: "Gold", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "5 hours", features: ["2 Locations", "4 Outfit Changes", "100+ Edited Photos", "Location Scouting", "25-sheet Album"], popular: true },
      { name: "Platinum", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["cinematic-video"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "8 hours", features: ["3 Locations", "6 Outfit Changes", "200+ Edited Photos", "Short Film", "40-sheet Album"] },
    ],
    includes: [
      "Couple portrait session at chosen location",
      "Posing direction and creative guidance",
      "Outfit consultation",
      "Professionally edited high-resolution photos",
      "Private online gallery",
      "High-resolution digital files",
    ],
    process: [
      { step: "Consultation", description: "We plan the locations, outfits, and overall mood of the session." },
      { step: "Session", description: "Relaxed shoot with natural posing direction." },
      { step: "Editing", description: "Photos are color-graded and retouched." },
      { step: "Delivery", description: "Photos delivered within 7 days via private gallery." },
    ],
    faqs: [
      { q: "What milestone anniversaries do people typically celebrate?", a: "1st, 5th, 10th, 25th (Silver), and 50th (Golden) are popular milestones. We cover all of them." },
      { q: "Can we bring family members?", a: "Absolutely. Family anniversary portraits are welcome." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["engagement-photography", "pre-wedding-photoshoot", "wedding-photography"],
  },

  "baby-shower-photography": {
    slug: "baby-shower-photography",
    name: "Baby Shower Photography",
    tagline: "Celebrating the Joy of What's Coming",
    description: "Professional coverage of the baby shower celebration — games, gifts, family, and the beautiful anticipation before arrival.",
    longDescription: "A baby shower is a celebration of anticipation — family and friends gathering around the mother-to-be to celebrate the new life coming. Our photographers capture the decorations, the games, the gift-opening, the candid laughter, and the emotional moments that make the day memorable. We work in indoor party setups, outdoor garden events, and intimate home settings.",
    icon: Baby,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Event Coverage", "1 Photographer", "100+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Full Event Coverage", "2 Photographers", "200+ Edited Photos", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "2 Photographers", "Maternity Portraits", "300+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Full baby shower event coverage",
      "Detail shots of decorations and cake",
      "Candid guest and family moments",
      "Maternity portrait session within event",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss the event schedule, venue, and any special moments to prioritize." },
      { step: "Setup", description: "We arrive before guests to document the setup and decorations." },
      { step: "Coverage", description: "Full event coverage including games, gifts, and family moments." },
      { step: "Delivery", description: "Edited photos delivered within 5 days." },
    ],
    faqs: [
      { q: "Do you also take maternity portraits at the baby shower?", a: "Yes. We include maternity portraits in the Premium and Luxury packages." },
      { q: "Can you cover outdoor garden baby showers?", a: "Absolutely. We handle both indoor and outdoor setups." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["maternity-photography", "events-photography", "baby-photoshoot"],
  },

  "naming-ceremony-photography": {
    slug: "naming-ceremony-photography",
    name: "Naming Ceremony Photography",
    tagline: "The First Name, Forever Remembered",
    description: "Warm, careful coverage of your baby's naming day — the rituals, the family, and your baby's earliest milestones.",
    longDescription: "A naming ceremony, whether a traditional Namakarana, a modern naming party, or a religious name-giving, is the first big occasion for your newborn. Families gather, rituals are performed, and the child receives their name — a moment full of emotion and cultural significance. Orvex Visuals documents these ceremonies with the same care and attention we bring to weddings: capturing the priest's blessings, the baby's expressions, the family interactions, and the decorative details.",
    icon: Gift,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Ceremony Coverage", "1 Photographer", "100+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Full Event Coverage", "2 Photographers", "200+ Edited Photos", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "2 Photographers", "Baby Portraits", "300+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Ritual and ceremony documentation",
      "Baby and family portrait session",
      "Decoration and detail shots",
      "Candid guest and family moments",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss the ceremony schedule, rituals, and family composition." },
      { step: "Arrival", description: "We arrive early to document the setup and venue decoration." },
      { step: "Coverage", description: "Complete coverage of all rituals, family moments, and baby portraits." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Can you do close-up shots of the baby during the ceremony?", a: "Yes. We use appropriate lenses that allow us to get close without disrupting the rituals." },
      { q: "Do you cover naming ceremonies at home?", a: "Yes. We cover home ceremonies, banquet halls, and outdoor venues." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["baby-photoshoot", "events-photography", "cradle-ceremony-photography"],
  },

  "cradle-ceremony-photography": {
    slug: "cradle-ceremony-photography",
    name: "Cradle Ceremony Photography",
    tagline: "A Sacred First, Beautifully Documented",
    description: "Professional coverage of the cradle ceremony (Tottilu) — all rituals, family blessings, and your baby's precious early moments.",
    longDescription: "The cradle ceremony, known as Tottilu in South Indian tradition, marks an important early milestone for the newborn. Family gathers, elders bless the child, the baby is placed in the cradle for the first time with traditional rituals. These are irreplaceable moments. Orvex Visuals covers the complete ceremony with documentary sensitivity and an eye for the candid family moments that make the event genuinely memorable.",
    icon: Baby,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Ceremony Coverage", "1 Photographer", "100+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Full Event Coverage", "2 Photographers", "200+ Edited Photos", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "Baby Portraits", "Family Portraits", "300+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Full cradle ceremony ritual documentation",
      "Baby and family portrait session",
      "Elder blessings and family interaction shots",
      "Decoration and detail photography",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We learn about the ceremony schedule and cultural elements to cover." },
      { step: "Setup Coverage", description: "We arrive early for decoration and preparation shots." },
      { step: "Ceremony Coverage", description: "Complete documentation of all rituals and family moments." },
      { step: "Delivery", description: "Edited photos delivered within 5 days." },
    ],
    faqs: [
      { q: "What is Tottilu ceremony?", a: "Tottilu is a South Indian tradition where the newborn is placed in a decorated cradle for the first time with family blessings and rituals." },
      { q: "Do you cover naming and cradle ceremonies together?", a: "Yes. We can cover both functions in a single booking." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["naming-ceremony-photography", "baby-photoshoot", "events-photography"],
  },

  "upanayana-photography": {
    slug: "upanayana-photography",
    name: "Upanayana / Thread Ceremony Photography",
    tagline: "A Sacred Milestone, Respectfully Captured",
    description: "Respectful, professional photography of the Upanayana (Janeu) thread ceremony — all rituals, family moments, and blessings documented.",
    longDescription: "The Upanayana, or sacred thread ceremony, is a significant coming-of-age ritual in Brahmin and other Hindu communities. It marks the beginning of the student phase of life and involves elaborate rituals, chanting, family blessings, and the tying of the sacred thread. Orvex Visuals approaches these ceremonies with full respect for their sacred nature — working discreetly, covering all rituals, and documenting the family emotions that surround this milestone.",
    icon: Sparkles,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Ceremony Coverage", "1 Photographer", "150+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Full Day Coverage", "2 Photographers", "300+ Edited Photos", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "2+ Photographers", "Ritual Close-ups", "500+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Complete ritual documentation from start to finish",
      "Close-up shots of thread tying and key rituals",
      "Family blessings and portrait moments",
      "Guest and extended family coverage",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss the ceremony schedule, rituals sequence, and key moments to prioritize." },
      { step: "Preparation", description: "We arrive early to document venue decoration and pre-ceremony preparations." },
      { step: "Ceremony Coverage", description: "Discreet, complete coverage of all rituals and family moments." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Do you understand Upanayana rituals?", a: "Yes. We've covered many thread ceremonies and understand the ritual sequence and important moments." },
      { q: "Can you work discreetly during the rituals?", a: "Absolutely. We work quietly without disrupting the ceremony." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["events-photography", "housewarming-photography", "naming-ceremony-photography"],
  },

  "shastipurthi-photography": {
    slug: "shastipurthi-photography",
    name: "Shastipurthi Photography",
    tagline: "Sixty Years of Life, Grand as It Deserves",
    description: "Milestone 60th birthday celebration photography — the rituals, the tributes, the family gathering, all documented with grandeur.",
    longDescription: "Shastipurthi marks the 60th birthday — a milestone of enormous significance in Hindu culture, celebrated with elaborate rituals, family gatherings, and heartfelt tributes. It combines elements of a religious ceremony, a family reunion, and a celebration. Our photographers understand the emotional weight of the occasion — the gratitude, the blessings of elders, the joy of gathered family — and document it with care and completeness.",
    icon: Crown,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Ceremony Coverage", "1 Photographer", "150+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Full Day Coverage", "2 Photographers", "300+ Edited Photos", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "2+ Photographers", "Ritual + Celebration", "500+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Religious ceremony and ritual documentation",
      "Family portrait and group photos",
      "Guest and celebration candid coverage",
      "Tribute and speech moments",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss the ceremony program, venue, and key ritual moments." },
      { step: "Arrival", description: "Early arrival for setup, decoration, and pre-ceremony coverage." },
      { step: "Coverage", description: "Complete ritual and celebration coverage throughout the day." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Is Shastipurthi a full-day event?", a: "Most Shastipurthi celebrations run for a full day with morning rituals and evening celebrations. Our full-day packages cover both." },
      { q: "Can you capture the tributes and speeches?", a: "Yes. We position ourselves specifically to cover tributes and emotional family moments." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["events-photography", "birthday-photography", "upanayana-photography"],
  },

  "puberty-ceremony-photography": {
    slug: "puberty-ceremony-photography",
    name: "Puberty Function Photography",
    tagline: "A Milestone, Honoured with Care",
    description: "Respectful, professional coverage of coming-of-age ceremonies and celebrations — every ritual and family moment documented carefully.",
    longDescription: "Coming-of-age ceremonies are deeply personal family events that vary significantly across communities. Our photographers approach them with full respect for privacy, cultural context, and the wishes of the family. We work at the direction of the family regarding what to photograph, maintain discretion throughout, and deliver images that honor the occasion.",
    icon: Sparkles,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Ceremony Coverage", "1 Photographer", "100+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Full Day Coverage", "2 Photographers", "200+ Edited Photos", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Coverage", "Family Portraits", "Ritual Documentation", "300+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Ceremony and ritual documentation",
      "Family portrait sessions",
      "Guest and gathering coverage",
      "Discreet, respectful photography",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss the ceremony plan, family preferences, and coverage boundaries." },
      { step: "Coverage", description: "Professional, discreet coverage of all ceremony and family moments." },
      { step: "Editing", description: "Photos color-graded and prepared." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "How do you handle sensitive family ceremonies?", a: "We work entirely at the direction of the family. Privacy and respect are our top priorities." },
      { q: "Do you offer female photographers?", a: "Yes. Female photographers are available on request — please mention this when booking." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["events-photography", "naming-ceremony-photography", "upanayana-photography"],
  },

  "holy-communion-photography": {
    slug: "holy-communion-photography",
    name: "Holy Communion & Baptism Photography",
    tagline: "A Sacred Moment, Beautifully Preserved",
    description: "Professional photography of First Holy Communion, Baptism, and Confirmation ceremonies — spiritual and family moments captured reverently.",
    longDescription: "First Holy Communion, Baptism, and Confirmation are sacred milestones in Christian faith. These ceremonies are deeply meaningful to families and deserve careful, respectful documentation. Our photographers understand church etiquette, work within the positioning guidelines of the officiating priest, and deliver images that reflect both the spiritual significance and the family joy of the day.",
    icon: Church,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Ceremony Coverage", "1 Photographer", "100+ Edited Photos", "Online Gallery"] },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "Full Day (10 hrs)", features: ["Ceremony + Reception", "2 Photographers", "200+ Edited Photos", "25-sheet Album"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "Full Day (10 hrs)", features: ["Full Day Coverage", "2+ Photographers", "Portrait Session", "300+ Edited Photos", "40-sheet Album"] },
    ],
    includes: [
      "Church ceremony coverage",
      "Family portrait session",
      "Reception and celebration coverage",
      "Respectful coordination with officiating priest",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss the ceremony location, schedule, and any church photography guidelines." },
      { step: "Coordination", description: "We liaise with the church to understand positioning rules." },
      { step: "Coverage", description: "Ceremony and celebration coverage with full respect for the setting." },
      { step: "Delivery", description: "Edited photos delivered within 5 days via private gallery." },
    ],
    faqs: [
      { q: "Are you experienced with church photography?", a: "Yes. We've covered many Catholic and Protestant ceremonies across Bangalore." },
      { q: "Do you cover the reception after the ceremony?", a: "Yes. Premium and Luxury packages include reception coverage." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["christian-wedding-photography", "events-photography", "birthday-photography"],
  },

  "newborn-photography": {
    slug: "newborn-photography",
    name: "Newborn Photography",
    tagline: "Ten Tiny Fingers, Forever Remembered",
    description: "Delicate, artistic newborn portraits within the first 14 days — safe, warm, and beautifully lit in your home or our studio.",
    longDescription: "The newborn window — ideally 5 to 14 days old — is when babies sleep deepest and curl into the most beautiful poses. This short window closes fast. Our newborn photographers are trained in safe posing techniques, use soft natural-style lighting, and create a calm, warm environment for the session. The result is a series of timeless, artistic portraits that families treasure for generations.",
    icon: Baby,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Basic", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "1-2 hours", features: ["2 Theme Setups", "20+ Edited Photos", "Home Visit", "Baby-Safe Props", "Digital Delivery"] },
      { name: "Standard", price: SERVICE_RATES["candid-photo"].ratePerDay, duration: "2-3 hours", features: ["4 Theme Setups", "50+ Edited Photos", "Home or Studio", "Premium Props", "Family Portraits", "Online Gallery"], popular: true },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "3+ hours", features: ["Full Session", "100+ Edited Photos", "Studio", "Family + Sibling Portraits", "25-sheet Album", "Same-Week Delivery"] },
    ],
    includes: [
      "Certified safe newborn posing techniques",
      "Baby-safe props and wraps",
      "Soft natural-light setup",
      "Family and parent portraits",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We schedule within the 5-14 day window and plan the session around the baby's schedule." },
      { step: "Setup", description: "A warm, safe environment is prepared with themed props and backdrops." },
      { step: "Session", description: "Gentle, patient session with full breaks for feeding and settling." },
      { step: "Delivery", description: "Edited photos delivered within 5-7 days." },
    ],
    faqs: [
      { q: "What is the ideal age for newborn photography?", a: "5-14 days is ideal. Babies sleep deeper and pose more naturally in this window." },
      { q: "Is newborn posing safe?", a: "Yes. Our photographers are trained in safe posing. Baby comfort and safety come first." },
      { q: "Do you shoot at home?", a: "Yes. Home sessions are our most popular option for newborns." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["baby-photoshoot", "maternity-photography", "indoor-maternity-photoshoot"],
  },

  "indoor-maternity-photoshoot": {
    slug: "indoor-maternity-photoshoot",
    name: "Indoor Maternity Photoshoot",
    tagline: "Strength, Beauty, and New Life",
    description: "Studio maternity portraits with flowing fabrics, dramatic lighting, and artistic silhouette shots — an intimate, elegant indoor session.",
    longDescription: "An indoor maternity photoshoot offers complete control of lighting, backdrops, and atmosphere — enabling a level of artistry that outdoor sessions can't always achieve. Our studio sessions use flowing fabrics, cinematic lighting, and silhouette techniques to produce maternity portraits that are both elegant and empowering. The session is designed to be comfortable, warm, and completely at your pace.",
    icon: Heart,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Silver", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "3 hours", features: ["Studio Session", "2 Outfit Changes", "50+ Edited Photos", "Online Gallery"] },
      { name: "Gold", price: SERVICE_RATES["candid-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price, duration: "5 hours", features: ["Studio Session", "4 Outfit Changes", "100+ Edited Photos", "Silhouette Shots", "Partner Included", "25-sheet Album"], popular: true },
      { name: "Platinum", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["cinematic-video"].ratePerDay + GLOBAL_ADDONS["album-40"].price, duration: "8 hours", features: ["Full Studio Session", "6 Outfit Changes", "200+ Edited Photos", "Short Maternity Film", "Family Portraits", "40-sheet Album"] },
    ],
    includes: [
      "Fully controlled studio lighting setup",
      "Flowing fabric and prop styling",
      "Silhouette and artistic compositions",
      "Partner and family portrait option",
      "Professionally edited photos",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We plan outfits, themes, and timing around your comfort and stage of pregnancy." },
      { step: "Setup", description: "Studio is styled with fabrics, lighting, and backdrop per your planned themes." },
      { step: "Session", description: "Relaxed, comfortable session at your own pace with full breaks." },
      { step: "Delivery", description: "Edited photos delivered within 7 days." },
    ],
    faqs: [
      { q: "When is the best time to do a maternity shoot?", a: "28-34 weeks is ideal — the bump is beautifully prominent and the mother is still comfortable." },
      { q: "What should I wear?", a: "We provide fabrics and props. You can also bring personal outfits. We'll guide you." },
      { q: "Can my partner join?", a: "Absolutely. Partner portraits are included in Gold and Platinum packages." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["maternity-photography", "newborn-photography", "baby-photoshoot"],
  },

  "cinematic-videography": {
    slug: "cinematic-videography",
    name: "Cinematic Videography",
    tagline: "Your Story, Film-Grade Beautiful",
    description: "Professional cinema-quality videography for weddings, birthdays, and events — color-graded highlight films with original audio and music.",
    longDescription: "Cinematic videography transforms your event into a proper film. Our cinematographers use cinema-grade cameras and lenses, professional color grading, and carefully selected music to produce films that feel like the opening scene of something important. From 3-minute wedding highlight reels to 15-minute event documentaries, every frame is composed and edited with intention.",
    icon: Video,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["cinematic-video"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Highlight Film (3 min)", "1 Videographer", "Color Graded", "Online Delivery"] },
      { name: "Premium", price: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay, duration: "Full Day (10 hrs)", features: ["Highlight Film (5-8 min)", "2 Videographers", "Full Edit + Highlight", "Audio Sync", "Color Graded"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price, duration: "Full Day (10 hrs)", features: ["Highlight Film (10+ min)", "2+ Videographers", "Drone Footage", "Same-Day Edit", "DCI-grade Color"] },
    ],
    includes: [
      "Cinema-grade camera and lens setup",
      "Professional color grading (LUT-based)",
      "Audio recording and sync",
      "Highlight film edit",
      "Online delivery via private link",
      "Backup equipment on-site",
    ],
    process: [
      { step: "Consultation", description: "We discuss your vision, style references, and event schedule." },
      { step: "Planning", description: "Shot list, coverage plan, and music brief are finalized." },
      { step: "Filming", description: "Professional cinematography throughout the event." },
      { step: "Delivery", description: "Highlight film delivered within 15 days." },
    ],
    faqs: [
      { q: "What does cinematic mean vs. traditional video?", a: "Cinematic video is edited with a narrative structure, color grading, and music. Traditional video is a complete uncut documentation of the event." },
      { q: "What length will the highlight film be?", a: "Typically 3-10 minutes depending on the package." },
      { q: "Can you include a same-day edit?", a: "Yes. Same-day edits are available in the Luxury package and as an add-on." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["wedding-videography", "candid-videography", "drone-photography"],
  },

  "candid-videography": {
    slug: "candid-videography",
    name: "Candid Videography",
    tagline: "Unscripted, Unforgettable",
    description: "Natural, documentary-style video coverage that captures real moments, genuine conversations, and the true atmosphere of your event.",
    longDescription: "Candid videography is about capturing life as it happens — not directing, not staging, just observing and filming. Our candid videographers are skilled at being present without being intrusive, using compact cinema equipment and handheld techniques to move freely through your event. The resulting film is a genuine portrait of your day: the behind-the-scenes laughter, the unguarded emotional moments, the real atmosphere.",
    icon: Film,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Essential", price: SERVICE_RATES["cinematic-video"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Candid Documentary Film", "1 Videographer", "Color Graded", "Online Delivery"] },
      { name: "Premium", price: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay, duration: "Full Day (10 hrs)", features: ["Candid + Highlight Film", "2 Videographers", "Natural Sound Edit", "Color Graded"], popular: true },
      { name: "Luxury", price: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay + EVENT_ADDONS.drone.price, duration: "Full Day (10 hrs)", features: ["Full Candid Documentary", "2+ Videographers", "Drone Footage", "Natural + Music Edit"] },
    ],
    includes: [
      "Documentary-style unscripted coverage",
      "Handheld and natural-movement cinematography",
      "Natural sound capture and sync",
      "Color grading and edit",
      "Online delivery via private link",
      "Backup equipment on-site",
    ],
    process: [
      { step: "Consultation", description: "We discuss your event, key moments, and coverage expectations." },
      { step: "Planning", description: "Coverage logistics and equipment plan finalized." },
      { step: "Filming", description: "Unscripted documentary coverage throughout your event." },
      { step: "Delivery", description: "Edited film delivered within 15 days." },
    ],
    faqs: [
      { q: "How is candid videography different from cinematic?", a: "Candid video focuses on natural documentary coverage with minimal direction. Cinematic video involves more narrative structure and production." },
      { q: "Will the video have music?", a: "We can deliver with or without music, depending on your preference." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["cinematic-videography", "wedding-videography", "drone-photography"],
  },

  "drone-photography": {
    slug: "drone-photography",
    name: "Drone Photography & Video",
    tagline: "The Bigger Picture, Beautifully Shot",
    description: "Professional aerial photography and videography for weddings, events, venues, and corporate shoots using licensed drone operators.",
    longDescription: "Aerial coverage transforms your event memories — a sweeping shot of the venue, the crowd from above, the couple walking into frame from fifty feet up. Orvex Visuals works with licensed, insured drone operators using professional cinema-grade aerial equipment. All drone sessions are conducted in compliance with DGCA regulations and venue permissions. Drone footage integrates seamlessly with our photography and videography packages.",
    icon: Plane,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Essential", price: EVENT_ADDONS.drone.price, duration: "Half Day (5 hrs)", features: ["Aerial Photos", "Aerial Video (Raw)", "Licensed Operator", "DGCA Compliant"] },
      { name: "Premium", price: EVENT_ADDONS.drone.price + SERVICE_RATES["cinematic-video"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Aerial Photos + Edited Video", "Highlight Reel Integration", "Color Graded", "Licensed Operator"], popular: true },
      { name: "Luxury", price: EVENT_ADDONS.drone.price + SERVICE_RATES["cinematic-video"].ratePerDay + EVENT_ADDONS["same-day-edit"].price, duration: "Full Day (10 hrs)", features: ["Full Aerial Coverage", "Cinematic Integration", "Same-Day Teaser", "Color Graded", "All-day Drone Access"] },
    ],
    includes: [
      "Licensed DGCA-compliant drone operator",
      "Cinema-grade aerial footage",
      "Aerial photography stills",
      "Venue permission coordination support",
      "Integration with main photo/video edit",
      "Online delivery",
    ],
    process: [
      { step: "Consultation", description: "We discuss venue, event type, and aerial coverage requirements." },
      { step: "Permission Check", description: "We help coordinate venue and airspace permissions." },
      { step: "Aerial Coverage", description: "Licensed drone operator captures footage during the event." },
      { step: "Delivery", description: "Edited aerial footage delivered with or integrated into main edit." },
    ],
    faqs: [
      { q: "Is drone flying allowed at indoor venues?", a: "Indoor drone flights are subject to venue and safety assessment. We advise on this during consultation." },
      { q: "Are your drone operators licensed?", a: "Yes. All our drone operators hold valid DGCA Remote Pilot Certificates." },
      { q: "Can drone footage be combined with my photography package?", a: "Yes. Drone is available as an add-on to any photography or videography package." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["wedding-videography", "cinematic-videography", "corporate-photography"],
  },

  // ── Ancillary Standalone Service Pages ───────────────────────────────
  "family-photoshoot": {
    slug: "family-photoshoot",
    name: "Family Photoshoot",
    tagline: "Your Family, Beautifully Together",
    description: "Professional family portraits in studio or outdoor settings — all ages, all family sizes, warmly photographed.",
    longDescription: "A family photoshoot is the simplest and most lasting gift you can give your family. Orvex Visuals creates relaxed, natural family portraits that capture your family as it actually is — not stiffly posed, but genuinely together. We work with families of all sizes across a variety of settings: lush outdoor gardens, heritage parks, cozy home environments, and our controlled studio setup. We guide everyone on what to wear, when to arrive, and how to be comfortable in front of the camera so the resulting portraits feel timeless.",
    icon: Users,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.portrait, duration: "1-2 hours", features: ["1 Location", "1 Outfit", "30+ Edited Photos", "Online Gallery", "Digital Delivery"] },
      { name: "Standard", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "2-3 hours", features: ["1-2 Locations", "2 Outfits", "60+ Edited Photos", "Online Gallery", "Posing Guidance"], popular: true },
      { name: "Premium", price: SERVICE_RATES["candid-photo"].ratePerDay, duration: "4-5 hours", features: ["2 Locations", "3 Outfits", "100+ Edited Photos", "Online Gallery", "Extended Shoot", "Canvas Print Included"] },
    ],
    includes: [
      "Outfit and color coordination guidance",
      "Natural posing direction for all family members",
      "Location scouting (outdoor) or studio setup",
      "Professionally edited high-resolution photos",
      "Private online gallery for sharing and downloading",
      "Same-day sneak peek of select images",
    ],
    process: [
      { step: "Consultation", description: "We discuss location preference, family size, outfits, and timing." },
      { step: "Preparation", description: "We share a styling guide and confirm the session plan." },
      { step: "Session", description: "Relaxed, fun session with gentle guidance for natural-looking portraits." },
      { step: "Delivery", description: "Edited photos delivered via private gallery within 5-7 days." },
    ],
    faqs: [
      { q: "What should we wear?", a: "We provide a color coordination guide. Generally, coordinating tones (not identical), comfortable clothing, and avoiding overly busy patterns work best." },
      { q: "Can we include grandparents or extended family?", a: "Absolutely. We handle large family groups regularly." },
      { q: "Outdoor or studio?", a: "Both are available. Outdoor sessions depend on weather; we offer a free reschedule for rain." },
      { q: "How many photos will we receive?", a: "Your session includes 30 to 100+ professionally edited images, depending on session length and scope." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["baby-photoshoot", "maternity-photography", "portrait-photography"],
  },

  "video-editing-services": {
    slug: "video-editing-services",
    name: "Video Editing Services",
    tagline: "Your Footage, Professionally Finished",
    description: "Expert post-production for wedding, event, and personal footage — color grading, highlight reels, and cinematic cuts from your raw material.",
    longDescription: "You have the footage — we make it a film. Orvex Visuals provides professional video editing for wedding films, event recordings, and personal video projects. Whether you've already shot with your own equipment or with another videographer, our editing team applies color grading, narrative cutting, audio balancing, and music sync to produce a finished film you'll actually watch. We work with all common formats and camera systems.",
    icon: Scissors,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.videoEditing, duration: "Standard", features: ["Up to 2 Hours Raw Footage", "Highlight Reel (3-5 min)", "Color Grading", "Music Sync", "Online Delivery"] },
      { name: "Premium", price: MISC_SERVICE_RATES.videoEditing * 2, duration: "Premium", features: ["Up to 5 Hours Raw Footage", "Highlight Reel (5-10 min)", "Full Ceremony Edit", "Color Grading", "Audio Balancing", "2 Revisions"], popular: true },
      { name: "Full Feature", price: MISC_SERVICE_RATES.videoEditing * 4, duration: "Luxury", features: ["Unlimited Raw Footage", "Complete Event Film", "Multi-Camera Edit", "DCI Color Grade", "Voiceover/Titles", "3 Revisions"] },
    ],
    includes: [
      "Professional color grading and LUT application",
      "Audio cleanup, balancing, and music sync",
      "Title cards and transition design",
      "Export in multiple resolution formats",
      "Secure cloud file delivery",
      "Revision rounds included — scope discussed at briefing",
    ],
    process: [
      { step: "Brief", description: "You share raw footage and your vision — style references, music preferences, and required outputs." },
      { step: "Edit Draft", description: "Our editors produce the first cut based on your brief." },
      { step: "Review", description: "You review and provide feedback. Revisions are applied as agreed in the project brief." },
      { step: "Final Delivery", description: "Finished film delivered in your required format via secure cloud link." },
    ],
    faqs: [
      { q: "What formats do you accept?", a: "We work with MP4, MOV, MXF, and most common camera formats (Sony, Canon, DJI, GoPro, etc.)." },
      { q: "Can you edit footage shot by a different videographer?", a: "Yes. We edit any footage regardless of who shot it." },
      { q: "How long does editing take?", a: "Typically 7-15 days depending on footage volume and scope of work." },
      { q: "Do you provide music?", a: "Yes. We have a licensed music library. You can also provide your preferred track." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["cinematic-videography", "wedding-videography", "corporate-video-production"],
  },

  "corporate-video-production": {
    slug: "corporate-video-production",
    name: "Corporate Video Production",
    tagline: "Your Brand, Professionally on Film",
    description: "Company profiles, product demos, testimonial videos, training content, and event recap films — produced to a broadcast standard.",
    longDescription: "Corporate video production at Orvex Visuals covers the full spectrum of business video needs: company profile films that communicate your brand story, product demonstration videos for sales and marketing, customer testimonial clips for trust-building, internal training content, and same-day event recap films. We handle scripting support, shooting, and post-production as a complete service or as individual components depending on your need.",
    icon: Film,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Basic", price: SERVICE_RATES["cinematic-video"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["Single-Camera Shoot", "Up to 3 min Edit", "Color Graded", "Online Delivery"] },
      { name: "Standard", price: SERVICE_RATES["cinematic-video"].ratePerDay, duration: "Full Day (10 hrs)", features: ["Multi-Camera Option", "Up to 8 min Edit", "Voiceover Track", "Color Graded", "2 Revisions"], popular: true },
      { name: "Premium", price: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay, duration: "Full Day (10 hrs)", features: ["Full Production Crew", "Up to 15 min Edit", "Script Support", "Motion Graphics", "NDA Available", "3 Revisions"] },
    ],
    includes: [
      "Pre-production planning and scripting support",
      "Professional cinema-grade camera setup",
      "Lighting and audio for indoor/outdoor shoots",
      "Post-production editing and color grading",
      "Delivery in formats suitable for web, social, and broadcast",
      "NDA available on request",
    ],
    process: [
      { step: "Brief", description: "We understand your business, audience, and the video's purpose." },
      { step: "Pre-production", description: "Script outline, shot list, location plan, and team confirmed." },
      { step: "Shoot Day", description: "Professional crew executes the production plan." },
      { step: "Post-production", description: "Editing, grading, and delivery within the agreed timeline." },
    ],
    faqs: [
      { q: "Do you handle scripting?", a: "Yes. Scripting support is available — share your brief and we will include it in the scope discussion." },
      { q: "Can you produce a company profile film in one day?", a: "For most company profiles, yes. Complex multi-location productions may require additional days." },
      { q: "Do you sign NDAs?", a: "Yes. We sign standard NDAs for corporate productions on request." },
      { q: "Do you cover events outside Bangalore?", a: "Yes. Travel charges apply for outstation productions." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["cinematic-videography", "corporate-photography", "drone-photography"],
  },

  "portrait-photography": {
    slug: "portrait-photography",
    name: "Portrait Photography",
    tagline: "Your Best Professional Image",
    description: "Professional headshots, LinkedIn profiles, personal branding portraits, and executive photography for individuals and teams.",
    longDescription: "Your professional image matters. Whether you need a LinkedIn headshot, a personal branding portrait series, an author photo, or an executive team shoot, Orvex Visuals produces portrait images that are sharp, confident, and distinctly you. We work in our studio or on location, using professional lighting and thoughtful direction to draw out the best version of how you present yourself professionally.",
    icon: Image,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.portrait, duration: "1-2 hours", features: ["Studio Session", "1 Outfit", "10+ Edited Photos", "Online Gallery", "LinkedIn-ready Export"] },
      { name: "Standard", price: MISC_SERVICE_RATES.portrait * 2, duration: "2-3 hours", features: ["Studio or On-location", "2 Outfits", "25+ Edited Photos", "Background Options", "Branding Pack"], popular: true },
      { name: "Team", price: MISC_SERVICE_RATES.portrait * 4, duration: "Half Day (5 hrs)", features: ["Up to 10 People", "Consistent Background", "10+ Edited Photos Each", "Team Banner Shot", "Quick Delivery"] },
    ],
    includes: [
      "Professional studio lighting setup",
      "Posing and expression direction",
      "Background and style options",
      "Professionally retouched images",
      "Web and print resolution exports",
      "Online gallery for selection and download",
    ],
    process: [
      { step: "Consultation", description: "We discuss your usage, industry, and preferred style for the portraits." },
      { step: "Setup", description: "Studio lighting and background are configured for your session." },
      { step: "Session", description: "Relaxed shoot with direction to produce confident, natural portraits." },
      { step: "Delivery", description: "Retouched photos delivered within 3-5 days." },
    ],
    faqs: [
      { q: "What should I wear?", a: "Solid, professional colours work best. Avoid busy patterns. We share a prep guide before the session." },
      { q: "Can you shoot at my office?", a: "Yes. On-location shoots at your office or preferred venue are available — contact us to discuss your setup and requirements." },
      { q: "How many final photos will I get?", a: "10 to 25+ per individual, depending on session scope — details confirmed at briefing." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["portfolio-photography", "corporate-photography", "fashion-photography"],
  },

  "portfolio-photography": {
    slug: "portfolio-photography",
    name: "Portfolio Shoot",
    tagline: "Show the World What You Do",
    description: "Professional portfolio photography for models, actors, artists, dancers, and creative professionals — purposefully shot to represent your craft.",
    longDescription: "A strong portfolio is your most important professional tool. Orvex Visuals produces portfolio shoots that are tailored to your specific creative field: models need versatile looks across styles; actors need expressive headshots and character range; artists need their work documented with care; dancers need motion and form captured precisely. We work closely with you on concept, outfit, and location to deliver a portfolio that actually represents what you do.",
    icon: Image,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Starter", price: MISC_SERVICE_RATES.portfolio, duration: "2-3 hours", features: ["1 Location / Setting", "2 Looks", "30+ Edited Photos", "Online Gallery", "Digital Delivery"] },
      { name: "Professional", price: MISC_SERVICE_RATES.portfolio * 2, duration: "Half Day (5 hrs)", features: ["2 Locations", "4 Looks", "60+ Edited Photos", "Online Gallery", "Concept Planning"], popular: true },
      { name: "Complete", price: MISC_SERVICE_RATES.portfolio * 3, duration: "Full Day (10 hrs)", features: ["Multiple Locations", "6 Looks", "100+ Edited Photos", "Comp Card Design", "Concept + Styling Support"] },
    ],
    includes: [
      "Concept and brief planning session",
      "Location scouting for outdoor shoots",
      "Professional lighting (studio or portable)",
      "Posing and expression direction",
      "Professionally retouched portfolio images",
      "High-resolution digital delivery",
    ],
    process: [
      { step: "Concept Brief", description: "We plan the looks, locations, and story you want your portfolio to tell." },
      { step: "Preparation", description: "Location confirmed, lighting plan set, wardrobe guide shared." },
      { step: "Shoot Day", description: "Creative, purpose-driven session to produce a versatile portfolio." },
      { step: "Delivery", description: "Edited portfolio images delivered within 5-7 days." },
    ],
    faqs: [
      { q: "I'm new to modelling. Can you help with concepts?", a: "Absolutely. We guide first-time models through concept planning, posing, and what agencies look for in a portfolio." },
      { q: "Do you shoot actors' headshots?", a: "Yes. We produce both commercial and theatrical headshots with expression variety." },
      { q: "Can you include an outdoor and a studio section?", a: "Yes. Both outdoor and studio setups can be included — contact us to plan your shoot." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["portrait-photography", "fashion-photography", "corporate-photography"],
  },

  "fashion-photography": {
    slug: "fashion-photography",
    name: "Fashion Photography",
    tagline: "Clothing Made to Be Seen",
    description: "Editorial fashion shoots, lookbooks, catalog photography, and campaign imagery for designers, brands, and boutiques.",
    longDescription: "Fashion photography at Orvex Visuals serves designers, clothing brands, boutiques, and stylists who need their work seen at its best. We produce editorial-style lookbook imagery, clean e-commerce catalog shots, and full campaign visuals depending on what the collection needs. Our photographers understand styling, lighting for fabric and texture, and how to make garments look as compelling in a photo as they do in person.",
    icon: Shirt,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Catalog", price: SERVICE_RATES["candid-photo"].ratePerHalfDay, duration: "Half Day (5 hrs)", features: ["1 Model", "Up to 20 Looks", "Clean Studio Background", "30+ Edited Photos", "E-commerce Ready"] },
      { name: "Editorial", price: SERVICE_RATES["candid-photo"].ratePerDay, duration: "Full Day (10 hrs)", features: ["1-2 Models", "Multiple Looks", "Studio + Location", "60+ Edited Photos", "Mood Board Planning"], popular: true },
      { name: "Campaign", price: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay, duration: "Full Day (10 hrs)", features: ["Full Production", "Art Direction", "Multiple Models/Looks", "100+ Edited Photos", "Campaign-ready Delivery"] },
    ],
    includes: [
      "Pre-shoot brief and mood board review",
      "Studio lighting optimised for fabric and texture",
      "Multiple backdrop or location setups",
      "Styling coordination support",
      "Professionally retouched images",
      "High-resolution export for web and print",
    ],
    process: [
      { step: "Brief", description: "We review the collection, target audience, and desired visual tone." },
      { step: "Production Plan", description: "Lookbook structure, model list, locations, and shot list are confirmed." },
      { step: "Shoot Day", description: "Professional fashion shoot with full lighting and styling support." },
      { step: "Delivery", description: "Edited images delivered within 5-7 days." },
    ],
    faqs: [
      { q: "Do you provide models?", a: "We can recommend models from our network. Alternatively, you can bring your own." },
      { q: "Can you shoot both studio and outdoor in one session?", a: "Yes. Both studio and outdoor setups can be included in a single session — contact us to plan your shoot." },
      { q: "Do you shoot for Instagram content as well?", a: "Yes. We produce social-format crops alongside standard catalog deliverables." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["portfolio-photography", "portrait-photography", "product-ecommerce-photography"],
  },

  "product-ecommerce-photography": {
    slug: "product-ecommerce-photography",
    name: "Product & E-Commerce Photography",
    tagline: "Products That Sell Themselves",
    description: "Clean, conversion-ready product photography for Amazon, Flipkart, Shopify, and catalogs — white background and lifestyle options available.",
    longDescription: "Product photography directly affects e-commerce conversion rates. Orvex Visuals produces clean white-background shots that meet Amazon and Flipkart listing requirements, lifestyle imagery that shows products in context, and detail/macro shots that highlight craftsmanship and finish. We work with physical products across all categories — jewelry, apparel, electronics, food, skincare, and more. The goal is always the same: make the product look exactly as good as it actually is.",
    icon: Camera,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.productPhoto, duration: "Standard", features: ["Up to 5 Products", "White Background", "3 Angles Each", "15+ Edited Photos", "E-commerce Ready"] },
      { name: "Standard", price: MISC_SERVICE_RATES.productPhoto * 3, duration: "Standard", features: ["Up to 15 Products", "White + Lifestyle Backgrounds", "4 Angles Each", "60+ Edited Photos", "Social Crops Included"], popular: true },
      { name: "Catalog", price: MISC_SERVICE_RATES.productPhoto * 8, duration: "Standard", features: ["Up to 50 Products", "Full Catalog Shoot", "Lifestyle + Detail Shots", "200+ Edited Photos", "Priority Delivery"] },
    ],
    includes: [
      "White-background studio setup",
      "Lifestyle and contextual setup options",
      "Detail and macro shots for craftsmanship",
      "Platform-compliant image specs (Amazon, Flipkart, Shopify)",
      "Professional retouching and background cleanup",
      "High-resolution and web-optimised exports",
    ],
    process: [
      { step: "Product Intake", description: "Products are received, inspected, and catalogued for the shoot plan." },
      { step: "Setup", description: "Each product is styled and lit for its category and usage requirement." },
      { step: "Shoot", description: "All angles, details, and lifestyle shots are captured per the brief." },
      { step: "Delivery", description: "Edited images delivered within 3-5 days in required formats." },
    ],
    faqs: [
      { q: "Do you shoot jewelry?", a: "Yes. Jewelry is one of our most frequent product categories. We have macro lighting setups specifically for it." },
      { q: "Can you remove the background to pure white?", a: "Yes. All white-background deliverables have a clean pure-white background suitable for marketplace listings." },
      { q: "Do you deliver Amazon-ready specs?", a: "Yes. We export at the required resolution and aspect ratios for Amazon, Flipkart, and Shopify." },
      { q: "How do I send my products to you?", a: "You can drop them at our studio or ship them. We'll return them safely after the shoot." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["fashion-photography", "corporate-photography", "corporate-video-production"],
  },

  "digital-photo-studio": {
    slug: "digital-photo-studio",
    name: "Digital Photo Studio",
    tagline: "Walk In. Walk Out Looking Great.",
    description: "Walk-in studio sessions for passport photos, visa photos, ID photos, family portraits, and quick professional headshots — same-day delivery.",
    longDescription: "Orvex Visuals operates a walk-in digital photo studio for everyday photography needs. Passport photos compliant with all government and visa specifications, professional ID photos, quick family portraits, and same-day professional headshots. We print on-site or deliver digital copies within hours. No appointment needed for standard services.",
    icon: Building,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.studioSession, duration: "Standard", features: ["Passport / ID Photos", "Government-spec Compliant", "Printed + Digital", "Same-Day"] },
      { name: "Standard", price: MISC_SERVICE_RATES.studioSession * 3, duration: "Standard", features: ["Headshot Session", "2 Backgrounds", "10+ Edited Photos", "Same-Day Digital Delivery", "Print Option"], popular: true },
      { name: "Family", price: MISC_SERVICE_RATES.studioSession * 6, duration: "Standard", features: ["Family Studio Session", "Multiple Poses", "20+ Edited Photos", "Print + Digital", "Frame Option Available"] },
    ],
    includes: [
      "Professional studio lighting and backgrounds",
      "Passport-specification compliant printing",
      "Digital delivery via WhatsApp or cloud",
      "On-site printing available",
      "Multiple background options for headshots",
      "Same-day turnaround for standard services",
    ],
    process: [
      { step: "Walk In", description: "No appointment needed for passport and ID photos. Headshot sessions can be booked in advance." },
      { step: "Session", description: "Quick, professionally lit session." },
      { step: "Selection", description: "You choose your preferred frames." },
      { step: "Delivery", description: "Print and/or digital copy delivered same-day." },
    ],
    faqs: [
      { q: "Are your passport photos accepted by the passport office?", a: "Yes. We follow exact government specifications for all passport and visa photo types." },
      { q: "Do I need an appointment?", a: "No appointment needed for passport photos and ID shots. We recommend booking for headshot and family sessions." },
      { q: "Do you print on-site?", a: "Yes. We have on-site photo printing capabilities." },
      { q: "What are your hours?", a: "Please contact us on WhatsApp for current studio hours." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["portrait-photography", "family-photoshoot", "corporate-photography"],
  },

  "album-design-printing": {
    slug: "album-design-printing",
    name: "Album Design & Printing",
    tagline: "Your Story, Bound for Generations",
    description: "Premium wedding and event albums — Canvera, Karizma, and flush-mount options, professionally designed and printed.",
    longDescription: "A printed album is the one form of photography you can hand to your grandchildren. Orvex Visuals designs and produces premium wedding albums, event photobooks, and baby milestone albums. We work with Canvera, Karizma, and flush-mount printing systems to produce albums that are designed to last decades. Our designers lay out your photos into a cohesive visual narrative — not just pages of images, but a story.",
    icon: BookOpen,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.albumDesign, duration: "Standard", features: ["20-page Album", "Digital Design Proof", "Standard Cover", "Delivery in 15 Days"] },
      { name: "Premium", price: MISC_SERVICE_RATES.albumDesign * 2, duration: "Premium", features: ["30-page Album", "Flush Mount or Canvera", "Custom Cover", "2 Design Revisions", "Delivery in 10 Days"], popular: true },
      { name: "Luxury", price: MISC_SERVICE_RATES.albumDesign * 4, duration: "Luxury", features: ["40+ Page Album", "Premium Flush Mount", "Leather/Linen Cover", "3 Revisions", "Parent Copy Available", "Delivery in 10 Days"] },
    ],
    includes: [
      "Professional album layout design",
      "Digital design proof before printing",
      "Flush-mount or laminated printing",
      "Premium cover material options",
      "Protective slip case or box",
      "Home delivery across India",
    ],
    process: [
      { step: "Photo Selection", description: "You share your selected photos (or we select from your gallery if shot with us)." },
      { step: "Design", description: "Our designers lay out the album and share a digital proof." },
      { step: "Review", description: "You review and request any changes. Revisions as agreed in the project brief." },
      { step: "Print & Delivery", description: "Final album printed and dispatched within the agreed timeline." },
    ],
    faqs: [
      { q: "Can you design an album from photos shot by another photographer?", a: "Yes. We design and print albums from any photos you provide." },
      { q: "What album brands do you use?", a: "We work with Canvera, Karizma, and flush-mount production systems depending on your preference and budget." },
      { q: "How long does it take?", a: "10-15 days from final photo selection to delivery." },
      { q: "Can I order a parent copy?", a: "Yes. Parent copies at a reduced rate are available — let us know when placing your album order." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["photo-frames", "photo-restoration", "wedding-photography"],
  },

  "photo-frames": {
    slug: "photo-frames",
    name: "Photo Frames & Canvas Prints",
    tagline: "Your Best Moments on Your Walls",
    description: "Custom photo frames, canvas prints, acrylic wall art, and framed collages — high-quality printing and finishing for your home.",
    longDescription: "Your favourite photographs deserve to be displayed properly. Orvex Visuals produces custom canvas prints, acrylic face-mounted prints, traditional framed prints, and collage wall arrangements. We use archival-quality printing on materials that last for decades. Sizes range from small desk frames to large wall statement pieces. We can work from photos you provide or directly from shoots completed with us.",
    icon: Frame,
    heroImage: "/images/portfolio/hero-1.webp",
    gallery: [
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.photoFrame, duration: "Standard", features: ["Single Print", "Up to 12x18 inches", "Canvas or Frame Finish", "Standard Delivery"] },
      { name: "Standard", price: MISC_SERVICE_RATES.photoFrame * 4, duration: "Standard", features: ["Up to 3 Prints", "Up to 24x36 inches", "Canvas / Acrylic / Frame", "Collage Option Available"], popular: true },
      { name: "Wall Set", price: MISC_SERVICE_RATES.photoFrame * 10, duration: "Standard", features: ["Set of 5-10 Prints", "Gallery Wall Layout Design", "Mixed Sizes", "Acrylic or Frame", "Hanging Hardware Included"] },
    ],
    includes: [
      "Archival-quality photo printing",
      "Canvas stretching or frame mounting",
      "Acrylic face-mount option",
      "Size and finish consultation",
      "Hanging hardware (wall sets)",
      "Delivery across India",
    ],
    process: [
      { step: "Order", description: "You share your photos, preferred size, and finish type." },
      { step: "Proof", description: "We share a digital print preview for large or custom orders." },
      { step: "Production", description: "Printed and finished in our production facility." },
      { step: "Delivery", description: "Safely packaged and dispatched. Delivery in 5-7 days." },
    ],
    faqs: [
      { q: "What is the maximum print size available?", a: "We produce prints up to 40x60 inches. Contact us for sizes beyond standard catalog." },
      { q: "What is an acrylic print?", a: "A face-mounted acrylic print has the photo bonded to the back of a clear acrylic sheet for a vivid, gallery-quality look." },
      { q: "Can I order from photos taken at other studios?", a: "Yes. We print from any high-resolution image you provide." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["album-design-printing", "photo-restoration", "personalized-gifts-printing"],
  },

  "photo-restoration": {
    slug: "photo-restoration",
    name: "Photo Restoration Service",
    tagline: "Old Memories, Brought Back to Life",
    description: "Restore old, torn, faded, and water-damaged photographs to their original quality using professional digital restoration techniques.",
    longDescription: "Old family photographs fade, tear, and deteriorate over time. Orvex Visuals offers professional digital photo restoration that recovers damaged images and gives them new life. Whether it is a 50-year-old black and white portrait with torn edges, a water-damaged wedding photo, or a faded group picture, our restoration team works carefully and respectfully to recover as much detail as possible. We also offer colourisation of black and white photographs for families who want to see the past in colour.",
    icon: Image,
    heroImage: "/images/portfolio/hero-2.webp",
    gallery: [
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
    ],
    packages: [
      { name: "Basic", price: MISC_SERVICE_RATES.photoRestoration, duration: "Standard", features: ["Minor Damage", "Scratch and Dust Removal", "Tone Correction", "Digital Delivery"] },
      { name: "Standard", price: MISC_SERVICE_RATES.photoRestoration * 5, duration: "Standard", features: ["Moderate Damage", "Tear and Crease Repair", "Full Tone Restoration", "Digital + Print Option"], popular: true },
      { name: "Full Restoration", price: MISC_SERVICE_RATES.photoRestoration * 15, duration: "Standard", features: ["Severe Damage / Heavy Loss", "Reconstruction", "Colourisation Option", "High-res Digital + Print", "Framing Available"] },
    ],
    includes: [
      "Careful digital scan of original photograph",
      "Scratch, dust, and crease removal",
      "Tear and physical damage reconstruction",
      "Tone, contrast, and colour restoration",
      "Optional black-and-white to colour conversion",
      "High-resolution digital delivery + optional print",
    ],
    process: [
      { step: "Submission", description: "You send your photograph (we accept physical drop-off or scanned digital files)." },
      { step: "Assessment", description: "We assess the damage and confirm the restoration scope and cost." },
      { step: "Restoration", description: "Our technicians carefully restore the image." },
      { step: "Delivery", description: "Restored digital file delivered. Print available on request." },
    ],
    faqs: [
      { q: "Can all photos be fully restored?", a: "We can restore most photos to a significantly improved state. Heavily damaged photos may not recover every detail, but we'll give you an honest assessment before starting." },
      { q: "Do you colourise black and white photos?", a: "Yes. Colourisation is available as a service add-on — let us know when submitting your photo." },
      { q: "Do I need to send the original?", a: "You can send a high-resolution scan if you prefer to keep the original. Physical drop-off is also welcome." },
      { q: "How long does restoration take?", a: "3-10 days depending on the complexity of the damage." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["album-design-printing", "photo-frames", "personalized-gifts-printing"],
  },

  "personalized-gifts-printing": {
    slug: "personalized-gifts-printing",
    name: "Personalized Gifts & Mug Printing",
    tagline: "A Memory They Can Hold",
    description: "Custom photo gifts — coffee mugs, cushion covers, keychains, calendars, and more — with your favourite photographs printed on them.",
    longDescription: "Personalized photo gifts make occasions memorable. Orvex Visuals produces a wide range of photo-printed gifts: ceramic mugs, cushion covers, keychains, desk calendars, phone cases, and more. All products use dye-sublimation or archival-quality printing so the images are vivid, wash-resistant (for mugs and textiles), and durable. Perfect for birthdays, anniversaries, baby milestones, and corporate gifting.",
    icon: Coffee,
    heroImage: "/images/portfolio/hero-3.webp",
    gallery: [
      "/images/portfolio/hero-3.webp",
      "/images/portfolio/hero-1.webp",
      "/images/portfolio/hero-2.webp",
      "/images/portfolio/hero-3.webp",
    ],
    packages: [
      { name: "Single", price: MISC_SERVICE_RATES.personalizedGift, duration: "Standard", features: ["1 Item", "Photo Print", "Standard Quality", "Delivery in 3-5 Days"] },
      { name: "Gift Set", price: MISC_SERVICE_RATES.personalizedGift * 5, duration: "Standard", features: ["Mug + Cushion + Keychain", "Same or Mixed Photos", "Gift Wrapped", "Delivery in 5-7 Days"], popular: true },
      { name: "Bulk / Corporate", price: MISC_SERVICE_RATES.personalizedGift * 15, duration: "Standard", features: ["20+ Items", "Custom Logo/Photo", "Bulk Discount Applied", "Corporate Gifting Pack", "Delivery in 7-10 Days"] },
    ],
    includes: [
      "Dye-sublimation or archival print quality",
      "Photo editing and cropping for product format",
      "Wash-resistant printing on mugs and textiles",
      "Gift wrapping available",
      "Bulk and corporate gifting options",
      "Pan-India delivery",
    ],
    process: [
      { step: "Order", description: "You share your photo and choose your product type." },
      { step: "Design Preview", description: "We share a digital mock-up for your approval before production." },
      { step: "Production", description: "Printed and quality-checked in our facility." },
      { step: "Delivery", description: "Safely packaged and dispatched within 3-10 days." },
    ],
    faqs: [
      { q: "Are photo mugs dishwasher safe?", a: "Our mugs are top-rack dishwasher safe. We recommend hand washing for longest life." },
      { q: "Can I order a single item?", a: "Yes. Single-item orders are welcome — contact us to place your order." },
      { q: "Do you do corporate gifting in bulk?", a: "Yes. We handle bulk corporate gifting orders with custom packaging and logo options." },
      { q: "What photo quality do I need?", a: "Higher resolution photos produce better results. We'll advise if your photo needs quality improvement before production." },
      { q: "Are prices GST-inclusive?", a: "Yes. All displayed prices include GST." },
    ],
    relatedSlugs: ["photo-frames", "album-design-printing", "photo-restoration"],
  },
}

const SERVICE_NAME_HI: Record<string, string> = {
  "wedding-photography": "वेडिंग फोटोग्राफी",
  "candid-wedding-photography": "कैंडिड वेडिंग फोटोग्राफी",
  "christian-wedding-photography": "क्रिश्चियन वेडिंग फोटोग्राफी",
  "muslim-wedding-photography": "मुस्लिम वेडिंग फोटोग्राफी",
  "pre-wedding-photoshoot": "प्री-वेडिंग फोटोशूट",
  "post-wedding-photoshoot": "पोस्ट-वेडिंग फोटोशूट",
  "engagement-photography": "एंगेजमेंट फोटोग्राफी",
  "anniversary-photoshoot": "एनिवर्सरी फोटोशूट",
  "birthday-photography": "बर्थडे फोटोग्राफी",
  "baby-shower-photography": "बेबी शॉवर फोटोग्राफी",
  "haldi-mehendi-photography": "हल्दी और मेहंदी फोटोग्राफी",
  "sangeet-photography": "संगीत फोटोग्राफी",
  "naming-ceremony-photography": "नामकरण समारोह फोटोग्राफी",
  "cradle-ceremony-photography": "झूला समारोह फोटोग्राफी",
  "housewarming-photography": "गृहप्रवेश फोटोग्राफी",
  "upanayana-photography": "उपनयन / थ्रेड सेरेमनी फोटोग्राफी",
  "shastipurthi-photography": "षष्टिपूर्ति फोटोग्राफी",
  "puberty-ceremony-photography": "प्यूबर्टी फंक्शन फोटोग्राफी",
  "holy-communion-photography": "होली कम्यूनियन और बैप्टिज़्म फोटोग्राफी",
  "events-photography": "इवेंट फोटोग्राफी",
  "baby-photoshoot": "बेबी फोटोशूट",
  "newborn-photography": "न्यूबॉर्न फोटोग्राफी",
  "maternity-photography": "मैटरनिटी फोटोग्राफी",
  "indoor-maternity-photoshoot": "इंडोर मैटरनिटी फोटोशूट",
  "family-photoshoot": "फैमिली फोटोशूट",
  "wedding-videography": "वेडिंग वीडियोग्राफी",
  "cinematic-videography": "सिनेमैटिक वीडियोग्राफी",
  "candid-videography": "कैंडिड वीडियोग्राफी",
  "drone-photography": "ड्रोन फोटोग्राफी और वीडियो",
  "video-editing-services": "वीडियो एडिटिंग सेवाएं",
  "corporate-video-production": "कॉर्पोरेट वीडियो प्रोडक्शन",
  "corporate-photography": "कॉर्पोरेट इवेंट फोटोग्राफी",
  "portrait-photography": "पोर्ट्रेट फोटोग्राफी",
  "portfolio-photography": "पोर्टफोलियो शूट",
  "fashion-photography": "फैशन फोटोग्राफी",
  "product-ecommerce-photography": "प्रोडक्ट और ई-कॉमर्स फोटोग्राफी",
  "digital-photo-studio": "डिजिटल फोटो स्टूडियो",
  "album-design-printing": "एल्बम डिजाइन और प्रिंटिंग",
  "photo-frames": "फोटो फ्रेम्स और कैनवस प्रिंट्स",
  "photo-restoration": "फोटो रिस्टोरेशन सर्विस",
  "personalized-gifts-printing": "पर्सनलाइज़्ड गिफ्ट्स और मग प्रिंटिंग",
}

const SERVICE_CARD_DESCRIPTION_HI: Partial<Record<string, string>> = {
  "wedding-photography": "आपके बड़े दिन की कैंडिड और पारंपरिक कवरेज, ताकि हर एहसास खूबसूरती से कैद हो.",
  "pre-wedding-photoshoot": "खूबसूरत लोकेशंस, आउटफिट गाइडेंस और कपल पोर्ट्रेट्स के साथ प्री-वेडिंग शूट.",
  "engagement-photography": "रिंग सेरेमनी और एंगेजमेंट सेलिब्रेशन की खूबसूरत कवरेज.",
  "anniversary-photoshoot": "आपकी साथ की यात्रा को यादगार बनाने वाला कपल फोटोशूट.",
  "birthday-photography": "बर्थडे सेलिब्रेशन की कैंडिड और पारंपरिक कवरेज.",
  "baby-shower-photography": "आने वाले नन्हे मेहमान की खुशी को खूबसूरती से कैद करने वाली कवरेज.",
  "haldi-mehendi-photography": "रंग, रिवाज़ और खुशी से भरे पलों की जीवंत कवरेज.",
  "sangeet-photography": "डांस, मस्ती और जश्न से भरी संगीत नाइट की कवरेज.",
  "naming-ceremony-photography": "आपके बेबी के खास नामकरण दिवस की प्यारी और साफ कवरेज.",
  "corporate-photography": "कॉन्फ्रेंस, लॉन्च और टीम इवेंट्स की प्रोफेशनल कवरेज.",
  "drone-photography": "इवेंट्स और वेन्यूज़ के लिए शानदार एरियल फोटो और वीडियो.",
  "baby-photoshoot": "थीम-आधारित बेबी फोटोशूट, सुरक्षित सेटअप और प्यारे पोर्ट्रेट्स के साथ.",
  "newborn-photography": "न्यूबॉर्न के शुरुआती दिनों की नाजुक और खूबसूरत फोटोग्राफी.",
  "maternity-photography": "प्रेग्नेंसी के इस खास दौर को एलीगेंट पोर्ट्रेट्स में कैद करें.",
  "wedding-videography": "पूरे वेडिंग डे की वीडियो कवरेज, पारंपरिक और सिनेमैटिक दोनों स्टाइल में.",
}

const GENERIC_HI_TAGLINES: Record<Exclude<Category, "all">, string> = {
  wedding: "हर रस्म और हर एहसास खूबसूरती से कैद",
  "pre-wedding": "आपकी कहानी, खूबसूरती से फ्रेम की गई",
  events: "हर जश्न की साफ और संपूर्ण कवरेज",
  "baby-kids": "नन्हे पलों की प्यारी यादें",
  videography: "चलते-फिरते पलों को सिनेमैटिक अंदाज में",
  corporate: "ब्रांड, प्रोफाइल और इवेंट्स की प्रोफेशनल कवरेज",
  products: "डिजाइन, प्रिंट और फिनिश एक ही जगह",
}

const PACKAGE_NAME_HI: Record<string, string> = {
  Essential: "एसेंशियल",
  Premium: "प्रीमियम",
  Luxury: "लक्ज़री",
  Silver: "सिल्वर",
  Gold: "गोल्ड",
  Platinum: "प्लैटिनम",
  Basic: "बेसिक",
  Standard: "स्टैंडर्ड",
}

const DURATION_HI: Record<string, string> = {
  "Half Day (5 hrs)": "आधा दिन (5 घंटे)",
  "Full Day (10 hrs)": "पूरा दिन (10 घंटे)",
  "3 hours": "3 घंटे",
  "5 hours": "5 घंटे",
  "8 hours": "8 घंटे",
  "1-2 hours": "1-2 घंटे",
  "2-3 hours": "2-3 घंटे",
  "3+ hours": "3+ घंटे",
  Standard: "स्टैंडर्ड",
  Premium: "प्रीमियम",
  Luxury: "लक्ज़री",
}

type ManualServiceTranslation = {
  tagline: string
  description: string
  longDescription: string
  packages: Array<{ features: string[] }>
  includes: string[]
  process: { step: string; description: string }[]
  faqs: ServiceFAQ[]
}

const MANUAL_SERVICE_TRANSLATIONS_HI: Record<string, ManualServiceTranslation> = {
  "wedding-photography": {
    tagline: "हर एहसास, हर रस्म, हमेशा के लिए",
    description: "कैंडिड और पारंपरिक स्टाइल के संतुलन के साथ आपकी वेडिंग सेलिब्रेशन की प्रोफेशनल कवरेज.",
    longDescription: "आपकी शादी जिंदगी का एक बार आने वाला दिन है, और उसका हर पल खूबसूरती से कैद होना चाहिए. हमारी वेडिंग फोटोग्राफी टीम कैंडिड स्टोरीटेलिंग और पारंपरिक पोर्ट्रेट्स दोनों में विशेषज्ञ है, ताकि आपको पूरे दिन की एक संपूर्ण विजुअल कहानी मिले. ब्राइडल प्रेप से बिदाई तक, साझा मुस्कानों से लेकर भव्य जश्न तक — हम सब कुछ दस्तावेज़ करते हैं.",
    packages: [
      {
        features: ["1 फोटोग्राफर", "पारंपरिक फोटोग्राफी", "200+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "5 दिनों में फोटो डिलीवरी"],
      },
      {
        features: ["2 फोटोग्राफर", "कैंडिड + पारंपरिक कवरेज", "500+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "प्री-वेडिंग कंसल्टेशन", "उसी दिन टीज़र", "25-शीट फोटो एल्बम"],
      },
      {
        features: ["2+ फोटोग्राफर", "कैंडिड + पारंपरिक + ड्रोन", "1000+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "प्री-वेडिंग फोटोशूट", "उसी दिन टीज़र वीडियो", "40-शीट प्रीमियम एल्बम", "कैनवस प्रिंट (20x30)", "सभी फंक्शन कवर"],
      },
    ],
    includes: [
      "प्रोफेशनल कलर-करेक्टेड और एडिटेड फोटोज़",
      "क्लाउड के जरिए हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
      "इवेंट से पहले कंसल्टेशन और प्लानिंग",
      "ऑन-साइट बैकअप इक्विपमेंट",
      "48 घंटों के भीतर क्विक प्रीव्यू",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम कॉल या मुलाकात में आपकी शादी का शेड्यूल, पसंदीदा स्टाइल और जरूरी शॉट्स समझते हैं." },
      { step: "प्लानिंग", description: "ज़रूरत होने पर हमारी टीम वेन्यू देखती है, टाइमलाइन बनाती है और दूसरे वेंडर्स से तालमेल करती है." },
      { step: "शूट डे", description: "हमारी टीम समय से पहले पहुंचकर सुबह की तैयारियों से लेकर अंतिम विदाई तक हर अहम पल कैद करती है." },
      { step: "डिलीवरी", description: "फोटोज़ को प्रोफेशनली एडिट करके 5 दिनों में प्राइवेट ऑनलाइन गैलरी से शेयर किया जाता है. वीडियो 15 दिनों में दिए जाते हैं." },
    ],
    faqs: [
      { q: "हमें कितनी फोटोज़ मिलेंगी?", a: "पैकेज के अनुसार आपको 200 से 1000+ प्रोफेशनली एडिटेड फोटोज़ मिलेंगी." },
      { q: "क्या आप डेस्टिनेशन वेडिंग भी कवर करते हैं?", a: "हाँ. हम पूरे भारत में वेडिंग कवर करते हैं. आउटस्टेशन बुकिंग पर ट्रैवल और स्टे चार्ज अलग लागू होते हैं." },
      { q: "क्या पैकेज कस्टमाइज़ किए जा सकते हैं?", a: "बिल्कुल. WhatsApp पर संपर्क करें और हम आपकी जरूरत और बजट के अनुसार कस्टम पैकेज बनाएंगे." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ, हमारी सभी कीमतें GST-समेत हैं. कोई छिपा चार्ज नहीं." },
      { q: "क्या आप रॉ / अनएडिटेड फोटोज़ देते हैं?", a: "हम एडिटेड फोटोज़ देते हैं. रॉ फाइल्स ऐड-ऑन के रूप में उपलब्ध हैं." },
      { q: "कैंसिलेशन पॉलिसी क्या है?", a: "7 दिन या उससे पहले कैंसिल करने पर मुफ्त. 3-7 दिन के बीच आंशिक रिफंड. 3 दिन के भीतर रिफंड नहीं." },
    ],
  },
  "pre-wedding-photoshoot": {
    tagline: "आपकी लव स्टोरी, खूबसूरती से फ्रेम की गई",
    description: "बेंगलुरु की खूबसूरत लोकेशंस पर प्रोफेशनल स्टाइल गाइडेंस के साथ रोमांटिक कपल फोटोग्राफी.",
    longDescription: "प्री-वेडिंग फोटोशूट आपकी साथ की यात्रा को बड़े दिन से पहले सेलिब्रेट करने का खूबसूरत तरीका है. हमारी टीम बेंगलुरु के बेस्ट लोकेशंस चुनने में मदद करती है — हरे-भरे गार्डन्स, हेरिटेज स्पॉट्स, अर्बन रूफटॉप्स और आरामदायक कैफे तक. हम आउटफिट, पोज़ और सही टाइमिंग में आपकी मदद करते हैं ताकि आपको मैगज़ीन-स्टाइल कपल पोर्ट्रेट्स मिलें.",
    packages: [
      {
        features: ["1 लोकेशन", "2 आउटफिट चेंज", "50+ एडिटेड फोटोज़", "1 फोटोग्राफर", "ऑनलाइन गैलरी", "7 दिनों में डिलीवरी"],
      },
      {
        features: ["2 लोकेशन", "4 आउटफिट चेंज", "100+ एडिटेड फोटोज़", "1 फोटोग्राफर + असिस्टेंट", "ऑनलाइन गैलरी", "लोकेशन स्काउटिंग", "स्टाइलिंग गाइड"],
      },
      {
        features: ["3 लोकेशन", "6 आउटफिट चेंज", "200+ एडिटेड फोटोज़", "2 फोटोग्राफर", "सिनेमैटिक वीडियो (3 मिनट)", "ड्रोन शॉट्स", "प्रॉप्स और स्टाइलिंग", "उसी दिन स्नीक पीक"],
      },
    ],
    includes: [
      "प्रोफेशनल पोज़िंग गाइडेंस",
      "लोकेशन रिकमेंडेशन और स्काउटिंग",
      "आउटफिट और स्टाइलिंग कंसल्टेशन",
      "प्रोफेशनल एडिटिंग और कलर ग्रेडिंग",
      "हाई-रिज़ॉल्यूशन क्लाउड डिलीवरी",
      "प्राइवेट शेयर करने योग्य गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम आपके रिश्ते, पसंदीदा मूड और विजुअल स्टाइल को समझते हैं ताकि शूट सही तरीके से प्लान हो सके." },
      { step: "प्लानिंग", description: "लोकेशन फाइनलाइजेशन, आउटफिट गाइडेंस, मूड बोर्ड और शेड्यूल की तैयारी की जाती है." },
      { step: "शूट डे", description: "आरामदायक और मजेदार सेशन में हम नैचुरल और खूबसूरत कपल मोमेंट्स कैद करते हैं." },
      { step: "डिलीवरी", description: "प्रोफेशनली एडिटेड फोटोज़ आपकी प्राइवेट ऑनलाइन गैलरी में 7 दिनों के भीतर दे दी जाती हैं." },
    ],
    faqs: [
      { q: "बेंगलुरु में प्री-वेडिंग के लिए अच्छी लोकेशंस कौन-सी हैं?", a: "Cubbon Park, Nandi Hills, Lal Bagh, Palace Grounds, Hesaraghatta Lake और कुछ हेरिटेज प्रॉपर्टीज लोकप्रिय विकल्प हैं. हम आपकी स्टाइल के हिसाब से सुझाव देते हैं." },
      { q: "हमें क्या पहनना चाहिए?", a: "हम स्टाइलिंग गाइड देते हैं. आम तौर पर कोऑर्डिनेटेड रंग, सॉलिड शेड्स और आरामदायक आउटफिट सबसे अच्छे लगते हैं." },
      { q: "क्या हम प्रॉप्स ला सकते हैं?", a: "हाँ, बिल्कुल. हमारे पास भी कुछ लाइट्स और बेसिक स्टाइल प्रॉप्स उपलब्ध हैं." },
      { q: "अगर बारिश हो जाए तो?", a: "हम एक फ्री रीशेड्यूल देते हैं. अगर आप चाहें तो रेन-शूट भी बहुत खूबसूरत लग सकता है." },
      { q: "बुकिंग कितने समय पहले करनी चाहिए?", a: "खासतौर पर वेडिंग सीज़न में 2-4 हफ्ते पहले बुक करना बेहतर रहता है." },
    ],
  },
  "baby-photoshoot": {
    tagline: "नन्हे पल, बड़ी यादें",
    description: "थीम-आधारित बेबी फोटोग्राफी, प्रोफेशनल प्रॉप्स, सेटअप और सुरक्षित माहौल के साथ.",
    longDescription: "बच्चे बहुत जल्दी बड़े होते हैं — हर हफ्ते नए एक्सप्रेशन और नए माइलस्टोन्स आते हैं. हमारी बेबी फोटोग्राफी सेशंस मजेदार, सुरक्षित और आरामदायक रखी जाती हैं. हम सॉफ्ट लाइटिंग, बेबी-सेफ प्रॉप्स और थीम्ड सेटअप्स का इस्तेमाल करते हैं ताकि आपको ऐसी तस्वीरें मिलें जिन्हें आप लंबे समय तक संजो कर रखें.",
    packages: [
      {
        features: ["1 थीम सेटअप", "10+ एडिटेड फोटोज़", "होम विजिट", "बेसिक प्रॉप्स", "डिजिटल डिलीवरी"],
      },
      {
        features: ["2 थीम सेटअप", "25+ एडिटेड फोटोज़", "होम / स्टूडियो", "प्रीमियम प्रॉप्स और कॉस्ट्यूम्स", "ऑनलाइन गैलरी", "फैमिली पोर्ट्रेट्स शामिल"],
      },
      {
        features: ["3+ थीम सेटअप", "50+ एडिटेड फोटोज़", "स्टूडियो सेशन", "सभी प्रॉप्स और कॉस्ट्यूम्स", "फैमिली पोर्ट्रेट्स", "कैनवस प्रिंट (12x18)", "उसी हफ्ते डिलीवरी"],
      },
    ],
    includes: [
      "बेबी-सेफ प्रॉप्स और सेटअप्स",
      "अनुभवी और धैर्यवान फोटोग्राफर",
      "बेबी के शेड्यूल के अनुसार लचीला टाइमिंग",
      "एक से ज्यादा आउटफिट / थीम चेंज",
      "पेरेंट्स / फैमिली फोटोज़ शामिल",
      "हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
    ],
    process: [
      { step: "परामर्श", description: "हम आपके बेबी की उम्र, पसंदीदा थीम और फीड / नैप शेड्यूल के अनुसार टाइमिंग तय करते हैं." },
      { step: "सेटअप", description: "हमारी टीम बेबी-सेफ तरीके से बैकड्रॉप, प्रॉप्स और लाइटिंग तैयार करती है." },
      { step: "सेशन", description: "आरामदायक और ब्रेक्स के साथ धैर्यपूर्ण सेशन किया जाता है. बेबी की कम्फर्ट सबसे पहले रहती है." },
      { step: "डिलीवरी", description: "प्रोफेशनली एडिटेड फोटोज़ 5-7 दिनों के भीतर डिलीवर की जाती हैं." },
    ],
    faqs: [
      { q: "बेबी फोटोशूट के लिए कौन-सी उम्र सबसे अच्छी है?", a: "लोकप्रिय माइलस्टोन्स में न्यूबॉर्न, 3 महीने, 6 महीने, 9 महीने और 1 साल शामिल हैं." },
      { q: "क्या सेटअप बच्चों के लिए सुरक्षित होता है?", a: "हाँ. हम केवल बेबी-सेफ और नॉन-टॉक्सिक प्रॉप्स का ही इस्तेमाल करते हैं." },
      { q: "अगर बेबी फसी हो जाए तो?", a: "यह बिल्कुल सामान्य है. हम ब्रेक्स के साथ बहुत आराम से सेशन करते हैं." },
      { q: "क्या आप कॉस्ट्यूम्स भी देते हैं?", a: "हाँ, हमारे पास बेबी-सेफ कॉस्ट्यूम्स का चयन है. आप चाहें तो अपने कपड़े भी ला सकते हैं." },
      { q: "क्या माता-पिता भी फोटो में शामिल हो सकते हैं?", a: "हाँ, Standard और Premium पैकेज में फैमिली पोर्ट्रेट्स शामिल हैं." },
    ],
  },
  "engagement-photography": {
    tagline: "हर वादा, हर एहसास, हमेशा के लिए फ्रेम",
    description: "अंगूठी समारोह और एंगेजमेंट पार्टी की प्रोफेशनल फोटोग्राफी, जो परिवार और दोस्तों के बीच के असली पलों को कैद करे.",
    longDescription: "आपका एंगेजमेंट आपकी प्रेम कहानी का पहला अध्याय है — परिवार, हँसी और अंगूठी पहनाने के उस खास पल से भरा एक यादगार दिन. Orvex Visuals उसी देखभाल और स्टोरीटेलिंग के साथ आता है जो हम पूरी शादी के लिए लाते हैं: कैंडिड मोमेंट्स और सोची-समझी पोर्ट्रेट्स का संतुलन जो आपके जश्न की असली भावना को सामने लाए. घर पर छोटी रिंग सेरेमनी हो या भव्य एंगेजमेंट पार्टी — हम आपके साथ प्लान करते हैं और एक पूरी विजुअल यादगार डिलीवर करते हैं.",
    packages: [
      { features: ["1 फोटोग्राफर", "कैंडिड कवरेज", "100+ एडिटेड फोटोज़", "रिंग सेरेमनी फोकस", "ऑनलाइन गैलरी", "5 दिनों में डिलीवरी"] },
      { features: ["2 फोटोग्राफर", "कैंडिड + पारंपरिक", "300+ एडिटेड फोटोज़", "फैमिली ग्रुप पोर्ट्रेट्स", "ऑनलाइन गैलरी", "25-शीट फोटो एल्बम"] },
      { features: ["2+ फोटोग्राफर", "कैंडिड + पारंपरिक + ड्रोन", "500+ एडिटेड फोटोज़", "उसी दिन स्नीक पीक", "पूरे वेन्यू की कवरेज", "40-शीट प्रीमियम एल्बम", "प्रायोरिटी डिलीवरी"] },
    ],
    includes: [
      "प्रोफेशनल कलर-करेक्टेड और एडिटेड फोटोज़",
      "क्लाउड के जरिए हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
      "इवेंट से पहले प्लानिंग कंसल्टेशन",
      "ऑन-साइट बैकअप इक्विपमेंट",
      "48 घंटों के भीतर क्विक प्रीव्यू",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम आपका एंगेजमेंट शेड्यूल, वेन्यू, मेहमानों की संख्या और ज़रूरी मोमेंट्स समझते हैं." },
      { step: "प्लानिंग", description: "हमारी टीम वेन्यू का लेआउट देखती है, कवरेज पोजीशन प्लान करती है और आपके शेड्यूल से समन्वय करती है." },
      { step: "इवेंट डे", description: "फोटोग्राफर रस्म शुरू होने से पहले पहुंचते हैं और पूरे इवेंट — रस्म, कैंडिड मोमेंट्स और ग्रुप पोर्ट्रेट्स — को कैद करते हैं." },
      { step: "डिलीवरी", description: "प्रोफेशनली एडिटेड फोटोज़ इवेंट के 5 दिनों के भीतर आपकी प्राइवेट ऑनलाइन गैलरी में दी जाती हैं." },
    ],
    faqs: [
      { q: "एसेंशियल पैकेज में क्या कवरेज मिलती है?", a: "आधे दिन (5 घंटे) का सेशन जिसमें एक फोटोग्राफर रिंग सेरेमनी और कैंडिड मोमेंट्स पर फोकस करता है." },
      { q: "क्या इवेंट से पहले की तैयारी की फोटो भी ली जा सकती है?", a: "हाँ. ब्राइडल / ग्रूम प्रेप फोटोग्राफी बढ़ाई जा सकती है. कंसल्टेशन में सही पैकेज पर बात करें." },
      { q: "कितने समय पहले बुकिंग करनी चाहिए?", a: "2-4 हफ्ते पहले बुक करना सबसे अच्छा है. अक्टूबर-फरवरी में जल्दी बुक करें." },
      { q: "क्या आप आउटडोर या आउटस्टेशन एंगेजमेंट कवर करते हैं?", a: "हाँ. बेंगलुरु और आउटस्टेशन दोनों जगह कवरेज उपलब्ध है. आउटस्टेशन पर ट्रैवल चार्ज लागू होते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं. कोई छिपा शुल्क नहीं." },
    ],
  },
  "birthday-photography": {
    tagline: "हर मोमबत्ती, हर मुस्कान, खूबसूरती से कैद",
    description: "पहले जन्मदिन से लेकर बड़े मील-स्टोन सेलिब्रेशन तक — हर उम्र के बर्थडे की कैंडिड और पारंपरिक कवरेज.",
    longDescription: "जन्मदिन वो लम्हे होते हैं जिन्हें परिवार बार-बार याद करता है — बच्चे के पहले केक स्मैश की मस्ती से लेकर 60वें मील-स्टोन की भव्यता तक. Orvex Visuals प्रोफेशनल इवेंट फोटोग्राफी कवरेज लाता है जो पार्टी की ऊर्जा, हर चेहरे पर खुशी और उन छोटे-छोटे पलों को कैद करता है जो एक जन्मदिन को सच में यादगार बनाते हैं. हम विवेकपूर्ण तरीके से काम करते हैं ताकि मेहमान सहज रहें, और एक पूरी गैलरी डिलीवर करते हैं जो उस दिन की पूरी कहानी बताए.",
    packages: [
      { features: ["1 फोटोग्राफर", "कैंडिड कवरेज", "100+ एडिटेड फोटोज़", "केक कटिंग कवरेज", "ऑनलाइन गैलरी", "5 दिनों में डिलीवरी"] },
      { features: ["2 फोटोग्राफर", "कैंडिड + पारंपरिक", "300+ एडिटेड फोटोज़", "फैमिली ग्रुप पोर्ट्रेट्स", "ऑनलाइन गैलरी", "25-शीट फोटो एल्बम"] },
      { features: ["2+ फोटोग्राफर", "कैंडिड + पारंपरिक + ड्रोन", "500+ एडिटेड फोटोज़", "उसी दिन हाइलाइट्स वीडियो", "पूरे वेन्यू की कवरेज", "40-शीट प्रीमियम एल्बम", "प्रायोरिटी डिलीवरी"] },
    ],
    includes: [
      "प्रोफेशनल कलर-करेक्टेड और एडिटेड फोटोज़",
      "क्लाउड के जरिए हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
      "इवेंट से पहले प्लानिंग कंसल्टेशन",
      "ऑन-साइट बैकअप इक्विपमेंट",
      "48 घंटों के भीतर क्विक प्रीव्यू",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम वेन्यू, मेहमानों की संख्या, मुख्य गतिविधियाँ और वो खास पल जो आप कैद करना चाहते हैं, समझते हैं." },
      { step: "प्लानिंग", description: "इवेंट टाइमलाइन और वेन्यू लेआउट के आधार पर कवरेज प्लान तैयार किया जाता है." },
      { step: "इवेंट डे", description: "फोटोग्राफर मेहमानों से पहले पहुंचते हैं और सेटअप से लेकर आखिरी विदाई तक पूरे जश्न को कैद करते हैं." },
      { step: "डिलीवरी", description: "प्रोफेशनली एडिटेड फोटोज़ 5 दिनों के भीतर आपकी प्राइवेट ऑनलाइन गैलरी में दी जाती हैं." },
    ],
    faqs: [
      { q: "क्या आप थीम-बेस्ड बर्थडे पार्टी कवर करते हैं?", a: "हाँ. हम आपके डेकोर और थीम के साथ तालमेल रखते हुए फोटोज़ कम्पोज़ करते हैं." },
      { q: "न्यूनतम कवरेज अवधि कितनी है?", a: "एसेंशियल पैकेज 5 घंटे का है — अधिकतर बर्थडे के लिए पर्याप्त. बड़े इवेंट्स के लिए फुल-डे कवरेज बेहतर रहती है." },
      { q: "क्या शॉर्ट हाइलाइट वीडियो मिल सकता है?", a: "हाँ. सेम-डे एडिट हाइलाइट रील लक्ज़री पैकेज में शामिल है या ऐड-ऑन के रूप में उपलब्ध है." },
      { q: "क्या आप पहले बर्थडे केक स्मैश कवर करते हैं?", a: "बिल्कुल. पहला जन्मदिन हमारी खासियत है — हम शिशुओं और छोटे बच्चों के लिए सेशन को आरामदायक रखते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं. कोई छिपा शुल्क नहीं." },
    ],
  },
  "housewarming-photography": {
    tagline: "नया घर, नई शुरुआत, खूबसूरत यादें",
    description: "आपके गृहप्रवेश या हाउसवार्मिंग समारोह की संपूर्ण कवरेज — पूजा की रस्मों से लेकर परिवार के जश्न तक.",
    longDescription: "गृहप्रवेश जिंदगी के उन यादगार पड़ावों में से एक है — जब एक घर आपके परिवार का घर बनता है. Orvex Visuals आपके गृहप्रवेश या हाउसवार्मिंग के हर हिस्से को सावधानी से दस्तावेज़ करता है: पूजा की रस्में, पहली बार नए घर में इकट्ठा परिवार, आशीर्वाद और जश्न. हमारे फोटोग्राफर समारोह की सांस्कृतिक अहमियत समझते हैं और उस स्थान के भीतर सम्मानपूर्वक काम करते हैं ताकि पूरे परिवार को पीढ़ियों तक संजोने वाली तस्वीरें मिलें.",
    packages: [
      { features: ["1 फोटोग्राफर", "कैंडिड कवरेज", "पूजा रस्म कवरेज", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "5 दिनों में डिलीवरी"] },
      { features: ["2 फोटोग्राफर", "कैंडिड + पारंपरिक", "रस्म + फैमिली पोर्ट्रेट्स", "300+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "25-शीट फोटो एल्बम"] },
      { features: ["2+ फोटोग्राफर", "कैंडिड + पारंपरिक + ड्रोन", "एरियल वेन्यू शॉट्स", "500+ एडिटेड फोटोज़", "उसी दिन हाइलाइट्स", "40-शीट प्रीमियम एल्बम", "प्रायोरिटी डिलीवरी"] },
    ],
    includes: [
      "पूजा रस्म और परिवार के आशीर्वाद की कवरेज",
      "नए घर में फैमिली ग्रुप पोर्ट्रेट्स",
      "प्रोफेशनल कलर-करेक्टेड और एडिटेड फोटोज़",
      "क्लाउड के जरिए हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
      "इवेंट से पहले कंसल्टेशन और प्लानिंग",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम समारोह का शेड्यूल, पंडित का समय और आपके परिवार के लिए सबसे ज़रूरी पलों को समझते हैं." },
      { step: "प्लानिंग", description: "हमारी टीम आपके घर के लेआउट और पूरी रस्म की टाइमलाइन के आधार पर तैयारी करती है." },
      { step: "समारोह दिवस", description: "फोटोग्राफर पूजा शुरू होने से पहले पहुंचते हैं और रस्म, मेहमान और परिवार के पल — पूरे दिन की कवरेज करते हैं." },
      { step: "डिलीवरी", description: "एडिटेड फोटोज़ 5 दिनों के भीतर आपकी प्राइवेट ऑनलाइन गैलरी में दी जाती हैं." },
    ],
    faqs: [
      { q: "क्या आप गृहप्रवेश की रस्में समझते हैं?", a: "हाँ. हमारे फोटोग्राफर मुख्य रस्मों और उन्हें सही तरह से कैद करने की पोज़िशनिंग से परिचित हैं, बिना समारोह में व्यवधान डाले." },
      { q: "क्या आप अपार्टमेंट हाउसवार्मिंग कवर करते हैं?", a: "बिल्कुल. हम सभी आकार के घरों में काम करते हैं — अपार्टमेंट से लेकर बड़े बंगले तक." },
      { q: "फोटोग्राफर कितने समय पहले आते हैं?", a: "हम आम तौर पर पहली रस्म से 30 मिनट पहले पहुंचते हैं ताकि जगह समझकर तैयारी कर सकें." },
      { q: "क्या आप बेंगलुरु के बाहर हाउसवार्मिंग कवर करते हैं?", a: "हाँ. आउटस्टेशन कवरेज उपलब्ध है, लागू ट्रैवल चार्ज के साथ." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं. कोई छिपा शुल्क नहीं." },
    ],
  },
  "events-photography": {
    tagline: "हर जश्न, प्रोफेशनल तरीके से दस्तावेज़",
    description: "कॉलेज फेस्ट, एग्जिबिशन, सोशल गेदरिंग, प्रोडक्ट लॉन्च और कम्युनिटी सेलिब्रेशन के लिए प्रोफेशनल इवेंट फोटोग्राफी.",
    longDescription: "हर ज़रूरी मौके पर शादी होना ज़रूरी नहीं — लेकिन सभी प्रोफेशनल दस्तावेज़ीकरण के हकदार हैं. Orvex Visuals बेंगलुरु में कई तरह के इवेंट्स कवर करता है: कल्चरल फेस्ट, ब्रांड एग्जिबिशन, एसोसिएशन गेदरिंग, प्राइवेट पार्टीज़, अवार्ड फंक्शन और भी बहुत कुछ. हम कवरेज प्लान को आपके इवेंट के आकार और फॉर्मेट के अनुसार तैयार करते हैं, ताकि माहौल, मुख्य पल और उपस्थित लोगों का पूरा विजुअल रिकॉर्ड बन सके.",
    packages: [
      { features: ["1 फोटोग्राफर", "कैंडिड कवरेज", "100+ एडिटेड फोटोज़", "मुख्य पलों पर फोकस", "ऑनलाइन गैलरी", "5 दिनों में डिलीवरी"] },
      { features: ["2 फोटोग्राफर", "कैंडिड + पारंपरिक", "300+ एडिटेड फोटोज़", "स्पीकर और स्टेज कवरेज", "ग्रुप पोर्ट्रेट्स", "25-शीट फोटो एल्बम"] },
      { features: ["2+ फोटोग्राफर", "कैंडिड + पारंपरिक + ड्रोन", "500+ एडिटेड फोटोज़", "उसी दिन हाइलाइट्स वीडियो", "एरियल वेन्यू शॉट्स", "40-शीट प्रीमियम एल्बम", "प्रायोरिटी डिलीवरी"] },
    ],
    includes: [
      "प्रोफेशनल कलर-करेक्टेड और एडिटेड फोटोज़",
      "क्लाउड के जरिए हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
      "इवेंट से पहले प्लानिंग और कवरेज समन्वय",
      "ऑन-साइट बैकअप इक्विपमेंट",
      "48 घंटों के भीतर क्विक प्रीव्यू",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम इवेंट का फॉर्मेट, शेड्यूल, मुख्य गतिविधियाँ और आपकी कवरेज प्राथमिकताएं समझते हैं." },
      { step: "प्लानिंग", description: "वेन्यू, दर्शकों की संख्या और इवेंट फ्लो के आधार पर कवरेज प्लान तैयार किया जाता है." },
      { step: "लाइव कवरेज", description: "फोटोग्राफर इवेंट शुरू होने से पहले पहुंचते हैं और पूरे शेड्यूल को कवर करते हैं — माहौल, स्पीकर, परफॉर्मेंस और कैंडिड पल." },
      { step: "डिलीवरी", description: "एडिटेड फोटोज़ 5 दिनों के भीतर आपकी प्राइवेट ऑनलाइन गैलरी में दी जाती हैं." },
    ],
    faqs: [
      { q: "आप किस तरह के इवेंट्स कवर करते हैं?", a: "कॉलेज फेस्ट, ब्रांड एग्जिबिशन, कम्युनिटी गेदरिंग, प्राइवेट पार्टीज़, अवार्ड नाइट्स, प्रोडक्ट लॉन्च, कल्चरल शो और बहुत कुछ." },
      { q: "क्या आप मल्टी-डे इवेंट्स कवर करते हैं?", a: "हाँ. मल्टी-डे इवेंट्स को दिन-वार प्राइसिंग पर कवर किया जाता है. कस्टम कोट के लिए WhatsApp पर संपर्क करें." },
      { q: "आप कितने फोटोग्राफर भेजते हैं?", a: "इवेंट साइज़ के आधार पर — एसेंशियल में 1, प्रीमियम और लक्ज़री में 2 या अधिक. अनुरोध पर कस्टम टीम साइज़ उपलब्ध है." },
      { q: "क्या सेम-डे हाइलाइट वीडियो मिल सकता है?", a: "हाँ. सेम-डे एडिट हाइलाइट रील लक्ज़री पैकेज में शामिल है या स्टैंडअलोन ऐड-ऑन के रूप में उपलब्ध है." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं. कोई छिपा शुल्क नहीं." },
    ],
  },
  "maternity-photography": {
    tagline: "नई जिंदगी का जश्न, खूबसूरती से फ्रेम",
    description: "आपकी प्रेग्नेंसी को गर्मजोशी, देखभाल और प्रोफेशनल मार्गदर्शन के साथ एलीगेंट इंडोर और आउटडोर मैटरनिटी पोर्ट्रेट में कैद करें.",
    longDescription: "प्रेग्नेंसी जिंदगी का एक ऐसा मौसम है जो तेज़ी से गुज़र जाता है और जिसे खूबसूरती से दस्तावेज़ करना ज़रूरी है. Orvex Visuals इंडोर स्टूडियो और आउटडोर नैचुरल सेटिंग दोनों में मैटरनिटी पोर्ट्रेट बनाता है — जो भी आपको सहज लगे. हम आउटफिट चुनने, पोज़ करने और आपकी कम्फर्ट और प्रेग्नेंसी स्टेज के अनुसार टाइमिंग में मार्गदर्शन करते हैं. सेशन बिना जल्दबाजी के, सहायक माहौल में होता है — फोकस इस अध्याय की नैचुरल भावना और सुंदरता को सामने लाने पर रहता है.",
    packages: [
      { features: ["1 फोटोग्राफर", "इंडोर या आउटडोर सेशन", "1 आउटफिट सेटअप", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "7 दिनों में डिलीवरी"] },
      { features: ["1 फोटोग्राफर + असिस्टेंट", "इंडोर + आउटडोर सेशन", "2 आउटफिट सेटअप", "पार्टनर / फैमिली पोर्ट्रेट्स", "200+ एडिटेड फोटोज़", "25-शीट फोटो एल्बम"] },
      { features: ["2 फोटोग्राफर", "स्टूडियो + लोकेशन सेशन", "3+ आउटफिट सेटअप", "सिल्हूट और क्रिएटिव शॉट्स", "300+ एडिटेड फोटोज़", "उसी दिन स्नीक पीक", "40-शीट प्रीमियम एल्बम", "प्रायोरिटी डिलीवरी"] },
    ],
    includes: [
      "पोज़िंग गाइडेंस और स्टाइलिंग कंसल्टेशन",
      "इंडोर स्टूडियो और आउटडोर लोकेशन दोनों विकल्प",
      "प्रोफेशनल कलर-करेक्टेड और एडिटेड फोटोज़",
      "क्लाउड के जरिए हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
      "पार्टनर और फैमिली पोर्ट्रेट का विकल्प",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम आपकी पसंदीदा स्टाइल — स्टूडियो बनाम आउटडोर, आउटफिट आइडिया और सोलो या पार्टनर / फैमिली शॉट्स — पर बात करते हैं." },
      { step: "प्लानिंग", description: "लोकेशन और टाइमिंग आपकी कम्फर्ट और प्रेग्नेंसी की आदर्श स्टेज (आमतौर पर 28-34 हफ्ते) के अनुसार तय की जाती है." },
      { step: "सेशन", description: "आपकी अपनी गति से आरामदायक, गाइडेड सेशन — ज़रूरत पड़ने पर ब्रेक के साथ और पूरे समय पोज़िंग डायरेक्शन." },
      { step: "डिलीवरी", description: "प्रोफेशनली एडिटेड फोटोज़ 7 दिनों के भीतर आपकी प्राइवेट ऑनलाइन गैलरी में दी जाती हैं." },
    ],
    faqs: [
      { q: "मैटरनिटी शूट के लिए सबसे अच्छा समय कब है?", a: "अधिकतर 28-34 हफ्ते की सलाह दी जाती है — बेबी बंप नज़र आता है और आप आरामदायक भी रहती हैं. हम आपके शेड्यूल के अनुसार एडजस्ट करते हैं." },
      { q: "इंडोर या आउटडोर — कौन सा बेहतर है?", a: "दोनों की अपनी खूबसूरती है. इंडोर में कंट्रोल्ड लाइटिंग और ड्रामैटिक सेटअप होते हैं. आउटडोर में नैचुरल लाइट और रिलैक्स्ड फील मिलती है. हम दोनों देते हैं." },
      { q: "क्या पार्टनर और बच्चे सेशन में शामिल हो सकते हैं?", a: "हाँ. पार्टनर और फैमिली पोर्ट्रेट किसी भी सेशन में शामिल किए जा सकते हैं. प्रीमियम और लक्ज़री इसी को ध्यान में रखकर बनाए गए हैं." },
      { q: "मुझे क्या पहनना चाहिए?", a: "हम स्टाइलिंग गाइड देते हैं. आमतौर पर फ्लोई फैब्रिक, सॉलिड रंग और कम्फर्टेबल फिट सबसे अच्छे लगते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं. कोई छिपा शुल्क नहीं." },
    ],
  },
  "corporate-photography": {
    tagline: "हर बिज़नेस पल के लिए प्रोफेशनल कवरेज",
    description: "कॉन्फ्रेंस, प्रोडक्ट लॉन्च, टीम इवेंट, अवार्ड सेरेमनी और कॉर्पोरेट सेलिब्रेशन के लिए अनुभवी इवेंट फोटोग्राफी.",
    longDescription: "कॉर्पोरेट इवेंट्स के लिए एक ऐसे फोटोग्राफर की ज़रूरत होती है जो प्रोफेशनल हो, अपने काम पर फोकस रहे और ऐसा कंटेंट डिलीवर करे जो आपके ब्रांड की क्वालिटी को दर्शाए. Orvex Visuals बेंगलुरु में कॉर्पोरेट इवेंट्स कवर करता है — छोटी टीम गेदरिंग और ऑफ-साइट सेलिब्रेशन से लेकर बड़े कॉन्फ्रेंस, प्रोडक्ट लॉन्च और अवार्ड नाइट्स तक. हम स्पीकर, ऑडिएंस एनर्जी, ब्रांडिंग एलिमेंट्स और कैंडिड टीम मोमेंट्स को कैद करते हैं ताकि इंटर्नल कम्युनिकेशन, प्रेस और सोशल मीडिया के लिए तैयार एक पूरा विज़ुअल रिकॉर्ड मिले.",
    packages: [
      { features: ["1 फोटोग्राफर", "कैंडिड कवरेज", "100+ एडिटेड फोटोज़", "स्पीकर और स्टेज कवरेज", "ऑनलाइन गैलरी", "5 दिनों में डिलीवरी"] },
      { features: ["2 फोटोग्राफर", "पूरे इवेंट की कवरेज", "300+ एडिटेड फोटोज़", "कैंडिड टीम पोर्ट्रेट्स", "ग्रुप फोटोज़", "25-शीट एल्बम"] },
      { features: ["2+ फोटोग्राफर", "पूरी कवरेज + ड्रोन", "500+ एडिटेड फोटोज़", "एरियल वेन्यू शॉट्स", "उसी दिन हाइलाइट्स वीडियो", "40-शीट प्रीमियम एल्बम", "प्रायोरिटी डिलीवरी"] },
    ],
    includes: [
      "प्रोफेशनल कलर-करेक्टेड और एडिटेड फोटोज़",
      "क्लाउड के जरिए हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
      "इवेंट से पहले ब्रीफिंग और कवरेज प्लानिंग",
      "ऑन-साइट बैकअप इक्विपमेंट",
      "48 घंटों के भीतर क्विक प्रीव्यू",
      "इवेंट टैगिंग के साथ व्यवस्थित गैलरी",
    ],
    process: [
      { step: "ब्रीफिंग", description: "हम आपका इवेंट फॉर्मेट, ब्रांड गाइडलाइंस, मुख्य स्पीकर या पल और डिलीवरेबल ज़रूरतें समझते हैं." },
      { step: "प्लानिंग", description: "वेन्यू, एजेंडा और टीम साइज़ के आधार पर कवरेज प्लान तैयार किया जाता है — ज़रूरत पड़ने पर पोज़िशन स्काउटिंग के साथ." },
      { step: "लाइव कवरेज", description: "फोटोग्राफर इवेंट शुरू होने से पहले पहुंचते हैं और पूरे शेड्यूल को कवर करते हैं — कीनोट, नेटवर्किंग, टीम मोमेंट्स और आधिकारिक गतिविधियाँ." },
      { step: "डिलीवरी", description: "एडिटेड फोटोज़ व्यवस्थित करके 5 दिनों के भीतर आपकी प्राइवेट ऑनलाइन गैलरी में दी जाती हैं." },
    ],
    faqs: [
      { q: "क्या आप कॉर्पोरेट इवेंट के लिए NDA साइन करते हैं?", a: "हाँ. इवेंट से पहले हम स्टैंडर्ड NDA और कॉन्फिडेंशियलिटी एग्रीमेंट साइन कर सकते हैं." },
      { q: "क्या प्रेस और सोशल मीडिया के लिए हाई-रेज़ फाइल्स मिलेंगी?", a: "हाँ. सभी डिलीवरेबल्स हाई-रिज़ॉल्यूशन में हैं और डिजिटल व प्रिंट दोनों के लिए ऑप्टिमाइज़्ड हैं." },
      { q: "क्या सेम-डे पोस्ट के लिए जल्दी टर्नअराउंड मिल सकता है?", a: "टाइम-सेंसिटिव इवेंट्स के लिए 10-20 हीरो शॉट्स का सेम-डे एडिट ऐड-ऑन के रूप में उपलब्ध है. ब्रीफिंग में इस पर चर्चा करें." },
      { q: "क्या आप आउटस्टेशन कॉर्पोरेट इवेंट्स कवर करते हैं?", a: "हाँ. बेंगलुरु के बाहर इवेंट्स लागू ट्रैवल और अकोमोडेशन चार्ज के साथ कवर किए जाते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं. कोई छिपा शुल्क नहीं." },
    ],
  },

  // ── Variant Discovery Pages (Hindi) ──────────────────────────────────
  "candid-wedding-photography": {
    tagline: "असली पल, सच्ची कहानी",
    description: "डॉक्यूमेंट्री स्टाइल वेडिंग स्टोरीटेलिंग — खुशी, आँसू और हर असली एहसास बिना किसी दिशा-निर्देश के कैद किए जाते हैं.",
    longDescription: "कैंडिड वेडिंग फोटोग्राफी सच्चाई के बारे में है. पोज़ड तस्वीरों की जगह, हमारे फोटोग्राफर फोटो-जर्नलिस्ट की तरह काम करते हैं — आपके जश्न में घुलकर, पलों का इंतजार करते हुए, और जब असली भावना सबसे ऊपर होती है, तब शटर दबाते हैं. नतीजा एक ऐसा वेडिंग एल्बम होता है जो जीवंत लगता है: सेरेमनी से पहले की नर्वस हँसी, माँ-बाप की आँखों में आँसू, बिना किसी स्क्रिप्ट के पहले डांस का वो पल. Orvex Visuals ने बेंगलुरु और उससे बाहर सैकड़ों कैंडिड वेडिंग स्टोरीज़ दस्तावेज़ की हैं.",
    packages: [
      { features: ["1 कैंडिड फोटोग्राफर", "200+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "5 दिनों में डिलीवरी"] },
      { features: ["2 कैंडिड फोटोग्राफर", "500+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "सेम-डे टीज़र", "25-शीट एल्बम"] },
      { features: ["2+ फोटोग्राफर", "कैंडिड + पारंपरिक", "1000+ एडिटेड फोटोज़", "ड्रोन कवरेज", "सेम-डे टीज़र", "40-शीट एल्बम"] },
    ],
    includes: [
      "पूरे दिन डॉक्यूमेंट्री-स्टाइल कवरेज",
      "बिना दिशा-निर्देश के असली भावनाओं को कैद करना",
      "हाई-रिज़ॉल्यूशन प्रोफेशनली एडिटेड तस्वीरें",
      "इवेंट से पहले कंसल्टेशन",
      "प्राइवेट ऑनलाइन गैलरी",
      "बैकअप इक्विपमेंट ऑन-साइट",
    ],
    process: [
      { step: "परामर्श", description: "हम आपका वेडिंग शेड्यूल और ज़रूरी पल समझते हैं ताकि हम सही जगह हों." },
      { step: "कवरेज डे", description: "फोटोग्राफर बिना किसी दखल के काम करते हैं, पलों को जैसे-जैसे वे आते हैं कैद करते हुए." },
      { step: "क्यूरेशन", description: "सबसे अच्छे फ्रेम्स चुने जाते हैं, कलर-ग्रेड और रीटच किए जाते हैं." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से फोटोज़ डिलीवर की जाती हैं." },
    ],
    faqs: [
      { q: "कैंडिड फोटोग्राफी क्या है?", a: "कैंडिड फोटोग्राफी में असली और बिना पोज़ किए हुए पल कैद किए जाते हैं. हम आपका दिन जैसा होता है वैसे ही दस्तावेज़ करते हैं." },
      { q: "क्या आप कोई पोज़ड शॉट भी लेते हैं?", a: "हम पोज़ड शॉट्स कम से कम रखते हैं — फैमिली ग्रुप फोटो और कुछ कपल पोर्ट्रेट्स. बाकी एल्बम कैंडिड होता है." },
      { q: "हमें कितनी फोटोज़ मिलेंगी?", a: "पैकेज के हिसाब से 200 से 1000+ प्रोफेशनली एडिटेड फोटोज़." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. कोई छिपा शुल्क नहीं." },
    ],
  },

  "christian-wedding-photography": {
    tagline: "कृपा, खुशी और हर पवित्र पल",
    description: "चर्च सेरेमनी, वाउ एक्सचेंज, रिसेप्शन और क्रिश्चियन वेडिंग परंपराओं की सांस्कृतिक समझ के साथ विशेषज्ञ कवरेज.",
    longDescription: "क्रिश्चियन वेडिंग में सुंदर रीतियों की एक श्रृंखला होती है — चर्च जुलूस, वेदी पर वाउ एक्सचेंज, रिंग सेरेमनी, पहली चुंबन, और उसके बाद रिसेप्शन का जश्न. हमारे फोटोग्राफर हर पल की गहराई और खुशी को समझते हैं और चर्च के प्रकाश और स्थान की सीमाओं के भीतर उन्हें सम्मानपूर्वक कैद करते हैं. हम पहले से पुजारी और इवेंट कोऑर्डिनेटर से समन्वय करते हैं ताकि सही पोज़िशनिंग हो.",
    packages: [
      { features: ["चर्च सेरेमनी कवरेज", "1 फोटोग्राफर", "200+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["चर्च + रिसेप्शन कवरेज", "2 फोटोग्राफर", "500+ एडिटेड फोटोज़", "25-शीट एल्बम", "सेम-डे टीज़र"] },
      { features: ["पूरे दिन कवरेज", "2+ फोटोग्राफर", "ड्रोन शॉट्स", "1000+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "परमिशन कोऑर्डिनेशन के साथ चर्च सेरेमनी कवरेज",
      "रिसेप्शन और सेलिब्रेशन कवरेज",
      "ब्राइडल प्रेप और पोर्ट्रेट सेशन",
      "प्रोफेशनली एडिटेड हाई-रिज़ॉल्यूशन फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
      "इवेंट से पहले साइट कोऑर्डिनेशन",
    ],
    process: [
      { step: "परामर्श", description: "हम आपकी सेरेमनी शेड्यूल, चर्च पॉलिसी और रिसेप्शन प्लान पर चर्चा करते हैं." },
      { step: "कोऑर्डिनेशन", description: "हम चर्च कोऑर्डिनेटर से फोटोग्राफी परमिशन और पोज़िशनिंग कन्फर्म करते हैं." },
      { step: "कवरेज डे", description: "ब्राइडल प्रेप से रिसेप्शन तक हमारी टीम हर पल कैद करती है." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आपको चर्च के अंदर शूट करने का अनुभव है?", a: "हाँ. हमने बेंगलुरु के कई चर्चों में सेरेमनी कवर की हैं और लाइटिंग, मूवमेंट रिस्ट्रिक्शन और पोज़िशनिंग को समझते हैं." },
      { q: "क्या आप सेरेमनी के दौरान शूट कर सकते हैं?", a: "हाँ, चर्च की परमिशन के अधीन. हम हमेशा इवेंट से पहले ऑफिशिएटिंग पुजारी से समन्वय करते हैं." },
      { q: "क्या आप चर्च और रिसेप्शन दोनों कवर करते हैं?", a: "हाँ. हमारे फुल-डे पैकेज दोनों को कवर करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "muslim-wedding-photography": {
    tagline: "हर रस्म, खूबसूरती से सम्मानित",
    description: "निकाह, वलीमा, मेहंदी और सभी मुस्लिम वेडिंग फंक्शन्स की सांस्कृतिक समझ और सम्मान के साथ प्रोफेशनल कवरेज.",
    longDescription: "मुस्लिम वेडिंग रस्मों से भरपूर होती है — अंतरंग निकाह, जीवंत मेहंदी, उत्सवपूर्ण वलीमा, और विभिन्न पारिवारिक रीतियाँ जो सभी कार्यक्रमों को जोड़ती हैं. हमारे फोटोग्राफर मुस्लिम शादियों को परंपराओं के प्रति सम्मान, कवरेज प्रोटोकॉल की समझ और अंतरंग और उत्सवपूर्ण दोनों पलों को ईमानदारी से कैद करने की क्षमता के साथ देखते हैं.",
    packages: [
      { features: ["एकल फंक्शन कवरेज", "1 फोटोग्राफर", "200+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["मल्टी-फंक्शन कवरेज", "2 फोटोग्राफर", "500+ एडिटेड फोटोज़", "25-शीट एल्बम", "सेम-डे टीज़र"] },
      { features: ["सभी फंक्शन कवर्ड", "2+ फोटोग्राफर", "ड्रोन शॉट्स", "1000+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "निकाह, वलीमा और मेहंदी कवरेज",
      "कैंडिड और पारंपरिक डॉक्यूमेंट्री कवरेज",
      "इवेंट टीम के साथ सम्मानजनक कोऑर्डिनेशन",
      "हाई-रिज़ॉल्यूशन प्रोफेशनली एडिटेड फोटोज़",
      "परिवार साझाकरण के लिए प्राइवेट ऑनलाइन गैलरी",
      "बैकअप इक्विपमेंट ऑन-साइट",
    ],
    process: [
      { step: "परामर्श", description: "हम चर्चा करते हैं कि आपको कौन-से फंक्शन कवर करने हैं और सांस्कृतिक प्राथमिकताएं क्या हैं." },
      { step: "प्लानिंग", description: "हम आपके परिवार के साथ शेड्यूल, वेन्यू लेआउट और कवरेज लॉजिस्टिक्स कोऑर्डिनेट करते हैं." },
      { step: "कवरेज", description: "हमारी टीम प्रत्येक फंक्शन को सम्मान और पूरी तरह से कवर करती है." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आप मल्टी-डे मुस्लिम वेडिंग कवर करते हैं?", a: "हाँ. हम मल्टी-डे कवरेज पैकेज ऑफर करते हैं. कस्टम कोट के लिए हमसे संपर्क करें." },
      { q: "क्या आप जेंडर-सेपरेटेड इवेंट्स कवर कर सकते हैं?", a: "हाँ. हमें जेंडर-अलग सेरेमनी का अनुभव है और हम उसके अनुसार पोज़िशन लेते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "haldi-mehendi-photography": {
    tagline: "रंग, रस्म और सच्ची खुशी",
    description: "हल्दी और मेहंदी फंक्शन की जीवंत और इमर्सिव कवरेज — रंग, डांस, रस्में और कैंडिड पल खूबसूरती से कैद.",
    longDescription: "हल्दी और मेहंदी किसी भी भारतीय शादी के सबसे फोटोग्राफिक रूप से समृद्ध कार्यक्रम हैं. हल्दी लगाने का पल, मेहंदी के नाज़ुक पैटर्न, गाना, हँसना, परिवार की अनौपचारिक चहल-पहल — ये पल एक ऐसे फोटोग्राफर के हकदार हैं जो इस ऊर्जा से उतना ही प्यार करे जितना आप करते हैं. हमारी टीम आउटडोर हल्दी फंक्शन की चुनौतीपूर्ण लाइटिंग और मेहंदी सेशन के क्लोज़-अप डिटेल वर्क दोनों में विशेषज्ञ है.",
    packages: [
      { features: ["एकल फंक्शन", "1 फोटोग्राफर", "150+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["हल्दी + मेहंदी कवरेज", "2 फोटोग्राफर", "300+ एडिटेड फोटोज़", "25-शीट एल्बम", "सेम-डे टीज़र"] },
      { features: ["पूरी कवरेज", "2+ फोटोग्राफर", "मेहंदी डिटेल शॉट्स", "500+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "हल्दी सेरेमनी कवरेज सहित एप्लीकेशन सीक्वेंस",
      "मेहंदी क्लोज़-अप डिटेल फोटोग्राफी",
      "कैंडिड ग्रुप और फैमिली मोमेंट्स",
      "जीवंत कलर-ग्रेडेड प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
      "बैकअप इक्विपमेंट ऑन-साइट",
    ],
    process: [
      { step: "परामर्श", description: "हम इवेंट टाइमिंग, इनडोर/आउटडोर सेटअप और लाइटिंग कंडीशन पर चर्चा करते हैं." },
      { step: "तैयारी", description: "हमारा फोटोग्राफर रंग और मूवमेंट के लिए एंगल और तैयारी पहले से स्काउट करता है." },
      { step: "कवरेज", description: "हम रस्मों, मेहंदी आर्ट के क्लोज़-अप और सभी कैंडिड पलों को दस्तावेज़ करते हैं." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आप हल्दी और मेहंदी दोनों एक साथ कवर करते हैं?", a: "हाँ. हमारा फुल-डे पैकेज दोनों फंक्शन कवर करता है." },
      { q: "हल्दी के दौरान इक्विपमेंट की सुरक्षा कैसे होती है?", a: "हमारे फोटोग्राफर वेदर-सील्ड कैमरे और लेंस इस्तेमाल करते हैं. इक्विपमेंट सुरक्षा हमेशा पहले से प्लान की जाती है." },
      { q: "क्या आप मेहंदी के क्लोज़-अप ले सकते हैं?", a: "हाँ. हम डिटेल्ड मेहंदी पैटर्न शॉट्स के लिए मैक्रो लेंस इस्तेमाल करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "sangeet-photography": {
    tagline: "डांस, संगीत और अविस्मरणीय पल",
    description: "हाई-एनर्जी संगीत कवरेज — डांस परफॉर्मेंस, फैमिली एंटरटेनमेंट, कैंडिड रिएक्शन और रात की पूरी खुशी.",
    longDescription: "संगीत की रात शुद्ध जश्न होती है — कोरियोग्राफ्ड डांस, अनायास परफॉर्मेंस, भावनात्मक गाने और पूरा परिवार एक साथ. हमारे फोटोग्राफर फास्ट-मूविंग इनडोर इवेंट फोटोग्राफी में कुशल हैं, सही फ्लैश और नेचुरल लाइट तकनीकों का उपयोग करते हुए एक्शन फ्रीज़ करते हैं बिना माहौल को खराब किए.",
    packages: [
      { features: ["इवेंट कवरेज", "1 फोटोग्राफर", "150+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["पूरी संगीत कवरेज", "2 फोटोग्राफर", "300+ एडिटेड फोटोज़", "सेम-डे टीज़र", "25-शीट एल्बम"] },
      { features: ["पूरी कवरेज", "2+ फोटोग्राफर", "कैंडिड + पोज़्ड", "500+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "डांस परफॉर्मेंस और स्टेज कवरेज",
      "ऑडियंस और रिएक्शन कैंडिड शॉट्स",
      "फैमिली पोर्ट्रेट मोमेंट्स",
      "इनडोर इवेंट लाइटिंग तकनीकें",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम इवेंट शेड्यूल, स्टेज सेटअप और ज़रूरी परफॉर्मेंस मोमेंट्स पर चर्चा करते हैं." },
      { step: "वेन्यू चेक", description: "हमारा फोटोग्राफर लाइटिंग कंडीशन और पोज़िशन पहले से चेक करता है." },
      { step: "कवरेज", description: "रात भर परफॉर्मेंस, स्पीच और कैंडिड सेलिब्रेशन कवर किए जाते हैं." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आप तेज़ डांस मूवमेंट फ्रीज़ कर सकते हैं?", a: "हाँ. हम एक्शन शॉट्स के लिए उचित शटर स्पीड और फ्लैश तकनीक इस्तेमाल करते हैं." },
      { q: "क्या कवरेज इनडोर या आउटडोर होती है?", a: "हम इनडोर वेन्यू सेटअप और आउटडोर संगीत दोनों संभालते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "wedding-videography": {
    tagline: "आपका दिन, हमेशा के लिए जीवंत",
    description: "पूरे वेडिंग डे की वीडियो कवरेज — पारंपरिक डॉक्यूमेंटेशन और सिनेमैटिक हाइलाइट फिल्म्स हर फंक्शन के लिए.",
    longDescription: "वेडिंग फिल्म उस दिन को दोबारा जीने का सबसे नज़दीकी ज़रिया है. हमारी वेडिंग वीडियोग्राफी टीम वाउ, रस्में, आँसू, हँसी और स्पीच पूरी गति में कैद करती है, फिर उन्हें ऐसी फिल्म में एडिट करती है जिसे आप हर एनिवर्सरी पर देखना चाहेंगे. हम पारंपरिक फुल-कवरेज डॉक्यूमेंटेशन और मूल साउंड और संगीत के साथ सिनेमैटिक हाइलाइट रील दोनों ऑफर करते हैं.",
    packages: [
      { features: ["पारंपरिक वीडियो कवरेज", "1 वीडियोग्राफर", "पूरी सेरेमनी एडिट", "ऑनलाइन डिलीवरी"] },
      { features: ["सिनेमैटिक + पारंपरिक", "2 वीडियोग्राफर", "हाइलाइट फिल्म", "पूरी सेरेमनी एडिट", "सेम-डे टीज़र"] },
      { features: ["पूरी सिनेमैटिक प्रोडक्शन", "2+ वीडियोग्राफर", "ड्रोन वीडियो", "हाइलाइट फिल्म", "सेम-डे एडिट", "सभी फंक्शन"] },
    ],
    includes: [
      "पूरी सेरेमनी और रिसेप्शन वीडियो कवरेज",
      "संगीत के साथ सिनेमैटिक हाइलाइट फिल्म",
      "प्रोफेशनल कलर ग्रेडिंग और ऑडियो सिंक",
      "ड्रोन फुटेज (ऐड-ऑन के रूप में उपलब्ध)",
      "प्राइवेट लिंक से ऑनलाइन डिलीवरी",
      "बैकअप इक्विपमेंट ऑन-साइट",
    ],
    process: [
      { step: "परामर्श", description: "हम आपके इवेंट शेड्यूल, स्टाइल प्राथमिकताएं और फिल्म लेंथ की अपेक्षाएं पर चर्चा करते हैं." },
      { step: "प्लानिंग", description: "शॉट लिस्ट, इक्विपमेंट प्लान और टीम कोऑर्डिनेशन को फाइनलाइज़ किया जाता है." },
      { step: "फिल्मिंग", description: "हमारे वीडियोग्राफर प्रोफेशनल सिनेमा-ग्रेड इक्विपमेंट से हर पल कैद करते हैं." },
      { step: "डिलीवरी", description: "हाइलाइट फिल्म और पूरी एडिट 15 दिनों के भीतर डिलीवर." },
    ],
    faqs: [
      { q: "हाइलाइट फिल्म कितनी लंबी होती है?", a: "आमतौर पर 5-10 मिनट, पैकेज और फुटेज के आधार पर." },
      { q: "क्या आप सेम-डे एडिट देते हैं?", a: "सेम-डे एडिट Luxury पैकेज के हिस्से के रूप में और ऐड-ऑन के रूप में उपलब्ध है." },
      { q: "क्या आप सेरेमनी का ऑडियो सिंक कर सकते हैं?", a: "हाँ. हम सेरेमनी के लिए डेडिकेटेड ऑडियो रिकॉर्डिंग इस्तेमाल करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "post-wedding-photoshoot": {
    tagline: "कहानी आगे भी है",
    description: "शादी के बाद खूबसूरत लोकेशंस पर आरामदायक कपल पोर्ट्रेट्स — पूरा रोमांस, बिना दिन की भागदौड़ के.",
    longDescription: "शादी का दिन एक झलक की तरह गुज़र जाता है. पोस्ट-वेडिंग फोटोशूट आपको अपने कपल पोर्ट्रेट्स में पूरी तरह मौजूद रहने का समय देता है — वेडिंग या ब्राइडल आउटफिट में, एक सुंदर लोकेशन पर, बिना किसी शेड्यूल के दबाव के. कई कपल कहते हैं कि ये उनकी सबसे आरामदायक और स्वाभाविक तस्वीरें हैं.",
    packages: [
      { features: ["1 लोकेशन", "2 आउटफिट चेंज", "50+ एडिटेड फोटोज़", "1 फोटोग्राफर", "ऑनलाइन गैलरी"] },
      { features: ["2 लोकेशन", "4 आउटफिट चेंज", "100+ एडिटेड फोटोज़", "1 फोटोग्राफर + असिस्टेंट", "लोकेशन स्काउटिंग", "25-शीट एल्बम"] },
      { features: ["3 लोकेशन", "6 आउटफिट चेंज", "200+ एडिटेड फोटोज़", "2 फोटोग्राफर", "सिनेमैटिक वीडियो", "ड्रोन शॉट्स", "40-शीट एल्बम"] },
    ],
    includes: [
      "लोकेशन स्काउटिंग और प्लानिंग",
      "पूरे सेशन में पोज़िंग डायरेक्शन",
      "स्टाइलिंग और आउटफिट कंसल्टेशन",
      "प्रोफेशनल कलर-ग्रेडेड एडिट्स",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
      "हाई-रिज़ॉल्यूशन डिजिटल फाइल्स",
    ],
    process: [
      { step: "परामर्श", description: "हम आपके एस्थेटिक के आधार पर लोकेशन, आउटफिट और टाइमिंग प्लान करते हैं." },
      { step: "लोकेशन फाइनलाइज़ेशन", description: "नेचुरल लाइट और एक्सेसिबिलिटी के आधार पर लोकेशन स्काउट और कन्फर्म की जाती हैं." },
      { step: "शूट डे", description: "प्राकृतिक और सुंदर पोर्ट्रेट्स के लिए प्रोफेशनल डायरेक्शन के साथ आरामदायक सेशन." },
      { step: "डिलीवरी", description: "7 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "शादी के बाद कितने समय में यह शूट किया जा सकता है?", a: "कभी भी — हफ्तों या महीनों में भी. कुछ कपल इसे अपनी पहली एनिवर्सरी पर करते हैं." },
      { q: "क्या पहनें?", a: "वेडिंग आउटफिट बहुत खूबसूरत लगते हैं. कपल कोऑर्डिनेशन के लिए हम आउटफिट गाइड भी देते हैं." },
      { q: "क्या आप लोकेशन सुझाते हैं?", a: "हाँ. आपकी स्टाइल के आधार पर — Nandi Hills, हेरिटेज प्रॉपर्टीज़, Lal Bagh आदि." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "anniversary-photoshoot": {
    tagline: "हर साल, एक नई कहानी",
    description: "अपनी मील-स्टोन एनिवर्सरी को खूबसूरत कपल पोर्ट्रेट्स के साथ मनाएं — अंतरंग इनडोर सेशन से लेकर आउटडोर लोकेशन शूट तक.",
    longDescription: "आपकी एनिवर्सरी एक साझा यात्रा का जश्न है. चाहे पहला साल हो या पच्चीसवाँ, एनिवर्सरी फोटोशूट आपको तस्वीरों का एक सेट देता है जो आप दोनों को अभी जैसे दर्शाता है. हमारे फोटोग्राफर एक आरामदायक और मज़ेदार माहौल बनाते हैं, जिससे ऐसे पोर्ट्रेट्स बनते हैं जो स्वाभाविक और कालातीत हों.",
    packages: [
      { features: ["1 लोकेशन", "2 आउटफिट चेंज", "50+ एडिटेड फोटोज़", "1 फोटोग्राफर", "ऑनलाइन गैलरी"] },
      { features: ["2 लोकेशन", "4 आउटफिट चेंज", "100+ एडिटेड फोटोज़", "लोकेशन स्काउटिंग", "25-शीट एल्बम"] },
      { features: ["3 लोकेशन", "6 आउटफिट चेंज", "200+ एडिटेड फोटोज़", "शॉर्ट फिल्म", "40-शीट एल्बम"] },
    ],
    includes: [
      "चुनी हुई लोकेशन पर कपल पोर्ट्रेट सेशन",
      "पोज़िंग डायरेक्शन और क्रिएटिव गाइडेंस",
      "आउटफिट कंसल्टेशन",
      "प्रोफेशनली एडिटेड हाई-रिज़ॉल्यूशन फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
      "हाई-रिज़ॉल्यूशन डिजिटल फाइल्स",
    ],
    process: [
      { step: "परामर्श", description: "हम लोकेशन, आउटफिट और सेशन का मूड प्लान करते हैं." },
      { step: "सेशन", description: "नेचुरल पोज़िंग डायरेक्शन के साथ आरामदायक शूट." },
      { step: "एडिटिंग", description: "फोटोज़ कलर-ग्रेड और रीटच की जाती हैं." },
      { step: "डिलीवरी", description: "7 दिनों के भीतर प्राइवेट गैलरी से फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "कौन-सी एनिवर्सरी मील-स्टोन लोग आमतौर पर मनाते हैं?", a: "1st, 5th, 10th, 25th (सिल्वर) और 50th (गोल्डन) लोकप्रिय मील-स्टोन हैं. हम सभी कवर करते हैं." },
      { q: "क्या परिवार के सदस्य भी शामिल हो सकते हैं?", a: "बिल्कुल. फैमिली एनिवर्सरी पोर्ट्रेट्स का स्वागत है." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "baby-shower-photography": {
    tagline: "आने वाले खुशी का जश्न",
    description: "बेबी शॉवर सेलिब्रेशन की प्रोफेशनल कवरेज — गेम्स, गिफ्ट्स, परिवार और आगमन से पहले की सुंदर उत्सुकता.",
    longDescription: "बेबी शॉवर उत्सुकता का जश्न है — परिवार और दोस्त होने वाली माँ के आसपास नई ज़िंदगी का जश्न मनाने के लिए इकट्ठे होते हैं. हमारे फोटोग्राफर डेकोरेशन, गेम्स, गिफ्ट ओपनिंग, कैंडिड हँसी और भावनात्मक पलों को कैद करते हैं जो दिन को यादगार बनाते हैं.",
    packages: [
      { features: ["इवेंट कवरेज", "1 फोटोग्राफर", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["पूरी इवेंट कवरेज", "2 फोटोग्राफर", "200+ एडिटेड फोटोज़", "25-शीट एल्बम"] },
      { features: ["पूरी कवरेज", "2 फोटोग्राफर", "मैटरनिटी पोर्ट्रेट्स", "300+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "पूरी बेबी शॉवर इवेंट कवरेज",
      "डेकोरेशन और केक के डिटेल शॉट्स",
      "कैंडिड गेस्ट और फैमिली मोमेंट्स",
      "इवेंट के भीतर मैटरनिटी पोर्ट्रेट सेशन",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम इवेंट शेड्यूल, वेन्यू और प्राथमिकता वाले खास पलों पर चर्चा करते हैं." },
      { step: "सेटअप", description: "हम गेस्ट से पहले डेकोरेशन और वेन्यू के शॉट्स के लिए पहुंचते हैं." },
      { step: "कवरेज", description: "गेम्स, गिफ्ट्स और फैमिली मोमेंट्स सहित पूरी इवेंट कवरेज." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आप बेबी शॉवर में मैटरनिटी पोर्ट्रेट्स भी लेते हैं?", a: "हाँ. Premium और Luxury पैकेज में मैटरनिटी पोर्ट्रेट्स शामिल हैं." },
      { q: "क्या आप आउटडोर गार्डन बेबी शॉवर कवर कर सकते हैं?", a: "बिल्कुल. हम इनडोर और आउटडोर दोनों सेटअप संभालते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "naming-ceremony-photography": {
    tagline: "पहला नाम, हमेशा के लिए याद",
    description: "आपके बेबी के नामकरण दिवस की गर्म और सावधान कवरेज — रस्में, परिवार और आपके बेबी के शुरुआती पलों को दस्तावेज़ किया हुआ.",
    longDescription: "नामकरण समारोह, चाहे पारंपरिक नामकरण हो, आधुनिक नेमिंग पार्टी हो, या धार्मिक नाम-देने की रस्म हो, आपके नवजात के लिए पहला बड़ा अवसर होता है. परिवार इकट्ठा होता है, रस्में की जाती हैं, और बच्चे को उनका नाम मिलता है — भावना और सांस्कृतिक महत्व से भरा एक पल. Orvex Visuals इन समारोहों को उसी देखभाल के साथ दस्तावेज़ करता है जो हम शादियों के लिए लाते हैं.",
    packages: [
      { features: ["सेरेमनी कवरेज", "1 फोटोग्राफर", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["पूरी इवेंट कवरेज", "2 फोटोग्राफर", "200+ एडिटेड फोटोज़", "25-शीट एल्बम"] },
      { features: ["पूरी कवरेज", "2 फोटोग्राफर", "बेबी पोर्ट्रेट्स", "300+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "रस्म और सेरेमनी दस्तावेज़ीकरण",
      "बेबी और फैमिली पोर्ट्रेट सेशन",
      "डेकोरेशन और डिटेल शॉट्स",
      "कैंडिड गेस्ट और फैमिली मोमेंट्स",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम सेरेमनी शेड्यूल, रस्मों और परिवार की संरचना पर चर्चा करते हैं." },
      { step: "आगमन", description: "हम सेटअप और वेन्यू डेकोरेशन शॉट्स के लिए जल्दी पहुंचते हैं." },
      { step: "कवरेज", description: "सभी रस्मों, फैमिली मोमेंट्स और बेबी पोर्ट्रेट्स की पूरी कवरेज." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आप सेरेमनी के दौरान बेबी के क्लोज़-अप शॉट्स ले सकते हैं?", a: "हाँ. हम उचित लेंस इस्तेमाल करते हैं जो रस्मों को बाधित किए बिना पास से शूट करने देते हैं." },
      { q: "क्या आप घर पर नामकरण समारोह कवर करते हैं?", a: "हाँ. हम घरेलू समारोह, बैंक्वेट हॉल और आउटडोर वेन्यू सभी कवर करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "cradle-ceremony-photography": {
    tagline: "पवित्र पहली रस्म, खूबसूरती से दस्तावेज़",
    description: "क्रैडल सेरेमनी (तोट्टिलु) की प्रोफेशनल कवरेज — सभी रस्में, परिवार के आशीर्वाद और आपके बेबी के अनमोल शुरुआती पल.",
    longDescription: "क्रैडल सेरेमनी, जिसे दक्षिण भारतीय परंपरा में तोट्टिलु के नाम से जाना जाता है, नवजात के लिए एक महत्वपूर्ण प्रारंभिक मील-स्टोन है. परिवार इकट्ठा होता है, बड़े-बुज़ुर्ग बच्चे को आशीर्वाद देते हैं, और पारंपरिक रस्मों के साथ बच्चे को पहली बार पालने में रखा जाता है. Orvex Visuals पूरी सेरेमनी को डॉक्यूमेंट्री संवेदनशीलता और उन कैंडिड पारिवारिक पलों पर नज़र रखते हुए कवर करता है जो इसे वास्तव में यादगार बनाते हैं.",
    packages: [
      { features: ["सेरेमनी कवरेज", "1 फोटोग्राफर", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["पूरी इवेंट कवरेज", "2 फोटोग्राफर", "200+ एडिटेड फोटोज़", "25-शीट एल्बम"] },
      { features: ["पूरी कवरेज", "बेबी पोर्ट्रेट्स", "फैमिली पोर्ट्रेट्स", "300+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "पूरी क्रैडल सेरेमनी रस्म दस्तावेज़ीकरण",
      "बेबी और फैमिली पोर्ट्रेट सेशन",
      "बड़ों के आशीर्वाद और पारिवारिक इंटरेक्शन शॉट्स",
      "डेकोरेशन और डिटेल फोटोग्राफी",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम सेरेमनी शेड्यूल और सांस्कृतिक तत्वों के बारे में जानते हैं." },
      { step: "सेटअप कवरेज", description: "हम डेकोरेशन और तैयारी के शॉट्स के लिए जल्दी पहुंचते हैं." },
      { step: "सेरेमनी कवरेज", description: "सभी रस्मों और फैमिली मोमेंट्स का पूरा दस्तावेज़ीकरण." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "तोट्टिलु सेरेमनी क्या है?", a: "तोट्टिलु एक दक्षिण भारतीय परंपरा है जिसमें परिवार के आशीर्वाद और रस्मों के साथ नवजात को पहली बार सजे हुए पालने में रखा जाता है." },
      { q: "क्या आप नामकरण और क्रैडल सेरेमनी दोनों एक साथ कवर कर सकते हैं?", a: "हाँ. हम एक ही बुकिंग में दोनों फंक्शन कवर कर सकते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "upanayana-photography": {
    tagline: "एक पवित्र मील-स्टोन, सम्मानपूर्वक कैद",
    description: "उपनयन (जनेऊ) धागा समारोह की सम्मानजनक और प्रोफेशनल फोटोग्राफी — सभी रस्में, परिवार के पल और आशीर्वाद दस्तावेज़ किए हुए.",
    longDescription: "उपनयन, या पवित्र धागा समारोह, ब्राह्मण और अन्य हिंदू समुदायों में एक महत्वपूर्ण उम्र-का-अनुष्ठान है. इसमें विस्तृत रस्में, मंत्र उच्चारण, परिवार के आशीर्वाद और पवित्र धागे की बंधाई शामिल होती है. Orvex Visuals इन समारोहों को उनकी पवित्र प्रकृति के प्रति पूर्ण सम्मान के साथ देखता है — विवेकपूर्वक काम करते हुए, सभी रस्में कवर करते हुए.",
    packages: [
      { features: ["सेरेमनी कवरेज", "1 फोटोग्राफर", "150+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["पूरे दिन कवरेज", "2 फोटोग्राफर", "300+ एडिटेड फोटोज़", "25-शीट एल्बम"] },
      { features: ["पूरी कवरेज", "2+ फोटोग्राफर", "रस्म क्लोज़-अप", "500+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "शुरू से अंत तक पूरी रस्म दस्तावेज़ीकरण",
      "धागा बंधाई और मुख्य रस्मों के क्लोज़-अप",
      "परिवार के आशीर्वाद और पोर्ट्रेट मोमेंट्स",
      "गेस्ट और विस्तृत परिवार की कवरेज",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम सेरेमनी शेड्यूल, रस्मों का क्रम और प्राथमिकता वाले पलों पर चर्चा करते हैं." },
      { step: "तैयारी", description: "हम वेन्यू डेकोरेशन और प्री-सेरेमनी तैयारियों के लिए जल्दी पहुंचते हैं." },
      { step: "सेरेमनी कवरेज", description: "सभी रस्मों और फैमिली मोमेंट्स की विवेकपूर्ण और पूरी कवरेज." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आप उपनयन रस्मों को समझते हैं?", a: "हाँ. हमने कई धागा समारोह कवर किए हैं और रस्मों का क्रम और महत्वपूर्ण पल समझते हैं." },
      { q: "क्या आप रस्मों के दौरान विवेकपूर्वक काम कर सकते हैं?", a: "बिल्कुल. हम सेरेमनी को बाधित किए बिना शांतिपूर्वक काम करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "shastipurthi-photography": {
    tagline: "साठ साल की ज़िंदगी, उतनी भव्यता के साथ",
    description: "षष्टिपूर्ति 60वें जन्मदिन की मील-स्टोन फोटोग्राफी — रस्में, श्रद्धांजलियाँ, परिवार का जमावड़ा, सब भव्यता से दस्तावेज़.",
    longDescription: "षष्टिपूर्ति 60वें जन्मदिन को चिह्नित करती है — हिंदू संस्कृति में अत्यधिक महत्व का एक मील-स्टोन, जिसे विस्तृत रस्मों, परिवार के जमावड़े और हृदयस्पर्शी श्रद्धांजलियों के साथ मनाया जाता है. इसमें एक धार्मिक समारोह, एक पारिवारिक पुनर्मिलन और एक जश्न के तत्व शामिल होते हैं. हमारे फोटोग्राफर अवसर के भावनात्मक भार को समझते हैं और इसे पूरी देखभाल के साथ दस्तावेज़ करते हैं.",
    packages: [
      { features: ["सेरेमनी कवरेज", "1 फोटोग्राफर", "150+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["पूरे दिन कवरेज", "2 फोटोग्राफर", "300+ एडिटेड फोटोज़", "25-शीट एल्बम"] },
      { features: ["पूरी कवरेज", "2+ फोटोग्राफर", "रस्म + सेलिब्रेशन", "500+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "धार्मिक सेरेमनी और रस्म दस्तावेज़ीकरण",
      "फैमिली पोर्ट्रेट और ग्रुप फोटोज़",
      "गेस्ट और सेलिब्रेशन कैंडिड कवरेज",
      "श्रद्धांजलि और भाषण के पल",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम सेरेमनी प्रोग्राम, वेन्यू और मुख्य रस्म के पलों पर चर्चा करते हैं." },
      { step: "आगमन", description: "सेटअप, डेकोरेशन और प्री-सेरेमनी कवरेज के लिए जल्दी आगमन." },
      { step: "कवरेज", description: "पूरे दिन रस्म और जश्न की पूरी कवरेज." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या षष्टिपूर्ति पूरे दिन का कार्यक्रम है?", a: "अधिकांश षष्टिपूर्ति सेलिब्रेशन सुबह की रस्मों और शाम के जश्न के साथ पूरे दिन चलते हैं. हमारे फुल-डे पैकेज दोनों कवर करते हैं." },
      { q: "क्या आप श्रद्धांजलियाँ और भाषण कैद कर सकते हैं?", a: "हाँ. हम विशेष रूप से श्रद्धांजलियों और भावनात्मक पारिवारिक पलों को कवर करने के लिए खुद को स्थित करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "puberty-ceremony-photography": {
    tagline: "एक मील-स्टोन, सम्मान के साथ",
    description: "उम्र-की-रस्मों और समारोहों की सम्मानजनक और प्रोफेशनल कवरेज — हर रस्म और पारिवारिक पल सावधानी से दस्तावेज़.",
    longDescription: "उम्र-की-रस्में गहरे व्यक्तिगत पारिवारिक कार्यक्रम हैं जो समुदायों में काफी भिन्न होते हैं. हमारे फोटोग्राफर उन्हें गोपनीयता, सांस्कृतिक संदर्भ और परिवार की इच्छाओं के प्रति पूर्ण सम्मान के साथ देखते हैं. हम परिवार के निर्देश पर काम करते हैं और ऐसी तस्वीरें डिलीवर करते हैं जो अवसर को सम्मान दें.",
    packages: [
      { features: ["सेरेमनी कवरेज", "1 फोटोग्राफर", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["पूरे दिन कवरेज", "2 फोटोग्राफर", "200+ एडिटेड फोटोज़", "25-शीट एल्बम"] },
      { features: ["पूरी कवरेज", "फैमिली पोर्ट्रेट्स", "रस्म दस्तावेज़ीकरण", "300+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "सेरेमनी और रस्म दस्तावेज़ीकरण",
      "फैमिली पोर्ट्रेट सेशन",
      "गेस्ट और जमावड़े की कवरेज",
      "विवेकपूर्ण और सम्मानजनक फोटोग्राफी",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम सेरेमनी प्लान, परिवार की प्राथमिकताएं और कवरेज सीमाएं पर चर्चा करते हैं." },
      { step: "कवरेज", description: "सभी सेरेमनी और फैमिली मोमेंट्स की प्रोफेशनल और विवेकपूर्ण कवरेज." },
      { step: "एडिटिंग", description: "फोटोज़ कलर-ग्रेड और तैयार की जाती हैं." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "आप संवेदनशील पारिवारिक समारोहों को कैसे संभालते हैं?", a: "हम पूरी तरह परिवार के निर्देश पर काम करते हैं. गोपनीयता और सम्मान हमारी सर्वोच्च प्राथमिकताएं हैं." },
      { q: "क्या आप महिला फोटोग्राफर उपलब्ध करा सकते हैं?", a: "हाँ. महिला फोटोग्राफर अनुरोध पर उपलब्ध हैं — कृपया बुकिंग करते समय यह बताएं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "holy-communion-photography": {
    tagline: "एक पवित्र पल, खूबसूरती से संरक्षित",
    description: "फर्स्ट होली कम्यूनियन, बैप्टिज़्म और कन्फर्मेशन सेरेमनी की प्रोफेशनल फोटोग्राफी — आध्यात्मिक और पारिवारिक पल सम्मानपूर्वक कैद.",
    longDescription: "फर्स्ट होली कम्यूनियन, बैप्टिज़्म और कन्फर्मेशन ईसाई धर्म में पवित्र मील-स्टोन हैं. ये समारोह परिवारों के लिए गहरे अर्थपूर्ण होते हैं और सावधान, सम्मानजनक दस्तावेज़ीकरण के हकदार हैं. हमारे फोटोग्राफर चर्च का शिष्टाचार समझते हैं, आधिकारिक पुजारी के पोज़िशनिंग दिशा-निर्देशों के भीतर काम करते हैं, और ऐसी तस्वीरें देते हैं जो दिन के आध्यात्मिक महत्व और पारिवारिक खुशी दोनों को दर्शाती हैं.",
    packages: [
      { features: ["सेरेमनी कवरेज", "1 फोटोग्राफर", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["सेरेमनी + रिसेप्शन", "2 फोटोग्राफर", "200+ एडिटेड फोटोज़", "25-शीट एल्बम"] },
      { features: ["पूरे दिन कवरेज", "2+ फोटोग्राफर", "पोर्ट्रेट सेशन", "300+ एडिटेड फोटोज़", "40-शीट एल्बम"] },
    ],
    includes: [
      "चर्च सेरेमनी कवरेज",
      "फैमिली पोर्ट्रेट सेशन",
      "रिसेप्शन और सेलिब्रेशन कवरेज",
      "ऑफिशिएटिंग पुजारी के साथ सम्मानजनक कोऑर्डिनेशन",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम सेरेमनी लोकेशन, शेड्यूल और किसी भी चर्च फोटोग्राफी गाइडलाइन पर चर्चा करते हैं." },
      { step: "कोऑर्डिनेशन", description: "हम चर्च से पोज़िशनिंग नियम समझने के लिए संपर्क करते हैं." },
      { step: "कवरेज", description: "सेटिंग के पूर्ण सम्मान के साथ सेरेमनी और जश्न की कवरेज." },
      { step: "डिलीवरी", description: "5 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या आपको चर्च फोटोग्राफी का अनुभव है?", a: "हाँ. हमने बेंगलुरु में कई कैथोलिक और प्रोटेस्टेंट समारोह कवर किए हैं." },
      { q: "क्या आप सेरेमनी के बाद रिसेप्शन कवर करते हैं?", a: "हाँ. Premium और Luxury पैकेज में रिसेप्शन कवरेज शामिल है." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "newborn-photography": {
    tagline: "दस नन्ही उंगलियाँ, हमेशा के लिए याद",
    description: "पहले 14 दिनों में नाज़ुक और कलात्मक न्यूबॉर्न पोर्ट्रेट्स — सुरक्षित, गर्म और खूबसूरती से रोशन, आपके घर या हमारे स्टूडियो में.",
    longDescription: "न्यूबॉर्न विंडो — आदर्श रूप से 5 से 14 दिन की उम्र — वह समय होता है जब बच्चे सबसे गहरी नींद लेते हैं और सबसे खूबसूरत पोज़ में करवट लेते हैं. यह छोटी खिड़की जल्दी बंद हो जाती है. हमारे न्यूबॉर्न फोटोग्राफर सुरक्षित पोज़िंग तकनीकों में प्रशिक्षित हैं, नरम नेचुरल-स्टाइल लाइटिंग का उपयोग करते हैं, और सेशन के लिए एक शांत, गर्म वातावरण बनाते हैं.",
    packages: [
      { features: ["2 थीम सेटअप", "20+ एडिटेड फोटोज़", "होम विजिट", "बेबी-सेफ प्रॉप्स", "डिजिटल डिलीवरी"] },
      { features: ["4 थीम सेटअप", "50+ एडिटेड फोटोज़", "होम या स्टूडियो", "प्रीमियम प्रॉप्स", "फैमिली पोर्ट्रेट्स", "ऑनलाइन गैलरी"] },
      { features: ["पूरा सेशन", "100+ एडिटेड फोटोज़", "स्टूडियो", "फैमिली + सिब्लिंग पोर्ट्रेट्स", "25-शीट एल्बम", "उसी हफ्ते डिलीवरी"] },
    ],
    includes: [
      "सर्टिफाइड सेफ न्यूबॉर्न पोज़िंग तकनीकें",
      "बेबी-सेफ प्रॉप्स और रैप्स",
      "सॉफ्ट नेचुरल-लाइट सेटअप",
      "फैमिली और पेरेंट पोर्ट्रेट्स",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम 5-14 दिन की विंडो के भीतर शेड्यूल करते हैं और सेशन बेबी के शेड्यूल के अनुसार प्लान करते हैं." },
      { step: "सेटअप", description: "थीम्ड प्रॉप्स और बैकड्रॉप के साथ एक गर्म, सुरक्षित वातावरण तैयार किया जाता है." },
      { step: "सेशन", description: "फीडिंग और सेटलिंग के लिए पूरे ब्रेक्स के साथ धैर्यपूर्ण और सौम्य सेशन." },
      { step: "डिलीवरी", description: "5-7 दिनों के भीतर एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "न्यूबॉर्न फोटोग्राफी के लिए आदर्श उम्र क्या है?", a: "5-14 दिन आदर्श है. इस विंडो में बच्चे गहरी नींद लेते हैं और अधिक स्वाभाविक रूप से पोज़ करते हैं." },
      { q: "क्या न्यूबॉर्न पोज़िंग सुरक्षित है?", a: "हाँ. हमारे फोटोग्राफर सुरक्षित पोज़िंग में प्रशिक्षित हैं. बेबी की कम्फर्ट और सुरक्षा सबसे पहले हैं." },
      { q: "क्या आप घर पर शूट करते हैं?", a: "हाँ. न्यूबॉर्न के लिए घरेलू सेशन हमारा सबसे लोकप्रिय विकल्प है." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "indoor-maternity-photoshoot": {
    tagline: "ताकत, सौंदर्य और नई ज़िंदगी",
    description: "बहते कपड़ों, नाटकीय लाइटिंग और कलात्मक सिल्हुएट शॉट्स के साथ स्टूडियो मैटरनिटी पोर्ट्रेट्स — एक अंतरंग और एलीगेंट इनडोर सेशन.",
    longDescription: "इनडोर मैटरनिटी फोटोशूट लाइटिंग, बैकड्रॉप और माहौल का पूरा नियंत्रण प्रदान करता है — जिससे एक ऐसी कलात्मकता सक्षम होती है जो आउटडोर सेशन हमेशा हासिल नहीं कर पाते. हमारे स्टूडियो सेशन बहते कपड़े, सिनेमैटिक लाइटिंग और सिल्हुएट तकनीकों का उपयोग करते हैं जो ऐसे मैटरनिटी पोर्ट्रेट्स बनाते हैं जो एलीगेंट और सशक्त दोनों हों. सेशन आरामदायक, गर्म और पूरी तरह आपकी गति से डिज़ाइन किया गया है.",
    packages: [
      { features: ["स्टूडियो सेशन", "2 आउटफिट चेंज", "50+ एडिटेड फोटोज़", "ऑनलाइन गैलरी"] },
      { features: ["स्टूडियो सेशन", "4 आउटफिट चेंज", "100+ एडिटेड फोटोज़", "सिल्हुएट शॉट्स", "पार्टनर शामिल", "25-शीट एल्बम"] },
      { features: ["पूरा स्टूडियो सेशन", "6 आउटफिट चेंज", "200+ एडिटेड फोटोज़", "शॉर्ट मैटरनिटी फिल्म", "फैमिली पोर्ट्रेट्स", "40-शीट एल्बम"] },
    ],
    includes: [
      "पूरी तरह नियंत्रित स्टूडियो लाइटिंग सेटअप",
      "बहते कपड़े और प्रॉप स्टाइलिंग",
      "सिल्हुएट और कलात्मक कंपोज़िशन",
      "पार्टनर और फैमिली पोर्ट्रेट विकल्प",
      "प्रोफेशनली एडिटेड फोटोज़",
      "प्राइवेट ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम आपकी गर्भावस्था के स्टेज और कम्फर्ट के आसपास आउटफिट, थीम और टाइमिंग प्लान करते हैं." },
      { step: "सेटअप", description: "स्टूडियो को आपके प्लान्ड थीम्स के अनुसार कपड़े, लाइटिंग और बैकड्रॉप से स्टाइल किया जाता है." },
      { step: "सेशन", description: "पूरे ब्रेक्स के साथ आरामदायक सेशन, आपकी अपनी गति से." },
      { step: "डिलीवरी", description: "7 दिनों के भीतर एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "मैटरनिटी शूट के लिए सबसे अच्छा समय कब है?", a: "28-34 हफ्ते आदर्श है — बेबी बंप सुंदर रूप से उभरा होता है और माँ आरामदायक होती हैं." },
      { q: "क्या पहनें?", a: "हम कपड़े और प्रॉप्स देते हैं. आप अपने पर्सनल आउटफिट भी ला सकती हैं. हम गाइड करेंगे." },
      { q: "क्या मेरा पार्टनर भी शामिल हो सकता है?", a: "बिल्कुल. Gold और Platinum पैकेज में पार्टनर पोर्ट्रेट्स शामिल हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "cinematic-videography": {
    tagline: "आपकी कहानी, फिल्म-ग्रेड खूबसूरत",
    description: "शादियों, बर्थडे और इवेंट्स के लिए प्रोफेशनल सिनेमा-क्वालिटी वीडियोग्राफी — कलर-ग्रेडेड हाइलाइट फिल्म्स, ओरिजिनल ऑडियो और संगीत के साथ.",
    longDescription: "सिनेमैटिक वीडियोग्राफी आपके इवेंट को एक सच्ची फिल्म में बदल देती है. हमारे सिनेमाटोग्राफर सिनेमा-ग्रेड कैमरे और लेंस, प्रोफेशनल कलर ग्रेडिंग और सावधानी से चुने गए संगीत का उपयोग करते हैं ताकि ऐसी फिल्म बने जो किसी ज़रूरी चीज़ के शुरुआती दृश्य जैसी लगे. 3 मिनट के वेडिंग हाइलाइट रील से 15 मिनट के इवेंट डॉक्यूमेंट्री तक, हर फ्रेम सोच-समझकर कंपोज़ और एडिट किया जाता है.",
    packages: [
      { features: ["हाइलाइट फिल्म (3 मिनट)", "1 वीडियोग्राफर", "कलर ग्रेडेड", "ऑनलाइन डिलीवरी"] },
      { features: ["हाइलाइट फिल्म (5-8 मिनट)", "2 वीडियोग्राफर", "फुल एडिट + हाइलाइट", "ऑडियो सिंक", "कलर ग्रेडेड"] },
      { features: ["हाइलाइट फिल्म (10+ मिनट)", "2+ वीडियोग्राफर", "ड्रोन फुटेज", "सेम-डे एडिट", "DCI-ग्रेड कलर"] },
    ],
    includes: [
      "सिनेमा-ग्रेड कैमरा और लेंस सेटअप",
      "प्रोफेशनल कलर ग्रेडिंग (LUT-आधारित)",
      "ऑडियो रिकॉर्डिंग और सिंक",
      "हाइलाइट फिल्म एडिट",
      "प्राइवेट लिंक से ऑनलाइन डिलीवरी",
      "बैकअप इक्विपमेंट ऑन-साइट",
    ],
    process: [
      { step: "परामर्श", description: "हम आपकी विज़न, स्टाइल रेफरेंस और इवेंट शेड्यूल पर चर्चा करते हैं." },
      { step: "प्लानिंग", description: "शॉट लिस्ट, कवरेज प्लान और म्यूज़िक ब्रीफ फाइनलाइज़ किए जाते हैं." },
      { step: "फिल्मिंग", description: "इवेंट के दौरान प्रोफेशनल सिनेमाटोग्राफी." },
      { step: "डिलीवरी", description: "15 दिनों के भीतर हाइलाइट फिल्म डिलीवर." },
    ],
    faqs: [
      { q: "सिनेमैटिक बनाम पारंपरिक वीडियो में क्या अंतर है?", a: "सिनेमैटिक वीडियो नेरेटिव स्ट्रक्चर, कलर ग्रेडिंग और संगीत के साथ एडिट किया जाता है. पारंपरिक वीडियो इवेंट का पूरा अनएडिटेड डॉक्यूमेंटेशन है." },
      { q: "हाइलाइट फिल्म कितनी लंबी होगी?", a: "पैकेज के आधार पर आमतौर पर 3-10 मिनट." },
      { q: "क्या सेम-डे एडिट मिल सकती है?", a: "हाँ. Luxury पैकेज में और ऐड-ऑन के रूप में सेम-डे एडिट उपलब्ध है." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "candid-videography": {
    tagline: "बिना स्क्रिप्ट, अविस्मरणीय",
    description: "नेचुरल, डॉक्यूमेंट्री-स्टाइल वीडियो कवरेज — असली पल, सच्ची बातें और आपके इवेंट का सही माहौल कैद.",
    longDescription: "कैंडिड वीडियोग्राफी ज़िंदगी को जैसी होती है वैसे ही कैद करने के बारे में है — बिना निर्देशन, बिना स्टेजिंग, बस देखते और फिल्माते हुए. हमारे कैंडिड वीडियोग्राफर दखल दिए बिना मौजूद रहने में कुशल हैं, आपके इवेंट में स्वतंत्र रूप से घूमने के लिए कॉम्पेक्ट सिनेमा इक्विपमेंट और हैंडहेल्ड तकनीकों का उपयोग करते हैं. परिणामस्वरूप फिल्म आपके दिन का एक सच्चा चित्र है.",
    packages: [
      { features: ["कैंडिड डॉक्यूमेंट्री फिल्म", "1 वीडियोग्राफर", "कलर ग्रेडेड", "ऑनलाइन डिलीवरी"] },
      { features: ["कैंडिड + हाइलाइट फिल्म", "2 वीडियोग्राफर", "नेचुरल साउंड एडिट", "कलर ग्रेडेड"] },
      { features: ["पूरी कैंडिड डॉक्यूमेंट्री", "2+ वीडियोग्राफर", "ड्रोन फुटेज", "नेचुरल + म्यूज़िक एडिट"] },
    ],
    includes: [
      "डॉक्यूमेंट्री-स्टाइल अनस्क्रिप्टेड कवरेज",
      "हैंडहेल्ड और नेचुरल-मूवमेंट सिनेमाटोग्राफी",
      "नेचुरल साउंड कैप्चर और सिंक",
      "कलर ग्रेडिंग और एडिट",
      "प्राइवेट लिंक से ऑनलाइन डिलीवरी",
      "बैकअप इक्विपमेंट ऑन-साइट",
    ],
    process: [
      { step: "परामर्श", description: "हम आपके इवेंट, मुख्य पलों और कवरेज की अपेक्षाओं पर चर्चा करते हैं." },
      { step: "प्लानिंग", description: "कवरेज लॉजिस्टिक्स और इक्विपमेंट प्लान फाइनलाइज़ किया जाता है." },
      { step: "फिल्मिंग", description: "आपके इवेंट के दौरान अनस्क्रिप्टेड डॉक्यूमेंट्री कवरेज." },
      { step: "डिलीवरी", description: "15 दिनों के भीतर एडिटेड फिल्म डिलीवर." },
    ],
    faqs: [
      { q: "कैंडिड वीडियोग्राफी और सिनेमैटिक में क्या अंतर है?", a: "कैंडिड वीडियो कम निर्देशन के साथ नेचुरल डॉक्यूमेंट्री कवरेज पर ध्यान देता है. सिनेमैटिक वीडियो में अधिक नेरेटिव स्ट्रक्चर और प्रोडक्शन शामिल होती है." },
      { q: "क्या वीडियो में संगीत होगा?", a: "हम आपकी पसंद के अनुसार संगीत के साथ या बिना संगीत के डिलीवर कर सकते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "drone-photography": {
    tagline: "बड़ी तस्वीर, खूबसूरती से शॉट",
    description: "लाइसेंस प्राप्त ड्रोन ऑपरेटर द्वारा शादियों, इवेंट्स, वेन्यूज़ और कॉर्पोरेट शूट के लिए प्रोफेशनल एरियल फोटोग्राफी और वीडियोग्राफी.",
    longDescription: "एरियल कवरेज आपकी इवेंट यादों को बदल देती है — वेन्यू का एक स्वीपिंग शॉट, ऊपर से भीड़, पचास फीट ऊपर से फ्रेम में आता कपल. Orvex Visuals लाइसेंस प्राप्त और बीमाकृत ड्रोन ऑपरेटरों के साथ प्रोफेशनल सिनेमा-ग्रेड एरियल इक्विपमेंट का उपयोग करके काम करता है. सभी ड्रोन सेशन DGCA नियमों और वेन्यू परमिशन के अनुपालन में किए जाते हैं.",
    packages: [
      { features: ["एरियल फोटोज़", "एरियल वीडियो (रॉ)", "लाइसेंस्ड ऑपरेटर", "DGCA कम्प्लायंट"] },
      { features: ["एरियल फोटोज़ + एडिटेड वीडियो", "हाइलाइट रील इंटीग्रेशन", "कलर ग्रेडेड", "लाइसेंस्ड ऑपरेटर"] },
      { features: ["पूरी एरियल कवरेज", "सिनेमैटिक इंटीग्रेशन", "सेम-डे टीज़र", "कलर ग्रेडेड", "पूरे दिन ड्रोन एक्सेस"] },
    ],
    includes: [
      "लाइसेंस प्राप्त DGCA-कम्प्लायंट ड्रोन ऑपरेटर",
      "सिनेमा-ग्रेड एरियल फुटेज",
      "एरियल फोटोग्राफी स्टिल्स",
      "वेन्यू परमिशन कोऑर्डिनेशन सपोर्ट",
      "मेन फोटो/वीडियो एडिट के साथ इंटीग्रेशन",
      "ऑनलाइन डिलीवरी",
    ],
    process: [
      { step: "परामर्श", description: "हम वेन्यू, इवेंट टाइप और एरियल कवरेज ज़रूरतों पर चर्चा करते हैं." },
      { step: "परमिशन चेक", description: "हम वेन्यू और एयरस्पेस परमिशन कोऑर्डिनेट करने में मदद करते हैं." },
      { step: "एरियल कवरेज", description: "लाइसेंस प्राप्त ड्रोन ऑपरेटर इवेंट के दौरान फुटेज कैप्चर करता है." },
      { step: "डिलीवरी", description: "एडिटेड एरियल फुटेज मेन एडिट के साथ या बिना डिलीवर." },
    ],
    faqs: [
      { q: "क्या इनडोर वेन्यू पर ड्रोन उड़ाना अनुमत है?", a: "इनडोर ड्रोन फ्लाइट वेन्यू और सेफ्टी असेसमेंट के अधीन है. हम कंसल्टेशन में इस पर सलाह देते हैं." },
      { q: "क्या आपके ड्रोन ऑपरेटर लाइसेंस प्राप्त हैं?", a: "हाँ. हमारे सभी ड्रोन ऑपरेटर वैध DGCA रिमोट पायलट सर्टिफिकेट रखते हैं." },
      { q: "क्या ड्रोन फुटेज मेरे फोटोग्राफी पैकेज के साथ मिल सकती है?", a: "हाँ. ड्रोन किसी भी फोटोग्राफी या वीडियोग्राफी पैकेज के ऐड-ऑन के रूप में उपलब्ध है." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  // ── Ancillary Standalone Service Pages (Hindi) ────────────────────────
  "family-photoshoot": {
    tagline: "आपका परिवार, खूबसूरती से साथ",
    description: "स्टूडियो या आउटडोर सेटिंग में प्रोफेशनल फैमिली पोर्ट्रेट्स — सभी उम्र, सभी परिवार के साइज़, गर्मजोशी से फोटोग्राफ किए हुए.",
    longDescription: "फैमिली फोटोशूट सबसे सरल और सबसे स्थायी उपहार है जो आप अपने परिवार को दे सकते हैं. Orvex Visuals आरामदायक, स्वाभाविक फैमिली पोर्ट्रेट्स बनाता है जो आपके परिवार को वैसे कैद करते हैं जैसा वह वास्तव में है — कठोरता से पोज़ नहीं किया हुआ, बल्कि सच्चे तौर पर एक साथ. हम सभी आकार के परिवारों के साथ काम करते हैं — हरे-भरे बगीचों, हेरिटेज पार्कों, आरामदायक घरेलू माहौल और हमारे स्टूडियो में.",
    packages: [
      { features: ["1 लोकेशन", "1 आउटफिट", "30+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "डिजिटल डिलीवरी"] },
      { features: ["1-2 लोकेशन", "2 आउटफिट", "60+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "पोज़िंग गाइडेंस"] },
      { features: ["2 लोकेशन", "3 आउटफिट", "100+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "एक्सटेंडेड शूट", "कैनवस प्रिंट शामिल"] },
    ],
    includes: [
      "आउटफिट और कलर कोऑर्डिनेशन गाइडेंस",
      "सभी परिवार के सदस्यों के लिए नेचुरल पोज़िंग डायरेक्शन",
      "आउटडोर के लिए लोकेशन स्काउटिंग या स्टूडियो सेटअप",
      "प्रोफेशनली एडिटेड हाई-रिज़ॉल्यूशन फोटोज़",
      "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
      "चुनिंदा फोटोज़ का सेम-डे स्नीक पीक",
    ],
    process: [
      { step: "परामर्श", description: "हम लोकेशन, परिवार का साइज़, आउटफिट और टाइमिंग पर चर्चा करते हैं." },
      { step: "तैयारी", description: "हम स्टाइलिंग गाइड शेयर करते हैं और सेशन प्लान कन्फर्म करते हैं." },
      { step: "सेशन", description: "स्वाभाविक दिखने वाले पोर्ट्रेट्स के लिए सौम्य गाइडेंस के साथ आरामदायक और मज़ेदार सेशन." },
      { step: "डिलीवरी", description: "5-7 दिनों के भीतर प्राइवेट गैलरी से एडिटेड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या पहनें?", a: "हम कलर कोऑर्डिनेशन गाइड देते हैं. आम तौर पर कोऑर्डिनेटेड टोन, आरामदायक कपड़े और बहुत ज़्यादा बिज़ी पैटर्न से बचना सबसे अच्छा रहता है." },
      { q: "क्या दादा-दादी या विस्तृत परिवार शामिल हो सकते हैं?", a: "बिल्कुल. हम नियमित रूप से बड़े पारिवारिक ग्रुप संभालते हैं." },
      { q: "आउटडोर या स्टूडियो?", a: "दोनों उपलब्ध हैं. आउटडोर सेशन मौसम पर निर्भर करते हैं; बारिश के लिए हम मुफ्त रीशेड्यूल ऑफर करते हैं." },
      { q: "हमें कितनी फोटोज़ मिलेंगी?", a: "आपके सेशन में 30 से 100+ प्रोफेशनली एडिटेड फोटोज़ मिलती हैं, जो सेशन की अवधि और स्कोप पर निर्भर करता है." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "video-editing-services": {
    tagline: "आपका फुटेज, प्रोफेशनली फिनिश्ड",
    description: "वेडिंग, इवेंट और पर्सनल फुटेज के लिए एक्सपर्ट पोस्ट-प्रोडक्शन — कलर ग्रेडिंग, हाइलाइट रील और सिनेमैटिक कट्स.",
    longDescription: "आपके पास फुटेज है — हम उसे एक फिल्म बनाते हैं. Orvex Visuals वेडिंग फिल्म, इवेंट रिकॉर्डिंग और पर्सनल वीडियो प्रोजेक्ट्स के लिए प्रोफेशनल वीडियो एडिटिंग प्रदान करता है. चाहे आपने अपने उपकरण से शूट किया हो या किसी अन्य वीडियोग्राफर के साथ, हमारी एडिटिंग टीम कलर ग्रेडिंग, नेरेटिव कटिंग, ऑडियो बैलेंसिंग और म्यूज़िक सिंक लागू करती है.",
    packages: [
      { features: ["2 घंटे तक रॉ फुटेज", "हाइलाइट रील (3-5 मिनट)", "कलर ग्रेडिंग", "म्यूज़िक सिंक", "ऑनलाइन डिलीवरी"] },
      { features: ["5 घंटे तक रॉ फुटेज", "हाइलाइट रील (5-10 मिनट)", "पूरी सेरेमनी एडिट", "कलर ग्रेडिंग", "ऑडियो बैलेंसिंग", "2 रिविज़न"] },
      { features: ["असीमित रॉ फुटेज", "पूरी इवेंट फिल्म", "मल्टी-कैमरा एडिट", "DCI कलर ग्रेड", "वॉयसओवर/टाइटल्स", "3 रिविज़न"] },
    ],
    includes: [
      "प्रोफेशनल कलर ग्रेडिंग और LUT एप्लीकेशन",
      "ऑडियो क्लीनअप, बैलेंसिंग और म्यूज़िक सिंक",
      "टाइटल कार्ड और ट्रांज़िशन डिज़ाइन",
      "मल्टीपल रिज़ॉल्यूशन फॉर्मेट में एक्सपोर्ट",
      "सुरक्षित क्लाउड फाइल डिलीवरी",
      "ब्रीफ में तय किए गए रिविज़न राउंड",
    ],
    process: [
      { step: "ब्रीफ", description: "आप रॉ फुटेज और अपनी विज़न शेयर करते हैं — स्टाइल रेफरेंस, म्यूज़िक प्राथमिकताएं और ज़रूरी आउटपुट." },
      { step: "एडिट ड्राफ्ट", description: "हमारे एडिटर आपके ब्रीफ के आधार पर पहला कट तैयार करते हैं." },
      { step: "रिव्यू", description: "आप रिव्यू करते हैं और फीडबैक देते हैं. प्रोजेक्ट ब्रीफ में सहमत रिविज़न लागू किए जाते हैं." },
      { step: "फाइनल डिलीवरी", description: "सुरक्षित क्लाउड लिंक से आपके ज़रूरी फॉर्मेट में फिनिश्ड फिल्म डिलीवर." },
    ],
    faqs: [
      { q: "आप कौन-से फॉर्मेट स्वीकार करते हैं?", a: "हम MP4, MOV, MXF और अधिकांश सामान्य कैमरा फॉर्मेट (Sony, Canon, DJI, GoPro आदि) के साथ काम करते हैं." },
      { q: "क्या आप किसी अन्य वीडियोग्राफर का फुटेज एडिट कर सकते हैं?", a: "हाँ. हम किसी भी फुटेज को एडिट करते हैं, चाहे किसने भी शूट किया हो." },
      { q: "एडिटिंग में कितना समय लगता है?", a: "आमतौर पर फुटेज की मात्रा और काम के दायरे के आधार पर 7-15 दिन." },
      { q: "क्या आप संगीत देते हैं?", a: "हाँ. हमारे पास लाइसेंस्ड म्यूज़िक लाइब्रेरी है. आप अपना पसंदीदा ट्रैक भी दे सकते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "corporate-video-production": {
    tagline: "आपका ब्रांड, प्रोफेशनली फिल्म पर",
    description: "कंपनी प्रोफाइल, प्रोडक्ट डेमो, टेस्टिमोनियल वीडियो, ट्रेनिंग कंटेंट और इवेंट रिकैप फिल्म — ब्रॉडकास्ट स्टैंडर्ड पर प्रोड्यूस किए हुए.",
    longDescription: "Orvex Visuals में कॉर्पोरेट वीडियो प्रोडक्शन बिज़नेस वीडियो की पूरी ज़रूरतों को कवर करती है: कंपनी प्रोफाइल फिल्म, प्रोडक्ट डेमो वीडियो, कस्टमर टेस्टिमोनियल क्लिप, इंटर्नल ट्रेनिंग कंटेंट और इवेंट रिकैप फिल्म. हम स्क्रिप्टिंग सपोर्ट, शूटिंग और पोस्ट-प्रोडक्शन को पूरी सर्विस या अलग-अलग कंपोनेंट के रूप में संभालते हैं.",
    packages: [
      { features: ["सिंगल-कैमरा शूट", "3 मिनट तक एडिट", "कलर ग्रेडेड", "ऑनलाइन डिलीवरी"] },
      { features: ["मल्टी-कैमरा विकल्प", "8 मिनट तक एडिट", "वॉयसओवर ट्रैक", "कलर ग्रेडेड", "2 रिविज़न"] },
      { features: ["पूरी प्रोडक्शन क्रू", "15 मिनट तक एडिट", "स्क्रिप्ट सपोर्ट", "मोशन ग्राफिक्स", "NDA उपलब्ध", "3 रिविज़न"] },
    ],
    includes: [
      "प्री-प्रोडक्शन प्लानिंग और स्क्रिप्टिंग सपोर्ट",
      "प्रोफेशनल सिनेमा-ग्रेड कैमरा सेटअप",
      "इनडोर/आउटडोर शूट के लिए लाइटिंग और ऑडियो",
      "पोस्ट-प्रोडक्शन एडिटिंग और कलर ग्रेडिंग",
      "वेब, सोशल और ब्रॉडकास्ट के लिए उपयुक्त फॉर्मेट में डिलीवरी",
      "अनुरोध पर NDA उपलब्ध",
    ],
    process: [
      { step: "ब्रीफ", description: "हम आपका बिज़नेस, ऑडियंस और वीडियो का उद्देश्य समझते हैं." },
      { step: "प्री-प्रोडक्शन", description: "स्क्रिप्ट आउटलाइन, शॉट लिस्ट, लोकेशन प्लान और टीम कन्फर्म." },
      { step: "शूट डे", description: "प्रोफेशनल क्रू प्रोडक्शन प्लान execute करती है." },
      { step: "पोस्ट-प्रोडक्शन", description: "एडिटिंग, ग्रेडिंग और सहमत टाइमलाइन के भीतर डिलीवरी." },
    ],
    faqs: [
      { q: "क्या आप स्क्रिप्टिंग संभालते हैं?", a: "हाँ. स्क्रिप्टिंग सपोर्ट उपलब्ध है — अपना ब्रीफ शेयर करें और हम इसे स्कोप चर्चा में शामिल करेंगे." },
      { q: "क्या एक दिन में कंपनी प्रोफाइल फिल्म बन सकती है?", a: "अधिकांश कंपनी प्रोफाइल के लिए हाँ. जटिल मल्टी-लोकेशन प्रोडक्शन के लिए अतिरिक्त दिन लग सकते हैं." },
      { q: "क्या आप NDA साइन करते हैं?", a: "हाँ. कॉर्पोरेट प्रोडक्शन के लिए हम अनुरोध पर स्टैंडर्ड NDA साइन करते हैं." },
      { q: "क्या आप बेंगलुरु के बाहर इवेंट कवर करते हैं?", a: "हाँ. आउटस्टेशन प्रोडक्शन के लिए ट्रैवल चार्ज लागू होते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "portrait-photography": {
    tagline: "आपकी बेस्ट प्रोफेशनल इमेज",
    description: "प्रोफेशनल हेडशॉट, LinkedIn प्रोफाइल, पर्सनल ब्रांडिंग पोर्ट्रेट और व्यक्तियों और टीमों के लिए एक्ज़ीक्यूटिव फोटोग्राफी.",
    longDescription: "आपकी प्रोफेशनल इमेज मायने रखती है. चाहे आपको LinkedIn हेडशॉट, पर्सनल ब्रांडिंग पोर्ट्रेट सीरीज़, ऑथर फोटो या एक्ज़ीक्यूटिव टीम शूट की ज़रूरत हो, Orvex Visuals ऐसे पोर्ट्रेट इमेज बनाता है जो शार्प, कॉन्फिडेंट और आपके जैसे हों. हम अपने स्टूडियो या लोकेशन पर काम करते हैं.",
    packages: [
      { features: ["स्टूडियो सेशन", "1 आउटफिट", "10+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "LinkedIn-रेडी एक्सपोर्ट"] },
      { features: ["स्टूडियो या ऑन-लोकेशन", "2 आउटफिट", "25+ एडिटेड फोटोज़", "बैकग्राउंड विकल्प", "ब्रांडिंग पैक"] },
      { features: ["10 लोगों तक", "कंसिस्टेंट बैकग्राउंड", "10+ एडिटेड फोटोज़ प्रत्येक", "टीम बैनर शॉट", "जल्दी डिलीवरी"] },
    ],
    includes: [
      "प्रोफेशनल स्टूडियो लाइटिंग सेटअप",
      "पोज़िंग और एक्सप्रेशन डायरेक्शन",
      "बैकग्राउंड और स्टाइल विकल्प",
      "प्रोफेशनली रीटच्ड इमेज",
      "वेब और प्रिंट रिज़ॉल्यूशन एक्सपोर्ट",
      "सेलेक्शन और डाउनलोड के लिए ऑनलाइन गैलरी",
    ],
    process: [
      { step: "परामर्श", description: "हम आपके उपयोग, इंडस्ट्री और पोर्ट्रेट की पसंदीदा स्टाइल पर चर्चा करते हैं." },
      { step: "सेटअप", description: "आपके सेशन के लिए स्टूडियो लाइटिंग और बैकग्राउंड कॉन्फ़िगर किए जाते हैं." },
      { step: "सेशन", description: "कॉन्फिडेंट, स्वाभाविक पोर्ट्रेट्स के लिए डायरेक्शन के साथ आरामदायक शूट." },
      { step: "डिलीवरी", description: "3-5 दिनों के भीतर रीटच्ड फोटोज़ डिलीवर." },
    ],
    faqs: [
      { q: "क्या पहनें?", a: "सॉलिड, प्रोफेशनल रंग सबसे अच्छे काम करते हैं. बिज़ी पैटर्न से बचें. हम सेशन से पहले प्रेप गाइड शेयर करते हैं." },
      { q: "क्या आप मेरे ऑफिस में शूट कर सकते हैं?", a: "हाँ. आपके ऑफिस या पसंदीदा लोकेशन पर शूट उपलब्ध है — अपना सेटअप बताने के लिए संपर्क करें." },
      { q: "कितनी फाइनल फोटोज़ मिलेंगी?", a: "सेशन स्कोप के आधार पर प्रत्येक व्यक्ति के लिए 10 से 25+ — विवरण ब्रीफिंग में तय होते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "portfolio-photography": {
    tagline: "दुनिया को दिखाएं आप क्या करते हैं",
    description: "मॉडल, एक्टर, आर्टिस्ट, डांसर और क्रिएटिव प्रोफेशनल्स के लिए प्रोफेशनल पोर्टफोलियो शूट — आपके क्राफ्ट को represent करने के लिए purposefully शूट.",
    longDescription: "एक मजबूत पोर्टफोलियो आपका सबसे महत्वपूर्ण प्रोफेशनल टूल है. Orvex Visuals पोर्टफोलियो शूट करता है जो आपके specific creative फील्ड के लिए tailored हैं. हम आपके साथ concept, outfit और location पर मिलकर काम करते हैं ताकि ऐसा पोर्टफोलियो तैयार हो जो वास्तव में आप जो करते हैं उसे represent करे.",
    packages: [
      { features: ["1 लोकेशन / सेटिंग", "2 लुक्स", "30+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "डिजिटल डिलीवरी"] },
      { features: ["2 लोकेशन", "4 लुक्स", "60+ एडिटेड फोटोज़", "ऑनलाइन गैलरी", "कॉन्सेप्ट प्लानिंग"] },
      { features: ["मल्टीपल लोकेशन", "6 लुक्स", "100+ एडिटेड फोटोज़", "कॉम्प कार्ड डिज़ाइन", "कॉन्सेप्ट + स्टाइलिंग सपोर्ट"] },
    ],
    includes: [
      "कॉन्सेप्ट और ब्रीफ प्लानिंग सेशन",
      "आउटडोर शूट के लिए लोकेशन स्काउटिंग",
      "प्रोफेशनल लाइटिंग (स्टूडियो या पोर्टेबल)",
      "पोज़िंग और एक्सप्रेशन डायरेक्शन",
      "प्रोफेशनली रीटच्ड पोर्टफोलियो इमेज",
      "हाई-रिज़ॉल्यूशन डिजिटल डिलीवरी",
    ],
    process: [
      { step: "कॉन्सेप्ट ब्रीफ", description: "हम उन लुक्स, लोकेशन और कहानी को प्लान करते हैं जो आप अपना पोर्टफोलियो बताना चाहते हैं." },
      { step: "तैयारी", description: "लोकेशन कन्फर्म, लाइटिंग प्लान सेट, वॉर्डरोब गाइड शेयर." },
      { step: "शूट डे", description: "एक versatile पोर्टफोलियो बनाने के लिए क्रिएटिव, purpose-driven सेशन." },
      { step: "डिलीवरी", description: "5-7 दिनों के भीतर एडिटेड पोर्टफोलियो इमेज डिलीवर." },
    ],
    faqs: [
      { q: "मैं मॉडलिंग में नई हूँ. क्या आप concepts में मदद कर सकते हैं?", a: "बिल्कुल. हम पहली बार मॉडल करने वालों को concept planning, posing और agencies क्या ढूंढती हैं, इसमें गाइड करते हैं." },
      { q: "क्या आप actors के headshots भी लेते हैं?", a: "हाँ. हम expression variety के साथ commercial और theatrical दोनों headshots produce करते हैं." },
      { q: "क्या outdoor और studio section दोनों हो सकते हैं?", a: "हाँ. आउटडोर और स्टूडियो दोनों सेटअप शामिल किए जा सकते हैं — अपनी शूट प्लान बताने के लिए संपर्क करें." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "fashion-photography": {
    tagline: "कपड़े जो देखे जाने के लिए बने हैं",
    description: "डिज़ाइनर, ब्रांड और boutiques के लिए editorial fashion shoots, lookbooks, catalog photography और campaign imagery.",
    longDescription: "Orvex Visuals में फैशन फोटोग्राफी डिज़ाइनर, क्लोथिंग ब्रांड, boutiques और stylists के लिए serve करती है जो अपने काम को उसके best पर देखना चाहते हैं. हम editorial-style lookbook imagery, clean e-commerce catalog shots, और full campaign visuals produce करते हैं. हमारे फोटोग्राफर styling, fabric और texture के लिए lighting, और garments को photo में उतना ही compelling बनाना समझते हैं जितना वे in person दिखते हैं.",
    packages: [
      { features: ["1 मॉडल", "20 लुक्स तक", "क्लीन स्टूडियो बैकग्राउंड", "30+ एडिटेड फोटोज़", "E-commerce रेडी"] },
      { features: ["1-2 मॉडल", "मल्टीपल लुक्स", "स्टूडियो + लोकेशन", "60+ एडिटेड फोटोज़", "मूड बोर्ड प्लानिंग"] },
      { features: ["पूरी प्रोडक्शन", "Art Direction", "मल्टीपल मॉडल/लुक्स", "100+ एडिटेड फोटोज़", "Campaign-ready डिलीवरी"] },
    ],
    includes: [
      "प्री-शूट ब्रीफ और मूड बोर्ड रिव्यू",
      "Fabric और texture के लिए ऑप्टिमाइज़्ड स्टूडियो लाइटिंग",
      "मल्टीपल बैकड्रॉप या लोकेशन सेटअप",
      "स्टाइलिंग कोऑर्डिनेशन सपोर्ट",
      "प्रोफेशनली रीटच्ड इमेज",
      "वेब और प्रिंट के लिए हाई-रिज़ॉल्यूशन एक्सपोर्ट",
    ],
    process: [
      { step: "ब्रीफ", description: "हम collection, target audience और desired visual tone रिव्यू करते हैं." },
      { step: "प्रोडक्शन प्लान", description: "Lookbook structure, model list, locations और shot list कन्फर्म किए जाते हैं." },
      { step: "शूट डे", description: "पूरी लाइटिंग और styling सपोर्ट के साथ प्रोफेशनल fashion shoot." },
      { step: "डिलीवरी", description: "5-7 दिनों के भीतर एडिटेड इमेज डिलीवर." },
    ],
    faqs: [
      { q: "क्या आप models देते हैं?", a: "हम अपने network से models recommend कर सकते हैं. या आप अपने खुद के models भी ला सकते हैं." },
      { q: "क्या एक session में studio और outdoor दोनों shoot हो सकते हैं?", a: "हाँ. एक सेशन में studio और outdoor दोनों setups शामिल किए जा सकते हैं — अपनी शूट प्लान के लिए संपर्क करें." },
      { q: "क्या आप Instagram content के लिए भी shoot करते हैं?", a: "हाँ. हम standard catalog deliverables के साथ social-format crops भी produce करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "product-ecommerce-photography": {
    tagline: "प्रोडक्ट जो खुद बिकें",
    description: "Amazon, Flipkart, Shopify और catalogs के लिए clean, conversion-ready product photography — white background और lifestyle options उपलब्ध.",
    longDescription: "Product photography directly e-commerce conversion rates को affect करती है. Orvex Visuals clean white-background shots produce करता है जो Amazon और Flipkart listing requirements को meet करते हैं, lifestyle imagery जो products को context में दिखाती है, और detail/macro shots जो craftsmanship और finish को highlight करते हैं. हम सभी categories के physical products के साथ काम करते हैं.",
    packages: [
      { features: ["5 प्रोडक्ट तक", "वाइट बैकग्राउंड", "3 एंगल्स प्रत्येक", "15+ एडिटेड फोटोज़", "E-commerce रेडी"] },
      { features: ["15 प्रोडक्ट तक", "वाइट + लाइफस्टाइल बैकग्राउंड", "4 एंगल्स प्रत्येक", "60+ एडिटेड फोटोज़", "सोशल क्रॉप्स शामिल"] },
      { features: ["50 प्रोडक्ट तक", "पूरी कैटलॉग शूट", "लाइफस्टाइल + डिटेल शॉट्स", "200+ एडिटेड फोटोज़", "प्रायोरिटी डिलीवरी"] },
    ],
    includes: [
      "वाइट-बैकग्राउंड स्टूडियो सेटअप",
      "लाइफस्टाइल और contextual सेटअप विकल्प",
      "Craftsmanship के लिए डिटेल और मैक्रो शॉट्स",
      "Platform-compliant image specs (Amazon, Flipkart, Shopify)",
      "प्रोफेशनल retouching और बैकग्राउंड cleanup",
      "हाई-रिज़ॉल्यूशन और web-optimised exports",
    ],
    process: [
      { step: "Product Intake", description: "Products receive किए जाते हैं, inspect किए जाते हैं और shoot plan के लिए catalogue किए जाते हैं." },
      { step: "सेटअप", description: "प्रत्येक product को उसकी category और usage requirement के लिए style और light किया जाता है." },
      { step: "शूट", description: "Brief के अनुसार सभी angles, details और lifestyle shots capture किए जाते हैं." },
      { step: "डिलीवरी", description: "Required formats में 3-5 दिनों के भीतर edited images deliver." },
    ],
    faqs: [
      { q: "क्या आप jewelry shoot करते हैं?", a: "हाँ. Jewelry हमारी सबसे frequent product categories में से एक है. हमारे पास इसके लिए dedicated macro lighting setups हैं." },
      { q: "क्या background pure white कर सकते हैं?", a: "हाँ. सभी white-background deliverables में marketplace listings के लिए suitable pure-white background होता है." },
      { q: "क्या आप Amazon-ready specs में deliver करते हैं?", a: "हाँ. हम Amazon, Flipkart और Shopify के लिए required resolution और aspect ratios में export करते हैं." },
      { q: "Products कैसे भेजें?", a: "आप हमारे studio में drop कर सकते हैं या ship कर सकते हैं. Shoot के बाद हम safely वापस करेंगे." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "digital-photo-studio": {
    tagline: "आएं. जाएं. बढ़िया दिखें.",
    description: "पासपोर्ट फोटो, वीज़ा फोटो, ID फोटो, फैमिली पोर्ट्रेट और quick professional headshots के लिए walk-in studio — same-day delivery.",
    longDescription: "Orvex Visuals रोज़मर्रा की फोटोग्राफी ज़रूरतों के लिए एक walk-in digital photo studio operate करता है. सभी government और visa specifications के अनुपालन में passport photos, professional ID photos, quick family portraits और same-day professional headshots. हम on-site print करते हैं या कुछ घंटों में digital copies deliver करते हैं. Standard services के लिए appointment की ज़रूरत नहीं.",
    packages: [
      { features: ["पासपोर्ट / ID फोटो", "Government-spec Compliant", "Printed + Digital", "Same-Day"] },
      { features: ["Headshot सेशन", "2 Backgrounds", "10+ एडिटेड फोटोज़", "Same-Day Digital Delivery", "Print विकल्प"] },
      { features: ["Family Studio सेशन", "Multiple Poses", "20+ एडिटेड फोटोज़", "Print + Digital", "Frame विकल्प उपलब्ध"] },
    ],
    includes: [
      "प्रोफेशनल स्टूडियो लाइटिंग और बैकग्राउंड",
      "Passport-specification compliant printing",
      "WhatsApp या cloud से digital delivery",
      "On-site printing उपलब्ध",
      "Headshots के लिए मल्टीपल बैकग्राउंड विकल्प",
      "Standard services के लिए same-day turnaround",
    ],
    process: [
      { step: "Walk In", description: "Passport और ID photos के लिए appointment की ज़रूरत नहीं. Headshot sessions advance में book किए जा सकते हैं." },
      { step: "सेशन", description: "Quick, professionally lit session." },
      { step: "सेलेक्शन", description: "आप अपने पसंदीदा frames चुनते हैं." },
      { step: "डिलीवरी", description: "Same-day print और/या digital copy deliver." },
    ],
    faqs: [
      { q: "क्या आपकी passport photos passport office में accepted होती हैं?", a: "हाँ. हम सभी passport और visa photo types के लिए exact government specifications follow करते हैं." },
      { q: "क्या appointment ज़रूरी है?", a: "Passport photos और ID shots के लिए appointment नहीं चाहिए. Headshot और family sessions के लिए booking recommend करते हैं." },
      { q: "क्या आप on-site print करते हैं?", a: "हाँ. हमारे पास on-site photo printing capabilities हैं." },
      { q: "Studio के hours क्या हैं?", a: "Current studio hours के लिए कृपया WhatsApp पर contact करें." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "album-design-printing": {
    tagline: "आपकी कहानी, पीढ़ियों के लिए बंधी",
    description: "Premium वेडिंग और इवेंट एल्बम — Canvera, Karizma और flush-mount options, प्रोफेशनली डिज़ाइन और print किए हुए.",
    longDescription: "Printed album एकमात्र ऐसी फोटोग्राफी है जो आप अपने पोते-पोतियों को दे सकते हैं. Orvex Visuals premium wedding albums, event photobooks और baby milestone albums design और produce करता है. हम Canvera, Karizma और flush-mount printing systems के साथ काम करते हैं जो decades तक चलने वाले albums बनाते हैं. हमारे designers आपकी photos को एक cohesive visual narrative में layout करते हैं — सिर्फ images के pages नहीं, बल्कि एक कहानी.",
    packages: [
      { features: ["20-page Album", "Digital Design Proof", "Standard Cover", "15 दिनों में Delivery"] },
      { features: ["30-page Album", "Flush Mount या Canvera", "Custom Cover", "2 Design Revisions", "10 दिनों में Delivery"] },
      { features: ["40+ Page Album", "Premium Flush Mount", "Leather/Linen Cover", "3 Revisions", "Parent Copy उपलब्ध", "10 दिनों में Delivery"] },
    ],
    includes: [
      "प्रोफेशनल album layout design",
      "Printing से पहले digital design proof",
      "Flush-mount या laminated printing",
      "Premium cover material options",
      "Protective slip case या box",
      "भारत भर में home delivery",
    ],
    process: [
      { step: "Photo Selection", description: "आप अपनी selected photos share करते हैं (या हम अपनी gallery से select करते हैं अगर shoot हमारे साथ था)." },
      { step: "Design", description: "हमारे designers album layout करते हैं और digital proof share करते हैं." },
      { step: "Review", description: "आप review करते हैं और कोई बदलाव request करते हैं. Revisions project brief में सहमत शर्तों के अनुसार लागू होते हैं." },
      { step: "Print & Delivery", description: "Final album print होकर agreed timeline के भीतर dispatch." },
    ],
    faqs: [
      { q: "क्या आप किसी अन्य photographer की photos से album design कर सकते हैं?", a: "हाँ. हम किसी भी photos से albums design और print करते हैं जो आप provide करते हैं." },
      { q: "आप कौन-से album brands use करते हैं?", a: "हम आपकी preference और budget के आधार पर Canvera, Karizma और flush-mount production systems के साथ काम करते हैं." },
      { q: "कितना समय लगता है?", a: "Final photo selection से delivery तक 10-15 दिन." },
      { q: "क्या parent copy order हो सकती है?", a: "हाँ. Parent copies reduced rate पर उपलब्ध हैं — album order करते समय हमें बताएं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "photo-frames": {
    tagline: "आपके बेहतरीन पल आपकी दीवारों पर",
    description: "Custom photo frames, canvas prints, acrylic wall art और framed collages — आपके घर के लिए high-quality printing और finishing.",
    longDescription: "आपकी पसंदीदा तस्वीरें ठीक से display होने की हकदार हैं. Orvex Visuals custom canvas prints, acrylic face-mounted prints, traditional framed prints और collage wall arrangements produce करता है. हम archival-quality printing use करते हैं materials पर जो decades तक चलते हैं. Sizes small desk frames से large wall statement pieces तक हैं.",
    packages: [
      { features: ["Single Print", "12x18 inches तक", "Canvas या Frame Finish", "Standard Delivery"] },
      { features: ["3 Prints तक", "24x36 inches तक", "Canvas / Acrylic / Frame", "Collage विकल्प उपलब्ध"] },
      { features: ["5-10 Prints का Set", "Gallery Wall Layout Design", "Mixed Sizes", "Acrylic या Frame", "Hanging Hardware शामिल"] },
    ],
    includes: [
      "Archival-quality photo printing",
      "Canvas stretching या frame mounting",
      "Acrylic face-mount विकल्प",
      "Size और finish consultation",
      "Hanging hardware (wall sets)",
      "भारत भर में delivery",
    ],
    process: [
      { step: "Order", description: "आप अपनी photos, preferred size और finish type share करते हैं." },
      { step: "Proof", description: "Large या custom orders के लिए हम digital print preview share करते हैं." },
      { step: "Production", description: "हमारी production facility में print और finish." },
      { step: "Delivery", description: "Safely packaged और dispatch. 5-7 दिनों में delivery." },
    ],
    faqs: [
      { q: "Maximum print size क्या है?", a: "हम 40x60 inches तक prints produce करते हैं. Standard catalog से बड़े sizes के लिए contact करें." },
      { q: "Acrylic print क्या है?", a: "Face-mounted acrylic print में photo को clear acrylic sheet के back से bond किया जाता है जिससे vivid, gallery-quality look मिलता है." },
      { q: "क्या दूसरे studios की photos से order हो सकता है?", a: "हाँ. हम किसी भी high-resolution image से print करते हैं जो आप provide करते हैं." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "photo-restoration": {
    tagline: "पुरानी यादें, फिर से जीवंत",
    description: "पुरानी, फटी, धुंधली और पानी से खराब तस्वीरों को professional digital restoration techniques से उनकी original quality में वापस लाएं.",
    longDescription: "पुरानी family photographs fade, tear और deteriorate होती हैं. Orvex Visuals professional digital photo restoration offer करता है जो damaged images को recover करती है और उन्हें नई ज़िंदगी देती है. चाहे 50 साल पुरानी black-and-white portrait हो, water-damaged wedding photo हो, या faded group picture — हमारी restoration team carefully और respectfully काम करती है. हम black-and-white photographs को colour में भी convert करते हैं.",
    packages: [
      { features: ["Minor Damage", "Scratch और Dust Removal", "Tone Correction", "Digital Delivery"] },
      { features: ["Moderate Damage", "Tear और Crease Repair", "Full Tone Restoration", "Digital + Print विकल्प"] },
      { features: ["Severe Damage / Heavy Loss", "Reconstruction", "Colourisation विकल्प", "High-res Digital + Print", "Framing उपलब्ध"] },
    ],
    includes: [
      "Original photograph का careful digital scan",
      "Scratch, dust और crease removal",
      "Tear और physical damage reconstruction",
      "Tone, contrast और colour restoration",
      "Optional black-and-white to colour conversion",
      "High-resolution digital delivery + optional print",
    ],
    process: [
      { step: "Submission", description: "आप अपनी photograph भेजते हैं (physical drop-off या scanned digital file)." },
      { step: "Assessment", description: "हम damage assess करते हैं और restoration scope और cost confirm करते हैं." },
      { step: "Restoration", description: "हमारे technicians image को carefully restore करते हैं." },
      { step: "Delivery", description: "Restored digital file deliver. Request पर print उपलब्ध." },
    ],
    faqs: [
      { q: "क्या सभी photos fully restore हो सकती हैं?", a: "हम अधिकांश photos को significantly improved state में restore कर सकते हैं. Heavily damaged photos में हर detail recover नहीं हो सकती, लेकिन हम शुरू करने से पहले honest assessment देते हैं." },
      { q: "क्या आप black-and-white photos को colorize करते हैं?", a: "हाँ. Colourisation एक add-on सेवा के रूप में उपलब्ध है — photo submit करते समय हमें बताएं." },
      { q: "क्या मुझे original send करना होगा?", a: "आप original रखना चाहें तो high-resolution scan भेज सकते हैं. Physical drop-off भी welcome है." },
      { q: "Restoration में कितना समय लगता है?", a: "Damage की complexity के आधार पर 3-10 दिन." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },

  "personalized-gifts-printing": {
    tagline: "एक यादगार जो वे थाम सकें",
    description: "Custom photo gifts — coffee mugs, cushion covers, keychains, calendars और बहुत कुछ — आपकी favourite photographs उन पर print करके.",
    longDescription: "Personalized photo gifts occasions को memorable बनाते हैं. Orvex Visuals photo-printed gifts की wide range produce करता है: ceramic mugs, cushion covers, keychains, desk calendars, phone cases और बहुत कुछ. सभी products dye-sublimation या archival-quality printing use करते हैं जिससे images vivid, wash-resistant (mugs और textiles के लिए) और durable होती हैं. Birthdays, anniversaries, baby milestones और corporate gifting के लिए perfect.",
    packages: [
      { features: ["1 Item", "Photo Print", "Standard Quality", "3-5 दिनों में Delivery"] },
      { features: ["Mug + Cushion + Keychain", "Same या Mixed Photos", "Gift Wrapped", "5-7 दिनों में Delivery"] },
      { features: ["20+ Items", "Custom Logo/Photo", "Bulk Discount Applied", "Corporate Gifting Pack", "7-10 दिनों में Delivery"] },
    ],
    includes: [
      "Dye-sublimation या archival print quality",
      "Product format के लिए photo editing और cropping",
      "Mugs और textiles पर wash-resistant printing",
      "Gift wrapping उपलब्ध",
      "Bulk और corporate gifting options",
      "Pan-India delivery",
    ],
    process: [
      { step: "Order", description: "आप अपनी photo share करते हैं और product type choose करते हैं." },
      { step: "Design Preview", description: "Production से पहले approval के लिए digital mock-up share करते हैं." },
      { step: "Production", description: "हमारी facility में print और quality-check." },
      { step: "Delivery", description: "Safely packaged और 3-10 दिनों के भीतर dispatch." },
    ],
    faqs: [
      { q: "क्या photo mugs dishwasher safe हैं?", a: "हमारे mugs top-rack dishwasher safe हैं. Longest life के लिए hand washing recommend करते हैं." },
      { q: "क्या single item order हो सकती है?", a: "हाँ. Single-item orders welcome हैं — order करने के लिए हमसे संपर्क करें." },
      { q: "क्या आप bulk corporate gifting करते हैं?", a: "हाँ. हम custom packaging और logo options के साथ bulk corporate gifting orders handle करते हैं." },
      { q: "Photo quality कैसी चाहिए?", a: "Higher resolution photos बेहतर results produce करती हैं. अगर photo को quality improvement चाहिए तो production से पहले हम advise करेंगे." },
      { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. सभी दिखाई गई कीमतें GST-समेत हैं." },
    ],
  },
}

const GENERIC_HI_INCLUDES = [
  "प्रोफेशनल एडिटिंग और साफ-सुथरी डिलीवरी",
  "हाई-रिज़ॉल्यूशन डिजिटल फाइल्स",
  "इवेंट / सेशन से पहले कंसल्टेशन",
  "बैकअप इक्विपमेंट और तैयारी",
  "समय पर प्रीव्यू और अपडेट्स",
  "शेयर करने के लिए प्राइवेट ऑनलाइन गैलरी",
]

const GENERIC_HI_PROCESS = [
  { step: "परामर्श", description: "हम आपकी जरूरत, पसंद और टाइमिंग को समझकर सही कवरेज प्लान करते हैं." },
  { step: "प्लानिंग", description: "टीम, सेटअप, लोकेशन और कवरेज का व्यावहारिक प्लान तैयार किया जाता है." },
  { step: "कवरेज", description: "शूट या इवेंट के दिन प्रोफेशनल और साफ तरीके से पूरी कवरेज की जाती है." },
  { step: "डिलीवरी", description: "एडिटेड फाइनल फाइल्स समय पर आपकी प्राइवेट गैलरी या तय डिलीवरी चैनल से साझा की जाती हैं." },
]

function getServiceCard(slug: string) {
  return services.find((service) => service.slug === slug)
}

function cloneServiceDetail(detail: ServiceDetail): ServiceDetail {
  return {
    ...detail,
    gallery: [...detail.gallery],
    packages: detail.packages.map((pkg) => ({ ...pkg, features: [...pkg.features] })),
    includes: [...detail.includes],
    process: detail.process.map((step) => ({ ...step })),
    faqs: detail.faqs.map((faq) => ({ ...faq })),
    relatedSlugs: [...detail.relatedSlugs],
  }
}

function getServiceCategory(slug: string): Exclude<Category, "all"> {
  const category = getServiceCard(slug)?.category
  return category && category !== "all" ? category : "events"
}

function getGenericHindiCardDescription(name: string, category: Exclude<Category, "all">): string {
  switch (category) {
    case "wedding":
      return `${name} के लिए कैंडिड और पारंपरिक स्टाइल में प्रोफेशनल कवरेज, ताकि हर अहम पल साफ-सुथरे तरीके से कैद हो.`
    case "pre-wedding":
      return `${name} के लिए लोकेशन प्लानिंग, पोज़ गाइडेंस और खूबसूरत कपल कवरेज के साथ प्रोफेशनल फोटोशूट.`
    case "events":
      return `${name} के लिए रस्मों, मेहमानों और खास पलों की प्रोफेशनल कवरेज.`
    case "baby-kids":
      return `${name} के लिए सुरक्षित, आरामदायक और खूबसूरत फोटो कवरेज, जिसे आप लंबे समय तक संजो सकें.`
    case "videography":
      return `${name} के लिए प्रोफेशनल वीडियो कवरेज, साफ एडिटिंग और सिनेमैटिक प्रेजेंटेशन.`
    case "corporate":
      return `${name} के लिए प्रोफेशनल, ब्रांड-फ्रेंडली और साफ विजुअल कवरेज.`
    case "products":
      return `${name} के लिए साफ डिजाइन, प्रिंट और फिनिशिंग के साथ प्रोफेशनल आउटपुट.`
  }
}

function getGenericHindiLongDescription(name: string, category: Exclude<Category, "all">): string {
  switch (category) {
    case "wedding":
      return `${name} के लिए Orvex Visuals ऐसी कवरेज देता है जिसमें रस्में, एक्सप्रेशंस और परिवार के अहम पल संतुलित तरीके से कैद हों. हमारी टीम प्लानिंग, टाइमिंग और डिलीवरी पर ध्यान देती है ताकि आपको साफ और भरोसेमंद विजुअल रिकॉर्ड मिले.`
    case "pre-wedding":
      return `${name} के लिए हम लोकेशन, टाइमिंग, आउटफिट और विजुअल मूड को ध्यान में रखकर ऐसा सेशन प्लान करते हैं जो कैमरे पर नैचुरल और खूबसूरत लगे. उद्देश्य सिर्फ तस्वीरें लेना नहीं, बल्कि आपकी कहानी को साफ तरीके से फ्रेम करना है.`
    case "events":
      return `${name} के लिए हमारी टीम ऐसे मोमेंट्स कैद करती है जो इवेंट की असली ऊर्जा, परिवार की मौजूदगी और रस्मों की अहमियत को साफ तरीके से दिखाएं. हम व्यावहारिक कवरेज, समय पर काम और साफ डिलीवरी पर ध्यान देते हैं.`
    case "baby-kids":
      return `${name} के लिए हम आरामदायक, सुरक्षित और धैर्यपूर्ण सेशन प्लान करते हैं ताकि बच्चे और परिवार बिना तनाव के कैमरे के सामने सहज महसूस करें. हमारा फोकस प्यारे एक्सप्रेशंस और ऐसे फ्रेम्स पर रहता है जिन्हें आप लंबे समय तक संजो सकें.`
    case "videography":
      return `${name} के लिए Orvex Visuals ऐसी वीडियो कवरेज देता है जिसमें इवेंट या सेशन की पूरी फील, मूवमेंट और भावनात्मक प्रवाह साफ दिखाई दे. सही प्लानिंग, साफ एडिटिंग और भरोसेमंद डिलीवरी हमारी प्रक्रिया का हिस्सा है.`
    case "corporate":
      return `${name} के लिए हम साफ, प्रोफेशनल और ब्रांड-उपयुक्त विजुअल्स तैयार करते हैं जो आपकी टीम, इवेंट या प्रोफाइल को भरोसेमंद तरीके से प्रस्तुत करें. हमारा फोकस स्पष्ट कम्युनिकेशन, समय पर कवरेज और उपयोगी आउटपुट पर रहता है.`
    case "products":
      return `${name} के लिए हम डिजाइन, फिनिश और उपयोगिता पर ध्यान देकर ऐसा आउटपुट तैयार करते हैं जो साफ, प्रैक्टिकल और पेशेवर लगे. चाहे प्रिंट हो या गिफ्ट प्रोडक्ट, उद्देश्य यही है कि अंतिम परिणाम उपयोगी और देखने में बेहतर हो.`
  }
}

function getGenericHindiPackageFeatures(packageName: string, category: Exclude<Category, "all">): string[] {
  const normalized = packageName.toLowerCase()

  if (category === "products") {
    if (normalized === "basic") {
      return ["स्टैंडर्ड क्वालिटी", "डिजिटल डिलीवरी", "1 रिविजन"]
    }

    if (normalized === "premium" || normalized === "standard") {
      return ["प्रीमियम क्वालिटी", "डिजिटल + फिजिकल डिलीवरी", "3 रिविजन", "तेज़ प्रोसेसिंग"]
    }

    return ["लक्ज़री क्वालिटी", "डिजिटल + फिजिकल डिलीवरी", "अनलिमिटेड रिविजन", "प्रायोरिटी प्रोसेसिंग", "कस्टम डिजाइन"]
  }

  if (normalized === "essential" || normalized === "basic" || normalized === "silver") {
    return ["1 प्रोफेशनल", "प्रोफेशनल कवरेज", "एडिटेड डिलीवरी", "ऑनलाइन शेयरिंग", "समय पर डिलीवरी"]
  }

  if (normalized === "premium" || normalized === "standard" || normalized === "gold") {
    return ["2 प्रोफेशनल", "विस्तृत कवरेज", "एडिटेड डिलीवरी", "ऑनलाइन गैलरी", "तेज़ प्रीव्यू", "कस्टम प्लानिंग"]
  }

  return ["2+ प्रोफेशनल", "पूरी कवरेज", "प्रीमियम एडिटिंग", "क्रिएटिव ऐंगल्स", "प्राथमिकता डिलीवरी", "कस्टम आउटपुट"]
}

function getGenericHindiFaqs(name: string): ServiceFAQ[] {
  return [
    { q: "इस सेवा में क्या डिलीवर किया जाता है?", a: `${name} के लिए डिलीवेरेबल्स पैकेज पर निर्भर करते हैं, लेकिन इसमें प्रोफेशनल कवरेज और एडिटेड फाइनल आउटपुट शामिल रहता है.` },
    { q: "क्या कीमतों में GST शामिल है?", a: "हाँ. हमारी दिखाई गई कीमतें GST-समेत हैं और कोई छिपा शुल्क नहीं रखा जाता." },
    { q: "क्या पैकेज कस्टमाइज़ किए जा सकते हैं?", a: "हाँ, आप WhatsApp पर अपनी जरूरत बताकर कस्टम पैकेज बनवा सकते हैं." },
    { q: "बुकिंग / तारीख कैसे कन्फर्म होती है?", a: "उपलब्धता और कवरेज की पुष्टि आपकी रिक्वेस्ट और बातचीत के बाद की जाती है." },
    { q: "क्या आप बेंगलुरु के बाहर भी काम करते हैं?", a: "हाँ, आउटस्टेशन और ट्रैवल-आधारित कवरेज उपलब्ध है. जरूरत के अनुसार अतिरिक्त ट्रैवल चार्ज लग सकते हैं." },
  ]
}

function translatePackageName(name: string, locale: AppLocale): string {
  if (locale === "en") return name
  return PACKAGE_NAME_HI[name] ?? name
}

function translateDuration(duration: string, locale: AppLocale): string {
  if (locale === "en") return duration
  return DURATION_HI[duration] ?? duration
}

export function getLocalizedServiceName(slug: string, locale: AppLocale): string {
  const baseName = getServiceCard(slug)?.name || getServiceDetail(slug).name
  if (locale === "en") return baseName
  return SERVICE_NAME_HI[slug] ?? baseName
}

function getLocalizedServiceDescription(slug: string, locale: AppLocale): string {
  const card = getServiceCard(slug)
  const baseDescription = card?.description || getServiceDetail(slug).description

  if (locale === "en") return baseDescription

  return SERVICE_CARD_DESCRIPTION_HI[slug] ?? getGenericHindiCardDescription(getLocalizedServiceName(slug, locale), getServiceCategory(slug))
}

export function getLocalizedServices(locale: AppLocale): ServiceCard[] {
  if (locale === "en") return services

  return services.map((service) => ({
    ...service,
    name: getLocalizedServiceName(service.slug, locale),
    description: getLocalizedServiceDescription(service.slug, locale),
  }))
}

export function getLocalizedServiceDetail(slug: string, locale: AppLocale): ServiceDetail {
  if (locale === "en") return getServiceDetail(slug)

  const detail = cloneServiceDetail(getServiceDetail(slug))
  const category = getServiceCategory(slug)
  const manualTranslation = MANUAL_SERVICE_TRANSLATIONS_HI[slug]
  const localizedName = getLocalizedServiceName(slug, locale)

  if (manualTranslation) {
    return {
      ...detail,
      name: localizedName,
      tagline: manualTranslation.tagline,
      description: manualTranslation.description,
      longDescription: manualTranslation.longDescription,
      packages: detail.packages.map((pkg, index) => ({
        ...pkg,
        name: translatePackageName(pkg.name, locale),
        duration: translateDuration(pkg.duration, locale),
        features: [...(manualTranslation.packages[index]?.features ?? getGenericHindiPackageFeatures(pkg.name, category))],
      })),
      includes: [...manualTranslation.includes],
      process: manualTranslation.process.map((step) => ({ ...step })),
      faqs: manualTranslation.faqs.map((faq) => ({ ...faq })),
    }
  }

  return {
    ...detail,
    name: localizedName,
    tagline: GENERIC_HI_TAGLINES[category],
    description: getLocalizedServiceDescription(slug, locale),
    longDescription: getGenericHindiLongDescription(localizedName, category),
    packages: detail.packages.map((pkg) => ({
      ...pkg,
      name: translatePackageName(pkg.name, locale),
      duration: translateDuration(pkg.duration, locale),
      features: getGenericHindiPackageFeatures(pkg.name, category),
    })),
    includes: [...GENERIC_HI_INCLUDES],
    process: GENERIC_HI_PROCESS.map((step) => ({ ...step })),
    faqs: getGenericHindiFaqs(localizedName),
  }
}

// ============ HELPER ============

// Compute service-page package prices from global rates
// Essential = half-day primary | Premium = full-day primary + secondary + album | Luxury = full-day all + extras
function computeServicePackagePrices(category: Category): { essential: number; premium: number; luxury: number } {
  if (category === "videography") {
    return {
      essential: SERVICE_RATES["cinematic-video"].ratePerHalfDay,
      premium: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
      luxury: SERVICE_RATES["cinematic-video"].ratePerDay + SERVICE_RATES["traditional-video"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
    }
  }
  // Photography (wedding, events, pre-wedding, baby-kids, corporate)
  return {
    essential: SERVICE_RATES["candid-photo"].ratePerHalfDay,
    premium: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + GLOBAL_ADDONS["album-25"].price,
    luxury: SERVICE_RATES["candid-photo"].ratePerDay + SERVICE_RATES["traditional-photo"].ratePerDay + EVENT_ADDONS.drone.price + EVENT_ADDONS["same-day-edit"].price + GLOBAL_ADDONS["album-40"].price,
  }
}

export function getServiceDetail(slug: string): ServiceDetail {
  if (serviceDetails[slug]) return serviceDetails[slug]

  // Auto-generate from the listing card data + defaults
  const card = services.find((s) => s.slug === slug)
  const name = card?.name || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
  const category = card?.category || "events"
  const prices = computeServicePackagePrices(category)

  return {
    slug,
    name,
    tagline: "Professional Photography & Videography",
    description: card?.description || `Professional ${name.toLowerCase()} services in Bangalore by Orvex Visuals.`,
    longDescription: `Looking for the best ${name.toLowerCase()} services in Bangalore? Orvex Visuals provides professional, experienced photographers who specialize in capturing your special moments beautifully. Our team brings top-quality equipment, creative expertise, and a passion for storytelling to every shoot.`,
    icon: card?.icon || Camera,
    heroImage: card?.image?.replace("w=600", "w=1200") || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80",
    gallery: [
      card?.image || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    ],
    packages: category === "products"
      ? [
          { name: "Basic", price: card?.startingPrice || 500, duration: "Standard", features: ["Standard Quality", "Digital Delivery", "1 Revision"] },
          { name: "Premium", price: (card?.startingPrice || 500) * 3, duration: "Premium", features: ["Premium Quality", "Digital + Physical Delivery", "3 Revisions", "Express Processing"], popular: true },
          { name: "Luxury", price: (card?.startingPrice || 500) * 6, duration: "Luxury", features: ["Luxury Quality", "Digital + Physical Delivery", "Unlimited Revisions", "Priority Processing", "Custom Design"] },
        ]
      : [
          {
            name: "Essential",
            price: prices.essential,
            duration: "Half Day (5 hrs)",
            features: ["1 Professional", "Professional Coverage", "100+ Edited Photos", "Online Gallery", "Delivery in 5 Days"],
          },
          {
            name: "Premium",
            price: prices.premium,
            duration: "Full Day (10 hrs)",
            features: ["2 Professionals", "Candid + Traditional", "300+ Edited Photos", "Online Gallery", "25-sheet Album", "Same-Day Previews"],
            popular: true,
          },
          {
            name: "Luxury",
            price: prices.luxury,
            duration: "Full Day (10 hrs)",
            features: ["2+ Professionals", "Complete Coverage", "500+ Edited Photos", "Drone Coverage", "Same-Day Edit", "40-sheet Premium Album", "Priority Delivery"],
          },
        ],
    includes: [
      "Professional color-corrected photos",
      "High-resolution digital delivery",
      "Pre-event consultation",
      "Backup equipment",
      "Quick preview within 48 hours",
      "Private online gallery",
    ],
    process: [
      { step: "Consultation", description: "We discuss your requirements, preferences, and plan the session." },
      { step: "Planning", description: "Our team prepares equipment, scouting locations if needed." },
      { step: "Shoot Day", description: "Professional coverage of your event/session." },
      { step: "Delivery", description: "Edited photos delivered via private online gallery." },
    ],
    faqs: [
      { q: "How many photos will I receive?", a: "Depending on the package, you'll receive 100-500+ professionally edited photos." },
      { q: "Are prices inclusive of GST?", a: "Yes! All our prices are GST-inclusive. No hidden charges." },
      { q: "Can I customize a package?", a: "Absolutely. Contact us on WhatsApp for a custom quote." },
      { q: "What's the advance payment?", a: "We require 30% advance to confirm your booking. Balance is due on the day of the event." },
      { q: "Do you travel outside Bangalore?", a: "Yes, we cover events across India. Travel charges apply for outstation." },
    ],
    relatedSlugs: ["wedding-photography", "pre-wedding-photoshoot", "cinematic-videography"],
  }
}

// ============ PHASE 2B: SERVICE PAGE CLASSIFICATION (D-016) ============
// Maps every slug to its commercial role per Section 13 of project-architect-context.md.
// "parent"    = Parent Product Page — owns the estimate journey for its family.
// "variant"   = Variant Discovery Page — editorial/SEO; routes estimate entry to parent(s).
// "ancillary" = Ancillary Standalone Service Page — contact-led; outside the coverage pricing flow.

export type ServiceRole = "parent" | "variant" | "ancillary"

export interface ServiceClassification {
  role: ServiceRole
  /** Ordered parent slugs. Single entry = single-parent variant. Multiple = multi-parent variant. */
  parentSlugs?: readonly string[]
}

export const SERVICE_CLASSIFICATIONS: Readonly<Record<string, ServiceClassification>> = {
  // ── Parent Product Pages ──────────────────────────────────────────────
  "wedding-photography":           { role: "parent" },
  "pre-wedding-photoshoot":        { role: "parent" },
  "engagement-photography":        { role: "parent" },
  "birthday-photography":          { role: "parent" },
  "housewarming-photography":      { role: "parent" },
  "events-photography":            { role: "parent" },
  "baby-photoshoot":               { role: "parent" },
  "maternity-photography":         { role: "parent" },
  "corporate-photography":         { role: "parent" },

  // ── Variant Discovery Pages ───────────────────────────────────────────
  "candid-wedding-photography":    { role: "variant", parentSlugs: ["wedding-photography"] },
  "christian-wedding-photography": { role: "variant", parentSlugs: ["wedding-photography"] },
  "muslim-wedding-photography":    { role: "variant", parentSlugs: ["wedding-photography"] },
  "haldi-mehendi-photography":     { role: "variant", parentSlugs: ["wedding-photography"] },
  "sangeet-photography":           { role: "variant", parentSlugs: ["wedding-photography"] },
  "wedding-videography":           { role: "variant", parentSlugs: ["wedding-photography"] },
  "post-wedding-photoshoot":       { role: "variant", parentSlugs: ["pre-wedding-photoshoot"] },
  "anniversary-photoshoot":        { role: "variant", parentSlugs: ["engagement-photography"] },
  "baby-shower-photography":       { role: "variant", parentSlugs: ["events-photography"] },
  "naming-ceremony-photography":   { role: "variant", parentSlugs: ["events-photography"] },
  "cradle-ceremony-photography":   { role: "variant", parentSlugs: ["events-photography"] },
  "upanayana-photography":         { role: "variant", parentSlugs: ["events-photography"] },
  "shastipurthi-photography":      { role: "variant", parentSlugs: ["events-photography"] },
  "puberty-ceremony-photography":  { role: "variant", parentSlugs: ["events-photography"] },
  "holy-communion-photography":    { role: "variant", parentSlugs: ["events-photography"] },
  "newborn-photography":           { role: "variant", parentSlugs: ["baby-photoshoot"] },
  "indoor-maternity-photoshoot":   { role: "variant", parentSlugs: ["maternity-photography"] },
  "cinematic-videography":         { role: "variant", parentSlugs: ["wedding-photography", "birthday-photography", "events-photography"] },
  "candid-videography":            { role: "variant", parentSlugs: ["wedding-photography", "birthday-photography", "events-photography"] },
  "drone-photography":             { role: "variant", parentSlugs: ["wedding-photography", "birthday-photography", "events-photography", "corporate-photography"] },

  // ── Ancillary Standalone Service Pages ────────────────────────────────
  "family-photoshoot":             { role: "ancillary" },
  "video-editing-services":        { role: "ancillary" },
  "corporate-video-production":    { role: "ancillary" },
  "portrait-photography":          { role: "ancillary" },
  "portfolio-photography":         { role: "ancillary" },
  "fashion-photography":           { role: "ancillary" },
  "product-ecommerce-photography": { role: "ancillary" },
  "digital-photo-studio":          { role: "ancillary" },
  "album-design-printing":         { role: "ancillary" },
  "photo-frames":                  { role: "ancillary" },
  "photo-restoration":             { role: "ancillary" },
  "personalized-gifts-printing":   { role: "ancillary" },
}

/** Returns the Phase 2B classification for a slug. Unlisted slugs default to "parent". */
export function getServiceClassification(slug: string): ServiceClassification {
  return SERVICE_CLASSIFICATIONS[slug] ?? { role: "parent" }
}
