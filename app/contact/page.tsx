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
  Youtube,
  CheckCircle,
} from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// ============ HERO ============
function ContactHero() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="pt-32 pb-10 md:pt-40 md:pb-14 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div ref={ref} className={`max-w-4xl mx-auto px-4 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[0.95] mb-6">
          Let&apos;s Start{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Your Story</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Have a question or ready to book? We respond within 30 minutes on WhatsApp.
        </p>
      </div>
    </section>
  )
}

// ============ CONTACT INFO + FORM ============
function ContactSection() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Hi Orvex! I'm ${formState.name}.%0A%0AService: ${formState.service}%0ADate: ${formState.date}%0AMessage: ${formState.message}%0A%0APhone: ${formState.phone}%0AEmail: ${formState.email}`
    window.open(`https://wa.me/919845332306?text=${msg}`, "_blank")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section ref={ref} className={`py-12 md:py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Contact Info</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Reach out through any channel. We&apos;re always happy to help!</p>
            </div>

            <div className="space-y-4">
              <a href="https://wa.me/919845332306" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 bg-green-50 dark:bg-green-500/5 rounded-2xl p-4 border border-green-100 dark:border-green-500/10 hover:border-green-300 dark:hover:border-green-500/30 transition-all">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={18} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">WhatsApp (Fastest)</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">+91 98453 32306</p>
                  <p className="text-xs text-slate-400 mt-0.5">Responds within 30 mins</p>
                </div>
              </a>

              <a href="tel:+919845332306" className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Phone</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">+91 98453 32306</p>
                  <p className="text-xs text-slate-400 mt-0.5">Mon-Sat, 9 AM - 8 PM</p>
                </div>
              </a>

              <a href="mailto:hello@orvexvisuals.com" className="group flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Email</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">hello@orvexvisuals.com</p>
                  <p className="text-xs text-slate-400 mt-0.5">Responds within 24 hours</p>
                </div>
              </a>

              <div className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Location</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Bangalore, Karnataka, India</p>
                  <p className="text-xs text-slate-400 mt-0.5">Available PAN India for travel</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Working Hours</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">Mon — Sat: 9 AM - 8 PM</p>
                  <p className="text-xs text-slate-400 mt-0.5">Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Send an Inquiry</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Fill in the form and it&apos;ll open WhatsApp with your details pre-filled.</p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">We&apos;ll get back to you within 30 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+91 98453 32306"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Service Required *</label>
                      <select
                        required
                        value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm appearance-none"
                      >
                        <option value="">Select a service</option>
                        <option value="Wedding Photography">Wedding Photography</option>
                        <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                        <option value="Baby/Newborn Shoot">Baby/Newborn Shoot</option>
                        <option value="Birthday Photography">Birthday Photography</option>
                        <option value="Event Photography">Event Photography</option>
                        <option value="Videography">Videography</option>
                        <option value="Corporate Photography">Corporate Photography</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Event Date</label>
                      <input
                        type="date"
                        value={formState.date}
                        onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us about your event, requirements, budget, or any questions..."
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5"
                  >
                    <Send size={16} /> Send via WhatsApp
                  </button>

                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                    This form opens WhatsApp with your inquiry pre-filled. No data is stored on our servers.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ MAP SECTION ============
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

// ============ FAQ ============
function ContactFAQ() {
  const { ref, isVisible } = useScrollReveal()
  const faqs = [
    { q: "How quickly do you respond?", a: "We respond within 30 minutes on WhatsApp during working hours (9 AM - 8 PM, Mon-Sat). Emails are answered within 24 hours." },
    { q: "How do I book a date?", a: "Contact us via WhatsApp or the form above. Once we confirm availability, pay 50% advance to lock your date." },
    { q: "Do you travel outside Bangalore?", a: "Yes! We cover events across India. Travel and accommodation charges apply for outstation bookings." },
    { q: "Can I visit your studio?", a: "We operate as a mobile studio with on-location shoots. For baby/newborn shoots, we come to your home or can arrange a studio setup." },
  ]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section ref={ref} className={`py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Quick Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-slate-900 dark:text-white font-medium pr-4 text-sm">{faq.q}</span>
                <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactSection />
      <MapSection />
      <ContactFAQ />
    </main>
  )
}