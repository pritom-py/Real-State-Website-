'use client'

import { Bell } from 'lucide-react'

interface AdminHeaderProps {
  user?: { name?: string | null; email?: string | null } | null
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #E8E3DC', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 400, color: '#6B6560' }}>
        Admin Panel
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6560', padding: '4px', display: 'flex' }}>
          <Bell size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#B8975A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 600 }}>
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 500, color: '#1C1C1C' }}>{user?.name ?? 'Admin'}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', color: '#9B948E' }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
