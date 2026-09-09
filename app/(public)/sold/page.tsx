import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatSqFt, formatShortDate, getPropertyTypeLabel } from '@/lib/utils'
import { Bed, Bath, Maximize } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sold Portfolio | Alexandra Voss Real Estate',
  description: 'A portfolio of sold properties representing Alexandra Voss\'s track record across Beverly Hills, Bel-Air, Malibu, and Los Angeles\'s most coveted communities.',
}

export default async function SoldPage() {
  const properties = await prisma.property.findMany({
    where: { status: 'SOLD' },
    include: { images: { orderBy: { order: 'asc' } } },
    orderBy: { soldDate: 'desc' },
  })

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ backgroundColor: 'var(--charcoal)', color: 'var(--ivory)', padding: '7rem 0 4rem' }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Proven Results</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: '0 0 1rem' }}>Sold Portfolio</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'rgba(248,245,240,0.65)', maxWidth: '540px', margin: 0, lineHeight: 1.7 }}>
            A curated record of exceptional transactions across Los Angeles's most sought-after communities.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ backgroundColor: 'var(--warm-white)', borderBottom: '1px solid var(--rule)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '4rem', padding: '2rem 0', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)' }}>{properties.length}+</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Properties Sold</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)' }}>$2.4B+</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Total Volume</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)' }}>98.2%</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>List-to-Sale Ratio</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--charcoal)' }}>18</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>Avg. Days on Market</div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container-wide" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        {properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--warm-gray)' }}>
            <p>No sold properties to display at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {properties.map((property) => {
              const cover = property.images.find((img) => img.isCover) ?? property.images[0]
              return (
                <Link key={property.id} href={`/properties/${property.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <article style={{ backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)' }}>
                    <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: 'var(--light-gray)' }}>
                      {cover && (
                        <Image src={cover.url} alt={cover.alt || property.title} fill sizes="(max-width: 960px) 50vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }} className="sold-img" />
                      )}
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'var(--charcoal)', padding: '0.3rem 0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ivory)' }}>Sold</span>
                      </div>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '1rem' }}>
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--charcoal)', margin: '0 0 0.2rem' }}>
                            {property.address}
                          </h3>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--warm-gray)', margin: 0 }}>
                            {property.city}, {property.state}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                            {property.soldPrice ? formatPrice(property.soldPrice) : formatPrice(property.price)}
                          </div>
                          {property.soldDate && (
                            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', color: 'var(--warm-gray)', letterSpacing: '0.08em' }}>
                              {formatShortDate(property.soldDate)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="rule-h" style={{ margin: '0.875rem 0' }} />
                      <div style={{ display: 'flex', gap: '1.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
                          <Bed size={12} /> {property.bedrooms} Bed
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
                          <Bath size={12} /> {property.bathrooms} Bath
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
                          <Maximize size={12} /> {formatSqFt(property.squareFeet)} sqft
                        </span>
                      </div>
                      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>
                          {getPropertyTypeLabel(property.propertyType)}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                          {property.representedAs === 'SELLERS_AGENT' ? 'Seller\'s Agent' : property.representedAs === 'BUYERS_AGENT' ? 'Buyer\'s Agent' : 'Dual Agent'}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        article:hover .sold-img { transform: scale(1.04) !important; }
        @media (max-width: 960px) { div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
