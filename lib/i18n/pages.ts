import pagesEn from "@/lib/i18n/messages/pages.en.json"
import pagesHi from "@/lib/i18n/messages/pages.hi.json"

import type { AppLocale } from "@/lib/i18n/config"

export type PageMessages = typeof pagesEn

const catalog: Record<AppLocale, PageMessages> = {
  en: pagesEn,
  hi: pagesHi,
}

export function getPageMessages(locale: AppLocale): PageMessages {
  return catalog[locale] ?? catalog.en
}
