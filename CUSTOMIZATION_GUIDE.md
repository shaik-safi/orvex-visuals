# Orvex Visuals - Website Customization Guide

This file is the single editing guide for the website.

Use it when you want to change prices, services, contact info, text, images, booking flow, or other content without searching the full codebase.

---

## 0. Important First Notes

### This guide is for one repo only

Use this repo only:

```powershell
c:\Shaik Safi\ORVEX_VISUALS\orvex-visuals
```

If you are working on your personal laptop, you only need this repository.

Ignore any old notes about syncing a sandbox copy unless you intentionally want to keep a second manual backup repo.

### Mostly configuration-based setup

Most important things in this project are already wiring-based and configuration-based.

That means once the environment variables are correct, most major features already work without extra code changes:

- local development
- Vercel deployment
- custom domain usage
- Firebase client setup
- Firebase Admin setup for server routes
- booking quote creation
- inquiry saving
- WhatsApp flows

In practice, most setup work is just:

1. install dependencies
2. add env variables
3. connect Firebase
4. deploy to Vercel
5. attach domain

### Pricing now uses a single source of truth

This is the most important architecture rule in the site now.

Do not hardcode the same price in multiple files.

Main pricing source:

```ts
lib/constants.ts
```

Inside that file:

- `SERVICE_RATES`
- `EVENT_ADDONS`
- `GLOBAL_ADDONS`
- `PACKAGES`
- `computePackagePrice()`

If you want to change photography, videography, drone, album, LED wall, or same-day-edit pricing, change it there first.

### Service pages also compute from the same rates

`app/services/data.ts` now imports rates from `lib/constants.ts`.

That means:

- service listing starting prices are derived from constants
- many service detail package prices are derived from constants
- pricing page package cards are derived from constants
- pricing page builder totals are derived from constants

So in most cases, changing one value in `lib/constants.ts` updates multiple pages automatically.

---

## 1. Quick Reference - Where To Edit What

| What you want to change | File |
|---|---|
| Phone number, email, social links, brand, delivery days | `lib/constants.ts` |
| All pricing rates and add-ons | `lib/constants.ts` |
| Starter / Signature / Grand package contents | `lib/constants.ts` |
| Pricing page layout, labels, builder UI, WhatsApp estimate flow | `app/pricing/page.tsx` |
| Service cards, service descriptions, service detail content | `app/services/data.ts` |
| Booking form flow and WhatsApp booking message | `app/book/page.tsx` |
| Homepage sections | `components/home/ClientSections.tsx` |
| Navbar links | `components/Navbar.tsx` |
| Footer links and social icons | `components/Footer.tsx` |
| Site-wide SEO and metadata | `app/layout.tsx` |
| About page story, stats, team | `app/about/page.tsx` |
| Contact page address, hours, links | `app/contact/page.tsx` |
| Gallery images and layout | `app/gallery/page.tsx` |
| Blog listing and blog posts | `app/blog/` |
| Portfolio image files | `public/images/portfolio/` |
| Logo | `public/images/logo.png` |
| Local environment variables | `.env.local` |
| Firebase client connection | `lib/firebase.ts` |
| Firebase Admin / server DB connection | `lib/firebase-admin.ts` |
| Quote encryption secret usage | `lib/quote-security.ts` |
| Firestore rules | `firestore.rules` |
| Build scripts | `package.json` |
| Next.js image config | `next.config.mjs` |

---

## 2. Local Setup On Personal Laptop

### Requirements

Install these first:

- Node.js 20 or newer recommended
- npm
- Git

### Open the project

```powershell
cd "c:\Shaik Safi\ORVEX_VISUALS\orvex-visuals"
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

This project uses environment variables for Firebase and secure quote storage.

The repo already expects `.env.local` locally.

`.gitignore` already excludes `.env*`, so these secrets are not meant to be committed.

### Current local env template

```env
NEXT_PUBLIC_FIREBASE_API_KEY=paste-your-apiKey-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### Full set of env vars you should use

For complete local + deployed setup, use these:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

QUOTE_ACCESS_SECRET=
```

### Ready-to-copy `.env.local` example

You can copy this directly into your local `.env.local` and then replace the placeholder values:

```env
# PUBLIC FIREBASE (Browser-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# FIREBASE ADMIN (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# QUOTE SECURITY
QUOTE_ACCESS_SECRET=put-a-long-random-secret-here
```

### What each one does

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

Security value:

- `QUOTE_ACCESS_SECRET`

This is used by `lib/quote-security.ts` to encrypt saved quote payloads and to generate secure access token hashes.

### Important note for private key format

For `FIREBASE_PRIVATE_KEY`, use the raw private key value but keep newline characters escaped as `\n` in env variables.

The code already converts `\n` back to real new lines automatically.

---

## 4. Global Settings - `lib/constants.ts`

This is the most important file in the whole site.

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

These values are reused in multiple places:

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

### WhatsApp helper and pre-filled messages

If you want to change the wording of generic WhatsApp messages, edit:

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

### Images used across the site

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

---

## 5. Firebase And Database Setup

This project uses Firebase in two ways.

### Client Firebase

File:

```ts
lib/firebase.ts
```

Used for browser-side Firebase initialization.

It reads:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

If `projectId` is missing, Firebase client does not initialize.

That is intentional and keeps local development safe even before Firebase is configured.

### Admin Firebase

File:

```ts
lib/firebase-admin.ts
```

Used for secure server-side Firestore access from API routes.

It reads:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

If these are missing, `adminDb` becomes `null` and database-backed API routes return a configuration error.

### What gets stored in Firestore

Collections currently used by the app:

- `quotes`
- `inquiries`

These are written by:

- `app/api/quotes/route.ts`
- `app/api/inquiries/route.ts`

### Important storage behavior

The app stores booking and inquiry payloads encrypted on the server.

That encryption is handled by:

```ts
lib/quote-security.ts
```

It uses AES-256-GCM and depends on:

```env
QUOTE_ACCESS_SECRET
```

If this secret is missing, quote creation will fail.

### Firebase Console setup steps

1. Go to Firebase Console
2. Create a project
3. Enable Firestore Database
4. Add a Web App inside the Firebase project
5. Copy the web config values into `.env.local`
6. Go to Project Settings -> Service Accounts
7. Generate a service account key
8. Copy `project_id`, `client_email`, and `private_key` into env vars

### Firestore rules

Current file:

```ts
firestore.rules
```

Current rule style is locked down:

- direct client reads/writes are denied
- server-side Admin SDK is expected to do writes

This is good and should usually stay that way.

### Important note

If Firebase is not configured:

- pricing page still works
- website still renders
- WhatsApp flows still work
- database save APIs do not work
- booking falls back to WhatsApp-only flow where supported

---

## 6. Deployment To Vercel

This project is already suitable for Vercel deployment.

Why:

- it is a Next.js app
- `package.json` already has standard Next scripts
- `@vercel/analytics` is already installed and used

### Deploy using Vercel dashboard

1. Push this repo to GitHub
2. Go to Vercel
3. Click `Add New Project`
4. Import the GitHub repo
5. Framework should be auto-detected as Next.js
6. Add all required environment variables in Vercel Project Settings
7. Deploy

### Environment variables to add in Vercel

Add these in Vercel project settings:

```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
QUOTE_ACCESS_SECRET
```

### Build command

Vercel can use default Next.js build settings.

Equivalent build command:

```powershell
npm run build
```

### Start command

For self-hosting or testing after build:

```powershell
npm run start
```

### Important deployment note

If public Firebase vars are added but admin vars are missing:

- frontend may appear fine
- quote/inquiry storage APIs will fail

If `QUOTE_ACCESS_SECRET` is missing:

- quote creation and secure quote access will fail

---

## 7. Custom Domain Setup

Main domain value in code:

```ts
lib/constants.ts
```

Current value:

```ts
export const DOMAIN = "https://orvexvisuals.com"
```

### When changing domain

If you move to a new domain, update:

1. `DOMAIN` in `lib/constants.ts`
2. Vercel Project -> Domains
3. DNS records at your domain provider

### Vercel domain connection steps

1. Open your Vercel project
2. Go to `Settings -> Domains`
3. Add your custom domain
4. Follow the DNS instructions Vercel gives
5. Wait for verification
6. Once active, update `DOMAIN` in `lib/constants.ts` if needed

### Why `DOMAIN` matters

It is used in metadata and share URLs through `app/layout.tsx`.

If `DOMAIN` is wrong, metadata and shared links can point to the wrong place.

---

## 8. What Is Already Configuration-Driven

These things are mostly already configured and only need values changed, not code redesign:

- phone number and email
- social links
- brand/domain values
- delivery day promises
- pricing rates
- package totals
- service starting prices
- auto-generated service package prices
- Firebase initialization
- Firestore Admin initialization
- quote encryption behavior
- Vercel hosting compatibility
- WhatsApp launch behavior

This means most changes are content or config changes, not engineering changes.

---

## 9. Pricing System - Single Source Of Truth

### File

```ts
lib/constants.ts
```

### The real pricing source

The website now uses these objects as the base price source:

```ts
export const SERVICE_RATES = {
  "traditional-photo": { name: "Traditional Photography", ratePerDay: 10000, ratePerHalfDay: 6000 },
  "candid-photo": { name: "Candid Photography", ratePerDay: 18000, ratePerHalfDay: 12000 },
  "traditional-video": { name: "Traditional Videography", ratePerDay: 10000, ratePerHalfDay: 6000 },
  "cinematic-video": { name: "Cinematic Videography", ratePerDay: 15000, ratePerHalfDay: 10000 },
}

export const EVENT_ADDONS = {
  drone: { name: "Drone Coverage", price: 5000 },
  "led-wall": { name: "LED Wall Setup", price: 10000 },
  "same-day-edit": { name: "Same-Day Edit", price: 7000 },
  "live-stream": { name: "Live Streaming", price: 5000 },
}

export const GLOBAL_ADDONS = {
  "album-25": { name: "Photo Album (25 sheets)", price: 5000 },
  "album-40": { name: "Photo Album (40 sheets)", price: 8000 },
}
```

### What updates automatically when you change these values

If you edit the rates above, these parts update automatically:

- pricing builder totals
- pricing page package card prices
- prebuilt package totals through `computePackagePrice()`
- service listing starting prices in many cases
- service detail generated package prices in many cases

### Prebuilt website packages

The 3 package cards on pricing page come from:

```ts
export const PACKAGES = [
  { name: "Starter", ... },
  { name: "Signature", ... },
  { name: "Grand", ... },
]
```

Each package contains:

- visible feature list
- `notIncluded`
- `builderPreset`

Important:

- package prices are not hardcoded anymore
- package prices are computed from `builderPreset`
- the builder uses the same preset data

So if you want to change what a package includes, edit `builderPreset` and the matching visible `features` text.

### Current package logic

At the time this guide was updated, package totals are effectively:

- Starter: half-day candid photographer
- Signature: full day traditional + candid + cinematic + drone + 25-sheet album
- Grand: full day traditional + candid + traditional video + cinematic video + drone + same-day-edit + LED wall + 40-sheet album

### Important rule

If you change package contents, always update both:

1. the `builderPreset`
2. the visible `features` text

Otherwise card text and actual pricing will stop matching.

---

## 10. Pricing Page - `app/pricing/page.tsx`

This file controls the pricing page UI and the custom package builder.

### What this file controls

- package card layout and labels
- pricing page hero text
- package builder UI
- event rows, service selectors, add-on selectors
- estimate summary display
- `Send Estimate` WhatsApp action
- `Proceed to Book` action

### What this file does not control anymore

It does not own the actual core rate values.

Those now live in `lib/constants.ts`.

### Package card prices on pricing page

The pricing page maps packages like this:

```ts
const packages = PACKAGES.map((pkg) => ({
  ...pkg,
  price: computePackagePrice(pkg),
}))
```

So do not try to hardcode a package price directly in this file.

### Send Estimate behavior

`Send Estimate`:

- does not save to database
- does not save to session storage
- opens WhatsApp to the owner number with a pre-filled estimate

This is for sharing estimate details with Orvex on WhatsApp.

### Proceed to Book behavior

`Proceed to Book`:

- builds the customer plan object
- stores it in `sessionStorage`
- key used: `BOOKING_PLAN_STORAGE_KEY`
- then redirects to `/book`

So if a user builds a custom plan and goes to booking, the booking page can reuse that plan.

### If you want to change estimate message format

Edit the message-building logic in:

```ts
app/pricing/page.tsx
```

Look for:

- `generateWhatsAppMessage()`
- `handleSendEstimate()`

### Important note about WhatsApp opening

The site now uses `window.open(..., '_blank')` for WhatsApp links instead of `window.location.href`.

That was changed to avoid browser blocking issues like "content is blocked".

---

## 11. Services - `app/services/data.ts`

This file controls both:

- `/services`
- `/services/[slug]`

### Service card listing

At the top of the file, `services` controls the cards shown on the services listing page.

Each object contains:

```ts
{
  slug: "wedding-photography",
  name: "Wedding Photography",
  category: "wedding",
  description: "...",
  startingPrice: PHOTO_STARTING,
  icon: Camera,
  image: "https://...",
  popular: true,
}
```

### Important pricing note for services

Many `startingPrice` values are now computed from constants:

```ts
const PHOTO_STARTING = SERVICE_RATES["candid-photo"].ratePerHalfDay
const VIDEO_STARTING = SERVICE_RATES["cinematic-video"].ratePerHalfDay
const DRONE_STARTING = EVENT_ADDONS.drone.price
```

So if you increase the candid half-day rate in `lib/constants.ts`, many service cards automatically change.

### Detailed service pages

Further down, `serviceDetails` contains manually written detailed pages for some important services.

You can edit:

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

If a service does not have an explicit entry in `serviceDetails`, the page is generated by:

```ts
getServiceDetail(slug)
```

That function now computes package prices using:

```ts
function computeServicePackagePrices(category: Category)
```

### Current auto-generated package logic

For photography categories:

- Essential = candid half day
- Premium = candid full day + traditional full day + album-25
- Luxury = candid full day + traditional full day + drone + same-day-edit + album-40

For videography category:

- Essential = cinematic half day
- Premium = cinematic full day + traditional video full day + album-25
- Luxury = cinematic full day + traditional video full day + drone + same-day-edit + album-40

For products category:

- pricing is still derived from that card's own `startingPrice`
- it uses simple multipliers for Basic / Premium / Luxury

### When to edit `data.ts` directly

Edit this file directly when you want to change:

- service names
- categories
- descriptions
- service images
- detailed service FAQs
- process steps
- package feature text on specific service pages
- manually written package price formulas for key services

---

## 12. Booking Flow - `app/book/page.tsx`

This file controls the booking page and booking submission flow.

### What it does

- reads plan data from `sessionStorage` when user comes from pricing page
- shows booking form
- sends booking details to WhatsApp
- if Firebase quote saving works, it includes a secure quote link
- if Firebase is unavailable, it falls back to a plain WhatsApp message

### Main behavior

Pricing page:

- `Send Estimate` -> WhatsApp only
- `Proceed to Book` -> save plan to session storage and go to booking page

Booking page:

- combines form fields + stored plan
- opens WhatsApp to owner number

### If you want to edit booking WhatsApp content

Edit:

```ts
app/book/page.tsx
```

Look around the message arrays used before `window.open(...)`.

### If you want to change booking form text

Edit:

- labels
- headings
- helper text
- advance payment text
- success message

all inside `app/book/page.tsx`.

---

## 13. Homepage - `components/home/ClientSections.tsx`

Use this file to change homepage content.

### Common things here

- hero section text
- urgency badge
- homepage FAQ
- CTA sections
- some homepage messaging

### Images for hero and about areas

These usually come from `IMAGES` in `lib/constants.ts`.

---

## 14. Navbar - `components/Navbar.tsx`

Edit this file for:

- menu items
- homepage anchor links
- site-wide navigation links
- mobile menu labels
- CTA button text in navbar

---

## 15. Footer - `components/Footer.tsx`

Edit this file for:

- footer link groups
- social icons and URLs
- service quick links
- copyright text
- footer descriptions

Some contact info may still be pulled from `lib/constants.ts`.

---

## 16. About Page - `app/about/page.tsx`

Edit this file for:

- business story
- team members
- stats
- why choose us cards
- about-page images
- trust and brand messaging

Typical changes:

- events covered count
- happy clients count
- Google rating
- founding year
- team names and roles

---

## 17. Contact Page - `app/contact/page.tsx`

Edit this file for:

- address
- working hours
- service area
- embedded map or location content
- page-specific contact wording

Phone and email are usually sourced from `lib/constants.ts`.

---

## 18. Gallery - `app/gallery/page.tsx`

Edit this file when you want to:

- change gallery images
- reorder gallery categories
- update gallery captions
- change gallery page layout or headings

---

## 19. SEO And Metadata - `app/layout.tsx`

Edit this file for:

- site title
- default description
- keywords
- Open Graph settings
- business schema / structured data
- default social share image

If prices or delivery promises change a lot, review this file too.

---

## 20. Images - Where To Put Them

Use the public folder for local images:

```text
public/
  images/
    logo.png
    og-cover.webp
    portfolio/
      hero-1.webp
      hero-2.webp
      hero-3.webp
      about-1.webp
      about-2.webp
      about-3.webp
      about-4.webp
    gallery/
```

If you replace remote Unsplash images with local files, update the paths in:

- `lib/constants.ts`
- `app/services/data.ts`
- `app/about/page.tsx`
- `app/gallery/page.tsx`

---

## 21. Most Common Tasks

### Change phone number or email

Edit:

```ts
lib/constants.ts
```

Change:

- `PHONE_NUMBER`
- `PHONE_DISPLAY`
- `EMAIL`

### Change Instagram or Facebook links

Edit:

```ts
lib/constants.ts
```

Change:

- `SOCIAL_LINKS.instagram`
- `SOCIAL_LINKS.facebook`

Then also check if any page has hardcoded social links.

### Set up project on a new personal laptop

1. Install Node.js
2. Clone the repo
3. Run `npm install`
4. Create `.env.local`
5. Add all Firebase and quote secret values
6. Run `npm run dev`

### Connect Firebase database

1. Create Firebase project
2. Enable Firestore
3. Add Web App config to `.env.local`
4. Add Service Account values to `.env.local`
5. Add `QUOTE_ACCESS_SECRET`
6. Test booking/inquiry flow locally

### Deploy to Vercel

1. Push repo to GitHub
2. Import project into Vercel
3. Add env vars in Vercel settings
4. Deploy
5. Test booking, quote, and contact flows on live site

### Connect custom domain

1. Add domain inside Vercel project
2. Update DNS at domain provider
3. Wait for verification
4. Update `DOMAIN` in `lib/constants.ts` if needed
5. Redeploy if required

### Change one service rate and update website everywhere

Edit:

```ts
lib/constants.ts
```

Then update one of these:

- `SERVICE_RATES`
- `EVENT_ADDONS`
- `GLOBAL_ADDONS`

This is the correct place for most pricing changes.

### Change package contents on pricing page

Edit:

```ts
lib/constants.ts
```

Update the package inside `PACKAGES`:

- `features`
- `notIncluded`
- `builderPreset`

### Change only pricing page text or UI

Edit:

```ts
app/pricing/page.tsx
```

Examples:

- headings
- helper labels
- badge text
- CTA button text
- summary wording

### Change service descriptions or service page content

Edit:

```ts
app/services/data.ts
```

### Change booking form or booking WhatsApp message

Edit:

```ts
app/book/page.tsx
```

### Change homepage FAQ

Edit:

```ts
components/home/ClientSections.tsx
```

### Change About page team or stats

Edit:

```ts
app/about/page.tsx
```

### Change working hours or address

Edit:

```ts
app/contact/page.tsx
```

### Replace portfolio images

1. Put images in `public/images/...`
2. Update references in the relevant file
3. Keep image names simple and consistent

---

## 22. Editing Rules To Remember

### For pricing changes

Use this order:

1. `lib/constants.ts`
2. `app/services/data.ts` only if feature text or special service logic must change
3. `app/pricing/page.tsx` only if UI text or flow must change

### Do not do this

- do not hardcode the same price in multiple files
- do not update card text without updating actual package preset
- do not change only pricing page text if service pages still show old numbers
- do not forget to update env vars in Vercel when secrets or project IDs change

### For service pages

If the change is only pricing, check whether constants already drive it before editing `data.ts` manually.

### For WhatsApp flows

- pricing page estimate goes to owner WhatsApp
- booking page final inquiry also goes to owner WhatsApp
- estimate is not stored permanently
- booking plan is stored in `sessionStorage` before moving to `/book`

---

## 23. Recommended Edit Checklist

Whenever you change anything important, check these:

1. Did you edit the correct source file?
2. If price changed, did you change it in `lib/constants.ts` first?
3. If package content changed, does visible text still match actual computed preset?
4. If service detail text changed, does the listing card also still make sense?
5. If deployment-related config changed, did you update Vercel env vars too?
6. Did you test the affected flow?

---

## 24. Quick Summary

If you remember only 5 things, remember these:

1. Most pricing changes start in `lib/constants.ts`
2. Service page content lives in `app/services/data.ts`
3. Pricing page UI lives in `app/pricing/page.tsx`
4. Booking flow lives in `app/book/page.tsx`
5. Local, Firebase, and Vercel setup depend mostly on correct env values

---

Last updated: May 2026
