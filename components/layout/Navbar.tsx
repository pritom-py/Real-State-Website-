'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/properties', label: 'Properties' },
  { href: '/sold', label: 'Sold' },
  { href: '/about', label: 'About' },
  { href: '/neighborhoods', label: 'Neighborhoods' },
  { href: '/insights', label: 'Insights' },
  { href: '/testimonials', label: 'Testimonials' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const transparent = isHome && !scrolled && !mobileOpen

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
          backgroundColor: transparent ? 'transparent' : 'rgba(248, 245, 240, 0.96)',
          backdropFilter: transparent ? 'none' : 'blur(12px)',
          borderBottom: transparent ? '1px solid transparent' : '1px solid rgba(28, 28, 28, 0.08)',
        }}
      >
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400, letterSpacing: '0.02em', color: transparent ? '#fff' : 'var(--charcoal)', lineHeight: 1.1, transition: 'color 0.4s ease' }}>
              Alexandra Voss
              <span style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: transparent ? 'rgba(255,255,255,0.7)' : 'var(--gold)', marginTop: '2px', transition: 'color 0.4s ease' }}>
                Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="hide-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: transparent ? 'rgba(255,255,255,0.85)' : (pathname === link.href ? 'var(--charcoal)' : 'var(--warm-gray)'),
                  transition: 'color 0.3s ease',
                  textDecoration: 'none',
                  borderBottom: pathname === link.href ? '1px solid var(--gold)' : '1px solid transparent',
                  paddingBottom: '2px',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = transparent ? '#fff' : 'var(--charcoal)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = transparent ? 'rgba(255,255,255,0.85)' : (pathname === link.href ? 'var(--charcoal)' : 'var(--warm-gray)') }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/contact" className="btn-primary btn-sm hide-mobile" style={{ backgroundColor: transparent ? 'rgba(255,255,255,0.12)' : 'var(--charcoal)', borderColor: transparent ? 'rgba(255,255,255,0.4)' : 'var(--charcoal)', color: transparent ? '#fff' : 'var(--ivory)' }}>
              Schedule a Consultation
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="show-mobile-flex"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: transparent ? '#fff' : 'var(--charcoal)', display: 'none' }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, backgroundColor: 'var(--charcoal)', paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
          <nav style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--ivory)', padding: '0.75rem 0', borderBottom: '1px solid rgba(248,245,240,0.1)', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: '2rem' }}>
              <Link href="/contact" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                Schedule a Consultation
              </Link>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hide-mobile { display: none !important; }
          .show-mobile-flex { display: flex !important; }
        }
      `}</style>
    </>
  )
}
