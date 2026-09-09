'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useCountUp } from '@/lib/hooks/useCountUp'

const stats = [
  { value: 18, suffix: '+', label: 'Years of Experience', description: 'Decades of mastery in the Los Angeles luxury market' },
  { value: 2.4, suffix: 'B+', prefix: '$', label: 'Career Sales Volume', description: 'In total transactions across premier LA communities' },
  { value: 847, suffix: '+', label: 'Transactions Closed', description: 'Properties sold with precision and discretion' },
  { value: 8, suffix: '', label: 'Areas Served', description: 'From Beverly Hills to Malibu\'s coastline' },
]

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}
    >
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        {stat.prefix}{inView ? stat.value : 0}{stat.suffix}
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
        {stat.label}
      </div>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', margin: 0, lineHeight: 1.6 }}>
        {stat.description}
      </p>
    </motion.div>
  )
}

export function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{ backgroundColor: 'var(--warm-white)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', position: 'relative' }}>
          {stats.map((stat, i) => (
            <div key={stat.label} style={{ borderRight: i < stats.length - 1 ? '1px solid var(--rule)' : 'none' }}>
              <StatItem stat={stat} index={i} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          section > div > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          section > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
