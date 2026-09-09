'use client'

import { useState } from 'react'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.875rem',
    border: '1px solid #E8E3DC',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.625rem',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#9B948E',
    marginBottom: '0.5rem',
  }

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>Settings</h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--warm-gray)', margin: '0.25rem 0 0' }}>
          Manage your website configuration
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Broker Profile */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, margin: '0 0 1.25rem' }}>Broker Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={fieldStyle} defaultValue="Alexandra Voss" />
            </div>
            <div>
              <label style={labelStyle}>Title</label>
              <input style={fieldStyle} defaultValue="Luxury Real Estate Advisor" />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={fieldStyle} defaultValue="+1 (310) 555-0192" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" style={fieldStyle} defaultValue="alexandra@alexandravoss.com" />
            </div>
            <div>
              <label style={labelStyle}>License Number</label>
              <input style={fieldStyle} defaultValue="CA DRE #01234567" />
            </div>
            <div>
              <label style={labelStyle}>Brokerage</label>
              <input style={fieldStyle} defaultValue="Voss Luxury Real Estate" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Bio (short)</label>
              <textarea rows={3} style={{ ...fieldStyle, resize: 'vertical' }} defaultValue="Beverly Hills luxury real estate advisor with $2.4B+ in career sales." />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, margin: '0 0 1.25rem' }}>Social &amp; Contact Links</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Instagram</label>
              <input style={fieldStyle} defaultValue="https://instagram.com/alexandravoss" />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn</label>
              <input style={fieldStyle} defaultValue="https://linkedin.com/in/alexandravoss" />
            </div>
            <div>
              <label style={labelStyle}>YouTube</label>
              <input style={fieldStyle} defaultValue="" placeholder="https://youtube.com/@..." />
            </div>
            <div>
              <label style={labelStyle}>Calendly / Booking URL</label>
              <input style={fieldStyle} defaultValue="" placeholder="https://calendly.com/..." />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #E8E3DC', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, margin: '0 0 1.25rem' }}>SEO &amp; Metadata</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Site Title</label>
              <input style={fieldStyle} defaultValue="Alexandra Voss | Luxury Real Estate Beverly Hills" />
            </div>
            <div>
              <label style={labelStyle}>Meta Description</label>
              <textarea rows={2} style={{ ...fieldStyle, resize: 'vertical' }} defaultValue="Beverly Hills luxury real estate advisor with $2.4B+ in career sales." />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="submit"
            className="btn-primary"
            style={{ minWidth: '160px' }}
          >
            Save Settings
          </button>
          {saved && (
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: '#2e7d32' }}>
              ✓ Settings saved
            </span>
          )}
        </div>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#9B948E', margin: 0 }}>
          Note: Connect a real database to persist settings changes across sessions.
        </p>
      </form>
    </div>
  )
}
