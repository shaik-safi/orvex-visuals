import type { Metadata } from "next"

import { BRAND_NAME, DOMAIN, PHOTO_DELIVERY_DAYS, STARTING_PRICE } from "@/lib/constants"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, getLocaleTag, type AppLocale } from "@/lib/i18n/config"
import { withLocalePathname } from "@/lib/i18n/routing"

type PageMetadataCopy = {
  title: string
  description: string
  keywords?: string[]
  openGraphTitle?: string
  openGraphDescription?: string
}

type MetadataPageKey =
  | "root"
  | "about"
  | "blog"
  | "book"
  | "contact"
  | "gallery"
  | "pricing"
  | "privacy"
  | "services"
  | "terms"

type OpenGraphInput = Omit<NonNullable<Metadata["openGraph"]>, "locale" | "alternateLocale" | "url" | "siteName" | "title" | "description"> & {
  type?: "website" | "article"
  title?: string
  description?: string
  publishedTime?: string
  authors?: string[]
  tags?: string[]
}

type TwitterInput = Omit<NonNullable<Metadata["twitter"]>, "title" | "description"> & {
  card?: "summary" | "summary_large_image" | "app" | "player"
  title?: string
  description?: string
}

const ROOT_KEYWORDS = [
  "photography in Bangalore",
  "wedding photographer Bangalore",
  "pre-wedding photoshoot Bangalore",
  "baby photoshoot Bangalore",
  "event photography Bangalore",
  "candid wedding photography",
  "videography Bangalore",
  "best photographer in Bangalore",
  "affordable photography Bangalore",
  "Orvex Visuals",
]

const PAGE_METADATA: Record<MetadataPageKey, Record<AppLocale, PageMetadataCopy>> = {
  root: {
    en: {
      title: "Orvex Visuals - Premium Photography & Videography in Bangalore",
      description:
        `Professional photography & videography in Bangalore. Transparent pricing, ${PHOTO_DELIVERY_DAYS}-day photo delivery, 100% copyright yours. Wedding, pre-wedding, baby shoots, events & more. Starting ₹${STARTING_PRICE.toLocaleString("en-IN")}.`,
      keywords: ROOT_KEYWORDS,
      openGraphTitle: "Orvex Visuals - Premium Photography & Videography in Bangalore",
      openGraphDescription:
        `Professional photography & videography in Bangalore. Transparent pricing, ${PHOTO_DELIVERY_DAYS}-day photo delivery, 100% copyright yours. Starting ₹${STARTING_PRICE.toLocaleString("en-IN")}.`,
    },
    hi: {
      title: "Orvex Visuals - बेंगलुरु में प्रीमियम फोटोग्राफी और वीडियोग्राफी",
      description:
        `बेंगलुरु में प्रोफेशनल फोटोग्राफी और वीडियोग्राफी। स्पष्ट कीमतें, ${PHOTO_DELIVERY_DAYS}-दिन में फोटो डिलीवरी और 100% कॉपीराइट आपके नाम। वेडिंग, प्री-वेडिंग, बेबी शूट्स, इवेंट्स और बहुत कुछ। शुरुआती कीमत ₹${STARTING_PRICE.toLocaleString("en-IN")}.`,
      keywords: [...ROOT_KEYWORDS, "बेंगलुरु फोटोग्राफर", "वेडिंग फोटोग्राफी बेंगलुरु"],
      openGraphTitle: "Orvex Visuals - बेंगलुरु में प्रीमियम फोटोग्राफी और वीडियोग्राफी",
      openGraphDescription:
        `बेंगलुरु में प्रोफेशनल फोटोग्राफी और वीडियोग्राफी। स्पष्ट कीमतें, ${PHOTO_DELIVERY_DAYS}-दिन में फोटो डिलीवरी और 100% कॉपीराइट आपके नाम।`,
    },
  },
  about: {
    en: {
      title: "About - Premium Photography Coordination in Bangalore",
      description:
        "Learn about Orvex Visuals - Bangalore's modern photography coordination brand. Transparent pricing, fast delivery, and you own every delivered photo.",
      openGraphTitle: "About Orvex Visuals | Photography Coordination Bangalore",
      openGraphDescription: "Modern photography brand built on transparency, speed, and client ownership.",
    },
    hi: {
      title: "हमारे बारे में - बेंगलुरु में प्रीमियम फोटोग्राफी कोऑर्डिनेशन",
      description:
        "Orvex Visuals के बारे में जानिए - बेंगलुरु का आधुनिक फोटोग्राफी कोऑर्डिनेशन ब्रांड। स्पष्ट कीमतें, तेज डिलीवरी, और हर डिलीवर की गई फोटो पर आपका अधिकार।",
      openGraphTitle: "Orvex Visuals के बारे में | बेंगलुरु फोटोग्राफी कोऑर्डिनेशन",
      openGraphDescription: "पारदर्शिता, गति और क्लाइंट ओनरशिप पर बना एक आधुनिक फोटोग्राफी ब्रांड।",
    },
  },
  blog: {
    en: {
      title: "Photography Blog - Tips, Guides & Pricing",
      description:
        "Photography tips, location guides, pricing breakdowns, and expert advice for Bangalore. Pre-wedding spots, wedding costs, baby shoot ideas, and more.",
      keywords: ["photography blog Bangalore", "wedding photography tips", "photoshoot pricing guide", "Orvex Visuals blog"],
      openGraphTitle: "Photography Blog | Orvex Visuals Bangalore",
      openGraphDescription: "Expert photography guides, tips, and pricing info for Bangalore.",
    },
    hi: {
      title: "फोटोग्राफी ब्लॉग - टिप्स, गाइड्स और प्राइसिंग",
      description:
        "बेंगलुरु के लिए फोटोग्राफी टिप्स, लोकेशन गाइड्स, प्राइसिंग ब्रेकडाउन और एक्सपर्ट सलाह। प्री-वेडिंग स्पॉट्स, वेडिंग कॉस्ट, बेबी शूट आइडियाज और बहुत कुछ।",
      keywords: ["फोटोग्राफी ब्लॉग बेंगलुरु", "वेडिंग फोटोग्राफी टिप्स", "फोटोशूट प्राइसिंग गाइड", "Orvex Visuals ब्लॉग"],
      openGraphTitle: "फोटोग्राफी ब्लॉग | Orvex Visuals बेंगलुरु",
      openGraphDescription: "बेंगलुरु के लिए एक्सपर्ट फोटोग्राफी गाइड्स, टिप्स और प्राइसिंग जानकारी।",
    },
  },
  book: {
    en: {
      title: "Start a Booking Request in Bangalore",
      description:
        "Share your event details, review your plan, and get clear next steps on pricing and availability from Orvex Visuals.",
      openGraphTitle: "Start a Booking Request | Orvex Visuals Bangalore",
      openGraphDescription: "Share your event details and receive clear next steps on pricing and availability.",
    },
    hi: {
      title: "बुकिंग रिक्वेस्ट शुरू करें - बेंगलुरु",
      description:
        "अपने इवेंट की जानकारी साझा करें, अपना प्लान रिव्यू करें, और Orvex Visuals से प्राइसिंग व उपलब्धता के अगले स्पष्ट स्टेप्स पाएं।",
      openGraphTitle: "बुकिंग रिक्वेस्ट शुरू करें | Orvex Visuals बेंगलुरु",
      openGraphDescription: "अपने इवेंट की जानकारी साझा करें और प्राइसिंग व उपलब्धता के स्पष्ट अगले स्टेप्स पाएं।",
    },
  },
  contact: {
    en: {
      title: "Contact - Bangalore Photography Inquiries",
      description:
        "Ask questions, check availability, or share your event details with Orvex Visuals by WhatsApp, phone, or form.",
      keywords: ["contact photographer Bangalore", "book photographer online", "photography quote", "Orvex Visuals contact"],
      openGraphTitle: "Contact Orvex Visuals | Bangalore Photography Inquiries",
      openGraphDescription: "Ask questions, check availability, or share your event details with Orvex Visuals.",
    },
    hi: {
      title: "संपर्क करें - बेंगलुरु फोटोग्राफी पूछताछ",
      description:
        "WhatsApp, फोन या फॉर्म के जरिए Orvex Visuals से सवाल पूछें, उपलब्धता चेक करें या अपने इवेंट की जानकारी साझा करें।",
      keywords: ["बेंगलुरु फोटोग्राफर संपर्क", "ऑनलाइन फोटोग्राफी बुकिंग", "फोटोग्राफी कोट", "Orvex Visuals संपर्क"],
      openGraphTitle: "Orvex Visuals से संपर्क करें | बेंगलुरु फोटोग्राफी पूछताछ",
      openGraphDescription: "सवाल पूछें, उपलब्धता चेक करें, या अपने इवेंट की जानकारी Orvex Visuals के साथ साझा करें।",
    },
  },
  gallery: {
    en: {
      title: "Portfolio Gallery - Wedding & Event Photography",
      description:
        "Browse our photography portfolio. Wedding, pre-wedding, baby, events, and portrait photography in Bangalore.",
      keywords: ["photography portfolio Bangalore", "wedding photo gallery", "candid photography samples", "pre-wedding shoot gallery"],
      openGraphTitle: "Photography Portfolio Gallery | Orvex Visuals Bangalore",
      openGraphDescription: "Wedding, pre-wedding, and event photography references from Orvex Visuals.",
    },
    hi: {
      title: "पोर्टफोलियो गैलरी - वेडिंग और इवेंट फोटोग्राफी",
      description:
        "हमारी फोटोग्राफी गैलरी देखें। बेंगलुरु में वेडिंग, प्री-वेडिंग, बेबी, इवेंट्स और पोर्ट्रेट फोटोग्राफी रेफरेंस।",
      keywords: ["फोटोग्राफी पोर्टफोलियो बेंगलुरु", "वेडिंग फोटो गैलरी", "कैंडिड फोटोग्राफी सैंपल", "प्री-वेडिंग शूट गैलरी"],
      openGraphTitle: "फोटोग्राफी पोर्टफोलियो गैलरी | Orvex Visuals बेंगलुरु",
      openGraphDescription: "Orvex Visuals की वेडिंग, प्री-वेडिंग और इवेंट फोटोग्राफी रेफरेंस गैलरी।",
    },
  },
  pricing: {
    en: {
      title: "Photography Pricing in Bangalore (2026) - Transparent Rates",
      description:
        "See clear GST-inclusive photography pricing for weddings, pre-wedding shoots, baby sessions, and events in Bangalore before you send a request.",
      keywords: ["photography pricing Bangalore", "wedding photographer cost", "cheap photographer Bangalore", "photography packages with prices"],
      openGraphTitle: "Photography Pricing Bangalore 2026 | Orvex Visuals",
      openGraphDescription: "Transparent GST-inclusive pricing. Wedding, pre-wedding, baby, and event photography packages.",
    },
    hi: {
      title: "बेंगलुरु में फोटोग्राफी प्राइसिंग (2026) - स्पष्ट रेट्स",
      description:
        "वेडिंग, प्री-वेडिंग शूट, बेबी सेशन और इवेंट्स के लिए GST-समेत स्पष्ट फोटोग्राफी प्राइसिंग देखें, इससे पहले कि आप रिक्वेस्ट भेजें।",
      keywords: ["फोटोग्राफी प्राइसिंग बेंगलुरु", "वेडिंग फोटोग्राफर कॉस्ट", "बेंगलुरु फोटोग्राफी पैकेज", "Orvex Visuals प्राइसिंग"],
      openGraphTitle: "फोटोग्राफी प्राइसिंग बेंगलुरु 2026 | Orvex Visuals",
      openGraphDescription: "स्पष्ट GST-समेत प्राइसिंग। वेडिंग, प्री-वेडिंग, बेबी और इवेंट फोटोग्राफी पैकेज।",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      description: "Privacy policy for Orvex Visuals photography services. How we collect, use, and protect your personal information.",
    },
    hi: {
      title: "प्राइवेसी पॉलिसी",
      description: "Orvex Visuals फोटोग्राफी सेवाओं के लिए प्राइवेसी पॉलिसी। हम आपकी व्यक्तिगत जानकारी को कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।",
    },
  },
  services: {
    en: {
      title: "Photography Services in Bangalore - Wedding, Events, Baby",
      description:
        "Explore photography and videography services in Bangalore for weddings, pre-wedding shoots, baby sessions, events, drone coverage, and more.",
      keywords: ["photography services Bangalore", "event photographer Bangalore", "wedding services photography", "videography Bangalore"],
      openGraphTitle: "Photography Services in Bangalore | Orvex Visuals",
      openGraphDescription: "Professional photography services starting from transparent GST-inclusive rates.",
    },
    hi: {
      title: "बेंगलुरु में फोटोग्राफी सेवाएं - वेडिंग, इवेंट्स, बेबी शूट्स",
      description:
        "बेंगलुरु में वेडिंग्स, प्री-वेडिंग शूट्स, बेबी सेशंस, इवेंट्स, ड्रोन कवरेज और अधिक के लिए हमारी फोटोग्राफी और वीडियोग्राफी सेवाएं देखें।",
      keywords: ["फोटोग्राफी सेवाएं बेंगलुरु", "इवेंट फोटोग्राफर बेंगलुरु", "वेडिंग फोटोग्राफी सेवाएं", "वीडियोग्राफी बेंगलुरु"],
      openGraphTitle: "बेंगलुरु में फोटोग्राफी सेवाएं | Orvex Visuals",
      openGraphDescription: "पारदर्शी GST-समेत रेट्स के साथ प्रोफेशनल फोटोग्राफी सेवाएं।",
    },
  },
  terms: {
    en: {
      title: "Terms of Service",
      description: "Terms and conditions for Orvex Visuals photography services. Booking policies, cancellations, usage rights, and service agreements.",
    },
    hi: {
      title: "सेवा की शर्तें",
      description: "Orvex Visuals फोटोग्राफी सेवाओं के लिए नियम और शर्तें। बुकिंग नीतियां, कैंसिलेशन, उपयोग अधिकार और सेवा समझौते।",
    },
  },
}

export const DEFAULT_OG_IMAGE = {
  url: `${DOMAIN}/orvex-logo-new.png`,
  alt: BRAND_NAME,
} as const

export function getMetadataCopy(page: MetadataPageKey, locale: AppLocale): PageMetadataCopy {
  return PAGE_METADATA[page][locale] ?? PAGE_METADATA[page][DEFAULT_LOCALE]
}

export function getLocalizedPathname(pathname: string, locale: AppLocale): string {
  return withLocalePathname(pathname, locale)
}

export function getAbsoluteUrl(pathname: string): string {
  return new URL(pathname, DOMAIN).toString()
}

export function getLanguageAlternates(pathname: string): Record<string, string> {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [getLocaleTag(locale), getAbsoluteUrl(getLocalizedPathname(pathname, locale))])
  ) as Record<string, string>

  languages["x-default"] = getAbsoluteUrl(getLocalizedPathname(pathname, DEFAULT_LOCALE))
  return languages
}

export function getLocalizedAlternates(pathname: string, locale: AppLocale): NonNullable<Metadata["alternates"]> {
  return {
    canonical: getAbsoluteUrl(getLocalizedPathname(pathname, locale)),
    languages: getLanguageAlternates(pathname),
  }
}

export function getOpenGraphLocale(locale: AppLocale): string {
  return getLocaleTag(locale).replace("-", "_")
}

export function getOpenGraphAlternateLocales(locale: AppLocale): string[] {
  return SUPPORTED_LOCALES.filter((supportedLocale) => supportedLocale !== locale).map(getOpenGraphLocale)
}

function getTwitterImages(images: NonNullable<OpenGraphInput["images"]> | undefined): NonNullable<TwitterInput["images"]> | undefined {
  if (!images) return undefined

  const normalizedImages = Array.isArray(images) ? images : [images]
  const twitterImages = normalizedImages
    .map((image) => {
      if (typeof image === "string" || image instanceof URL) return image
      return image.url ?? null
    })
    .filter((image): image is string | URL => Boolean(image))

  return twitterImages.length > 0 ? twitterImages : undefined
}

export function buildLocalizedMetadata(
  locale: AppLocale,
  input: {
    pathname: string
    title: string
    description: string
    keywords?: string[]
    authors?: Metadata["authors"]
    robots?: Metadata["robots"]
    openGraph?: OpenGraphInput
    twitter?: TwitterInput
  }
): Metadata {
  const {
    title: openGraphTitle,
    description: openGraphDescription,
    type: openGraphType = "website",
    images: openGraphImagesInput,
    ...openGraphRest
  } = input.openGraph ?? {}

  const {
    title: twitterTitle,
    description: twitterDescription,
    card: twitterCard = "summary_large_image",
    images: twitterImages,
    ...twitterRest
  } = input.twitter ?? {}

  const openGraphImages = openGraphImagesInput ?? [DEFAULT_OG_IMAGE]

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    authors: input.authors,
    robots: input.robots,
    alternates: getLocalizedAlternates(input.pathname, locale),
    openGraph: {
      type: openGraphType,
      locale: getOpenGraphLocale(locale),
      alternateLocale: getOpenGraphAlternateLocales(locale),
      url: getAbsoluteUrl(getLocalizedPathname(input.pathname, locale)),
      siteName: BRAND_NAME,
      title: openGraphTitle ?? input.title,
      description: openGraphDescription ?? input.description,
      images: openGraphImages,
      ...openGraphRest,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle ?? openGraphTitle ?? input.title,
      description: twitterDescription ?? openGraphDescription ?? input.description,
      images: twitterImages ?? getTwitterImages(openGraphImages),
      ...twitterRest,
    },
  }
}
