import type { Metadata } from "next"
import type React from "react"
import { getBlogPost, blogPosts } from "../data"

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you are looking for does not exist.",
    }
  }

  const title = post.title
  const description = post.excerpt

  return {
    title,
    description,
    keywords: [
      ...post.tags,
      "photography blog",
      "Bangalore photographer",
      "Orvex Visuals",
    ],
    authors: [{ name: post.author }],
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://orvexvisuals.com/blog/${slug}`,
      siteName: "Orvex Visuals",
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
      card: "summary_large_image",
      title,
      description,
      images: [post.image],
    },
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
