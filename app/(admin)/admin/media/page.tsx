import { prisma } from '@/lib/prisma'
import { Newspaper } from 'lucide-react'

export default async function AdminMediaPage() {
  const mediaMentions = await prisma.mediaMention.findMany({} as any)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Media &amp; Press</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: '0.25rem 0 0' }}>
            {mediaMentions.length} media mentions
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: 0 }}>
          Media &amp; press content is managed via the mock data file at <code style={{ backgroundColor: '#f4f4f2', padding: '0.1rem 0.3rem' }}>lib/mock-data.ts</code>.
          Connect a real database to enable full CRUD management.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mediaMentions.map((m: any) => (
          <div key={m.id} style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(184,151,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Newspaper size={16} style={{ color: 'var(--gold)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
                {m.publication}
              </div>
              {m.headline && (
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', marginBottom: '0.25rem' }}>
                  {m.headline}
                </div>
              )}
              {m.date && (
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#9B948E' }}>
                  {new Date(m.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>
            {m.url && (
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid var(--light-gray)', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                View Article ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
