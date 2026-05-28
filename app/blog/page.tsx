"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  ArrowRight,
  Search,
  Clock,
  Calendar,
} from "lucide-react"

import { blogPosts, blogCategories, type BlogCategory } from "./data"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getWhatsAppLink } from "@/lib/constants"
import { getLocaleTag } from "@/lib/i18n/config"
import { getPageMessages } from "@/lib/i18n/pages"
import { withLocalePathname } from "@/lib/i18n/routing"

type BlogMessages = ReturnType<typeof getPageMessages>["blogPage"]

function BlogHero({ messages }: { messages: BlogMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="pt-32 pb-10 md:pt-40 md:pb-14 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div ref={ref} className={`max-w-4xl mx-auto px-4 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          {messages.hero.badge}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[0.95] mb-6">
          {messages.hero.titleLine1}{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{messages.hero.titleHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {messages.hero.description}
        </p>
      </div>
    </section>
  )
}

function FeaturedPost({ locale, messages }: { locale: ReturnType<typeof useCurrentLocale>; messages: BlogMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const featured = blogPosts.filter((p) => p.featured)
  const post = featured[0]
  if (!post) return null

  const dateLocale = getLocaleTag(locale)
  const formatCategory = (category: string) => messages.categoryLabels[category as keyof BlogMessages["categoryLabels"]] ?? category

  return (
    <section ref={ref} className={`py-8 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={withLocalePathname(`/blog/${post.slug}`, locale)} className="group grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-500 hover:shadow-xl">
          <div className="h-64 md:h-full overflow-hidden">
            <Image src={post.image} alt={post.title} width={800} height={450} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" loading="lazy" quality={75} />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold uppercase">
                {messages.featured}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {post.readTime} {messages.readUnit}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-3 leading-tight">
              {post.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.date).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" })}</span>
              <span>•</span>
              <span>{post.author}</span>
              <span>•</span>
              <span>{formatCategory(post.category)}</span>
            </div>
            <span className="mt-4 flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
              {messages.readArticle} <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}

function BlogGrid({ locale, messages }: { locale: ReturnType<typeof useCurrentLocale>; messages: BlogMessages }) {
  const { ref, isVisible } = useScrollReveal()
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || post.tags.some((t) => t.includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const dateLocale = getLocaleTag(locale)
  const categoryLabel = (category: string) => messages.categoryLabels[category as keyof BlogMessages["categoryLabels"]] ?? category

  return (
    <section className="py-10 md:py-14 bg-white dark:bg-slate-950">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="relative max-w-md mx-auto mb-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={messages.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {blogCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20"
                  : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-500/30"
                  }`}
              >
                {categoryLabel(cat.id)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          <strong className="text-slate-900 dark:text-white">{messages.countTemplate.replace("{count}", String(filtered.length))}</strong>
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post, i) => (
            <Link
              key={post.slug}
              href={withLocalePathname(`/blog/${post.slug}`, locale)}
              className={`group bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${Math.min(i * 80, 400)}ms` }}
            >
              <div className="h-44 overflow-hidden">
                <Image src={post.image} alt={post.title} width={800} height={450} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" loading="lazy" quality={75} />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-md text-xs font-medium">
                    {categoryLabel(post.category)}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {post.readTime} {messages.readUnit}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-2 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {new Date(post.date).toLocaleDateString(dateLocale, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium group-hover:gap-2 transition-all">
                    {messages.read} <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">{messages.empty}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function BlogCTA({ messages }: { messages: BlogMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-16 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.08),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {messages.cta.title}
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          {messages.cta.description}
        </p>
        <a
          href={getWhatsAppLink("Hi Orvex, I found your blog helpful! I'd like to discuss a shoot.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
        >
          <MessageCircle size={20} /> {messages.cta.button}
        </a>
      </div>
    </section>
  )
}

export default function BlogPage() {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).blogPage

  return (
    <main>
      <BlogHero messages={messages} />
      <FeaturedPost locale={locale} messages={messages} />
      <BlogGrid locale={locale} messages={messages} />
      <BlogCTA messages={messages} />
    </main>
  )
}
