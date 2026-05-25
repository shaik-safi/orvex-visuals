"use client"

import Image from "next/image"
import {
  Camera,
  Heart,
  Award,
  MapPin,
  Calendar,
  Star,
  Target,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

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
                <Camera size={16} className="text-amber-500" /> 500+ Events
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden h-48">
                  <Image src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80" alt="Photographer at work" width={400} height={300} className="w-full h-full object-cover" sizes="(max-width: 640px) 50vw, 200px" loading="lazy" quality={75} />
                </div>
                <div className="rounded-2xl overflow-hidden h-32">
                  <Image src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80" alt="Camera equipment" width={400} height={200} className="w-full h-full object-cover" sizes="(max-width: 640px) 50vw, 200px" loading="lazy" quality={75} />
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="rounded-2xl overflow-hidden h-32">
                  <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" alt="Wedding shoot" width={400} height={200} className="w-full h-full object-cover" sizes="(max-width: 640px) 50vw, 200px" loading="lazy" quality={75} />
                </div>
                <div className="rounded-2xl overflow-hidden h-48">
                  <Image src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&q=80" alt="Video production" width={400} height={300} className="w-full h-full object-cover" sizes="(max-width: 640px) 50vw, 200px" loading="lazy" quality={75} />
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">4.9/5 Rating</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">200+ Happy Clients</p>
                </div>
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
              What began as a one-person passion project has grown into a team of dedicated visual storytellers. We&apos;ve covered 500+ events across weddings, corporate functions, baby shoots, and more — each one approached with the same enthusiasm as our first.
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
    { number: "500+", label: "Events Covered", icon: Camera },
    { number: "200+", label: "Happy Clients", icon: Heart },
    { number: "50K+", label: "Photos Delivered", icon: Award },
    { number: "4.9", label: "Google Rating", icon: Star },
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
    { icon: Zap, title: "Quick Turnaround", description: "48-hour previews and 7-15 day full delivery. We respect your excitement." },
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
    { name: "Orvex Team", role: "Lead Photographer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", speciality: "Weddings & Candid" },
    { name: "Creative Team", role: "Videographer", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80", speciality: "Cinematic Films" },
    { name: "Support Team", role: "Editor & Colorist", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80", speciality: "Post-Production" },
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
            A dedicated crew of visual storytellers passionate about capturing your moments.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <div key={i} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="h-52 overflow-hidden">
                <Image src={member.image} alt={member.name} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" loading="lazy" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">{member.role}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{member.speciality}</p>
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
            href="https://wa.me/919845332306?text=Hi%20Orvex,%20I'd%20like%20to%20discuss%20a%20project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            <MessageCircle size={20} /> Get in Touch
          </a>
          <a
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            View Gallery <ArrowRight size={18} />
          </a>
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