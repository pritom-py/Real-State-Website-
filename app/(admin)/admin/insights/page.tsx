import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function deleteInsight(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.insight.delete({ where: { id } })
  revalidatePath('/insights')
  revalidatePath('/admin/insights')
}

async function togglePublish(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  await prisma.insight.update({
    where: { id },
    data: {
      status: status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
      publishedAt: status === 'PUBLISHED' ? null : new Date(),
    },
  })
  revalidatePath('/insights')
  revalidatePath('/admin/insights')
}

export default async function AdminInsightsPage() {
  const insights = await prisma.insight.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Insights</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: '0.25rem 0 0' }}>{insights.length} total</p>
        </div>
        <Link href="/admin/insights/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={14} /> New Article
        </Link>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', overflow: 'hidden' }}>
        {insights.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--warm-gray)' }}>
            <p>No articles yet. <Link href="/admin/insights/new" style={{ color: 'var(--gold)' }}>Create your first article</Link>.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {insights.map((insight) => (
                <tr key={insight.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--charcoal)' }}>{insight.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)' }}>{insight.readTime} min read</div>
                  </td>
                  <td style={{ color: 'var(--warm-gray)', fontSize: '0.875rem' }}>{insight.category?.name ?? '—'}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: insight.status === 'PUBLISHED' ? '#2e7d32' : '#B8975A', backgroundColor: insight.status === 'PUBLISHED' ? '#e8f5e9' : '#fdf8f0', padding: '0.25rem 0.625rem' }}>
                      {insight.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--warm-gray)', whiteSpace: 'nowrap' }}>
                    {insight.publishedAt ? formatDate(insight.publishedAt) : 'Draft'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/insights/${insight.id}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid var(--light-gray)' }}>
                        Edit
                      </Link>
                      <form action={togglePublish} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={insight.id} />
                        <input type="hidden" name="status" value={insight.status} />
                        <button type="submit" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: insight.status === 'PUBLISHED' ? '#b91c1c' : '#2e7d32', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid var(--light-gray)', backgroundColor: '#fff', cursor: 'pointer' }}>
                          {insight.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
