import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'
import type { Property, PropertyImage } from '@prisma/client'

type PropertyWithImages = Property & { images: PropertyImage[] }

export function PropertyCard({ property, priority = false }: { property: PropertyWithImages; priority?: boolean }) {
  const cover = property.images.find((img) => img.isCover) ?? property.images[0]
  const statusLabel = getStatusLabel(property.status)
  const statusColor = getStatusColor(property.status)

  return (
    <article className="property-card" style={{ position: 'relative' }}>
      <Link href={`/properties/${property.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        {/* Image */}
        <div className="property-card-img" style={{ position: 'relative' }}>
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt || property.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--light-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--mid-gray)', fontSize: '0.875rem' }}>No image</span>
            </div>
          )}
          {/* Status badge */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
            <span className={`badge ${statusColor}`}>{statusLabel}</span>
          </div>
          {property.featured && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <span className="badge" style={{ backgroundColor: 'var(--gold)', color: '#fff' }}>Featured</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--charcoal)', margin: 0, lineHeight: 1.2, flex: 1 }}>
              {property.title}
            </h3>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400, color: 'var(--charcoal)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
              {formatPrice(property.price)}
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 300, color: 'var(--warm-gray)', margin: '0 0 1rem', lineHeight: 1.4 }}>
            {property.address}, {property.city}, {property.state}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rule)' }}>
            {[
              { label: 'Bed', value: property.bedrooms },
              { label: 'Bath', value: property.bathrooms },
              { label: 'Sq Ft', value: property.squareFeet.toLocaleString() },
            ].map((item) => (
              <div key={item.label}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 400, color: 'var(--charcoal)' }}>{item.value}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginLeft: '0.3rem' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
