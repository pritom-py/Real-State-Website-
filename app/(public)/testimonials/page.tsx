import type { Metadata } from 'next'
import Image from 'next/image'
import { getCachedAllTestimonials, getCachedMediaMentions } from '@/lib/cache'
import { Star, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Testimonials & Press | Alexandra Voss Real Estate',
  description: 'What clients say about working with Alexandra Voss — and where she has been featured in the press.',
}

export default async function TestimonialsPage() {
  const [testimonials, media] = await Promise.all([
    getCachedAllTestimonials(),
    getCachedMediaMentions(),
  ])

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ backgroundColor: 'var(--charcoal)', padding: '7rem 0 4rem' }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Client Stories</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: 0 }}>
            Testimonials & Press
          </h1>
        </div>
      </div>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>What Clients Say</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '3.5rem' }}>
            Trusted by the Most Discerning <em>Clients</em>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', backgroundColor: 'var(--light-gray)' }}>
            {testimonials.map((t) => (
              <div key={t.id} style={{ backgroundColor: 'var(--warm-white)', padding: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.5rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--gold)" stroke="none" />
                  ))}
                </div>
                <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--charcoal)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  "{t.review}"
                </blockquote>
                <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1rem' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>{t.clientName}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    {t.transactionType}{t.location ? ` · ${t.location}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media / Press */}
      {media.length > 0 && (
        <section className="section-padding" style={{ backgroundColor: 'var(--charcoal)', borderTop: '1px solid rgba(248,245,240,0.05)' }}>
          <div className="container-wide">
            <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '0.75rem' }}>Media</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', marginBottom: '3.5rem' }}>
              In the <em>Press</em>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'rgba(248,245,240,0.08)' }}>
              {media.map((m) => (
                <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer" className="media-link" style={{ display: 'block', padding: '2rem', textDecoration: 'none', transition: 'background-color 0.3s' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ivory)' }}>{m.publication}</div>
                    <ExternalLink size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginLeft: '0.5rem' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(248,245,240,0.7)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{m.title}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>{formatDate(m.date)}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 960px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
