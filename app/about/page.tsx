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
import { PHOTO_DELIVERY_DAYS, VIDEO_DELIVERY_DAYS, getWhatsAppLink } from "@/lib/constants"

// ============ HERO ============
function AboutHero() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div ref={ref} className={`max-w-6xl mx-auto px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-[0.95] mb-6">
              We Capture{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Emotions</span>,
              <br />Not Just Photos
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Orvex Visuals is a Bangalore-based photography and videography studio passionate about turning your life&apos;s most precious moments into timeless visual stories.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin size={16} className="text-amber-500" /> Bangalore, India
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar size={16} className="text-amber-500" /> Since 2020
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Camera size={16} className="text-amber-500" /> Booking-first workflow
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-8 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 mb-4">What we can stand behind</p>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-amber-500 mt-0.5" />
                <span>Edited photos in {PHOTO_DELIVERY_DAYS} working days. Videos in {VIDEO_DELIVERY_DAYS} working days.</span>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-amber-500 mt-0.5" />
                <span>Transparent GST-inclusive pricing with a written booking summary.</span>
              </div>
              <div className="flex items-start gap-3">
                <Award size={18} className="text-amber-500 mt-0.5" />
                <span>Your delivered photos and videos remain yours with no surprise licensing restrictions.</span>
              </div>
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 p-4 text-slate-700 dark:text-slate-200">
                We removed unverified review counts and stock team imagery so this page reflects only claims we can support in production.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ OUR STORY ============
function OurStory() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Our Story
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            From Passion to Profession
          </h2>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-100 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-4">
              Orvex Visuals started with a simple belief — every moment deserves to be captured beautifully, and professional photography shouldn&apos;t cost a fortune. Founded in Bangalore in 2020, we set out to make world-class photography accessible to everyone.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-4">
              What began as a one-person passion project has grown into a booking-first studio experience focused on transparent planning, fast delivery, and clean communication from inquiry to final handoff.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Our philosophy is simple: combine artistic vision with technical excellence, keep pricing transparent (all GST-inclusive, no surprises), and treat every client like family. We&apos;re not just photographers — we&apos;re visual storytellers who happen to have cameras.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ STATS ============
function StatsSection() {
  const { ref, isVisible } = useScrollReveal()
  const stats = [
    { number: `${PHOTO_DELIVERY_DAYS} Days`, label: "Photo Delivery", icon: Clock },
    { number: `${VIDEO_DELIVERY_DAYS} Days`, label: "Video Delivery", icon: Award },
    { number: "30%", label: "Advance To Confirm", icon: Shield },
    { number: "100%", label: "Copyright Yours", icon: Camera },
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
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stat.number}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============ WHY CHOOSE US ============
function WhyChooseUs() {
  const { ref, isVisible } = useScrollReveal()
  const reasons = [
    { icon: Target, title: "Detail-Oriented", description: "We obsess over every frame, every angle, every edit to ensure perfection." },
    { icon: Shield, title: "Transparent Pricing", description: "All prices are GST-inclusive. What we quote is what you pay. No surprises." },
    { icon: Zap, title: "Quick Turnaround", description: `Photos in ${PHOTO_DELIVERY_DAYS} working days. Videos in ${VIDEO_DELIVERY_DAYS} working days.` },
    { icon: Heart, title: "Client-First Approach", description: "Your vision drives our work. We listen, plan, and execute to your expectations." },
    { icon: Camera, title: "Pro Equipment", description: "Top-tier Sony & Canon gear with full backup sets on every shoot." },
    { icon: Clock, title: "Always On Time", description: "We arrive early, set up in advance, and never miss a moment." },
  ]

  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Why Orvex
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            What Sets Us Apart
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <div key={i} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-11 h-11 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{reason.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============ TEAM ============
function TeamSection() {
  const { ref, isVisible } = useScrollReveal()
  const team = [
    { name: "Planning & Coordination", role: "Pre-event alignment", speciality: "Timelines, deliverables, and coverage planning before shoot day." },
    { name: "Capture Team", role: "Shoot execution", speciality: "Photography and videography teams matched to the event format." },
    { name: "Editing & Delivery", role: "Post-production", speciality: "Clean edits, organized delivery, and final handoff on schedule." },
  ]

  return (
    <section ref={ref} className={`py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            The Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            The People Behind the Lens
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            We show the workflow clearly instead of using stock headshots for people you haven&apos;t actually met.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {team.map((member, i) => (
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

// ============ CTA ============
function AboutCTA() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-20 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.08),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Let&apos;s Create Something Beautiful
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          Ready to work with us? We&apos;d love to hear about your project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getWhatsAppLink("Hi Orvex, I'd like to discuss a project")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            <MessageCircle size={20} /> Get in Touch
          </a>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            View Services <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============ MAIN ============
export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      <StatsSection />
      <WhyChooseUs />
      <TeamSection />
      <AboutCTA />
    </main>
  )
}