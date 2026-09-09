'use client'

import Link from 'next/link'

// Social media icons (lucide-react v1 removed brand icons — using custom SVGs)
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: 'var(--charcoal)', color: 'var(--ivory)' }}>
      {/* Top section */}
      <div className="container-wide" style={{ paddingTop: '5rem', paddingBottom: '4rem', borderBottom: '1px solid rgba(248,245,240,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--ivory)', marginBottom: '0.25rem' }}>
              Alexandra Voss
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Luxury Real Estate
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(248,245,240,0.6)', lineHeight: 1.8, maxWidth: '320px', marginBottom: '1.5rem' }}>
              Representing extraordinary properties and the discerning clients who acquire them. Beverly Hills · Bel-Air · Malibu · Pacific Palisades.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'rgba(248,245,240,0.5)', transition: 'color 0.3s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.5)')}>
                <InstagramIcon size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'rgba(248,245,240,0.5)', transition: 'color 0.3s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.5)')}>
                <LinkedinIcon size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'rgba(248,245,240,0.5)', transition: 'color 0.3s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.5)')}>
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Navigation
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/properties', label: 'Properties' },
                { href: '/sold', label: 'Sold Portfolio' },
                { href: '/about', label: 'About Alexandra' },
                { href: '/neighborhoods', label: 'Neighborhoods' },
                { href: '/insights', label: 'Market Insights' },
                { href: '/testimonials', label: 'Testimonials' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(248,245,240,0.6)', transition: 'color 0.3s', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.6)')}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(248,245,240,0.6)' }}>
              <a href="tel:+13105550142" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.6)')}>
                (310) 555-0142
              </a>
              <a href="mailto:alexandra@alexandravoss.com" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.6)')}>
                alexandra@alexandravoss.com
              </a>
              <span>9601 Wilshire Blvd, Suite 300<br />Beverly Hills, CA 90210</span>
              <span style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(248,245,240,0.4)' }}>CA DRE #01923847</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              Services
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/contact', label: 'Schedule Consultation' },
                { href: '/valuation', label: 'Home Valuation' },
                { href: '/properties', label: 'Search Properties' },
                { href: '/contact?type=buying', label: 'Buyer Representation' },
                { href: '/contact?type=selling', label: 'Seller Representation' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'rgba(248,245,240,0.6)', transition: 'color 0.3s', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.6)')}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-wide" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'rgba(248,245,240,0.4)', margin: 0 }}>
          © {currentYear} Alexandra Voss Real Estate. All rights reserved. CA DRE #01923847.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { href: '/contact', label: 'Privacy Policy' },
            { href: '/contact', label: 'Terms of Use' },
            { href: '/sitemap.xml', label: 'Sitemap' },
          ].map((link) => (
            <Link key={link.label} href={link.href} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'rgba(248,245,240,0.35)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.7)')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,245,240,0.35)')}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
