# Orvex Visuals Copilot Instructions

## Project Overview

Orvex Visuals is a production Next.js website for a premium photography and videography studio. The site is not just a marketing surface; it is a lead capture, pricing, booking, secure quote sharing, and admin follow-up system.

Business goals:
- Convert visitors into inquiries, pricing requests, and bookings.
- Let customers explore services and assemble pricing before contacting the studio.
- Generate secure saved quotes that can be reopened from share links.
- Give the admin dashboard enough data to manage lead status, reminders, notes, and payment follow-up.
- Preserve English and Hindi support across public pages, saved quotes, and share links.

Major workflows:
- Visitors browse localized pages, services, gallery, blog, and pricing content.
- The pricing builder on `app/pricing/page.tsx` creates a plan using shared pricing constants, then hands the selection off to `app/book/page.tsx`.
- The booking flow saves a quote through `app/api/quotes/route.ts`, then opens a WhatsApp handoff and exposes a secure saved quote link at `app/quote/[id]/page.tsx`.
- The contact form posts inquiries through `app/api/inquiries/route.ts`.
- Admin users sign in through `app/api/admin/session/route.ts` and manage quotes, notes, reminders, payments, and share links from `app/admin/page.tsx`.

For owner-level content maps and edit locations, see `CUSTOMIZATION_GUIDE.md` before remapping the repo.

## Architecture

Frameworks and libraries:
- Next.js 16 App Router.
- React 19.
- TypeScript with `strict` enabled.
- Tailwind CSS 4 and Radix/shadcn-style UI components in `components/ui`.
- Firebase client SDK in `lib/firebase.ts` and Firebase Admin in `lib/firebase-admin.ts`.
- Vercel Analytics.

Routing structure:
- Locale-aware routing is implemented by `middleware.ts`, `lib/i18n/config.ts`, and `lib/i18n/routing.ts`.
- Public URLs are locale-prefixed (`/en/...`, `/hi/...`), but middleware rewrites requests to the internal App Router paths.
- Server layouts and metadata resolve locale with `resolveRequestLocale()`.
- Client components read locale with `useCurrentLocale()` and must build links with `withLocaleHref()` or `withLocalePathname()`.
- Primary public routes include `/`, `/about`, `/services`, `/services/[slug]`, `/pricing`, `/book`, `/contact`, `/gallery`, `/blog`, `/blog/[slug]`, and `/quote/[id]`.
- The admin UI lives at `/admin`.

API structure:
- `app/api/quotes/route.ts`: create secure quotes from booking or calculator flows.
- `app/api/quotes/[id]/route.ts`: validate access token, decrypt quote payload, and track views.
- `app/api/inquiries/route.ts`: accept public contact inquiries.
- `app/api/admin/session/route.ts`: admin login, session check, and logout.
- `app/api/admin/quotes/route.ts`: list quotes, update pipeline status, and generate share links.
- `app/api/admin/quotes/[id]/link/route.ts`: recover the active share link for a quote.
- `app/api/admin/quotes/[id]/payment/route.ts`: update payment tracking.
- `app/api/admin/quotes/[id]/reminder/route.ts`: set, complete, or remove reminders.
- `app/api/admin/quotes/[id]/notes/route.ts`: list and add internal notes.

Data flow:
- Shared pricing starts in `lib/constants.ts` and flows into packages, calculators, service pages, and booking summaries.
- Shared service definitions start in `app/services/data.ts` and power both the service list and service detail routes.
- Public write routes are guarded by `lib/public-write-guard.ts` for origin checks, content-type checks, body limits, and in-memory rate limiting.
- Quote and inquiry payloads are encrypted before storage; quote access uses hashed access tokens and encrypted active-link recovery data in `lib/quote-security.ts`.
- Quotes and inquiries are stored in Firestore via `adminDb`; admin routes decrypt quote payloads when needed and update operational metadata such as status, reminders, payments, notes, and view tracking.

High-risk files and modules:
- `middleware.ts`
- `lib/i18n/*`
- `lib/constants.ts`
- `lib/public-write-guard.ts`
- `lib/quote-security.ts`
- `lib/admin-auth.ts`
- `app/api/quotes/*`
- `app/api/admin/**/*`
- `firestore.rules`

## Core Business Features

Services:
- Service categories, cards, detail content, and related slugs live in `app/services/data.ts`.
- Service data is a shared source of truth for both listing and detail pages.

Pricing:
- Rates, add-ons, packages, delivery promises, and business contact constants live in `lib/constants.ts`.
- Package prices are computed from underlying service and add-on rates; do not duplicate pricing tables elsewhere.

Booking:
- The pricing page stores the selected plan in session storage under `BOOKING_PLAN_STORAGE_KEY` and hands users to `app/book/page.tsx`.
- The booking page reconstructs the plan, collects customer details, saves a quote, and opens WhatsApp handoff messaging.

Quote generation:
- Quote payload types are defined in `lib/save-quote.ts`.
- `app/api/quotes/route.ts` sanitizes inputs, generates a quote ID and access token, encrypts payloads, and stores metadata in Firestore.

Quote sharing:
- Saved quote pages are opened through locale-aware URLs that include a token query string.
- Quote access depends on `lib/quote-security.ts`; token hashing, payload encryption, and active-link encryption must stay compatible.
- The quote page is browser-print based, not a separate PDF generation service.

Admin dashboard:
- `app/admin/page.tsx` is the operational console for quote review, export, link generation, and lead follow-up.
- Admin APIs depend on signed cookies from `lib/admin-auth.ts` and login throttling from `lib/admin-login-protection.ts`.

Lead pipeline:
- Quote pipeline statuses are defined in `lib/admin-quote-status.ts` and updated through admin APIs.
- Preserve the existing status model and reuse the shared status helpers.

Notes:
- Internal notes are stored as a Firestore subcollection under each quote and exposed through `app/api/admin/quotes/[id]/notes/route.ts`.

Reminders:
- Reminder normalization and filter buckets live in `lib/admin-reminders.ts`.
- Reminder dates are stored as normalized `YYYY-MM-DD` strings with pending or completed state.

Payment tracking:
- Payment helpers in `lib/admin-payments.ts` derive payment status and balance due from quote totals plus `amountReceived`.
- Admin payment updates only adjust operational metadata; they do not rewrite the saved quote payload.

Localization:
- Supported locales are `en` and `hi`.
- Shared localized copy lives in `lib/i18n/messages/`.
- Service-specific Hindi content lives in `app/services/data.ts`.
- Saved quote values are localized at render time by `lib/quote-localization.ts`.
- Any route, link, metadata, or share-link change must preserve locale awareness.

## Coding Standards

TypeScript conventions:
- Keep TypeScript `strict` compatibility.
- Reuse shared domain types and helpers instead of redefining payloads or status enums.
- Use the existing `@/*` path alias for internal imports.
- Keep validation and normalization explicit at API boundaries.

React conventions:
- Use server components by default; add `"use client"` only for browser-only state, effects, or interactivity.
- Follow existing locale patterns: server code uses `resolveRequestLocale()`, client code uses `useCurrentLocale()`.
- Reuse existing UI primitives from `components/ui` and established shared components before creating new ones.

Next.js conventions:
- Preserve App Router route shape and localized URL behavior.
- Use route-level layouts and metadata helpers instead of duplicating metadata logic inside pages.
- Use middleware and routing helpers for locale behavior; do not hardcode locale prefixes.

Component organization:
- Shared layout chrome belongs in `components/Navbar.tsx`, `components/Footer.tsx`, and `components/WhatsAppFloat.tsx`.
- Shared reusable UI belongs in `components/ui`.
- Home page sections are intentionally split between `components/home/HomeServerSections.tsx` and `components/home/ClientSections.tsx`.
- Cross-route business logic belongs in `lib/`, not inside duplicated page code.

API design conventions:
- Keep route handlers thin and delegate shared logic to `lib/` helpers.
- Preserve consistent JSON success and error responses.
- All public write endpoints must continue to use `guardPublicWriteRequest()`.
- Preserve sanitization, rate limits, and Firestore write structure unless a deliberate migration is approved.

## AI Agent Rules

When working on this repository:
- Understand the existing architecture before changing code.
- Prefer extending existing patterns over creating new ones.
- Avoid duplicate business logic.
- Avoid introducing new dependencies unless necessary.
- Preserve localization support.
- Preserve admin security.
- Preserve quote security.
- Preserve booking flow.
- Preserve existing route structure.
- Prefer minimal targeted changes.
- Treat `lib/constants.ts`, `app/services/data.ts`, `lib/i18n/*`, `lib/quote-security.ts`, `lib/admin-auth.ts`, `middleware.ts`, and `app/api/admin/**/*` as shared, high-impact surfaces.
- Do not bypass shared helpers for locale routing, payment status, reminder status, quote access, or admin sessions.

## Audit Guidelines

Before making changes:
1. Identify the affected files and whether the change touches pricing, services, localization, public APIs, admin APIs, security, or Firestore data.
2. Explain the current design and name the shared source of truth that owns the behavior.
3. Explain risks, especially to booking flow, quote access, admin access, locale routing, SEO metadata, and data compatibility.
4. Explain migration requirements if cookies, env vars, route shapes, encrypted values, Firestore document shape, or share-link semantics would change.
5. List the changed files.
6. Validate build impact. For code changes, run `npm run lint`. Also run `npm run build` when changes touch routes, layouts, API handlers, types, shared business logic, security helpers, or localization infrastructure. If validation is skipped, state why.

There is no dedicated automated test suite defined in `package.json`; lint and production build validation are the minimum expected checks.

## Forbidden Changes

Do not modify without explicit approval:
- Authentication model.
- Quote token security.
- Locale routing.
- Middleware or proxy behavior.
- Firestore schema.
- Public quote sharing architecture.

This includes unapproved changes to cookie names or scope, token hashing or encryption formats, quote URL semantics, locale prefixes, Firestore collection structure, and public write protection rules.

## Preferred Workflow

1. Audit
2. Explain
3. Implement
4. Validate
5. Summarize

## Customer Experience Guardrail

When implementing architecture, pricing, package, booking, quote, admin, localization, or content changes:

Customer-facing complexity must not increase unless explicitly approved.
Prefer fewer customer decisions over more customer decisions.
Prefer clearer package presentation over additional package options.
Internal architecture improvements must not leak implementation concepts into the user experience.

Do not introduce without explicit approval:

new package types
new package hierarchies
new booking steps
new pricing-builder steps
new customer decision points
new package terminology
new workflow branches

Architecture migrations should simplify ownership and maintenance while preserving or improving customer clarity.

If a proposed architecture change would increase visible complexity, explain why and obtain approval before implementation.