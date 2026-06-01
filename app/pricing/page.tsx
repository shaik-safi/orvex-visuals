import PricingEstimatorShell from "@/app/pricing/PricingEstimatorShell"
import { ComparisonSection, PricingCTA, PricingHero } from "@/app/pricing/PricingShellSections"
import { getPageMessages } from "@/lib/i18n/pages"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"
import { getLocalizedServiceName } from "@/app/services/data"

type PricingPageSearchParams = Record<string, string | string[] | undefined>

function toSearchString(searchParams: PricingPageSearchParams) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") {
          params.append(key, item)
        }
      })
      continue
    }

    if (typeof value === "string") {
      params.set(key, value)
    }
  }

  return params.toString()
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<PricingPageSearchParams> | PricingPageSearchParams
}) {
  const locale = await resolveRequestLocale()
  const messages = getPageMessages(locale).pricingPage
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const initialSearchParams = toSearchString(resolvedSearchParams)

  const rawServiceSlug = resolvedSearchParams.service
  const serviceSlug = Array.isArray(rawServiceSlug) ? rawServiceSlug[0] : rawServiceSlug
  const resolvedServiceLabel = serviceSlug
    ? (getLocalizedServiceName(serviceSlug, locale) || null)
    : null

  return (
    <main>
      <PricingHero messages={messages} />
      <PricingEstimatorShell
        initialSearchParams={initialSearchParams}
        locale={locale}
        messages={messages}
        resolvedServiceLabel={resolvedServiceLabel}
      />
      <ComparisonSection messages={messages} />
      <PricingCTA locale={locale} messages={messages} />
    </main>
  )
}