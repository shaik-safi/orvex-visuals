import type { Metadata } from "next"
import type React from "react"
import { getBlogPost, blogPosts } from "../data"
import { buildLocalizedMetadata } from "@/lib/i18n/metadata"
import { resolveRequestLocale } from "@/lib/i18n/resolve-locale"

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveRequestLocale()
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return buildLocalizedMetadata(locale, {
      pathname: `/blog/${slug}`,
      title: locale === "hi" ? "पोस्ट नहीं मिली" : "Post Not Found",
      description: locale === "hi"
        ? "आप जिस ब्लॉग पोस्ट को खोज रहे हैं वह उपलब्ध नहीं है।"
        : "The blog post you are looking for does not exist.",
    })
  }

  const title = post.title
  const description = post.excerpt

  return buildLocalizedMetadata(locale, {
    pathname: `/blog/${slug}`,
    title,
    description,
    keywords: [
      ...post.tags,
      "photography blog",
      "Bangalore photographer",
      "Orvex Visuals",
    ],
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      images: [post.image],
    },
  })
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
