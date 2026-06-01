| `/privacy-policy` | `/en/privacy-policy` | |
| `/terms` | `/en/terms` | |

### Admin page

| Path | Notes |
|---|---|
| `/admin` | Admin dashboard. Requires valid session cookie. No locale prefix. |

### Middleware routing behavior

- Requests without a locale prefix are redirected to `/{locale}{path}`.
- Root `/` uses `Accept-Language` header or cookie to pick locale, then redirects.
- Requests with a valid locale prefix (`/en/...`, `/hi/...`) are **rewritten** to the internal path (locale stripped), and `x-locale` header is injected.
- Locale cookie name: `locale`. Max age: 1 year. `sameSite: lax`.
- API routes, `_next/static`, `_next/image`, and files with extensions are excluded from middleware.

---

## 4. API Inventory

### Public APIs

| Route | Method | Purpose | Guard |
|---|---|---|---|
| `POST /api/quotes` | POST | Create a new secure quote | `guardPublicWriteRequest()` — origin, content-type, body limit (64 KB), rate limit (4 req / 10 min) |
| `GET /api/quotes/[id]` | GET | Retrieve and decrypt a quote by ID + token | Token hash verification; records view |
| `POST /api/inquiries` | POST | Submit a contact inquiry | `guardPublicWriteRequest()` |

### Admin APIs (all require valid admin session cookie)

| Route | Method | Purpose |
|---|---|---|
| `POST /api/admin/session` | POST | Admin login (with throttle + lockout) |
| `GET /api/admin/session` | GET | Check session validity |
| `DELETE /api/admin/session` | DELETE | Logout |
| `GET /api/admin/quotes` | GET | List all quotes (decrypted payloads, up to 500) |
| `PATCH /api/admin/quotes` | PATCH | Update pipeline status; generate share links |
| `GET /api/admin/quotes/[id]/link` | GET | Recover active share link for a quote |
| `PATCH /api/admin/quotes/[id]/payment` | PATCH | Update `amountReceived` |
| `PATCH /api/admin/quotes/[id]/reminder` | PATCH | Set, complete, or remove reminder |
| `GET /api/admin/quotes/[id]/notes` | GET | List internal notes |
| `POST /api/admin/quotes/[id]/notes` | POST | Add an internal note |

### Admin authentication model

- Login posts password to `POST /api/admin/session`.
- On success, two cookies are set: `orvex_admin_session` (page cookie) and `orvex_admin_api_session` (API cookie). Both are HMAC-signed session tokens with nonce and expiry.
- Session max age: 8 hours.
- Login throttle: backoff starts at 3 failures; full 15-minute lockout at 6 failures.
- Admin API routes accept either cookie (checked by `checkAdminAuth()` in each route).

---

## 5. Booking Flow

```
/pricing (interactive builder)
  └─ User configures events, services, add-ons
  └─ buildBookingPlan() serializes current state
  └─ sessionStorage.setItem(BOOKING_PLAN_STORAGE_KEY, JSON.stringify(plan))
  └─ router.push("/book")

/book (booking form)
  └─ Reads plan from sessionStorage on mount
  └─ Clears sessionStorage entry after reading (one-shot)
  └─ If plan is missing or invalid → redirects back to /pricing
  └─ User fills customer details (name, phone, email, service, date, venue)
  └─ handleSubmit():
       └─ saveQuote(payload) → POST /api/quotes
       └─ On success: builds WhatsApp URL with saved quote link
       └─ Opens WhatsApp in popup/new tab
       └─ Shows saved quote link (app/quote/[id]?token=TOKEN)
       └─ On failure: falls back to plain WhatsApp URL
```

### Session storage plan shape (`PlanData` in book/page.tsx)

```ts
interface PlanData {
  services: { name: string; coverage: string; price: number; selections?: { name: string; qty: number; unitPrice?: number }[] }[]
  addOns: { name: string; qty: number; price: number }[]
  total: number
  packageName?: string
  date?: string
  timeSlot?: string
  city?: string
  venue?: string
  customer?: { name: string; phone: string; email: string }
}
```

> **Approved contract:** `packageName` belongs in the booking handoff for unmodified package bookings and carries the canonical package name from `lib/constants.ts` → `PACKAGES[].name`.

---

## 6. Quote Flow

### Quote creation (POST /api/quotes)

1. `guardPublicWriteRequest()` checks origin, content-type, body size, rate limit.
2. `sanitizeQuotePayload()` normalizes and validates all fields.
3. `generateQuoteId()` — 12-char uppercase UUID fragment.
4. `generateAccessToken()` — 24-byte random base64url token.
5. `hashAccessToken(token)` — SHA-256 HMAC stored as `accessTokenHash`.
6. `encryptQuotePayload(payload)` — AES-256-GCM encrypted payload stored as `encryptedPayload`.
7. `encryptActiveAccessToken(token)` — scoped AES-256-GCM used for admin link recovery (`activeAccessTokenCiphertext`).
8. Firestore write: `quotes/{quoteId}` — operational metadata + encrypted payload.
9. Response: `{ quoteId, accessToken }` — token is returned once, never stored in plaintext.

### Quote access (GET /api/quotes/[id])

1. Client calls `GET /api/quotes/{id}?token={token}`.
2. `hashAccessToken(token)` compared against stored `accessTokenHash` (not timing-safe in application layer — relies on constant-time compare inside crypto).
3. On match: `decryptQuotePayload()` decrypts payload.
4. View tracking via Firestore transaction (cooldown: 5 min write, 30 min count).
5. Response: `{ quote: decryptedPayload, createdAt }`.

### Quote share link URL format

```
/{locale}/quote/{quoteId}?token={accessToken}
```

The token is the raw `accessToken` returned at creation time. It is **not** stored in Firestore — only its hash is. Admin link recovery uses the separately encrypted `activeAccessTokenCiphertext`.

### Quote payload type (`QuotePayload` in lib/save-quote.ts)

```ts
interface QuotePayload {
  source: "calculator" | "booking"
  customerName: string
  customerPhone: string
  customerEmail?: string
  date?: string
  timeSlot?: string
  city?: string
  venue?: string
  events?: QuoteEvent[]
  globalAddOns?: { name: string; qty: number; price: number }[]
  service?: string     // free-text service name(s) from booking form
  packageName?: string
  budget?: string      // formatted budget string
  notes?: string
  foundVia?: string
  total?: number
}
```

> **Approved contract:** `packageName` belongs inside the encrypted `QuotePayload` for unmodified package bookings. It is business data, not top-level Firestore metadata.

---

## 7. Admin Flow

### Dashboard capabilities (`app/admin/page.tsx`)

- List all quotes (up to 500, ordered by `createdAt` desc).
- Filter by: status, reminder bucket, source (calculator/booking), city, event date range, search text.
- Sort by: newest, oldest, event date, amount high/low.
- Update pipeline status (7 states: new → contacted → quote_sent → follow_up → negotiating → confirmed → cancelled).
- Generate / recover share links for quotes.
- Update payment tracking (`amountReceived`).
- Set / complete / remove reminders (stored as `YYYY-MM-DD` strings).
- Add and view internal notes (Firestore subcollection `quotes/{id}/notes`).
- Export quotes as CSV.
- Session-aware: auto-logout on expiry.

### Pipeline statuses (`lib/admin-quote-status.ts`)

```
new | contacted | quote_sent | follow_up | negotiating | confirmed | cancelled
```

Default: `new`.

### Payment model (`lib/admin-payments.ts`)

- `total` comes from the decrypted quote payload (`QuotePayload.total`).
- `amountReceived` is stored as operational metadata (not inside the encrypted payload).
- Payment status: `unpaid` | `partially_paid` | `paid` — derived, never stored.
- Balance due: `max(total - amountReceived, 0)`.

### Reminder model (`lib/admin-reminders.ts`)

- `reminderDate`: stored as `YYYY-MM-DD` string.
- `reminderStatus`: `pending` | `completed`.
- Derived status `due` when `reminderDate <= today` and status is `pending`.
- Filter buckets: `all` | `due_today` | `overdue` | `upcoming` | `completed`.
- `upcoming` = due within 7 days.

---

## 8. Localization Architecture

### Supported locales

| Code | BCP-47 Tag | Default |
|---|---|---|
| `en` | `en-IN` | Yes |
| `hi` | `hi-IN` | No |

Constants: `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, `LOCALE_COOKIE_NAME` — all in `lib/i18n/config.ts`.

### Locale resolution order (middleware)

1. Cookie (`locale` cookie) — highest priority.
2. `Accept-Language` header — only used when no cookie and path is `/`.
3. `DEFAULT_LOCALE` (`en`) — fallback.

### Routing pattern

- All public URLs are locale-prefixed: `/en/...`, `/hi/...`.
- Middleware rewrites locale-prefixed requests to non-prefixed internal paths and injects `x-locale` header.
- Non-prefixed requests are redirected to the locale-prefixed URL.

### Server-side locale resolution

Server layouts and metadata use `resolveRequestLocale()` (reads `x-locale` header injected by middleware).

### Client-side locale

Client components use `useCurrentLocale()` hook (`hooks/use-current-locale.ts`). Link building uses `withLocaleHref()` or `withLocalePathname()` from `lib/i18n/routing.ts`.

### i18n messages

- Shared page messages live in `lib/i18n/messages/` (English + Hindi).
- Accessed via `getPageMessages(locale)`.
- Service-specific Hindi content lives in `app/services/data.ts`.

### Quote localization

Saved quote values are localized at render time by `lib/quote-localization.ts`. The translation map (`QUOTE_VALUE_TRANSLATIONS_HI`) covers all service names, add-on names, duration labels, and event name templates.

> **Rule:** Any new service name, add-on name, or event template name added to `lib/constants.ts` or pricing templates **must** have a corresponding entry in `QUOTE_VALUE_TRANSLATIONS_HI` in `lib/quote-localization.ts` to avoid untranslated strings in Hindi saved quotes.

### Pricing handoff links

Cross-route handoff links (gallery → pricing, blog → pricing, services → pricing) are built by `lib/pricing-handoff.ts`. Links carry `from`, `source`, `intent`, `service`, `package`, and `template` query params. The pricing page reads these and pre-fills the builder. Locale must be preserved in all handoff links.

---

## 9. Sources of Truth

| Concern | Owner file | What lives there |
|---|---|---|
| Pricing rates (per-day, per-half-day) | `lib/constants.ts` | `SERVICE_RATES`, `EVENT_ADDONS`, `GLOBAL_ADDONS` |
| Canonical package compositions | `lib/constants.ts` | `PACKAGES[].builderPreset` — canonical named-package service and add-on presets used by the pricing page |
| Package price computation | `lib/constants.ts` | `computePackagePrice()` |
| Canonical package display text | `lib/i18n/messages/pages*.json` | `pricingPage.packagesSection.items[*]` names, subtitles, and features |
| Event templates (Phase 1 implemented) | `lib/pricing-presets.ts` | `EVENT_TEMPLATE_PRESETS` — centralized structural event template compositions |
| Service-entry prefills (Phase 1 implemented) | `lib/pricing-presets.ts` | `SERVICE_ENTRY_PRESET_RULES`, `resolveServiceEntryPreset()` — centralized service-entry preset mappings |
| Hybrid coverage semantics (Phase 1 implemented) | `lib/pricing-presets.ts` | `HYBRID_COVERAGE_PROFILES`, `detectCoverageProfile()` — explicit photo/video coverage semantics metadata |
| Misc service starting prices | `lib/constants.ts` | `MISC_SERVICE_RATES` |
| Service editorial content and cards | `app/services/data.ts` | `services`, `serviceDetails`, long descriptions, galleries, FAQs |
| Service-detail package ladders (current local system) | `app/services/data.ts` | `serviceDetails[*].packages` — page-local package ladders used on service detail pages and schema, not the canonical booking/quote flow |
| Contact info and brand | `lib/constants.ts` | `PHONE_NUMBER`, `EMAIL`, `BRAND_NAME`, `DOMAIN` |
| WhatsApp link building | `lib/constants.ts` | `getWhatsAppLink()`, `WA_MESSAGES` |
| Pipeline statuses | `lib/admin-quote-status.ts` | `QUOTE_PIPELINE_STATUSES` |
| Payment status derivation | `lib/admin-payments.ts` | `getQuotePaymentStatus()`, `getBalanceDue()` |
| Reminder status / filter | `lib/admin-reminders.ts` | `getQuoteReminderStatus()`, `getQuoteReminderFilterBucket()` |
| Quote encryption / token | `lib/quote-security.ts` | `encryptQuotePayload()`, `hashAccessToken()`, etc. |
| Admin session | `lib/admin-auth.ts` | `ADMIN_SESSION_COOKIE_NAME`, `isValidAdminSession()` |
| Admin login throttle | `lib/admin-login-protection.ts` | In-memory rate limit + lockout |
| Locale config | `lib/i18n/config.ts` | `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, `LOCALE_COOKIE_NAME` |
| Locale routing helpers | `lib/i18n/routing.ts` | `withLocaleHref()`, `withLocalePathname()`, `extractLocaleFromPathname()` |
| Quote value translations | `lib/quote-localization.ts` | `QUOTE_VALUE_TRANSLATIONS_HI` |
| Booking plan storage key | `lib/constants.ts` | `BOOKING_PLAN_STORAGE_KEY` |
| Public write protection | `lib/public-write-guard.ts` | `guardPublicWriteRequest()` |
| Pricing handoff | `lib/pricing-handoff.ts` | `buildPricingHandoffHref()`, `getGalleryPricingHandoff()`, `getBlogPricingHandoff()` |

### Commercial model conclusions

- **What Orvex actually sells today:** one structured rate-based estimate system built from shared service rates and add-ons, with `Starter / Signature / Grand` as builder-backed entry bundles and event templates as guided presets.
- **What customers are currently led to believe:** home and services pages emphasize individual starting prices, the pricing page sells canonical named bundles, and service detail pages advertise separate service-specific package ladders.
- **Mismatch:** service-detail package ladders are not the same commercial objects that flow through pricing → booking → encrypted quote → admin. They are currently disconnected marketing/package content.

### Approved commercial model

- Orvex sells one canonical modular estimate system.
- Named bundles are builder-backed starting points, not a separate commerce system.
- Event templates are guided presets inside the same system, not independent package ladders.
- Service pages are discovery and editorial surfaces and must not define independent commercial package systems.

### Approved ownership model

- Atomic rates and add-ons: `lib/constants.ts`
- Event template compositions, service-entry preset mappings, and hybrid coverage semantics: `lib/pricing-presets.ts` (Phase 1 implemented)
- Named package identity and composition: `lib/constants.ts`
- Display copy: `lib/i18n/messages/*`
- Service editorial content: `app/services/data.ts`

### Approved source-of-truth conclusions

- `PACKAGES[].builderPreset` is the canonical structural definition for the current named pricing-page packages.
- `lib/pricing-presets.ts` now owns the non-package composition layer for event templates, service-entry presets, and hybrid coverage semantics.
- Service-detail package ladders in `app/services/data.ts` are not canonical package sources of truth.
- Quote persistence and admin visibility should represent the exact structured build plus canonical origin metadata when applicable, not disconnected surface-specific package ladders.

---

## 10. Known Issues

### ISSUE-001: Package identity lost across booking → encrypted quote payload → admin (RESOLVED)

Resolved with the approved architecture intact. `PlanData` in `app/book/page.tsx` now declares `packageName`, the booking submit payload passes `packageName`, `QuotePayload` in `lib/save-quote.ts` includes `packageName`, `app/api/quotes/route.ts` sanitizes it, and `app/admin/page.tsx` renders it for admin visibility.

`packageName` remains business data inside the existing booking handoff and encrypted `QuotePayload`. It is not duplicated as top-level Firestore metadata.

---

### ISSUE-002: Package feature text duplication (RESOLVED)

`features[]`, `notIncluded[]`, and `subtitle` were removed from `PACKAGES[]` in `lib/constants.ts`. `getPricingPackages()` in `app/pricing/page.tsx` no longer spreads `...pkg`; it explicitly picks `id`, `builderPreset`, `price`, `icon`, and `popular` from constants and takes `name`, `subtitle`, and `features` from i18n content only. `popular` is read directly from `pkg.popular ?? false` — no package name is hardcoded in the render path. The i18n message files are now the sole display source.

---

### ISSUE-003: Package price computation vs. displayed feature list can drift (RESOLVED)

Resolved alongside ISSUE-002. With `features[]` and `notIncluded[]` removed from `PACKAGES[]`, the constants file no longer contains competing display text. The residual risk — that i18n feature lists and `builderPreset` compositions can manually diverge — is documented as a maintenance contract in **D-010** and acknowledged as unavoidable without CI validation tooling.

---

### ISSUE-004: Admin quote list query is capped at 500 (KNOWN LIMITATION)

**Severity:** Low (operational)

**Description:**
`GET /api/admin/quotes` fetches `.limit(500)` from Firestore ordered by `createdAt` desc. Quotes beyond 500 are not visible in the dashboard. There is no pagination.

**Fix path:** Add cursor-based pagination to the admin API and dashboard.

---

### ISSUE-005: Rate limiting is in-memory (KNOWN LIMITATION)

**Severity:** Low (serverless environment)

**Description:**
`guardPublicWriteRequest()` in `lib/public-write-guard.ts` and `lib/admin-login-protection.ts` both use `globalThis` Maps for in-memory rate limiting. On Vercel with multiple serverless instances, each instance maintains its own bucket — the effective rate limit per IP is multiplied by the number of instances.

**Fix path:** Replace with a persistent store (Redis via Upstash, or Firestore-backed rate limiting) if traffic grows or targeted abuse is detected.

---

### ISSUE-006: Multiple commercial package systems coexist across site surfaces (PHASE 1 COMPLETE, PHASE 2A COMPLETE, PHASE 2B COMPLETE, PHASE 2C COMPLETE, PHASE 3 COMPLETE; RESOLVED)

**Severity:** High (commercial-model confusion)

**Description:**
Orvex currently presents more than one package system to customers:

1. The pricing page sells canonical named bundles through `PACKAGES[].builderPreset` in `lib/constants.ts`.
2. Service detail pages sell separate package ladders from `app/services/data.ts`, including `Essential / Premium / Luxury`, `Silver / Gold / Platinum`, and `Basic / Standard / Premium`.
3. Home and services listing pages primarily show starting prices rather than packages.
4. Event templates on the pricing page act like another preset system but are not branded as the same commercial model.

These surfaces do not describe the same offer catalog, naming system, or purchase path.

**Phase 1 implemented:** event template compositions, service-entry preset mappings, and hybrid coverage semantics were centralized into `lib/pricing-presets.ts` without changing named package ownership in `lib/constants.ts`.

**Business impact:** Customers can believe Orvex sells different products depending on which page they start from. This weakens package positioning, complicates sales conversations, and increases pricing confusion.

**Fix path:** Define one canonical commercial model. The current repository evidence supports an event-first coverage business with a smaller set of parent event/session products, while most long-tail service pages act as discovery variants. Phase 2A contained service-detail package CTAs inside the canonical pricing flow and removed disconnected service-detail offer signals from metadata/schema using schema-valid alternatives. Phase 2B classified service pages by commercial role and removed or replaced local package ladders so variant pages no longer name, price, and describe pseudo-offers disconnected from canonical pricing ownership. Phase 2C separated ancillary standalone services from the primary coverage estimate journey without changing pricing, booking, quote, or canonical package ownership. Phase 3 defined the customer-facing model for Home, Services, and Parent Product Pages. ISSUE-010 Phase 3 later completed the remaining service-detail editorial cleanup for ancillary pages, so the commercial-model conflict is now closed.

**Status update:** D-016 Phases 1, 2A, 2B, and 2C are complete. Estimate-intent CTAs now deep-link into the pricing builder with locale-aware handoff context preserved, variant and ancillary package-ladder ownership has been removed per the approved classification model, and ancillary standalone services no longer enter the primary coverage estimate journey. **Phase 3 / ISSUE-012 is complete.** Home reframed as coverage-family discovery, Services role-sorted with variant badge, Parent Product Pages converted to `CoverageEstimatesSection` backed by canonical pricing, footer navigation emphasis aligned to parent pages, service detail metadata made role-aware for ancillary pages. Navigation emphasis and discovery/editorial metadata/schema alignment are closed. ISSUE-006 is resolved.

---

### ISSUE-007: Service-detail package offers were disconnected from the structured selling flow (PHASE 2A COMPLETE; RESOLVED)

**Severity:** High (package continuity gap)

**Description:**
Before Phase 2A, service-detail packages were not part of the same structured commerce flow used by pricing, booking, quote persistence, quote view, and admin. That routing and metadata gap is now contained:

1. Package-card and service-detail estimate-intent actions now deep-link into the pricing builder with locale-aware handoff context instead of acting as standalone inquiry paths.
2. The pricing builder, booking flow, quote payload, quote view, and admin dashboard remain built around the pricing-page package system and exact event/add-on composition.
3. Service-detail metadata and structured data no longer advertise local package-count, starting-price, or disconnected offer claims.

**Business impact:** The direct service-page flow bypass is contained. Remaining commercial risk shifts from routing continuity to package-content ownership and truthfulness on service pages.

**Fix path:** Preserve Phase 2A. Do not reintroduce direct service-page package inquiry behavior or offer-schema claims. Remaining cleanup proceeds through ISSUE-011 and ISSUE-012.

**Status update:** Phase 2A is complete. Service pages now remain inside the canonical pricing entry flow, and the later completion of ISSUE-011 and ISSUE-012 closed the remaining package-content and price-anchor fallout. ISSUE-007 is resolved.

---

### ISSUE-008: Combined Photography + Videography offerings now have canonical structure and end-to-end customer-facing continuity (PHASE 1 COMPLETE, PHASE 2A COMPLETE, PHASE 2B COMPLETE; RESOLVED)

**Severity:** High (delivery and pricing ambiguity)

**Description:**
The repository now contains a canonical commercial-definition layer for mixed photo + video coverage, and the customer journey now applies it consistently through estimate entry, booking, and saved quote display:

1. `lib/pricing-presets.ts` now defines explicit `CoverageProfile` semantics, including applicable families, crew expectations, and deliverables, with backward-compatible aliases preserved for existing consumers.
2. Pricing and Parent Product Pages now teach the resolved `CoverageProfile` labels, summaries, crew, and deliverable expectations on estimate-entry surfaces.
3. Booking and saved-quote surfaces now derive and display the same coverage-format meaning from existing plan and quote data for both English and Hindi, without new storage fields.

**Business impact:** Customers now see one consistent commercial-definition model for hybrid coverage from pricing through booking and saved quote review. Crew and deliverable expectations no longer depend on the user remembering pricing-page context.

**Fix path:** Preserve Phase 1 ownership in `lib/pricing-presets.ts`, `lib/i18n/messages/pages.en.json`, `lib/i18n/messages/pages.hi.json`, and `lib/quote-localization.ts`. Phase 2B is now complete and approved. The reviewer-approved locale fix aligned the Hindi service-name mappings in `lib/pricing-presets.ts` with the builder `serviceCatalog` names in `lib/i18n/messages/pages.hi.json`, allowing derived `CoverageProfile` continuity to work in both EN and HI without introducing new persisted commercial-definition fields or changing quote-security contracts.

**Status update:** ISSUE-008 is resolved (2026-05-31). Phase 1, Phase 2A, and Phase 2B are complete. Booking and saved quote continuity now work for both EN and HI through the existing pricing -> booking -> encrypted quote contract, with no changes to `PlanData`, `QuotePayload`, Firestore shape, admin auth, locale routing, or URLs.

---

### ISSUE-009: Preset ownership is fragmented across page-local templates and regex-based service-prefill logic (PHASE 1 COMPLETE; RESOLVED)

**Phase 1 implemented:** A centralized `lib/pricing-presets.ts` composition layer has been created and `app/pricing/page.tsx` refactored to consume it.

- **Event template compositions** (`EVENT_TEMPLATE_PRESETS`) — all 11 wedding/event template service/addOn selections are now declared in `lib/pricing-presets.ts` with stable `eventKey` identifiers. `getEventTemplates()` in `page.tsx` applies i18n labels on top of this structural data.
- **Service-entry preset mappings** (`SERVICE_ENTRY_PRESET_RULES`, `resolveServiceEntryPreset()`) — the implicit regex-string matching in `getServicePrefill()` is replaced by an explicit ordered rule table. First matching rule wins. `getServicePrefill()` is now a thin wrapper.
- **CoverageProfile semantics** (`COVERAGE_PROFILES`, `detectCoverageProfile()`, with backward-compatible `HYBRID_COVERAGE_PROFILES` aliases) — hybrid photo + video coverage types are now named, inspectable commercial concepts rather than implicit additive service selections. Addresses ISSUE-008 at the data-model level.
- Named package ownership remains in `lib/constants.ts` (`PACKAGES[].builderPreset`, `PACKAGES[].name`). `packageName` semantics are unchanged.

**Remaining:** No remaining blocking work under ISSUE-009. Listing-level price-anchor cleanup completed under ISSUE-012, hybrid-offer discoverability and continuity completed under ISSUE-008, and the broader service-page editorial cleanup completed under ISSUE-010.

**Status update:** Phase 1 remains complete and unchanged. D-016 preserves `lib/pricing-presets.ts` as the canonical non-package composition layer while service-page estimate entry points converge on pricing. ISSUE-009 is resolved.

---

### ISSUE-010: Template-origin and generic service-detail content still conflicts with the intended Orvex commercial model (PHASE 1 COMPLETE, PHASE 2 COMPLETE, PHASE 3 COMPLETE; RESOLVED)

**Severity:** Low / Medium (editorial, SEO, and brand-consistency risk)

**Description:**
Template-origin and generic fallback content previously remained in service-detail generation, but reviewer-approved Phase 3 completion closes the remaining ancillary-page risk:

1. `app/services/data.ts` remains the single source of truth for service cards, service-detail fields, service-specific Hindi content, role classification, and service-detail imagery.
2. Reviewer-approved Phase 1 completion means the six previously generic Parent Product Pages (`engagement-photography`, `birthday-photography`, `housewarming-photography`, `events-photography`, `maternity-photography`, `corporate-photography`) now use explicit English and Hindi editorial content plus local representative imagery instead of falling through the generic template path.
3. Reviewer-approved Phase 2 completion means all 20 classified Variant Discovery Pages defined in `SERVICE_CLASSIFICATIONS` now use explicit English editorial content, explicit Hindi editorial content, and local hero/gallery assets in `app/services/data.ts` instead of generic template paths.
4. Reviewer-approved Phase 3 completion means all 12 classified Ancillary Standalone Service Pages defined in `SERVICE_CLASSIFICATIONS` now use explicit English editorial content, explicit Hindi editorial content, and local representative hero/gallery imagery in `app/services/data.ts` while preserving the approved contact-led ancillary model.
5. Dormant package-array compatibility data still exists in `app/services/data.ts`, but the current service-detail renderer no longer treats it as a purchase-defining commercial surface. That is now separate maintenance debt, not an open commercial-model issue.

**Business impact:** Service-detail surfaces across parent, variant, and ancillary roles now align with the approved event-first commercial model. The repo no longer presents generic template-origin detail pages that materially contradict the intended customer-facing information architecture.

**Fix path:** ISSUE-010 completed in role-based phases. Phase 1 curated the remaining Parent Product Pages. Phase 2 curated all 20 classified Variant Discovery Pages while preserving parent CTA ownership and multi-parent routing rules. Phase 3 curated the 12 classified Ancillary Standalone Service Pages, replacing auto-generated detail content and remote stock imagery while preserving their contact-led commercial model. Any later reduction of dormant compatibility scaffolding should be tracked separately as a cleanup item rather than reopening commercial-model discovery.

**Status update:** ISSUE-010 is resolved (2026-05-31). All 12 classified ancillary service pages now have explicit English and Hindi editorial content plus local representative imagery while preserving the contact-led ancillary model. Package ownership, `CoverageProfile` ownership, pricing ownership, booking flow, quote flow, admin behavior, locale routing, and service classification architecture remained unchanged.

---

### ISSUE-011: Service-page package cards are not backed by canonical offer definitions (PHASE 2B COMPLETE; RESOLVED)

**Severity:** High (commercial truthfulness and quoting risk)

**Description:**
Service-page package cards currently act like a second commercial catalog even though canonical offer ownership lives elsewhere:

1. Explicit service-detail packages use local package names, prices, durations, and deliverables that do not exist as canonical offers in pricing, booking, quote, or admin.
2. Auto-generated service packages create generic `Essential / Premium / Luxury` or product ladders for services without curated offer ownership, reusing generic feature lists across unrelated services.
3. Localized service-detail copy still labels these ladders as real `{service} pricing` and `{service} packages`, which signals a stable sellable catalog even though estimate entry is actually owned by canonical packages and service-entry presets.

**Business impact:** Customers can believe they are selecting real Orvex packages when the structured estimate flow sells something else. Sales and quoting then have to translate from page-local pseudo-offers to actual builder-backed estimates, increasing trust loss, expectation gaps, and quoting friction.

**Fix path:** Phase 2B should not polish or rename the local ladders. First classify service pages into parent event/session product pages, variant discovery pages, and ancillary standalone services. Then remove or replace service-page package cards on variant pages with discovery/editorial content or parent estimate-entry framing grounded in canonical estimate-entry semantics. If package-like content remains, it must be derived from canonical source-of-truth data rather than local arrays or generic fallback logic.

**Status update:** Phase 2B is complete. The approved classification model, variant-page and ancillary-page package-ladder removal, and CTA ownership changes for this pass are complete. Parent Product Page package-section redesign later completed through Phase 3 / ISSUE-012, and the remaining ancillary editorial cleanup later completed through ISSUE-010 Phase 3. Dormant compatibility package arrays remain separate non-blocking maintenance debt. ISSUE-011 is resolved.

---

### ISSUE-012: Service-card starting prices are not aligned to canonical estimate-entry offers (PHASE 3 COMPLETE; RESOLVED)

**Severity:** Medium (expectation-setting risk)

**Description:**
Home and services listing pages currently anchor customer expectations with local starting-price heuristics that do not always match the canonical estimate entry points:

1. Many service cards use local `startingPrice` values that are not tied to the actual service-entry preset or template total a customer reaches on pricing.
2. Event categories such as Birthday and Corporate can show listing prices that diverge materially from the structured pricing flow.
3. Combined Photography + Videography offerings do not have a single discoverable service-page starting point that maps cleanly to the canonical pricing journey.

**Business impact:** Customers can arrive at pricing with a price anchor that does not match the actual estimate structure, increasing distrust and drop-off before booking.

**Fix path:** Implement the approved Phase 3 customer-facing model in Section 14. Reframe Home as a coverage-family discovery surface, reframe Services as grouped discovery rather than a flat service-price catalog, convert Parent Product Pages into coverage-family hubs, remove parent-page local package ladders, and replace them with coverage examples backed by exact pricing handoffs and exact current totals. Keep named package ownership on pricing only. Remove or relabel listing-level numeric anchors anywhere no honest canonical single-anchor price exists.

**Status update:** ISSUE-012 is resolved (2026-05-31). Phase 3 is complete: Home reframed as coverage-family discovery, Services listing role-sorted with variant badge replacing numeric price for non-parent cards, Parent Product Pages converted from page-local package ladders to `CoverageEstimatesSection` backed by canonical `PACKAGES` + `computePackagePrice()`, footer navigation emphasis aligned to parent pages only, service detail metadata made role-aware for ancillary pages. Navigation emphasis and discovery/editorial metadata/schema alignment confirmed closed. Build: 68/68 routes, TypeScript clean.

---

### ISSUE-013: Ancillary service pages are mixed into the event-coverage estimate journey without a matching commercial model (PHASE 2C COMPLETE; RESOLVED)

**Severity:** High (product-model ambiguity)

**Description:**
Not every service page belongs to the same commercial system as the pricing builder:

1. The pricing builder cleanly models event/session coverage through canonical packages, event templates, and service-entry presets.
2. Some secondary services such as albums, frames, restoration, and personalized gifts do not map to a canonical pricing preset at all.
3. Other secondary services such as studio, portrait, portfolio, and product photography are only loosely collapsed into a generic preset, which is not the same as a clearly defined standalone commercial product model.
4. Public service pages still encourage estimate intent even when the underlying builder does not represent that service as a first-class product.

**Business impact:** Customers can be pushed into the coverage estimate flow for services that are actually ancillary, offline-quoted, or operationally distinct. This weakens the clarity of the product catalog and creates false expectations about what pricing can currently estimate.

**Fix path:** Separate ancillary standalone services from the core event-coverage model. Phase 2C completed this by stopping ancillary standalone services from routing through the primary coverage estimate journey and making them contact-led discovery surfaces without changing pricing, booking, quote, or canonical package ownership. A secondary canonical pricing/contact model remains a later decision and is not part of the current program.

**Status update:** Phase 2C is complete. Ancillary standalone services are now separated from the primary coverage estimate journey through CTA ownership, pricing-entry ownership, and related internal-link/messaging cleanup. No pricing, booking, quote, Firestore-shape, or canonical package ownership changes were required. ISSUE-010 Phase 3 later completed the remaining ancillary editorial cleanup without changing that commercial model. ISSUE-013 is resolved.

---

## 11. Decisions Made

### D-001: Pricing is computed, not stored
Package prices are computed at render time from `SERVICE_RATES`, `EVENT_ADDONS`, `GLOBAL_ADDONS`, and `PACKAGES[].builderPreset`. Changing a rate in `lib/constants.ts` automatically updates all package prices, comparison tables, and service pages. No duplication allowed.

### D-002: Quote payload is encrypted end-to-end
The full quote payload is encrypted with AES-256-GCM before Firestore storage. The access token is never stored in plaintext — only its SHA-256 hash. Admin recovery uses a separately scoped encryption of the active token.

### D-003: Active link recovery uses scoped encryption
When a share link is generated for a quote, the admin API stores the access token encrypted with a scoped key (`active-access-token` scope). This allows the admin to recover and re-share the active link without storing the token in plaintext.

### D-004: No PDF generation — quotes are browser-print only
The saved quote page (`app/quote/[id]/page.tsx`) is designed for browser print. There is no server-side PDF generation service.

### D-005: Locale is URL-prefix based, not domain-based
`/en/...` and `/hi/...` are the canonical URL forms. The middleware handles redirect and rewrite. No subdomain or domain-based locale routing.

### D-006: Booking requires a pricing plan
`app/book/page.tsx` redirects to `/pricing` if no valid session storage plan is found. There is intentionally no direct booking path that bypasses the pricing builder. This ensures quotes always carry event/service data.

### D-007: Admin uses two cookies for resilience
Both `orvex_admin_session` (set on login page, readable from page JS context) and `orvex_admin_api_session` (set as HTTP-only) are issued on login. Admin API routes accept either. This provides a fallback if one cookie is blocked.

### D-008: Public write endpoints always use guardPublicWriteRequest
`/api/quotes` and `/api/inquiries` must call `guardPublicWriteRequest()` before any processing. This guard must not be bypassed or removed.

### D-009: service names in constants.ts must have Hindi translations in quote-localization.ts
Any `name` string that can appear in a `QuotePayload.events[].selections[].name`, `QuotePayload.globalAddOns[].name`, or event name must have a corresponding entry in `QUOTE_VALUE_TRANSLATIONS_HI`. This is a manual maintenance contract.

### D-010: Package builderPreset is the canonical package definition
The `builderPreset` in `PACKAGES` is the authoritative definition of what each canonical pricing-page package includes for price computation and builder pre-fill. `features[]`, `notIncluded[]`, and `subtitle` no longer exist in `PACKAGES[]` — display text lives exclusively in i18n messages. Feature copy must be kept consistent with the builderPreset manually; this is a maintenance contract with no automated enforcement.

### D-011: Package identity persists inside booking handoff and encrypted QuotePayload
`packageName` uses the canonical package name from `PACKAGES[].name`. It is present only for unmodified package bookings, omitted for custom-edited builds once package state is cleared, and must not be duplicated as top-level Firestore metadata.

### D-012: Orvex sells one canonical modular estimate system
Orvex’s intended commercial model is a single structured pricing system: shared rates and add-ons, builder-backed named bundles, and guided event presets. The business does not intentionally sell multiple independent package ladders across different page types.

### D-013: Service pages are discovery and editorial surfaces, not independent commercial package systems
Service pages may surface canonical packages or example estimates, but they must not own standalone package ladders disconnected from pricing, booking, quote, and admin. Core service pages must be classified by role: parent event/session product pages, variant discovery pages, or ancillary standalone service pages.

### D-014: Canonical offer ownership must be centralized
Atomic rates and add-ons remain in `lib/constants.ts`. Event template compositions, service-entry preset mappings, and hybrid coverage semantics are owned by `lib/pricing-presets.ts` (Phase 1 implemented). Display copy lives in i18n messages. Service editorial content lives in `app/services/data.ts`. Named package ownership remains in `lib/constants.ts`.

### D-015: Hybrid photo + video coverage requires explicit commercial semantics
Combined Photography + Videography offerings must be represented as explicit commercial coverage units with defined expectations, not only as implicit additive service selections.

### D-016: Pricing owns the public estimate journey for coverage products
Pricing is the canonical public estimate and package surface for Orvex's primary event/session coverage business. Estimate-labeled CTAs across public entry points must deep-link into the pricing builder, preserving locale-aware handoff context where available. Booking must continue to originate only from pricing. Service pages remain discovery and editorial surfaces and should reduce local package ownership over time rather than acting as parallel package sellers. SEO metadata, localization parity, and the existing pricing -> booking -> encrypted quote contracts must be preserved during this migration.

**Status update:** Phases 1, 2A, 2B, and 2C are complete. Home, services, service detail, gallery, blog, navbar estimate, and quote "new estimate" entry points preserve query-based handoff context and deep-link to `#calculator` on pricing. Service-detail package cards no longer act as standalone inquiry paths, variant/ancillary page package-ladder ownership has been removed per the approved classification model, and ancillary standalone services no longer enter the primary coverage estimate journey. **Phase 3 / ISSUE-012 is now complete.** Home is reframed as coverage-family discovery (parent slugs show canonical starting price; variant slugs show "Coverage Style" badge); Services listing is role-sorted with variant badge replacing numeric price for non-parent cards; Parent Product Pages use `CoverageEstimatesSection` backed by canonical `PACKAGES` + `computePackagePrice()` replacing disconnected page-local package ladders; footer navigation emphasis is aligned to parent pages only (corporate replaces drone; event link goes to `/services/events-photography`); and service detail metadata is role-aware (ancillary pages no longer advertise pricing keywords or "View pricing online"). Phase 3 Section 14.4 follow-through (navigation emphasis and discovery/editorial metadata/schema alignment) is closed.
ISSUE-010 Phase 3 is now also complete, so all D-016 and ISSUE-006 through ISSUE-013 commercial-model objectives are complete.

### D-017: Service-detail pages do not own package-card definitions
When a service page cannot render the exact sellable object from the canonical pricing system, it must not present local package names, prices, durations, or feature ladders as purchase-defining offers. Service pages may guide customers into canonical estimate entry or present editorial planning guidance, but offer definitions remain owned by `lib/constants.ts` and `lib/pricing-presets.ts`.

### D-018: Orvex's primary commercial model is event-first coverage, not a 41-product service catalog
The repository presents many service URLs, but the structured selling system shows a smaller reality: Orvex primarily sells event/session coverage products, started from canonical packages or guided event/session setups, then customized with service units and add-ons. Most long-tail service pages are discovery or variant pages for SEO, not distinct commercial products. Ancillary studio, print, restoration, and gift services form a secondary line and must not be forced through the event-coverage pricing model unless a separate canonical product model is defined.

### D-019: Phase 2B was a page-role and CTA-ownership pass, not a parent-product redesign
The approved Phase 2B implementation was intentionally narrow. It applied the approved page classification model, removed package ladders from Variant Discovery Pages and Ancillary Standalone Service Pages, and reassigned CTA ownership so conversion follows the approved parent-product journey. It did not create a new package catalog, did not change canonical package ownership, and did not redesign Parent Product Page package sections.

### D-020: Phase 3 customer-facing IA uses coverage families and pricing-owned packages
The approved Phase 3 customer-facing model finalizes the public teaching surfaces for the event-first commercial model. Home must present coverage families rather than a flat catalog of separately priced services. Services must present grouped discovery that clearly separates Parent Coverage Families, Variant Discovery Pages, and Ancillary Standalone Services. Parent Product Pages must act as coverage-family hubs, not page-local package sellers. Named package presentation remains owned by pricing only. Parent Product Pages must replace local package ladders with coverage examples backed by exact pricing handoffs and exact current totals. Wedding Photography + Videography is represented as a coverage format inside the Wedding Coverage family, not as a separate top-level product family.

### D-021: CoverageProfile is the canonical commercial-definition layer for mixed and single-mode coverage
`CoverageProfile` in `lib/pricing-presets.ts` is the canonical layer that explains how photo/video selections should be taught to customers across estimate-entry, booking, and quote surfaces. Adoption completed in approved slices. Phase 2A closed estimate-entry adoption. Phase 2B closed booking and saved quote continuity. Named package ownership remains in `lib/constants.ts`, and ISSUE-008 closed without altering pricing -> booking -> encrypted quote storage contracts.

### D-022: CoverageProfile continuity across booking and quote must be derived, not stored
Phase 2B derived `CoverageProfile` display semantics from existing booking handoff data and decrypted quote payload content without adding new persisted commercial-definition fields to `PlanData`, `QuotePayload`, Firestore metadata, or admin records. Continuity belongs in presentation and shared helper logic, not new storage contracts.

### D-023: Localized service-name mapping for derived CoverageProfile continuity is a maintenance contract
`detectCoverageProfileFromSelectionNames()` depends on localized service selection display names because booking handoff data and decrypted quote payloads preserve display names rather than service IDs. The reviewer-approved Phase 2B locale fix aligned the Hindi mappings in `lib/pricing-presets.ts` with the `pricingPage.builder.serviceCatalog.*.name` values in `lib/i18n/messages/pages.hi.json` for Traditional Photography, Candid Photography, Traditional Videography, and Cinematic Videography. Future label changes in the builder service catalog must update this mapping in lockstep. This is a maintenance contract, not an open commercial-model issue.

### D-024: ISSUE-010 editorial cleanup followed the approved page-role model through full closure
Service-detail editorial cleanup followed the D-016 role model instead of reopening the old flat service-catalog approach. Phase 1 completed the remaining Parent Product Pages because they were the highest-traffic, metadata-driving, conversion-owning surfaces. Phase 2 completed all 20 classified Variant Discovery Pages. Phase 3 completed the 12 classified Ancillary Standalone Service Pages. ISSUE-010 is resolved.

### D-025: Service-detail editorial ownership remains in app/services/data.ts; commercial ownership stays elsewhere
`app/services/data.ts` remains the source of truth for service cards, service-detail editorial content, service-specific Hindi content, role classification, and service-detail imagery. `lib/i18n/messages/pages.en.json` and `lib/i18n/messages/pages.hi.json` continue to own only service-detail UI chrome and shared labels. Commercial packages, coverage examples, pricing computations, and estimate-entry semantics remain owned by `lib/constants.ts` and `lib/pricing-presets.ts`. ISSUE-010 Phases 1, 2, and 3 completed without changing package ownership, pricing ownership, `CoverageProfile` ownership, booking flow, quote flow, admin behavior, locale routing, or service classification architecture.

### D-026: Parent service-detail imagery in the ISSUE-010 Phase 1 slice must use local or explicitly approved representative assets
ISSUE-010 Phase 1 completed the move of the six previously generic Parent Product Pages onto explicit editorial entries with local representative hero and gallery images referenced from local public assets such as `public/images/portfolio/` through `app/services/data.ts`. Do not reintroduce raw remote Unsplash fallback imagery on those curated parent slugs. If representative references are still being used, keep the existing honest framing that they are references rather than direct client proof.

### D-027: SERVICE_CLASSIFICATIONS is the authoritative ISSUE-010 scope count
`SERVICE_CLASSIFICATIONS` in `app/services/data.ts` is the authoritative scope definition for ISSUE-010 role-based cleanup. Reviewer-approved completion confirms that all 20 classified Variant Discovery Pages and all 12 classified Ancillary Standalone Service Pages are now curated. The commercial-model cleanup scope is closed; there were never 21 variants or any broader unclassified ISSUE-010 set.

### D-028: Dormant ancillary package-array compatibility data is a separate post-program cleanup item
The explicit ancillary `serviceDetails[*].packages` arrays and mirrored Hindi package-feature compatibility data that remain in `app/services/data.ts` are now non-authoritative maintenance debt. The approved ancillary UI model is contact-led, not package-selling. Track this debt separately as a maintainability cleanup item rather than keeping ISSUE-010 or the broader commercial-model program open.

### D-029: The commercial-model program, Phase A audit, and customer-journey follow-through are complete; repository can advance to Phase B Performance Audit
With D-016 and ISSUE-006 through ISSUE-013 complete, project priorities shifted from commercial-model correction to post-program customer-journey evaluation. Phase A - Customer Journey & UX Audit is complete, and reviewer-approved completion of ISSUE-CJ-001 through ISSUE-CJ-009 closes the customer-facing implementation follow-through produced by that audit. The repository can now advance to Phase B Performance Audit.

### D-030: ISSUE-CJ-001 through ISSUE-CJ-009 are complete; the next active program is Phase B Performance Audit
Reviewer-approved completion of ISSUE-CJ-001 closed the cross-surface funnel-copy cleanup, reviewer-approved completion of ISSUE-CJ-004 closed the Pricing-vs-Booking terminology cleanup, reviewer-approved completion of ISSUE-CJ-002 closed the pricing/package teaching cleanup, reviewer-approved completion of ISSUE-CJ-007 closed the standalone-service expectation cleanup, reviewer-approved completion of ISSUE-CJ-005 closed the trust-signal and claim-scoping cleanup, reviewer-approved completion of ISSUE-CJ-006 closed the representative-imagery and portfolio-framing cleanup, reviewer-approved completion of ISSUE-CJ-003 closed the choice-reduction and mobile-scanning cleanup, reviewer-approved completion of ISSUE-CJ-008 closed the contact and saved-estimate recovery-state clarity cleanup, and reviewer-approved completion of ISSUE-CJ-009 closed the low-priority non-funnel terminology cleanup. Pricing remains positioned as the estimate builder, Booking remains positioned as the availability-request form, and no unresolved Phase A customer-journey follow-through issue remains.

### D-031: Phase A findings overlap existing architecture decisions as customer-facing follow-through, not reopened discovery
ISSUE-CJ-001, ISSUE-CJ-002, ISSUE-CJ-004, ISSUE-CJ-007, and ISSUE-CJ-008 sit on top of already-approved architecture decisions such as D-016, D-020, Section 13.2-13.4 customer-journey rules, D-021, D-022, D-026, D-028, and the existing pricing -> booking -> encrypted quote contract. These findings do not reopen package architecture, route-shape, locale-routing, or quote-security discovery. They require customer-facing copy, IA, CTA, trust, and expectation follow-through within the existing model.

### D-032: Phase A remediation proceeded in four implementation phases, and all four are complete
Phase A follow-through remained sequenced by customer and business impact. Reviewer-approved completion of ISSUE-CJ-001 and ISSUE-CJ-004 closed the core Phase A1 terminology cleanup across funnel entry, estimate-building, and availability-request handoff, including the ISSUE-CJ-008 recovery-state follow-through. Reviewer-approved completion of ISSUE-CJ-002 and ISSUE-CJ-007 closed Phase A2 pricing/package comprehension and standalone-service expectation alignment. Reviewer-approved completion of ISSUE-CJ-005 and ISSUE-CJ-006 closed Phase A3 trust, proof, and imagery expectation calibration. Reviewer-approved completion of ISSUE-CJ-003 closed Phase A4 choice reduction and mobile simplification. Reviewer-approved completion of ISSUE-CJ-009 closes the final non-funnel terminology-consistency follow-up, so the repository can now advance to Phase B audit priorities.

### D-034: Pricing is the estimate builder; Booking is the availability-request form
Reviewer-approved completion of ISSUE-CJ-004 fixes the customer-facing role distinction between the two core funnel steps. Pricing owns estimate teaching, estimate shaping, and estimate review. Booking owns request details and availability-request submission. Future copy or CTA work must preserve that distinction and must not collapse Booking back into a second pricing step.

### D-035: ISSUE-CJ-002 closed only after English-Hindi explanatory parity was complete
Reviewer-approved completion of ISSUE-CJ-002 required the explanatory copy cleanup to hold in both EN and HI. The final Hindi follow-up corrected `pricingPage.builder.eventExtrasHint` in `lib/i18n/messages/pages.hi.json`, closing the remaining parity gap. Future pricing-copy clarification work must preserve English-Hindi meaning parity across package, event, service, and add-on teaching surfaces.

### D-036: ISSUE-CJ-007 closed only after ancillary rendered content was free of package-tier references in both EN and HI
Reviewer-approved completion of ISSUE-CJ-007 required the ancillary rendered `includes`, `process`, and `faqs` content to stop implying hidden package tiers in both English and Hindi. The approved result confirms all 12 ancillary slugs remain in parity, the rendered ancillary expectations now match the contact-led model, production build validation passed 68/68 routes, and no pricing, booking, or locale-routing logic changed.

### D-037: ISSUE-CJ-005 closed only after the remaining Hindi home trust-signal short-form copy matched the approved weekday framing
Reviewer-approved completion of ISSUE-CJ-005 required the final Hindi home trust-signal short-form copy in `lib/i18n/messages/home.hi.json` to use `कार्यदिवसों के दौरान`. The approved Pass 2 follow-up confirms the other reviewed English and Hindi trust surfaces remained unchanged and production build validation passed 68/68 routes. Future trust-copy work should preserve the approved scoping unless a new trust or proof issue is explicitly opened.

### D-038: ISSUE-CJ-006 closed only after gallery framing and service-detail style-reference wording were aligned in both locales
Reviewer-approved completion of ISSUE-CJ-006 required the gallery framing copy in `lib/i18n/messages/pages.en.json` and `lib/i18n/messages/pages.hi.json` to use `All Styles` and `सभी स्टाइल्स`, and required the service-detail alt template to use style-reference wording in both locales. The approved result also confirmed no additional gallery or service-detail framing drift remained and production build validation passed 68/68 routes. Future imagery-framing work should preserve the approved representative-imagery scoping unless a new proof or portfolio issue is explicitly opened.

### D-039: ISSUE-CJ-003 closed with a documented residual browse-density note on Services
Reviewer-approved completion of ISSUE-CJ-003 reduced service-choice overload and improved mobile scanning without reopening the approved service-role model, URL continuity, or pricing and booking contracts. The remaining residual risk is narrower: the Services page still defaults to a 41-card `All Services` view, while variant cards still use the role label in the price slot. That residual browse-density and labeling risk is no longer a blocker to ISSUE-CJ-003 closure, but it remains the documented constraint if future discovery simplification work is reopened.

### D-040: ISSUE-CJ-008 closed only after quote recovery copy localized the recovery path and made CTA priority explicit
Reviewer-approved completion of ISSUE-CJ-008 required the quote recovery state to consistently render localized recovery copy with WhatsApp as the primary CTA and the pricing builder as the secondary CTA. The approved result confirms recovery messaging now preserves one dominant next step across locales and production build validation passed 68/68 routes. Future recovery-state work should preserve the approved CTA hierarchy unless a new funnel issue is explicitly opened.

### D-041: ISSUE-CJ-009 closed only after privacy-policy meaning stayed intact in EN and HI and admin source labeling moved through shared helpers
Reviewer-approved completion of ISSUE-CJ-009 required privacy-policy terminology cleanup to preserve legal meaning in both English and Hindi while aligning the wording with the approved funnel vocabulary. The approved result also confirmed that admin source labeling now stays consistent through the shared `bookingSource` localization and `sourceDisplayLabel` helper, and production build validation passed 68/68 routes. Future terminology cleanup must preserve legal meaning, internal source enums, and stored source values.

### D-042: Phase B should start with the shared public discovery route shell on Home and Services
The first approved Phase B Performance Audit slice is the shared public discovery route shell spanning `app/layout.tsx`, shared public chrome (`components/Navbar.tsx`, `components/Footer.tsx`, `components/WhatsAppFloat.tsx`), the Home route (`app/page.tsx`, `components/home/ClientSections.tsx`, `components/home/HomeServerSections.tsx`), and the Services route (`app/services/page.tsx`) plus immediate message/data owners that materially affect those routes. This slice is approved first because it combines the highest-traffic public entry surfaces, large above-the-fold imagery, client-heavy rendering, locale-aware routing concerns, and shared chrome that compounds cost across both locales. The audit should identify bundle, hydration, route-rendering, and image-delivery cost before moving to narrower or higher-risk funnel routes such as Pricing, Booking, or Quote.

### D-043: The first approved Phase B implementation pass is ordered Navbar search-param isolation, shared chrome serverization, then Home discovery serverization
Phase B audit findings are now reviewed and approved for Worker implementation in a constrained order. Finding 1 is approved first: preserve query-param continuity on locale switch and confine the `useSearchParams()` dependency in `components/Navbar.tsx` behind Suspense rather than dropping query-param preservation. Dropping query-param preservation is not approved because query params are part of pricing handoff, source attribution, and locale-aware route continuity. Finding 3 is approved second: convert `components/Footer.tsx` and `components/WhatsAppFloat.tsx` to server-rendered components with a plain `locale: AppLocale` prop passed from `app/layout.tsx`; these components do not need `useLocaleSync()`. Finding 2 is approved third: convert `components/home/HomeServerSections.tsx` to a true server component, but do not thread locale down from `app/layout.tsx`; instead resolve locale at the Home page/server entry and pass a plain `locale: AppLocale` prop into the server home-sections boundary. The preferred prop contract is a single server boundary that computes locale-backed home messages once, rather than repeated client locale reads.

### D-044: The first approved Phase B shared public discovery shell slice is implemented and reviewer-approved
Reviewer-approved completion of the first approved Phase B Performance Audit slice confirms the approved architecture held end to end. `middleware.ts` now forwards `x-search-string` from `request.nextUrl.search`, `app/layout.tsx` threads that value into `components/Navbar.tsx`, and the SSR locale-switch fallback in `components/Navbar.tsx` preserves token-bearing query params before hydration instead of dropping them on first render. `components/Footer.tsx` and `components/WhatsAppFloat.tsx` remain server components with `locale: AppLocale` passed from `app/layout.tsx`, and `components/home/HomeServerSections.tsx` remains a prop-driven server boundary fed from the async Home page/server entry in `app/page.tsx` rather than via layout-level locale threading. Production build validation passed at 68/68 routes. The broader Phase B program remains open, but this first approved slice is closed and no Worker-ready prompt remains for it.

### D-045: Phase B should continue with the estimate-to-request funnel shell on Pricing and Booking
The next approved Phase B Performance Audit slice is the estimate-to-request funnel shell spanning `app/pricing/page.tsx`, `app/book/page.tsx`, and the immediate client-side handoff owners that materially control those routes: `lib/pricing-handoff.ts`, `lib/pricing-presets.ts`, `lib/constants.ts` for `BOOKING_PLAN_STORAGE_KEY` and canonical pricing inputs that directly shape initial route work, `lib/save-quote.ts`, and `lib/popup-handoff.ts`. This slice is approved next because it is the highest-value remaining customer path after the shared discovery shell: `app/pricing/page.tsx` is a large client-rendered estimate builder that parses query handoff context with `useSearchParams()`, derives prefills from shared pricing presets, and serializes plan state for Booking; `app/book/page.tsx` bootstraps from session storage, reconstructs the customer request form, and triggers the quote-save handoff. The approved audit boundary is intentionally narrower than quote-security architecture: `app/api/quotes/route.ts`, `app/api/quotes/[id]/route.ts`, `lib/quote-security.ts`, Firestore schema, and locale-routing infrastructure remain protected dependencies, not implementation targets for this slice. The audit should focus on route rendering, hydration cost, query-handoff continuity, session-handoff bootstrap cost, and submit-path UX latency without changing pricing ownership, booking semantics, quote access semantics, or SEO-visible output.

### D-046: Phase B estimate-to-request Finding 2 is approved only under Decision A
Finding 2 from the Phase B estimate-to-request audit is approved only under Decision A. The current pricing-to-booking handoff contract continues to serialize locale-active service display names, not canonical service IDs, into the session plan and downstream quote payload flow. `lib/pricing-presets.ts` remains the compatibility layer that derives `CoverageProfile` semantics from those localized display names, including the mapping and explanatory comments around `SERVICE_DISPLAY_NAME_TO_ID` and `detectCoverageProfileFromSelectionNames()` in `lib/pricing-presets.ts`. For this slice, the only approved follow-through around that area is comment or documentation clarification of the existing contract and maintenance rule. Canonical service ID serialization, session-plan redesign, booking-handoff schema changes, or quote-payload redesign are not approved in this slice.

### D-047: The Phase B estimate-to-request implementation order is approved as storage continuity, write guard, route-root Suspense, then pricing-shell separation
The estimate-to-request audit is now reviewed for implementation order. Findings 1 through 4 are approved for Worker implementation in this order. Finding 1 is approved first: preserve `BOOKING_PLAN_STORAGE_KEY` through the Booking step by changing the destructive clear timing in `app/book/page.tsx` so the session plan is not removed before the route has safely validated and consumed it. Finding 2 is approved second: add a session-storage write-failure guard in `app/pricing/page.tsx` before navigating to `/book`, so Pricing does not route customers into a Booking page that cannot bootstrap the plan. Finding 3 is approved third: isolate Pricing-route `useSearchParams()` usage behind Suspense at the route root instead of letting the full route depend on search-param hydration. Finding 4 is approved fourth: split the non-interactive Pricing shell away from the calculator boundary so the route can reduce initial client hydration without changing estimate-builder behavior. Finding 5 is not approved as part of the same Worker implementation pass because it defines source-of-truth ownership, not just implementation order: `source` in `buildPricingHandoffHref()` and `getPricingHandoff()` is source attribution, not a safe source of truth for a visible service label. For service-detail entry points, the localized visible service name remains owned by `app/services/data.ts`; Decision A remains in force for `lib/pricing-presets.ts`; and no session-plan or quote-payload redesign is approved in this slice.

### D-048: Phase B estimate-to-request Findings 1 through 4 are implemented and reviewer-approved
Reviewer-approved completion of the Phase B estimate-to-request implementation pass confirms that `app/book/page.tsx` now defers `BOOKING_PLAN_STORAGE_KEY` clearing until after validated plan consumption, `app/pricing/page.tsx` blocks navigation when the session-storage write fails, query-prefill parsing is isolated behind a nested Suspense bridge with server-derived initial search params, and the Pricing route shell is split from the calculator boundary. Production build validation passed at 68/68 routes. `npm run lint` could not execute in the current repository environment because `eslint` is not installed. Finding 5 remains open as Architect-owned follow-up because it still defines source-of-truth ownership for the visible service label in service-entry Pricing handoffs. Decision A remains in force for `lib/pricing-presets.ts`, and no session-plan or quote-payload redesign was approved or introduced in this slice.

### D-049: The visible service label in service-entry Pricing handoffs should come from service-detail localized ownership, resolved from the service slug at the Pricing route boundary
The source of truth for the visible service label in service-entry Pricing handoffs is the localized service-name ownership already defined in `app/services/data.ts`, specifically `getLocalizedServiceName(slug, locale)`. The `service` query param remains the structural handoff identifier for service-entry intent, while `source` remains attribution only and must not be promoted into visible-label ownership. A new handoff-specific label field is not approved because it would duplicate localized service-name ownership and introduce avoidable drift across entry points. The minimal safe follow-up scope is therefore route-local and additive: resolve the visible service label from the existing `service` slug and request locale at the server Pricing route boundary in `app/pricing/page.tsx` or an adjacent server-only helper, pass that resolved string into `app/pricing/PricingEstimatorShell.tsx`, and use it only where the UI needs a visible service label for service-entry handoffs. Keep `source` for attribution copy, keep Decision A in force for `lib/pricing-presets.ts`, and do not change session-plan serialization, quote payload shape, or quote-access behavior.

### D-050: The service-entry visible-label follow-up is implemented and reviewer-approved; two residual locale-normalization issues remain outside this slice
Reviewer-approved completion of the service-entry visible-label implementation confirms that the server Pricing route now resolves `resolvedServiceLabel` from `getLocalizedServiceName(serviceSlug, locale)`, and the client Pricing shell in `app/pricing/PricingEstimatorShell.tsx` receives only `resolvedServiceLabel` for service-entry visible-label rendering. `sourceLabel` remains attribution-only, `prefillKey` and `PricingHandoffContext.sourceLabel` remain unchanged, Decision A session-plan serialization remains intact, and service identifiers remain locale-independent. Production build validation passed at 68/68 routes. Two residual follow-up issues are documented outside this completed implementation slice: Booking still shows stored locale-active labels after locale switch because `sessionStorage` values are rendered verbatim, and Saved Quote can still show Hindi-origin labels on English routes because `lib/quote-localization.ts` only translates toward Hindi.

### D-051: The two residual cross-locale label issues should be handled as one shared Phase B follow-up slice, not two separate slices
The Booking locale-switch drift in `app/book/page.tsx` and the Saved Quote reverse-localization gap in `app/quote/[id]/page.tsx` are two surfaces of the same root cause: locale-active human-readable labels are intentionally serialized into the session plan and quote payload contracts, but there is no shared route-local normalization layer that can map known persisted EN and HI labels back into the active route locale at read time. Under Decision A, this remains a display-normalization problem, not a storage-contract problem. The approved ownership model is therefore read-side and route-local: `BOOKING_PLAN_STORAGE_KEY` data and `QuotePayload` remain as written, while public consumers normalize recognized stored labels into the active locale when rendering or pre-filling UI. The minimal safe source of truth for this follow-up is a shared bidirectional normalization helper centered in `lib/quote-localization.ts`, because the affected values already flow through that helper family and the current gap spans service labels, event names, durations, and add-ons across both Booking and Saved Quote. These issues belong in one Phase B follow-up slice rather than two separate slices because splitting them would duplicate or partially fork the same normalization ownership without materially reducing risk. The approved implementation scope is limited to `lib/quote-localization.ts`, `app/book/page.tsx`, and `app/quote/[id]/page.tsx`: Booking should normalize stored plan-derived labels into the active route locale before summary rendering, form prefill, WhatsApp copy construction, and quote-save payload creation; Saved Quote should continue to render saved values through the same helper once that helper supports bidirectional normalization. Do not change locale routing, middleware, `BOOKING_PLAN_STORAGE_KEY` shape, Pricing plan serialization, `QuotePayload` shape, quote encryption or access, admin APIs, or active-link semantics. Validation remains `npm run build`; `npm run lint` remains expected when available, but the current repository environment still lacks `eslint`.

### D-052: The shared Booking and Saved Quote locale-normalization follow-up is implemented and reviewer-approved
Reviewer-approved completion confirms `lib/quote-localization.ts` now supports bidirectional EN↔HI normalization for recognized persisted labels by deriving the reverse EN map from the approved HI translation table, and `app/book/page.tsx` now normalizes stored plan labels into the active route locale before summary rendering, form prefill, WhatsApp copy construction, and `saveQuote`. `app/quote/[id]/page.tsx` continues to render saved values through the shared quote-localization helper, so new and existing saved quotes now display recognized stored labels in the active route locale without changing persisted contracts. Decision A remains intact: `BOOKING_PLAN_STORAGE_KEY`, Pricing session-plan serialization, `QuotePayload`, and quote-access behavior remain unchanged. Production build validation passed at 68/68 routes. `npm run lint` remains unavailable because `package.json` still defines `eslint .` while the repository does not currently install `eslint`.

### D-053: Lint availability should be opened as a separate repo-validation follow-up; a separate reverse-map collision-guard task should not be promoted now
Restoring lint availability should be opened as a separate repository-validation follow-up because the repo's documented minimum validation still cannot fully run: `package.json` declares `npm run lint`, but `eslint` is not installed. This validation gap is broader than the completed locale-normalization slice and should be tracked independently rather than keeping the customer-facing Phase B follow-up open. A separate automated reverse-map collision-guard task should not be promoted now. The reviewer-approved localization implementation already derives the EN reverse map from the HI translation table, and any additional collision guard would be preventive hardening for future authoring changes rather than a current customer-facing defect. If `lib/quote-localization.ts` is revisited for future localization maintenance, a collision guard can be bundled into that later maintenance slice.

### D-033: Non-funnel privacy-policy and admin terminology drift was correctly tracked separately under ISSUE-CJ-009 and is now complete
Reviewer approval of ISSUE-CJ-001 confirmed that a small amount of non-funnel terminology drift remained in privacy-policy copy and admin source-label UI. Tracking that drift separately under ISSUE-CJ-009 proved correct because it did not block customer-facing funnel closure. Reviewer-approved completion of ISSUE-CJ-009 preserved legal meaning in English and Hindi, kept internal source enums and stored metadata such as `booking` unchanged, aligned admin source labeling through the shared `bookingSource` localization and `sourceDisplayLabel` helper, and passed production build validation at 68/68 routes.

---

## 12. Current Priorities

In priority order after Phase A follow-through completion:

| Priority | Area | Status |
|---|---|---|
| 1 | **Phase B - Performance Audit** | Complete. The shared public discovery shell slice, the estimate-to-request slice, the service-entry visible-label follow-up, and the Booking and Saved Quote locale-normalization follow-up are all implemented and reviewer-approved under the current Decision A contract boundaries. |
| 2 | **Phase C - SEO Audit** | Next active customer-facing program after Phase B completion. Metadata, structured data, internal linking, sitemap, canonicals, content quality, and service hierarchy remain the next program after performance work. |
| 3 | **Phase D - Scaling & Reliability Audit** | Queued after Phase C. Firestore scaling, quote scaling, rate limiting, monitoring, logging, and backups remain the later reliability program. |

### Immediate work items

1. **ISSUE-CJ-001 is complete**: Customer-facing funnel-copy cleanup is reviewer-approved and closed.
2. **ISSUE-CJ-004 is complete**: Pricing now acts as the estimate builder and Booking now acts as the availability-request form.
3. **ISSUE-CJ-002 is complete**: The pricing/package comprehension cleanup is reviewer-approved, including the final Hindi `eventExtrasHint` parity fix in `lib/i18n/messages/pages.hi.json`.
4. **ISSUE-CJ-007 is complete**: Ancillary rendered expectations are now free of package-tier references in both EN and HI, all 12 ancillary slugs remain in parity, build passed 68/68, and no pricing, booking, or locale-routing logic changed.
5. **ISSUE-CJ-005 is complete**: The trust-signal and claim-scoping cleanup is reviewer-approved; the remaining Hindi home short-form trust copy now uses `कार्यदिवसों के दौरान`, other reviewed EN and HI trust surfaces remain unchanged, and build passed 68/68 routes.
6. **ISSUE-CJ-006 is complete**: Gallery framing now uses `All Styles` and `सभी स्टाइल्स`, the service-detail alt template now uses style-reference wording in both locales, no additional gallery or service-detail framing drift was found, and build passed 68/68 routes.
7. **ISSUE-CJ-003 is complete**: Choice-reduction and mobile-scanning cleanup is reviewer-approved. Residual risk is narrower: the Services page still defaults to a 41-card `All Services` view while variant cards still use the role label in the price slot.
8. **ISSUE-CJ-008 is complete**: Quote recovery now consistently renders localized recovery copy with WhatsApp as the primary CTA and the pricing builder as the secondary CTA, and build passed 68/68 routes.
9. **ISSUE-CJ-009 is complete**: Privacy-policy terminology cleanup preserved legal meaning in EN and HI, admin source labeling now stays consistent through shared `bookingSource` localization and the `sourceDisplayLabel` helper, and build passed 68/68 routes.
10. **Phase B shared public discovery shell slice is complete**: Reviewer-approved completion confirms `middleware.ts` forwards `x-search-string` from `request.nextUrl.search`, `app/layout.tsx` threads it to `components/Navbar.tsx`, the SSR locale-switch fallback preserves token-bearing query params before hydration, `components/Footer.tsx` and `components/WhatsAppFloat.tsx` remain server components with `locale` from layout, `components/home/HomeServerSections.tsx` remains a prop-driven RSC from the async Home page, and production build validation passed 68/68 routes.
11. **Phase B estimate-to-request Findings 1 through 4 are complete**: Reviewer-approved completion confirms Booking now defers `BOOKING_PLAN_STORAGE_KEY` clearing until after validated plan consumption, Pricing blocks navigation on session-storage write failure, query-prefill parsing is isolated behind a nested Suspense bridge with server-derived initial search params, and the Pricing route shell is split from the calculator boundary.
12. **Latest validation outcome for that slice**: Production build validation passed 68/68 routes. `npm run lint` could not execute in the current repository environment because `eslint` is not installed.
13. **Service-entry visible-label follow-up is complete**: Reviewer-approved completion confirms `app/pricing/page.tsx` now resolves `resolvedServiceLabel` from `getLocalizedServiceName(serviceSlug, locale)`, `app/pricing/PricingEstimatorShell.tsx` receives only `resolvedServiceLabel`, `sourceLabel` remains attribution-only, `prefillKey` and `PricingHandoffContext.sourceLabel` remain unchanged, Decision A session-plan serialization remains intact, and service identifiers remain locale-independent.
14. **Decision A boundary remains intact**: `lib/pricing-presets.ts` still keeps locale-display-name serialization as the current pricing-to-booking handoff contract, with no canonical service ID serialization and no session-plan or quote-payload redesign introduced by the visible-label implementation.
15. **Booking and Saved Quote locale-normalization follow-up is complete**: Reviewer-approved completion confirms `lib/quote-localization.ts` now supports EN↔HI normalization for recognized persisted labels, `app/book/page.tsx` normalizes stored plan labels before summary rendering, form prefill, WhatsApp copy construction, and `saveQuote`, and `app/quote/[id]/page.tsx` continues to render through the shared helper.
16. **Decision A remains intact after that fix**: `BOOKING_PLAN_STORAGE_KEY`, Pricing session-plan serialization, `QuotePayload`, and quote-access behavior remain unchanged; this slice was read-side normalization only.
17. **Phase B is complete under the approved funnel scope**: No further approved public performance or locale-normalization implementation remains open in the pricing-to-booking-to-quote journey.
18. **Separate repo-validation follow-up should be opened for lint availability**: `package.json` still defines `npm run lint`, but `eslint` is not installed, so the repo still cannot satisfy its documented minimum validation expectation.
19. **No separate reverse-map collision-guard task is opened now**: the reviewer-approved reverse-map derivation in `lib/quote-localization.ts` is sufficient for the completed customer-facing fix, and a collision guard is preventive hardening rather than an active user-facing defect.

## 13. D-016 Phase 2B Execution Contract

**Status:** Implemented and approved.

**Implementation scope for this pass:**

1. Apply the approved slug-level classification model.
2. Remove package ladders from Variant Discovery Pages and Ancillary Standalone Service Pages.
3. Reassign CTA ownership so Parent Product Pages own the direct estimate journey and ancillary pages stay outside the primary coverage estimate flow.

**Out of scope for this pass:**

1. Redesigning Parent Product Page package sections.
2. Creating any new package catalog.
3. Changing canonical package ownership in `lib/constants.ts`.
4. Changing pricing -> booking -> encrypted quote contracts.
5. Redirecting, renaming, deleting, or merging service URLs.

### 13.1 Classification criteria

**Parent Product Page**

- Represents a top-level customer event/session need that Orvex can sell without translating the user into a narrower style, ritual, or deliverable.
- Maps directly to an existing canonical pricing family: a package family, an event template family, or a stable service-entry preset family already supported by pricing.
- Can honestly own a direct `Get Estimate` CTA into pricing without inventing a page-local commercial object.
- Acts as the commercial hub that related Variant Discovery Pages should route toward.

**Variant Discovery Page**

- Captures SEO intent for a narrower culture, ritual, capture style, sub-event, or descriptive use-case within an already-approved Parent Product Page family.
- Does not correspond to a separately owned commercial product in pricing, booking, quote persistence, or admin.
- May educate and qualify the customer, but it must hand pricing entry and primary conversion ownership to its approved parent family.
- Must not keep a standalone package ladder after Phase 2B.

**Ancillary Standalone Service Page**

- Represents a real secondary line of business or operationally distinct service that is not modeled as a first-class coverage product in the primary pricing builder.
- Cannot honestly enter the current pricing -> booking -> encrypted quote journey without misrepresenting what pricing is estimating.
- Preserves discovery value and URL continuity, but resolves through contact-led inquiry rather than the primary coverage estimate flow until a separate canonical model is approved.
- Must not keep a package ladder after Phase 2B.

### 13.2 Customer-journey ownership rules

1. Parent Product Pages own the commercial journey for their family: the strongest estimate CTA, the primary comparison frame, and the route into pricing.
2. Variant Discovery Pages own search capture and editorial differentiation only. They do not own the purchase-defining commercial promise.
3. Ancillary Standalone Service Pages own their own discovery surface, but their conversion path is contact-led, not pricing-led, until a separate canonical model exists.
4. No service page may bypass pricing to create bookings or quotes directly. Preserve D-006 and D-011.

### 13.3 Pricing-entry ownership rules

1. Only Parent Product Pages and already-approved global entry points may own a primary direct `Get Estimate` CTA into pricing.
2. Single-parent Variant Discovery Pages may expose a secondary estimate CTA only when it uses the approved parent-family handoff. They must not pass local package ladders or page-local package identities into pricing.
3. Multi-parent style or add-on variants must not choose one pricing family arbitrarily. They route customers to the relevant parent coverage page first.
4. Ancillary Standalone Service Pages must remove direct entry into the primary coverage pricing flow unless and until a separate canonical pricing model is approved.
5. Nothing in Phase 2B may alter pricing -> booking -> encrypted quote contracts or canonical package ownership.

### 13.4 Internal-link ownership rules

1. Every Variant Discovery Page must link prominently to its approved parent family. Multi-parent variants may link to a small approved set of relevant parents, not the full services grid.
2. Parent Product Pages may link down to related variants as discovery/supporting content, but the parent page remains the conversion owner.
3. Ancillary Standalone Service Pages may link to relevant coverage parents only as supporting context, never as proof that the ancillary service is priced in the same estimate flow.
4. Breadcrumbs remain URL-local and do not imply route changes or slug mergers.

### 13.5 SEO guardrails

1. Preserve all existing service URLs and their localized equivalents.
2. Preserve English and Hindi parity for classification-driven copy, CTA labels, and metadata behavior.
3. Parent Product Pages own the strongest commercial terms for their family such as `pricing`, `packages`, `estimate`, and `coverage`.
4. Variant Discovery Pages keep differentiated editorial intent keywords, but must stop advertising standalone price/package claims that imply separate commercial ownership.
5. Ancillary Standalone Service Pages remain indexable discovery pages unless a later SEO decision explicitly changes that.
6. Phase 2B must not introduce broad canonical consolidation, redirects, or slug deprecation.
7. Variant and ancillary pages must not emit metadata or structured data that implies independent package offers disconnected from canonical pricing ownership.

### 13.6 URL-preservation rules

1. Keep every existing `/services/[slug]` URL live. No renames, redirects, deletions, or route mergers in Phase 2B.
2. Parent relationships are logical information-architecture relationships only. They do not change route shape.
3. All CTA and internal-link changes must continue to use locale-aware routing helpers and preserve localization parity.
4. No changes to pricing, booking, quote, or admin URLs are part of Phase 2B.

### 13.7 Slug-level classification table

**Interpretation rule:** `package ladder` in the tables below refers to the Phase 2B execution action for that slug. `remain` is a temporary scope-control decision for this pass only. It does not grant page-local package ownership or create a new package catalog.

#### Wedding coverage family

| Slug | Classification | Model justification | Parent relationship | Pricing-entry behavior | CTA behavior | Package ladder |
|---|---|---|---|---|---|---|
| `wedding-photography` | Parent Product Page | Top-level wedding coverage need with a stable wedding pricing family already supported in pricing. | None | Direct parent-owned estimate entry to pricing using wedding-family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `candid-wedding-photography` | Variant Discovery Page | Capture style within wedding coverage, not a separately owned product. | `wedding-photography` | No standalone pricing identity; use wedding parent estimate handoff only. | Primary `View Wedding Coverage`; secondary parent-aligned estimate. | remove |
| `christian-wedding-photography` | Variant Discovery Page | Cultural wedding variant within the wedding family; pricing owns the template, not this page. | `wedding-photography` | Secondary estimate may use the Christian wedding template family under the wedding parent journey. | Primary `View Wedding Coverage`; secondary parent-aligned estimate. | remove |
| `muslim-wedding-photography` | Variant Discovery Page | Cultural wedding variant within the wedding family; pricing owns the template, not this page. | `wedding-photography` | Secondary estimate may use the Muslim wedding template family under the wedding parent journey. | Primary `View Wedding Coverage`; secondary parent-aligned estimate. | remove |
| `haldi-mehendi-photography` | Variant Discovery Page | Wedding sub-event, not a separate package catalog. | `wedding-photography` | No standalone pricing entry; use wedding-family estimate path. | Primary `View Wedding Coverage`; secondary parent-aligned estimate. | remove |
| `sangeet-photography` | Variant Discovery Page | Wedding sub-event, not a separate package catalog. | `wedding-photography` | No standalone pricing entry; use wedding-family estimate path. | Primary `View Wedding Coverage`; secondary parent-aligned estimate. | remove |
| `wedding-videography` | Variant Discovery Page | Coverage format inside the wedding family, not a separate event-first product. | `wedding-photography` | No standalone pricing identity; use wedding-family estimate path. | Primary `View Wedding Coverage`; secondary parent-aligned estimate. | remove |

#### Couple-session family

| Slug | Classification | Model justification | Parent relationship | Pricing-entry behavior | CTA behavior | Package ladder |
|---|---|---|---|---|---|---|
| `pre-wedding-photoshoot` | Parent Product Page | Top-level couple-session need with a supported pre-wedding pricing family. | None | Direct parent-owned estimate entry using the pre-wedding family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `post-wedding-photoshoot` | Variant Discovery Page | Same couple-session commercial family as pre-wedding, with different editorial intent. | `pre-wedding-photoshoot` | No standalone pricing identity; use pre-wedding family estimate path. | Primary `View Pre-Wedding Coverage`; secondary parent-aligned estimate. | remove |
| `engagement-photography` | Parent Product Page | Top-level milestone event already represented by the engagement pricing family. | None | Direct parent-owned estimate entry using the engagement family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `anniversary-photoshoot` | Variant Discovery Page | Couple-milestone variant, not a separate catalog from engagement/couple-session pricing. | `engagement-photography` | No standalone pricing identity; use engagement/couple-session estimate path. | Primary `View Engagement Coverage`; secondary parent-aligned estimate. | remove |

#### Celebration and ceremony family

| Slug | Classification | Model justification | Parent relationship | Pricing-entry behavior | CTA behavior | Package ladder |
|---|---|---|---|---|---|---|
| `birthday-photography` | Parent Product Page | High-intent celebration coverage need with a stable birthday/event pricing family. | None | Direct parent-owned estimate entry using birthday/event family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `baby-shower-photography` | Variant Discovery Page | Ceremony-specific discovery page inside the broader celebrations/event-coverage family. | `events-photography` | No standalone pricing identity; use general celebrations/event coverage estimate path. | Primary `View Event Coverage`; secondary parent-aligned estimate. | remove |
| `naming-ceremony-photography` | Variant Discovery Page | Ceremony-specific discovery page inside the broader celebrations/event-coverage family. | `events-photography` | No standalone pricing identity; use general celebrations/event coverage estimate path. | Primary `View Event Coverage`; secondary parent-aligned estimate. | remove |
| `cradle-ceremony-photography` | Variant Discovery Page | Ceremony-specific discovery page inside the broader celebrations/event-coverage family. | `events-photography` | No standalone pricing identity; use general celebrations/event coverage estimate path. | Primary `View Event Coverage`; secondary parent-aligned estimate. | remove |
| `housewarming-photography` | Parent Product Page | Distinct event family already represented by a dedicated housewarming setup in pricing. | None | Direct parent-owned estimate entry using housewarming-family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `upanayana-photography` | Variant Discovery Page | Ceremony-specific discovery page inside the broader celebrations/event-coverage family. | `events-photography` | No standalone pricing identity; use general celebrations/event coverage estimate path. | Primary `View Event Coverage`; secondary parent-aligned estimate. | remove |
| `shastipurthi-photography` | Variant Discovery Page | Ceremony-specific discovery page inside the broader celebrations/event-coverage family. | `events-photography` | No standalone pricing identity; use general celebrations/event coverage estimate path. | Primary `View Event Coverage`; secondary parent-aligned estimate. | remove |
| `puberty-ceremony-photography` | Variant Discovery Page | Ceremony-specific discovery page inside the broader celebrations/event-coverage family. | `events-photography` | No standalone pricing identity; use general celebrations/event coverage estimate path. | Primary `View Event Coverage`; secondary parent-aligned estimate. | remove |
| `holy-communion-photography` | Variant Discovery Page | Ceremony-specific discovery page inside the broader celebrations/event-coverage family. | `events-photography` | No standalone pricing identity; use general celebrations/event coverage estimate path. | Primary `View Event Coverage`; secondary parent-aligned estimate. | remove |
| `events-photography` | Parent Product Page | Catch-all event-coverage hub for ceremonies and social events that do not deserve separate commercial products. | None | Direct parent-owned estimate entry using the generic birthday/event family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |

#### Baby, maternity, and family-session family

| Slug | Classification | Model justification | Parent relationship | Pricing-entry behavior | CTA behavior | Package ladder |
|---|---|---|---|---|---|---|
| `baby-photoshoot` | Parent Product Page | Top-level baby-session need with an existing baby/maternity pricing family. | None | Direct parent-owned estimate entry using the baby-session family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `newborn-photography` | Variant Discovery Page | Narrow baby-session use-case, not a separately owned pricing product. | `baby-photoshoot` | No standalone pricing identity; use baby-session family estimate path. | Primary `View Baby Session Coverage`; secondary parent-aligned estimate. | remove |
| `maternity-photography` | Parent Product Page | Top-level maternity-session need with a stable baby/maternity pricing family. | None | Direct parent-owned estimate entry using the maternity-session family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `indoor-maternity-photoshoot` | Variant Discovery Page | Narrow maternity-session format, not a separate product family. | `maternity-photography` | No standalone pricing identity; use maternity-session family estimate path. | Primary `View Maternity Coverage`; secondary parent-aligned estimate. | remove |
| `family-photoshoot` | Ancillary Standalone Service Page | Standalone portrait/session line not represented as a first-class coverage product in pricing. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |

#### Video-style, add-on, and production discovery

| Slug | Classification | Model justification | Parent relationship | Pricing-entry behavior | CTA behavior | Package ladder |
|---|---|---|---|---|---|---|
| `cinematic-videography` | Variant Discovery Page | Cross-family coverage style, not a standalone event-first product. | Multi-parent: `wedding-photography`, `birthday-photography`, `events-photography` | Do not choose one pricing family arbitrarily; route to the relevant parent coverage page first. | Primary `View Related Coverage`; secondary `Talk on WhatsApp`. | remove |
| `candid-videography` | Variant Discovery Page | Cross-family coverage style, not a standalone event-first product. | Multi-parent: `wedding-photography`, `birthday-photography`, `events-photography` | Do not choose one pricing family arbitrarily; route to the relevant parent coverage page first. | Primary `View Related Coverage`; secondary `Talk on WhatsApp`. | remove |
| `drone-photography` | Variant Discovery Page | Add-on capability that belongs inside coverage planning, not as a standalone priced product. | Multi-parent add-on: `wedding-photography`, `birthday-photography`, `events-photography`, `corporate-photography` | No direct pricing entry; customer must enter through a parent coverage page first. | Primary `View Related Coverage`; secondary `Talk on WhatsApp`. | remove |
| `video-editing-services` | Ancillary Standalone Service Page | Post-production service line that does not map to the event-coverage estimate journey. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `corporate-video-production` | Ancillary Standalone Service Page | Production service line distinct from corporate event coverage. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |

#### Corporate events, portraits, and commerce services

| Slug | Classification | Model justification | Parent relationship | Pricing-entry behavior | CTA behavior | Package ladder |
|---|---|---|---|---|---|---|
| `corporate-photography` | Parent Product Page | Top-level corporate event-coverage need with an approved corporate-event pricing family. | None | Direct parent-owned estimate entry using corporate-event family handoff. | Primary `Get Estimate`; secondary `Talk on WhatsApp`. | remain |
| `portrait-photography` | Ancillary Standalone Service Page | Standalone portrait/headshot line, not a first-class event-coverage product in pricing. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `portfolio-photography` | Ancillary Standalone Service Page | Standalone portfolio service line, not a first-class event-coverage product in pricing. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `fashion-photography` | Ancillary Standalone Service Page | Editorial/commercial shoot line outside the primary event-coverage model. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `product-ecommerce-photography` | Ancillary Standalone Service Page | Commerce photography line outside the primary event-coverage model. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `digital-photo-studio` | Ancillary Standalone Service Page | Walk-in studio line outside the primary event-coverage model. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |

#### Albums, prints, and post-delivery products

| Slug | Classification | Model justification | Parent relationship | Pricing-entry behavior | CTA behavior | Package ladder |
|---|---|---|---|---|---|---|
| `album-design-printing` | Ancillary Standalone Service Page | Post-delivery print product line, not a primary coverage estimate product. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `photo-frames` | Ancillary Standalone Service Page | Post-delivery print/display product line, not a primary coverage estimate product. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `photo-restoration` | Ancillary Standalone Service Page | Restoration service line, not a primary coverage estimate product. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |
| `personalized-gifts-printing` | Ancillary Standalone Service Page | Merchandise/gift line, not a primary coverage estimate product. | None | No direct entry into primary coverage pricing. | Primary contact-led inquiry (`Talk on WhatsApp` / contact); no direct estimate CTA. | remove |

---

## 14. D-016 Phase 3 Execution Contract

**Status:** Implemented and complete (2026-05-31).

**Interpretation:** The primary D-016 Phase 3 / ISSUE-012 implementation slice is complete. Section 14.4 follow-through items (navigation emphasis and discovery/editorial metadata/schema alignment) are also closed.

### 14.1 Approved customer-facing IA

1. **Home** presents major coverage families and the direct path to estimate. It must stop teaching Orvex as a flat catalog of separately priced services.
2. **Services** presents grouped discovery, with Parent Coverage Families first, Variant Discovery Pages as supporting discovery, and Ancillary Standalone Services in a separate contact-led lane.
3. **Parent Product Pages** act as coverage-family hubs. They explain who the family is for, what coverage formats exist, what typical starting points look like, and how to move into pricing.
4. **Variant Discovery Pages** remain editorial and SEO entry points only. They continue routing commercial ownership to their approved parent families.
5. **Ancillary Standalone Service Pages** remain contact-led and outside the primary estimate flow unless a separate canonical model is later approved.

### 14.2 Package and coverage presentation rules

1. Parent Product Pages must not continue showing package sections in their current page-local form.
2. Parent Product Pages must not introduce a new package catalog derived from local arrays.
3. Named package presentation remains owned by pricing only.
4. Parent Product Pages may present **coverage examples** only when each example is backed by an exact pricing handoff and exact current computed total.
5. Coverage examples may be backed by canonical packages or approved estimate presets, but they must be presented as examples or starting points, not as page-owned packages.
6. Listing-level numeric starting-price anchors should be removed or relabeled anywhere no honest canonical single-anchor estimate exists.
7. Wedding Photography + Videography is represented as a coverage format within the Wedding Coverage family. The existing `wedding-videography` slug remains a Variant Discovery Page.

### 14.3 Implementation scope for this pass

1. Reframe Home from priced service discovery into coverage-family discovery.
2. Reframe Services from a flat service directory into grouped commercial discovery.
3. Convert Parent Product Pages from local package sellers into coverage-family hubs.
4. Remove current parent-page local package ladders from the customer-facing UI.
5. Replace removed parent-page package ladders with pricing-backed coverage examples.
6. Remove or relabel misleading listing-level numeric price anchors on Home and Services.
7. Preserve the approved Phase 2B and 2C classification, CTA routing, and ancillary separation rules.
8. Preserve all existing locale-aware URLs and route shapes.

### 14.4 Explicit remaining Phase 3 scope

1. Shared navigation emphasis still belongs to Phase 3 until implementation review confirms Home, Services, and related entry points consistently teach the approved coverage-family model.
2. Broader discovery/editorial metadata and schema alignment still belongs to Phase 3 until implementation review confirms there are no remaining service-first claims, price anchors, or package signals that contradict the approved customer-facing model.
3. These remaining items are Phase 3 follow-through work, not a new architectural phase.

### 14.5 Out of scope for this pass

1. Changing canonical package ownership in `lib/constants.ts`.
2. Changing preset ownership in `lib/pricing-presets.ts`.
3. Changing pricing, booking, quote, admin, Firestore, token, or share-link architecture.
4. Creating a new package hierarchy, booking step, or customer decision branch.
5. Redirecting, renaming, merging, or deleting service URLs.

### 14.6 Validation expectations

1. Run `npm run lint`.
2. Run `npm run build`.
3. Summarize changed files, validation results, and residual risks to package architecture, pricing consistency, booking flow, quote flow, admin visibility, localization, SEO, and customer understanding.

---

## 15. ISSUE-008 Phase 2A Closeout

**Status:** Implemented and complete (2026-05-31). ISSUE-008 later resolved through Phase 2B.

**Interpretation:** Phase 1 established canonical `CoverageProfile` ownership in `lib/pricing-presets.ts` with supporting English/Hindi i18n and quote-localization coverage. Phase 2A completed the estimate-entry adoption slice. The remaining ISSUE-008 work is no longer estimate-entry definition; it is downstream booking and saved quote continuity.

### 15.1 Completed scope for this pass

1. `app/pricing/page.tsx` now applies canonical `CoverageProfile` semantics where estimate-entry UI explains mixed photo/video coverage.
2. Parent Product Page coverage examples in `app/services/[slug]/page.tsx` now use canonical `CoverageProfile` semantics where applicable.
3. Any minimal shared helper or localization wiring needed for estimate-entry continuity is complete without changing package totals, locale routing, or pricing -> booking handoff structure.

### 15.2 Gap handed off to Phase 2B at the time of closeout

1. `app/book/page.tsx` still needed derived `CoverageProfile` continuity so booking summaries would repeat the same commercial-definition language customers saw at estimate entry.
2. `app/quote/[id]/page.tsx` still needed the same derived `CoverageProfile` continuity so saved quotes would match pricing and booking terminology.
3. That downstream continuity pass was later completed and approved in Phase 2B, resolving ISSUE-008.

### 15.3 Boundary preserved by Phase 2A

1. Phase 2A did not change named package ownership, session storage schema, `QuotePayload` shape, Firestore shape, locale routing, or quote security.
2. Those contracts remained fixed through Phase 2B as well.

## 16. ISSUE-008 Phase 2B Closeout

**Status:** Implemented and approved (2026-05-31). ISSUE-008 is resolved.

**Interpretation:** Phase 2B completed the booking and quote continuity pass. Downstream surfaces now repeat the same `CoverageProfile` meaning already established at estimate entry, using derived presentation only.

### 16.1 Completed scope for this pass

1. `app/book/page.tsx` now derives and displays `CoverageProfile` continuity language in booking summary surfaces using existing plan selection names.
2. `app/quote/[id]/page.tsx` now derives and displays the same `CoverageProfile` continuity language in saved quote display using existing decrypted quote selection names.
3. The reviewer-approved locale fix aligned the Hindi service-name mapping in `lib/pricing-presets.ts` with the builder `serviceCatalog` names in `lib/i18n/messages/pages.hi.json`, so derived continuity works in both EN and HI.
4. Existing `PlanData`, decrypted `QuotePayload`, and current localization helpers were sufficient to close continuity without schema changes.

### 16.2 Approved locale-fix result

1. The Hindi mappings in `lib/pricing-presets.ts` now match the `pricingPage.builder.serviceCatalog` Hindi names in `lib/i18n/messages/pages.hi.json` for Traditional Photography, Candid Photography, Traditional Videography, and Cinematic Videography.
2. That alignment fixes locale-sensitive derivation of `CoverageProfile` from localized service names in booking handoff and saved quote display.
3. Reviewer approval confirms that booking and saved quote continuity now work for both EN and HI.

### 16.3 Boundary preserved by Phase 2B

1. Phase 2B did not change `PlanData`, `QuotePayload`, Firestore documents, admin auth, token security, locale routing, or URLs.
2. Phase 2B did not create new package names, new package hierarchies, new route shapes, or new customer decision points.
3. ISSUE-010 editorial and generic-content rewrite remained out of scope.

### 16.4 Closure decision and non-blocking follow-through

1. ISSUE-008 can close. The approved commercial-definition model now stays consistent across estimate entry, booking, and saved quotes for both EN and HI.
2. No remaining blocking work stays under ISSUE-008.
3. Future label changes in the builder service catalog must continue to update the localized service-name mapping used for derived continuity. That is an ongoing maintenance contract under D-023, not a separate open issue.

### 16.5 Next project-memory consequence

1. No further Worker-ready prompt remains under ISSUE-008.
2. At the time of ISSUE-008 closeout, the next Worker implementation priority was ISSUE-010.

## 17. ISSUE-010 Phase 1 Closeout

**Status:** Implemented and approved (2026-05-31). ISSUE-010 later resolved in Phase 3.

**Interpretation:** Phase 1 completed the remaining Parent Product Page editorial source-of-truth pass. The six previously generic parent pages now use explicit English and Hindi editorial content and local representative imagery, while commercial ownership remained where it already belonged.

### 17.1 Completed scope for this pass

1. The six previously generic Parent Product Pages in `app/services/data.ts` now use explicit English detail entries: `engagement-photography`, `birthday-photography`, `housewarming-photography`, `events-photography`, `maternity-photography`, and `corporate-photography`.
2. The same six slugs now use explicit Hindi editorial content in the service-specific Hindi structures in `app/services/data.ts` instead of category-level Hindi fallback generators.
3. The same six slugs now reference local representative hero and gallery imagery through `app/services/data.ts` instead of falling through raw remote fallback imagery.
4. Listing-card imagery and parent detail imagery for those six slugs now align through the same source file.

### 17.2 Boundary preserved by Phase 1

1. Phase 1 did not change pricing ownership in `lib/constants.ts`.
2. Phase 1 did not change `CoverageProfile` ownership in `lib/pricing-presets.ts`.
3. Phase 1 did not change booking flow, quote flow, Firestore shape, admin auth, locale routing, or URLs.
4. Parent Product Pages remain coverage-family hubs, not page-local package sellers.

### 17.3 Gap handed off at the time of Phase 1 closeout

1. The 20 classified Variant Discovery Pages later completed editorial cleanup in Phase 2.
2. The 12 classified Ancillary Standalone Service Pages later completed Phase 3 and closed ISSUE-010.
3. Dormant generic compatibility scaffolding remained a separate follow-through decision after the ancillary cleanup completed.

## 18. ISSUE-010 Phase 2 Closeout

**Status:** Implemented and approved (2026-05-31). ISSUE-010 later resolved in Phase 3.

**Interpretation:** Phase 2 completed the Variant Discovery Page editorial cleanup pass. All classified variant pages now resolve through explicit editorial records rather than generic template fallback, while parent routing and commercial ownership stayed unchanged.

### 18.1 Completed scope for this pass

1. All 20 classified Variant Discovery Pages defined in `SERVICE_CLASSIFICATIONS` now have explicit English detail content in `serviceDetails` within `app/services/data.ts`.
2. The same 20 classified variant slugs now have explicit Hindi editorial content in `MANUAL_SERVICE_TRANSLATIONS_HI` within `app/services/data.ts`.
3. The same 20 classified variant slugs now use local hero and gallery assets through `app/services/data.ts` instead of raw remote fallback imagery.
4. Single-parent and multi-parent variant routing behavior remained unchanged because `SERVICE_CLASSIFICATIONS` and the current service-detail CTA behavior were preserved.

### 18.2 Boundary preserved by Phase 2

1. Phase 2 did not change package ownership in `lib/constants.ts`.
2. Phase 2 did not change `CoverageProfile` ownership in `lib/pricing-presets.ts`.
3. Phase 2 did not change pricing ownership, booking flow, quote flow, locale routing, URLs, Firestore shape, admin auth, or token security.
4. Phase 2 did not change service classification architecture, parent relationships, or the approved contact-led separation for ancillary pages.

### 18.3 Gap handed off to Phase 3 at the time of Phase 2 closeout

1. Phase 3 later curated the 12 classified Ancillary Standalone Service Pages in `SERVICE_CLASSIFICATIONS`: `family-photoshoot`, `video-editing-services`, `corporate-video-production`, `portrait-photography`, `portfolio-photography`, `fashion-photography`, `product-ecommerce-photography`, `digital-photo-studio`, `album-design-printing`, `photo-frames`, `photo-restoration`, and `personalized-gifts-printing`.
2. Those slugs later gained explicit English detail content, explicit Hindi editorial content, and local representative hero/gallery imagery in `app/services/data.ts`.
3. Dormant generic compatibility scaffolding remained a separate follow-through decision rather than further Phase 2 scope.

### 18.4 Historical consequence of Phase 2 closeout

1. At the time of Phase 2 closeout, Phase 3 was the only remaining approved implementation target under ISSUE-010.
2. That target is now complete and reviewer-approved.

## 19. ISSUE-010 Phase 3 Closeout

**Status:** Implemented and approved (2026-05-31). ISSUE-010 is resolved.

**Interpretation:** Phase 3 completed the Ancillary Standalone Service Page editorial and imagery cleanup pass. The remaining ancillary service pages now match the approved contact-led commercial model without reopening pricing, booking, quote, or classification ownership.

### 19.1 Completed scope for this pass

1. All 12 classified ancillary slugs in `SERVICE_CLASSIFICATIONS` now use explicit English detail content in `serviceDetails` within `app/services/data.ts`.
2. The same 12 ancillary slugs now use explicit Hindi editorial content in `MANUAL_SERVICE_TRANSLATIONS_HI` within `app/services/data.ts`.
3. The same 12 ancillary slugs now use local representative hero and gallery imagery through `app/services/data.ts` instead of generic detail-page fallback assets.
4. Metadata-driving detail descriptions and hero images for those ancillary slugs no longer depend on the generic template path.
5. Ancillary pages continue to use the approved contact-led CTA behavior and remain separated from the pricing -> booking -> encrypted quote journey.

### 19.2 Boundary preserved by Phase 3

1. Phase 3 did not change package ownership in `lib/constants.ts`.
2. Phase 3 did not change `CoverageProfile` ownership in `lib/pricing-presets.ts`.
3. Phase 3 did not change pricing ownership, booking flow, quote flow, admin behavior, Firestore shape, security, locale routing, or URLs.
4. Phase 3 did not change service classification architecture or reclassify ancillary pages into parent or variant roles.

### 19.3 Closure decision and follow-through

1. ISSUE-010 is fully resolved.
2. Dormant ancillary package-array compatibility data should be tracked separately as the non-blocking maintainability cleanup item recorded in D-028.
3. No further Worker-ready prompt remains under ISSUE-010.

## 20. Post-Commercial Model Phase A - Customer Journey & UX Audit

**Status:** Completed (2026-06-01). Discovery and implementation follow-through complete.

**Interpretation:** With D-016 and ISSUE-006 through ISSUE-013 complete, Phase A audited the public customer journey as a first-time customer would experience it. Reviewer-approved completion of ISSUE-CJ-001 closed the cross-surface funnel-copy cleanup, reviewer-approved completion of ISSUE-CJ-004 closed the Pricing-vs-Booking terminology cleanup, reviewer-approved completion of ISSUE-CJ-002 closed the pricing/package teaching cleanup, reviewer-approved completion of ISSUE-CJ-007 closed the standalone ancillary expectation cleanup, reviewer-approved completion of ISSUE-CJ-005 closed the trust-signal and claim-scoping cleanup, reviewer-approved completion of ISSUE-CJ-006 closed the imagery and portfolio-framing cleanup, reviewer-approved completion of ISSUE-CJ-003 closed the discovery simplification cleanup, reviewer-approved completion of ISSUE-CJ-008 closed the contact and saved-estimate recovery-state cleanup, and reviewer-approved completion of ISSUE-CJ-009 closed the non-funnel terminology-consistency cleanup. Phase A customer-journey follow-through is now complete, and the next active program is Phase B Performance Audit.

### 20.1 Audit scope

1. Home
2. Services
3. Service Detail Pages
4. Pricing
5. Booking
6. Quote View
7. Contact

### 20.2 Audit focus

1. Customer understanding
2. Conversion friction
3. CTA clarity
4. Mobile UX
5. Trust signals
6. Information architecture

### 20.3 Findings catalog

#### ISSUE-CJ-001: Customers could not reliably understand the funnel or the next action (Resolved)

- **Status:** Implemented and reviewer-approved (2026-05-31). Customer-facing funnel-copy cleanup across Home, Services, Service Detail Pages, Pricing, Booking, Contact, and Quote is complete.
- **Severity:** High
- **Business impact:** High conversion loss risk at the point where browsing should become an estimate or availability request. More manual clarification load through WhatsApp and phone.
- **Ownership:** Public customer-journey copy and CTA labels across `app/page.tsx`, `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/pricing/page.tsx`, `app/book/page.tsx`, `app/contact/page.tsx`, `app/quote/[id]/page.tsx`, and shared labels/messages in `lib/i18n/messages/pages.en.json` and `lib/i18n/messages/pages.hi.json`.
- **Dependencies:** The approved implementation preserved D-016, D-020, Section 13.2-13.4 customer-journey rules, pricing -> booking -> encrypted quote contracts, locale parity, and saved-estimate semantics. Remaining out-of-scope privacy/admin terminology drift is tracked separately under ISSUE-CJ-009.
- **Recommended phase:** Phase A1 - Complete

#### ISSUE-CJ-002: Customers could not easily distinguish packages, services, events, and add-ons (Resolved)

- **Status:** Implemented and reviewer-approved (2026-05-31). The explanatory pricing/package cleanup is complete, including the final Hindi parity fix for `pricingPage.builder.eventExtrasHint` in `lib/i18n/messages/pages.hi.json`.
- **Severity:** High
- **Business impact:** High pricing confusion and slower decision-making. Customers can see prices, but they still need to translate between service cards, coverage pages, and the pricing builder.
- **Ownership:** Pricing explanation copy and estimate-builder teaching surfaces in `app/pricing/page.tsx`, supporting summary language in Home and Service Detail Pages, and shared page messages in `lib/i18n/messages/pages.*.json`.
- **Dependencies:** The approved implementation preserved ISSUE-CJ-001 funnel vocabulary, D-020, D-021, D-022, pricing ownership in `lib/constants.ts`, and D-028 non-authoritative ancillary package-array debt. Final closure required English-Hindi parity on the pricing builder explanatory copy.
- **Recommended phase:** Phase A2 - Complete

#### ISSUE-CJ-003: Services browsing created choice overload, especially on mobile (Resolved)

- **Status:** Implemented and reviewer-approved (2026-06-01). Choice-reduction and mobile-scanning cleanup is complete across the reviewed discovery surfaces.
- **Severity:** Medium / High
- **Business impact:** High browse-to-drop-off risk. Customers face too many similar entry points before they know which path is primary.
- **Ownership:** Discovery IA on Home and Services, category/grouping copy, filter behavior, service-card labeling, and mobile-scanning surfaces across `app/page.tsx`, `app/services/page.tsx`, and shared home/services content.
- **Dependencies:** The approved implementation preserved D-020 coverage-family model, service URL continuity, and the approved parent / variant / ancillary role model. Final closure did not require reopening pricing, booking, locale routing, or service classification ownership.
- **Residual risk:** The Services page still defaults to a 41-card `All Services` view while variant cards still use the role label in the price slot.
- **Recommended phase:** Phase A4 - Complete

#### ISSUE-CJ-004: The booking step was not clearly distinct from pricing or estimate review (Resolved)

- **Status:** Implemented and reviewer-approved (2026-05-31). Pricing is now positioned as the estimate builder and Booking is now positioned as the availability-request form.
- **Severity:** High
- **Business impact:** High funnel leakage risk. Customers may not understand when they are still estimating versus when they are actually sending a request for availability.
- **Ownership:** Step labels, request framing, and CTA copy on `app/pricing/page.tsx`, `app/book/page.tsx`, and related shared page messages.
- **Dependencies:** The approved implementation preserved ISSUE-CJ-001 funnel vocabulary, pricing -> booking -> encrypted quote contracts, D-021 / D-022 continuity rules, and quote-security / saved-estimate semantics.
- **Recommended phase:** Phase A1 - Complete

#### ISSUE-CJ-005: Trust signals and commercial claims needed stronger proof or clearer scoping (Resolved)

- **Status:** Implemented and reviewer-approved (2026-06-01). The final Pass 2 follow-up updated the remaining Hindi home trust-signal short-form copy in `lib/i18n/messages/home.hi.json` to use `कार्यदिवसों के दौरान`; other reviewed EN and HI trust surfaces remained unchanged, and production build validation passed 68/68 routes.
- **Severity:** High
- **Business impact:** High trust risk for premium and higher-budget customers. Claims about response time, delivery time, ratings, copyright, and comparisons can create skepticism or over-expectation if not scoped.
- **Ownership:** Customer-facing trust and proof copy across Home, Pricing, Contact, and Service Detail Pages, plus any claim-supporting proof surfaces linked from those pages.
- **Dependencies:** The approved implementation preserved true operating reality, did not overstate guarantees, and kept the remaining imagery/proof framing work for ISSUE-CJ-006 separate. Final closure required the remaining Hindi home weekday trust phrasing to align with the approved short-form copy while leaving the other reviewed EN and HI trust surfaces unchanged.
- **Recommended phase:** Phase A3 - Complete

#### ISSUE-CJ-006: Representative imagery and portfolio framing created premium-trust and expectation risk (Resolved)

- **Status:** Implemented and reviewer-approved (2026-06-01). Gallery framing now uses `All Styles` in `lib/i18n/messages/pages.en.json` and `सभी स्टाइल्स` in `lib/i18n/messages/pages.hi.json`, the service-detail alt template now uses style-reference wording in both locales, no additional gallery or service-detail framing drift was found, and production build validation passed 68/68 routes.
- **Severity:** High
- **Business impact:** High confidence loss on visual-first pages and higher disappointment risk if customers assume representative imagery is direct proof of recent client work.
- **Ownership:** Service Detail Page imagery framing, gallery/proof messaging, and representative-image disclosures across `app/services/[slug]/page.tsx`, `app/services/data.ts`, and supporting gallery/home proof surfaces.
- **Dependencies:** The approved implementation preserved D-026 honest representative-imagery framing, the approved ISSUE-CJ-005 trust-claim scoping, and the existing service classification and commercial ownership model. Final closure required aligned gallery framing labels in EN and HI, style-reference alt wording in both locales, and confirmation that no additional gallery or service-detail framing drift remained.
- **Recommended phase:** Phase A3 - Complete

#### ISSUE-CJ-007: Standalone-service pages implied package expectations that the consultation flow did not clearly fulfill (Resolved)

- **Status:** Implemented and reviewer-approved (2026-06-01). Ancillary rendered `includes`, `process`, and `faqs` content is now free of package-tier references in both English and Hindi, all 12 ancillary slugs remain in parity, build passed 68/68 routes, and no pricing, booking, or locale-routing logic changed.
- **Severity:** Medium / High
- **Business impact:** High expectation-mismatch risk on ancillary inquiry pages. Customers may infer a package-selection experience where the real path is contact-led consultation.
- **Ownership:** Ancillary standalone service-page copy, expectations, deliverable framing, and contact handoff messaging in `app/services/data.ts`, `app/services/[slug]/page.tsx`, and related shared service-detail UI copy.
- **Dependencies:** The approved implementation preserved D-013, Section 13.2-13.3 contact-led ancillary rules, D-028 compatibility-debt boundaries, and the existing pricing, booking, and locale-routing contracts. Final closure required English-Hindi ancillary rendered-content parity across all 12 ancillary slugs.
- **Recommended phase:** Phase A2 - Complete

#### ISSUE-CJ-008: Contact and saved-estimate recovery states did not teach one dominant next step (Resolved)

- **Status:** Implemented and reviewer-approved (2026-06-01). Quote recovery now consistently renders localized recovery copy with WhatsApp as the primary CTA and the pricing builder as the secondary CTA, and production build validation passed 68/68 routes.
- **Severity:** Medium
- **Business impact:** Medium / High recovery loss risk. Customers can recover, but the states are not decisive enough to keep momentum after friction or an invalid quote link.
- **Ownership:** Contact-page channel prioritization, post-submit handoff states, and quote-not-found recovery copy across `app/contact/page.tsx`, `app/quote/[id]/page.tsx`, and shared page messages in `lib/i18n/messages/pages.*.json`.
- **Dependencies:** The approved implementation preserved ISSUE-CJ-001 funnel vocabulary, current contact-form behavior, WhatsApp follow-through, saved-estimate semantics, and quote-security behavior. Final closure required localized quote recovery copy with WhatsApp promoted to the primary CTA and the pricing builder demoted to the secondary CTA.
- **Recommended phase:** Phase A1 - Complete

#### ISSUE-CJ-009: Remaining non-funnel request/booking terminology drift persisted in privacy-policy and admin UI (Resolved)

- **Status:** Implemented and reviewer-approved (2026-06-01). Privacy-policy terminology cleanup preserved legal meaning in English and Hindi, admin source labeling now stays consistent through the shared `bookingSource` localization and `sourceDisplayLabel` helper, and production build validation passed 68/68 routes.
- **Severity:** Low
- **Business impact:** Low / Medium consistency risk. Public privacy-policy copy and internal admin source-label UI still use older booking-form terminology even after the customer-facing funnel copy was normalized.
- **Ownership:** Legal/privacy copy and related shared messages in `lib/i18n/messages/pages.en.json` and `lib/i18n/messages/pages.hi.json`, plus internal admin source-label UI in `app/admin/page.tsx`.
- **Dependencies:** The approved implementation preserved legal meaning, internal source enums, admin filtering semantics, and stored source values such as `booking`. Final closure required EN and HI privacy-policy parity plus admin source-label consistency through the shared `bookingSource` localization and `sourceDisplayLabel` helper.
- **Recommended phase:** Low-priority follow-up - Complete

### 20.4 Overlap with existing architecture decisions

1. **ISSUE-CJ-001, ISSUE-CJ-004, and ISSUE-CJ-008 overlap existing CTA and funnel architecture.** ISSUE-CJ-001, ISSUE-CJ-004, and ISSUE-CJ-008 are now complete. They sat directly on top of D-016, D-020, Section 13.2-13.4 customer-journey rules, and the approved pricing -> booking -> encrypted quote contract. No new workflow was required.
2. **ISSUE-CJ-002 and ISSUE-CJ-007 overlap existing commercial-model boundaries.** ISSUE-CJ-002 and ISSUE-CJ-007 are now complete. Both issues sat on top of D-020, D-021, D-022, D-028, and the resolved ISSUE-011 / ISSUE-012 / ISSUE-013 boundaries. They required clearer customer teaching, not new package ownership or ancillary repricing.
3. **ISSUE-CJ-006 overlaps D-026.** ISSUE-CJ-006 is now complete. Any future imagery or proof follow-through must keep the existing honest framing around representative imagery and must not reintroduce misleading proof language.
4. **ISSUE-CJ-003, ISSUE-CJ-005, ISSUE-CJ-006, and ISSUE-CJ-009 do not require architecture reopening.** Those issues are now complete. ISSUE-CJ-009 remained inside the already-approved model and preserved legal meaning, internal source enums, and stored source values.
5. **Conclusion on remaining customer-journey work:** No unresolved Phase A follow-through issue remains.
6. **Conclusion:** No Phase A finding requires reopening resolved commercial-model discovery, quote-security architecture, locale-routing architecture, or service-classification architecture.

### 20.5 Implementation phases

1. **Phase A1 - Funnel Clarity and CTA Ownership:** ISSUE-CJ-001, ISSUE-CJ-004, and ISSUE-CJ-008 are complete.
2. **Phase A2 - Pricing and Package Comprehension:** ISSUE-CJ-002 and ISSUE-CJ-007 are complete.
3. **Phase A3 - Trust, Proof, and Expectation Calibration:** ISSUE-CJ-005 and ISSUE-CJ-006 are complete.
4. **Phase A4 - Choice Reduction and Mobile Simplification:** ISSUE-CJ-003 is complete.
5. **Phase B - Performance Audit:** Complete. The shared public discovery shell slice, estimate-to-request slice, service-entry visible-label follow-up, and Booking and Saved Quote locale-normalization follow-up are reviewer-approved complete.
6. **Next active program:** Phase C - SEO Audit. Separate lint-availability restoration should be tracked as repo-validation follow-up work and does not keep Phase B open.

### 20.6 Next Worker-ready prompt

> No Worker-ready prompt remains for the reviewer-approved Booking and Saved Quote locale-normalization implementation. Reviewer-approved completion confirms `lib/quote-localization.ts` now supports EN↔HI normalization for recognized persisted labels, `app/book/page.tsx` normalizes stored plan labels before summary rendering, form prefill, WhatsApp copy construction, and `saveQuote`, and `app/quote/[id]/page.tsx` continues to render through the shared helper while Decision A contract boundaries remain unchanged.
>
> Validation record: production build passed at 68/68 routes. `npm run lint` remains unavailable because `package.json` defines `eslint .` but the repository does not currently install `eslint`.
>
> Next action: Architect should open a separate repo-validation follow-up for restoring lint availability. No separate reverse-map collision-guard task is promoted at this time because the current reverse-map derivation is reviewer-approved and any collision guard would be preventive hardening rather than a current customer-facing defect.

---

## Appendix A: Firestore Document Shape

### `quotes/{quoteId}`

| Field | Type | Description |
|---|---|---|
| `createdAt` | Timestamp | Quote creation time |
| `accessTokenHash` | string | SHA-256 hash of the access token |
| `encryptedPayload` | string | AES-256-GCM encrypted `QuotePayload` JSON |
| `activeAccessTokenCiphertext` | string | Scoped AES-256-GCM encryption of the active token (for admin recovery) |
| `activeLinkLocale` | string | Locale used when the active share link was generated |
| `activeAccessTokenUpdatedAt` | Timestamp | When the active link was last regenerated |
| `status` | string | Pipeline status (from `QUOTE_PIPELINE_STATUSES`) |
| `firstViewedAt` | Timestamp | First time the quote was viewed by the customer |
| `lastViewedAt` | Timestamp | Last view time (updated with cooldown) |
| `viewCount` | number | Number of views (updated with cooldown) |
| `amountReceived` | number | Payment tracking (operational metadata, not in payload) |
| `reminderDate` | string | `YYYY-MM-DD` reminder date |
| `reminderStatus` | string | `pending` or `completed` |

### `quotes/{quoteId}/notes/{noteId}`

| Field | Type | Description |
|---|---|---|
| `body` | string | Note text |
| `createdAt` | Timestamp | |
| `updatedAt` | Timestamp | |

---

## Appendix B: Booking Plan → Quote Payload Field Mapping

| `PlanData` field (session storage) | `QuotePayload` field (Firestore) | Notes |
|---|---|---|
| `services[].name` | `events[].name` | Event name (e.g., "Your Event") |
| `services[].coverage` | `events[].duration` | "Half Day" or "Full Day" |
| `services[].price` | `events[].price` | Per-event total |
| `services[].selections[]` | `events[].selections[]` | Individual service/add-on line items |
| `addOns[]` | `globalAddOns[]` | Album and cross-event add-ons |
| `total` | `total` | Grand total |
| `date` | `date` | Event date |
| `city` | `city` | |
| `venue` | `venue` | |
| `customer.name` | `customerName` | Pre-filled from builder if entered |
| `customer.phone` | `customerPhone` | |
| `customer.email` | `customerEmail` | |
| `packageName` | `packageName` | Present only for unmodified package bookings; persisted inside encrypted `QuotePayload` |
| `timeSlot` | `timeSlot` | |

The booking form also collects fields not in the session plan: `form.service` (service names joined), `form.budget` (formatted total), `form.message` (notes), `form.source` (foundVia).

## Future Audit Queue

Commercial-model program complete (2026-05-31). Phase A audit and customer-journey implementation follow-through are complete (2026-06-01). Phase B remains the active program; the first approved shared public discovery route shell slice on Home and Services is implemented and reviewer-approved (2026-06-01), the estimate-to-request implementation pass including the service-entry visible-label follow-up is implemented and reviewer-approved, and two residual locale-normalization issues are now documented outside that completed slice.

### Phase A — Customer Journey & UX Audit (Complete)
Review:
- Home
- Services
- Service Detail Pages
- Pricing
- Booking
- Quote View
- Contact

Focus:
- Customer understanding
- Conversion friction
- CTA clarity
- Mobile UX
- Trust signals
- Information architecture

### Phase B — Performance Audit
First approved slice:
- Shared public discovery route shell on Home and Services

Status:
- Implemented and reviewer-approved (2026-06-01). `middleware.ts` forwards `x-search-string` from `request.nextUrl.search`, `app/layout.tsx` threads it to `components/Navbar.tsx`, the SSR locale-switch fallback preserves token-bearing query params before hydration, `components/Footer.tsx` and `components/WhatsAppFloat.tsx` remain server components with locale from layout, `components/home/HomeServerSections.tsx` remains prop-driven from async `app/page.tsx`, and production build validation passed 68/68 routes.

Next approved slice:
- Pricing and Booking estimate-to-request funnel shell

Status:
- Findings 1 through 4 implemented and reviewer-approved (2026-06-01). Booking now defers `BOOKING_PLAN_STORAGE_KEY` clearing until after validated plan consumption, Pricing blocks navigation on session-storage write failure, query-prefill parsing is isolated behind a nested Suspense bridge with server-derived initial search params, and the Pricing route shell is split from the calculator boundary.
- Production build validation passed 68/68 routes.
- `npm run lint` could not execute in the current repository environment because `eslint` is not installed.

Additional visible-label follow-up status:
- Implemented and reviewer-approved (2026-06-01). The server Pricing route now resolves `resolvedServiceLabel` from `getLocalizedServiceName(serviceSlug, locale)`, the client Pricing shell receives only `resolvedServiceLabel`, `sourceLabel` remains attribution-only, `prefillKey` and `PricingHandoffContext.sourceLabel` remain unchanged, Decision A session-plan serialization remains intact, and service identifiers remain locale-independent.

Residual follow-up issues outside this completed implementation slice:
- Booking still shows stored locale-active labels after locale switch because `sessionStorage` values are rendered verbatim.
- Saved Quote can still show Hindi-origin labels on English routes because `lib/quote-localization.ts` only translates toward Hindi.

Audit boundary for next slice:
- `app/pricing/page.tsx`
- `app/book/page.tsx`
- `lib/pricing-handoff.ts`
- `lib/pricing-presets.ts`
- `lib/constants.ts` only where pricing inputs and `BOOKING_PLAN_STORAGE_KEY` directly shape route work
- `lib/save-quote.ts`
- `lib/popup-handoff.ts`

Protected dependencies for next slice:
- `app/api/quotes/route.ts`
- `app/api/quotes/[id]/route.ts`
- `lib/quote-security.ts`
- Firestore schema and stored quote shape
- `middleware.ts` and locale-routing infrastructure except as preserved dependencies

Audit focus for next slice:
- Client bundle and hydration cost on Pricing and Booking
- Query-handoff parsing and continuity into Pricing
- Session-storage handoff and Booking bootstrap cost
- Submit-path perceived latency and popup/WhatsApp handoff UX
- Server/client boundary opportunities that do not change SEO-visible output or secure quote behavior

Review:
- Shared public chrome (`app/layout.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`, `components/WhatsAppFloat.tsx`)
- Home route rendering and hydration (`app/page.tsx`, `components/home/ClientSections.tsx`, `components/home/HomeServerSections.tsx`)
- Services route rendering and hydration (`app/services/page.tsx`)
- Image optimization
- Bundle size
- Route performance
- Core Web Vitals
- Lighthouse
- Hydration cost
- Dynamic imports

### Phase C — SEO Audit
Review:
- Metadata
- Structured data
- Internal linking
- Sitemap
- Canonicals
- Content quality
- Service hierarchy

### Phase D — Scaling & Reliability Audit
Review:
- Firestore scaling
- Quote scaling
- Rate limiting
- Monitoring
- Logging
- Backups
- Admin scalability

### Phase E — Maintainability Audit
Review:
- Large files
- Technical debt
- Dead code
- Type safety
- Component architecture
- Folder structure

### Phase F — Conversion Optimization Audit
Review:
- Testimonials
- Portfolio presentation
- Lead generation
- Competitor differentiation
- Quote-to-booking conversion
