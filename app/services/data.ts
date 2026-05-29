// ============================================================
// ORVEX VISUALS — SERVICE DATA (Single Source of Truth)
// Update prices, packages, and service details here.
// Both /services and /services/[slug] pages import from this file.
// ============================================================

import {
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
  icon: any
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
  icon: any
  heroImage: string
  gallery: string[]
  packages: ServicePackage[]
  includes: string[]
  process: { step: string; description: string }[]
  faqs: ServiceFAQ[]
  relatedSlugs: string[]
}

// ============ CATEGORIES ============
export const categories: { id: Category; label: string; icon: any }[] = [
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
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80",
    popular: true,
  },
  {
    slug: "christian-wedding-photography",
    name: "Christian Wedding Photography",
    category: "wedding",
    description: "Specialized coverage for church ceremonies, traditions, and receptions with cultural sensitivity.",
    startingPrice: PHOTO_STARTING,
    icon: Church,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  },
  {
    slug: "muslim-wedding-photography",
    name: "Muslim Wedding Photography",
    category: "wedding",
    description: "Professional coverage for Nikah, Walima, Mehendi, and all wedding ceremonies.",
    startingPrice: PHOTO_STARTING,
    icon: Crown,
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  },
  {
    slug: "engagement-photography",
    name: "Engagement Photography",
    category: "pre-wedding",
    description: "Capture the moment you said yes. Ring ceremony and engagement party coverage.",
    startingPrice: PHOTO_STARTING,
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80",
  },
  {
    slug: "anniversary-photoshoot",
    name: "Anniversary Photoshoot",
    category: "pre-wedding",
    description: "Celebrate your journey together with a beautiful couple shoot at any milestone.",
    startingPrice: PHOTO_STARTING,
    icon: PartyPopper,
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80",
  },

  // ─── EVENTS & CEREMONIES ───────────────────
  {
    slug: "birthday-photography",
    name: "Birthday Photography",
    category: "events",
    description: "From 1st birthdays to milestone celebrations. Candid and traditional coverage.",
    startingPrice: PHOTO_STARTING,
    icon: Cake,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  },
  {
    slug: "baby-shower-photography",
    name: "Baby Shower Photography",
    category: "events",
    description: "Document the joy and excitement as you celebrate the upcoming arrival.",
    startingPrice: PHOTO_STARTING,
    icon: Baby,
    image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80",
  },
  {
    slug: "haldi-mehendi-photography",
    name: "Haldi & Mehendi Photography",
    category: "events",
    description: "Vibrant colors, dancing, and intimate moments captured beautifully.",
    startingPrice: PHOTO_STARTING,
    icon: Flower2,
    image: "https://images.unsplash.com/photo-1604604557904-d661e0b3c02d?w=600&q=80",
  },
  {
    slug: "sangeet-photography",
    name: "Sangeet Photography",
    category: "events",
    description: "Dance performances, energy, and unforgettable party moments documented.",
    startingPrice: PHOTO_STARTING,
    icon: Music,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  },
  {
    slug: "naming-ceremony-photography",
    name: "Naming Ceremony Photography",
    category: "events",
    description: "Your baby's special naming day captured with care and attention to every detail.",
    startingPrice: PHOTO_STARTING,
    icon: Gift,
    image: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80",
  },
  {
    slug: "cradle-ceremony-photography",
    name: "Cradle Ceremony Photography",
    category: "events",
    description: "Beautiful coverage of your baby's cradle ceremony (Tottilu) with all rituals documented.",
    startingPrice: PHOTO_STARTING,
    icon: Baby,
    image: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80",
  },
  {
    slug: "housewarming-photography",
    name: "Housewarming Photography",
    category: "events",
    description: "Document your Gruhapravesham or housewarming ceremony beautifully.",
    startingPrice: PHOTO_STARTING,
    icon: HomeIcon,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  },
  {
    slug: "upanayana-photography",
    name: "Upanayana / Thread Ceremony Photography",
    category: "events",
    description: "Sacred thread ceremony (Janeu) documentation with respect for traditions and rituals.",
    startingPrice: PHOTO_STARTING,
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&q=80",
  },
  {
    slug: "shastipurthi-photography",
    name: "Shastipurthi Photography",
    category: "events",
    description: "60th birthday celebration photography — a milestone event captured with grandeur.",
    startingPrice: PHOTO_STARTING,
    icon: Crown,
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80",
  },
  {
    slug: "puberty-ceremony-photography",
    name: "Puberty Function Photography",
    category: "events",
    description: "Respectful, professional coverage of coming-of-age ceremonies and celebrations.",
    startingPrice: PHOTO_STARTING,
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  },
  {
    slug: "holy-communion-photography",
    name: "Holy Communion & Baptism Photography",
    category: "events",
    description: "Professional coverage of First Holy Communion, Baptism, and Confirmation ceremonies.",
    startingPrice: PHOTO_STARTING,
    icon: Church,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  },
  {
    slug: "events-photography",
    name: "Events Photography",
    category: "events",
    description: "General event coverage — college fests, exhibitions, social gatherings, and more.",
    startingPrice: PHOTO_STARTING,
    icon: PartyPopper,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80",
  },
  {
    slug: "maternity-photography",
    name: "Maternity Photography",
    category: "baby-kids",
    description: "Celebrate your pregnancy with elegant indoor/outdoor maternity portraits.",
    startingPrice: PHOTO_STARTING,
    icon: Heart,
    image: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=600&q=80",
  },
  {
    slug: "indoor-maternity-photoshoot",
    name: "Indoor Maternity Photoshoot",
    category: "baby-kids",
    description: "Studio maternity portraits with flowing fabrics, dramatic lighting, and silhouette shots.",
    startingPrice: PHOTO_STARTING,
    icon: Heart,
    image: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=600&q=80",
  },
  {
    slug: "family-photoshoot",
    name: "Family Photoshoot",
    category: "baby-kids",
    description: "Beautiful family portraits in studio or outdoor settings. All ages welcome.",
    startingPrice: PHOTO_STARTING,
    icon: Users,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80",
  },

  // ─── VIDEOGRAPHY ───────────────────────────
  {
    slug: "wedding-videography",
    name: "Wedding Videography",
    category: "videography",
    description: "Complete wedding day video coverage — traditional and cinematic options.",
    startingPrice: VIDEO_STARTING,
    icon: Video,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80",
    popular: true,
  },
  {
    slug: "cinematic-videography",
    name: "Cinematic Videography",
    category: "videography",
    description: "Film-quality wedding and event videography with professional color grading.",
    startingPrice: VIDEO_STARTING,
    icon: Video,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
  },
  {
    slug: "candid-videography",
    name: "Candid Videography",
    category: "videography",
    description: "Natural, documentary-style video that captures real moments without direction.",
    startingPrice: VIDEO_STARTING,
    icon: Film,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
  },
  {
    slug: "drone-photography",
    name: "Drone Photography & Video",
    category: "videography",
    description: "Stunning aerial shots and videos for weddings, events, and venues.",
    startingPrice: DRONE_STARTING,
    icon: Plane,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80",
  },
  {
    slug: "video-editing-services",
    name: "Video Editing Services",
    category: "videography",
    description: "Professional post-production — color grading, highlight reels, and cinematic edits from your raw footage.",
    startingPrice: MISC_SERVICE_RATES.videoEditing,
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80",
  },
  {
    slug: "corporate-video-production",
    name: "Corporate Video Production",
    category: "videography",
    description: "Company profiles, product demos, testimonial videos, and event recap films.",
    startingPrice: VIDEO_STARTING,
    icon: Film,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },

  // ─── CORPORATE & PORTFOLIO ─────────────────
  {
    slug: "corporate-photography",
    name: "Corporate Event Photography",
    category: "corporate",
    description: "Professional coverage for conferences, team events, product launches, and seminars.",
    startingPrice: PHOTO_STARTING,
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    slug: "portrait-photography",
    name: "Portrait Photography",
    category: "corporate",
    description: "Professional headshots, LinkedIn profiles, and personal branding photography.",
    startingPrice: MISC_SERVICE_RATES.portrait,
    icon: Image,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    slug: "portfolio-photography",
    name: "Portfolio Shoot",
    category: "corporate",
    description: "Professional portfolio photography for models, actors, artists, and creative professionals.",
    startingPrice: MISC_SERVICE_RATES.portfolio,
    icon: Image,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    slug: "fashion-photography",
    name: "Fashion Photography",
    category: "corporate",
    description: "Editorial fashion shoots, lookbooks, and catalog photography for brands and designers.",
    startingPrice: PHOTO_STARTING,
    icon: Shirt,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    slug: "product-ecommerce-photography",
    name: "Product & E-Commerce Photography",
    category: "corporate",
    description: "Clean product shots for Amazon, Flipkart, Shopify stores, and catalogs.",
    startingPrice: MISC_SERVICE_RATES.productPhoto,
    icon: Camera,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  },
  {
    slug: "digital-photo-studio",
    name: "Digital Photo Studio",
    category: "corporate",
    description: "Walk-in studio sessions for passport photos, ID photos, family portraits, and professional headshots.",
    startingPrice: MISC_SERVICE_RATES.studioSession,
    icon: Building,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },

  // ─── ALBUMS & PRINTS (PRODUCTS) ────────────
  {
    slug: "album-design-printing",
    name: "Album Design & Printing",
    category: "products",
    description: "Premium wedding albums, Canvera albums, Karizma albums — designed and printed professionally.",
    startingPrice: MISC_SERVICE_RATES.albumDesign,
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
  },
  {
    slug: "photo-frames",
    name: "Photo Frames & Canvas Prints",
    category: "products",
    description: "Custom photo frames, canvas prints, acrylic prints, and wall art for your home.",
    startingPrice: MISC_SERVICE_RATES.photoFrame,
    icon: Frame,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80",
  },
  {
    slug: "photo-restoration",
    name: "Photo Restoration Service",
    category: "products",
    description: "Restore old, damaged, or faded photographs to their original glory with digital restoration.",
    startingPrice: MISC_SERVICE_RATES.photoRestoration,
    icon: Image,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80",
  },
  {
    slug: "personalized-gifts-printing",
    name: "Personalized Gifts & Mug Printing",
    category: "products",
    description: "Custom coffee mugs, cushion covers, keychains, and gifts with your favorite photos printed.",
    startingPrice: MISC_SERVICE_RATES.personalizedGift,
    icon: Coffee,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
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
