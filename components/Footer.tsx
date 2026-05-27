import Link from "next/link"
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
} from "lucide-react"
import { EMAIL, PHONE_DISPLAY, SOCIAL_LINKS } from "@/lib/constants"

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/5">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">OV</span>
              </div>
              <span className="text-xl font-bold text-white">Orvex Visuals</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Premium photography & videography coordination in Bangalore.
              Your moments, beautifully captured.
            </p>
            <div className="flex gap-2">
              <a aria-label="Visit Orvex Visuals on Instagram" href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                <Instagram size={16} />
              </a>
              <a aria-label="Visit Orvex Visuals on Facebook" href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-5">Services</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                ["Wedding Photography", "/services/wedding-photography"],
                ["Pre-Wedding Shoot", "/services/pre-wedding-photoshoot"],
                ["Baby Photoshoot", "/services/baby-photoshoot"],
                ["Event Photography", "/services"],
                ["Drone Photography", "/services/drone-photography"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-amber-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                ["Pricing", "/pricing"],
                ["Gallery", "/gallery"],
                ["Blog", "/blog"],
                ["About Us", "/about"],
                ["FAQs", "/#faq"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-amber-300 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <Phone size={14} className="text-amber-400" />
                </div>
                <span>{PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <Mail size={14} className="text-amber-400" />
                </div>
                <span>{EMAIL}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <MapPin size={14} className="text-amber-400" />
                </div>
                <span>Bangalore, Karnataka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>&copy; 2026 Orvex Visuals. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-slate-300 hover:text-amber-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-300 hover:text-amber-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}