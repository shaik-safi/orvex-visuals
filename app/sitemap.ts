import type { MetadataRoute } from "next"
import { services } from "./services/data"
import { blogPosts } from "./blog/data"
import { SUPPORTED_LOCALES } from "@/lib/i18n/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://orvexvisuals.com"
  const staticPaths = ["/", "/services", "/pricing", "/gallery", "/about", "/contact", "/blog", "/privacy-policy", "/terms"] as const

  const staticPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? "weekly" : path === "/privacy-policy" || path === "/terms" ? "yearly" : path === "/about" || path === "/contact" ? "monthly" : "weekly",
      priority: path === "/" ? 1.0 : path === "/services" || path === "/pricing" ? 0.9 : path === "/gallery" || path === "/blog" || path === "/contact" ? 0.8 : path === "/about" ? 0.7 : 0.3,
    }))
  )

  const servicePages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    services.map((s) => ({
      url: `${baseUrl}/${locale}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  )

  const blogPages: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
    blogPosts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  )

  return [...staticPages, ...servicePages, ...blogPages]
}
