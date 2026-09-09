import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/home/Hero'
import { StatsSection } from '@/components/home/StatsSection'
import { FeaturedProperties } from '@/components/home/FeaturedProperties'
import { BrokerIntro } from '@/components/home/BrokerIntro'
import { WhyWorkWithMe } from '@/components/home/WhyWorkWithMe'
import { SignatureListing } from '@/components/home/SignatureListing'
import { SoldSection } from '@/components/home/SoldSection'
import { NeighborhoodsSection } from '@/components/home/NeighborhoodsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { InsightsSection } from '@/components/home/InsightsSection'
import { ValuationCTA, ContactCTA } from '@/components/home/CTASections'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Alexandra Voss | Luxury Real Estate Beverly Hills',
  description: 'Beverly Hills luxury real estate advisor with $2.4B+ in career sales. Exclusive properties in Beverly Hills, Bel-Air, Malibu, Santa Monica, and Pacific Palisades.',
  openGraph: {
    title: 'Alexandra Voss | Luxury Real Estate',
    description: 'An uncompromising standard of real estate excellence across Los Angeles\'s finest communities.',
    images: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=90' }],
  },
}

export default async function HomePage() {
  const [broker, featuredProperties, soldProperties, neighborhoods, testimonials, insights, signatureProperty] =
    await Promise.all([
      prisma.brokerProfile.findFirst(),
      prisma.property.findMany({
        where: { featured: true, status: { not: 'SOLD' } },
        include: { images: { orderBy: { order: 'asc' } } },
        orderBy: { listingDate: 'desc' },
        take: 3,
      }),
      prisma.property.findMany({
        where: { status: 'SOLD' },
        include: { images: { orderBy: { order: 'asc' } } },
        orderBy: { soldDate: 'desc' },
        take: 4,
      }),
      prisma.neighborhood.findMany({
        where: { featured: true },
        orderBy: { name: 'asc' },
        take: 3,
      }),
      prisma.testimonial.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.insight.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.property.findFirst({
        where: { signature: true },
        include: { images: { orderBy: { order: 'asc' } } },
      }),
    ])


  const brokerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Alexandra Voss',
    description: broker?.shortBio ?? '',
    telephone: broker?.phone ?? '',
    email: broker?.email ?? '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9601 Wilshire Blvd, Suite 300',
      addressLocality: 'Beverly Hills',
      addressRegion: 'CA',
      postalCode: '90210',
    },
    url: process.env.NEXT_PUBLIC_APP_URL ?? '',
    image: broker?.photo ?? '',
    areaServed: broker?.serviceAreas ?? [],
  }

  return (
    <>
      <JsonLd data={brokerJsonLd} />
      <Hero />
      <StatsSection />
      <FeaturedProperties properties={featuredProperties} />
      <BrokerIntro broker={broker} />
      <WhyWorkWithMe />
      {signatureProperty && <SignatureListing property={signatureProperty} />}
      <SoldSection properties={soldProperties} />
      <NeighborhoodsSection neighborhoods={neighborhoods} />
      <TestimonialsSection testimonials={testimonials} />
      <InsightsSection insights={insights} />
      <ValuationCTA />
      <ContactCTA />
    </>
  )
}
