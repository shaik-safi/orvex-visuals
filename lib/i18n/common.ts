import commonEn from "@/lib/i18n/messages/common.en.json"
import commonHi from "@/lib/i18n/messages/common.hi.json"
import type { AppLocale } from "@/lib/i18n/config"

export type CommonMessages = typeof commonEn

const catalog: Record<AppLocale, CommonMessages> = {
  en: commonEn,
  hi: commonHi,
}

export function getCommonMessages(locale: AppLocale): CommonMessages {
  return catalog[locale] ?? catalog.en
}
