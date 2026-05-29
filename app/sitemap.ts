import type { MetadataRoute } from "next"

import { blogPosts } from "@/app/blog/data"
import { services } from "@/app/services/data"
import { DOMAIN } from "@/lib/constants"
import { SUPPORTED_LOCALES } from "@/lib/i18n/config"
import { withLocalePathname } from "@/lib/i18n/routing"

const STATIC_PATHS = [
  "/",
  "/about",
  "/blog",
  "/book",
  "/contact",
  "/gallery",
  "/pricing",
  "/privacy",
  "/services",
  "/terms",
] as const

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, DOMAIN).toString()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const localizedStaticRoutes = SUPPORTED_LOCALES.flatMap((locale) =>
    STATIC_PATHS.map((pathname) => ({
      url: toAbsoluteUrl(withLocalePathname(pathname, locale)),
      lastModified,
    }))
  )

  const localizedBlogRoutes = SUPPORTED_LOCALES.flatMap((locale) =>
    blogPosts.map((post) => ({
      url: toAbsoluteUrl(withLocalePathname(`/blog/${post.slug}`, locale)),
      lastModified: new Date(post.date),
    }))
  )

  const localizedServiceRoutes = SUPPORTED_LOCALES.flatMap((locale) =>
    services.map((service) => ({
      url: toAbsoluteUrl(withLocalePathname(`/services/${service.slug}`, locale)),
      lastModified,
    }))
  )

  return [...localizedStaticRoutes, ...localizedBlogRoutes, ...localizedServiceRoutes]
}
