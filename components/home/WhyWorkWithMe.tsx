'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const pillars = [
  {
    number: '01',
    title: 'Market Intelligence',
    description: 'Deep, proprietary knowledge of every micro-market across Los Angeles. I track trends, off-market activity, and buyer sentiment continuously — so my clients always have an edge.',
  },
  {
    number: '02',
    title: 'Strategic Negotiation',
    description: 'Every transaction is a negotiation. I bring 18 years of experience, forensic preparation, and calm under pressure to secure the best possible outcome — whether buying or selling.',
  },
  {
    number: '03',
    title: 'Private Access',
    description: 'Approximately 40% of the transactions I facilitate never appear on the public market. My network of brokers, family offices, and principals provides access that most buyers never see.',
  },
  {
    number: '04',
    title: 'Exceptional Marketing',
    description: 'When I represent a seller, your property receives the same curatorial attention as a museum exhibition. Professional photography, editorial videography, bespoke print materials, and global distribution.',
  },
  {
    number: '05',
    title: 'Personal Representation',
    description: 'You will speak with me — not a team, not an assistant — throughout every phase of the transaction. I am accountable to you, and I take that responsibility seriously.',
  },
]

export function WhyWorkWithMe() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--charcoal)', color: 'var(--ivory)' }} ref={ref}>
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: '540px', marginBottom: '4rem' }}
        >
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Why Choose Alexandra</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: 0 }}>
            The Difference That <em>Defines</em> the Result
          </h2>
        </motion.div>

        {/* Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0' }}>
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{
                padding: '2.5rem 2rem',
                borderLeft: '1px solid rgba(248,245,240,0.1)',
                borderTop: '1px solid rgba(248,245,240,0.1)',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(184,151,90,0.07)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            >
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 300, color: 'rgba(184,151,90,0.3)', lineHeight: 1, marginBottom: '1.5rem' }}>
                {pillar.number}
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ivory)', marginBottom: '1rem' }}>
                {pillar.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(248,245,240,0.55)', lineHeight: 1.75, margin: 0 }}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          section > div > div:last-child { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 720px) {
          section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
