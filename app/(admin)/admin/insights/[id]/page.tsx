import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

async function saveInsight(id: string | undefined, formData: FormData) {
  'use server'
  const title = formData.get('title') as string
  const tags = (formData.get('tags') as string).split(',').map((s: string) => s.trim()).filter(Boolean)
  const data: any = {
    title,
    slug: slugify(title),
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    coverImage: formData.get('coverImage') as string,
    author: formData.get('author') as string || 'Alexandra Voss',
    readTime: parseInt(formData.get('readTime') as string) || 5,
    tags,
    featured: formData.get('featured') === 'true',
    status: formData.get('status') as any,
    seoTitle: formData.get('seoTitle') as string || '',
    seoDescription: formData.get('seoDescription') as string || '',
  }
  if (data.status === 'PUBLISHED' && !id) data.publishedAt = new Date()

  const catId = formData.get('categoryId') as string
  if (catId) data.categoryId = catId

  if (id && id !== 'new') {
    await prisma.insight.update({ where: { id }, data })
  } else {
    await prisma.insight.create({ data })
  }
  revalidatePath('/insights')
  revalidatePath('/admin/insights')
  redirect('/admin/insights')
}

export default async function AdminInsightEditPage({ params }: PageProps) {
  const { id } = await params
  const isNew = id === 'new'
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  const insight = isNew ? null : await prisma.insight.findUnique({ where: { id } })
  if (!isNew && !insight) notFound()

  const saveAction = saveInsight.bind(null, isNew ? undefined : id)
  const fieldStyle = { width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8E3DC', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', backgroundColor: '#fff', outline: 'none', color: 'var(--charcoal)' }

  return (
    <div>
      <Link href="/admin/insights" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)', textDecoration: 'none', marginBottom: '1rem' }}>
        <ArrowLeft size={13} /> Back to Insights
      </Link>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, marginBottom: '2rem' }}>
        {isNew ? 'New Article' : 'Edit Article'}
      </h1>

      <form action={saveAction}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="field-label">Title *</label>
                <input name="title" required defaultValue={insight?.title} style={fieldStyle} />
              </div>
              <div>
                <label className="field-label">Cover Image URL *</label>
                <input name="coverImage" required defaultValue={insight?.coverImage} style={fieldStyle} placeholder="https://images.unsplash.com/..." />
              </div>
              <div>
                <label className="field-label">Excerpt *</label>
                <textarea name="excerpt" required defaultValue={insight?.excerpt} rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label className="field-label">Content (HTML) *</label>
                <textarea name="content" required defaultValue={insight?.content} rows={20} style={{ ...fieldStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8125rem' }} />
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: 'var(--warm-gray)', marginTop: '0.35rem' }}>
                  Use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, margin: 0 }}>SEO</h3>
              <div>
                <label className="field-label">SEO Title</label>
                <input name="seoTitle" defaultValue={insight?.seoTitle} style={fieldStyle} />
              </div>
              <div>
                <label className="field-label">SEO Description</label>
                <textarea name="seoDescription" defaultValue={insight?.seoDescription} rows={2} style={{ ...fieldStyle, resize: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '80px' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="field-label">Status</label>
                <select name="status" defaultValue={insight?.status ?? 'DRAFT'} style={{ ...fieldStyle, cursor: 'pointer' }}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div>
                <label className="field-label">Category</label>
                <select name="categoryId" defaultValue={insight?.categoryId ?? ''} style={{ ...fieldStyle, cursor: 'pointer' }}>
                  <option value="">None</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Author</label>
                <input name="author" defaultValue={insight?.author ?? 'Alexandra Voss'} style={fieldStyle} />
              </div>
              <div>
                <label className="field-label">Read Time (minutes)</label>
                <input name="readTime" type="number" defaultValue={insight?.readTime ?? 5} style={fieldStyle} />
              </div>
              <div>
                <label className="field-label">Tags (comma-separated)</label>
                <input name="tags" defaultValue={insight?.tags.join(', ') ?? ''} style={fieldStyle} placeholder="Beverly Hills, Market, Luxury" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                <input type="checkbox" name="featured" value="true" defaultChecked={insight?.featured} style={{ accentColor: 'var(--gold)' }} />
                Feature on homepage
              </label>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {isNew ? 'Create Article' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          form > div { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
        }
      `}</style>
    </div>
  )
}
