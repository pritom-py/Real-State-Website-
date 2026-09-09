'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { Testimonial } from '@prisma/client'

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  const t = testimonials[current]

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: 'var(--charcoal)', color: 'var(--ivory)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(184,151,90,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

      <div className="container-narrow" style={{ position: 'relative', textAlign: 'center' }}>
        <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1.5rem' }}>Client Testimonials</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', marginBottom: '3rem' }}>
          What Clients <em>Say</em>
        </h2>

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '2.5rem' }}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={16} fill="var(--gold)" stroke="none" />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(248,245,240,0.85)', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              "{t.review}"
            </blockquote>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--ivory)', marginBottom: '0.25rem' }}>
                {t.clientName}
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                {t.transactionType}{t.location ? ` · ${t.location}` : ''}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '3rem' }}>
            <button
              onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous testimonial"
              style={{ background: 'none', border: '1px solid rgba(248,245,240,0.2)', color: 'rgba(248,245,240,0.6)', cursor: 'pointer', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--gold)'); (e.currentTarget.style.color = 'var(--gold)') }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(248,245,240,0.2)'); (e.currentTarget.style.color = 'rgba(248,245,240,0.6)') }}
            >
              <ChevronLeft size={18} />
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{ width: i === current ? '24px' : '6px', height: '6px', backgroundColor: i === current ? 'var(--gold)' : 'rgba(248,245,240,0.25)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
              aria-label="Next testimonial"
              style={{ background: 'none', border: '1px solid rgba(248,245,240,0.2)', color: 'rgba(248,245,240,0.6)', cursor: 'pointer', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--gold)'); (e.currentTarget.style.color = 'var(--gold)') }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(248,245,240,0.2)'); (e.currentTarget.style.color = 'rgba(248,245,240,0.6)') }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
