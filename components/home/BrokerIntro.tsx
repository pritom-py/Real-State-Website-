'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import type { BrokerProfile } from '@prisma/client'

export function BrokerIntro({ broker }: { broker: BrokerProfile | null }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  if (!broker) return null

  return (
    <section
      className="section-padding"
      ref={ref}
      style={{ backgroundColor: 'var(--warm-white)', overflow: 'hidden' }}
    >
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'relative' }}
          >
            <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
              <Image
                src={broker.photo}
                alt={broker.photoAlt || broker.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            {/* Floating accent */}
            <div style={{ position: 'absolute', bottom: '-1.5rem', right: '-1.5rem', width: '180px', height: '180px', border: '1px solid var(--gold)', zIndex: -1 }} />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>Personal Introduction</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '0.5rem' }}>
              {broker.name}
            </h2>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '2rem' }}>
              {broker.title}
            </div>

            <div className="rule-h" style={{ marginBottom: '2rem' }} />

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {broker.shortBio}
            </p>

            {broker.licenseNumber && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--mid-gray)', marginBottom: '2rem' }}>
                {broker.licenseNumber}
              </p>
            )}

            <Link href="/about" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Meet Alexandra
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  )
}
