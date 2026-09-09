import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArrowLeft, Clock, User } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const insight = await prisma.insight.findUnique({ where: { slug } })
  if (!insight) return { title: 'Article Not Found' }
  return {
    title: insight.seoTitle || `${insight.title} | Alexandra Voss`,
    description: insight.seoDescription || insight.excerpt.slice(0, 160),
    openGraph: {
      title: insight.title,
      description: insight.excerpt.slice(0, 160),
      images: [{ url: insight.coverImage }],
    },
  }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params
  const insight = await prisma.insight.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { category: true },
  })

  if (!insight) notFound()

  const related = await prisma.insight.findMany({
    where: { status: 'PUBLISHED', id: { not: insight.id }, categoryId: insight.categoryId },
    include: { category: true },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: insight.title,
    description: insight.excerpt,
    image: insight.coverImage,
    author: { '@type': 'Person', name: insight.author },
    publisher: { '@type': 'Organization', name: 'Alexandra Voss Real Estate' },
    datePublished: insight.publishedAt?.toISOString(),
    url: `${process.env.NEXT_PUBLIC_APP_URL}/insights/${insight.slug}`,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: '55vh', minHeight: '400px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <Image src={insight.coverImage} alt={insight.title} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.15) 60%)' }} />
          <div className="container-narrow" style={{ position: 'relative', zIndex: 1, paddingBottom: '3.5rem' }}>
            <Link href="/insights" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <ArrowLeft size={12} /> All Insights
            </Link>
            {insight.category && (
              <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '0.75rem' }}>{insight.category.name}</div>
            )}
            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#fff', margin: 0, fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1.1 }}>
              {insight.title}
            </h1>
          </div>
        </div>

        {/* Meta bar */}
        <div style={{ backgroundColor: 'var(--warm-white)', borderBottom: '1px solid var(--rule)' }}>
          <div className="container-narrow" style={{ display: 'flex', gap: '2rem', padding: '1.25rem 0', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
              <User size={13} /> {insight.author}
            </span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
              {insight.publishedAt ? formatDate(insight.publishedAt) : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
              <Clock size={13} /> {insight.readTime} min read
            </span>
          </div>
        </div>

        {/* Article content */}
        <div className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
          {/* Excerpt */}
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--warm-gray)', lineHeight: 1.65, marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--rule)' }}>
            {insight.excerpt}
          </p>

          {/* Body */}
          <div className="prose-luxury" dangerouslySetInnerHTML={{ __html: insight.content }} />

          {/* Tags */}
          {insight.tags.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rule)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginRight: '0.5rem' }}>Tags:</span>
              {insight.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--charcoal)', padding: '0.35rem 0.875rem', border: '1px solid var(--light-gray)', backgroundColor: 'var(--warm-white)' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author box */}
          <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=90" alt="Alexandra Voss" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '0.25rem' }}>Alexandra Voss</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Luxury Real Estate Advisor</div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 300, color: 'var(--warm-gray)', margin: 0 }}>
                18 years of expertise across Beverly Hills, Bel-Air, Malibu and surrounding communities. $2.4B+ in career sales.
              </p>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ backgroundColor: 'var(--warm-white)', borderTop: '1px solid var(--rule)', padding: '4rem 0 5rem' }}>
            <div className="container-wide">
              <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Continue Reading</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '2.5rem' }}>Related Insights</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                {related.map((r) => (
                  <Link key={r.id} href={`/insights/${r.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', marginBottom: '1rem', backgroundColor: 'var(--light-gray)' }}>
                      <Image src={r.coverImage} alt={r.title} fill sizes="33vw" style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }} className="rel-img" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, color: 'var(--charcoal)', transition: 'color 0.3s' }} className="rel-title">{r.title}</h3>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--mid-gray)', marginTop: '0.5rem' }}>{r.readTime} min read</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <style>{`
          a:hover .rel-img { transform: scale(1.04) !important; }
          a:hover .rel-title { color: var(--gold) !important; }
          @media (max-width: 768px) {
            div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
            div[style*="display: flex"][style*="gap: 1.5rem"][style*="align-items: center"] { flex-direction: column; align-items: flex-start !important; }
          }
        `}</style>
      </div>
    </>
  )
}
