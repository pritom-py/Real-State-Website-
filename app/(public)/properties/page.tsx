import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { Pagination } from '@/components/ui/Pagination'
import { PropertyStatus, PropertyType, Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Properties | Alexandra Voss Real Estate',
  description: 'Browse luxury properties for sale in Beverly Hills, Bel-Air, Malibu, Pacific Palisades and surrounding Los Angeles communities.',
  openGraph: {
    title: 'Luxury Properties | Alexandra Voss Real Estate',
    description: 'Search exclusive luxury properties across Los Angeles\'s most coveted communities.',
  },
}

const PAGE_SIZE = 9

interface PageProps {
  searchParams: Promise<{
    search?: string
    city?: string
    status?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    beds?: string
    baths?: string
    sort?: string
    page?: string
  }>
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1', 10)
  const skip = (page - 1) * PAGE_SIZE

  // Build where clause
  const where: Prisma.PropertyWhereInput = {}

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { address: { contains: params.search, mode: 'insensitive' } },
      { city: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  if (params.city) where.city = { contains: params.city, mode: 'insensitive' }
  if (params.status && params.status !== 'ALL') where.status = params.status as PropertyStatus
  if (params.type && params.type !== 'ALL') where.propertyType = params.type as PropertyType
  if (params.minPrice) where.price = { ...((where.price as any) ?? {}), gte: parseFloat(params.minPrice) }
  if (params.maxPrice) where.price = { ...((where.price as any) ?? {}), lte: parseFloat(params.maxPrice) }
  if (params.beds) where.bedrooms = { gte: parseInt(params.beds) }
  if (params.baths) where.bathrooms = { gte: parseFloat(params.baths) }

  // Sort
  let orderBy: Prisma.PropertyOrderByWithRelationInput = { listingDate: 'desc' }
  if (params.sort === 'price-asc') orderBy = { price: 'asc' }
  if (params.sort === 'price-desc') orderBy = { price: 'desc' }
  if (params.sort === 'newest') orderBy = { listingDate: 'desc' }
  if (params.sort === 'sqft') orderBy = { squareFeet: 'desc' }
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }),
    prisma.property.count({ where }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      {/* Hero */}
      <div style={{ paddingTop: '80px', backgroundColor: 'var(--charcoal)', color: 'var(--ivory)', padding: '8rem 0 4rem' }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Active Listings</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: 0 }}>
            Exceptional Properties
          </h1>
        </div>
      </div>

      {/* Filters + Grid */}
      <div style={{ backgroundColor: 'var(--ivory)', minHeight: '60vh' }}>
        <div className="container-wide" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
          <PropertyFilters currentParams={params} total={total} />

          {properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--warm-gray)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>No Properties Found</div>
              <p>Try adjusting your search filters to find available properties.</p>
            </div>
          ) : (
            <>
              <PropertyGrid properties={properties} />
              {totalPages > 1 && (
                <div style={{ marginTop: '3rem' }}>
                  <Pagination currentPage={page} totalPages={totalPages} baseUrl="/properties" searchParams={params} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
