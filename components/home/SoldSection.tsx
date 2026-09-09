'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { formatPrice, formatShortDate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { Property, PropertyImage } from '@prisma/client'

type PropertyWithImages = Property & { images: PropertyImage[] }

export function SoldSection({ properties }: { properties: PropertyWithImages[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--warm-white)', borderTop: '1px solid var(--rule)' }} ref={ref}>
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Proven Results</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, margin: 0 }}>
              Sold <em>Portfolio</em>
            </h2>
          </motion.div>
          <Link href="/sold" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View All Sold <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {properties.slice(0, 4).map((property, i) => {
            const cover = property.images.find((img) => img.isCover) ?? property.images[0]
            return (
              <motion.article
                key={property.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              >
                <Link href={`/properties/${property.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', marginBottom: '1rem', backgroundColor: 'var(--light-gray)' }}>
                    {cover && (
                      <Image
                        src={cover.url}
                        alt={cover.alt || property.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }}
                        onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.04)' }}
                        onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
                      />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 50%)' }} />
                    <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 300, color: '#fff' }}>
                        {property.soldPrice ? formatPrice(property.soldPrice) : formatPrice(property.price)}
                      </div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                        Sold {property.soldDate ? formatShortDate(property.soldDate) : ''}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--charcoal)', margin: '0 0 0.25rem' }}>
                      {property.title}
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--warm-gray)', margin: 0 }}>
                      {property.city}, {property.state}
                    </p>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > div > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
