import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'
import { Prisma, PropertyStatus, PropertyType } from '@prisma/client'

// ─── Cache TTL constants ────────────────────────────────────────────────────
const PUBLIC_TTL = 60    // 60s for public data (properties, testimonials…)
const STATIC_TTL = 300   // 5 min for near-static data (broker profile, neighborhoods)

// ─── Broker Profile ─────────────────────────────────────────────────────────
export const getCachedBrokerProfile = unstable_cache(
  () => prisma.brokerProfile.findFirst(),
  ['broker-profile'],
  { revalidate: STATIC_TTL, tags: ['broker-profile'] }
)

// ─── Properties (homepage featured) ─────────────────────────────────────────
export const getCachedFeaturedProperties = unstable_cache(
  () => prisma.property.findMany({
    where: { featured: true, status: { not: 'SOLD' } },
    include: { images: { orderBy: { order: 'asc' } } },
    orderBy: { listingDate: 'desc' },
    take: 3,
  }),
  ['featured-properties'],
  { revalidate: PUBLIC_TTL, tags: ['properties'] }
)

export const getCachedSoldProperties = unstable_cache(
  () => prisma.property.findMany({
    where: { status: 'SOLD' },
    include: { images: { orderBy: { order: 'asc' } } },
    orderBy: { soldDate: 'desc' },
    take: 4,
  }),
  ['sold-properties'],
  { revalidate: PUBLIC_TTL, tags: ['properties'] }
)

export const getCachedSignatureProperty = unstable_cache(
  () => prisma.property.findFirst({
    where: { signature: true },
    include: { images: { orderBy: { order: 'asc' } } },
  }),
  ['signature-property'],
  { revalidate: PUBLIC_TTL, tags: ['properties'] }
)

// ─── Properties (listing page — dynamic, shorter cache per filter combo) ────
export const getCachedProperties = unstable_cache(
  async (where: Prisma.PropertyWhereInput, orderBy: Prisma.PropertyOrderByWithRelationInput, skip: number, take: number) => {
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { images: { orderBy: { order: 'asc' } } },
        orderBy,
        skip,
        take,
      }),
      prisma.property.count({ where }),
    ])
    return { properties, total }
  },
  ['properties-list'],
  { revalidate: PUBLIC_TTL, tags: ['properties'] }
)

// ─── Individual property ────────────────────────────────────────────────────
export const getCachedPropertyBySlug = unstable_cache(
  (slug: string) => prisma.property.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      neighborhood: true,
    },
  }),
  ['property-by-slug'],
  { revalidate: PUBLIC_TTL, tags: ['properties'] }
)

// ─── Neighborhoods ──────────────────────────────────────────────────────────
export const getCachedFeaturedNeighborhoods = unstable_cache(
  () => prisma.neighborhood.findMany({
    where: { featured: true },
    orderBy: { name: 'asc' },
    take: 3,
  }),
  ['featured-neighborhoods'],
  { revalidate: STATIC_TTL, tags: ['neighborhoods'] }
)

export const getCachedAllNeighborhoods = unstable_cache(
  () => prisma.neighborhood.findMany({ orderBy: { name: 'asc' } }),
  ['all-neighborhoods'],
  { revalidate: STATIC_TTL, tags: ['neighborhoods'] }
)

export const getCachedNeighborhoodBySlug = unstable_cache(
  (slug: string) => prisma.neighborhood.findUnique({
    where: { slug },
    include: {
      properties: {
        where: { status: { not: 'SOLD' } },
        include: { images: { orderBy: { order: 'asc' } } },
        take: 6,
      },
    },
  }),
  ['neighborhood-by-slug'],
  { revalidate: STATIC_TTL, tags: ['neighborhoods'] }
)

// ─── Testimonials ───────────────────────────────────────────────────────────
export const getCachedFeaturedTestimonials = unstable_cache(
  () => prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  }),
  ['featured-testimonials'],
  { revalidate: PUBLIC_TTL, tags: ['testimonials'] }
)

export const getCachedAllTestimonials = unstable_cache(
  () => prisma.testimonial.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  }),
  ['all-testimonials'],
  { revalidate: PUBLIC_TTL, tags: ['testimonials'] }
)

// ─── Insights ───────────────────────────────────────────────────────────────
export const getCachedRecentInsights = unstable_cache(
  () => prisma.insight.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  }),
  ['recent-insights'],
  { revalidate: PUBLIC_TTL, tags: ['insights'] }
)

export const getCachedAllInsights = unstable_cache(
  () => prisma.insight.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
  }),
  ['all-insights'],
  { revalidate: PUBLIC_TTL, tags: ['insights'] }
)

export const getCachedInsightCategories = unstable_cache(
  () => prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ['insight-categories'],
  { revalidate: STATIC_TTL, tags: ['insights'] }
)

// ─── Media Mentions ─────────────────────────────────────────────────────────
export const getCachedMediaMentions = unstable_cache(
  () => prisma.mediaMention.findMany({ orderBy: { date: 'desc' } }),
  ['media-mentions'],
  { revalidate: STATIC_TTL, tags: ['media'] }
)

// ─── About page data ─────────────────────────────────────────────────────────
export const getCachedAwards = unstable_cache(
  () => prisma.award.findMany({ orderBy: { year: 'desc' } }),
  ['awards'],
  { revalidate: STATIC_TTL, tags: ['broker-profile'] }
)
