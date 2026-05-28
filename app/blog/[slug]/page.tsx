"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  ChevronRight,
  Tag,
  Share2,
} from "lucide-react"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCurrentLocale } from "@/hooks/use-current-locale"
import { getWhatsAppLink } from "@/lib/constants"
import { getLocaleTag } from "@/lib/i18n/config"
import { getPageMessages } from "@/lib/i18n/pages"
import { withLocaleHref, withLocalePathname } from "@/lib/i18n/routing"
import { buildPricingHandoffHref, getBlogPricingHandoff } from "@/lib/pricing-handoff"
import { getBlogPost, getRelatedPosts, type BlogPost } from "../data"

type BlogPostMessages = ReturnType<typeof getPageMessages>["blogPostPage"]
type BlogPageMessages = ReturnType<typeof getPageMessages>["blogPage"]

function Breadcrumb({ title, locale, messages }: { title: string; locale: ReturnType<typeof useCurrentLocale>; messages: BlogPostMessages }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
      <Link href={withLocalePathname("/", locale)} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{messages.breadcrumbs.home}</Link>
      <ChevronRight size={12} />
      <Link href={withLocalePathname("/blog", locale)} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">{messages.breadcrumbs.blog}</Link>
      <ChevronRight size={12} />
      <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px] sm:max-w-none">{title}</span>
    </div>
  )
}

function ArticleHero({
  post,
  locale,
  messages,
  blogMessages,
}: {
  post: BlogPost
  locale: ReturnType<typeof useCurrentLocale>
  messages: BlogPostMessages
  blogMessages: BlogPageMessages
}) {
  const dateLocale = getLocaleTag(locale)
  const categoryLabel = blogMessages.categoryLabels[post.category as keyof BlogPageMessages["categoryLabels"]] ?? post.category

  return (
    <section className="pt-28 pb-4 md:pt-36 md:pb-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumb title={post.title} locale={locale} messages={messages} />

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold uppercase">
            {categoryLabel}
          </span>
          <span className="text-sm text-slate-400 flex items-center gap-1.5"><Clock size={14} /> {post.readTime} {messages.meta.readUnit}</span>
          <span className="text-sm text-slate-400 flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.date).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-5">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            OV
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{post.author}</p>
            <p className="text-xs text-slate-400">{messages.meta.expertRole}</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30">
          <Image src={post.image} alt={post.title} width={800} height={450} className="w-full h-56 sm:h-72 md:h-96 object-cover" sizes="(max-width: 768px) 100vw, 66vw" loading="lazy" quality={75} />
        </div>
      </div>
    </section>
  )
}

function ArticleContent({ post, locale, messages }: { post: BlogPost; locale: ReturnType<typeof useCurrentLocale>; messages: BlogPostMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-10 md:py-14 bg-white dark:bg-slate-950 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <article
          className="prose prose-lg dark:prose-invert prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
            prose-li:text-slate-600 dark:prose-li:text-slate-300
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
            prose-table:text-sm prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:p-3 prose-td:p-3 prose-table:rounded-xl prose-table:overflow-hidden
            prose-ul:space-y-1 prose-ol:space-y-1
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={14} className="text-slate-400" />
            {post.tags.map((tag) => (
              <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href={withLocalePathname("/blog", locale)} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> {messages.backToBlog}
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href })
              } else {
                navigator.clipboard.writeText(window.location.href)
              }
            }}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition-colors"
          >
            <Share2 size={16} /> {messages.share}
          </button>
        </div>
      </div>
    </section>
  )
}

function RelatedPosts({
  currentSlug,
  locale,
  messages,
  blogMessages,
}: {
  currentSlug: string
  locale: ReturnType<typeof useCurrentLocale>
  messages: BlogPostMessages
  blogMessages: BlogPageMessages
}) {
  const { ref, isVisible } = useScrollReveal()
  const related = getRelatedPosts(currentSlug, 3)
  const categoryLabel = (category: string) => blogMessages.categoryLabels[category as keyof BlogPageMessages["categoryLabels"]] ?? category

  return (
    <section ref={ref} className={`py-12 md:py-16 bg-slate-50 dark:bg-slate-900 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          {messages.relatedTitle}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {related.map((post, i) => (
            <Link
              key={post.slug}
              href={withLocalePathname(`/blog/${post.slug}`, locale)}
              className={`group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="h-40 overflow-hidden">
                <Image src={post.image} alt={post.title} width={800} height={450} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 66vw" loading="lazy" quality={75} />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1 block">
                  {categoryLabel(post.category)}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <span className="mt-3 flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium group-hover:gap-2 transition-all">
                  {messages.relatedRead} <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function PostCTA({ post, locale, messages }: { post: BlogPost; locale: ReturnType<typeof useCurrentLocale>; messages: BlogPostMessages }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-14 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.08),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {messages.cta.title}
        </h2>
        <p className="text-slate-400 text-base mb-6 max-w-md mx-auto">
          {messages.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={withLocaleHref(buildPricingHandoffHref(getBlogPricingHandoff(post)), locale)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-3.5 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            {messages.cta.pricing} <ArrowRight size={18} />
          </Link>
          <a
            href={getWhatsAppLink(messages.cta.whatsappTemplate)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-7 py-3.5 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1"
          >
            <MessageCircle size={18} /> {messages.cta.whatsapp}
          </a>
        </div>
      </div>
    </section>
  )
}

function NotFound({ locale, messages }: { locale: ReturnType<typeof useCurrentLocale>; messages: BlogPostMessages }) {
  return (
    <section className="pt-40 pb-20 text-center">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{messages.notFound.title}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">{messages.notFound.description}</p>
      <Link href={withLocalePathname("/blog", locale)} className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium hover:underline">
        <ArrowLeft size={16} /> {messages.backToBlog}
      </Link>
    </section>
  )
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = useCurrentLocale()
  const messages = getPageMessages(locale).blogPostPage
  const blogMessages = getPageMessages(locale).blogPage
  const { slug } = use(params)
  const post = getBlogPost(slug)

  if (!post) {
    return (
      <main className="overflow-x-hidden">
        <NotFound locale={locale} messages={messages} />
      </main>
    )
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://orvexvisuals.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Orvex Visuals",
      url: "https://orvexvisuals.com",
      logo: {
        "@type": "ImageObject",
        url: "https://orvexvisuals.com/logo.png",
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `https://orvexvisuals.com/blog/${slug}`,
    keywords: post.tags.join(", "),
  }

  return (
    <main className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ArticleHero post={post} locale={locale} messages={messages} blogMessages={blogMessages} />
      <ArticleContent post={post} locale={locale} messages={messages} />
      <PostCTA post={post} locale={locale} messages={messages} />
      <RelatedPosts currentSlug={slug} locale={locale} messages={messages} blogMessages={blogMessages} />
    </main>
  )
}
