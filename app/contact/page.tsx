"use client"

import { useState } from "react"
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  CheckCircle,
  ChevronDown,
} from "lucide-react"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { EMAIL, getWhatsAppLink, PHONE_DISPLAY, PHONE_NUMBER, SOCIAL_LINKS } from "@/lib/constants"
import { getPageMessages } from "@/lib/i18n/pages"
import { applyTemplate } from "@/lib/i18n/home"

type ContactMessages = ReturnType<typeof getPageMessages>["contactPage"]

function ContactHero({ messages }: { messages: ContactMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="pt-32 pb-10 md:pt-40 md:pb-14 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div ref={ref} className={`max-w-4xl mx-auto px-4 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          {messages.hero.badge}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[0.95] mb-6">
          {messages.hero.titleLine1}{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.hero.titleHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {messages.hero.description}
        </p>
      </div>
    </section>
  )
}

function ContactSection({ messages }: { messages: ContactMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [whatsAppUrl, setWhatsAppUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<"saved" | "whatsapp">("saved")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const render = (template: string, params: Record<string, string>) => applyTemplate(template, params)
    const message = [
      render(messages.form.whatsappTemplate.start, { name: formState.name }),
      "",
      render(messages.form.whatsappTemplate.service, { value: formState.service }),
      formState.date ? render(messages.form.whatsappTemplate.date, { value: formState.date }) : null,
      formState.message ? render(messages.form.whatsappTemplate.message, { value: formState.message }) : null,
      "",
      render(messages.form.whatsappTemplate.phone, { value: formState.phone }),
      formState.email ? render(messages.form.whatsappTemplate.email, { value: formState.email }) : null,
    ]
      .filter(Boolean)
      .join("\n")
    const nextWhatsAppUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          phone: formState.phone,
          email: formState.email,
          service: formState.service,
          date: formState.date,
          message: formState.message,
        }),
      })

      if (!response.ok) {
        setSubmissionResult("whatsapp")
        window.open(nextWhatsAppUrl, "_blank", "noopener,noreferrer")
      } else {
        setSubmissionResult("saved")
      }
    } catch {
      setSubmissionResult("whatsapp")
      window.open(nextWhatsAppUrl, "_blank", "noopener,noreferrer")
    } finally {
      setWhatsAppUrl(nextWhatsAppUrl)
      setSubmitted(true)
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={ref} className={`py-12 md:py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{messages.info.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{messages.info.description}</p>
            </div>

            <div className="space-y-4">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 bg-green-50 dark:bg-green-500/5 rounded-2xl p-4 border border-green-100 dark:border-green-500/10 hover:border-green-300 dark:hover:border-green-500/30 transition-all">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{messages.info.whatsapp.title}</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">{PHONE_DISPLAY}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{messages.info.whatsapp.subtitle}</p>
                </div>
              </a>

              <a href={`tel:${PHONE_NUMBER}`} className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{messages.info.phone.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{PHONE_DISPLAY}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{messages.info.phone.subtitle}</p>
                </div>
              </a>

              <a href={`mailto:${EMAIL}`} className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{messages.info.email.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{EMAIL}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{messages.info.email.subtitle}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{messages.info.location.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{messages.info.location.line1}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{messages.info.location.line2}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{messages.info.hours.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{messages.info.hours.line1}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{messages.info.hours.line2}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">{messages.info.follow}</p>
              <div className="flex gap-3">
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all">
                  <Instagram size={18} />
                </a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{messages.form.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{messages.form.description}</p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {submissionResult === "saved" ? messages.form.savedTitle : messages.form.waTitle}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                    {submissionResult === "saved" ? messages.form.savedDescription : messages.form.waDescription}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={whatsAppUrl || getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
                    >
                      <MessageCircle size={16} /> {submissionResult === "saved" ? messages.form.continueWhatsapp : messages.form.openWhatsappAgain}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false)
                        setWhatsAppUrl("")
                        setSubmissionResult("saved")
                      }}
                      className="inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600"
                    >
                      {submissionResult === "saved" ? messages.form.sendAnother : messages.form.editInquiry}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.form.labels.name}</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder={messages.form.placeholders.name}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.form.labels.phone}</label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder={messages.form.placeholders.phone}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.form.labels.email}</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder={messages.form.placeholders.email}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.form.labels.service}</label>
                      <select
                        required
                        value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm appearance-none"
                      >
                        <option value="">{messages.form.serviceSelectPlaceholder}</option>
                        {messages.form.serviceOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.form.labels.date}</label>
                      <input
                        type="date"
                        value={formState.date}
                        onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{messages.form.labels.message}</label>
                    <textarea
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={messages.form.placeholders.message}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5"
                  >
                    <Send size={16} /> {isSubmitting ? messages.form.sending : messages.form.send}
                  </button>

                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                    {messages.form.helper}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        <section className="pt-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {messages.faq.title}
              </h2>
            </div>

            <div className="space-y-3">
              {messages.faq.items.map((faq, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-slate-900 dark:text-white font-medium pr-4 text-sm">{faq.q}</span>
                    <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

function MapSection() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-12 bg-slate-50 dark:bg-slate-900 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 h-72 md:h-96 relative bg-slate-200 dark:bg-slate-800">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.8865398437!2d77.46612593281249!3d12.954517000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1703000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).contactPage

  return (
    <main>
      <ContactHero messages={messages} />
      <ContactSection messages={messages} />
      <MapSection />
    </main>
  )
}
