import type { Metadata } from 'next'
import { ContactFormClient } from '@/components/forms/ContactForm'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Contact | Alexandra Voss Real Estate',
  description: 'Connect with Alexandra Voss to schedule a consultation or discuss your real estate goals. Beverly Hills luxury real estate advisor.',
}

export default async function ContactPage() {
  const broker = await prisma.brokerProfile.findFirst()

  return (
    <div style={{ paddingTop: '80px', backgroundColor: 'var(--ivory)', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--charcoal)', padding: '7rem 0 4rem' }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--gold-light)', marginBottom: '1rem' }}>Get in Touch</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--ivory)', margin: 0 }}>Contact Alexandra</h1>
        </div>
      </div>

      <div className="container-wide" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', alignItems: 'start' }}>
          {/* Contact info */}
          <div>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 300, marginBottom: '1rem' }}>
                Let's Begin the <em>Conversation</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', fontWeight: 300, color: 'var(--warm-gray)', lineHeight: 1.8 }}>
                Whether you're seeking representation to buy or sell, exploring your options, or simply curious about the market, I welcome the opportunity to speak with you directly.
              </p>
            </div>

            <div className="rule-h" style={{ marginBottom: '2rem' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Phone size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.3rem' }}>Phone</div>
                  <a href={`tel:${broker?.phone ?? '+13105550142'}`} className="link-gold" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem' }}>
                    {broker?.phone ?? '(310) 555-0142'}
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Mail size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.3rem' }}>Email</div>
                  <a href={`mailto:${broker?.email ?? 'alexandra@alexandravoss.com'}`} className="link-gold" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem' }}>
                    {broker?.email ?? 'alexandra@alexandravoss.com'}
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.3rem' }}>Office</div>
                  <address style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontStyle: 'normal', color: 'var(--charcoal)', lineHeight: 1.5 }}>
                    9601 Wilshire Blvd, Suite 300<br />Beverly Hills, CA 90210
                  </address>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: '0.3rem' }}>Availability</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', color: 'var(--charcoal)', lineHeight: 1.5 }}>
                    Available by appointment<br />Seven days a week
                  </div>
                </div>
              </div>
            </div>

            {broker?.licenseNumber && (
              <div style={{ marginTop: '2.5rem', padding: '1rem', backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--warm-gray)' }}>
                {broker.licenseNumber}
              </div>
            )}
          </div>

          {/* Form */}
          <div>
            <ContactFormClient />
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
