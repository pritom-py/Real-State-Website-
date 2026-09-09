'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { PropertyImage } from '@prisma/client'

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) return null

  const cover = images[0]
  const thumbs = images.slice(1, 5)
  const hasMore = images.length > 5

  return (
    <>
      {/* Gallery Grid */}
      <div className="container-wide" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '4px', height: '540px' }}>
          {/* Main image */}
          <div
            style={{ gridRow: '1 / 3', position: 'relative', overflow: 'hidden', cursor: 'zoom-in', backgroundColor: 'var(--light-gray)' }}
            onClick={() => { setCurrentIndex(0); setLightboxOpen(true) }}
          >
            <Image src={cover.url} alt={cover.alt || title} fill sizes="50vw" style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }} className="gallery-main-img" />
          </div>

          {/* Thumbnails */}
          {thumbs.map((img, i) => (
            <div
              key={img.id}
              style={{ position: 'relative', overflow: 'hidden', cursor: 'zoom-in', backgroundColor: 'var(--light-gray)' }}
              onClick={() => { setCurrentIndex(i + 1); setLightboxOpen(true) }}
            >
              <Image src={img.url} alt={img.alt || title} fill sizes="25vw" style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }} className="gallery-thumb-img" />
              {/* Show all overlay on last thumb */}
              {i === 3 && hasMore && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ZoomIn size={24} style={{ color: '#fff', marginBottom: '0.5rem' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, color: '#fff', letterSpacing: '0.1em' }}>
                    +{images.length - 5} More
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* View all button */}
          <button
            onClick={() => { setCurrentIndex(0); setLightboxOpen(true) }}
            style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(248,245,240,0.92)', border: 'none', padding: '0.625rem 1rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', backdropFilter: 'blur(4px)' }}
          >
            <ZoomIn size={14} /> View All {images.length} Photos
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <div style={{ position: 'relative', width: '90vw', maxWidth: '1200px', aspectRatio: '16/10' }} onClick={e => e.stopPropagation()}>
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || title}
              fill
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />

            {/* Controls */}
            <button onClick={() => setCurrentIndex((c) => (c - 1 + images.length) % images.length)} aria-label="Previous" style={{ position: 'absolute', left: '-4rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentIndex((c) => (c + 1) % images.length)} aria-label="Next" style={{ position: 'absolute', right: '-4rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronRight size={20} />
            </button>
            <button onClick={() => setLightboxOpen(false)} aria-label="Close" style={{ position: 'absolute', top: '-4rem', right: 0, background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            {/* Counter */}
            <div style={{ position: 'absolute', bottom: '-3rem', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-main-img:hover, .gallery-thumb-img:hover { transform: scale(1.03) !important; }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; height: auto !important; grid-template-rows: auto !important; }
        }
      `}</style>
    </>
  )
}
