import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Building2, TrendingUp, Users, FileText, Star, DollarSign } from 'lucide-react'
import { AdminCharts } from '@/components/admin/AdminCharts'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
  const [
    totalProperties,
    activeListings,
    soldCount,
    totalLeads,
    newLeads,
    publishedInsights,
    featuredProperties,
    recentLeads,
    leadsByStatus,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: { not: 'SOLD' } } }),
    prisma.property.count({ where: { status: 'SOLD' } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.insight.count({ where: { status: 'PUBLISHED' } }),
    prisma.property.count({ where: { featured: true } }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.lead.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
  ])

  const statCards = [
    { label: 'Total Properties', value: totalProperties, icon: Building2, color: '#B8975A', href: '/admin/properties' },
    { label: 'Active Listings', value: activeListings, icon: TrendingUp, color: '#2e7d32', href: '/admin/properties' },
    { label: 'Sold Properties', value: soldCount, icon: DollarSign, color: '#6B6560', href: '/admin/properties?status=SOLD' },
    { label: 'Total Leads', value: totalLeads, icon: Users, color: '#1C1C1C', href: '/admin/leads' },
    { label: 'New Leads', value: newLeads, icon: Star, color: '#c0392b', href: '/admin/leads?status=NEW' },
    { label: 'Published Articles', value: publishedInsights, icon: FileText, color: '#1565c0', href: '/admin/insights' },
  ]

  const statusColors: Record<string, string> = {
    NEW: '#B8975A',
    CONTACTED: '#1565c0',
    QUALIFIED: '#2e7d32',
    CLOSED: '#6B6560',
    ARCHIVED: '#9B948E',
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', margin: 0 }}>Welcome back. Here's an overview of your website.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href} className="admin-stat-card" style={{ '--hover-color': card.color, display: 'block', textDecoration: 'none', backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem', transition: 'border-color 0.2s' } as React.CSSProperties}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9B948E', marginBottom: '0.75rem' }}>
                    {card.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1 }}>
                    {card.value}
                  </div>
                </div>
                <div style={{ width: '40px', height: '40px', backgroundColor: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} style={{ color: card.color }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <AdminCharts leadsByStatus={leadsByStatus} />
      </div>

      {/* Recent leads */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, margin: 0 }}>Recent Leads</h2>
          <Link href="/admin/leads" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Interest</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead) => (
              <tr key={lead.id}>
                <td style={{ fontWeight: 500 }}>{lead.name}</td>
                <td style={{ color: 'var(--warm-gray)' }}>{lead.email}</td>
                <td>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--charcoal)' }}>
                    {lead.interest}
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: statusColors[lead.status] ?? 'var(--warm-gray)', backgroundColor: `${statusColors[lead.status] ?? '#9B948E'}15`, padding: '0.25rem 0.625rem' }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ color: 'var(--warm-gray)', fontSize: '0.8125rem' }}>
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
