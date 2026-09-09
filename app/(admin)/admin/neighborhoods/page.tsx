import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default async function AdminNeighborhoodsPage() {
  const neighborhoods = await prisma.neighborhood.findMany({ orderBy: { name: 'asc' } } as any)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Neighborhoods</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: '0.25rem 0 0' }}>
            {neighborhoods.length} neighborhoods configured
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: 0 }}>
          Neighborhood content is managed via the mock data file at <code style={{ backgroundColor: '#f4f4f2', padding: '0.1rem 0.3rem' }}>lib/mock-data.ts</code>.
          Connect a real database to enable full CRUD management.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {neighborhoods.map((n: any) => (
          <div key={n.id} style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(184,151,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={16} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>
                  {n.name}
                </div>
                {n.tagline && (
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
                    {n.tagline}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                href={`/neighborhoods/${n.slug}`}
                target="_blank"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid var(--light-gray)' }}
              >
                View Page ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
