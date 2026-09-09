import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { AdminDeleteButton } from '@/components/admin/AdminDeleteButton'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default async function AdminPropertiesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams
  const where: any = {}
  if (params.status) where.status = params.status

  const properties = await prisma.property.findMany({
    where,
    include: { images: { where: { isCover: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Properties</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: '0.25rem 0 0' }}>{properties.length} total</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={14} /> Add Property
        </Link>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { value: '', label: 'All' },
          { value: 'FOR_SALE', label: 'For Sale' },
          { value: 'JUST_LISTED', label: 'Just Listed' },
          { value: 'UNDER_CONTRACT', label: 'Under Contract' },
          { value: 'SOLD', label: 'Sold' },
        ].map((opt) => (
          <Link key={opt.value} href={opt.value ? `/admin/properties?status=${opt.value}` : '/admin/properties'} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.4rem 1rem', border: '1px solid', borderColor: (params.status ?? '') === opt.value ? 'var(--charcoal)' : 'var(--light-gray)', backgroundColor: (params.status ?? '') === opt.value ? 'var(--charcoal)' : 'transparent', color: (params.status ?? '') === opt.value ? 'var(--ivory)' : 'var(--warm-gray)', textDecoration: 'none', transition: 'all 0.2s' }}>
            {opt.label}
          </Link>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', overflow: 'hidden' }}>
        {properties.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--warm-gray)' }}>
            <p>No properties found. <Link href="/admin/properties/new" style={{ color: 'var(--gold)' }}>Add your first property</Link>.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Price</th>
                <th>Status</th>
                <th>Beds/Baths</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => {
                const cover = p.images[0]
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '64px', height: '44px', position: 'relative', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--light-gray)' }}>
                          {cover && (
                            <Image src={cover.url} alt={p.title} fill sizes="64px" style={{ objectFit: 'cover' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--charcoal)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)' }}>{p.city}, {p.state}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{formatPrice(p.price)}</td>
                    <td>
                      <span className={`badge ${getStatusColor(p.status)}`}>{getStatusLabel(p.status)}</span>
                    </td>
                    <td style={{ color: 'var(--warm-gray)', fontSize: '0.875rem' }}>
                      {p.bedrooms} / {p.bathrooms}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: p.featured ? 'var(--gold)' : 'var(--mid-gray)' }}>
                        {p.featured ? '★ Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/admin/properties/${p.id}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid var(--light-gray)', transition: 'all 0.2s' }}>
                          Edit
                        </Link>
                        <Link href={`/properties/${p.slug}`} target="_blank" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid var(--light-gray)', transition: 'all 0.2s' }}>
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
