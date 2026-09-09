import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PropertyCard } from '@/components/property/PropertyCard'
import { CheckCircle, ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const n = await prisma.neighborhood.findUnique({ where: { slug } })
  if (!n) return { title: 'Neighborhood Not Found' }
  return {
    title: n.seoTitle || `${n.name} Real Estate | Alexandra Voss`,
    description: n.seoDescription || n.description.slice(0, 160),
  }
}

export default async function NeighborhoodDetailPage({ params }: PageProps) {
  const { slug } = await params
  const neighborhood = await prisma.neighborhood.findUnique({
    where: { slug },
    include: {
      properties: {
        where: { status: { not: 'SOLD' } },
        include: { images: { orderBy: { order: 'asc' } } },
        orderBy: { price: 'desc' },
        take: 6,
      },
    },
  })

  if (!neighborhood) notFound()

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '500px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Image src={neighborhood.heroImage} alt={neighborhood.name} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%)' }} />
        <div className="container-wide" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>
          <Link href="/neighborhoods" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.3s' }}>
            <ArrowLeft size={12} /> All Neighborhoods
          </Link>
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '0.75rem' }}>Los Angeles</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#fff', margin: 0, fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {neighborhood.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '4rem', alignItems: 'start' }}>
          {/* Main */}
          <div>
            {/* About */}
            <div style={{ marginBottom: '3rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Overview</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.85 }}>
                {neighborhood.description}
              </p>
            </div>

            {/* Lifestyle */}
            <div style={{ marginBottom: '3rem', padding: '2rem', backgroundColor: 'var(--warm-white)', borderLeft: '2px solid var(--gold)' }}>
              <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Lifestyle</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.8, margin: 0 }}>
                {neighborhood.lifestyle}
              </p>
            </div>

            {/* Market */}
            <div style={{ marginBottom: '3rem' }}>
              <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Market Overview</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.85 }}>
                {neighborhood.marketOverview}
              </p>
            </div>
          </div>

          {/* Sidebar — Highlights */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ backgroundColor: 'var(--charcoal)', padding: '1.75rem', color: 'var(--ivory)' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '1.25rem' }}>
                Neighborhood Highlights
              </div>
              {neighborhood.highlights.map((h) => (
                <div key={h} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                  <CheckCircle size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(248,245,240,0.8)', lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(248,245,240,0.1)' }}>
                <Link href="/contact" className="btn-gold" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
                  Inquire About {neighborhood.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties in this neighborhood */}
      {neighborhood.properties.length > 0 && (
        <div style={{ backgroundColor: 'var(--warm-white)', borderTop: '1px solid var(--rule)', padding: '4rem 0 5rem' }}>
          <div className="container-wide">
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Available in {neighborhood.name}</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '2.5rem' }}>Properties For Sale</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {neighborhood.properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 280px"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
