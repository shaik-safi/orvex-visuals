"use client"

import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react"
import { PHONE_DISPLAY, EMAIL } from "@/lib/constants"

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
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Premium photography & videography coordination in Bangalore.
              Your moments, beautifully captured.
            </p>
            <div className="flex gap-2">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 hover:bg-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                ["Wedding Photography", "/services/wedding-photography"],
                ["Pre-Wedding Shoot", "/services/pre-wedding-photoshoot"],
                ["Baby Photoshoot", "/services/baby-photoshoot"],
                ["Event Photography", "/services"],
                ["Drone Photography", "/services/drone-photography"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-amber-400 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                ["Pricing", "/pricing"],
                ["Gallery", "/gallery"],
                ["Blog", "/blog"],
                ["About Us", "/about"],
                ["FAQs", "/#faq"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-amber-400 transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
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
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; 2026 Orvex Visuals. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}