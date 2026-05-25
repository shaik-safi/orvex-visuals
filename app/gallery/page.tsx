"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Expand,
  Camera,
  MessageCircle,
} from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

// ============ DATA ============
type GalleryCategory = "all" | "wedding" | "pre-wedding" | "events" | "baby" | "portraits" | "cinematic"

interface GalleryImage {
  src: string
  alt: string
  category: GalleryCategory
  aspect: "tall" | "wide" | "square"
  width: number
  height: number
}

const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "wedding", label: "Weddings" },
  { id: "pre-wedding", label: "Pre-Wedding" },
  { id: "events", label: "Events" },
  { id: "baby", label: "Baby & Family" },
  { id: "portraits", label: "Portraits" },
  { id: "cinematic", label: "Cinematic" },
]

const galleryImages: GalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", alt: "Wedding ceremony couple exchange garlands", category: "wedding", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80", alt: "Candid wedding moment bride laughing", category: "wedding", aspect: "wide", width: 800, height: 450 },
  { src: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800&q=80", alt: "Pre-wedding couple at sunset location", category: "pre-wedding", aspect: "square", width: 800, height: 800 },
  { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", alt: "Church wedding aisle bridal entry", category: "wedding", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80", alt: "Engagement ring ceremony closeup", category: "events", aspect: "square", width: 800, height: 800 },
  { src: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80", alt: "Baby photoshoot themed props", category: "baby", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", alt: "Couple portrait golden hour", category: "pre-wedding", aspect: "wide", width: 800, height: 450 },
  { src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80", alt: "Cinematic videography behind scenes", category: "cinematic", aspect: "square", width: 800, height: 800 },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", alt: "Professional portrait headshot", category: "portraits", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", alt: "Birthday celebration colorful decorations", category: "events", aspect: "wide", width: 800, height: 450 },
  { src: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&q=80", alt: "Newborn baby sleeping peacefully", category: "baby", aspect: "square", width: 800, height: 800 },
  { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", alt: "Wedding reception grand decor", category: "wedding", aspect: "wide", width: 800, height: 450 },
  { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&q=80", alt: "Anniversary couple embrace", category: "events", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80", alt: "Sangeet dance celebration lights", category: "events", aspect: "square", width: 800, height: 800 },
  { src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80", alt: "Family portrait outdoor garden", category: "baby", aspect: "wide", width: 800, height: 450 },
  { src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80", alt: "Cinematic wedding highlight film", category: "cinematic", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80", alt: "Maternity shoot elegant draping", category: "baby", aspect: "square", width: 800, height: 800 },
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", alt: "Corporate event stage conference", category: "portraits", aspect: "wide", width: 800, height: 450 },
  { src: "https://images.unsplash.com/photo-1604604557904-d661e0b3c02d?w=800&q=80", alt: "Mehendi ceremony close up hands", category: "events", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80", alt: "Drone aerial shot wedding venue", category: "cinematic", aspect: "wide", width: 800, height: 450 },
  { src: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=800&q=80", alt: "Naming ceremony celebration baby", category: "baby", aspect: "square", width: 800, height: 800 },
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", alt: "Housewarming ceremony rituals", category: "events", aspect: "tall", width: 800, height: 1200 },
  { src: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80", alt: "Pre-wedding couple dancing in rain", category: "pre-wedding", aspect: "tall", width: 600, height: 900 },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", alt: "Traditional wedding rituals fire", category: "wedding", aspect: "square", width: 600, height: 600 },
]

// ============ LIGHTBOX ============
function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [onClose, onPrev, onNext])

  const current = images[currentIndex]

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
        <X size={24} />
      </button>

      <div className="absolute top-5 left-5 text-white/60 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
        <ChevronLeft size={28} />
      </button>

      <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
        <ChevronRight size={28} />
      </button>

      <div className="max-w-[90vw] max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
        <Image
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          sizes="90vw"
          quality={90}
          priority
        />
        <p className="text-center text-white/60 text-sm mt-3">{current.alt}</p>
      </div>
    </div>
  )
}

// ============ HERO ============
function GalleryHero() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section className="pt-32 pb-10 md:pt-40 md:pb-14 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div ref={ref} className={`max-w-4xl mx-auto px-4 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="inline-block bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          Our Portfolio
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[0.95] mb-6">
          Stories We&apos;ve{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Captured</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          A glimpse into the moments, emotions, and celebrations we&apos;ve had the privilege to document.
        </p>
      </div>
    </section>
  )
}

// ============ GALLERY GRID ============
function GalleryGrid() {
  const { ref, isVisible } = useScrollReveal()
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = galleryImages.filter(
    (img) => activeCategory === "all" || img.category === activeCategory
  )

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null))
  }, [filtered.length])
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filtered.length : null))
  }, [filtered.length])

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-slate-950 transition-colors">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className={`mb-8 flex flex-wrap justify-center gap-2 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20"
                : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-500/30"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
          <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> photos
        </p>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3 [content-visibility:auto] [contain-intrinsic-block-size:500px]">
          {filtered.map((image, i) => (
            <div
              key={`${image.src}-${i}`}
              className={`break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${Math.min(i * 50, 400)}ms` }}
              onClick={() => openLightbox(i)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${image.aspect === "tall" ? "h-80 sm:h-96" : image.aspect === "wide" ? "h-48 sm:h-56" : "h-60 sm:h-72"
                  }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                {...(i < 4 ? { priority: true } : { loading: "lazy" as const })}
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium line-clamp-1">{image.alt}</p>
                  <p className="text-white/60 text-xs mt-0.5 capitalize">{image.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Expand size={14} className="text-white" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Camera size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </section>
  )
}

// ============ CTA ============
function GalleryCTA() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} className={`py-20 relative overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(245,158,11,0.08),transparent)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Want Your Story in Our Gallery?
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          Let&apos;s create stunning visuals for your special moments. Book a session today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/919845332306?text=Hi%20Orvex,%20I%20loved%20your%20gallery!%20I'd%20like%20to%20book%20a%20shoot."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
          >
            <MessageCircle size={20} /> Book a Shoot
          </a>
          <a
            href="/services"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
          >
            View Services <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default function GalleryPage() {
  return (
    <main>
      <GalleryHero />
      <GalleryGrid />
      <GalleryCTA />
    </main>
  )
}
