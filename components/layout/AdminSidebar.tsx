'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Map,
  MessageSquare,
  FileText,
  Newspaper,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/admin/neighborhoods', label: 'Neighborhoods', icon: Map },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/insights', label: 'Insights', icon: FileText },
  { href: '/admin/media', label: 'Media & Press', icon: Newspaper },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '260px', backgroundColor: 'var(--charcoal)', color: 'var(--ivory)', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
      {/* Brand */}
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(248,245,240,0.08)' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--ivory)', marginBottom: '0.2rem' }}>Alexandra Voss</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>Admin Panel</div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--ivory)' : 'rgba(248,245,240,0.55)',
                backgroundColor: isActive ? 'rgba(184,151,90,0.12)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget.style.color = 'rgba(248,245,240,0.85)') }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget.style.color = 'rgba(248,245,240,0.55)') }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(248,245,240,0.08)' }}>
        <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(248,245,240,0.4)', textDecoration: 'none', marginBottom: '0.75rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.4)')}
        >
          ↗ View Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(248,245,240,0.4)', padding: 0, transition: 'color 0.2s', width: '100%' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.4)')}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
