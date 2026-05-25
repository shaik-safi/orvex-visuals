import {
  Camera,
  Video,
  Heart,
  Calendar,
  Cake,
  Baby,
  Flower2,
  Sparkles,
  Music,
  Gift,
  PartyPopper,
  Plane,
  Clock,
  Shield,
  Receipt,
  Smartphone,
  Star,
  ArrowRight,
  Users,
  Award,
} from "lucide-react"
import { Hero, FAQSection, CTABanner } from "@/components/home/ClientSections"
import { getWhatsAppLink, WA_MESSAGES } from "@/lib/constants"

// ============ DATA ============
const services = [
  { name: "Wedding Photography", icon: Camera, price: "₹20,000", desc: "Candid + Traditional coverage for your big day", slug: "wedding-photography" },
  { name: "Wedding Videography", icon: Video, price: "₹25,000", desc: "Cinematic films that tell your love story", slug: "wedding-videography" },
  { name: "Pre-Wedding Shoot", icon: Heart, price: "₹15,000", desc: "Beautiful couple shoots at stunning locations", slug: "pre-wedding-photoshoot" },
  { name: "Engagement", icon: Calendar, price: "₹12,000", desc: "Capture the moment you said yes", slug: "engagement-photography" },
  { name: "Birthday Photography", icon: Cake, price: "₹8,000", desc: "From kids parties to milestone celebrations", slug: "birthday-photography" },
  { name: "Baby Shower", icon: Baby, price: "₹8,000", desc: "Joyful moments with your little one on the way", slug: "baby-shower-photography" },
  { name: "Haldi & Mehendi", icon: Flower2, price: "₹10,000", desc: "Vibrant colors and celebrations captured", slug: "haldi-mehendi-photography" },
  { name: "Sangeet", icon: Music, price: "₹12,000", desc: "Dance, music, and unforgettable energy", slug: "sangeet-photography" },
  { name: "Naming Ceremony", icon: Gift, price: "₹8,000", desc: "Your baby's special day documented beautifully", slug: "naming-ceremony-photography" },
  { name: "Anniversary", icon: PartyPopper, price: "₹10,000", desc: "Celebrate your journey together", slug: "anniversary-photoshoot" },
  { name: "Corporate Events", icon: Sparkles, price: "₹15,000", desc: "Professional coverage for business events", slug: "corporate-photography" },
  { name: "Drone Photography", icon: Plane, price: "₹5,000", desc: "Stunning aerial shots for any event", slug: "drone-photography" },
]

const testimonials = [
  {
    name: "Priya & Arjun",
    event: "Wedding Photography",
    text: "Orvex made our wedding day unforgettable. Every candid moment was captured perfectly. Photos delivered in just 4 days!",
    rating: 5,
  },
  {
    name: "Sneha Sharma",
    event: "Pre-Wedding Shoot",
    text: "Our pre-wedding shoot at Nandi Hills turned out even better than Pinterest inspiration. Highly recommend!",
    rating: 5,
  },
  {
    name: "Rahul & Divya",
    event: "Engagement",
    text: "They made us feel so comfortable and the photos are breathtaking. Worth every rupee.",
    rating: 5,
  },
]

const features = [
  { icon: Clock, title: "5-Day Delivery", desc: "While other studios take 30-45 days, we deliver your professionally edited gallery in just 5 working days.", stat: "5x faster" },
  { icon: Shield, title: "You Own Everything", desc: "Every photo, every frame, every video — 100% copyright yours from day one. No watermarks, no restrictions, no annual fees.", stat: "100% yours" },
  { icon: Receipt, title: "Honest, Final Pricing", desc: "The price you see is the price you pay. GST included, no surprise add-ons. We despise hidden charges as much as you do.", stat: "Zero hidden fees" },
  { icon: Smartphone, title: "Book in 2 Minutes", desc: "No awkward phone calls or studio visits required. WhatsApp us or fill our form — get a quote within 2 hours, guaranteed.", stat: "< 2hr response" },
]

// ============ SERVER COMPONENTS ============

function TrustBar() {
  return (
    <div className="py-6 bg-slate-900 dark:bg-slate-800 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm">
        <div className="flex items-center gap-2 text-white/70">
          <Users size={16} className="text-amber-400" />
          <span><strong className="text-white">500+</strong> Events Covered</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Star size={16} className="text-amber-400 fill-amber-400" />
          <span><strong className="text-white">4.9</strong> Google Rating</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Clock size={16} className="text-amber-400" />
          <span><strong className="text-white">5-Day</strong> Delivery</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Award size={16} className="text-amber-400" />
          <span><strong className="text-white">100%</strong> Copyright Yours</span>
        </div>
      </div>
    </div>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            One Studio,{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Every Milestone</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            Weddings, baby shoots, corporates — 40+ services under one roof, all with the same uncompromising quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <a
                href={`/services/${service.slug}`}
                key={i}
                className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{service.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">From {service.price}</span>
                      <ArrowRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <a href="/services" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5">
            View All 40+ Services <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

function WhyOrvex() {
  return (
    <section id="why-us" className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Why 500+ Couples Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            The Orvex{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Promise</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            Other studios make you wait 45 days, charge hidden GST, and keep your copyright. We do the opposite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-amber-400/30 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-medium">{feature.stat}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { step: "01", title: "Tell Us Your Vision", desc: "Share your event details via WhatsApp or our 2-min form. We respond with a personalized quote within 2 hours." },
    { step: "02", title: "We Handle Everything", desc: "Our team matches you with the ideal photographer, plans the shot list, and coordinates logistics. You relax." },
    { step: "03", title: "Enjoy Your Day", desc: "Professional capture with backup equipment and a second shooter for peace of mind. You celebrate, we create art." },
    { step: "04", title: "Gallery in 5 Days", desc: "Professionally edited photos + cinematic highlight reel delivered digitally. Full copyright is yours forever." },
  ]

  return (
    <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            How It <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl font-black text-slate-100 dark:text-slate-700 group-hover:text-amber-100 dark:group-hover:text-amber-500/20 transition-colors absolute top-6 right-6">
                {item.step}
              </div>
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Trusted by 500+ Families
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Real Couples,{" "}<span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Real Words</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">{t.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ MAIN PAGE (Server Component) ============
export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <ServicesSection />
      <WhyOrvex />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <CTABanner />
    </main>
  )
}
