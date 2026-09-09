import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { formatDate } from '@/lib/utils'

async function deleteLead(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.lead.delete({ where: { id } })
  revalidatePath('/admin/leads')
}

async function updateLeadStatus(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as any
  await prisma.lead.update({ where: { id }, data: { status } })
  revalidatePath('/admin/leads')
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams
  const where: any = {}
  if (params.status) where.status = params.status

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } })

  const statusColors: Record<string, string> = {
    NEW: '#B8975A',
    CONTACTED: '#1565c0',
    QUALIFIED: '#2e7d32',
    CLOSED: '#6B6560',
    ARCHIVED: '#9B948E',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Leads</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: '0.25rem 0 0' }}>{leads.length} total</p>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { value: '', label: 'All' },
          { value: 'NEW', label: 'New' },
          { value: 'CONTACTED', label: 'Contacted' },
          { value: 'QUALIFIED', label: 'Qualified' },
          { value: 'CLOSED', label: 'Closed' },
          { value: 'ARCHIVED', label: 'Archived' },
        ].map((opt) => (
          <Link key={opt.value} href={opt.value ? `/admin/leads?status=${opt.value}` : '/admin/leads'} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.4rem 1rem', border: '1px solid', borderColor: (params.status ?? '') === opt.value ? 'var(--charcoal)' : 'var(--light-gray)', backgroundColor: (params.status ?? '') === opt.value ? 'var(--charcoal)' : 'transparent', color: (params.status ?? '') === opt.value ? 'var(--ivory)' : 'var(--warm-gray)', textDecoration: 'none' }}>
            {opt.label}
          </Link>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', overflow: 'auto' }}>
        {leads.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--warm-gray)' }}>
            <p>No leads found with this filter.</p>
          </div>
        ) : (
          <table className="admin-table" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Interest</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{lead.name}</div>
                    <a href={`mailto:${lead.email}`} style={{ fontSize: '0.75rem', color: 'var(--warm-gray)', textDecoration: 'none' }}>{lead.email}</a>
                    {lead.phone && <div style={{ fontSize: '0.75rem', color: 'var(--warm-gray)' }}>{lead.phone}</div>}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#f4f4f2', padding: '0.25rem 0.625rem', color: 'var(--charcoal)' }}>
                      {lead.interest}
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--warm-gray)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {lead.message || '—'}
                    </p>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: statusColors[lead.status] ?? 'var(--warm-gray)', backgroundColor: `${statusColors[lead.status] ?? '#9B948E'}15`, padding: '0.25rem 0.625rem' }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--warm-gray)', whiteSpace: 'nowrap' }}>
                    {formatDate(lead.createdAt)}
                  </td>
                  <td>
                    <form action={updateLeadStatus} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <input type="hidden" name="id" value={lead.id} />
                      <select name="status" defaultValue={lead.status} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', padding: '0.35rem 0.5rem', border: '1px solid #E8E3DC', backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CLOSED">Closed</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                      <button type="submit" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.35rem 0.625rem', border: '1px solid #E8E3DC', backgroundColor: '#fff', cursor: 'pointer', color: 'var(--charcoal)' }}>
                        Save
                      </button>
                    </form>
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
