'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { PropertyCard } from '@/components/property/PropertyCard'
import { ArrowRight } from 'lucide-react'
import type { Property, PropertyImage } from '@prisma/client'

type PropertyWithImages = Property & { images: PropertyImage[] }

export function FeaturedProperties({ properties }: { properties: PropertyWithImages[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--ivory)' }} ref={ref}>
      <div className="container-wide">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Featured Listings</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, margin: 0 }}>
              Exceptional Properties,<br /><em>Carefully Selected</em>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link href="/properties" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View All Properties
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {properties.slice(0, 3).map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              <PropertyCard property={property} priority={i === 0} />
            </motion.div>
          ))}
        </div>

        {properties.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--warm-gray)' }}>
            <p>No featured properties at this time. Please check back soon.</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 960px) {
          section > div > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
