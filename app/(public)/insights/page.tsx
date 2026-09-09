import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, truncate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market Insights | Alexandra Voss Real Estate',
  description: 'Expert perspectives on the Los Angeles luxury real estate market, neighborhood spotlights, and strategic guidance for buyers and sellers.',
}

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const params = await searchParams

  const where: any = { status: 'PUBLISHED' }
  if (params.search) where.OR = [
    { title: { contains: params.search, mode: 'insensitive' as const } },
    { excerpt: { contains: params.search, mode: 'insensitive' as const } },
  ]

  const [insights, categories] = await Promise.all([
    prisma.insight.findMany({
      where: params.category ? { ...where, category: { slug: params.category } } : where,
      include: { category: true },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const featured = insights.find((i) => i.featured)
  const rest = insights.filter((i) => !i.featured)

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--charcoal)', padding: '7rem 0 4rem' }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Perspectives</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: '0 0 2rem' }}>Market Insights</h1>
          {/* Category nav */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/insights" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: !params.category ? 'var(--ivory)' : 'rgba(248,245,240,0.5)', padding: '0.5rem 1rem', border: '1px solid', borderColor: !params.category ? 'var(--ivory)' : 'rgba(248,245,240,0.2)', textDecoration: 'none', transition: 'all 0.3s' }}>
              All
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/insights?category=${c.slug}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: params.category === c.slug ? 'var(--ivory)' : 'rgba(248,245,240,0.5)', padding: '0.5rem 1rem', border: '1px solid', borderColor: params.category === c.slug ? 'var(--ivory)' : 'rgba(248,245,240,0.2)', textDecoration: 'none', transition: 'all 0.3s' }}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        {/* Featured article */}
        {featured && (
          <div style={{ marginBottom: '4rem' }}>
            <Link href={`/insights/${featured.slug}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', textDecoration: 'none', backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                <Image src={featured.coverImage} alt={featured.title} fill sizes="50vw" style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }} className="feat-img" />
              </div>
              <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>Featured Article</div>
                {featured.category && (
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
                    {featured.category.name}
                  </div>
                )}
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '1rem', lineHeight: 1.2 }}>
                  {featured.title}
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {truncate(featured.excerpt, 200)}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--rule)', paddingTop: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>
                    {featured.publishedAt ? formatDate(featured.publishedAt) : ''} · {featured.readTime} min read
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                    Read More <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {rest.map((insight) => (
            <article key={insight.id}>
              <Link href={`/insights/${insight.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', marginBottom: '1.25rem', backgroundColor: 'var(--light-gray)' }}>
                  <Image src={insight.coverImage} alt={insight.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }} className="art-img" />
                </div>
                {insight.category && (
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                    {insight.category.name}
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.625rem', lineHeight: 1.2, transition: 'color 0.3s' }} className="art-title">
                  {insight.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
                  {truncate(insight.excerpt, 120)}
                </p>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--mid-gray)' }}>
                  {insight.publishedAt ? formatDate(insight.publishedAt) : ''} · {insight.readTime} min read
                </div>
              </Link>
            </article>
          ))}
        </div>

        {insights.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--warm-gray)' }}>
            <p>No insights found. Check back soon.</p>
          </div>
        )}
      </div>

      <style>{`
        a:hover .feat-img, article:hover .art-img { transform: scale(1.04) !important; }
        article:hover .art-title { color: var(--gold) !important; }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          a[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 580px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
