'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { formatDate, truncate } from '@/lib/utils'
import type { Insight, Category } from '@prisma/client'

type InsightWithCategory = Insight & { category: Category | null }

export function InsightsSection({ insights }: { insights: InsightWithCategory[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--ivory)', borderTop: '1px solid var(--rule)' }} ref={ref}>
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Market Intelligence</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, margin: 0 }}>
              Insights & <em>Perspectives</em>
            </h2>
          </motion.div>
          <Link href="/insights" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            All Articles <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {insights.map((insight, i) => (
            <motion.article
              key={insight.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              <Link href={`/insights/${insight.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', aspectRatio: i === 0 ? '16/10' : '4/3', overflow: 'hidden', marginBottom: '1.25rem', backgroundColor: 'var(--light-gray)' }}>
                  <Image
                    src={insight.coverImage}
                    alt={insight.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }}
                    className="insight-img"
                  />
                </div>
                {insight.category && (
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.625rem' }}>
                    {insight.category.name}
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: i === 0 ? '1.5rem' : '1.125rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.625rem', lineHeight: 1.25, transition: 'color 0.3s' }} className="insight-title">
                  {insight.title}
                </h3>
                {i === 0 && (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                    {truncate(insight.excerpt, 140)}
                  </p>
                )}
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 400, color: 'var(--mid-gray)' }}>
                  {insight.publishedAt ? formatDate(insight.publishedAt) : ''} · {insight.readTime} min read
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        article:hover .insight-img { transform: scale(1.04) !important; }
        article:hover .insight-title { color: var(--gold) !important; }
        @media (max-width: 900px) {
          section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
