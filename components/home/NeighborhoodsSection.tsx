'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Neighborhood } from '@prisma/client'

export function NeighborhoodsSection({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--ivory)' }} ref={ref}>
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Areas of Expertise</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, margin: 0 }}>
            Los Angeles's Finest <em>Communities</em>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {neighborhoods.slice(0, 3).map((n, i) => (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
            >
              <Link href={`/neighborhoods/${n.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <Image
                    src={n.heroImage}
                    alt={n.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                    className="neighborhood-img"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.1) 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '2rem', left: '1.5rem', right: '1.5rem' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.625rem', fontWeight: 300, color: '#fff', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                      {n.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                        Explore
                      </span>
                      <ArrowRight size={11} style={{ color: 'var(--gold-light)' }} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}
        >
          <Link href="/neighborhoods" className="btn-outline">
            All Neighborhoods
          </Link>
        </motion.div>
      </div>

      <style>{`
        article:hover .neighborhood-img { transform: scale(1.04) !important; }
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
