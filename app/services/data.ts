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
