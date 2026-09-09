import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Alexandra Voss | Beverly Hills Luxury Real Estate Advisor',
  description: 'Alexandra Voss — 18 years of expertise, $2.4 billion in career sales, and an uncompromising commitment to her clients. Learn more about Beverly Hills\'s premier luxury real estate advisor.',
}

export default async function AboutPage() {
  const [broker, awards, media] = await Promise.all([
    prisma.brokerProfile.findFirst(),
    prisma.award.findMany({ orderBy: { year: 'desc' } }),
    prisma.mediaMention.findMany({ where: { featured: true }, orderBy: { date: 'desc' } }),
  ])

  if (!broker) return null

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ backgroundColor: 'var(--charcoal)', padding: '7rem 0 0', overflow: 'hidden' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'flex-end' }}>
            <div style={{ paddingBottom: '4rem' }}>
              <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>About</div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: '0 0 1.25rem' }}>
                {broker.name}
              </h1>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
                {broker.title}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'rgba(248,245,240,0.7)', lineHeight: 1.8, maxWidth: '480px' }}>
                {broker.shortBio}
              </p>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <div style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
                <Image src={broker.photo} alt={broker.photoAlt || broker.name} fill sizes="50vw" style={{ objectFit: 'cover', objectPosition: 'top' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biography */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--rule)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '4rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>Biography</div>
              <div style={{ width: '30px', height: '1px', backgroundColor: 'var(--gold)' }} />
            </div>
            <div>
              {broker.bio.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ backgroundColor: 'var(--charcoal)', padding: '5rem 0' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1.5rem' }}>Philosophy</div>
          <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(248,245,240,0.88)', lineHeight: 1.65, margin: 0 }}>
            "{broker.philosophy}"
          </blockquote>
          <div style={{ marginTop: '2rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            — {broker.name}
          </div>
        </div>
      </section>

      {/* Awards & Credentials */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--rule)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '4rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>Awards & Credentials</div>
              <div style={{ width: '30px', height: '1px', backgroundColor: 'var(--gold)' }} />
            </div>
            <div>
              {awards.map((award) => (
                <div key={award.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--rule)' }}>
                  <div style={{ flexShrink: 0 }}>
                    <CheckCircle size={20} style={{ color: 'var(--gold)', marginTop: '2px' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>{award.title}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', color: 'var(--warm-gray)' }}>{award.issuer} · {award.year}</div>
                    {award.description && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', margin: '0.5rem 0 0', lineHeight: 1.6 }}>{award.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding" style={{ backgroundColor: 'var(--warm-white)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '4rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>Service Areas</div>
              <div style={{ width: '30px', height: '1px', backgroundColor: 'var(--gold)' }} />
            </div>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {broker.serviceAreas.map((area) => (
                  <span key={area} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--charcoal)', padding: '0.5rem 1.25rem', border: '1px solid var(--light-gray)', backgroundColor: 'var(--ivory)' }}>
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media */}
      {media.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '4rem' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>As Featured In</div>
                <div style={{ width: '30px', height: '1px', backgroundColor: 'var(--gold)' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                {media.map((m) => (
                  <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer" className="hover-invert" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, color: 'var(--charcoal)', textDecoration: 'none', padding: '0.75rem 1.5rem', border: '1px solid var(--rule)', transition: 'all 0.3s' }}>
                    {m.publication}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--charcoal)', padding: '5rem 0' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Work Together</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', marginBottom: '1.25rem' }}>
            Begin the Conversation
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: 'rgba(248,245,240,0.65)', marginBottom: '2.5rem' }}>
            Whether buying, selling, or simply exploring your options, I welcome the opportunity to be of service.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-gold">Schedule a Consultation</Link>
            <Link href="/properties" className="btn-ghost">View Properties</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 200px 1fr"] { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
