import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowRight, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Neighborhoods | Alexandra Voss Real Estate',
  description: 'Explore Beverly Hills, Bel-Air, Malibu, Pacific Palisades, and other prestigious Los Angeles communities with Alexandra Voss.',
}

export default async function NeighborhoodsPage() {
  const neighborhoods = await prisma.neighborhood.findMany({
    orderBy: { featured: 'desc' },
    include: {
      _count: { select: { properties: true } },
    },
  })

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--charcoal)', padding: '7rem 0 4rem' }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Areas of Expertise</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: 0 }}>Neighborhoods</h1>
        </div>
      </div>

      <div className="container-wide" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', backgroundColor: 'var(--light-gray)' }}>
          {neighborhoods.map((n, i) => (
            <Link key={n.id} href={`/neighborhoods/${n.slug}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--ivory)' }}>
              <article>
                <div style={{ position: 'relative', aspectRatio: i < 2 ? '4/3' : '4/3', overflow: 'hidden' }}>
                  <Image src={n.heroImage} alt={n.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }} className="nbhd-img" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.1) 55%)' }} />
                  <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.625rem', fontWeight: 300, color: '#fff', margin: '0 0 0.5rem' }}>{n.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.7)' }}>
                      <MapPin size={12} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {(n as any)._count?.properties ?? 0} Properties
                      </span>
                    </div>
                  </div>
                  {n.featured && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff', padding: '0.3rem 0.75rem' }}>Featured</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.7, margin: '0 0 1rem' }}>
                    {n.description.slice(0, 160)}…
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    Explore <ArrowRight size={11} />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        article:hover .nbhd-img { transform: scale(1.04) !important; }
        @media (max-width: 900px) { div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 540px) { div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
