import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function createProperty(_formData: FormData) {
  'use server'

  const title = _formData.get('title') as string
  const slug = (_formData.get('slug') as string) || slugify(title)
  const imagesRaw = _formData.get('images') as string
  const images = imagesRaw ? imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : []
  const amenitiesRaw = _formData.get('amenities') as string
  const amenities = amenitiesRaw ? amenitiesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : []

  const data = {
    title,
    slug,
    description: _formData.get('description') as string,
    price: parseFloat(_formData.get('price') as string),
    status: (_formData.get('status') as any) ?? 'FOR_SALE',
    address: _formData.get('address') as string,
    city: _formData.get('city') as string,
    state: (_formData.get('state') as string) || 'CA',
    zip: _formData.get('zip') as string,
    bedrooms: parseInt(_formData.get('bedrooms') as string),
    bathrooms: parseFloat(_formData.get('bathrooms') as string),
    squareFeet: parseInt(_formData.get('squareFeet') as string),
    lotSize: _formData.get('lotSize') ? parseFloat(_formData.get('lotSize') as string) : null,
    yearBuilt: _formData.get('yearBuilt') ? parseInt(_formData.get('yearBuilt') as string) : null,
    propertyType: (_formData.get('propertyType') as any) ?? 'LUXURY_ESTATE',
    amenities,
    featured: _formData.get('featured') === 'true',
    signature: _formData.get('signature') === 'true',
    representedAs: (_formData.get('representedAs') as any) ?? 'SELLERS_AGENT',
    soldPrice: _formData.get('soldPrice') ? parseFloat(_formData.get('soldPrice') as string) : null,
    soldDate: _formData.get('soldDate') ? new Date(_formData.get('soldDate') as string) : null,
    neighborhoodId: (_formData.get('neighborhoodId') as string) || null,
  }

  const property = await prisma.property.create({ data })

  if (images.length > 0) {
    await Promise.all(
      images.map((url, i) =>
        prisma.propertyImage.create({
          data: { propertyId: property.id, url, alt: title, order: i, isCover: i === 0 },
        })
      )
    )
  }

  revalidatePath('/properties')
  revalidatePath('/admin/properties')
  redirect('/admin/properties')
}

export default async function NewPropertyPage() {
  const neighborhoods = await prisma.neighborhood.findMany({ orderBy: { name: 'asc' } })

  const fieldStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #E8E3DC',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    backgroundColor: '#fff',
    outline: 'none',
    color: 'var(--charcoal)',
    boxSizing: 'border-box' as const,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/properties" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)', textDecoration: 'none', marginBottom: '0.5rem' }}>
            <ArrowLeft size={13} /> Back to Properties
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>
            Add New Property
          </h1>
        </div>
      </div>

      <form action={createProperty}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Left column ─────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Basic Info */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Basic Information</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="field-label">Title *</label>
                  <input name="title" required style={fieldStyle} placeholder="12 Carolwood Drive" />
                </div>
                <div>
                  <label className="field-label">Slug (auto-generated if empty)</label>
                  <input name="slug" style={fieldStyle} placeholder="12-carolwood-drive" />
                </div>
                <div>
                  <label className="field-label">Description *</label>
                  <textarea name="description" required style={{ ...fieldStyle, minHeight: '160px', resize: 'vertical' }} placeholder="An extraordinary estate…" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Location</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Address *</label>
                  <input name="address" required style={fieldStyle} placeholder="12 Carolwood Drive" />
                </div>
                <div>
                  <label className="field-label">City *</label>
                  <input name="city" required style={fieldStyle} placeholder="Beverly Hills" />
                </div>
                <div>
                  <label className="field-label">State *</label>
                  <input name="state" required defaultValue="CA" style={fieldStyle} />
                </div>
                <div>
                  <label className="field-label">ZIP *</label>
                  <input name="zip" required style={fieldStyle} placeholder="90210" />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Price ($) *</label>
                  <input name="price" type="number" required style={fieldStyle} placeholder="4500000" />
                </div>
                <div>
                  <label className="field-label">Bedrooms *</label>
                  <input name="bedrooms" type="number" required style={fieldStyle} placeholder="5" />
                </div>
                <div>
                  <label className="field-label">Bathrooms *</label>
                  <input name="bathrooms" type="number" step="0.5" required style={fieldStyle} placeholder="6" />
                </div>
                <div>
                  <label className="field-label">Square Feet *</label>
                  <input name="squareFeet" type="number" required style={fieldStyle} placeholder="8500" />
                </div>
                <div>
                  <label className="field-label">Lot Size (acres)</label>
                  <input name="lotSize" type="number" step="0.01" style={fieldStyle} placeholder="0.75" />
                </div>
                <div>
                  <label className="field-label">Year Built</label>
                  <input name="yearBuilt" type="number" style={fieldStyle} placeholder="2005" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '0.5rem' }}>Images</h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--warm-gray)', marginBottom: '1rem' }}>
                Paste one image URL per line. The first URL will be the cover image.
              </p>
              <label className="field-label">Image URLs (one per line)</label>
              <textarea
                name="images"
                style={{ ...fieldStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.75rem' }}
                placeholder={`https://images.unsplash.com/photo-xxxx\nhttps://images.unsplash.com/photo-yyyy`}
              />
            </div>

            {/* Amenities */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '0.5rem' }}>Amenities</h3>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--warm-gray)', marginBottom: '1rem' }}>
                One feature per line.
              </p>
              <textarea
                name="amenities"
                style={{ ...fieldStyle, minHeight: '120px', resize: 'vertical' }}
                placeholder={`Home Theater\nWine Cellar\nPool & Spa\nSmart Home System`}
              />
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '80px' }}>

            {/* Status & Type */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Status & Type</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="field-label">Status</label>
                  <select name="status" defaultValue="FOR_SALE" style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option value="FOR_SALE">For Sale</option>
                    <option value="JUST_LISTED">Just Listed</option>
                    <option value="UNDER_CONTRACT">Under Contract</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Property Type</label>
                  <select name="propertyType" defaultValue="LUXURY_ESTATE" style={{ ...fieldStyle, cursor: 'pointer' }}>
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
                  <select name="representedAs" defaultValue="SELLERS_AGENT" style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option value="SELLERS_AGENT">Seller&apos;s Agent</option>
                    <option value="BUYERS_AGENT">Buyer&apos;s Agent</option>
                    <option value="DUAL_AGENT">Dual Agent</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Neighborhood</label>
                  <select name="neighborhoodId" defaultValue="" style={{ ...fieldStyle, cursor: 'pointer' }}>
                    <option value="">None</option>
                    {neighborhoods.map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Visibility</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                  <input type="checkbox" name="featured" value="true" style={{ accentColor: 'var(--gold)' }} />
                  Featured on homepage
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>
                  <input type="checkbox" name="signature" value="true" style={{ accentColor: 'var(--gold)' }} />
                  Signature listing
                </label>
              </div>
            </div>

            {/* Sold Info */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Sold Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="field-label">Sold Price ($)</label>
                  <input name="soldPrice" type="number" style={fieldStyle} placeholder="Optional" />
                </div>
                <div>
                  <label className="field-label">Sold Date</label>
                  <input name="soldDate" type="date" style={fieldStyle} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Property
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
