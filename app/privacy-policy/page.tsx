"use client"

export default function PrivacyPolicyPage() {
  return (
    <main className="overflow-x-hidden">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-8">Last updated: January 2026</p>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">1. Information We Collect</h2>
            <p>When you use our booking form, contact form, or WhatsApp, we collect: your name, phone number, email address (optional), event details (date, venue, type), and budget preferences. We do not collect payment card information — payments are processed directly via UPI or bank transfer.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">2. How We Use Your Information</h2>
            <p>We use your information solely to: respond to your inquiry with a personalized quote, coordinate your photography session, send booking confirmations and delivery updates, and improve our services. We never sell, rent, or share your personal data with third parties for marketing purposes.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">3. Photos & Media</h2>
            <p>Photos and videos captured during your event are delivered exclusively to you. We may use select images (with your consent) for our portfolio, website gallery, and social media. You may opt out of portfolio usage at any time by informing us in writing.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">4. Data Storage & Security</h2>
            <p>Your personal data is stored securely and accessible only to authorized team members. Event photos are stored on encrypted cloud storage and retained for 6 months post-delivery, after which they are permanently deleted unless you request extended storage.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">5. Cookies & Analytics</h2>
            <p>Our website uses essential cookies and Vercel Analytics to understand traffic patterns. We do not use third-party advertising trackers. Analytics data is anonymized and cannot identify individual users.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">6. Third-Party Services</h2>
            <p>We use: WhatsApp Business (Meta) for communication, Google Drive for photo delivery, Vercel for hosting. Each has its own privacy policy governing their handling of data.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">7. Your Rights</h2>
            <p>You may request: access to your stored data, correction of inaccurate data, deletion of your data, or withdrawal of portfolio consent at any time. Contact us at hello@orvexvisuals.com for any privacy-related requests.</p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">8. Contact</h2>
            <p>For privacy concerns, email us at <strong>hello@orvexvisuals.com</strong> or message us on WhatsApp at +91 98453 32306.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
