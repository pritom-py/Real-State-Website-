'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        backgroundColor: '#0A0A0A',
      }}
      aria-label="Hero section"
    >
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2400&q=90"
          alt="Luxury estate exterior — Alexandra Voss Real Estate"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.15) 100%)' }} />
      </div>

      {/* Content */}
      <div className="container-wide" style={{ position: 'relative', zIndex: 1, paddingBottom: '7rem', paddingTop: '9rem', width: '100%' }}>
        <div style={{ maxWidth: '720px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1.5rem' }}>
              Beverly Hills · Bel-Air · Malibu · Pacific Palisades
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', fontWeight: 300, color: '#fff', lineHeight: 1.06, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}
          >
            An Uncompromising<br />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Standard</em> of Real<br />
            Estate Excellence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '480px' }}
          >
            Representing the finest properties across Los Angeles's most coveted communities. 18 years. $2.4 billion in career sales.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}
          >
            <Link href="/properties" className="btn-primary">
              Explore Properties
              <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Work With Me
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{ position: 'absolute', bottom: '2.5rem', right: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', writingMode: 'vertical-rl' }}>
            Scroll
          </span>
          <div style={{ width: '1px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', backgroundColor: 'var(--gold)' }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
