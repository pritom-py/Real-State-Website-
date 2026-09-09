'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface LeadsByStatus {
  status: string
  _count: { _all: number }
}

const STATUS_COLORS: Record<string, string> = {
  NEW: '#B8975A',
  CONTACTED: '#1565c0',
  QUALIFIED: '#2e7d32',
  CLOSED: '#6B6560',
  ARCHIVED: '#9B948E',
}

export function AdminCharts({ leadsByStatus }: { leadsByStatus: LeadsByStatus[] }) {
  const pieData = leadsByStatus.map((s) => ({
    name: s.status,
    value: s._count._all,
    fill: STATUS_COLORS[s.status] ?? '#9B948E',
  }))

  return (
    <>
      {/* Leads by status pie */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Leads by Status</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Leads']} />
              <Legend formatter={(v) => <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warm-gray)', fontSize: '0.875rem' }}>
            No lead data yet
          </div>
        )}
      </div>

      {/* Lead status bar */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 400, marginBottom: '1.25rem' }}>Lead Volume</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pieData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-sans)', fontSize: 11, fill: '#6B6560' }} />
              <YAxis tick={{ fontFamily: 'var(--font-sans)', fontSize: 11, fill: '#6B6560' }} />
              <Tooltip cursor={{ fill: 'rgba(184,151,90,0.08)' }} />
              <Bar dataKey="value" name="Leads" radius={[2, 2, 0, 0]}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warm-gray)', fontSize: '0.875rem' }}>
            No lead data yet
          </div>
        )}
      </div>
    </>
  )
}
