import type { Metadata } from 'next'
import { ValuationFormClient } from '@/components/forms/ValuationForm'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Home Valuation | Alexandra Voss Real Estate',
  description: 'Request a complimentary, confidential home valuation from Alexandra Voss. Understand what your Los Angeles property is worth in today\'s luxury market.',
}

const benefits = [
  'Comprehensive comparable market analysis',
  'Current buyer demand assessment for your area',
  'Pricing strategy recommendation',
  'Off-market buyer matching opportunities',
  'Timeline and process overview',
  'Completely confidential, no obligation',
]

export default function ValuationPage() {
  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', minHeight: '420px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=2000&q=85"
          alt="Home valuation"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '4rem', paddingTop: '9rem' }}>
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Complimentary Service</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: '#fff', margin: '0 0 1rem' }}>
            Request a Private<br /><em>Property Valuation</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', fontWeight: 300, color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: 0, lineHeight: 1.7 }}>
            Understand what your home is truly worth in today's luxury market — delivered with precision and absolute discretion.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', alignItems: 'start' }}>
          {/* Benefits */}
          <div>
            <div className="eyebrow" style={{ marginBottom: '0.75rem' }}>What You Receive</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '2rem' }}>
              A Thorough, Expert<br /><em>Market Analysis</em>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {benefits.map((b) => (
                <div key={b} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--charcoal)', color: 'var(--ivory)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 300, marginBottom: '0.5rem' }}>
                "Understanding value is the foundation of every successful real estate strategy."
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                — Alexandra Voss
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <ValuationFormClient />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1.4fr"] { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </div>
  )
}
