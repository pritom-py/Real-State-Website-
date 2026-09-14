import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { AdminDeleteButton } from '@/components/admin/AdminDeleteButton'

async function saveTestimonial(formData: FormData) {
  'use server'
  const id = formData.get('id') as string | null
  const data = {
    clientName: formData.get('clientName') as string,
    review: formData.get('review') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    transactionType: formData.get('transactionType') as string,
    location: formData.get('location') as string || '',
    featured: formData.get('featured') === 'true',
  }
  if (id) {
    await prisma.testimonial.update({ where: { id }, data })
  } else {
    await prisma.testimonial.create({ data })
  }
  revalidateTag('testimonials')
  revalidatePath('/testimonials')
  revalidatePath('/admin/testimonials')
  redirect('/admin/testimonials')
}

async function deleteTestimonial(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath('/testimonials')
  revalidatePath('/admin/testimonials')
}

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })

  const fieldStyle = { width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E8E3DC', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', backgroundColor: '#fff', outline: 'none' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Testimonials</h1>
      </div>

      {/* Add form */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '1.25rem' }}>Add New Testimonial</h2>
        <form action={saveTestimonial} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="field-label">Client Name *</label>
            <input name="clientName" required style={fieldStyle} placeholder="Richard & Catherine Harmon" />
          </div>
          <div>
            <label className="field-label">Transaction Type *</label>
            <input name="transactionType" required style={fieldStyle} placeholder="Buyer Representation" />
          </div>
          <div>
            <label className="field-label">Location</label>
            <input name="location" style={fieldStyle} placeholder="Beverly Hills, CA" />
          </div>
          <div>
            <label className="field-label">Rating (1-5)</label>
            <input name="rating" type="number" min="1" max="5" defaultValue="5" style={fieldStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="field-label">Review *</label>
            <textarea name="review" required rows={4} style={{ ...fieldStyle, resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
              <input type="checkbox" name="featured" value="true" style={{ accentColor: 'var(--gold)' }} />
              Feature on homepage
            </label>
            <button type="submit" className="btn-primary btn-sm">Add Testimonial</button>
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {testimonials.map((t) => (
          <div key={t.id} style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 500 }}>{t.clientName}</span>
                {t.featured && <span style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', backgroundColor: '#f4f0e8', padding: '0.2rem 0.5rem' }}>Featured</span>}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: '0 0 0.5rem', fontStyle: 'italic' }}>"{t.review.slice(0, 120)}…"</p>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>
                {t.transactionType}{t.location ? ` · ${t.location}` : ''} · {'★'.repeat(t.rating)}
              </div>
            </div>
            <AdminDeleteButton id={t.id} action={deleteTestimonial} confirmText="Delete this testimonial?" />
          </div>
        ))}
      </div>
    </div>
  )
}
