# Orvex Visuals — Complete Customization Guide

> **Both repos must stay in sync.**
> After every change in `orvex-visuals`, run:
> ```powershell
> Copy-Item "c:\Shaik Safi\ORVEX_VISUALS\orvex-visuals\<changed-file>" "c:\Shaik Safi\ORVEX_VISUALS\client-directive-error\<same-path>" -Force
> ```

---

## Quick Reference Table

| What you want to change | File |
|---|---|
| Phone number, email, WhatsApp messages | `lib/constants.ts` |
| Navbar links | `components/Navbar.tsx` |
| Footer links, social media URLs | `components/Footer.tsx` |
| Site SEO title, description, og:image | `app/layout.tsx` |
| Homepage — hero carousel, FAQ, CTA banner | `components/home/ClientSections.tsx` |
| Pricing — all prices, descriptions, hours | `app/pricing/page.tsx` |
| Services list — all service cards | `app/services/data.ts` |
| Service detail pages — packages, process, FAQs | `app/services/data.ts` |
| Gallery photos | `app/gallery/page.tsx` |
| About page — story, stats, team | `app/about/page.tsx` |
| Contact — address, hours, social links | `app/contact/page.tsx` |
| Booking form — steps, WhatsApp message | `app/book/page.tsx` |
| Blog posts | `app/blog/` |
| Portfolio images (public folder) | `public/images/portfolio/` |
| Logo | `public/images/logo.png` |

---

## 1. Global Constants — `lib/constants.ts`

**This is the most important file. Changes here affect the entire site.**

```ts
export const PHONE_NUMBER = "919845332306"       // WhatsApp number (no +, no spaces)
export const PHONE_DISPLAY = "+91 98453 32306"   // How it appears on screen
export const EMAIL = "hello@orvexvisuals.com"    // Contact email
export const BRAND_NAME = "Orvex Visuals"        // Brand name everywhere
export const DOMAIN = "https://orvexvisuals.com" // Your live domain
```

**WhatsApp pre-fill messages** — these open WhatsApp with text already typed:
```ts
export const WA_MESSAGES = {
  general: "Hi Orvex Visuals, I have a question",
  booking: "Hi Orvex, I'd like to check availability for my event",
  quote: "Hi Orvex, I'd like to check availability and get a quote",
  pricing: (pkg, price) => `Hi Orvex, I'm interested in the ${pkg} package (₹${price})`,
  service: (name) => `Hi Orvex, I'm interested in ${name}`,
}
```

**Portfolio image paths** used in the homepage hero carousel:
```ts
export const IMAGES = {
  hero: [
    "/images/portfolio/hero-1.jpg",   // Replace with your actual photos
    "/images/portfolio/hero-2.jpg",
    "/images/portfolio/hero-3.jpg",
  ],
  about: [
    "/images/portfolio/about-1.jpg",  // Used on About page photo grid
    "/images/portfolio/about-2.jpg",
    "/images/portfolio/about-3.jpg",
    "/images/portfolio/about-4.jpg",
  ],
  logo: "/images/logo.png",
  ogImage: "/images/og-cover.jpg",    // Social share preview image
}
```

> ⚠️ **NOTE:** The pricing page (`app/pricing/page.tsx`) has the WhatsApp number hardcoded as `919845332306`. If you change the number, update it there too.

---

## 2. Site-wide SEO — `app/layout.tsx`

Change these to update how the site appears in Google and when shared on social media:

```ts
title: "Orvex Visuals — Premium Photography & Videography in Bangalore"
description: "Professional photography & videography in Bangalore. Transparent pricing, 5-day delivery, 100% copyright yours. Wedding, pre-wedding, baby shoots, events & more. Starting ₹7,999."
keywords: ["photography in Bangalore", "wedding photographer Bangalore", ...]
```

**Open Graph image** (shown when link is shared on WhatsApp, Instagram, etc.):
```ts
url: "https://images.unsplash.com/..."  // Replace with your own hosted image URL
```

**Business schema** (structured data for Google):
```ts
telephone: "+91-9845332306"
email: "hello@orvexvisuals.com"
streetAddress: "Koramangala"
addressLocality: "Bangalore"
postalCode: "560034"
priceRange: "₹7,999 - ₹1,50,000"
```

---

## 3. Navbar — `components/Navbar.tsx`

Two separate link sets — one for homepage, one for all other pages:

```ts
// Links shown only on the homepage (scroll anchors)
const homepageLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

// Links shown on all other pages
const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]
```

---

## 4. Footer — `components/Footer.tsx`

**Social media links** (currently `href="#"` — needs your real URLs):
```tsx
{[Instagram, Facebook, Linkedin].map((Icon, i) => (
  <a key={i} href="#">   // ← Replace # with your Instagram/Facebook/LinkedIn URLs
```

**Footer services list** (quick links in footer column):
```ts
["Wedding Photography", "/services/wedding-photography"],
["Pre-Wedding Shoot", "/services/pre-wedding-photoshoot"],
["Baby Photoshoot", "/services/baby-photoshoot"],
["Event Photography", "/services"],
["Drone Photography", "/services/drone-photography"],
```

**Footer contact info** pulls from `lib/constants.ts` (PHONE_DISPLAY and EMAIL) automatically.

---

## 5. Homepage — `components/home/ClientSections.tsx`

### Hero Section
- **Carousel images**: Replace `IMAGES.hero` paths in `lib/constants.ts` → put your actual photos in `public/images/portfolio/`
- **Top padding**: Currently `pt-28 pb-12` (clears 80px navbar with breathing room)
- **Urgency badge** (the "Book now — only X weekends left" text):
```tsx
function getUpcomingMonths() {
  // This auto-generates month names for urgency badge
  // Edit the badge text below in the JSX
}
```

### FAQ Section
Find the `faqs` array in `ClientSections.tsx`:
```ts
const faqs = [
  {
    question: "How far in advance should I book?",
    answer: "For weddings, we recommend booking 3-6 months in advance...",
  },
  // Add, remove, or edit any question/answer here
]
```

### CTA Banner (bottom of homepage)
- Section has `id="contact"` — needed for the navbar Contact link
- Edit the heading, subtext, and button labels directly in the JSX

---

## 6. Pricing Page — `app/pricing/page.tsx`

**This is the most detailed file to edit. All data is at the top of the file.**

### Quick-Start Packages (Essential / Premium / Luxury)
```ts
const packages = [
  {
    name: "Essential",
    subtitle: "Perfect for intimate events",
    price: 20000,                          // ← Change price here
    features: [
      "1 Professional Photographer",
      "5 hours coverage",
      "Unlimited soft copies",
      "50 edited highlights",
      "Digital delivery in 5 days",        // ← Change delivery days here
      "Pre-event planning call",
    ],
    notIncluded: ["Video", "Drone", "Album", "Makeup"],
  },
  // ... Premium and Luxury follow same structure
]
```

### Calculator Services
Each service has: name, description (shown below name), coverage options with hours and price:
```ts
{
  id: "wedding-candid",
  name: "Wedding Photography — Candid",
  description: "Natural, unposed moments — real emotions as they happen",  // ← Edit description
  coverageOptions: [
    {
      type: "Half Day",
      hours: "4–5 hrs",       // ← Edit hours shown in pill
      price: 20000,           // ← Edit price
      includes: [             // ← Edit what's listed in "What's Included" box
        "1 Photographer",
        "50+ edited photos",
        "Candid + posed shots",
      ],
    },
    {
      type: "Full Day",
      hours: "8–10 hrs",
      price: 35000,
      includes: [
        "1 Photographer",
        "100+ edited photos",
        "Candid + posed shots",
        "Pre-event planning call",
      ],
    },
  ],
},
```

### Add-ons
```ts
const addOns = [
  { id: "drone", name: "Drone Coverage", price: 5000, description: "Aerial photos + video (1 session)", maxQty: 3 },
  { id: "extra-photographer", name: "Extra Photographer", price: 8000, description: "Additional coverage angles", maxQty: 3 },
  { id: "album-25", name: "Photo Album (25 sheets)", price: 5000, description: "Premium printed album", maxQty: 5 },
  { id: "album-40", name: "Photo Album (40 sheets)", price: 8000, description: "Deluxe large album", maxQty: 5 },
  { id: "same-day-edit", name: "Same-Day Edit", price: 7000, description: "Highlight reel ready same day", maxQty: 1 },
  { id: "extra-location", name: "Extra Location", price: 3000, description: "Additional shoot location", maxQty: 5 },
  { id: "led-wall", name: "LED Wall Setup", price: 10000, description: "Digital backdrop for events", maxQty: 2 },
]
```

### Comparison Table (Orvex vs Others)
```ts
const comparisons = [
  { feature: "Pricing Transparency", orvex: "All prices on website", competitor: "\"Call for quote\"" },
  { feature: "GST", orvex: "Included in price", competitor: "+18% surprise" },
  { feature: "Photo Delivery", orvex: "5 days", competitor: "30-45 days" },  // ← Update if delivery time changes
  { feature: "Video Delivery", orvex: "15 days", competitor: "45-60 days" },
  // ...
]
```

---

## 7. Services — `app/services/data.ts`

**This file is the single source of truth for all service cards and detail pages.**

### Service Cards (listing page `/services`)
Each card object:
```ts
{
  slug: "wedding-photography",          // URL: /services/wedding-photography
  name: "Wedding Photography",
  category: "wedding",                  // Filter category
  description: "Candid + Traditional coverage...",  // 1-2 sentence description on card
  startingPrice: 20000,                 // "Starting from ₹20,000" on card
  image: "https://...",                 // Card thumbnail (replace with your photos)
  popular: true,                        // Shows "Popular" badge on card
},
```

**Image tip**: Replace all `images.unsplash.com` URLs with your own actual portfolio photos hosted in `/public/images/` or on a CDN.

### Service Detail Pages (`/services/[slug]`)
Further down in `data.ts`, the `serviceDetails` array has detailed info for each service's individual page. Each entry has:

```ts
{
  slug: "wedding-photography",
  name: "Wedding Photography",
  tagline: "Short catchy line for the hero",
  description: "1-line description",
  longDescription: "2-3 paragraph description shown on the page",
  heroImage: "https://...",             // Full-width hero image on detail page
  gallery: ["https://...", ...],        // Photo grid on detail page (6 images)
  packages: [                           // Pricing table on detail page
    {
      name: "Basic",
      price: 20000,
      duration: "4 hours",
      features: ["1 Photographer", "50 edited photos", "..."],
      popular: false,
    },
  ],
  includes: [                           // "What's Included" checklist
    "Pre-shoot planning call",
    "Backup equipment on site",
    "Online gallery delivery",
  ],
  process: [                            // How it works — step by step
    { step: "Consultation", description: "We discuss your vision..." },
    { step: "Planning", description: "..." },
  ],
  faqs: [                               // FAQs specific to this service
    { q: "How many photos will I receive?", a: "..." },
  ],
  relatedSlugs: ["pre-wedding-photoshoot", "candid-wedding-photography"],
}
```

---

## 8. About Page — `app/about/page.tsx`

### Stats (the 4 numbers section)
```ts
const stats = [
  { number: "500+", label: "Events Covered" },   // ← Update as business grows
  { number: "200+", label: "Happy Clients" },
  { number: "50K+", label: "Photos Delivered" },
  { number: "4.9", label: "Google Rating" },
]
```

### Our Story text
In the `OurStory` component, edit the `<p>` paragraphs directly.

### Team Members
```ts
const team = [
  {
    name: "Orvex Team",                          // ← Replace with actual names
    role: "Lead Photographer",
    image: "https://...",                         // ← Replace with actual team photos
    speciality: "Weddings & Candid",
  },
  // ...
]
```

### Why Choose Us (6 cards)
```ts
const reasons = [
  { icon: Target, title: "Detail-Oriented", description: "We obsess over every frame..." },
  { icon: Shield, title: "Transparent Pricing", description: "All prices are GST-inclusive..." },
  { icon: Zap, title: "Quick Turnaround", description: "48-hour previews and 7-15 day full delivery..." },  // ← Update delivery time if it changes
  // ...
]
```

### About page hero stats (inline, under the heading)
```tsx
<div>Since 2020</div>              // ← Year founded
<div>500+ Events</div>             // ← Event count
<div>Bangalore, India</div>
```

### About page hero images (4-image grid)
```tsx
<Image src="https://images.unsplash.com/..." .../>  // ← Replace all 4 with your photos
```

---

## 9. Contact Page — `app/contact/page.tsx`

### Phone, Email
These auto-pull from `lib/constants.ts`. Change them there.

### Working Hours
```tsx
<p>Mon — Sat: 9 AM - 8 PM</p>       // ← Edit hours
<p>Sunday: By Appointment</p>
```

### Location
```tsx
<p>Bangalore, Karnataka, India</p>   // ← Edit address
<p>Available PAN India for travel</p>
```

### Social Media Icons
```tsx
<a href="#">   // ← Replace # with real Instagram URL
<a href="#">   // ← Replace # with real YouTube URL
```

---

## 10. Gallery Page — `app/gallery/page.tsx`

Replace the image URLs with your own portfolio photos. Images are currently pulled from Unsplash. Put real photos in `public/images/gallery/` and update the paths.

---

## 11. Booking Form — `app/book/page.tsx`

### Service options in the dropdown
```ts
const serviceOptions = [
  "Wedding Photography",
  "Pre-Wedding Photoshoot",
  "Baby Photoshoot",
  // Add or remove services here
]
```

### WhatsApp message format
The final WhatsApp message sent when form is submitted:
```ts
const msg = `Hi Orvex! I'm ${name}.\n\nService: ${service}\nDate: ${date}\nMessage: ${message}\n\nPhone: ${phone}\nEmail: ${email}`
```
Edit the message template here.

### 30% advance amount
```tsx
<p>30% advance to confirm booking</p>  // ← Shown on the booking page
```

---

## 12. Images — Where to Put Your Photos

```
public/
  images/
    logo.png                  ← Your logo (referenced in lib/constants.ts)
    og-cover.jpg              ← Social share image (1200×630px)
    portfolio/
      hero-1.jpg              ← Homepage hero carousel slide 1
      hero-2.jpg              ← Homepage hero carousel slide 2
      hero-3.jpg              ← Homepage hero carousel slide 3
      about-1.jpg             ← About page photo grid image 1
      about-2.jpg             ← About page photo grid image 2
      about-3.jpg             ← About page photo grid image 3
      about-4.jpg             ← About page photo grid image 4
    gallery/
      (your gallery photos)   ← Gallery page
```

---

## 13. Blog — `app/blog/`

Each blog post is a folder under `app/blog/[slug]/page.tsx`.  
To add a new post, create a new folder with a `page.tsx` inside it.  
Blog listing is at `app/blog/page.tsx`.

---

## 14. Post-Processing / Delivery Details — Where Each Value Lives

| Detail | File | Where exactly |
|---|---|---|
| "5 days delivery" (pricing page) | `app/pricing/page.tsx` | `packages[].features` array + comparison table |
| "5 days delivery" (about page) | `app/about/page.tsx` | `WhyChooseUs` → `reasons` array (`Zap` card) |
| "5 days delivery" (services page) | `app/services/data.ts` | `serviceDetails[].includes` array per service |
| "100+ edited photos" | `app/pricing/page.tsx` | `coverageOptions[].includes` inside each service |
| "50+ edited photos" | `app/services/data.ts` | `serviceDetails[].packages[].features` |
| "48-hour preview" | `app/about/page.tsx` | `WhyChooseUs` reasons description |
| "30% advance" | `app/book/page.tsx` | Booking CTA text |
| GST included notice | `app/pricing/page.tsx` | Hero badge + total display |

---

## 15. Prices That Appear in Multiple Places

If you change a price, update it in **both** these files:

| Price | `app/pricing/page.tsx` | `app/services/data.ts` |
|---|---|---|
| Wedding Photography | `serviceOptions` → `wedding-candid` / `wedding-traditional` | `services` → `startingPrice` |
| Pre-Wedding | `serviceOptions` → `pre-wedding-photo` | `services` → `startingPrice` |
| Baby Photoshoot | `serviceOptions` → `baby-photo` | `services` → `startingPrice` |
| Cinematic Video | `serviceOptions` → `videography-cinematic` | `services` → `startingPrice` |
| Drone | `addOns` → `drone` | `services` → `startingPrice` (drone-photography) |

---

## 16. Most Common Tasks — Step by Step

### Change a price
1. Open `app/pricing/page.tsx` → find the service in `serviceOptions` → change `price` in `coverageOptions`
2. Open `app/services/data.ts` → find the same service → change `startingPrice`

### Add a new team member
Open `app/about/page.tsx` → find `const team = [...]` → add a new object with `name`, `role`, `image`, `speciality`

### Change working hours
Open `app/contact/page.tsx` → find "Mon — Sat: 9 AM - 8 PM" → edit

### Add Instagram / YouTube links
1. `app/contact/page.tsx` → find `<a href="#">` with `<Instagram />` and `<Youtube />` → replace `#`
2. `components/Footer.tsx` → find social icon links → replace `href="#"` with your URLs

### Change delivery time (e.g. from 5 days to 3 days)
Update in all these places:
- `app/pricing/page.tsx` → packages features + comparison table
- `app/about/page.tsx` → WhyChooseUs Zap card description
- `app/services/data.ts` → each service's `includes` array
- `app/layout.tsx` → site description meta tag

### Replace placeholder portfolio images
1. Put your actual `.jpg` files in `public/images/portfolio/`
2. Update `IMAGES.hero` and `IMAGES.about` paths in `lib/constants.ts`
3. For service cards and detail pages: update `image:` and `gallery:` fields in `app/services/data.ts`
4. For about page grid: update the `<Image src="...">` tags in `app/about/page.tsx`

### Update business address / location
1. `app/contact/page.tsx` → location card
2. `app/layout.tsx` → JSON-LD schema (`streetAddress`, `postalCode`)

---

*Last updated: May 2026*
