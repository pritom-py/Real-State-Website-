import { PropertyCard } from './PropertyCard'
import type { Property, PropertyImage } from '@prisma/client'

type PropertyWithImages = Property & { images: PropertyImage[] }

export function PropertyGrid({ properties }: { properties: PropertyWithImages[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      {properties.map((property, i) => (
        <PropertyCard key={property.id} property={property} priority={i < 3} />
      ))}
      <style>{`
        @media (max-width: 960px) { div { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { div { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
