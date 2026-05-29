# Orvex Visuals - Website Customization Guide

This is the owner-facing editing guide for the current production codebase.

Use it when you want to change pricing, packages, service descriptions, homepage content, images, logo, blog content, WhatsApp messages, contact information, English content, Hindi content, quote templates, quote PDF output, booking flow, estimate flow, Firebase settings, or deployment settings without re-mapping the whole repo.

---

## 0. Important First Notes

### This guide is for one repo only

Use this repo only:

```powershell
c:\Shaik Safi\ORVEX_VISUALS\orvex-visuals-main-current-repo\orvex-visuals-main
```

Current rule:

- this is the deployed repo
- do not update old sandbox notes
- do not edit the separate `orvex-visuals-updated-code` repo when working from this guide

### The current project already has these systems

You do not need to redesign them to make normal content changes:

- pricing single source of truth
- middleware-based English/Hindi routing
- homepage message catalogs
- localized service data layer
- booking to saved-quote flow
- secure quote link flow
- browser print / PDF quote output
- Firebase client + admin setup
- signed admin sessions
- Vercel deployment settings

### The current architecture rules that matter most

1. Pricing starts in `lib/constants.ts`.
2. Shared English/Hindi text lives in the `lib/i18n/messages/` JSON files.
3. Service-specific Hindi content lives in `app/services/data.ts`, not in the JSON message files.
4. Saved quote values are localized at render time by `lib/quote-localization.ts`.
5. Quote PDF output is not a separate PDF library. It is the browser print view of `app/quote/[id]/page.tsx` styled by `app/globals.css`.

### Safe edit order

When making owner-level changes, use this order:

1. constants and message catalogs
2. service, blog, gallery, or homepage data
3. page/component structure
4. print or visual CSS
5. API or environment settings only if the feature behavior really changed

---

## 1. Quick Reference - Where To Edit What

| What you want to change | File |
|---|---|
| Phone number, email, social links, delivery days, domain | `lib/constants.ts` |
| Core pricing rates, add-ons, package presets | `lib/constants.ts` |
| Pricing page labels and Hindi/English copy | `lib/i18n/messages/pages.en.json`, `lib/i18n/messages/pages.hi.json` |
| Pricing page builder logic, estimate flow, event templates | `app/pricing/page.tsx` |
| Shared UI text for navbar, footer, WhatsApp float | `lib/i18n/messages/common.en.json`, `lib/i18n/messages/common.hi.json` |
| Homepage text and CTA wording | `lib/i18n/messages/home.en.json`, `lib/i18n/messages/home.hi.json` |
| Homepage hero / FAQ / CTA component structure | `components/home/ClientSections.tsx` |
| Homepage services strip and server-rendered home sections | `components/home/HomeServerSections.tsx` |
| Which services appear on homepage | `components/home/home-data.ts` |
| Service cards, service detail content, Hindi service descriptions | `app/services/data.ts` |
| Service page metadata | `app/services/[slug]/layout.tsx` |
| Booking form labels | `lib/i18n/messages/pages.en.json`, `lib/i18n/messages/pages.hi.json` |
| Booking flow and final WhatsApp message | `app/book/page.tsx` |
| Saved quote page labels | `lib/i18n/messages/pages.en.json`, `lib/i18n/messages/pages.hi.json` |
| Saved quote layout and printable content | `app/quote/[id]/page.tsx` |
| Quote value localization for Hindi | `lib/quote-localization.ts` |
| Quote print / PDF styles | `app/globals.css` |
| Admin password/session behavior | `lib/admin-auth.ts`, `app/api/admin/session/route.ts` |
| Admin quote list / status update API | `app/api/admin/quotes/route.ts` |
| Blog post data | `app/blog/data.ts` |
| Gallery images | `app/gallery/page.tsx` |
| Contact page messaging | `lib/i18n/messages/pages.en.json`, `lib/i18n/messages/pages.hi.json` |
| Contact form behavior and fallback WhatsApp message | `app/contact/page.tsx` |
| Local images | `public/`, `public/images/`, `public/images/portfolio/` |
| Current live logo asset | `public/orvex-logo-new.png` |
| Local environment variables | `.env.local` |
| Firebase client connection | `lib/firebase.ts` |
| Firebase Admin connection | `lib/firebase-admin.ts` |
| Quote encryption and access token logic | `lib/quote-security.ts` |
| Save quote API | `app/api/quotes/route.ts` |
| Fetch quote by secure token | `app/api/quotes/[id]/route.ts` |
| Inquiry save API | `app/api/inquiries/route.ts` |
| Next.js image and security headers | `next.config.mjs` |
| Root metadata and business schema | `app/layout.tsx`, `lib/i18n/metadata.ts` |

---

## 2. Local Setup On Personal Laptop

### Requirements

Install these first:

- Node.js 20 or newer recommended
- npm
- Git

### Open the project

```powershell
cd "c:\Shaik Safi\ORVEX_VISUALS\orvex-visuals-main-current-repo\orvex-visuals-main"
```

### Install dependencies

```powershell
npm install
```

### Start local development server

```powershell
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Production build test on laptop

Use these commands before deployment if you want to verify production behavior locally:

```powershell
npm run build
npm run start
```

### Available scripts

From `package.json`:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint ."
}
```

---

## 3. Environment Variables - `.env.local`

This project uses environment variables for Firebase, secure quotes, and admin access.

The repo expects `.env.local` locally, and Vercel env vars in production.

### Full env set for the current project

```env
# PUBLIC FIREBASE (browser-side)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# FIREBASE ADMIN (server-side)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# QUOTE SECURITY
QUOTE_ACCESS_SECRET=

# ADMIN ACCESS
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

### Ready-to-copy `.env.local` example

```env
# PUBLIC FIREBASE (browser-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# FIREBASE ADMIN (server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# QUOTE SECURITY
QUOTE_ACCESS_SECRET=put-a-long-random-secret-here

# ADMIN ACCESS
ADMIN_PASSWORD=set-a-strong-admin-password
ADMIN_SESSION_SECRET=set-a-separate-signing-secret
```

### What each group does

Public client Firebase values:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

These are used by `lib/firebase.ts` for browser-side Firebase setup.

Server-side Firebase Admin values:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

These are used by `lib/firebase-admin.ts` for API routes and Firestore writes.

Quote security value:

- `QUOTE_ACCESS_SECRET`

This is used by `lib/quote-security.ts` to encrypt payloads and hash access tokens.

Admin values:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

These are used by `lib/admin-auth.ts` and `app/api/admin/session/route.ts`.

Important current behavior:

- `ADMIN_PASSWORD` is required for admin login
- `ADMIN_SESSION_SECRET` is optional in code, but should be set in production
- if `ADMIN_SESSION_SECRET` is missing, the code falls back to the admin password for signing

### Important note for `FIREBASE_PRIVATE_KEY`

The code supports two formats:

- a normal PEM private key with `\n` escaped line breaks
- a Base64-encoded private key string

If you are using the normal PEM form, keep line breaks escaped as `\n` inside the env variable.

---

## 4. Global Settings - `lib/constants.ts`

This is still the most important single file in the site.

### Contact and brand info

Edit these when phone, email, brand, or domain changes:

```ts
export const PHONE_NUMBER = "919845332306"
export const PHONE_DISPLAY = "+91 98453 32306"
export const EMAIL = "orvexvisuals@gmail.com"
export const BRAND_NAME = "Orvex Visuals"
export const DOMAIN = "https://orvexvisuals.com"
```

### General business settings

These values are reused in home messaging, metadata, and service descriptions:

```ts
export const PHOTO_DELIVERY_DAYS = 5
export const VIDEO_DELIVERY_DAYS = 15
export const RESPONSE_TIME_PROMISE = "within 2 hours"
```

### Social links

```ts
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/orvexvisuals",
  facebook: "https://www.facebook.com/orvexvisuals",
}
```

### Shared WhatsApp helpers

Generic WhatsApp wording starts here:

```ts
export const WA_MESSAGES = {
  general: "Hi Orvex Visuals, I have a question",
  booking: "Hi Orvex, I'd like to check availability for my event",
  quote: "Hi Orvex, I'd like to check availability and get a quote",
  pricing: (pkg: string, price: string) =>
    `Hi Orvex, I'm interested in the ${pkg} package (₹${price})`,
  service: (name: string) => `Hi Orvex, I'm interested in ${name}`,
  customPlan: (details: string) => `Hi Orvex! I built a custom plan:\n\n${details}\n\nPlease confirm availability!`,
}
```

More flow-specific WhatsApp wording also exists in:

- `lib/i18n/messages/home.en.json` and `home.hi.json`
- `lib/i18n/messages/pages.en.json` and `pages.hi.json`
- `app/pricing/page.tsx`
- `app/book/page.tsx`
- `app/contact/page.tsx`

### Shared image constants

```ts
export const IMAGES = {
  hero: [
    "/images/portfolio/hero-1.webp",
    "/images/portfolio/hero-2.webp",
    "/images/portfolio/hero-3.webp",
  ],
  about: [
    "/images/portfolio/about-1.webp",
    "/images/portfolio/about-2.webp",
    "/images/portfolio/about-3.webp",
    "/images/portfolio/about-4.webp",
  ],
  logo: "/images/logo.png",
  ogImage: "/images/og-cover.webp",
}
```

### Booking flow session key

The pricing page and booking page hand off plan data using:

```ts
export const BOOKING_PLAN_STORAGE_KEY = "orvex-booking-plan"
```

### Important current logo state

The project currently uses more than one logo reference.

Current state:

- Navbar uses `public/orvex-logo-new.png`
- root schema/metadata uses `public/orvex-logo-new.png`
- `IMAGES.logo` still points to `/images/logo.png`
- blog post schema still hardcodes `https://orvexvisuals.com/logo.png`

If you want one fully consistent logo change, update all of these together.

---

## 5. Multilingual System - English and Hindi

The project already has a working multilingual system. Preserve it and extend it. Do not introduce a second i18n system.

### How locale routing works

Files involved:

- `middleware.ts`
- `lib/i18n/config.ts`
- `lib/i18n/routing.ts`
- `lib/i18n/resolve-locale.ts`

Current behavior:

- localized routes use `/en/...` and `/hi/...`
- bare routes are redirected or rewritten into the localized form
- middleware stores the selected locale in a `locale` cookie
- middleware also sets an `x-locale` header for server-side rendering
- page components then resolve the active locale from that header

### Message catalogs

Current message files:

```text
lib/i18n/messages/
  common.en.json
  common.hi.json
  home.en.json
  home.hi.json
  pages.en.json
  pages.hi.json
```

Use them like this:

- `common.*.json` for navbar, footer, WhatsApp float, and shared UI labels
- `home.*.json` for homepage hero, trust bar, services section copy, FAQ, CTA, and home WhatsApp text
- `pages.*.json` for pricing page, services page chrome, service detail UI labels, blog page labels, gallery labels, contact page text, booking page text, quote page labels, admin page labels, and system pages

### Service-specific localization

Service localization is handled separately in `app/services/data.ts`.

Important current helpers and maps:

- `SERVICE_NAME_HI`
- `SERVICE_CARD_DESCRIPTION_HI`
- `MANUAL_SERVICE_TRANSLATIONS_HI`
- `getLocalizedServiceName()`
- `getLocalizedServices()`
- `getLocalizedServiceDetail()`

Use this file when you want to change:

- Hindi service names
- Hindi service card descriptions
- Hindi long-form service detail content
- Hindi service package feature lists

### Quote-specific localization

Saved quotes are not rewritten in the database when the locale changes.

Instead, `lib/quote-localization.ts` translates saved English display values at render time on the quote page.

This is why old quotes can still render correctly in Hindi without changing the storage format.

Important rule:

If you rename services, event names, or add-ons that appear inside saved quotes, update `lib/quote-localization.ts` too so Hindi quote pages still show the translated value.

### Current English and Hindi content ownership

- shared UI labels: `common.en.json` and `common.hi.json`
- homepage copy: `home.en.json` and `home.hi.json`
- pricing, contact, book, quote, blog, gallery, admin page copy: `pages.en.json` and `pages.hi.json`
- service names and service descriptions: `app/services/data.ts`
- saved quote value translation map: `lib/quote-localization.ts`
- blog post bodies: `app/blog/data.ts`

### Important current blog limitation

Blog page chrome can be translated, but blog post content itself is currently a single data source in `app/blog/data.ts` and is effectively English-only.

That means:

- category labels and surrounding UI can be localized
- post title, excerpt, image, tags, and HTML body are stored once
- if you want true per-locale blog bodies later, that needs a blog data model extension

### How to add or change a translation safely

1. Update the English file and Hindi file together.
2. Keep the same JSON shape in both files.
3. If you add a new structured section to the homepage catalog and TypeScript complains, update the explicit `HomeMessages` type in `lib/i18n/home.ts`.
4. If the text is a service name or Hindi service paragraph, edit `app/services/data.ts`, not the JSON message files.
5. If the text appears inside saved quote values, also review `lib/quote-localization.ts`.

---

## 6. Firebase And Database Setup

This project uses Firebase in two layers.

### Client Firebase

File:

```ts
lib/firebase.ts
```

Used for browser-side initialization.

It reads:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

If `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is missing, client Firebase safely does not initialize.

### Admin Firebase

File:

```ts
lib/firebase-admin.ts
```

Used for secure server-side Firestore access.

It reads:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

If these are missing, `adminDb` is `null` and API routes return configuration errors instead of writing to Firestore.

### Firestore collections in current use

- `quotes`
- `inquiries`

Current write routes:

- `app/api/quotes/route.ts`
- `app/api/inquiries/route.ts`

Current read/admin routes:

- `app/api/quotes/[id]/route.ts`
- `app/api/admin/quotes/route.ts`

### Quote and inquiry storage behavior

The app stores quote and inquiry payloads encrypted on the server using:

```ts
lib/quote-security.ts
```

This uses AES-256-GCM and depends on:

```env
QUOTE_ACCESS_SECRET
```

### Public write flow in current architecture

Important current behavior:

- direct client Firestore writes are not the main path
- public submissions go through server routes
- quote and inquiry payloads are sanitized before save
- Firestore rules are expected to stay locked down

### Firebase Console setup steps

1. Create a Firebase project.
2. Enable Firestore Database.
3. Add a Web App inside the Firebase project.
4. Copy the public Web App values into `.env.local` and Vercel.
5. Open Project Settings -> Service Accounts.
6. Generate a service account key.
7. Copy `project_id`, `client_email`, and `private_key` into env vars.
8. Add `QUOTE_ACCESS_SECRET`.
9. Test booking, saved quote, inquiry, and admin quote list flows.

### Firestore rules

File:

```ts
firestore.rules
```

Current rule style should stay restrictive:

- direct client reads/writes denied
- server Admin SDK does the actual writes

### Important fallback behavior

If Firebase is not configured:

- the public website still renders
- pricing calculations still work
- most WhatsApp flows still work
- quote and inquiry APIs do not persist data
- booking can fall back to WhatsApp-only behavior where supported

---

## 7. Deployment To Vercel

This project is already structured for Vercel.

### Normal deployment steps

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Let Vercel detect it as a Next.js app.
4. Add all required env vars.
5. Deploy.
6. Test pricing, booking, quote, inquiry, and admin flows on the live site.

### Environment variables to add in Vercel

```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
QUOTE_ACCESS_SECRET
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

### Build command

```powershell
npm run build
```

### Start command

```powershell
npm run start
```

### Current deployment settings that matter

File:

```ts
next.config.mjs
```

Current important behavior:

- CSP is enabled
- `Cross-Origin-Opener-Policy` is set to `same-origin-allow-popups`
- remote image host allow-list is currently only `images.unsplash.com`

This matters because:

- WhatsApp popup behavior depends on the popup-friendly cross-origin header setup
- new remote image hosts must be added to `images.remotePatterns`
- new remote image hosts should also be added to the CSP `img-src` directive

### Important deployment note

If public Firebase vars exist but admin vars do not:

- the frontend may still look normal
- quote save and inquiry save APIs will fail
- admin quote views will fail

If `QUOTE_ACCESS_SECRET` is missing:

- secure quote creation and secure quote viewing break

If `ADMIN_PASSWORD` is missing:

- admin login is effectively unavailable

---

## 8. Custom Domain Setup

Main domain value in code:

```ts
lib/constants.ts
```

Current value:

```ts
export const DOMAIN = "https://orvexvisuals.com"
```

### When changing domain

Update all of these together:

1. `DOMAIN` in `lib/constants.ts`
2. domain records in Vercel
3. DNS records at your registrar / provider

### Why `DOMAIN` matters

It feeds:

- root metadata
- localized metadata helpers
- structured data URLs
- share links and Open Graph image URLs

If `DOMAIN` is wrong, metadata and structured data will point to the wrong place.

---

## 9. What Is Already Configuration-Driven

These areas usually need value changes, not architecture changes:

- phone number and email
- social links
- response and delivery promises
- service rates and add-on pricing
- package presets
- homepage English/Hindi copy
- pricing page English/Hindi copy
- contact, booking, quote, and admin labels
- service starting prices
- many service package prices
- Firebase initialization
- quote encryption behavior
- admin session signing
- Vercel deployment compatibility

This means most owner tasks are content or config edits, not feature rewrites.

---

## 10. Pricing System - Single Source Of Truth

### Main file

```ts
lib/constants.ts
```

### Core pricing objects

The current site bases pricing on these exports:

- `SERVICE_RATES`
- `EVENT_ADDONS`
- `GLOBAL_ADDONS`
- `MISC_SERVICE_RATES`
- `PACKAGES`
- `computePackagePrice()`

### What updates automatically when you change pricing here

Changing the values above updates many downstream surfaces automatically:

- pricing builder totals
- pricing package cards
- package totals from `computePackagePrice()`
- service listing starting prices for photography / videography / drone categories
- many service detail package prices

### Prebuilt website packages

The main package cards come from `PACKAGES`.

Each package contains:

- visible feature text
- `notIncluded`
- `builderPreset`

Important rule:

If you change what a package includes, update both:

1. `builderPreset`
2. visible feature / exclusion text

Otherwise the card text and the actual computed total will no longer match.

### Current package logic

At the time of this guide update, the main package totals are still driven from the preset mix of services and add-ons, not from hardcoded package prices.

### Change Wedding Photography starting price

For the current setup, the quickest correct edit is usually:

1. update `SERVICE_RATES["candid-photo"].ratePerHalfDay`
2. usually also review `SERVICE_RATES["candid-photo"].ratePerDay`
3. check the pricing page, services page, and key wedding service pages after the change

Why:

- wedding service card starting prices use the photography rate constants
- manual wedding service detail packages also compute from those constants
- pricing builder and package totals use the same constants

---

## 11. Pricing Page, Estimate Flow, and Quote Templates

Main file:

```ts
app/pricing/page.tsx
```

### What this file controls

- pricing page structure
- builder UI
- event rows
- selectors for services and add-ons
- estimate summary
- `Send Estimate`
- `Proceed to Book`
- event templates / booking plan presets

### Where pricing page text lives

Pricing page labels and most visible copy live in:

- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`

Look under the `pricingPage` section.

### Current estimate flow

`Send Estimate`:

- does not save to Firestore
- does not create a quote
- opens WhatsApp with the estimate details

Relevant code areas:

- `generateWhatsAppMessage()`
- `handleSendEstimate()`

### Current book handoff flow

`Proceed to Book`:

- builds the customer plan object
- stores it in `sessionStorage`
- uses `BOOKING_PLAN_STORAGE_KEY`
- redirects to `/book`

### Current quote-template-like presets

There are two important preset layers here:

- `PACKAGES` in `lib/constants.ts` for main website packages
- `eventTemplates` in `app/pricing/page.tsx` for event-based prefill behavior

If you want to change what a customer sees when they pick a preset event or a default package, review both places.

### Current pricing handoff links from other pages

These links are built by:

```ts
lib/pricing-handoff.ts
```

It controls how homepage, blog, and gallery buttons prefill `/pricing` query parameters.

If you want those buttons to open pricing with a different starting template, edit `lib/pricing-handoff.ts`.

---

## 12. Services - Cards, Details, and Hindi Content

Main file:

```ts
app/services/data.ts
```

This file controls both:

- `/services`
- `/services/[slug]`

### Service cards

At the top of the file, `services` controls the listing cards.

Each item contains:

- `slug`
- `name`
- `category`
- `description`
- `startingPrice`
- `icon`
- `image`
- `popular`

### Important current pricing behavior

Many starting prices are computed from shared constants, for example:

- `PHOTO_STARTING`
- `VIDEO_STARTING`
- `DRONE_STARTING`

So changing pricing in `lib/constants.ts` updates many service cards automatically.

### Service detail content

`serviceDetails` contains manually written detail pages for key services.

You can update:

- `tagline`
- `description`
- `longDescription`
- `heroImage`
- `gallery`
- `packages`
- `includes`
- `process`
- `faqs`
- `relatedSlugs`

### Auto-generated service pages

If a service does not have a custom `serviceDetails` entry, `getServiceDetail(slug)` builds a page automatically.

That auto-generated fallback still computes package prices from the shared pricing constants.

### Hindi service descriptions

Important current location:

- short Hindi card text: `SERVICE_CARD_DESCRIPTION_HI`
- Hindi service names: `SERVICE_NAME_HI`
- manual Hindi long-form pages: `MANUAL_SERVICE_TRANSLATIONS_HI`

### Service page metadata

File:

```ts
app/services/[slug]/layout.tsx
```

This file generates localized metadata from the localized service detail data.

If you rename a service or change its main positioning, review metadata too.

### Which services appear on the homepage

File:

```ts
components/home/home-data.ts
```

`homepageSlugs` controls which service cards appear on the homepage.

### Add a new service

Use this order:

1. Add the base card to `services` in `app/services/data.ts`.
2. Add a custom `serviceDetails` entry if the service needs a full bespoke page.
3. Add Hindi name and description support in `SERVICE_NAME_HI` and `SERVICE_CARD_DESCRIPTION_HI`.
4. If the service needs a full Hindi detail page, add it to `MANUAL_SERVICE_TRANSLATIONS_HI`.
5. Add the slug to `homepageSlugs` only if it should be featured on the homepage.
6. If the image uses a new remote host, update `next.config.mjs` and CSP.

### Change Hindi service description

Use `app/services/data.ts`, not the JSON message files.

For a short card description change, update `SERVICE_CARD_DESCRIPTION_HI`.

For a full service detail page change, update `MANUAL_SERVICE_TRANSLATIONS_HI`.

---

## 13. Booking Flow - `app/book/page.tsx`

This file controls the booking page and the transition from a pricing plan into a saved quote.

### What it does

- reads plan data from `sessionStorage`
- shows the booking form
- combines form data and the stored plan
- calls `saveQuote()`
- opens WhatsApp to the owner number
- falls back when quote saving is unavailable

### Current quote save chain

The main flow is:

1. `app/pricing/page.tsx` builds the plan
2. `app/book/page.tsx` reads the plan and customer details
3. `lib/save-quote.ts` posts the quote payload
4. `app/api/quotes/route.ts` sanitizes and saves the encrypted payload
5. Firestore stores the quote in the `quotes` collection
6. the WhatsApp message includes the saved quote link when available

### Booking page text

Most visible booking labels and messages live in:

- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`

Look under `bookPage`.

### Booking WhatsApp message content

For the final booking handoff wording, edit:

```ts
app/book/page.tsx
```

That file still assembles the detailed owner-facing WhatsApp message.

---

## 14. Homepage, Navbar, Footer, and Shared UI

### Homepage structure

Current root file:

```ts
app/page.tsx
```

Current behavior:

- locale is resolved server-side
- home messages are loaded from `lib/i18n/home.ts`
- the page is assembled from client and server sections

### Homepage split in the current project

Client-rendered home sections:

- `components/home/ClientSections.tsx`

These currently include:

- Hero
- FAQ
- CTA banner

Server-rendered home sections:

- `components/home/HomeServerSections.tsx`

These currently include:

- Trust bar
- Services section
- Why Orvex
- How it works
- Testimonials

### Where homepage text really lives

The current guide should not point you only to component files.

Most homepage text now lives in:

- `lib/i18n/messages/home.en.json`
- `lib/i18n/messages/home.hi.json`

Use component files only when you want to change structure, layout, or logic.

### Homepage service cards

Current chain:

1. `components/home/home-data.ts` chooses the slugs
2. `getLocalizedServices(locale)` in `app/services/data.ts` supplies the localized service name and description
3. `components/home/HomeServerSections.tsx` renders the cards

### Navbar and footer shared text

Shared UI copy comes from:

- `lib/i18n/messages/common.en.json`
- `lib/i18n/messages/common.hi.json`

Structure files:

- `components/Navbar.tsx`
- `components/Footer.tsx`
- `components/WhatsAppFloat.tsx`

### Replace homepage hero image

Current source is the `IMAGES.hero` array in `lib/constants.ts`.

Normal process:

1. replace the local file in `public/images/portfolio/` or add a new local file there
2. update the path in `IMAGES.hero`
3. keep the image wide enough for full-screen hero usage

Recommended hero size: at least `1920x1080`.

### Change homepage FAQ or CTA wording

For content only, edit:

- `lib/i18n/messages/home.en.json`
- `lib/i18n/messages/home.hi.json`

Do not edit `ClientSections.tsx` unless the layout or interaction needs to change.

---

## 15. Admin Area and Sessions

### Main admin surfaces

- admin page UI: `app/admin/page.tsx`
- admin page labels: `pages.en.json` and `pages.hi.json` under `adminPage`
- admin session API: `app/api/admin/session/route.ts`
- admin quote list / status API: `app/api/admin/quotes/route.ts`

### How admin auth works now

Core file:

```ts
lib/admin-auth.ts
```

Current behavior:

- admin login checks `ADMIN_PASSWORD`
- successful login issues signed session cookies
- session lifetime is 8 hours
- two cookie scopes are used for page and API access

Current cookie names:

- `orvex_admin_session`
- `orvex_admin_api_session`

### Important admin env rules

- `ADMIN_PASSWORD` must be set
- `ADMIN_SESSION_SECRET` should be set in production
- if you rotate either value, log in again everywhere

### Current admin quotes behavior

`app/api/admin/quotes/route.ts`:

- fetches up to 500 quotes
- decrypts saved payloads when possible
- returns the visible quote data to the admin UI
- allows status updates with `PATCH`

If the admin dashboard looks empty, check these first:

1. `ADMIN_PASSWORD`
2. `ADMIN_SESSION_SECRET`
3. Firebase Admin env vars
4. Firestore collection data in `quotes`

---

## 16. Blog, About, Contact, and Gallery Content

### Blog content

Single source of truth:

```ts
app/blog/data.ts
```

This file stores:

- `blogCategories`
- `blogPosts`
- post slug
- title
- excerpt
- image
- tags
- HTML body content

Current project state:

- blog list and surrounding UI can be localized through `pages.*.json`
- post data itself is currently one content source, effectively English-first

### Add or edit a blog post

Edit `app/blog/data.ts` and update:

- `slug`
- `title`
- `excerpt`
- `category`
- `image`
- `date`
- `readTime`
- `tags`
- `content`

If the blog image uses a remote host other than Unsplash, update `next.config.mjs` and CSP.

### About page

Main file:

```ts
app/about/page.tsx
```

Use it for:

- story
- stats
- team blocks
- trust / credibility content
- about images and structure

### Gallery content

Main file:

```ts
app/gallery/page.tsx
```

Current gallery images are stored inline in the `galleryImages` array.

When replacing a gallery image, update:

- `src`
- `alt`
- `width`
- `height`
- `category`
- `aspect`

Page labels for gallery chrome live in `pages.en.json` and `pages.hi.json` under `galleryPage`.

### Contact page content

Main structure file:

```ts
app/contact/page.tsx
```

Most contact page copy lives in:

- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`

Look under `contactPage`.

Global phone and email still come from `lib/constants.ts`.

---

## 17. Contact and WhatsApp Flows

There is not just one WhatsApp message source in this project.

Use the correct one for the correct flow.

### Current WhatsApp flow map

Generic helper messages:

- `lib/constants.ts`
- `WA_MESSAGES`

Homepage CTA / hero WhatsApp wording:

- `lib/i18n/messages/home.en.json`
- `lib/i18n/messages/home.hi.json`

Pricing estimate WhatsApp content:

- `app/pricing/page.tsx`

Booking final WhatsApp content:

- `app/book/page.tsx`

Contact page fallback WhatsApp template:

- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`
- `app/contact/page.tsx`

Shared floating WhatsApp button labels:

- `lib/i18n/messages/common.en.json`
- `lib/i18n/messages/common.hi.json`

### Change WhatsApp text

Use this rule:

- generic business prompt -> `lib/constants.ts`
- homepage CTA prompt -> `home.*.json`
- pricing estimate wording -> `app/pricing/page.tsx`
- booking / saved quote handoff wording -> `app/book/page.tsx`
- contact form fallback wording -> `pages.*.json` and `app/contact/page.tsx`

### Contact info changes

Phone and email changes start in:

```ts
lib/constants.ts
```

Then check:

- `app/contact/page.tsx`
- `app/layout.tsx`
- any hardcoded schema or metadata values that should stay consistent

---

## 18. Quote Pages, Localization, and PDF Output

### Main quote files

- save quote API: `app/api/quotes/route.ts`
- fetch quote by secure token: `app/api/quotes/[id]/route.ts`
- shared payload contract: `lib/save-quote.ts`
- quote encryption / token logic: `lib/quote-security.ts`
- quote page UI: `app/quote/[id]/page.tsx`
- quote value localization: `lib/quote-localization.ts`
- print styles: `app/globals.css`

### Current quote storage architecture

Quotes are saved with:

- encrypted payload
- hashed access token
- Firestore document ID

The fetch route returns the stored payload unchanged once the token is validated.

That means quote localization is a render concern, not a storage concern.

### Current quote localization strategy

The quote page now localizes values like service names, event labels, and add-on labels at render time using:

- `localizeQuoteValue()`
- `localizeQuoteListValue()`

from `lib/quote-localization.ts`.

This is the current safe approach because it preserves the saved quote schema.

### Current quote page text

Visible quote page labels live in:

- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`

Look under `quotePage`.

### Current quote PDF behavior

The quote page does not use a PDF generation library.

Current behavior:

- the page uses `window.print()`
- the printable DOM is inside `#quote-pdf`
- `app/globals.css` contains the print contract and print styles

Important current print contract:

- preserve the `#quote-pdf` wrapper
- preserve the printable section structure expected by `app/globals.css`
- keep the print helper classes used by the quote page, including classes such as `print-card` and `print-section`

If that DOM contract drifts, the PDF / print output can go blank or lose styling.

### Update quote PDF content

Use this order:

1. edit `app/quote/[id]/page.tsx` for the visible sections, headings, and data layout
2. edit `pages.en.json` and `pages.hi.json` for text labels
3. edit `app/globals.css` for print-only styling

Do not change only the CSS or only the markup if the print layout depends on both.

### Update quote templates or section wording

If by "quote template" you mean the saved quote page content, use:

- `app/quote/[id]/page.tsx`
- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`

If by "quote template" you mean builder/event presets before booking, use:

- `app/pricing/page.tsx`
- `lib/constants.ts`

---

## 19. SEO, Metadata, and Deployment Settings

### Root metadata

Main files:

- `app/layout.tsx`
- `lib/i18n/metadata.ts`

These control:

- default title / template
- description
- keywords
- Open Graph
- Twitter metadata
- localized metadata helpers
- LocalBusiness schema

### Service metadata

File:

```ts
app/services/[slug]/layout.tsx
```

This builds localized service page metadata from the localized service detail data.

### Blog structured data

File:

```ts
app/blog/[slug]/page.tsx
```

Current note:

- blog article schema still hardcodes `https://orvexvisuals.com/logo.png`

If you rename the public logo asset, update this too.

### Deployment settings that affect content changes

File:

```ts
next.config.mjs
```

Review this file when you change:

- remote image host
- CSP behavior
- popup behavior
- security headers

Important current rules:

- remote image host allow-list is only `images.unsplash.com`
- CSP `img-src` also only allows Unsplash as the remote image host
- popup flows rely on `same-origin-allow-popups`

---

## 20. Images and Logo - Where To Put Them

### Current local asset locations

Relevant current public assets:

```text
public/
  orvex-logo-new.png
  apple-icon.png
  icon.svg
  icon-dark-32x32.png
  icon-light-32x32.png
  images/
    portfolio/
      hero-1.webp
      hero-2.webp
      hero-3.webp
```

### Current image usage patterns

- homepage hero images: `lib/constants.ts` -> `IMAGES.hero`
- service card and service detail images: `app/services/data.ts`
- gallery images: `app/gallery/page.tsx`
- blog post images: `app/blog/data.ts`
- logo in navbar / metadata: `public/orvex-logo-new.png`
- Open Graph image constant: `IMAGES.ogImage`

### Recommended image dimensions

These are practical recommendations, not hard-coded limits:

- homepage hero image: `1920x1080` or larger
- Open Graph share image: `1200x630`
- service and blog card images: at least `1200px` wide
- gallery images: keep the provided width / height values realistic and proportional
- logo: transparent PNG or SVG, at least `400px` wide

### Replace service or blog images with local files

If you move from remote Unsplash URLs to local files:

1. put the image inside `public/` or `public/images/...`
2. change the image path in the source file
3. no `next.config.mjs` change is needed for local files

### Use a new remote image host

If you use a remote image host other than Unsplash:

1. update `images.remotePatterns` in `next.config.mjs`
2. update the CSP `img-src` rule in `next.config.mjs`
3. redeploy

### Replace the logo consistently

For a complete logo change, review all of these:

1. `public/orvex-logo-new.png`
2. `lib/constants.ts` -> `IMAGES.logo`
3. `app/layout.tsx`
4. `lib/i18n/metadata.ts`
5. `app/blog/[slug]/page.tsx`

---

## 21. Most Common Tasks

### Change Wedding Photography starting price

Edit:

```ts
lib/constants.ts
```

Usually change:

- `SERVICE_RATES["candid-photo"].ratePerHalfDay`
- `SERVICE_RATES["candid-photo"].ratePerDay`

Then review:

- pricing page package totals
- services listing
- wedding service page packages

### Change Hindi service description

Edit:

```ts
app/services/data.ts
```

Use:

- `SERVICE_CARD_DESCRIPTION_HI` for short card text
- `MANUAL_SERVICE_TRANSLATIONS_HI` for full Hindi service detail content

### Replace homepage hero image

1. put the new image in `public/images/portfolio/` or another local public path
2. update `IMAGES.hero` in `lib/constants.ts`
3. keep the file large enough for full-screen display

### Edit package contents

Edit:

```ts
lib/constants.ts
```

Update the package inside `PACKAGES`:

- `features`
- `notIncluded`
- `builderPreset`

If pricing page wording also needs to change, update `pricingPage` text in `pages.en.json` and `pages.hi.json`.

### Change WhatsApp text

Use the correct source:

- generic text -> `lib/constants.ts`
- homepage CTA text -> `home.en.json` and `home.hi.json`
- pricing estimate text -> `app/pricing/page.tsx`
- booking handoff text -> `app/book/page.tsx`
- contact form fallback text -> `pages.en.json`, `pages.hi.json`, and `app/contact/page.tsx`

### Update quote PDF content

Edit:

```ts
app/quote/[id]/page.tsx
```

And then review:

- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`
- `app/globals.css`

Do not remove the `#quote-pdf` wrapper or the print layout classes.

### Add a new service

1. add the card to `services` in `app/services/data.ts`
2. add a detailed `serviceDetails` entry if needed
3. add Hindi support in `SERVICE_NAME_HI` and `SERVICE_CARD_DESCRIPTION_HI`
4. add manual Hindi long-form content if needed
5. add the slug to `homepageSlugs` if it should show on home
6. check image host settings if using a new remote image source

### Change English or Hindi homepage text

Edit:

- `lib/i18n/messages/home.en.json`
- `lib/i18n/messages/home.hi.json`

### Change quote page labels in English or Hindi

Edit:

- `lib/i18n/messages/pages.en.json`
- `lib/i18n/messages/pages.hi.json`

Look under `quotePage`.

### Change blog content

Edit:

```ts
app/blog/data.ts
```

### Change contact info

Edit:

```ts
lib/constants.ts
```

Then review:

- `app/contact/page.tsx`
- `app/layout.tsx`
- any schema that should match the new business info

### Set up the project on a new laptop

1. install Node.js
2. clone this repo
3. run `npm install`
4. create `.env.local`
5. add Firebase, quote, and admin env vars
6. run `npm run dev`

### Deploy to Vercel

1. push the repo
2. import it into Vercel
3. add all env vars
4. deploy
5. test pricing, booking, quote, inquiry, and admin flows

---

## 22. Editing Rules To Remember

### For pricing changes

Use this order:

1. `lib/constants.ts`
2. `app/services/data.ts` only if service-specific package mix or service copy must change
3. `app/pricing/page.tsx` only if UI, flow, or builder behavior must change

### For translation changes

Use this order:

1. `common.*.json`, `home.*.json`, or `pages.*.json` for shared/page labels
2. `app/services/data.ts` for service-specific Hindi content
3. `lib/quote-localization.ts` if saved quote values must render differently in Hindi

### For quote / PDF changes

- do not remove `#quote-pdf`
- do not change quote markup without checking print CSS
- do not change saved quote display values without checking localization mapping

### For image changes

- do not use a new remote host without updating `next.config.mjs`
- do not rename logo assets without checking all current logo references

### Do not do this

- do not hardcode the same price in multiple files
- do not update visible package text without updating the actual preset
- do not update only English and forget Hindi
- do not create a second multilingual system
- do not forget to update Vercel env vars when secrets change

---

## 23. Recommended Edit Checklist

Whenever you change something important, check these:

1. Did you edit the real source of truth for that content?
2. If pricing changed, did you start in `lib/constants.ts`?
3. If package contents changed, does the visible text still match the computed preset?
4. If English changed, did Hindi get updated too where needed?
5. If a service / event / add-on label changed, does `lib/quote-localization.ts` still cover Hindi quote rendering?
6. If a remote image host changed, did you update `next.config.mjs` and CSP?
7. If a logo filename changed, did you update all current logo references?
8. If env-sensitive behavior changed, did you update Vercel env vars too?
9. Did you test the affected flow in the browser?

Minimum flows to test after major edits:

1. homepage language switch
2. pricing estimate flow
3. proceed-to-book flow
4. saved quote page
5. quote print / PDF output
6. contact inquiry flow
7. admin login and quote list when admin-related changes are made

---

## 24. Quick Summary

If you remember only these, remember these:

1. Most pricing changes start in `lib/constants.ts`.
2. Most English/Hindi UI text lives in `lib/i18n/messages/`.
3. Service-specific Hindi content lives in `app/services/data.ts`.
4. Saved quote display text is localized by `lib/quote-localization.ts`.
5. Quote PDF output is the print view of `app/quote/[id]/page.tsx` styled by `app/globals.css`.
6. Firebase, quote security, and admin access all depend on env vars being correct both locally and in Vercel.
7. The current live logo is centered on `public/orvex-logo-new.png`, but other logo references still exist and must be checked together.

---

Last updated: May 2026
