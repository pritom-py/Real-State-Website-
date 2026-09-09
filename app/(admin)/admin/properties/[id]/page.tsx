import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AdminDeleteButton } from '@/components/admin/AdminDeleteButton'

interface PageProps {
  params: Promise<{ id: string }>
}

async function saveProperty(id: string | undefined, formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string || slugify(title)
  const imagesRaw = formData.get('images') as string
  const images = imagesRaw ? imagesRaw.split('\n').map((s: string) => s.trim()).filter(Boolean) : []
  const amenitiesRaw = formData.get('amenities') as string
  const amenities = amenitiesRaw ? amenitiesRaw.split('\n').map((s: string) => s.trim()).filter(Boolean) : []

  const data = {
    title,
    slug,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    status: formData.get('status') as any,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip: formData.get('zip') as string,
    bedrooms: parseInt(formData.get('bedrooms') as string),
    bathrooms: parseFloat(formData.get('bathrooms') as string),
    squareFeet: parseInt(formData.get('squareFeet') as string),
    lotSize: formData.get('lotSize') ? parseFloat(formData.get('lotSize') as string) : null,
    yearBuilt: formData.get('yearBuilt') ? parseInt(formData.get('yearBuilt') as string) : null,
    propertyType: formData.get('propertyType') as any,
    amenities,
    featured: formData.get('featured') === 'true',
    signature: formData.get('signature') === 'true',
    representedAs: formData.get('representedAs') as any,
    soldPrice: formData.get('soldPrice') ? parseFloat(formData.get('soldPrice') as string) : null,
    soldDate: formData.get('soldDate') ? new Date(formData.get('soldDate') as string) : null,
    neighborhoodId: formData.get('neighborhoodId') as string || null,
  }

  if (id && id !== 'new') {
    await prisma.property.update({ where: { id }, data })
    if (images.length > 0) {
      await prisma.propertyImage.deleteMany({ where: { propertyId: id } })
      await Promise.all(images.map((url: string, i: number) =>
        prisma.propertyImage.create({ data: { propertyId: id!, url, alt: title, order: i, isCover: i === 0 } })
      ))
    }
  } else {
    const property = await prisma.property.create({ data })
    await Promise.all(images.map((url: string, i: number) =>
      prisma.propertyImage.create({ data: { propertyId: property.id, url, alt: title, order: i, isCover: i === 0 } })
    ))
  }

  revalidatePath('/properties')
  revalidatePath('/admin/properties')
  redirect('/admin/properties')
}

async function deleteProperty(id: string, _formData: FormData) {
  'use server'
  await prisma.property.delete({ where: { id } })
  revalidatePath('/properties')
  revalidatePath('/admin/properties')
  redirect('/admin/properties')
}

export default async function AdminPropertyEditPage({ params }: PageProps) {
  const { id } = await params
  const isNew = id === 'new'
  const neighborhoods = await prisma.neighborhood.findMany({ orderBy: { name: 'asc' } })

  const property = isNew ? null : await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })

  if (!isNew && !property) notFound()

  const saveAction = saveProperty.bind(null, isNew ? undefined : id)
  const deleteAction = isNew ? null : deleteProperty.bind(null, id)

  const fieldStyle = { width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8E3DC', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', backgroundColor: '#fff', outline: 'none', color: 'var(--charcoal)' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/properties" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)', textDecoration: 'none', marginBottom: '0.5rem' }}>
            <ArrowLeft size={13} /> Back to Properties
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>
            {isNew ? 'Add Property' : 'Edit Property'}
          </h1>
        </div>
        {!isNew && property && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href={`/properties/${property.slug}`} target="_blank" className="btn-outline btn-sm">View on Site</Link>
            <AdminDeleteButton id={property.id} action={deleteAction!} confirmText="Delete this property? This cannot be undone." label="Delete" />
          </div>
        )}
      </div>

      <form action={saveAction}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Basic Information</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="field-label">Title *</label>
                  <input name="title" required defaultValue={property?.title} style={fieldStyle} placeholder="12 Carolwood Drive" />
                </div>
                <div>
                  <label className="field-label">Slug (auto-generated if empty)</label>
                  <input name="slug" defaultValue={property?.slug} style={fieldStyle} placeholder="12-carolwood-drive" />
                </div>
                <div>
                  <label className="field-label">Description *</label>
                  <textarea name="description" required defaultValue={property?.description} style={{ ...fieldStyle, minHeight: '160px', resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Location</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Address *</label>
                  <input name="address" required defaultValue={property?.address} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">City *</label>
                  <input name="city" required defaultValue={property?.city} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">State *</label>
                  <input name="state" required defaultValue={property?.state ?? 'CA'} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">ZIP *</label>
                  <input name="zip" required defaultValue={property?.zip} style={fieldStyle} />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Price ($) *</label>
                  <input name="price" type="number" required defaultValue={property?.price} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">Bedrooms *</label>
                  <input name="bedrooms" type="number" required defaultValue={property?.bedrooms} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">Bathrooms *</label>
                  <input name="bathrooms" type="number" step="0.5" required defaultValue={property?.bathrooms} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">Square Feet *</label>
                  <input name="squareFeet" type="number" required defaultValue={property?.squareFeet} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">Lot Size (acres)</label>
                  <input name="lotSize" type="number" step="0.01" defaultValue={property?.lotSize ?? ''} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">Year Built</label>
                  <input name="yearBuilt" type="number" defaultValue={property?.yearBuilt ?? ''} style={fieldStyle} />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Images</h3>
              <label className="field-label">Image URLs (one per line — first is cover image)</label>
              <textarea name="images" defaultValue={property?.images.map(i => i.url).join('\n') ?? ''} style={{ ...fieldStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.75rem' }} placeholder="https://images.unsplash.com/photo-xxxx" />
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Amenities</h3>
              <label className="field-label">Features (one per line)</label>
              <textarea name="amenities" defaultValue={property?.amenities.join('\n') ?? ''} style={{ ...fieldStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Home Theater&#10;Wine Cellar&#10;Pool & Spa" />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '80px' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Status & Type</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="field-label">Status</label>
                  <select name="status" defaultValue={property?.status ?? 'FOR_SALE'} style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option value="FOR_SALE">For Sale</option>
                    <option value="JUST_LISTED">Just Listed</option>
                    <option value="UNDER_CONTRACT">Under Contract</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Property Type</label>
                  <select name="propertyType" defaultValue={property?.propertyType ?? 'LUXURY_ESTATE'} style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option value="LUXURY_ESTATE">Luxury Estate</option>
                    <option value="SINGLE_FAMILY">Single Family</option>
                    <option value="CONDO">Condominium</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="TOWNHOUSE">Townhouse</option>
                    <option value="MULTI_FAMILY">Multi-Family</option>
                    <option value="LAND">Land</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Represented As</label>
                  <select name="representedAs" defaultValue={property?.representedAs ?? 'SELLERS_AGENT'} style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option value="SELLERS_AGENT">Seller's Agent</option>
                    <option value="BUYERS_AGENT">Buyer's Agent</option>
                    <option value="DUAL_AGENT">Dual Agent</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Neighborhood</label>
                  <select name="neighborhoodId" defaultValue={property?.neighborhoodId ?? ''} style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option value="">None</option>
                    {neighborhoods.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Visibility</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                  <input type="checkbox" name="featured" value="true" defaultChecked={property?.featured} style={{ accentColor: 'var(--gold)' }} />
                  Featured on homepage
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                  <input type="checkbox" name="signature" value="true" defaultChecked={property?.signature} style={{ accentColor: 'var(--gold)' }} />
                  Signature listing
                </label>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Sold Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="field-label">Sold Price ($)</label>
                  <input name="soldPrice" type="number" defaultValue={property?.soldPrice ?? ''} style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">Sold Date</label>
                  <input name="soldDate" type="date" defaultValue={property?.soldDate ? new Date(property.soldDate).toISOString().split('T')[0] : ''} style={fieldStyle} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {isNew ? 'Create Property' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 1024px) {
          form > div { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
        }
      `}</style>
    </div>
  )
}
