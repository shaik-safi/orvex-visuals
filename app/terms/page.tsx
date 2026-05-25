"use client"

export default function TermsPage() {
  return (
    <main className="overflow-x-hidden">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
          <p className="text-sm text-slate-400 mb-8">Last updated: January 2026</p>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">1. Services</h2>
            <p>Orvex Visuals provides photography and videography coordination services in Bangalore and surrounding areas. We connect you with professional, vetted photographers from our curated network to cover your events.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">2. Booking & Payment</h2>
            <p>A booking is confirmed upon receipt of 30% advance payment. The remaining balance is due on the day of the event before the shoot begins. We accept UPI, NEFT/IMPS bank transfer, and cash. All prices are inclusive of GST (18%).</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">3. Cancellation & Refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>7+ days before event:</strong> Full refund of advance</li>
              <li><strong>3-7 days before event:</strong> 50% refund of advance</li>
              <li><strong>Less than 3 days:</strong> No refund (team is already reserved)</li>
              <li><strong>Date change:</strong> Free if requested 5+ days in advance (subject to availability)</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">4. Delivery</h2>
            <p>Edited photos are delivered within 7-15 working days via online gallery. Highlight reels within 48 hours. Wedding films within 3-4 weeks. Rush delivery available at additional cost. One round of revisions is included.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">5. Copyright & Usage</h2>
            <p>You receive full personal usage rights to all delivered photos and videos. Orvex Visuals retains the right to use select images for portfolio, marketing, and social media purposes unless you opt out in writing before the event. Commercial usage by the client requires separate written agreement.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">6. Limitations of Liability</h2>
            <p>While we take every precaution, Orvex Visuals is not liable for: unforeseen equipment failure beyond backup coverage, venue/weather restrictions preventing coverage, delays caused by event schedule changes, or loss/damage of delivered files after handover to client.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">7. Client Responsibilities</h2>
            <p>Clients are expected to: provide accurate event details at booking, inform us of any venue restrictions or special requirements, ensure photographer access to key moments, and communicate schedule changes promptly.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">8. Force Majeure</h2>
            <p>Neither party is liable for failure to perform due to circumstances beyond reasonable control including natural disasters, government restrictions, pandemics, or civil unrest. In such cases, we will offer a full reschedule or refund.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">9. Disputes</h2>
            <p>Any disputes shall be resolved amicably through discussion. If unresolved, disputes are subject to the jurisdiction of courts in Bangalore, Karnataka, India.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">10. Contact</h2>
            <p>For questions about these terms, email <strong>hello@orvexvisuals.com</strong> or call +91 98453 32306.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
