import { EMAIL, PHONE_DISPLAY, PHOTO_DELIVERY_DAYS, VIDEO_DELIVERY_DAYS } from "@/lib/constants"
import { applyTemplate } from "@/lib/i18n/home"
import { getPageMessages } from "@/lib/i18n/pages"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

export default async function TermsPage() {
  const locale = await resolveRequestLocale()
  const messages = getPageMessages(locale).termsPage

  return (
    <main className="overflow-x-hidden">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">{messages.title}</h1>
          <p className="text-sm text-slate-400 mb-8">{messages.updated}</p>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {messages.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">{section.title}</h2>
                {"list" in section && section.list ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.list.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : "body" in section && section.body ? (
                  <p>{section.body}</p>
                ) : (
                  <p>
                    {applyTemplate(section.bodyTemplate || "", {
                      EMAIL,
                      PHONE_DISPLAY,
                      PHOTO_DELIVERY_DAYS: String(PHOTO_DELIVERY_DAYS),
                      VIDEO_DELIVERY_DAYS: String(VIDEO_DELIVERY_DAYS),
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
