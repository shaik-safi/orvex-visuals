import type { AppLocale } from "@/lib/i18n/config"

const QUOTE_VALUE_TRANSLATIONS_HI: Record<string, string> = {
  "Half Day": "आधा दिन",
  "Full Day": "पूरा दिन",
  "Traditional Photography": "ट्रेडिशनल फोटोग्राफी",
  "Candid Photography": "कैंडिड फोटोग्राफी",
  "Traditional Videography": "ट्रेडिशनल वीडियोग्राफी",
  "Cinematic Videography": "सिनेमैटिक वीडियोग्राफी",
  "Drone Coverage": "ड्रोन कवरेज",
  "LED Wall Setup": "एलईडी वॉल सेटअप",
  "Same-Day Edit": "सेम-डे एडिट",
  "Live Streaming": "लाइव स्ट्रीमिंग",
  "Photo Album (25 sheets)": "फोटो एल्बम (25 शीट)",
  "Photo Album (40 sheets)": "फोटो एल्बम (40 शीट)",
  "Your Event": "आपका इवेंट",
  "Event Coverage": "इवेंट कवरेज",
  "Photoshoot Session": "फोटोशूट सेशन",
  "Pellikuthuru / Nalangu": "पेल्लिकुथुरु / नलंगु",
  "Haldi / Pasupu": "हल्दी / पसुपु",
  Sangeeth: "संगीत",
  "Muhurtham (Wedding)": "मुहूर्तम (वेडिंग)",
  Reception: "रिसेप्शन",
  Roka: "रोका",
  Haldi: "हल्दी",
  Mehendi: "मेहंदी",
  "Baraat & Wedding": "बारात और वेडिंग",
  Nikah: "निकाह",
  "Walima / Reception": "वलीमा / रिसेप्शन",
  Engagement: "एंगेजमेंट",
  "Church Ceremony": "चर्च सेरेमनी",
  "Reception / Party": "रिसेप्शन / पार्टी",
  "Anand Karaj (Gurudwara)": "आनंद कारज (गुरुद्वारा)",
  "Ring Ceremony": "रिंग सेरेमनी",
  "Cocktail / After Party": "कॉकटेल / आफ्टर पार्टी",
  "Pre-Wedding Photoshoot": "प्री-वेडिंग फोटोशूट",
  "Baby / Maternity": "बेबी / मैटरनिटी",
  "Griha Pravesh / Housewarming": "गृह प्रवेश / हाउसवॉर्मिंग",
  "Conference / Seminar": "कॉन्फ्रेंस / सेमिनार",
  "Award Ceremony": "अवॉर्ड सेरेमनी",
  "Wedding Photography": "वेडिंग फोटोग्राफी",
  "Candid Wedding Photography": "कैंडिड वेडिंग फोटोग्राफी",
  "Christian Wedding Photography": "क्रिश्चियन वेडिंग फोटोग्राफी",
  "Muslim Wedding Photography": "मुस्लिम वेडिंग फोटोग्राफी",
  "Post-Wedding Photoshoot": "पोस्ट-वेडिंग फोटोशूट",
  "Engagement Photography": "एंगेजमेंट फोटोग्राफी",
  "Anniversary Photoshoot": "एनिवर्सरी फोटोशूट",
  "Birthday Photography": "बर्थडे फोटोग्राफी",
  "Baby Shower Photography": "बेबी शॉवर फोटोग्राफी",
  "Haldi & Mehendi Photography": "हल्दी और मेहंदी फोटोग्राफी",
  "Sangeet Photography": "संगीत फोटोग्राफी",
  "Naming Ceremony Photography": "नामकरण समारोह फोटोग्राफी",
  "Cradle Ceremony Photography": "झूला समारोह फोटोग्राफी",
  "Housewarming Photography": "गृहप्रवेश फोटोग्राफी",
  "Upanayana / Thread Ceremony Photography": "उपनयन / थ्रेड सेरेमनी फोटोग्राफी",
  "Shastipurthi Photography": "षष्टिपूर्ति फोटोग्राफी",
  "Puberty Function Photography": "प्यूबर्टी फंक्शन फोटोग्राफी",
  "Holy Communion & Baptism Photography": "होली कम्यूनियन और बैप्टिज़्म फोटोग्राफी",
  "Events Photography": "इवेंट फोटोग्राफी",
  "Baby Photoshoot": "बेबी फोटोशूट",
  "Newborn Photography": "न्यूबॉर्न फोटोग्राफी",
  "Maternity Photography": "मैटरनिटी फोटोग्राफी",
  "Indoor Maternity Photoshoot": "इंडोर मैटरनिटी फोटोशूट",
  "Family Photoshoot": "फैमिली फोटोशूट",
  "Wedding Videography": "वेडिंग वीडियोग्राफी",
  "Drone Photography & Video": "ड्रोन फोटोग्राफी और वीडियो",
  "Video Editing Services": "वीडियो एडिटिंग सेवाएं",
  "Corporate Video Production": "कॉर्पोरेट वीडियो प्रोडक्शन",
  "Corporate Event Photography": "कॉर्पोरेट इवेंट फोटोग्राफी",
  "Portrait Photography": "पोर्ट्रेट फोटोग्राफी",
  "Portfolio Shoot": "पोर्टफोलियो शूट",
  "Fashion Photography": "फैशन फोटोग्राफी",
  "Product & E-Commerce Photography": "प्रोडक्ट और ई-कॉमर्स फोटोग्राफी",
  "Digital Photo Studio": "डिजिटल फोटो स्टूडियो",
  "Album Design & Printing": "एल्बम डिजाइन और प्रिंटिंग",
  "Photo Frames & Canvas Prints": "फोटो फ्रेम्स और कैनवस प्रिंट्स",
  "Photo Restoration Service": "फोटो रिस्टोरेशन सर्विस",
  "Personalized Gifts & Mug Printing": "पर्सनलाइज़्ड गिफ्ट्स और मग प्रिंटिंग",
}

function translateKnownQuoteValue(value: string, locale: AppLocale): string {
  if (locale === "en") return value

  const trimmed = value.trim()
  return QUOTE_VALUE_TRANSLATIONS_HI[trimmed] ?? value
}

export function localizeQuoteValue(value: string | undefined, locale: AppLocale): string | undefined {
  if (!value) return value
  return translateKnownQuoteValue(value, locale)
}

export function localizeQuoteListValue(value: string | undefined, locale: AppLocale): string | undefined {
  if (!value) return value
  if (locale === "en") return value

  return value
    .split(",")
    .map((part) => translateKnownQuoteValue(part.trim(), locale))
    .join(", ")
}