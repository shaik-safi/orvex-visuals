"use client"

import Link from "next/link"
import {
  Camera,
  Heart,
  Award,
  MapPin,
  Calendar,
  Target,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  MessageCircle,
} from "lucide-react"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { PHOTO_DELIVERY_DAYS, VIDEO_DELIVERY_DAYS, getWhatsAppLink } from "@/lib/constants"
import { applyTemplate } from "@/lib/i18n/home"
import { getPageMessages } from "@/lib/i18n/pages"
import { withLocalePathname } from "@/lib/i18n/routing"

type AboutMessages = ReturnType<typeof getPageMessages>["about"]

function AboutHero({ messages }: { messages: AboutMessages }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div ref={ref} className={`max-w-6xl mx-auto px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              {messages.hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[0.95] mb-6">
              {messages.hero.titleLine1}{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.hero.titleHighlight}</span>,
              <br />{messages.hero.titleLine2}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {messages.hero.description}
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin size={16} className="text-amber-500" /> {messages.hero.facts.location}
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar size={16} className="text-amber-500" /> {messages.hero.facts.since}
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Camera size={16} className="text-amber-500" /> {messages.hero.facts.workflow}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 mb-4">{messages.hero.proofTitle}</p>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              {messages.hero.proofPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  {index === 0 && <Clock size={18} className="text-amber-500 mt-0.5" />}
                  {index === 1 && <Shield size={18} className="text-amber-500 mt-0.5" />}
                  {index === 2 && <Award size={18} className="text-amber-500 mt-0.5" />}
                  <span>{applyTemplate(point, { PHOTO_DELIVERY_DAYS: String(PHOTO_DELIVERY_DAYS), VIDEO_DELIVERY_DAYS: String(VIDEO_DELIVERY_DAYS) })}</span>
                </div>
              ))}
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-4 text-slate-700 dark:text-slate-200">
                {messages.hero.proofNote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OurStory({ messages }: { messages: AboutMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.story.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {messages.story.title}
          </h2>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-100 dark:border-slate-800">
            {messages.story.paragraphs.map((paragraph, index) => (
              <p key={index} className={`text-slate-600 dark:text-slate-300 text-base leading-relaxed ${index < messages.story.paragraphs.length - 1 ? "mb-4" : ""}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection({ messages }: { messages: AboutMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const stats = [
    { ...messages.stats[0], icon: Clock },
    { ...messages.stats[1], icon: Award },
    { ...messages.stats[2], icon: Shield },
    { ...messages.stats[3], icon: Camera },
  ]

  return (
    <section ref={ref} className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-700" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-amber-500" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {applyTemplate(stat.numberTemplate, { PHOTO_DELIVERY_DAYS: String(PHOTO_DELIVERY_DAYS), VIDEO_DELIVERY_DAYS: String(VIDEO_DELIVERY_DAYS) })}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WhyChooseUs({ messages }: { messages: AboutMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const icons = [Target, Shield, Zap, Heart, Camera, Clock] as const
  const reasons = messages.why.items.map((item, index) => ({
    ...item,
    icon: icons[index] ?? Target,
  }))

  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.why.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            {messages.why.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            const description = reason.descriptionTemplate
              ? applyTemplate(reason.descriptionTemplate, { PHOTO_DELIVERY_DAYS: String(PHOTO_DELIVERY_DAYS), VIDEO_DELIVERY_DAYS: String(VIDEO_DELIVERY_DAYS) })
              : reason.description

            return (
              <div key={i} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-11 h-11 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TeamSection({ messages }: { messages: AboutMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            {messages.team.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {messages.team.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {messages.team.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {messages.team.members.map((member, i) => (
            <div key={i} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="p-8 text-center">
                <h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">{member.role}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{member.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutCTA({ messages, locale }: { messages: AboutMessages; locale: ReturnType<typeof useCurrentLocale> }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-20 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.08),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {messages.cta.title}
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          {messages.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getWhatsAppLink("Hi Orvex, I'd like to discuss a project")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            <MessageCircle size={20} /> {messages.cta.whatsapp}
          </a>
          <Link
            href={withLocalePathname("/services", locale)}
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            {messages.cta.services} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).about

  return (
    <main>
      <AboutHero messages={messages} />
      <OurStory messages={messages} />
      <StatsSection messages={messages} />
      <WhyChooseUs messages={messages} />
      <TeamSection messages={messages} />
      <AboutCTA messages={messages} locale={locale} />
    </main>
  )
}
