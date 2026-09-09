'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Bed, Bath, Maximize } from 'lucide-react'
import { formatPrice, formatSqFt, getStatusLabel } from '@/lib/utils'
import type { Property, PropertyImage } from '@prisma/client'

type PropertyWithImages = Property & { images: PropertyImage[] }

export function SignatureListing({ property }: { property: PropertyWithImages | null }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  if (!property) return null

  const cover = property.images.find((img) => img.isCover) ?? property.images[0]

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--ivory)', overflow: 'hidden' }} ref={ref}>
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Signature Property</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, margin: 0 }}>
            The Defining <em>Listing</em>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}
          >
            {cover && (
              <Image
                src={cover.url}
                alt={cover.alt || property.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                style={{ objectFit: 'cover' }}
              />
            )}
            {/* Status badge overlay */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', backgroundColor: 'rgba(10,10,10,0.75)', padding: '0.5rem 1rem' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                {getStatusLabel(property.status)}
              </span>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.75rem' }}>
              {property.city}, {property.state}
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '0.75rem', lineHeight: 1.15 }}>
              {property.title}
            </h3>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, color: 'var(--gold)', marginBottom: '1.5rem' }}>
              {formatPrice(property.price)}
            </div>

            <div className="rule-h" style={{ marginBottom: '1.5rem' }} />

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {property.description.slice(0, 280)}…
            </p>

            {/* Specs row */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bed size={14} style={{ color: 'var(--warm-gray)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--charcoal)' }}>{property.bedrooms} Bed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bath size={14} style={{ color: 'var(--warm-gray)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--charcoal)' }}>{property.bathrooms} Bath</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Maximize size={14} style={{ color: 'var(--warm-gray)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--charcoal)' }}>{formatSqFt(property.squareFeet)} Sq Ft</span>
              </div>
            </div>

            <Link href={`/properties/${property.slug}`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              View Property
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div:last-child { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  )
}
