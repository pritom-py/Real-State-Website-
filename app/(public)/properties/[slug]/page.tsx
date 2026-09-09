import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PropertyGallery } from '@/components/property/PropertyGallery'
import { PropertyInquiryForm } from '@/components/property/PropertyInquiryForm'
import { PropertyCard } from '@/components/property/PropertyCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { formatPriceFull, formatSqFt, getStatusLabel, getPropertyTypeLabel, formatDate } from '@/lib/utils'
import { Bed, Bath, Maximize, MapPin, Calendar, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const property = await prisma.property.findUnique({ where: { slug } })
  if (!property) return { title: 'Property Not Found' }

  return {
    title: `${property.title} | Alexandra Voss Real Estate`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
    },
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [property, broker] = await Promise.all([
    prisma.property.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        neighborhood: true,
      },
    }),
    prisma.brokerProfile.findFirst(),
  ])

  if (!property) notFound()

  // Similar properties
  const similar = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      status: { not: 'SOLD' },
      city: property.city,
    },
    include: { images: { orderBy: { order: 'asc' } } },
    take: 3,
    orderBy: { listingDate: 'desc' },
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.slug}`,
    image: property.images[0]?.url,
    price: property.price,
    priceCurrency: 'USD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zip,
    },
  }

  const specs = [
    { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: Maximize, label: 'Living Area', value: `${formatSqFt(property.squareFeet)} sq ft` },
    { icon: Home, label: 'Property Type', value: getPropertyTypeLabel(property.propertyType) },
    ...(property.yearBuilt ? [{ icon: Calendar, label: 'Year Built', value: property.yearBuilt }] : []),
    ...(property.lotSize ? [{ icon: Maximize, label: 'Lot Size', value: `${property.lotSize} acres` }] : []),
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
        {/* Back link */}
        <div className="container-wide" style={{ paddingTop: '2rem', paddingBottom: '0' }}>
          <Link href="/properties" className="hover-charcoal" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--warm-gray)', textDecoration: 'none', transition: 'color 0.3s' }}>
            <ArrowLeft size={14} /> Back to Properties
          </Link>
        </div>

        {/* Gallery */}
        <div style={{ marginTop: '1.5rem' }}>
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* Content */}
        <div className="container-wide" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem', alignItems: 'start' }}>
            {/* Left column */}
            <div>
              {/* Header */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ backgroundColor: property.status === 'SOLD' ? 'var(--charcoal)' : '#e8f5e9', color: property.status === 'SOLD' ? 'var(--ivory)' : '#2e7d32', fontFamily: 'var(--font-sans)' }}>
                    {getStatusLabel(property.status)}
                  </span>
                  <span className="badge" style={{ backgroundColor: 'var(--light-gray)', color: 'var(--warm-gray)', fontFamily: 'var(--font-sans)' }}>
                    {getPropertyTypeLabel(property.propertyType)}
                  </span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '0.5rem', lineHeight: 1.1 }}>
                  {property.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warm-gray)', marginBottom: '1rem' }}>
                  <MapPin size={14} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300 }}>
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 300, color: property.status === 'SOLD' ? 'var(--warm-gray)' : 'var(--charcoal)' }}>
                  {property.status === 'SOLD' && property.soldPrice
                    ? `Sold: ${formatPriceFull(property.soldPrice)}`
                    : formatPriceFull(property.price)}
                </div>
                {property.status === 'SOLD' && property.soldDate && (
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)', marginTop: '0.25rem' }}>
                    Sale closed {formatDate(property.soldDate)}
                  </div>
                )}
              </div>

              {/* Specs grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'var(--light-gray)', border: '1px solid var(--light-gray)', marginBottom: '2.5rem' }}>
                {specs.map((spec) => (
                  <div key={spec.label} style={{ backgroundColor: 'var(--warm-white)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>
                      {spec.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem' }}>About This Property</h2>
                <div className="rule-h" style={{ marginBottom: '1.25rem' }} />
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.85 }}>
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, marginBottom: '1rem' }}>Features & Amenities</h2>
                  <div className="rule-h" style={{ marginBottom: '1.25rem' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
                    {property.amenities.map((amenity) => (
                      <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--charcoal)' }}>
                        <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--gold)', flexShrink: 0 }} />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Neighborhood */}
              {property.neighborhood && (
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)', marginBottom: '2.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                    Neighborhood
                  </div>
                  <Link href={`/neighborhoods/${property.neighborhood.slug}`} className="hover-gold" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--charcoal)', textDecoration: 'none', transition: 'color 0.3s' }}>
                    {property.neighborhood.name} →
                  </Link>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', margin: '0.5rem 0 0' }}>
                    {property.neighborhood.description.slice(0, 160)}…
                  </p>
                </div>
              )}
            </div>

            {/* Right column — Sticky inquiry form */}
            <div style={{ position: 'sticky', top: '100px' }}>
              {/* Broker card */}
              {broker && (
                <div style={{ backgroundColor: 'var(--charcoal)', color: 'var(--ivory)', padding: '1.5rem', marginBottom: '1px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <img src={broker.photo} alt={broker.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, color: 'var(--ivory)' }}>{broker.name}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>{broker.title}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'rgba(248,245,240,0.7)' }}>
                    <a href={`tel:${broker.phone}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>{broker.phone}</a>
                    <a href={`mailto:${broker.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{broker.email}</a>
                  </div>
                </div>
              )}
              <PropertyInquiryForm propertyId={property.id} propertyAddress={`${property.address}, ${property.city}`} />
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--rule)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '2.5rem' }}>Similar Properties</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .container-wide > div > div:first-of-type { grid-template-columns: 1fr !important; }
          .container-wide > div > div:first-of-type > div:last-child { position: static !important; }
        }
      `}</style>
    </>
  )
}
