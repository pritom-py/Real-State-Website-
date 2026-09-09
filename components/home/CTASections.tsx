'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export function ValuationCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '480px', display: 'flex', alignItems: 'center' }} ref={ref}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=2000&q=85"
          alt="Luxury home valuation"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          sizes="100vw"
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.72)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Complimentary Service</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#fff', marginBottom: '1.25rem' }}>
            What Is Your Home Worth?
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            Receive a comprehensive, confidential market analysis for your property — prepared personally by Alexandra. Understand your home's value in today's market.
          </p>
          <Link href="/valuation" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Request a Private Valuation
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export function ContactCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--warm-white)', borderTop: '1px solid var(--rule)' }} ref={ref}>
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>Begin Your Journey</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '1.25rem' }}>
            Let's Discuss Your <em>Goals</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
            Whether you're seeking the perfect property or considering a sale, I welcome the conversation. Reach out to begin a relationship built on trust, expertise, and results.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary">
              Schedule a Consultation
            </Link>
            <Link href="/properties" className="btn-outline">
              Browse Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
