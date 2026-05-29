"use client"

import { MessageCircle } from "lucide-react"
import { getWhatsAppLink } from "@/lib/constants"
import { useLocaleSync } from "@/lib/i18n/locale-sync"
import { getCommonMessages } from "@/lib/i18n/common"

export default function WhatsAppFloat() {
  const { routeLocale } = useLocaleSync()
  const messages = getCommonMessages(routeLocale)

  return (
    <a
      href={getWhatsAppLink(messages.floatingWhatsapp.message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/30 transition-all duration-300 hover:bg-green-600 hover:shadow-2xl hover:shadow-green-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 sm:bottom-6 sm:right-6 lg:hidden"
      aria-label={messages.floatingWhatsapp.ariaLabel}
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  )
}
