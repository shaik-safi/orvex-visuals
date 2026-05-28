"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import { getWhatsAppLink, WA_MESSAGES } from "@/lib/constants"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getCommonMessages } from "@/lib/i18n/common"

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false)
  const locale = useCurrentLocale()
  const messages = getCommonMessages(locale)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <a
      href={getWhatsAppLink(WA_MESSAGES.general)}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-500 hover:scale-110 ${show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      aria-label={messages.floatingWhatsapp.ariaLabel}
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  )
}
